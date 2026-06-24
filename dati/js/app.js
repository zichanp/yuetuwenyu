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
const DAILY_QUESTION_TYPE_FILTERS = ['全部题型', ...STANDARD_ANSWER_QUESTION_TYPE_LABELS];
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

function dailyQuestionTypeOptions(selected = '全部题型', includeAll = true) {
    const normalized = selected === '全部标准答案题' || selected === '简答题' || selected === '问答题' ? '全部题型' : selected;
    const types = includeAll ? DAILY_QUESTION_TYPE_FILTERS : STANDARD_ANSWER_QUESTION_TYPE_LABELS;
    return types.map(t => `<option ${normalized === t ? 'selected' : ''}>${t}</option>`).join('');
}

function isDailySupportedQuestionType(type) {
    return STANDARD_ANSWER_QUESTION_TYPE_LABELS.includes(type);
}

function examQuestionTypeOptions(selected = '全部题型', includeAll = true) {
    const normalized = selected === '全部标准答案题' ? '全部题型' : selected === '问答题' ? '简答题' : selected;
    const types = includeAll ? EXAM_QUESTION_TYPE_FILTERS : SYSTEM_QUESTION_TYPE_LABELS;
    return types.map(t => `<option ${normalized === t ? 'selected' : ''}>${t}</option>`).join('');
}

function formatDateTimeSecond(value) {
    const text = String(value ?? '').trim();
    if (!text || text === '-' || text === '—' || text === '待发布') return text || '-';
    const normalized = text.replace('T', ' ');
    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return `${normalized} 00:00:00`;
    if (/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}$/.test(normalized)) return `${normalized}:00`;
    if (/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/.test(normalized)) return normalized;
    if (/^\d{2}:\d{2}$/.test(normalized)) return `${normalized}:00`;
    return text;
}

function formatDateTimeRangeSecond(value) {
    const text = String(value ?? '').trim();
    if (!text) return '-';
    if (text.includes(' 至 ')) {
        return text.split(' 至 ').map(part => formatDateTimeSecond(part)).join(' 至 ');
    }
    if (text.includes(' - ')) {
        const parts = text.split(' - ');
        if (parts.length === 2 && /^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}$/.test(parts[0]) && /^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}$/.test(parts[1])) {
            return parts.map(part => formatDateTimeSecond(part)).join(' - ');
        }
        const startDate = parts[0]?.match(/^(\d{4}-\d{2}-\d{2}) /)?.[1];
        if (parts.length === 2 && startDate && /^\d{1,2}:\d{2}$/.test(parts[1])) {
            return `${formatDateTimeSecond(parts[0])} - ${formatDateTimeSecond(`${startDate} ${parts[1]}`)}`;
        }
    }
    return formatDateTimeSecond(text);
}

// ===== ACTIVITY DROPDOWN =====
function renderGlobalActivityCreateDropdown(options = {}) {
    const {
        buttonClass = 'btn btn-primary',
        buttonStyle = '',
        buttonText = '+ 创建活动'
    } = options;
    const styleAttr = buttonStyle ? ` style="${buttonStyle}"` : '';

    return `
        <div class="activity-dropdown">
            <button class="${buttonClass}" onclick="toggleActivityDropdown(event)"${styleAttr}>${buttonText}</button>
            <div class="activity-dropdown-menu">
                <div class="activity-dropdown-item" onclick="navigateTo('activity-create');closeActivityDropdown()">
                    <div class="ad-icon" style="background:#FFF7E6;color:#FA8C16">🪧</div>征集类
                </div>
                <div class="activity-dropdown-item" onclick="navigateTo('activity-create');closeActivityDropdown()">
                    <div class="ad-icon" style="background:#E6FFFB;color:#13C2C2">⭐</div>任务打卡
                </div>
                <div class="activity-dropdown-item" onclick="navigateTo('quiz-activity-create');closeActivityDropdown()">
                    <div class="ad-icon" style="background:#F6FFED;color:#52C41A">📚</div>知识问答
                </div>
                <div class="activity-dropdown-item" onclick="navigateTo('offline-activity-create');closeActivityDropdown()">
                    <div class="ad-icon" style="background:#FFF1F0;color:#F5222D">📍</div>活动报名
                </div>
                <div class="activity-dropdown-item" onclick="navigateTo('vote-activity-create');closeActivityDropdown()">
                    <div class="ad-icon" style="background:#E6F7FF;color:#1890FF">🙋</div>投票
                </div>
            </div>
        </div>
    `;
}

function toggleActivityDropdown(e) {
    e.stopPropagation();
    const dropdown = e.currentTarget.closest('.activity-dropdown');
    const menu = dropdown?.querySelector('.activity-dropdown-menu');
    if (!menu) return;
    const willShow = !menu.classList.contains('show');
    closeActivityDropdown();
    if (!willShow) return;
    menu.classList.toggle('show');
}

function closeActivityDropdown() {
    document.querySelectorAll('.activity-dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
    });
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
    if (typeof closeActivityCardMoreMenus === 'function') closeActivityCardMoreMenus();
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
const NAVIGATION_STATE_STORAGE_KEY = 'qoder.navigationState';

let currentManageActivity = {
    name: '阅启新篇·读享时光 —— 阅途成长共读计划',
    type: '知识问答',
    status: '进行中',
    time: '2026-03-06 10:10:10 至 2026-03-26 23:59:59',
    quizMode: '在线考试',
    allowResume: false
};

