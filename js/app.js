// DOM要素の取得
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const cancelBtn = document.querySelector('.cancel-btn');
const modalTitle = document.querySelector('.modal-content h2');

// ローカルストレージのキー
const STORAGE_KEY = 'taskun_tasks';

// 日付フォーマット用オプション
const DATE_OPTIONS = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
};

// タスクデータを管理するクラス
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        // 初期タスクを削除
        const initialTaskTitles = ['タスくんへようこそ！', 'タスクを追加してみましょう'];
        const hasInitialTasks = this.tasks.some(task => initialTaskTitles.includes(task.title));
        
        if (hasInitialTasks) {
            this.tasks = this.tasks.filter(task => !initialTaskTitles.includes(task.title));
            this.saveToLocalStorage();
        }
    }

    // タスクの保存
    saveToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    }

    // 新しいタスクの追加
    addTask(title, description, priority = 0) {
        const newTask = {
            id: this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1,
            title,
            description,
            priority,
            completed: false,
            created_at: new Date().toISOString()
        };
        this.tasks.push(newTask);
        this.saveToLocalStorage();
        return newTask;
    }

    // タスクの更新
    updateTask(id, updates) {
        const taskIndex = this.tasks.findIndex(t => t.id === parseInt(id));
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // タスクの削除
    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(t => t.id === parseInt(id));
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // 全タスクの取得
    getAllTasks() {
        return this.tasks;
    }
}

// タスクマネージャーのインスタンス作成
const taskManager = new TaskManager();

// モーダルの表示/非表示
function toggleModal(show = true) {
    taskModal.style.display = show ? 'block' : 'none';
    if (show) {
        document.getElementById('taskTitle').focus();
    } else {
        taskForm.reset();
        taskForm.dataset.editId = '';
        modalTitle.textContent = 'タスクを追加';
    }
}

// 日付のフォーマット
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', DATE_OPTIONS);
}

// タスクの追加
function addTask(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskElement.dataset.id = task.id;

    const priorityClass = `priority-${task.priority}`;
    
    taskElement.innerHTML = `
        <div class="task-content">
            <div class="task-header">
                <span class="priority ${priorityClass}"></span>
                <h3 class="task-title">${task.title}</h3>
            </div>
            <p class="task-description">${task.description || ''}</p>
            ${task.due_date ? `<div class="task-due-date">期限: ${formatDate(task.due_date)}</div>` : ''}
        </div>
        <div class="task-actions">
            <button class="btn-complete" onclick="toggleComplete('${task.id}')">
                ${task.completed ? '✓' : '○'}
            </button>
            <button class="btn-edit" onclick="editTask('${task.id}')">
                編集
            </button>
            <button class="btn-delete" onclick="deleteTask('${task.id}')">
                削除
            </button>
        </div>
    `;

    taskList.appendChild(taskElement);
}

// タスクの保存
function saveTask(event) {
    event.preventDefault();
    
    const tasks = taskManager.getAllTasks();
    const taskData = {
        id: Date.now().toString(), // 単純なユニークID
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        due_date: document.getElementById('taskDueDate').value,
        priority: document.getElementById('taskPriority').value,
        completed: false,
        created_at: new Date().toISOString()
    };

    tasks.push(taskData);
    taskManager.saveToLocalStorage();
    addTask(taskData);
    
    toggleModal(false);
    taskForm.reset();
}

// タスクの削除
function deleteTask(taskId) {
    if (!confirm('このタスクを削除してもよろしいですか？')) return;

    const tasks = taskManager.getAllTasks().filter(task => task.id !== taskId);
    taskManager.saveToLocalStorage();
    
    const taskElement = document.querySelector(`[data-id="${taskId}"]`);
    taskElement.remove();
}

// タスクの完了状態の切り替え
function toggleComplete(taskId) {
    const task = taskManager.getAllTasks().find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        taskManager.updateTask(taskId, { completed: task.completed });
        
        const taskElement = document.querySelector(`[data-id="${taskId}"]`);
        if (taskElement) {
            taskElement.classList.toggle('completed');
            const completeBtn = taskElement.querySelector('.btn-complete');
            completeBtn.textContent = task.completed ? '✓' : '○';
        }
    }
}

// タスクの編集
function editTask(taskId) {
    const task = taskManager.getAllTasks().find(t => t.id === taskId);
    if (task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskDueDate').value = task.due_date || '';
        document.getElementById('taskPriority').value = task.priority;

        // 編集モード用にフォームを設定
        taskForm.dataset.editId = taskId;
        document.querySelector('.modal-content h2').textContent = 'タスクを編集';
        
        toggleModal(true);
    }
}

// イベントリスナーの設定
addTaskBtn.addEventListener('click', () => {
    taskForm.reset();
    taskForm.dataset.editId = '';
    document.querySelector('.modal-content h2').textContent = 'タスクを追加';
    toggleModal(true);
});

cancelBtn.addEventListener('click', () => toggleModal(false));

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const editId = taskForm.dataset.editId;
    
    if (editId) {
        // 編集モード
        const tasks = taskManager.getAllTasks();
        const task = tasks.find(t => t.id === editId);
        if (task) {
            task.title = document.getElementById('taskTitle').value;
            task.description = document.getElementById('taskDescription').value;
            task.due_date = document.getElementById('taskDueDate').value;
            task.priority = document.getElementById('taskPriority').value;
            
            taskManager.saveToLocalStorage();
            
            // UIを更新
            const taskElement = document.querySelector(`[data-id="${editId}"]`);
            taskElement.remove();
            addTask(task);
        }
    } else {
        // 新規追加モード
        saveTask(event);
    }
    
    toggleModal(false);
});

// DOMが読み込まれた後の処理
document.addEventListener('DOMContentLoaded', () => {
    // フィーチャーセクションの追加
    const mainElement = document.querySelector('main');
    const featuresSection = document.createElement('section');
    featuresSection.className = 'features';
    featuresSection.innerHTML = `
        <div class="feature-card">
            <div class="feature-icon">👋</div>
            <h3 class="feature-title">タスくんへようこそ！</h3>
            <p class="feature-description">シンプルで使いやすいタスク管理ツールです。必要な機能だけを、必要なだけ。</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">✨</div>
            <h3 class="feature-title">さっそく始めましょう</h3>
            <p class="feature-description">上の「＋」ボタンをクリックして、最初のタスクを追加してみましょう。</p>
        </div>
    `;
    
    // フィーチャーセクションをタスクリストの前に挿入
    mainElement.insertBefore(featuresSection, taskList);

    // 既存のタスクを表示
    const tasks = taskManager.getAllTasks();
    tasks.forEach(addTask);
}); 