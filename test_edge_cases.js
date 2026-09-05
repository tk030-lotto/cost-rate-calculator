/**
 * @file test_edge_cases.js
 * @description 繧ｨ繝・ず繧ｱ繝ｼ繧ｹ繝ｻ蠅・阜蛟､繝ｻ逡ｰ蟶ｸ邉ｻ縺ｮ閾ｪ蜍墓､懆ｨｼ繧ｹ繧ｯ繝ｪ繝励ヨ
 * 2026/08/30: 繧ｳ繝ｼ繝峨Ξ繝薙Η繝ｼ邨先棡縺ｫ蝓ｺ縺･縺乗隼蝟・ */

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

console.log('=== A. 繧ｼ繝ｭ髯､邂励・蠅・阜蛟､繝・せ繝・===');

const zeroPriceResult = calc.calculateCostSummary({
    materials: [{ id: '1', usageAmount: 100, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 }],
    sellingPrice: 0,
    targetCostRate: 30
});
assert(zeroPriceResult.costRate === 0, '雋ｩ螢ｲ萓｡譬ｼ0蜀・・蜴滉ｾ｡邇・・0');
assert(zeroPriceResult.grossProfit === 0, '雋ｩ螢ｲ萓｡譬ｼ0蜀・・邊怜茜縺ｯ0');
assert(zeroPriceResult.targetSellingPrice === null, '雋ｩ螢ｲ萓｡譬ｼ0蜀・・騾・ｮ嶺ｾ｡譬ｼ縺ｯnull');

const zeroCostResult = calc.calculateCostSummary({
    materials: [{ id: '1', usageAmount: 0, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 }],
    sellingPrice: 1000,
    targetCostRate: 30
});
assert(zeroCostResult.costRate === 0, '菴ｿ逕ｨ驥・縺ｮ蜴滉ｾ｡邇・・0');
assert(zeroCostResult.targetSellingPrice === null, '蜴滉ｾ｡0縺ｮ騾・ｮ嶺ｾ｡譬ｼ縺ｯnull (0髯､邂怜屓驕ｿ)');

console.log('\n=== B. 讌ｵ遶ｯ縺ｪ蛟､繝・せ繝・===');

const largeValueResult = calc.calculateCostSummary({
    materials: [{ id: '1', usageAmount: 1000, usageUnit: 'kg', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000000 }],
    sellingPrice: 1000000000
});
assertClose(largeValueResult.totalCost, 1000000000, 1, '螟ｧ隕乗ｨ｡蜴滉ｾ｡險育ｮ・(1000kg * 1,000,000蜀・');
assertClose(largeValueResult.costRate, 100, 0.01, '螟ｧ隕乗ｨ｡雋ｩ螢ｲ譎ゅ・蜴滉ｾ｡邇・(1000蛟・= 100%)');

console.log('\n=== C. 蟆乗焚蛟､繝・せ繝・===');

