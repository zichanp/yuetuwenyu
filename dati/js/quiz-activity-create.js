/* quiz-activity-create.js — 新建答题活动配置页面 (组别+答题模式配置) */

// ===== STATE =====
let quizStep = 3;
let quizActivityMode = 'exam';
let quizActivityPublished = false;
let quizIntroMode = 'standard';
let quizIntroFreeDevice = 'desktop';
let quizIntroMobileIndependent = false;
let quizIntroMobileInherited = false;
const QUIZ_CREATE_DEMO_SKIP_VALIDATION_ALERTS = true;
let quizTotalScore = 100;
let quizActivityName = '“锦绣华服·智传千年”华服文化知识挑战赛活动';
let levelCurrentIdx = 0;
let levelQuestionMode = 'random';   // 'random' | 'fixed'
const quizNeedSignup = true;
let quizSignupStart = '';
let quizSignupEnd = '';
let quizActivityScope = 'national';
let quizActivityRegion = '';

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
let fsType = 'quiz';         // 'quiz' | 'form'
let fsGroupIdx = 0;          // which group is being configured
let fsPhase = 'select';      // 'select' (choose mode) | 'config' (edit config)
let fsQuizMode = 'exam';     // active mode inside fullscreen modal
let questionConfigFsOpen = false; // fullscreen question config modal visible inside quiz config
let questionConfigFsType = null;  // currently only 'level'
let paperDrawerOpen = false; // paper selection/config global modal
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
    exam: { scoreEnabled: true, displayLimit: 100, unitEnabled: true, unitDisplayLimit: 100 },
    daily: { scoreEnabled: true, displayLimit: 100, unitEnabled: true, unitDisplayLimit: 100 },
    level: { scoreEnabled: true, displayLimit: 100, unitEnabled: true, unitDisplayLimit: 100 }
};
let quizOrgUnits = [
    { type: '主办单位', name: '中国国际贸易学会、海南大学' },
    { type: '承办单位', name: '' },
    { type: '协办单位', name: '' },
    { type: '支持单位', name: '' }
];
let quizUnitRole = 'organizer';
let quizUnitRoleDropdownOpen = false;
const QUIZ_UNIT_ROLE_OPTIONS = [
    { key: 'organizer', label: '我是主办单位', type: '主办单位', desc: '负责活动的总体策划与组织' },
    { key: 'executor', label: '我是承办单位', type: '承办单位', desc: '负责活动的具体执行与落地' },
    { key: 'cooperator', label: '我是协办单位', type: '协办单位', desc: '协助主办或承办单位开展活动，参与部分管理和推广工作' },
    { key: 'supporter', label: '我是支持单位', type: '支持单位', desc: '提供资源或宣传支持' },
    { key: 'other', label: '其他', type: '其他', desc: '本单位是其他角色类型' }
];
const QUIZ_ACTIVITY_SCOPE_OPTIONS = [
    { key: 'national', label: '全国性活动' },
    { key: 'province', label: '省级活动' },
    { key: 'city', label: '市级活动' },
    { key: 'institution', label: '本机构活动' }
];
const QUIZ_ACTIVITY_REGION_OPTIONS = ['北京市', '上海市', '天津市', '重庆市', '浙江省', '江苏省', '广东省', '四川省', '海南省', '杭州市', '南京市', '广州市', '成都市'];

// Exam config state (demo-level singleton shared across groups for prototype)
let examFormat = 'phased-unified';
let dailyExamAdded = false;
let phasedCurrentIdx = 0;  // active phase in the left-list when examFormat === 'phased'
let phasedDragIdx = -1;    // dragged phase index when reordering the left-list
let phasedPaperDrawerTab = 'select'; // 'select' | 'create'
let phasedConfig = {
    phases: [
        {
            name: '第一场',
            theme: '在线考试',
            subtitle: '',
            startDate: '2026-06-09',
            endDate: '2026-06-09',
            dailyStart: '09:00',
            dailyEnd: '18:00',
            hiddenWhenClosed: true,
            duration: 60,
            attempts: 1,
            scoreRule: 'highest',
            allowResume: false,
            paper: null,
            configured: false,
            expanded: true
        }
    ],
};
let dailyExamCurrentIdx = 0;
let dailyExamConfig = {
    startDate: '2026-06-09',
    endDate: '2026-06-15',
    makeUpPolicy: 'void',
    duration: 60,
    dailyStart: '09:00',
    dailyEnd: '18:00',
    papers: [
        {
            date: '2026-06-09',
            name: '第1天',
            theme: '阅读常识',
            configured: false
        }
    ]
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
    qualifiedStatsEnabled: false,
    qualifiedQuestions: 30,
    qualifiedQuestionsTouched: false,
    singleWrongTerminate: false,
    allowResume: false
};
let dailyTimeConfig = {
    startTime: '2026-06-09T06:00',
    endTime: '2026-07-09T23:59',
    dailyStart: '06:00',
    dailyEnd: '23:59',
    timeLimitEnabled: true,
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
let dailyPointsConfig = {
    share: { points: '', maxDailyTimes: '' },
    streak: { days: '', points: '', rules: [{ days: '', points: '' }] },
    cumulative: { days: '', points: '', rules: [{ days: '', points: '' }] }
};
let dailyPlanCurrentIdx = 0;
let dailyPlanConfig = {
    days: [
        {
            date: '2026-06-09',
            theme: '第一天：阅读常识',
            rules: [
                { source: '我的题库', bank: '图书馆知识题库', type: '全部标准答案题', count: 10, timeLimitSeconds: 30, score: 1 },
                { source: '我的题库', bank: '历史文化题库', type: '单选题', count: 5, timeLimitSeconds: 30, score: 2 }
            ]
        }
    ]
};
let dailyFixedCurrentIdx = 0;
let dailyBatchRuleApplied = false;
let dailyBatchDraftRules = [];
let dailyFixedConfig = {
    days: []
};
let dailyBatchRuleTemplate = [
    { bank: '图书馆知识题库', type: '全部标准答案题', count: 10, timeLimitSeconds: 30, score: 1 }
];
let dailyRandomRules = [];

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

// Level data (for 趣味闯关 mode)
let levelConfig = {
    startTime: '2026-06-09T06:00',
    endTime: '2026-07-09T23:59',
    dailyStart: '09:00',
    dailyEnd: '18:00'
};
let levels = [
    { name: '第一关 阅读常识', questions: 50, timeLimitSeconds: 30, totalScore: 100, passScore: 60, passQuestions: 30, maxAttempts: 1, allowResume: false, configured: true, rules: [{ bank: '图书馆知识题库', type: '全部标准答案题', count: 50, timeLimitSeconds: 30, score: 2 }], fixedQuestions: [] },
    { name: '第二关 历史文化', questions: 50, timeLimitSeconds: 30, totalScore: 150, passScore: 90, passQuestions: 30, maxAttempts: 1, allowResume: false, configured: true, rules: [{ bank: '历史文化题库', type: '全部标准答案题', count: 50, timeLimitSeconds: 30, score: 3 }], fixedQuestions: [] },
    { name: '第三关 非遗知识', questions: 0, timeLimitSeconds: 30, totalScore: 0, passScore: 0, passQuestions: 0, maxAttempts: 1, allowResume: false, configured: false, rules: [], fixedQuestions: [] }
];

const QUIZ_MODES = [
    {
        key: 'exam', icon: '📝', title: '在线考试',
        decision: '一次性完成一场考试，提交后自动出成绩。',
        bestFor: '线上考试、知识竞赛、测评考试、统一考核',
        defaultRules: ['提交试卷后自动展示成绩', '活动结束后展示答题解析', '需人工阅卷的活动，主观题成绩由管理员点击“发布成绩”按钮后公布', '支持固定题目或随机抽题', '支持多期主题在线考试'],
        configure: ['考试形式与试卷', '答题时间'],
        color: 'var(--primary)', bgColor: 'var(--primary-light)',
        scene: '在线考试、知识竞赛、线上测评'
    },
    {
        key: 'daily', icon: '🎯', title: '每日答题',
        decision: '每天开放一次答题，适合持续参与和累计统计。',
        bestFor: '每日一答、每日学习、连续答题、21 天知识问答',
        defaultRules: ['完成一次“每日答题”后自动展示成绩', '每题后展示解析：答完每题后展示正确答案和解析', '展示累计成绩：展示活动期间累计成绩', '支持从题库随机抽题', '同一天多次答题时默认取最高分'],
        configure: ['答题开放日期', '题目来源', '每日答题规则', '默认答题规则'],
        color: 'var(--success)', bgColor: 'var(--success-light)',
        scene: '每日一答、每日练习、知识学习'
    },
    {
        key: 'level', icon: '⚔️', title: '趣味闯关',
        decision: '按关卡逐步解锁，满足过关条件后进入下一关。',
        bestFor: '关卡挑战、分阶段学习、知识闯关、互动答题',
        defaultRules: ['默认按答对题数判断过关', '关卡按顺序开放，无需配置开放日期', '每题后展示答案解析'],
        configure: ['关卡列表', '每关题目来源', '过关条件', '单关最多挑战次数'],
        color: 'var(--warning-600)', bgColor: 'var(--warning-light)',
        scene: '逐关解锁、每关配题、达标过关'
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
                <strong>${quizActivityName}</strong>
                <span class="quiz-top-badge">知识问答-${getQuizCreateModeTitle()}</span>
                <span class="quiz-top-state">未发布</span>
                ${isEdit ? '<span class="quiz-top-state">编辑活动</span>' : ''}
            </div>
            <div class="quiz-top-save"><span>✓</span> 最新保存 10:10</div>
        </div>
    </header>`;
}

function getQuizCreateModeTitle() {
    const configuredModes = groups.map(group => group.quizMode).filter(Boolean);
    const mode = quizActivityMode || configuredModes[0] || fsQuizMode || 'exam';
    const matched = QUIZ_MODES.find(item => item.key === mode);
    return matched?.title || '在线考试';
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
                <label><input type="checkbox" checked> 活动报名</label>
            </div>
        </div>
        <div class="qc-form-row">
            <label>活动范围</label>
            ${renderQuizActivityScopeRadios()}
        </div>
        ${renderQuizActivityRegionRow()}
        <div class="qc-form-row">
            <label><span class="req">*</span>单位角色</label>
            ${renderQuizUnitRoleSelect()}
        </div>
    </section>
    <section class="quiz-config-card compact">
        <div class="qc-form-row">
            <label><span class="req">*</span>报名时间</label>
            <div class="qc-field-stack">
                <div class="offline-session-date-range quiz-signup-date-range">
                    ${renderSignupTimeInput('start', quizSignupStart, '请选择开始报名时间')}
                    <span class="offline-session-date-separator">至</span>
                    ${renderSignupTimeInput('end', quizSignupEnd, '请选择截止报名时间')}
                </div>
                ${renderQuizSignupTimeHint()}
            </div>
        </div>
    </section>
    <section class="quiz-config-card org-card">
        ${renderQuizOrgUnits()}
    </section>`;
}

function renderQuizActivityScopeRadios() {
    return `
    <div class="qc-radios">
        ${QUIZ_ACTIVITY_SCOPE_OPTIONS.map(option => `
            <label><input type="radio" name="quizScope" value="${option.key}" ${quizActivityScope === option.key ? 'checked' : ''} onchange="setQuizActivityScope('${option.key}')"> ${option.label}</label>
        `).join('')}
    </div>`;
}

function renderQuizActivityRegionRow() {
    if (quizActivityScope === 'national') return '';
    return `
        <div class="qc-form-row activity-region-row">
            <label class="activity-region-label"><span class="req">*</span>活动地区<span class="qc-help" title="非全国性活动需选择活动开放地区">?</span></label>
            <div class="activity-region-picker">
                <select class="activity-region-select" aria-label="活动地区" onchange="setQuizActivityRegion(this.value)">
                    <option value="" ${quizActivityRegion ? '' : 'selected'}>请选择开放的省市</option>
                    ${QUIZ_ACTIVITY_REGION_OPTIONS.map(region => `<option value="${region}" ${quizActivityRegion === region ? 'selected' : ''}>${region}</option>`).join('')}
                </select>
                <span class="activity-region-arrow"></span>
            </div>
        </div>`;
}

function renderSignupTimeInput(which, value, placeholder) {
    const normalizedValue = getDateTimeLocalValue(value);
    return `
        <input type="datetime-local" class="form-control" value="${normalizedValue}" placeholder="${placeholder}" onchange="setQuizSignupTime('${which}', this.value)">`;
}

function renderQuizSignupTimeHint() {
    return '';
}

function renderDailyTimeConfigPanel({ context = 'modal' } = {}) {
    return `
    <div class="cfg-panel" id="dailyTimeConfig">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('dailyTimeConfig')">
            <div class="cfg-panel-icon green">⏱</div>
            <div>
                <div class="cfg-panel-title">每日答题时间配置</div>
                <div class="cfg-panel-subtitle">开放日期、每日时段</div>
            </div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            ${renderDailyTimeFields({ context })}
        </div>
    </div>`;
}

function renderDailyScoreConfigPanel() {
    normalizeDailyScoreConfig();
    return `
    <div class="cfg-panel" id="dailyScoreRules">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('dailyScoreRules')">
            <div class="cfg-panel-icon green">🔄</div>
            <div>
                <div class="cfg-panel-title">每日答题规则</div>
                <div class="cfg-panel-subtitle">每日答题次数与过程规则</div>
            </div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            ${renderDailyScoreConfigRows()}
        </div>
    </div>`;
}

function renderAttemptConsumeHelpTip(type) {
    const dailyRows = [
        ['仅进入页面未答题', '❌ 不消耗', ''],
        ['点击【开始答题】，就消耗', '✅ 消耗', ''],
        ['中途退出再回来继续', '✅ 消耗', ''],
        ['杀进程/崩溃后恢复', '✅ 消耗', ''],
        ['超时未完成', '✅ 消耗', '得分'],
        ['答完', '✅ 消耗', '没有提交，答完及止']
    ];
    const levelRows = [
        ['仅进入闯关首页', '❌ 不消耗', ''],
        ['进入关卡但未开始答题', '❌ 不消耗', ''],
        ['点击【开始答题】，就消耗', '✅ 消耗', '点击【开始答题】，就消耗'],
        ['中途退出', '✅ 消耗', ''],
        ['杀进程', '✅ 消耗', '杀进程消耗，切后台超时消耗'],
        ['切后台超时消耗', '✅ 消耗', ''],
        ['切后台回来未超时，继续闯，不消耗', '❌ 不消耗', '切后台回来未超时，继续闯，不消耗'],
        ['闯关失败/死亡', '✅ 消耗', ''],
        ['闯关成功', '✅ 消耗', '']
    ];
    const title = type === 'level' ? '同理，趣味闯关次数消耗规则' : '每日答题次数消耗规则';
    const rows = type === 'level' ? levelRows : dailyRows;
    return `
        <span class="help-tip dev-rule-help-tip" aria-label="${title}">?
            <span class="dev-rule-popover" role="tooltip">
                <strong>${title}</strong>
                <em>非面向用户，仅研发可见</em>
                <span class="dev-rule-grid dev-rule-grid-head"><b>场景</b><b>是否消耗次数</b><b>备注</b></span>
                ${rows.map(row => `<span class="dev-rule-grid"><span>${row[0]}</span><span>${row[1]}</span><span>${row[2] || '-'}</span></span>`).join('')}
            </span>
        </span>`;
}

function renderDailyScoreConfigRows() {
    normalizeDailyScoreConfig();
    return `
        ${renderDailyQuestionCountRow()}
        ${renderDailyQuestionTimeLimitRow()}
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 每人每天最多答题次数 ${renderAttemptConsumeHelpTip('daily')}</div>
            <div class="cfg-row-control">
                <div class="daily-attempt-options">
                    <label class="daily-attempt-option ${dailyScoreConfig.maxDailyAttempts !== 0 ? 'active' : ''}">
                        <input type="radio" name="dailyMaxAttemptsMode" ${dailyScoreConfig.maxDailyAttempts !== 0 ? 'checked' : ''} onchange="setDailyScoreField('maxDailyAttempts', Math.max(1, Number(document.getElementById('dailyMaxAttemptsInput')?.value) || 1))">
                        <span>指定次数</span>
                    </label>
                    <label class="daily-attempt-option ${dailyScoreConfig.maxDailyAttempts === 0 ? 'active' : ''}">
                        <input type="radio" name="dailyMaxAttemptsMode" ${dailyScoreConfig.maxDailyAttempts === 0 ? 'checked' : ''} onchange="setDailyScoreField('maxDailyAttempts',0)">
                        <span>不限制次数</span>
                    </label>
                </div>
                ${dailyScoreConfig.maxDailyAttempts !== 0 ? `
                <div class="daily-attempt-input-row">
                    <span>每人每天最多可答</span>
                    <div class="num-input"><input id="dailyMaxAttemptsInput" type="number" value="${dailyScoreConfig.maxDailyAttempts || 1}" min="1" onchange="setDailyScoreField('maxDailyAttempts',this.value)"><span class="unit">次</span></div>
                </div>` : ''}
            </div>
        </div>
        <div class="cfg-row" data-dev-rule="开启后，用户答错任意 1 题即结束本次每日答题。">
            <div class="cfg-row-label">答错一题即终止 ${fieldHelpIcon('开启后，用户答错任意一道题目，当前轮答题立即结束。')}</div>
            <div class="cfg-row-control">
                <div class="config-bool-control">
                    <label class="switch config-bool-switch" aria-label="答错一题即终止">
                        <input type="checkbox" ${dailyScoreConfig.singleWrongTerminate ? 'checked' : ''} onchange="setDailyScoreField('singleWrongTerminate', this.checked)">
                        <span class="sw-slider"></span>
                    </label>
                    <span class="config-bool-state">${dailyScoreConfig.singleWrongTerminate ? '已开启' : '未开启'}</span>
                </div>
            </div>
        </div>
        ${renderDailyQualifiedStatsPanel()}`;
}

function renderDailyQualifiedQuestionsRow() {
    const rules = dailyRandomRules.length ? dailyRandomRules : dailyBatchRuleTemplate;
    const dailyQuestionCount = getRuleQuestionCount(rules);
    const qualifiedQuestions = getDailyQualifiedQuestions(rules);
    const qualifiedError = qualifiedQuestions > dailyQuestionCount;
    return `
        <div class="cfg-row" data-dev-rule="全局达标题数；用户当日答对题数达到该数量即记为 1 个达标天数。">
            <div class="cfg-row-label"><span class="req">*</span> 达标题数</div>
            <div class="cfg-row-control">
                <div class="num-input"><input type="number" value="${qualifiedQuestions}" min="1" max="${dailyQuestionCount || 1}" step="1" onchange="setDailyScoreField('qualifiedQuestions',this.value)"><span class="unit">题</span></div>
                <div class="cfg-row-hint ${qualifiedError ? 'error-text' : ''}">${qualifiedError ? '达标题数不能超过每日题目数量' : '用户当日答对题数达到指定数量后，即视为当日达标。活动开始答题后，该配置不支持修改。'}</div>
            </div>
        </div>`;
}

function renderDailyQualifiedStatsPanel() {
    normalizeDailyQualifiedQuestionsForRules(dailyRandomRules.length ? dailyRandomRules : dailyBatchRuleTemplate, { forceDefault: !dailyScoreConfig.qualifiedQuestionsTouched });
    const enabled = dailyScoreConfig.qualifiedStatsEnabled;
    return `
        <div class="cfg-row" data-dev-rule="开启后，系统按每日达标题数统计用户达标天数；有用户答题后不可修改。">
            <div class="cfg-row-label">达标天数统计 ${fieldHelpIcon('开启后，系统按每日达标题数统计用户达标天数；一旦已有用户开始答题，为保证统计口径一致，该配置不可再修改。')}</div>
            <div class="cfg-row-control">
                <div class="config-bool-control">
                    <label class="switch config-bool-switch" aria-label="达标天数统计">
                        <input type="checkbox" ${enabled ? 'checked' : ''} onchange="setDailyScoreField('qualifiedStatsEnabled', this.checked)">
                        <span class="sw-slider"></span>
                    </label>
                    <span class="config-bool-state">${enabled ? '已开启' : '未开启'}</span>
                </div>
            </div>
        </div>
        ${enabled ? renderDailyQualifiedQuestionsRow() : ''}`;
}

function renderDailyQuestionCountRow() {
    const rules = dailyRandomRules.length ? dailyRandomRules : dailyBatchRuleTemplate;
    const dailyQuestionCount = getRuleQuestionCount(rules);
    return `
        <div class="cfg-row" data-dev-rule="全局每日题目数；与批量抽题规则的抽题数量保持同步。">
            <div class="cfg-row-label"><span class="req">*</span> 每日题目数</div>
            <div class="cfg-row-control">
                <div class="num-input"><input type="number" value="${dailyQuestionCount}" min="1" step="1" onchange="setDailyQuestionCount(this.value)"><span class="unit">题</span></div>
            </div>
        </div>`;
}

function renderDailyQuestionTimeLimitRow() {
    return `
        <div class="cfg-row" data-dev-rule="全局每题答题时限；同步应用到每日答题随机抽题规则和固定题目。">
            <div class="cfg-row-label"><span class="req">*</span> 每题答题时限</div>
            <div class="cfg-row-control">
                <div class="num-input"><input type="number" value="${getDailyQuestionTimeLimit()}" min="5" step="1" onchange="setDailyQuestionTimeLimit(this.value)"><span class="unit">秒</span></div>
            </div>
        </div>`;
}

function renderLevelTimeConfigPanel({ context = 'modal' } = {}) {
    return `
    <div class="cfg-panel" id="levelTimeConfig">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('levelTimeConfig')">
            <div class="cfg-panel-icon blue">⏱</div>
            <div>
                <div class="cfg-panel-title">趣味闯关时间配置</div>
                <div class="cfg-panel-subtitle">开放日期</div>
            </div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            ${renderLevelTimeFields({ context })}
        </div>
    </div>`;
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

function getQuizUnitRoleOption() {
    return QUIZ_UNIT_ROLE_OPTIONS.find(option => option.key === quizUnitRole) || QUIZ_UNIT_ROLE_OPTIONS[0];
}

function renderQuizUnitRoleSelect() {
    const selected = getQuizUnitRoleOption();
    return `
    <div class="quiz-unit-role-select ${quizUnitRoleDropdownOpen ? 'open' : ''}">
        <button type="button" class="quiz-unit-role-trigger" onclick="toggleQuizUnitRoleDropdown(event)">
            <span>${selected ? selected.label : '选择单位角色'}</span>
            <i></i>
        </button>
        ${quizUnitRoleDropdownOpen ? `
        <div class="quiz-unit-role-menu">
            <div class="quiz-unit-role-menu-head">
                <strong>单位角色类型</strong>
                <span>请选择本单位的角色类型</span>
            </div>
            <div class="quiz-unit-role-options">
                ${QUIZ_UNIT_ROLE_OPTIONS.map(option => `
                    <button type="button" class="quiz-unit-role-option ${option.key === quizUnitRole ? 'selected' : ''}" onclick="selectQuizUnitRole('${option.key}')">
                        <span>
                            <strong>${option.label}</strong>
                            <em>${option.desc}</em>
                        </span>
                        ${option.key === quizUnitRole ? '<b>✓</b>' : ''}
                    </button>
                `).join('')}
            </div>
        </div>` : ''}
    </div>`;
}

function toggleQuizUnitRoleDropdown(event) {
    if (event && event.stopPropagation) event.stopPropagation();
    quizUnitRoleDropdownOpen = !quizUnitRoleDropdownOpen;
    quizGoStep(1);
}

function closeQuizUnitRoleDropdown() {
    if (!quizUnitRoleDropdownOpen) return;
    quizUnitRoleDropdownOpen = false;
    quizGoStep(1);
}

function selectQuizUnitRole(role) {
    const option = QUIZ_UNIT_ROLE_OPTIONS.find(item => item.key === role);
    if (!option) return;
    quizUnitRole = option.key;
    quizUnitRoleDropdownOpen = false;
    if (quizOrgUnits[0]) quizOrgUnits[0].type = option.type;
    quizGoStep(1);
}

function setQuizSignupTime(which, value) {
    const nextValue = formatDateTimeLocalForStorage(value);
    if (which === 'start') quizSignupStart = nextValue;
    else quizSignupEnd = nextValue;
    quizGoStep(1);
}

function getCurrentQuizActivityStartTime() {
    const mode = quizActivityMode || 'exam';
    if (mode === 'daily') return dailyTimeConfig?.startTime || activityPracticeConfig.daily?.startTime || '';
    if (mode === 'level') return levelConfig?.startTime || activityPracticeConfig.level?.startTime || '';
    return examConfig?.startTime || activityPracticeConfig.exam?.startTime || '';
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
                    <button type="button" class="qc-org-delete" title="删除单位类型" aria-label="删除单位类型" onclick="deleteQuizOrgUnit(${index})"><span class="trash-icon" aria-hidden="true"></span></button>
                    <button type="button" title="拖拽排序" class="qc-org-drag">⠿</button>
                </div>
            </div>
        `).join('')}
        <button type="button" class="qc-org-add" onclick="addQuizOrgUnit()">+ 添加单位类型</button>
    </div>`;
}

function renderQuizStepIntro() {
    if (quizIntroMode === 'free') return renderQuizStepIntroFree();
    return renderQuizStepIntroStandard();
}

function renderQuizStepIntroStandard() {
    return `
    <section class="quiz-config-card intro-card">
        <div class="intro-standard-head">
            <h3>标准模式</h3>
            <button type="button" class="intro-mode-switch intro-mode-switch-static" onclick="switchQuizIntroMode('free')">⇅ 切换至自由编辑模式</button>
        </div>
        ${renderQuizIntroDeviceControls()}
        ${renderIntroEditorBlock('活动背景', '请输入活动背景')}
        ${renderIntroEditorBlock('活动对象', '请输入活动对象')}
        ${renderIntroEditorBlock('规则说明', '请输入规则说明')}
    </section>`;
}

function renderQuizStepIntroFree() {
    return `
    <section class="quiz-config-card intro-card intro-free-card">
        <div class="intro-free-head">
            <h3>自由模式</h3>
            <button type="button" class="intro-mode-switch intro-mode-switch-static" onclick="switchQuizIntroMode('standard')">⇅ 切换回标准模式</button>
        </div>
        ${renderQuizIntroDeviceControls()}
        <div class="intro-free-editor">
            <div class="intro-toolbar intro-free-toolbar">
                <span>H</span><span>B</span><span><i>I</i></span><span>U</span><span>S</span><span>✎</span><span>⌁</span><span>🔗</span><span>☷</span><span>≡</span><span>“</span><span>☺</span><span>▧</span><span>▦</span><span>▶</span><span>&gt;_</span><span>↶</span><span>↷</span>
            </div>
            <div class="intro-free-editor-body" contenteditable="true" oninput="markIntroDeviceEdited()"></div>
        </div>
    </section>`;
}

function renderQuizIntroDeviceControls() {
    const isMobile = quizIntroFreeDevice === 'mobile';
    const mobileStateText = quizIntroMobileIndependent ? '当前手机端为独立内容' : '当前手机端沿用电脑端内容';
    const inheritButtonText = quizIntroMobileInherited ? '重新沿用电脑端内容' : '沿用电脑端内容';
    return `
        <div class="intro-device-controls">
            <div class="intro-free-tabs">
                <button type="button" class="${quizIntroFreeDevice === 'desktop' ? 'active' : ''}" onclick="switchQuizIntroFreeDevice('desktop')">电脑端</button>
                <button type="button" class="${isMobile ? 'active' : ''}" onclick="switchQuizIntroFreeDevice('mobile')">手机端</button>
            </div>
            ${isMobile ? `
                <div class="intro-free-inherit">
                    <span>${mobileStateText}</span>
                    <button type="button" onclick="inheritDesktopIntroContent()">${inheritButtonText}</button>
                </div>
            ` : ''}
            <div class="intro-free-bg">
                <span>背景色</span>
                <div class="intro-free-swatches">
                    ${['#69d4e5', '#fff3ee', '#d8f6e6', '#edefff', 'linear-gradient(135deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f)'].map((color, index) => `<button type="button" class="${index === 0 ? 'active' : ''}" style="background:${color}"></button>`).join('')}
                </div>
            </div>
        </div>
        <p class="intro-free-tip">您可在下方编辑器中自由编辑活动内容，支持图文混排。<span>建议先配置电脑端活动介绍；手机端未单独设置内容时，将自动显示电脑端内容。</span></p>`;
}

function switchQuizIntroMode(mode) {
    quizIntroMode = mode === 'free' ? 'free' : 'standard';
    quizGoStep(2);
}

function switchQuizIntroFreeDevice(device) {
    quizIntroFreeDevice = device === 'mobile' ? 'mobile' : 'desktop';
    quizGoStep(2);
}

function markIntroDeviceEdited() {
    if (quizIntroFreeDevice === 'mobile') {
        quizIntroMobileIndependent = true;
        quizIntroMobileInherited = false;
    }
}

function inheritDesktopIntroContent() {
    if (quizIntroMobileIndependent && !window.confirm('重新沿用电脑端内容会覆盖当前手机端单独编辑内容，是否继续？')) return;
    quizIntroMobileIndependent = false;
    quizIntroMobileInherited = true;
    quizGoStep(2);
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
            modeTitle: '在线考试',
            title: '个人成绩排行榜',
            modalTitle: '设置排行榜规则 - 在线考试',
            summary: '当前规则：个人成绩排行榜，展示前',
            columns: ['姓名', '考试场次', '总分', '排名'],
            metric: '总分',
            sortLabel: '排序规则',
            sortText: '按得分高到低，同分按用时短优先',
            note: '适用于在线考试，按得分高到低生成个人成绩排行榜；用户端展示姓名、考试场次、总分和排名。',
            detail: '总分越高，排名越靠前；总分相同，用时越短排名越靠前。',
            nameTip: '个人成绩排行榜（姓名、考试场次、总分、排名）：按得分高到低，同分按用时短优先'
        },
        daily: {
            modeTitle: '每日答题',
            title: '个人成绩排行榜',
            modalTitle: '设置排行榜规则 - 每日答题',
            summary: '当前规则：个人成绩排行榜，展示前',
            columns: ['姓名', '答题天数', '总分', '排名'],
            metric: '总分',
            sortLabel: '排序规则',
            sortText: '排行榜按总分从高到低排序。答题活动的答题得分 = 用户每日最高分累计之和；排行榜总分 = 答题活动的答题得分 + 连续答题天数奖励分 + 累计答题天数奖励分 + 分享活动奖励分。若总分相同，则用时少的用户排名靠前。',
            note: '适用于每日答题，按用户总分生成个人成绩排行榜；用户端展示姓名、答题天数、总分和排名。',
            detail: '答题活动的答题得分 = 用户每日最高分累计之和。总分包含答题活动的答题得分、连续答题天数奖励分、累计答题天数奖励分和分享活动奖励分；总分越高，排名越靠前；总分相同，用时越少排名越靠前。',
            nameTip: '个人成绩排行榜（姓名、答题天数、总分、排名）：答题活动的答题得分 = 用户每日最高分累计之和；总分包含奖励分和分享活动奖励分；同分时用时少的用户靠前'
        },
        level: {
            modeTitle: '趣味闯关',
            title: '个人成绩排行榜',
            modalTitle: '设置排行榜规则 - 趣味闯关',
            summary: '当前规则：个人成绩排行榜，展示前',
            columns: ['姓名', '过关数', '闯关次数', '用时', '排名'],
            metric: '过关数',
            sortLabel: '排序规则',
            sortText: '按过关数，再按闯关次数，再按用时短优先',
            note: '适用于趣味闯关，按过关数、闯关次数和用时生成个人成绩排行榜；用户端展示姓名、过关数、闯关次数、用时和排名。',
            detail: '1. 过关数越多，排名越高；2. 过关数相同，闯关次数越少，排名越高；3. 若仍相同，用时越短，排名越高。',
            detailHtml: '1. 过关数越多，排名越高<br>2. 过关数相同，闯关次数越少，排名越高<br>3. 若仍相同，用时越短，排名越高',
            nameTip: '个人成绩排行榜（姓名、过关数、闯关次数、用时、排名）：按过关数，再按闯关次数，再按用时短优先'
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
        leaderboardRuleSettings[key] = { scoreEnabled: true, displayLimit: 100, unitEnabled: true, unitDisplayLimit: 100 };
    }
    if (typeof leaderboardRuleSettings[key].scoreEnabled !== 'boolean') leaderboardRuleSettings[key].scoreEnabled = true;
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
    const hasDailyMode = quizActivityMode === 'daily' || groups.some(g => (g.quizMode || quizActivityMode) === 'daily');
    const hasLevelMode = quizActivityMode === 'level' || groups.some(g => (g.quizMode || quizActivityMode) === 'level');
    return `
    ${hasDailyMode ? renderStepDailyGlobalConfigSection() : ''}
    ${hasLevelMode ? renderStepLevelGlobalConfigSection() : ''}
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
    ${hasDailyMode ? renderStepDailyPracticeSection() : ''}
    <section class="quiz-config-card">
        <h3 style="font-size:var(--font-size-md);font-weight:var(--font-weight-bold);color:var(--text-primary);margin-bottom:var(--spacing-md)">${needSignup ? '报名须知' : '参与须知'}</h3>
        <div class="qc-editor">
            <div class="qc-editor-toolbar"><button>B</button><button>I</button><button>U</button><button>🔗</button><button>🖼</button></div>
            <div contenteditable="true">请输入报名须知、参与说明和注意事项...</div>
        </div>
    </section>`;
}

function renderStepLevelGlobalConfigSection() {
    return `
    <section class="quiz-config-card level-step-global-card">
        <div class="level-step-card-head">
            <div>
                <h3>趣味闯关时间配置</h3>
                <p>开放日期、每日时段</p>
            </div>
            <span class="level-step-required">必填</span>
        </div>
        <div class="level-step-time-body">
            ${renderLevelTimeFields({ context: 'step3' })}
        </div>
    </section>`;
}

function renderStepDailyGlobalConfigSection() {
    return `
    <section class="quiz-config-card daily-step-global-card">
        ${renderDailyTimeConfigPanel({ context: 'step3' })}
        ${renderDailyScoreConfigPanel()}
    </section>`;
}

function renderStepDailyPracticeSection() {
    return `
    <section class="quiz-config-card daily-step-practice-card">
        ${renderActivityPracticeConfigPanel('daily', '是否开放刷题练习', '每日答题可同步提供题库刷题，练习成绩不影响每日答题累计总分和达标天数。', 'step3')}
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
                        <button class="active" type="button" title="居左" aria-label="居左">
                            <span class="logo-align-icon align-left" aria-hidden="true"><i></i><i></i><i></i></span>
                        </button>
                        <button type="button" title="居右" aria-label="居右">
                            <span class="logo-align-icon align-right" aria-hidden="true"><i></i><i></i><i></i></span>
                        </button>
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
                        <input placeholder="请输入点击 LOGO 后跳转的链接" aria-label="LOGO跳转链接">
                    </label>
                    <div class="logo-align-group" aria-label="LOGO位置">
                        <button class="active" type="button" title="居左" aria-label="居左">
                            <span class="logo-align-icon align-left" aria-hidden="true"><i></i><i></i><i></i></span>
                        </button>
                        <button type="button" title="居右" aria-label="居右">
                            <span class="logo-align-icon align-right" aria-hidden="true"><i></i><i></i><i></i></span>
                        </button>
                    </div>
                    <button class="logo-delete-btn" type="button" title="删除">⌫</button>
                </div>
            </div>
            <button class="add-logo">+添加 LOGO</button>
        </div>
    </section>`;
}

function renderLeaderboardNavNote(rule, setting) {
    const scoreRuleText = setting.scoreEnabled
        ? `${rule.summary} <span class="nav-hl">${setting.displayLimit}</span> 名`
        : '';
    const unitRuleText = setting.unitEnabled
        ? `${scoreRuleText ? '；' : ''}单位报名人数排行榜，展示前 ${setting.unitDisplayLimit} 名`
        : '';
    if (!scoreRuleText && !unitRuleText) {
        return `
        <span>当前未开启排行榜</span>
        <button class="nav-rule-btn" type="button" onclick="openLeaderboardRuleModal(event)">修改规则 &gt;</button>
    `;
    }
    return `
        <span>${scoreRuleText}</span>
        <span>${unitRuleText}</span>
        <button class="nav-rule-btn" type="button" onclick="openLeaderboardRuleModal(event)">修改规则 &gt;</button>
    `;
}

function renderQuizStepOtherSettings() {
    const hasDailyModeConfigured = quizActivityMode === 'daily' || groups.some(g => g.quizMode === 'daily');
    return `
    ${hasDailyModeConfigured ? renderDailyPointsConfigPanel() : ''}
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

function renderDailyPointsConfigPanel() {
    normalizeDailyPointsConfig();
    const rows = [
        {
            key: 'share',
            name: '分享奖励',
            controls: `
                <label>每次分享本活动可额外获得</label>
                <input type="number" min="0" value="${dailyPointsConfig.share.points}" onchange="setDailyPointsConfig('share','points',this.value)">
                <span>分，每人每天最多获得</span>
                <input type="number" min="1" value="${dailyPointsConfig.share.maxDailyTimes}" onchange="setDailyPointsConfig('share','maxDailyTimes',this.value)">
                <span>次</span>
            `
        },
        {
            key: 'streak',
            name: '连续答题奖励',
            hint: '连续答题天数奖励可叠加获得；若中途缺答，连续天数重新计算。',
            controls: renderDailyPointsRuleList('streak', '连续答题天数')
        },
        {
            key: 'cumulative',
            name: '累计答题奖励',
            hint: '累计答题天数奖励可叠加获得，累计天数达到多个档位时可同时获得对应积分。',
            controls: renderDailyPointsRuleList('cumulative', '累计答题天数')
        }
    ];
    return `
    <section class="quiz-config-card other-card daily-points-card">
        <h3>积分配置</h3>
        <div class="daily-points-list">
            ${rows.map(row => `
                <div class="daily-points-row">
                    <div class="daily-points-main">
                        <strong>${row.name}</strong>
                        ${row.hint ? `<span class="daily-points-help" title="${escapeAttr(row.hint)}">?</span>` : ''}
                    </div>
                    <div class="daily-points-controls">${row.controls}</div>
                </div>
            `).join('')}
        </div>
    </section>`;
}

function normalizeDailyPointsConfig() {
    ['streak', 'cumulative'].forEach(rule => {
        const config = dailyPointsConfig[rule];
        if (!config) return;
        if (!Array.isArray(config.rules) || !config.rules.length) {
            config.rules = [{ days: config.days ?? '', points: config.points ?? '' }];
        }
        config.rules = config.rules.map(item => ({
            days: normalizeOptionalNumber(item?.days, 1),
            points: normalizeOptionalNumber(item?.points, 0)
        }));
        config.days = config.rules[0].days;
        config.points = config.rules[0].points;
    });
}

function normalizeOptionalNumber(value, minValue) {
    if (value === '' || value === null || typeof value === 'undefined') return '';
    return Math.max(minValue, Number(value) || minValue);
}

function renderDailyPointsRuleList(rule, label) {
    const config = dailyPointsConfig[rule];
    const rules = config?.rules || [];
    return `
        <div class="daily-points-rule-list">
            ${rules.map((item, idx) => `
                <div class="daily-points-rule-line">
                    <label>${label}</label>
                    <input type="number" min="1" value="${item.days}" onchange="setDailyPointsRule('${rule}',${idx},'days',this.value)">
                    <span>天，奖励分数</span>
                    <input type="number" min="0" value="${item.points}" onchange="setDailyPointsRule('${rule}',${idx},'points',this.value)">
                    <span>分</span>
                    <button type="button" class="daily-rule-icon-btn" onclick="removeDailyPointsRule('${rule}',${idx})" title="删除规则" ${rules.length <= 1 ? 'disabled' : ''}>−</button>
                    <button type="button" class="daily-rule-icon-btn" onclick="addDailyPointsRule('${rule}')" title="添加规则">+</button>
                </div>
            `).join('')}
        </div>`;
}

function setDailyPointsConfig(rule, field, value) {
    if (!dailyPointsConfig[rule]) return;
    const minValue = ['days', 'count', 'maxDailyTimes'].includes(field) ? 1 : 0;
    dailyPointsConfig[rule][field] = normalizeOptionalNumber(value, minValue);
    if ((rule === 'streak' || rule === 'cumulative') && (field === 'days' || field === 'points')) {
        normalizeDailyPointsConfig();
        dailyPointsConfig[rule].rules[0][field] = dailyPointsConfig[rule][field];
    }
    rerenderMain();
}

function addDailyPointsRule(rule) {
    if (!dailyPointsConfig[rule]) return;
    normalizeDailyPointsConfig();
    const rules = dailyPointsConfig[rule].rules;
    const last = rules[rules.length - 1] || { days: 0 };
    const nextDays = last.days === '' ? '' : Math.max(1, Number(last.days) || 0) + 1;
    rules.push({ days: nextDays, points: '' });
    normalizeDailyPointsConfig();
    rerenderMain();
}

function removeDailyPointsRule(rule, idx) {
    if (!dailyPointsConfig[rule]) return;
    normalizeDailyPointsConfig();
    const rules = dailyPointsConfig[rule].rules;
    if (rules.length <= 1) {
        alert('至少保留 1 条奖励规则');
        return;
    }
    rules.splice(idx, 1);
    normalizeDailyPointsConfig();
    rerenderMain();
}

function setDailyPointsRule(rule, idx, field, value) {
    if (!dailyPointsConfig[rule]) return;
    normalizeDailyPointsConfig();
    const item = dailyPointsConfig[rule].rules[idx];
    if (!item) return;
    const minValue = field === 'days' ? 1 : 0;
    item[field] = normalizeOptionalNumber(value, minValue);
    normalizeDailyPointsConfig();
    rerenderMain();
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
        ? `${modeTitle} · ${g.quizQCount} 题${selectedMode === 'level' ? '' : ` · ${g.quizTotal} 分`} · ${g.quizAttemptsText || '-'}`
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
                    <div class="gc-menu-item" onclick="copyGroup(${i});closeGroupMenus()">⧉ 复制组别</div>
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
                    : (needSignup ? '' : '完成答题配置后即可进入下一步')}</span>
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
    fsType = 'form';
    fsGroupIdx = idx;
    fsOpen = true;
    const overlay = document.getElementById('quizFsOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.innerHTML = renderFullscreenModal();
    }
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

function setQuizActivityScope(scope) {
    if (!QUIZ_ACTIVITY_SCOPE_OPTIONS.some(option => option.key === scope)) return;
    quizActivityScope = scope;
    if (scope === 'national') quizActivityRegion = '';
    rerenderMain();
}

function setQuizActivityRegion(region) {
    quizActivityRegion = region || '';
}

function escapeAttr(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function renderLeaderboardHelpTip(lines) {
    const contentLines = (Array.isArray(lines) ? lines : [lines]).filter(Boolean);
    return `
        <span class="help-tip leaderboard-help-tip" tabindex="0" aria-label="排名规则与权重">?
            <span class="leaderboard-help-popover" role="tooltip">
                <strong>排名规则与权重</strong>
                ${contentLines.map(line => `<span>${escapeAttr(line)}</span>`).join('')}
            </span>
        </span>`;
}

function renderLeaderboardNameWithTip(name, tip) {
    return `
        <span class="leaderboard-name-tip" tabindex="0" aria-label="排行榜口径">
            ${escapeAttr(name)}
            <span class="leaderboard-name-popover" role="tooltip">
                <strong>排行榜口径</strong>
                <span>${escapeAttr(tip)}</span>
            </span>
        </span>`;
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
    questionConfigFsOpen = false;
    questionConfigFsType = null;
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

function refreshLevelQuestionConfigFullscreen() {
    if (!questionConfigFsOpen || questionConfigFsType !== 'level') {
        refreshFsModal();
        return;
    }
    const overlay = document.getElementById('levelQuestionFsOverlay');
    if (!overlay) {
        refreshSecondaryModals();
        return;
    }
    const body = overlay.querySelector('.quiz-fs-body');
    const savedScroll = body ? body.scrollTop : 0;
    overlay.outerHTML = renderLevelQuestionConfigFullscreenModal();
    const nextBody = document.querySelector('#levelQuestionFsOverlay .quiz-fs-body');
    if (nextBody) nextBody.scrollTop = savedScroll;
}

function nowStamp() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// ===== SECONDARY MODAL RENDERING =====
function renderSecondaryModals() {
    return renderDeleteGroupModal()
        + renderCopyQuizCfgModal()
        + renderSwitchModeModal()
        + renderLeaderboardRuleModal()
        + renderLevelQuestionConfigFullscreenModal();
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

function setScoreLeaderboardEnabled(checked) {
    setLeaderboardRuleSetting(getCurrentQuizModeForAppearance(), {
        scoreEnabled: !!checked
    });
    refreshSecondaryModals();
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
    const scoreCheckbox = document.getElementById('scoreLeaderboardEnabled');
    const unitCheckbox = document.getElementById('unitLeaderboardEnabled');
    const unitSelect = document.getElementById('unitLeaderboardDisplayLimit');
    if (unitSelect) setUnitLeaderboardDisplayLimit(unitSelect.value);
    setLeaderboardRuleSetting(mode, {
        scoreEnabled: scoreCheckbox ? scoreCheckbox.checked : getLeaderboardRuleSetting(mode).scoreEnabled,
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
    const unitColumns = ['单位名称', '省份', '参与人数', '排名'];
    const unitSortText = '按报名人数排（报名人数高→低）；报名人数相同，先达到该人数的单位靠前展示';
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
                        <input id="scoreLeaderboardEnabled" type="checkbox" ${setting.scoreEnabled ? 'checked' : ''} onchange="setScoreLeaderboardEnabled(this.checked)">
                        ${renderLeaderboardNameWithTip(rule.title, rule.nameTip)}
                    </label>
                    ${renderLeaderboardHelpTip(rule.sortText)}
                </div>
                <div class="leaderboard-rule-row ${setting.scoreEnabled ? '' : 'disabled'}">
                    <label>展示前</label>
                    <select class="form-control leaderboard-limit-select" id="leaderboardDisplayLimit" onchange="setLeaderboardDisplayLimit(this.value)" ${setting.scoreEnabled ? '' : 'disabled'}>
                        ${limitOptions.map(n => `<option value="${n}" ${setting.displayLimit === n ? 'selected' : ''}>${n}</option>`).join('')}
                    </select>
                    <span>名</span>
                </div>
            </div>
            <div class="leaderboard-rule-card">
                <div class="leaderboard-rule-option">
                    <label class="leaderboard-rule-check">
                        <input id="unitLeaderboardEnabled" type="checkbox" ${setting.unitEnabled ? 'checked' : ''} onchange="setUnitLeaderboardEnabled(this.checked)">
                        <span>单位报名人数排行榜</span>
                    </label>
                    ${renderLeaderboardHelpTip(unitSortText)}
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
                ${setting.scoreEnabled ? `
                <div class="leaderboard-field-group">
                    <strong>${rule.title}</strong>
                    <div class="leaderboard-field-list">${rule.columns.map(col => `<span>${col}</span>`).join('')}</div>
                </div>` : ''}
                ${setting.unitEnabled ? `
                <div class="leaderboard-field-group">
                    <strong>单位报名人数排行榜</strong>
                    <div class="leaderboard-field-list">${unitColumns.map(col => `<span>${col}</span>`).join('')}</div>
                </div>` : ''}
                ${!setting.scoreEnabled && !setting.unitEnabled ? '<div class="leaderboard-rule-desc">当前未开启排行榜，用户端不展示排行榜入口。</div>' : ''}
                ${setting.scoreEnabled ? `
                <div class="leaderboard-sort-rule">
                    <strong>${rule.title}排序：</strong>${rule.sortText}
                </div>` : ''}
                ${setting.unitEnabled ? `<div class="leaderboard-sort-rule"><strong>单位报名人数排行榜排序：</strong>${unitSortText}</div>` : ''}
                ${setting.scoreEnabled ? `<div class="leaderboard-rule-desc"><strong>适用说明：</strong>${rule.note}</div>` : ''}
                ${setting.unitEnabled ? '<div class="leaderboard-rule-desc">若活动未采集单位字段，用户端不展示该榜单。</div>' : ''}
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
    fsType = 'quiz';
    fsGroupIdx = idx;
    const g = groups[idx];
    fsQuizMode = g.quizMode || quizActivityMode;
    g.quizMode = fsQuizMode;
    fsPhase = 'config';
    questionConfigFsOpen = false;
    questionConfigFsType = null;
    fsOpen = true;
    const overlay = document.getElementById('quizFsOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.innerHTML = renderFullscreenModal();
    }
}

function closeQuizConfig() {
    fsOpen = false;
    fsType = 'quiz';
    questionConfigFsOpen = false;
    questionConfigFsType = null;
    const overlay = document.getElementById('quizFsOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.innerHTML = '';
    }
}

function renderFullscreenModal() {
    const g = groups[fsGroupIdx];
    if (fsType === 'form') return renderFormFullscreenModal(g);

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
        <div class="qfh-nav">
            <button class="qfh-back" onclick="closeQuizConfig()">‹ 返回上一级</button>
            <span class="qfh-nav-sep"></span>
            <div class="qfh-title-stack">
                <div class="qfh-nav-title">${g.name} · 试卷管理</div>
                ${headerModeInfo ? `<div class="qfh-nav-mode">${headerModeInfo}</div>` : ''}
            </div>
        </div>
        <button class="quiz-fs-close" onclick="closeQuizConfig()">✕</button>
    </div>

    <!-- Body -->
    <div class="quiz-fs-body">
        ${renderModeConfigPage()}
    </div>

    <!-- Footer -->
    <div class="quiz-fs-footer quiz-config-fs-footer">
        <button class="btn btn-ghost quiz-fs-cancel-btn" onclick="closeQuizConfig()">取消</button>
        <div class="quiz-fs-footer-actions">
            <button class="btn btn-primary" onclick="saveGroupQuizConfig()">保存并返回</button>
        </div>
    </div>
    </div>
    ${paperDrawerOpen ? renderPaperDrawer() : ''}`;
}

function openQuestionConfigFullscreen(type) {
    if (type !== 'level') return;
    questionConfigFsType = type;
    questionConfigFsOpen = true;
    refreshSecondaryModals();
    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => {
            const body = document.querySelector('#levelQuestionFsOverlay .quiz-fs-body');
            if (body) body.scrollTop = 0;
        });
    }
}

