/* ============================================================
   app.js — Core Navigation, Page Switching, Shared Utilities
   ============================================================ */

// Page registry — each page module registers itself here
const Pages = {};

function registerPage(id, renderFn) {
    Pages[id] = renderFn;
}

// ===== SYSTEM DICTIONARIES =====
const SYSTEM_QUESTION_TYPES = [
    { value: '单选题', label: '单选题', badgeClass: 'badge-blue' },
    { value: '多选题', label: '多选题', badgeClass: 'badge-green' },
    { value: '判断题', label: '判断题', badgeClass: 'badge-yellow' },
    { value: '填空题', label: '填空题', badgeClass: 'badge-gray' },
    { value: '简答题', label: '简答题', badgeClass: 'badge-blue' },
    { value: '排序题', label: '排序题', badgeClass: 'badge-green' }
];

const SYSTEM_QUESTION_TYPE_LABELS = SYSTEM_QUESTION_TYPES.map(t => t.value);
const SYSTEM_QUESTION_TYPE_FILTERS = ['全部题型', ...SYSTEM_QUESTION_TYPE_LABELS];
const STANDARD_ANSWER_QUESTION_TYPE_LABELS = ['单选题', '多选题', '判断题', '填空题', '排序题'];
const STANDARD_ANSWER_QUESTION_TYPE_FILTERS = ['全部标准答案题', ...STANDARD_ANSWER_QUESTION_TYPE_LABELS];
const EXAM_QUESTION_TYPE_FILTERS = ['全部题型', ...SYSTEM_QUESTION_TYPE_LABELS];

function questionTypeOptions(selected, includeAll = false) {
    const normalized = selected === '问答题' ? '简答题' : selected;
    const types = includeAll ? SYSTEM_QUESTION_TYPE_FILTERS : SYSTEM_QUESTION_TYPE_LABELS;
    return types.map(t => `<option ${normalized === t ? 'selected' : ''}>${t}</option>`).join('');
}

function questionTypeBadgeClass(type) {
    const normalized = type === '问答题' ? '简答题' : type;
    return SYSTEM_QUESTION_TYPES.find(t => t.value === normalized)?.badgeClass || 'badge-gray';
}

function standardAnswerQuestionTypeOptions(selected = '全部标准答案题', includeAll = true) {
    const normalized = selected === '全部题型' || selected === '简答题' || selected === '问答题' ? '全部标准答案题' : selected;
    const types = includeAll ? STANDARD_ANSWER_QUESTION_TYPE_FILTERS : STANDARD_ANSWER_QUESTION_TYPE_LABELS;
    return types.map(t => `<option ${normalized === t ? 'selected' : ''}>${t}</option>`).join('');
}

function examQuestionTypeOptions(selected = '全部题型', includeAll = true) {
    const normalized = selected === '全部标准答案题' ? '全部题型' : selected === '问答题' ? '简答题' : selected;
    const types = includeAll ? EXAM_QUESTION_TYPE_FILTERS : SYSTEM_QUESTION_TYPE_LABELS;
    return types.map(t => `<option ${normalized === t ? 'selected' : ''}>${t}</option>`).join('');
}

// ===== ACTIVITY DROPDOWN =====
function toggleActivityDropdown(e) {
    e.stopPropagation();
    const menu = document.getElementById('activityDropdownMenu');
    if (!menu) return;
    menu.classList.toggle('show');
}

function closeActivityDropdown() {
    const menu = document.getElementById('activityDropdownMenu');
    if (menu) menu.classList.remove('show');
}

// Close dropdown on outside click
document.addEventListener('click', (event) => {
    const tabAction = event.target.closest('[data-page-tab-action]');
    if (tabAction) {
        event.stopPropagation();
        handlePageTabAction(tabAction);
        return;
    }
    const tabEl = event.target.closest('.page-tab[data-tab-key]');
    if (tabEl) {
        switchPageTab(tabEl.dataset.tabKey);
        return;
    }
    closeActivityDropdown();
    closePageTabsMenu();
});

// ===== NAVIGATION STATE =====
let currentPage = 'workbench';
let topNavSection = 'activity'; // 'home' | 'activity-list-top' | 'activity' | 'resource' | 'operation' | 'data' | 'system'
let isInManageMode = false;     // inside a specific activity's manage center
let currentPageParams = {};
let currentPageSource = null;
let pageTabs = [];
let activeTabKey = '';
let tabVisitHistory = [];
let pageStateStore = {};
let manageSidebarOpenState = {};
let activitySidebarOpenState = {};

let currentManageActivity = {
    name: '阅启新篇·读享时光 —— 阅途成长共读计划',
    type: '知识问答',
    status: '进行中',
    time: '2026-03-06 10:10:10 至 2026-03-26 23:59:59'
};

