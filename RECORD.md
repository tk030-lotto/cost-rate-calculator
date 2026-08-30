# プロジェクト活動記録: 原価率らくらく計算 (cost-rate-calculator)

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