function closeQuestionConfigFullscreen() {
    questionConfigFsOpen = false;
    questionConfigFsType = null;
    refreshFsModal();
}

function saveLevelQuestionConfigAndReturn() {
    const level = getCurrentLevel();
    if (level) {
        level.configured = getLevelQuestionNoticeState(level).state === 'ok';
    }
    closeQuestionConfigFullscreen();
}

function renderLevelQuestionConfigFullscreenModal() {
    if (!questionConfigFsOpen || questionConfigFsType !== 'level') return '';
    const level = getCurrentLevel() || levels[0];
    const notice = level ? getLevelQuestionNoticeState(level) : { state: 'warn' };
    return `
    <div class="quiz-fullscreen-overlay level-question-fs-overlay" id="levelQuestionFsOverlay" onclick="event.stopPropagation()">
      <div class="quiz-fs-dialog level-question-fs-dialog" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
        <div class="quiz-fs-header level-question-fs-header">
            <div class="qfh-nav level-question-fs-titlebar">
                <div class="qfh-title-stack">
                    <div class="qfh-nav-title">${level?.name || `第 ${levelCurrentIdx + 1} 关`} 题目配置</div>
                    <div class="qfh-nav-mode">当前仅配置本关题目，可从左侧切换其他关卡继续配置。</div>
                </div>
                <span class="phase-chip ${notice.state === 'ok' ? 'ok' : 'warn'}">${notice.state === 'ok' ? '校验通过' : '待调整'}</span>
            </div>
            <button class="quiz-fs-close" onclick="closeQuestionConfigFullscreen()">✕</button>
        </div>
        <div class="quiz-fs-body level-question-fs-body">
            <div class="level-question-fs-layout">
                ${renderLevelQuestionFullscreenEditor(level)}
            </div>
        </div>
        <div class="quiz-fs-footer quiz-config-fs-footer">
            <button class="btn btn-ghost quiz-fs-cancel-btn" onclick="closeQuestionConfigFullscreen()">取消</button>
            <div class="quiz-fs-footer-actions">
                <button class="btn btn-primary" onclick="saveLevelQuestionConfigAndReturn()">保存题目配置</button>
            </div>
        </div>
      </div>
    </div>`;
}

function renderFormFullscreenModal(g) {
    return `
    <div class="quiz-fs-dialog form-fs-dialog" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
    <div class="quiz-fs-header">
        <div class="qfh-nav">
            <button class="qfh-back" onclick="closeQuizConfig()">‹ 返回上一级</button>
            <span class="qfh-nav-sep"></span>
            <div class="qfh-title-stack">
                <div class="qfh-nav-title">${g.name} · 报名表配置</div>
                <div class="qfh-nav-mode">
                    <div class="qfh-mode-inline">
                        <div class="qfh-mode-title"><span class="qfh-mode-label">用于配置：</span>报名字段、实名信息与提交规则</div>
                    </div>
                </div>
            </div>
        </div>
        <button class="quiz-fs-close" onclick="closeQuizConfig()">✕</button>
    </div>

    <div class="quiz-fs-body form-fs-body">
        ${renderFormConfigPage()}
    </div>

    <div class="quiz-fs-footer form-fs-footer">
        <div class="quiz-fs-footer-actions">
            <button class="btn btn-ghost" onclick="closeQuizConfig()">取消</button>
            <button class="btn btn-primary btn-gold-save" onclick="saveGroupFormConfig()">保存</button>
        </div>
    </div>
    </div>`;
}

