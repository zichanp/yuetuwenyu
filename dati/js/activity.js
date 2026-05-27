/* activity.js — 活动列表 + 创建活动（含答题配置） */

// ===== ACTIVITY LIST (Level 2 - Card-based layout) =====
registerPage('activity-list', () => {
    return `
    ${pageHeader('📋 活动列表', '活动管理 / 活动列表')}

    <!-- Filter Bar -->
    <div class="card" style="padding:var(--spacing-lg) var(--spacing-xl);margin-bottom:var(--spacing-lg)">
        <div class="form-row-4" style="margin-bottom:var(--spacing-md)">
            <div class="form-group"><label>活动名称</label><input class="form-control" placeholder="请输入活动名称"></div>
            <div class="form-group"><label>活动工具</label><select class="form-control"><option>全部工具</option><option>知识问答</option><option>任务打卡</option><option>征集类</option></select></div>
            <div class="form-group"><label>活动类型</label><select class="form-control"><option>全部类型</option><option>在线考试</option><option>每日答题</option><option>趣味闯关</option></select></div>
            <div class="form-group"><label>活动状态</label><select class="form-control"><option>全部状态</option><option>未发布</option><option>预告中</option><option>进行中</option><option>已结束</option><option>已下架</option></select></div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:var(--spacing-sm)">
            <button class="btn btn-primary">🔍 搜索</button>
            <button class="btn btn-ghost">重置</button>
        </div>
    </div>

    <!-- Action Bar -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--spacing-lg)">
        <button class="btn btn-primary" onclick="navigateTo('quiz-activity-create')">+ 创建活动</button>
    </div>

    <!-- Activity Cards -->
    <div style="display:flex;flex-direction:column;gap:var(--spacing-xs)">
        ${activityCard({title:'阅读成长知识竞赛',status:'进行中',statusCls:'badge-status-ongoing',tool:'知识问答',toolCls:'badge-quiz',scorePublishProgress:{published:3,total:5,reviewing:1,pending:1},grad:'linear-gradient(135deg,var(--color-brand-400),var(--primary))',time:'2026-01-03 9:00 至 2026-01-20 12:00',host:'阅读文化集团',creator:'周贺贺  2026-01-01 12:00',canManage:true,manageType:'quiz'})}
        ${activityCard({title:'华服知识测评',status:'进行中',statusCls:'badge-status-ongoing',tool:'知识问答',toolCls:'badge-quiz',scorePublishProgress:{published:3,total:5,reviewing:1,pending:1},grad:'linear-gradient(135deg,var(--color-brand-400),var(--primary))',time:'2026-01-03 9:00 至 2026-01-20 12:00',host:'阅读文化集团',creator:'周贺贺  2026-01-01 12:00',canManage:true,manageType:'quiz'})}
        ${activityCard({title:'法律翻译知识初赛',status:'已结束',statusCls:'badge-status-ended',tool:'知识问答',toolCls:'badge-quiz',scorePublishProgress:{published:3,total:5,reviewing:1,pending:1},grad:'linear-gradient(135deg,var(--warning),var(--warning-600))',time:'2026-01-03 9:00 至 2026-01-20 12:00',host:'阅读文化集团',creator:'周贺贺  2026-01-01 12:00',canManage:false})}
        ${activityCard({title:'舍不得的丽江——丽江礼物"文创大赛',status:'进行中',statusCls:'badge-status-ongoing',tool:'任务打卡',toolCls:'badge-green',grad:'linear-gradient(135deg,var(--success),var(--success-600))',time:'2026-01-03 9:00 至 2026-01-20 12:00',host:'阅读文化集团',creator:'周贺贺  2026-01-01 12:00',canManage:true})}
        ${activityCard({title:'【第十六届"华政杯"全国法律翻译大赛】打卡赛...',status:'已结束',statusCls:'badge-status-ended',tool:'任务打卡',toolCls:'badge-green',grad:'linear-gradient(135deg,var(--text-tertiary),var(--text-quaternary))',time:'2026-01-03 9:00 至 2026-01-20 12:00',host:'阅读文化集团',creator:'周贺贺  2026-01-01 12:00',canManage:true,series:true})}
        ${activityCard({title:'知识问答+文末福利|『锦绣华服·智传千年』华服...',status:'已下架',statusCls:'badge-status-offline',tool:'知识问答',toolCls:'badge-quiz',grad:'linear-gradient(135deg,var(--danger),var(--danger-600))',time:'2026-01-03 9:00 至 2026-01-20 12:00',host:'阅读文化集团',creator:'周贺贺  2026-01-01 12:00',canManage:true})}
    </div>

    ${renderStandardPagination(5)}`;
});

function renderLegacyQuizTotalScoreBlock() {
    return `
    <div class="cfg-panel" id="legacyQuizTotalScore">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('legacyQuizTotalScore')">
            <div class="cfg-panel-icon blue">💯</div>
            <div><div class="cfg-panel-title">试卷总分</div><div class="cfg-panel-subtitle">请先选择本次答题的试卷总分，再配置题目来源和抽题规则</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row" style="border-bottom:none">
                <div class="cfg-row-label"><span class="req">*</span> 试卷总分</div>
                <div class="cfg-row-control">
                    <div class="score-total-options">
                        <button type="button" class="score-total-option active">100 分</button>
                        <button type="button" class="score-total-option">120 分</button>
                        <button type="button" class="score-total-option">150 分</button>
                    </div>
                    <div class="cfg-row-hint">发布后，试卷总分不支持修改，请确认后再发布活动。</div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderLegacyScoreNotice(current = 100, target = 100) {
    const diff = Math.abs(target - current);
    const cls = current === target ? 'ok' : current > target ? 'error' : 'warn';
    const msg = current === target
        ? `分值配置正确，当前试卷总分为 ${target} 分。`
        : (current > target
            ? `当前已配置 ${current} 分，已超出试卷总分 ${diff} 分，请调整题目数量或每题分值。`
            : `当前已配置 ${current} 分，还差 ${diff} 分，请继续补充题目或调整每题分值。`);
    return `<div class="score-rule-notice ${cls}"><div class="score-rule-notice-head"><strong>已配置总分：${current} / ${target} 分</strong><span>${current === target ? '校验通过' : '待调整'}</span></div><p>本次试卷总分为 ${target} 分，请确保所有抽题规则的分值之和等于该总分。</p><p>${msg}</p></div>`;
}

function activityCard(c) {
    return `
    <div class="card" style="padding:var(--spacing-lg);display:flex;gap:var(--spacing-lg);align-items:center;position:relative;margin-bottom:0">
        ${c.series ? '<div style="position:absolute;top:0;left:0;background:var(--warning);color:var(--text-inverse);padding:2px var(--spacing-sm);border-radius:0 0 var(--radius-sm) 0;font-size:11px;font-weight:600">系列活动</div>' : ''}
        <div style="width:120px;height:80px;border-radius:var(--radius-lg);background:${c.grad};display:flex;align-items:center;justify-content:center;font-size:28px;color:white;flex-shrink:0;${c.series ? 'margin-top:8px' : ''}"></div>
        <div style="flex:1;min-width:0;${c.series ? 'margin-top:8px' : ''}">
            <div style="display:flex;align-items:center;gap:var(--spacing-sm);margin-bottom:var(--spacing-xs);flex-wrap:wrap">
                <strong style="font-size:var(--font-size-md)">${c.title}</strong>
                <span class="badge ${c.statusCls}">${c.status}</span>
            </div>
            <div style="display:flex;align-items:center;gap:var(--spacing-sm);margin-bottom:var(--spacing-xs)">
                <span class="badge ${c.toolCls}">${c.tool}</span>
                ${renderScorePublishProgressBadge(c.scorePublishProgress)}
            </div>
            <div style="display:flex;align-items:center;gap:var(--spacing-lg);font-size:var(--font-size-xs);color:var(--text-tertiary);flex-wrap:wrap">
                <span>🕐 ${c.time}</span>
                <span>🏢 ${c.host}</span>
                <span>👤 ${c.creator}</span>
            </div>
        </div>
        <div style="display:flex;align-items:center;gap:var(--spacing-xxs);flex-shrink:0;${c.series ? 'margin-top:8px' : ''}">
            <div class="top-nav-icon" title="访问活动">🔗</div>
            <div class="top-nav-icon" title="复制链接">📋</div>
            <div class="top-nav-icon" title="二维码">📱</div>
        </div>
        <div style="display:flex;align-items:center;gap:var(--spacing-xxs);flex-shrink:0;border-left:1px solid var(--border-color-light);padding-left:var(--spacing-md);${c.series ? 'margin-top:8px' : ''}">
            ${renderQuizPublishScoreButton(c.scorePublishProgress, c)}
            ${c.canManage
                ? `<button class="btn btn-primary btn-sm" onclick="${c.manageType === 'quiz' ? `enterQuizActivityManage('${escHtml(c.title)}', '${escHtml(c.time)}')` : `navigateTo('activity-manage')`}">进入管理</button>
                   <button class="btn btn-outline btn-sm" onclick="${c.manageType === 'quiz' ? `navigateTo('quiz-activity-create', { params: { mode: 'edit' } })` : `navigateTo('activity-create')`}">编辑活动</button>`
                : `<button class="btn btn-outline btn-sm">查看数据</button>
                   <button class="btn btn-outline btn-sm">创建副本</button>`
            }
            <div class="top-nav-icon" title="更多">⋮</div>
        </div>
    </div>`;
}

function enterQuizActivityManage(activityName, activityTime) {
    currentManageActivity.name = activityName;
    currentManageActivity.type = '知识问答';
    currentManageActivity.status = '未发布';
    currentManageActivity.time = activityTime;
    enterManageMode(activityName);
}

// ===== QUIZ-ONLY ACTIVITY LIST (filtered view entered from 知识问答 card) =====
registerPage('quiz-activity-list', () => renderQuizActivityList());

function renderQuizActivityList() {
    return `
    ${pageHeader('📋 知识问答活动列表', '活动管理 / 工作台 / 知识问答 / 活动列表')}

    <!-- Filter bar (quiz-specific) -->
    <div class="card" style="padding:var(--spacing-lg) var(--spacing-xl);margin-bottom:var(--spacing-lg)">
        <div class="form-row-4" style="margin-bottom:var(--spacing-md)">
            <div class="form-group"><label>活动名称</label><input class="form-control" placeholder="请输入活动名称"></div>
            <div class="form-group"><label>活动类型</label><select class="form-control"><option>全部类型</option><option>在线考试</option><option>每日答题</option><option>趣味闯关</option></select></div>
            <div class="form-group"><label>活动状态</label><select class="form-control"><option>全部状态</option><option>未发布</option><option>预告中</option><option>进行中</option><option>已结束</option><option>已下架</option></select></div>
            <div style="display:flex;align-items:flex-end;gap:var(--spacing-sm);justify-content:flex-end">
                <button class="btn btn-primary">🔍 搜索</button>
                <button class="btn btn-ghost">重置</button>
            </div>
        </div>
    </div>

    <!-- Action bar with quiz-module shortcuts -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--spacing-lg)">
        <div style="display:flex;gap:var(--spacing-sm)">
            <button class="btn quiz-create-btn" onclick="navigateTo('quiz-activity-create')">+ 创建知识问答活动</button>
        </div>
    </div>

    <!-- Quiz activity list (aligned with 首页 / 官方推荐 list style) -->
    <div class="card quiz-list-panel">
        <div class="quiz-list-head">
            <div>答题活动列表</div>
        </div>
        ${quizCard({
            title: '阅启新篇·读享时光 —— 阅途成长共读计划',
            status: '进行中', statusCls: 'badge-status-ongoing',
            mode: '在线考试',
            scorePublishProgress: { published: 3, total: 5, reviewing: 1, pending: 1 },
            time: '2026-03-06 09:00 至 2026-03-26 23:59',
            host: '上海市图书馆',
            creator: '林月  2026-03-01 10:30',
            participants: 528, rate: '73.1%',
            grad: 'linear-gradient(135deg,#DDEBFF 0%,#F3F8FF 52%,#BFD9FF 100%)'
        })}
        ${quizCard({
            title: '第十六届"华政杯"全国法律翻译大赛 · 知识初赛',
            status: '预告中', statusCls: 'badge-status-upcoming',
            mode: '每日答题',
            scorePublishProgress: { published: 3, total: 5, reviewing: 1, pending: 1 },
            time: '2026-04-01 09:00 至 2026-04-15 22:00',
            host: '华东政法大学图书馆',
            creator: '周贺贺  2026-03-10 14:00',
            participants: 0, rate: '—',
            grad: 'linear-gradient(135deg,#F7E7C8 0%,#FBF5E8 55%,#B8D6C5 100%)'
        })}
        ${quizCard({
            title: '红色经典诵读 · 党史知识闯关赛',
            status: '进行中', statusCls: 'badge-status-ongoing',
            mode: '知识问答',
            scorePublishProgress: { published: 3, total: 5, reviewing: 1, pending: 1 },
            time: '2026-02-20 09:00 至 2026-05-01 23:59',
            host: '复旦大学图书馆',
            creator: '王默  2026-02-15 16:20',
            participants: 312, rate: '68.5%',
            grad: 'linear-gradient(135deg,#FFE3D1 0%,#FF9CA8 54%,#FFE39A 100%)'
        })}
        ${quizCard({
            title: '2026 春季全民读书月 · 图书馆知识测评',
            status: '已结束', statusCls: 'badge-status-ended',
            mode: '在线考试',
            time: '2026-01-10 09:00 至 2026-02-10 23:59',
            host: '上海图书馆',
            creator: '林月  2026-01-05 11:00',
            participants: 1248, rate: '89.2%',
            grad: 'linear-gradient(135deg,#D8F5D1 0%,#F3FFF0 52%,#9FD58E 100%)'
        })}
        ${quizCard({
            title: '新员工入职 · 图书馆业务知识考核',
            status: '未发布', statusCls: 'badge-status-unpublished',
            mode: '在线考试',
            time: '— 待发布',
            host: '上海市图书馆',
            creator: '孙七  2026-03-18 09:40',
            participants: 0, rate: '—',
            grad: 'linear-gradient(135deg,#E9DDFF 0%,#F7F1FF 50%,#C8B5FF 100%)',
            unpublished: true
        })}
        <div class="quiz-list-pagination">${renderStandardPagination(15)}</div>
    </div>
    `;
}

function quizCard(c) {
    const statusClass = c.status === '进行中'
        ? 'ongoing'
        : c.status === '预告中'
            ? 'upcoming'
            : c.status === '已结束'
                ? 'ended'
                : 'unpublished';
    const primaryAction = c.unpublished
        ? `<button class="btn btn-primary btn-sm">发布</button>`
        : `<button class="btn btn-primary btn-sm" onclick="navigateTo('activity-manage')">进入管理</button>`;
    const secondaryAction = `<button class="btn btn-outline btn-sm" onclick="navigateTo('quiz-activity-create', { params: { mode: 'edit' } })">编辑活动</button>`;

    return `
    <div class="quiz-list-item">
        <div class="quiz-list-thumb" style="background:${c.grad}"></div>
        <div class="quiz-list-main">
            <div class="quiz-list-title-row">
                <div class="quiz-list-title">${c.title}</div>
                <span class="quiz-list-status ${statusClass}">${c.status}</span>
                <button class="wb-icon-btn" title="复制链接">⧉</button>
                <button class="wb-icon-btn" title="二维码">▦</button>
            </div>
            <div class="quiz-list-tags">
                <span class="badge badge-mode">${c.mode}</span>
                ${renderScorePublishProgressBadge(c.scorePublishProgress)}
            </div>
            <div class="quiz-list-meta">
                <span>活动时间：${c.time}</span>
                <span>主办单位：${c.host}</span>
                <span>创建人：${c.creator}</span>
                <span>参与：${c.participants}</span>
                <span>完成率：${c.rate}</span>
            </div>
        </div>
        <div class="quiz-list-actions">
            ${renderQuizPublishScoreButton(c.scorePublishProgress, c)}
            ${primaryAction}
            ${secondaryAction}
        </div>
    </div>`;
}

function renderScorePublishProgressBadge(progress) {
    if (!progress || !progress.total) return '';
    const published = Number(progress.published || 0);
    const total = Number(progress.total || 0);
    const reviewing = Number(progress.reviewing || 0);
    const pending = Number(progress.pending || 0);
    const tooltip = `待发布：${pending}&#10;已发布：${published}`;
    return `
      <span class="score-publish-progress-badge tooltip" data-tooltip="${tooltip}">
        <strong>成绩发布</strong>
        <em>${published}/${total}</em>
      </span>`;
}

