// DOM Elements
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const priorityInput = document.getElementById('priorityInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const editModal = document.getElementById('editModal');
const editTaskInput = document.getElementById('editTaskInput');
const editDueDateInput = document.getElementById('editDueDateInput');
const editPriorityInput = document.getElementById('editPriorityInput');
const saveTaskButton = document.getElementById('saveTaskButton');
const cancelEditButton = document.getElementById('cancelEditButton');

// Set today's date as the default value for date inputs
const today = new Date().toISOString().split('T')[0];
dueDateInput.value = today;
editDueDateInput.value = today;

let currentEditingTaskId = null;

// Task Management Functions
async function loadTasks() {
    try {
        console.log('タスク一覧を取得します...');
        const response = await fetch('/api/tasks');
        console.log('APIレスポンス:', response);
        if (!response.ok) throw new Error('タスクの取得に失敗しました');
        
        const tasks = await response.json();
        console.log('取得したタスク:', tasks);
        
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = createTaskElement(task);
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('タスクの取得中にエラーが発生しました');
    }
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    
    const title = document.createElement('div');
    title.className = 'task-title';
    if (task.completed) {
        title.classList.add('completed');
    }
    title.textContent = task.title;
    
    const dueDate = document.createElement('div');
    dueDate.className = 'task-due-date';
    dueDate.textContent = task.due_date || '期限なし';
    
    const priority = document.createElement('div');
    priority.className = `task-priority priority-${task.priority}`;
    priority.textContent = getPriorityText(task.priority);
    
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    
    const completeButton = document.createElement('button');
    completeButton.className = 'complete-button';
    completeButton.textContent = task.completed ? '完了済' : '完了';
    if (task.completed) {
        completeButton.classList.add('completed');
    }
    completeButton.onclick = () => toggleTaskCompletion(task.id, !task.completed);
    
    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = '編集';
    editButton.onclick = () => openEditModal(task);
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '削除';
    deleteButton.onclick = () => deleteTask(task.id);
    
    actions.appendChild(completeButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    
    li.appendChild(title);
    li.appendChild(dueDate);
    li.appendChild(priority);
    li.appendChild(actions);
    
    return li;
}

function getPriorityText(priority) {
    const priorityMap = {
        'low': '低',
        'medium': '中',
        'high': '高'
    };
    return priorityMap[priority] || '中';
}

async function addTask() {
    const title = taskInput.value.trim();
    if (!title) return;

    try {
        console.log('タスクを追加します...');
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                due_date: dueDateInput.value,
                priority: priorityInput.value,
                completed: false
            }),
        });

        if (!response.ok) throw new Error('タスクの追加に失敗しました');
        
        console.log('タスクが追加されました');
        taskInput.value = '';
        dueDateInput.value = today;
        priorityInput.value = 'medium';
        
        await loadTasks();
    } catch (error) {
        console.error('Error:', error);
        alert('タスクの追加中にエラーが発生しました');
    }
}

async function updateTask() {
    if (!currentEditingTaskId) return;

    try {
        console.log('タスクを更新します...');
        const response = await fetch(`/api/tasks/${currentEditingTaskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: editTaskInput.value.trim(),
                due_date: editDueDateInput.value,
                priority: editPriorityInput.value
            }),
        });

        if (!response.ok) throw new Error('タスクの更新に失敗しました');
        
        console.log('タスクが更新されました');
        closeEditModal();
        await loadTasks();
    } catch (error) {
        console.error('Error:', error);
        alert('タスクの更新中にエラーが発生しました');
    }
}

async function toggleTaskCompletion(taskId, completed) {
    try {
        console.log(`タスクの完了状態を更新します: ID=${taskId}, completed=${completed}`);
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: completed })
        });

        if (!response.ok) throw new Error('タスクの更新に失敗しました');
        
        console.log('タスクの完了状態が更新されました');
        await loadTasks();
    } catch (error) {
        console.error('Error:', error);
        alert('タスクの更新中にエラーが発生しました');
    }
}

async function deleteTask(taskId) {
    if (!confirm('このタスクを削除してもよろしいですか？')) return;

    try {
        console.log('タスクを削除します...');
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('タスクの削除に失敗しました');
        
        console.log('タスクが削除されました');
        await loadTasks();
    } catch (error) {
        console.error('Error:', error);
        alert('タスクの削除中にエラーが発生しました');
    }
}

// Modal Functions
function openEditModal(task) {
    currentEditingTaskId = task.id;
    editTaskInput.value = task.title;
    editDueDateInput.value = task.due_date || today;
    editPriorityInput.value = task.priority || 'medium';
    editModal.style.display = 'block';
}

function closeEditModal() {
    currentEditingTaskId = null;
    editModal.style.display = 'none';
}

// Event Listeners
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

saveTaskButton.addEventListener('click', updateTask);
cancelEditButton.addEventListener('click', closeEditModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeEditModal();
    }
});

// Initial load
loadTasks(); 