function renderFormConfigPage() {
    const fieldGroups = [
        {
            title: '个人信息',
            fields: [
                ['☺', '姓名', true], ['⚥', '性别', false],
                ['⊙', '民族', false], ['▣', '身份证号', false],
                ['▤', '读者证号', false], ['▯', '手机号码', true],
                ['⊙', '电子邮箱', false], ['⊙', '微信', false],
                ['⊙', 'QQ', false], ['⊙', '收件地址', false]
            ]
        },
        {
            title: '学生相关',
            fields: [
                ['⊙', '院系', false], ['⊙', '专业', false],
                ['⊙', '年级', false], ['⊙', '班级', false],
                ['⊙', '学号', false], ['⊙', '指导老师', false],
                ['⊙', '指导老师电话', false], ['⊙', '学历', false]
            ]
        },
        {
            title: '组织信息',
            fields: [
                ['⊙', '选送单位', true], ['⊙', '职业', false],
                ['⊙', '部门', false], ['⊙', '职务', false],
                ['⊙', '职称', false], ['⊙', '工号', false],
                ['⊙', '座机号码', false]
            ]
        },
        {
            title: '自定义',
            fields: [
                ['A', '单行文字', false], ['☰', '多行文字', false],
                ['⊙', '单项选择', false], ['☑', '多项选择', false]
            ]
        }
    ];

    return `
    <div class="form-config-shell">
        <aside class="form-field-palette">
            ${fieldGroups.map(group => `
                <section class="form-field-section">
                    <h4>${group.title}</h4>
                    <div class="form-field-grid">
                        ${group.fields.map(([icon, label, active]) => `
                            <div class="form-field-chip ${active ? 'active' : ''}">
                                <span>${icon}</span>
                                <strong>${label}</strong>
                                ${active ? '<em>✓</em>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </section>
            `).join('')}
        </aside>

        <main class="form-canvas">
            <section class="form-preview-card">
                <div class="form-drag-icon">⠿</div>
                <label><span>*</span>姓名</label>
                <div class="form-preview-input filled">林月</div>
            </section>
            <section class="form-preview-card">
                <label><span>*</span>手机号</label>
                <div class="form-preview-input muted">请输入手机号</div>
            </section>
            <section class="form-preview-card selected">
                <label>选送单位</label>
                <div class="form-preview-input muted">可输入关键词搜索或手动输入单位全称</div>
                <div class="form-field-actions">
                    <span class="form-required-toggle"><i></i> 非必填</span>
                    <button title="删除">⌫</button>
                </div>
            </section>
        </main>

        <aside class="form-property-panel">
            <h3>选送单位</h3>
            <div class="form-prop-group">
                <label><span>*</span>字段标题</label>
                <div class="form-static-input">选送单位</div>
            </div>
            <div class="form-prop-group">
                <label><span>*</span>提示语</label>
                <div class="form-static-input muted">请填写提示语</div>
            </div>
            <div class="form-prop-group">
                <label><span>*</span>范围设置</label>
                <div class="form-radio-list">
                    <div><i></i>不限机构</div>
                    <div class="checked"><i></i>指定机构</div>
                    <div><i></i>指定机构类型</div>
                </div>
            </div>
            <button class="form-org-button">选择机构</button>
            <div class="form-selected-orgs">已选择 3 个机构 <a>查看 〉</a></div>
        </aside>
    </div>`;
}

function saveGroupFormConfig() {
    const g = groups[fsGroupIdx];
    g.formConfigured = true;
    g.formFieldCount = 3;
    g.formRealName = true;
    g.updatedAt = nowStamp();
    closeQuizConfig();
    rerenderMain();
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
    refreshSecondaryModals();
}

function showQuizToast(message, type = 'success') {
    if (typeof document === 'undefined') return;
    const existing = document.getElementById('quizCreateToast');
    if (existing) existing.remove();

    const colors = {
        success: { bg: 'var(--success-light)', border: 'var(--color-success-100)', color: 'var(--success-hover)', icon: '✓' },
        warning: { bg: 'var(--warning-light)', border: 'var(--color-warning-100)', color: 'var(--warning-600)', icon: '!' },
        error: { bg: 'var(--danger-light)', border: 'var(--color-error-100)', color: 'var(--danger-hover)', icon: '×' }
    };
    const c = colors[type] || colors.success;
    const toast = document.createElement('div');
    toast.id = 'quizCreateToast';
    toast.style.cssText = `
        position:fixed;top:80px;right:24px;z-index:10000;
        background:${c.bg};border:1px solid ${c.border};color:${c.color};
        padding:12px 20px;border-radius:var(--radius-lg);
        font-size:var(--font-size-sm);font-weight:600;
        box-shadow:var(--shadow-lg);
        display:flex;align-items:center;gap:8px;
        transition:all .3s ease;
    `;
    toast.innerHTML = `<span style="font-size:var(--font-size-md)">${c.icon}</span><span>${escapeHtml(message)}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function scrollToPhasePosition(index) {
    if (typeof document === 'undefined') return;
    const target = document.getElementById(`phaseConfigCard_${index}`) || document.getElementById(`phaseTab_${index}`);
    if (!target || !target.scrollIntoView) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
}

function scrollToDailyExamDate(date) {
    if (typeof document === 'undefined' || !date) return;
    const target = Array.from(document.querySelectorAll('.daily-exam-config-card'))
        .find(card => card.dataset.dailyExamDate === date);
    if (!target || !target.scrollIntoView) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    target.classList.add('daily-exam-scroll-highlight');
    setTimeout(() => target.classList.remove('daily-exam-scroll-highlight'), 1400);
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
    questionConfigFsOpen = false;
    questionConfigFsType = null;
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
    const extraRows = options.extraRows || '';
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
            ${extraRows}
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

function getLevelPassQuestions(level = getCurrentLevel()) {
    const questionCount = getLevelQuestionCount(level);
    const fallback = Math.ceil(questionCount * 0.6);
    const value = Number(level?.passQuestions);
    if (!questionCount) return 0;
    if (!value) return fallback;
    return Math.min(questionCount, Math.max(0, value));
}

function getLevelMaxAttempts(level = getCurrentLevel()) {
    return Math.max(0, Number(level?.maxAttempts) || 0);
}

function getLevelTargetQuestionCount(level = getCurrentLevel()) {
    const value = Number(level?.questions);
    return Math.max(0, Number.isFinite(value) ? Math.floor(value) : 0);
}

function getLevelQuestionNoticeState(level = getCurrentLevel()) {
    const target = getLevelTargetQuestionCount(level);
    const current = getLevelQuestionCount(level);
    if (!target) return { state: 'missing-target', current, target, diff: 0 };
    if (!current) return { state: 'missing-rules', current, target, diff: target };
    if (current !== target) return { state: 'count-mismatch', current, target, diff: Math.abs(target - current) };
    return { state: 'ok', current, target, diff: 0 };
}

function getLevelQuestionValidationState(level = getCurrentLevel()) {
    const questionCount = getLevelQuestionCount(level);
    if (!questionCount) return { state: 'missing-rules', questionCount, passQuestions: 0 };
    const passQuestions = getLevelPassQuestions(level);
    if (passQuestions < 1) return { state: 'missing-pass', questionCount, passQuestions };
    if (passQuestions > questionCount) return { state: 'pass-over', questionCount, passQuestions };
    return { state: 'ok', questionCount, passQuestions };
}

function getRuleTotal(rules) {
    return (rules || []).reduce((sum, rule) => sum + (Number(rule.count ?? rule.qCount) || 0) * (Number(rule.score ?? rule.perScore) || 0), 0);
}

function getRuleQuestionCount(rules) {
    return (rules || []).reduce((sum, rule) => sum + (Number(rule.count ?? rule.qCount) || 0), 0);
}

function setRuleQuestionCount(rules, value) {
    if (!rules || !rules.length) return;
    const target = Math.max(rules.length, Math.floor(Number(value) || 1));
    const firstCount = target - (rules.length - 1);
    const first = rules[0];
    if ('qCount' in first) first.qCount = firstCount;
    else first.count = firstCount;
    for (let i = 1; i < rules.length; i += 1) {
        if ('qCount' in rules[i]) rules[i].qCount = 1;
        else rules[i].count = 1;
    }
}

function setDailyQuestionCount(value) {
    const targetRules = dailyRandomRules.length ? dailyRandomRules : dailyBatchRuleTemplate;
    setRuleQuestionCount(targetRules, value);
    normalizeDailyQualifiedQuestionsForRules(targetRules);
    rerenderMain();
    refreshFsModal();
}

function getDailyQualifiedQuestionDefault(totalQuestions) {
    return Math.max(1, Math.ceil((Number(totalQuestions) || 0) * 0.6));
}

function getDailyQualifiedQuestions(rules = null) {
    const value = Math.floor(Number(dailyScoreConfig.qualifiedQuestions) || 0);
    const fallbackRules = rules || (dailyRandomRules.length ? dailyRandomRules : dailyBatchRuleTemplate);
    return Math.max(1, value || getDailyQualifiedQuestionDefault(getRuleQuestionCount(fallbackRules)));
}

function normalizeDailyQualifiedQuestionsForRules(rules, { forceDefault = false } = {}) {
    const totalQuestions = getRuleQuestionCount(rules);
    const defaultValue = getDailyQualifiedQuestionDefault(totalQuestions);
    const current = Math.floor(Number(dailyScoreConfig.qualifiedQuestions) || 0);
    if (forceDefault || !dailyScoreConfig.qualifiedQuestionsTouched || current < 1) {
        dailyScoreConfig.qualifiedQuestions = defaultValue;
        dailyScoreConfig.qualifiedQuestionsTouched = false;
    } else {
        dailyScoreConfig.qualifiedQuestions = Math.max(1, current);
    }
}

function getDailyQuestionValidationState(rules, qualifiedQuestions = getDailyQualifiedQuestions()) {
    if (!rules || !rules.length) return { state: 'missing-rules', current: 0, target: 0, qualifiedQuestions };
    const current = getRuleQuestionCount(rules);
    if (dailyScoreConfig.qualifiedStatsEnabled === false) return { state: 'ok', current, target: current, qualifiedQuestions: null };
    const qualified = Math.max(1, Math.floor(Number(qualifiedQuestions) || 1));
    if (qualified > current) return { state: 'qualified-over', current, target: current, qualifiedQuestions: qualified };
    return { state: 'ok', current, target: current, qualifiedQuestions: qualified };
}

function getDailyTargetQuestionCount() {
    return getRuleQuestionCount(dailyRandomRules.length ? dailyRandomRules : dailyBatchRuleTemplate);
}

function getDailyDayRandomRuleNoticeState(rules) {
    const target = getDailyTargetQuestionCount();
    const result = getDailyQuestionValidationState(rules);
    if (result.state !== 'ok') return { ...result, target };
    if (result.current !== target) return { ...result, state: 'count-mismatch', target };
    return { ...result, target };
}

function getDailyFixedQuestionNoticeState(day) {
    const target = getDailyTargetQuestionCount();
    const current = getDailyFixedDayQuestionCount(day);
    if (!current) return { state: 'missing-rules', current, target };
    if (current !== target) return { state: 'count-mismatch', current, target };
    return { state: 'ok', current, target };
}

function getDailyFixedQualifiedQuestionDefault(day) {
    return getDailyQualifiedQuestionDefault(getDailyFixedDayQuestionCount(day));
}

function getDailyFixedQualifiedQuestions(day) {
    if (!day) return getDailyQualifiedQuestions();
    const value = Math.floor(Number(day.qualifiedQuestions) || 0);
    return Math.max(1, value || getDailyFixedQualifiedQuestionDefault(day));
}

function normalizeDailyFixedQualifiedQuestions(day, { forceDefault = false } = {}) {
    if (!day) return;
    const current = Math.floor(Number(day.qualifiedQuestions) || 0);
    if (forceDefault || !day.qualifiedQuestionsTouched || current < 1) {
        day.qualifiedQuestions = getDailyFixedQualifiedQuestionDefault(day);
        day.qualifiedQuestionsTouched = false;
    } else {
        day.qualifiedQuestions = Math.max(1, current);
    }
}

function renderDailyQuestionRuleNotice(rules, qualifiedQuestions = getDailyQualifiedQuestions(), options = {}) {
    const result = getDailyQuestionValidationState(rules, qualifiedQuestions);
    const targetQuestions = Math.max(1, Math.floor(Number(options.targetQuestions) || 0));
    const hasTarget = targetQuestions > 0;
    const noticeState = result.state !== 'ok'
        ? result.state
        : (hasTarget && result.current !== targetQuestions ? 'count-mismatch' : 'ok');
    const cls = noticeState === 'ok' ? 'ok' : 'warn';
    return `
    <div class="score-rule-notice ${cls}">
        <div class="score-rule-notice-head">
            <strong>${hasTarget ? `每日题目数：${targetQuestions} 题；已配置：${result.current || 0} 题` : `每日题目数量：${result.current || '-'} 题`}</strong>
            <span>${noticeState === 'ok' ? '校验通过' : '待调整'}</span>
        </div>
        <p>${dailyScoreConfig.qualifiedStatsEnabled === false ? '当前仅校验每日题目数量是否一致。' : '达标题数用于判定达标天数；用户当日答对题数达到指定数量后，即视为当日达标。活动开始答题后，该配置不支持修改。'}</p>
    </div>`;
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

function renderScoreRuleNotice(rules, targetScore = quizTotalScore, options = {}) {
    const totalLabel = options.totalLabel || '目标总分';
    const ruleLabel = options.ruleLabel || '抽题规则';
    const result = getScoreValidationState(rules, targetScore);
    const cls = result.state === 'ok' ? 'ok' : result.state === 'over' ? 'error' : 'warn';
    const messageMap = {
        'missing-total': `请先选择${totalLabel}。`,
        'missing-rules': `请先配置题目来源和${ruleLabel}。`,
        under: `当前已配置 ${result.current} 分，还差 ${result.diff} 分，请继续补充题目或调整每题分值。`,
        over: `当前已配置 ${result.current} 分，已超出${totalLabel} ${result.diff} 分，请调整题目数量或每题分值。`,
        ok: `分值配置正确，当前${totalLabel}为 ${result.target} 分。`
    };
    return `
    <div class="score-rule-notice ${cls}">
        <div class="score-rule-notice-head">
            <strong>已配置总分：${result.current} / ${result.target || '-'} 分</strong>
            <span>${result.state === 'ok' ? '校验通过' : '待调整'}</span>
        </div>
        <p>本次${totalLabel}为 ${result.target || '-'} 分，请确保所有${ruleLabel}的分值之和等于该分数。</p>
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

function getLevelQuestionMode(level = getCurrentLevel()) {
    if (level?.questionMode) return level.questionMode === 'fixed' ? 'fixed' : 'random';
    return levelQuestionMode === 'fixed' ? 'fixed' : 'random';
}

function getLevelQuestionCount(level = getCurrentLevel()) {
    return getLevelQuestionMode(level) === 'fixed'
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
    if (fsQuizMode === 'level') return getLevelQuestionMode() === 'fixed'
        ? getLevelFixedQuestions()
        : getLevelRules();
    return getScoreRulesByMode(fsQuizMode);
}

function getDailySourceValidationState() {
    const timeState = getDailyTimeValidationState();
    if (timeState.state !== 'ok') return { ...timeState, current: 0, target: 0, diff: 0 };
    syncDailyDateConfigsWithOpenRange();
    const days = dailyFixedConfig.days || [];
    if (!days.length) return { state: 'missing-date', current: 0, target: 0, diff: 0 };
    const batchState = getDailyQuestionValidationState(dailyRandomRules);
    for (let i = 0; i < days.length; i += 1) {
        const day = days[i];
        if (day.isOpen === false) continue;
        const status = getDailyDateStatus(day);
        if (status.key === 'fixed') {
            const fixedState = getDailyFixedDayValidationState(day, i, timeState);
            if (fixedState.state !== 'ok') return fixedState;
            continue;
        }
        if (status.key === 'batch') {
            if (batchState.state !== 'ok') return { ...batchState, dayIndex: i, day };
            continue;
        }
        return { state: 'missing-rules', current: 0, target: 0, diff: 0, dayIndex: i, day };
    }
    return { state: 'ok', current: 0, target: 0, diff: 0 };
}

function getDailyTimeValidationMessage(result, modeLabel) {
    const msgMap = {
        'missing-time': `${modeLabel}：请先配置答题开放日期。`,
        'invalid-time-range': `${modeLabel}：答题开放结束时间不能早于开始时间。`,
        'missing-daily-window': `${modeLabel}：请先配置答题时段。`,
        'invalid-daily-window': `${modeLabel}：每日答题结束时刻必须晚于开始时刻。`,
        'invalid-time-limit': `${modeLabel}：每题限时不能低于 5 秒。`
    };
    return msgMap[result.state] || '';
}

function getDailySourceValidationMessage(result, mode = dailyQMode) {
    const modeLabel = '每日答题配置';
    if (result.state === 'missing-date') return `${modeLabel}：请先在“每日答题时间配置”中配置答题开放日期。`;
    if (result.state === 'missing-rules' && result.day) return `${modeLabel}：${formatDateLabel(result.day.date)} 尚未配置批量规则或固定题。`;
    if (mode === 'fixed') {
        const dayLabel = result.dayIndex >= 0 ? `第 ${result.dayIndex + 1} 天` : '当前日期';
        const timeMsg = getDailyTimeValidationMessage(result, modeLabel);
        if (timeMsg) return timeMsg.replace('请先配置答题开放日期。', '请先在“每日固定题目计划”中配置答题开放日期。');
        const fixedMsgMap = {
            'missing-date': `${modeLabel}：缺少 ${formatDateLabel(result.missingDate)} 的固定题目计划，请按开放日期生成或补充日期。`,
            'duplicate-date': `${modeLabel}：${dayLabel} 日期重复，请调整日期计划。`,
            'date-out-of-range': `${modeLabel}：${dayLabel} 不在答题开放日期范围内，请调整开放时间或日期计划。`
        };
        if (fixedMsgMap[result.state]) return fixedMsgMap[result.state];
        if (result.state === 'missing-rules') return `${modeLabel}：${dayLabel} 还没有配置题目。`;
        if (result.state === 'qualified-over') return `${modeLabel}：达标题数不能超过每日题目数量`;
        if (result.state === 'count-mismatch') return `${modeLabel}：已配置题数需与每日题目数保持一致。`;
        return `${modeLabel}：题目数量配置正确。`;
    }
    const timeMsg = getDailyTimeValidationMessage(result, modeLabel);
    if (timeMsg) return timeMsg;
    if (result.state === 'qualified-over') return `${modeLabel}：达标题数不能超过每日题目数量`;
    return `${modeLabel}：${getScoreValidationMessage(result)}`;
}

function getScoreValidationMessage(result) {
    const msgMap = {
        'missing-total': '请先选择试卷总分。',
        'missing-rules': '请先配置题目来源和抽题规则。',
        'qualified-over': '达标题数不能超过每日题目数量',
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

function getLevelRandomValidationMessage(result) {
    const msgMap = {
        'missing-total': '请先选择每个关卡分数。',
        'missing-rules': '请先配置至少 1 条关卡抽题规则。',
        under: `当前关卡抽题规则总分不足，已配置 ${result.current} 分，还差 ${result.diff} 分，请调整后再继续。`,
        over: `当前关卡抽题规则总分超出，已配置 ${result.current} 分，超出 ${result.diff} 分，请调整后再继续。`,
        ok: '关卡抽题规则分值配置正确。'
    };
    return msgMap[result.state] || '请检查每个关卡抽题规则配置。';
}

function getLevelQuestionValidationMessage(result) {
    const msgMap = {
        'missing-rules': '请先配置至少 1 道题目。',
        'missing-pass': '请设置至少答对 1 题过关。',
        'pass-over': `过关题数不能超过当前题目数量 ${result.questionCount} 题。`,
        ok: '关卡题目配置正确。'
    };
    return msgMap[result.state] || '请检查关卡题目配置。';
}

function getLevelQuestionCountNoticeMessage(result) {
    const msgMap = {
        'missing-target': '请先设置本关题目数。',
        'missing-rules': '请先配置关卡题目。',
        'count-mismatch': '已配置题数需与本关题目数保持一致。',
        ok: '关卡题目数量配置正确。'
    };
    return msgMap[result.state] || '请检查本关题目数配置。';
}

function validateScoreRulesForMode(mode, { silent = false } = {}) {
    if (mode === 'exam') {
        const missingPhasePaper = !phasedConfig.phases.length || !phasedConfig.phases.every(phase => phase.paper);
        const missingDailyPaper = dailyExamAdded && (!dailyExamConfig.papers.length || !dailyExamConfig.papers.every(day => day.paper));
        const missingPaper = missingPhasePaper || missingDailyPaper;
        if (missingPaper && !silent) alert('在线考试：请先配置试卷。');
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
        const questionNoticeState = getLevelQuestionNoticeState(level);
        if (questionNoticeState.state !== 'ok') {
            const message = getLevelQuestionCountNoticeMessage(questionNoticeState);
            if (!silent) alert(`趣味闯关：第 ${i + 1} 关 ${message}`);
            levelCurrentIdx = i;
            refreshFsModal();
            return false;
        }
        const result = getLevelQuestionValidationState(level);
        if (result.state !== 'ok') {
            const message = getLevelQuestionValidationMessage(result);
            if (!silent) alert(`趣味闯关：第 ${i + 1} 关 ${message}`);
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

// Sync current exam config state into the active group's summary fields
function applyExamToGroup() {
    const g = groups[fsGroupIdx];
    g.quizConfigured = true;
    g.quizMode = fsQuizMode;
    g.updatedAt = nowStamp();
    if (fsQuizMode === 'exam') {
        const phaseQCount = phasedConfig.phases.reduce((sum, item) => sum + (item.paper?.qCount || 0), 0);
        const phaseTotal = phasedConfig.phases.reduce((sum, item) => sum + (item.paper?.total || 0), 0);
        const dailyQCount = dailyExamAdded ? (dailyExamConfig.papers || []).reduce((sum, item) => sum + (item.paper?.qCount || 0), 0) : 0;
        const dailyTotal = dailyExamAdded ? (dailyExamConfig.papers || []).reduce((sum, item) => sum + (item.paper?.total || 0), 0) : 0;
        const qCount = phaseQCount + dailyQCount;
        const total = phaseTotal + dailyTotal;
        g.quizQCount = qCount;
        g.quizTotal = total;
        const phaseText = phasedConfig.phases.length === 1
            ? `单场考试 · 每人 ${phasedConfig.phases[0]?.attempts || 1} 次`
            : `${phasedConfig.phases.length} 期考试`;
        g.quizAttemptsText = dailyExamAdded ? `${phaseText} · 每日一卷 ${dailyExamConfig.papers.length} 天` : phaseText;
    } else if (fsQuizMode === 'daily') {
        syncDailyDateConfigsWithOpenRange();
        const days = dailyFixedConfig.days || [];
        const openDays = days.filter(day => day.isOpen !== false);
        g.quizQCount = openDays.reduce((sum, day) => sum + getDailyDayQuestionCount(day), 0);
        g.quizTotal = openDays.reduce((sum, day) => {
            const rules = getDailyDayRandomRules(day);
            return sum + (rules.length ? getRuleTotal(rules) : getDailyFixedDayScore(day));
        }, 0);
        g.quizAttemptsText = `${openDays.length} 天 · 达标 ${getDailyQualifiedQuestions()} 题 · 每日 ${dailyScoreConfig.maxDailyAttempts === 0 ? '不限次数' : `${dailyScoreConfig.maxDailyAttempts || 1} 次`}`;
    } else if (fsQuizMode === 'level') {
        g.quizQCount = (levels || []).reduce((sum, level) => sum + getLevelQuestionCount(level), 0);
        g.quizTotal = 0;
        g.quizAttemptsText = `${(levels || []).length} 关 · 按关卡配置题目`;
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
// EXAM MODE CONFIG (在线考试)
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
            <div>
                <div class="phase-section-title">考试配置</div>
                <div class="phase-section-subtitle">默认展示普通考试配置，配置一场试卷即可；如需多场考试或每日一卷，可按需继续新增。</div>
            </div>
            <div class="phase-section-actions">
                <button class="btn btn-outline btn-sm" type="button" onclick="addPhase()">+ 添加场次</button>
                <button class="btn btn-primary btn-sm" type="button" onclick="openAddDailyExamModal()">+ 每日一卷</button>
            </div>
        </div>
        <div class="cfg-panel phase-main-panel" id="examPhaseConfig">
            <div class="cfg-panel-body">
                <div class="phase-card-stack">
                    ${pc.phases.map((p, i) => renderPhaseConfigCard(p, i)).join('')}
                </div>
            </div>
        </div>
        ${dailyExamAdded ? renderDailyExamModeConfig(groups[fsGroupIdx] || { name: '' }) : ''}
    </div>`;
}

function renderDailyExamModeConfig(g) {
    normalizeDailyExamPapers();
    return `
    <div class="phase-config-shell daily-exam-shell">
        ${renderDailyExamPaperPanel()}
        ${renderDailyExamRulePanel()}
    </div>`;
}

function renderDailyExamPaperPanel() {
    normalizeDailyExamPapers();
    const days = dailyExamConfig.papers || [];
    return `
    <div class="cfg-panel" id="dailyExamPapers">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('dailyExamPapers')">
            <div class="cfg-panel-icon green">📄</div>
            <div><div class="cfg-panel-title">每日试卷配置</div><div class="cfg-panel-subtitle">按开放日期自动生成每日配置项</div></div>
            <div class="daily-exam-head-actions">
                <button class="btn btn-outline btn-sm daily-exam-edit-btn" type="button" onclick="event.stopPropagation();openEditDailyExamModal()">编辑</button>
                <span class="cfg-panel-badge essential">必填</span>
                <span class="cfg-panel-arrow">▼</span>
            </div>
        </div>
        <div class="cfg-panel-body">
            ${renderDailyExamConfigSummary(days)}
            ${renderDailyExamDateBuilder(days)}
        </div>
    </div>`;
}

function renderDailyExamConfigSummary(days) {
    const start = `${formatDateLabel(dailyExamConfig.startDate)} ${dailyExamConfig.dailyStart || '09:00'}`;
    const end = `${formatDateLabel(dailyExamConfig.endDate)} ${dailyExamConfig.dailyEnd || '18:00'}`;
    return `
    <div class="daily-exam-config-summary">
        <div>
            <span>开放时间</span>
            <strong>${start} 至 ${end}</strong>
        </div>
        <div>
            <span>每卷考试时长</span>
            <strong>${dailyExamConfig.duration || 60} 分钟</strong>
        </div>
        <div>
            <span>已生成日期</span>
            <strong>${days.length} 天</strong>
        </div>
    </div>`;
}

function renderDailyExamDateBuilder(days) {
    if (!days.length) {
        return '<div class="daily-fixed-empty">请先配置考试开放日期，系统会按日期范围生成每日一卷计划。</div>';
    }
    return `
    <div class="phase-card-stack daily-exam-card-stack">
        ${days.map((day, i) => renderDailyExamConfigCard(day, i)).join('')}
    </div>`;
}

function renderDailyExamConfigCard(day, i) {
    return `
    <div class="group-card rich gc-${day.paper ? 'done' : 'empty'} phase-config-card daily-exam-config-card" data-daily-exam-date="${escapeAttr(day.date || '')}">
        <div class="gc-stripe"></div>
        <div class="gc-body">
            <div class="gc-head-row phase-head-row">
                <span class="gc-drag" title="日期由开放时间自动生成">⠿</span>
                <div class="phase-head-title-wrap">
                    <div class="phase-config-card-title">${escapeHtml(day.name || `第${i + 1}天`)}</div>
                    <div class="phase-config-card-sub">${formatDateLabel(day.date)} · ${day.theme || '在线考试'}</div>
                </div>
                <span class="phase-chip ${day.paper ? 'ok' : 'warn'}">${day.paper ? '已完成配置' : '未完成配置'}</span>
            </div>
            <div class="phase-config-card-body">
                <div class="phase-block">
                    <div class="cfg-row">
                        <div class="cfg-row-label"><span class="req">*</span> 答题日期</div>
                        <div class="cfg-row-control">
                            <input class="form-control" value="${formatDateLabel(day.date)}" readonly>
                            <div class="cfg-row-hint">日期由每日一卷开放日期范围自动生成。</div>
                        </div>
                    </div>
                    <div class="cfg-row" style="border-bottom:none">
                        <div class="cfg-row-label"><span class="req">*</span> 主题名称</div>
                        <div class="cfg-row-control">
                            <input class="form-control" value="${escapeAttr(day.theme || '')}" onchange="setDailyExamDayField(${i},'theme',this.value)" placeholder="如：第1天：阅读常识">
                        </div>
                    </div>
                </div>
                <div class="phase-block">
                    <div class="cfg-row" style="border-bottom:none">
                        <div class="cfg-row-label"><span class="req">*</span> 配置试卷</div>
                        <div class="cfg-row-control">
                            ${renderDailyExamSinglePaperCard(day, i)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderDailyExamSinglePaperCard(day, index) {
    const paper = day?.paper;
    return `
    <div class="daily-exam-paper-card ${paper ? 'configured' : ''}">
        <div class="daily-exam-paper-head">
            <div>
                <div class="daily-exam-paper-title">当天试卷</div>
                <div class="cfg-row-hint">试卷配置复用在线考试的试卷选择与创建逻辑。</div>
            </div>
            <span class="phase-chip ${paper ? 'ok' : 'warn'}">${paper ? '已配置' : '未配置'}</span>
        </div>
        ${paper ? `
            <div class="paper-source-card selected" style="cursor:default">
                <div class="psc-title">📄 ${paper.name} <span style="margin-left:6px">${paperModeBadges(paper)}</span> <span class="badge badge-green" style="font-size:11px;margin-left:6px">${paper.status || '启用'}</span></div>
                <div class="psc-meta-grid">
                    <div><span class="psc-meta-lbl">题目数量：</span><span class="psc-meta-val">${paper.qCount} 题</span></div>
                    <div><span class="psc-meta-lbl">试卷总分：</span><span class="psc-meta-val">${paper.total} 分</span></div>
                    <div><span class="psc-meta-lbl">组卷方式：</span><span class="psc-meta-val">${paper.mode || '固定题目'}</span></div>
                    <div><span class="psc-meta-lbl">题型构成：</span><span class="psc-meta-val">${paper.composition || '—'}</span></div>
                </div>
                <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
                    <button class="btn btn-outline btn-sm" onclick="pickDailyExamPaper(${index})">更换试卷</button>
                    <button class="btn btn-primary btn-sm" onclick="createDailyExamPaper(${index})">+ 试卷配置</button>
                    <button class="btn btn-ghost btn-sm" onclick="clearDailyExamPaper(${index})">清空试卷</button>
                    <button class="btn btn-ghost btn-sm" onclick="navigateTo('paper-mgmt')">查看试卷</button>
                </div>
            </div>` : `
            <div class="paper-pick-zone" onclick="createDailyExamPaper(${index})">
                <div class="ppz-icon">+</div>
                <div class="ppz-text">试卷配置</div>
            </div>`}
    </div>`;
}

function renderDailyExamRulePanel() {
    return `
    <div class="cfg-panel" id="dailyExamRules">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('dailyExamRules')">
            <div class="cfg-panel-icon green">🔒</div>
            <div><div class="cfg-panel-title">解锁与作答规则</div><div class="cfg-panel-subtitle">每日一卷固定规则与补考处理</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="info-box blue" style="margin-bottom:12px">每日一卷固定为每天解锁 1 套、每卷仅允许 1 次作答；提交后锁定，不支持重复进入同一日试卷。</div>
            ${renderDeveloperRuleList([
                '移动端用户端在开放日期范围内展示每日试卷列表。',
                '每日仅自动解锁当日卷，未到当天不可提前作答。',
                '每套试卷仅允许 1 次作答机会，提交后即锁定。',
                '固定题目和随机抽题试卷均复用在线考试试卷管理的组卷业务流程。'
            ])}
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
                <div class="qmdc-ov-name">在线考试</div>
                <div class="qmdc-ov-desc">适用于线上考试、知识竞赛、测评考试等正式答题场景。支持固定题目、随机组卷、考试时长、及格分和成绩排名。</div>
            </div>
        </div>
        <div class="qmdc-ov-grid">
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">当前组别</div><div class="qmdc-ov-val">${g.name || '—'}</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">答题模式</div><div class="qmdc-ov-val">在线考试</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">题目来源</div><div class="qmdc-ov-val">${srcText}</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">题目数量</div><div class="qmdc-ov-val">${qCount} 题</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">试卷总分</div><div class="qmdc-ov-val">${total} 分</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">及格分</div><div class="qmdc-ov-val">${ec.passScore} 分</div></div>
            <div class="qmdc-ov-cell"><div class="qmdc-ov-lbl">配置状态</div><div class="qmdc-ov-val"><span class="gc-status-pill ${statusCls}">${statusTxt}</span></div></div>
        </div>
    </div>`;
}

// ---- module 1: 题目配置 ----
function renderExamModule1(ec, qCount, total) {
    return `
    <div class="cfg-panel" id="examQSource">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('examQSource')">
            <div class="cfg-panel-icon blue">📄</div>
            <div><div class="cfg-panel-title">题目配置</div><div class="cfg-panel-subtitle">在当前页面配置本场考试题目，或从题库选择题目。</div></div>
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
            <div class="cfg-row-label"><span class="req">*</span> 题目配置</div>
            <div class="cfg-row-control">
                <div class="paper-pick-zone" onclick="pickExamPaper()">
                    <div class="ppz-icon">+</div>
                    <div class="ppz-text">配置题目</div>
                </div>
            </div>
        </div>`;
    }
    return `
    <div class="cfg-row">
        <div class="cfg-row-label"><span class="req">*</span> 题目配置</div>
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

function getExamResumeConfirmText() {
    const phases = phasedConfig.phases || [];
    if (!phases.length) return '否';
    const enabledCount = phases.filter(phase => !!phase.allowResume).length;
    if (enabledCount === 0) return '否';
    if (enabledCount === phases.length) return '是';
    return `部分场次开启（${enabledCount}/${phases.length}）`;
}

function getPracticeConfig(mode) {
    if (!activityPracticeConfig[mode]) {
        activityPracticeConfig[mode] = { bank: false, bankWay: 'sequence', name: '', startTime: '2026-06-09T06:00', endTime: '2026-07-09T23:59' };
    }
    return activityPracticeConfig[mode];
}

function renderActivityPracticeConfigPanel(mode, title = '是否开放刷题练习', subtitle = '可选配置练习入口，当前仅支持题库刷题，可不启用。', placement = '') {
    const panelId = `practiceConfig_${mode}${placement ? `_${placement}` : ''}`;
    const enabled = !!getPracticeConfig(mode).bank;
    const isExamPhasePractice = String(mode).startsWith('exam_phase_');
    const displayTitle = title.replace(/^是否/, '');
    if (isExamPhasePractice) {
        return `
        <div class="cfg-row exam-phase-practice-row" id="${panelId}" style="border-bottom:none">
            <div class="cfg-row-label">${displayTitle}</div>
            <div class="cfg-row-control">
                <div class="practice-radio-content">
                    <div class="config-bool-control">
                        <label class="switch config-bool-switch" aria-label="${displayTitle}">
                            <input type="checkbox" ${enabled ? 'checked' : ''} onchange="setActivityPracticeOpen('${mode}', this.checked)">
                            <span class="sw-slider"></span>
                        </label>
                        <span class="config-bool-state">${enabled ? '已开启' : '未开启'}</span>
                    </div>
                    <div class="practice-radio-subtitle">开启后，用户可通过题库刷题入口练习，练习成绩不影响正式答题结果。</div>
                </div>
            </div>
        </div>`;
    }
    return `
    <div class="cfg-panel activity-practice-panel" id="${panelId}">
        <div class="cfg-panel-head">
            <div class="cfg-panel-icon green">🧩</div>
            <div>
                <div class="cfg-panel-title">练习模式</div>
                <div class="cfg-panel-subtitle">可选开放题库刷题入口，练习成绩不影响正式答题结果</div>
            </div>
        </div>
        <div class="cfg-panel-body">
            <div class="practice-radio-row">
                <div class="practice-radio-title">${displayTitle}</div>
                <div class="practice-radio-content">
                    <div class="config-bool-control">
                        <label class="switch config-bool-switch" aria-label="${displayTitle}">
                            <input type="checkbox" ${enabled ? 'checked' : ''} onchange="setActivityPracticeOpen('${mode}', this.checked)">
                            <span class="sw-slider"></span>
                        </label>
                        <span class="config-bool-state">${enabled ? '已开启' : '未开启'}</span>
                    </div>
                    <div class="practice-radio-subtitle">开启后，用户可通过题库刷题入口练习，练习成绩不影响正式答题结果。</div>
                </div>
            </div>
        </div>
    </div>`;
}

function getLevelPracticeConfig(level = getCurrentLevel()) {
    if (!level) return { bank: false };
    if (!level.practiceConfig) {
        level.practiceConfig = {
            ...getPracticeConfig('level'),
            bank: false
        };
    }
    return level.practiceConfig;
}

function renderLevelPracticeConfigPanel(level = getCurrentLevel()) {
    const cfg = getLevelPracticeConfig(level);
    const enabled = !!cfg.bank;
    return `
    <div class="cfg-panel activity-practice-panel" id="levelPracticeConfig_${levelCurrentIdx}">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('levelPracticeConfig_${levelCurrentIdx}')">
            <div class="cfg-panel-icon green">🧩</div>
            <div>
                <div class="cfg-panel-title">练习模式</div>
                <div class="cfg-panel-subtitle">可选开放题库刷题入口，练习成绩不影响正式答题结果</div>
            </div>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="practice-radio-row">
                <div class="practice-radio-title">开放刷题练习</div>
                <div class="practice-radio-content">
                    <div class="config-bool-control">
                        <label class="switch config-bool-switch" aria-label="开放刷题练习">
                            <input type="checkbox" ${enabled ? 'checked' : ''} onchange="setCurrentLevelPracticeOpen(this.checked)">
                            <span class="sw-slider"></span>
                        </label>
                        <span class="config-bool-state">${enabled ? '已开启' : '未开启'}</span>
                    </div>
                    <div class="practice-radio-subtitle">开启后，用户可通过题库刷题入口练习，练习成绩不影响正式答题结果。</div>
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

function toggleActivityPracticeOpen(mode, event) {
    if (event) event.stopPropagation();
    const cfg = getPracticeConfig(mode);
    cfg.bank = !cfg.bank;
    refreshFsModal();
}

function setActivityPracticeOpen(mode, enabled) {
    getPracticeConfig(mode).bank = enabled;
    if (fsOpen) refreshFsModal();
    else rerenderMain();
}

function setCurrentLevelPracticeOpen(enabled) {
    getLevelPracticeConfig().bank = enabled;
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
            <div><div class="cfg-panel-title">默认答题规则<span class="cfg-panel-title-note">//仅研发人员可见</span></div><div class="cfg-panel-subtitle">系统默认实现，管理员无需配置</div></div>
            <span class="cfg-panel-badge advanced">高级</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            ${renderDeveloperRuleList([
                '断点续答：根据进入管理-更多功能中的“允许断点续答”配置执行。',
                '超时自动交卷：考试时长或开放时间结束后自动交卷。',
                '允许跳题：用户可跳过当前题后续再答。',
                '显示答题卡：用户可通过答题卡切换题目。',
                '支持提前交卷：用户可在考试时长结束前主动交卷。',
                '提交后展示成绩：在线考试固定为交卷后自动展示成绩。',
                '答题解析规则：默认为“活动结束后展示答题解析”，管理员无需配置。',
                '人工阅卷成绩展示：需人工阅卷的答题活动，其主观题成绩由管理员点击“发布成绩”按钮后公布。',
                '多场次展示规则：多场次考试时，默认全部展示；未到场次开放时间的，用户点击后弹出考试未开始提示。'
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
                <div class="qmdc-ov-name">在线考试 · 多期主题考试</div>
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
            <div class="phased-tabs-shell">
                <div class="phased-tabs-bar">
                    ${pc.phases.map((p, i) => renderPhaseTab(p, i, idx)).join('')}
                    <button class="phased-tab-add" type="button" onclick="addPhase()">+ 新增考试场次</button>
                </div>
                <div class="phased-tab-detail">
                    ${cur ? renderPhaseDetail(cur, idx) : '<div style="padding:40px;text-align:center;color:var(--text-tertiary)">暂无期次，请点击上方「+ 新增考试场次」添加</div>'}
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

function renderPhaseTab(p, i, activeIdx) {
    const fmtDate = (d) => (d || '').slice(5, 10).replace('-', '.');
    const dateRange = `${fmtDate(p.startDate)} - ${fmtDate(p.endDate)}`;
    const cfgStatus = p.configured ? '已完成配置' : '未完成配置';
    return `
    <button id="phaseTab_${i}" class="phase-tab ${i===activeIdx?'active':''}" type="button" draggable="true" onclick="selectPhase(${i})" ondragstart="startPhaseDrag(event,${i})" ondragover="event.preventDefault()" ondrop="dropPhase(event,${i})" ondragend="endPhaseDrag()">
        <span class="phase-tab-drag" title="拖拽调整顺序" aria-label="拖拽调整顺序">⋮⋮</span>
        <span class="phase-tab-main">
            <span class="phase-tab-top">
                <strong>${p.name}</strong>
                ${phaseStatusBadge(p)}
            </span>
            <span class="phase-tab-theme">${p.theme || '未命名主题'}</span>
            <span class="phase-tab-meta">📅 ${dateRange}</span>
            <span class="phase-tab-chip ${p.configured ? 'ok' : 'warn'}">${cfgStatus}</span>
        </span>
        <span class="phase-tab-actions">
            <button class="pli-ic-btn" type="button" title="复制期次" onclick="event.stopPropagation();copyPhase(${i})">⧉</button>
            <button class="pli-ic-btn danger" type="button" title="删除期次" onclick="event.stopPropagation();deletePhase(${i})">×</button>
        </span>
    </button>`;
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
    const strategyText = mode === '随机抽题' ? '时间触发抽题' : '';
    return `<span class="badge ${modeCls}" style="font-size:11px">${mode}</span>${strategyText ? `<span class="badge badge-yellow" style="font-size:11px;margin-left:6px">${strategyText}</span>` : ''}`;
}

function renderPhaseDetail(p, i) {
    return `
        <div class="phase-block">
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 场次名称</div>
            <div class="cfg-row-control">
                <input class="form-control" value="${escapeAttr(p.name || formatPhaseCardTitle(i))}" onchange="setPhaseField(${i},'name',this.value)">
            </div>
        </div>
        <div class="cfg-row" style="border-bottom:none">
            <div class="cfg-row-label">场次说明</div>
            <div class="cfg-row-control">
                <textarea class="form-control" rows="3" placeholder="请输入场次说明（选填）" onchange="setPhaseField(${i},'subtitle',this.value)">${escapeHtml(p.subtitle || '')}</textarea>
            </div>
        </div>
    </div>

        <div class="phase-block">
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 开放日期</div>
            <div class="cfg-row-control">
                <div style="display:flex;gap:8px;align-items:center">
                    <input type="date" class="form-control" value="${getDateOnlyValue(p.startDate)}" onchange="setPhaseField(${i},'startDate',this.value)">
                    <span style="color:var(--text-tertiary)">至</span>
                    <input type="date" class="form-control" value="${getDateOnlyValue(p.endDate)}" onchange="setPhaseField(${i},'endDate',this.value)">
                </div>
            </div>
        </div>
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 每日答题时段</div>
            <div class="cfg-row-control">
                <div style="display:flex;gap:8px;align-items:center">
                    <input type="time" class="form-control" value="${p.dailyStart || '09:00'}" onchange="setPhaseField(${i},'dailyStart',this.value)">
                    <span style="color:var(--text-tertiary)">至</span>
                    <input type="time" class="form-control" value="${p.dailyEnd || '18:00'}" onchange="setPhaseField(${i},'dailyEnd',this.value)">
                </div>
                <div class="cfg-row-hint">在开放时间范围内，每天仅该时段允许进入考试，例如 09:00 至 17:00。</div>
            </div>
        </div>
        <div class="cfg-row" style="border-bottom:none">
            <div class="cfg-row-label"><span class="req">*</span> 考试时长</div>
            <div class="cfg-row-control">
                <div class="num-input"><input type="number" value="${p.duration || 60}" min="1" onchange="setPhaseField(${i},'duration',this.value)"><span class="unit">分钟</span></div>
                <div class="cfg-row-hint">用户进入本期考试后的最长作答时间。</div>
            </div>
        </div>
    </div>

    <div class="phase-block">
        <div class="cfg-row" style="border-bottom:none">
            <div class="cfg-row-label"><span class="req">*</span> 考试试卷</div>
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
                    <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
                        <button class="btn btn-primary btn-sm" onclick="createPhasePaper(${i})">配置试卷</button>
                    </div>
                </div>` : `
                <div class="paper-pick-zone" onclick="createPhasePaper(${i})">
                    <div class="ppz-icon">+</div>
                    <div class="ppz-text">配置试卷</div>
                </div>`}
            </div>
        </div>
    </div>

    ${renderActivityPracticeConfigPanel(`exam_phase_${i}`, '是否开放刷题练习', '可为本场考试同步开放题库刷题，练习成绩不计入正式考试成绩、排名或评奖。', `phase_${i}`)}

    `;
}

function renderPhaseConfigCard(p, i) {
    const canDelete = phasedConfig.phases.length > 1;
    return `
    <div id="phaseConfigCard_${i}" class="group-card rich gc-${p.configured ? 'done' : 'empty'} phase-config-card">
        <div class="gc-stripe"></div>
        <div class="gc-body">
            <div class="gc-head-row phase-head-row">
                <span class="gc-drag" title="拖拽排序">⠿</span>
                <div class="phase-head-title-wrap">
                    <div class="phase-config-card-title">${escapeHtml(p.name || formatPhaseCardTitle(i))}</div>
                    <div class="phase-config-card-sub">${p.theme || '设置试卷、时间和是否开放刷题练习'}</div>
                </div>
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
    return `第${cn[index] || (index + 1)}场`;
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
    document.querySelectorAll('.phase-tab.dragging').forEach(el => el.classList.remove('dragging'));
}
function addPhase() {
    const n = phasedConfig.phases.length + 1;
    const newIndex = n - 1;
    phasedConfig.phases.push({
        name: formatPhaseCardTitle(newIndex), theme: `${formatPhaseCardTitle(newIndex)}考试`, subtitle: '',
        startDate: '2026-06-01', endDate: '2026-06-01',
        dailyStart: '09:00', dailyEnd: '18:00',
        hiddenWhenClosed: true, duration: 60, attempts: 1, scoreRule: 'highest',
        allowResume: false,
        paper: null, configured: false, expanded: true
    });
    phasedCurrentIdx = newIndex;
    refreshFsModal();
    showQuizToast('添加成功');
    requestAnimationFrame(() => scrollToPhasePosition(newIndex));
}

function openAddDailyExamModal() {
    openDailyExamConfigModal({ mode: 'add' });
}

function openEditDailyExamModal() {
    openDailyExamConfigModal({ mode: 'edit' });
}

function openDailyExamConfigModal({ mode = 'add' } = {}) {
    const isEdit = mode === 'edit';
    const defaultStart = getDateTimeLocalValue(dailyExamConfig.startDate || '2026-06-09', '00:00');
    const defaultEnd = getDateTimeLocalValue(dailyExamConfig.endDate || dailyExamConfig.startDate || '2026-06-09', '23:59');
    const defaultDailyStart = dailyExamConfig.dailyStart || '09:00';
    const defaultDailyEnd = dailyExamConfig.dailyEnd || '18:00';
    const defaultDays = getDailyExamModalGeneratedDays(defaultStart, defaultEnd);
    openModal(isEdit ? '编辑每日一卷' : '添加每日一卷', `
        <div class="form-group">
            <label><span class="req">*</span> 场次名称</label>
            <input id="dailyExamModalName" class="form-control" value="${escapeAttr(dailyExamConfig.name || '每日一卷')}" placeholder="请输入场次名称">
        </div>
        <div class="form-group">
            <label><span class="req">*</span> 答题开放时间</label>
            <div class="date-range-control">
                <input id="dailyExamModalStart" type="datetime-local" class="form-control" value="${defaultStart}">
                <span>至</span>
                <input id="dailyExamModalEnd" type="datetime-local" class="form-control" value="${defaultEnd}">
            </div>
        </div>
        <div class="form-group">
            <label><span class="req">*</span> 每日时段</label>
            <div class="date-range-control daily-exam-time-range">
                <input id="dailyExamModalDailyStart" type="time" class="form-control" value="${defaultDailyStart}">
                <span>至</span>
                <input id="dailyExamModalDailyEnd" type="time" class="form-control" value="${defaultDailyEnd}">
            </div>
            <p class="hint">每天仅该时段允许进入当日试卷。</p>
        </div>
        <div class="form-group">
            <label><span class="req">*</span> 每卷考试时长</label>
            <div class="num-input"><input id="dailyExamModalDuration" type="number" class="form-control" min="1" value="${dailyExamConfig.duration || 60}"><span class="unit">分钟</span></div>
        </div>
        <div class="daily-exam-generate-hint" id="dailyExamGenerateHint">按当前开放时间将生成 <strong>${defaultDays}</strong> 天每日试卷。</div>
    `, () => {
        const name = document.getElementById('dailyExamModalName')?.value.trim();
        const start = document.getElementById('dailyExamModalStart')?.value;
        const end = document.getElementById('dailyExamModalEnd')?.value;
        const dailyStart = document.getElementById('dailyExamModalDailyStart')?.value;
        const dailyEnd = document.getElementById('dailyExamModalDailyEnd')?.value;
        const duration = document.getElementById('dailyExamModalDuration')?.value;
        if (!name || !start || !end || !dailyStart || !dailyEnd) {
            alert('请填写场次名称、答题开放时间和每日时段。');
            return false;
        }
        if (end <= start) {
            alert('答题开放结束时间必须晚于开始时间。');
            return false;
        }
        if (dailyEnd <= dailyStart) {
            alert('每日时段结束时刻必须晚于开始时刻。');
            return false;
        }
        if (isEdit) {
            confirmSaveDailyExamConfig(name, start, end, duration, dailyStart, dailyEnd);
            return false;
        }
        saveDailyExamFromModal(name, start, end, duration, dailyStart, dailyEnd, { scrollToFirstNew: true });
    }, { confirmText: isEdit ? '确认保存' : '确认' });
    bindDailyExamModalGeneratedHint();
}

function getDailyExamModalGeneratedDays(start, end) {
    const [startDate] = String(start || '').split('T');
    const [endDate] = String(end || '').split('T');
    return getDateRangeList(startDate, endDate).length;
}

function bindDailyExamModalGeneratedHint() {
    const startInput = document.getElementById('dailyExamModalStart');
    const endInput = document.getElementById('dailyExamModalEnd');
    const hint = document.getElementById('dailyExamGenerateHint');
    if (!startInput || !endInput || !hint) return;
    const updateHint = () => {
        const days = getDailyExamModalGeneratedDays(startInput.value, endInput.value);
        hint.innerHTML = days
            ? `按当前开放时间将生成 <strong>${days}</strong> 天每日试卷。`
            : '请填写有效的开放时间，系统将自动计算生成天数。';
    };
    startInput.addEventListener('change', updateHint);
    endInput.addEventListener('change', updateHint);
    startInput.addEventListener('input', updateHint);
    endInput.addEventListener('input', updateHint);
}

function saveDailyExamFromModal(name, start, end, duration, dailyStart, dailyEnd, options = {}) {
    const [startDate] = String(start).split('T');
    const [endDate] = String(end).split('T');
    const existingDates = new Set((dailyExamConfig.papers || []).map(item => item.date));
    const nextDates = getDateRangeList(startDate, endDate);
    const scrollDate = options.scrollToFirstNew
        ? (nextDates.find(date => !existingDates.has(date)) || nextDates[0])
        : '';
    dailyExamConfig.name = name;
    dailyExamConfig.startDate = startDate;
    dailyExamConfig.endDate = endDate;
    dailyExamConfig.dailyStart = dailyStart || '09:00';
    dailyExamConfig.dailyEnd = dailyEnd || '18:00';
    dailyExamConfig.duration = Math.max(1, Number(duration) || 1);
    dailyExamAdded = true;
    normalizeDailyExamPapers();
    refreshFsModal();
    if (scrollDate) {
        requestAnimationFrame(() => requestAnimationFrame(() => scrollToDailyExamDate(scrollDate)));
    }
}

function confirmSaveDailyExamConfig(name, start, end, duration, dailyStart, dailyEnd) {
    const [startDate] = String(start).split('T');
    const [endDate] = String(end).split('T');
    const nextDates = getDateRangeList(startDate, endDate);
    const currentDates = new Set((dailyExamConfig.papers || []).map(item => item.date));
    const keptCount = nextDates.filter(date => currentDates.has(date)).length;
    const removedCount = Math.max(0, currentDates.size - keptCount);
    openModal('确认保存每日一卷配置？', `
        <div class="info-box yellow">
            <strong>确认保存后，系统将按新的开放日期范围重新生成每日试卷日期。</strong>
            <p style="margin-top:8px">仍在新日期范围内的日期会保留原有试卷配置；超出新范围的 ${removedCount} 个日期配置将不再显示。</p>
        </div>
        <div class="daily-exam-confirm-summary">
            <div><span>新开放时间</span><strong>${formatDateLabel(startDate)} ${String(start).split('T')[1] || '09:00'} 至 ${formatDateLabel(endDate)} ${String(end).split('T')[1] || '18:00'}</strong></div>
            <div><span>每日时段</span><strong>${dailyStart} 至 ${dailyEnd}</strong></div>
            <div><span>将生成日期</span><strong>${nextDates.length} 天</strong></div>
            <div><span>每卷考试时长</span><strong>${Math.max(1, Number(duration) || 1)} 分钟</strong></div>
        </div>
    `, () => {
        saveDailyExamFromModal(name, start, end, duration, dailyStart, dailyEnd);
    }, { confirmText: '确认保存' });
}

function clonePaperForConfig(paper) {
    if (!paper) return null;
    return {
        name: paper.name,
        mode: paper.mode,
        randomStrategy: paper.randomStrategy,
        retakeStrategy: paper.retakeStrategy,
        qCount: paper.qCount ?? paper.count ?? 0,
        total: paper.total || 0,
        subjective: paper.subjective || 0,
        typeScores: paper.typeScores || [],
        composition: paper.composition || (paper.mode === '固定题目' ? '固定题目' : '随机抽题'),
        scope: paper.scope || '考试活动',
        status: paper.status || '已发布',
        referenced: !!paper.referenced,
        updatedAt: paper.updatedAt || ''
    };
}

function buildDailyExamPaperItem(date, index, previous) {
    return {
        date,
        name: previous?.name || `第${index + 1}天`,
        theme: previous?.theme || `第${index + 1}天：在线考试`,
        paper: previous?.paper || null,
        configured: !!previous?.paper
    };
}

function normalizeDailyExamPapers() {
    if (!dailyExamConfig || typeof dailyExamConfig !== 'object') return;
    const dates = getDateRangeList(dailyExamConfig.startDate, dailyExamConfig.endDate);
    if (!Array.isArray(dailyExamConfig.papers)) dailyExamConfig.papers = [];
    if (!dates.length) {
        dailyExamConfig.papers = [];
        dailyExamCurrentIdx = 0;
        return;
    }
    const byDate = new Map(dailyExamConfig.papers.map(item => [item.date, item]));
    dailyExamConfig.papers = dates.map((date, index) => buildDailyExamPaperItem(date, index, byDate.get(date)));
    dailyExamCurrentIdx = Math.min(dailyExamCurrentIdx, dailyExamConfig.papers.length - 1);
}

function setDailyExamField(key, val) {
    if (key === 'duration') dailyExamConfig.duration = Math.max(1, Number(val) || 1);
    else dailyExamConfig[key] = val;
    if (key === 'startDate' || key === 'endDate') normalizeDailyExamPapers();
    refreshFsModal();
}

function regenerateDailyExamPapers() {
    normalizeDailyExamPapers();
    refreshFsModal();
}

function selectDailyExamDay(idx) {
    const days = dailyExamConfig.papers || [];
    dailyExamCurrentIdx = Math.min(Math.max(0, idx), Math.max(0, days.length - 1));
    refreshFsModal();
}

function setDailyExamDayField(indexOrKey, keyOrVal, maybeVal) {
    const hasIndex = typeof indexOrKey === 'number';
    const index = hasIndex ? indexOrKey : dailyExamCurrentIdx;
    const key = hasIndex ? keyOrVal : indexOrKey;
    const val = hasIndex ? maybeVal : keyOrVal;
    const day = dailyExamConfig.papers?.[index];
    if (!day) return;
    day[key] = val;
    dailyExamCurrentIdx = index;
    refreshFsModal();
}

function clearDailyExamPaper(index = dailyExamCurrentIdx) {
    const day = dailyExamConfig.papers?.[index];
    if (!day) return;
    day.paper = null;
    day.configured = false;
    dailyExamCurrentIdx = index;
    refreshFsModal();
}

function pickDailyExamPaper(index = dailyExamCurrentIdx) {
    dailyExamCurrentIdx = index;
    paperDrawerTarget = `daily-exam-${index}`;
    phasedPaperDrawerTab = 'select';
    paperDrawerOpen = true;
    refreshFsModal();
}

function createDailyExamPaper(index = dailyExamCurrentIdx) {
    dailyExamCurrentIdx = index;
    paperDrawerTarget = `daily-exam-${index}`;
    phasedPaperDrawerTab = 'create';
    paperDrawerOpen = true;
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
    if (key === 'allowResume') p[key] = !!val;
    else if (['duration', 'attempts', 'qualifyValue'].includes(key)) p[key] = Math.max(1, Number(val) || 1);
    else p[key] = val;
    refreshFsModal();
}
function pickPhasePaper(i) {
    paperDrawerTarget = 'phase-' + i; // phased exam paper slot
    phasedPaperDrawerTab = 'select';
    paperDrawerOpen = true;
    refreshFsModal();
}

function createPhasePaper(i) {
    paperDrawerTarget = 'phase-' + i;
    phasedPaperDrawerTab = 'create';
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
    dailyScoreConfig.maxDailyAttempts = Number(dailyScoreConfig.maxDailyAttempts) === 0 ? 0 : Math.max(1, Number(dailyScoreConfig.maxDailyAttempts) || 1);
    dailyScoreConfig.qualifiedQuestions = Math.max(1, Math.floor(Number(dailyScoreConfig.qualifiedQuestions) || 1));
    dailyScoreConfig.qualifiedQuestionsTouched = !!dailyScoreConfig.qualifiedQuestionsTouched;
    dailyScoreConfig.qualifiedStatsEnabled = !!dailyScoreConfig.qualifiedStatsEnabled;
    dailyScoreConfig.singleWrongTerminate = !!dailyScoreConfig.singleWrongTerminate;
    dailyScoreConfig.allowResume = !!dailyScoreConfig.allowResume;
    dailyScoreConfig.dailyScoreRule = 'highest';
}
function setDailyScoreField(key, val) {
    if (key === 'maxDailyAttempts') dailyScoreConfig.maxDailyAttempts = Number(val) === 0 ? 0 : Math.max(1, Number(val) || 1);
    else if (key === 'qualifiedStatsEnabled') dailyScoreConfig.qualifiedStatsEnabled = !!val;
    else if (key === 'qualifiedQuestions') {
        dailyScoreConfig.qualifiedQuestions = Math.max(1, Math.floor(Number(val) || 1));
        dailyScoreConfig.qualifiedQuestionsTouched = true;
    }
    else if (key === 'singleWrongTerminate') dailyScoreConfig.singleWrongTerminate = !!val;
    else if (key === 'allowResume') dailyScoreConfig.allowResume = !!val;
    else dailyScoreConfig[key] = val;
    normalizeDailyScoreConfig();
    if (quizStep === 1 || quizStep === 3 || quizStep === 5) rerenderMain();
    refreshFsModal();
}

function getDailyQuestionTimeLimit() {
    return Math.max(5, Number(dailyTimeConfig.timeLimitSeconds) || 30);
}

function setDailyQuestionTimeLimit(value) {
    const seconds = Math.max(5, Number(value) || 30);
    dailyTimeConfig.timeLimitSeconds = seconds;
    dailyTimeConfig.timeLimitEnabled = true;
    syncDailyQuestionTimeLimit(seconds);
    if (quizStep === 1 || quizStep === 3 || quizStep === 5) rerenderMain();
    refreshFsModal();
}

function syncDailyQuestionTimeLimit(seconds = getDailyQuestionTimeLimit()) {
    const nextSeconds = Math.max(5, Number(seconds) || 30);
    const applyToRules = rules => (rules || []).forEach(rule => { rule.timeLimitSeconds = nextSeconds; });
    applyToRules(dailyBatchRuleTemplate);
    applyToRules(dailyRandomRules);
    applyToRules(dailyBatchDraftRules);
    (dailyFixedConfig.days || []).forEach(day => {
        applyToRules(day.randomRules);
        (day.questions || []).forEach(question => { question.timeLimitSeconds = nextSeconds; });
    });
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
    normalizeDailyPointsConfig();
    syncDailyDateConfigsWithOpenRange();
    const activeDailySource = {
        mode: 'daily-by-date',
        batchRules: dailyRandomRules.map(rule => ({ ...rule })),
        fixedConfig: {
            days: dailyFixedConfig.days.map(day => ({
                date: day.date,
                theme: day.theme,
                isOpen: day.isOpen !== false,
                hasFixedPaper: !!(day.hasFixedPaper || (day.questions || []).length),
                hasBatchRule: !!day.hasBatchRule,
                randomRules: cloneDailyPlanRules(day.randomRules || []),
                questions: cloneDailyFixedQuestions(day.questions),
                qualifiedQuestions: getDailyFixedQualifiedQuestions(day),
                qualifiedQuestionsTouched: !!day.qualifiedQuestionsTouched
            }))
        }
    };
    const draft = {
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
                enabled: !!setting.scoreEnabled,
                displayLimit: setting.displayLimit,
                unitLeaderboard: {
                    enabled: !!setting.unitEnabled,
                    columns: ['单位名称', '省份', '参与人数', '排名'],
                    displayLimit: setting.unitDisplayLimit
                }
            }
        ])),
            scoring: {
            totalScore: quizTotalScore,
            dailySource: activeDailySource,
            dailyTime: { ...dailyTimeConfig },
            dailyScore: { ...dailyScoreConfig },
            levelRules: levels.map(level => ({
                name: level.name,
                totalScore: level.totalScore,
                timeLimitSeconds: getLevelQuestionTimeLimit(level),
                passScore: level.passScore,
                passQuestions: getLevelPassQuestions(level),
                maxAttempts: getLevelMaxAttempts(level),
                rules: getLevelRules(level).map(rule => ({ ...rule })),
                fixedQuestions: getLevelFixedQuestions(level).map(question => ({ ...question })),
                validation: getLevelQuestionMode(level) === 'fixed'
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
            },
            dailyPoints: JSON.parse(JSON.stringify(dailyPointsConfig))
        }
    };
    draft.rewards.dailyPoints.share.daily_reward_score = draft.rewards.dailyPoints.share.points;
    draft.rewards.dailyPoints.share.daily_reward_count = draft.rewards.dailyPoints.share.maxDailyTimes;
    return draft;
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
    if (typeof openExamPublishConfirm === 'function') {
        openExamPublishConfirm();
        return;
    }
    openQuizExamPublishConfirmFallback();
}

function openQuizExamPublishConfirmFallback() {
    if (typeof openModal !== 'function') {
        alert('请先确认配置信息后再发布活动。');
        return;
    }

    openModal('配置信息确认', renderQuizExamPublishConfirmFallback(), () => {
        if (!document.getElementById('examPublishAgreement')?.checked) {
            const tip = document.getElementById('examPublishAgreementTip');
            if (tip) tip.textContent = '请先阅读并同意相关协议及管理规范';
            return false;
        }
        openModal('发布成功', '<p>在线考试活动已发布。用户端将按当前配置开放报名与答题入口。</p>', () => navigateTo('quiz-activity-list'), {
            hideCancel: true,
            confirmText: '返回活动列表',
            modalClass: 'modal-md'
        });
        return false;
    }, {
        confirmText: '发布活动',
        cancelText: '取消',
        modalClass: 'modal-xl exam-publish-confirm-modal'
    });
    setupQuizExamPublishAgreementFallback();
}

function setupQuizExamPublishAgreementFallback() {
    const foot = document.getElementById('modalFoot');
    const confirmBtn = document.getElementById('modalConfirm');
    if (!foot || !confirmBtn) return;

    if (!document.getElementById('examPublishAgreementWrap')) {
        foot.insertAdjacentHTML('afterbegin', `
            <div class="exam-publish-agreement-wrap" id="examPublishAgreementWrap">
                <label class="exam-publish-agreement">
                    <input type="checkbox" id="examPublishAgreement">
                    <span>已阅读并同意 <a href="javascript:void(0)">《阅途文遇活动发布与管理规范》</a></span>
                </label>
                <div class="exam-publish-agreement-tip" id="examPublishAgreementTip"></div>
            </div>
        `);
    }

    const checkbox = document.getElementById('examPublishAgreement');
    if (!checkbox) return;

    const sync = () => {
        const checked = checkbox.checked;
        confirmBtn.disabled = !checked;
        confirmBtn.classList.toggle('is-disabled', !checked);
        const tip = document.getElementById('examPublishAgreementTip');
        if (tip && checked) tip.textContent = '';
    };

    checkbox.onchange = sync;
    sync();
}

function renderQuizConfirmRowsFallback(rows) {
    return rows.map(row => `
        <div class="exam-confirm-row">
            <div class="exam-confirm-label">${row.label}</div>
            <div class="exam-confirm-value">${row.value}</div>
        </div>
    `).join('');
}

function renderQuizConfirmRulesFallback(rules) {
    return rules.map(rule => `
        <div class="exam-rule-item">
            <span class="exam-rule-check">✓</span>
            <div><strong>${rule.title}</strong><span>${rule.desc}</span></div>
        </div>
    `).join('');
}

function renderQuizConfirmEditButtonFallback() {
    return '<button type="button" class="exam-confirm-edit" disabled title="暂不支持跳转修改">修改</button>';
}

function renderQuizExamPublishConfirmFallback() {
    const sections = [
        { step: 1, key: 'basic', title: '基本信息' },
        { step: 2, key: 'intro', title: '活动介绍' },
        { step: 3, key: 'signupAnswer', title: '报名/答题' },
        { step: 4, key: 'appearance', title: '外观装修' },
        { step: 5, key: 'other', title: '其他设置（可选）' }
    ];
    const firstGroup = (groups || [])[0] || {};
    const activityTitle = quizActivityName || '知识问答活动';
    const confirmLeaderboardTitle = getLeaderboardRuleConfig(firstGroup.quizMode || quizActivityMode).title;

    return `
    <div class="exam-confirm-shell">
        <div class="exam-confirm-note">
            <strong>请在发布前确认以下配置。</strong>
            <span>活动发布后，活动模式、所选试卷、考试开放时间、答题次数等关键字段将影响用户参与，请确认无误后发布。</span>
        </div>
        <div class="exam-confirm-layout">
            <div class="exam-confirm-content">
                <section class="exam-confirm-section" id="examConfirmBasic">
                    <div class="exam-confirm-section-head">
                        <h4>基本信息</h4>
                        ${renderQuizConfirmEditButtonFallback()}
                    </div>
                    ${renderQuizConfirmRowsFallback([
                        { label: '活动名称', value: activityTitle },
                        { label: '活动模式', value: '<span class="badge badge-blue">在线考试</span>' },
                        { label: '活动分类', value: `知识问答-${getQuizCreateModeTitle()}` },
                        { label: '活动状态', value: '未发布' }
                    ])}
                    <div class="confirm-chip-row"><span>赛事</span><span>读书</span><span>线上活动</span><span>活动报名</span><span>全国性活动</span><span>${getQuizUnitRoleOption().label}</span></div>
                    <div class="confirm-preview-grid">
                        <div class="confirm-preview-card"><strong>报名时间</strong><span>${quizSignupStart || '2026-06-01 09:00'} 至 ${quizSignupEnd || '2026-06-08 18:00'}</span></div>
                        <div class="confirm-preview-card"><strong>组织机构</strong>${quizOrgUnits.map(unit => `<span>${unit.type}：${unit.name || '已配置单位名称'}</span>`).join('')}</div>
                    </div>
                </section>

                <section class="exam-confirm-section" id="examConfirmIntro">
                    <div class="exam-confirm-section-head">
                        <h4>活动介绍</h4>
                        ${renderQuizConfirmEditButtonFallback()}
                    </div>
                    <div class="confirm-rich-list">
                        <div><strong>活动背景</strong><p>围绕华服文化、传统礼仪、典籍阅读与图书馆业务知识，组织线上线下结合的知识挑战活动，帮助参与者在答题中了解中华优秀传统文化。</p></div>
                        <div><strong>活动对象</strong><p>面向全国图书馆从业者、阅读推广志愿者、高校学生及传统文化爱好者开放参与。</p></div>
                        <div><strong>规则说明</strong><p>参与者完成报名后进入在线考试。系统按固定试卷出题，达到及格线即视为通过；活动结束后按成绩生成排行榜。</p></div>
                    </div>
                </section>

                <section class="exam-confirm-section" id="examConfirmSignupAnswer">
                    <div class="exam-confirm-section-head">
                        <h4>报名/答题</h4>
                        ${renderQuizConfirmEditButtonFallback()}
                    </div>
                    <div class="confirm-group-card">
                        <div class="confirm-group-head"><strong>${firstGroup.name || '组别一'}</strong><span class="badge badge-green">已配置</span><em>配置进度 2/2</em></div>
                        <div class="confirm-preview-grid">
                            <div class="confirm-preview-card"><strong>报名表</strong><span>字段：姓名、手机号、单位、职务、所在地区</span><span>实名信息与提交规则已配置</span></div>
                            <div class="confirm-preview-card"><strong>答题配置</strong><span>在线考试 · 固定试卷 · 限时作答</span><span>考试开放时间：2026-06-09 09:00 至 2026-06-09 18:00 <span class="locked-tag">锁定</span></span></div>
                        </div>
                    </div>
                    <div class="exam-paper-confirm-card">
                        <div class="exam-paper-confirm-title">在线考试试卷 <span class="badge badge-green">固定题目</span></div>
                        <div class="exam-paper-confirm-grid"><span>题目数量：${firstGroup.quizQCount || 50}</span><span>试卷总分：${firstGroup.quizTotal || 100}</span><span>题型组成：按所选试卷配置</span><span>状态：待发布引用</span></div>
                    </div>
                    ${renderQuizConfirmRowsFallback([
                        { label: '考试时长', value: `${examConfig.duration || 60} 分钟 <span class="locked-tag">锁定</span>` },
                        { label: '答题次数', value: (firstGroup.quizAttemptsText || '每人 1 次') + '；达到次数上限后不可再次开始考试' },
                        { label: '及格分数', value: '60 分 <span class="locked-tag">锁定</span>' },
                        { label: '解析展示时机', value: '交卷后立即展示解析' },
                        { label: '报名须知', value: '已配置报名须知、参与说明和注意事项' }
                    ])}
                </section>

                <section class="exam-confirm-section" id="examConfirmAppearance">
                    <div class="exam-confirm-section-head">
                        <h4>外观装修</h4>
                        ${renderQuizConfirmEditButtonFallback()}
                    </div>
                    <div class="confirm-appearance-grid">
                        <div class="confirm-theme-card"><strong>主题色 / 背景色</strong><div><i style="background:#00527a"></i><i style="background:#6fd5e5"></i></div><span>已选择蓝绿色活动主题</span></div>
                        <div class="confirm-cover-card"><strong>封面图</strong><div>文脉之光</div><span>16:9 活动封面已配置</span></div>
                    </div>
                    <div class="confirm-nav-preview">
                        <strong>导航显隐</strong>
                        <span>活动首页 <em>必选</em></span><span>排行榜：${confirmLeaderboardTitle}，展示前 100 名；单位报名人数排行榜，展示前 100 名</span><span>活动动态：已开启</span><span>资源推荐：已开启</span>
                    </div>
                    <div class="confirm-logo-row"><strong>LOGO配置</strong><span class="confirm-logo-box">阅途文遇<small>www.yuetu100.com</small></span><em>跳转：https://www.yuetu100.com · 居左展示</em></div>
                </section>

                <section class="exam-confirm-section" id="examConfirmOther">
                    <div class="exam-confirm-section-head">
                        <h4>其他设置（可选）</h4>
                        ${renderQuizConfirmEditButtonFallback()}
                    </div>
                    <div class="confirm-shortcut-list">
                        <div><strong>资料下载</strong><span>附件下载 · 资料数量：3 · 已配置</span></div>
                        <div><strong>问题答疑</strong><span>查看文本 · 已配置</span></div>
                    </div>
                    <div class="confirm-official-group">
                        <strong>官方活动群</strong>
                        <span>群二维码、弹窗标题、弹窗文案均已配置</span>
                        <em>弹窗标题：扫码加入官方活动群</em>
                        <em>弹窗文案：保存二维码图片，微信扫一扫添加</em>
                    </div>
                    <div class="exam-rule-list confirm-rule-list">
                        ${renderQuizConfirmRulesFallback([
                            { title: '断点续答', desc: getExamResumeConfirmText() === '否' ? '未开启，用户重新进入考试时需按当前考试规则继续。' : '已开启的场次支持恢复上次退出时的答题进度，已填写内容自动保留，退出期间不计入答题时长。' },
                            { title: '超时自动交卷', desc: '考试时长耗尽后，系统自动提交试卷。' },
                            { title: '允许跳题', desc: '考生可跳过当前题目，稍后返回作答。' },
                            { title: '显示答题卡', desc: '展示题目作答状态，方便定位未答题目。' },
                            { title: '支持提前交卷', desc: '答题未满时长也可主动提交试卷。' }
                        ])}
                    </div>
                </section>
            </div>
            <aside class="exam-confirm-nav">
                <h4>配置项一览</h4>
                ${sections.map((section, idx) => `
                    <a href="#examConfirm${section.key.charAt(0).toUpperCase() + section.key.slice(1)}" class="${idx === 0 ? 'active' : ''}">
                        <span>${section.step}</span>${section.title}${idx < sections.length - 1 ? '<em>»</em>' : ''}
                    </a>
                `).join('')}
            </aside>
        </div>
    </div>`;
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

// ---- Paper Selection / Config Modal ----
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
        examConfig.selectedPaper = clonePaperForConfig(paper);
    } else if (typeof paperDrawerTarget === 'string' && paperDrawerTarget.startsWith('phase-')) {
        // Unified phase paper slot
        const phaseIdx = parseInt(paperDrawerTarget.replace('phase-', ''), 10);
        const phase = phasedConfig.phases[phaseIdx];
        if (!phase) return;
        phase.paper = clonePaperForConfig(paper);
        phase.configured = true;
    } else if (typeof paperDrawerTarget === 'string' && paperDrawerTarget.startsWith('daily-exam-')) {
        const dayIdx = parseInt(paperDrawerTarget.replace('daily-exam-', ''), 10);
        const day = dailyExamConfig.papers?.[dayIdx];
        if (!day) return;
        day.paper = clonePaperForConfig(paper);
        day.configured = true;
        dailyExamCurrentIdx = dayIdx;
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

    const phaseIdx = typeof paperDrawerTarget === 'string' && paperDrawerTarget.startsWith('phase-')
        ? parseInt(paperDrawerTarget.replace('phase-', ''), 10)
        : -1;
    const phase = phaseIdx >= 0 ? phasedConfig.phases[phaseIdx] : null;
    const dailyExamIdx = typeof paperDrawerTarget === 'string' && paperDrawerTarget.startsWith('daily-exam-')
        ? parseInt(paperDrawerTarget.replace('daily-exam-', ''), 10)
        : -1;
    const dailyExamDay = dailyExamIdx >= 0 ? dailyExamConfig.papers?.[dailyExamIdx] : null;
    const activeTab = phasedPaperDrawerTab === 'create' ? 'create' : 'select';
    const createMountId = 'phasePaperEditorMount';
    const createEditor = activeTab === 'create'
        ? `<div id="${createMountId}" class="pd-paper-editor-mount"></div>`
        : '';
    if (activeTab === 'create') {
        queueMicrotask(() => {
            const host = document.getElementById(createMountId);
            if (host) {
                openPaperEditor(null, {
                    mountId: createMountId,
                    embedded: true,
                    afterSave: (paper) => {
                        if (!paper) return;
                        if (phase) {
                            phase.paper = clonePaperForConfig(paper);
                            phase.configured = true;
                        }
                        if (dailyExamDay) {
                            dailyExamDay.paper = clonePaperForConfig(paper);
                            dailyExamDay.configured = true;
                            dailyExamCurrentIdx = dailyExamIdx;
                        }
                        closePaperDrawer();
                    }
                });
            }
        });
    }

    return `
    <div class="pd-overlay show" onclick="closePaperDrawer()">
        <div class="pd-dialog" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
            <button class="pd-close pd-close-floating" onclick="closePaperDrawer()">✕</button>
            <div class="pd-body">
                ${activeTab === 'create'
                    ? createEditor || '<div class="pd-empty">正在载入试卷编辑器...</div>'
                    : (rows || '<div class="pd-empty">暂无可选试卷。请先在「试卷管理」中创建并启用试卷。</div>')}
            </div>
        </div>
    </div>`;
}

// ===============================
// DAILY MODE CONFIG (每日练习)
// ===============================
function renderDailyModeConfig() {
    normalizeDailyScoreConfig();
    dailyQMode = 'random';
    return `
    <!-- 1. 题目来源 -->
    <div class="cfg-panel" id="dailyQSource">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('dailyQSource')">
            <div class="cfg-panel-icon green">📄</div>
            <div class="daily-panel-title-wrap">
                <div class="cfg-panel-title">每日答题配置</div>
                <div class="cfg-panel-subtitle">系统将按开放日期自动生成日历；可先批量配置随机抽题规则，再为单日设置抽题规则、固定题目或开放状态。</div>
            </div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            <div class="daily-panel-body-action">
                <button type="button" class="btn btn-primary daily-batch-config-btn" onclick="openDailyBatchRuleModal()">批量配置抽题规则</button>
            </div>
            ${renderDailyDayConfigContent()}
        </div>
    </div>
    <!-- 4. 默认规则 -->
    <div class="cfg-panel" id="dailyDefaultRules">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('dailyDefaultRules')">
            <div class="cfg-panel-icon purple">📋</div>
            <div><div class="cfg-panel-title">默认答题规则<span class="cfg-panel-title-note">//仅研发人员可见</span></div><div class="cfg-panel-subtitle">系统默认实现，管理员无需配置</div></div>
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
                '每人每天可答多次时，每日答题成绩取最高分。',
                '完成一次“每日答题”后自动展示成绩。'
            ])}
        </div>
    </div>
    `;
}

function renderDailyTimeFields({ compact = false, context = 'modal' } = {}) {
    return `
        <div class="cfg-row ${compact ? 'daily-time-inline-row' : ''}">
            <div class="cfg-row-label"><span class="req">*</span> 答题开放日期</div>
            <div class="cfg-row-control">
                <div class="date-range-control">
                    <input type="date" class="form-control" value="${getDateOnlyValue(dailyTimeConfig.startTime)}" onchange="setDailyTimeField('startTime',this.value,'${context}')">
                    <span style="color:var(--text-tertiary)">至</span>
                    <input type="date" class="form-control" value="${getDateOnlyValue(dailyTimeConfig.endTime)}" onchange="setDailyTimeField('endTime',this.value,'${context}')">
                </div>
                <div class="cfg-row-hint">固定题目模式会根据开放日期范围生成需要配置的每日题目日期。</div>
            </div>
        </div>
        <div class="cfg-row ${compact ? 'daily-time-inline-row' : ''}">
            <div class="cfg-row-label"><span class="req">*</span> 答题时段</div>
            <div class="cfg-row-control">
                <div class="date-range-control">
                    <input type="time" class="form-control" value="${dailyTimeConfig.dailyStart || ''}" onchange="setDailyTimeField('dailyStart',this.value,'${context}')">
                    <span style="color:var(--text-tertiary)">至</span>
                    <input type="time" class="form-control" value="${dailyTimeConfig.dailyEnd || ''}" onchange="setDailyTimeField('dailyEnd',this.value,'${context}')">
                </div>
                <div class="cfg-row-hint">用户每天仅可在该时段内进入答题。</div>
            </div>
        </div>
        `;
}

function renderDailyRandomSourceContent() {
    return `
            ${renderDailyQuestionRuleNotice(dailyRandomRules)}
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 随机抽题规则</div>
                <div class="cfg-row-control">
                    <div id="dailyRandomDrawRules">
                        ${dailyRandomRules.map((rule, idx) => renderScoreDrawRuleRow(rule, idx, 'daily', dailyRandomRules.length)).join('')}
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:8px;border-top:1px solid var(--border-color-light)">
                        <button type="button" class="btn btn-outline btn-sm" onclick="addDailyRandomRule()">+ 新增抽题规则</button>
                        <div style="font-size:12px;color:var(--text-tertiary)">每日题目数量：<strong style="color:var(--primary)">${getRuleQuestionCount(dailyRandomRules)}</strong> 题</div>
                    </div>
                    <div class="info-box yellow" style="margin-top:8px">⚠ 每日答题仅支持标准答案题：单选题、多选题、判断题、填空题、排序题，至少配置 1 条抽题规则。</div>
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

function renderDailyDayConfigContent() {
    syncDailyDateConfigsWithOpenRange();
    const days = getDailyConfigDays();
    const current = days[dailyFixedCurrentIdx] || days[0];
    const batchState = getScoreValidationState(dailyRandomRules);
    const batchAppliedCount = days.filter(day => getDailyDateStatus(day).key === 'batch').length;
    const calendarCells = getDailyCalendarCells(days);
    const monthSummary = getDailyCalendarStatusSummary(days);
    const batchMeta = { batchState, batchAppliedCount };
    const openStart = getDateOnlyValue(dailyTimeConfig.startTime);
    const openEnd = getDateOnlyValue(dailyTimeConfig.endTime);
    return `
        <div class="daily-config-shell">
            <div class="daily-config-calendar">
                <div class="daily-config-calendar-head">
                    <div>
                        <div class="daily-plan-calendar-title">开放日期日历</div>
                        <div class="daily-plan-calendar-subtitle">答题开放日期：${openStart ? formatDateLabel(openStart) : '未设置'} 至 ${openEnd ? formatDateLabel(openEnd) : '未设置'}</div>
                        <div class="daily-plan-calendar-subtitle">共 ${days.length} 天 · 来源于答题时间配置的开放日期范围</div>
                    </div>
                    <div class="daily-calendar-summary">
                        <strong>${monthSummary.configured}</strong>
                        <span>已配置</span>
                    </div>
                </div>
                <div class="daily-calendar-month">
                    <span>‹</span>
                    <strong>${getDailyCalendarMonthTitle(days)}</strong>
                    <span>›</span>
                </div>
                <div class="daily-calendar-weekdays">
                    <span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span>
                </div>
                <div class="daily-calendar-grid">
                    ${calendarCells.map(cell => cell.type === 'day'
                        ? renderDailyCalendarCard(cell.day, cell.idx)
                        : `<span class="daily-calendar-placeholder">${parseDateOnly(cell.date)?.getDate() || ''}</span>`).join('')}
                </div>
                <div class="daily-calendar-counts">
                    <span><strong>${monthSummary.batch}</strong> 随机抽题</span>
                    <span><strong>${monthSummary.fixed}</strong> 固定题目</span>
                    <span><strong>${monthSummary.empty}</strong> 未配置</span>
                    <span><strong>${monthSummary.closed}</strong> 不开放</span>
                </div>
                <div class="daily-calendar-legend">
                    <span><i class="legend-dot batch"></i>已应用随机抽题规则</span>
                    <span><i class="legend-dot fixed"></i>已添加固定题目</span>
                    <span><i class="legend-dot empty"></i>未配置（默认状态）</span>
                    <span><i class="legend-dot closed"></i>当天不开放答题</span>
                </div>
            </div>
            <div class="daily-config-detail">
                ${current ? renderDailyConfigActionHeader(current, batchMeta) : ''}
                ${current ? renderDailySingleDayPanel(current) : '<div class="daily-fixed-empty">请先在基本信息中配置开放日期范围。</div>'}
            </div>
        </div>`;
}

function renderDailyConfigActionHeader(day, { batchState, batchAppliedCount }) {
    const status = getDailyDateStatus(day);
    const modeText = status.key === 'fixed'
        ? '每日固定题目'
        : status.key === 'batch'
            ? '随机抽题规则'
            : status.key === 'closed'
                ? '不开放'
                : '未配置';
    return `
        <div class="daily-config-current">
            <div class="daily-config-current-main">
                <div class="daily-config-kicker">当前配置日期</div>
                <div class="daily-config-current-date">${formatDateLabel(day.date)}</div>
            </div>
            <div class="daily-current-side">
                <label class="daily-open-inline">
                    <span>当天开放答题</span>
                    <span class="switch"><input type="checkbox" ${day.isOpen === false ? '' : 'checked'} onchange="toggleDailyConfigDayOpen(this.checked)"><span class="sw-slider"></span></span>
                </label>
            </div>
        </div>
        `;
}

function getDailyConfigDays() {
    return dailyFixedConfig.days || [];
}

function syncDailyDateConfigsWithOpenRange() {
    const start = getDateOnlyValue(dailyTimeConfig.startTime);
    const end = getDateOnlyValue(dailyTimeConfig.endTime);
    const dates = getDateRangeList(start, end);
    if (!dates.length) return;
    const existing = new Map((dailyFixedConfig.days || []).map(day => [day.date, day]));
    dailyFixedConfig.days = dates.map((date, idx) => {
        const old = existing.get(date) || {};
        const oldHasFixedPaper = old.hasFixedPaper === true || (old.questions || []).length > 0;
        const day = {
            date,
            theme: old.theme || `第${idx + 1}天：每日答题`,
            isOpen: old.isOpen !== false,
            hasBatchRule: old.hasBatchRule === true || (dailyBatchRuleApplied && !oldHasFixedPaper && old.isOpen !== false),
            hasFixedPaper: oldHasFixedPaper,
            randomRules: Array.isArray(old.randomRules) && old.randomRules.length ? cloneDailyPlanRules(old.randomRules) : [],
            questions: Array.isArray(old.questions) ? old.questions : [],
            qualifiedQuestions: old.qualifiedQuestions,
            qualifiedQuestionsTouched: !!old.qualifiedQuestionsTouched
        };
        normalizeDailyFixedQualifiedQuestions(day);
        return day;
    });
    dailyFixedCurrentIdx = Math.min(Math.max(0, dailyFixedCurrentIdx), dailyFixedConfig.days.length - 1);
}

function getDailyDateStatus(day) {
    if (!day || day.isOpen === false) return { key: 'closed', label: '不开放' };
    if (day.hasFixedPaper === true || (day.questions || []).length > 0) return { key: 'fixed', label: '固定题目' };
    if (day.hasBatchRule === true && getDailyDayRandomRules(day).length) return { key: 'batch', label: '随机抽题' };
    return { key: 'empty', label: '未配置' };
}

function getDailyCalendarStatusSummary(days) {
    const summary = { batch: 0, fixed: 0, empty: 0, closed: 0, configured: 0 };
    (days || []).forEach(day => {
        const key = getDailyDateStatus(day).key;
        summary[key] = (summary[key] || 0) + 1;
    });
    summary.configured = summary.batch + summary.fixed;
    return summary;
}

function getDailyCalendarCells(days) {
    const dates = days.map(day => day.date).filter(Boolean);
    if (!dates.length) return [];
    const first = parseDateOnly(dates[0]);
    const last = parseDateOnly(dates[dates.length - 1]);
    if (!first || !last) return days.map(day => ({ type: 'day', day }));
    const gridStart = new Date(first);
    const mondayOffset = (gridStart.getDay() + 6) % 7;
    gridStart.setDate(gridStart.getDate() - mondayOffset);
    const gridEnd = new Date(last);
    const sundayOffset = (7 - gridEnd.getDay()) % 7;
    gridEnd.setDate(gridEnd.getDate() + sundayOffset);
    const dayMap = new Map(days.map(day => [day.date, day]));
    const cells = [];
    for (let d = new Date(gridStart); d <= gridEnd; d.setDate(d.getDate() + 1)) {
        const dateText = formatDateOnly(d);
        cells.push(dayMap.has(dateText)
            ? { type: 'day', day: dayMap.get(dateText), idx: days.findIndex(day => day.date === dateText) }
            : { type: 'placeholder', date: dateText });
    }
    return cells;
}

function getDailyCalendarMonthTitle(days) {
    const firstDate = parseDateOnly(days[0]?.date);
    if (!firstDate) return '开放日期';
    return `${firstDate.getFullYear()} 年 ${firstDate.getMonth() + 1} 月`;
}

function renderDailyCalendarCard(day, idx) {
    const status = getDailyDateStatus(day);
    const date = parseDateOnly(day.date);
    const title = `${status.label}；规则类型：${status.label}；题目数量：${getDailyDayQuestionCount(day)}；是否开放：${day.isOpen === false ? '否' : '是'}`;
    return `
        <button type="button" class="daily-calendar-card ${status.key} ${idx === dailyFixedCurrentIdx ? 'active' : ''}" onclick="selectDailyConfigDay(${idx})" title="${title}">
            <span class="daily-calendar-date">${date ? date.getDate() : formatDailyShortDate(day.date)}</span>
            <span class="daily-calendar-status">${status.label}</span>
        </button>`;
}

function renderDailySingleDayPanel(day) {
    const status = getDailyDateStatus(day);
    const questions = day.questions || [];
    const totalQuestions = getDailyFixedDayQuestionCount(day);
    const totalScore = getDailyFixedDayScore(day);
    const dayRandomRules = getDailyDayRandomRules(day);
    const randomState = getDailyDayRandomRuleNoticeState(dayRandomRules);
    const fixedNoticeState = getDailyFixedQuestionNoticeState(day);
    const currentValidation = day.isOpen === false
        ? { state: 'closed', current: 0, target: 0 }
        : getDailyFixedDayValidationState(day, dailyFixedCurrentIdx, getDailyTimeValidationState());
    const currentNoticeClass = day.isOpen === false ? 'warn' : fixedNoticeState.state === 'ok' ? 'ok' : 'warn';
    return `
        <div class="daily-single-panel">
            ${day.isOpen === false ? '' : `<div class="daily-mode-radio-group" role="radiogroup" aria-label="当天题目配置方式">
                <label class="daily-mode-radio ${status.key === 'batch' ? 'active' : ''}">
                    <input type="radio" name="dailyMode-${dailyFixedCurrentIdx}" ${status.key === 'batch' ? 'checked' : ''} onchange="setDailyConfigDayMode('batch')">
                    <span>随机抽题</span>
                </label>
                <label class="daily-mode-radio ${status.key === 'fixed' ? 'active' : ''}">
                    <input type="radio" name="dailyMode-${dailyFixedCurrentIdx}" ${status.key === 'fixed' ? 'checked' : ''} onchange="setDailyConfigDayMode('fixed')">
                    <span>固定题目</span>
                </label>
            </div>`}
            ${renderDailyModeActionBar(status, questions)}
            ${day.isOpen === false ? `
                <div class="info-box yellow" style="margin-top:12px">当天已设置为不开放，用户无法进入答题；该日期不参与随机抽题或固定题计算。</div>
            ` : status.key === 'batch' ? `
                <div class="score-rule-notice ${randomState.state === 'ok' ? 'ok' : randomState.state === 'qualified-over' ? 'error' : 'warn'}" style="margin-top:12px">
                    <div class="score-rule-notice-head"><strong>每日题目数：${randomState.target || '-'} 题；已配置：${randomState.current || 0} 题</strong><span>${randomState.state === 'ok' ? '校验通过' : '待调整'}</span></div>
                    <p>当天使用随机抽题规则，系统按下方规则从题库抽题。</p>
                </div>
                <div class="daily-plan-rule-head">
                    <strong>当天随机抽题规则</strong>
                </div>
                <div class="daily-plan-rules">
                    ${dayRandomRules.map((rule, i) => dailyConfigDayRandomRuleHtml(rule, i, dayRandomRules.length)).join('')}
                </div>
            ` : questions.length ? `
                <div class="score-rule-notice ${currentNoticeClass}" style="margin-top:12px">
                    <div class="score-rule-notice-head"><strong>每日题目数：${fixedNoticeState.target || '-'} 题；已配置：${fixedNoticeState.current || 0} 题</strong><span>${fixedNoticeState.state === 'ok' ? '校验通过' : '待调整'}</span></div>
                    <p>保存固定题后会覆盖当天随机抽题规则。</p>
                </div>
                <div class="daily-plan-rule-head">
                    <strong>当天固定题目</strong>
                </div>
                <div class="daily-fixed-question-list">
                    ${questions.map((question, i) => dailyFixedQuestionRow(question, i, questions.length)).join('')}
                </div>
            ` : `
                <div class="daily-empty-state ${status.key}">
                    <strong>${status.key === 'batch' ? '当天将执行随机抽题规则' : '当天尚未配置题目规则'}</strong>
                    <span>${status.key === 'batch' ? '如需特殊处理，可为当天设置固定题或关闭开放。' : '可点击批量配置抽题规则，或为当天单独设置固定题。'}</span>
                </div>
            `}
        </div>`;
}

function renderDailyModeActionBar(status, questions) {
    if (status.key === 'closed') {
        return '';
    }
    if (status.key === 'batch') {
        return `
            <div class="daily-mode-actions">
                <button type="button" class="btn btn-primary btn-sm" onclick="addDailyConfigDayRandomRule()">+添加抽题规则</button>
            </div>`;
    }
    return `
        <div class="daily-mode-actions daily-mode-actions-fixed">
            <button type="button" class="btn btn-primary btn-sm" onclick="openDailyFixedSingleQuestionModal()">+添加题目</button>
            <button type="button" class="btn btn-outline btn-sm" onclick="openDailyFixedQuestionPicker()">+从题库选题</button>
            <button type="button" class="btn btn-outline btn-sm" onclick="saveDailySingleDayConfig()" ${questions.length ? '' : 'disabled'}>保存当天配置</button>
            <button type="button" class="btn btn-ghost btn-sm daily-clear-fixed-btn" onclick="clearDailyFixedQuestions()" ${questions.length ? '' : 'disabled'}>清除固定题</button>
        </div>`;
}

function formatDailyShortDate(dateText) {
    const parts = String(dateText || '').split('-');
    return parts.length === 3 ? `${parts[1]}-${parts[2]}` : dateText;
}

function getDailyDayQuestionCount(day) {
    if (day?.isOpen === false) return 0;
    if ((day?.questions || []).length) return getDailyFixedDayQuestionCount(day);
    if (day?.hasBatchRule) return getDailyDayRandomRules(day).reduce((sum, rule) => sum + (Number(rule.count) || 0), 0);
    return 0;
}

function getDailyDayRandomRules(day = dailyFixedConfig.days?.[dailyFixedCurrentIdx]) {
    if (!day) return [];
    if (!Array.isArray(day.randomRules) || !day.randomRules.length) {
        day.randomRules = cloneDailyPlanRules(dailyRandomRules.length ? dailyRandomRules : dailyBatchRuleTemplate);
        syncDailyQuestionTimeLimit();
    }
    return day.randomRules;
}

function dailyConfigDayRandomRuleHtml(rule, idx, total) {
    const bankOptions = ['图书馆知识题库', '历史文化题库', '非遗知识题库'].map(v => `<option ${v === rule.bank ? 'selected' : ''}>${v}</option>`).join('');
    const typeOptions = standardAnswerQuestionTypeOptions(rule.type || '全部标准答案题');
    const subtotal = (Number(rule.count) || 0) * (Number(rule.score) || 0);
    return `
        <div class="daily-random-rule-row">
            <div class="daily-random-rule-grid top">
                <div class="field-bank"><label>题库</label><select onchange="setDailyConfigDayRandomRuleField(${idx},'bank',this.value)">${bankOptions}</select></div>
                <div class="field-type"><label>题型</label><select onchange="setDailyConfigDayRandomRuleField(${idx},'type',this.value)">${typeOptions}</select></div>
                <div class="field-count"><label>抽题数量</label><input type="number" value="${rule.count}" min="1" onchange="setDailyConfigDayRandomRuleField(${idx},'count',this.value)"></div>
            </div>
            <div class="daily-random-rule-grid bottom">
                <div><label>每题分数</label><input type="number" value="${rule.score}" min="0.5" step="0.5" onchange="setDailyConfigDayRandomRuleField(${idx},'score',this.value)"></div>
                <div><label>小计</label><div class="daily-random-rule-subtotal">${subtotal} 分</div></div>
                <div><label>操作</label><button type="button" class="draw-rule-delete-btn" onclick="removeDailyConfigDayRandomRule(${idx})" title="删除本条规则" ${total <= 1 ? 'disabled' : ''}><span class="trash-icon" aria-hidden="true"></span></button></div>
            </div>
        </div>`;
}

// ===============================
// LEVEL MODE CONFIG (趣味闯关)
// ===============================
function renderLevelModeConfig() {
    return `
    <div class="level-layout">
        <!-- Left: Level List -->
        <div>
            ${renderLevelListPanel()}
        </div>

        <!-- Right: Level Config -->
        <div>
            ${renderLevelDetail()}
        </div>
    </div>`;
}

function renderLevelListPanel() {
    return `
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
                    <div class="lli-meta">${getLevelQuestionCount(lv)}题</div>
                </div>
                <span class="lli-status ${lv.configured ? 'configured' : 'unconfigured'}">${lv.configured ? '已配置' : '未配置'}</span>
                <div class="lli-actions">
                    <button class="lli-action-btn level-order-btn" onclick="event.stopPropagation();moveLevel(${i}, -1)" title="上移关卡" aria-label="上移关卡" ${i === 0 ? 'disabled' : ''}>↑</button>
                    <button class="lli-action-btn level-order-btn" onclick="event.stopPropagation();moveLevel(${i}, 1)" title="下移关卡" aria-label="下移关卡" ${i === levels.length - 1 ? 'disabled' : ''}>↓</button>
                    ${i === levelCurrentIdx ? `
                    <button class="lli-action-btn" onclick="event.stopPropagation();copyLevel()" title="复制当前关卡">⧉</button>
                    <button class="draw-rule-delete-btn" onclick="event.stopPropagation();deleteLevel()" title="删除当前关卡" aria-label="删除当前关卡" ${levels.length <= 1 ? 'disabled' : ''}><span class="trash-icon" aria-hidden="true"></span></button>
                    ` : ''}
                </div>
            </div>
        `).join('')}
    </div>`;
}

function renderLevelTimeFields({ context = 'modal' } = {}) {
    return `
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 闯关开放日期</div>
            <div class="cfg-row-control">
                <div class="date-range-control">
                    <input type="date" class="form-control" value="${getDateOnlyValue(levelConfig.startTime)}" onchange="setLevelConfigField('startTime', this.value, '${context}')">
                    <span>至</span>
                    <input type="date" class="form-control" value="${getDateOnlyValue(levelConfig.endTime)}" onchange="setLevelConfigField('endTime', this.value, '${context}')">
                </div>
                <div class="cfg-row-hint">用户仅可在该日期范围内进入闯关；进入后按关卡顺序解锁，无需为每关单独配置开放日期。</div>
            </div>
        </div>
        `;
}

function renderLevelDetail() {
    const lv = levels[levelCurrentIdx] || levels[0];
    normalizeLevelQuestionTimeLimit(lv);
    const rules = getLevelRules(lv);
    const fixedQuestions = getLevelFixedQuestions(lv);
    const questionMode = getLevelQuestionMode(lv);
    const questionNoticeState = getLevelQuestionNoticeState(lv);
    const questionNoticeClass = questionNoticeState.state === 'ok' ? 'ok' : 'warn';
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
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 本关题目数</div>
                <div class="cfg-row-control">
                    <div class="num-input"><input type="number" min="1" value="${getLevelTargetQuestionCount(lv) || ''}" onchange="setCurrentLevelField('questions', this.value)"><span class="unit">题</span></div>
                </div>
            </div>
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 每题答题时限</div>
                <div class="cfg-row-control">
                    <div class="num-input"><input type="number" min="5" step="1" value="${getLevelQuestionTimeLimit(lv)}" onchange="setCurrentLevelField('timeLimitSeconds', this.value)"><span class="unit">秒</span></div>
                </div>
            </div>
            <div class="cfg-row">
                <div class="cfg-row-label"><span class="req">*</span> 过关条件</div>
                <div class="cfg-row-control">
                    <div class="inline-control-text">用户答对 <input class="inline-number" type="number" min="0" max="${getLevelQuestionCount(lv)}" value="${getLevelPassQuestions(lv)}" onchange="setCurrentLevelField('passQuestions', this.value)"> 题过关</div>
                </div>
            </div>
            <div class="cfg-row">
                <div class="cfg-row-label">本关最多挑战次数 ${renderAttemptConsumeHelpTip('level')}</div>
                <div class="cfg-row-control">
                    <div class="daily-attempt-options">
                        <label class="daily-attempt-option ${getLevelMaxAttempts(lv) !== 0 ? 'active' : ''}">
                            <input type="radio" name="levelMaxAttemptsMode${levelCurrentIdx}" ${getLevelMaxAttempts(lv) !== 0 ? 'checked' : ''} onchange="setCurrentLevelField('maxAttempts', Math.max(1, Number(document.getElementById('levelMaxAttemptsInput${levelCurrentIdx}')?.value) || 1))">
                            <span>指定次数</span>
                        </label>
                        <label class="daily-attempt-option ${getLevelMaxAttempts(lv) === 0 ? 'active' : ''}">
                            <input type="radio" name="levelMaxAttemptsMode${levelCurrentIdx}" ${getLevelMaxAttempts(lv) === 0 ? 'checked' : ''} onchange="setCurrentLevelField('maxAttempts',0)">
                            <span>不限制次数</span>
                        </label>
                    </div>
                    ${getLevelMaxAttempts(lv) !== 0 ? `
                    <div class="daily-attempt-input-row">
                        <span>本关最多可挑战</span>
                        <div class="num-input"><input id="levelMaxAttemptsInput${levelCurrentIdx}" type="number" value="${getLevelMaxAttempts(lv) || 1}" min="1" onchange="setCurrentLevelField('maxAttempts', this.value)"><span class="unit">次</span></div>
                    </div>` : ''}
                </div>
            </div>
        </div>
	    </div>

    <div class="cfg-panel" id="levelQSource">
        <div class="cfg-panel-head" onclick="toggleCfgPanel('levelQSource')">
            <div class="cfg-panel-icon blue">📄</div>
            <div><div class="cfg-panel-title">本关题目配置</div><div class="cfg-panel-subtitle">${questionMode === 'fixed' ? '按本关配置固定题目' : '按本关配置抽题规则'}</div></div>
            <span class="cfg-panel-badge essential">必填</span>
            <span class="cfg-panel-arrow">▼</span>
        </div>
        <div class="cfg-panel-body">
            ${renderLevelQuestionConfigEntryCard(lv)}
        </div>
    </div>

    ${renderLevelPracticeConfigPanel(lv)}

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
                '断点续答：根据进入管理-更多功能中的“允许断点续答”配置执行。',
                '不允许跳题。'
            ])}
        </div>
    </div>`;
}