const decimalResult = calc.calculateCostSummary({
    materials: [{ id: '1', usageAmount: 0.5, usageUnit: 'kg', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 }],
    sellingPrice: 1000,
    targetCostRate: 25
});
assertClose(decimalResult.totalCost, 500, 0.001, '蟆乗焚菴ｿ逕ｨ驥上・險育ｮ・(0.5kg * 1000蜀・');
assertClose(decimalResult.costRate, 50, 0.01, '蟆乗焚菴ｿ逕ｨ驥上・蜴滉ｾ｡邇・);

console.log('\n=== D. NaN/譛ｪ螳夂ｾｩ蛟､繝・せ繝・===');

const nanResult = calc.calculateCostSummary({
    materials: [],
    sellingPrice: NaN,
    targetCostRate: undefined
});
assert(nanResult.sellingPrice === 0, 'NaN雋ｩ螢ｲ萓｡譬ｼ縺ｯ0縺ｨ縺励※蜃ｦ逅・);
assert(nanResult.targetCostRate === null, 'undefined逶ｮ讓咏紫縺ｯnull縺ｨ縺励※蜃ｦ逅・);

console.log('\n=== E. 辟｡蜉ｹ縺ｪ逶ｮ讓吝次萓｡邇・ユ繧ｹ繝・===');

const invalidTargetResult = calc.calculateCostSummary({
    materials: [{ id: '1', usageAmount: 100, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 }],
    sellingPrice: 1000,
    targetCostRate: 0
});
assert(invalidTargetResult.targetCostRate === null, '逶ｮ讓吝次萓｡邇・縺ｯnull縺ｨ縺励※蜃ｦ逅・);
assert(invalidTargetResult.targetSellingPrice === null, '逶ｮ讓吝次萓｡邇・縺ｮ騾・ｮ嶺ｾ｡譬ｼ縺ｯnull');

const over100Result = calc.calculateCostSummary({
    materials: [{ id: '1', usageAmount: 100, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 }],
    sellingPrice: 1000,
    targetCostRate: 150
});
assert(over100Result.targetCostRate === null, '逶ｮ讓吝次萓｡邇・50%縺ｯnull縺ｨ縺励※蜃ｦ逅・(100%雜・');

console.log('\n=== F. 蜊倅ｽ榊､画鋤隧ｳ邏ｰ繝・せ繝・===');

// 7-7. 蜊倅ｽ榊､画鋤隧ｳ邏ｰ繝・せ繝・assert(units.areUnitsCompatible('cc', 'ml') === true, 'cc 縺ｨ ml 縺ｯ莠呈鋤諤ｧ縺ゅｊ (蜷檎ｳｻ邨ｱ)');
assert(units.areUnitsCompatible('L', 'l') === true, 'L 縺ｨ l 縺ｯ蜷後§螳ｹ驥冗ｳｻ');
assert(units.convertUnit(1, 'L', 'l') === 1, 'L -> l 螟画鋤 (1:1 蜷悟､)');
assert(units.convertUnit(500, 'ml', 'L') === 0.5, 'ml -> L 螟画鋤 (0.001蛟・');
assert(units.convertUnit(100, 'g', 'kg') === 0.1, 'g -> kg 螟画鋤 (0.001蛟・');
assert(units.convertUnit(5, 'kg', 'g') === 5000, 'kg -> g 螟画鋤 (1000蛟・');

// 7-8. 譛ｪ遏･縺ｮ蜊倅ｽ・const unknownUnitResult = units.calculateMaterialCost(100, 'xyz', 1, 'kg', 1000);
assert(unknownUnitResult.isValid === false, '譛ｪ遏･縺ｮ菴ｿ逕ｨ蜊倅ｽ阪・繧ｨ繝ｩ繝ｼ');

// 7-9. applyRounding 繝・せ繝・assert(calc.applyRounding(933.33, 'round') === 933, '蝗帶昏莠泌・: 933.33 -> 933');
assert(calc.applyRounding(933.5, 'round') === 934, '蝗帶昏莠泌・: 933.5 -> 934');
assert(calc.applyRounding(933.33, 'ceil') === 934, '螟ｩ莠暮未謨ｰ: 933.33 -> 934');
assert(calc.applyRounding(933.99, 'floor') === 933, '蠎企未謨ｰ: 933.99 -> 933');
assert(calc.applyRounding(935, 'round10') === 940, '10蜀・ｸｸ繧・ 935 -> 940');
assert(calc.applyRounding(932, 'ceil10') === 940, '10蜀・､ｩ莠・ 932 -> 940');
assert(calc.applyRounding(NaN, 'round') === 0, 'NaN縺ｯ0繧定ｿ斐☆');

// 7-10. getCostRateStatus 繝・せ繝・const status0 = calc.getCostRateStatus(0);
assert(status0.level === 'normal', '蜴滉ｾ｡邇・%: normal繝ｬ繝吶Ν');

const status20 = calc.getCostRateStatus(20);
assert(status20.level === 'good', '蜴滉ｾ｡邇・0%: good繝ｬ繝吶Ν (蜆ｪ遘)');

const status30 = calc.getCostRateStatus(30);
assert(status30.level === 'normal', '蜴滉ｾ｡邇・0%: normal繝ｬ繝吶Ν (驕ｩ豁｣)');

const status40 = calc.getCostRateStatus(40);
assert(status40.level === 'warning', '蜴滉ｾ｡邇・0%: warning繝ｬ繝吶Ν (鬮倥ａ)');

const status80 = calc.getCostRateStatus(80);
assert(status80.level === 'danger', '蜴滉ｾ｡邇・0%: danger繝ｬ繝吶Ν (隴ｦ謌・');

const status150 = calc.getCostRateStatus(150);
assert(status150.level === 'danger', '蜴滉ｾ｡邇・50%: danger繝ｬ繝吶Ν (襍､蟄・');

// 7-11. 譚先侭蜷阪↑縺励・蝠・刀蜷阪↑縺励ユ繧ｹ繝・const noNameResult = calc.calculateCostSummary({
    materials: [
        { id: '1', name: '', usageAmount: 100, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 }
    ],
    sellingPrice: 1000
});
assert(noNameResult.totalCost === 100, '譚先侭蜷阪↑縺励〒繧ょ次萓｡險育ｮ励・蜿ｯ閭ｽ');

const noNameText = storage.formatResultAsText({
    productName: '',
    summary: noNameResult
});
assert(noNameText.includes('蜷咲ｧｰ譛ｪ險ｭ螳壹・蝠・刀'), '蝠・刀蜷阪↑縺励・縲悟錐遘ｰ譛ｪ險ｭ螳壹・蝠・刀縲阪→縺励※蜃ｺ蜉・);

// 7-12. 蜈ｨ譚先侭辟｡蜉ｹ繧ｱ繝ｼ繧ｹ
const allInvalidResult = calc.calculateCostSummary({
    materials: [
        { id: '1', usageAmount: -10, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1000 },
        { id: '2', usageAmount: 100, usageUnit: 'g', purchaseAmount: 0, purchaseUnit: 'kg', purchasePrice: 1000 },
        { id: '3', usageAmount: 100, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'L', purchasePrice: 1000 }
    ],
    sellingPrice: 1000
});
assert(allInvalidResult.totalCost === 0, '蜈ｨ譚先侭辟｡蜉ｹ縺ｧ繧ょ粋險亥次萓｡縺ｯ0 (繧ｨ繝ｩ繝ｼ蜃ｦ逅・ｶ咏ｶ・');
assert(allInvalidResult.materials.every(m => m.isValid === false), '蜈ｨ譚先侭縺ｮisValid縺掲alse');

// 7-13. 繝・く繧ｹ繝医ヵ繧ｩ繝ｼ繝槭ャ繝亥｢・阜繝・せ繝・const emptyMaterialsText = storage.formatResultAsText({
    productName: '繝・せ繝亥膚蜩・,
    summary: {
        ...calc.calculateCostSummary({ materials: [], sellingPrice: 0 }),
        costRate: 0,
        grossProfit: 0,
        grossProfitRate: 0
    }
});
assert(emptyMaterialsText.includes('繝・せ繝亥膚蜩・), '蝠・刀蜷阪ｒ蜷ｫ繧蜃ｺ蜉・);
assert(emptyMaterialsText.includes('----------------------------------------'), '蛹ｺ蛻・ｊ邱壹′蜷ｫ縺ｾ繧後ｋ');

console.log(`\n========================================`);
console.log(`繝・せ繝亥ｮ御ｺ・ PASS ${passed}莉ｶ / FAIL ${failed}莉ｶ`);
if (failed > 0) process.exit(1);