function renderQuizPublishScoreButton(progress, activity = {}) {
    if (!progress || !progress.total) return '';
    const enabled = Number(progress.pending || 0) > 0;
    const tooltip = `待发布：${Number(progress?.pending || 0)}&#10;已发布：${Number(progress?.published || 0)}`;
    const activityName = escHtml(activity.title || currentManageActivity.name);
    const activityTime = escHtml(activity.time || currentManageActivity.time);
    const activityStatus = escHtml(activity.status || '进行中');
    return `
      <span class="quiz-publish-score-tooltip tooltip" data-tooltip="${tooltip}">
        <button class="btn btn-outline btn-sm ${enabled ? 'quiz-publish-score-btn' : 'quiz-publish-score-btn is-disabled'}" ${enabled ? `onclick="enterQuizPublishScorePage('${activityName}', '${activityTime}', '${activityStatus}')"` : 'disabled'}>去发布成绩</button>
      </span>`;
}

function enterQuizPublishScorePage(activityName, activityTime, activityStatus) {
    currentManageActivity.name = activityName;
    currentManageActivity.type = '知识问答';
    currentManageActivity.status = activityStatus || '进行中';
    currentManageActivity.time = activityTime;
    navigateTo('paper-review');
}

// ===== ACTIVITY CREATE (5-step wizard with quiz config integrated) =====
let currentStep = 1;
let activityMode = 'exam'; // 'exam' | 'challenge' | 'level'

registerPage('activity-create', () => {
    currentStep = 1;
    activityMode = 'exam';
    return renderActivityCreate();
});

registerPage('activity-create_init', () => {
    // Post-render hook
});

function renderActivityCreate() {
    return `
    ${pageHeader('➕ 创建活动', '活动管理 / 创建活动')}
    <div class="card" style="padding:0;overflow:visible">
        <!-- Step Wizard -->
        <div class="step-wizard" id="stepWizard">
            ${stepItem(1, '基本信息', currentStep)}
            <div class="step-line${currentStep > 1 ? ' done' : ''}"></div>
            ${stepItem(2, '活动介绍', currentStep)}
            <div class="step-line${currentStep > 2 ? ' done' : ''}"></div>
            ${stepItem(3, '报名配置', currentStep)}
            <div class="step-line${currentStep > 3 ? ' done' : ''}"></div>
            ${stepItem(4, '答题配置', currentStep)}
            <div class="step-line${currentStep > 4 ? ' done' : ''}"></div>
            ${stepItem(5, '外观与其他', currentStep)}
        </div>
    </div>

    <!-- Step Panes -->
    <div id="stepContent">${renderStep(currentStep)}</div>

    <!-- Actions -->
    <div class="card" style="position:sticky;bottom:16px;z-index:50;display:flex;justify-content:space-between;align-items:center">
        <div>
            ${currentStep > 1 ? '<button class="btn btn-ghost" onclick="goStep(' + (currentStep - 1) + ')">上一步</button>' : ''}
        </div>
        <div class="btn-group">
            <button class="btn btn-ghost">取消</button>
            <button class="btn btn-ghost">💾 保存草稿</button>
            ${currentStep < 5 ? '<button class="btn btn-primary" onclick="goStep(' + (currentStep + 1) + ')">下一步</button>' : '<button class="btn btn-success" onclick="openModal(\'发布确认\',\'确定发布该活动？发布后活动模式不可修改。\',()=>{alert(\'活动已发布\')})\">🚀 发布活动</button>'}
        </div>
    </div>`;
}

function stepItem(num, label, current) {
    const cls = num === current ? 'active' : (num < current ? 'done' : '');
    return `<div class="step-item ${cls}" onclick="goStep(${num})"><div class="step-num">${num < current ? '✓' : num}</div><div class="step-label">${label}</div></div>`;
}

function goStep(n) {
    currentStep = n;
    const main = document.getElementById('mainContent');
    main.innerHTML = renderActivityCreate();
}

function renderStep(n) {
    switch (n) {
        case 1: return renderStep1();
        case 2: return renderStep2();
        case 3: return renderStep3();
        case 4: return renderStep4();
        case 5: return renderStep5();
        default: return '';
    }
}

// Step 1: 基本信息
function renderStep1() {
    return `<div class="card">
        <div class="section"><div class="section-head"><div class="sec-icon blue">📝</div><div><div class="sec-title">基本信息</div></div></div><div class="section-body">
            <div class="form-group"><label><span class="req">*</span> 活动名称</label><input class="form-control" placeholder="填写活动名称"></div>
            <div class="form-row">
                <div class="form-group"><label><span class="req">*</span> 活动模式</label>
                    <div class="radio-group">
                        <div class="radio-item"><input type="radio" name="actMode" checked onchange="activityMode='exam'"><label>在线考试</label></div>
                        <div class="radio-item"><input type="radio" name="actMode" onchange="activityMode='challenge'"><label>每日趣味闯关</label></div>
                        <div class="radio-item"><input type="radio" name="actMode" onchange="activityMode='level'"><label>闯关模式</label></div>
                    </div>
                    <p class="hint">发布后不可修改</p>
                </div>
                <div class="form-group"><label><span class="req">*</span> 活动范围</label><select class="form-control"><option>全国</option><option>省级</option><option>市级</option><option>本机构</option></select></div>
            </div>
        </div></div>
    </div>`;
}

