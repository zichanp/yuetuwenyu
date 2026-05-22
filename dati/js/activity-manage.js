/* activity-manage.js — 管理中心子页面 (活动概况 / 机构管理 / 奖证管理)
   报名情况 / 答题情况 / 单位情况 reuse existing pages in data-mgmt.js
   Activity header is prepended globally by navigateTo() when sidebarMode === 'manage'.
*/

// Legacy alias — keeps old navigateTo('activity-manage') calls working
registerPage('activity-manage', () => renderActivityOverview());

// ===== 活动概况 =====
registerPage('activity-overview', () => renderActivityOverview());

function renderActivityOverview() {
    return `
    ${pageHeader('📊 活动概况', '活动管理 / [当前活动] / 活动概况')}

    <!-- Stats cards: 参与人数 / 完成率 / 平均分 / 通过率 -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--spacing-md);margin-bottom:var(--spacing-lg)">
        ${statMetricCard('总参与人数', '528', '↑ 12% 较昨日', 'var(--success)', 'var(--primary)')}
        ${statMetricCard('完成率', '73.1%', '已完成 386 / 528', 'var(--text-muted)', 'var(--success)')}
        ${statMetricCard('平均分', '78.5', '满分 100 分', 'var(--text-muted)', 'var(--warning)')}
        ${statMetricCard('通过率', '82.3%', '及格线 60 分', 'var(--text-muted)', 'var(--color-gold-500)')}
    </div>

    <!-- 参与趋势 + 分数分布 -->
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--spacing-md)">
        <div class="card" style="padding:var(--spacing-lg)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--spacing-md)">
                <h3 style="font-size:var(--font-size-base);font-weight:700">参与趋势</h3>
                <select class="form-control" style="width:auto;padding:4px 10px;font-size:var(--font-size-xs)">
                    <option>最近 7 天</option><option>最近 30 天</option><option>全部</option>
                </select>
            </div>
            ${renderTrendChart()}
        </div>
        <div class="card" style="padding:var(--spacing-lg)">
            <h3 style="font-size:var(--font-size-base);font-weight:700;margin-bottom:var(--spacing-md)">分数分布</h3>
            <div style="display:grid;gap:14px">
                ${scoreBar('90-100 分', 35, 'var(--success)')}
                ${scoreBar('80-89 分',  42, 'var(--color-gold-500)')}
                ${scoreBar('60-79 分',  18, 'var(--warning)')}
                ${scoreBar('60 分以下',  5, 'var(--danger)')}
            </div>
        </div>
    </div>`;
}

function statMetricCard(label, value, sub, subColor, valueColor) {
    return `
    <div class="card" style="padding:var(--spacing-lg);text-align:center">
        <div style="font-size:var(--font-size-xs);color:var(--text-muted);margin-bottom:var(--spacing-xs)">${label}</div>
        <div style="font-size:var(--font-size-3xl);font-weight:700;color:${valueColor}">${value}</div>
        <div style="font-size:var(--font-size-xs);color:${subColor};margin-top:var(--spacing-xxs)">${sub}</div>
    </div>`;
}

function scoreBar(label, pct, color) {
    return `
    <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:var(--font-size-xs);min-width:70px">${label}</span>
        <div style="flex:1;margin:0 var(--spacing-md);height:8px;background:var(--border-color-light);border-radius:var(--radius-sm);overflow:hidden">
            <div style="width:${pct}%;height:100%;background:${color}"></div>
        </div>
        <span style="font-size:var(--font-size-xs);font-weight:700;min-width:34px;text-align:right">${pct}%</span>
    </div>`;
}

function renderTrendChart() {
    // Simple inline SVG line chart
    const days = ['3/06','3/09','3/12','3/15','3/18','3/21','3/24','3/26'];
    const vals = [45, 82, 110, 158, 210, 268, 340, 528];
    const max = Math.max(...vals);
    const W = 560, H = 180, pad = 24;
    const step = (W - pad * 2) / (vals.length - 1);
    const pts = vals.map((v, i) => `${pad + i * step},${H - pad - (v / max) * (H - pad * 2)}`).join(' ');
    const areaPath = `M${pad},${H - pad} L${pts.split(' ').join(' L')} L${pad + (vals.length - 1) * step},${H - pad} Z`;

    return `
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:220px" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
            </linearGradient>
        </defs>
        <path d="${areaPath}" fill="url(#grad1)"/>
        <polyline points="${pts}" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${vals.map((v, i) => {
            const x = pad + i * step;
            const y = H - pad - (v / max) * (H - pad * 2);
            return `<circle cx="${x}" cy="${y}" r="3.5" fill="#fff" stroke="var(--primary)" stroke-width="2"/>`;
        }).join('')}
        ${days.map((d, i) => `<text x="${pad + i * step}" y="${H - 6}" text-anchor="middle" font-size="10" fill="var(--text-muted)">${d}</text>`).join('')}
    </svg>`;
}

// ===== 机构管理 =====
registerPage('org-mgmt', () => renderPublicFeatureEmptyPage());

function roleBadge(role) {
    const map = {
        '主': { cls: 'badge-category', label: '主办单位' },
        '承': { cls: 'badge-quiz', label: '承办单位' },
        '协': { cls: 'badge-mode', label: '协办单位' },
        '支': { cls: 'badge-gray', label: '支持单位' }
    };
    const m = map[role] || map['支'];
    return `<span class="badge ${m.cls}" style="display:inline-flex;align-items:center;gap:6px;font-weight:600">
        <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:currentColor;color:#fff;text-align:center;line-height:16px;font-size:10px;opacity:0.8">${role}</span>
        ${m.label}
    </span>`;
}

// ===== 奖证管理 =====
registerPage('certificate-mgmt', () => renderPlanningEmptyPage('奖项列表', '奖项列表模块正在规划中。'));
