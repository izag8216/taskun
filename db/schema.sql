-- タスクテーブルの作成
DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    due_date TEXT,
    priority TEXT CHECK(priority IN ('low', 'medium', 'high')),
    completed BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- 初期データの挿入
INSERT INTO tasks (title, due_date, priority, completed) VALUES 
('サンプルタスク1', '2024-01-25', 'medium', 0),
('サンプルタスク2', '2024-01-26', 'high', 0); 