const PAGE_META = {
    home: { title: '首页', tabTitle: '首页', parentPath: null, breadcrumb: ['首页'], showBack: false, generateTab: true },
    workbench: { title: '活动概况', tabTitle: '活动概况', closable: false, parentPath: null, breadcrumb: ['活动管理', '活动概况'], showBack: false, generateTab: true },
    'activity-list': { title: '活动列表', tabTitle: '活动列表', parentPath: 'workbench', breadcrumb: ['活动管理', '活动列表'], showBack: false, generateTab: true },
    'activity-module-placeholder': { title: '活动模块', tabTitle: params => params?.module || '活动模块', parentPath: 'workbench', breadcrumb: ['活动管理', '活动模块'], showBack: false, generateTab: true },
    'quiz-activity-list': { title: '知识问答活动列表', tabTitle: '知识问答', parentPath: 'workbench', breadcrumb: ['活动管理', '活动概况', '知识问答', '活动列表'], showBack: true, generateTab: true },
    dashboard: { title: '运营驾驶舱', tabTitle: '运营驾驶舱', parentPath: 'workbench', breadcrumb: ['活动管理', '运营驾驶舱'], showBack: false, generateTab: true },
    'activity-stat-placeholder': { title: '数据统计', tabTitle: '数据统计', parentPath: 'workbench', breadcrumb: ['活动管理', '数据统计'], showBack: false, generateTab: true },
    'activity-manage': { title: '活动管理', tabTitle: () => `活动管理-${currentManageActivity.name}`, parentPath: 'activity-list', breadcrumb: ['活动管理', currentManageActivity.name, '活动概览'], showBack: true, generateTab: true },
    'activity-overview': { title: '活动管理', tabTitle: () => `活动管理-${currentManageActivity.name}`, parentPath: 'activity-list', breadcrumb: ['活动管理', currentManageActivity.name, '活动概览'], showBack: true, generateTab: true },
    'org-mgmt': { title: '组织机构', tabTitle: '组织机构', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '组织机构'], showBack: true, generateTab: true },
    registration: { title: '报名情况', tabTitle: '报名情况', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '报名情况'], showBack: true, generateTab: true },
    'exam-records': { title: '用户答题情况', tabTitle: '用户答题情况', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '用户答题情况'], showBack: true, generateTab: true },
    'answer-detail': { title: '答卷详情', tabTitle: '答卷详情', parentPath: 'exam-records', breadcrumb: ['活动管理', currentManageActivity.name, '用户答题情况', '答卷详情'], showBack: true, generateTab: true },
    'unit-data': { title: '单位数据情况', tabTitle: '单位数据情况', parentPath: 'exam-records', breadcrumb: ['活动管理', currentManageActivity.name, '用户答题情况', '单位数据情况'], showBack: true, generateTab: true },
    'submission-list': { title: '投稿情况', tabTitle: '投稿情况', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '投稿情况'], showBack: true, generateTab: true },
    'question-bank': { title: '题库管理', tabTitle: '题库管理', parentPath: 'workbench', breadcrumb: ['活动管理', '题库管理'], showBack: true, generateTab: true },
    'paper-mgmt': { title: '试卷管理', tabTitle: '试卷管理', parentPath: 'workbench', breadcrumb: ['活动管理', '试卷管理'], showBack: true, generateTab: true },
    'quiz-activity-create': { title: params => params?.mode === 'edit' ? '编辑活动' : '创建活动', tabTitle: params => params?.mode === 'edit' ? '编辑活动' : '创建活动', parentPath: 'activity-list', breadcrumb: () => ['活动管理', currentPageParams?.mode === 'edit' ? '编辑活动' : '创建活动'], showBack: true, generateTab: true },
    'activity-create': { title: '编辑活动', tabTitle: '编辑活动', parentPath: 'activity-list', breadcrumb: ['活动管理', '编辑活动'], showBack: true, generateTab: true },
    'paper-review': { title: '阅卷配置', tabTitle: '阅卷管理', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '阅卷管理'], showBack: true, generateTab: true },
    'paper-review-detail': { title: '阅卷进度', tabTitle: '阅卷进度', parentPath: 'paper-review', breadcrumb: ['活动管理', currentManageActivity.name, '阅卷管理', '阅卷进度'], showBack: true, generateTab: true },
    'paper-review-teachers': { title: '阅卷老师管理', tabTitle: '阅卷老师管理', parentPath: 'paper-review', breadcrumb: ['活动管理', currentManageActivity.name, '阅卷管理', '阅卷老师管理'], showBack: true, generateTab: true },
    'paper-review-assign-question': { title: '分配阅卷老师', tabTitle: '分配阅卷老师', parentPath: 'paper-review', breadcrumb: ['活动管理', currentManageActivity.name, '阅卷管理', '分配阅卷老师'], showBack: true, generateTab: true },
    'paper-review-my-tasks': { title: '我的阅卷任务', tabTitle: '我的阅卷任务', parentPath: 'paper-review', breadcrumb: ['活动管理', currentManageActivity.name, '阅卷管理', '我的阅卷任务'], showBack: true, generateTab: true },
    'paper-review-question-list': { title: '题目列表', tabTitle: '题目列表', parentPath: 'paper-review-my-tasks', breadcrumb: ['活动管理', currentManageActivity.name, '阅卷管理', '我的阅卷任务', '题目列表'], showBack: true, generateTab: true },
    'paper-review-attempt-list': { title: '答卷列表', tabTitle: '答卷列表', parentPath: 'paper-review-my-tasks', breadcrumb: ['活动管理', currentManageActivity.name, '阅卷管理', '我的阅卷任务', '答卷列表'], showBack: true, generateTab: true },
    'paper-review-student-list': { title: '考生列表', tabTitle: '考生列表', parentPath: 'paper-review-my-tasks', breadcrumb: ['活动管理', currentManageActivity.name, '阅卷管理', '我的阅卷任务', '考生列表'], showBack: true, generateTab: true },
    'paper-review-question-marking': { title: '按题目批阅', tabTitle: '按题目批阅', parentPath: 'paper-review-question-list', breadcrumb: ['活动管理', currentManageActivity.name, '阅卷管理', '我的阅卷任务', '题目列表', '按题目批阅'], showBack: true, generateTab: true },
    'paper-review-marking': { title: '按考生批阅', tabTitle: '按考生批阅', parentPath: 'paper-review-student-list', breadcrumb: ['活动管理', currentManageActivity.name, '阅卷管理', '我的阅卷任务', '考生列表', '按考生批阅'], showBack: true, generateTab: true },
    'paper-review-all': { title: '阅卷管理', tabTitle: '阅卷管理', parentPath: 'workbench', breadcrumb: ['活动管理', '阅卷管理'], showBack: true, generateTab: true },
    'paper-review-teachers-all': { title: '阅卷老师管理', tabTitle: '阅卷老师管理', parentPath: 'paper-review-all', breadcrumb: ['活动管理', '阅卷管理', '阅卷老师管理'], showBack: true, generateTab: true },
    'paper-review-quick-my-tasks': { title: '我的阅卷任务', tabTitle: '我的阅卷任务', parentPath: 'workbench', breadcrumb: ['活动管理', '知识问答', '我的阅卷任务'], showBack: true, generateTab: true },
    'paper-review-quick-question-list': { title: '题目列表', tabTitle: '题目列表', parentPath: 'paper-review-quick-my-tasks', breadcrumb: ['活动管理', '知识问答', '我的阅卷任务', '题目列表'], showBack: true, generateTab: true },
    'paper-review-quick-attempt-list': { title: '答卷列表', tabTitle: '答卷列表', parentPath: 'paper-review-quick-my-tasks', breadcrumb: ['活动管理', '知识问答', '我的阅卷任务', '答卷列表'], showBack: true, generateTab: true },
    'paper-review-quick-student-list': { title: '考生列表', tabTitle: '考生列表', parentPath: 'paper-review-quick-my-tasks', breadcrumb: ['活动管理', '知识问答', '我的阅卷任务', '考生列表'], showBack: true, generateTab: true },
    'paper-review-quick-question-marking': { title: '按题目批阅', tabTitle: '按题目批阅', parentPath: 'paper-review-quick-question-list', breadcrumb: ['活动管理', '知识问答', '我的阅卷任务', '题目列表', '按题目批阅'], showBack: true, generateTab: true },
    'paper-review-quick-marking': { title: '按考生批阅', tabTitle: '按考生批阅', parentPath: 'paper-review-quick-student-list', breadcrumb: ['活动管理', '知识问答', '我的阅卷任务', '考生列表', '按考生批阅'], showBack: true, generateTab: true },
    'practice-list': { title: '练习记录', tabTitle: '练习记录', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '练习记录'], showBack: true, generateTab: true },
    'practice-create': { title: '新建练习', tabTitle: '新建练习', parentPath: 'practice-list', breadcrumb: ['活动管理', currentManageActivity.name, '练习记录', '新建练习'], showBack: true, generateTab: true },
    'practice-records': { title: '练习记录', tabTitle: '练习记录', parentPath: 'practice-list', breadcrumb: ['活动管理', currentManageActivity.name, '练习记录', '练习记录'], showBack: true, generateTab: true },
    'certificate-mgmt': { title: '奖证管理', tabTitle: '奖证管理', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '奖证管理'], showBack: true, generateTab: true },
    certificates: { title: '活动证明', tabTitle: '活动证明', parentPath: 'certificate-mgmt', breadcrumb: ['活动管理', currentManageActivity.name, '奖证管理', '活动证明'], showBack: true, generateTab: true },
    leaderboard: { title: '排行榜', tabTitle: '排行榜', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '排行榜'], showBack: true, generateTab: true },
    'activity-dynamic': { title: '活动动态', tabTitle: '活动动态', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '活动动态'], showBack: true, generateTab: true },
    'recommend-resources': { title: '推荐资源', tabTitle: '推荐资源', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '推荐资源'], showBack: true, generateTab: true },
    'more-functions': { title: '更多功能', tabTitle: '更多功能', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '更多功能'], showBack: true, generateTab: true },
    'activity-data': { title: '数据概况', tabTitle: '数据概况', parentPath: 'workbench', breadcrumb: ['活动管理', '数据概况'], showBack: true, generateTab: true },
    'resource-mgmt': { title: '资源管理', tabTitle: '资源管理', parentPath: 'workbench', breadcrumb: ['资源管理'], showBack: false, generateTab: true },
    'data-mgmt': { title: '数据管理', tabTitle: '数据管理', parentPath: 'workbench', breadcrumb: ['数据管理'], showBack: false, generateTab: true },
    'system-mgmt': { title: '系统管理', tabTitle: '系统管理', parentPath: 'workbench', breadcrumb: ['系统管理'], showBack: false, generateTab: true }
};