// Step 2: 活动介绍
function renderStep2() {
    return `<div class="card">
        <div class="section"><div class="section-head"><div class="sec-icon green">📖</div><div><div class="sec-title">活动介绍</div></div></div><div class="section-body">
            <div class="form-group"><label><span class="req">*</span> 活动介绍（富文本）</label>
                <div style="border:1.5px solid var(--border);border-radius:var(--radius-sm);min-height:240px;padding:var(--spacing-md);background:var(--color-neutral-50)">
                    <div style="border-bottom:1px solid var(--border-light);padding-bottom:8px;margin-bottom:12px;display:flex;gap:8px">
                        <button class="btn btn-ghost btn-sm">B 加粗</button><button class="btn btn-ghost btn-sm">I 斜体</button><button class="btn btn-ghost btn-sm">📊 表格</button><button class="btn btn-ghost btn-sm">🖼 图片</button><button class="btn btn-ghost btn-sm">🔗 链接</button>
                    </div>
                    <div contenteditable="true" style="min-height:160px;outline:none;font-size:13px;color:var(--text-secondary)">请输入活动背景、目标、参与对象、规则说明等内容...</div>
                </div>
            </div>
        </div></div>
    </div>`;
}

// ===== Challenge Mode: Tab Switching =====
function switchChallengeDrawTab(tab) {
  const tabRandom = document.getElementById('tabRandomDraw');
  const tabDaily = document.getElementById('tabDailyPlan');
  const panelRandom = document.getElementById('panelRandomDraw');
  const panelDaily = document.getElementById('panelDailyPlan');
  
  if (!tabRandom || !tabDaily || !panelRandom || !panelDaily) return;
  
  if (tab === 'random') {
    tabRandom.style.borderBottomColor = 'var(--primary)';
    tabRandom.style.color = 'var(--primary)';
    tabRandom.style.fontWeight = '700';
    tabDaily.style.borderBottomColor = 'transparent';
    tabDaily.style.color = 'var(--text-muted)';
    tabDaily.style.fontWeight = '500';
    panelRandom.style.display = 'block';
    panelDaily.style.display = 'none';
  } else {
    tabDaily.style.borderBottomColor = 'var(--primary)';
    tabDaily.style.color = 'var(--primary)';
    tabDaily.style.fontWeight = '700';
    tabRandom.style.borderBottomColor = 'transparent';
    tabRandom.style.color = 'var(--text-muted)';
    tabRandom.style.fontWeight = '500';
    panelDaily.style.display = 'block';
    panelRandom.style.display = 'none';
  }
}

// ===== Add Random Draw Rule =====
function addRandomDrawRule() {
  const container = document.getElementById('randomDrawRules');
  if (!container) return;
  const newRow = document.createElement('div');
  newRow.className = 'draw-rule';
  newRow.style.borderBottom = '1px solid var(--border-light)';
  newRow.style.paddingBottom = '8px';
  newRow.innerHTML = `
    <div><label>题库</label><select><option>图书馆知识题库</option><option>历史文化题库</option><option>非遗知识题库</option></select></div>
    <div><label>题型</label><select>${standardAnswerQuestionTypeOptions()}</select></div>
    <div><label>抽取数量</label><input type="number" value="10" min="1"></div>
    <div><label>每题分值</label><input type="number" value="10" min="1"></div>
    <div><label>操作</label><button type="button" class="draw-rule-delete-btn" onclick="removeDrawRuleRow(this)" title="删除本条规则" aria-label="删除本条规则"><span class="trash-icon" aria-hidden="true"></span></button></div>
  `;
  container.appendChild(newRow);
  updateDrawRuleDeleteButtons(container);
}

function removeDrawRuleRow(btn) {
  const row = btn?.closest('.draw-rule');
  const container = row?.parentElement;
  if (!row || !container || container.querySelectorAll('.draw-rule').length <= 1) return;
  row.remove();
  updateDrawRuleDeleteButtons(container);
}

function updateDrawRuleDeleteButtons(container) {
  if (!container) return;
  const rows = container.querySelectorAll('.draw-rule');
  rows.forEach(row => {
    const btn = row.querySelector('.draw-rule-delete-btn');
    if (btn) btn.disabled = rows.length <= 1;
  });
}

// ===== Add Daily Plan Row =====
function addDailyPlanRow() {
  const container = document.getElementById('dailyPlanList');
  if (!container) return;
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const dayCount = container.querySelectorAll('.schedule-row').length + 1;
  const cn = ['一','二','三','四','五','六','七','八','九','十'];
  const dayLabel = cn[(dayCount - 1) % cn.length];
  
  const newRow = document.createElement('div');
  newRow.className = 'schedule-row';
  newRow.style.borderBottom = '1px solid var(--border-light)';
  newRow.style.paddingBottom = '10px';
  newRow.innerHTML = `
    <div><label>日期</label><input type="date" value="${dateStr}" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"></div>
    <div><label>主题/关卡</label><input type="text" value="第${dayCount}天：自定义主题" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"></div>
    <div><label>题库</label><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"><option>图书馆知识题库</option><option>历史文化题库</option><option>非遗知识题库</option></select></div>
    <div><label>题型</label><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px">${standardAnswerQuestionTypeOptions()}</select></div>
    <div><label>数量</label><input type="number" value="10" min="1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"></div>
    <div><label>操作</label><span class="action-link danger" onclick="this.closest('.schedule-row').remove()">删除</span></div>
  `;
  container.appendChild(newRow);
}

// Step 3: 报名配置
function renderStep3() {
    return `<div class="card">
        <div class="section"><div class="section-head"><div class="sec-icon yellow">👥</div><div><div class="sec-title">报名配置</div></div></div><div class="section-body">
            <div class="form-row">
                <div class="form-group"><label>报名组别</label><input class="form-control" placeholder="如：小学组、中学组、成人组"></div>
                <div class="form-group"><label>报名时间</label>
                    <div class="form-row"><input type="datetime-local" class="form-control"><input type="datetime-local" class="form-control"></div>
                </div>
            </div>
            <div class="form-group"><label>报名表单字段</label>
                <div class="config-block">
                    <div class="sw-row"><div class="sw-text"><div class="sw-label">姓名</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
                    <div class="sw-row"><div class="sw-text"><div class="sw-label">手机号</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
                    <div class="sw-row"><div class="sw-text"><div class="sw-label">选送单位</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
                </div>
            </div>
        </div></div>
    </div>`;
}

// Step 4: 答题配置 — Professional Configuration System
function renderStep4() {
    return `<div class="card" style="padding:0">
        <!-- Mode Selector -->
        <div style="padding:20px 24px">
            <div class="mode-selector" style="grid-template-columns:1fr 1fr 1fr">
                <div class="mode-card${activityMode === 'exam' ? ' selected' : ''}" onclick="activityMode='exam';goStep(4)">
                    <div class="mode-tag">考试</div><div class="mode-icon">📝</div>
                    <div class="mode-title">在线考试</div>
                    <div class="mode-desc">面向在线考试、测评、竞赛场景。从试卷库选择试卷。</div>
                </div>
                <div class="mode-card${activityMode === 'challenge' ? ' selected' : ''}" onclick="activityMode='challenge';goStep(4)">
                    <div class="mode-tag">每日</div><div class="mode-icon">🎯</div>
                    <div class="mode-title">每日趣味闯关模式</div>
                    <div class="mode-desc">面向连续参与、每日学习、积分排行场景。使用抽题规则。</div>
                </div>
                <div class="mode-card${activityMode === 'level' ? ' selected' : ''}" onclick="activityMode='level';goStep(4)">
                    <div class="mode-tag">闯关</div><div class="mode-icon">⚔️</div>
                    <div class="mode-title">闯关模式</div>
                    <div class="mode-desc">面向顺序闯关、刷题练习、实时校验场景。过关才解锁下一关。</div>
                </div>
            </div>
        </div>

        <!-- Config Progress -->
        <div style="padding:0 24px">
            <div class="cfg-progress">
                <span style="font-size:13px;color:var(--text-secondary)">配置进度</span>
                <div class="cfg-progress-bar"><div class="cfg-progress-fill" style="width:71%"></div></div>
                <span class="cfg-progress-text">5/7 已完成</span>
            </div>
        </div>

        <!-- Config Content -->
        <div style="padding:0 24px 24px">
            ${activityMode === 'challenge' ? renderLegacyQuizTotalScoreBlock() : ''}
            ${activityMode === 'exam' ? renderExamConfig() : activityMode === 'challenge' ? renderChallengeConfig() : renderLevelModeConfig()}
        </div>
    </div>`;
}

