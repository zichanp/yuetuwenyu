/* quiz-activity-create.js — 新建答题活动配置页面 (组别+答题模式配置) */

// ===== STATE =====
let quizStep = 3;
let quizActivityMode = 'exam';
let quizActivityPublished = false;
const QUIZ_CREATE_DEMO_SKIP_VALIDATION_ALERTS = true;
let quizTotalScore = 100;
let quizActivityName = '2026“文脉之光”中国国家版本馆文创设计大赛';
let levelCurrentIdx = 0;
let levelQuestionMode = 'random';   // 'random' | 'fixed'
let quizNeedSignup = true;
let quizSignupStart = '';
let quizSignupEnd = '';

// Group state: each group has its own quiz mode and config (PRD-aligned meta)
let groups = [
    {
        name: '组别一',
        formConfigured: false, formFieldCount: 0, formRealName: false,
        quizConfigured: false, quizMode: 'exam',
        quizQCount: 0, quizTotal: 0,
        quizAttemptsText: '',
        updatedAt: ''
    }
];

// Fullscreen modal state
let fsOpen = false;          // fullscreen modal visible?
let fsGroupIdx = 0;          // which group is being configured
let fsPhase = 'select';      // 'select' (choose mode) | 'config' (edit config)
let fsQuizMode = 'exam';     // active mode inside fullscreen modal
let paperDrawerOpen = false; // right-side paper selection drawer
let paperDrawerTarget = null;  // -1 = fixed paper, 0+ = userChoicePapers index, 'phase-N' = phased exam
let dailyQMode = 'random';   // 'random' | 'fixed'
let activityPracticeConfig = {
    exam: { bank: false, bankWay: 'sequence', name: '', startTime: '2026-06-09T06:00', endTime: '2026-07-09T23:59' },
    daily: { bank: false, bankWay: 'sequence', name: '', startTime: '2026-06-09T06:00', endTime: '2026-07-09T23:59' },
    level: { bank: false, bankWay: 'sequence', name: '', startTime: '2026-06-09T06:00', endTime: '2026-07-09T23:59' }
};

// Secondary modal state
let deleteGroupIdx = -1;
let copyCfgSrcIdx = -1;
let copyCfgTargets = [];
let pendingSwitchMode = null;   // holds target mode key when confirming switch
let groupMenuOpenIdx = -1;      // which group's overflow menu is open
let leaderboardRuleOpen = false;
const LEADERBOARD_LIMIT_OPTIONS = [10, 20, 50, 100];
let leaderboardRuleSettings = {
    exam: { displayLimit: 100, unitEnabled: true, unitDisplayLimit: 100 },
    daily: { displayLimit: 100, unitEnabled: true, unitDisplayLimit: 100 },
    level: { displayLimit: 100, unitEnabled: true, unitDisplayLimit: 100 }
};
let quizOrgUnits = [
    { type: '主办单位', name: '中国国际贸易学会、海南大学' },
    { type: '承办单位', name: '' },
    { type: '协办单位', name: '' },
    { type: '支持单位', name: '' }
];

// Exam config state (demo-level singleton shared across groups for prototype)
let examFormat = 'phased-unified';
let phasedCurrentIdx = 0;  // active phase in the left-list when examFormat === 'phased'
let phasedDragIdx = -1;    // dragged phase index when reordering the left-list
let phasedConfig = {
    phases: [
        {
            name: '第1期',
            theme: '考试模式',
            subtitle: '',
            startDate: '2026-06-09',
            endDate: '2026-06-09',
            dailyStart: '09:00',
            dailyEnd: '18:00',
            hiddenWhenClosed: true,
            duration: 60,
            attempts: 1,
            scoreRule: 'highest',
            paper: null,
            configured: false,
            expanded: true
        }
    ],
};
let examConfig = {
    paperMode: 'fixed',  // 'fixed' (指定单套试卷) | 'userChoice' (用户自选试卷)
    selectedPaper: null,
    userChoicePapers: [
        { displayName: '华服纹样主题卷', desc: '适合对华服纹样、图案寓意感兴趣的用户选择。', paperName: '2026 华服纹样知识考试 A 卷', qCount: 25, total: 100, composition: '单选 25 题', status: '启用' },
        { displayName: '可选试卷 5', desc: '', paperName: '2026 非遗文化 D 卷', qCount: 25, total: 100, composition: '单选 25 题', status: '启用' }
    ],
    userChoiceRules: {
        changeRule: 'beforeStart',    // 'beforeStart' | 'lockOnSelect' | 'everyTime'
        showDesc: true, showQCount: true, showTotal: true,
        multiAttemptRule: 'lockFirst',// 'lockFirst' | 'everyTime' | 'noReselect'
        allowReselectAfterSubmit: false,
        scoringMethod: 'raw',         // 'raw' | 'percent' | 'perPaper'
        rankingMethod: 'unified',     // 'unified' | 'perPaper' | 'none'
        tieBreak: 'submitTimeAsc',    // 'submitTimeAsc' | 'timeAsc' | 'startTimeAsc'
        showSelectedPaper: true
    },
    randomRules: [
        { source: '我的题库', bank: '图书馆知识题库', qType: '单选题', qCount: 30, perScore: 2, available: 120 },
        { source: '我的题库', bank: '图书馆知识题库', qType: '判断题', qCount: 10, perScore: 2, available: 60 }
    ],
    examStart: '2026-06-09',
    examEnd:   '2026-06-09',
    duration: 60,
    dailyTimeEnabled: true,
    dailyTimeStart: '09:00',
    dailyTimeEnd:   '18:00',
    attempts: 1,
    passScore: 60,
    scoreRule: 'highest',            // highest | last | average
    rankRule:  'scoreDesc',          // default
    showDetails: true,
    showRanking: true,
    allowSkip: true,
    showCard: true,
    allowEarlySubmit: true
};
let dailyScoreConfig = {
    maxDailyAttempts: 1,
    dailyScoreRule: 'highest',       // highest | last
    qualifiedScore: 60
};
let dailyTimeConfig = {
    startTime: '2026-06-09',
    endTime: '2026-07-09',
    dailyStart: '06:00',
    dailyEnd: '23:59',
    timeLimitEnabled: false,
    timeLimitSeconds: 30
};
// Daily streak points reward (for 连续天数答题奖励积分)
let dailyStreakReward = {
    enabled: false,
    // milestones: [{ days: number, points: number }]
    milestones: [
        { days: 3, points: 3 },
        { days: 7, points: 10 }
    ]
};
let dailyPlanCurrentIdx = 0;
let dailyPlanConfig = {
    days: [
        {
            date: '2026-06-09',
            theme: '第一天：阅读常识',
            rules: [
                { source: '我的题库', bank: '图书馆知识题库', type: '全部标准答案题', count: 10, score: 1 },
                { source: '我的题库', bank: '历史文化题库', type: '单选题', count: 5, score: 2 }
            ]
        }
    ]
};
let dailyFixedCurrentIdx = 0;
let dailyFixedConfig = {
    days: [
        {
            date: '2026-06-09',
            theme: '第一天：阅读常识',
            questions: [
                { id: 'dfq-001', sourceId: 'pool-001', content: '《四库全书》是哪个皇帝下令编纂的？', type: '单选题', bank: '图书馆知识题库', score: 10 },
                { id: 'dfq-002', sourceId: 'pool-002', content: '世界上现存最早的有确切日期的雕版印刷品是？', type: '单选题', bank: '图书馆知识题库', score: 10 },
                { id: 'dfq-003', sourceId: 'pool-003', content: '以下哪些属于非物质文化遗产？', type: '多选题', bank: '历史文化题库', score: 10 },
                { id: 'dfq-004', sourceId: 'pool-004', content: '《四库全书》是清代乾隆年间编纂的。', type: '判断题', bank: '历史文化题库', score: 10 },
                { id: 'dfq-005', sourceId: 'pool-005', content: '中国最早的公共图书馆建于哪个城市？', type: '单选题', bank: '图书馆知识题库', score: 10 },
                { id: 'dfq-006', sourceId: 'pool-006', content: 'ISBN是国际标准书号的简称。', type: '判断题', bank: '图书馆知识题库', score: 10 },
                { id: 'dfq-007', sourceId: 'pool-007', content: '图书馆的四大基本职能包括？', type: '多选题', bank: '图书馆知识题库', score: 10 },
                { id: 'dfq-008', sourceId: 'pool-008', content: '中国图书馆分类法简称____。', type: '填空题', bank: '图书馆知识题库', score: 10 },
                { id: 'dfq-010', sourceId: 'pool-010', content: '请按图书借阅流程排序。', type: '排序题', bank: '图书馆知识题库', score: 20 }
            ]
        }
    ]
};
let dailyRandomRules = [
    { bank: '图书馆知识题库', type: '全部标准答案题', count: 50, score: 2 }
];

const DAILY_FIXED_QUESTION_POOL = [
    { id: 'pool-001', content:'《四库全书》是哪个皇帝下令编纂的？', type:'单选题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-002', content:'世界上现存最早的有确切日期的雕版印刷品是？', type:'单选题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-003', content:'以下哪些属于非物质文化遗产？', type:'多选题', bank:'历史文化题库', status:'启用' },
    { id: 'pool-004', content:'《四库全书》是清代乾隆年间编纂的。', type:'判断题', bank:'历史文化题库', status:'启用' },
    { id: 'pool-005', content:'中国最早的公共图书馆建于哪个城市？', type:'单选题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-006', content:'ISBN是国际标准书号的简称。', type:'判断题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-007', content:'图书馆的四大基本职能包括？', type:'多选题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-008', content:'中国图书馆分类法简称____。', type:'填空题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-009', content:'请简述公共图书馆在全民阅读推广中的主要作用。', type:'简答题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-010', content:'请按图书借阅流程排序。', type:'排序题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-011', content:'已停用的旧版阅读规则题目', type:'单选题', bank:'图书馆知识题库', status:'停用' }
];

// Level data (for 答题闯关 mode)
let levelConfig = {
    startTime: '2026-06-09',
    endTime: '2026-07-09',
    dailyStart: '09:00',
    dailyEnd: '18:00'
};
let levels = [
    { name: '第一关 阅读常识', questions: 50, totalScore: 100, passScore: 60, configured: true, rules: [{ bank: '图书馆知识题库', type: '全部标准答案题', count: 50, score: 2 }], fixedQuestions: [] },
    { name: '第二关 历史文化', questions: 50, totalScore: 150, passScore: 90, configured: true, rules: [{ bank: '历史文化题库', type: '全部标准答案题', count: 50, score: 3 }], fixedQuestions: [] },
    { name: '第三关 非遗知识', questions: 0, totalScore: 0, passScore: 0, configured: false, rules: [], fixedQuestions: [] }
];

const QUIZ_MODES = [
    {
        key: 'exam', icon: '📝', title: '考试模式',
        decision: '一次性完成一场考试，提交后自动出成绩。',
        bestFor: '线上考试、知识竞赛、测评考试、统一考核',
        defaultRules: ['提交试卷后自动展示成绩', '活动结束后展示答题解析', '需人工阅卷的活动，全部答卷完成阅卷后展示成绩', '支持固定题目或随机抽题', '支持多期主题考试模式'],
        configure: ['考试形式与试卷', '答题时间'],
        color: 'var(--primary)', bgColor: 'var(--primary-light)',
        scene: '考试模式、知识竞赛、线上测评'
    },
    {
        key: 'daily', icon: '🎯', title: '每日答题',
        decision: '每天开放一次答题，适合持续参与和累计统计。',
        bestFor: '每日一答、每日学习、连续答题、21 天知识问答',
        defaultRules: ['完成一次“每日答题”后自动展示成绩', '每题后展示解析：答完每题后展示正确答案和解析', '展示累计成绩：展示活动期间累计成绩', '支持从题库随机抽题', '参与次数大于 1 时可设置每日成绩取值'],
        configure: ['答题开放时间', '题目来源', '参与次数与成绩', '默认答题规则'],
        color: 'var(--success)', bgColor: 'var(--success-light)',
        scene: '每日一答、每日练习、知识学习'
    },
    {
        key: 'level', icon: '⚔️', title: '答题闯关',
        decision: '按关卡逐步解锁，达到分数后进入下一关。',
        bestFor: '关卡挑战、分阶段学习、知识闯关、互动答题',
        defaultRules: ['默认按达标分数判断通关', '关卡按顺序开放，无需配置开放日期', '每题后展示答案解析'],
        configure: ['关卡列表', '每关题目来源', '达标分数', '每关最多挑战次数'],
        color: 'var(--warning-600)', bgColor: 'var(--warning-light)',
        scene: '关卡挑战、分阶段学习、打卡式答题'
    }
];

// ===== PAGE REGISTRATION =====
registerPage('quiz-activity-create', () => {
    quizStep = Number(currentPageParams?.step) || 1;
    fsOpen = false;
    return renderQuizActivityCreate();
});
registerPage('quiz-activity-create_init', () => {});

// ===============================
// MAIN QUIZ ACTIVITY CREATE FLOW
// ===============================
function renderQuizActivityCreate() {
    return `
    <div class="quiz-create-page">
        ${renderQuizCreateTopbar()}
        <div class="quiz-create-workspace">
            <div class="quiz-mobile-preview" aria-label="移动端页面预览示意"></div>
            <main class="quiz-create-main">
                ${renderQuizCreateStepper()}
                ${renderQuizStepContent(quizStep)}
            </main>
        </div>
        ${renderQuizCreateActions()}
        <div id="quizFsOverlay" class="quiz-fullscreen-overlay hidden" onclick="handleFsBackdropClick(event)">
            ${fsOpen ? renderFullscreenModal() : ''}
        </div>
        <div id="quizSecondaryModals">${renderSecondaryModals()}</div>
    </div>`;
}

function renderQuizCreateTopbar() {
    const isEdit = currentPageParams?.mode === 'edit';
    return `
    <header class="quiz-create-topbar">
        <button class="quiz-top-back" onclick="goBackFromPage('quiz-activity-create')" title="返回">≪</button>
        <div class="quiz-top-meta">
            <div class="quiz-top-title-row">
                <strong>2026“文脉之光”中国国家版本馆文创设计大赛</strong>
                <span class="quiz-top-badge">征集类</span>
                <span class="quiz-top-state">未发布</span>
                <span class="quiz-top-state">${isEdit ? '编辑活动' : '创建活动'}</span>
            </div>
            <div class="quiz-top-save"><span>✓</span> 最新保存 10:10</div>
        </div>
    </header>`;
}

function renderQuizCreateStepper() {
    const steps = [
        [1, '基本信息'],
        [2, '活动介绍'],
        [3, '报名/答题'],
        [4, '外观装修'],
        [5, '其他设置（可选）']
    ];
    return `
    <nav class="quiz-step-nav" aria-label="创建活动步骤">
        ${steps.map(([num, label]) => `
            <button class="quiz-step-card ${quizStep === num ? 'active' : ''} ${quizStep > num ? 'done' : ''}" onclick="quizGoStep(${num})">
                <span class="quiz-step-num">${num}</span>
                <span class="quiz-step-label">${label}</span>
                ${num < steps.length ? '<span class="quiz-step-arrow">»</span>' : ''}
            </button>
        `).join('')}
    </nav>`;
}

function renderQuizStepContent(step) {
    switch (step) {
        case 1: return renderQuizStepBasicInfo();
        case 2: return renderQuizStepIntro();
        case 3: return renderQuizStepSignupAnswer();
        case 4: return renderQuizStepAppearance();
        case 5: return renderQuizStepOtherSettings();
        default: return renderQuizStepBasicInfo();
    }
}

function renderQuizStepBasicInfo() {
    const needSignup = !!quizNeedSignup;
    const signupStartText = quizSignupStart ? quizSignupStart : '▦ 开始日期';
    const signupEndText = quizSignupEnd ? quizSignupEnd : '结束日期';
    return `
    <section class="quiz-config-card">
        <div class="qc-form-row">
            <label><span class="req">*</span>活动名称</label>
            <input class="qc-input" value="${escapeAttr(quizActivityName)}" onchange="setQuizActivityName(this.value)">
        </div>
        <div class="qc-form-row">
            <label><span class="req">*</span>活动分类</label>
            <div class="qc-field-box">
                <span class="qc-tag">赛事 <button>×</button></span>
                <span class="qc-tag">读书 <button>×</button></span>
            </div>
        </div>
        <div class="qc-form-row qc-mode-row">
            <label><span class="req">*</span>答题模式</label>
            <div class="basic-mode-grid">
                ${QUIZ_MODES.map(m => `
                    <button type="button" class="basic-mode-card ${quizActivityMode === m.key ? 'selected' : ''}" onclick="setQuizActivityMode('${m.key}')">
                        <span class="basic-mode-check">${quizActivityMode === m.key ? '✓' : ''}</span>
                        <span class="basic-mode-icon" style="background:${m.bgColor};color:${m.color}">${m.icon}</span>
                        <span class="basic-mode-body">
                            <strong>${m.title}</strong>
                            <em>${m.scene}</em>
                        </span>
                    </button>
                `).join('')}
            </div>
        </div>
        <div class="qc-form-row">
            <label>举办方式</label>
            <div class="qc-checks">
                <label><input type="checkbox" checked> 线上活动</label>
                <label><input type="checkbox" checked> 线下活动</label>
            </div>
        </div>
        <div class="qc-form-row">
            <label>活动范围</label>
            <div class="qc-radios">
                <label><input type="radio" name="quizScope" checked> 全国性活动</label>
                <label><input type="radio" name="quizScope"> 省级活动</label>
                <label><input type="radio" name="quizScope"> 市级活动</label>
                <label><input type="radio" name="quizScope"> 本机构活动</label>
            </div>
        </div>
        <div class="qc-form-row">
            <label><span class="req">*</span>单位角色</label>
            <select class="qc-input"><option>我是主办单位</option><option>我是承办单位</option><option>我是协办单位</option></select>
        </div>
    </section>
    <section class="quiz-config-card compact">
        <div class="qc-form-row">
            <label>是否需要报名</label>
            <div class="qc-radios">
                <label><input type="radio" name="quizNeedSignup" ${needSignup ? 'checked' : ''} onchange="setQuizNeedSignup(true)"> 是</label>
                <label><input type="radio" name="quizNeedSignup" ${!needSignup ? 'checked' : ''} onchange="setQuizNeedSignup(false)"> 否</label>
            </div>
        </div>
        ${needSignup ? `
        <div class="qc-form-row">
            <label><span class="req">*</span>报名时间</label>
            <div class="qc-date-range">
                <span onclick="editQuizSignupTime()">${signupStartText}</span>
                <strong>至</strong>
                <span onclick="editQuizSignupTime()">${signupEndText}</span>
            </div>
        </div>` : ''}
    </section>
    <section class="quiz-config-card org-card">
        ${renderQuizOrgUnits()}
    </section>`;
}

function setQuizNeedSignup(next) {
    quizNeedSignup = !!next;
    if (!quizNeedSignup) {
        quizSignupStart = '';
        quizSignupEnd = '';
        // When signup is disabled, registration form config should not be required nor shown.
        // Keep a consistent state by clearing form config flags.
        (groups || []).forEach(g => {
            g.formConfigured = false;
            g.formFieldCount = 0;
            g.formRealName = false;
            g.updatedAt = nowStamp();
        });
    }
    quizGoStep(1);
}

function setQuizActivityMode(mode) {
    if (!QUIZ_MODES.some(m => m.key === mode)) return;
    const changed = quizActivityMode !== mode;
    quizActivityMode = mode;
    groups.forEach(g => {
        if (changed && g.quizConfigured && g.quizMode !== mode) {
            g.quizConfigured = false;
            g.quizQCount = 0;
            g.quizTotal = 0;
            g.quizAttemptsText = '';
        }
        g.quizMode = mode;
    });
    quizGoStep(1);
}

function editQuizSignupTime() {
    if (!quizNeedSignup) return;
    const start = window.prompt('请输入报名开始时间（示例：2026-06-01 09:00）', quizSignupStart || '2026-06-01 09:00');
    if (start === null) return;
    const end = window.prompt('请输入报名结束时间（示例：2026-06-10 18:00）', quizSignupEnd || '2026-06-10 18:00');
    if (end === null) return;
    quizSignupStart = (start || '').trim();
    quizSignupEnd = (end || '').trim();
    quizGoStep(1);
}

function renderQuizOrgUnits() {
    return `
    <div class="qc-org-label">组织机构</div>
    <div class="qc-org-fields">
        ${quizOrgUnits.map((unit, index) => `
            <div class="qc-org-unit">
                <div class="qc-org-title">
                    <span>${unit.type}</span>
                    <button type="button" title="编辑单位类型" onclick="renameQuizOrgUnit(${index})">✎</button>
                </div>
                <div class="qc-org-line">
                    <input value="${unit.name}" placeholder="请输入一个或多个单位名称" onchange="setQuizOrgUnitName(${index}, this.value)">
                    <button type="button" title="删除单位类型" onclick="deleteQuizOrgUnit(${index})">⌫</button>
                    <button type="button" title="拖拽排序" class="qc-org-drag">⠿</button>
                </div>
            </div>
        `).join('')}
        <button type="button" class="qc-org-add" onclick="addQuizOrgUnit()">+ 添加单位类型</button>
    </div>`;
}

function renderQuizStepIntro() {
    return `
    <section class="quiz-config-card intro-card">
        <div class="intro-mode-switch">⇅ 切换至自由编辑模式</div>
        ${renderIntroEditorBlock('活动背景', '请输入活动背景')}
        ${renderIntroEditorBlock('活动对象', '请输入活动对象')}
        ${renderIntroEditorBlock('规则说明', '请输入规则说明')}
    </section>`;
}

function renderIntroEditorBlock(title, placeholder) {
    return `
    <div class="intro-editor-block">
        <div class="intro-editor-title">${title} <span>✎</span></div>
        <div class="intro-editor-row">
            <div class="intro-editor">
                <div class="intro-toolbar">
                    <span>H</span><span>B</span><span><i>I</i></span><span>U</span><span>S</span><span>✎</span><span>⌁</span><span>🔗</span><span>☷</span><span>≡</span><span>“</span><span>☺</span><span>▧</span><span>▦</span><span>▶</span><span>&gt;_</span><span>↶</span><span>↷</span>
                </div>
                <div class="intro-editor-body">${placeholder}</div>
            </div>
            <div class="intro-editor-actions"><button title="删除">⌫</button><button title="排序">⠿</button></div>
        </div>
    </div>`;
}

function setQuizOrgUnitName(index, value) {
    if (!quizOrgUnits[index]) return;
    quizOrgUnits[index].name = value;
}

function addQuizOrgUnit() {
    const nextNo = quizOrgUnits.length + 1;
    quizOrgUnits.push({ type: `自定义单位${nextNo}`, name: '' });
    quizGoStep(1);
}

function deleteQuizOrgUnit(index) {
    if (quizOrgUnits.length <= 1) return;
    quizOrgUnits.splice(index, 1);
    quizGoStep(1);
}

function renameQuizOrgUnit(index) {
    const current = quizOrgUnits[index];
    if (!current) return;
    const nextName = window.prompt('请输入单位类型名称', current.type);
    if (!nextName || !nextName.trim()) return;
    current.type = nextName.trim();
    quizGoStep(1);
}

function getCurrentQuizModeForAppearance() {
    const configuredModes = (groups || []).map(g => g.quizMode).filter(Boolean);
    if (configuredModes.length) return configuredModes[0];
    return quizActivityMode || fsQuizMode || 'exam';
}

function getLeaderboardRuleConfig(mode = getCurrentQuizModeForAppearance()) {
    const configs = {
        exam: {
            modeTitle: '考试模式',
            title: '得分排行榜',
            modalTitle: '设置排行榜规则 - 考试模式',
            summary: '当前规则：得分排行榜，展示前',
            columns: ['姓名', '总得分'],
            metric: '总得分',
            sortText: '总得分（高→低）＞ 交卷时间（早→晚）',
            note: '适用于考试模式，按用户最终有效成绩生成排行榜。',
            detail: ''
        },
        daily: {
            modeTitle: '每日答题',
            title: '达标天数排行榜',
            modalTitle: '设置排行榜规则 - 每日答题',
            summary: '当前规则：达标天数排行榜，展示前',
            columns: ['姓名', '达标天数', '总得分'],
            metric: '达标天数',
            sortText: '达标天数（高→低）＞ 总得分（高→低）＞ 最早达标时间（早→晚）',
            note: '适用于每日答题，按用户活动期间达到达标分数的天数生成排行榜。',
            detail: '每天是否达标由每日答题配置中的达标分数判断；总得分用于同达标天数时的排序。'
        },
        level: {
            modeTitle: '答题闯关',
            title: '闯关数量排行榜',
            modalTitle: '设置排行榜规则 - 答题闯关',
            summary: '当前规则：闯关数量排行榜，展示前',
            columns: ['姓名', '通关关卡数', '总得分', '用时'],
            metric: '通关关卡数',
            sortText: '通关关卡数（高→低）＞ 总得分（高→低）＞ 用时（短→长）',
            note: '适用于答题闯关，按用户已通关关卡数量生成排行榜。',
            detail: '用时为用户通关已完成关卡的累计有效用时；仅用于通关关卡数与总得分相同时的排序。'
        }
    };
    return configs[mode] || configs.exam;
}