const PAGE_META = {
    home: { title: '首页', tabTitle: '首页', parentPath: null, breadcrumb: ['首页'], showBack: false, generateTab: true },
    workbench: { title: '活动概况', tabTitle: '活动概况', closable: false, parentPath: null, breadcrumb: ['活动管理', '活动概况'], showBack: false, generateTab: true },
    'activity-list': { title: '活动列表', tabTitle: '活动列表', parentPath: 'workbench', breadcrumb: ['活动管理', '活动列表'], showBack: false, generateTab: true },
    'activity-module-placeholder': { title: '活动模块', tabTitle: params => params?.module || '活动模块', parentPath: 'workbench', breadcrumb: ['活动管理', '活动模块'], showBack: false, generateTab: true },
    'quiz-activity-list': { title: '知识问答活动列表', tabTitle: '知识问答', parentPath: 'workbench', breadcrumb: ['活动管理', '活动概况', '知识问答', '活动列表'], showBack: true, generateTab: true },
    'vote-activity-list': { title: '投票活动列表', tabTitle: '投票活动列表', parentPath: 'workbench', breadcrumb: ['活动管理', '投票', '活动列表'], showBack: true, generateTab: true },
    'vote-activity-data': { title: '投票数据概况', tabTitle: '投票数据概况', parentPath: 'workbench', breadcrumb: ['活动管理', '投票', '数据概况'], showBack: true, generateTab: true },
    'vote-activity-create': { title: params => params?.mode === 'edit' ? '编辑投票活动' : '创建投票活动', tabTitle: params => params?.mode === 'edit' ? '编辑投票活动' : '创建投票活动', parentPath: 'vote-activity-list', breadcrumb: () => ['活动管理', currentPageParams?.mode === 'edit' ? '编辑投票活动' : '创建投票活动'], showBack: true, generateTab: true },
    'vote-manage-overview': { title: '活动概览', tabTitle: () => `投票管理-${currentManageActivity.name}`, parentPath: 'vote-activity-list', breadcrumb: ['活动管理', currentManageActivity.name, '活动概览'], showBack: true, generateTab: true },
    'vote-records': { title: '投票情况', tabTitle: '投票情况', parentPath: 'vote-manage-overview', breadcrumb: ['活动管理', currentManageActivity.name, '投票情况'], showBack: true, generateTab: true },
    'vote-stats': { title: '数据统计', tabTitle: '数据统计', parentPath: 'vote-manage-overview', breadcrumb: ['活动管理', currentManageActivity.name, '数据统计'], showBack: true, generateTab: true },
    'vote-unit-data': { title: '单位数据情况', tabTitle: '单位数据情况', parentPath: 'vote-stats', breadcrumb: ['活动管理', currentManageActivity.name, '数据统计', '单位数据情况'], showBack: true, generateTab: true },
    'vote-risk-records': { title: '异常投票记录', tabTitle: '异常投票记录', parentPath: 'vote-manage-overview', breadcrumb: ['活动管理', currentManageActivity.name, '异常投票记录'], showBack: true, generateTab: true },
    'vote-settings': { title: '活动设置', tabTitle: '活动设置', parentPath: 'vote-manage-overview', breadcrumb: ['活动管理', currentManageActivity.name, '活动设置'], showBack: true, generateTab: true },
    'offline-activity-data': { title: '活动报名数据概况', tabTitle: '活动报名数据概况', parentPath: 'workbench', breadcrumb: ['活动管理', '活动报名', '数据概况'], showBack: true, generateTab: true },
    dashboard: { title: '运营驾驶舱', tabTitle: '运营驾驶舱', parentPath: null, breadcrumb: ['运营管理', '运营驾驶舱'], showBack: false, generateTab: true },
    'activity-stat-placeholder': { title: '数据统计', tabTitle: '数据统计', parentPath: 'workbench', breadcrumb: ['活动管理', '数据统计'], showBack: false, generateTab: true },
    'activity-manage': { title: '活动管理', tabTitle: () => `活动管理-${currentManageActivity.name}`, parentPath: 'activity-list', breadcrumb: ['活动管理', currentManageActivity.name, '活动概览'], showBack: true, generateTab: true },
    'activity-overview': { title: '活动管理', tabTitle: () => `活动管理-${currentManageActivity.name}`, parentPath: 'activity-list', breadcrumb: ['活动管理', currentManageActivity.name, '活动概览'], showBack: true, generateTab: true },
    'org-mgmt': { title: '组织机构', tabTitle: '组织机构', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '组织机构'], showBack: true, generateTab: true },
    registration: { title: '报名情况', tabTitle: '报名情况', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '报名情况'], showBack: true, generateTab: true },
    'offline-checkin-staff': { title: '签到工作人员', tabTitle: '签到工作人员', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '签到工作人员'], showBack: true, generateTab: true },
    'activity-feedback': { title: '活动反馈', tabTitle: '活动反馈', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '活动反馈'], showBack: true, generateTab: true },
    'exam-records': { title: '用户答题情况', tabTitle: '用户答题情况', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '用户答题情况'], showBack: true, generateTab: true },
    'offline-signin-stats': { title: '用户签到情况', tabTitle: '用户签到情况', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '数据统计', '用户签到情况'], showBack: true, generateTab: true },
    'user-qualified': { title: '用户达标情况', tabTitle: '用户达标情况', parentPath: 'exam-records', breadcrumb: ['活动管理', currentManageActivity.name, '数据统计', '用户达标情况'], showBack: true, generateTab: true },
    'daily-score-detail': { title: '得分明细', tabTitle: '得分明细', parentPath: 'activity-overview', breadcrumb: ['活动管理', currentManageActivity.name, '得分明细'], showBack: true, generateTab: true },
    'daily-user-detail': { title: '每日记录', tabTitle: '每日记录', parentPath: 'exam-records', breadcrumb: ['活动管理', currentManageActivity.name, '用户答题情况', '每日记录'], showBack: true, generateTab: true },
    'exam-session-detail': { title: '考试场次', tabTitle: '考试场次', parentPath: 'exam-records', breadcrumb: ['活动管理', currentManageActivity.name, '用户答题情况', '考试场次'], showBack: true, generateTab: true },
    'level-user-detail': { title: '关卡记录', tabTitle: '关卡记录', parentPath: 'exam-records', breadcrumb: ['活动管理', currentManageActivity.name, '用户答题情况', '关卡记录'], showBack: true, generateTab: true },
    'level-answer-detail': { title: '过关详情', tabTitle: '过关详情', parentPath: 'exam-records', breadcrumb: ['活动管理', currentManageActivity.name, '用户答题情况', '过关详情'], showBack: true, generateTab: true },
    'answer-detail': { title: '答卷详情', tabTitle: '答卷详情', parentPath: 'exam-records', breadcrumb: ['活动管理', currentManageActivity.name, '用户答题情况', '答卷详情'], showBack: true, generateTab: true },
    'unit-data': { title: '单位数据情况', tabTitle: '单位数据情况', parentPath: currentManageActivity.type === '活动报名' ? 'offline-signin-stats' : 'exam-records', breadcrumb: currentManageActivity.type === '活动报名' ? ['活动管理', currentManageActivity.name, '数据统计', '单位数据情况'] : ['活动管理', currentManageActivity.name, '用户答题情况', '单位数据情况'], showBack: true, generateTab: true },
    'unit-exam-detail': { title: '单位考试明细', tabTitle: '单位考试明细', parentPath: 'unit-data', breadcrumb: ['活动管理', currentManageActivity.name, '用户答题情况', '单位数据情况', '单位考试明细'], showBack: true, generateTab: true },
    'unit-daily-detail': { title: '单位每日答题明细', tabTitle: '单位每日答题明细', parentPath: 'unit-data', breadcrumb: ['活动管理', currentManageActivity.name, '用户答题情况', '单位数据情况', '单位每日答题明细'], showBack: true, generateTab: true },
    'unit-level-detail': { title: '单位闯关明细', tabTitle: '单位闯关明细', parentPath: 'unit-data', breadcrumb: ['活动管理', currentManageActivity.name, '用户答题情况', '单位数据情况', '单位闯关明细'], showBack: true, generateTab: true },
    'offline-unit-detail': { title: '单位报名明细', tabTitle: '单位报名明细', parentPath: 'unit-data', breadcrumb: ['活动管理', currentManageActivity.name, '数据统计', '单位数据情况', '单位报名明细'], showBack: true, generateTab: true },
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
    'station-activity-list': { title: '分站活动', tabTitle: '分站活动', parentPath: 'dashboard', breadcrumb: ['运营管理', '分站活动'], showBack: false, generateTab: true },
    'station-activity-create': { title: params => params?.mode === 'edit' ? '编辑分站活动' : '新建分站活动', tabTitle: params => params?.mode === 'edit' ? '编辑分站活动' : '新建分站活动', parentPath: 'station-activity-list', breadcrumb: ['运营管理', '分站活动', '新建分站活动'], showBack: true, generateTab: true },
    'resource-mgmt': { title: '资源管理', tabTitle: '资源管理', parentPath: 'workbench', breadcrumb: ['资源管理'], showBack: false, generateTab: true },
    'data-mgmt': { title: '数据管理', tabTitle: '数据管理', parentPath: 'workbench', breadcrumb: ['数据管理'], showBack: false, generateTab: true },
    'system-mgmt': { title: '系统设置', tabTitle: '系统设置', parentPath: 'workbench', breadcrumb: ['系统设置'], showBack: false, generateTab: true },
    'blacklist-mgmt': { title: '黑名单管理', tabTitle: '黑名单管理', parentPath: 'system-mgmt', breadcrumb: ['系统设置', '黑名单管理'], showBack: false, generateTab: true }
};

// ===== SIDEBAR MENUS PER SECTION =====