function renderLevelQuestionConfigEntryCard(level) {
    const mode = getLevelQuestionMode(level);
    const notice = getLevelQuestionNoticeState(level);
    const stateClass = notice.state === 'ok' ? 'ok' : 'warn';
    const rules = getLevelRules(level);
    const fixedQuestions = getLevelFixedQuestions(level);
    return `
        <div class="question-config-entry-card ${mode}" onclick="openQuestionConfigFullscreen('level')">
            <div class="question-config-entry-icon">+</div>
            <div class="question-config-entry-main">
                <div class="question-config-entry-title">${level.name || `第 ${levelCurrentIdx + 1} 关`} 题目配置</div>
                <div class="question-config-entry-desc">点击进入题目配置，可选择随机抽题或固定题目。</div>
                <div class="question-config-entry-meta">
                    <span class="phase-chip ${stateClass}">${notice.state === 'ok' ? '校验通过' : '待调整'}</span>
                    <span>${mode === 'fixed' ? '固定题目' : '随机抽题'}</span>
                    <span>${notice.current || 0}/${notice.target || '-'} 题</span>
                    <span>${mode === 'fixed' ? `${fixedQuestions.length} 道固定题` : `${rules.length} 条抽题规则`}</span>
                </div>
            </div>
            <button type="button" class="btn btn-primary btn-sm" onclick="event.stopPropagation();openQuestionConfigFullscreen('level')">题目配置</button>
        </div>`;
}

