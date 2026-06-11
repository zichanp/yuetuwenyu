/* activity-manage.js — 管理中心子页面 (活动概况 / 机构管理 / 奖证管理)
   报名情况 / 答题情况 / 单位情况 reuse existing pages in data-mgmt.js
   Activity header is prepended globally by navigateTo() when sidebarMode === 'manage'.
*/

// Legacy alias — keeps old navigateTo('activity-manage') calls working
registerPage('activity-manage', () => renderActivityOverview());

// ===== 活动概况 =====
registerPage('activity-overview', () => renderActivityOverview());

let activityOverviewMode = 'exam';

const ACTIVITY_OVERVIEW_MODES = [
    { key: 'exam', label: '在线考试', desc: '考试提交与成绩' },
    { key: 'daily', label: '每日答题', desc: '每日参与与累计' },
    { key: 'level', label: '趣味闯关', desc: '关卡挑战与过关' }
];

function switchActivityOverviewMode(mode) {
    if (!ACTIVITY_OVERVIEW_MODES.some(item => item.key === mode)) return;
    activityOverviewMode = mode;
    const main = document.getElementById('mainContent');
    if (main) main.innerHTML = renderActivityOverview();
}

function getActivityOverviewConfig() {
    const configs = {
        exam: {
            modeLabel: '在线考试',
            meta: [
                '活动时间：2026-03-06 10:10:00 至 2026-03-26 23:59:00',
                '参与范围：集团总部及 8 家分馆',
                '试卷设置：50 题 / 100 分 / 60 分及格',
                '答题规则：每人 1 次正式提交，限时 60 分钟'
            ],
            metrics: [
                ['总参与人数', '528', '↑ 12% 较昨日', '口径：活动范围内已报名或被分配用户', 'var(--success)', 'var(--primary)'],
                ['完成人数', '386', '完成率 73.1%', '口径：已提交正式答卷用户', 'var(--success)', 'var(--success)'],
                ['未完成人数', '142', '其中 51 人未开始', '需运营提醒', 'var(--warning)', 'var(--warning)'],
                ['平均分', '78.5', '满分 100 分', '仅统计已提交用户', 'var(--text-muted)', 'var(--warning)'],
                ['通过率', '82.3%', '及格线 60 分', '通过 318 / 已完成 386', 'var(--text-muted)', 'var(--color-gold-500)'],
                ['高分人数', '135', '90 分以上占 35%', '可用于榜单激励', 'var(--success)', 'var(--info)']
            ],
            trend: {
                title: '参与趋势',
                desc: '查看报名、答题和完成提交的增长情况',
                segments: ['新增参与', '完成提交', '通过人数'],
                days: ['3/06','3/09','3/12','3/15','3/18','3/21','3/24','3/26'],
                values: [45, 82, 110, 158, 210, 268, 340, 528]
            },
            distribution: {
                title: '分数分布',
                desc: '77% 用户集中在 80 分以上',
                bars: [
                    ['90-100 分', '优秀', 35, 'var(--success)'],
                    ['80-89 分', '良好', 42, 'var(--color-gold-500)'],
                    ['60-79 分', '待提升', 18, 'var(--warning)'],
                    ['60 分以下', '未通过', 5, 'var(--danger)']
                ],
                insight: '整体掌握情况较好，60 分以下用户占 5%，建议定向复训。'
            },
            funnel: {
                title: '答题状态漏斗',
                desc: '定位用户卡在报名、开始答题还是提交环节',
                steps: [
                    ['参与人数', 528, 100, 'var(--primary)'],
                    ['已开始答题', 477, 90, 'var(--info)'],
                    ['已完成提交', 386, 73, 'var(--success)'],
                    ['已通过', 318, 60, 'var(--color-gold-500)']
                ]
            },
            todos: [
                ['high', '142 人尚未完成', '建议今天向未开始和答题中用户发送提醒。'],
                ['medium', '3 个组织完成率低于 50%', '优先联系分馆管理员确认组织推进情况。'],
                ['medium', '5 道题正确率低于 60%', '建议检查题目表述或补充对应知识点材料。'],
                ['low', '26 人未通过', '可在活动结束前安排一次复训或补考。']
            ],
            orgRows: [
                ['集团总部', 96, 88, '91.7%', '84.2', '93.2%', 'good'],
                ['城东分馆', 64, 53, '82.8%', '81.6', '88.7%', 'good'],
                ['少儿阅读中心', 72, 51, '70.8%', '77.9', '80.4%', ''],
                ['城西分馆', 58, 31, '53.4%', '73.1', '74.2%', 'warn'],
                ['流动服务站', 45, 19, '42.2%', '69.8', '63.2%', 'risk']
            ],
            questionTitle: '低正确率题目',
            questionDesc: '用于判断知识点薄弱项和题目质量',
            questionRows: [
                ['古籍修复中“揭裱”的主要目的是什么？', '单选题', '古籍保护', 48, 201],
                ['公共图书馆数字资源授权边界判断', '多选题', '版权常识', 52, 185],
                ['读者证跨馆通借规则适用场景', '判断题', '服务规范', 57, 166],
                ['地方文献入藏优先级排序', '排序题', '馆藏建设', 59, 158]
            ]
        },
        daily: {
            modeLabel: '每日答题',
            meta: [
                '活动时间：2026-03-06 至 2026-03-26',
                '开放规则：每日 09:00 至 18:00 可答题',
                '题目设置：每日 10 题 / 达标 6 题',
                '成绩规则：按每日最高分累计'
            ],
            metrics: [
                ['参与用户', '486', '连续参与 212 人', '至少完成 1 天答题用户', 'var(--success)', 'var(--primary)'],
                ['累计答题天数', '2,184', '人均 4.5 天', '所有用户已完成答题天数合计', 'var(--success)', 'var(--success)'],
                ['今日未答', '176', '需提醒', '今日尚未提交答题用户', 'var(--warning)', 'var(--warning)'],
                ['累计平均分', '82.8', '每日最高分累计均值', '仅统计已参与用户', 'var(--text-muted)', 'var(--warning)'],
                ['达标率', '83.9%', '达标 324 / 完成 386', '当日最高分达到达标线', 'var(--text-muted)', 'var(--color-gold-500)'],
                ['连续 7 天', '68', '可发放激励', '连续答题达到 7 天用户', 'var(--success)', 'var(--info)']
            ],
            trend: {
                title: '每日参与趋势',
                desc: '查看每日答题提交与达标增长情况',
                segments: ['答题人数', '达标人数', '连续人数'],
                days: ['3/06','3/09','3/12','3/15','3/18','3/21','3/24','3/26'],
                values: [38, 76, 118, 164, 208, 258, 318, 386]
            },
            distribution: {
                title: '累计得分分布',
                desc: '高活跃用户集中在 80 分以上',
                bars: [
                    ['90 分以上', '优秀', 28, 'var(--success)'],
                    ['80-89 分', '良好', 39, 'var(--color-gold-500)'],
                    ['60-79 分', '待提升', 25, 'var(--warning)'],
                    ['60 分以下', '需提醒', 8, 'var(--danger)']
                ],
                insight: '每日答题参与稳定，建议重点提醒今日未答和连续中断用户。'
            },
            funnel: {
                title: '每日答题漏斗',
                desc: '定位用户从参与到达标的转化情况',
                steps: [
                    ['报名用户', 528, 100, 'var(--primary)'],
                    ['参与答题', 486, 92, 'var(--info)'],
                    ['完成当日答题', 386, 73, 'var(--success)'],
                    ['达到达标线', 324, 61, 'var(--color-gold-500)']
                ]
            },
            todos: [
                ['high', '176 人今日未答', '建议在每日答题关闭前发送一次提醒。'],
                ['medium', '4 个组织达标率低于 70%', '建议联系单位管理员推进每日参与。'],
                ['medium', '连续答题中断用户 39 人', '可通过积分或证书提醒恢复参与。'],
                ['low', '8% 用户累计得分低于 60 分', '建议补充每日解析和复习材料。']
            ],
            orgRows: [
                ['集团总部', 96, 91, '94.8%', '86.1', '90.2%', 'good'],
                ['城东分馆', 64, 57, '89.1%', '83.4', '86.0%', 'good'],
                ['少儿阅读中心', 72, 58, '80.6%', '79.2', '78.8%', ''],
                ['城西分馆', 58, 39, '67.2%', '72.8', '69.4%', 'warn'],
                ['流动服务站', 45, 24, '53.3%', '68.5', '61.1%', 'risk']
            ],
            questionTitle: '低达标题目',
            questionDesc: '用于判断每日答题薄弱知识点',
            questionRows: [
                ['读者证挂失后是否仍可借阅？', '判断题', '服务规范', 54, 126],
                ['数字资源远程访问的授权条件', '多选题', '数字资源', 58, 119],
                ['馆内自助借还设备异常处理', '单选题', '读者服务', 61, 104],
                ['文献检索关键词组合规则', '填空题', '检索技能', 63, 98]
            ]
        },
        level: {
            modeLabel: '趣味闯关',
            meta: [
                '活动时间：2026-03-06 至 2026-03-26',
                '闯关规则：按顺序解锁关卡',
                '关卡设置：3 关 / 每关 50 题 / 答对 30 题过关',
                '挑战规则：每关最多 3 次挑战'
            ],
            metrics: [
                ['参与闯关人数', '438', '完成至少 1 关', '进入过任意关卡的用户', 'var(--success)', 'var(--primary)'],
                ['通关人数', '168', '全关卡通过', '已完成全部关卡用户', 'var(--success)', 'var(--success)'],
                ['停留人数', '270', '需继续挑战', '仍停留在未通过关卡', 'var(--warning)', 'var(--warning)'],
                ['平均过关数', '1.8', '共 3 关', '按参与闯关用户计算', 'var(--text-muted)', 'var(--warning)'],
                ['通关率', '38.4%', '168 / 438', '通过全部关卡比例', 'var(--text-muted)', 'var(--color-gold-500)'],
                ['满关高效通关', '42', '用时前 25%', '适合榜单激励', 'var(--success)', 'var(--info)']
            ],
            trend: {
                title: '闯关进度趋势',
                desc: '查看参与闯关、过关和完成全关的增长情况',
                segments: ['参与闯关', '通过关卡', '全关通关'],
                days: ['3/06','3/09','3/12','3/15','3/18','3/21','3/24','3/26'],
                values: [24, 58, 94, 140, 196, 255, 326, 438]
            },
            distribution: {
                title: '关卡停留分布',
                desc: '识别用户集中卡住的关卡',
                bars: [
                    ['第 1 关', '基础', 18, 'var(--success)'],
                    ['第 2 关', '进阶', 42, 'var(--color-gold-500)'],
                    ['第 3 关', '综合', 31, 'var(--warning)'],
                    ['未开始', '待提醒', 9, 'var(--danger)']
                ],
                insight: '第 2 关停留人数较多，建议检查题目难度和关卡说明。'
            },
            funnel: {
                title: '闯关漏斗',
                desc: '定位用户从开始闯关到全关通关的转化情况',
                steps: [
                    ['报名用户', 528, 100, 'var(--primary)'],
                    ['参与闯关', 438, 83, 'var(--info)'],
                    ['通过至少 1 关', 286, 54, 'var(--success)'],
                    ['完成全部关卡', 168, 32, 'var(--color-gold-500)']
                ]
            },
            todos: [
                ['high', '270 人仍未完成全关', '建议提醒停留用户继续挑战。'],
                ['medium', '第 2 关停留占比 42%', '建议复核该关题目难度和提示文案。'],
                ['medium', '3 个组织闯关成功率低于 40%', '可联系单位管理员组织集中答题。'],
                ['low', '42 人高效通关', '可作为排行榜或证书激励对象。']
            ],
            orgRows: [
                ['集团总部', 96, 42, '43.8%', '2.1 关', '48.6%', 'good'],
                ['城东分馆', 64, 28, '43.8%', '1.9 关', '44.4%', 'good'],
                ['少儿阅读中心', 72, 24, '33.3%', '1.7 关', '38.2%', ''],
                ['城西分馆', 58, 15, '25.9%', '1.4 关', '29.6%', 'warn'],
                ['流动服务站', 45, 8, '17.8%', '1.1 关', '21.1%', 'risk']
            ],
            questionTitle: '低通过关卡题',
            questionDesc: '用于判断关卡卡点和题目质量',
            questionRows: [
                ['阅读常识中，哪些环节属于有效答题过程？', '多选题', '第 1 关', 49, 133],
                ['历史文化中的基础规则是否需要按顺序完成？', '判断题', '第 2 关', 51, 121],
                ['非遗知识的核心关键词是____。', '填空题', '第 3 关', 55, 108],
                ['馆藏分类与地方文献匹配规则', '单选题', '第 2 关', 58, 96]
            ]
        }
    };
    return configs[activityOverviewMode] || configs.exam;
}