// ===== 在线考试 Config — Mind Map Aligned =====
function renderExamConfig() {
    return `
    <!-- 1. 答题时间 -->
    <div class="cfg-panel" id="examPanel1">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('examPanel1')">
            <div class="cfg-panel-icon blue">⏱</div>
            <div><div class="cfg-panel-title">答题时间</div><div class="cfg-panel-subtitle">设置考试开放时段、时长与每日可答题时段</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 考试开放时间 <span class="help-tip" title="设置考试开始和结束时间，用户只能在此时间段内进入考试">?</span></div>
                <div class="cfg-row-control">
                    <div style="display:flex;gap:8px;align-items:center">
                        <input type="datetime-local" class="form-control" value="2026-06-09T09:00">
                        <span style="color:var(--text-tertiary);font-size:13px">至</span>
                        <input type="datetime-local" class="form-control" value="2026-06-09T18:00">
                    </div>
                </div>
            </div>
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 考试时长 <span class="help-tip" title="用户点击「开始答题」后，单次考试最长可作答时间">?</span></div>
                <div class="cfg-row-control">
                    <div class="num-input"><input type="number" value="120" min="1"><span class="unit">分钟</span></div>
                    <div class="cfg-row-hint">用户点击「开始答题」后，单次考试最长可作答时间</div>
                </div>
            </div>
            <div class="cfg-row">
                <div class="cfg-row-label">答题时段 <span class="help-tip" title="可设置每天允许答题的具体时间段，不在此时段内无法开始考试">?</span></div>
                <div class="cfg-row-control">
                    <div style="display:flex;gap:8px;align-items:center">
                        <label class="switch" style="margin-right:8px"><input type="checkbox"><span class="sw-slider"></span></label>
                        <span style="font-size:13px;color:var(--text-secondary)">每日开放</span>
                        <input type="time" value="09:00" style="padding:6px 10px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:13px">
                        <span style="color:var(--text-tertiary);font-size:13px">至</span>
                        <input type="time" value="18:00" style="padding:6px 10px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:13px">
                    </div>
                    <div class="cfg-row-hint">开启后可限制每天允许答题的时间范围，不在此时段内无法开始考试</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. 答题次数 -->
    <div class="cfg-panel" id="examPanel2">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('examPanel2')">
            <div class="cfg-panel-icon green">🔄</div>
            <div><div class="cfg-panel-title">答题次数</div><div class="cfg-panel-subtitle">限制用户在活动期间的参与次数</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 活动期间每人最多答题 <span class="help-tip" title="设置用户在整个活动期间最多可以参与答题的次数">?</span></div>
                <div class="cfg-row-control">
                    <div style="display:flex;gap:8px;align-items:center">
                        <div class="num-input"><input type="number" value="1" min="0"><span class="unit">次</span></div>
                        <span style="font-size:12px;color:var(--text-tertiary)">填 0 表示不限制</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 3. 题目来源 -->
    <div class="cfg-panel" id="examPanel3">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('examPanel3')">
            <div class="cfg-panel-icon blue">📄</div>
            <div><div class="cfg-panel-title">题目来源</div><div class="cfg-panel-subtitle">从试卷库中选择试卷作为考试内容</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 选择试卷 <span class="help-tip" title="选择试卷作为考试题目来源，支持固定题目和随机抽题">?</span></div>
                <div class="cfg-row-control">
                    <div class="info-box blue" style="margin-bottom:12px">💡 在线考试使用<strong>试卷</strong>作为题目来源。请先在「试卷管理」中创建试卷（支持固定题目和随机抽题），然后在此选择试卷。<strong>抽题规则</strong>在创建随机抽题时配置，不属于活动配置。</div>
                    <div class="paper-select-card selected" onclick="this.parentElement.querySelectorAll('.paper-select-card').forEach(c=>c.classList.remove('selected'));this.classList.add('selected')">
                        <div class="paper-radio"></div>
                        <div style="flex:1">
                            <div style="font-size:14px;font-weight:600;color:var(--text-primary)">图书馆知识竞赛试卷 <span class="badge badge-green" style="margin-left:6px;font-size:11px">固定题目</span></div>
                            <div style="font-size:12px;color:var(--text-tertiary);margin-top:4px" title="试卷总分来源于所选试卷，如需调整，请前往试卷管理中编辑试卷。">题目数量：50 | 试卷总分：100 | 题型组成：单选40、判断10 | 适用范围：考试活动 | 状态：已发布</div>
                        </div>
                    </div>
                    <div class="paper-select-card" onclick="this.parentElement.querySelectorAll('.paper-select-card').forEach(c=>c.classList.remove('selected'));this.classList.add('selected')">
                        <div class="paper-radio"></div>
                        <div style="flex:1">
                            <div style="font-size:14px;font-weight:600;color:var(--text-primary)">历史文化知识测试 <span class="badge badge-yellow" style="margin-left:6px;font-size:11px">随机抽题</span></div>
                            <div style="font-size:12px;color:var(--text-tertiary);margin-top:4px" title="试卷总分来源于所选试卷，如需调整，请前往试卷管理中编辑试卷。">题目数量：30 | 试卷总分：100 | 题型组成：单选15、多选10、判断5 | 适用范围：考试活动 | 状态：已引用</div>
                        </div>
                    </div>
                    <div style="display:flex;gap:8px;margin-top:8px">
                        <button class="btn btn-outline btn-sm" onclick="navigateTo('paper-mgmt')">+ 创建新试卷</button>
                        <button class="btn btn-ghost btn-sm" onclick="navigateTo('paper-mgmt')">前往试卷管理</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 4. 及格分数 -->
    <div class="cfg-panel" id="examPanel4">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('examPanel4')">
            <div class="cfg-panel-icon orange">📊</div>
            <div><div class="cfg-panel-title">及格分数</div><div class="cfg-panel-subtitle">设置考试及格分数线</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 设置及格分数 <span class="help-tip" title="低于此分数的考生将被标记为未通过，及格分数不能超过试卷满分">?</span></div>
                <div class="cfg-row-control">
                    <div class="score-slider">
                        <input type="range" min="0" max="100" value="60" oninput="this.nextElementSibling.textContent=this.value">
                        <span class="score-val">60</span>
                        <span class="score-unit">分</span>
                    </div>
                    <div class="cfg-row-hint">满分 100 分，及格线默认 60 分，可根据实际需求调整</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 5. 解析展示 -->
    <div class="cfg-panel" id="examPanel5">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('examPanel5')">
            <div class="cfg-panel-icon teal">💡</div>
            <div><div class="cfg-panel-title">解析展示</div><div class="cfg-panel-subtitle">设置答案解析的展示时机</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 解析展示时机 <span class="help-tip" title="控制考生何时可以看到答案解析，影响考试的公平性和学习效果">?</span></div>
                <div class="cfg-row-control">
                    <div class="radio-pills">
                        <div class="radio-pill active" onclick="selectRadioPill(this,'examAnalysis')"><input type="radio" name="examAnalysis" checked>交卷后立即展示解析</div>
                        <div class="radio-pill" onclick="selectRadioPill(this,'examAnalysis')"><input type="radio" name="examAnalysis">活动结束后展示解析</div>
                        <div class="radio-pill" onclick="selectRadioPill(this,'examAnalysis')"><input type="radio" name="examAnalysis">不展示解析</div>
                    </div>
                    <div class="cfg-row-hint">选择「交卷后立即展示」可帮助考生即时了解答题情况，适合练习性考试；选择「活动结束后展示」可防止泄露答案</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 7. 默认规则 -->
    <div class="cfg-panel" id="examPanel7">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('examPanel7')">
            <div class="cfg-panel-icon purple">📋</div>
            <div><div class="cfg-panel-title">默认规则</div><div class="cfg-panel-subtitle">考试过程中的行为规则与展示策略</div></div>
            <span class="cfg-panel-badge advanced">高级</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="rule-toggle">
                <span class="rule-icon">⏳</span>
                <div class="rule-text">
                    <div class="rule-label">中断答题后，计时将继续</div>
                    <div class="rule-desc">即使用户关闭浏览器，倒计时仍继续，防止通过退出暂停计时</div>
                </div>
                <label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label>
            </div>
            <div class="rule-toggle">
                <span class="rule-icon">⏰</span>
                <div class="rule-text">
                    <div class="rule-label">超时自动交卷</div>
                    <div class="rule-desc">考试时长耗尽后，系统自动提交试卷</div>
                </div>
                <label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label>
            </div>
            <div class="rule-toggle">
                <span class="rule-icon">⏭️</span>
                <div class="rule-text">
                    <div class="rule-label">允许跳题</div>
                    <div class="rule-desc">允许用户跳过当前题目，稍后返回作答</div>
                </div>
                <label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label>
            </div>
            <div class="rule-toggle">
                <span class="rule-icon">📋</span>
                <div class="rule-text">
                    <div class="rule-label">显示答题卡</div>
                    <div class="rule-desc">显示所有题目的答题状态，方便用户快速定位未答题目</div>
                </div>
                <label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label>
            </div>
            <div class="rule-toggle">
                <span class="rule-icon">📊</span>
                <div class="rule-text">
                    <div class="rule-label">默认提交试卷后立即展示成绩</div>
                    <div class="rule-desc">交卷后即刻显示考试成绩和及格状态</div>
                </div>
                <label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label>
            </div>
            <div class="rule-toggle">
                <span class="rule-icon">✋</span>
                <div class="rule-text">
                    <div class="rule-label">支持提前交卷</div>
                    <div class="rule-desc">允许用户在答完所有题目前提交试卷</div>
                </div>
                <label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label>
            </div>
        </div>
    </div>`;
}

