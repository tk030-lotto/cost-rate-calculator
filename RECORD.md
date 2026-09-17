# プロジェクト活動記録: 原価率らくらく計算 (cost-rate-calculator)

## 2026-09-18 note記事テキストへのリンク・リポジトリ・ハッシュタグ追記
- `原価率の計算、もっと簡単に。.txt` の見出し直下に GitHub Pages 公開URL を追加
- 記事末尾に WebツールURL、GitHubリポジトリURL、およびハッシュタグ（#原価率 #原価計算 #粗利率 #個人開発 #Webツール #価格設定 #飲食）を追加
- Gitコミット & GitHubリモートプッシュ完了

## 2026-09-18 リポジトリのパブリック化 & GitHub Pages デプロイ完了
- リポジトリの可視性を `private` から `public` に変更
- リポジトリの About 欄を設定（Description, Website, Topics）
- GitHub Pages を有効化し、`main` ブランチの `/` から配信開始
  - 公開URL: https://tk030-lotto.github.io/cost-rate-calculator/
- `README.md` に公開URLを反映
- Gitコミット & GitHubリモートプッシュ完了

## 2026-08-30 紹介・解説記事テキストの追加
- `原価率の計算、もっと簡単に。.txt`（ツールの企画意図・利用メリット・note/X向け解説テキスト）を追加
- Gitコミット & GitHubリモートプッシュ完了

## 2026-08-30 note / X 兼用デモGIFアニメーション作成完了
- Playwright + Pillow による自律ブラウザ操作キャプチャ & 適応的減色GIF生成
- `demo.gif`（解像度 800x600, 6フレーム, 447.6 KB）を作成しプロジェクト直下に配置
- ハンバーグ定食初期表示、カフェラテプリセット切替、材料追加、価格クイック変更、クリップボードコピー（トースト通知）までの一連の操作フローを可視化
- `README.md` にプレビュー画像を追記
- Gitコミット & GitHubリモートプッシュ完了

## 2026-08-30 エッジケース検証 & コードレビューレポート追加
- `test_edge_cases.js`: ゼロ除算・極端な値・小数値・単位変換・丸め等 全40件のエッジケース単体テストを追加・合格
- `audit_report_20260830.md`: コードレビュー & 改善レポートを追加
- `js/calculator.js`: 逆算価格のゼロ販売価格時の安全ガード処理を追加

## 2026-08-30 AI開発コンテキスト管理MCP & V3 & 共通CLI による品質監査完了
- 「AI開発コンテキスト管理MCPツール」「AIコンテキスト管理ツールV3」「AI開発共通CLI (`ai-dev-cli`)」による横断的品質監査を実施
- 仕様書全17章とのトレーサビリティ突合（17/17項目適合）、Zero-Dependency、セキュリティ、アクセシビリティ、UI/UXデザイン標準の全9カテゴリを検証
- `ai-dev doctor all` (20/20 PASS), `ai-dev sync status` (20/20 PASS), `ai-dev context stats` (16/16 PASS), `ai-dev skill check` (9/9 PASS)
- 単体テスト全25件 PASS
- 総合受入判定: **PASS（合格 / 100点）**
- `audit_report.md` を作成し、プロジェクト直下および各種情報フォルダ（`Projects/原価率らくらく計算/`）に永続保存
- Gitコミット & GitHubリモートプッシュ完了

## 2026-08-30 Webアプリケーション実装 (V1)
- 「原価率らくらく計算」Webアプリケーションを新規実装
- プロトコル第16条（Zero-Dependency First）および第18条（UI/UXデザイン標準）に準拠した Vanilla HTML5 / CSS3 / JavaScript スタックで構築
- プロトコル第17条（300行以内への自律分割）に基づき、各モジュール（`units.js`, `calculator.js`, `storage.js`, `render.js`, `app.js`, `base.css`, `components.css`）へ適切に分割
- 主な機能:
  - 複数材料の動的入力（使用量・単位・仕入量・仕入単位・仕入価格から材料原価を自動計算）
  - 単位変換エンジン（g/kg, ml/L, 個 等の自動正規化）
  - 商品原価合計・原価率・粗利益・粗利益率のリアルタイム計算
  - 目標原価率からの必要販売価格の逆算シミュレーション
  - プリセット呼び出し（ハンバーグ定食、カフェラテ、ケーキ、布小物等）
  - 見積・レシピ形式でのクリップボード一括コピー機能
  - LocalStorage による自動復元
- 単体テストスイート `test_calculator.js` を作成し、全25件のテストケース（仕様書記載例含む）に100%合格

## 2026-08-30 初期セットアップ
- GitHubプライベートリポジトリ作成（リポジトリ名: `cost-rate-calculator`）
- 各種情報フォルダからのルール一括同期（`.cursorrules`, `.clauderules`, `.clinerules`, `.roorules`, `SKILLS.md`, `.github/copilot-instructions.md`, `.agents/AGENTS.md`, `.agents/mcp_config.json`, `.agents/agents/*`, `knowledge/*.md`, `.gitignore`, `AI_RULES.md`）
- `README.md` / `仕様書.md` / `LICENSE` の登録、初期コミット・GitHubプッシュ完了
- プロジェクト直下および各種情報フォルダに `RECORD.md` を配置