function renderActivityOverviewModeTabs() {
    return `
    <section class="card answer-mode-panel activity-overview-mode-panel">
        <div class="answer-mode-tabs" role="tablist" aria-label="活动概览模式">
            ${ACTIVITY_OVERVIEW_MODES.map(mode => `
                <button class="${activityOverviewMode === mode.key ? 'active' : ''}" onclick="switchActivityOverviewMode('${mode.key}')">
                    <strong>${mode.label}</strong>
                    <span>${mode.desc}</span>
                </button>
            `).join('')}
        </div>
        <p>研发查看：切换不同答题模式下的概览口径与运营数据。</p>
    </section>`;
}

function renderActivityOverview() {
    if (currentManageActivity.type === '活动报名') {
        return renderPlanningEmptyPage('活动概览', '活动报名活动概览暂未配置，后续将在这里展示报名活动数据概况。');
    }

    const config = getActivityOverviewConfig();
    return `
    ${pageHeader('📊 活动概况', '活动管理 / [当前活动] / 活动概况')}
    ${renderActivityOverviewModeTabs()}

    <section class="activity-overview-hero">
        <div class="activity-overview-hero-main">
            <div class="activity-status-line">
                <span class="badge badge-green">进行中</span>
                <span>知识问答</span>
                <span>${config.modeLabel}</span>
                <span>剩余 18 天</span>
            </div>
            <h2>${currentManageActivity.name}</h2>
            <div class="activity-meta-grid">
                ${config.meta.map(item => `<span>${item}</span>`).join('')}
            </div>
        </div>
        <div class="activity-overview-actions">
            <button class="btn btn-outline">导出数据</button>
            <button class="btn btn-outline">发送提醒</button>
            <button class="btn btn-primary">查看活动</button>
        </div>
    </section>

    <div class="activity-metric-grid">
        ${config.metrics.map(args => statMetricCard(...args)).join('')}
    </div>

    <div class="activity-overview-grid">
        <section class="card activity-chart-card">
            <div class="activity-card-head">
                <div>
                    <h3>${config.trend.title}</h3>
                    <p>${config.trend.desc}</p>
                </div>
                <div class="activity-segment">
                    ${config.trend.segments.map((label, index) => `<button class="${index === 0 ? 'active' : ''}">${label}</button>`).join('')}
                </div>
            </div>
            ${renderTrendChart(config.trend)}
        </section>

        <section class="card activity-score-card">
            <div class="activity-card-head compact">
                <div>
                    <h3>${config.distribution.title}</h3>
                    <p>${config.distribution.desc}</p>
                </div>
            </div>
            <div class="activity-score-list">
                ${config.distribution.bars.map(args => scoreBar(...args)).join('')}
            </div>
            <div class="activity-insight success">${config.distribution.insight}</div>
        </section>
    </div>

    <div class="activity-overview-grid lower">
        <section class="card">
            <div class="activity-card-head">
                <div>
                    <h3>${config.funnel.title}</h3>
                    <p>${config.funnel.desc}</p>
                </div>
            </div>
            <div class="activity-funnel">
                ${config.funnel.steps.map(args => funnelStep(...args)).join('')}
            </div>
        </section>

        <section class="card">
            <div class="activity-card-head">
                <div>
                    <h3>运营提醒</h3>
                    <p>按当前数据自动生成的待处理事项</p>
                </div>
            </div>
            <div class="activity-todo-list">
                ${config.todos.map(args => todoItem(...args)).join('')}
            </div>
        </section>
    </div>

    <div class="activity-overview-grid table-row">
        <section class="card activity-table-card">
            <div class="activity-card-head">
                <div>
                    <h3>组织完成情况</h3>
                    <p>快速识别推进最好和最需要跟进的单位</p>
                </div>
                <span class="action-link" onclick="navigateTo('unit-data')">查看全部</span>
            </div>
            <table class="activity-overview-table">
                <thead><tr><th>组织名称</th><th>应参与</th><th>已完成</th><th>完成率</th><th>平均分</th><th>通过率</th></tr></thead>
                <tbody>
                    ${config.orgRows.map(args => orgRow(...args)).join('')}
                </tbody>
            </table>
        </section>

        <section class="card activity-table-card">
            <div class="activity-card-head">
                <div>
                    <h3>${config.questionTitle}</h3>
                    <p>${config.questionDesc}</p>
                </div>
                <span class="action-link" onclick="navigateTo('exam-records')">查看答题</span>
            </div>
            <table class="activity-overview-table question">
                <thead><tr><th>题目</th><th>题型</th><th>知识点</th><th>正确率</th><th>错误人数</th></tr></thead>
                <tbody>
                    ${config.questionRows.map(args => questionRow(...args)).join('')}
                </tbody>
            </table>
        </section>
    </div>`;
}

