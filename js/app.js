/**
 * @file app.js
 * @description 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ繧ｨ繝ｳ繝医Μ繝ｼ繝昴う繝ｳ繝医∫憾諷狗ｮ｡逅・・繧､繝吶Φ繝育ｵｱ諡ｬ
 */

(function(global) {
    const unitsMod = global.CostCalcUnits;
    const calcMod = global.CostCalcCalculator;
    const storageMod = global.CostCalcStorage;
    const renderMod = global.CostCalcRender;

    // Application State
    let state = {
        productName: '',
        sellingPrice: 1000,
        targetCostRate: 30,
        materials: []
    };

    // DOM References
    let productNameInput;
    let sellingPriceInput;
    let targetCostRateInput;
    let materialsContainer;
    let materialCountBadge;
    let btnAddMaterial;
    let btnCopyResult;
    let btnClearAll;
    let toastEl;
    let resultElements;

    function init() {
        productNameInput = document.getElementById('product-name');
        sellingPriceInput = document.getElementById('selling-price');
        targetCostRateInput = document.getElementById('target-cost-rate');
        materialsContainer = document.getElementById('materials-container');
        materialCountBadge = document.getElementById('material-count-badge');
        btnAddMaterial = document.getElementById('btn-add-material');
        btnCopyResult = document.getElementById('btn-copy-result');
        btnClearAll = document.getElementById('btn-clear-all');
        toastEl = document.getElementById('toast');

        resultElements = {
            resCostRate: document.getElementById('res-cost-rate'),
            resGaugeBadge: document.getElementById('res-gauge-badge'),
            resTotalCost: document.getElementById('res-total-cost'),
            resSellingPrice: document.getElementById('res-selling-price'),
            resGrossProfit: document.getElementById('res-gross-profit'),
            resGrossProfitRate: document.getElementById('res-gross-profit-rate'),
            reverseCalcBox: document.getElementById('reverse-calc-box'),
            resTargetRateLabel: document.getElementById('res-target-rate-label'),
            resTargetSellingPrice: document.getElementById('res-target-selling-price')
        };

        setupEventListeners();

        const saved = storageMod.loadState();
        if (saved && Array.isArray(saved.materials) && saved.materials.length > 0) {
            state = saved;
            syncInputsFromState();
        } else {
            loadPreset('hamburg');
        }

        render();
    }

    function setupEventListeners() {
        productNameInput.addEventListener('input', (e) => {
            state.productName = e.target.value;
            saveAndRender();
        });

        sellingPriceInput.addEventListener('input', (e) => {
            state.sellingPrice = parseFloat(e.target.value) || 0;
            saveAndRender();
        });

        targetCostRateInput.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            state.targetCostRate = isNaN(val) ? 0 : val;
            saveAndRender();
        });

        btnAddMaterial.addEventListener('click', addMaterialItem);
        btnCopyResult.addEventListener('click', handleCopyResult);
        btnClearAll.addEventListener('click', handleClearAll);

        document.querySelectorAll('.quick-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                if (target.dataset.val) {
                    state.sellingPrice = parseFloat(target.dataset.val);
                    sellingPriceInput.value = target.dataset.val;
                    saveAndRender();
                } else if (target.dataset.target) {
                    state.targetCostRate = parseFloat(target.dataset.target);
                    targetCostRateInput.value = target.dataset.target;
                    saveAndRender();
                }
            });
        });

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const presetId = e.currentTarget.dataset.preset;
                if (presetId) loadPreset(presetId);
            });
        });
    }

    function loadPreset(presetId) {
        const preset = storageMod.PRESETS.find(p => p.id === presetId);
        if (!preset) return;

        state = JSON.parse(JSON.stringify(preset));
        syncInputsFromState();
        saveAndRender();
        showToast(`繝励Μ繧ｻ繝・ヨ縲・{preset.name}縲阪ｒ隱ｭ縺ｿ霎ｼ縺ｿ縺ｾ縺励◆`);
    }

    function syncInputsFromState() {
        productNameInput.value = state.productName || '';
        sellingPriceInput.value = state.sellingPrice > 0 ? String(state.sellingPrice) : '';
        targetCostRateInput.value = state.targetCostRate > 0 ? String(state.targetCostRate) : '';
        renderMaterials();
    }

    function addMaterialItem() {
        const newId = 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        state.materials.push({
            id: newId,
            name: '',
            usageAmount: 100,
            usageUnit: 'g',
            purchaseAmount: 1,
            purchaseUnit: 'kg',
            purchasePrice: 1000
        });
        renderMaterials();
        saveAndRender();
    }

    function renderMaterials() {
        renderMod.renderMaterialsList({
            container: materialsContainer,
            countBadge: materialCountBadge,
            materials: state.materials,
            onFieldChange: (id, field, value) => {
                const item = state.materials.find(m => m.id === id);
                if (item) {
                    item[field] = value;
                    if (field === 'usageUnit' && (!item.purchaseUnit || item.purchaseUnit === 'g')) {
                        if (item.usageUnit === 'ml') item.purchaseUnit = 'L';
                        else if (item.usageUnit === '蛟・) item.purchaseUnit = '蛟・;
                    }
                    saveAndRender();
                }
            },
            onRemove: (id) => {
                state.materials = state.materials.filter(m => m.id !== id);
                renderMaterials();
                saveAndRender();
            }
        });
    }

    function saveAndRender() {
        storageMod.saveState(state);
        render();
    }

    function render() {
        const summary = calcMod.calculateCostSummary({
            materials: state.materials,
            sellingPrice: state.sellingPrice,
            targetCostRate: state.targetCostRate
        });

        renderMod.renderSummaryPanel({
            summary,
            elements: resultElements
        });
    }

    function handleCopyResult() {
        const summary = calcMod.calculateCostSummary({
            materials: state.materials,
            sellingPrice: state.sellingPrice,
            targetCostRate: state.targetCostRate
        });

        const text = storageMod.formatResultAsText({
            productName: state.productName,
            summary
        });

        navigator.clipboard.writeText(text).then(() => {
            showToast('搭 險育ｮ礼ｵ先棡繧偵け繝ｪ繝・・繝懊・繝峨↓繧ｳ繝斐・縺励∪縺励◆');
        }).catch(() => {
            showToast('繧ｳ繝斐・縺ｫ螟ｱ謨励＠縺ｾ縺励◆');
        });
    }

    function handleClearAll() {
        if (confirm('蜈･蜉帙ｒ縺吶∋縺ｦ繝ｪ繧ｻ繝・ヨ縺励∪縺吶°・・)) {
            storageMod.clearState();
            state = {
                productName: '',
                sellingPrice: 1000,
                targetCostRate: 30,
                materials: []
            };
            syncInputsFromState();
            saveAndRender();
            showToast('蜈･蜉帙ｒ繝ｪ繧ｻ繝・ヨ縺励∪縺励◆');
        }
    }

    function showToast(msg) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        setTimeout(() => {
            toastEl.classList.remove('show');
        }, 2800);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(typeof window !== 'undefined' ? window : globalThis);
