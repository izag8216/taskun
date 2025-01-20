# タスくん (Taskun)

シンプルで直感的なタスク管理アプリケーション。必要な機能だけを、必要なだけ。

## 機能

- タスクの追加・編集・削除
- タスクの完了状態管理
- 優先度の設定
- 期限日の設定
- モダンでレスポンシブなUI
- ローカルストレージによるデータ永続化

## 技術スタック

- フロントエンド
  - HTML5
  - CSS3
  - JavaScript (Vanilla)
- バックエンド
  - SQLite3（予定）
- デプロイ
  - XServer VPS（予定）

## 開発環境のセットアップ

1. リポジトリのクローン

```bash
git clone [repository-url]
cd taskun
```

2. ローカルサーバーの起動

```bash
# Pythonの組み込みサーバーを使用する場合
python3 -m http.server 3000
```

3. ブラウザでアクセス

```
http://localhost:3000
```

## プロジェクト構造

```
taskun/
├── index.html      # メインのHTML
├── css/
│   └── style.css   # スタイル定義
├── js/
│   └── app.js      # JavaScript機能
└── db/
    └── schema.sql  # SQLiteスキーマ
```

## 貢献

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

[MIT License](LICENSE)

## 作者

[Your Name]
