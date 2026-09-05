/**
 * @file storage.js
 * @description LocalStorage豌ｸ邯壼喧縲√・繝ｪ繧ｻ繝・ヨ繝ｬ繧ｷ繝斐√ユ繧ｭ繧ｹ繝医ヵ繧ｩ繝ｼ繝槭ャ繝域ｩ溯・
 */

(function(global) {
    const STORAGE_KEY = 'cost_rate_calculator_state_v1';

    const PRESETS = [
        {
            id: 'hamburg',
            name: '謇九＃縺ｭ繝上Φ繝舌・繧ｰ螳夐｣・,
            sellingPrice: 1200,
            targetCostRate: 30,
            materials: [
                { id: 'm1', name: '蜷域舷縺崎ｉ', usageAmount: 150, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1380 },
                { id: 'm2', name: '邇峨・縺・, usageAmount: 60, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 240 },
                { id: 'm3', name: '鮓丞嵯', usageAmount: 1, usageUnit: '蛟・, purchaseAmount: 10, purchaseUnit: '蛟・, purchasePrice: 280 },
                { id: 'm4', name: '繝代Φ邊峨・隱ｿ蜻ｳ譁・, usageAmount: 1, usageUnit: '鬟・, purchaseAmount: 1, purchaseUnit: '鬟・, purchasePrice: 35 },
                { id: 'm5', name: '逋ｽ邀ｳ (縺秘｣ｯ200g)', usageAmount: 1, usageUnit: '鬟・, purchaseAmount: 1, purchaseUnit: '鬟・, purchasePrice: 55 },
                { id: 'm6', name: '蜻ｳ蝎梧ｱ√・蟆城欧', usageAmount: 1, usageUnit: '鬟・, purchaseAmount: 1, purchaseUnit: '鬟・, purchasePrice: 40 }
            ]
        },
        {
            id: 'caffe_latte',
            name: '迚ｹ陬ｽ繧ｫ繝輔ぉ繝ｩ繝・(繧｢繧､繧ｹ)',
            sellingPrice: 580,
            targetCostRate: 25,
            materials: [
                { id: 'm1', name: '繧ｨ繧ｹ繝励Ξ繝・た雎・(豺ｱ辣弱ｊ)', usageAmount: 18, usageUnit: 'g', purchaseAmount: 500, purchaseUnit: 'g', purchasePrice: 1600 },
                { id: 'm2', name: '謌仙・辟｡隱ｿ謨ｴ迚帑ｹｳ', usageAmount: 180, usageUnit: 'ml', purchaseAmount: 1, purchaseUnit: 'L', purchasePrice: 248 },
                { id: 'm3', name: '繝・う繧ｯ繧｢繧ｦ繝医き繝・・繝ｻ繝輔ち', usageAmount: 1, usageUnit: '蛟・, purchaseAmount: 100, purchaseUnit: '蛟・, purchasePrice: 1800 },
                { id: 'm4', name: '繧ｹ繝医Ο繝ｼ繝ｻ繧ｹ繝ｪ繝ｼ繝・, usageAmount: 1, usageUnit: '蛟・, purchaseAmount: 100, purchaseUnit: '蛟・, purchasePrice: 500 }
            ]
        },
        {
            id: 'cake',
            name: '縺・■縺斐す繝ｧ繝ｼ繝医こ繝ｼ繧ｭ (1繧ｫ繝・ヨ)',
            sellingPrice: 650,
            targetCostRate: 28,
            materials: [
                { id: 'm1', name: '蝗ｽ逕｣縺・■縺・(2邊・', usageAmount: 2, usageUnit: '蛟・, purchaseAmount: 20, purchaseUnit: '蛟・, purchasePrice: 780 },
                { id: 'm2', name: '邏皮函繧ｯ繝ｪ繝ｼ繝 (38%)', usageAmount: 60, usageUnit: 'ml', purchaseAmount: 1, purchaseUnit: 'L', purchasePrice: 1200 },
                { id: 'm3', name: '繧ｹ繝昴Φ繧ｸ逕溷慍 (1/8蜿ｰ)', usageAmount: 1, usageUnit: '鬟・, purchaseAmount: 1, purchaseUnit: '鬟・, purchasePrice: 45 },
                { id: 'm4', name: '繧ｱ繝ｼ繧ｭ邂ｱ繝ｻ繝輔ぅ繝ｫ繝', usageAmount: 1, usageUnit: '蛟・, purchaseAmount: 50, purchaseUnit: '蛟・, purchasePrice: 1100 }
            ]
        },
        {
            id: 'handmade',
            name: '繝上Φ繝峨Γ繧､繝牙ｸ・｣ｽ繝医・繝医ヰ繝・げ',
            sellingPrice: 3800,
            targetCostRate: 35,
            materials: [
                { id: 'm1', name: '蛟画聞蟶・ｸ・(11蜿ｷ)', usageAmount: 0.5, usageUnit: 'm', purchaseAmount: 1, purchaseUnit: 'm', purchasePrice: 1200 },
                { id: 'm2', name: '謖√■謇狗畑繧｢繧ｯ繝ｪ繝ｫ繝・・繝・, usageAmount: 1.2, usageUnit: 'm', purchaseAmount: 10, purchaseUnit: 'm', purchasePrice: 1500 },
                { id: 'm3', name: '繝槭げ繝阪ャ繝医・繝・け', usageAmount: 1, usageUnit: '蛟・, purchaseAmount: 10, purchaseUnit: '蛟・, purchasePrice: 600 },
                { id: 'm4', name: '繝悶Λ繝ｳ繝峨ち繧ｰ繝ｻ蛹・｣・ｳ・攝', usageAmount: 1, usageUnit: '蛟・, purchaseAmount: 50, purchaseUnit: '蛟・, purchasePrice: 2000 }
            ]
        }
    ];

    function saveState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }
    }

    function loadState() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('LocalStorage load failed:', e);
            return null;
        }
    }

    function clearState() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.warn('LocalStorage clear failed:', e);
        }
    }

    function formatResultAsText({ productName, summary }) {
        const title = (productName || '').trim() || '蜷咲ｧｰ譛ｪ險ｭ螳壹・蝠・刀';
        const dateStr = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
        
        let text = `縲仙次萓｡邇・・邊怜茜 險育ｮ玲嶌縲曾n`;
        text += `蝠・刀蜷・ ${title}\n`;
        text += `險育ｮ玲律: ${dateStr}\n`;
        text += `----------------------------------------\n`;
        text += `笆 譚先侭譏守ｴｰ\n`;

        summary.materials.forEach((m, idx) => {
            const costStr = m.isValid ? `ﾂ･${Math.round(m.calculatedCost).toLocaleString()}` : '(險育ｮ嶺ｸ榊庄)';
            const name = m.name || `譚先侭${idx + 1}`;
            text += `${idx + 1}. ${name.padEnd(12, ' ')} : ${m.usageAmount}${m.usageUnit} (莉募・ ${m.purchaseAmount}${m.purchaseUnit} ﾂ･${m.purchasePrice.toLocaleString()}) 竊・${costStr}\n`;
        });

        text += `----------------------------------------\n`;
        text += `笆 險育ｮ礼ｵ先棡繧ｵ繝槭Μ繝ｼ\n`;
        text += `蜷郁ｨ亥膚蜩∝次萓｡ : ﾂ･${Math.round(summary.totalCost).toLocaleString()}\n`;
        text += `雋ｩ螢ｲ萓｡譬ｼ     : ﾂ･${Math.round(summary.sellingPrice).toLocaleString()}\n`;
        text += `蜴滉ｾ｡邇・      : ${summary.costRate.toFixed(1)}%\n`;
        text += `邊怜茜逶企｡・    : ﾂ･${Math.round(summary.grossProfit).toLocaleString()}\n`;
        text += `邊怜茜逶顔紫     : ${summary.grossProfitRate.toFixed(1)}%\n`;

        if (summary.targetCostRate && summary.targetSellingPrice) {
            text += `\n笆 逶ｮ讓吝次萓｡邇・す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ\n`;
            text += `逶ｮ讓吝次萓｡邇・  : ${summary.targetCostRate}%\n`;
            text += `蠢・ｦ∬ｲｩ螢ｲ萓｡譬ｼ : ﾂ･${summary.targetSellingPrice.toLocaleString()} (騾・ｮ怜､)\n`;
        }

        text += `----------------------------------------\n`;
        text += `窶ｻ 蜴滉ｾ｡邇・ｉ縺上ｉ縺剰ｨ育ｮ・(https://tk030-lotto.github.io/cost-rate-calculator/)\n`;

        return text;
    }

    const exports = {
        PRESETS,
        saveState,
        loadState,
        clearState,
        formatResultAsText
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exports;
    } else {
        global.CostCalcStorage = exports;
    }
})(typeof window !== 'undefined' ? window : globalThis);
