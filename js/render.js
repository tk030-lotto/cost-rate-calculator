/**
 * @file render.js
 * @description UI描画・DOM構築モジュール
 */

(function(global) {
    function getUnitsModule() {
        return global.CostCalcUnits;
    }

    function getCalcModule() {
        return global.CostCalcCalculator;
    }

    function renderUnitOptions(selectedUnit) {
        const unitsMod = getUnitsModule();
        return Object.keys(unitsMod.UNIT_DEFINITIONS).map(u => {
            const isSel = u === selectedUnit ? 'selected' : '';
            return `<option value="${u}" ${isSel}>${u}</option>`;
        }).join('');
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[m]);
    }

    function renderMaterialsList({ container, countBadge, materials, onFieldChange, onRemove }) {
        container.innerHTML = '';
        countBadge.textContent = `${materials.length}件`;

        materials.forEach((m) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'material-item';
            itemEl.dataset.id = m.id;

            itemEl.innerHTML = `
                <div class="material-header-row">
                    <input type="text" class="form-input material-name-input" placeholder="材料名 (例: ひき肉)" value="${escapeHtml(m.name)}" data-field="name">
                    <button type="button" class="btn-remove" title="削除" aria-label="材料を削除">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="material-fields-grid">
                    <div>
                        <label class="form-label" style="font-size:0.75rem;">使用量</label>
                        <input type="number" class="form-input" value="${m.usageAmount}" step="any" min="0" data-field="usageAmount">
                    </div>
                    <div>
                        <label class="form-label" style="font-size:0.75rem;">使用単位</label>
                        <select class="form-select" data-field="usageUnit">
                            ${renderUnitOptions(m.usageUnit)}
                        </select>
                    </div>
                    <div>
                        <label class="form-label" style="font-size:0.75rem;">仕入量 (単位)</label>
                        <div style="display:flex; gap:4px;">
                            <input type="number" class="form-input" style="flex:1;" value="${m.purchaseAmount}" step="any" min="0.001" data-field="purchaseAmount">
                            <select class="form-select" style="width:70px;" data-field="purchaseUnit">
                                ${renderUnitOptions(m.purchaseUnit)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="form-label" style="font-size:0.75rem;">仕入価格(円)</label>
                        <input type="number" class="form-input" value="${m.purchasePrice}" step="1" min="0" data-field="purchasePrice">
                    </div>
                </div>
                <div class="material-calc-footer">
                    <span style="color:var(--text-muted);">算出原価:</span>
                    <span class="material-cost-val" id="cost-val-${m.id}">¥0</span>
                </div>
            `;

            itemEl.querySelectorAll('input, select').forEach(input => {
                input.addEventListener('input', (e) => {
                    const target = /** @type {HTMLInputElement | HTMLSelectElement} */ (e.target);
                    const field = target.dataset.field;
                    if (!field) return;

                    const val = (field === 'name' || field === 'usageUnit' || field === 'purchaseUnit')
                        ? target.value
                        : parseFloat(target.value) || 0;

                    onFieldChange(m.id, field, val);
                });
            });

            const removeBtn = itemEl.querySelector('.btn-remove');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => onRemove(m.id));
            }

            container.appendChild(itemEl);
        });
    }

    function renderSummaryPanel({ summary, elements }) {
        const {
            resTotalCost, resSellingPrice, resCostRate, resGaugeBadge,
            resGrossProfit, resGrossProfitRate, reverseCalcBox,
            resTargetRateLabel, resTargetSellingPrice
        } = elements;

        summary.materials.forEach(m => {
            const el = document.getElementById(`cost-val-${m.id}`);
            if (el) {
                if (m.isValid) {
                    el.textContent = `¥${Math.round(m.calculatedCost).toLocaleString()} (${m.calculatedCost.toFixed(1)}円)`;
                    el.style.color = 'var(--accent-emerald)';
                } else {
                    el.textContent = m.error || '計算不可';
                    el.style.color = 'var(--accent-rose)';
                }
            }
        });

        resTotalCost.textContent = `¥${Math.round(summary.totalCost).toLocaleString()}`;
        resSellingPrice.textContent = `¥${Math.round(summary.sellingPrice).toLocaleString()}`;

        if (summary.sellingPrice > 0) {
            resCostRate.innerHTML = `${summary.costRate.toFixed(1)}<span style="font-size: 1.4rem;">%</span>`;
            resGrossProfit.textContent = `¥${Math.round(summary.grossProfit).toLocaleString()}`;
            resGrossProfitRate.textContent = `${summary.grossProfitRate.toFixed(1)}%`;

            const calcMod = getCalcModule();
            const status = calcMod.getCostRateStatus(summary.costRate);
            resCostRate.className = `gauge-value status-${status.level}`;
            resGaugeBadge.textContent = `${status.label} : ${status.description}`;
            resGaugeBadge.className = `gauge-status-badge status-${status.level}`;
        } else {
            resCostRate.innerHTML = `0.0<span style="font-size: 1.4rem;">%</span>`;
            resCostRate.className = 'gauge-value';
            resGrossProfit.textContent = `¥0`;
            resGrossProfitRate.textContent = `0.0%`;
            resGaugeBadge.textContent = '販売価格を入力してください';
            resGaugeBadge.className = 'gauge-status-badge';
        }

        if (summary.targetCostRate && summary.targetSellingPrice) {
            reverseCalcBox.style.display = 'block';
            resTargetRateLabel.textContent = `目標 ${summary.targetCostRate}%`;
            resTargetSellingPrice.textContent = `¥${summary.targetSellingPrice.toLocaleString()}`;
        } else {
            reverseCalcBox.style.display = 'none';
        }
    }

    const exports = {
        renderUnitOptions,
        escapeHtml,
        renderMaterialsList,
        renderSummaryPanel
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exports;
    } else {
        global.CostCalcRender = exports;
    }
})(typeof window !== 'undefined' ? window : globalThis);
