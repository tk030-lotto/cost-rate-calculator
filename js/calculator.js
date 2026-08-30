/**
 * @file calculator.js
 * @description 原価率、粗利、粗利率、目標逆算販売価格の精密計算ロジック
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

        if (validTargetRate !== null && totalCost > 0) {
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
            return { level: 'normal', label: '-', description: '販売価格を入力してください' };
        }
        if (costRate <= 25) {
            return { level: 'good', label: '優秀', description: '非常に高い利益率を確保できています' };
        }
        if (costRate <= 35) {
            return { level: 'normal', label: '適正', description: '飲食・小売の標準的な目安（30%前後）の範囲内です' };
        }
        if (costRate <= 50) {
            return { level: 'warning', label: '高め', description: '原価率が高めです。仕入や価格の調整を推奨します' };
        }
        if (costRate <= 100) {
            return { level: 'danger', label: '警戒', description: '粗利が極めて少なく固定費回収のリスクがあります' };
        }
        return { level: 'danger', label: '赤字', description: '原価が販売価格を超過しており赤字です' };
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