function statMetricCard(label, value, sub, note, subColor, valueColor) {
    return `
    <div class="card activity-metric-card">
        <div class="activity-metric-label">${label}</div>
        <div class="activity-metric-value" style="color:${valueColor}">${value}</div>
        <div class="activity-metric-sub" style="color:${subColor}">${sub}</div>
        <div class="activity-metric-note">${note}</div>
    </div>`;
}

function scoreBar(label, tag, pct, color) {
    return `
    <div class="activity-score-row">
        <div class="activity-score-label">
            <strong>${label}</strong>
            <span>${tag}</span>
        </div>
        <div class="activity-score-track">
            <div style="width:${pct}%;background:${color}"></div>
        </div>
        <span class="activity-score-pct">${pct}%</span>
    </div>`;
}

function renderTrendChart(trend = {}) {
    // Simple inline SVG line chart
    const days = trend.days || ['3/06','3/09','3/12','3/15','3/18','3/21','3/24','3/26'];
    const vals = trend.values || [45, 82, 110, 158, 210, 268, 340, 528];
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

function funnelStep(label, value, pct, color) {
    return `
    <div class="activity-funnel-step">
        <div class="activity-funnel-top"><span>${label}</span><strong>${value}</strong></div>
        <div class="activity-funnel-track"><div style="width:${pct}%;background:${color}"></div></div>
        <div class="activity-funnel-pct">${pct}%</div>
    </div>`;
}

function todoItem(level, title, desc) {
    const map = { high: '高', medium: '中', low: '低' };
    return `
    <div class="activity-todo-item ${level}">
        <span>${map[level]}</span>
        <div><strong>${title}</strong><p>${desc}</p></div>
    </div>`;
}

function orgRow(name, total, done, completion, avg, pass, state) {
    const stateClass = state ? ` ${state}` : '';
    return `<tr><td><strong>${name}</strong></td><td>${total}</td><td>${done}</td><td><span class="activity-rate${stateClass}">${completion}</span></td><td>${avg}</td><td>${pass}</td></tr>`;
}

function questionRow(title, type, topic, rate, wrong) {
    return `<tr><td><strong>${title}</strong></td><td><span class="badge ${questionTypeBadgeClass(type)}">${type}</span></td><td>${topic}</td><td><span class="activity-rate ${rate < 55 ? 'risk' : 'warn'}">${rate}%</span></td><td>${wrong}</td></tr>`;
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
registerPage('certificates', () => renderActivityCertificatePage());

const activityCertificateState = {
    keyword: '',
    status: '全部'
};

const activityCertificateList = [
    { id: 1, name: '参赛证明', isDefault: true, method: '自动发放', createTime: '-', issueTime: '-', status: '-', actions: ['record'] },
    { id: 2, name: '活动证明二', method: '手动发放', createTime: '2026-01-03 15:21', issueTime: '-', status: '未发放', actions: ['issue', 'record', 'edit', 'delete'] },
    { id: 3, name: '活动证明三', method: '手动发放', createTime: '2026-01-03 15:21', issueTime: '2026-01-08 15:21', status: '已发放', actions: ['issue', 'revoke', 'record', 'edit', 'delete'] }
];

function renderActivityCertificatePage() {
    const rows = getFilteredActivityCertificates().map(renderActivityCertificateRow).join('');

    return `
    <section class="activity-certificate-page">
        <div class="activity-certificate-title"><span>奖证管理</span> / <strong>活动证明</strong></div>

        <div class="activity-certificate-panel">
            <div class="activity-certificate-tip">
                <h3>活动证明说明</h3>
                <ul>
                    <li><strong>发放对象：</strong>考试答题用户提交答卷后自动发放参与证明；每日答题用户完成任意一天答题并提交结果后自动发放参与证明；趣味闯关用户开始答题并产生有效答题记录后自动发放参与证明。</li>
                    <li><strong>自动发放：</strong>系统已内置默认「参赛证明」模板，投稿成功后自动发放给选手。</li>
                    <li><strong>手动发放：</strong>支持新建自定义活动证明，此类证明需由管理员手动发放。</li>
                </ul>
            </div>

            <button class="btn activity-certificate-create" type="button" onclick="openActivityCertificateCreateModal()">+ 新建证明</button>

            <div class="activity-certificate-filter">
                <label>
                    <span>证明名称</span>
                    <input id="activityCertificateKeyword" class="form-control" value="${escapeHtml(activityCertificateState.keyword)}" placeholder="请输入证明名称">
                </label>
                <label>
                    <span>发放状态</span>
                    <select id="activityCertificateStatus" class="form-control">
                        ${['全部', '未发放', '已发放'].map(item => `<option ${activityCertificateState.status === item ? 'selected' : ''}>${item}</option>`).join('')}
                    </select>
                </label>
                <div class="activity-certificate-filter-actions">
                    <button class="btn activity-certificate-query" type="button" onclick="queryActivityCertificates()">查询</button>
                    <button class="btn activity-certificate-reset" type="button" onclick="resetActivityCertificateFilter()">重置</button>
                </div>
            </div>

            <div class="activity-certificate-table-wrap">
                <table class="activity-certificate-table">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>名称</th>
                            <th>发放方式</th>
                            <th>创建时间</th>
                            <th>发放时间</th>
                            <th>发放状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || `<tr><td colspan="7" class="activity-certificate-empty">暂无符合条件的活动证明</td></tr>`}
                    </tbody>
                </table>
            </div>

            <div class="activity-certificate-pagination">
                <strong>共${getFilteredActivityCertificates().length}条</strong>
                <button class="activity-certificate-page-btn disabled" type="button">‹</button>
                <button class="activity-certificate-page-btn active" type="button">1</button>
                <span>...</span>
                <button class="activity-certificate-page-btn" type="button">4</button>
                <button class="activity-certificate-page-btn" type="button">5</button>
                <button class="activity-certificate-page-btn" type="button">6</button>
                <button class="activity-certificate-page-btn" type="button">7</button>
                <button class="activity-certificate-page-btn" type="button">8</button>
                <span>...</span>
                <button class="activity-certificate-page-btn" type="button">100</button>
                <button class="activity-certificate-page-btn" type="button">›</button>
            </div>
        </div>
    </section>`;
}

function getFilteredActivityCertificates() {
    return activityCertificateList.filter(item => {
        const matchKeyword = !activityCertificateState.keyword || item.name.includes(activityCertificateState.keyword);
        const matchStatus = activityCertificateState.status === '全部' || item.status === activityCertificateState.status;
        return matchKeyword && matchStatus;
    });
}

function renderActivityCertificateRow(item) {
    return `
    <tr>
        <td>${item.id}</td>
        <td>
            <span class="activity-certificate-name">${escapeHtml(item.name)}</span>
            ${item.isDefault ? '<span class="activity-certificate-default">默认</span>' : ''}
        </td>
        <td>${item.method}</td>
        <td>${item.createTime}</td>
        <td>${item.issueTime}</td>
        <td>${renderActivityCertificateStatus(item.status)}</td>
        <td><div class="activity-certificate-actions">${renderActivityCertificateActions(item)}</div></td>
    </tr>`;
}

function renderActivityCertificateStatus(status) {
    if (status === '已发放') return '<span class="activity-certificate-issued">已发放</span>';
    if (status === '未发放') return '<span class="activity-certificate-unissued">未发放</span>';
    return '-';
}

function renderActivityCertificateActions(item) {
    const actionMap = {
        issue: { label: '发放', fn: 'issueActivityCertificate' },
        revoke: { label: '撤回', fn: 'revokeActivityCertificate' },
        record: { label: '发放记录', fn: 'openActivityCertificateRecord' },
        edit: { label: '编辑', fn: 'editActivityCertificate' },
        delete: { label: '删除', fn: 'deleteActivityCertificate' }
    };
    return item.actions.map(action => {
        const meta = actionMap[action];
        return `<button type="button" onclick="${meta.fn}(${item.id})">${meta.label}</button>`;
    }).join('');
}

function rerenderActivityCertificates() {
    navigateTo('certificates', { fromTabSwitch: true, reuseTabKey: activeTabKey });
}

function queryActivityCertificates() {
    activityCertificateState.keyword = document.getElementById('activityCertificateKeyword')?.value.trim() || '';
    activityCertificateState.status = document.getElementById('activityCertificateStatus')?.value || '全部';
    rerenderActivityCertificates();
}

function resetActivityCertificateFilter() {
    activityCertificateState.keyword = '';
    activityCertificateState.status = '全部';
    rerenderActivityCertificates();
}

function openActivityCertificateCreateModal() {
    openModal('新建证明', `
        <div class="activity-certificate-modal-form">
            <label><span>证明名称</span><input class="form-control" id="newCertificateName" placeholder="请输入证明名称"></label>
            <label><span>发放方式</span><select class="form-control"><option>手动发放</option><option>自动发放</option></select></label>
            <label><span>适用模式</span><select class="form-control"><option>全部知识问答模式</option><option>考试答题</option><option>每日答题</option><option>闯关答题</option></select></label>
        </div>
    `, () => {
        const name = document.getElementById('newCertificateName')?.value.trim();
        if (!name) return false;
        activityCertificateList.push({
            id: activityCertificateList.length + 1,
            name,
            method: '手动发放',
            createTime: '2026-01-03 15:21',
            issueTime: '-',
            status: '未发放',
            actions: ['issue', 'record', 'edit', 'delete']
        });
        rerenderActivityCertificates();
    }, { confirmText: '保存' });
}

function issueActivityCertificate(id) {
    const item = activityCertificateList.find(cert => cert.id === id);
    if (!item) return;
    item.status = '已发放';
    item.issueTime = '2026-01-08 15:21';
    if (!item.actions.includes('revoke')) item.actions.splice(1, 0, 'revoke');
    rerenderActivityCertificates();
}

function revokeActivityCertificate(id) {
    const item = activityCertificateList.find(cert => cert.id === id);
    if (!item) return;
    item.status = '未发放';
    item.issueTime = '-';
    item.actions = item.actions.filter(action => action !== 'revoke');
    rerenderActivityCertificates();
}

function openActivityCertificateRecord(id) {
    const item = activityCertificateList.find(cert => cert.id === id);
    openModal('发放记录', `
        <div class="activity-certificate-record">
            <p><strong>${escapeHtml(item?.name || '活动证明')}</strong></p>
            <p>已生成参与证明记录，支持按知识问答参与记录自动匹配发放对象。</p>
        </div>
    `, null, { confirmText: '知道了', hideCancel: true });
}

function editActivityCertificate(id) {
    const item = activityCertificateList.find(cert => cert.id === id);
    if (!item) return;
    openModal('编辑证明', `
        <div class="activity-certificate-modal-form">
            <label><span>证明名称</span><input class="form-control" id="editCertificateName" value="${escapeHtml(item.name)}"></label>
            <label><span>发放方式</span><select class="form-control"><option selected>${item.method}</option></select></label>
        </div>
    `, () => {
        const name = document.getElementById('editCertificateName')?.value.trim();
        if (!name) return false;
        item.name = name;
        rerenderActivityCertificates();
    }, { confirmText: '保存' });
}

function deleteActivityCertificate(id) {
    const index = activityCertificateList.findIndex(cert => cert.id === id);
    if (index === -1) return;
    openModal('删除证明', '<p>确认删除该活动证明吗？删除后不可恢复。</p>', () => {
        activityCertificateList.splice(index, 1);
        rerenderActivityCertificates();
    }, { confirmText: '删除', danger: true });
}