function renderLevelQuestionFullscreenEditor(level) {
    if (!level) return '<div class="daily-fixed-empty">请先添加关卡。</div>';
    normalizeLevelQuestionTimeLimit(level);
    return `
    <div class="level-question-inline-shell">
        <div class="cfg-panel level-question-inline-panel">
            <div class="cfg-panel-head">
                <div class="cfg-panel-icon blue">📄</div>
                <div><div class="cfg-panel-title">本关题目配置</div><div class="cfg-panel-subtitle">可选择随机抽题或固定题目。</div></div>
                <span class="cfg-panel-badge essential">必填</span>
            </div>
            <div class="cfg-panel-body">
                ${renderLevelQuestionSourceEditor(level)}
            </div>
        </div>
    </div>`;
}

function renderLevelQuestionSourceEditor(level) {
    const rules = getLevelRules(level);
    const fixedQuestions = getLevelFixedQuestions(level);
    const questionMode = getLevelQuestionMode(level);
    const questionNoticeState = getLevelQuestionNoticeState(level);
    const questionNoticeClass = questionNoticeState.state === 'ok' ? 'ok' : 'warn';
    return `
        <div class="daily-mode-radio-group" role="radiogroup" aria-label="本关配题方式">
            <label class="daily-mode-radio ${questionMode === 'random' ? 'active' : ''}">
                <input type="radio" name="levelQuestionMode-${levelCurrentIdx}" ${questionMode === 'random' ? 'checked' : ''} onchange="selectCurrentLevelQuestionMode('random')">
                <span>随机抽题</span>
            </label>
            <label class="daily-mode-radio ${questionMode === 'fixed' ? 'active' : ''}">
                <input type="radio" name="levelQuestionMode-${levelCurrentIdx}" ${questionMode === 'fixed' ? 'checked' : ''} onchange="selectCurrentLevelQuestionMode('fixed')">
                <span>固定题目</span>
            </label>
        </div>
        <div class="score-rule-notice ${questionNoticeClass}" style="margin-top:12px">
            <div class="score-rule-notice-head"><strong>本关题目数：${questionNoticeState.target || '-'} 题；已配置：${questionNoticeState.current || 0} 题</strong><span>${questionNoticeState.state === 'ok' ? '校验通过' : '待调整'}</span></div>
            <p>本关题目数用于约束本关抽题或固定题的总数，保存前请保持一致。</p>
        </div>
        ${questionMode === 'fixed' ? renderLevelFixedQuestionConfig(level, fixedQuestions) : `
            <div class="cfg-row">
                <div class="cfg-row-control">
                    <div class="daily-rules-topbar">
                        <button class="btn btn-outline btn-sm" onclick="addLevelDrawRule()">+ 新增抽题规则</button>
                    </div>
                    <div id="levelDrawRules">
                        ${rules.map((rule, idx) => renderScoreDrawRuleRow(rule, idx, 'level', rules.length)).join('')}
                    </div>
                    <div class="info-box yellow" style="margin-top:8px">⚠趣味闯关仅支持标准答案题：单选题、多选题、判断题、填空题、排序题，至少配置 1 条抽题规则。</div>
                </div>
            </div>
        `}`;
}