// Activity Management sidebar (when not inside a specific activity) — per Image 2
const SIDEBAR_ACTIVITY = [
    { page: 'workbench', icon: '🌐', label: '活动概况' },
    { page: 'activity-list', icon: '🌐', label: '活动列表' },
    { label: '征集类', icon: '🌐', key: 'collection', defaultPage: 'activity-list' },
    { label: '任务打卡', icon: '🌐', key: 'task', defaultPage: 'activity-list' },
    { label: '知识问答', icon: '🌐', key: 'quiz', defaultPage: 'quiz-activity-list' },
    { label: '活动报名', icon: '🌐', key: 'offline', defaultPage: 'activity-list' },
    { label: '投票', icon: '🌐', key: 'vote', defaultPage: 'vote-activity-list' },
    { page: 'activity-stat-placeholder', icon: '🌐', label: '数据统计' }
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
        { label: '数据概况', page: 'activity-data' }
    ],
    offline: [
        { label: '活动列表', page: 'activity-list' },
        { label: '数据概况', page: 'offline-activity-data' }
    ],
    vote: [
        { label: '活动列表', page: 'vote-activity-list' },
        { label: '数据概况', page: 'vote-activity-data' }
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

const ACTIVITY_SIDEBAR_DISABLED_TYPES = new Set(['collection', 'task']);
const ACTIVITY_SIDEBAR_DISABLED_TOOLTIP = '详见墨刀原型';

const QUIZ_PLATFORM_PAGE_IDS = new Set([
    'quiz-activity-list',
    'question-bank',
    'paper-mgmt',
    'paper-review-teachers-all',
    'paper-review-all',
    'paper-review-quick-my-tasks',
    'paper-review-quick-question-list',
    'paper-review-quick-attempt-list',
    'paper-review-quick-student-list',
    'paper-review-quick-question-marking',
    'paper-review-quick-marking'
]);
const VOTE_PLATFORM_PAGE_IDS = new Set([
    'vote-activity-list',
    'vote-activity-data',
    'vote-activity-create'
]);
const OFFLINE_PLATFORM_PAGE_IDS = new Set([
    'offline-activity-data'
]);

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
            { page: 'paper-review-teachers', label: '阅卷老师' }
        ]
    },
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
    { page: 'daily-score-detail', label: '得分明细' },
    { page: 'activity-feedback', label: '活动反馈' },
    {
        page: 'exam-records',
        label: '数据统计',
        children: [
            { page: 'exam-records', label: '用户答题情况' },
            { page: 'user-qualified', label: '用户达标情况' },
            { page: 'unit-data', label: '单位数据情况' }
        ]
    },
    { page: 'more-functions', label: '更多功能' }
];

const SIDEBAR_OFFLINE_ACTIVITY_MANAGE = [
    { page: 'activity-overview', label: '活动概览' },
    { page: 'org-mgmt', label: '组织机构' },
    { page: 'registration', label: '报名情况' },
    { page: 'offline-checkin-staff', label: '签到工作人员' },
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
        page: 'offline-signin-stats',
        label: '数据统计',
        children: [
            { page: 'unit-data', label: '单位数据情况' }
        ]
    },
    { page: 'more-functions', label: '更多功能' }
];

const SIDEBAR_VOTE_ACTIVITY_MANAGE = [
    { page: 'vote-manage-overview', label: '活动概览' },
    { page: 'org-mgmt', label: '组织机构' },
    { page: 'vote-records', label: '投票情况' },
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
    { page: 'more-functions', label: '更多功能' }
];

const SIDEBAR_OPERATION = [
    { page: 'dashboard', icon: '📊', label: '运营驾驶舱' },
    { page: 'station-activity-list', icon: '🏫', label: '分站活动' }
];

const SIDEBAR_SYSTEM = [
    { page: 'system-mgmt', icon: '⚙️', label: '系统设置' }
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
    'offline-activity-data': 'activity',
    'activity-stat-placeholder': 'activity',
    'offline-activity-create': 'activity',
    'vote-activity-create': 'activity',
    'dashboard':          'operation',
    'station-activity-list': 'operation',
    'station-activity-create': 'operation',
    'blacklist-mgmt':     'system',
    // Manage mode pages → activity section
    'activity-overview': 'activity',
    'org-mgmt':          'activity',
    'registration':      'activity',
    'activity-feedback': 'activity',
    'exam-records':      'activity',
    'daily-score-detail': 'activity',
    'level-user-detail': 'activity',
    'level-answer-detail': 'activity',
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
    'unit-exam-detail':  'activity',
    'unit-daily-detail': 'activity',
    'unit-level-detail': 'activity',
    'offline-unit-detail': 'activity',
    'activity-dynamic':  'activity',
    'recommend-resources': 'activity',
    'more-functions':   'activity',
    'vote-manage-overview': 'activity',
    'vote-records': 'activity',
    'vote-stats': 'activity',
    'vote-unit-data': 'activity',
    'vote-risk-records': 'activity',
    'vote-settings': 'activity',
    'resource-mgmt':    'resource',
    'data-mgmt':        'data',
    'system-mgmt':      'system'
};

