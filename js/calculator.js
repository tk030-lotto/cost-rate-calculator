/**
 * @file calculator.js
 * @description 蜴滉ｾ｡邇・∫ｲ怜茜縲∫ｲ怜茜邇・∫岼讓咎・ｮ苓ｲｩ螢ｲ萓｡譬ｼ縺ｮ邊ｾ蟇・ｨ育ｮ励Ο繧ｸ繝・け
 */

(function(global) {
    function getUnitsModule() {
        if (typeof module !== 'undefined' && module.exports) {
            return require('./units.js');
        }
        return global.CostCalcUnits;
    }

    function calculateAllMaterials(materials) {
        if (!Array.isArray(materials)) {
            return { items: [], totalCost: 0 };
        }

        const unitsMod = getUnitsModule();
        let totalCost = 0;
        const items = materials.map(item => {
            const result = unitsMod.calculateMaterialCost(
                item.usageAmount,
                item.usageUnit,
                item.purchaseAmount,
                item.purchaseUnit,
                item.purchasePrice
            );

            if (result.isValid) {
                totalCost += result.cost;
            }

            return {
                ...item,
                calculatedCost: result.cost,
                isValid: result.isValid,
                error: result.error
            };
        });

        return { items, totalCost };
    }

    function calculateCostSummary({
        materials,
        sellingPrice,
        targetCostRate,
        roundingMode = 'round'
    }) {
        const { items, totalCost } = calculateAllMaterials(materials);
        const validSellingPrice = typeof sellingPrice === 'number' && !isNaN(sellingPrice) && sellingPrice > 0 ? sellingPrice : 0;
        
        let costRate = 0;
        let grossProfit = 0;
        let grossProfitRate = 0;
        let isDeficit = false;

        if (validSellingPrice > 0) {
            costRate = (totalCost / validSellingPrice) * 100;
            grossProfit = validSellingPrice - totalCost;
            grossProfitRate = (grossProfit / validSellingPrice) * 100;
            isDeficit = grossProfit < 0;
        }

        let targetSellingPrice = null;
        const validTargetRate = typeof targetCostRate === 'number' && !isNaN(targetCostRate) && targetCostRate > 0 && targetCostRate <= 100 ? targetCostRate : null;

        // 騾・ｮ嶺ｾ｡譬ｼ縺ｯ縲瑚ｲｩ螢ｲ萓｡譬ｼ > 0縲阪°縺､縲悟次萓｡ > 0縲阪・譚｡莉ｶ荳九〒縺ｮ縺ｿ險育ｮ・        // 莉墓ｧ俶嶌 13遽: 縲・莉･荳九・雋ｩ螢ｲ萓｡譬ｼ縺ｯ辟｡蜉ｹ縲阪→縺吶ｋ譁ｹ驥昴↓謨ｴ蜷・        if (validTargetRate !== null && totalCost > 0 && validSellingPrice > 0) {
            const rawTargetPrice = totalCost / (validTargetRate / 100);
            targetSellingPrice = applyRounding(rawTargetPrice, roundingMode);
        }

        return {
            totalCost,
            sellingPrice: validSellingPrice,
            costRate,
            grossProfit,
            grossProfitRate,
            targetCostRate: validTargetRate,
            targetSellingPrice,
            isDeficit,
            materials: items
        };
    }

    function applyRounding(value, mode) {
        if (typeof value !== 'number' || isNaN(value)) return 0;

        switch (mode) {
            case 'ceil':
                return Math.ceil(value);
            case 'floor':
                return Math.floor(value);
            case 'round10':
                return Math.round(value / 10) * 10;
            case 'ceil10':
                return Math.ceil(value / 10) * 10;
            case 'round':
            default:
                return Math.round(value);
        }
    }

    function getCostRateStatus(costRate) {
        if (costRate <= 0) {
            return { level: 'normal', label: '-', description: '雋ｩ螢ｲ萓｡譬ｼ繧貞・蜉帙＠縺ｦ縺上□縺輔＞' };
        }
        if (costRate <= 25) {
            return { level: 'good', label: '蜆ｪ遘', description: '髱槫ｸｸ縺ｫ鬮倥＞蛻ｩ逶顔紫繧堤｢ｺ菫昴〒縺阪※縺・∪縺・ };
        }
        if (costRate <= 35) {
            return { level: 'normal', label: '驕ｩ豁｣', description: '鬟ｲ鬟溘・蟆丞｣ｲ縺ｮ讓呎ｺ也噪縺ｪ逶ｮ螳会ｼ・0%蜑榊ｾ鯉ｼ峨・遽・峇蜀・〒縺・ };
        }
        if (costRate <= 50) {
            return { level: 'warning', label: '鬮倥ａ', description: '蜴滉ｾ｡邇・′鬮倥ａ縺ｧ縺吶ゆｻ募・繧・ｾ｡譬ｼ縺ｮ隱ｿ謨ｴ繧呈耳螂ｨ縺励∪縺・ };
        }
        if (costRate <= 100) {
            return { level: 'danger', label: '隴ｦ謌・, description: '邊怜茜縺梧･ｵ繧√※蟆代↑縺丞崋螳夊ｲｻ蝗槫庶縺ｮ繝ｪ繧ｹ繧ｯ縺後≠繧翫∪縺・ };
        }
        return { level: 'danger', label: '襍､蟄・, description: '蜴滉ｾ｡縺瑚ｲｩ螢ｲ萓｡譬ｼ繧定ｶ・℃縺励※縺翫ｊ襍､蟄励〒縺・ };
    }

    const exports = {
        calculateAllMaterials,
        calculateCostSummary,
        applyRounding,
        getCostRateStatus
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exports;
    } else {
        global.CostCalcCalculator = exports;
    }
})(typeof window !== 'undefined' ? window : globalThis);