// ===== 每日趣味闯关模式 Config — Mind Map Aligned =====
function renderChallengeConfig() {
    return `
    <!-- 1. 答题时间 -->
    <div class="cfg-panel" id="chPanel1">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('chPanel1')">
            <div class="cfg-panel-icon blue">⏱</div>
            <div><div class="cfg-panel-title">答题时间</div><div class="cfg-panel-subtitle">设置答题开放日期、每日时段与每题限时</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 答题开放日期 <span class="help-tip" title="设置活动整体开放时间范围">?</span></div>
                <div class="cfg-row-control">
                    <div style="display:flex;gap:8px;align-items:center">
                        <input type="datetime-local" class="form-control" value="2026-06-01T09:00">
                        <span style="color:var(--text-tertiary);font-size:13px">至</span>
                        <input type="datetime-local" class="form-control" value="2026-06-30T18:00">
                    </div>
                </div>
            </div>
            <div class="cfg-row">
                <div class="cfg-row-label">答题时段 <span class="help-tip" title="可设置每天允许答题的具体时间段">?</span></div>
                <div class="cfg-row-control">
                    <div style="display:flex;gap:8px;align-items:center">
                        <label class="switch" style="margin-right:8px"><input type="checkbox" checked><span class="sw-slider"></span></label>
                        <span style="font-size:13px;color:var(--text-secondary)">每日开放</span>
                        <input type="time" value="09:00" style="padding:6px 10px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:13px">
                        <span style="color:var(--text-tertiary);font-size:13px">至</span>
                        <input type="time" value="18:00" style="padding:6px 10px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:13px">
                    </div>
                </div>
            </div>
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 每题限时 <span class="help-tip" title="每道题的作答时间，超时自动跳转下一题">?</span></div>
                <div class="cfg-row-control">
                    <div class="num-input"><input type="number" value="60" min="1"><span class="unit">秒</span></div>
                    <div class="cfg-row-hint">超时后自动跳转下一题</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. 参与次数 -->
    <div class="cfg-panel" id="chPanel2">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('chPanel2')">
            <div class="cfg-panel-icon green">🔄</div>
            <div><div class="cfg-panel-title">参与次数</div><div class="cfg-panel-subtitle">设置每人每天答题次数</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 每人每天最多答题 <span class="help-tip" title="限制用户每天可以参与答题的次数">?</span></div>
                <div class="cfg-row-control">
                    <div class="radio-pills">
                        <div class="radio-pill active" onclick="selectRadioPill(this,'chDaily')"><input type="radio" name="chDaily" checked>每天仅可答 1 次</div>
                        <div class="radio-pill" onclick="selectRadioPill(this,'chDaily')"><input type="radio" name="chDaily">每天可答 <div class="num-input" style="display:inline-flex;vertical-align:middle"><input type="number" value="3" min="1"><span class="unit">次</span></div></div>
                        <div class="radio-pill" onclick="selectRadioPill(this,'chDaily')"><input type="radio" name="chDaily">每天不限次</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 3. 题目来源 -->
    <div class="cfg-panel" id="chPanel3">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('chPanel3')">
            <div class="cfg-panel-icon blue">🎯</div>
            <div><div class="cfg-panel-title">题目来源</div><div class="cfg-panel-subtitle">支持从题库随机抽题和每日指定题库随机抽题</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 抽题方式 <span class="help-tip" title="选择每日答题的题目来源方式">?</span></div>
                <div class="cfg-row-control">
                    <div class="radio-pills" style="margin-bottom:16px">
                        <div class="radio-pill active" onclick="selectRadioPill(this,'chSource');switchChallengeDrawTab('random')"><input type="radio" name="chSource" checked>从题库随机抽题</div>
                        <div class="radio-pill" onclick="selectRadioPill(this,'chSource');switchChallengeDrawTab('daily')"><input type="radio" name="chSource">每日指定题库随机抽题</div>
                    </div>
                    <!-- 随机抽题 -->
                    <div id="panelRandomDraw">
                        ${renderLegacyScoreNotice(100, 100)}
                        <div class="info-box green" style="margin-bottom:12px">🎯 每天规则一致，系统根据抽题规则自动为每位用户随机抽取题目</div>
                        <div class="config-block">
                            <div class="config-block-title">📋 抽题规则</div>
                                <div id="randomDrawRules">
                                    <div class="draw-rule" style="border-bottom:1px solid var(--border-color-light);padding-bottom:8px">
                                    <div><label>题库</label><select><option>图书馆知识题库</option><option>历史文化题库</option><option>非遗知识题库</option></select></div>
                                    <div><label>题型</label><select>${standardAnswerQuestionTypeOptions()}</select></div>
                                    <div><label>抽取数量</label><input type="number" value="10" min="1"></div>
                                    <div><label>每题分值</label><input type="number" value="10" min="1"></div>
                                    <div><label>操作</label><button type="button" class="draw-rule-delete-btn" onclick="removeDrawRuleRow(this)" title="删除本条规则" aria-label="删除本条规则" disabled><span class="trash-icon" aria-hidden="true"></span></button></div>
                                </div>
                            </div>
                            <button class="btn btn-outline btn-sm" style="margin-top:10px" onclick="addRandomDrawRule()">+ 添加规则</button>
                        </div>
                    </div>
                    <!-- 每日指定题库随机抽题 -->
                    <div id="panelDailyPlan" style="display:none">
                        <div class="info-box blue" style="margin-bottom:12px">💡 为每一天配置不同的抽题规则，适用于有明确主题划分的活动</div>
                        <div class="config-block">
                            <div class="config-block-title">📅 每日抽题计划</div>
                            <div id="dailyPlanList">
                                <div class="schedule-row" style="border-bottom:1px solid var(--border-color-light);padding-bottom:10px">
                                    <div><label>日期</label><input type="date" value="2026-06-01" style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px"></div>
                                    <div><label>题库</label><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px"><option>图书馆知识题库</option><option>历史文化题库</option><option>非遗知识题库</option></select></div>
                                    <div><label>数量</label><input type="number" value="10" min="1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px"></div>
                                    <div><label>操作</label><span class="action-link danger" onclick="this.closest('.schedule-row').remove()">删除</span></div>
                                </div>
                            </div>
                            <button class="btn btn-outline btn-sm" style="margin-top:10px" onclick="addDailyPlanRow()">+ 添加一天</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 5. 默认规则 -->
    <div class="cfg-panel" id="chPanel5">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('chPanel5')">
            <div class="cfg-panel-icon purple">📋</div>
            <div><div class="cfg-panel-title">默认规则</div><div class="cfg-panel-subtitle">每日答题模式的固定行为规则</div></div>
            <span class="cfg-panel-badge advanced">高级</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="rule-toggle locked">
                <span class="rule-icon">💡</span>
                <div class="rule-text"><div class="rule-label">每题后显示解析 <span class="lock-tag">固定</span></div><div class="rule-desc">每日答题模式固定为答完每题立即展示解析</div></div>
            </div>
            <div class="rule-toggle locked">
                <span class="rule-icon">⏭️</span>
                <div class="rule-text"><div class="rule-label">不允许跳题 <span class="lock-tag">固定</span></div><div class="rule-desc">每日答题模式不支持跳题，必须逐题作答</div></div>
            </div>
            <div class="rule-toggle locked">
                <span class="rule-icon">📋</span>
                <div class="rule-text"><div class="rule-label">无答题卡 <span class="lock-tag">固定</span></div><div class="rule-desc">每日答题模式不显示答题卡</div></div>
            </div>
            <div class="rule-toggle locked">
                <span class="rule-icon">✋</span>
                <div class="rule-text"><div class="rule-label">不支持提前提交 <span class="lock-tag">固定</span></div><div class="rule-desc">必须答完所有题目后自动提交</div></div>
            </div>
            <div class="rule-toggle">
                <span class="rule-icon">⏳</span>
                <div class="rule-text"><div class="rule-label">中断后计时继续</div><div class="rule-desc">中断答题后倒计时继续</div></div>
                <label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label>
            </div>
            <div class="rule-toggle">
                <span class="rule-icon">⏰</span>
                <div class="rule-text"><div class="rule-label">超时自动交卷</div><div class="rule-desc">单题限时耗尽后自动提交当前题目</div></div>
                <label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label>
            </div>
        </div>
    </div>

    <!-- 6. 分值与排名 -->
    <div class="cfg-panel" id="chPanel6">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('chPanel6')">
            <div class="cfg-panel-icon orange">📊</div>
            <div><div class="cfg-panel-title">分值与排名</div><div class="cfg-panel-subtitle">每日得分计算与排行榜规则</div></div>
            <span class="cfg-panel-badge optional">选填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label">每日得分计算规则 <span class="help-tip" title="当用户同一天多次答题时，以哪种得分计入排行">?</span></div>
                <div class="cfg-row-control"><select class="form-control" style="max-width:240px"><option>每日最高分</option><option>每日最后一次得分</option></select></div>
            </div>
            <div class="cfg-row">
                <div class="cfg-row-label">排名规则 <span class="help-tip" title="排行榜排序依据">?</span></div>
                <div class="cfg-row-control"><select class="form-control" style="max-width:240px"><option>累计总积分</option><option>每日平均分</option></select></div>
            </div>
            <div class="info-box yellow" style="margin-top:4px">🏆 排行榜排序规则：<strong>累计总积分 &gt; 有效参与天数 &gt; 累计用时 &gt; 最早达成时间</strong></div>
        </div>
    </div>`;
}
// ===== 闯关模式 Config — Mind Map Aligned =====

// 关卡列表 mock data
let levelStages = [
    { id: 1, name: '第一关：基础入门', bank: '我的题库 > 图书馆知识题库', types: '单选题+判断题', count: 10, scorePer: 10, passScore: 60 },
    { id: 2, name: '第二关：进阶提升', bank: '我的题库 > 历史文化题库', types: '单选题+多选题', count: 15, scorePer: 10, passScore: 70 },
    { id: 3, name: '第三关：高级挑战', bank: '非遗知识题库', types: '全部标准答案题', count: 20, scorePer: 10, passScore: 80 }
];
let levelNextId = 4;

function addLevelStage() {
    const container = document.getElementById('levelStageList');
    if (!container) return;
    const cn = ['一','二','三','四','五','六','七','八','九','十'];
    const idx = levelNextId - 1;
    const label = idx < cn.length ? cn[idx] : idx;
    const newStage = { id: levelNextId, name: `第${label}关：自定义关卡`, bank: '我的题库 > 图书馆知识题库', types: '全部标准答案题', count: 10, scorePer: 10, passScore: 60 };
    levelStages.push(newStage);
    levelNextId++;
    rerenderLevelStages();
}

function removeLevelStage(id) {
    if (levelStages.length <= 1) return;
    levelStages = levelStages.filter(s => s.id !== id);
    rerenderLevelStages();
}

function rerenderLevelStages() {
    const container = document.getElementById('levelStageList');
    if (!container) return;
    container.innerHTML = levelStages.map((s, i) => `
        <div class="level-stage-row" style="display:grid;grid-template-columns:40px 1fr 1fr 1fr 80px 80px 80px 50px;gap:8px;align-items:center;padding:10px 0;${i < levelStages.length - 1 ? 'border-bottom:1px solid var(--border-color-light)' : ''}">
            <div style="text-align:center"><span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--primary-light);color:var(--primary);font-weight:700;font-size:12px">${i + 1}</span></div>
            <div><input type="text" value="${s.name}" style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px" onchange="levelStages[${i}].name=this.value"></div>
            <div><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px" onchange="levelStages[${i}].bank=this.value"><option${s.bank.includes('图书馆') ? ' selected' : ''}>图书馆知识题库</option><option${s.bank.includes('历史文化') ? ' selected' : ''}>历史文化题库</option><option${s.bank.includes('非遗') ? ' selected' : ''}>非遗知识题库</option></select></div>
            <div><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px" onchange="levelStages[${i}].types=this.value">${standardAnswerQuestionTypeOptions(s.types)}</select></div>
            <div><input type="number" value="${s.count}" min="1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="levelStages[${i}].count=parseInt(this.value)"></div>
            <div><input type="number" value="${s.scorePer}" min="1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="levelStages[${i}].scorePer=parseInt(this.value)"></div>
            <div><input type="number" value="${s.passScore}" min="0" style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="levelStages[${i}].passScore=parseInt(this.value)"></div>
            <div style="text-align:center">${levelStages.length > 1 ? `<span class="action-link danger" onclick="removeLevelStage(${s.id})" style="font-size:12px;cursor:pointer">删除</span>` : ''}</div>
        </div>
    `).join('');
    const totalQuestions = levelStages.reduce((a, s) => a + s.count, 0);
    const totalScore = levelStages.reduce((a, s) => a + s.count * s.scorePer, 0);
    const summaryEl = document.getElementById('levelStageSummary');
    if (summaryEl) {
        summaryEl.innerHTML = `共 <strong>${levelStages.length}</strong> 关 · <strong>${totalQuestions}</strong> 题 · 总分 <strong>${totalScore}</strong>`;
    }
}

