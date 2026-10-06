/**
 * @file test_calculator.js
 * @description 計算ロジック・単位変換・仕様書記載例の自動検証スクリプト
 */

const units = require('./js/units.js');
const calc = require('./js/calculator.js');
const storage = require('./js/storage.js');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✅ PASS: ${message}`);
        passed++;
    } else {
        console.error(`❌ FAIL: ${message}`);
        failed++;
    }
}

function assertClose(actual, expected, tolerance = 0.01, message) {
    const diff = Math.abs(actual - expected);
    if (diff <= tolerance) {
        console.log(`✅ PASS: ${message} (Actual: ${actual}, Expected: ${expected})`);
        passed++;
    } else {
        console.error(`❌ FAIL: ${message} (Actual: ${actual}, Expected: ${expected}, Diff: ${diff})`);
        failed++;
    }
}

console.log('=== 1. 単位変換テスト ===');
assert(units.areUnitsCompatible('g', 'kg') === true, 'g と kg は互換性あり');
assert(units.areUnitsCompatible('ml', 'L') === true, 'ml と L は互換性あり');
assert(units.areUnitsCompatible('g', 'L') === false, 'g と L は互換性なし');
assert(units.convertUnit(150, 'g', 'kg') === 0.15, '150g -> 0.15kg');
assert(units.convertUnit(2, 'L', 'ml') === 2000, '2L -> 2000ml');

console.log('\n=== 2. 材料原価計算テスト (仕様書記載例) ===');
// 仕様書: ひき肉 150g, 仕入 1kg / 1,200円 -> 180円
const m1 = units.calculateMaterialCost(150, 'g', 1, 'kg', 1200);
assert(m1.isValid === true, 'ひき肉計算有効');
assertClose(m1.cost, 180, 0.001, 'ひき肉原価 = 180円');

// 仕様書: 玉ねぎ 50g, 仕入 1kg / 200円 -> 10円
const m2 = units.calculateMaterialCost(50, 'g', 1, 'kg', 200);
assert(m2.isValid === true, '玉ねぎ計算有効');
assertClose(m2.cost, 10, 0.001, '玉ねぎ原価 = 10円');

// 仕様書: 卵 1個, 仕入 1個 / 25円 -> 25円
const m3 = units.calculateMaterialCost(1, '個', 1, '個', 25);
assert(m3.isValid === true, '卵計算有効');
assertClose(m3.cost, 25, 0.001, '卵原価 = 25円');

console.log('\n=== 3. 商品原価・原価率・粗利テスト (仕様書記載例) ===');
// 仕様書: 商品原価 280円, 販売価格 1,000円
// 原価率: 28.0%, 粗利: 720円, 粗利率: 72.0%
const summary1 = calc.calculateCostSummary({
    materials: [
        { id: '1', name: '材料A', usageAmount: 1, usageUnit: '個', purchaseAmount: 1, purchaseUnit: '個', purchasePrice: 280 }
    ],
    sellingPrice: 1000,
    targetCostRate: 30
});
assertClose(summary1.totalCost, 280, 0.001, '商品原価 280円');
assertClose(summary1.costRate, 28.0, 0.001, '原価率 28.0%');
assertClose(summary1.grossProfit, 720, 0.001, '粗利 720円');
assertClose(summary1.grossProfitRate, 72.0, 0.001, '粗利率 72.0%');
// 目標原価率 30% 逆算: 280 ÷ 0.3 = 933.33... -> 933円
assertClose(summary1.targetSellingPrice, 933, 1, '目標逆算販売価格 約933〜934円 (Round: 933)');

console.log('\n=== 4. 複数材料集計テスト (仕様書セクション11例) ===');
// ひき肉 180 + 玉ねぎ 10 + 卵 25 = 215円
// 販売価格 980円 -> 原価率 21.9%, 粗利 765円, 粗利率 78.1%
const summary2 = calc.calculateCostSummary({
    materials: [
        { id: '1', name: 'ひき肉', usageAmount: 150, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1200 },
        { id: '2', name: '玉ねぎ', usageAmount: 50, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 200 },
        { id: '3', name: '卵', usageAmount: 1, usageUnit: '個', purchaseAmount: 1, purchaseUnit: '個', purchasePrice: 25 }
    ],
    sellingPrice: 980
});
assertClose(summary2.totalCost, 215, 0.001, '合計商品原価 215円');
assertClose(summary2.costRate, 21.938, 0.1, '原価率 21.9%');
assertClose(summary2.grossProfit, 765, 0.001, '粗利 765円');
assertClose(summary2.grossProfitRate, 78.06, 0.1, '粗利率 78.1%');

console.log('\n=== 5. エラーハンドリング・境界値テスト ===');
const invalidResult = units.calculateMaterialCost(-10, 'g', 1, 'kg', 1000);
assert(invalidResult.isValid === false, 'マイナス使用量は無効判定');

const incompatibleResult = units.calculateMaterialCost(100, 'g', 1, 'L', 1000);
assert(incompatibleResult.isValid === false, 'g と L は無効判定');

console.log('\n=== 6. テキストフォーマット出力テスト ===');
const formattedText = storage.formatResultAsText({
    productName: '仕様書テスト定食',
    summary: summary2
});
assert(formattedText.includes('【原価率・粗利 計算書】'), 'タイトルヘッダー確認');
assert(formattedText.includes('合計商品原価 : ¥215'), '合計原価フォーマット確認');
assert(formattedText.includes('原価率       : 21.9%'), '原価率フォーマット確認');

console.log(`\n========================================`);
console.log(`テスト完了: PASS ${passed}件 / FAIL ${failed}件`);
if (failed > 0) process.exit(1);
