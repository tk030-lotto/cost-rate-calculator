/**
 * @file test_calculator.js
 * @description 險育ｮ励Ο繧ｸ繝・け繝ｻ蜊倅ｽ榊､画鋤繝ｻ莉墓ｧ俶嶌險倩ｼ我ｾ九・閾ｪ蜍墓､懆ｨｼ繧ｹ繧ｯ繝ｪ繝励ヨ
 */

const units = require('./js/units.js');
const calc = require('./js/calculator.js');
const storage = require('./js/storage.js');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`笨・PASS: ${message}`);
        passed++;
    } else {
        console.error(`笶・FAIL: ${message}`);
        failed++;
    }
}

function assertClose(actual, expected, tolerance = 0.01, message) {
    const diff = Math.abs(actual - expected);
    if (diff <= tolerance) {
        console.log(`笨・PASS: ${message} (Actual: ${actual}, Expected: ${expected})`);
        passed++;
    } else {
        console.error(`笶・FAIL: ${message} (Actual: ${actual}, Expected: ${expected}, Diff: ${diff})`);
        failed++;
    }
}

console.log('=== 1. 蜊倅ｽ榊､画鋤繝・せ繝・===');
assert(units.areUnitsCompatible('g', 'kg') === true, 'g 縺ｨ kg 縺ｯ莠呈鋤諤ｧ縺ゅｊ');
assert(units.areUnitsCompatible('ml', 'L') === true, 'ml 縺ｨ L 縺ｯ莠呈鋤諤ｧ縺ゅｊ');
assert(units.areUnitsCompatible('g', 'L') === false, 'g 縺ｨ L 縺ｯ莠呈鋤諤ｧ縺ｪ縺・);
assert(units.convertUnit(150, 'g', 'kg') === 0.15, '150g -> 0.15kg');
assert(units.convertUnit(2, 'L', 'ml') === 2000, '2L -> 2000ml');

console.log('\n=== 2. 譚先侭蜴滉ｾ｡險育ｮ励ユ繧ｹ繝・(莉墓ｧ俶嶌險倩ｼ我ｾ・ ===');
// 莉墓ｧ俶嶌: 縺ｲ縺崎ｉ 150g, 莉募・ 1kg / 1,200蜀・-> 180蜀・const m1 = units.calculateMaterialCost(150, 'g', 1, 'kg', 1200);
assert(m1.isValid === true, '縺ｲ縺崎ｉ險育ｮ玲怏蜉ｹ');
assertClose(m1.cost, 180, 0.001, '縺ｲ縺崎ｉ蜴滉ｾ｡ = 180蜀・);

// 莉墓ｧ俶嶌: 邇峨・縺・50g, 莉募・ 1kg / 200蜀・-> 10蜀・const m2 = units.calculateMaterialCost(50, 'g', 1, 'kg', 200);
assert(m2.isValid === true, '邇峨・縺手ｨ育ｮ玲怏蜉ｹ');
assertClose(m2.cost, 10, 0.001, '邇峨・縺主次萓｡ = 10蜀・);

// 莉墓ｧ俶嶌: 蜊ｵ 1蛟・ 莉募・ 1蛟・/ 25蜀・-> 25蜀・const m3 = units.calculateMaterialCost(1, '蛟・, 1, '蛟・, 25);
assert(m3.isValid === true, '蜊ｵ險育ｮ玲怏蜉ｹ');
assertClose(m3.cost, 25, 0.001, '蜊ｵ蜴滉ｾ｡ = 25蜀・);

console.log('\n=== 3. 蝠・刀蜴滉ｾ｡繝ｻ蜴滉ｾ｡邇・・邊怜茜繝・せ繝・(莉墓ｧ俶嶌險倩ｼ我ｾ・ ===');
// 莉墓ｧ俶嶌: 蝠・刀蜴滉ｾ｡ 280蜀・ 雋ｩ螢ｲ萓｡譬ｼ 1,000蜀・// 蜴滉ｾ｡邇・ 28.0%, 邊怜茜: 720蜀・ 邊怜茜邇・ 72.0%
const summary1 = calc.calculateCostSummary({
    materials: [
        { id: '1', name: '譚先侭A', usageAmount: 1, usageUnit: '蛟・, purchaseAmount: 1, purchaseUnit: '蛟・, purchasePrice: 280 }
    ],
    sellingPrice: 1000,
    targetCostRate: 30
});
assertClose(summary1.totalCost, 280, 0.001, '蝠・刀蜴滉ｾ｡ 280蜀・);
assertClose(summary1.costRate, 28.0, 0.001, '蜴滉ｾ｡邇・28.0%');
assertClose(summary1.grossProfit, 720, 0.001, '邊怜茜 720蜀・);
assertClose(summary1.grossProfitRate, 72.0, 0.001, '邊怜茜邇・72.0%');
// 逶ｮ讓吝次萓｡邇・30% 騾・ｮ・ 280 ﾃｷ 0.3 = 933.33... -> 933蜀・assertClose(summary1.targetSellingPrice, 933, 1, '逶ｮ讓咎・ｮ苓ｲｩ螢ｲ萓｡譬ｼ 邏・33縲・34蜀・(Round: 933)');

console.log('\n=== 4. 隍・焚譚先侭髮・ｨ医ユ繧ｹ繝・(莉墓ｧ俶嶌繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ11萓・ ===');
// 縺ｲ縺崎ｉ 180 + 邇峨・縺・10 + 蜊ｵ 25 = 215蜀・// 雋ｩ螢ｲ萓｡譬ｼ 980蜀・-> 蜴滉ｾ｡邇・21.9%, 邊怜茜 765蜀・ 邊怜茜邇・78.1%
const summary2 = calc.calculateCostSummary({
    materials: [
        { id: '1', name: '縺ｲ縺崎ｉ', usageAmount: 150, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1200 },
        { id: '2', name: '邇峨・縺・, usageAmount: 50, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 200 },
        { id: '3', name: '蜊ｵ', usageAmount: 1, usageUnit: '蛟・, purchaseAmount: 1, purchaseUnit: '蛟・, purchasePrice: 25 }
    ],
    sellingPrice: 980
});
assertClose(summary2.totalCost, 215, 0.001, '蜷郁ｨ亥膚蜩∝次萓｡ 215蜀・);
assertClose(summary2.costRate, 21.938, 0.1, '蜴滉ｾ｡邇・21.9%');
assertClose(summary2.grossProfit, 765, 0.001, '邊怜茜 765蜀・);
assertClose(summary2.grossProfitRate, 78.06, 0.1, '邊怜茜邇・78.1%');

console.log('\n=== 5. 繧ｨ繝ｩ繝ｼ繝上Φ繝峨Μ繝ｳ繧ｰ繝ｻ蠅・阜蛟､繝・せ繝・===');
const invalidResult = units.calculateMaterialCost(-10, 'g', 1, 'kg', 1000);
assert(invalidResult.isValid === false, '繝槭う繝翫せ菴ｿ逕ｨ驥上・辟｡蜉ｹ蛻､螳・);

const incompatibleResult = units.calculateMaterialCost(100, 'g', 1, 'L', 1000);
assert(incompatibleResult.isValid === false, 'g 縺ｨ L 縺ｯ辟｡蜉ｹ蛻､螳・);

console.log('\n=== 6. 繝・く繧ｹ繝医ヵ繧ｩ繝ｼ繝槭ャ繝亥・蜉帙ユ繧ｹ繝・===');
const formattedText = storage.formatResultAsText({
    productName: '莉墓ｧ俶嶌繝・せ繝亥ｮ夐｣・,
    summary: summary2
});
assert(formattedText.includes('縲仙次萓｡邇・・邊怜茜 險育ｮ玲嶌縲・), '繧ｿ繧､繝医Ν繝倥ャ繝繝ｼ遒ｺ隱・);
assert(formattedText.includes('蜷郁ｨ亥膚蜩∝次萓｡ : ﾂ･215'), '蜷郁ｨ亥次萓｡繝輔か繝ｼ繝槭ャ繝育｢ｺ隱・);
assert(formattedText.includes('蜴滉ｾ｡邇・      : 21.9%'), '蜴滉ｾ｡邇・ヵ繧ｩ繝ｼ繝槭ャ繝育｢ｺ隱・);

console.log(`\n========================================`);
console.log(`繝・せ繝亥ｮ御ｺ・ PASS ${passed}莉ｶ / FAIL ${failed}莉ｶ`);
if (failed > 0) process.exit(1);