function renderLevelModeConfig() {
    const totalQuestions = levelStages.reduce((a, s) => a + s.count, 0);
    const totalScore = levelStages.reduce((a, s) => a + s.count * s.scorePer, 0);
    return `
    <!-- 1. 答题时间 -->
    <div class="cfg-panel" id="lvPanel1">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('lvPanel1')">
            <div class="cfg-panel-icon blue">⏱</div>
            <div><div class="cfg-panel-title">答题时间</div><div class="cfg-panel-subtitle">设置闯关活动开放时间范围</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 活动开放时间 <span class="help-tip" title="闯关模式仅配置开放时间范围，不设置关卡答题时间限制">?</span></div>
                <div class="cfg-row-control">
                    <div style="display:flex;gap:8px;align-items:center">
                        <input type="datetime-local" class="form-control" value="2026-06-01T09:00">
                        <span style="color:var(--text-tertiary);font-size:13px">至</span>
                        <input type="datetime-local" class="form-control" value="2026-06-30T18:00">
                    </div>
                </div>
            </div>
            <div class="info-box green">⚔️ 闯关模式不设置关卡答题时间限制。用户可从容答题，实时校验闯关结果。</div>
        </div>
    </div>

    <!-- 2. 关卡配置 -->
    <div class="cfg-panel" id="lvPanel2">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('lvPanel2')">
            <div class="cfg-panel-icon blue">⚔️</div>
            <div><div class="cfg-panel-title">关卡配置</div><div class="cfg-panel-subtitle">配置每关的题库、题型、题目数量、每题分值和通关条件</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="info-box green">⚔️ 闯关模式仅支持有标准答案的题型：单选题、多选题、判断题、填空题、排序题。系统自动过滤简答题。</div>
            <div class="config-block">
                <div class="config-block-title">📋 关卡列表 <span id="levelStageSummary" style="color:var(--text-tertiary);font-weight:400;font-size:12px;margin-left:8px">共 <strong>${levelStages.length}</strong> 关 · <strong>${totalQuestions}</strong> 题 · 总分 <strong>${totalScore}</strong></span></div>
                <div style="display:grid;grid-template-columns:40px 1fr 1fr 1fr 80px 80px 80px 50px;gap:8px;padding:8px 0;border-bottom:2px solid var(--border-color);font-size:12px;font-weight:600;color:var(--text-secondary)">
                    <div style="text-align:center">序号</div><div>关卡名称</div><div>题库来源</div><div>题型</div><div style="text-align:center">题目数</div><div style="text-align:center">每题分值</div><div style="text-align:center">通关分</div><div style="text-align:center">操作</div>
                </div>
                <div id="levelStageList">
                    ${levelStages.map((s, i) => `
                    <div class="level-stage-row" style="display:grid;grid-template-columns:40px 1fr 1fr 1fr 80px 80px 80px 50px;gap:8px;align-items:center;padding:10px 0;${i < levelStages.length - 1 ? 'border-bottom:1px solid var(--border-color-light)' : ''}">
                        <div style="text-align:center"><span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--primary-light);color:var(--primary);font-weight:700;font-size:12px">${i + 1}</span></div>
                        <div><input type="text" value="${s.name}" style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px" onchange="levelStages[${i}].name=this.value"></div>
                        <div><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px" onchange="levelStages[${i}].bank=this.value"><option${s.bank.includes('图书馆') ? ' selected' : ''}>图书馆知识题库</option><option${s.bank.includes('历史文化') ? ' selected' : ''}>历史文化题库</option><option${s.bank.includes('非遗') ? ' selected' : ''}>非遗知识题库</option></select></div>
                        <div><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px" onchange="levelStages[${i}].types=this.value">${standardAnswerQuestionTypeOptions(s.types)}</select></div>
                        <div><input type="number" value="${s.count}" min="1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="levelStages[${i}].count=parseInt(this.value)"></div>
                        <div><input type="number" value="${s.scorePer}" min="1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="levelStages[${i}].scorePer=parseInt(this.value)"></div>
                        <div><input type="number" value="${s.passScore}" min="0" style="width:100%;padding:6px 8px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="levelStages[${i}].passScore=parseInt(this.value)"></div>
                        <div style="text-align:center">${levelStages.length > 1 ? `<span class="action-link danger" onclick="removeLevelStage(${s.id})" style="font-size:12px;cursor:pointer">删除</span>` : ''}</div>
                    </div>
                    `).join('')}
                </div>
                <button class="btn btn-outline btn-sm" style="margin-top:12px" onclick="addLevelStage()">+ 添加关卡</button>
            </div>
        </div>
    </div>

    <!-- 3. 闯关规则 -->
    <div class="cfg-panel" id="lvPanel3">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('lvPanel3')">
            <div class="cfg-panel-icon green">📋</div>
            <div><div class="cfg-panel-title">闯关规则</div><div class="cfg-panel-subtitle">关卡解锁、实时校验与解析展示</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="rule-toggle locked">
                <span class="rule-icon">🔒</span>
                <div class="rule-text"><div class="rule-label">每关结束后才能进入下一关 <span class="lock-tag">固定</span></div><div class="rule-desc">前一关达到通关分数后，才解锁下一关</div></div>
            </div>
            <div class="rule-toggle locked">
                <span class="rule-icon">💡</span>
                <div class="rule-text"><div class="rule-label">每题后显示解析 <span class="lock-tag">固定</span></div><div class="rule-desc">每答完一题后自动展示该题答案与解析</div></div>
            </div>
            <div class="rule-toggle locked">
                <span class="rule-icon">✅</span>
                <div class="rule-text"><div class="rule-label">实时校验是否通关 <span class="lock-tag">固定</span></div><div class="rule-desc">每答一题即实时校验是否已达到通关分数</div></div>
            </div>
            <div class="rule-toggle locked">
                <span class="rule-icon">⏭️</span>
                <div class="rule-text"><div class="rule-label">通关后自动进入下一关 <span class="lock-tag">固定</span></div><div class="rule-desc">闯关成功后自动引导进入下一关</div></div>
            </div>
            <div class="rule-toggle locked">
                <span class="rule-icon">⏭️</span>
                <div class="rule-text"><div class="rule-label">不允许跳题 <span class="lock-tag">固定</span></div><div class="rule-desc">闯关模式不支持跳题，必须逐题作答</div></div>
            </div>
            <div class="rule-toggle locked">
                <span class="rule-icon">📋</span>
                <div class="rule-text"><div class="rule-label">无答题卡 <span class="lock-tag">固定</span></div><div class="rule-desc">闯关模式不显示答题卡</div></div>
            </div>
            <div class="rule-toggle locked">
                <span class="rule-icon">✋</span>
                <div class="rule-text"><div class="rule-label">不支持提前提交 <span class="lock-tag">固定</span></div><div class="rule-desc">必须答完所有题目后自动提交</div></div>
            </div>
            <div class="rule-toggle">
                <span class="rule-icon">⏳</span>
                <div class="rule-text"><div class="rule-label">中断后继续</div><div class="rule-desc">中断答题后可继续当前关卡</div></div>
                <label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label>
            </div>
        </div>
    </div>

    <!-- 5. 排行榜规则 -->
    <div class="cfg-panel" id="lvPanel5">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('lvPanel5')">
            <div class="cfg-panel-icon orange">🏆</div>
            <div><div class="cfg-panel-title">排行榜规则</div><div class="cfg-panel-subtitle">闯关时间榜与总分榜</div></div>
            <span class="cfg-panel-badge optional">选填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="info-box blue">🏆 闯关模式排行榜排序规则：<strong>闯关关卡数（高→低）＞ 累计总分（高→低）＞ 通关总用时（短→长）＞ 最早通关时间（早→晚）</strong></div>
            <div class="cfg-row">
                <div class="cfg-row-label">总分榜计算规则 <span class="help-tip" title="计算用户累计总分的方式">?</span></div>
                <div class="cfg-row-control"><select class="form-control" style="max-width:280px"><option>所有关卡最高分之和</option><option>所有关卡最后一次得分之和</option></select></div>
            </div>
            <div class="cfg-row">
                <div class="cfg-row-label">显示排行榜 <span class="help-tip" title="是否在用户端显示排行榜">?</span></div>
                <div class="cfg-row-control"><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
            </div>
        </div>
    </div>`;
}

