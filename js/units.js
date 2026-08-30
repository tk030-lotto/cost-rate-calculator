/**
 * @file units.js
 * @description 単位変換および正規化エンジン
 */

(function(global) {
    const UNIT_DEFINITIONS = {
        // 重量系 (基準: g)
        g: { category: 'weight', factor: 1, label: 'g (グラム)' },
        kg: { category: 'weight', factor: 1000, label: 'kg (キログラム)' },
        
        // 容量系 (基準: ml)
        ml: { category: 'volume', factor: 1, label: 'ml (ミリリットル)' },
        cc: { category: 'volume', factor: 1, label: 'cc (シーシー)' },
        L: { category: 'volume', factor: 1000, label: 'L (リットル)' },
        l: { category: 'volume', factor: 1000, label: 'L (リットル)' },

        // 個数系 (基準: 1)
        個: { category: 'count', factor: 1, label: '個' },
        本: { category: 'count', factor: 1, label: '本' },
        枚: { category: 'count', factor: 1, label: '枚' },
        パック: { category: 'count', factor: 1, label: 'パック' },
        袋: { category: 'count', factor: 1, label: '袋' },
        食: { category: 'count', factor: 1, label: '食' },
        把: { category: 'count', factor: 1, label: '把' },
        缶: { category: 'count', factor: 1, label: '缶' }
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
            return { cost: 0, isValid: false, error: '入力値が無効です' };
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
                error: `単位「${usageUnit}」と「${purchaseUnit}」は変換できません` 
            };
        }

        const convertedUsage = convertUnit(usageAmount, usageUnit, purchaseUnit);
        if (convertedUsage === null) {
            return { cost: 0, isValid: false, error: '単位変換に失敗しました' };
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
