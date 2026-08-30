/**
 * @file storage.js
 * @description LocalStorage永続化、プリセットレシピ、テキストフォーマット機能
 */

(function(global) {
    const STORAGE_KEY = 'cost_rate_calculator_state_v1';

    const PRESETS = [
        {
            id: 'hamburg',
            name: '手ごねハンバーグ定食',
            sellingPrice: 1200,
            targetCostRate: 30,
            materials: [
                { id: 'm1', name: '合挽き肉', usageAmount: 150, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 1380 },
                { id: 'm2', name: '玉ねぎ', usageAmount: 60, usageUnit: 'g', purchaseAmount: 1, purchaseUnit: 'kg', purchasePrice: 240 },
                { id: 'm3', name: '鶏卵', usageAmount: 1, usageUnit: '個', purchaseAmount: 10, purchaseUnit: '個', purchasePrice: 280 },
                { id: 'm4', name: 'パン粉・調味料', usageAmount: 1, usageUnit: '食', purchaseAmount: 1, purchaseUnit: '食', purchasePrice: 35 },
                { id: 'm5', name: '白米 (ご飯200g)', usageAmount: 1, usageUnit: '食', purchaseAmount: 1, purchaseUnit: '食', purchasePrice: 55 },
                { id: 'm6', name: '味噌汁・小鉢', usageAmount: 1, usageUnit: '食', purchaseAmount: 1, purchaseUnit: '食', purchasePrice: 40 }
            ]
        },
        {
            id: 'caffe_latte',
            name: '特製カフェラテ (アイス)',
            sellingPrice: 580,
            targetCostRate: 25,
            materials: [
                { id: 'm1', name: 'エスプレッソ豆 (深煎り)', usageAmount: 18, usageUnit: 'g', purchaseAmount: 500, purchaseUnit: 'g', purchasePrice: 1600 },
                { id: 'm2', name: '成分無調整牛乳', usageAmount: 180, usageUnit: 'ml', purchaseAmount: 1, purchaseUnit: 'L', purchasePrice: 248 },
                { id: 'm3', name: 'テイクアウトカップ・フタ', usageAmount: 1, usageUnit: '個', purchaseAmount: 100, purchaseUnit: '個', purchasePrice: 1800 },
                { id: 'm4', name: 'ストロー・スリーブ', usageAmount: 1, usageUnit: '個', purchaseAmount: 100, purchaseUnit: '個', purchasePrice: 500 }
            ]
        },
        {
            id: 'cake',
            name: 'いちごショートケーキ (1カット)',
            sellingPrice: 650,
            targetCostRate: 28,
            materials: [
                { id: 'm1', name: '国産いちご (2粒)', usageAmount: 2, usageUnit: '個', purchaseAmount: 20, purchaseUnit: '個', purchasePrice: 780 },
                { id: 'm2', name: '純生クリーム (38%)', usageAmount: 60, usageUnit: 'ml', purchaseAmount: 1, purchaseUnit: 'L', purchasePrice: 1200 },
                { id: 'm3', name: 'スポンジ生地 (1/8台)', usageAmount: 1, usageUnit: '食', purchaseAmount: 1, purchaseUnit: '食', purchasePrice: 45 },
                { id: 'm4', name: 'ケーキ箱・フィルム', usageAmount: 1, usageUnit: '個', purchaseAmount: 50, purchaseUnit: '個', purchasePrice: 1100 }
            ]
        },
        {
            id: 'handmade',
            name: 'ハンドメイド布製トートバッグ',
            sellingPrice: 3800,
            targetCostRate: 35,
            materials: [
                { id: 'm1', name: '倉敷帆布 (11号)', usageAmount: 0.5, usageUnit: 'm', purchaseAmount: 1, purchaseUnit: 'm', purchasePrice: 1200 },
                { id: 'm2', name: '持ち手用アクリルテープ', usageAmount: 1.2, usageUnit: 'm', purchaseAmount: 10, purchaseUnit: 'm', purchasePrice: 1500 },
                { id: 'm3', name: 'マグネットホック', usageAmount: 1, usageUnit: '個', purchaseAmount: 10, purchaseUnit: '個', purchasePrice: 600 },
                { id: 'm4', name: 'ブランドタグ・包装資材', usageAmount: 1, usageUnit: '個', purchaseAmount: 50, purchaseUnit: '個', purchasePrice: 2000 }
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
        const title = (productName || '').trim() || '名称未設定の商品';
        const dateStr = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
        
        let text = `【原価率・粗利 計算書】\n`;
        text += `商品名: ${title}\n`;
        text += `計算日: ${dateStr}\n`;
        text += `----------------------------------------\n`;
        text += `■ 材料明細\n`;

        summary.materials.forEach((m, idx) => {
            const costStr = m.isValid ? `¥${Math.round(m.calculatedCost).toLocaleString()}` : '(計算不可)';
            const name = m.name || `材料${idx + 1}`;
            text += `${idx + 1}. ${name.padEnd(12, ' ')} : ${m.usageAmount}${m.usageUnit} (仕入 ${m.purchaseAmount}${m.purchaseUnit} ¥${m.purchasePrice.toLocaleString()}) → ${costStr}\n`;
        });

        text += `----------------------------------------\n`;
        text += `■ 計算結果サマリー\n`;
        text += `合計商品原価 : ¥${Math.round(summary.totalCost).toLocaleString()}\n`;
        text += `販売価格     : ¥${Math.round(summary.sellingPrice).toLocaleString()}\n`;
        text += `原価率       : ${summary.costRate.toFixed(1)}%\n`;
        text += `粗利益額     : ¥${Math.round(summary.grossProfit).toLocaleString()}\n`;
        text += `粗利益率     : ${summary.grossProfitRate.toFixed(1)}%\n`;

        if (summary.targetCostRate && summary.targetSellingPrice) {
            text += `\n■ 目標原価率シミュレーション\n`;
            text += `目標原価率   : ${summary.targetCostRate}%\n`;
            text += `必要販売価格 : ¥${summary.targetSellingPrice.toLocaleString()} (逆算値)\n`;
        }

        text += `----------------------------------------\n`;
        text += `※ 原価率らくらく計算 (https://tk030-lotto.github.io/cost-rate-calculator/)\n`;

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