function renderLevelFixedQuestionConfig(level, questions) {
    return `
        <div class="cfg-row">
            <div class="cfg-row-control">
                <div class="daily-fixed-toolbar">
                    <button type="button" class="btn btn-primary btn-sm" onclick="openLevelFixedSingleQuestionModal()">+添加题目</button>
                    <button type="button" class="btn btn-outline btn-sm" onclick="openLevelFixedQuestionPicker()">+ 从题库选题</button>
                </div>
                <div class="daily-plan-rule-head">
                    <strong>当前关卡固定题目</strong>
                </div>
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
                <button type="button" class="draw-rule-delete-btn" onclick="removeLevelFixedQuestion(${idx})" title="删除本题" aria-label="删除本题" ${total <= 1 ? 'disabled' : ''}><span class="trash-icon" aria-hidden="true"></span></button>
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

function setLevelConfigField(field, value, context = 'modal') {
    levelConfig[field] = value;
    if (context === 'main') quizGoStep(1);
    else if (context === 'step3') rerenderMain();
}

function selectRadioPill(el, group) {
    const parent = el.parentElement;
    parent.querySelectorAll('.radio-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
}

function renderScoreDrawRuleRow(rule, idx, mode, total) {
    const bankOptions = ['图书馆知识题库', '历史文化题库', '非遗知识题库']
        .map(bank => `<option ${rule.bank === bank ? 'selected' : ''}>${bank}</option>`).join('');
    return `
    <div class="draw-rule draw-rule-with-subtotal">
        <div><label>题库</label><select onchange="setScoreDrawRuleField('${mode}',${idx},'bank',this.value)">${bankOptions}</select></div>
        <div><label>题型</label><select onchange="setScoreDrawRuleField('${mode}',${idx},'type',this.value)">${standardAnswerQuestionTypeOptions(rule.type || '全部标准答案题')}</select></div>
        <div><label>抽题数量</label><input type="number" value="${rule.count}" min="1" onchange="setScoreDrawRuleField('${mode}',${idx},'count',this.value)"></div>
        <div><label>操作</label><button type="button" class="draw-rule-delete-btn" onclick="removeScoreDrawRule('${mode}',${idx})" title="删除本条规则" aria-label="删除本条规则" ${total <= 1 ? 'disabled' : ''}><span class="trash-icon" aria-hidden="true"></span></button></div>
    </div>`;
}

function getScoreRuleList(mode) {
    return mode === 'level' ? getLevelRules() : dailyRandomRules;
}

function setScoreDrawRuleField(mode, idx, key, value) {
    const list = getScoreRuleList(mode);
    const rule = list[idx];
    if (!rule) return;
    if (key === 'timeLimitSeconds') rule[key] = value === '' ? '' : Math.max(5, Number(value) || 5);
    else rule[key] = (key === 'count' || key === 'score') ? Math.max(key === 'count' ? 1 : 0.5, Number(value) || (key === 'count' ? 1 : 0.5)) : value;
    if (mode === 'level') {
        const level = getCurrentLevel();
        if (level) level.questionMode = 'random';
    }
    refreshFsModal();
}

function removeScoreDrawRule(mode, idx) {
    const list = getScoreRuleList(mode);
    if (list.length <= 1) return;
    list.splice(idx, 1);
    if (mode === 'level') {
        const level = getCurrentLevel();
        if (level) level.questionMode = 'random';
    }
    refreshFsModal();
}

function addDailyRandomRule() {
    dailyRandomRules.push({ bank: '图书馆知识题库', type: '全部标准答案题', count: 10, timeLimitSeconds: getDailyQuestionTimeLimit(), score: 1 });
    refreshFsModal();
}

function selectDailyQMode(mode) {
    dailyQMode = mode === 'fixed' ? 'fixed' : 'random';
    if (dailyQMode === 'fixed') normalizeDailyFixedConfig();
    refreshFsModal();
}

function setDailyTimeField(key, value, context = 'modal') {
    if (key === 'timeLimitEnabled') dailyTimeConfig[key] = !!value;
    else if (key === 'timeLimitSeconds') {
        dailyTimeConfig[key] = Math.max(5, Number(value) || 30);
        dailyTimeConfig.timeLimitEnabled = true;
        syncDailyQuestionTimeLimit(dailyTimeConfig[key]);
    }
    else dailyTimeConfig[key] = value;
    refreshDailyTimeConfigView(context);
}

function setDailyFixedTimeRangeField(key, value, context = 'modal') {
    const nextValue = getDatePartFromDateTime(value);
    const previous = getDatePartFromDateTime(dailyTimeConfig[key]);
    if (previous === nextValue) return;
    const nextTimeConfig = { ...dailyTimeConfig, [key]: nextValue };
    const impact = getDailyFixedTimeRangeImpact(nextTimeConfig);
    const applyChange = () => {
        dailyTimeConfig[key] = nextValue;
        dailyQMode = 'fixed';
        refreshDailyTimeConfigView(context);
    };
    if (!impact.hasImpact) {
        applyChange();
        return;
    }
    if (!impact.hasImpact) {
        applyChange();
        return;
    }
    openModal('确认修改答题开放日期', `
        <div class="info-box yellow">
            <strong>修改答题开放日期会影响已配置的每日固定题目日期计划。</strong>
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
    refreshDailyTimeConfigView(context);
}

