/**
 * @file test_edge_cases.js
 * @description エッジケース・境界値・異常系の自動検証スクリプト
 * 2026/08/30: コードレビュー結果に基づく改善
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

console.log('=== A. ゼロ除算・境界値テスト ===');

const zeroPriceResult = calc.calculateCostSummary({
    materials: [{ id: '1', usageAmount: 100, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 }],
    sellingPrice: 0,
    targetCostRate: 30
});
assert(zeroPriceResult.costRate === 0, '販売価格0円の原価率は0');
assert(zeroPriceResult.grossProfit === 0, '販売価格0円の粗利は0');
assert(zeroPriceResult.targetSellingPrice === null, '販売価格0円の逆算価格はnull');

const zeroCostResult = calc.calculateCostSummary({
    materials: [{ id: '1', usageAmount: 0, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 }],
    sellingPrice: 1000,
    targetCostRate: 30
});
assert(zeroCostResult.costRate === 0, '使用量0の原価率は0');
assert(zeroCostResult.targetSellingPrice === null, '原価0の逆算価格はnull (0除算回避)');

console.log('\n=== B. 極端な値テスト ===');

const largeValueResult = calc.calculateCostSummary({
    materials: [{ id: '1', usageAmount: 1000, usageUnit: 'kg', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000000 }],
    sellingPrice: 1000000000
});
assertClose(largeValueResult.totalCost, 1000000000, 1, '大規模原価計算 (1000kg * 1,000,000円)');
assertClose(largeValueResult.costRate, 100, 0.01, '大規模販売時の原価率 (1000倍 = 100%)');

console.log('\n=== C. 小数値テスト ===');

const decimalResult = calc.calculateCostSummary({
    materials: [{ id: '1', usageAmount: 0.5, usageUnit: 'kg', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 }],
    sellingPrice: 1000,
    targetCostRate: 25
});
assertClose(decimalResult.totalCost, 500, 0.001, '小数使用量の計算 (0.5kg * 1000円)');
assertClose(decimalResult.costRate, 50, 0.01, '小数使用量の原価率');

console.log('\n=== D. NaN/未定義値テスト ===');

const nanResult = calc.calculateCostSummary({
    materials: [],
    sellingPrice: NaN,
    targetCostRate: undefined
});
assert(nanResult.sellingPrice === 0, 'NaN販売価格は0として処理');
assert(nanResult.targetCostRate === null, 'undefined目標率はnullとして処理');

console.log('\n=== E. 無効な目標原価率テスト ===');

const invalidTargetResult = calc.calculateCostSummary({
    materials: [{ id: '1', usageAmount: 100, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 }],
    sellingPrice: 1000,
    targetCostRate: 0
});
assert(invalidTargetResult.targetCostRate === null, '目標原価率0はnullとして処理');
assert(invalidTargetResult.targetSellingPrice === null, '目標原価率0の逆算価格はnull');

const over100Result = calc.calculateCostSummary({
    materials: [{ id: '1', usageAmount: 100, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 }],
    sellingPrice: 1000,
    targetCostRate: 150
});
assert(over100Result.targetCostRate === null, '目標原価率150%はnullとして処理 (100%超)');

console.log('\n=== F. 単位変換詳細テスト ===');

// 7-7. 単位変換詳細テスト
assert(units.areUnitsCompatible('cc', 'ml') === true, 'cc と ml は互換性あり (同系統)');
assert(units.areUnitsCompatible('L', 'l') === true, 'L と l は同じ容量系');
assert(units.convertUnit(1, 'L', 'l') === 1, 'L -> l 変換 (1:1 同値)');
assert(units.convertUnit(500, 'ml', 'L') === 0.5, 'ml -> L 変換 (0.001倍)');
assert(units.convertUnit(100, 'g', 'kg') === 0.1, 'g -> kg 変換 (0.001倍)');
assert(units.convertUnit(5, 'kg', 'g') === 5000, 'kg -> g 変換 (1000倍)');

// 7-8. 未知の単位
const unknownUnitResult = units.calculateMaterialCost(100, 'xyz', 1, 'kg', 1000);
assert(unknownUnitResult.isValid === false, '未知の使用単位はエラー');

// 7-9. applyRounding テスト
assert(calc.applyRounding(933.33, 'round') === 933, '四捨五入: 933.33 -> 933');
assert(calc.applyRounding(933.5, 'round') === 934, '四捨五入: 933.5 -> 934');
assert(calc.applyRounding(933.33, 'ceil') === 934, '天井関数: 933.33 -> 934');
assert(calc.applyRounding(933.99, 'floor') === 933, '床関数: 933.99 -> 933');
assert(calc.applyRounding(935, 'round10') === 940, '10円丸め: 935 -> 940');
assert(calc.applyRounding(932, 'ceil10') === 940, '10円天井: 932 -> 940');
assert(calc.applyRounding(NaN, 'round') === 0, 'NaNは0を返す');

// 7-10. getCostRateStatus テスト
const status0 = calc.getCostRateStatus(0);
assert(status0.level === 'normal', '原価率0%: normalレベル');

const status20 = calc.getCostRateStatus(20);
assert(status20.level === 'good', '原価率20%: goodレベル (優秀)');

const status30 = calc.getCostRateStatus(30);
assert(status30.level === 'normal', '原価率30%: normalレベル (適正)');

const status40 = calc.getCostRateStatus(40);
assert(status40.level === 'warning', '原価率40%: warningレベル (高め)');

const status80 = calc.getCostRateStatus(80);
assert(status80.level === 'danger', '原価率80%: dangerレベル (警戒)');

const status150 = calc.getCostRateStatus(150);
assert(status150.level === 'danger', '原価率150%: dangerレベル (赤字)');

// 7-11. 材料名なし・商品名なしテスト
const noNameResult = calc.calculateCostSummary({
    materials: [
        { id: '1', name: '', usageAmount: 100, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 }
    ],
    sellingPrice: 1000
});
assert(noNameResult.totalCost === 100, '材料名なしでも原価計算は可能');

const noNameText = storage.formatResultAsText({
    productName: '',
    summary: noNameResult
});
assert(noNameText.includes('名称未設定の商品'), '商品名なしは「名称未設定の商品」として出力');

// 7-12. 全材料無効ケース
const allInvalidResult = calc.calculateCostSummary({
    materials: [
        { id: '1', usageAmount: -10, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 },
        { id: '2', usageAmount: 100, usageUnit: 'g', purchaseAmount: 0, purchaseUnit: 'kg', purchasePrice: 1000 },
        { id: '3', usageAmount: 100, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'L', purchasePrice: 1000 }
    ],
    sellingPrice: 1000
});
assert(allInvalidResult.totalCost === 0, '全材料無効でも合計原価は0 (エラー処理継続)');
assert(allInvalidResult.materials.every(m => m.isValid === false), '全材料のisValidがfalse');

// 7-13. テキストフォーマット境界テスト
const emptyMaterialsText = storage.formatResultAsText({
    productName: 'テスト商品',
    summary: {
        ...calc.calculateCostSummary({ materials: [], sellingPrice: 0 }),
        costRate: 0,
        grossProfit: 0,
        grossProfitRate: 0
    }
});
assert(emptyMaterialsText.includes('テスト商品'), '商品名を含む出力');
assert(emptyMaterialsText.includes('----------------------------------------'), '区切り線が含まれる');

console.log(`\n========================================`);
console.log(`テスト完了: PASS ${passed}件 / FAIL ${failed}件`);
if (failed > 0) process.exit(1);