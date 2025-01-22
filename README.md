# タスくん (Taskun)

シンプルで直感的なタスク管理ツール。必要な機能だけを、必要なだけ。

## 機能

- タスクの追加・編集・削除
- 期限の設定
- 優先度の管理（高・中・低）
- タスクの完了管理
- レスポンシブデザイン

## 技術スタック

- **フロントエンド**

  - HTML5
  - CSS3
  - JavaScript (Vanilla)

- **バックエンド**
  - Python 3.8+
  - Flask
  - SQLite3

## セットアップ

1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/taskun.git
cd taskun
```

2. Pythonの依存関係をインストール

```bash
pip install -r requirements.txt
```

3. データベースの初期化

```bash
sqlite3 db/tasks.db < db/schema.sql
```

4. アプリケーションの起動

```bash
python app.py
```

5. ブラウザでアクセス

```
http://localhost:5000
```

## プロジェクト構造

```
taskun/
├── app.py              # Flaskアプリケーション
├── index.html         # メインページ
├── css/
│   └── style.css     # スタイルシート
├── js/
│   └── app.js        # フロントエンドロジック
└── db/
    └── schema.sql    # データベーススキーマ
```

## デプロイ

1. サーバー環境の準備
2. 必要なパッケージのインストール
3. データベースの初期化
4. サービスの設定と起動

詳細な手順は各サーバー環境に応じて調整してください。

## ライセンス

MIT License

## 作者

Itomaru

## 謝辞

このプロジェクトは、XServer VPSを使用した実践的な学習の一環として作成されました。