/* Legacy orphaned markup kept out of execution.
// Step 5: 外观与其他
        <div class="form-group"><label><span class="req">*</span> 每题限时</label><div class="inline-field"><input type="number" value="60" min="1"><span>秒</span></div><p class="hint">限制用户每道题的作答时间。超时后自动跳转下一题。</p></div>
    </div></div>

    <!-- 参与次数 -->
    <div class="section"><div class="section-head"><div class="sec-icon green">🔄</div><div><div class="sec-title">参与次数</div></div></div><div class="section-body">
        <div class="form-group"><label><span class="req">*</span> 每日答题次数</label>
            <div class="radio-group"><div class="radio-item"><input type="radio" name="chDaily" checked><label>每天仅可答 1 次</label></div><div class="radio-item"><input type="radio" name="chDaily"><label>每天可答</label><input type="number" style="width:56px;margin:0 4px;padding:4px 6px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:13px;text-align:center" placeholder="N"><label>次</label></div><div class="radio-item"><input type="radio" name="chDaily"><label>每天不限次</label></div></div>
        </div>
        <div class="form-group"><label>每人最多答题次数</label><div class="inline-field"><input type="number" placeholder="留空不限制" min="1"><span>次</span></div></div>
    </div></div>

    <!-- 参与规则 -->
    <div class="section"><div class="section-head"><div class="sec-icon yellow">📋</div><div><div class="sec-title">参与规则</div></div></div><div class="section-body">
        <div class="config-block">
            <div class="sw-row"><div class="sw-text"><div class="sw-label">允许中断答题</div></div><label class="switch"><input type="checkbox"><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">中断后默认计时将继续</div></div><label class="switch"><input type="checkbox"><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">允许跳题</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">显示答题卡</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">立即显示成绩</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">显示答题解析</div></div><label class="switch"><input type="checkbox"><span class="sw-slider"></span></label></div>
        </div>
    </div></div>

    <!-- 题目来源 -->
    <div class="section"><div class="section-head"><div class="sec-icon blue">🎯</div><div><div class="sec-title">题目来源</div><div class="sec-subtitle">闯关模式：支持题库随机抽题和每日指定题库随机抽题</div></div></div><div class="section-body">
        <div class="info-box green">🎯 闯关模式使用「抽题规则」配置题目来源。首期建议保留两种方式：<strong>① 题库随机抽题</strong>（每天规则一致）<strong>② 每日指定题库随机抽题</strong>（每天主题/关卡不同）。</div>
        <div style="display:flex;gap:0;border-bottom:2px solid var(--border);margin-bottom:16px">
            <div class="tab" id="tabRandomDraw" onclick="switchChallengeDrawTab('random')" style="padding:8px 16px;cursor:pointer;border-bottom:2px solid var(--primary);margin-bottom:-2px;font-size:13px;color:var(--primary);font-weight:700">题库随机抽题</div>
            <div class="tab" id="tabDailyPlan" onclick="switchChallengeDrawTab('daily')" style="padding:8px 16px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;font-size:13px;color:var(--text-muted);font-weight:500">每日指定题库随机抽题</div>
        </div>
        
        <!-- 题库随机抽题 -->
        <div id="panelRandomDraw">
            <div class="config-block">
                <div class="config-block-title">📋 抽题规则</div>
                <div id="randomDrawRules">
                    <div class="draw-rule" style="border-bottom:1px solid var(--border-light);padding-bottom:8px">
                        <div><label>题库</label><select><option>图书馆知识题库</option><option>历史文化题库</option><option>非遗知识题库</option></select></div>
                        <div><label>题型</label><select>${standardAnswerQuestionTypeOptions()}</select></div>
                        <div><label>抽取数量</label><input type="number" value="10" min="1"></div>
                        <div><label>每题分值</label><input type="number" value="10" min="1"></div>
                        <div><label>操作</label><button type="button" class="draw-rule-delete-btn" onclick="removeDrawRuleRow(this)" title="删除本条规则" aria-label="删除本条规则"><span class="trash-icon" aria-hidden="true"></span></button></div>
                    </div>
                    <div class="draw-rule">
                        <div><label>题库</label><select><option>历史文化题库</option><option>图书馆知识题库</option></select></div>
                        <div><label>题型</label><select>${standardAnswerQuestionTypeOptions('单选题')}</select></div>
                        <div><label>抽取数量</label><input type="number" value="5" min="1"></div>
                        <div><label>每题分值</label><input type="number" value="10" min="1"></div>
                        <div><label>操作</label><button type="button" class="draw-rule-delete-btn" onclick="removeDrawRuleRow(this)" title="删除本条规则" aria-label="删除本条规则"><span class="trash-icon" aria-hidden="true"></span></button></div>
                    </div>
                </div>
                <button class="btn btn-outline btn-sm" style="margin-top:10px" onclick="addRandomDrawRule()">+ 添加规则</button>
            </div>
            <div class="sw-row" style="padding-top:8px"><div class="sw-text"><div class="sw-label">每日重新抽题</div><div class="sw-hint">同一用户每天多次答题时是否重新抽题</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
        </div>
        
        <!-- 每日指定题库随机抽题 -->
        <div id="panelDailyPlan" style="display:none">
            <div class="info-box blue" style="margin-bottom:12px">💡 每日指定题库随机抽题支持为每一天配置不同的抽题规则，适用于有明确主题/关卡划分的闯关活动。</div>
            <div class="config-block">
                <div class="config-block-title">📅 每日抽题计划</div>
                <div id="dailyPlanList">
                    <div class="schedule-row" style="border-bottom:1px solid var(--border-light);padding-bottom:10px">
                        <div><label>日期</label><input type="date" value="2026-06-01" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"></div>
                        <div><label>主题/关卡</label><input type="text" value="第1天：图书馆基础知识" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"></div>
                        <div><label>题库</label><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"><option>图书馆知识题库</option><option>历史文化题库</option><option>非遗知识题库</option></select></div>
                        <div><label>题型</label><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px">${standardAnswerQuestionTypeOptions()}</select></div>
                        <div><label>数量</label><input type="number" value="10" min="1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"></div>
                        <div><label>操作</label><span class="action-link danger" onclick="this.closest('.schedule-row').remove()">删除</span></div>
                    </div>
                    <div class="schedule-row" style="border-bottom:1px solid var(--border-light);padding-bottom:10px">
                        <div><label>日期</label><input type="date" value="2026-06-02" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"></div>
                        <div><label>主题/关卡</label><input type="text" value="第2天：历史文化概览" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"></div>
                        <div><label>题库</label><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"><option>历史文化题库</option><option>图书馆知识题库</option><option>非遗知识题库</option></select></div>
                        <div><label>题型</label><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px">${standardAnswerQuestionTypeOptions('单选题')}</select></div>
                        <div><label>数量</label><input type="number" value="12" min="1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"></div>
                        <div><label>操作</label><span class="action-link danger" onclick="this.closest('.schedule-row').remove()">删除</span></div>
                    </div>
                    <div class="schedule-row">
                        <div><label>日期</label><input type="date" value="2026-06-03" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"></div>
                        <div><label>主题/关卡</label><input type="text" value="第3天：非遗文化探秘" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"></div>
                        <div><label>题库</label><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"><option>非遗知识题库</option><option>历史文化题库</option><option>图书馆知识题库</option></select></div>
                        <div><label>题型</label><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px">${standardAnswerQuestionTypeOptions()}</select></div>
                        <div><label>数量</label><input type="number" value="15" min="1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px"></div>
                        <div><label>操作</label><span class="action-link danger" onclick="this.closest('.schedule-row').remove()">删除</span></div>
                    </div>
                </div>
                <button class="btn btn-outline btn-sm" style="margin-top:10px" onclick="addDailyPlanRow()">+ 添加一天</button>
            </div>
            <div class="sw-row" style="padding-top:8px"><div class="sw-text"><div class="sw-label">每日重新抽题</div><div class="sw-hint">同一用户每天多次答题时是否重新抽题</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
        </div>
    </div></div>

    <!-- 随机规则 -->
    <div class="section"><div class="section-head"><div class="sec-icon green">🔀</div><div><div class="sec-title">随机规则</div></div></div><div class="section-body">
        <div class="config-block">
            <div class="sw-row"><div class="sw-text"><div class="sw-label">题目顺序随机</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">选项顺序随机</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
        </div>
    </div></div>

    <!-- 分值规则 -->
    <div class="section"><div class="section-head"><div class="sec-icon yellow">📊</div><div><div class="sec-title">分值规则</div></div></div><div class="section-body">
        <div class="info-box blue">💡 闯关模式的每题分值在上方抽题规则中配置，系统自动汇总计算总分。</div>
        <div class="config-block">
            <div class="sw-row"><div class="sw-text"><div class="sw-label">每题分值</div><div class="sw-hint">在上方抽题规则中已配置</div></div><span class="badge badge-blue">已配置</span></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">总分计算</div><div class="sw-hint">系统根据题目数量和分值自动计算</div></div><span class="badge badge-green">自动计算</span></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">满分是否默认 100 分</div><div class="sw-hint">⚠️ 此项待确认</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
        </div>
        <div class="form-row" style="margin-top:12px">
            <div class="form-group"><label>每日得分计算规则</label><select class="form-control"><option>每日最高分</option><option>每日最后一次得分</option></select></div>
            <div class="form-group"><label>排名规则</label><select class="form-control"><option>累计总积分</option><option>每日平均分</option></select></div>
        </div>
        <div class="info-box yellow" style="margin-top:12px">🏆 排行榜排序规则：<strong>累计总积分 &gt; 有效参与天数 &gt; 累计用时 &gt; 最早达成时间</strong></div>
    </div></div>`;
}

// ===== Level Mode (闯关模式) Helper Functions =====

// 关卡列表 mock data
let levelStages = [
    { id: 1, name: '第一关：基础入门', bank: '图书馆知识题库', types: '单选题+判断题', count: 10, scorePer: 10, passScore: 60 },
    { id: 2, name: '第二关：进阶提升', bank: '历史文化题库', types: '单选题+多选题', count: 15, scorePer: 10, passScore: 70 },
    { id: 3, name: '第三关：高级挑战', bank: '非遗知识题库', types: '全部标准答案题', count: 20, scorePer: 10, passScore: 80 }
];
let levelNextId = 4;

function addLevelStage() {
    const container = document.getElementById('levelStageList');
    if (!container) return;
    const cn = ['一','二','三','四','五','六','七','八','九','十'];
    const idx = levelNextId - 1;
    const label = idx < cn.length ? cn[idx] : idx;
    const newStage = { id: levelNextId, name: `第${label}关：自定义关卡`, bank: '图书馆知识题库', types: '全部标准答案题', count: 10, scorePer: 10, passScore: 60 };
    levelStages.push(newStage);
    levelNextId++;
    rerenderLevelStages();
}

function removeLevelStage(id) {
    if (levelStages.length <= 1) return;
    levelStages = levelStages.filter(s => s.id !== id);
    rerenderLevelStages();
}

function rerenderLevelStages() {
    const container = document.getElementById('levelStageList');
    if (!container) return;
    container.innerHTML = levelStages.map((s, i) => `
        <div class="level-stage-row" style="display:grid;grid-template-columns:40px 1fr 1fr 1fr 80px 80px 80px 50px;gap:8px;align-items:center;padding:10px 0;${i < levelStages.length - 1 ? 'border-bottom:1px solid var(--border-light)' : ''}">
            <div style="text-align:center"><span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--primary-light);color:var(--primary);font-weight:700;font-size:12px">${i + 1}</span></div>
            <div><input type="text" value="${s.name}" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px" onchange="levelStages[${i}].name=this.value"></div>
            <div><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px" onchange="levelStages[${i}].bank=this.value"><option${s.bank === '图书馆知识题库' ? ' selected' : ''}>图书馆知识题库</option><option${s.bank === '历史文化题库' ? ' selected' : ''}>历史文化题库</option><option${s.bank === '非遗知识题库' ? ' selected' : ''}>非遗知识题库</option></select></div>
            <div><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px" onchange="levelStages[${i}].types=this.value">${standardAnswerQuestionTypeOptions(s.types)}</select></div>
            <div><input type="number" value="${s.count}" min="1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="levelStages[${i}].count=parseInt(this.value)"></div>
            <div><input type="number" value="${s.scorePer}" min="1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="levelStages[${i}].scorePer=parseInt(this.value)"></div>
            <div><input type="number" value="${s.passScore}" min="0" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="levelStages[${i}].passScore=parseInt(this.value)"></div>
            <div style="text-align:center">${levelStages.length > 1 ? `<span class="action-link danger" onclick="removeLevelStage(${s.id})" style="font-size:12px;cursor:pointer">删除</span>` : ''}</div>
        </div>
    `).join('');
    // Update summary
    const totalQuestions = levelStages.reduce((a, s) => a + s.count, 0);
    const totalScore = levelStages.reduce((a, s) => a + s.count * s.scorePer, 0);
    const summaryEl = document.getElementById('levelStageSummary');
    if (summaryEl) {
        summaryEl.innerHTML = `共 <strong>${levelStages.length}</strong> 关 · <strong>${totalQuestions}</strong> 题 · 总分 <strong>${totalScore}</strong>`;
    }
}

// Level Mode Config
function renderLevelModeConfig() {
    const totalQuestions = levelStages.reduce((a, s) => a + s.count, 0);
    const totalScore = levelStages.reduce((a, s) => a + s.count * s.scorePer, 0);
    return `
    <!-- Section 1: 答题时间 -->
    <div class="section"><div class="section-head"><div class="sec-icon blue">⏱</div><div><div class="sec-title">答题时间</div><div class="sec-subtitle">闯关模式仅配置开放时间范围，不设置关卡答题时间</div></div></div><div class="section-body">
        <div class="form-group"><label><span class="req">*</span> 活动开放时间</label><div class="form-row"><input type="datetime-local" class="form-control" value="2026-06-01T09:00"><input type="datetime-local" class="form-control" value="2026-06-30T18:00"></div></div>
        <div class="info-box green">⚔️ 闯关模式不设置关卡答题时间限制。用户可从容答题，实时校验闯关结果。</div>
    </div></div>

    <!-- Section 2: 参与次数（刷题） -->
    <div class="section"><div class="section-head"><div class="sec-icon green">🔄</div><div><div class="sec-title">闯关次数</div><div class="sec-subtitle">设置用户闯关次数，允许刷题重闯</div></div></div><div class="section-body">
        <div class="form-group"><label><span class="req">*</span> 每关闯关次数</label>
            <div class="radio-group">
                <div class="radio-item"><input type="radio" name="levelAttempts" checked><label>每关仅可闯 1 次</label></div>
                <div class="radio-item"><input type="radio" name="levelAttempts"><label>每关可闯</label><input type="number" style="width:56px;margin:0 4px;padding:4px 6px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:13px;text-align:center" value="3" min="1"><label>次</label></div>
                <div class="radio-item"><input type="radio" name="levelAttempts"><label>每关不限次（允许刷题）</label></div>
            </div>
            <p class="hint">设置每关允许闯关的次数。选择「不限次」可允许用户反复刷题练习。</p>
        </div>
        <div class="form-group"><label>重闯时是否重新抽题</label>
            <div class="radio-group">
                <div class="radio-item"><input type="radio" name="levelRedraw" checked><label>每次重新抽题</label></div>
                <div class="radio-item"><input type="radio" name="levelRedraw"><label>保持相同题目</label></div>
            </div>
            <p class="hint">选择重新抽题可增加刷题效果，选择相同题目可帮助巩固薄弱关卡。</p>
        </div>
        <div class="form-group"><label>取最高分规则</label>
            <div class="radio-group">
                <div class="radio-item"><input type="radio" name="levelBestScore" checked><label>取最高分为本关成绩</label></div>
                <div class="radio-item"><input type="radio" name="levelBestScore"><label>取最后一次为未关成绩</label></div>
            </div>
        </div>
    </div></div>

    <!-- Section 3: 参与规则 -->
    <div class="section"><div class="section-head"><div class="sec-icon yellow">📋</div><div><div class="sec-title">闯关规则</div><div class="sec-subtitle">关卡解锁、实时校验、即时解析</div></div></div><div class="section-body">
        <div class="info-box blue">⚔️ 闯关模式核心规则：用户必须按顺序闯关，前一关通过后才能解锁下一关。答题过程中实时校验闯关结果。</div>
        <div class="config-block">
            <div class="sw-row"><div class="sw-text"><div class="sw-label">顺序解锁</div><div class="sw-hint">前一关达到通关分数后，才解锁下一关</div></div><label class="switch"><input type="checkbox" checked disabled><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">实时校验闯关结果</div><div class="sw-hint">每答一题即实时校验是否已达到通关分数</div></div><label class="switch"><input type="checkbox" checked disabled><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">闯关成功弹窗</div><div class="sw-hint">闯关成功后弹出提示，用户可选择「继续答题」或「进入下一关」</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">闯关失败实时提示</div><div class="sw-hint">当剩余题目已无法达到通关分数时，实时提示失败</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">答完一题立即显示解析</div><div class="sw-hint">每答完一题后自动展示该题答案与解析，帮助用户即时学习</div></div><label class="switch"><input type="checkbox" checked disabled><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">显示答题卡</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
        </div>
        <div class="info-box yellow" style="margin-top:12px">💡 闯关成功弹窗示例：<strong>🎉 恭喜过关！</strong> 您可以「继续答题」获取更高分，或「进入下一关」开始新挑战。闯关失败提示：<strong>😢 很遗憾</strong>，剩余题目已无法达到通关分数，本次闯关失败。</div>
    </div></div>

    <!-- Section 4: 关卡列表（题目来源） -->
    <div class="section"><div class="section-head"><div class="sec-icon blue">⚔️</div><div><div class="sec-title">关卡列表</div><div class="sec-subtitle">配置每关的题库、题型、题目数量、每题分值和通关分数</div></div></div><div class="section-body">
        ${renderLegacyScoreNotice(totalScore, 100)}
        <div class="info-box green">⚔️ 闯关模式仅支持有标准答案的题型：单选题、多选题、判断题、填空题、排序题。系统自动过滤简答题。</div>
        <div class="config-block">
            <div class="config-block-title">📋 关卡配置 <span id="levelStageSummary" style="color:var(--text-muted);font-weight:400;font-size:12px;margin-left:8px">共 <strong>${levelStages.length}</strong> 关 · <strong>${totalQuestions}</strong> 题 · 总分 <strong>${totalScore}</strong></span></div>
            <!-- Table Header -->
            <div style="display:grid;grid-template-columns:40px 1fr 1fr 1fr 80px 80px 80px 50px;gap:8px;padding:8px 0;border-bottom:2px solid var(--border);font-size:12px;font-weight:600;color:var(--text-secondary)">
                <div style="text-align:center">序号</div>
                <div>关卡名称</div>
                <div>使用题库</div>
                <div>题型</div>
                <div style="text-align:center">题目数</div>
                <div style="text-align:center">每题分值</div>
                <div style="text-align:center">通关分</div>
                <div style="text-align:center">操作</div>
            </div>
            <!-- Stage Rows -->
            <div id="levelStageList">
                ${levelStages.map((s, i) => `
                <div class="level-stage-row" style="display:grid;grid-template-columns:40px 1fr 1fr 1fr 80px 80px 80px 50px;gap:8px;align-items:center;padding:10px 0;${i < levelStages.length - 1 ? 'border-bottom:1px solid var(--border-light)' : ''}">
                    <div style="text-align:center"><span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--primary-light);color:var(--primary);font-weight:700;font-size:12px">${i + 1}</span></div>
                    <div><input type="text" value="${s.name}" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px" onchange="levelStages[${i}].name=this.value"></div>
                    <div><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px" onchange="levelStages[${i}].bank=this.value"><option${s.bank === '图书馆知识题库' ? ' selected' : ''}>图书馆知识题库</option><option${s.bank === '历史文化题库' ? ' selected' : ''}>历史文化题库</option><option${s.bank === '非遗知识题库' ? ' selected' : ''}>非遗知识题库</option></select></div>
                    <div><select style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px" onchange="levelStages[${i}].types=this.value">${standardAnswerQuestionTypeOptions(s.types)}</select></div>
                    <div><input type="number" value="${s.count}" min="1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="levelStages[${i}].count=parseInt(this.value)"></div>
                    <div><input type="number" value="${s.scorePer}" min="1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="levelStages[${i}].scorePer=parseInt(this.value)"></div>
                    <div><input type="number" value="${s.passScore}" min="0" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="levelStages[${i}].passScore=parseInt(this.value)"></div>
                    <div style="text-align:center">${levelStages.length > 1 ? `<span class="action-link danger" onclick="removeLevelStage(${s.id})" style="font-size:12px;cursor:pointer">删除</span>` : ''}</div>
                </div>
                `).join('')}
            </div>
            <button class="btn btn-outline btn-sm" style="margin-top:12px" onclick="addLevelStage()">+ 添加关卡</button>
        </div>
        <div class="info-box blue" style="margin-top:12px">💡 每关可独立配置题库、题型、题目数量和通关分数。题型仅限标准答案题（单选、多选、判断、填空、排序），不支持简答题。</div>
    </div></div>

    <!-- Section 5: 随机规则 -->
    <div class="section"><div class="section-head"><div class="sec-icon green">🔀</div><div><div class="sec-title">随机规则</div><div class="sec-subtitle">闯关模式固定题目与选项顺序，不做随机排序</div></div></div><div class="section-body">
        <div class="info-box yellow">⚠️ 闯关模式默认<strong>不随机排序</strong>题目和选项，确保所有用户在同一关卡看到相同的题目顺序和选项顺序。</div>
        <div class="config-block">
            <div class="sw-row"><div class="sw-text"><div class="sw-label">题目顺序随机</div><div class="sw-hint">闯关模式建议关闭，保持一致体验</div></div><label class="switch"><input type="checkbox" disabled><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">选项顺序随机</div><div class="sw-hint">闯关模式建议关闭，保持一致体验</div></div><label class="switch"><input type="checkbox" disabled><span class="sw-slider"></span></label></div>
        </div>
    </div></div>

    <!-- Section 6: 排行榜规则 -->
    <div class="section"><div class="section-head"><div class="sec-icon yellow">🏆</div><div><div class="sec-title">排行榜规则</div><div class="sec-subtitle">闯关时间榜与总分榜，权重：闯关关卡数 > 分数</div></div></div><div class="section-body">
        <div class="form-group"><label><span class="req">*</span> 排行榜类型</label>
            <div class="checkbox-group">
                <div class="checkbox-item"><input type="checkbox" checked><label>闯关时间榜</label><span style="font-size:12px;color:var(--text-muted);margin-left:4px">按通关先后排名</span></div>
                <div class="checkbox-item"><input type="checkbox" checked><label>总分榜</label><span style="font-size:12px;color:var(--text-muted);margin-left:4px">按累计分数排名</span></div>
            </div>
        </div>
        <div class="form-group"><label><span class="req">*</span> 排序权重</label>
            <div class="info-box blue" style="margin-bottom:0">
                🏆 闯关模式排行榜排序规则：<strong>闯关关卡数（高→低）＞ 累计总分（高→低）＞ 通关总用时（短→长）＞ 最早通关时间（早→晚）</strong>
            </div>
        </div>
        <div class="form-row" style="margin-top:12px">
            <div class="form-group"><label>闯关时间榜计算规则</label><select class="form-control"><option>按通关总用时排名</option><option>按最后一关通关时间排名</option><option>按第一关通关时间排名</option></select></div>
            <div class="form-group"><label>总分榜计算规则</label><select class="form-control"><option>所有关卡最高分之和</option><option>所有关卡最后一次得分之和</option></select></div>
        </div>
        <div class="config-block" style="margin-top:12px">
            <div class="sw-row"><div class="sw-text"><div class="sw-label">显示排行榜</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">排行榜显示通关关卡数</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">排行榜显示通关用时</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
        </div>
    </div></div>

    <!-- Section 7: 分值规则 -->
    <div class="section"><div class="section-head"><div class="sec-icon blue">📊</div><div><div class="sec-title">分值规则</div></div></div><div class="section-body">
        <div class="info-box blue">💡 闯关模式的每题分值在上方关卡列表中逐关配置，系统自动汇总计算总分和通关条件。</div>
        <div class="config-block">
            <div class="sw-row"><div class="sw-text"><div class="sw-label">每题分值</div><div class="sw-hint">在上方关卡列表中已逐关配置</div></div><span class="badge badge-blue">已配置</span></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">总分计算</div><div class="sw-hint">系统根据每关题目数×分值自动汇总</div></div><span class="badge badge-green">自动计算</span></div>
            <div class="sw-row"><div class="sw-text"><div class="sw-label">通关条件</div><div class="sw-hint">每关达到通关分即为过关</div></div><span class="badge badge-blue">逐关配置</span></div>
        </div>
        <div class="form-row" style="margin-top:12px">
            <div class="form-group"><label>得分展示</label><select class="form-control"><option>实时展示（每题后）</option><option>每关结束后展示</option><option>活动结束后展示</option></select></div>
            <div class="form-group"><label>答案解析展示</label><select class="form-control" disabled><option>答完每题立即展示（固定）</option></select><p class="hint">闯关模式固定为答完即显解析</p></div>
        </div>
    </div></div>`;
}

*/

