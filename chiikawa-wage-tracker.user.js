// ==UserScript==
// @name         Chiikawa 即時工資增長器 - 激勵工作版
// @namespace    https://greasyfork.org/
// @version      1.5
// @description  開著瀏覽器就有 Chiikawa 陪你計算每月工資進度（按日期自動計算），刷新不重置，設定永久保存。
// @author       Grok for Jason's friend
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const CHIIKAWA_IMG = 'https://crystalpng.com/wp-content/uploads/2025/05/chiikawa-png.png';

    const DEFAULTS = {
        monthlySalary: 20000,
        payday: 25,
        currency: 'HKD'
    };

    let settings = {
        monthlySalary: GM_getValue('monthlySalary', DEFAULTS.monthlySalary),
        payday: GM_getValue('payday', DEFAULTS.payday),
        currency: GM_getValue('currency', DEFAULTS.currency)
    };

    function calculateEarned() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const payday = settings.payday;

        let lastPayday = new Date(currentYear, currentMonth, payday);
        if (now < lastPayday) {
            lastPayday = new Date(currentYear, currentMonth - 1, payday);
        }

        let nextPayday = new Date(lastPayday);
        nextPayday.setMonth(nextPayday.getMonth() + 1);
        if (nextPayday.getDate() !== payday) {
            nextPayday = new Date(nextPayday.getFullYear(), nextPayday.getMonth(), 0);
        }

        const cycleStart = lastPayday.getTime();
        const cycleEnd = nextPayday.getTime();
        const totalCycleMs = cycleEnd - cycleStart;
        const elapsedMs = now.getTime() - cycleStart;

        const progress = Math.min(Math.max(elapsedMs / totalCycleMs, 0), 1);
        const earned = progress * settings.monthlySalary;

        return earned;
    }

    function saveSettings() {
        GM_setValue('monthlySalary', settings.monthlySalary);
        GM_setValue('payday', settings.payday);
        GM_setValue('currency', settings.currency);
    }

    const container = document.createElement('div');
    container.id = 'chiikawa-wage-widget';
    container.innerHTML = `
        <div class="chiikawa-header">
            <img src="${CHIIKAWA_IMG}" class="chiikawa-img" alt="Chiikawa">
            <div class="title">ちいかわ工資計</div>
            <button class="min-btn" title="縮小">−</button>
            <button class="set-btn" title="設定">⚙</button>
        </div>
        <div class="chiikawa-body">
            <div class="earned-label">本週期已賺取</div>
            <div class="earned-amount">0.000000</div>
            <div class="rate-info">每秒：0.000000 ${settings.currency}</div>
            <div class="progress-info">月份進度計算中...</div>
            <div class="motivational">輸股票？繼續加油！錢在增長中 💪</div>
        </div>
        <div class="chiikawa-settings" style="display:none;">
            <label>月薪：<input type="number" id="salary-input" value="${settings.monthlySalary}" step="100"></label>
            <label>發薪日（幾號）：<input type="number" id="payday-input" value="${settings.payday}" min="1" max="31"></label>
            <label>貨幣：<input type="text" id="currency-input" value="${settings.currency}" maxlength="5"></label>
            <div style="font-size:11px;color:#888;margin:4px 0;">設定會永久保存，刷新不會消失</div>
            <button id="save-btn">儲存</button>
        </div>
    `;
    document.body.appendChild(container);

    GM_addStyle(`
        #chiikawa-wage-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 280px;
            background: linear-gradient(135deg, #fff9f0, #ffeef5);
            border: 3px solid #ffb6c1;
            border-radius: 20px;
            box-shadow: 0 8px 25px rgba(255, 182, 193, 0.4);
            font-family: 'Segoe UI', 'Microsoft JhengHei', sans-serif;
            z-index: 999999;
            overflow: hidden;
            transition: all 0.3s ease;
            user-select: none;
        }
        #chiikawa-wage-widget.minimized {
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }
        #chiikawa-wage-widget.minimized .chiikawa-body,
        #chiikawa-wage-widget.minimized .chiikawa-settings,
        #chiikawa-wage-widget.minimized .title,
        #chiikawa-wage-widget.minimized .set-btn {
            display: none !important;
        }
        #chiikawa-wage-widget.minimized .chiikawa-header {
            padding: 0;
            justify-content: center;
        }
        #chiikawa-wage-widget.minimized .chiikawa-img {
            width: 70px;
            height: 70px;
            margin: 5px;
        }
        .chiikawa-header {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            background: #ffd6e0;
            cursor: move;
        }
        .chiikawa-img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 8px;
            object-fit: cover;
            border: 2px solid #fff;
            animation: chiikawaBounce 1.2s ease-in-out infinite, chiikawaWiggle 2.5s ease-in-out infinite;
        }
        @keyframes chiikawaBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
        }
        @keyframes chiikawaWiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
        }
        #chiikawa-wage-widget.minimized .chiikawa-img {
            animation: chiikawaBounce 1.2s ease-in-out infinite;
        }
        .title {
            flex: 1;
            font-weight: bold;
            color: #ff69b4;
            font-size: 14px;
        }
        .min-btn, .set-btn {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #ff69b4;
            padding: 0 5px;
        }
        .chiikawa-body {
            padding: 12px;
            text-align: center;
        }
        .earned-label {
            font-size: 12px;
            color: #888;
            margin-bottom: 4px;
        }
        .earned-amount {
            font-size: 22px;
            font-weight: bold;
            color: #ff1493;
            font-family: 'Courier New', monospace;
            letter-spacing: 0.5px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            word-break: break-all;
        }
        .rate-info, .progress-info {
            font-size: 12px;
            color: #666;
            margin: 4px 0;
        }
        .motivational {
            font-size: 11px;
            color: #ff69b4;
            margin-top: 8px;
            font-style: italic;
        }
        .chiikawa-settings {
            padding: 10px 12px;
            background: #fff;
            border-top: 1px dashed #ffb6c1;
        }
        .chiikawa-settings label {
            display: block;
            margin: 6px 0;
            font-size: 12px;
            color: #555;
        }
        .chiikawa-settings input {
            width: 100%;
            padding: 4px 6px;
            border: 1px solid #ffb6c1;
            border-radius: 6px;
            box-sizing: border-box;
        }
        .chiikawa-settings button {
            margin: 4px 2px 0 0;
            padding: 4px 10px;
            background: #ff69b4;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
        }
        .chiikawa-settings button:hover {
            background: #ff1493;
        }
    `);

    const earnedEl = container.querySelector('.earned-amount');
    const rateEl = container.querySelector('.rate-info');
    const progressEl = container.querySelector('.progress-info');
    const minBtn = container.querySelector('.min-btn');
    const setBtn = container.querySelector('.set-btn');
    const settingsPanel = container.querySelector('.chiikawa-settings');
    const saveBtn = container.querySelector('#save-btn');

    function updateDisplay() {
        const earned = calculateEarned();
        const now = new Date();
        const payday = settings.payday;
        let lastPayday = new Date(now.getFullYear(), now.getMonth(), payday);
        if (now < lastPayday) lastPayday = new Date(now.getFullYear(), now.getMonth() - 1, payday);
        let nextPayday = new Date(lastPayday);
        nextPayday.setMonth(nextPayday.getMonth() + 1);
        const cycleSeconds = (nextPayday.getTime() - lastPayday.getTime()) / 1000;
        const perSecond = settings.monthlySalary / cycleSeconds;

        earnedEl.textContent = earned.toFixed(10);
        rateEl.textContent = `每秒：${perSecond.toFixed(10)} ${settings.currency}`;
        progressEl.textContent = `發薪日：每月 ${payday} 號 · 進度計算中`;
    }

    function updateLoop() {
        updateDisplay();
        requestAnimationFrame(updateLoop);
    }
    updateLoop();

    let isMinimized = false;
    minBtn.onclick = () => {
        isMinimized = !isMinimized;
        container.classList.toggle('minimized', isMinimized);
        minBtn.textContent = isMinimized ? '+' : '−';
    };

    setBtn.onclick = () => {
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    };

    saveBtn.onclick = () => {
        settings.monthlySalary = parseFloat(document.getElementById('salary-input').value) || DEFAULTS.monthlySalary;
        settings.payday = parseInt(document.getElementById('payday-input').value) || DEFAULTS.payday;
        settings.currency = document.getElementById('currency-input').value || DEFAULTS.currency;
        saveSettings();
        settingsPanel.style.display = 'none';
        alert('設定已儲存！（會永久保留）');
    };

    let isDragging = false, offsetX, offsetY;
    const header = container.querySelector('.chiikawa-header');
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            container.style.left = (e.clientX - offsetX) + 'px';
            container.style.top = (e.clientY - offsetY) + 'px';
            container.style.right = 'auto';
            container.style.bottom = 'auto';
        }
    });
    document.addEventListener('mouseup', () => isDragging = false);

    container.querySelector('.chiikawa-img').onclick = minBtn.onclick;

    console.log('[Chiikawa Wage] 已啟動（按月份進度計算）');
})();