function refreshDailyTimeConfigView(context = 'modal') {
    if (context === 'main') quizGoStep(1);
    else if (context === 'step3') rerenderMain();
    else refreshFsModal();
}

function getDatePartFromDateTime(value) {
    if (!value) return '';
    return String(value).slice(0, 10);
}

function getDateTimeLocalValue(value, fallbackTime = '00:00') {
    if (!value) return '';
    const text = String(value).trim();
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(text)) return text.slice(0, 16);
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(text)) return text.slice(0, 16).replace(' ', 'T');
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return `${text}T${fallbackTime || '00:00'}`;
    return text.slice(0, 16);
}

function formatDateTimeLocalForStorage(value) {
    return getDateTimeLocalValue(value).replace('T', ' ');
}

function getDateOnlyValue(value) {
    return getDatePartFromDateTime(value);
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
    if ((Number(dailyTimeConfig.timeLimitSeconds) || 0) < 5) {
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
        alert('请先配置正确的答题开放日期');
        return;
    }
    const days = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateText = formatDateOnly(d);
        const day = {
            date: dateText,
            theme: buildNextDailyPlanTheme('每日答题', days.length + 1, dateText),
            questions: []
        };
        normalizeDailyFixedQualifiedQuestions(day);
        days.push(day);
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
        timeLimitSeconds: getDailyQuestionTimeLimit(),
        score: 10,
        ...overrides
    };
}