// Step 5: 外观与其他
function renderStep5() {
    return `<div class="card">
        <div class="section"><div class="section-head"><div class="sec-icon blue">🎨</div><div><div class="sec-title">外观装修</div></div></div><div class="section-body">
            <div class="form-row">
                <div class="form-group"><label>主题色</label><input type="color" value="#4A6CF7" style="width:60px;height:36px;border:1.5px solid var(--border);border-radius:var(--radius-sm);cursor:pointer"></div>
                <div class="form-group"><label>封面图</label><div style="border:1.5px dashed var(--border);border-radius:var(--radius-sm);padding:20px;text-align:center;color:var(--text-muted);cursor:pointer">📤 点击上传封面图</div></div>
            </div>
            <div class="form-group"><label>导航显隐</label>
                <div class="config-block">
                    <div class="sw-row"><div class="sw-text"><div class="sw-label">活动首页</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
                    <div class="sw-row"><div class="sw-text"><div class="sw-label">排行榜</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
                </div>
            </div>
        </div></div>

        <div class="section" style="margin-top:20px"><div class="section-head"><div class="sec-icon green">⚙️</div><div><div class="sec-title">其他设置</div></div></div><div class="section-body">
            <div class="config-block">
                <div class="sw-row"><div class="sw-text"><div class="sw-label">分享奖励</div><div class="sw-hint">用户分享活动后可获得积分奖励</div></div><label class="switch"><input type="checkbox"><span class="sw-slider"></span></label></div>
            </div>
        </div></div>
    </div>`;
}

// ===== Quick Actions =====
function copyActivityLink(activityId) {
  const activityNames = {
    1: '图书馆知识竞赛',
    2: '21天阅读知识闯关',
    3: '历史文化知识测试',
    4: '非遗文化知识闯关'
  };
  const fakeUrl = `https://quiz.example.com/activity/${activityId}`;
  
  // Copy to clipboard
  navigator.clipboard.writeText(fakeUrl).then(() => {
    alert(`✅ 已复制活动链接：\n${activityNames[activityId]}\n${fakeUrl}`);
  }).catch(() => {
    // Fallback for older browsers
    prompt('请手动复制链接：', fakeUrl);
  });
}