// ===== SIDEBAR MENUS PER SECTION =====

// Activity Management sidebar (when not inside a specific activity) — per Image 2
const SIDEBAR_ACTIVITY = [
    { page: 'workbench', icon: '🏠', label: '活动概况' },
    { page: 'activity-list', icon: '🗂️', label: '活动列表' },
    { label: '征集类', icon: '📝', key: 'collection' },
    { label: '任务打卡', icon: '✅', key: 'task' },
    { label: '知识问答', icon: '📚', key: 'quiz', activityPage: 'quiz-activity-list' },
    { label: '线下活动', icon: '📍', key: 'offline' },
    { label: '投票', icon: '🗳️', key: 'vote' },
    { label: '外语闯关', icon: '🌐', key: 'language' },
    { label: '会议微网站', icon: '🎤', key: 'meeting' },
    { label: '超链接图文', icon: '🔗', key: 'link' },
    { page: 'activity-stat-placeholder', icon: '📊', label: '数据统计' }
];

const ACTIVITY_SIDEBAR_MODULES_BY_TYPE = {
    collection: [
        { label: '活动列表', page: 'activity-list' },
        { label: '评选管理' },
        { label: '作品审核' },
        { label: '作品推选' },
        { label: '作品下载' },
        { label: '数据概况', page: 'activity-data' }
    ],
    task: [
        { label: '活动列表', page: 'activity-list' },
        { label: '评分管理' },
        { label: '数据概况', page: 'activity-data' }
    ],
    quiz: [
        { label: '活动列表', page: 'quiz-activity-list' },
        { label: '题库管理', page: 'question-bank' },
        { label: '试卷管理', page: 'paper-mgmt' },
        { label: '数据概况', page: 'activity-data' }
    ],
    offline: [
        { label: '活动列表', page: 'activity-list' },
        { label: '签到管理' },
        { label: '数据概况', page: 'activity-data' }
    ],
    vote: [
        { label: '活动列表', page: 'activity-list' },
        { label: '投票管理' },
        { label: '结果统计' }
    ],
    language: [
        { label: '活动列表', page: 'activity-list' },
        { label: '数据概况', page: 'activity-data' }
    ],
    meeting: [
        { label: '活动列表', page: 'activity-list' },
        { label: '报名管理' },
        { label: '签到管理' },
        { label: '数据概况', page: 'activity-data' }
    ],
    link: [
        { label: '内容列表' },
        { label: '数据概况', page: 'activity-data' }
    ]
};

// Activity Manage Mode sidebar follows the grouped tree used inside a single activity.
const SIDEBAR_ACTIVITY_MANAGE = [
    { page: 'activity-overview', label: '活动概览' },
    { page: 'org-mgmt',          label: '组织机构' },
    { page: 'registration',      label: '报名情况' },
    {
        page: 'paper-review',
        label: '阅卷管理',
        children: [
            { page: 'paper-review', label: '阅卷配置' },
            { page: 'paper-review-teachers', label: '阅卷老师' },
            { page: 'paper-review-detail', label: '阅卷进度' }
        ]
    },
    { page: 'practice-list', label: '练习记录' },
    {
        page: 'certificate-mgmt',
        label: '奖证管理',
        children: [
            { page: 'certificate-mgmt', label: '奖项列表' },
            { page: 'certificates', label: '活动证明' }
        ]
    },
    { page: 'activity-dynamic', label: '活动动态' },
    { page: 'recommend-resources', label: '推荐资源' },
    {
        page: 'exam-records',
        label: '数据统计',
        children: [
            { page: 'exam-records', label: '用户答题情况' },
            { page: 'unit-data', label: '单位数据情况' }
        ]
    },
    { page: 'more-functions', label: '更多功能' }
];

// Section → page ID mapping for auto-detect
const SECTION_PAGE_MAP = {
    'home':               'home',
    'workbench':          'activity',
    'activity-list':      'activity',
    'quiz-activity-list': 'activity',
    'activity-create':    'activity',
    'quiz-activity-create': 'activity',
    'question-bank':      'activity',
    'paper-mgmt':         'activity',
    'paper-review-all':   'activity',
    'paper-review-teachers-all': 'activity',
    'paper-review-quick-my-tasks': 'activity',
    'paper-review-quick-question-list': 'activity',
    'paper-review-quick-attempt-list': 'activity',
    'paper-review-quick-student-list': 'activity',
    'paper-review-quick-question-marking': 'activity',
    'paper-review-quick-marking': 'activity',
    'paper-review':       'activity',
    'paper-review-teachers': 'activity',
    'practice-list':      'activity',
    'practice-create':    'activity',
    'practice-records':   'activity',
    'activity-data':      'activity',
    'activity-stat-placeholder': 'activity',
    'dashboard':          'activity',
    // Manage mode pages → activity section
    'activity-overview': 'activity',
    'org-mgmt':          'activity',
    'registration':      'activity',
    'exam-records':      'activity',
    'answer-detail':     'activity',
    'paper-review':      'activity',
    'paper-review-student-list': 'activity',
    'paper-review-question-list': 'activity',
    'paper-review-attempt-list': 'activity',
    'paper-review-marking': 'activity',
    'paper-review-question-marking': 'activity',
    'paper-review-detail': 'activity',
    'paper-review-teachers': 'activity',
    'paper-review-assign-question': 'activity',
    'paper-review-my-tasks': 'activity',
    'practice-list':     'activity',
    'practice-create':   'activity',
    'practice-records':  'activity',
    'certificate-mgmt':  'activity',
    'unit-data':         'activity',
    'activity-dynamic':  'activity',
    'recommend-resources': 'activity',
    'more-functions':   'activity',
    'resource-mgmt':    'resource',
    'data-mgmt':        'data',
    'system-mgmt':      'system'
};

