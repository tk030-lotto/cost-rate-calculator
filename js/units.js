/**
 * @file units.js
 * @description 蜊倅ｽ榊､画鋤縺翫ｈ縺ｳ豁｣隕丞喧繧ｨ繝ｳ繧ｸ繝ｳ
 */

(function(global) {
    const UNIT_DEFINITIONS = {
        // 驥埼㍼邉ｻ (蝓ｺ貅・ g)
        g: { category: 'weight', factor: 1, label: 'g (繧ｰ繝ｩ繝)' },
        kg: { category: 'weight', factor: 1000, label: 'kg (繧ｭ繝ｭ繧ｰ繝ｩ繝)' },
        
        // 螳ｹ驥冗ｳｻ (蝓ｺ貅・ ml)
        ml: { category: 'volume', factor: 1, label: 'ml (繝溘Μ繝ｪ繝・ヨ繝ｫ)' },
        cc: { category: 'volume', factor: 1, label: 'cc (繧ｷ繝ｼ繧ｷ繝ｼ)' },
        L: { category: 'volume', factor: 1000, label: 'L (繝ｪ繝・ヨ繝ｫ)' },
        l: { category: 'volume', factor: 1000, label: 'L (繝ｪ繝・ヨ繝ｫ)' },

        // 蛟区焚邉ｻ (蝓ｺ貅・ 1)
        蛟・ { category: 'count', factor: 1, label: '蛟・ },
        譛ｬ: { category: 'count', factor: 1, label: '譛ｬ' },
        譫・ { category: 'count', factor: 1, label: '譫・ },
        繝代ャ繧ｯ: { category: 'count', factor: 1, label: '繝代ャ繧ｯ' },
        陲・ { category: 'count', factor: 1, label: '陲・ },
        鬟・ { category: 'count', factor: 1, label: '鬟・ },
        謚・ { category: 'count', factor: 1, label: '謚・ },
        郛ｶ: { category: 'count', factor: 1, label: '郛ｶ' }
    };

    function getUnitCategory(unit) {
        if (!unit) return 'unknown';
        const def = UNIT_DEFINITIONS[unit];
        return def ? def.category : 'unknown';
    }

    function areUnitsCompatible(unit1, unit2) {
        if (!unit1 || !unit2) return false;
        if (unit1 === unit2) return true;
        const cat1 = getUnitCategory(unit1);
        const cat2 = getUnitCategory(unit2);
        return cat1 !== 'unknown' && cat1 === cat2;
    }

    function convertUnit(value, fromUnit, toUnit) {
        if (typeof value !== 'number' || isNaN(value) || value < 0) return null;
        if (fromUnit === toUnit) return value;

        const defFrom = UNIT_DEFINITIONS[fromUnit];
        const defTo = UNIT_DEFINITIONS[toUnit];

        if (!defFrom || !defTo || defFrom.category !== defTo.category) {
            return null;
        }

        const baseValue = value * defFrom.factor;
        return baseValue / defTo.factor;
    }

    function calculateMaterialCost(usageAmount, usageUnit, purchaseAmount, purchaseUnit, purchasePrice) {
        if (
            typeof usageAmount !== 'number' || isNaN(usageAmount) || usageAmount < 0 ||
            typeof purchaseAmount !== 'number' || isNaN(purchaseAmount) || purchaseAmount <= 0 ||
            typeof purchasePrice !== 'number' || isNaN(purchasePrice) || purchasePrice < 0
        ) {
            return { cost: 0, isValid: false, error: '蜈･蜉帛､縺檎┌蜉ｹ縺ｧ縺・ };
        }

        if (usageAmount === 0 || purchasePrice === 0) {
            return { cost: 0, isValid: true };
        }

        if (usageUnit === purchaseUnit) {
            const cost = (usageAmount / purchaseAmount) * purchasePrice;
            return { cost, isValid: true };
        }

        if (!areUnitsCompatible(usageUnit, purchaseUnit)) {
            return { 
                cost: 0, 
                isValid: false, 
                error: `蜊倅ｽ阪・{usageUnit}縲阪→縲・{purchaseUnit}縲阪・螟画鋤縺ｧ縺阪∪縺帙ｓ` 
            };
        }

        const convertedUsage = convertUnit(usageAmount, usageUnit, purchaseUnit);
        if (convertedUsage === null) {
            return { cost: 0, isValid: false, error: '蜊倅ｽ榊､画鋤縺ｫ螟ｱ謨励＠縺ｾ縺励◆' };
        }

        const cost = (convertedUsage / purchaseAmount) * purchasePrice;
        return { cost, isValid: true };
    }

    const exports = {
        UNIT_DEFINITIONS,
        getUnitCategory,
        areUnitsCompatible,
        convertUnit,
        calculateMaterialCost
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exports;
    } else {
        global.CostCalcUnits = exports;
    }
})(typeof window !== 'undefined' ? window : globalThis);
