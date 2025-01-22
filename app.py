from flask import Flask, request, jsonify, g
import sqlite3
import os
import logging
from datetime import datetime

# 静的ファイルのパスを設定
static_folder = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_url_path='', static_folder=static_folder)

# ログ設定
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# データベースの初期化
def init_db():
    try:
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db', 'tasks.db')
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        logger.debug(f'データベースパス: {db_path}')
        
        with sqlite3.connect(db_path) as conn:
            with open(os.path.join(os.path.dirname(db_path), 'schema.sql'), 'r') as f:
                conn.executescript(f.read())
            logger.info('データベースの初期化が完了しました')
    except Exception as e:
        logger.error(f'データベースの初期化中にエラーが発生しました: {str(e)}')
        raise

# データベース接続
def get_db():
    if 'db' not in g:
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db', 'tasks.db')
        g.db = sqlite3.connect(db_path)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(error):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# タスク一覧の取得
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        logger.debug('タスク一覧を取得します')
        db = get_db()
        tasks = db.execute('SELECT * FROM tasks ORDER BY due_date ASC').fetchall()
        logger.debug(f'取得したタスク: {tasks}')
        return jsonify([{
            'id': task['id'],
            'title': task['title'],
            'due_date': task['due_date'],
            'priority': task['priority'],
            'completed': bool(task['completed']),
            'created_at': task['created_at']
        } for task in tasks])
    except Exception as e:
        logger.error(f'タスク一覧の取得中にエラーが発生しました: {str(e)}')
        return jsonify({"error": str(e)}), 500

# タスクの追加
@app.route('/api/tasks', methods=['POST'])
def add_task():
    try:
        logger.debug(f'リクエストデータ: {request.get_json()}')
        if not request.is_json:
            logger.error('Content-Type must be application/json')
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        data = request.get_json()
        if 'title' not in data:
            logger.error('title is required')
            return jsonify({"error": "title is required"}), 400

        db = get_db()
        c = db.cursor()
        c.execute(
            'INSERT INTO tasks (title, due_date, priority, completed) VALUES (?, ?, ?, ?)',
            (data['title'], 
             data.get('due_date'), 
             data.get('priority', 'medium'),
             data.get('completed', 0))
        )
        task_id = c.lastrowid
        db.commit()
        
        # 追加したタスクを取得
        task = db.execute('SELECT * FROM tasks WHERE id = ?', (task_id,)).fetchone()
        
        response_data = {
            'id': task['id'],
            'title': task['title'],
            'due_date': task['due_date'],
            'priority': task['priority'],
            'completed': bool(task['completed']),
            'created_at': task['created_at']
        }
        
        logger.info(f'タスクを追加しました: {response_data}')
        return jsonify(response_data), 201
    except Exception as e:
        logger.error(f'タスクの追加中にエラーが発生しました: {str(e)}')
        return jsonify({"error": str(e)}), 500

# タスクの更新
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        logger.debug(f'タスクを更新します: ID={task_id}')
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400

        data = request.get_json()
        db = get_db()
        
        # 更新するフィールドを動的に構築
        update_fields = []
        params = []
        if 'title' in data:
            update_fields.append('title = ?')
            params.append(data['title'])
        if 'due_date' in data:
            update_fields.append('due_date = ?')
            params.append(data['due_date'])
        if 'priority' in data:
            update_fields.append('priority = ?')
            params.append(data['priority'])
        if 'completed' in data:
            update_fields.append('completed = ?')
            params.append(1 if data['completed'] else 0)
        
        params.append(task_id)
        
        query = f"UPDATE tasks SET {', '.join(update_fields)} WHERE id = ?"
        db.execute(query, params)
        db.commit()
        
        # 更新後のタスクを取得
        task = db.execute('SELECT * FROM tasks WHERE id = ?', (task_id,)).fetchone()
        
        if task is None:
            return jsonify({"error": "Task not found"}), 404
            
        response_data = {
            'id': task['id'],
            'title': task['title'],
            'due_date': task['due_date'],
            'priority': task['priority'],
            'completed': bool(task['completed']),
            'created_at': task['created_at']
        }
        
        logger.info(f'タスクを更新しました: {response_data}')
        return jsonify(response_data)
    except Exception as e:
        logger.error(f'タスクの更新中にエラーが発生しました: {str(e)}')
        return jsonify({"error": str(e)}), 500

# タスクの削除
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        logger.debug(f'タスクを削除します: ID={task_id}')
        db = get_db()
        db.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
        db.commit()
        logger.info(f'タスクを削除しました: ID={task_id}')
        return '', 204
    except Exception as e:
        logger.error(f'タスクの削除中にエラーが発生しました: {str(e)}')
        return jsonify({"error": str(e)}), 500

# 静的ファイルの提供
@app.route('/')
def index():
    return app.send_static_file('index.html')

# データベースを初期化
init_db()

if __name__ == '__main__':
    app.run(debug=True) 