const MANAGE_NAV_PAGE_IDS = new Set(SIDEBAR_ACTIVITY_MANAGE.flatMap(m => [m.page, ...(m.children || []).map(child => child.page)]));
const MANAGE_PAGE_IDS = new Set(MANAGE_NAV_PAGE_IDS);
['paper-review-student-list', 'paper-review-question-list', 'paper-review-attempt-list', 'paper-review-marking', 'paper-review-question-marking', 'paper-review-detail', 'paper-review-teachers', 'paper-review-assign-question', 'paper-review-my-tasks', 'practice-create', 'submission-list', 'leaderboard', 'answer-detail'].forEach(id => MANAGE_PAGE_IDS.add(id));
const ACTIVITY_PAGE_IDS = new Set(SIDEBAR_ACTIVITY.map(m => m.page).filter(Boolean));
const SIDEBAR_NAV_PAGE_IDS = new Set([...ACTIVITY_PAGE_IDS, ...MANAGE_NAV_PAGE_IDS]);

// ===== TOP NAV SWITCHING =====

function switchTopNav(section) {
    topNavSection = section;
    isInManageMode = false;

    // Update top-nav active state
    document.querySelectorAll('#topNavMenu .top-nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.section === section);
    });

    // Navigate to section's default page
    const defaultPages = {
        'home':      'home',
        'activity-list-top': 'activity-list',
        'activity':  'workbench',
        'resource':  'resource-mgmt',
        'operation': 'dashboard',
        'data':      'data-mgmt',
        'system':    'system-mgmt'
    };

    const targetPage = defaultPages[section] || 'activity-list';
    navigateTo(targetPage, { topNavSection: section });
}

function updateTopNavActive(section) {
    document.querySelectorAll('#topNavMenu .top-nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.section === section);
    });
}

// ===== SIDEBAR RENDERING =====

function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    let html = '';
    let menuItems = [];

    if (isInManageMode) {
        menuItems = SIDEBAR_ACTIVITY_MANAGE;
    } else {
        // Section-specific sidebar
        switch (topNavSection) {
            case 'activity':
                menuItems = SIDEBAR_ACTIVITY;
                break;
            case 'home':
            case 'resource':
            case 'operation':
            case 'data':
            case 'system':
            default:
                menuItems = [];
                break;
        }
    }

    html += isInManageMode
        ? renderManageSidebarTree(menuItems)
        : (topNavSection === 'activity' ? renderActivitySidebar(menuItems) : menuItems.map(m => {
              const isActive = currentPage === m.page;
              return `
              <div class="nav-item ${isActive ? 'active' : ''}" data-page="${m.page}" onclick="navigateTo('${m.page}')">
                  <span class="icon">${m.icon}</span>${m.label}
              </div>`;
          }).join(''));

    sidebar.innerHTML = html;
}

function renderActivitySidebar(menuItems) {
    const quizPages = new Set(['quiz-activity-list', 'question-bank', 'paper-mgmt', 'paper-review-teachers-all', 'paper-review-all', 'paper-review-quick-my-tasks', 'paper-review-quick-question-list', 'paper-review-quick-attempt-list', 'paper-review-quick-student-list', 'paper-review-quick-question-marking', 'paper-review-quick-marking']);
    const activeModule = quizPages.has(currentPage) ? 'quiz'
        : currentPage === 'workbench' ? 'workbench'
        : currentPage === 'activity-list' && currentPageSource?.params?.activityType ? currentPageSource.params.activityType
        : currentPageSource?.params?.activityType || currentPageParams?.activityType || null;
    const renderActivityTool = item => {
        const isActiveType = activeModule === item.key;
        const isOpen = isActivitySidebarGroupOpen(item.key, isActiveType);
        const modules = ACTIVITY_SIDEBAR_MODULES_BY_TYPE[item.key] || [];
        return `
        <div class="activity-tool-group ${isActiveType ? 'active' : ''} ${isOpen ? 'open' : ''}">
            <div class="activity-tool-title" onclick="toggleActivitySidebarGroup('${item.key}', event)" role="button" aria-expanded="${isOpen}">
                <span class="activity-tool-icon">${item.icon}</span>
                <span>${item.label}</span>
                <b>⌃</b>
            </div>
            <div class="activity-tool-children">
                ${modules.map(module => {
                    const isActive = isActiveType && (
                        currentPage === module.page ||
                        (module.page === 'paper-review-quick-my-tasks' && currentPage.startsWith('paper-review-quick-')) ||
                        (module.module && currentPage === 'activity-module-placeholder' && currentPageParams?.module === module.module)
                    );
                    const page = module.page || 'activity-module-placeholder';
                    return `<div class="activity-side-child ${isActive ? 'active' : ''}" onclick="navigateActivitySidebarModule('${page}', '${item.key}', '${item.label}', '${module.module || module.label}')">${module.label}</div>`;
                }).join('')}
            </div>
        </div>`;
    };
    return `
    <div class="activity-sidebar-tree">
        ${menuItems.map(item => {
            if (item.page === 'workbench' || item.page === 'dashboard' || item.page === 'activity-list' || item.page === 'activity-stat-placeholder') {
                const active = currentPage === item.page;
                return `<div class="nav-item ${active ? 'active' : ''}" data-page="${item.page}" onclick="navigateTo('${item.page}')"><span class="icon">${item.icon}</span>${item.label}</div>`;
            }
            return renderActivityTool(item);
        }).join('')}
    </div>`;
}

function isActivitySidebarGroupOpen(key, defaultOpen = false) {
    if (Object.prototype.hasOwnProperty.call(activitySidebarOpenState, key)) {
        return activitySidebarOpenState[key];
    }
    return defaultOpen;
}

function toggleActivitySidebarGroup(key, event) {
    event?.stopPropagation();
    activitySidebarOpenState[key] = !isActivitySidebarGroupOpen(key);
    renderSidebar();
}

function navigateActivitySidebarModule(page, activityType, activityLabel, moduleName) {
    navigateTo(page, {
        params: {
            activityType,
            activityLabel,
            module: moduleName
        }
    });
}