function normalizeLeaderboardMode(mode) {
    return leaderboardRuleSettings[mode] ? mode : 'exam';
}

function getLeaderboardRuleSetting(mode = getCurrentQuizModeForAppearance()) {
    const key = normalizeLeaderboardMode(mode);
    if (!leaderboardRuleSettings[key]) {
        leaderboardRuleSettings[key] = { displayLimit: 100, unitEnabled: true, unitDisplayLimit: 100 };
    }
    return leaderboardRuleSettings[key];
}

function setLeaderboardRuleSetting(mode, patch = {}) {
    const key = normalizeLeaderboardMode(mode);
    leaderboardRuleSettings[key] = {
        ...getLeaderboardRuleSetting(key),
        ...patch
    };
}

function normalizeLeaderboardLimit(value) {
    const next = Number(value) || 100;
    return LEADERBOARD_LIMIT_OPTIONS.includes(next) ? next : 100;
}

function renderQuizStepSignupAnswer() {
    const needSignup = !!quizNeedSignup;
    return `
    <section class="quiz-config-card">
        <div style="display:flex;align-items:center;gap:var(--spacing-sm);margin-bottom:var(--spacing-sm)">
            <h3 style="font-size:var(--font-size-md);font-weight:var(--font-weight-bold);color:var(--text-primary)">${needSignup ? '报名组别' : '答题组别'}</h3>
        </div>
        <div class="group-hint-box">
            ${needSignup
                ? '<strong>说明：</strong>无需分组报名时，默认仅配置“组别一”的报名表和答题配置；如需按人群分组，可添加多个组别，并分别配置各组的报名表和答题规则。'
                : '<strong>说明：</strong>当前选择「无需报名」，用户可直接进入答题；本步骤仅需配置各组别的答题规则。'}
        </div>
        <div id="groupList">${groups.map((g, i) => renderGroupCard(g, i)).join('')}</div>
        <div style="margin-top:var(--spacing-md)"><button class="btn btn-outline-gold btn-add-group" onclick="addGroup()">+ 添加组别</button></div>
    </section>
    <section class="quiz-config-card">
        <h3 style="font-size:var(--font-size-md);font-weight:var(--font-weight-bold);color:var(--text-primary);margin-bottom:var(--spacing-md)">${needSignup ? '报名须知' : '参与须知'}</h3>
        <div class="qc-editor">
            <div class="qc-editor-toolbar"><button>B</button><button>I</button><button>U</button><button>🔗</button><button>🖼</button></div>
            <div contenteditable="true">请输入报名须知、参与说明和注意事项...</div>
        </div>
    </section>`;
}