const MANAGE_NAV_PAGE_IDS = new Set([...SIDEBAR_ACTIVITY_MANAGE, ...SIDEBAR_OFFLINE_ACTIVITY_MANAGE, ...SIDEBAR_VOTE_ACTIVITY_MANAGE].flatMap(m => [m.page, ...(m.children || []).map(child => child.page)]));
const MANAGE_PAGE_IDS = new Set(MANAGE_NAV_PAGE_IDS);
['paper-review-student-list', 'paper-review-question-list', 'paper-review-attempt-list', 'paper-review-marking', 'paper-review-question-marking', 'paper-review-detail', 'paper-review-teachers', 'paper-review-assign-question', 'paper-review-my-tasks', 'practice-create', 'submission-list', 'leaderboard', 'daily-user-detail', 'exam-session-detail', 'level-user-detail', 'level-answer-detail', 'answer-detail', 'unit-exam-detail', 'unit-daily-detail', 'unit-level-detail', 'offline-unit-detail'].forEach(id => MANAGE_PAGE_IDS.add(id));
const ACTIVITY_PAGE_IDS = new Set(SIDEBAR_ACTIVITY.map(m => m.page).filter(Boolean));
const OPERATION_PAGE_IDS = new Set(SIDEBAR_OPERATION.map(m => m.page).filter(Boolean));
const SYSTEM_PAGE_IDS = new Set(SIDEBAR_SYSTEM.map(m => m.page).filter(Boolean));
const SIDEBAR_NAV_PAGE_IDS = new Set([...ACTIVITY_PAGE_IDS, ...OPERATION_PAGE_IDS, ...SYSTEM_PAGE_IDS, ...MANAGE_NAV_PAGE_IDS]);

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
        menuItems = currentManageActivity.type === '活动报名'
            ? SIDEBAR_OFFLINE_ACTIVITY_MANAGE
            : currentManageActivity.type === '投票'
                ? SIDEBAR_VOTE_ACTIVITY_MANAGE
                : SIDEBAR_ACTIVITY_MANAGE;
    } else {
        // Section-specific sidebar
        switch (topNavSection) {
            case 'activity':
                menuItems = SIDEBAR_ACTIVITY;
                break;
            case 'home':
            case 'resource':
            case 'operation':
                menuItems = SIDEBAR_OPERATION;
                break;
            case 'system':
                menuItems = SIDEBAR_SYSTEM;
                break;
            case 'data':
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
    const activeModule = QUIZ_PLATFORM_PAGE_IDS.has(currentPage) ? 'quiz'
        : VOTE_PLATFORM_PAGE_IDS.has(currentPage) ? 'vote'
        : OFFLINE_PLATFORM_PAGE_IDS.has(currentPage) ? 'offline'
        : currentPage === 'workbench' ? 'workbench'
        : currentPageParams?.activityType
            || (currentPage === 'activity-list' && currentPageSource?.params?.activityType ? currentPageSource.params.activityType : null)
            || null;
    const renderActivityTool = item => {
        const isActiveType = activeModule === item.key;
        const isOpen = isActivitySidebarGroupOpen(item.key, isActiveType);
        const modules = ACTIVITY_SIDEBAR_MODULES_BY_TYPE[item.key] || [];
        const isDisabled = ACTIVITY_SIDEBAR_DISABLED_TYPES.has(item.key);
        const disabledAttrs = isDisabled ? ` data-tooltip="${ACTIVITY_SIDEBAR_DISABLED_TOOLTIP}" title="${ACTIVITY_SIDEBAR_DISABLED_TOOLTIP}" aria-disabled="true"` : '';
        return `
        <div class="activity-tool-group ${isActiveType ? 'active' : ''} ${isOpen ? 'open' : ''} ${isDisabled ? 'is-disabled' : ''}">
            <div class="activity-tool-title ${isDisabled ? 'tooltip' : ''}" onclick="toggleActivitySidebarGroup('${item.key}', event)" role="button" aria-expanded="${isOpen}"${disabledAttrs}>
                <span class="activity-tool-icon">${item.icon}</span>
                <span>${item.label}</span>
                <b onclick="event.stopPropagation();toggleActivitySidebarGroup('${item.key}', event)">⌃</b>
            </div>
            <div class="activity-tool-children">
                ${modules.map(module => {
                    const isActive = isActiveType && (
                        currentPage === module.page ||
                        (module.page === 'activity-data' && currentPage === 'activity-data' && currentPageParams?.activityType === item.key) ||
                        (module.page === 'vote-activity-data' && currentPage === 'vote-activity-data') ||
                        (module.page === 'paper-review-quick-my-tasks' && currentPage.startsWith('paper-review-quick-')) ||
                        (module.module && currentPage === 'activity-module-placeholder' && currentPageParams?.module === module.module)
                    );
                    const page = module.page || 'activity-module-placeholder';
                    const clickAction = `navigateActivitySidebarModule('${page}', '${item.key}', '${item.label}', '${module.module || module.label}')`;
                    const childDisabledAttrs = isDisabled ? ` data-tooltip="${ACTIVITY_SIDEBAR_DISABLED_TOOLTIP}" title="${ACTIVITY_SIDEBAR_DISABLED_TOOLTIP}" aria-disabled="true"` : '';
                    const childClickAction = isDisabled ? 'event.stopPropagation()' : clickAction;
                    return `<div class="activity-side-child ${isActive ? 'active' : ''} ${isDisabled ? 'is-disabled tooltip' : ''}" data-page="${page}" onclick="${childClickAction}"${childDisabledAttrs}>${module.label}</div>`;
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
    persistNavigationState();
    renderSidebar();
}

function openActivitySidebarDefault(activityType, activityLabel, defaultPage, event) {
    event?.stopPropagation();
    activitySidebarOpenState = {
        ...activitySidebarOpenState,
        [activityType]: true
    };
    persistNavigationState();
    if (activityType === 'quiz') {
        openQuizActivityList(event);
        return;
    }
    const firstModule = ACTIVITY_SIDEBAR_MODULES_BY_TYPE[activityType]?.[0];
    const page = defaultPage || firstModule?.page || 'activity-module-placeholder';
    const moduleName = firstModule?.module || firstModule?.label || activityLabel;
    if (!page) {
        renderSidebar();
        return;
    }
    navigateActivitySidebarModule(page, activityType, activityLabel, moduleName);
}

function openQuizActivityList(event) {
    event?.stopPropagation();
    activitySidebarOpenState = {
        ...activitySidebarOpenState,
        quiz: true
    };
    persistNavigationState();
    navigateTo('quiz-activity-list', {
        params: {
            activityType: 'quiz',
            activityLabel: '知识问答',
            module: '活动列表'
        },
        source: null
    });
}

function resolveActivitySidebarTarget(page, activityType, moduleName) {
    if (moduleName === '活动列表') {
        if (activityType === 'quiz') return 'quiz-activity-list';
        if (activityType === 'offline') return 'activity-list';
    }
    return page;
}

function navigateActivitySidebarModule(page, activityType, activityLabel, moduleName) {
    const targetPage = resolveActivitySidebarTarget(page, activityType, moduleName);
    navigateTo(targetPage, {
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
        'daily-score-detail': 'daily-score-detail',
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
    persistNavigationState();
    renderSidebar();
}

registerPage('activity-dynamic', () => renderPublicFeatureEmptyPage());
registerPage('recommend-resources', () => renderPublicFeatureEmptyPage());
registerPage('more-functions', () => renderMoreFunctionsPage());
registerPage('activity-stat-placeholder', () => renderPlanningEmptyPage('数据统计', '数据统计模块待研发中，后续将在这里统一展示活动数据分析、趋势概览与指标看板。'));
registerPage('activity-module-placeholder', () => {
    const activityLabel = currentPageParams?.activityLabel || '活动';
    const moduleName = currentPageParams?.module || '功能模块';
    return renderPlaceholderPage(`${activityLabel} · ${moduleName}`, 'activity', `${moduleName}模块正在整理中，可先从左侧切换到活动列表或数据概括。`);
});

// ===== ACTIVITY HEADER (in manage mode) =====

function renderActivityHeader() {
    const a = currentManageActivity;
    const backAction = currentPage === 'practice-records'
        ? "goBackFromPage('practice-records')"
        : 'exitManageMode()';
    return `
    <div class="manage-topbar-inner">
        <button class="manage-topbar-back" onclick="${backAction}" aria-label="返回上一页">
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

function persistNavigationState() {
    try {
        sessionStorage.setItem(NAVIGATION_STATE_STORAGE_KEY, JSON.stringify({
            currentPage,
            currentPageParams,
            currentPageSource,
            topNavSection,
            isInManageMode,
            pageTabs,
            activeTabKey,
            tabVisitHistory,
            manageSidebarOpenState,
            activitySidebarOpenState,
            currentManageActivity
        }));
    } catch (error) {
        console.warn('Failed to persist navigation state:', error);
    }
}

function restoreNavigationState() {
    try {
        const raw = sessionStorage.getItem(NAVIGATION_STATE_STORAGE_KEY);
        if (!raw) return false;
        const state = JSON.parse(raw);
        if (!state || !state.currentPage || !Pages[state.currentPage]) return false;

        currentPage = state.currentPage;
        currentPageParams = state.currentPageParams && typeof state.currentPageParams === 'object' ? state.currentPageParams : {};
        currentPageSource = state.currentPageSource || null;
        topNavSection = state.topNavSection || 'activity';
        isInManageMode = !!state.isInManageMode;
        pageTabs = Array.isArray(state.pageTabs) ? state.pageTabs.filter(tab => tab?.pageId && Pages[tab.pageId]) : [];
        activeTabKey = state.activeTabKey || '';
        tabVisitHistory = Array.isArray(state.tabVisitHistory) ? state.tabVisitHistory.filter(key => pageTabs.some(tab => tab.key === key) || key === 'workbench') : [];
        manageSidebarOpenState = state.manageSidebarOpenState && typeof state.manageSidebarOpenState === 'object' ? state.manageSidebarOpenState : {};
        activitySidebarOpenState = state.activitySidebarOpenState && typeof state.activitySidebarOpenState === 'object' ? state.activitySidebarOpenState : {};
        if (state.currentManageActivity && typeof state.currentManageActivity === 'object') {
            currentManageActivity = { ...currentManageActivity, ...state.currentManageActivity };
        }
        if (activeTabKey && !pageTabs.some(tab => tab.key === activeTabKey) && activeTabKey !== 'workbench') {
            activeTabKey = '';
        }
        return true;
    } catch (error) {
        console.warn('Failed to restore navigation state:', error);
        return false;
    }
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
    persistNavigationState();
}

function closeCurrentPageTab() {
    closePageTab(activeTabKey);
}

function closeOtherPageTabs() {
    pageTabs = pageTabs.filter(tab => tab.key === 'workbench' || tab.key === activeTabKey);
    tabVisitHistory = tabVisitHistory.filter(key => key === 'workbench' || key === activeTabKey);
    renderPageTabs();
    closePageTabsMenu();
    persistNavigationState();
}

function closeRightPageTabs() {
    const currentIndex = pageTabs.findIndex(tab => tab.key === activeTabKey);
    if (currentIndex < 0) return;
    const keepKeys = new Set(pageTabs.slice(0, currentIndex + 1).map(tab => tab.key));
    pageTabs = pageTabs.filter(tab => keepKeys.has(tab.key) || tab.key === 'workbench');
    tabVisitHistory = tabVisitHistory.filter(key => pageTabs.some(tab => tab.key === key));
    renderPageTabs();
    closePageTabsMenu();
    persistNavigationState();
}

function closeAllPageTabs() {
    pageTabs = pageTabs.filter(tab => tab.key === 'workbench');
    tabVisitHistory = ['workbench'];
    activeTabKey = 'workbench';
    renderPageTabs();
    closePageTabsMenu();
    persistNavigationState();
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
        'offline-activity-data',
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

    if (pageId === 'activity-list' && params.activityType === 'quiz') {
        pageId = 'quiz-activity-list';
    }

    // Platform-level quiz pages from the Activity workbench.
    // It must not inherit the current activity manage sidebar.
    if (
        QUIZ_PLATFORM_PAGE_IDS.has(pageId)
    ) {
        isInManageMode = false;
        topNavSection = 'activity';
        source = null;
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
    const isIndependentCreatePage = ['quiz-activity-create', 'activity-create', 'offline-activity-create', 'vote-activity-create'].includes(pageId);
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
    persistNavigationState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    const restored = restoreNavigationState();
    ensureHomeTab();
    renderPageTabs();
    renderSidebar();
    if (restored) {
        navigateTo(currentPage, {
            params: currentPageParams,
            source: currentPageSource,
            topNavSection,
            fromTabSwitch: true,
            reuseTabKey: activeTabKey
        });
        return;
    }
    const initialPage = window.location.hash ? window.location.hash.slice(1) : 'workbench';
    navigateTo(Pages[initialPage] ? initialPage : 'workbench');
});

// ===== PLACEHOLDER PAGES =====

registerPage('home', () => renderPlaceholderPage('首页', 'home', '欢迎来到知识问答活动管理平台。请从顶部导航选择功能模块。'));
registerPage('resource-mgmt', () => renderPlaceholderPage('资源管理', 'resource', '资源管理模块正在开发中，敬请期待。'));
registerPage('data-mgmt', () => renderPlaceholderPage('数据管理', 'data', '数据管理模块正在开发中，敬请期待。'));
registerPage('system-mgmt', () => renderPlaceholderPage('系统设置', 'system', '请从左侧进入需要管理的系统功能。'));
registerPage('activity-data', () => renderActivityDataPage());
registerPage('offline-activity-data', () => renderOfflineActivityDataPage());

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

function renderMoreFunctionsPage() {
    const isQuiz = currentManageActivity.type === '知识问答';
    const resumeEnabled = !!currentManageActivity.allowResume;
    const resumeMode = currentManageActivity.quizMode || '在线考试';
    const resumeHint = resumeMode === '趣味闯关'
        ? '开启后，用户重新进入闯关时可从上次退出位置继续作答，退出期间不计入答题时长。'
        : resumeMode === '每日答题'
            ? '开启后，用户重新进入每日答题时可从上次退出位置继续作答，退出期间不计入答题时长。'
            : '开启后，用户重新进入考试时可从上次退出位置继续作答，退出期间不计入答题时长。';
    return `
    <div class="more-functions-page">
        <h2>更多功能</h2>
        ${isQuiz ? `
        <section class="more-functions-card">
            <div class="more-functions-card-head">
                <h3>答题设置</h3>
                <p class="more-functions-answer-tip">
                    仅在 “在线考试” 模式下，展示该答题设置<br>
                    其他两种答题模式（每日答题、趣味闯关）不显示该配置区块。系统默认：如用户答题过程中异常退出，再次进入时可从上次退出时所在题目继续作答。
                </p>
            </div>
            <div class="more-functions-panel more-functions-panel-compact">
                <div class="more-functions-row">
                    <div class="more-functions-label">
                        <strong>允许断点续答</strong>
                        <span class="more-functions-help tooltip" data-tooltip="${resumeHint}">?</span>
                    </div>
                    <div class="more-functions-control">
                        <label class="switch more-functions-switch" aria-label="允许断点续答">
                            <input type="checkbox" id="moreFunctionsResumeSwitch" ${resumeEnabled ? 'checked' : ''} onchange="toggleMoreFunctionsResume(this.checked)">
                            <span class="sw-slider"></span>
                        </label>
                        <span class="more-functions-status" id="moreFunctionsResumeStatus">${resumeEnabled ? '已开启' : '未开启'}</span>
                    </div>
                </div>
            </div>
        </section>` : ''}
        <section class="more-functions-card">
            <h3>组织机构/单位设置</h3>
            <div class="more-functions-panel">
                <div class="more-functions-row">
                    <div class="more-functions-label">
                        <strong>允许其他单位参与组织</strong>
                        <span class="more-functions-help tooltip" data-tooltip="开启后，符合活动范围的单位可成为本活动的「组织单位」，协助活动推广，并可查看其自身单位的报名、打卡情况。">?</span>
                    </div>
                    <div class="more-functions-control">
                        <label class="switch more-functions-switch">
                            <input type="checkbox" id="moreFunctionsOrgSwitch" onchange="toggleMoreFunctionsOrgSettings(this.checked)">
                            <span class="sw-slider"></span>
                        </label>
                        <span class="more-functions-status" id="moreFunctionsOrgStatus">已关闭</span>
                    </div>
                </div>
                <div class="more-functions-audit" id="moreFunctionsAuditRow" hidden>
                    <span>是否需要审核</span>
                    <label><input type="radio" name="moreFunctionsAudit" checked> 是</label>
                    <label><input type="radio" name="moreFunctionsAudit"> 否</label>
                </div>
            </div>
        </section>
    </div>`;
}

function toggleMoreFunctionsResume(isOpen) {
    currentManageActivity.allowResume = !!isOpen;
    const status = document.getElementById('moreFunctionsResumeStatus');
    if (status) status.textContent = isOpen ? '已开启' : '未开启';
}

function toggleMoreFunctionsOrgSettings(isOpen) {
    const status = document.getElementById('moreFunctionsOrgStatus');
    const auditRow = document.getElementById('moreFunctionsAuditRow');
    if (status) status.textContent = isOpen ? '已开启' : '已关闭';
    if (auditRow) auditRow.hidden = !isOpen;
}

function renderOfflineActivityDataPage() {
    return pageHeader('📊 活动报名数据概况', '活动管理 / 活动报名 / 数据概况') + `
    <section class="quiz-data-page">
        <div class="quiz-data-toolbar card">
            <label><span>时间范围</span><select class="form-control"><option>近 30 天</option><option>近 7 天</option><option>本月</option><option>全部时间</option></select></label>
            <label><span>活动状态</span><select class="form-control"><option>全部状态</option><option>报名中</option><option>预告中</option><option>已结束</option><option>未发布</option></select></label>
            <label><span>举办方式</span><select class="form-control"><option>全部方式</option><option>线上活动</option><option>线下活动</option><option>线上+线下</option></select></label>
            <label><span>活动名称/地区</span><input class="form-control" placeholder="请输入活动名称、城市或地点"></label>
            <div class="quiz-data-toolbar-actions">
                <button class="btn btn-primary">查询</button>
                <button class="btn btn-outline">重置</button>
                <button class="btn btn-outline">导出</button>
            </div>
        </div>

        <div class="quiz-data-metric-grid">
            ${renderQuizDataMetric('报名活动数', '9', '报名中 4 / 已结束 3', '规模', 'blue')}
            ${renderQuizDataMetric('提交报名人数', '2,468', '较上期 +18.6%', '报名', 'cyan')}
            ${renderQuizDataMetric('审核通过率', '87.6%', '通过 2,162 / 提交 2,468', '审核', 'green')}
            ${renderQuizDataMetric('名额占用率', '73.2%', '已占用 2,162 / 总名额 2,954', '名额', 'purple')}
            ${renderQuizDataMetric('签到率', '82.4%', '签到 1,782 / 通过 2,162', '到场', 'orange')}
            ${renderQuizDataMetric('待处理审核', '126', '3 个活动存在积压', '待办', 'red')}
        </div>

        <div class="quiz-data-grid primary">
            <section class="card quiz-data-chart-card">
                <div class="activity-card-head">
                    <div>
                        <h3>报名与到场趋势</h3>
                        <p>按日查看活动报名的提交、审核通过和现场签到变化</p>
                    </div>
                    <div class="activity-segment"><button class="active">报名</button><button>审核通过</button><button>签到</button></div>
                </div>
                ${renderOfflineDataTrendChart()}
                <div class="quiz-data-chart-legend">
                    <span><i style="background:#2F54EB"></i>提交报名</span>
                    <span><i style="background:#52C41A"></i>审核通过</span>
                    <span><i style="background:#FAAD14"></i>签到人数</span>
                </div>
            </section>

            <section class="card quiz-data-chart-card">
                <div class="activity-card-head">
                    <div>
                        <h3>报名转化漏斗</h3>
                        <p>定位从查看活动到报名成功、签到和反馈的流失环节</p>
                    </div>
                </div>
                ${renderOfflineDataFunnel()}
            </section>
        </div>

        <div class="quiz-data-grid secondary">
            <section class="card quiz-data-alert-card">
                <div class="activity-card-head compact">
                    <div>
                        <h3>运营提醒</h3>
                        <p>按审核积压、名额紧张、签到配置和报名截止自动标记</p>
                    </div>
                </div>
                <div class="activity-todo-list">
                    ${renderQuizDataAlert('high', '126 条报名待审核', '建议优先处理“非遗手作体验课”和“城市阅读季 · 讲座沙龙”。')}
                    ${renderQuizDataAlert('medium', '2 个场次名额占用超过 90%', '可考虑追加场次、调整名额或开启候补。')}
                    ${renderQuizDataAlert('medium', '3 个活动将在 48 小时内截止报名', '建议推送最后报名提醒并检查报名表必填字段。')}
                    ${renderQuizDataAlert('low', '1 个线下活动未开启签到', '请确认是否需要配置工作人员扫码、自助扫码或一键签到。')}
                </div>
            </section>

            <section class="card quiz-data-rank-card">
                <div class="activity-card-head">
                    <div>
                        <h3>组织单位与场次表现</h3>
                        <p>同时查看报名贡献单位和名额紧张场次</p>
                    </div>
                </div>
                <div class="quiz-data-rank-grid">
                    ${renderOfflineRankList('报名人数 TOP 单位', OFFLINE_DATA_ORGS, 'signups')}
                    ${renderOfflineRankList('名额占用预警', OFFLINE_DATA_SESSIONS, 'capacity')}
                </div>
            </section>
        </div>

        <section class="card quiz-data-table-card">
            <div class="activity-card-head">
                <div>
                    <h3>活动报名数据明细</h3>
                    <p>覆盖报名表提交、审核、场次名额、签到签退和评价反馈等活动报名字段</p>
                </div>
            </div>
            ${tableWrap(
                ['活动名称', '状态', '举办方式', '报名人数', '审核通过', '待审核', '名额占用', '签到率', '签退率', '反馈数', '异常标记', '操作'],
                OFFLINE_DATA_ACTIVITIES.map(renderOfflineDataTableRow).join(''),
                { total: OFFLINE_DATA_ACTIVITIES.length }
            )}
        </section>
    </section>`;
}

const OFFLINE_DATA_ACTIVITIES = [
    { name: '城市阅读季 · 讲座沙龙', status: '报名中', hostMode: '线下活动', signups: 486, approved: 438, pending: 32, capacity: 520, checkin: 82.6, checkout: 76.8, feedback: 186, risk: '待审核偏多' },
    { name: '非遗手作体验课', status: '报名中', hostMode: '线下活动', signups: 268, approved: 241, pending: 58, capacity: 260, checkin: 88.4, checkout: 81.2, feedback: 128, risk: '名额紧张' },
    { name: '图书馆夜读会', status: '未发布', hostMode: '线下活动', signups: 0, approved: 0, pending: 0, capacity: 120, checkin: 0, checkout: 0, feedback: 0, risk: '待发布' },
    { name: '亲子共读工作坊', status: '报名中', hostMode: '线上+线下', signups: 356, approved: 316, pending: 18, capacity: 420, checkin: 79.1, checkout: 72.4, feedback: 95, risk: '正常' },
    { name: '古籍修复公开课', status: '已结束', hostMode: '线下活动', signups: 424, approved: 389, pending: 0, capacity: 460, checkin: 91.5, checkout: 86.3, feedback: 212, risk: '表现优秀' },
    { name: '数字阅读线上分享会', status: '已结束', hostMode: '线上活动', signups: 612, approved: 548, pending: 0, capacity: 800, checkin: 76.2, checkout: 70.4, feedback: 164, risk: '签到偏低' },
    { name: '文化志愿者招募说明会', status: '预告中', hostMode: '线上+线下', signups: 322, approved: 230, pending: 18, capacity: 374, checkin: 0, checkout: 0, feedback: 0, risk: '报名预热' }
];

const OFFLINE_DATA_ORGS = [
    { name: '阅途文化集团', value: 486, note: '通过 438 人' },
    { name: '广州图书馆', value: 356, note: '通过 316 人' },
    { name: '广东财经大学图书馆', value: 322, note: '通过 230 人' },
    { name: '少儿阅读中心', value: 268, note: '通过 241 人' },
    { name: '城西分馆', value: 214, note: '通过 186 人' }
];

const OFFLINE_DATA_SESSIONS = [
    { name: '非遗手作体验课 · 场次一', value: 92.7, note: '241 / 260 人' },
    { name: '城市阅读季 · 下午场', value: 88.5, note: '230 / 260 人' },
    { name: '古籍修复公开课 · 主会场', value: 84.6, note: '389 / 460 人' },
    { name: '亲子共读工作坊 · 周末场', value: 75.2, note: '316 / 420 人' },
    { name: '数字阅读线上分享会', value: 68.5, note: '548 / 800 人' }
];

function renderOfflineDataTrendChart() {
    const days = ['6/09', '6/10', '6/11', '6/12', '6/13', '6/14', '6/15'];
    const signups = [188, 236, 284, 342, 386, 452, 528];
    const approved = [152, 198, 236, 286, 318, 386, 462];
    const checkins = [86, 126, 148, 184, 216, 268, 326];
    const max = Math.max(...signups);
    const bars = days.map((day, index) => `
        <div class="quiz-trend-day">
            <div class="quiz-trend-bars">
                <i style="height:${Math.round(signups[index] / max * 100)}%;background:#2F54EB"></i>
                <i style="height:${Math.round(approved[index] / max * 100)}%;background:#52C41A"></i>
                <i style="height:${Math.round(checkins[index] / max * 100)}%;background:#FAAD14"></i>
            </div>
            <span>${day}</span>
        </div>`).join('');
    return `<div class="quiz-trend-chart">${bars}</div>`;
}

function renderOfflineDataFunnel() {
    const steps = [
        { label: '浏览活动详情', value: '12,580', pct: 100, color: '#2F54EB' },
        { label: '提交报名表', value: '2,468', pct: 100, color: '#13C2C2' },
        { label: '审核通过/报名成功', value: '2,162', pct: 88, color: '#52C41A' },
        { label: '完成签到', value: '1,782', pct: 72, color: '#FAAD14' },
        { label: '完成签退/评价', value: '1,376', pct: 56, color: '#722ED1' }
    ];
    return `
    <div class="activity-funnel quiz-data-funnel">
        ${steps.map(step => `
            <div class="activity-funnel-step">
                <div class="activity-funnel-top"><span>${step.label}</span><strong>${step.value}</strong></div>
                <div class="activity-funnel-track"><div style="width:${step.pct}%;background:${step.color}"></div></div>
                <div class="activity-funnel-pct">${step.pct}%</div>
            </div>
        `).join('')}
    </div>`;
}

function renderOfflineRankList(title, rows, metric) {
    const max = Math.max(...rows.map(row => row.value), 1);
    return `
    <div class="quiz-rank-list">
        <h4>${title}</h4>
        ${rows.map((row, index) => {
            const isCapacity = metric === 'capacity';
            const valueText = isCapacity ? `${row.value}%` : `${row.value} 人`;
            const tone = isCapacity && row.value >= 90 ? '#F5222D' : isCapacity && row.value >= 80 ? '#FAAD14' : '#2F54EB';
            return `
            <div class="quiz-rank-row">
                <span>${index + 1}</span>
                <div>
                    <strong>${row.name}</strong>
                    <small style="display:block;color:var(--text-tertiary);margin-top:2px">${row.note}</small>
                    <i><b style="width:${Math.max(8, Math.round(row.value / max * 100))}%;background:${tone}"></b></i>
                </div>
                <em>${valueText}</em>
            </div>`;
        }).join('')}
    </div>`;
}

function renderOfflineDataTableRow(row) {
    const statusCls = row.status === '报名中' ? 'badge-green' : row.status === '已结束' ? 'badge-gray' : row.status === '预告中' ? 'badge-blue' : 'badge-yellow';
    const capacityRate = row.capacity ? Math.round(row.approved / row.capacity * 1000) / 10 : 0;
    const riskCls = row.risk.includes('紧张') || row.risk.includes('偏低') || row.risk.includes('偏多') ? 'badge-yellow'
        : row.risk === '表现优秀' ? 'badge-green'
        : row.risk === '待发布' ? 'badge-gray'
        : 'badge-blue';
    return `
    <tr>
        <td><strong>${row.name}</strong></td>
        <td><span class="badge ${statusCls}">${row.status}</span></td>
        <td><span class="badge badge-blue">${row.hostMode}</span></td>
        <td>${row.signups}</td>
        <td>${row.approved}</td>
        <td>${row.pending}</td>
        <td><span class="activity-rate ${capacityRate >= 90 ? 'risk' : capacityRate >= 80 ? 'warn' : 'good'}">${capacityRate}%</span></td>
        <td><span class="activity-rate ${row.checkin < 70 && row.status === '已结束' ? 'risk' : row.checkin < 80 && row.checkin > 0 ? 'warn' : 'good'}">${row.checkin ? `${row.checkin}%` : '-'}</span></td>
        <td>${row.checkout ? `${row.checkout}%` : '-'}</td>
        <td>${row.feedback}</td>
        <td><span class="badge ${riskCls}">${row.risk}</span></td>
        <td><button class="btn btn-ghost btn-sm">查看</button></td>
    </tr>`;
}

function renderActivityDataPage() {
    return pageHeader('📊 数据概况', '活动管理 / 数据概况') + `
    <section class="quiz-data-page">
        <div class="quiz-data-toolbar card">
            <label><span>时间范围</span><select class="form-control"><option>近 30 天</option><option>近 7 天</option><option>本月</option><option>全部时间</option></select></label>
            <label><span>活动状态</span><select class="form-control"><option>全部状态</option><option>进行中</option><option>未开始</option><option>已结束</option></select></label>
            <label><span>答题模式</span><select class="form-control"><option>全部模式</option><option>在线考试</option><option>每日答题</option><option>闯关答题</option></select></label>
            <label><span>活动名称</span><input class="form-control" placeholder="请输入活动名称"></label>
            <div class="quiz-data-toolbar-actions">
                <button class="btn btn-primary">查询</button>
                <button class="btn btn-outline">重置</button>
                <button class="btn btn-outline">导出</button>
            </div>
        </div>

        <div class="quiz-data-metric-grid">
            ${renderQuizDataMetric('活动总数', '12', '进行中 6 / 已结束 4', '规模', 'blue')}
            ${renderQuizDataMetric('总参与人次', '3,842', '较上期 +12.8%', '触达', 'cyan')}
            ${renderQuizDataMetric('完成率', '76.4%', '完成 2,936 / 开始 3,842', '体验', 'green')}
            ${renderQuizDataMetric('通过率', '81.7%', '通过 2,399 / 完成 2,936', '难度', 'purple')}
            ${renderQuizDataMetric('平均分', '79.6', '及格线均值 60 分', '质量', 'orange')}
            ${renderQuizDataMetric('异常活动', '4', '需优先查看', '风险', 'red')}
        </div>

        <div class="quiz-data-grid primary">
            <section class="card quiz-data-chart-card">
                <div class="activity-card-head">
                    <div>
                        <h3>参与趋势</h3>
                        <p>按日查看全部知识问答活动的参与、完成与通过变化</p>
                    </div>
                    <div class="activity-segment"><button class="active">参与</button><button>完成</button><button>通过</button></div>
                </div>
                ${renderQuizTrendChart()}
                <div class="quiz-data-chart-legend">
                    <span><i style="background:#2F54EB"></i>参与人次</span>
                    <span><i style="background:#52C41A"></i>完成人次</span>
                    <span><i style="background:#FAAD14"></i>通过人次</span>
                </div>
            </section>

            <section class="card quiz-data-chart-card">
                <div class="activity-card-head">
                    <div>
                        <h3>答题转化漏斗</h3>
                        <p>定位从开始答题到通过的主要流失环节</p>
                    </div>
                </div>
                ${renderQuizDataFunnel()}
            </section>
        </div>

        <div class="quiz-data-grid secondary">
            <section class="card quiz-data-alert-card">
                <div class="activity-card-head compact">
                    <div>
                        <h3>运营提醒</h3>
                        <p>按低参与、低完成、低通过和低分自动标记</p>
                    </div>
                </div>
                <div class="activity-todo-list">
                    ${renderQuizDataAlert('high', '2 个活动通过率低于 60%', '优先检查题目难度、及格线和题库配置。')}
                    ${renderQuizDataAlert('medium', '3 个活动完成率低于 70%', '建议排查活动说明、答题入口和题量长度。')}
                    ${renderQuizDataAlert('medium', '“非遗文化闯关”平均用时偏长', '可能存在题目理解成本高或关卡配置偏重。')}
                    ${renderQuizDataAlert('low', '近 7 天参与人次上涨 12.8%', '“华服知识竞赛”贡献主要增量，可复用推广配置。')}
                </div>
            </section>

            <section class="card quiz-data-rank-card">
                <div class="activity-card-head">
                    <div>
                        <h3>活动表现排行</h3>
                        <p>同时查看高贡献活动和待优化活动</p>
                    </div>
                </div>
                <div class="quiz-data-rank-grid">
                    ${renderQuizRankList('参与人数 TOP', QUIZ_DATA_ACTIVITIES.slice().sort((a, b) => b.participants - a.participants).slice(0, 5), 'participants')}
                    ${renderQuizRankList('低完成率预警', QUIZ_DATA_ACTIVITIES.slice().sort((a, b) => a.completion - b.completion).slice(0, 5), 'completion')}
                </div>
            </section>
        </div>

        <section class="card quiz-data-table-card">
            <div class="activity-card-head">
                <div>
                    <h3>活动数据明细</h3>
                    <p>点击查看可进入单个活动管理页，继续分析用户、单位和题目数据</p>
                </div>
            </div>
            ${tableWrap(
                ['活动名称', '状态', '答题模式', '参与人数', '答题人次', '完成人数', '完成率', '通过率', '平均分', '平均用时', '异常标记', '操作'],
                QUIZ_DATA_ACTIVITIES.map(renderQuizDataTableRow).join(''),
                { total: QUIZ_DATA_ACTIVITIES.length }
            )}
        </section>
    </section>`;
}

const QUIZ_DATA_ACTIVITIES = [
    { name: '阅启新篇·读享时光', status: '进行中', mode: '在线考试', participants: 528, attempts: 684, completed: 386, completion: 73.1, pass: 82.3, avg: 78.5, duration: '18分35秒', risk: '完成率偏低' },
    { name: '华服知识竞赛', status: '进行中', mode: '每日答题', participants: 620, attempts: 1186, completed: 548, completion: 88.4, pass: 86.8, avg: 82.1, duration: '09分42秒', risk: '表现优秀' },
    { name: '非遗文化闯关', status: '进行中', mode: '闯关答题', participants: 312, attempts: 456, completed: 198, completion: 63.5, pass: 71.2, avg: 76.4, duration: '24分16秒', risk: '用时偏长' },
    { name: '法律翻译知识初赛', status: '已结束', mode: '在线考试', participants: 486, attempts: 508, completed: 451, completion: 92.8, pass: 88.9, avg: 84.7, duration: '21分08秒', risk: '正常' },
    { name: '阅读安全生产测评', status: '已结束', mode: '在线考试', participants: 416, attempts: 436, completed: 296, completion: 71.2, pass: 58.4, avg: 67.9, duration: '22分54秒', risk: '通过率过低' },
    { name: '每日阅读知识挑战', status: '进行中', mode: '每日答题', participants: 758, attempts: 1488, completed: 642, completion: 84.7, pass: 80.5, avg: 79.8, duration: '08分26秒', risk: '正常' },
    { name: '图书馆服务规范问答', status: '未开始', mode: '在线考试', participants: 0, attempts: 0, completed: 0, completion: 0, pass: 0, avg: '-', duration: '-', risk: '待开始' },
    { name: '古籍保护知识测评', status: '进行中', mode: '在线考试', participants: 238, attempts: 316, completed: 152, completion: 63.9, pass: 55.3, avg: 69.1, duration: '19分52秒', risk: '通过率过低' },
    { name: '文化志愿者培训考试', status: '已结束', mode: '在线考试', participants: 484, attempts: 512, completed: 263, completion: 54.3, pass: 79.1, avg: 77.3, duration: '17分20秒', risk: '完成率过低' }
];

function renderQuizDataMetric(label, value, note, tag, tone) {
    return `
    <section class="card quiz-data-metric ${tone}">
        <div class="quiz-data-metric-top">
            <span>${label}</span>
            <b>${tag}</b>
        </div>
        <strong>${value}</strong>
        <p>${note}</p>
    </section>`;
}

function renderQuizTrendChart() {
    const days = ['5/28', '5/29', '5/30', '5/31', '6/1', '6/2', '6/3'];
    const joined = [360, 420, 386, 512, 486, 548, 624];
    const completed = [268, 302, 296, 388, 362, 428, 486];
    const passed = [216, 248, 236, 318, 296, 346, 398];
    const max = Math.max(...joined);
    const bars = days.map((day, index) => `
        <div class="quiz-trend-day">
            <div class="quiz-trend-bars">
                <i style="height:${Math.round(joined[index] / max * 100)}%;background:#2F54EB"></i>
                <i style="height:${Math.round(completed[index] / max * 100)}%;background:#52C41A"></i>
                <i style="height:${Math.round(passed[index] / max * 100)}%;background:#FAAD14"></i>
            </div>
            <span>${day}</span>
        </div>`).join('');
    return `<div class="quiz-trend-chart">${bars}</div>`;
}

function renderQuizDataFunnel() {
    const steps = [
        { label: '开始答题', value: '3,842', pct: 100, color: '#2F54EB' },
        { label: '提交完成', value: '2,936', pct: 76, color: '#52C41A' },
        { label: '达到及格线', value: '2,399', pct: 62, color: '#FAAD14' },
        { label: '获得证明/积分', value: '1,842', pct: 48, color: '#722ED1' }
    ];
    return `
    <div class="activity-funnel quiz-data-funnel">
        ${steps.map(step => `
            <div class="activity-funnel-step">
                <div class="activity-funnel-top"><span>${step.label}</span><strong>${step.value}</strong></div>
                <div class="activity-funnel-track"><div style="width:${step.pct}%;background:${step.color}"></div></div>
                <div class="activity-funnel-pct">${step.pct}%</div>
            </div>
        `).join('')}
    </div>`;
}

function renderQuizDataAlert(level, title, desc) {
    const mark = level === 'high' ? '高' : level === 'medium' ? '中' : '低';
    return `
    <div class="activity-todo-item ${level}">
        <span>${mark}</span>
        <div><strong>${title}</strong><p>${desc}</p></div>
    </div>`;
}

function renderQuizRankList(title, rows, metric) {
    const max = Math.max(...rows.map(row => metric === 'participants' ? row.participants : row.completion), 1);
    return `
    <div class="quiz-rank-list">
        <h4>${title}</h4>
        ${rows.map((row, index) => {
            const value = metric === 'participants' ? row.participants : row.completion;
            const text = metric === 'participants' ? `${value} 人` : `${value}%`;
            const tone = metric === 'participants' ? '#2F54EB' : (value < 65 ? '#F5222D' : '#FAAD14');
            return `
            <div class="quiz-rank-row">
                <span>${index + 1}</span>
                <div>
                    <strong>${row.name}</strong>
                    <i><b style="width:${Math.max(8, Math.round(value / max * 100))}%;background:${tone}"></b></i>
                </div>
                <em>${text}</em>
            </div>`;
        }).join('')}
    </div>`;
}

function renderQuizDataTableRow(row) {
    const statusCls = row.status === '进行中' ? 'badge-green' : row.status === '已结束' ? 'badge-gray' : 'badge-yellow';
    const riskCls = row.risk.includes('过低') || row.risk.includes('偏低') || row.risk.includes('偏长') ? 'badge-yellow'
        : row.risk === '表现优秀' ? 'badge-green'
        : row.risk === '待开始' ? 'badge-gray'
        : 'badge-blue';
    return `
    <tr>
        <td><strong>${row.name}</strong></td>
        <td><span class="badge ${statusCls}">${row.status}</span></td>
        <td><span class="badge badge-blue">${row.mode}</span></td>
        <td>${row.participants}</td>
        <td>${row.attempts}</td>
        <td>${row.completed}</td>
        <td><span class="activity-rate ${row.completion < 65 ? 'risk' : row.completion < 75 ? 'warn' : 'good'}">${row.completion}%</span></td>
        <td><span class="activity-rate ${row.pass < 60 ? 'risk' : row.pass < 75 ? 'warn' : 'good'}">${row.pass}%</span></td>
        <td>${row.avg}</td>
        <td>${row.duration}</td>
        <td><span class="badge ${riskCls}">${row.risk}</span></td>
        <td><button class="btn btn-ghost btn-sm">查看</button></td>
    </tr>`;
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
    Array.from(overlay.classList)
        .filter(cls => cls.startsWith('modal-layer-'))
        .forEach(cls => overlay.classList.remove(cls));
    if (opts.overlayClass) overlay.classList.add(opts.overlayClass);
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