function renderManageSidebarTree(menuItems) {
    const activeMap = {
        'paper-review-assign-question': 'paper-review',
        'paper-review-teachers': 'paper-review',
        'paper-review-student-list': 'paper-review-my-tasks',
        'paper-review-question-list': 'paper-review-my-tasks',
        'paper-review-attempt-list': 'paper-review-my-tasks',
        'paper-review-marking': 'paper-review-my-tasks',
        'paper-review-question-marking': 'paper-review-my-tasks',
        'practice-create': 'practice-list',
        'certificates': 'certificate-mgmt',
        'unit-data': 'unit-data'
    };
    const activePage = activeMap[currentPage] || currentPage;
    return `
    <div class="manage-sidebar-tree">
        ${menuItems.map(item => {
            const children = item.children || [];
            const childActive = children.some(child => child.page === activePage);
            const isActive = activePage === item.page || childActive;
            const isOpen = children.length && isManageSidebarGroupOpen(item.page);
            const itemClick = children.length
                ? `toggleManageSidebarGroup('${item.page}', event)`
                : `navigateTo('${item.page}')`;
            return `
            <div class="manage-nav-block ${isOpen ? 'open' : ''}">
                <div class="manage-nav-item ${isActive ? 'active' : ''}" onclick="${itemClick}" ${children.length ? `role="button" aria-expanded="${isOpen}"` : ''}>
                    <span>${item.label}</span>
                    ${item.badge === 'check' ? '<em class="manage-nav-badge ok">✓</em>' : ''}
                    ${item.badge === 'warn' ? '<em class="manage-nav-badge warn">!</em>' : ''}
                    ${children.length ? '<b>⌃</b>' : ''}
                </div>
                ${children.length ? `
                <div class="manage-subnav">
                    ${children.map(child => `
                        <div class="manage-subnav-item ${activePage === child.page ? 'active' : ''}" onclick="event.stopPropagation();${child.page === 'paper-review-detail' ? 'openReviewProgressList()' : `navigateTo('${child.page}')`}">${child.label}</div>
                    `).join('')}
                </div>` : ''}
            </div>`;
        }).join('')}
    </div>`;
}

function isManageSidebarGroupOpen(pageId) {
    if (Object.prototype.hasOwnProperty.call(manageSidebarOpenState, pageId)) {
        return manageSidebarOpenState[pageId];
    }
    return true;
}

function toggleManageSidebarGroup(pageId, event) {
    event?.stopPropagation();
    manageSidebarOpenState[pageId] = !isManageSidebarGroupOpen(pageId);
    renderSidebar();
}

registerPage('activity-dynamic', () => renderPublicFeatureEmptyPage());
registerPage('recommend-resources', () => renderPublicFeatureEmptyPage());
registerPage('more-functions', () => renderPlaceholderPage('更多功能', 'activity', '更多扩展能力将在这里统一管理。'));
registerPage('activity-stat-placeholder', () => renderPlanningEmptyPage('数据统计', '数据统计模块待研发中，后续将在这里统一展示活动数据分析、趋势概览与指标看板。'));
registerPage('activity-module-placeholder', () => {
    const activityLabel = currentPageParams?.activityLabel || '活动';
    const moduleName = currentPageParams?.module || '功能模块';
    return renderPlaceholderPage(`${activityLabel} · ${moduleName}`, 'activity', `${moduleName}模块正在整理中，可先从左侧切换到活动列表或数据概括。`);
});

// ===== ACTIVITY HEADER (in manage mode) =====

function renderActivityHeader() {
    const a = currentManageActivity;
    return `
    <div class="manage-topbar-inner">
        <button class="manage-topbar-back" onclick="exitManageMode()" aria-label="返回上一页">
            <span>‹</span>返回上一页
        </button>
        <div class="manage-topbar-cover" aria-hidden="true"></div>
        <div class="manage-topbar-info">
            <div class="manage-topbar-title-row">
                <strong>${a.name}</strong>
                <em>${a.type}</em>
                <b>${a.status}</b>
            </div>
            <div class="manage-topbar-time">活动时间： ${a.time.replace(' 至 ', ' &nbsp;至&nbsp; ')}</div>
        </div>
    </div>`;
}

function renderManageTopbar() {
    const bar = document.getElementById('manageTopbar');
    if (!bar) return;
    bar.innerHTML = isInManageMode ? renderActivityHeader() : '';
}

// ===== MANAGE MODE ENTRY/EXIT =====

function enterManageMode(activityName) {
    isInManageMode = true;
    topNavSection = 'activity';
    if (activityName) currentManageActivity.name = activityName;
    updateTopNavActive('activity');
    navigateTo('activity-overview');
}

function exitManageMode() {
    isInManageMode = false;
    navigateTo('activity-list');
}

function getPageMeta(pageId) {
    return PAGE_META[pageId] || {
        title: pageId,
        tabTitle: pageId,
        parentPath: 'workbench',
        breadcrumb: ['活动管理', pageId],
        showBack: true,
        generateTab: true
    };
}

function resolveText(maybeText) {
    return typeof maybeText === 'function' ? maybeText() : maybeText;
}

function buildTabKey(pageId, params = {}) {
    const keys = Object.keys(params || {}).sort();
    if (!keys.length) return pageId;
    return `${pageId}?${keys.map(key => `${key}=${params[key]}`).join('&')}`;
}

function shouldGenerateTab(pageId) {
    return getPageMeta(pageId).generateTab !== false;
}

function getTabTitle(pageId, params = {}) {
    const meta = getPageMeta(pageId);
    const title = typeof meta.tabTitle === 'function' ? meta.tabTitle(params) : resolveText(meta.tabTitle || meta.title);
    if (params?.name) return `${title}-${params.name}`;
    return title;
}