function renderQuizStepAppearance() {
    const leaderboardMode = getCurrentQuizModeForAppearance();
    const leaderboard = getLeaderboardRuleConfig(leaderboardMode);
    const leaderboardSetting = getLeaderboardRuleSetting(leaderboardMode);
    const navs = [
        { name: '活动首页', required: true,  note: '' },
        { name: '排行榜',   required: false, leaderboard: true },
        { name: '活动动态', required: false, note: '活动发布后，可前往「活动列表-进入管理-活动动态」模块管理动态。' },
        { name: '资源推荐', required: false, note: '活动发布后，可前往「活动列表-进入管理-资源推荐」模块管理资源。' }
    ];
    return `
    <section class="quiz-config-card appearance-card">
        <div class="appearance-row">
            <label>主题色</label>
            <div class="color-swatches">${['#00527a', '#f33422', '#218d78', '#7b65d6', 'linear-gradient(135deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f)'].map((c, i) => `<button class="color-swatch ${i === 0 ? 'active' : ''}" style="background:${c}"></button>`).join('')}</div>
        </div>
        <div class="appearance-row">
            <label>背景色</label>
            <div class="color-swatches">${['#6fd5e5', '#fff3ef', '#d9f7e5', '#eceeff', 'linear-gradient(135deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f)'].map((c, i) => `<button class="color-swatch bg ${i === 0 ? 'active' : ''}" style="background:${c}"></button>`).join('')}</div>
        </div>
        <div class="cover-config">
            <div><strong>封面图</strong><span>建议宽高比为 16 : 9</span></div>
            <div class="cover-preview">文脉之光</div>
            <div class="cover-actions"><button>AI帮我设计主题</button><button>自行上传新主题</button></div>
        </div>
        <div class="nav-config">
            <div class="nav-title"><strong>导航显隐</strong><span>管理活动详情页导航菜单的名称与展示</span></div>
            <div class="nav-list">
                ${navs.map((nav, i) => {
                    const canDrag = !nav.required;
                    const canToggle = !nav.required;
                    const checked = nav.required ? true : true;
                    const noteHtml = nav.leaderboard
                        ? renderLeaderboardNavNote(leaderboard, leaderboardSetting)
                        : nav.note;
                    return `
                    <div class="nav-item">
                        <span class="drag-dot">${canDrag ? '⠿' : ''}</span>
                        <label class="switch mini nav-switch">
                            <input type="checkbox" ${checked ? 'checked' : ''} ${canToggle ? '' : 'disabled'}>
                            <span class="sw-slider"></span>
                        </label>
                        <div class="nav-body">
                            <div class="nav-head">
                                <div class="nav-head-title">
                                    <span class="nav-name">${nav.name}</span>
                                    ${nav.required ? '<em class="nav-required">必选</em>' : ''}
                                </div>
                            </div>
                            <div class="nav-custom-name">
                                <span class="nav-custom-label">自定义名称：</span>
                                <span class="nav-custom-value">${nav.name}</span>
                                <button class="nav-edit-btn" type="button" title="编辑名称">✎</button>
                            </div>
                            ${noteHtml ? `<div class="nav-note">${noteHtml}</div>` : ''}
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>
        <div class="logo-config">
            <strong>LOGO配置</strong><span>用于活动详情页展示。支持上传 PNG 格式图片，建议图片高度 40px，最多可添加 5 个</span>
            <div class="logo-list">
                <div class="logo-row">
                    <span class="drag-dot logo-drag">⠿</span>
                    <div class="logo-upload logo-uploaded">
                        <div class="logo-box">阅途文遇<small>www.yuetu100.com</small></div>
                    </div>
                    <label class="logo-link-field">
                        <span>↗</span>
                        <input value="https://www.yuetu100.com" aria-label="LOGO跳转链接">
                    </label>
                    <div class="logo-align-group" aria-label="LOGO位置">
                        <button class="active" type="button" title="居左"><span>☰</span></button>
                        <button type="button" title="居右"><span>☰</span></button>
                    </div>
                    <button class="logo-delete-btn" type="button" title="删除">⌫</button>
                </div>
                <div class="logo-row">
                    <span class="drag-dot logo-drag">⠿</span>
                    <button class="logo-upload logo-upload-empty" type="button">
                        <span>＋</span>
                        <strong>点击上传</strong>
                    </button>
                    <label class="logo-link-field empty">
                        <span>↗</span>
                        <input placeholder="请输入点击 LOGO 后跳转的链接，如官网地址" aria-label="LOGO跳转链接">
                    </label>
                    <div class="logo-align-group" aria-label="LOGO位置">
                        <button class="active" type="button" title="居左"><span>☰</span></button>
                        <button type="button" title="居右"><span>☰</span></button>
                    </div>
                    <button class="logo-delete-btn" type="button" title="删除">⌫</button>
                </div>
            </div>
            <button class="add-logo">+添加 LOGO</button>
        </div>
    </section>`;
}

function renderLeaderboardNavNote(rule, setting) {
    const unitRuleText = setting.unitEnabled
        ? `；单位参与人数排行榜，展示前 ${setting.unitDisplayLimit} 名`
        : '';
    return `
        <span>${rule.summary} </span>
        <span class="nav-hl">${setting.displayLimit}</span>
        <span> 名</span>
        <span class="leaderboard-columns">（${rule.columns.join('、')}）</span>
        <span>${unitRuleText}</span>
        <button class="nav-rule-btn" type="button" onclick="openLeaderboardRuleModal(event)">修改规则 &gt;</button>
    `;
}

function renderQuizStepOtherSettings() {
    const hasDailyModeConfigured = groups.some(g => g.quizMode === 'daily');
    const dailyStreakEnabled = !!dailyStreakReward.enabled;
    return `
    ${hasDailyModeConfigured ? `
    <section class="quiz-config-card other-card reward-card">
        <h3>积分奖励配置</h3>
        <p>仅当创建的答题模式包含「每日答题」时生效</p>
        <div class="reward-box" style="font-weight:600">
            <div style="display:flex;align-items:center;gap:10px;justify-content:space-between">
                <div>
                    <div style="font-size:16px;color:#1f1f1f;font-weight:800">连续天数答题奖励</div>
                    <div style="margin-top:4px;color:#8c8c8c;font-size:13px;font-weight:600">按连续答题天数达到里程碑发放积分（可配置多个档位）。</div>
                </div>
                <label class="switch">
                    <input type="checkbox" ${dailyStreakEnabled ? 'checked' : ''} onchange="setDailyStreakEnabled(this.checked)">
                    <span class="sw-slider"></span>
                </label>
            </div>
            ${dailyStreakEnabled ? `
            <div style="margin-top:14px">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
                    <div style="color:#8c8c8c;font-size:13px;font-weight:700">奖励档位</div>
                    <button class="btn btn-ghost btn-sm" type="button" onclick="addDailyStreakMilestone()">+ 添加档位</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:10px">
                    ${(dailyStreakReward.milestones || []).map((m, idx) => `
                        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                            <span style="color:#8c8c8c;font-size:13px">连续</span>
                            <input type="number" min="1" value="${Number(m.days) || 1}" style="width:80px;height:36px;border:1px solid #e1e1e1;border-radius:6px;text-align:center" onchange="setDailyStreakMilestoneField(${idx},'days',this.value)">
                            <span style="color:#8c8c8c;font-size:13px">天，奖励</span>
                            <input type="number" min="0" value="${Number(m.points) || 0}" style="width:80px;height:36px;border:1px solid #e1e1e1;border-radius:6px;text-align:center" onchange="setDailyStreakMilestoneField(${idx},'points',this.value)">
                            <span style="color:#8c8c8c;font-size:13px">积分</span>
                            <button class="btn btn-ghost btn-sm" type="button" onclick="removeDailyStreakMilestone(${idx})">删除</button>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top:10px;color:#8c8c8c;font-size:12px;line-height:1.6">
                    规则说明：当用户连续答题天数达到配置档位时发放对应积分；档位需按天数递增且不能重复。
                </div>
                <div style="margin-top:6px;color:#8c8c8c;font-size:12px;line-height:1.6">
                    建议：常见配置如 3 天/7 天/14 天等；如需“每日固定奖励”，请在题目得分或其他积分规则中处理（本区仅做连签里程碑奖励）。
                </div>
            </div>
            ` : ''}
        </div>
    </section>
    ` : ''}
    <section class="quiz-config-card other-card">
        <h3>功能捷径</h3>
        <p>配置活动详情页底部「功能入口」弹窗中展示的功能捷径</p>
        <div class="shortcut-label">活动功能</div>
        ${[
            ['资料下载', '附件下载', '资料数量：3'],
            ['问题答疑', '查看文本', '']
        ].map(item => `
            <div class="shortcut-row">
                <span>⠿</span><label class="switch mini"><input type="checkbox"><span class="sw-slider"></span></label>
                <div><strong>${item[0]}</strong><em>${item[1]}</em></div>
                <p>${item[2]}</p>
                <button>配置</button><button class="bolt">↯</button>
            </div>
        `).join('')}
        <button class="add-shortcut">+ 添加更多按钮</button>
        <div class="service-label">活动服务</div>
        <div class="official-group">
            <h4>官方活动群 <span>//描述：配置则生效，未配置则不生效</span></h4>
            <p>请上传群二维码图片，该二维码将在用户报名成功后弹出，引导用户扫码入群</p>
            <div class="official-body">
                <div class="phone-modal-demo">
                    <div class="check-circle">✓</div>
                    <div class="qr-card"><strong>扫码加入官方活动群</strong><div class="qr-demo">▦</div><small>保存二维码图片，微信扫一扫添加</small><div><button>取消</button><button>保存图片</button></div></div>
                </div>
                <div class="group-form">
                    <label>群二维码</label><div class="qr-upload">+</div><span>建议尺寸 1:1，图片大小需限制在 10M 以内</span>
                    <label>弹窗标题</label><input value="扫码加入官方活动群"><em>//默认自动填充当前文案，可修改</em>
                    <label>弹窗文案</label><input value="保存二维码图片，微信扫一扫添加"><em>//默认自动填充当前文案，可修改</em>
                </div>
            </div>
        </div>
    </section>`;
}

function renderQuizCreateActions() {
    return `
    <div class="quiz-create-actionbar">
        <div>${quizStep > 1 ? `<button class="btn btn-ghost" onclick="quizGoStep(${quizStep - 1})">← 上一步</button>` : ''}</div>
        <div class="btn-group">
            <button class="btn btn-gold-solid" onclick="saveQuizCreateDraft()">保存</button>
            <button class="btn btn-gold-outline" onclick="previewQuizCreateDraft()">预览</button>
            <button class="btn btn-gold-outline" onclick="publishQuizCreateDraft()">${quizStep < 5 ? '保存并发布' : '发布活动'}</button>
        </div>
    </div>`;
}

// ===== GROUP CARD (PRD rich layout) =====
function renderGroupCard(g, i) {
    const needSignup = !!quizNeedSignup;
    const configStatus = getGroupStatus(g);           // 'done' | 'partial' | 'empty'
    const statusText = configStatus === 'done' ? '已配置' : configStatus === 'partial' ? '部分配置' : '未配置';
    const statusIcon = configStatus === 'done' ? '✓' : configStatus === 'partial' ? '!' : '•';
    const selectedMode = g.quizMode || quizActivityMode;
    const modeTitle = (QUIZ_MODES.find(m => m.key === selectedMode) || {}).title || '';
    const doneCount = (needSignup ? (g.formConfigured ? 1 : 0) : 0) + (g.quizConfigured ? 1 : 0);
    const formSummary = g.formConfigured
        ? `${g.formFieldCount} 个字段${g.formRealName ? ' · 实名认证' : ''}`
        : '设置报名字段、实名信息与提交规则';
    const quizSummary = g.quizConfigured
        ? `${modeTitle} · ${g.quizQCount} 题 · ${g.quizTotal} 分 · ${g.quizAttemptsText || '-'}`
        : `${modeTitle} · 配置试卷、时间与作答规则`;
    const menuOpen = groupMenuOpenIdx === i;
    const nameInputWidth = Math.min(220, Math.max(80, Array.from(g.name || '').length * 18 + 28));
    return `
    <div class="group-card rich gc-${configStatus}">
        <div class="gc-stripe"></div>
        <div class="gc-body">
            <div class="gc-head-row">
                <span class="gc-drag" title="拖拽排序">⠿</span>
                <input class="gc-name-edit" style="width:${nameInputWidth}px" value="${g.name}" onchange="updateGroupName(${i}, this.value)" onkeydown="if(event.key==='Enter') this.blur()" />
                <span class="gc-status-pill ${configStatus}"><span class="gc-status-ico">${statusIcon}</span>${statusText}</span>
                <span class="gc-name-pencil" onclick="focusGroupName(${i})" title="编辑组别名称">✎</span>
                <button class="gc-menu-btn" onclick="toggleGroupMenu(${i}, event)" title="更多操作">⋯</button>
                ${menuOpen ? `
                <div class="gc-menu" onclick="event.stopPropagation()">
                    <div class="gc-menu-item" onclick="previewGroup(${i});closeGroupMenus()">👁 预览</div>
                    <div class="gc-menu-item" onclick="copyGroup(${i});closeGroupMenus()">⧉ 复制组别</div>
                    <div class="gc-menu-item ${g.quizConfigured?'':'disabled'}" onclick="${g.quizConfigured?`openCopyQuizConfig(${i});closeGroupMenus()`:''}">⮌ 复制答题配置到其他组别</div>
                    <div class="gc-menu-divider"></div>
                    <div class="gc-menu-item danger" onclick="openDeleteGroup(${i});closeGroupMenus()">🗑 删除组别</div>
                </div>` : ''}
            </div>
            <div class="gc-progress-line">
                <span>配置进度</span>
                <div class="gc-mini-progress"><div style="width:${Math.min(100, (doneCount / (needSignup ? 2 : 1)) * 100)}%"></div></div>
                <strong>${doneCount}/${needSignup ? 2 : 1}</strong>
            </div>
            <div class="gc-config-grid ${needSignup ? '' : 'gc-config-grid-single'}">
                ${needSignup ? `
                <div class="gc-config-tile ${g.formConfigured ? 'done' : 'todo'}" onclick="openFormConfig(${i})">
                    <div class="gc-tile-top">
                        <div class="gc-tile-icon">📄</div>
                        <span class="gc-tile-state">${g.formConfigured ? '已完成' : '待配置'}</span>
                    </div>
                    <div class="gc-tile-title">报名表</div>
                    <div class="gc-tile-desc">${formSummary}</div>
                    <button class="btn ${g.formConfigured ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="event.stopPropagation();openFormConfig(${i})">${g.formConfigured ? '编辑报名表' : '配置报名表'}</button>
                </div>
                ` : ''}
                <div class="gc-config-tile ${g.quizConfigured ? 'done' : 'todo'}" onclick="openQuizConfig(${i})">
                    <div class="gc-tile-top">
                        <div class="gc-tile-icon">⚙</div>
                        <span class="gc-tile-state">${g.quizConfigured ? '已完成' : '待配置'}</span>
                    </div>
                    <div class="gc-tile-title">答题配置</div>
                    <div class="gc-tile-desc">${quizSummary}</div>
                    <button class="btn ${g.quizConfigured ? 'btn-outline' : 'btn-dark'} btn-sm" onclick="event.stopPropagation();openQuizConfig(${i})">${g.quizConfigured ? '编辑答题' : '配置答题'}</button>
                </div>
            </div>
            <div class="gc-card-foot">
                <span>更新时间：${g.updatedAt || '-'}</span>
                <span>${configStatus === 'done'
                    ? '该组别已可发布'
                    : (needSignup ? '完成报名表和答题配置后即可进入下一步' : '完成答题配置后即可进入下一步')}</span>
            </div>
        </div>
    </div>`;
}

function getGroupStatus(g) {
    const needSignup = !!quizNeedSignup;
    if (!needSignup) return g.quizConfigured ? 'done' : 'empty';
    if (g.formConfigured && g.quizConfigured) return 'done';
    if (g.formConfigured || g.quizConfigured) return 'partial';
    return 'empty';
}

function focusGroupName(i) {
    const el = document.querySelectorAll('.gc-name-edit')[i];
    if (el) { el.focus(); el.select && el.select(); }
}

function toggleGroupMenu(i, ev) {
    if (ev) ev.stopPropagation();
    groupMenuOpenIdx = (groupMenuOpenIdx === i) ? -1 : i;
    rerenderMain();
}
function closeGroupMenus() {
    if (groupMenuOpenIdx !== -1) { groupMenuOpenIdx = -1; rerenderMain(); }
}

// ===== GROUP MANAGEMENT =====
function addGroup() {
    const n = groups.length + 1;
    groups.push({
        name: `未命名组别${n}`,
        formConfigured: false, formFieldCount: 0, formRealName: false,
        quizConfigured: false, quizMode: quizActivityMode,
        quizQCount: 0, quizTotal: 0, quizAttemptsText: '',
        updatedAt: nowStamp()
    });
    rerenderMain();
}

function copyGroup(idx) {
    const src = groups[idx];
    groups.push({ ...src, name: src.name + '（副本）', updatedAt: nowStamp() });
    rerenderMain();
}

function updateGroupName(idx, val) {
    groups[idx].name = (val || '').trim() || '未命名组别';
    groups[idx].updatedAt = nowStamp();
}

function previewGroup(idx) {
    alert('预览组别「' + groups[idx].name + '」的用户端报名/答题页面（Demo）');
}

function openFormConfig(idx) {
    // placeholder — richer registration editor is out of scope per current PRD slice
    groups[idx].formConfigured = true;
    if (!groups[idx].formFieldCount) groups[idx].formFieldCount = 6;
    groups[idx].updatedAt = nowStamp();
    rerenderMain();
}

// ===== DELETE GROUP MODAL =====
function openDeleteGroup(idx) {
    if (groups.length <= 1) { alert('至少保留 1 个组别'); return; }
    deleteGroupIdx = idx;
    refreshSecondaryModals();
}

function closeDeleteGroup() {
    deleteGroupIdx = -1;
    refreshSecondaryModals();
}

function confirmDeleteGroup() {
    if (deleteGroupIdx < 0) return;
    groups.splice(deleteGroupIdx, 1);
    deleteGroupIdx = -1;
    rerenderMain();
}

// ===== COPY QUIZ CONFIG MODAL =====
function openCopyQuizConfig(idx) {
    if (!groups[idx].quizConfigured) return;
    copyCfgSrcIdx = idx;
    copyCfgTargets = [];
    refreshSecondaryModals();
}

function closeCopyQuizConfig() {
    copyCfgSrcIdx = -1;
    copyCfgTargets = [];
    refreshSecondaryModals();
}

function toggleCopyCfgTarget(idx) {
    const i = copyCfgTargets.indexOf(idx);
    if (i >= 0) copyCfgTargets.splice(i, 1); else copyCfgTargets.push(idx);
    refreshSecondaryModals();
}

function confirmCopyQuizConfig() {
    if (copyCfgSrcIdx < 0 || !copyCfgTargets.length) return;
    const src = groups[copyCfgSrcIdx];
    copyCfgTargets.forEach(i => {
        groups[i] = {
            ...groups[i],
            quizConfigured: true,
            quizMode: src.quizMode,
            quizQCount: src.quizQCount,
            quizTotal: src.quizTotal,
            quizAttemptsText: src.quizAttemptsText,
            updatedAt: nowStamp()
        };
    });
    copyCfgSrcIdx = -1;
    copyCfgTargets = [];
    rerenderMain();
}

// ===== SWITCH-MODE CONFIRM MODAL =====
function openSwitchModeConfirm(targetMode) {
    pendingSwitchMode = targetMode;
    refreshSecondaryModals();
}

function closeSwitchModeConfirm() {
    pendingSwitchMode = null;
    refreshSecondaryModals();
}

function setQuizActivityName(value) {
    quizActivityName = value || '';
}

function escapeAttr(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function confirmSwitchMode() {
    if (!pendingSwitchMode) return;
    const g = groups[fsGroupIdx];
    g.quizMode = pendingSwitchMode;
    g.quizConfigured = false;
    g.quizQCount = 0;
    g.quizTotal = 0;
    g.quizAttemptsText = '';
    fsQuizMode = pendingSwitchMode;
    fsPhase = 'config';
    pendingSwitchMode = null;
    refreshSecondaryModals();
    refreshFsModal();
}

// ===== SHARED HELPERS =====
function rerenderMain() {
    const main = document.getElementById('mainContent');
    if (main) main.innerHTML = renderQuizActivityCreate();
}

function refreshSecondaryModals() {
    const container = document.getElementById('quizSecondaryModals');
    if (container) container.innerHTML = renderSecondaryModals();
}

function nowStamp() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// ===== SECONDARY MODAL RENDERING =====
function renderSecondaryModals() {
    return renderDeleteGroupModal() + renderCopyQuizCfgModal() + renderSwitchModeModal() + renderLeaderboardRuleModal();
}

function openLeaderboardRuleModal(e) {
    if (e) e.stopPropagation();
    leaderboardRuleOpen = true;
    refreshSecondaryModals();
}

function closeLeaderboardRuleModal() {
    leaderboardRuleOpen = false;
    refreshSecondaryModals();
}

function setLeaderboardDisplayLimit(value) {
    setLeaderboardRuleSetting(getCurrentQuizModeForAppearance(), {
        displayLimit: normalizeLeaderboardLimit(value)
    });
}

function setUnitLeaderboardDisplayLimit(value) {
    setLeaderboardRuleSetting(getCurrentQuizModeForAppearance(), {
        unitDisplayLimit: normalizeLeaderboardLimit(value)
    });
}

function setUnitLeaderboardEnabled(checked) {
    setLeaderboardRuleSetting(getCurrentQuizModeForAppearance(), {
        unitEnabled: !!checked
    });
    refreshSecondaryModals();
}

function saveLeaderboardRule() {
    const mode = getCurrentQuizModeForAppearance();
    const select = document.getElementById('leaderboardDisplayLimit');
    if (select) setLeaderboardDisplayLimit(select.value);
    const unitCheckbox = document.getElementById('unitLeaderboardEnabled');
    const unitSelect = document.getElementById('unitLeaderboardDisplayLimit');
    if (unitSelect) setUnitLeaderboardDisplayLimit(unitSelect.value);
    setLeaderboardRuleSetting(mode, {
        unitEnabled: unitCheckbox ? unitCheckbox.checked : getLeaderboardRuleSetting(mode).unitEnabled
    });
    leaderboardRuleOpen = false;
    rerenderMain();
}

function renderLeaderboardRuleModal() {
    if (!leaderboardRuleOpen) return '';
    const mode = getCurrentQuizModeForAppearance();
    const rule = getLeaderboardRuleConfig(mode);
    const setting = getLeaderboardRuleSetting(mode);
    const limitOptions = LEADERBOARD_LIMIT_OPTIONS;
    const unitColumns = ['单位名称', '参与人数'];
    return `
    <div class="modal-overlay show" onclick="if(event.target===this) closeLeaderboardRuleModal()">
      <div class="modal modal-lg leaderboard-rule-modal">
        <div class="modal-head">
            <h3>${rule.modalTitle}</h3>
            <button class="modal-close" onclick="closeLeaderboardRuleModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="leaderboard-rule-subtitle">请选择榜单类型，当前模式适用以下排行榜</div>
            <div class="leaderboard-rule-card">
                <div class="leaderboard-rule-option">
                    <label class="leaderboard-rule-check">
                        <input type="checkbox" checked disabled>
                        <span>${rule.title}</span>
                    </label>
                    ${rule.detail ? `<span class="help-tip" title="${rule.detail}">?</span>` : ''}
                </div>
                <div class="leaderboard-rule-row">
                    <label>展示前</label>
                    <select class="form-control leaderboard-limit-select" id="leaderboardDisplayLimit" onchange="setLeaderboardDisplayLimit(this.value)">
                        ${limitOptions.map(n => `<option value="${n}" ${setting.displayLimit === n ? 'selected' : ''}>${n}</option>`).join('')}
                    </select>
                    <span>名</span>
                </div>
            </div>
            <div class="leaderboard-rule-card">
                <div class="leaderboard-rule-option">
                    <label class="leaderboard-rule-check">
                        <input id="unitLeaderboardEnabled" type="checkbox" ${setting.unitEnabled ? 'checked' : ''} onchange="setUnitLeaderboardEnabled(this.checked)">
                        <span>单位参与人数排行榜</span>
                    </label>
                    <span class="help-tip" title="按单位参与人数生成排行榜，适用于报名或答题信息中包含单位字段的活动。">?</span>
                </div>
                <div class="leaderboard-rule-row ${setting.unitEnabled ? '' : 'disabled'}">
                    <label>展示前</label>
                    <select class="form-control leaderboard-limit-select" id="unitLeaderboardDisplayLimit" onchange="setUnitLeaderboardDisplayLimit(this.value)" ${setting.unitEnabled ? '' : 'disabled'}>
                        ${limitOptions.map(n => `<option value="${n}" ${setting.unitDisplayLimit === n ? 'selected' : ''}>${n}</option>`).join('')}
                    </select>
                    <span>名</span>
                </div>
            </div>
            <div class="leaderboard-rule-preview">
                <div class="leaderboard-rule-preview-title">用户端排行榜字段</div>
                <div class="leaderboard-field-group">
                    <strong>${rule.title}</strong>
                    <div class="leaderboard-field-list">${rule.columns.map(col => `<span>${col}</span>`).join('')}</div>
                </div>
                ${setting.unitEnabled ? `
                <div class="leaderboard-field-group">
                    <strong>单位参与人数排行榜</strong>
                    <div class="leaderboard-field-list">${unitColumns.map(col => `<span>${col}</span>`).join('')}</div>
                </div>` : ''}
                <div class="leaderboard-sort-rule">
                    <strong>排序规则：</strong>${rule.sortText}
                </div>
                ${setting.unitEnabled ? '<div class="leaderboard-sort-rule"><strong>单位榜排序：</strong>参与人数（高→低）＞ 单位名称（正序）</div>' : ''}
                <div class="leaderboard-rule-desc"><strong>适用说明：</strong>${rule.note}</div>
                ${rule.detail ? `<div class="leaderboard-rule-desc">${rule.detail}</div>` : ''}
                ${setting.unitEnabled ? '<div class="leaderboard-rule-desc">单位参与人数榜统计每个单位的有效参与人数，若活动未采集单位字段，用户端不展示该榜单。</div>' : ''}
            </div>
        </div>
        <div class="modal-foot">
            <button class="btn btn-ghost" onclick="closeLeaderboardRuleModal()">取消</button>
            <button class="btn btn-primary btn-gold-save" onclick="saveLeaderboardRule()">确定</button>
        </div>
      </div>
    </div>`;
}

function renderDeleteGroupModal() {
    if (deleteGroupIdx < 0) return '';
    const g = groups[deleteGroupIdx];
    return `
    <div class="modal-overlay show" onclick="if(event.target===this) closeDeleteGroup()">
      <div class="modal modal-sm">
        <div class="modal-head"><h3>确认删除该组别？</h3><button class="modal-close" onclick="closeDeleteGroup()">✕</button></div>
        <div class="modal-body">
            <p style="font-size:13px;color:var(--text-secondary);line-height:1.7">删除后，该组别「<strong>${g.name}</strong>」下已配置的报名表、答题规则和题目配置将一并删除，且不可恢复。是否确认删除？</p>
        </div>
        <div class="modal-foot">
            <button class="btn btn-ghost" onclick="closeDeleteGroup()">取消</button>
            <button class="btn btn-primary" style="background:var(--danger);border-color:var(--danger)" onclick="confirmDeleteGroup()">确认删除</button>
        </div>
      </div>
    </div>`;
}

function renderCopyQuizCfgModal() {
    if (copyCfgSrcIdx < 0) return '';
    const src = groups[copyCfgSrcIdx];
    const targets = groups.map((g, i) => ({ g, i })).filter(x => x.i !== copyCfgSrcIdx);
    if (!targets.length) {
        return `
        <div class="modal-overlay show">
          <div class="modal modal-sm">
            <div class="modal-head"><h3>复制答题配置</h3><button class="modal-close" onclick="closeCopyQuizConfig()">✕</button></div>
            <div class="modal-body"><p style="font-size:13px;color:var(--text-secondary)">暂无其他可复制到的组别，请先添加组别。</p></div>
            <div class="modal-foot"><button class="btn btn-primary" onclick="closeCopyQuizConfig()">我知道了</button></div>
          </div>
        </div>`;
    }
    return `
    <div class="modal-overlay show" onclick="if(event.target===this) closeCopyQuizConfig()">
      <div class="modal modal-sm">
        <div class="modal-head"><h3>复制答题配置</h3><button class="modal-close" onclick="closeCopyQuizConfig()">✕</button></div>
        <div class="modal-body">
            <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;margin-bottom:12px">将组别「<strong>${src.name}</strong>」的答题配置复制到下列目标组别。复制后将覆盖目标组别原有答题配置，请谨慎操作。</p>
            <div class="copy-target-list">
                ${targets.map(t => `
                    <label class="copy-target-item${copyCfgTargets.includes(t.i) ? ' selected' : ''}">
                        <input type="checkbox" ${copyCfgTargets.includes(t.i) ? 'checked' : ''} onchange="toggleCopyCfgTarget(${t.i})">
                        <div>
                            <div style="font-size:13px;font-weight:600;color:var(--text-primary)">${t.g.name}</div>
                            <div style="font-size:12px;color:var(--text-tertiary);margin-top:2px">${t.g.quizConfigured ? '现有配置将被覆盖' : '当前未配置'}</div>
                        </div>
                    </label>`).join('')}
            </div>
        </div>
        <div class="modal-foot">
            <button class="btn btn-ghost" onclick="closeCopyQuizConfig()">取消</button>
            <button class="btn btn-primary" onclick="confirmCopyQuizConfig()" ${copyCfgTargets.length ? '' : 'disabled'}>确认复制</button>
        </div>
      </div>
    </div>`;
}

function renderSwitchModeModal() {
    if (!pendingSwitchMode) return '';
    return `
    <div class="modal-overlay show" onclick="if(event.target===this) closeSwitchModeConfirm()">
      <div class="modal modal-sm">
        <div class="modal-head"><h3>确认切换答题模式？</h3><button class="modal-close" onclick="closeSwitchModeConfirm()">✕</button></div>
        <div class="modal-body"><p style="font-size:13px;color:var(--text-secondary);line-height:1.7">切换答题模式后，当前已配置的题目来源、答题规则、成绩规则将被清空。是否确认切换？</p></div>
        <div class="modal-foot">
            <button class="btn btn-ghost" onclick="closeSwitchModeConfirm()">取消</button>
            <button class="btn btn-primary" onclick="confirmSwitchMode()">确认切换</button>
        </div>
      </div>
    </div>`;
}

// ===== FULLSCREEN MODAL =====
function openQuizConfig(idx) {
    fsGroupIdx = idx;
    const g = groups[idx];
    fsQuizMode = g.quizMode || quizActivityMode;
    g.quizMode = fsQuizMode;
    fsPhase = 'config';
    fsOpen = true;
    const overlay = document.getElementById('quizFsOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.innerHTML = renderFullscreenModal();
    }
}

function closeQuizConfig() {
    fsOpen = false;
    const overlay = document.getElementById('quizFsOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.innerHTML = '';
    }
}

function renderFullscreenModal() {
    const g = groups[fsGroupIdx];
    const mode = QUIZ_MODES.find(m => m.key === fsQuizMode);
    const headerModeInfo = (fsPhase === 'config' && mode) ? `
        <div class="qfh-mode-inline">
            <div class="qfh-mode-title"><span class="qfh-mode-label">当前模式：</span>${mode.title}</div>
            <span class="badge badge-blue qfh-mode-lock">发布后不可修改</span>
        </div>` : '';

    return `
    <div class="quiz-fs-dialog" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
    <!-- Header -->
    <div class="quiz-fs-header">
        <div class="qfh-left">
            <div class="qfh-left-stack">
                <div class="qfh-title">${g.name} · 答题配置</div>
                ${headerModeInfo || `<div class="qfh-subtitle">请配置当前组别的答题规则。</div>`}
            </div>
        </div>
        <button class="quiz-fs-close" onclick="closeQuizConfig()">✕</button>
    </div>

    <!-- Body -->
    <div class="quiz-fs-body">
        ${renderModeConfigPage()}
    </div>

    <!-- Footer -->
    <div class="quiz-fs-footer">
        <div>
            ${''}
        </div>
        <div class="btn-group">
            <button class="btn btn-ghost" onclick="closeQuizConfig()">取消</button><button class="btn btn-ghost" onclick="saveGroupQuizConfigKeepOpen()">💾 保存配置</button><button class="btn btn-ghost" onclick="previewGroup(fsGroupIdx)">👁 预览</button><button class="btn btn-primary" onclick="saveGroupQuizConfig()">保存并返回</button>
        </div>
    </div>
    </div>
    ${paperDrawerOpen ? renderPaperDrawer() : ''}`;
}

function refreshFsModal() {
    const overlay = document.getElementById('quizFsOverlay');
    if (!overlay) return;
    // Preserve scroll position across re-renders so the view doesn't jump to top
    const body = overlay.querySelector('.quiz-fs-body');
    const savedScroll = body ? body.scrollTop : 0;
    overlay.innerHTML = renderFullscreenModal();
    if (savedScroll > 0) {
        const newBody = overlay.querySelector('.quiz-fs-body');
        if (newBody) newBody.scrollTop = savedScroll;
    }
}

// Close when clicking the dim backdrop (but not when clicking inside the dialog card)
function handleFsBackdropClick(e) {
    if (e && e.target && e.target.id === 'quizFsOverlay') {
        closeQuizConfig();
    }
}

// ===== MODE SELECTION PAGE (PRD §四) =====
function renderModeSelectPage() {
    return `
    <div class="mode-select-shell">
        <div class="mode-select-hero">
            <div class="mode-select-kicker">选择答题模式</div>
            <div class="mode-select-lock-note">发布后不可修改</div>
        </div>

        <div class="mode-select-grid">
            ${QUIZ_MODES.map(m => `
                <div class="mode-select-card${fsQuizMode === m.key ? ' selected' : ''}" onclick="selectFsMode('${m.key}')">
                    <div class="msc-check" aria-hidden="true">${fsQuizMode === m.key ? '✓' : ''}</div>
                    <div class="msc-card-head">
                        <div class="msc-icon" style="background:${m.bgColor};color:${m.color}">${m.icon}</div>
                        <div>
                            <div class="msc-title">${m.title}</div>
                            <div class="msc-decision">${m.decision}</div>
                        </div>
                    </div>
                    <div class="msc-section">
                        <div class="msc-section-label">适用场景</div>
                        <div class="msc-scene">${m.bestFor}</div>
                    </div>
                    <div class="msc-section">
                        <div class="msc-section-label">系统默认规则</div>
                        <div class="msc-features">
                            ${m.defaultRules.map(rule => `<div class="msc-feature-item">${rule}</div>`).join('')}
                        </div>
                    </div>
                    ${m.note ? `<div class="msc-note">${m.note}</div>` : ''}
                </div>
            `).join('')}
        </div>
    </div>`;
}

function selectFsMode(key) {
    fsQuizMode = key;
    refreshFsModal();
}

function confirmModeSelect() {
    const g = groups[fsGroupIdx];
    // If mode changed after configuration, ask for confirm (PRD §四.5)
    if (g.quizConfigured && g.quizMode && g.quizMode !== fsQuizMode) {
        openSwitchModeConfirm(fsQuizMode);
        return;
    }
    g.quizMode = fsQuizMode;
    fsPhase = 'config';
    refreshFsModal();
    // If user is currently on Step 5, re-render to reflect mode-dependent blocks (e.g. daily streak rewards)
    if (quizStep === 5) rerenderMain();
}

// ===== MODE CONFIG PAGE =====
function renderModeConfigPage() {
    return `
    <!-- Config Panels (mode description now lives in the dialog header) -->
    <div style="max-width:1040px;margin:0 auto">
        ${fsQuizMode === 'exam' ? renderExamModeConfig() : ''}
        ${fsQuizMode === 'daily' ? renderDailyModeConfig() : ''}
        ${fsQuizMode === 'level' ? renderLevelModeConfig() : ''}
    </div>`;
}

function renderQuizTotalScorePanel(options = {}) {
    const disabled = quizActivityPublished;
    const value = Number(options.value ?? quizTotalScore) || 100;
    const title = options.title || '试卷总分';
    const subtitle = options.subtitle || '请先选择本次答题的试卷总分，再配置题目来源和抽题规则';
    const label = options.label || '试卷总分';
    const hint = options.hint || '发布后，试卷总分不支持修改，请确认后再发布活动。';
    const panelId = options.panelId || 'quizTotalScorePanel';
    const onSelect = options.onSelect || 'setQuizTotalScore';
    return `
    <div class="cfg-panel global-score-panel" id="${panelId}">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('${panelId}')">
            <div class="cfg-panel-icon blue">💯</div>
            <div><div class="cfg-panel-title">${title}</div><div class="cfg-panel-subtitle">${subtitle}</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row" style="border-bottom:none">
                <div class="cfg-row-label"><span class="req">*</span> ${label}</div>
                <div class="cfg-row-control">
                    <div class="score-total-options ${disabled ? 'is-disabled' : ''}" ${disabled ? 'title="活动已发布，试卷总分不支持修改。"' : ''}>
                        ${[100, 120, 150].map(score => `
                            <button type="button" class="score-total-option ${value === score ? 'active' : ''}" ${disabled ? 'disabled' : `onclick="${onSelect}(${score})"`}>${score} 分</button>
                        `).join('')}
                    </div>
                    <div class="cfg-row-hint">${hint}</div>
                </div>
            </div>
        </div>
    </div>`;
}

function setQuizTotalScore(score) {
    if (quizActivityPublished) return;
    quizTotalScore = Number(score) || 100;
    refreshFsModal();
}

function setCurrentLevelTotalScore(score) {
    if (quizActivityPublished) return;
    const nextScore = Number(score) || 100;
    levels.forEach(level => {
        level.totalScore = nextScore;
        if (Number(level.passScore) > level.totalScore) level.passScore = level.totalScore;
    });
    refreshFsModal();
}

function getRuleTotal(rules) {
    return (rules || []).reduce((sum, rule) => sum + (Number(rule.count ?? rule.qCount) || 0) * (Number(rule.score ?? rule.perScore) || 0), 0);
}

function getScoreValidationState(rules, targetScore = quizTotalScore) {
    const target = Number(targetScore) || 0;
    if (!target) return { state: 'missing-total', current: 0, target: 0, diff: 0 };
    if (!rules || !rules.length) return { state: 'missing-rules', current: 0, target, diff: target };
    const current = getRuleTotal(rules);
    const diff = Math.abs(target - current);
    if (current < target) return { state: 'under', current, target, diff: target - current };
    if (current > target) return { state: 'over', current, target, diff: current - target };
    return { state: 'ok', current, target, diff: 0 };
}

function renderScoreRuleNotice(rules, targetScore = quizTotalScore) {
    const result = getScoreValidationState(rules, targetScore);
    const cls = result.state === 'ok' ? 'ok' : result.state === 'over' ? 'error' : 'warn';
    const messageMap = {
        'missing-total': '请先选择每日总分。',
        'missing-rules': '请先配置题目来源和抽题规则。',
        under: `当前已配置 ${result.current} 分，还差 ${result.diff} 分，请继续补充题目或调整每题分值。`,
        over: `当前已配置 ${result.current} 分，已超出每日总分 ${result.diff} 分，请调整题目数量或每题分值。`,
        ok: `分值配置正确，当前每日总分为 ${result.target} 分。`
    };
    return `
    <div class="score-rule-notice ${cls}">
        <div class="score-rule-notice-head">
            <strong>已配置总分：${result.current} / ${result.target || '-'} 分</strong>
            <span>${result.state === 'ok' ? '校验通过' : '待调整'}</span>
        </div>
        <p>本次每日总分为 ${result.target || '-'} 分，请确保所有抽题规则的分值之和等于该总分。</p>
        <p>${messageMap[result.state]}</p>
    </div>`;
}

function getCurrentLevel() {
    return levels[levelCurrentIdx] || levels[0];
}

function getLevelRules(level = getCurrentLevel()) {
    return (level && Array.isArray(level.rules)) ? level.rules : [];
}

function getLevelFixedQuestions(level = getCurrentLevel()) {
    return (level && Array.isArray(level.fixedQuestions)) ? level.fixedQuestions : [];
}

function getLevelQuestionCount(level = getCurrentLevel()) {
    return levelQuestionMode === 'fixed'
        ? getLevelFixedQuestions(level).length
        : getLevelRules(level).reduce((sum, rule) => sum + (Number(rule.count) || 0), 0);
}

function getLevelFixedScore(level = getCurrentLevel()) {
    return getLevelFixedQuestions(level).reduce((sum, question) => sum + (Number(question.score) || 0), 0);
}

function getLevelFixedValidationState(level = getCurrentLevel()) {
    const target = Number(level?.totalScore) || 0;
    if (!target) return { state: 'missing-total', current: 0, target: 0, diff: 0 };
    const questions = getLevelFixedQuestions(level);
    if (!questions.length) return { state: 'missing-rules', current: 0, target, diff: target };
    const current = getLevelFixedScore(level);
    if (current < target) return { state: 'under', current, target, diff: target - current };
    if (current > target) return { state: 'over', current, target, diff: current - target };
    return { state: 'ok', current, target, diff: 0 };
}

function getScoreRulesByMode(mode) {
    if (mode === 'daily') return dailyRandomRules;
    if (mode === 'level') return getLevelRules();
    return [];
}

function getActiveScoreRules() {
    if (fsQuizMode === 'daily') return dailyQMode === 'fixed'
        ? dailyFixedConfig.days.flatMap(day => day.questions || [])
        : dailyRandomRules;
    if (fsQuizMode === 'level') return levelQuestionMode === 'fixed'
        ? getLevelFixedQuestions()
        : getLevelRules();
    return getScoreRulesByMode(fsQuizMode);
}

function getDailySourceValidationState() {
    if (dailyQMode === 'fixed') return getDailyFixedValidationState();
    const timeState = getDailyTimeValidationState();
    if (timeState.state !== 'ok') return { ...timeState, current: 0, target: Number(quizTotalScore) || 0, diff: 0 };
    return getScoreValidationState(dailyRandomRules);
}

function getDailyTimeValidationMessage(result, modeLabel) {
    const msgMap = {
        'missing-time': `${modeLabel}：请先配置答题开放时间。`,
        'invalid-time-range': `${modeLabel}：答题开放结束时间不能早于开始时间。`,
        'missing-daily-window': `${modeLabel}：请先配置每日答题时段。`,
        'invalid-daily-window': `${modeLabel}：每日答题结束时刻必须晚于开始时刻。`,
        'invalid-time-limit': `${modeLabel}：每题限时不能低于 5 秒。`
    };
    return msgMap[result.state] || '';
}

function getDailySourceValidationMessage(result, mode = dailyQMode) {
    const modeLabel = mode === 'fixed' ? '每日固定题目' : '每日随机抽题';
    if (mode === 'fixed') {
        const dayLabel = result.dayIndex >= 0 ? `第 ${result.dayIndex + 1} 天` : '当前日期';
        const timeMsg = getDailyTimeValidationMessage(result, modeLabel);
        if (timeMsg) return timeMsg.replace('请先配置答题开放时间。', '请先在“每日固定题目计划”中配置答题开放时间。');
        const fixedMsgMap = {
            'missing-date': `${modeLabel}：缺少 ${formatDateLabel(result.missingDate)} 的固定题目计划，请按开放日期生成或补充日期。`,
            'duplicate-date': `${modeLabel}：${dayLabel} 日期重复，请调整日期计划。`,
            'date-out-of-range': `${modeLabel}：${dayLabel} 不在答题开放日期范围内，请调整开放时间或日期计划。`
        };
        if (fixedMsgMap[result.state]) return fixedMsgMap[result.state];
        if (result.state === 'missing-total') return `${modeLabel}：请先选择试卷总分。`;
        if (result.state === 'missing-rules') return `${modeLabel}：${dayLabel} 还没有配置题目。`;
        if (result.state === 'under') return `${modeLabel}：${dayLabel} 还差 ${result.diff} 分，请补充题目或调整分值。`;
        if (result.state === 'over') return `${modeLabel}：${dayLabel} 已超出 ${result.diff} 分，请调整题目数量或每题分值。`;
        return `${modeLabel}：分值配置正确。`;
    }
    const timeMsg = getDailyTimeValidationMessage(result, modeLabel);
    if (timeMsg) return timeMsg;
    return `${modeLabel}：${getScoreValidationMessage(result)}`;
}

function getScoreValidationMessage(result) {
    const msgMap = {
        'missing-total': '请先选择试卷总分。',
        'missing-rules': '请先配置题目来源和抽题规则。',
        under: `当前题目总分不足，已配置 ${result.current} 分，还差 ${result.diff} 分，请调整后再继续。`,
        over: `当前题目总分超出，已配置 ${result.current} 分，超出 ${result.diff} 分，请调整后再继续。`,
        ok: '分值配置正确。'
    };
    return msgMap[result.state] || '请检查分值配置。';
}

function getLevelValidationMessage(result) {
    const msgMap = {
        'missing-total': '请先选择每个关卡分数。',
        'missing-rules': '请先配置关卡固定题目。',
        under: `当前关卡固定题目总分不足，已配置 ${result.current} 分，还差 ${result.diff} 分，请调整后再继续。`,
        over: `当前关卡固定题目总分超出，已配置 ${result.current} 分，超出 ${result.diff} 分，请调整后再继续。`,
        ok: '关卡固定题目分值配置正确。'
    };
    return msgMap[result.state] || '请检查每个关卡分数配置。';
}

function validateScoreRulesForMode(mode, { silent = false } = {}) {
    if (mode === 'exam') {
        const missingPaper = !phasedConfig.phases.length || !phasedConfig.phases.every(phase => phase.paper);
        if (missingPaper && !silent) alert('考试模式：请先选择试卷。');
        return !missingPaper;
    }
    if (mode === 'daily') {
        const result = getDailySourceValidationState();
        if (!silent && result.state !== 'ok') alert(getDailySourceValidationMessage(result));
        return result.state === 'ok';
    }
    if (mode === 'level') {
        return validateAllLevelScoreRules({ silent });
    }
    const result = getScoreValidationState(getScoreRulesByMode(mode));
    if (!silent && result.state !== 'ok') {
        const modeTitle = (QUIZ_MODES.find(m => m.key === mode) || {}).title || '当前模式';
        alert(`${modeTitle}：${getScoreValidationMessage(result)}`);
    }
    return result.state === 'ok';
}

function validateAllLevelScoreRules({ silent = false } = {}) {
    for (let i = 0; i < levels.length; i += 1) {
        const level = levels[i];
        const result = levelQuestionMode === 'fixed'
            ? getLevelFixedValidationState(level)
            : getScoreValidationState(getLevelRules(level), level.totalScore);
        if (result.state !== 'ok') {
            if (!silent) alert(`答题闯关：第 ${i + 1} 关 ${getLevelValidationMessage(result)}`);
            levelCurrentIdx = i;
            refreshFsModal();
            return false;
        }
    }
    return true;
}

function validateActiveScoreRules({ silent = false } = {}) {
    return validateScoreRulesForMode(fsQuizMode, { silent });
}

function getModesRequiringScoreValidation() {
    const modes = (groups || []).map(g => g.quizMode || quizActivityMode).filter(Boolean);
    if (!modes.length) modes.push(quizActivityMode || fsQuizMode || 'exam');
    return Array.from(new Set(modes));
}

function validateAllScoreRules({ silent = false } = {}) {
    for (const mode of getModesRequiringScoreValidation()) {
        if (!validateScoreRulesForMode(mode, { silent })) return false;
    }
    return true;
}

function saveGroupQuizConfig() {
    if (!QUIZ_CREATE_DEMO_SKIP_VALIDATION_ALERTS && !validateActiveScoreRules()) return;
    applyExamToGroup();
    closeQuizConfig();
    rerenderMain();
}

function saveGroupQuizConfigKeepOpen() {
    if (!QUIZ_CREATE_DEMO_SKIP_VALIDATION_ALERTS && !validateActiveScoreRules()) return;
    applyExamToGroup();
    // gentle toast via alert for demo
    const g = groups[fsGroupIdx];
    setTimeout(() => alert('配置已保存：' + g.name), 0);
}

// Sync current exam config state into the active group's summary fields
function applyExamToGroup() {
    const g = groups[fsGroupIdx];
    g.quizConfigured = true;
    g.quizMode = fsQuizMode;
    g.updatedAt = nowStamp();
    if (fsQuizMode === 'exam') {
        const qCount = phasedConfig.phases.reduce((sum, phase) => sum + (phase.paper?.qCount || 0), 0);
        const total  = phasedConfig.phases.reduce((sum, phase) => sum + (phase.paper?.total || 0), 0);
        g.quizQCount = qCount;
        g.quizTotal = total;
        g.quizAttemptsText = phasedConfig.phases.length === 1
            ? `单场考试 · 每人 ${phasedConfig.phases[0]?.attempts || 1} 次`
            : `${phasedConfig.phases.length} 期考试`;
    } else if (fsQuizMode === 'daily') {
        if (dailyQMode === 'fixed') {
            const days = dailyFixedConfig.days || [];
            g.quizQCount = days.reduce((sum, day) => sum + getDailyFixedDayQuestionCount(day), 0);
            g.quizTotal = days.reduce((sum, day) => sum + getDailyFixedDayScore(day), 0);
            g.quizAttemptsText = `${days.length} 天固定题目`;
        } else {
            const rules = dailyRandomRules || [];
            g.quizQCount = rules.reduce((sum, rule) => sum + (Number(rule.count ?? rule.qCount) || 0), 0);
            g.quizTotal = rules.reduce((sum, rule) => sum + (Number(rule.count ?? rule.qCount) || 0) * (Number(rule.score ?? rule.perScore) || 0), 0);
            g.quizAttemptsText = `每日 ${dailyScoreConfig.maxDailyAttempts || 1} 次`;
        }
    } else if (fsQuizMode === 'level') {
        g.quizQCount = (levels || []).reduce((sum, level) => sum + getLevelQuestionCount(level), 0);
        g.quizTotal = (levels || []).reduce((sum, level) => sum + (Number(level.totalScore) || 0), 0);
        g.quizAttemptsText = `${(levels || []).length} 关 · ${levelQuestionMode === 'fixed' ? '固定题目' : '随机抽题'}`;
    }
}

function computeExamQCount() {
    if (examConfig.paperMode === 'fixed') return examConfig.selectedPaper ? examConfig.selectedPaper.qCount : 0;
    if (examConfig.paperMode === 'userChoice') {
        const ps = examConfig.userChoicePapers || [];
        return ps[0] ? ps[0].qCount : 0;
    }
    return examConfig.randomRules.reduce((s, r) => s + (Number(r.qCount) || 0), 0);
}

function computeExamTotal() {
    if (examConfig.paperMode === 'fixed') return examConfig.selectedPaper ? examConfig.selectedPaper.total : 0;
    if (examConfig.paperMode === 'userChoice') {
        const ps = examConfig.userChoicePapers || [];
        return ps[0] ? ps[0].total : 0;
    }
    return examConfig.randomRules.reduce((s, r) => s + (Number(r.qCount) || 0) * (Number(r.perScore) || 0), 0);
}

// ===============================
// EXAM MODE CONFIG (考试模式)
// ===============================
function renderExamModeConfig() {
    const g = groups[fsGroupIdx] || { name: '' };
    return `
    ${renderUnifiedExamFlow(g)}
    `;
}

function renderUnifiedExamFlow(g) {
    const pc = phasedConfig;
    return `
    ${renderUnifiedPhaseConfig(pc)}
    ${renderExamModule7(examConfig)}
    `;
}

function renderUnifiedPhaseConfig(pc) {
    return `
    <div class="phase-config-shell">
        <div class="phase-section-header">
            <div class="phase-section-title">考试配置</div>
            <div class="phase-section-subtitle">默认 1 场考试，按需继续新增即可。</div>
        </div>
        <div class="cfg-panel phase-main-panel" id="examPhaseConfig">
            <div class="cfg-panel-body">
                <div class="phase-card-stack">
                    ${pc.phases.map((p, i) => renderPhaseConfigCard(p, i)).join('')}
                </div>
            </div>
        </div>
        <div class="phase-panel-footer">
            <button class="phase-add-card" onclick="addPhase()">
                <span>+ 添加考试场次</span>
            </button>
        </div>
    </div>`;
}

// ---- overview card ----
function renderExamOverview(g, ec, qCount, total, statusOk) {
    const srcText = ec.paperMode === 'fixed'
        ? '指定单套试卷'
        : (ec.paperMode === 'userChoice'
            ? `用户自选试卷 · ${(ec.userChoicePapers || []).filter(p => p.paperName).length} 套`
            : '随机组卷');
    const statusCls = statusOk ? 'configured' : 'unconfigured';
    const statusTxt = statusOk ? '已完成' : '未完成';
    return `
    <div class="qmdc-overview">
        <div class="qmdc-ov-title">
            <span class="qmdc-ov-emoji">📝</span>
            <div>
                <div class="qmdc-ov-name">考试模式</div>
                <div class="qmdc-ov-desc">适用于线上考试、知识竞赛、测评考试等正式答题场景。支持固定题目、随机组卷、考试时长、及格分和成绩排名。</div>
            </div>
        </div>
        <div class="qmdc-ov-grid">
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">当前组别</div><div class="qmdc-ov-val">${g.name || '—'}</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">答题模式</div><div class="qmdc-ov-val">考试模式</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">题目来源</div><div class="qmdc-ov-val">${srcText}</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">题目数量</div><div class="qmdc-ov-val">${qCount} 题</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">试卷总分</div><div class="qmdc-ov-val">${total} 分</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">及格分</div><div class="qmdc-ov-val">${ec.passScore} 分</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">配置状态</div><div class="qmdc-ov-val"><span class="gc-status-pill ${statusCls}">${statusTxt}</span></div></div>
        </div>
    </div>`;
}

// ---- module 1: 选择试卷 ----
function renderExamModule1(ec, qCount, total) {
    return `
    <div class="cfg-panel" id="examQSource">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('examQSource')">
            <div class="cfg-panel-icon blue">📄</div>
            <div><div class="cfg-panel-title">选择试卷</div><div class="cfg-panel-subtitle">请选择当前单场考试使用的试卷。试卷可在「试卷管理」模块中提前配置。</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            ${renderFixedPaperBlock(ec.selectedPaper)}
        </div>
    </div>`;
}

// ---- 用户自选试卷 子配置 (四个子块: 可选试卷列表 / 选择规则 / 次数锁定 / 成绩排名) ----
function renderUserChoicePaperConfig(ec) {
    const ps = ec.userChoicePapers || [];
    return `
    <div class="uc-section">
        <div class="uc-section-title">📑 可选试卷列表</div>
        <div class="uc-section-hint">请添加用户可选择的试卷（至少 2 套）。用户进入考试后，将从以下试卷中选择一套进行答题。</div>
        <div class="uc-paper-list">
            ${ps.map((p,i) => renderUserChoicePaperItem(p,i)).join('')}
        </div>
        <button class="btn btn-outline btn-sm" style="margin-top:8px" onclick="addUserChoicePaper()">+ 添加可选试卷</button>
    </div>`;
}

function renderUserChoicePaperItem(p, i) {
    const configured = !!p.paperName;
    return `
    <div class="uc-paper-card ${configured?'':'empty'}">
        <div class="uc-paper-head">
            <span class="uc-paper-seq">${i + 1}</span>
            <input type="text" class="form-control uc-paper-name-input" value="${p.displayName||''}" placeholder="试卷展示名称" onchange="setUserChoicePaperField(${i},'displayName',this.value)">
            <div class="uc-paper-actions">
                <button class="btn btn-outline btn-sm" onclick="pickUserChoicePaper(${i})">${configured?'更换试卷':'关联试卷'}</button>
                <button class="btn btn-ghost btn-sm" onclick="removeUserChoicePaper(${i})">删除</button>
            </div>
        </div>
        <textarea class="form-control uc-paper-desc" rows="2" placeholder="试卷说明（选填，用于说明该试卷主题或适用人群）" onchange="setUserChoicePaperField(${i},'desc',this.value)">${p.desc||''}</textarea>
        ${configured ? `
        <div class="uc-paper-meta">
            <div class="uc-paper-linked"><span class="uc-lbl">关联试卷：</span><strong>${p.paperName}</strong> <span class="badge badge-green" style="font-size:10px;margin-left:4px">${p.status||'启用'}</span></div>
            <div class="uc-paper-stats">
                <span><span class="uc-lbl">题量：</span>${p.qCount} 题</span>
                <span><span class="uc-lbl">总分：</span>${p.total} 分</span>
                <span><span class="uc-lbl">题型：</span>${p.composition||'—'}</span>
            </div>
        </div>` : `<div class="uc-paper-empty">尚未关联试卷，点击右上角「关联试卷」选择。</div>`}
    </div>`;
}

function renderFixedPaperBlock(paper) {
    if (!paper) {
        return `
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 选择试卷</div>
            <div class="cfg-row-control">
                <div class="paper-pick-zone" onclick="pickExamPaper()">
                    <div class="ppz-icon">+</div>
                    <div class="ppz-text">选择试卷</div>
                </div>
            </div>
        </div>`;
    }
    return `
    <div class="cfg-row">
        <div class="cfg-row-label"><span class="req">*</span> 选择试卷</div>
        <div class="cfg-row-control">
            <div class="paper-source-card selected" style="cursor:default">
                <div class="psc-title">📄 ${paper.name} <span style="margin-left:6px">${paperModeBadges(paper)}</span> <span class="badge badge-green" style="font-size:11px;margin-left:6px">${paper.status||'启用'}</span></div>
                <div class="psc-meta-grid">
                    <div><span class="psc-meta-lbl">题目数量：</span><span class="psc-meta-val">${paper.qCount} 题</span></div>
                    <div><span class="psc-meta-lbl">试卷总分：</span><span class="psc-meta-val">${paper.total} 分</span></div>
                    <div><span class="psc-meta-lbl">题型构成：</span><span class="psc-meta-val">${paper.composition||'—'}</span></div>
                    <div><span class="psc-meta-lbl">更新时间：</span><span class="psc-meta-val">${paper.updatedAt||'—'}</span></div>
                </div>
                <div style="margin-top:10px;display:flex;gap:8px">
                    <button class="btn btn-outline btn-sm" onclick="pickExamPaper()">更换试卷</button>
                    <button class="btn btn-ghost btn-sm" onclick="navigateTo('paper-mgmt')">查看试卷</button>
                </div>
            </div>
        </div>
    </div>`;
}

function renderRandomPaperBlock(rules) {
    const rows = (rules||[]).map((r,i)=>{
        const sub = r.qCount * r.perScore;
        return `
        <tr>
            <td>${r.bank||'—'}</td>
            <td>${r.qType||'—'}</td>
            <td><input type="number" class="num-sm" min="1" value="${r.qCount}" onchange="setExamRandomRuleField(${i},'qCount',this.value)"></td>
            <td><input type="number" class="num-sm" min="1" value="${r.perScore}" onchange="setExamRandomRuleField(${i},'perScore',this.value)"></td>
            <td>${r.available||0}</td>
            <td>${sub}</td>
            <td><button class="btn btn-ghost btn-sm" onclick="removeExamRandomRule(${i})">删除</button></td>
        </tr>`;
    }).join('');
    return `
    <div class="cfg-row">
        <div class="cfg-row-label"><span class="req">*</span> 随机组卷规则</div>
        <div class="cfg-row-control">
            <table class="random-paper-table">
                <thead><tr>
                    <th>题库</th><th>题型</th><th>抽题数量</th><th>每题分值</th><th>可用题量</th><th>小计</th><th>操作</th>
                </tr></thead>
                <tbody>${rows || '<tr><td colspan="7" style="text-align:center;color:var(--text-tertiary);padding:12px">尚未配置抽题规则</td></tr>'}</tbody>
            </table>
            <button class="btn btn-outline btn-sm" style="margin-top:10px" onclick="addExamRandomRule()">+ 新增抽题规则</button>
        </div>
    </div>`;
}

// ---- module 2: 答题时间 ----
function renderExamModule2(ec) {
    return `
    <div class="cfg-panel" id="examTime">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('examTime')">
            <div class="cfg-panel-icon blue">⏱</div>
            <div><div class="cfg-panel-title">答题时间</div><div class="cfg-panel-subtitle">考试开放时间、考试时长、答题时段</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 考试开放时间</div>
                <div class="cfg-row-control">
                    <div style="display:flex;gap:8px;align-items:center">
                        <input type="date" class="form-control" value="${getDatePartFromDateTime(ec.examStart)}" onchange="setExamField('examStart',this.value)">
                        <span style="color:var(--text-tertiary)">至</span>
                        <input type="date" class="form-control" value="${getDatePartFromDateTime(ec.examEnd)}" onchange="setExamField('examEnd',this.value)">
                    </div>
                </div>
            </div>
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 考试时长</div>
                <div class="cfg-row-control">
                    <div class="num-input"><input type="number" value="${ec.duration}" min="1" onchange="setExamField('duration',this.value)"><span class="unit">分钟</span></div>
                    <div class="cfg-row-hint">若考试开放时间已结束，即使考试时长未用完，系统也会自动交卷。</div>
                </div>
            </div>
            <div class="cfg-row">
                <div class="cfg-row-label">每日考试时段</div>
                <div class="cfg-row-control">
                    <div style="display:flex;gap:8px;align-items:center">
                        <label class="switch" style="margin-right:8px"><input type="checkbox" ${ec.dailyTimeEnabled?'checked':''} onchange="setExamDailyTime(this.checked)"><span class="sw-slider"></span></label>
                        <span style="font-size:13px;color:var(--text-secondary)">开启后每天仅指定时段允许进入考试</span>
                        ${ec.dailyTimeEnabled ? `
                        <input type="time" value="${ec.dailyTimeStart}" style="padding:6px 10px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:13px" onchange="setExamField('dailyTimeStart',this.value)">
                        <span style="color:var(--text-tertiary)">至</span>
                        <input type="time" value="${ec.dailyTimeEnd}" style="padding:6px 10px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:13px" onchange="setExamField('dailyTimeEnd',this.value)">` : ''}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// ---- module 3: 参与次数 ----
function renderExamModule3(ec) {
    return `
    <div class="cfg-panel" id="examAttempts">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('examAttempts')">
            <div class="cfg-panel-icon green">🔄</div>
            <div><div class="cfg-panel-title">参与次数</div><div class="cfg-panel-subtitle">活动期间每人最多考试次数</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 活动期间每人最多考试次数</div>
                <div class="cfg-row-control">
                    <div class="num-input"><input type="number" value="${ec.attempts}" min="1" onchange="setExamField('attempts',this.value)"><span class="unit">次</span></div>
                    <div class="cfg-row-hint">用户提交试卷后计为 1 次。${ec.attempts>1?'<span style="color:var(--warning)">已开启多次考试，请在下方「分数与成绩规则」选择成绩取值规则。</span>':''}</div>
                </div>
            </div>
        </div>
    </div>`;
}

// ---- module 4: 分数与成绩规则 ----
function renderExamModule4(ec, total) {
    const maxScore = Math.max(1, total);
    const pass = Math.min(ec.passScore, maxScore);
    return `
    <div class="cfg-panel" id="examScore">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('examScore')">
            <div class="cfg-panel-icon orange">📊</div>
            <div><div class="cfg-panel-title">分数与成绩规则</div><div class="cfg-panel-subtitle">及格分数、成绩取值规则、排名规则</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label">试卷总分</div>
                <div class="cfg-row-control">
                    <div><span style="font-size:var(--font-size-xl);font-weight:700;color:var(--primary)">${total}</span> <span style="font-size:var(--font-size-sm);color:var(--text-tertiary)">分（根据试卷或组卷规则自动计算，不可手动修改）</span></div>
                </div>
            </div>
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 及格分数</div>
                <div class="cfg-row-control">
                    <div class="score-slider">
                        <input type="range" min="0" max="${maxScore}" value="${pass}" oninput="this.nextElementSibling.textContent=this.value;setExamField('passScore',this.value)">
                        <span class="score-val">${pass}</span><span class="score-unit">分</span>
                    </div>
                    <div class="cfg-row-hint">及格分数不得大于试卷总分，也不得小于 0。</div>
                </div>
            </div>
            ${ec.attempts>1 ? `
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 成绩取值规则</div>
                <div class="cfg-row-control">
                    <div class="radio-pills">
                        <div class="radio-pill ${ec.scoreRule==='highest'?'active':''}" onclick="setExamField('scoreRule','highest')"><input type="radio" name="examScoreRule" ${ec.scoreRule==='highest'?'checked':''}>最高分</div>
                        <div class="radio-pill ${ec.scoreRule==='last'?'active':''}" onclick="setExamField('scoreRule','last')"><input type="radio" name="examScoreRule" ${ec.scoreRule==='last'?'checked':''}>最后一次成绩</div>
                        <div class="radio-pill ${ec.scoreRule==='average'?'active':''}" onclick="setExamField('scoreRule','average')"><input type="radio" name="examScoreRule" ${ec.scoreRule==='average'?'checked':''}>平均分</div>
                    </div>
                    <div class="cfg-row-hint">仅答题次数大于 1 时生效。</div>
                </div>
            </div>` : ''}
            <div class="cfg-row">
                <div class="cfg-row-label">排名规则</div>
                <div class="cfg-row-control">
                    <div style="font-size:13px;color:var(--text-secondary)">按最终成绩降序；同分时，交卷时间越早排名越靠前。</div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderDeveloperRuleList(rules) {
    return `
    <div class="dev-default-rules">
        <div class="dev-default-rules-note">以下为系统默认实现规则，仅供研发人员查看；管理员无需配置开关。</div>
        <ol>
            ${rules.map(rule => `<li>${rule}</li>`).join('')}
        </ol>
    </div>`;
}

function getPracticeConfig(mode) {
    if (!activityPracticeConfig[mode]) {
        activityPracticeConfig[mode] = { bank: false, bankWay: 'sequence', name: '', startTime: '2026-06-09T06:00', endTime: '2026-07-09T23:59' };
    }
    return activityPracticeConfig[mode];
}

function renderActivityPracticeConfigPanel(mode, title = '练习模式', subtitle = '可选配置练习入口，当前仅支持题库刷题，可不启用。', placement = '') {
    const cfg = getPracticeConfig(mode);
    const panelId = `practiceConfig_${mode}${placement ? `_${placement}` : ''}`;
    const selected = cfg.bank;
    return `
    <div class="cfg-panel activity-practice-panel" id="${panelId}">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('${panelId}')">
            <div class="cfg-panel-icon green">🧩</div>
            <div><div class="cfg-panel-title">${title}</div><div class="cfg-panel-subtitle">${subtitle}</div></div>
            <span class="cfg-panel-badge optional">可选</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="practice-layout">
                <div class="practice-layout-row">
                    <div class="practice-layout-label">练习模式</div>
                    <div class="practice-layout-content">
                        <div class="practice-embed-mode-stack">
                            ${renderActivityPracticeOptionBlock(mode, 'bank', '题库刷题', '基于已配置题库进行刷题练习，答题后即时展示对错、正确答案和解析。启用后，用户端显示练习入口；未启用时不展示入口。')}
                        </div>
                    </div>
                </div>
                ${selected ? renderActivityPracticeBaseConfig(mode) : ''}
            </div>
        </div>
    </div>`;
}

function renderActivityPracticeBaseConfig(mode) {
    const cfg = getPracticeConfig(mode);
    const nameValue = cfg.name || quizActivityName || '自动带入活动名称';
    return `
    <div class="practice-base-config">
        <div class="practice-layout-row">
            <div class="practice-layout-label"><span class="req">*</span>练习活动名称</div>
            <div class="practice-layout-content">
                <div class="practice-name-field">
                    <input class="form-control" value="${escapeAttr(nameValue)}" onchange="setActivityPracticeField('${mode}','name',this.value)">
                    <span>· 题库练习</span>
                </div>
            </div>
        </div>
        <div class="practice-layout-row">
            <div class="practice-layout-label"><span class="req">*</span>练习开放时间范围</div>
            <div class="practice-layout-content">
                <div class="time-range">
                    <input type="datetime-local" class="form-control" value="${cfg.startTime || ''}" onchange="setActivityPracticeField('${mode}','startTime',this.value)">
                    <span>至</span>
                    <input type="datetime-local" class="form-control" value="${cfg.endTime || ''}" onchange="setActivityPracticeField('${mode}','endTime',this.value)">
                </div>
            </div>
        </div>
    </div>`;
}

function renderActivityPracticeOptionBlock(mode, key, title, desc) {
    const cfg = getPracticeConfig(mode);
    const active = !!cfg[key];
    return `
    <div class="practice-embed-option ${active ? 'active' : ''}">
        ${renderActivityPracticeModeCard(mode, key, title, desc)}
    </div>`;
}

function renderActivityPracticeModeCard(mode, key, title, desc) {
    const cfg = getPracticeConfig(mode);
    const active = !!cfg[key];
    return `
    <label class="practice-embed-card ${active ? 'active' : ''}">
        <input type="checkbox" ${active ? 'checked' : ''} onchange="toggleActivityPracticeMode('${mode}','${key}',this.checked)">
        <span class="practice-embed-card-main">
            <strong>${title}</strong>
            <span>${desc}</span>
        </span>
    </label>`;
}

function toggleActivityPracticeMode(mode, key, checked) {
    getPracticeConfig(mode)[key] = checked;
    refreshFsModal();
}

function setActivityPracticeField(mode, field, value) {
    getPracticeConfig(mode)[field] = value;
}

function setActivityPracticeBankWay(mode, way) {
    getPracticeConfig(mode).bankWay = way;
    refreshFsModal();
}

// ---- module 7: 默认答题规则 ----
function renderExamModule7(ec) {
    return `
    <div class="cfg-panel" id="examDefaultRules">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('examDefaultRules')">
            <div class="cfg-panel-icon purple">📋</div>
            <div><div class="cfg-panel-title">默认答题规则</div><div class="cfg-panel-subtitle">系统默认实现，管理员无需配置</div></div>
            <span class="cfg-panel-badge advanced">高级</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            ${renderDeveloperRuleList([
                '中断答题后计时继续：用户退出后再次进入，考试计时继续。',
                '超时自动交卷：考试时长或开放时间结束后自动交卷。',
                '允许跳题：用户可跳过当前题后续再答。',
                '显示答题卡：用户可通过答题卡切换题目。',
                '支持提前交卷：用户可在考试时长结束前主动交卷。',
                '提交后展示成绩：考试模式固定为交卷后自动展示成绩。',
                '答题解析规则：默认为“活动结束后展示答题解析”，管理员无需配置。',
                '人工阅卷成绩展示：需人工阅卷的答题活动，默认在全部答卷完成阅卷后展示成绩。',
                '用户端展示位置：默认展示在正式答题详情页。'
            ])}
        </div>
    </div>`;
}

// ===============================
// PHASED EXAM FLOW (多期主题考试)
// ===============================
function renderPhasedExamFlow(g) {
    const pc = phasedConfig;
    return `
    ${renderPhasedModule3And4(pc)}
    `;
}

function renderPhasedOverview(g, pc) {
    const totalConfigured = pc.phases.filter(p => p.configured).length;
    const statusOk = totalConfigured === pc.phases.length;
    const statusCls = statusOk ? 'configured' : 'partial';
    const statusTxt = statusOk ? '已完成' : `已配置 ${totalConfigured}/${pc.phases.length}`;
    return `
    <div class="qmdc-overview">
        <div class="qmdc-ov-title">
            <span class="qmdc-ov-emoji">🗓</span>
            <div>
                <div class="qmdc-ov-name">考试模式 · 多期主题考试</div>
                <div class="qmdc-ov-desc">适用于同一个活动中按时间开放多期主题试卷的考试场景。每一期可独立配置主题、开放时间、试卷和排名规则，用户只能在对应期次开放时间内参与答题。</div>
            </div>
        </div>
        <div class="qmdc-ov-grid">
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">当前组别</div><div class="qmdc-ov-val">${g.name || '—'}</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">考试形式</div><div class="qmdc-ov-val">多期主题考试</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">期次数量</div><div class="qmdc-ov-val">${pc.phases.length} 期</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">每期题数</div><div class="qmdc-ov-val">${pc.phases[0]?.paper?.qCount || 0} 题</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">每期总分</div><div class="qmdc-ov-val">${pc.phases[0]?.paper?.total || 0} 分</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">每期限时</div><div class="qmdc-ov-val">${pc.phases[0]?.duration || pc.globalRules.duration} 分钟</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">参与次数</div><div class="qmdc-ov-val">每人每期 ${pc.globalRules.attempts} 次</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">配置状态</div><div class="qmdc-ov-val"><span class="gc-status-pill ${statusCls}">${statusTxt}</span></div></div>
        </div>
        <div class="info-box blue" style="margin-top:14px;line-height:1.75">
            <div style="margin-bottom:4px"><strong>多期主题考试</strong>适合预选赛、主题竞赛、阶段性考试等场景。管理员可以在一个答题活动中配置多期试卷，每一期相互独立，用户只能在对应期次开放时间内参与答题。</div>
        </div>
    </div>`;
}

// Module 3 + 4 combined: 分期试卷列表 + 单期配置 (left-right split)
function renderPhasedModule3And4(pc) {
    const idx = Math.min(phasedCurrentIdx, pc.phases.length - 1);
    const cur = pc.phases[idx];
    return `
    <div class="cfg-panel" id="phasedPapers">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('phasedPapers')">
            <div class="cfg-panel-icon purple">📚</div>
            <div><div class="cfg-panel-title">分期试卷列表</div><div class="cfg-panel-subtitle">按考试期次配置主题试卷，系统将根据每期开放时间在用户端展示当前可作答的试卷</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="phased-split">
                <div class="phased-list">
                    <div class="phased-list-head">
                        <span>期次列表</span>
                        <button class="btn btn-outline btn-sm" onclick="addPhase()">+ 新增</button>
                    </div>
                    <div class="phased-list-body">
                        ${pc.phases.map((p, i) => renderPhaseListItem(p, i, idx)).join('')}
                    </div>
                </div>
                <div class="phased-detail">
                    ${cur ? renderPhaseDetail(cur, idx) : '<div style="padding:40px;text-align:center;color:var(--text-tertiary)">暂无期次，请点击左侧「+ 新增」添加</div>'}
                </div>
            </div>
        </div>
    </div>`;
}

function phaseStatusBadge(p) {
    const today = formatDateOnly(new Date());
    const start = p.startDate || '';
    const end = p.endDate || '';
    if (start && today < start) return '<span class="phase-status ps-upcoming">未开始</span>';
    if (end && today > end) return '<span class="phase-status ps-ended">已结束</span>';
    return '<span class="phase-status ps-active">进行中</span>';
}

function renderPhaseListItem(p, i, activeIdx) {
    const fmtDate = (d) => (d || '').slice(5, 10).replace('-', '.');
    const dateRange = `${fmtDate(p.startDate)} - ${fmtDate(p.endDate)}`;
    const cfgStatus = p.configured ? '<span class="phase-chip ok">已完成配置</span>' : '<span class="phase-chip warn">未完成配置</span>';
    return `
    <div class="phase-list-item ${i===activeIdx?'active':''}" draggable="true" onclick="selectPhase(${i})" ondragstart="startPhaseDrag(event,${i})" ondragover="event.preventDefault()" ondrop="dropPhase(event,${i})" ondragend="endPhaseDrag()">
        <div class="pli-main">
            <div class="pli-drag-handle" title="拖拽调整顺序" aria-label="拖拽调整顺序">⋮⋮</div>
            <div class="pli-content">
                <div class="pli-head">
                    <span class="pli-seq">${p.name}</span>
                    ${phaseStatusBadge(p)}
                </div>
                <div class="pli-theme">${p.theme || '未命名主题'}</div>
                <div class="pli-date">📅 ${dateRange}</div>
                <div class="pli-chips">${cfgStatus}</div>
            </div>
        </div>
        <div class="pli-actions">
            <button class="pli-ic-btn" title="复制期次" onclick="event.stopPropagation();copyPhase(${i})">⧉</button>
            <button class="pli-ic-btn danger" title="删除期次" onclick="event.stopPropagation();deletePhase(${i})">×</button>
        </div>
    </div>`;
}

function formatPaperTypeScores(paper) {
    if (paper.typeScores && paper.typeScores.length) {
        return paper.typeScores.map(t => `${t.type} ${t.score} 分`).join('，');
    }
    return paper.perScore ? `统一 ${paper.perScore} 分` : '—';
}

function paperModeBadges(paper) {
    const mode = paper.mode || '固定题目';
    const modeCls = mode === '固定题目' ? 'badge-green' : 'badge-blue';
    const strategyText = paper.randomStrategy === 'differentPerUser' || paper.randomStrategy === 'perAttempt'
        ? '每人试卷不同'
        : '';
    return `<span class="badge ${modeCls}" style="font-size:11px">${mode}</span>${strategyText ? `<span class="badge badge-yellow" style="font-size:11px;margin-left:6px">${strategyText}</span>` : ''}`;
}

function renderPhaseDetail(p, i) {
    return `
        <div class="phase-block">
        <div class="phase-block-title">1. 时间规则</div>
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 开放时间</div>
            <div class="cfg-row-control">
                <div style="display:flex;gap:8px;align-items:center">
                    <input type="date" class="form-control" value="${p.startDate}" onchange="setPhaseField(${i},'startDate',this.value)">
                    <span style="color:var(--text-tertiary)">至</span>
                    <input type="date" class="form-control" value="${p.endDate}" onchange="setPhaseField(${i},'endDate',this.value)">
                </div>
            </div>
        </div>
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 答题时段</div>
            <div class="cfg-row-control">
                <div style="display:flex;gap:12px;align-items:center;max-width:430px">
                    <input type="time" class="form-control" value="${p.dailyStart || '00:00'}" onchange="setPhaseField(${i},'dailyStart',this.value)">
                    <span style="color:var(--text-tertiary);font-weight:600">至</span>
                    <input type="time" class="form-control" value="${p.dailyEnd || '23:59'}" onchange="setPhaseField(${i},'dailyEnd',this.value)">
                </div>
                <div class="cfg-row-hint">期次开放期间内，每日 ${p.dailyStart || '00:00'} 至 ${p.dailyEnd || '23:59'} 可进入本期考试。</div>
            </div>
        </div>
        ${i > 0 ? `
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 非开放时间展示</div>
            <div class="cfg-row-control">
                <div class="radio-pills">
                    <div class="radio-pill ${p.hiddenWhenClosed?'active':''}" onclick="setPhaseField(${i},'hiddenWhenClosed',true)"><input type="radio" ${p.hiddenWhenClosed?'checked':''}>不展示不可作答</div>
                    <div class="radio-pill ${!p.hiddenWhenClosed?'active':''}" onclick="setPhaseField(${i},'hiddenWhenClosed',false)"><input type="radio" ${!p.hiddenWhenClosed?'checked':''}>展示但不可作答</div>
                </div>
                <div class="cfg-row-hint">当前期次仅在开放时间内展示并允许作答。</div>
            </div>
        </div>` : ''}
        <div class="cfg-row" style="border-bottom:none">
            <div class="cfg-row-label"><span class="req">*</span> 考试时长</div>
            <div class="cfg-row-control">
                <div class="num-input"><input type="number" value="${p.duration || 60}" min="1" onchange="setPhaseField(${i},'duration',this.value)"><span class="unit">分钟</span></div>
                <div class="cfg-row-hint">用户进入本期考试后的最长作答时间。</div>
            </div>
        </div>
    </div>

    <div class="phase-block">
        <div class="phase-block-title">2. 试卷配置</div>
        <div class="cfg-row" style="border-bottom:none">
            <div class="cfg-row-label"><span class="req">*</span> 选择试卷</div>
            <div class="cfg-row-control">
                ${p.paper ? `
                <div class="paper-source-card selected" style="cursor:default">
                    <div class="psc-title">📄 ${p.paper.name} <span style="margin-left:6px">${paperModeBadges(p.paper)}</span> <span class="badge badge-green" style="font-size:11px;margin-left:6px">${p.paper.status}</span></div>
                    <div class="psc-meta-grid">
                        <div><span class="psc-meta-lbl">题目数量：</span><span class="psc-meta-val">${p.paper.qCount} 题</span></div>
                        <div><span class="psc-meta-lbl">题型分值：</span><span class="psc-meta-val">${formatPaperTypeScores(p.paper)}</span></div>
                        <div title="试卷总分来源于所选试卷，如需调整，请前往试卷管理中编辑试卷。"><span class="psc-meta-lbl">试卷总分：</span><span class="psc-meta-val">${p.paper.total} 分</span></div>
                        <div><span class="psc-meta-lbl">题型构成：</span><span class="psc-meta-val">${p.paper.composition}</span></div>
                        <div><span class="psc-meta-lbl">适用范围：</span><span class="psc-meta-val">${p.paper.scope || '考试活动'}</span></div>
                        <div><span class="psc-meta-lbl">试卷状态：</span><span class="psc-meta-val">${p.paper.status || '启用'}</span></div>
                    </div>
                    ${p.paper.referenced ? '<div class="cfg-row-hint" style="margin-top:8px;color:var(--warning)">当前试卷已被活动引用，为保证考试数据一致性，试卷总分不支持修改。</div>' : ''}
                    <div style="margin-top:10px;display:flex;gap:8px">
                        <button class="btn btn-outline btn-sm" onclick="pickPhasePaper(${i})">更换试卷</button>
                        <button class="btn btn-ghost btn-sm" onclick="navigateTo('paper-mgmt')">查看试卷</button>
                    </div>
                </div>` : `
                <div class="paper-pick-zone" onclick="pickPhasePaper(${i})">
                    <div class="ppz-icon">+</div>
                    <div class="ppz-text">选择试卷</div>
                </div>`}
            </div>
        </div>
    </div>

    ${renderActivityPracticeConfigPanel(`exam_phase_${i}`, '练习模式', '可为本场考试同步开放题库刷题，练习成绩不计入正式考试成绩、排名或评奖。', `phase_${i}`)}

    `;
}

function renderPhaseConfigCard(p, i) {
    const canDelete = phasedConfig.phases.length > 1;
    return `
    <div class="group-card rich gc-${p.configured ? 'done' : 'empty'} phase-config-card">
        <div class="gc-stripe"></div>
        <div class="gc-body">
            <div class="gc-head-row phase-head-row">
                <span class="gc-drag" title="拖拽排序">⠿</span>
                <div class="phase-head-title-wrap">
                    <div class="phase-config-card-title">${formatPhaseCardTitle(i)}</div>
                    <div class="phase-config-card-sub">${p.theme || '设置试卷、时间和练习模式'}</div>
                </div>
                ${phaseStatusBadge(p)}
                <span class="phase-chip ${p.configured ? 'ok' : 'warn'}">${p.configured ? '已完成配置' : '未完成配置'}</span>
                <div class="phase-config-card-actions">
                    <button class="pli-ic-btn" title="复制期次" onclick="copyPhase(${i})">⧉</button>
                    <button class="pli-ic-btn danger" title="${canDelete ? '删除期次' : '至少保留 1 场考试'}" ${canDelete ? `onclick="deletePhase(${i})"` : 'disabled'}>×</button>
                </div>
            </div>
            <div class="phase-config-card-body">
                ${renderPhaseDetail(p, i)}
            </div>
        </div>
    </div>`;
}

function formatPhaseCardTitle(index) {
    const cn = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    return `第 ${cn[index] || (index + 1)} 场`;
}

// ---- phased exam mutators ----
function selectPhase(i) { phasedCurrentIdx = i; refreshFsModal(); }
function startPhaseDrag(e, i) {
    phasedDragIdx = i;
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(i));
    }
    const item = e.currentTarget;
    if (item) item.classList.add('dragging');
}
function dropPhase(e, targetIdx) {
    e.preventDefault();
    const fromIdx = phasedDragIdx;
    phasedDragIdx = -1;
    if (fromIdx < 0 || fromIdx === targetIdx) return;
    const phases = phasedConfig.phases;
    const activePhase = phases[phasedCurrentIdx];
    const [moved] = phases.splice(fromIdx, 1);
    phases.splice(targetIdx, 0, moved);
    phasedCurrentIdx = Math.max(0, phases.indexOf(activePhase));
    refreshFsModal();
}
function endPhaseDrag() {
    phasedDragIdx = -1;
    document.querySelectorAll('.phase-list-item.dragging').forEach(el => el.classList.remove('dragging'));
}
function addPhase() {
    const n = phasedConfig.phases.length + 1;
    phasedConfig.phases.push({
        name: formatPhaseCardTitle(n - 1), theme: `${formatPhaseCardTitle(n - 1)}考试`, subtitle: '',
        startDate: '2026-06-01', endDate: '2026-06-01',
        dailyStart: '09:00', dailyEnd: '18:00',
        hiddenWhenClosed: true, duration: 60, attempts: 1, scoreRule: 'highest',
        paper: null, configured: false, expanded: true
    });
    phasedCurrentIdx = phasedConfig.phases.length - 1;
    refreshFsModal();
}
function copyPhase(i) {
    const src = phasedConfig.phases[i]; if (!src) return;
    const n = phasedConfig.phases.length + 1;
    phasedConfig.phases.push({
        ...src,
        name: formatPhaseCardTitle(n - 1),
        theme: `${src.theme || src.name}（复制）`,
        startDate: '',
        endDate: '',
        configured: !!src.paper
    });
    phasedCurrentIdx = phasedConfig.phases.length - 1;
    refreshFsModal();
}
function deletePhase(i) {
    if (phasedConfig.phases.length <= 1) { alert('至少保留 1 个期次'); return; }
    phasedConfig.phases.splice(i, 1);
    phasedCurrentIdx = Math.min(phasedCurrentIdx, phasedConfig.phases.length - 1);
    refreshFsModal();
}
function setPhaseField(i, key, val) {
    const p = phasedConfig.phases[i]; if (!p) return;
    if (key === 'scoreRule' && val === 'last') val = 'highest';
    if (['duration', 'attempts', 'qualifyValue'].includes(key)) p[key] = Math.max(1, Number(val) || 1);
    else p[key] = val;
    refreshFsModal();
}
function pickPhasePaper(i) {
    paperDrawerTarget = 'phase-' + i; // phased exam paper slot
    paperDrawerOpen = true;
    refreshFsModal();
}

// ---- exam config mutators ----
function setExamPaperMode(mode) { examConfig.paperMode = mode; refreshFsModal(); }
function pickExamPaper() {
    paperDrawerTarget = -1; // -1 = fixed paper slot
    paperDrawerOpen = true;
    refreshFsModal();
}
function addExamRandomRule() {
    examConfig.randomRules.push({ source: '我的题库', bank: '图书馆知识题库', qType: '单选题', qCount: 10, perScore: 2, available: 80 });
    refreshFsModal();
}
function removeExamRandomRule(i) { examConfig.randomRules.splice(i,1); refreshFsModal(); }
function setExamRandomRuleField(i, key, val) {
    const r = examConfig.randomRules[i]; if (!r) return;
    r[key] = (key==='qCount'||key==='perScore') ? Math.max(1, Number(val)||1) : val;
    refreshFsModal();
}
function setExamField(key, val) {
    if (typeof val === 'boolean') { examConfig[key] = val; }
    else if (['duration','attempts','passScore'].indexOf(key) >= 0) { examConfig[key] = Math.max(0, Number(val)||0); }
    else { examConfig[key] = val; }
    refreshFsModal();
}
function setExamDailyTime(enabled) { examConfig.dailyTimeEnabled = enabled; refreshFsModal(); }
function normalizeDailyScoreConfig() {
    dailyScoreConfig.maxDailyAttempts = Math.max(1, Number(dailyScoreConfig.maxDailyAttempts) || 1);
    dailyScoreConfig.qualifiedScore = Math.max(0, Number(dailyScoreConfig.qualifiedScore) || 0);
    if (dailyScoreConfig.maxDailyAttempts <= 1) {
        dailyScoreConfig.dailyScoreRule = 'highest';
    }
}
function setDailyScoreField(key, val) {
    if (key === 'maxDailyAttempts') dailyScoreConfig.maxDailyAttempts = Math.max(1, Number(val) || 1);
    else if (key === 'qualifiedScore') dailyScoreConfig.qualifiedScore = Math.max(0, Number(val) || 0);
    else dailyScoreConfig[key] = val;
    normalizeDailyScoreConfig();
    refreshFsModal();
}

// ---- 连续天数奖励积分（每日答题） ----
function normalizeDailyStreakReward() {
    if (!dailyStreakReward || typeof dailyStreakReward !== 'object') {
        dailyStreakReward = { enabled: false, milestones: [] };
    }
    if (!Array.isArray(dailyStreakReward.milestones)) dailyStreakReward.milestones = [];
    dailyStreakReward.milestones = dailyStreakReward.milestones
        .map(m => ({
            days: Math.max(1, Number(m?.days) || 1),
            points: Math.max(0, Number(m?.points) || 0)
        }))
        .sort((a, b) => a.days - b.days);

    // Deduplicate by days (keep first after sort)
    const seen = new Set();
    dailyStreakReward.milestones = dailyStreakReward.milestones.filter(m => {
        if (seen.has(m.days)) return false;
        seen.add(m.days);
        return true;
    });
}

function setDailyStreakEnabled(enabled) {
    dailyStreakReward.enabled = !!enabled;
    normalizeDailyStreakReward();
    rerenderMain(); // Step 5 lives in main page
}

function addDailyStreakMilestone() {
    normalizeDailyStreakReward();
    const ms = dailyStreakReward.milestones;
    const nextDays = ms.length ? (ms[ms.length - 1].days + 1) : 2;
    ms.push({ days: nextDays, points: 0 });
    normalizeDailyStreakReward();
    rerenderMain();
}

function removeDailyStreakMilestone(idx) {
    normalizeDailyStreakReward();
    if (dailyStreakReward.milestones.length <= 1) {
        alert('至少保留 1 个奖励档位');
        return;
    }
    dailyStreakReward.milestones.splice(idx, 1);
    normalizeDailyStreakReward();
    rerenderMain();
}

function setDailyStreakMilestoneField(idx, key, val) {
    normalizeDailyStreakReward();
    const m = dailyStreakReward.milestones[idx];
    if (!m) return;
    if (key === 'days') m.days = Math.max(1, Number(val) || 1);
    else if (key === 'points') m.points = Math.max(0, Number(val) || 0);
    normalizeDailyStreakReward();
    rerenderMain();
}

// ---- Step 5 draft mapping (for demo save/preview/publish) ----
function buildQuizCreateDraft() {
    normalizeDailyStreakReward();
    const dailySourceMode = dailyQMode === 'fixed' ? 'fixed' : 'random';
    const activeDailySource = dailySourceMode === 'fixed'
        ? {
            mode: 'fixed',
            fixedConfig: {
                days: dailyFixedConfig.days.map(day => ({
                    date: day.date,
                    theme: day.theme,
                    questions: cloneDailyFixedQuestions(day.questions)
                }))
            },
            randomRules: []
        }
        : {
            mode: 'random',
            fixedConfig: { days: [] },
            randomRules: dailyRandomRules.map(rule => ({ ...rule }))
        };
    return {
        groups: (groups || []).map(g => ({
            name: g.name,
            quizMode: g.quizMode,
            quizConfigured: !!g.quizConfigured
        })),
        leaderboardRules: Object.fromEntries(Object.entries(leaderboardRuleSettings).map(([mode, setting]) => [
            mode,
            {
                title: getLeaderboardRuleConfig(mode).title,
                columns: getLeaderboardRuleConfig(mode).columns,
                displayLimit: setting.displayLimit,
                unitLeaderboard: {
                    enabled: !!setting.unitEnabled,
                    columns: ['单位名称', '参与人数'],
                    displayLimit: setting.unitDisplayLimit
                }
            }
        ])),
        scoring: {
            totalScore: quizTotalScore,
            dailySource: activeDailySource,
            dailyTime: { ...dailyTimeConfig },
            levelRules: levels.map(level => ({
                name: level.name,
                totalScore: level.totalScore,
                passScore: level.passScore,
                rules: getLevelRules(level).map(rule => ({ ...rule })),
                fixedQuestions: getLevelFixedQuestions(level).map(question => ({ ...question })),
                validation: levelQuestionMode === 'fixed'
                    ? getLevelFixedValidationState(level)
                    : getScoreValidationState(getLevelRules(level), level.totalScore)
            })),
            validation: fsQuizMode === 'level'
                ? { state: validateAllLevelScoreRules({ silent: true }) ? 'ok' : 'invalid' }
                : fsQuizMode === 'daily'
                    ? getDailySourceValidationState()
                    : getScoreValidationState(getActiveScoreRules())
        },
        rewards: {
            dailyStreak: {
                enabled: !!dailyStreakReward.enabled,
                milestones: (dailyStreakReward.milestones || []).map(m => ({ days: m.days, points: m.points }))
            }
        }
    };
}

function saveQuizCreateDraft() {
    if (!QUIZ_CREATE_DEMO_SKIP_VALIDATION_ALERTS && !(fsOpen ? validateActiveScoreRules() : validateAllScoreRules())) return;
    const draft = buildQuizCreateDraft();
    try {
        localStorage.setItem('quizCreateDraft', JSON.stringify(draft));
        alert('✅ 已保存（演示）：草稿已写入本地缓存');
    } catch (e) {
        console.error(e);
        alert('保存失败：浏览器禁用了本地缓存或容量不足');
    }
}

function previewQuizCreateDraft() {
    const draft = buildQuizCreateDraft();
    // lightweight preview for prototype
    alert('预览（演示）：\\n' + JSON.stringify(draft.rewards.dailyStreak, null, 2));
}

function publishQuizCreateDraft() {
    if (!QUIZ_CREATE_DEMO_SKIP_VALIDATION_ALERTS && !(fsOpen ? validateActiveScoreRules() : validateAllScoreRules())) return;
    const draft = buildQuizCreateDraft();
    const hasDaily = (draft.groups || []).some(g => g.quizMode === 'daily');
    if (hasDaily && draft.rewards.dailyStreak.enabled && !(draft.rewards.dailyStreak.milestones || []).length) {
        alert('请先配置至少 1 个连续天数奖励档位');
        return;
    }
    alert('🚀 发布成功（演示）：配置已就绪（未对接后端）');
}

// ---- 用户自选试卷 mutators ----
function setUserChoiceRule(key, val) {
    if (!examConfig.userChoiceRules) return;
    examConfig.userChoiceRules[key] = val;
    refreshFsModal();
}
function addUserChoicePaper() {
    const n = (examConfig.userChoicePapers || []).length + 1;
    examConfig.userChoicePapers.push({ displayName: `可选试卷 ${n}`, desc: '', paperName: '', qCount: 0, total: 0, composition: '', status: '' });
    refreshFsModal();
}
function removeUserChoicePaper(i) {
    const arr = examConfig.userChoicePapers || [];
    if (arr.length <= 1) { alert('至少保留 1 套试卷'); return; }
    arr.splice(i, 1);
    refreshFsModal();
}
function setUserChoicePaperField(i, key, val) {
    const p = (examConfig.userChoicePapers || [])[i]; if (!p) return;
    p[key] = val;
    refreshFsModal();
}
function pickUserChoicePaper(i) {
    paperDrawerTarget = i; // userChoicePapers index
    paperDrawerOpen = true;
    refreshFsModal();
}

// ---- Paper Selection Drawer (right-side slide-out) ----
const PAPER_LIBRARY = [
    { name: '2026 阅读知识竞赛正式试卷', mode: '固定题目', qCount: 50, total: 100, subjective: 0, composition: '单选 30 题，多选 10 题，判断 10 题', scope: '考试活动', referenced: true, typeScores: [{ type: '单选', score: 2 }, { type: '多选', score: 3 }, { type: '判断', score: 1 }], status: '已引用', updatedAt: '2026-05-09 10:00' },
    { name: '历史文化知识测试卷', mode: '随机抽题', randomStrategy: 'sameForAll', retakeStrategy: 'reuseFirst', qCount: 30, total: 100, subjective: 0, composition: '单选 20 题，判断 10 题', scope: '考试活动', typeScores: [{ type: '单选', score: 4 }, { type: '判断', score: 2 }], status: '已发布', updatedAt: '2026-04-28 14:00' },
    { name: '图书馆知识竞赛试卷', mode: '固定题目', qCount: 50, total: 100, subjective: 0, composition: '单选 40 题，判断 10 题', scope: '考试活动', referenced: true, typeScores: [{ type: '单选', score: 2 }, { type: '判断', score: 2 }], status: '已引用', updatedAt: '2026-05-01 09:00' },
    { name: '阅读素养测评', mode: '固定题目', qCount: 40, total: 100, subjective: 0, composition: '单选 30 题，多选 10 题', scope: '考试活动', typeScores: [{ type: '单选', score: 2 }, { type: '多选', score: 4 }], status: '已发布', updatedAt: '2026-05-05 11:00' },
    { name: '安全知识测试', mode: '随机抽题', randomStrategy: 'differentPerUser', retakeStrategy: 'newRandom', qCount: 25, total: 100, subjective: 0, composition: '单选 25 题', scope: '考试活动', typeScores: [{ type: '单选', score: 4 }], status: '停用', updatedAt: '2026-05-08 16:00' },
    { name: '华服纹样知识考试 A 卷', mode: '固定题目', qCount: 25, total: 100, subjective: 0, composition: '单选 25 题', scope: '考试活动', typeScores: [{ type: '单选', score: 4 }], status: '已发布', updatedAt: '2026-05-06 09:00' },
    { name: '古诗词知识 B 卷', mode: '随机抽题', randomStrategy: 'sameForAll', retakeStrategy: 'reuseFirst', qCount: 25, total: 100, subjective: 0, composition: '单选 25 题', scope: '考试活动', typeScores: [{ type: '单选', score: 4 }], status: '已发布', updatedAt: '2026-05-07 10:00' },
    { name: '非遗文化 D 卷', mode: '随机抽题', randomStrategy: 'differentPerUser', retakeStrategy: 'newRandom', qCount: 25, total: 100, subjective: 0, composition: '单选 25 题', scope: '考试活动', typeScores: [{ type: '单选', score: 4 }], status: '已发布', updatedAt: '2026-05-08 14:00' }
];

function closePaperDrawer() {
    paperDrawerOpen = false;
    refreshFsModal();
}

function selectPaperFromDrawer(idx) {
    const paper = PAPER_LIBRARY[idx];
    if (!paper || paper.status === '停用') { alert('仅支持选择可用状态的试卷'); return; }
    if (paperDrawerTarget === -1) {
        // Legacy fixed paper slot
        examConfig.selectedPaper = { name: paper.name, mode: paper.mode, randomStrategy: paper.randomStrategy, retakeStrategy: paper.retakeStrategy, qCount: paper.qCount, total: paper.total, subjective: paper.subjective, typeScores: paper.typeScores || [], composition: paper.composition, status: paper.status, updatedAt: paper.updatedAt };
    } else if (typeof paperDrawerTarget === 'string' && paperDrawerTarget.startsWith('phase-')) {
        // Unified phase paper slot
        const phaseIdx = parseInt(paperDrawerTarget.replace('phase-', ''), 10);
        const phase = phasedConfig.phases[phaseIdx];
        if (!phase) return;
        phase.paper = { name: paper.name, mode: paper.mode, randomStrategy: paper.randomStrategy, retakeStrategy: paper.retakeStrategy, qCount: paper.qCount, total: paper.total, typeScores: paper.typeScores || [], composition: paper.composition, scope: paper.scope || '考试活动', status: paper.status, referenced: !!paper.referenced };
        phase.configured = true;
    } else {
        // userChoicePapers slot
        const p = (examConfig.userChoicePapers || [])[paperDrawerTarget];
        if (!p) return;
        Object.assign(p, { paperName: paper.name, mode: paper.mode, randomStrategy: paper.randomStrategy, retakeStrategy: paper.retakeStrategy, qCount: paper.qCount, total: paper.total, composition: paper.composition, status: paper.status });
    }
    paperDrawerOpen = false;
    refreshFsModal();
}

function renderPaperDrawer() {
    const rows = PAPER_LIBRARY
        .map((p, i) => ({ ...p, sourceIndex: i }))
        .filter(p => p.status !== '停用')
        .map((p) => {
        return `
        <div class="pd-paper-card" onclick="selectPaperFromDrawer(${p.sourceIndex})">
            <div class="pd-paper-head">
                <div class="pd-paper-name">📄 ${p.name}</div>
                <span>${paperModeBadges(p)}</span>
            </div>
            <div class="pd-paper-meta">
                <span>题目数量：<strong>${p.qCount}</strong> 题</span>
                <span>试卷总分：<strong>${p.total}</strong> 分</span>
                <span>题型：${p.composition}</span>
            </div>
            <div class="pd-paper-foot">
                <span></span>
                <span style="color:var(--text-tertiary);font-size:11px">${p.updatedAt}</span>
            </div>
        </div>`;
    }).join('');

    return `
    <div class="pd-overlay show" onclick="closePaperDrawer()">
        <div class="pd-drawer" onclick="event.stopPropagation()">
            <div class="pd-head">
                <div>
                    <div class="pd-title">选择试卷</div>
                    <div class="pd-subtitle">从试卷库中选择一套启用状态的试卷。停用试卷不会出现在待选列表中。</div>
                </div>
                <button class="pd-close" onclick="closePaperDrawer()">✕</button>
            </div>
            <div class="pd-body">
                ${rows || '<div class="pd-empty">暂无可选试卷。请先在「试卷管理」中创建并启用试卷。</div>'}
            </div>
        </div>
    </div>`;
}

// ===============================
// DAILY MODE CONFIG (每日练习)
// ===============================
function renderDailyModeConfig() {
    normalizeDailyScoreConfig();
    const allowMultiDailyAttempts = Number(dailyScoreConfig.maxDailyAttempts) > 1;
    dailyQMode = dailyQMode === 'fixed' ? 'fixed' : 'random';
    return `
    ${renderQuizTotalScorePanel({
        title: '每日总分',
        subtitle: '请先选择本次每日答题的每日总分，再配置题目来源和抽题规则',
        label: '每日总分',
        hint: '发布后，每日总分不支持修改，请确认后再发布活动。'
    })}
    <!-- 1. 题目来源 -->
    <div class="cfg-panel" id="dailyQSource">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('dailyQSource')">
            <div class="cfg-panel-icon green">📄</div>
            <div><div class="cfg-panel-title">题目来源</div><div class="cfg-panel-subtitle">支持每日随机抽题和每日固定题目</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="daily-source-tabs">
                <div class="radio-pill ${dailyQMode === 'random' ? 'active' : ''}" onclick="selectDailyQMode('random')"><input type="radio" name="dailyQMode" ${dailyQMode === 'random' ? 'checked' : ''}>每日随机抽题</div>
                <div class="radio-pill ${dailyQMode === 'fixed' ? 'active' : ''}" onclick="selectDailyQMode('fixed')"><input type="radio" name="dailyQMode" ${dailyQMode === 'fixed' ? 'checked' : ''}>每日固定题目</div>
            </div>
            ${dailyQMode === 'fixed' ? renderDailyFixedSourceContent() : renderDailyRandomSourceContent()}
        </div>
    </div>

    ${renderActivityPracticeConfigPanel('daily', '练习模式', '每日答题可同步提供题库刷题，练习成绩不影响每日答题累计总分和达标天数。', 'after-daily-source')}

    ${dailyQMode === 'fixed' ? '' : renderDailyTimePanel()}

    <!-- 3. 参与次数 -->
    <div class="cfg-panel" id="dailyAttempts">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('dailyAttempts')">
            <div class="cfg-panel-icon green">🔄</div>
            <div><div class="cfg-panel-title">参与次数与成绩</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="dev-rule-note">
                <strong>研发规则</strong>
                <span>后台统计默认同时展示“累计总分”和“达标天数”；管理员仅需配置达标分数。</span>
            </div>
            <div class="cfg-row" data-dev-rule="daily.maxDailyAttempts 控制本区块条件渲染：<=1 时隐藏 dailyScoreRule 和 averageDaily；>1 时展示。">
                <div class="cfg-row-label"><span class="req">*</span> 每人每天最多答题次数</div>
                <div class="cfg-row-control">
                    <div class="num-input"><input type="number" value="${dailyScoreConfig.maxDailyAttempts}" min="1" onchange="setDailyScoreField('maxDailyAttempts',this.value)"><span class="unit">次</span></div>
                    <div class="cfg-row-hint">0 表示不限。</div>
                </div>
            </div>
            ${allowMultiDailyAttempts ? `
            <div class="cfg-row" data-dev-rule="仅当 maxDailyAttempts > 1 时展示；否则当天成绩直接取唯一一次答题成绩。">
                <div class="cfg-row-label">每日成绩取值</div>
                <div class="cfg-row-control">
                    <div class="radio-pills">
                        <div class="radio-pill ${dailyScoreConfig.dailyScoreRule==='highest'?'active':''}" onclick="setDailyScoreField('dailyScoreRule','highest')"><input type="radio" name="dailyScoreRule" ${dailyScoreConfig.dailyScoreRule==='highest'?'checked':''}>每日最高分</div>
                        <div class="radio-pill ${dailyScoreConfig.dailyScoreRule==='last'?'active':''}" onclick="setDailyScoreField('dailyScoreRule','last')"><input type="radio" name="dailyScoreRule" ${dailyScoreConfig.dailyScoreRule==='last'?'checked':''}>最后一次成绩</div>
                    </div>
                    <div class="cfg-row-hint">同一天多次答题时，用该规则确定当天计入总成绩的分数。</div>
                </div>
            </div>
            ` : ''}
            <div class="cfg-row" data-dev-rule="后台默认同时计算累计总分和达标天数；当天计入成绩 >= qualifiedScore 记为 1 个达标天数。">
                <div class="cfg-row-label"><span class="req">*</span> 达标分数</div>
                <div class="cfg-row-control">
                    <div class="num-input"><input type="number" value="${dailyScoreConfig.qualifiedScore}" min="0" onchange="setDailyScoreField('qualifiedScore',this.value)"><span class="unit">分</span></div>
                    <div class="cfg-row-hint">当天计入成绩达到该分数，即记为 1 个达标天数。</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 4. 默认规则 -->
    <div class="cfg-panel" id="dailyDefaultRules">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('dailyDefaultRules')">
            <div class="cfg-panel-icon purple">📋</div>
            <div><div class="cfg-panel-title">默认答题规则</div><div class="cfg-panel-subtitle">系统默认实现，管理员无需配置</div></div>
            <span class="cfg-panel-badge advanced">高级</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            ${renderDeveloperRuleList([
                '中断答题后，计时继续。',
                '超时自动交卷。',
                '不允许跳题。',
                '无答题卡。',
                '不支持提前提交。',
                '每题后展示解析：答完每题后展示正确答案和解析。',
                '展示累计成绩：展示活动期间累计成绩。',
                '完成一次“每日答题”后自动展示成绩。'
            ])}
        </div>
    </div>`;
}

function renderDailyTimeFields({ compact = false } = {}) {
    return `
        <div class="cfg-row ${compact ? 'daily-time-inline-row' : ''}">
            <div class="cfg-row-label"><span class="req">*</span> 答题开放时间</div>
            <div class="cfg-row-control">
                <div class="date-range-control">
                    <input type="date" class="form-control" value="${getDatePartFromDateTime(dailyTimeConfig.startTime)}" onchange="setDailyTimeField('startTime',this.value)">
                    <span style="color:var(--text-tertiary)">至</span>
                    <input type="date" class="form-control" value="${getDatePartFromDateTime(dailyTimeConfig.endTime)}" onchange="setDailyTimeField('endTime',this.value)">
                </div>
                <div class="cfg-row-hint">固定题目模式会根据开放日期范围生成需要配置的每日题目日期。</div>
            </div>
        </div>
        <div class="cfg-row ${compact ? 'daily-time-inline-row' : ''}">
            <div class="cfg-row-label"><span class="req">*</span> 答题时段</div>
            <div class="cfg-row-control">
                <div style="display:flex;gap:8px;align-items:center">
                    <input type="time" value="${dailyTimeConfig.dailyStart}" style="padding:6px 10px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:13px" onchange="setDailyTimeField('dailyStart',this.value)">
                    <span style="color:var(--text-tertiary)">至</span>
                    <input type="time" value="${dailyTimeConfig.dailyEnd}" style="padding:6px 10px;border:1.5px solid var(--border-color);border-radius:var(--radius-sm);font-size:13px" onchange="setDailyTimeField('dailyEnd',this.value)">
                </div>
            </div>
        </div>
        <div class="cfg-row ${compact ? 'daily-time-inline-row' : ''}">
            <div class="cfg-row-label">每题限时</div>
            <div class="cfg-row-control">
                <div style="display:flex;gap:8px;align-items:center">
                    <label class="switch" style="margin-right:8px"><input type="checkbox" ${dailyTimeConfig.timeLimitEnabled ? 'checked' : ''} onchange="setDailyTimeField('timeLimitEnabled',this.checked)"><span class="sw-slider"></span></label>
                    <div class="num-input"><input type="number" value="${dailyTimeConfig.timeLimitSeconds}" min="5" onchange="setDailyTimeField('timeLimitSeconds',this.value)"><span class="unit">秒</span></div>
                </div>
                <div class="cfg-row-hint">超时后自动进入下一题或提交当前答案。</div>
            </div>
        </div>`;
}

function renderDailyTimePanel() {
    return `
    <!-- 2. 答题时间 -->
    <div class="cfg-panel" id="dailyTime">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('dailyTime')">
            <div class="cfg-panel-icon green">⏱</div>
            <div><div class="cfg-panel-title">答题时间</div><div class="cfg-panel-subtitle">活动开放时间、答题时段、每题限时</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            ${renderDailyTimeFields()}
        </div>
    </div>`;
}

function renderDailyRandomSourceContent() {
    return `
            ${renderScoreRuleNotice(dailyRandomRules)}
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 随机抽题规则</div>
                <div class="cfg-row-control">
                    <div id="dailyRandomDrawRules">
                        ${dailyRandomRules.map((rule, idx) => renderScoreDrawRuleRow(rule, idx, 'daily', dailyRandomRules.length)).join('')}
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:8px;border-top:1px solid var(--border-color-light)">
                        <button type="button" class="btn btn-outline btn-sm" onclick="addDailyRandomRule()">+ 新增抽题规则</button>
                        <div style="font-size:12px;color:var(--text-tertiary)">已配置总分：<strong style="color:var(--primary)">${getRuleTotal(dailyRandomRules)}</strong> / ${quizTotalScore} 分</div>
                    </div>
                </div>
            </div>
    `;
}

function renderDailyFixedSourceContent() {
    normalizeDailyFixedConfig();
    return `
            ${renderDailyFixedBuilder()}
    `;
}

// ===============================
// LEVEL MODE CONFIG (答题闯关)
// ===============================
function renderLevelModeConfig() {
    return `
    ${renderLevelActivityTime()}
    ${renderQuizTotalScorePanel({
        panelId: 'levelTotalScorePanel',
        title: '每个关卡分数',
        subtitle: `为整个答题闯关活动统一设置每个关卡分数，所有关卡共用同一分值`,
        label: '每个关卡分数',
        value: Number(levels[0]?.totalScore) || 100,
        onSelect: 'setCurrentLevelTotalScore',
        hint: '该分值用于统一校验所有关卡抽题规则分值之和，活动发布后不支持修改。'
    })}
    ${renderLevelRulesConfig()}
    ${renderActivityPracticeConfigPanel('level', '练习模式', '可为整个答题闯关活动开放题库刷题，帮助用户在正式闯关前复习；练习成绩不影响通关判断和关卡成绩。', 'after-level-time')}
    <div class="cfg-panel" id="levelQuestionModePanel">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('levelQuestionModePanel')">
            <div class="cfg-panel-icon blue">🎯</div>
            <div><div class="cfg-panel-title">题目配置</div><div class="cfg-panel-subtitle">支持每个关卡随机抽题和每个关卡固定题目</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="daily-source-tabs">
                <div class="radio-pill ${levelQuestionMode === 'random' ? 'active' : ''}" onclick="selectLevelQuestionMode('random')"><input type="radio" name="levelQuestionMode" ${levelQuestionMode === 'random' ? 'checked' : ''}>每个关卡随机抽题</div>
                <div class="radio-pill ${levelQuestionMode === 'fixed' ? 'active' : ''}" onclick="selectLevelQuestionMode('fixed')"><input type="radio" name="levelQuestionMode" ${levelQuestionMode === 'fixed' ? 'checked' : ''}>每个关卡固定题目</div>
            </div>
            <div class="cfg-row-hint">切换后会自动清理另一种模式的关卡配置，保证所有关卡始终使用同一种题目来源方式。</div>
        </div>
    </div>
    <div class="level-layout">
        <!-- Left: Level List -->
        <div>
            <div class="level-list">
                <div class="level-list-head">
                    <div>
                        <div class="level-list-title">关卡列表</div>
                        <div class="level-list-subtitle">共 ${levels.length} 关</div>
                    </div>
                    <button class="level-add-btn" onclick="addLevel()" title="新增关卡">+ 新增</button>
                </div>
                ${levels.map((lv, i) => `
                    <div class="level-list-item${i === levelCurrentIdx ? ' active' : ''}" onclick="switchLevel(${i})">
                        <div class="lli-num">${i + 1}</div>
                        <div class="lli-info">
                            <div class="lli-name">${lv.name}</div>
                            <div class="lli-meta">${getLevelQuestionCount(lv)}题 / ${lv.totalScore}分</div>
                        </div>
                        <span class="lli-status ${lv.configured ? 'configured' : 'unconfigured'}">${lv.configured ? '已配置' : '未配置'}</span>
                        ${i === levelCurrentIdx ? `
                        <div class="lli-actions">
                            <button class="lli-action-btn" onclick="event.stopPropagation();copyLevel()" title="复制当前关卡">⧉</button>
                            <button class="lli-action-btn danger" onclick="event.stopPropagation();deleteLevel()" title="删除当前关卡" ${levels.length <= 1 ? 'disabled' : ''}>×</button>
                        </div>
                        ` : ''}
                    </div>
                `).join('')}
                <div class="level-list-foot">
                    <span>选中关卡后，可在卡片右侧复制或删除。</span>
                </div>
            </div>
        </div>

        <!-- Right: Level Config -->
        <div>
            ${renderLevelDetail()}
        </div>
    </div>`;
}

function renderLevelActivityTime() {
    return `
    <div class="cfg-panel level-activity-time" id="levelActivityTime">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('levelActivityTime')">
            <div class="cfg-panel-icon blue">⏱</div>
            <div>
                <div class="cfg-panel-title">闯关开放时间</div>
                <div class="cfg-panel-subtitle">设置整个答题闯关活动的开始、结束时间和每日答题时段</div>
            </div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 闯关开放时间</div>
                <div class="cfg-row-control">
                    <div class="date-range-control">
                        <input type="date" class="form-control" value="${getDatePartFromDateTime(levelConfig.startTime)}" onchange="setLevelConfigField('startTime', this.value)">
                        <span>至</span>
                        <input type="date" class="form-control" value="${getDatePartFromDateTime(levelConfig.endTime)}" onchange="setLevelConfigField('endTime', this.value)">
                    </div>
                    <div class="cfg-row-hint">用户仅可在该时间范围内进入闯关；进入后按关卡顺序解锁，无需为每关单独配置开放日期。</div>
                </div>
            </div>
            <div class="cfg-row" style="border-bottom:none">
                <div class="cfg-row-label"><span class="req">*</span> 答题时段</div>
                <div class="cfg-row-control">
                    <div class="time-range">
                        <input type="time" class="form-control" value="${levelConfig.dailyStart || '09:00'}" onchange="setLevelConfigField('dailyStart', this.value)">
                        <span>至</span>
                        <input type="time" class="form-control" value="${levelConfig.dailyEnd || '18:00'}" onchange="setLevelConfigField('dailyEnd', this.value)">
                    </div>
                    <div class="cfg-row-hint">在开放日期范围内，每天仅允许于该时段进入闯关答题。</div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderLevelDetail() {
    const lv = levels[levelCurrentIdx] || levels[0];
    const rules = getLevelRules(lv);
    const fixedQuestions = getLevelFixedQuestions(lv);
    return `
    <div class="cfg-panel" id="levelInfo">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('levelInfo')">
            <div class="cfg-panel-icon yellow">🏰</div>
            <div><div class="cfg-panel-title">关卡基础信息</div><div class="cfg-panel-subtitle">第 ${levelCurrentIdx + 1} 关</div></div>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row"><div class="cfg-row-label"><span class="req">*</span> 关卡名称</div><div class="cfg-row-control"><input class="form-control" value="${lv.name}"></div></div>
            <div class="cfg-row"><div class="cfg-row-label">关卡说明</div><div class="cfg-row-control"><textarea class="form-control" rows="2" placeholder="展示给用户的关卡介绍（选填）"></textarea></div></div>
        </div>
	    </div>

    <div class="cfg-panel" id="levelQSource">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('levelQSource')">
            <div class="cfg-panel-icon blue">📄</div>
            <div><div class="cfg-panel-title">题目来源</div><div class="cfg-panel-subtitle">${levelQuestionMode === 'fixed' ? '按关卡配置固定题目' : '按关卡配置抽题规则'}</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            ${levelQuestionMode === 'fixed' ? renderLevelFixedQuestionConfig(lv, fixedQuestions) : `
                ${renderScoreRuleNotice(rules, lv.totalScore)}
                <div class="cfg-row">
                    <div class="cfg-row-control">
                        <div id="levelDrawRules">
                            ${rules.map((rule, idx) => renderScoreDrawRuleRow(rule, idx, 'level', rules.length)).join('')}
                        </div>
                        <button class="btn btn-outline btn-sm" onclick="addLevelDrawRule()" style="margin-top:8px">+ 新增抽题规则</button>
                        <div class="info-box yellow" style="margin-top:8px">⚠ 每日答题和答题闯关仅支持标准答案题：单选题、多选题、判断题、填空题、排序题，至少配置 1 条抽题规则。</div>
                    </div>
                </div>
            `}
        </div>
    </div>

    <div class="cfg-panel" id="levelDefaultRules">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('levelDefaultRules')">
            <div class="cfg-panel-icon purple">📋</div>
            <div><div class="cfg-panel-title">默认闯关规则</div><div class="cfg-panel-subtitle">系统默认实现，管理员无需配置</div></div>
            <span class="cfg-panel-badge advanced">高级</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            ${renderDeveloperRuleList([
                '满足通关条件后，才可进入下一关。',
                '实时校验是否通关。',
                '每题后展示解析：答完每题后展示正确答案和解析。',
                '通关后，用户可以选择继续进入下一关还是返回。',
                '中断答题后继续。',
                '不允许跳题。'
            ])}
        </div>
    </div>`;
}

function renderLevelRulesConfig() {
    const lv = levels[levelCurrentIdx] || levels[0];
    return `
    <div class="cfg-panel" id="levelRules">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('levelRules')">
            <div class="cfg-panel-icon orange">🏆</div>
            <div><div class="cfg-panel-title">闯关规则</div><div class="cfg-panel-subtitle">整场答题闯关统一生效的规则配置</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="cfg-row"><div class="cfg-row-label"><span class="req">*</span> 达标分数</div><div class="cfg-row-control"><div class="num-input"><input type="number" value="${lv.passScore}" min="0" max="${lv.totalScore || 0}" onchange="setCurrentLevelField('passScore', this.value)"><span class="unit">分</span></div><div class="cfg-row-hint">不得大于当前每个关卡分数；系统默认按达标分数判断是否通关。</div></div></div>
            <div class="cfg-row"><div class="cfg-row-label">每关最多挑战次数</div><div class="cfg-row-control"><div class="num-input"><input type="number" value="0" min="0"><span class="unit">次</span></div><div class="cfg-row-hint">0 表示不限；未通关时是否可继续挑战，由这里的次数上限决定。</div></div></div>
        </div>
    </div>`;
}

function renderLevelFixedQuestionConfig(level, questions) {
    const validation = getLevelFixedValidationState(level);
    const validationClass = validation.state === 'ok' ? 'ok' : validation.state === 'over' ? 'error' : 'warn';
    return `
        <div class="cfg-row">
            <div class="cfg-row-control">
                <div class="score-rule-notice ${validationClass}" style="margin-bottom:12px">
                    <div class="score-rule-notice-head">
                        <strong>已配置总分：${validation.current} / ${validation.target || '-'} 分</strong>
                        <span>${validation.state === 'ok' ? '校验通过' : '待调整'}</span>
                    </div>
                    <p>固定题库模式下，每个关卡的题目总分必须等于该关卡分数。</p>
                    <p>${getLevelValidationMessage(validation)}</p>
                </div>
                <div class="daily-fixed-toolbar">
                    <button type="button" class="btn btn-outline btn-sm" onclick="openLevelFixedQuestionPicker()">+ 从题库选题</button>
                    <button type="button" class="btn btn-outline btn-sm" onclick="copyPreviousLevelFixedQuestions()">复制上一关题目</button>
                    <button type="button" class="btn btn-outline btn-sm" onclick="clearCurrentLevelFixedQuestions()">清空当前关卡</button>
                </div>
                <div class="info-box blue" style="margin:8px 0 12px">💡 每个关卡可配置不同固定题目；所有关卡统一使用固定题目模式，不支持与随机抽题混用。</div>
                <div class="daily-fixed-question-list">
                    ${questions.length ? questions.map((question, idx) => levelFixedQuestionRow(question, idx, questions.length)).join('') : '<div style="padding:12px;color:var(--text-tertiary);font-size:13px">当前关卡还未配置固定题目。</div>'}
                </div>
            </div>
        </div>
    `;
}

function levelFixedQuestionRow(question, idx, total) {
    return `
        <div class="daily-fixed-question-card" id="level-fixed-q-${levelCurrentIdx}-${idx}">
            <div class="daily-fixed-question-main">
                <div class="daily-fixed-question-head">
                    <span class="badge ${questionTypeBadgeClass(question.type)}">${question.type}</span>
                    <span class="daily-fixed-question-bank">${question.bank}</span>
                </div>
                <div class="daily-fixed-question-content">${question.content || '未填写题目内容'}</div>
            </div>
            <div class="daily-fixed-question-side">
                <div class="daily-fixed-question-score">
                    <label>分值</label>
                    <input type="number" value="${question.score}" min="0.5" step="0.5" onchange="setLevelFixedQuestionField(${idx},'score',this.value)">
                </div>
                <button type="button" class="lli-action-btn danger" onclick="removeLevelFixedQuestion(${idx})" title="删除本题" ${total <= 1 ? 'disabled' : ''}>×</button>
            </div>
        </div>`;
}

// ===== SHARED UTILITIES =====

function stepItem(num, label, current) {
    const cls = num === current ? 'active' : (num < current ? 'done' : '');
    return `<div class="step-item ${cls}"><div class="step-num">${num < current ? '✓' : num}</div><div class="step-label">${label}</div></div>`;
}

function toggleCfgPanel(id) {
    const panel = document.getElementById(id);
    if (panel) panel.classList.toggle('collapsed');
}

function setLevelConfigField(field, value) {
    levelConfig[field] = value;
}

function selectRadioPill(el, group) {
    const parent = el.parentElement;
    parent.querySelectorAll('.radio-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
}

function renderScoreDrawRuleRow(rule, idx, mode, total) {
    const bankOptions = ['图书馆知识题库', '历史文化题库', '非遗知识题库']
        .map(bank => `<option ${rule.bank === bank ? 'selected' : ''}>${bank}</option>`).join('');
    const subtotal = (Number(rule.count) || 0) * (Number(rule.score) || 0);
    return `
    <div class="draw-rule draw-rule-with-subtotal">
        <div><label>题库</label><select onchange="setScoreDrawRuleField('${mode}',${idx},'bank',this.value)">${bankOptions}</select></div>
        <div><label>题型</label><select onchange="setScoreDrawRuleField('${mode}',${idx},'type',this.value)">${standardAnswerQuestionTypeOptions(rule.type || '全部标准答案题')}</select></div>
        <div><label>抽题数量</label><input type="number" value="${rule.count}" min="1" onchange="setScoreDrawRuleField('${mode}',${idx},'count',this.value)"></div>
        <div><label>每题分值</label><input type="number" value="${rule.score}" min="0.5" step="0.5" onchange="setScoreDrawRuleField('${mode}',${idx},'score',this.value)"></div>
        <div><label>小计</label><div style="padding:6px 0;font-weight:600;color:var(--primary)">${subtotal} 分</div></div>
        <div><label>操作</label><button type="button" class="draw-rule-delete-btn" onclick="removeScoreDrawRule('${mode}',${idx})" title="删除本条规则" aria-label="删除本条规则" ${total <= 1 ? 'disabled' : ''}><span aria-hidden="true">🗑</span></button></div>
    </div>`;
}

function getScoreRuleList(mode) {
    return mode === 'level' ? getLevelRules() : dailyRandomRules;
}

function setScoreDrawRuleField(mode, idx, key, value) {
    const list = getScoreRuleList(mode);
    const rule = list[idx];
    if (!rule) return;
    rule[key] = (key === 'count' || key === 'score') ? Math.max(key === 'count' ? 1 : 0.5, Number(value) || (key === 'count' ? 1 : 0.5)) : value;
    refreshFsModal();
}

function removeScoreDrawRule(mode, idx) {
    const list = getScoreRuleList(mode);
    if (list.length <= 1) return;
    list.splice(idx, 1);
    refreshFsModal();
}

function addDailyRandomRule() {
    dailyRandomRules.push({ bank: '图书馆知识题库', type: '全部标准答案题', count: 10, score: 1 });
    refreshFsModal();
}

function selectDailyQMode(mode) {
    dailyQMode = mode === 'fixed' ? 'fixed' : 'random';
    if (dailyQMode === 'fixed') normalizeDailyFixedConfig();
    refreshFsModal();
}

function setDailyTimeField(key, value) {
    if (dailyQMode === 'fixed' && (key === 'startTime' || key === 'endTime')) {
        setDailyFixedTimeRangeField(key, value);
        return;
    }
    if (key === 'timeLimitEnabled') dailyTimeConfig[key] = !!value;
    else if (key === 'timeLimitSeconds') dailyTimeConfig[key] = Math.max(5, Number(value) || 30);
    else dailyTimeConfig[key] = value;
    refreshFsModal();
}

function setDailyFixedTimeRangeField(key, value) {
    const nextValue = getDatePartFromDateTime(value);
    const previous = getDatePartFromDateTime(dailyTimeConfig[key]);
    if (previous === nextValue) return;
    const nextTimeConfig = { ...dailyTimeConfig, [key]: nextValue };
    const impact = getDailyFixedTimeRangeImpact(nextTimeConfig);
    const applyChange = () => {
        dailyTimeConfig[key] = nextValue;
        dailyQMode = 'fixed';
        refreshFsModal();
    };
    if (!impact.hasImpact) {
        applyChange();
        return;
    }
    if (!impact.hasImpact) {
        applyChange();
        return;
    }
    openModal('确认修改答题开放时间', `
        <div class="info-box yellow">
            <strong>修改答题开放时间会影响已配置的每日固定题目日期计划。</strong>
            <p style="margin-top:8px">系统不会自动删除已配置题目，但保存前需要确保日期计划与新的开放日期范围一致。</p>
        </div>
        <div class="assign-batch-preview" style="margin-top:12px">
            <div class="assign-batch-preview-row"><span>新的日期范围</span><strong>${impact.rangeText}</strong></div>
            <div class="assign-batch-preview-row"><span>范围外日期</span><strong>${impact.outOfRangeText}</strong></div>
            <div class="assign-batch-preview-row"><span>缺少日期</span><strong>${impact.missingText}</strong></div>
        </div>
    `, () => {
        applyChange();
    }, { confirmText: '确认修改' });
    refreshFsModal();
}

function getDatePartFromDateTime(value) {
    if (!value) return '';
    return String(value).slice(0, 10);
}

function getDailyFixedTimeRangeImpact(nextTimeConfig) {
    const startDate = getDatePartFromDateTime(nextTimeConfig.startTime);
    const endDate = getDatePartFromDateTime(nextTimeConfig.endTime);
    if (!startDate || !endDate || endDate < startDate) {
        return { hasImpact: true, rangeText: '新的日期范围未完整或不合法', outOfRangeText: '保存前需重新检查', missingText: '保存前需重新检查' };
    }
    const expectedDates = getDateRangeList(startDate, endDate);
    const expectedSet = new Set(expectedDates);
    const plannedDates = (dailyFixedConfig.days || []).map(day => day.date).filter(Boolean);
    const plannedSet = new Set(plannedDates);
    const outOfRange = plannedDates.filter(date => !expectedSet.has(date));
    const missing = expectedDates.filter(date => !plannedSet.has(date));
    return {
        hasImpact: outOfRange.length > 0 || missing.length > 0,
        rangeText: `${formatDateLabel(startDate)} 至 ${formatDateLabel(endDate)}，共 ${expectedDates.length} 天`,
        outOfRangeText: outOfRange.length ? outOfRange.map(formatDateLabel).join('、') : '无',
        missingText: missing.length ? missing.map(formatDateLabel).join('、') : '无'
    };
}

function getDailyTimeValidationState() {
    const start = dailyTimeConfig.startTime;
    const end = dailyTimeConfig.endTime;
    const dailyStart = dailyTimeConfig.dailyStart;
    const dailyEnd = dailyTimeConfig.dailyEnd;
    const startDate = getDatePartFromDateTime(start);
    const endDate = getDatePartFromDateTime(end);
    if (!start || !end || !startDate || !endDate) {
        return { state: 'missing-time', startDate, endDate };
    }
    if (endDate < startDate) return { state: 'invalid-time-range', startDate, endDate };
    if (!dailyStart || !dailyEnd) return { state: 'missing-daily-window', startDate, endDate };
    if (dailyEnd <= dailyStart) return { state: 'invalid-daily-window', startDate, endDate };
    if (dailyTimeConfig.timeLimitEnabled && (Number(dailyTimeConfig.timeLimitSeconds) || 0) < 5) {
        return { state: 'invalid-time-limit', startDate, endDate };
    }
    return { state: 'ok', startDate, endDate };
}

function generateDailyFixedDaysFromTimeRange() {
    const timeState = getDailyTimeValidationState();
    const start = timeState.startDate;
    const end = timeState.endDate;
    const startDate = parseDateOnly(start);
    const endDate = parseDateOnly(end);
    if (timeState.state !== 'ok' || !startDate || !endDate || endDate < startDate) {
        alert('请先配置正确的答题开放时间');
        return;
    }
    const days = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateText = formatDateOnly(d);
        days.push({
            date: dateText,
            theme: buildNextDailyPlanTheme('每日答题', days.length + 1, dateText),
            questions: []
        });
    }
    dailyFixedConfig.days = days;
    dailyFixedCurrentIdx = 0;
    dailyQMode = 'fixed';
    refreshFsModal();
}

function getDefaultDailyFixedQuestion(overrides = {}) {
    return {
        id: `dfq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sourceId: '',
        content: '',
        type: '单选题',
        bank: '图书馆知识题库',
        score: 10,
        ...overrides
    };
}

function normalizeDailyFixedConfig() {
    if (!dailyFixedConfig.days.length) {
        dailyFixedConfig.days.push({
            date: '2026-06-09',
            theme: '第一天：阅读常识',
            questions: [getDefaultDailyFixedQuestion({ sourceId: 'pool-001', content: '《四库全书》是哪个皇帝下令编纂的？' })]
        });
    }
    dailyFixedCurrentIdx = Math.min(Math.max(0, dailyFixedCurrentIdx), dailyFixedConfig.days.length - 1);
    dailyFixedConfig.days.forEach(day => {
        if (!Array.isArray(day.questions)) day.questions = [];
    });
}

function cloneDailyFixedQuestions(questions) {
    return (questions || [getDefaultDailyFixedQuestion()]).map(question => ({ ...question }));
}

function getDailyFixedDayScore(day) {
    return (day.questions || []).reduce((sum, q) => sum + (Number(q.score) || 0), 0);
}

function getDailyFixedDayQuestionCount(day) {
    return (day.questions || []).length;
}

function getDailyFixedDayValidationState(day, index, timeState = getDailyTimeValidationState()) {
    const target = Number(quizTotalScore) || 0;
    if (timeState.state !== 'ok') return { ...timeState, current: 0, target, diff: 0, dayIndex: index, day };
    const expectedSet = new Set(getDateRangeList(timeState.startDate, timeState.endDate));
    const duplicate = dailyFixedConfig.days.some((item, itemIndex) => itemIndex !== index && item.date === day?.date);
    if (!day?.date || duplicate) return { state: 'duplicate-date', current: 0, target, diff: 0, dayIndex: index, day };
    if (!expectedSet.has(day.date)) return { state: 'date-out-of-range', current: 0, target, diff: 0, dayIndex: index, day };
    if (!target) return { state: 'missing-total', current: 0, target: 0, diff: 0, dayIndex: index, day };
    const current = getDailyFixedDayScore(day);
    if (!day.questions || !day.questions.length) return { state: 'missing-rules', current: 0, target, diff: target, dayIndex: index, day };
    if (current < target) return { state: 'under', current, target, diff: target - current, dayIndex: index, day };
    if (current > target) return { state: 'over', current, target, diff: current - target, dayIndex: index, day };
    return { state: 'ok', current, target, diff: 0, dayIndex: index, day };
}

function getDailyFixedValidationState() {
    normalizeDailyFixedConfig();
    const timeState = getDailyTimeValidationState();
    if (timeState.state !== 'ok') return { ...timeState, current: 0, target: Number(quizTotalScore) || 0, diff: 0, dayIndex: -1 };
    const expectedDates = getDateRangeList(timeState.startDate, timeState.endDate);
    const expectedSet = new Set(expectedDates);
    const seenDates = new Set();
    for (let i = 0; i < dailyFixedConfig.days.length; i += 1) {
        const date = dailyFixedConfig.days[i]?.date;
        if (!date || seenDates.has(date)) {
            return { state: 'duplicate-date', current: 0, target: Number(quizTotalScore) || 0, diff: 0, dayIndex: i, day: dailyFixedConfig.days[i], ...timeState };
        }
        seenDates.add(date);
        if (!expectedSet.has(date)) {
            return { state: 'date-out-of-range', current: 0, target: Number(quizTotalScore) || 0, diff: 0, dayIndex: i, day: dailyFixedConfig.days[i], ...timeState };
        }
    }
    const missingDate = expectedDates.find(date => !seenDates.has(date));
    if (missingDate) {
        return { state: 'missing-date', current: 0, target: Number(quizTotalScore) || 0, diff: 0, dayIndex: -1, missingDate, ...timeState };
    }
    const target = Number(quizTotalScore) || 0;
    if (!target) return { state: 'missing-total', current: 0, target: 0, diff: 0, dayIndex: -1 };
    for (let i = 0; i < dailyFixedConfig.days.length; i += 1) {
        const day = dailyFixedConfig.days[i];
        const dayState = getDailyFixedDayValidationState(day, i, timeState);
        if (dayState.state !== 'ok') return dayState;
    }
    return { state: 'ok', current: target, target, diff: 0, dayIndex: -1 };
}

function renderDailyFixedSummary() {
    const result = getDailyFixedValidationState();
    const days = dailyFixedConfig.days || [];
    const totalQuestions = days.reduce((sum, day) => sum + getDailyFixedDayQuestionCount(day), 0);
    const totalScore = days.reduce((sum, day) => sum + getDailyFixedDayScore(day), 0);
    const firstDate = days[0]?.date ? formatDateLabel(days[0].date) : '—';
    const lastDate = days[days.length - 1]?.date ? formatDateLabel(days[days.length - 1].date) : '—';
    const cls = result.state === 'ok' ? 'ok' : result.state === 'over' ? 'error' : 'warn';
    const labelMap = {
        'missing-time': '请先配置答题开放时间',
        'invalid-time-range': '答题开放结束时间不能早于开始时间',
        'missing-daily-window': '请先配置每日答题时段',
        'invalid-daily-window': '每日答题结束时刻必须晚于开始时刻',
        'invalid-time-limit': '每题限时不能低于 5 秒',
        'missing-date': `缺少 ${formatDateLabel(result.missingDate)} 的固定题目计划`,
        'duplicate-date': `第 ${result.dayIndex + 1} 天日期重复`,
        'date-out-of-range': `第 ${result.dayIndex + 1} 天不在开放日期范围内`
    };
    const label = result.state === 'ok'
        ? '每日题目已配置完成'
        : result.state === 'under'
            ? `第 ${result.dayIndex + 1} 天还差 ${result.diff} 分`
            : result.state === 'over'
                ? `第 ${result.dayIndex + 1} 天超出 ${result.diff} 分`
                : labelMap[result.state] || '请先配置每天的固定题目';
    return `
        <div class="daily-fixed-summary ${cls}">
            <div class="daily-fixed-summary-main">
                <div class="daily-fixed-summary-title">每日固定题目计划</div>
                <div class="daily-fixed-summary-subtitle">先配置答题开放时间，系统据此生成需要逐天配置固定题目的日期。</div>
            </div>
            <div class="daily-fixed-summary-meta">
                <div><span>日期范围</span><strong>${firstDate} - ${lastDate}</strong></div>
                <div><span>计划天数</span><strong>${days.length} 天</strong></div>
                <div><span>累计题目</span><strong>${totalQuestions} 题</strong></div>
                <div><span>累计分值</span><strong>${totalScore} 分</strong></div>
                <div><span>单日目标</span><strong>${quizTotalScore} 分</strong></div>
            </div>
            <div class="daily-fixed-summary-foot">
                <span>${label}</span>
                <span>${result.state === 'ok' ? '校验通过' : '待调整'}</span>
            </div>
        </div>`;
}

function renderDailyFixedBuilder() {
    normalizeDailyFixedConfig();
    const current = dailyFixedConfig.days[dailyFixedCurrentIdx];
    const totalQuestions = current.questions.reduce((sum, q) => sum + 1, 0);
    const totalScore = getDailyFixedDayScore(current);
    const timeValidation = getDailyTimeValidationState();
    const currentValidation = getDailyFixedDayValidationState(current, dailyFixedCurrentIdx, timeValidation);
    const currentNoticeClass = currentValidation.state === 'ok' ? 'ok' : currentValidation.state === 'over' ? 'error' : 'warn';
    const currentNoticeText = currentValidation.state === 'ok' ? '校验通过' : '待调整';
    const currentNoticeMessage = {
        'missing-time': '请先配置答题开放时间。',
        'invalid-time-range': '答题开放结束时间不能早于开始时间。',
        'missing-daily-window': '请先配置每日答题时段。',
        'invalid-daily-window': '每日答题结束时刻必须晚于开始时刻。',
        'invalid-time-limit': '每题限时不能低于 5 秒。',
        'duplicate-date': '当前日期为空或与其他日期重复，请调整日期计划。',
        'date-out-of-range': '当前日期不在答题开放日期范围内，请调整开放时间或日期计划。',
        'missing-total': '请先选择每日总分。',
        'missing-rules': '当天暂无固定题目，请从题库选题或复制上一天题目。',
        under: `当前日期还差 ${currentValidation.diff} 分，请补充题目或调整分值。`,
        over: `当前日期已超出 ${currentValidation.diff} 分，请调整题目数量或每题分值。`,
        ok: '当前日期的题目总分已与每日总分对齐。'
    };
    return `
        <div class="daily-plan-builder daily-fixed-builder" style="margin-top:4px">
            <div class="daily-fixed-time-card">
                <div class="daily-fixed-time-head">
                    <div>
                        <div class="daily-plan-calendar-title">答题时间</div>
                        <div class="daily-plan-calendar-subtitle">先确认活动开放日期，再生成日期计划。</div>
                    </div>
                </div>
                ${renderDailyTimeFields({ compact: true })}
            </div>
            <div class="daily-plan-calendar">
                <div class="daily-plan-calendar-head">
                    <div>
                        <div class="daily-plan-calendar-title">日期计划</div>
                        <div class="daily-plan-calendar-subtitle">共 ${dailyFixedConfig.days.length} 天</div>
                    </div>
                    <div class="daily-fixed-head-actions">
                        <button type="button" class="level-add-btn" onclick="addDailyFixedDay()">+ 日期</button>
                    </div>
                </div>
                <div class="daily-plan-days">
                    ${dailyFixedConfig.days.map((day, i) => {
                        const dayScore = getDailyFixedDayScore(day);
                        const dayValidation = getDailyFixedDayValidationState(day, i, timeValidation);
                        const stateCls = dayValidation.state === 'ok' ? 'ok' : dayValidation.state === 'over' ? 'error' : 'warn';
                        return `
                        <div class="daily-plan-day ${i === dailyFixedCurrentIdx ? 'active' : ''} ${stateCls}" role="button" tabindex="0" onclick="selectDailyFixedDay(${i})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectDailyFixedDay(${i})}">
                            <span class="dp-day-content">
                                <span class="dp-day-date">${formatDateLabel(day.date)}</span>
                                <span class="dp-day-theme">${day.theme || '未命名主题'}</span>
                                <span class="dp-day-meta">${getDailyFixedDayQuestionCount(day)} 题 · ${dayScore} / ${quizTotalScore} 分</span>
                            </span>
                            ${i === dailyFixedCurrentIdx ? `
                                <button type="button" class="dp-day-action-btn" onclick="event.stopPropagation();copyPreviousDailyFixedDay()" title="复制上一天题目" aria-label="复制上一天题目">
                                    <span aria-hidden="true">⧉</span>
                                </button>
                            ` : ''}
                        </div>`;
                    }).join('')}
                </div>
            </div>
            <div class="daily-plan-detail">
                <div class="daily-plan-detail-head">
                    <div>
                        <div class="daily-plan-detail-title">当前设置：${formatDateLabel(current.date)}</div>
                        <div class="daily-plan-detail-subtitle">${totalQuestions} 题 / ${totalScore} 分</div>
                    </div>
                    <button type="button" class="lli-action-btn danger" onclick="deleteDailyFixedDay()" title="删除当前日期" ${dailyFixedConfig.days.length <= 1 ? 'disabled' : ''}>×</button>
                </div>
                <div class="daily-plan-basic daily-fixed-basic">
                    <div><label>日期</label><input type="date" value="${current.date}" onchange="setDailyFixedDayField('date',this.value)"></div>
                    <div><label>主题名称</label><input type="text" value="${current.theme}" onchange="setDailyFixedDayField('theme',this.value)" placeholder="如：第1天：阅读常识"></div>
                </div>
                <div class="daily-fixed-toolbar">
                    <button type="button" class="btn btn-outline btn-sm" onclick="openDailyFixedQuestionPicker()">+ 添加题目</button>
                    <button type="button" class="btn btn-outline btn-sm" onclick="copyPreviousDailyFixedQuestions()">复制上一天题目</button>
                    <button type="button" class="btn btn-outline btn-sm" onclick="clearDailyFixedQuestions()">清空当天题目</button>
                </div>
                <div class="score-rule-notice ${currentNoticeClass}" style="margin-top:12px">
                    <div class="score-rule-notice-head">
                        <strong>已配置总分：${totalScore} / ${quizTotalScore || '-'} 分</strong>
                        <span>${currentNoticeText}</span>
                    </div>
                    <p>每日固定题目要求每一天的题目总分都与每日总分一致。</p>
                    <p>${currentNoticeMessage[currentValidation.state] || '请检查当前日期计划配置。'}</p>
                </div>
                <div class="daily-plan-rule-head">
                    <strong>当天固定题目</strong>
                    <button type="button" class="btn btn-outline btn-sm" onclick="openDailyFixedQuestionPicker()">+ 从题库选题</button>
                </div>
                <div class="daily-fixed-question-list">
                    ${current.questions.length
                        ? current.questions.map((question, i) => dailyFixedQuestionRow(question, i, current.questions.length)).join('')
                        : '<div class="daily-fixed-empty">当天暂无固定题目，请从题库选题或复制上一天题目。</div>'}
                </div>
            </div>
        </div>`;
}

function dailyFixedQuestionRow(question, idx, total) {
    return `
        <div class="daily-fixed-question-card" id="daily-fixed-q-${dailyFixedCurrentIdx}-${idx}">
            <div class="daily-fixed-question-main">
                <div class="daily-fixed-question-head">
                    <span class="badge ${questionTypeBadgeClass(question.type)}">${question.type}</span>
                    <span class="daily-fixed-question-bank">${question.bank}</span>
                </div>
                <div class="daily-fixed-question-content">${question.content || '未填写题目内容'}</div>
            </div>
            <div class="daily-fixed-question-side">
                <div class="daily-fixed-question-score">
                    <label>分值</label>
                    <input type="number" value="${question.score}" min="0.5" step="0.5" onchange="setDailyFixedQuestionField(${idx},'score',this.value)">
                </div>
                <button type="button" class="lli-action-btn danger" onclick="removeDailyFixedQuestion(${idx})" title="删除本题" ${total <= 1 ? 'disabled' : ''}>×</button>
            </div>
        </div>`;
}

function openDailyFixedQuestionPicker() {
    normalizeDailyFixedConfig();
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    const enabledQuestions = DAILY_FIXED_QUESTION_POOL.filter(q => q.status === '启用');
    openModal('从题库选择题目', `
        <div class="filter-bar" style="margin-bottom:12px">
          <select id="dailyFixedBankFilter" onchange="updateDailyFixedQuestionPool()"><option>全部题库</option><option>图书馆知识题库</option><option>历史文化题库</option><option>非遗知识题库</option></select>
          <select id="dailyFixedTypeFilter" onchange="updateDailyFixedQuestionPool()">${questionTypeOptions('全部题型', true)}</select>
          <input id="dailyFixedSearchInput" placeholder="搜索题目" oninput="updateDailyFixedQuestionPool()">
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">仅展示启用状态的题目，停用题目不会出现在待选列表中。当前日期：<strong>${formatDateLabel(day.date)}</strong></div>
        <div id="dailyFixedQuestionPickHint" style="font-size:12px;color:var(--primary);font-weight:600;margin-bottom:8px">已选择 0 道题</div>
        <div style="max-height:300px;overflow-y:auto" id="dailyFixedQuestionPool">
          ${enabledQuestions.map(q => `<label class="daily-fixed-pick-row">
            <input type="checkbox" class="daily-fixed-question-pick" value="${q.id}" onchange="updateDailyFixedQuestionPickHint()" style="accent-color:var(--primary)">
            <span class="badge ${questionTypeBadgeClass(q.type)}" style="flex-shrink:0">${q.type}</span>
            <span class="daily-fixed-pick-content">${q.content}</span>
            <span class="daily-fixed-pick-bank">${q.bank}</span>
          </label>`).join('')}
        </div>
    `, () => {
        const selectedIds = Array.from(document.querySelectorAll('.daily-fixed-question-pick:checked')).map(input => input.value);
        if (!selectedIds.length) {
            const hint = document.getElementById('dailyFixedQuestionPickHint');
            if (hint) {
                hint.textContent = '请至少选择 1 道题后再确认';
                hint.style.color = 'var(--danger)';
            }
            return false;
        }
        const selectedQuestions = enabledQuestions.filter(q => selectedIds.includes(q.id));
        const existed = new Set(day.questions.map(q => q.sourceId));
        selectedQuestions.forEach((q, index) => {
            if (existed.has(q.id)) return;
            day.questions.push({
                id: `dfq-${Date.now()}-${index}`,
                sourceId: q.id,
                content: q.content,
                type: q.type,
                bank: q.bank,
                score: 10
            });
        });
        refreshFsModal();
    }, { confirmText:'确认选择' });
}

function updateDailyFixedQuestionPool() {
    const bank = document.getElementById('dailyFixedBankFilter')?.value || '全部题库';
    const type = document.getElementById('dailyFixedTypeFilter')?.value || '全部题型';
    const search = document.getElementById('dailyFixedSearchInput')?.value || '';
    const rows = document.querySelectorAll('#dailyFixedQuestionPool .daily-fixed-pick-row');
    const questions = DAILY_FIXED_QUESTION_POOL.filter(q => q.status === '启用');
    rows.forEach((row, idx) => {
        const q = questions[idx];
        if (!q) return;
        let show = true;
        if (bank !== '全部题库' && q.bank !== bank) show = false;
        if (type !== '全部题型' && q.type !== type) show = false;
        if (search && !q.content.includes(search)) show = false;
        row.style.display = show ? '' : 'none';
    });
}

function updateDailyFixedQuestionPickHint() {
    const count = document.querySelectorAll('.daily-fixed-question-pick:checked').length;
    const hint = document.getElementById('dailyFixedQuestionPickHint');
    if (!hint) return;
    hint.textContent = `已选择 ${count} 道题`;
    hint.style.color = count ? 'var(--primary)' : 'var(--text-muted)';
}

function addDailyFixedDay() {
    normalizeDailyFixedConfig();
    const last = dailyFixedConfig.days[dailyFixedConfig.days.length - 1];
    const nextDate = last.date ? addDaysToDate(last.date, 1) : formatDateOnly(new Date());
    dailyFixedConfig.days.push({
        date: nextDate,
        theme: buildNextDailyPlanTheme(last.theme, dailyFixedConfig.days.length + 1, nextDate),
        questions: cloneDailyFixedQuestions(last.questions)
    });
    dailyFixedCurrentIdx = dailyFixedConfig.days.length - 1;
    dailyQMode = 'fixed';
    refreshFsModal();
}

function copyPreviousDailyFixedDay() {
    normalizeDailyFixedConfig();
    const last = dailyFixedConfig.days[dailyFixedConfig.days.length - 1];
    const nextDate = last.date ? addDaysToDate(last.date, 1) : formatDateOnly(new Date());
    dailyFixedConfig.days.push({
        date: nextDate,
        theme: buildNextDailyPlanTheme(last.theme, dailyFixedConfig.days.length + 1, nextDate),
        questions: cloneDailyFixedQuestions(last.questions)
    });
    dailyFixedCurrentIdx = dailyFixedConfig.days.length - 1;
    dailyQMode = 'fixed';
    refreshFsModal();
}

function copyPreviousDailyFixedQuestions() {
    normalizeDailyFixedConfig();
    const current = dailyFixedConfig.days[dailyFixedCurrentIdx];
    const source = dailyFixedConfig.days[dailyFixedCurrentIdx - 1] || dailyFixedConfig.days[dailyFixedConfig.days.length - 1];
    if (!current || !source) return;
    current.questions = cloneDailyFixedQuestions(source.questions);
    dailyQMode = 'fixed';
    refreshFsModal();
}

function deleteDailyFixedDay() {
    if (dailyFixedConfig.days.length <= 1) return;
    dailyFixedConfig.days.splice(dailyFixedCurrentIdx, 1);
    dailyFixedCurrentIdx = Math.min(dailyFixedCurrentIdx, dailyFixedConfig.days.length - 1);
    dailyQMode = 'fixed';
    refreshFsModal();
}

function selectDailyFixedDay(idx) {
    dailyFixedCurrentIdx = idx;
    dailyQMode = 'fixed';
    refreshFsModal();
}

function setDailyFixedDayField(key, val) {
    normalizeDailyFixedConfig();
    dailyFixedConfig.days[dailyFixedCurrentIdx][key] = val;
    dailyQMode = 'fixed';
    refreshFsModal();
}

function removeDailyFixedQuestion(idx) {
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    if (!day || day.questions.length <= 1) return;
    day.questions.splice(idx, 1);
    dailyQMode = 'fixed';
    refreshFsModal();
}

function setDailyFixedQuestionField(idx, key, val) {
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    const question = day?.questions?.[idx];
    if (!question) return;
    question[key] = key === 'score' ? Math.max(0.5, Number(val) || 0.5) : val;
    dailyQMode = 'fixed';
    refreshFsModal();
}

function clearDailyFixedQuestions() {
    normalizeDailyFixedConfig();
    dailyFixedConfig.days[dailyFixedCurrentIdx].questions = [];
    dailyQMode = 'fixed';
    refreshFsModal();
}

function openDailyFixedBatchModal() {
    const first = getDatePartFromDateTime(dailyTimeConfig.startTime) || dailyFixedConfig.days[0]?.date || '2026-06-09';
    const last = getDatePartFromDateTime(dailyTimeConfig.endTime) || dailyFixedConfig.days[dailyFixedConfig.days.length - 1]?.date || first;
    openModal('批量生成日期', `
        <div class="info-box blue">💡 默认使用上方答题开放时间的日期范围，批量生成后仅创建日期，题目需逐天单独配置。</div>
        <div class="form-group"><label>开始日期</label><input type="date" class="form-control" id="dailyFixedBatchStart" value="${first}"></div>
        <div class="form-group"><label>结束日期</label><input type="date" class="form-control" id="dailyFixedBatchEnd" value="${last}"></div>
        <div class="form-group"><label>主题前缀</label><input type="text" class="form-control" id="dailyFixedBatchTheme" value="每日答题"></div>
    `, () => {
        const start = document.getElementById('dailyFixedBatchStart')?.value;
        const end = document.getElementById('dailyFixedBatchEnd')?.value;
        const theme = document.getElementById('dailyFixedBatchTheme')?.value.trim() || '每日答题';
        const startDate = parseDateOnly(start);
        const endDate = parseDateOnly(end);
        if (!startDate || !endDate || endDate < startDate) {
            alert('请输入正确的日期范围');
            return false;
        }
        const days = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateText = formatDateOnly(d);
            const idx = days.length + 1;
            days.push({
                date: dateText,
                theme: `${theme} ${idx}`.trim(),
                questions: []
            });
        }
        dailyFixedConfig.days = days;
        dailyFixedCurrentIdx = 0;
        dailyQMode = 'fixed';
        refreshFsModal();
    }, { confirmText: '生成' });
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

function getDefaultDailyPlanRule(overrides = {}) {
    return { source: '我的题库', bank: '图书馆知识题库', type: '全部标准答案题', count: 10, score: 1, ...overrides };
}

function normalizeDailyPlanConfig() {
    if (!dailyPlanConfig.days.length) {
        dailyPlanConfig.days.push({ date: '2026-06-09', theme: '第一天：阅读常识', rules: [getDefaultDailyPlanRule()] });
    }
    dailyPlanCurrentIdx = Math.min(Math.max(0, dailyPlanCurrentIdx), dailyPlanConfig.days.length - 1);
    dailyPlanConfig.days.forEach(day => {
        if (!day.rules || !day.rules.length) day.rules = [getDefaultDailyPlanRule()];
    });
}

function renderDailyPlanBuilder() {
    normalizeDailyPlanConfig();
    const current = dailyPlanConfig.days[dailyPlanCurrentIdx];
    const totalQuestions = current.rules.reduce((sum, r) => sum + (Number(r.count) || 0), 0);
    const totalScore = current.rules.reduce((sum, r) => sum + (Number(r.count) || 0) * (Number(r.score) || 0), 0);
    dailyQMode = 'random';
    return `
        <div class="daily-plan-builder">
            <div class="daily-plan-calendar">
                <div class="daily-plan-calendar-head">
                    <div>
                        <div class="daily-plan-calendar-title">日期计划</div>
                        <div class="daily-plan-calendar-subtitle">共 ${dailyPlanConfig.days.length} 天</div>
                    </div>
                    <button type="button" class="level-add-btn" onclick="addDailyPlanRow()">+ 日期</button>
                </div>
                <div class="daily-plan-days">
                    ${dailyPlanConfig.days.map((day, i) => `
                        <div class="daily-plan-day ${i === dailyPlanCurrentIdx ? 'active' : ''}" role="button" tabindex="0" onclick="selectDailyPlanDay(${i})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectDailyPlanDay(${i})}">
                            <span class="dp-day-content">
                                <span class="dp-day-date">${formatDateLabel(day.date)}</span>
                                <span class="dp-day-theme">${day.theme || '未命名主题'}</span>
                                <span class="dp-day-meta">${(day.rules || []).length} 条规则 · ${calcDailyPlanScore(day)} 分</span>
                            </span>
                            ${i === dailyPlanCurrentIdx ? `
                                <button type="button" class="dp-day-action-btn" onclick="event.stopPropagation();copyPreviousDailyPlanRule()" title="复制上一天规则" aria-label="复制上一天规则">
                                    <span aria-hidden="true">⧉</span>
                                </button>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="daily-plan-detail">
                <div class="daily-plan-detail-head">
                    <div>
                        <div class="daily-plan-detail-title">当前设置：${formatDateLabel(current.date)}</div>
                        <div class="daily-plan-detail-subtitle">${totalQuestions} 题 / ${totalScore} 分</div>
                    </div>
                    <button type="button" class="lli-action-btn danger" onclick="deleteDailyPlanDay()" title="删除当前日期" ${dailyPlanConfig.days.length <= 1 ? 'disabled' : ''}>×</button>
                </div>
                <div class="daily-plan-basic">
                    <div><label>日期</label><input type="date" value="${current.date}" onchange="setDailyPlanDayField('date',this.value)"></div>
                    <div><label>主题名称</label><input type="text" value="${current.theme}" onchange="setDailyPlanDayField('theme',this.value)"></div>
                </div>
                <div class="daily-plan-rule-head">
                    <strong>当天抽题规则</strong>
                    <button type="button" class="btn btn-outline btn-sm" onclick="addDailyPlanRule()">+ 添加抽题规则</button>
                </div>
                <div class="daily-plan-rules">
                    ${current.rules.map((rule, i) => dailyPlanRuleHtml(rule, i, current.rules.length)).join('')}
                </div>
            </div>
        </div>`;
}

function dailyPlanRuleHtml(rule, idx, total) {
    const bankOptions = ['图书馆知识题库', '历史文化题库', '非遗知识题库'].map(v => `<option ${v === rule.bank ? 'selected' : ''}>${v}</option>`).join('');
    const typeOptions = standardAnswerQuestionTypeOptions(rule.type || '全部标准答案题');
    return `
        <div class="daily-plan-rule-card">
            <div class="daily-plan-rule-index">规则 ${idx + 1}</div>
            <div class="daily-plan-rule-grid">
                <div><label>题库</label><select onchange="setDailyPlanRuleField(${idx},'bank',this.value)">${bankOptions}</select></div>
                <div><label>题型</label><select onchange="setDailyPlanRuleField(${idx},'type',this.value)">${typeOptions}</select></div>
                <div><label>抽题数量</label><input type="number" value="${rule.count}" min="1" onchange="setDailyPlanRuleField(${idx},'count',this.value)"></div>
                <div><label>每题分值</label><input type="number" value="${rule.score}" min="0.5" step="0.5" onchange="setDailyPlanRuleField(${idx},'score',this.value)"></div>
                <button type="button" class="lli-action-btn danger" onclick="removeDailyPlanRule(${idx})" title="删除本条规则" ${total <= 1 ? 'disabled' : ''}>×</button>
            </div>
            <div class="daily-plan-rule-score">小计：<strong>${(Number(rule.count) || 0) * (Number(rule.score) || 0)}</strong> 分</div>
        </div>`;
}

function parseDateOnly(value) {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateOnly(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getDateRangeList(start, end) {
    const startDate = parseDateOnly(start);
    const endDate = parseDateOnly(end);
    if (!startDate || !endDate || endDate < startDate) return [];
    const dates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(formatDateOnly(d));
    }
    return dates;
}

function copyPreviousDailyPlanRule() {
    normalizeDailyPlanConfig();
    const last = dailyPlanConfig.days[dailyPlanConfig.days.length - 1];
    const nextDate = last.date ? addDaysToDate(last.date, 1) : formatDateOnly(new Date());
    const nextTheme = buildNextDailyPlanTheme(last.theme, dailyPlanConfig.days.length + 1, nextDate);
    dailyPlanConfig.days.push({
        date: nextDate,
        theme: nextTheme,
        rules: cloneDailyPlanRules(last.rules)
    });
    dailyPlanCurrentIdx = dailyPlanConfig.days.length - 1;
    dailyQMode = 'random';
    refreshFsModal();
}

function cloneDailyPlanRules(rules) {
    return (rules || [getDefaultDailyPlanRule()]).map(rule => ({ ...rule }));
}

function addDaysToDate(dateText, days) {
    const date = parseDateOnly(dateText);
    if (!date) return formatDateOnly(new Date());
    date.setDate(date.getDate() + days);
    return formatDateOnly(date);
}

function buildNextDailyPlanTheme(prevTheme, index, nextDate) {
    const normalized = (prevTheme || '').trim();
    const dayMatch = normalized.match(/^第(.+?)天([：:].*)$/);
    if (dayMatch) return `第${index}天${dayMatch[2] || ''}`;
    const dateMatch = normalized.match(/^\d{4}[/-]\d{2}[/-]\d{2}[：:]?(.*)$/);
    if (dateMatch) {
        const suffix = dateMatch[1].trim();
        return suffix ? `${nextDate.replace(/-/g, '/')}：${suffix}` : nextDate.replace(/-/g, '/');
    }
    return `第${index}天：${normalized || '每日答题'}`;
}

function selectDailyPlanDay(idx) { dailyPlanCurrentIdx = idx; dailyQMode = 'random'; refreshFsModal(); }
function addDailyPlanRow() {
    normalizeDailyPlanConfig();
    const last = dailyPlanConfig.days[dailyPlanConfig.days.length - 1];
    const nextDate = last.date ? addDaysToDate(last.date, 1) : formatDateOnly(new Date());
    dailyPlanConfig.days.push({ date: nextDate, theme: buildNextDailyPlanTheme(last.theme, dailyPlanConfig.days.length + 1, nextDate), rules: [getDefaultDailyPlanRule()] });
    dailyPlanCurrentIdx = dailyPlanConfig.days.length - 1;
    dailyQMode = 'random';
    refreshFsModal();
}
function deleteDailyPlanDay() {
    if (dailyPlanConfig.days.length <= 1) return;
    dailyPlanConfig.days.splice(dailyPlanCurrentIdx, 1);
    dailyPlanCurrentIdx = Math.min(dailyPlanCurrentIdx, dailyPlanConfig.days.length - 1);
    dailyQMode = 'random';
    refreshFsModal();
}
function setDailyPlanDayField(key, val) {
    normalizeDailyPlanConfig();
    dailyPlanConfig.days[dailyPlanCurrentIdx][key] = val;
    dailyQMode = 'random';
    refreshFsModal();
}
function addDailyPlanRule() {
    normalizeDailyPlanConfig();
    dailyPlanConfig.days[dailyPlanCurrentIdx].rules.push(getDefaultDailyPlanRule({ bank: '历史文化题库', count: 5, score: 1 }));
    dailyQMode = 'random';
    refreshFsModal();
}
function removeDailyPlanRule(idx) {
    const rules = dailyPlanConfig.days[dailyPlanCurrentIdx].rules;
    if (rules.length <= 1) return;
    rules.splice(idx, 1);
    dailyQMode = 'random';
    refreshFsModal();
}
function setDailyPlanRuleField(idx, key, val) {
    const rule = dailyPlanConfig.days[dailyPlanCurrentIdx].rules[idx];
    if (!rule) return;
    rule[key] = (key === 'count' || key === 'score') ? Math.max(key === 'count' ? 1 : 0.5, Number(val) || (key === 'count' ? 1 : 0.5)) : val;
    dailyQMode = 'random';
    refreshFsModal();
}
function calcDailyPlanScore(day) {
    return (day.rules || []).reduce((sum, r) => sum + (Number(r.count) || 0) * (Number(r.score) || 0), 0);
}
function formatDateLabel(dateText) {
    return (dateText || '').replace(/-/g, '/');
}

function addLevelDrawRule() {
    const level = getCurrentLevel();
    if (!level) return;
    if (!Array.isArray(level.rules)) level.rules = [];
    level.rules.push({ bank: '图书馆知识题库', type: '全部标准答案题', count: 10, score: 1 });
    refreshFsModal();
}

function selectLevelQuestionMode(mode) {
    const nextMode = mode === 'fixed' ? 'fixed' : 'random';
    if (levelQuestionMode === nextMode) return;
    levelQuestionMode = nextMode;
    if (nextMode === 'fixed') {
        levels.forEach(level => {
            if (!Array.isArray(level.fixedQuestions)) level.fixedQuestions = [];
        });
    } else {
        levels.forEach(level => {
            if (!Array.isArray(level.rules) || !level.rules.length) {
                level.rules = [{ bank: '图书馆知识题库', type: '全部标准答案题', count: 10, score: 1 }];
            }
        });
    }
    refreshFsModal();
}

function switchLevel(idx) { levelCurrentIdx = idx; refreshFsModal(); }

function setCurrentLevelField(key, val) {
    const level = getCurrentLevel();
    if (!level) return;
    if (key === 'passScore') level[key] = Math.min(Number(level.totalScore) || 0, Math.max(0, Number(val) || 0));
    else level[key] = val;
    refreshFsModal();
}

function getDefaultLevelFixedQuestion(overrides = {}) {
    return {
        id: `lfq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sourceId: '',
        content: '',
        type: '单选题',
        bank: '图书馆知识题库',
        score: 10,
        ...overrides
    };
}

function getLevelFixedQuestionPool() {
    return DAILY_FIXED_QUESTION_POOL.filter(q => q.status === '启用');
}

function cloneLevelFixedQuestions(questions) {
    return (questions || [getDefaultLevelFixedQuestion()]).map(question => ({ ...question }));
}

function normalizeCurrentLevelFixedQuestions() {
    const level = getCurrentLevel();
    if (!level) return;
    if (!Array.isArray(level.fixedQuestions) || !level.fixedQuestions.length) {
        level.fixedQuestions = [getDefaultLevelFixedQuestion()];
    }
}

function clearCurrentLevelFixedQuestions() {
    const level = getCurrentLevel();
    if (!level) return;
    level.fixedQuestions = [getDefaultLevelFixedQuestion()];
    levelQuestionMode = 'fixed';
    refreshFsModal();
}

function copyPreviousLevelFixedQuestions() {
    const level = getCurrentLevel();
    const prev = levels[levelCurrentIdx - 1];
    if (!level || !prev || !getLevelFixedQuestions(prev).length) {
        alert('上一关暂无固定题目可复制');
        return;
    }
    level.fixedQuestions = cloneLevelFixedQuestions(prev.fixedQuestions);
    levelQuestionMode = 'fixed';
    refreshFsModal();
}

function removeLevelFixedQuestion(idx) {
    const level = getCurrentLevel();
    if (!level || !Array.isArray(level.fixedQuestions) || level.fixedQuestions.length <= 1) return;
    level.fixedQuestions.splice(idx, 1);
    levelQuestionMode = 'fixed';
    refreshFsModal();
}

function setLevelFixedQuestionField(idx, key, val) {
    const level = getCurrentLevel();
    const question = level?.fixedQuestions?.[idx];
    if (!question) return;
    question[key] = key === 'score' ? Math.max(0.5, Number(val) || 0.5) : val;
    levelQuestionMode = 'fixed';
    refreshFsModal();
}

function openLevelFixedQuestionPicker() {
    const level = getCurrentLevel();
    if (!level) return;
    const enabledQuestions = getLevelFixedQuestionPool();
    openModal('从题库选择题目', `
        <div class="filter-bar" style="margin-bottom:12px">
          <select id="levelFixedBankFilter"><option>全部题库</option><option>图书馆知识题库</option><option>历史文化题库</option><option>非遗知识题库</option></select>
          <select id="levelFixedTypeFilter">${questionTypeOptions('全部题型', true)}</select>
          <input id="levelFixedSearchInput" placeholder="搜索题目" oninput="updateLevelFixedQuestionPool()">
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">当前关卡：<strong>${level.name || `第 ${levelCurrentIdx + 1} 关`}</strong></div>
        <div id="levelFixedQuestionPickHint" style="font-size:12px;color:var(--primary);font-weight:600;margin-bottom:8px">已选择 0 道题</div>
        <div style="max-height:300px;overflow-y:auto" id="levelFixedQuestionPool">
          ${enabledQuestions.map(q => `<label class="daily-fixed-pick-row">
            <input type="checkbox" class="level-fixed-question-pick" value="${q.id}" onchange="updateLevelFixedQuestionPickHint()" style="accent-color:var(--primary)">
            <span class="badge ${questionTypeBadgeClass(q.type)}" style="flex-shrink:0">${q.type}</span>
            <span class="daily-fixed-pick-content">${q.content}</span>
            <span class="daily-fixed-pick-bank">${q.bank}</span>
          </label>`).join('')}
        </div>
    `, () => {
        const selectedIds = Array.from(document.querySelectorAll('.level-fixed-question-pick:checked')).map(input => input.value);
        if (!selectedIds.length) {
            const hint = document.getElementById('levelFixedQuestionPickHint');
            if (hint) {
                hint.textContent = '请至少选择 1 道题后再确认';
                hint.style.color = 'var(--danger)';
            }
            return false;
        }
        const selectedQuestions = enabledQuestions.filter(q => selectedIds.includes(q.id));
        const existed = new Set((level.fixedQuestions || []).map(q => q.sourceId));
        selectedQuestions.forEach((q, index) => {
            if (existed.has(q.id)) return;
            level.fixedQuestions.push({
                id: `lfq-${Date.now()}-${index}`,
                sourceId: q.id,
                content: q.content,
                type: q.type,
                bank: q.bank,
                score: 10
            });
        });
        levelQuestionMode = 'fixed';
        refreshFsModal();
    }, { confirmText:'确认选择' });
}

function updateLevelFixedQuestionPool() {
    const bank = document.getElementById('levelFixedBankFilter')?.value || '全部题库';
    const type = document.getElementById('levelFixedTypeFilter')?.value || '全部题型';
    const search = document.getElementById('levelFixedSearchInput')?.value || '';
    const questions = getLevelFixedQuestionPool();
    document.querySelectorAll('#levelFixedQuestionPool .level-fixed-question-pick').forEach((input, idx) => {
        const row = input.closest('.daily-fixed-pick-row');
        const q = questions[idx];
        if (!row || !q) return;
        let show = true;
        if (bank !== '全部题库' && q.bank !== bank) show = false;
        if (type !== '全部题型' && q.type !== type) show = false;
        if (search && !q.content.includes(search)) show = false;
        row.style.display = show ? '' : 'none';
    });
}

function updateLevelFixedQuestionPickHint() {
    const count = document.querySelectorAll('.level-fixed-question-pick:checked').length;
    const hint = document.getElementById('levelFixedQuestionPickHint');
    if (!hint) return;
    hint.textContent = `已选择 ${count} 道题`;
    hint.style.color = count ? 'var(--primary)' : 'var(--text-muted)';
}

function addLevel() {
    const n = levels.length + 1;
    const fixedQuestions = levelQuestionMode === 'fixed' ? [getDefaultLevelFixedQuestion()] : [];
    levels.push({
        name: `第${n}关`,
        questions: 0,
        totalScore: Number(levels[0]?.totalScore) || 100,
        passScore: Math.min(60, Number(levels[0]?.totalScore) || 100),
        configured: false,
        rules: [{ bank: '图书馆知识题库', type: '全部标准答案题', count: 10, score: 1 }],
        fixedQuestions
    });
    levelCurrentIdx = levels.length - 1;
    refreshFsModal();
}

function copyLevel() {
    const src = levels[levelCurrentIdx];
    const n = levels.length + 1;
    levels.push({
        ...src,
        name: `第${n}关（副本）`,
        configured: true,
        totalScore: Number(levels[0]?.totalScore) || Number(src.totalScore) || 100,
        passScore: Math.min(Number(src.passScore) || 0, Number(levels[0]?.totalScore) || Number(src.totalScore) || 100),
        rules: getLevelRules(src).map(rule => ({ ...rule })),
        fixedQuestions: levelQuestionMode === 'fixed' ? cloneLevelFixedQuestions(src.fixedQuestions) : []
    });
    levelCurrentIdx = levels.length - 1;
    refreshFsModal();
}

function deleteLevel() {
    if (levels.length <= 1) { alert('至少保留 1 个关卡'); return; }
    levels.splice(levelCurrentIdx, 1);
    levelCurrentIdx = Math.min(levelCurrentIdx, levels.length - 1);
    refreshFsModal();
}

function quizGoStep(n) {
    if (!QUIZ_CREATE_DEMO_SKIP_VALIDATION_ALERTS && n > quizStep && quizStep >= 3 && !validateAllScoreRules()) return;
    quizStep = n;
    const main = document.getElementById('mainContent');
    if (main) main.innerHTML = renderQuizActivityCreate();
}

function goBackToSelect() {
    fsPhase = 'select';
    refreshFsModal();
}

// Close group overflow menu when clicking outside of it.
if (typeof document !== 'undefined' && !window.__quizGroupMenuHandlerBound) {
    document.addEventListener('click', function (e) {
        if (groupMenuOpenIdx === -1) return;
        if (e.target.closest && (e.target.closest('.gc-menu') || e.target.closest('.gc-menu-btn'))) return;
        closeGroupMenus();
    });
    window.__quizGroupMenuHandlerBound = true;
}
