-- タスクテーブルの作成
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATETIME,
    priority INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- 初期データの挿入（テスト用）
INSERT INTO tasks (title, description, priority) VALUES
    ('タスくんへようこそ！', 'これは最初のタスクです。編集や削除ができます。', 1),
    ('タスクを追加してみましょう', '右上の「＋」ボタンをクリックしてタスクを追加できます。', 0); 