function jsString(value) {
    return JSON.stringify(String(value || ''));
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function upsertPageTab(pageId, params = {}, source = null) {
    if (!shouldGenerateTab(pageId)) return '';
    const tabKey = buildTabKey(pageId, params);
    const existing = pageTabs.find(tab => tab.key === tabKey);
    const tabTitle = getTabTitle(pageId, params);
    if (existing) {
        existing.title = tabTitle;
        existing.pageId = pageId;
        existing.params = { ...params };
        existing.source = source || existing.source || null;
    } else {
        pageTabs.push({
            key: tabKey,
            pageId,
            params: { ...params },
            title: tabTitle,
            closable: getPageMeta(pageId).closable !== false,
            source: source || null,
            hasUnsavedChanges: false
        });
    }
    activeTabKey = tabKey;
    tabVisitHistory = [...tabVisitHistory.filter(key => key !== tabKey), tabKey];
    return tabKey;
}

function ensureHomeTab() {
    if (pageTabs.some(tab => tab.key === 'workbench')) return;
    pageTabs.unshift({
        key: 'workbench',
        pageId: 'workbench',
        params: {},
        title: '活动概况',
        closable: false,
        source: null,
        hasUnsavedChanges: false
    });
    if (!activeTabKey) activeTabKey = 'workbench';
}

function renderPageTabs() {
    const host = document.getElementById('globalPageTabs');
    if (!host) return;
    if (document.body.classList.contains('independent-create-page')) {
        host.innerHTML = '';
        return;
    }
    ensureHomeTab();
    const visibleTabs = pageTabs.filter(tab => tab.key !== 'workbench');
    const hideTabActions = currentPage === 'answer-detail';
    host.innerHTML = `
      <div class="page-tabs-shell">
        <div class="page-tabs-scroll" id="pageTabsScroll">
          ${visibleTabs.map(tab => `
            <div class="page-tab ${tab.key === activeTabKey ? 'active' : ''} ${tab.key === 'workbench' ? 'home-tab' : ''}" data-tab-key="${escapeHtml(tab.key)}">
              <span class="page-tab-title">${escapeHtml(tab.title)}</span>
              ${tab.hasUnsavedChanges ? '<i class="page-tab-dot"></i>' : ''}
              ${tab.closable ? `<button class="page-tab-close" data-page-tab-action="close" data-tab-key="${escapeHtml(tab.key)}">×</button>` : ''}
            </div>
          `).join('')}
        </div>
        ${hideTabActions ? '' : `
        <div class="page-tabs-actions">
          <button class="page-tabs-more" data-page-tab-action="toggle-menu">⌄</button>
          <div class="page-tabs-menu" id="pageTabsMenu">
            ${visibleTabs.map(tab => `<button class="${tab.key === activeTabKey ? 'active' : ''}" data-page-tab-action="switch" data-tab-key="${escapeHtml(tab.key)}"><span>${escapeHtml(tab.title)}</span><span>${tab.key === activeTabKey ? '当前' : ''}</span></button>`).join('')}
            <div class="page-tabs-menu-group">
              <button data-page-tab-action="refresh">刷新当前页</button>
              <button data-page-tab-action="close-current">关闭当前页</button>
              <button data-page-tab-action="close-other">关闭其他页签</button>
              <button data-page-tab-action="close-right">关闭右侧页签</button>
              <button data-page-tab-action="close-all">关闭全部页签</button>
            </div>
          </div>
        </div>`}
      </div>`;
    requestAnimationFrame(scrollActiveTabIntoView);
}

function handlePageTabAction(el) {
    const action = el.dataset.pageTabAction;
    const tabKey = el.dataset.tabKey;
    if (action === 'switch' && tabKey) return switchPageTab(tabKey);
    if (action === 'close' && tabKey) return closePageTab(tabKey);
    if (action === 'toggle-menu') return togglePageTabsMenu();
    if (action === 'refresh') return refreshCurrentPage();
    if (action === 'close-current') return closeCurrentPageTab();
    if (action === 'close-other') return closeOtherPageTabs();
    if (action === 'close-right') return closeRightPageTabs();
    if (action === 'close-all') return closeAllPageTabs();
}

function scrollActiveTabIntoView() {
    const activeEl = Array.from(document.querySelectorAll('.page-tab')).find(el => el.dataset.tabKey === activeTabKey);
    activeEl?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
}

function togglePageTabsMenu(event) {
    event?.stopPropagation();
    document.getElementById('pageTabsMenu')?.classList.toggle('show');
}

function closePageTabsMenu() {
    document.getElementById('pageTabsMenu')?.classList.remove('show');
}

function switchPageTab(tabKey) {
    closePageTabsMenu();
    const tab = pageTabs.find(item => item.key === tabKey);
    if (!tab) return;
    navigateTo(tab.pageId, { params: tab.params, source: tab.source, fromTabSwitch: true, reuseTabKey: tab.key });
}

function closePageTab(tabKey) {
    const tab = pageTabs.find(item => item.key === tabKey);
    if (!tab || tab.closable === false) return;
    pageTabs = pageTabs.filter(item => item.key !== tabKey);
    tabVisitHistory = tabVisitHistory.filter(key => key !== tabKey);
    if (activeTabKey === tabKey) {
        const fallbackKey = tabVisitHistory[tabVisitHistory.length - 1] || 'workbench';
        switchPageTab(fallbackKey);
    } else {
        renderPageTabs();
    }
}

function closeCurrentPageTab() {
    closePageTab(activeTabKey);
}

function closeOtherPageTabs() {
    pageTabs = pageTabs.filter(tab => tab.key === 'workbench' || tab.key === activeTabKey);
    tabVisitHistory = tabVisitHistory.filter(key => key === 'workbench' || key === activeTabKey);
    renderPageTabs();
    closePageTabsMenu();
}

function closeRightPageTabs() {
    const currentIndex = pageTabs.findIndex(tab => tab.key === activeTabKey);
    if (currentIndex < 0) return;
    const keepKeys = new Set(pageTabs.slice(0, currentIndex + 1).map(tab => tab.key));
    pageTabs = pageTabs.filter(tab => keepKeys.has(tab.key) || tab.key === 'workbench');
    tabVisitHistory = tabVisitHistory.filter(key => pageTabs.some(tab => tab.key === key));
    renderPageTabs();
    closePageTabsMenu();
}

function closeAllPageTabs() {
    pageTabs = pageTabs.filter(tab => tab.key === 'workbench');
    tabVisitHistory = ['workbench'];
    activeTabKey = 'workbench';
    renderPageTabs();
    closePageTabsMenu();
    navigateTo('workbench', { fromTabSwitch: true, reuseTabKey: 'workbench' });
}

function refreshCurrentPage() {
    navigateTo(currentPage, { params: currentPageParams, source: currentPageSource, refresh: true, fromTabSwitch: true, reuseTabKey: activeTabKey });
    closePageTabsMenu();
}

function getPageSource(pageId) {
    const tab = pageTabs.find(item => item.key === activeTabKey && item.pageId === pageId);
    return tab?.source || currentPageSource || null;
}

function buildBackTarget(pageId) {
    const meta = getPageMeta(pageId);
    const source = getPageSource(pageId);
    if (source?.pageId && source.pageId !== pageId && !source.implicit) return source;
    if (meta.parentPath) return { pageId: meta.parentPath, params: {}, source: null };
    return { pageId: 'workbench', params: {}, source: null };
}

function renderGlobalBreadcrumb(pageId) {
    const items = [...(resolveText(getPageMeta(pageId).breadcrumb) || [])];
    if (!items.length) return '';
    return `<div class="breadcrumb">${items.map((item, index) => index === items.length - 1 ? `<span>${item}</span>` : `<a href="javascript:void(0)" onclick="handleBreadcrumbBack('${pageId}', ${index})">${item}</a>`).join(' / ')}</div>`;
}

function renderGlobalBack(pageId, label = '返回') {
    const meta = getPageMeta(pageId);
    if (!meta.showBack) return '';
    return `<span class="action-link muted" onclick="goBackFromPage('${pageId}')">‹ ${label}</span>`;
}

function renderSourceBack(pageId = currentPage, label = '返回上一级') {
    return `<span class="action-link muted" onclick="goBackFromPage('${pageId}')">‹ ${label}</span>`;
}

function shouldHideSecondaryMenuReturnBar(pageId = currentPage) {
    const source = currentPageSource;
    if (source?.params?.activityType) return true;
    return [
        'quiz-activity-list',
        'question-bank',
        'paper-mgmt',
        'paper-review-all',
        'paper-review-teachers-all',
        'paper-review-quick-my-tasks',
        'activity-data',
        'activity-module-placeholder'
    ].includes(pageId);
}

function goBackFromPage(pageId) {
    const target = buildBackTarget(pageId);
    navigateTo(target.pageId, { params: target.params || {}, source: target.source || null });
}

function handleBreadcrumbBack(pageId) {
    goBackFromPage(pageId);
}

// ===== NAVIGATION =====

function navigateTo(pageId, options = {}) {
    const params = options.params || {};
    const hasExplicitSource = options.source !== undefined;
    let source = options.source !== undefined
        ? options.source
        : (currentPage ? { pageId: currentPage, params: currentPageParams || {}, tabKey: activeTabKey, implicit: true } : null);

    // Legacy alias: activity-manage -> activity-overview (enters manage mode)
    if (pageId === 'activity-manage') {
        isInManageMode = true;
        topNavSection = 'activity';
        pageId = 'activity-overview';
    }

    // Platform-level quiz pages from the Activity workbench.
    // It must not inherit the current activity manage sidebar.
    if (
        pageId === 'quiz-activity-list' ||
        pageId === 'question-bank' ||
        pageId === 'paper-mgmt' ||
        pageId === 'paper-review-all' ||
        pageId === 'paper-review-teachers-all' ||
        pageId.startsWith('paper-review-quick-')
    ) {
        isInManageMode = false;
        topNavSection = 'activity';
    }

    if (!Pages[pageId]) return;

    if (!hasExplicitSource && pageId === currentPage) {
        source = currentPageSource || null;
    }

    // Auto-detect manage mode
    if (MANAGE_PAGE_IDS.has(pageId)) {
        isInManageMode = true;
        topNavSection = 'activity';
    }

    if (pageId === 'exam-records' && !options.fromTabSwitch && !options.keepExamRecordPaper) {
        if (typeof examRecordPaper !== 'undefined') {
            examRecordPaper = 'exam-1';
        }
    }

    // Auto-detect top-nav section from page ID
    if (!isInManageMode && SECTION_PAGE_MAP[pageId]) {
        topNavSection = SECTION_PAGE_MAP[pageId];
    }

    // Workbench page → activity section (since workbench is now under Activity Management)
    if (pageId === 'workbench') topNavSection = 'activity';
    if (options.topNavSection) topNavSection = options.topNavSection;

    currentPage = pageId;
    currentPageParams = { ...params };
    currentPageSource = source || null;
    if (!options.fromTabSwitch) {
        upsertPageTab(pageId, currentPageParams, currentPageSource);
    } else if (options.reuseTabKey) {
        activeTabKey = options.reuseTabKey;
        tabVisitHistory = [...tabVisitHistory.filter(key => key !== activeTabKey), activeTabKey];
    } else {
        upsertPageTab(pageId, currentPageParams, currentPageSource);
    }
    const isIndependentCreatePage = ['quiz-activity-create', 'activity-create'].includes(pageId);
    document.body.classList.toggle('independent-create-page', isIndependentCreatePage);
    document.body.classList.toggle('manage-mode', isInManageMode);

    // Update top-nav active state
    updateTopNavActive(topNavSection);
    renderManageTopbar();
    renderPageTabs();

    // Re-render sidebar
    renderSidebar();

    // Render page content (prepend activity header when in manage mode)
    const main = document.getElementById('mainContent');
    const body = Pages[pageId]();
    main.innerHTML = body;

    // Post-render hook (for event listeners)
    if (Pages[pageId + '_init']) {
        Pages[pageId + '_init']();
    }

    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    ensureHomeTab();
    renderPageTabs();
    renderSidebar();
    const initialPage = window.location.hash ? window.location.hash.slice(1) : 'workbench';
    navigateTo(Pages[initialPage] ? initialPage : 'workbench');
});