function normalizeDailyFixedConfig() {
    if (!dailyFixedConfig.days.length) {
        syncDailyDateConfigsWithOpenRange();
    }
    dailyFixedCurrentIdx = Math.min(Math.max(0, dailyFixedCurrentIdx), dailyFixedConfig.days.length - 1);
    dailyFixedConfig.days.forEach(day => {
        if (!Array.isArray(day.questions)) day.questions = [];
        day.questions.forEach(question => {
            if (!question.timeLimitSeconds) question.timeLimitSeconds = getDailyQuestionTimeLimit();
        });
        normalizeDailyFixedQualifiedQuestions(day);
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
    const target = getDailyTargetQuestionCount();
    if (timeState.state !== 'ok') return { ...timeState, current: 0, target, diff: 0, dayIndex: index, day };
    const expectedSet = new Set(getDateRangeList(timeState.startDate, timeState.endDate));
    const duplicate = dailyFixedConfig.days.some((item, itemIndex) => itemIndex !== index && item.date === day?.date);
    if (!day?.date || duplicate) return { state: 'duplicate-date', current: 0, target, diff: 0, dayIndex: index, day };
    if (!expectedSet.has(day.date)) return { state: 'date-out-of-range', current: 0, target, diff: 0, dayIndex: index, day };
    const current = getDailyFixedDayQuestionCount(day);
    if (!day.questions || !day.questions.length) return { state: 'missing-rules', current: 0, target, diff: target, dayIndex: index, day };
    if (current !== target) return { state: 'count-mismatch', current, target, diff: Math.abs(target - current), dayIndex: index, day };
    return { state: 'ok', current, target, diff: 0, dayIndex: index, day };
}

function getDailyFixedValidationState() {
    normalizeDailyFixedConfig();
    const timeState = getDailyTimeValidationState();
    if (timeState.state !== 'ok') return { ...timeState, current: 0, target: 0, diff: 0, dayIndex: -1 };
    const expectedDates = getDateRangeList(timeState.startDate, timeState.endDate);
    const expectedSet = new Set(expectedDates);
    const seenDates = new Set();
    for (let i = 0; i < dailyFixedConfig.days.length; i += 1) {
        const date = dailyFixedConfig.days[i]?.date;
        if (!date || seenDates.has(date)) {
            return { state: 'duplicate-date', current: 0, target: 0, diff: 0, dayIndex: i, day: dailyFixedConfig.days[i], ...timeState };
        }
        seenDates.add(date);
        if (!expectedSet.has(date)) {
            return { state: 'date-out-of-range', current: 0, target: 0, diff: 0, dayIndex: i, day: dailyFixedConfig.days[i], ...timeState };
        }
    }
    const missingDate = expectedDates.find(date => !seenDates.has(date));
    if (missingDate) {
        return { state: 'missing-date', current: 0, target: 0, diff: 0, dayIndex: -1, missingDate, ...timeState };
    }
    const target = getDailyFixedQualifiedQuestions(dailyFixedConfig.days[0]);
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
    const cls = result.state === 'ok' ? 'ok' : result.state === 'qualified-over' ? 'error' : 'warn';
    const labelMap = {
        'missing-time': '请先配置答题开放日期',
        'invalid-time-range': '答题开放结束时间不能早于开始时间',
        'missing-daily-window': '请先配置答题时段',
        'invalid-daily-window': '每日答题结束时刻必须晚于开始时刻',
        'invalid-time-limit': '每题限时不能低于 5 秒',
        'missing-date': `缺少 ${formatDateLabel(result.missingDate)} 的固定题目计划`,
        'duplicate-date': `第 ${result.dayIndex + 1} 天日期重复`,
        'date-out-of-range': `第 ${result.dayIndex + 1} 天不在开放日期范围内`
    };
    const label = result.state === 'ok'
        ? '每日题目已配置完成'
        : result.state === 'count-mismatch'
            ? `第 ${result.dayIndex + 1} 天已配置题数需与每日题目数保持一致`
            : labelMap[result.state] || '请先配置每天的固定题目';
    return `
        <div class="daily-fixed-summary ${cls}">
            <div class="daily-fixed-summary-main">
                <div class="daily-fixed-summary-title">每日固定题目计划</div>
                <div class="daily-fixed-summary-subtitle">先配置答题开放日期，系统据此生成需要逐天配置固定题目的日期。</div>
            </div>
            <div class="daily-fixed-summary-meta">
                <div><span>日期范围</span><strong>${firstDate} - ${lastDate}</strong></div>
                <div><span>计划天数</span><strong>${days.length} 天</strong></div>
                <div><span>累计题目</span><strong>${totalQuestions} 题</strong></div>
                <div><span>累计分值</span><strong>${totalScore} 分</strong></div>
                <div><span>默认达标</span><strong>${getDailyQualifiedQuestions()} 题</strong></div>
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
    const currentNoticeClass = currentValidation.state === 'ok' ? 'ok' : 'warn';
    const currentNoticeText = currentValidation.state === 'ok' ? '校验通过' : '待调整';
    const currentNoticeMessage = {
        'missing-time': '请先配置答题开放日期。',
        'invalid-time-range': '答题开放结束时间不能早于开始时间。',
        'missing-daily-window': '请先配置答题时段。',
        'invalid-daily-window': '每日答题结束时刻必须晚于开始时刻。',
        'invalid-time-limit': '每题限时不能低于 5 秒。',
        'duplicate-date': '当前日期为空或与其他日期重复，请调整日期计划。',
        'date-out-of-range': '当前日期不在答题开放日期范围内，请调整开放时间或日期计划。',
        'missing-rules': '当天暂无固定题目，请从题库选题或复制上一天题目。',
        'qualified-over': '达标题数不能超过每日题目数量',
        'count-mismatch': '已配置题数需与每日题目数保持一致。',
        ok: '已配置题数需与每日题目数保持一致。'
    };
    const fixedNoticeState = getDailyFixedQuestionNoticeState(current);
    return `
        <div class="daily-plan-builder daily-fixed-builder" style="margin-top:4px">
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
                        const stateCls = dayValidation.state === 'ok' ? 'ok' : dayValidation.state === 'qualified-over' ? 'error' : 'warn';
                        return `
                        <div class="daily-plan-day ${i === dailyFixedCurrentIdx ? 'active' : ''} ${stateCls}" role="button" tabindex="0" onclick="selectDailyFixedDay(${i})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectDailyFixedDay(${i})}">
                            <span class="dp-day-content">
                                <span class="dp-day-date">${formatDateLabel(day.date)}</span>
                                <span class="dp-day-theme">${day.theme || '未命名主题'}</span>
                                <span class="dp-day-meta">${getDailyFixedDayQuestionCount(day)} 题 · ${dayScore} 分</span>
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
                    <button type="button" class="draw-rule-delete-btn" onclick="deleteDailyFixedDay()" title="删除当前日期" aria-label="删除当前日期" ${dailyFixedConfig.days.length <= 1 ? 'disabled' : ''}><span class="trash-icon" aria-hidden="true"></span></button>
                </div>
                <div class="daily-plan-basic daily-fixed-basic">
                    <div><label>日期</label><input type="date" value="${current.date}" onchange="setDailyFixedDayField('date',this.value)"></div>
                    <div><label>主题名称</label><input type="text" value="${current.theme}" onchange="setDailyFixedDayField('theme',this.value)" placeholder="如：第1天：阅读常识"></div>
                </div>
                <div class="daily-fixed-toolbar">
                    <button type="button" class="btn btn-primary btn-sm" onclick="openDailyFixedSingleQuestionModal()">+ 添加题目</button>
                    <button type="button" class="btn btn-outline btn-sm" onclick="copyPreviousDailyFixedQuestions()">复制上一天题目</button>
                    <button type="button" class="btn btn-outline btn-sm" onclick="clearDailyFixedQuestions()">清空当天题目</button>
                </div>
                <div class="score-rule-notice ${currentNoticeClass}" style="margin-top:12px">
                    <div class="score-rule-notice-head">
                        <strong>每日题目数：${fixedNoticeState.target || '-'} 题；已配置：${fixedNoticeState.current || 0} 题</strong>
                        <span>${currentNoticeText}</span>
                    </div>
                    <p>保存固定题后会覆盖当天随机抽题规则。</p>
                </div>
                <div class="daily-plan-rule-head">
                    <strong>当天固定题目</strong>
                    <div class="daily-fixed-list-actions">
                        <button type="button" class="btn btn-outline btn-sm" onclick="openDailyFixedQuestionPicker()">+ 从题库选题</button>
                    </div>
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
                    <label>每题分数</label>
                    <input type="number" value="${question.score || 10}" min="0.5" step="0.5" onchange="setDailyFixedQuestionField(${idx},'score',this.value)">
                </div>
                <button type="button" class="draw-rule-delete-btn" onclick="removeDailyFixedQuestion(${idx})" title="删除本题" aria-label="删除本题" ${total <= 1 ? 'disabled' : ''}><span class="trash-icon" aria-hidden="true"></span></button>
            </div>
        </div>`;
}

function openDailyFixedQuestionPicker() {
    syncDailyDateConfigsWithOpenRange();
    normalizeDailyFixedConfig();
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    const enabledQuestions = DAILY_FIXED_QUESTION_POOL.filter(q => q.status === '启用' && isDailySupportedQuestionType(q.type));
    openModal('从题库选择题目', `
        <div class="filter-bar" style="margin-bottom:12px">
          <select id="dailyFixedBankFilter" onchange="updateDailyFixedQuestionPool()"><option>全部题库</option><option>图书馆知识题库</option><option>历史文化题库</option><option>非遗知识题库</option></select>
          <select id="dailyFixedTypeFilter" onchange="updateDailyFixedQuestionPool()">${dailyQuestionTypeOptions('全部题型', true)}</select>
          <input id="dailyFixedSearchInput" placeholder="搜索题目" oninput="updateDailyFixedQuestionPool()">
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">仅展示启用且每日答题支持的题目，停用题目和简答题不会出现在待选列表中。当前日期：<strong>${formatDateLabel(day.date)}</strong></div>
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
                timeLimitSeconds: getDailyQuestionTimeLimit(),
                score: 10
            });
        });
        day.isOpen = true;
        day.hasFixedPaper = true;
        day.hasBatchRule = false;
        normalizeDailyFixedQualifiedQuestions(day);
        dailyQMode = 'random';
        refreshFsModal();
    }, { confirmText:'确认选择' });
}

function openDailyFixedSingleQuestionModal() {
    syncDailyDateConfigsWithOpenRange();
    normalizeDailyFixedConfig();
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    openModal('添加题目', renderQuestionForm(null, { allowedTypes: STANDARD_ANSWER_QUESTION_TYPE_LABELS }), () => {
        if (!validateQuestionForm()) return false;
        const values = getQuestionFormValues();
        if (!isDailySupportedQuestionType(values.type)) {
            alert('每日固定题目仅支持标准答案题：单选题、多选题、判断题、填空题、排序题。');
            return false;
        }
        const question = buildPaperQuestionFromForm({
            id: Date.now(),
            type: values.type,
            bank: values.bank,
            content: values.content,
            answer: values.answer,
            analysis: values.analysis,
            state: values.state
        });
        day.questions = Array.isArray(day.questions) ? day.questions : [];
        day.questions.push({
            id: `dfq-${Date.now()}-${day.questions.length}`,
            sourceId: question.sourceId,
            content: question.content,
            type: question.type,
            bank: question.bank,
            timeLimitSeconds: getDailyQuestionTimeLimit(),
            score: question.score || 10,
            options: question.options,
            answer: question.answer,
            analysis: question.analysis,
            status: '启用'
        });
        day.isOpen = true;
        day.hasFixedPaper = true;
        day.hasBatchRule = false;
        normalizeDailyFixedQualifiedQuestions(day);
        dailyQMode = 'fixed';
        refreshFsModal();
    }, { confirmText: '添加题目', modalClass: 'modal-xl question-form-modal' });
    initQuestionForm();
}

function updateDailyFixedQuestionPool() {
    const bank = document.getElementById('dailyFixedBankFilter')?.value || '全部题库';
    const type = document.getElementById('dailyFixedTypeFilter')?.value || '全部题型';
    const search = document.getElementById('dailyFixedSearchInput')?.value || '';
    const rows = document.querySelectorAll('#dailyFixedQuestionPool .daily-fixed-pick-row');
    const questions = DAILY_FIXED_QUESTION_POOL.filter(q => q.status === '启用' && isDailySupportedQuestionType(q.type));
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
    const day = {
        date: nextDate,
        theme: buildNextDailyPlanTheme(last.theme, dailyFixedConfig.days.length + 1, nextDate),
        questions: cloneDailyFixedQuestions(last.questions),
        qualifiedQuestions: last.qualifiedQuestions,
        qualifiedQuestionsTouched: !!last.qualifiedQuestionsTouched
    };
    normalizeDailyFixedQualifiedQuestions(day);
    dailyFixedConfig.days.push(day);
    dailyFixedCurrentIdx = dailyFixedConfig.days.length - 1;
    dailyQMode = 'fixed';
    refreshFsModal();
}

function copyPreviousDailyFixedDay() {
    normalizeDailyFixedConfig();
    const last = dailyFixedConfig.days[dailyFixedConfig.days.length - 1];
    const nextDate = last.date ? addDaysToDate(last.date, 1) : formatDateOnly(new Date());
    const day = {
        date: nextDate,
        theme: buildNextDailyPlanTheme(last.theme, dailyFixedConfig.days.length + 1, nextDate),
        questions: cloneDailyFixedQuestions(last.questions),
        qualifiedQuestions: last.qualifiedQuestions,
        qualifiedQuestionsTouched: !!last.qualifiedQuestionsTouched
    };
    normalizeDailyFixedQualifiedQuestions(day);
    dailyFixedConfig.days.push(day);
    dailyFixedCurrentIdx = dailyFixedConfig.days.length - 1;
    dailyQMode = 'fixed';
    refreshFsModal();
}

function copyPreviousDailyFixedQuestions() {
    syncDailyDateConfigsWithOpenRange();
    normalizeDailyFixedConfig();
    const current = dailyFixedConfig.days[dailyFixedCurrentIdx];
    const source = dailyFixedConfig.days[dailyFixedCurrentIdx - 1] || dailyFixedConfig.days[dailyFixedConfig.days.length - 1];
    if (!current || !source) return;
    current.questions = cloneDailyFixedQuestions(source.questions);
    current.qualifiedQuestions = source.qualifiedQuestions;
    current.qualifiedQuestionsTouched = !!source.qualifiedQuestionsTouched;
    normalizeDailyFixedQualifiedQuestions(current);
    current.hasFixedPaper = current.questions.length > 0;
    current.hasBatchRule = current.hasFixedPaper ? false : (dailyBatchRuleApplied && current.isOpen !== false);
    dailyQMode = 'random';
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
    dailyQMode = 'random';
    refreshFsModal();
}

function setDailyConfigDayQualifiedQuestions(value) {
    syncDailyDateConfigsWithOpenRange();
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    if (!day) return;
    day.qualifiedQuestions = Math.max(1, Math.floor(Number(value) || 1));
    day.qualifiedQuestionsTouched = true;
    day.hasFixedPaper = true;
    day.hasBatchRule = false;
    dailyQMode = 'random';
    refreshFsModal();
}

function saveDailySingleDayConfig() {
    syncDailyDateConfigsWithOpenRange();
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    if (!day) return;
    const status = getDailyDateStatus(day);
    if (status.key !== 'fixed' || !(day.questions || []).length) {
        alert('请先设置当天固定题目。');
        return;
    }
    const result = getDailyFixedDayValidationState(day, dailyFixedCurrentIdx, getDailyTimeValidationState());
    if (result.state !== 'ok') {
        alert(getDailySourceValidationMessage(result, 'fixed'));
        return;
    }
    day.hasFixedPaper = true;
    day.hasBatchRule = false;
    dailyQMode = 'random';
    refreshFsModal();
    setTimeout(() => alert(`${formatDateLabel(day.date)} 当天配置已保存`), 0);
}

function removeDailyFixedQuestion(idx) {
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    if (!day) return;
    day.questions.splice(idx, 1);
    day.hasFixedPaper = true;
    day.hasBatchRule = false;
    normalizeDailyFixedQualifiedQuestions(day);
    dailyQMode = 'random';
    refreshFsModal();
}

function setDailyFixedQuestionField(idx, key, val) {
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    const question = day?.questions?.[idx];
    if (!question) return;
    if (key === 'timeLimitSeconds') question[key] = Math.max(5, Number(val) || 30);
    else question[key] = key === 'score' ? Math.max(0.5, Number(val) || 0.5) : val;
    day.hasFixedPaper = true;
    day.hasBatchRule = false;
    normalizeDailyFixedQualifiedQuestions(day);
    dailyQMode = 'random';
    refreshFsModal();
}

function clearDailyFixedQuestions() {
    syncDailyDateConfigsWithOpenRange();
    normalizeDailyFixedConfig();
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    day.questions = [];
    day.hasFixedPaper = true;
    day.hasBatchRule = false;
    normalizeDailyFixedQualifiedQuestions(day, { forceDefault: true });
    dailyQMode = 'random';
    refreshFsModal();
}

function openDailyFixedBatchModal() {
    const first = getDatePartFromDateTime(dailyTimeConfig.startTime) || dailyFixedConfig.days[0]?.date || '2026-06-09';
    const last = getDatePartFromDateTime(dailyTimeConfig.endTime) || dailyFixedConfig.days[dailyFixedConfig.days.length - 1]?.date || first;
    openModal('批量生成日期', `
        <div class="info-box blue">💡 默认使用上方答题开放日期的日期范围，批量生成后仅创建日期，题目需逐天单独配置。</div>
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
            const day = {
                date: dateText,
                theme: `${theme} ${idx}`.trim(),
                questions: []
            };
            normalizeDailyFixedQualifiedQuestions(day);
            days.push(day);
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
    return { source: '我的题库', bank: '图书馆知识题库', type: '全部标准答案题', count: 10, timeLimitSeconds: getDailyQuestionTimeLimit(), score: 1, ...overrides };
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
                    <button type="button" class="draw-rule-delete-btn" onclick="deleteDailyPlanDay()" title="删除当前日期" aria-label="删除当前日期" ${dailyPlanConfig.days.length <= 1 ? 'disabled' : ''}><span class="trash-icon" aria-hidden="true"></span></button>
                </div>
                <div class="daily-plan-basic">
                    <div><label>日期</label><input type="date" value="${current.date}" onchange="setDailyPlanDayField('date',this.value)"></div>
                    <div><label>主题名称</label><input type="text" value="${current.theme}" onchange="setDailyPlanDayField('theme',this.value)"></div>
                </div>
                <div class="daily-plan-rule-head">
                    <strong>当天抽题规则</strong>
                    <button type="button" class="btn btn-outline btn-sm" onclick="addDailyPlanRule()">+ +添加抽题规则</button>
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
                <button type="button" class="draw-rule-delete-btn" onclick="removeDailyPlanRule(${idx})" title="删除本条规则" aria-label="删除本条规则" ${total <= 1 ? 'disabled' : ''}><span class="trash-icon" aria-hidden="true"></span></button>
            </div>
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
function selectDailyConfigDay(idx) {
    syncDailyDateConfigsWithOpenRange();
    dailyFixedCurrentIdx = Math.min(Math.max(0, idx), dailyFixedConfig.days.length - 1);
    dailyQMode = 'random';
    refreshFsModal();
}

function toggleDailyConfigDayOpen(isOpen) {
    syncDailyDateConfigsWithOpenRange();
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    if (!day) return;
    day.isOpen = !!isOpen;
    if (!day.isOpen) day.hasBatchRule = false;
    else if (!day.hasFixedPaper) {
        day.hasBatchRule = true;
        getDailyDayRandomRules(day);
    }
    dailyQMode = 'random';
    refreshFsModal();
}

function setDailyConfigDayMode(mode) {
    syncDailyDateConfigsWithOpenRange();
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    if (!day) return;
    if (mode === 'closed') {
        day.isOpen = false;
        day.hasBatchRule = false;
        dailyQMode = 'random';
        refreshFsModal();
        return;
    }
    day.isOpen = true;
    if (mode === 'batch') {
        day.hasFixedPaper = false;
        day.questions = [];
        day.hasBatchRule = true;
        getDailyDayRandomRules(day);
    }
    if (mode === 'fixed') {
        day.hasBatchRule = false;
        day.hasFixedPaper = true;
        if (!Array.isArray(day.questions)) day.questions = [];
        normalizeDailyFixedQualifiedQuestions(day);
    }
    dailyQMode = 'random';
    refreshFsModal();
}

function getCurrentDailyFixedSourceDay() {
    syncDailyDateConfigsWithOpenRange();
    const source = dailyFixedConfig.days[dailyFixedCurrentIdx];
    if (!source || source.isOpen === false || !(source.questions || []).length) {
        alert('当前日期暂无固定题可复制');
        return null;
    }
    return source;
}

function applyFixedQuestionsToDay(targetDay, sourceQuestions, sourceDay = null) {
    targetDay.isOpen = true;
    targetDay.questions = cloneDailyFixedQuestions(sourceQuestions);
    targetDay.hasFixedPaper = true;
    targetDay.hasBatchRule = false;
    if (sourceDay) {
        targetDay.qualifiedQuestions = sourceDay.qualifiedQuestions;
        targetDay.qualifiedQuestionsTouched = !!sourceDay.qualifiedQuestionsTouched;
    }
    normalizeDailyFixedQualifiedQuestions(targetDay, { forceDefault: !sourceDay && !targetDay.qualifiedQuestionsTouched });
}

function applyBatchModeToDay(targetDay) {
    targetDay.isOpen = true;
    targetDay.questions = [];
    targetDay.hasFixedPaper = false;
    targetDay.hasBatchRule = true;
    targetDay.randomRules = cloneDailyPlanRules(dailyFixedConfig.days[dailyFixedCurrentIdx]?.randomRules || dailyRandomRules);
}

function getCurrentDailyConfigSource() {
    syncDailyDateConfigsWithOpenRange();
    const source = dailyFixedConfig.days[dailyFixedCurrentIdx];
    const status = getDailyDateStatus(source);
    if (!source || !['batch', 'fixed'].includes(status.key)) {
        alert('当前日期暂无可复制的题目配置');
        return null;
    }
    return { source, status };
}

function applyCurrentConfigToTargetDay(targetDay, source, status) {
    if (status.key === 'batch') applyBatchModeToDay(targetDay);
    if (status.key === 'fixed') applyFixedQuestionsToDay(targetDay, source.questions, source);
}

function copyCurrentFixedQuestionsToUnconfigured() {
    const source = getCurrentDailyFixedSourceDay();
    if (!source) return;
    let count = 0;
    dailyFixedConfig.days.forEach(day => {
        if (day === source || day.isOpen === false) return;
        if (getDailyDateStatus(day).key !== 'empty') return;
        applyFixedQuestionsToDay(day, source.questions, source);
        count += 1;
    });
    dailyQMode = 'random';
    refreshFsModal();
    setTimeout(() => alert(count ? `已复制到 ${count} 个未配置日期` : '当前没有可复制的未配置日期'), 0);
}

function copyCurrentDayConfigToUnconfigured() {
    const result = getCurrentDailyConfigSource();
    if (!result) return;
    const { source, status } = result;
    let count = 0;
    dailyFixedConfig.days.forEach(day => {
        if (day === source || day.isOpen === false) return;
        if (getDailyDateStatus(day).key !== 'empty') return;
        applyCurrentConfigToTargetDay(day, source, status);
        count += 1;
    });
    dailyQMode = 'random';
    refreshFsModal();
    setTimeout(() => alert(count ? `已复制到 ${count} 个未配置日期` : '当前没有可复制的未配置日期'), 0);
}

function confirmCopyCurrentDayConfigToAll() {
    const result = getCurrentDailyConfigSource();
    if (!result) return;
    const { source, status } = result;
    const targets = dailyFixedConfig.days.filter(day => day !== source && day.isOpen !== false);
    const fixedCount = targets.filter(day => getDailyDateStatus(day).key === 'fixed').length;
    const batchCount = targets.filter(day => getDailyDateStatus(day).key === 'batch').length;
    const emptyCount = targets.filter(day => getDailyDateStatus(day).key === 'empty').length;
    const closedCount = dailyFixedConfig.days.filter(day => day.isOpen === false).length;
    openModal('确认复制到全部日期', `
        <div class="info-box yellow">
            将把当前日期的「${status.label}」配置复制到所有开放日期；不开放日期会保持不变。
        </div>
        <div class="assign-batch-preview" style="margin-top:12px">
            <div class="assign-batch-preview-row"><span>将覆盖固定题日期</span><strong>${fixedCount} 天</strong></div>
            <div class="assign-batch-preview-row"><span>将覆盖批量规则日期</span><strong>${batchCount} 天</strong></div>
            <div class="assign-batch-preview-row"><span>将填充未配置日期</span><strong>${emptyCount} 天</strong></div>
            <div class="assign-batch-preview-row"><span>保持不开放</span><strong>${closedCount} 天</strong></div>
        </div>
    `, () => {
        targets.forEach(day => applyCurrentConfigToTargetDay(day, source, status));
        dailyQMode = 'random';
        refreshFsModal();
    }, { confirmText: '确认复制' });
}

function confirmCopyCurrentFixedQuestionsToAll() {
    const source = getCurrentDailyFixedSourceDay();
    if (!source) return;
    const targets = dailyFixedConfig.days.filter(day => day !== source && day.isOpen !== false);
    const fixedCount = targets.filter(day => getDailyDateStatus(day).key === 'fixed').length;
    const batchCount = targets.filter(day => getDailyDateStatus(day).key === 'batch').length;
    const emptyCount = targets.filter(day => getDailyDateStatus(day).key === 'empty').length;
    const closedCount = dailyFixedConfig.days.filter(day => day.isOpen === false).length;
    openModal('确认复制到全部日期', `
        <div class="info-box yellow">
            该操作会把当前日期的固定题复制到所有开放日期，并覆盖已有批量规则或其他固定题。不开放日期会保持不变。
        </div>
        <div class="assign-batch-preview" style="margin-top:12px">
            <div class="assign-batch-preview-row"><span>将覆盖固定题日期</span><strong>${fixedCount} 天</strong></div>
            <div class="assign-batch-preview-row"><span>将覆盖批量规则日期</span><strong>${batchCount} 天</strong></div>
            <div class="assign-batch-preview-row"><span>将填充未配置日期</span><strong>${emptyCount} 天</strong></div>
            <div class="assign-batch-preview-row"><span>保持不开放</span><strong>${closedCount} 天</strong></div>
        </div>
    `, () => {
        targets.forEach(day => applyFixedQuestionsToDay(day, source.questions, source));
        dailyQMode = 'random';
        refreshFsModal();
    }, { confirmText: '确认复制' });
}

function applyDailyBatchRulesToUnlockedDays(options = {}) {
    const includeFixed = options.includeFixed === true;
    syncDailyDateConfigsWithOpenRange();
    dailyBatchRuleApplied = true;
    dailyFixedConfig.days.forEach(day => {
        const hasFixed = day.hasFixedPaper === true || (day.questions || []).length > 0;
        if (day.isOpen === false || (hasFixed && !includeFixed)) return;
        if (hasFixed && includeFixed) {
            day.hasFixedPaper = false;
            day.questions = [];
        }
        day.hasBatchRule = true;
        day.randomRules = cloneDailyPlanRules(dailyRandomRules);
    });
}

function hasExistingDailyBatchRuleConfig() {
    syncDailyDateConfigsWithOpenRange();
    return dailyBatchRuleApplied === true
        || (dailyFixedConfig.days || []).some(day => day.hasBatchRule === true || (Array.isArray(day.randomRules) && day.randomRules.length > 0));
}

function applyDailyBatchDraftRules(options = {}) {
    syncDailyQuestionTimeLimit();
    dailyRandomRules = cloneDailyPlanRules(dailyBatchDraftRules);
    applyDailyBatchRulesToUnlockedDays(options);
    dailyQMode = 'random';
    refreshFsModal();
}

function setDailyConfigDayRandomRuleField(idx, key, val) {
    syncDailyDateConfigsWithOpenRange();
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    const rule = getDailyDayRandomRules(day)[idx];
    if (!rule) return;
    rule[key] = (key === 'count' || key === 'score')
        ? Math.max(key === 'count' ? 1 : 0.5, Number(val) || (key === 'count' ? 1 : 0.5))
        : val;
    day.isOpen = true;
    day.hasBatchRule = true;
    day.hasFixedPaper = false;
    day.questions = [];
    dailyQMode = 'random';
    refreshFsModal();
}

function addDailyConfigDayRandomRule() {
    syncDailyDateConfigsWithOpenRange();
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    getDailyDayRandomRules(day).push({ bank: '图书馆知识题库', type: '全部标准答案题', count: 10, timeLimitSeconds: getDailyQuestionTimeLimit(), score: 1 });
    day.isOpen = true;
    day.hasBatchRule = true;
    day.hasFixedPaper = false;
    day.questions = [];
    dailyQMode = 'random';
    refreshFsModal();
}

function removeDailyConfigDayRandomRule(idx) {
    const day = dailyFixedConfig.days[dailyFixedCurrentIdx];
    const rules = getDailyDayRandomRules(day);
    if (rules.length <= 1) return;
    rules.splice(idx, 1);
    dailyQMode = 'random';
    refreshFsModal();
}

function openDailyBatchRuleModal() {
    const hasExistingConfig = hasExistingDailyBatchRuleConfig();
    dailyBatchDraftRules = cloneDailyPlanRules(dailyRandomRules.length ? dailyRandomRules : dailyBatchRuleTemplate);
    syncDailyQuestionTimeLimit();
    normalizeDailyQualifiedQuestionsForRules(dailyBatchDraftRules, { forceDefault: !dailyScoreConfig.qualifiedQuestionsTouched });
    openModal('批量配置抽题规则', renderDailyBatchRuleModalBody(), () => {
        if (!dailyBatchDraftRules.length) return false;
        const questionState = getDailyDayRandomRuleNoticeState(dailyBatchDraftRules);
        if (questionState.state !== 'ok') {
            alert(questionState.state === 'qualified-over'
                ? '达标题数不能超过每日题目数量'
                : questionState.state === 'count-mismatch'
                    ? '已配置题数需与每日题目数保持一致。'
                    : '请至少配置 1 条抽题规则。');
            return false;
        }
        if (hasExistingConfig) {
            confirmApplyNewDailyBatchRuleConfig();
            return false;
        }
        applyDailyBatchDraftRules();
    }, { confirmText: '确认应用', modalClass: 'modal-lg' });
}

function confirmApplyNewDailyBatchRuleConfig() {
    closeModal();
    setTimeout(() => {
        openModal('确认生效新规则（//首次配置无需弹出）', `
            <div class="daily-rule-confirm-copy">
                确认后，将使用本次配置的新规则覆盖所有日期已有规则。
            </div>
        `, () => {
            applyDailyBatchDraftRules();
        }, { confirmText: '确认生效' });
    }, 0);
}

function renderDailyBatchRuleModalBody() {
    normalizeDailyQualifiedQuestionsForRules(dailyBatchDraftRules);
    const dailyQuestionCount = getRuleQuestionCount(dailyBatchDraftRules);
    const qualifiedQuestions = getDailyQualifiedQuestions(dailyBatchDraftRules);
    const targetQuestions = getDailyTargetQuestionCount();
    return `
        <div class="daily-batch-modal">
            ${renderDailyQuestionRuleNotice(dailyBatchDraftRules, qualifiedQuestions, { targetQuestions })}
            <div class="daily-rules-topbar daily-batch-rules-head">
                <div>
                    <div class="daily-batch-rule-heading">抽题规则</div>
                    <div class="daily-batch-rule-subtitle">按题库和题型拆分配置，系统将汇总为每日题目数量。</div>
                </div>
            </div>
            <div id="dailyBatchRulesDraft" class="daily-batch-rule-list">
                ${dailyBatchDraftRules.map((rule, idx) => renderDailyBatchRuleDraftRow(rule, idx, dailyBatchDraftRules.length)).join('')}
            </div>
            <div class="daily-batch-footer">
                <button type="button" class="btn btn-outline btn-sm" onclick="addDailyBatchDraftRule()">+ 新增抽题规则</button>
                <div class="daily-batch-total">每日题目数量：<strong>${dailyQuestionCount}</strong> 题</div>
            </div>
            <div class="info-box yellow daily-batch-warning">每日答题仅支持标准答案题：单选题、多选题、判断题、填空题、排序题，至少配置 1 条抽题规则。</div>
        </div>`;
}

function renderDailyBatchRuleDraftRow(rule, idx, total) {
    const bankOptions = ['图书馆知识题库', '历史文化题库', '非遗知识题库']
        .map(bank => `<option ${rule.bank === bank ? 'selected' : ''}>${bank}</option>`).join('');
    const subtotal = (Number(rule.count) || 0) * (Number(rule.score) || 0);
    return `
    <div class="daily-batch-rule-card">
        <div class="daily-batch-rule-index">规则 ${idx + 1}</div>
        <div class="daily-batch-rule-grid">
            <div class="span-2"><label>题库</label><select onchange="setDailyBatchDraftRuleField(${idx},'bank',this.value)">${bankOptions}</select></div>
            <div class="span-2"><label>题型</label><select onchange="setDailyBatchDraftRuleField(${idx},'type',this.value)">${standardAnswerQuestionTypeOptions(rule.type || '全部标准答案题')}</select></div>
            <div><label>抽题数量</label><input type="number" value="${rule.count}" min="1" onchange="setDailyBatchDraftRuleField(${idx},'count',this.value)"></div>
            <div><label>每题分值</label><input type="number" value="${rule.score}" min="0.5" step="0.5" onchange="setDailyBatchDraftRuleField(${idx},'score',this.value)"></div>
            <div><label>小计</label><div class="daily-batch-rule-subtotal">${subtotal} 分</div></div>
            <div class="daily-batch-rule-action"><label>操作</label><button type="button" class="draw-rule-delete-btn" onclick="removeDailyBatchDraftRule(${idx})" title="删除本条规则" aria-label="删除本条规则" ${total <= 1 ? 'disabled' : ''}><span class="trash-icon" aria-hidden="true"></span></button></div>
        </div>
    </div>`;
}

function refreshDailyBatchRuleModal() {
    const body = document.getElementById('modalBody');
    if (body) body.innerHTML = renderDailyBatchRuleModalBody();
}

function setDailyBatchDraftRuleField(idx, key, value) {
    const rule = dailyBatchDraftRules[idx];
    if (!rule) return;
    if (key === 'timeLimitSeconds') rule[key] = value === '' ? '' : Math.max(5, Number(value) || 5);
    else if (key === 'count') rule[key] = Math.max(1, Math.floor(Number(value) || 1));
    else rule[key] = key === 'score' ? Math.max(0.5, Number(value) || 0.5) : value;
    normalizeDailyQualifiedQuestionsForRules(dailyBatchDraftRules);
    refreshDailyBatchRuleModal();
}

function addDailyBatchDraftRule() {
    dailyBatchDraftRules.push({ bank: '图书馆知识题库', type: '全部标准答案题', count: 10, timeLimitSeconds: getDailyQuestionTimeLimit(), score: 1 });
    normalizeDailyQualifiedQuestionsForRules(dailyBatchDraftRules);
    refreshDailyBatchRuleModal();
}

function removeDailyBatchDraftRule(idx) {
    if (dailyBatchDraftRules.length <= 1) return;
    dailyBatchDraftRules.splice(idx, 1);
    normalizeDailyQualifiedQuestionsForRules(dailyBatchDraftRules);
    refreshDailyBatchRuleModal();
}

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
    level.questionMode = 'random';
    level.rules.push({ bank: '图书馆知识题库', type: '全部标准答案题', count: 10, timeLimitSeconds: getLevelQuestionTimeLimit(level), score: 1 });
    refreshFsModal();
}

function selectCurrentLevelQuestionMode(mode) {
    const level = getCurrentLevel();
    if (!level) return;
    const nextMode = mode === 'fixed' ? 'fixed' : 'random';
    if (getLevelQuestionMode(level) === nextMode) return;
    level.questionMode = nextMode;
    if (nextMode === 'fixed') {
        if (!Array.isArray(level.fixedQuestions)) level.fixedQuestions = [];
    } else {
        if (!Array.isArray(level.rules) || !level.rules.length) {
            level.rules = [{ bank: '图书馆知识题库', type: '全部标准答案题', count: 10, timeLimitSeconds: getLevelQuestionTimeLimit(level), score: 1 }];
        }
    }
    refreshFsModal();
}

function selectLevelQuestionMode(mode) {
    selectCurrentLevelQuestionMode(mode);
}

function switchLevel(idx) { levelCurrentIdx = idx; refreshFsModal(); }

function setCurrentLevelField(key, val) {
    const level = getCurrentLevel();
    if (!level) return;
    if (key === 'passScore') level[key] = Math.min(Number(level.totalScore) || 0, Math.max(0, Number(val) || 0));
    else if (key === 'passQuestions') level[key] = Math.min(getLevelQuestionCount(level), Math.max(0, Number(val) || 0));
    else if (key === 'questions') level[key] = Math.max(1, Math.floor(Number(val) || 1));
    else if (key === 'timeLimitSeconds') setLevelQuestionTimeLimit(level, val);
    else if (key === 'maxAttempts') level[key] = Math.max(0, Number(val) || 0);
    else if (key === 'allowResume') level[key] = !!val;
    else level[key] = val;
    refreshFsModal();
}

function getLevelQuestionTimeLimit(level = getCurrentLevel()) {
    if (!level) return 30;
    return Math.max(5, Number(level.timeLimitSeconds) || 30);
}

function normalizeLevelQuestionTimeLimit(level = getCurrentLevel()) {
    if (!level) return;
    const firstRuleLimit = getLevelRules(level).find(rule => rule.timeLimitSeconds)?.timeLimitSeconds;
    const firstFixedLimit = getLevelFixedQuestions(level).find(question => question.timeLimitSeconds)?.timeLimitSeconds;
    const seconds = Math.max(5, Number(level.timeLimitSeconds || firstRuleLimit || firstFixedLimit || 30) || 30);
    syncLevelQuestionTimeLimit(level, seconds);
}

function setLevelQuestionTimeLimit(level, value) {
    if (!level) return;
    const seconds = Math.max(5, Number(value) || 30);
    level.timeLimitSeconds = seconds;
    syncLevelQuestionTimeLimit(level, seconds);
}

function syncLevelQuestionTimeLimit(level = getCurrentLevel(), seconds = getLevelQuestionTimeLimit(level)) {
    if (!level) return;
    const nextSeconds = Math.max(5, Number(seconds) || 30);
    level.timeLimitSeconds = nextSeconds;
    getLevelRules(level).forEach(rule => { rule.timeLimitSeconds = nextSeconds; });
    getLevelFixedQuestions(level).forEach(question => { question.timeLimitSeconds = nextSeconds; });
}

function getDefaultLevelFixedQuestion(overrides = {}) {
    return {
        id: `lfq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sourceId: '',
        content: '',
        type: '单选题',
        bank: '图书馆知识题库',
        timeLimitSeconds: getLevelQuestionTimeLimit(),
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

function syncLevelTargetQuestionCountFromFixed(level = getCurrentLevel()) {
    if (!level || getLevelTargetQuestionCount(level)) return;
    level.questions = getLevelFixedQuestions(level).length;
}

function normalizeCurrentLevelFixedQuestions() {
    const level = getCurrentLevel();
    if (!level) return;
    if (!Array.isArray(level.fixedQuestions) || !level.fixedQuestions.length) {
        level.fixedQuestions = [getDefaultLevelFixedQuestion()];
    }
    level.fixedQuestions.forEach(question => {
        if (question.timeLimitSeconds == null) question.timeLimitSeconds = getLevelQuestionTimeLimit(level);
    });
}

function clearCurrentLevelFixedQuestions() {
    const level = getCurrentLevel();
    if (!level) return;
    level.fixedQuestions = [getDefaultLevelFixedQuestion({ timeLimitSeconds: getLevelQuestionTimeLimit(level) })];
    level.questionMode = 'fixed';
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
    syncLevelQuestionTimeLimit(level);
    level.questionMode = 'fixed';
    refreshFsModal();
}

function removeLevelFixedQuestion(idx) {
    const level = getCurrentLevel();
    if (!level || !Array.isArray(level.fixedQuestions) || level.fixedQuestions.length <= 1) return;
    level.fixedQuestions.splice(idx, 1);
    level.questionMode = 'fixed';
    refreshFsModal();
}

function setLevelFixedQuestionField(idx, key, val) {
    const level = getCurrentLevel();
    const question = level?.fixedQuestions?.[idx];
    if (!question) return;
    if (key === 'timeLimitSeconds') question[key] = Math.max(5, Number(val) || 30);
    else question[key] = key === 'score' ? Math.max(0.5, Number(val) || 0.5) : val;
    level.questionMode = 'fixed';
    refreshFsModal();
}

function openLevelFixedSingleQuestionModal() {
    const level = getCurrentLevel();
    if (!level) return;
    openModal('添加题目', renderQuestionForm(null, { allowedTypes: STANDARD_ANSWER_QUESTION_TYPE_LABELS }), () => {
        if (!validateQuestionForm()) return false;
        const values = getQuestionFormValues();
        if (!isDailySupportedQuestionType(values.type)) {
            alert('趣味闯关固定题目仅支持标准答案题：单选题、多选题、判断题、填空题、排序题。');
            return false;
        }
        const question = buildPaperQuestionFromForm({
            id: Date.now(),
            type: values.type,
            bank: values.bank,
            content: values.content,
            answer: values.answer,
            analysis: values.analysis,
            state: values.state
        });
        level.fixedQuestions = Array.isArray(level.fixedQuestions) ? level.fixedQuestions : [];
        level.fixedQuestions.push({
            id: `lfq-${Date.now()}-${level.fixedQuestions.length}`,
            sourceId: question.sourceId,
            content: question.content,
            type: question.type,
            bank: question.bank,
            timeLimitSeconds: getLevelQuestionTimeLimit(level),
            score: question.score || 10,
            options: question.options,
            answer: question.answer,
            analysis: question.analysis,
            status: '启用'
        });
        level.questionMode = 'fixed';
        syncLevelTargetQuestionCountFromFixed(level);
        refreshLevelQuestionConfigFullscreen();
    }, { confirmText: '添加题目', modalClass: 'modal-xl question-form-modal', overlayClass: 'modal-layer-over-level-question' });
    initQuestionForm();
}

function openLevelFixedQuestionPicker() {
    const level = getCurrentLevel();
    if (!level) return;
    const enabledQuestions = getLevelFixedQuestionPool();
    openModal('从题库选择题目', `
        <div class="filter-bar" style="margin-bottom:12px">
          <select id="levelFixedBankFilter" onchange="updateLevelFixedQuestionPool()"><option>全部题库</option><option>图书馆知识题库</option><option>历史文化题库</option><option>非遗知识题库</option></select>
          <select id="levelFixedTypeFilter" onchange="updateLevelFixedQuestionPool()">${questionTypeOptions('全部题型', true)}</select>
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
        level.fixedQuestions = Array.isArray(level.fixedQuestions) ? level.fixedQuestions : [];
        const existed = new Set((level.fixedQuestions || []).map(q => q.sourceId));
        selectedQuestions.forEach((q, index) => {
            if (existed.has(q.id)) return;
            level.fixedQuestions.push({
                id: `lfq-${Date.now()}-${index}`,
                sourceId: q.id,
                content: q.content,
                type: q.type,
                bank: q.bank,
                timeLimitSeconds: getLevelQuestionTimeLimit(level),
                score: 10
            });
        });
        level.questionMode = 'fixed';
        syncLevelTargetQuestionCountFromFixed(level);
        refreshLevelQuestionConfigFullscreen();
    }, { confirmText:'确认选择', overlayClass: 'modal-layer-over-level-question' });
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
    const current = getCurrentLevel();
    const nextMode = getLevelQuestionMode(current);
    const questionCount = getLevelTargetQuestionCount(current) || getLevelQuestionCount(current) || 10;
    const timeLimitSeconds = getLevelQuestionTimeLimit(current);
    const fixedQuestions = nextMode === 'fixed' ? [getDefaultLevelFixedQuestion({ timeLimitSeconds })] : [];
    levels.push({
        name: `第${n}关`,
        questionMode: nextMode,
        questions: questionCount,
        timeLimitSeconds,
        totalScore: Number(levels[0]?.totalScore) || 100,
        passScore: Math.min(60, Number(levels[0]?.totalScore) || 100),
        passQuestions: Math.min(6, questionCount),
        maxAttempts: 1,
        allowResume: false,
        configured: false,
        rules: [{ bank: '图书馆知识题库', type: '全部标准答案题', count: 10, timeLimitSeconds, score: 1 }],
        fixedQuestions,
        practiceConfig: { ...getPracticeConfig('level'), bank: false }
    });
    levelCurrentIdx = levels.length - 1;
    refreshFsModal();
}

function copyLevel() {
    const src = levels[levelCurrentIdx];
    const n = levels.length + 1;
    const copiedLevel = {
        ...src,
        name: `第${n}关（副本）`,
        questionMode: getLevelQuestionMode(src),
        configured: true,
        totalScore: Number(levels[0]?.totalScore) || Number(src.totalScore) || 100,
        passScore: Math.min(Number(src.passScore) || 0, Number(levels[0]?.totalScore) || Number(src.totalScore) || 100),
        passQuestions: getLevelPassQuestions(src),
        maxAttempts: getLevelMaxAttempts(src),
        timeLimitSeconds: getLevelQuestionTimeLimit(src),
        rules: getLevelRules(src).map(rule => ({ ...rule })),
        questions: getLevelTargetQuestionCount(src),
        fixedQuestions: getLevelQuestionMode(src) === 'fixed' ? cloneLevelFixedQuestions(src.fixedQuestions) : [],
        practiceConfig: { ...getLevelPracticeConfig(src) }
    };
    syncLevelQuestionTimeLimit(copiedLevel);
    levels.push(copiedLevel);
    levelCurrentIdx = levels.length - 1;
    refreshFsModal();
}

function deleteLevel() {
    if (levels.length <= 1) { alert('至少保留 1 个关卡'); return; }
    levels.splice(levelCurrentIdx, 1);
    levelCurrentIdx = Math.min(levelCurrentIdx, levels.length - 1);
    refreshFsModal();
}

function moveLevel(index, direction) {
    const nextIndex = index + direction;
    if (index < 0 || index >= levels.length || nextIndex < 0 || nextIndex >= levels.length) return;
    const movedLevel = levels[index];
    levels[index] = levels[nextIndex];
    levels[nextIndex] = movedLevel;

    if (levelCurrentIdx === index) {
        levelCurrentIdx = nextIndex;
    } else if (levelCurrentIdx === nextIndex) {
        levelCurrentIdx = index;
    }

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
        if (quizUnitRoleDropdownOpen) {
            if (e.target.closest && e.target.closest('.quiz-unit-role-select')) return;
            closeQuizUnitRoleDropdown();
            return;
        }
        if (groupMenuOpenIdx === -1) return;
        if (e.target.closest && (e.target.closest('.gc-menu') || e.target.closest('.gc-menu-btn'))) return;
        closeGroupMenus();
    });
    window.__quizGroupMenuHandlerBound = true;
}