// ===== PLACEHOLDER PAGES =====

registerPage('home', () => renderPlaceholderPage('首页', 'home', '欢迎来到知识问答活动管理平台。请从顶部导航选择功能模块。'));
registerPage('resource-mgmt', () => renderPlaceholderPage('资源管理', 'resource', '资源管理模块正在开发中，敬请期待。'));
registerPage('data-mgmt', () => renderPlaceholderPage('数据管理', 'data', '数据管理模块正在开发中，敬请期待。'));
registerPage('system-mgmt', () => renderPlaceholderPage('系统管理', 'system', '系统管理模块正在开发中，敬请期待。'));
registerPage('activity-data', () => renderActivityDataPage());

function renderPlaceholderPage(title, section, desc) {
    const icons = { home: '🏠', resource: '📁', data: '📈', system: '⚙️' };
    return `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;text-align:center">
        <div style="width:80px;height:80px;border-radius:var(--radius-xl);background:var(--primary-light);display:flex;align-items:center;justify-content:center;font-size:36px;margin-bottom:var(--spacing-lg)">${icons[section] || '📋'}</div>
        <h2 style="font-size:var(--font-size-xl);font-weight:var(--font-weight-bold);color:var(--text-primary);margin-bottom:var(--spacing-sm)">${title}</h2>
        <p style="font-size:var(--font-size-base);color:var(--text-secondary);max-width:400px;line-height:1.6">${desc}</p>
        ${section !== 'home' ? '<div style="margin-top:var(--spacing-lg)"><span class="badge badge-blue">即将上线</span></div>' : `
        <div style="margin-top:var(--spacing-xl);display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-md);max-width:600px">
            <div class="card" style="padding:var(--spacing-lg);text-align:center;cursor:pointer" onclick="switchTopNav('activity');navigateTo('workbench')">
                <div style="font-size:24px;margin-bottom:var(--spacing-xs)">🏠</div>
                <div style="font-size:var(--font-size-sm);font-weight:var(--font-weight-semibold)">活动概况</div>
                <div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">活动管理入口</div>
            </div>
            <div class="card" style="padding:var(--spacing-lg);text-align:center;cursor:pointer" onclick="switchTopNav('activity');navigateTo('activity-list')">
                <div style="font-size:24px;margin-bottom:var(--spacing-xs)">📋</div>
                <div style="font-size:var(--font-size-sm);font-weight:var(--font-weight-semibold)">活动列表</div>
                <div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">活动列表与配置</div>
            </div>
            <div class="card" style="padding:var(--spacing-lg);text-align:center;cursor:pointer" onclick="switchTopNav('activity');navigateTo('dashboard')">
                <div style="font-size:24px;margin-bottom:var(--spacing-xs)">📊</div>
                <div style="font-size:var(--font-size-sm);font-weight:var(--font-weight-semibold)">运营驾驶舱</div>
                <div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">运营驾驶舱</div>
            </div>
        </div>`}
    </div>`;
}

function renderPlanningEmptyPage(title, desc) {
    return `
    <div class="planning-empty-page">
        <div class="planning-empty-icon" aria-hidden="true">📋</div>
        <h2>${title}</h2>
        <p>${desc}</p>
        <span>即将上线</span>
    </div>`;
}

function renderPublicFeatureEmptyPage() {
    return `
    <div class="public-empty-page">
        <div class="public-empty-icon" aria-hidden="true">📋</div>
        <h2>公共功能</h2>
        <p>更多扩展能力将在这里统一管理。</p>
        <span>即将上线</span>
    </div>`;
}

function renderActivityDataPage() {
    return pageHeader('📊 数据概况', '活动管理 / 数据概况') + `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--spacing-md);margin-bottom:var(--spacing-lg)">
        ${statCard('528', '总参与人数', 'linear-gradient(135deg,#4A6CF7,#3B5DE7)')}
        ${statCard('73.1%', '完成率', 'linear-gradient(135deg,#10B981,#059669)')}
        ${statCard('78.5', '平均分', 'linear-gradient(135deg,#F59E0B,#D97706)')}
        ${statCard('82.3%', '通过率', 'linear-gradient(135deg,#8B5CF6,#7C3AED)')}
    </div>
    <div class="card" style="padding:var(--spacing-lg)">
        <h3 style="font-size:var(--font-size-base);font-weight:700;margin-bottom:var(--spacing-md)">活动数据汇总</h3>
        <div class="info-box blue">💡 数据概况展示所有活动的关键指标汇总。点击具体活动进入管理后可查看该活动的详细数据。</div>
        <div style="margin-top:var(--spacing-md)">
            ${tableWrap(
                ['活动名称', '活动类型', '参与人数', '完成率', '平均分', '状态'],
                `<tr><td>阅启新篇·读享时光</td><td><span class="badge badge-blue">知识问答</span></td><td>528</td><td>73.1%</td><td>78.5</td><td><span class="badge badge-green">进行中</span></td></tr>
                 <tr><td>华服知识竞赛</td><td><span class="badge badge-blue">知识问答</span></td><td>320</td><td>85.2%</td><td>82.1</td><td><span class="badge badge-green">进行中</span></td></tr>
                 <tr><td>非遗文化闯关</td><td><span class="badge badge-blue">知识问答</span></td><td>156</td><td>91.0%</td><td>88.3</td><td><span class="badge badge-green">进行中</span></td></tr>`
            )}
        </div>
    </div>`;
}

// ===== MODAL =====
function openModal(title, bodyHtml, onConfirm, opts = {}) {
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    const overlay = document.getElementById('modalOverlay');
    if (!titleEl || !bodyEl || !overlay) return;
    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    overlay.querySelector('.modal').className = `modal ${opts.modalClass || ''}`.trim();
    overlay.classList.add('show');

    const confirmBtn = document.getElementById('modalConfirm');
    if (!confirmBtn) return;
    confirmBtn.textContent = opts.confirmText || '确认';
    confirmBtn.className = opts.danger ? 'btn btn-danger' : 'btn btn-primary';
    confirmBtn.onclick = () => {
        if (onConfirm && onConfirm() === false) return;
        closeModal();
    };

    const foot = document.getElementById('modalFoot');
    const cancelBtn = foot?.querySelector('.btn-ghost');
    if (cancelBtn) {
        cancelBtn.textContent = opts.cancelText || '取消';
        cancelBtn.onclick = closeModal;
        cancelBtn.style.display = opts.hideCancel ? 'none' : '';
    }
}

function closeModal() {
    document.getElementById('modalOverlay')?.classList.remove('show');
}

// Close modal on overlay click
document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

// ===== SHARED HELPERS =====
function statCard(val, label, gradient) {
    return `<div class="stat-card" style="background:${gradient}"><h3>${val}</h3><p>${label}</p></div>`;
}

function pageHeader(title, breadcrumb) {
    if (SIDEBAR_NAV_PAGE_IDS.has(currentPage) || shouldHideSecondaryMenuReturnBar(currentPage)) return '';
    const back = renderGlobalBack(currentPage);
    return `
    <div class="page-header-wrap">
        <div class="page-header">
            <div class="page-header-main">
                <div class="page-header-title-row">
                    ${back ? `<div class="page-header-back">${back}</div>` : ''}
                    <h2>${title}</h2>
                </div>
            </div>
        </div>
    </div>`;
}

function filterBar(filters) {
    return `<div class="filter-bar">${filters.map(f => {
        if (f.type === 'input') return `<input placeholder="${f.placeholder}">`;
        if (f.type === 'select') return `<select>${f.options.map(o => `<option>${o}</option>`).join('')}</select>`;
        return '';
    }).join('')}<button class="btn btn-primary btn-sm">查询</button><button class="btn btn-ghost btn-sm">重置</button></div>`;
}

function renderStandardPagination(total, page = 1, pageSize = 20) {
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    return `
    <div class="table-pagination">
        <span>共 ${total} 条</span>
        <select class="pagination-size" aria-label="每页条数">
            <option ${pageSize === 20 ? 'selected' : ''}>20条/页</option>
            <option ${pageSize === 50 ? 'selected' : ''}>50条/页</option>
            <option ${pageSize === 100 ? 'selected' : ''}>100条/页</option>
        </select>
        <div class="pagination">
            <button class="pagination-item ${page <= 1 ? 'disabled' : ''}" type="button">‹</button>
            ${Array.from({ length: Math.min(pageCount, 5) }, (_, index) => index + 1).map(item => `
                <button class="pagination-item ${item === page ? 'active' : ''}" type="button">${item}</button>
            `).join('')}
            <button class="pagination-item ${page >= pageCount ? 'disabled' : ''}" type="button">›</button>
        </div>
        <label class="pagination-jumper">前往 <input value="${page}" aria-label="页码"> 页</label>
    </div>`;
}

function tableWrap(headers, rows, options = {}) {
    const pagination = options.pagination === false ? '' : renderStandardPagination(options.total ?? countTableRows(rows), options.page || 1, options.pageSize || 20);
    return `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>${pagination}`;
}

function countTableRows(rows) {
    if (!rows) return 0;
    const matches = String(rows).match(/<tr[\s>]/g);
    return matches ? matches.length : 0;
}

function tabsHtml(tabDefs, activeId) {
    return `<div class="tabs">${tabDefs.map(t =>
        `<div class="tab${t.id === activeId ? ' active' : ''}" onclick="switchTab('${t.group}','${t.id}')">${t.label}</div>`
    ).join('')}</div>`;
}

function switchTab(group, activeId) {
    const container = document.querySelector(`[data-tab-group="${group}"]`) || document.querySelector('.tabs')?.parentElement;
    if (!container) return;
    container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    container.querySelectorAll('.tab').forEach(t => {
        if (t.textContent.trim() === activeId || t.onclick?.toString().includes(activeId)) t.classList.add('active');
    });
    container.querySelectorAll('[data-tab-pane]').forEach(p => {
        p.style.display = p.dataset.tabPane === activeId ? 'block' : 'none';
    });
}
