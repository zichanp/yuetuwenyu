/* offline-activity-create.js - 活动报名创建流程 */

let offlineActivityStep = 1;
let offlineSessionCount = 1;
let offlineNeedSignup = true;
let offlineCheckinEnabled = false;
let offlineCheckoutEnabled = false;
let offlineIntroMode = 'standard';
let offlineIntroDevice = 'desktop';
let offlineIntroMobileIndependent = false;
let offlineIntroMobileInherited = false;
let offlineGroupMenuOpenIdx = -1;
let offlineFormFsOpen = false;
let offlineFormGroupIdx = 0;
let offlineParticipationFsOpen = false;
let offlineParticipationGroupIdx = 0;
let offlineMaxSignupSessionsLimit = 1;
let offlineMaxSignupQuantity = 1;
let offlineSignupSettingsPreviewMode = 'multi';
let offlineActivityName = '阅读与远方：在不确定中找到自我——《旅居意大利》校友对谈分享会';
let offlineUnitRole = 'organizer';
let offlineUnitRoleDropdownOpen = false;
let offlineHostModes = ['online'];
let offlineActivityTags = ['讲座', '读书'];
let offlineActivityTagDropdownOpen = false;
let offlineSignupStart = '';
let offlineSignupEnd = '';
let offlineActivityTarget = '面向本馆读者、亲子家庭、传统文化爱好者';
let offlineActivityScope = 'national';
let offlineActivityRegion = '';
let offlineFeedbackEnabled = true;
let offlineFeedbackEntryName = '评价活动';
let offlineFeedbackBody = '';
let offlineActivityLocation = {
    province: '广东省',
    city: '广州市',
    address: '广东财经大学广州校区图书馆801',
    placeName: '广东财经大学广州校区图书馆',
    lng: 113.3568,
    lat: 23.0896
};
let offlineMapSelectedPlaceId = 'gdufe-library-801';
let offlineMapSearchKeyword = '';
let offlineLeaderboardDisplayLimit = 100;
let offlineGroups = [
    {
        name: '组别一',
        formConfigured: false,
        formFieldCount: 0,
        formRealName: false,
        participationConfigured: false,
        sessionSignupRule: 'single',
        maxSignupSessions: 1,
        sessionCount: 1,
        capacity: 120,
        sessions: [
            {
                name: '场次一',
                startTime: '2026-06-09T00:00',
                endTime: '2026-06-09T01:30',
                duration: 90,
                capacity: 99,
                signupQuantityLimited: true,
                maxSignupQuantity: 1,
                sortOrder: 1,
                signupStart: '2026-06-09T00:00',
                signupEnd: '2026-06-09T01:30',
                signupStopBeforeStartMinutes: 0,
                signupReview: false,
                allowWalkIn: false,
                waitlistMode: 'manual',
                signupStatus: '报名结束',
                sessionStatus: '场次结束',
                published: true
            }
        ],
        updatedAt: ''
    }
];

const OFFLINE_UNIT_ROLE_OPTIONS = [
    { key: 'organizer', label: '我是主办单位', type: '主办单位', desc: '负责活动的总体策划与组织' },
    { key: 'executor', label: '我是承办单位', type: '承办单位', desc: '负责活动的具体执行与落地' },
    { key: 'cooperator', label: '我是协办单位', type: '协办单位', desc: '协助主办或承办单位开展活动，参与部分管理和推广工作' },
    { key: 'supporter', label: '我是支持单位', type: '支持单位', desc: '提供资源或宣传支持' },
    { key: 'other', label: '其他', type: '其他', desc: '本单位是其他角色类型' }
];
const OFFLINE_ACTIVITY_SCOPE_OPTIONS = [
    { key: 'national', label: '全国性活动' },
    { key: 'province', label: '省级活动' },
    { key: 'city', label: '市级活动' },
    { key: 'institution', label: '本机构活动' }
];
const OFFLINE_HOST_MODE_OPTIONS = [
    { key: 'online', label: '线上活动' },
    { key: 'offline', label: '线下活动' }
];
const OFFLINE_ACTIVITY_TAG_OPTIONS = ['讲座', '读书', '分享会', '培训', '展览', '沙龙', '亲子', '论坛'];
const OFFLINE_ACTIVITY_REGION_OPTIONS = ['北京市', '上海市', '天津市', '重庆市', '浙江省', '江苏省', '广东省', '四川省', '海南省', '杭州市', '南京市', '广州市', '成都市'];
const OFFLINE_LOCATION_CITY_OPTIONS = {
    '广东省': ['广州市', '深圳市', '珠海市', '佛山市'],
    '上海市': ['徐汇区', '黄浦区', '浦东新区', '静安区'],
    '北京市': ['东城区', '西城区', '海淀区', '朝阳区'],
    '浙江省': ['杭州市', '宁波市', '温州市'],
    '江苏省': ['南京市', '苏州市', '无锡市'],
    '四川省': ['成都市', '绵阳市'],
    '海南省': ['海口市', '三亚市']
};
const OFFLINE_MAP_PLACES = [
    {
        id: 'gdufe-library-801',
        name: '广东财经大学广州校区图书馆',
        province: '广东省',
        city: '广州市',
        district: '海珠区',
        address: '广东财经大学广州校区图书馆801',
        tag: '高校图书馆',
        lng: 113.3568,
        lat: 23.0896,
        x: 55,
        y: 48,
        keywords: '广东财经大学 广州校区 图书馆 801 海珠 仑头'
    },
    {
        id: 'gdufe-north-gate',
        name: '广东财经大学广州校区北门',
        province: '广东省',
        city: '广州市',
        district: '海珠区',
        address: '广东财经大学广州校区北门',
        tag: '校门',
        lng: 113.3546,
        lat: 23.0924,
        x: 47,
        y: 39,
        keywords: '广东财经大学 广州校区 北门 海珠'
    },
    {
        id: 'guangzhou-library',
        name: '广州图书馆',
        province: '广东省',
        city: '广州市',
        district: '天河区',
        address: '珠江东路4号广州图书馆',
        tag: '公共图书馆',
        lng: 113.3234,
        lat: 23.1196,
        x: 72,
        y: 30,
        keywords: '广州图书馆 珠江新城 天河'
    },
    {
        id: 'sun-yat-sen-library',
        name: '广东省立中山图书馆',
        province: '广东省',
        city: '广州市',
        district: '越秀区',
        address: '文明路213号广东省立中山图书馆',
        tag: '公共图书馆',
        lng: 113.2728,
        lat: 23.1257,
        x: 35,
        y: 27,
        keywords: '广东省立中山图书馆 文明路 越秀'
    },
    {
        id: 'canton-tower',
        name: '广州塔',
        province: '广东省',
        city: '广州市',
        district: '海珠区',
        address: '阅江西路222号广州塔',
        tag: '地标',
        lng: 113.3246,
        lat: 23.1065,
        x: 68,
        y: 54,
        keywords: '广州塔 小蛮腰 海珠 阅江西路'
    },
    {
        id: 'guangdong-museum',
        name: '广东省博物馆',
        province: '广东省',
        city: '广州市',
        district: '天河区',
        address: '珠江东路2号广东省博物馆',
        tag: '文化场馆',
        lng: 113.3218,
        lat: 23.1188,
        x: 75,
        y: 39,
        keywords: '广东省博物馆 珠江新城 天河'
    }
];

let offlineOrgUnits = [
    { type: '主办单位', name: '中国国际贸易学会、海南大学' },
    { type: '承办单位', name: '' },
    { type: '协办单位', name: '' },
    { type: '支持单位', name: '' }
];

const OFFLINE_ACTIVITY_STEPS = [
    [1, '基本信息'],
    [2, '活动介绍'],
    [3, '活动设置'],
    [4, '外观装修'],
    [5, '其他设置（可选）']
];

registerPage('offline-activity-create', () => {
    offlineActivityStep = Number(currentPageParams?.step) || 1;
    offlineSessionCount = Math.max(offlineSessionCount, 1);
    offlineFormFsOpen = false;
    offlineParticipationFsOpen = false;
    offlineActivityTagDropdownOpen = false;
    return renderOfflineActivityCreate();
});

document.addEventListener('click', (event) => {
    if (!offlineActivityTagDropdownOpen) return;
    if (event.target.closest('.offline-tag-dropdown')) return;
    closeOfflineActivityTagDropdown();
});

function renderOfflineActivityCreate() {
    return `
    <div class="quiz-create-page offline-create-page">
        ${renderOfflineCreateTopbar()}
        <div class="quiz-create-workspace offline-create-workspace">
            <div class="quiz-mobile-preview offline-mobile-preview" aria-label="活动详情页移动端预览示意"></div>
            <main class="quiz-create-main">
                ${renderOfflineCreateStepper()}
                ${renderOfflineStepContent(offlineActivityStep)}
            </main>
        </div>
        ${renderOfflineCreateActions()}
        <div id="offlineFormFsOverlay" class="quiz-fullscreen-overlay ${offlineFormFsOpen ? '' : 'hidden'}" onclick="handleOfflineFormBackdropClick(event)">
            ${offlineFormFsOpen ? renderOfflineFormFullscreenModal() : ''}
        </div>
        <div id="offlineParticipationFsOverlay" class="quiz-fullscreen-overlay offline-participation-fs-overlay ${offlineParticipationFsOpen ? '' : 'hidden'}" onclick="handleOfflineParticipationBackdropClick(event)">
            ${offlineParticipationFsOpen ? renderOfflineParticipationFullscreenModal() : ''}
        </div>
    </div>`;
}

function renderOfflineCreateTopbar() {
    const isEdit = currentPageParams?.mode === 'edit';
    return `
    <header class="quiz-create-topbar">
        <button class="quiz-top-back" onclick="goBackFromPage('offline-activity-create')" title="返回">≪</button>
        <div class="quiz-top-meta">
            <div class="quiz-top-title-row">
                <strong>${offlineActivityName}</strong>
                <span class="quiz-top-badge">活动报名</span>
                <span class="quiz-top-state">未发布</span>
                ${isEdit ? '<span class="quiz-top-state">编辑活动</span>' : ''}
            </div>
            <div class="quiz-top-save"><span>✓</span> 最新保存 10:10</div>
        </div>
    </header>`;
}

function renderOfflineCreateStepper() {
    return `
    <nav class="quiz-step-nav" aria-label="创建活动报名步骤">
        ${OFFLINE_ACTIVITY_STEPS.map(([num, label]) => `
            <button class="quiz-step-card ${offlineActivityStep === num ? 'active' : ''} ${offlineActivityStep > num ? 'done' : ''}" onclick="goOfflineStep(${num})">
                <span class="quiz-step-num">${num}</span>
                <span class="quiz-step-label">${label}</span>
                ${num < OFFLINE_ACTIVITY_STEPS.length ? '<span class="quiz-step-arrow">»</span>' : ''}
            </button>
        `).join('')}
    </nav>`;
}

function renderOfflineStepContent(step) {
    switch (step) {
        case 1: return renderOfflineBasicStep();
        case 2: return renderOfflineIntroStep();
        case 3: return renderOfflineSignupStep();
        case 4: return renderOfflineAppearanceStep();
        case 5: return renderOfflineOtherStep();
        default: return renderOfflineBasicStep();
    }
}

function renderOfflineBasicStep() {
    return `
    <section class="quiz-config-card offline-config-section">
        ${renderOfflineSectionHeader('活动基本信息', '配置活动名称、标签、举办方式和报名规则。')}
        <div class="offline-basic-grid">
            <div class="qc-form-row span-2">
                <label><span class="req">*</span>活动名称</label>
                <input class="qc-input" maxlength="50" value="${offlineEscapeAttr(offlineActivityName)}" onchange="setOfflineActivityName(this.value)" placeholder="请输入活动名称，50字以内">
            </div>
            <div class="qc-form-row">
                <label>活动标签</label>
                ${renderOfflineActivityTagDropdown()}
            </div>
            <div class="qc-form-row">
                <label>举办方式</label>
                ${renderOfflineHostModeChecks()}
            </div>
            <div class="qc-form-row">
                <label>活动范围</label>
                ${renderOfflineActivityScopeRadios()}
            </div>
            ${renderOfflineActivityRegionRow()}
            <div class="qc-form-row">
                <label><span class="req">*</span>单位角色</label>
                ${renderOfflineUnitRoleSelect()}
            </div>
        </div>
    </section>
    <section class="quiz-config-card offline-config-section">
        ${renderOfflineSectionHeader('报名时间与地点', '配置报名开放时间和活动地点。')}
        <div class="offline-basic-grid">
            <div class="qc-form-row">
                <label><span class="req">*</span>报名时间</label>
                <div class="qc-field-stack">
                    <div class="offline-session-date-range offline-signup-date-range">
                        ${renderOfflineSignupTimeInput('start', offlineSignupStart, '请选择开始报名时间')}
                        <span class="offline-session-date-separator">至</span>
                        ${renderOfflineSignupTimeInput('end', offlineSignupEnd, '请选择截止报名时间')}
                    </div>
                </div>
            </div>
            <div class="qc-form-row">
                <label>活动地点</label>
                <div class="offline-location-grid">
                    <select class="qc-input" onchange="setOfflineActivityLocationProvince(this.value)">
                        ${renderOfflineLocationProvinceOptions()}
                    </select>
                    <select class="qc-input" onchange="setOfflineActivityLocationCity(this.value)">
                        ${renderOfflineLocationCityOptions(offlineActivityLocation.province)}
                    </select>
                    <input class="qc-input" value="${offlineEscapeAttr(offlineActivityLocation.address)}" onchange="setOfflineActivityLocationAddress(this.value)" placeholder="请输入详细地址">
                    <button type="button" class="offline-map-btn" onclick="openOfflineMapPicker()">地图定位</button>
                </div>
            </div>
        </div>
    </section>
    <section class="quiz-config-card org-card offline-config-section">
        ${renderOfflineOrgUnits()}
    </section>`;
}

function renderOfflineSectionHeader(title, desc) {
    return `
    <div class="offline-config-title">
        <div>
            <h3>${title}</h3>
            <p>${desc}</p>
        </div>
    </div>`;
}

function renderOfflineActivityScopeRadios() {
    return `
    <div class="qc-radios">
        ${OFFLINE_ACTIVITY_SCOPE_OPTIONS.map(option => `
            <label><input type="radio" name="offlineScope" value="${option.key}" ${offlineActivityScope === option.key ? 'checked' : ''} onchange="setOfflineActivityScope('${option.key}')"> ${option.label}</label>
        `).join('')}
    </div>`;
}

function renderOfflineHostModeChecks() {
    return `
    <div class="qc-checks offline-host-mode-checks">
        ${OFFLINE_HOST_MODE_OPTIONS.map(option => `
            <label><input type="checkbox" value="${option.key}" ${offlineHostModes.includes(option.key) ? 'checked' : ''} onchange="toggleOfflineHostMode('${option.key}', this.checked)"> ${option.label}</label>
        `).join('')}
    </div>`;
}

function renderOfflineActivityTagDropdown() {
    const selectedHtml = offlineActivityTags.length
        ? offlineActivityTags.map(tag => `<span class="offline-tag-chip">${offlineEscapeHtml(tag)}</span>`).join('')
        : '<span class="offline-tag-placeholder">请选择活动标签</span>';
    return `
    <div class="activity-dropdown offline-tag-dropdown ${offlineActivityTagDropdownOpen ? 'open' : ''}" id="offlineActivityTagDropdown">
        <button type="button" class="offline-tag-trigger" onclick="toggleOfflineActivityTagDropdown(event)" aria-expanded="${offlineActivityTagDropdownOpen ? 'true' : 'false'}">
            <span class="offline-tag-values" id="offlineActivityTagValues">${selectedHtml}</span>
            <span class="offline-tag-caret" aria-hidden="true"></span>
        </button>
        <div class="activity-dropdown-menu offline-tag-menu ${offlineActivityTagDropdownOpen ? 'show' : ''}" id="offlineActivityTagMenu" onclick="event.stopPropagation()">
            ${OFFLINE_ACTIVITY_TAG_OPTIONS.map(tag => {
                const checked = offlineActivityTags.includes(tag);
                return `
                    <label class="offline-tag-option ${checked ? 'selected' : ''}" data-tag="${offlineEscapeAttr(tag)}">
                        <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleOfflineActivityTag('${offlineEscapeAttr(tag)}', this.checked)">
                        <span>${offlineEscapeHtml(tag)}</span>
                    </label>`;
            }).join('')}
        </div>
    </div>`;
}

function syncOfflineActivityTagDropdown() {
    const dropdown = document.getElementById('offlineActivityTagDropdown');
    const values = document.getElementById('offlineActivityTagValues');
    const menu = document.getElementById('offlineActivityTagMenu');
    if (!dropdown || !values || !menu) return;
    dropdown.classList.toggle('open', offlineActivityTagDropdownOpen);
    values.innerHTML = offlineActivityTags.length
        ? offlineActivityTags.map(tag => `<span class="offline-tag-chip">${offlineEscapeHtml(tag)}</span>`).join('')
        : '<span class="offline-tag-placeholder">请选择活动标签</span>';
    menu.classList.toggle('show', offlineActivityTagDropdownOpen);
    menu.querySelectorAll('.offline-tag-option').forEach(optionEl => {
        const tag = optionEl.dataset.tag || '';
        const checked = offlineActivityTags.includes(tag);
        optionEl.classList.toggle('selected', checked);
        const input = optionEl.querySelector('input');
        if (input) input.checked = checked;
    });
}

function toggleOfflineActivityTagDropdown(event) {
    if (event && event.stopPropagation) event.stopPropagation();
    offlineActivityTagDropdownOpen = !offlineActivityTagDropdownOpen;
    syncOfflineActivityTagDropdown();
}

function closeOfflineActivityTagDropdown() {
    if (!offlineActivityTagDropdownOpen) return;
    offlineActivityTagDropdownOpen = false;
    syncOfflineActivityTagDropdown();
}

function toggleOfflineActivityTag(tag, checked) {
    if (!OFFLINE_ACTIVITY_TAG_OPTIONS.includes(tag)) return;
    const selected = new Set(offlineActivityTags);
    if (checked) selected.add(tag);
    else selected.delete(tag);
    offlineActivityTags = OFFLINE_ACTIVITY_TAG_OPTIONS.filter(item => selected.has(item));
    syncOfflineActivityTagDropdown();
}

function renderOfflineActivityRegionRow() {
    if (offlineActivityScope === 'national') return '';
    return `
        <div class="qc-form-row activity-region-row">
            <label class="activity-region-label"><span class="req">*</span>活动地区<span class="qc-help" title="非全国性活动需选择活动开放地区">?</span></label>
            <div class="activity-region-picker">
                <select class="activity-region-select" aria-label="活动地区" onchange="setOfflineActivityRegion(this.value)">
                    <option value="" ${offlineActivityRegion ? '' : 'selected'}>请选择开放的省市</option>
                    ${OFFLINE_ACTIVITY_REGION_OPTIONS.map(region => `<option value="${region}" ${offlineActivityRegion === region ? 'selected' : ''}>${region}</option>`).join('')}
                </select>
                <span class="activity-region-arrow"></span>
            </div>
        </div>`;
}

function renderOfflineLocationProvinceOptions() {
    const provinces = Object.keys(OFFLINE_LOCATION_CITY_OPTIONS);
    const current = offlineActivityLocation.province || provinces[0];
    return provinces.map(province => `<option value="${province}" ${province === current ? 'selected' : ''}>${province}</option>`).join('');
}

function renderOfflineLocationCityOptions(province = offlineActivityLocation.province) {
    const cities = OFFLINE_LOCATION_CITY_OPTIONS[province] || [];
    const current = offlineActivityLocation.city || cities[0] || '';
    return cities.map(city => `<option value="${city}" ${city === current ? 'selected' : ''}>${city}</option>`).join('');
}

function renderOfflineOrgUnits() {
    return `
    <div class="qc-org-label">组织机构</div>
    <div class="qc-org-fields">
        ${offlineOrgUnits.map((unit, index) => `
            <div class="qc-org-unit">
                <div class="qc-org-title">
                    <span>${unit.type}</span>
                    <button type="button" title="编辑单位类型" onclick="renameOfflineOrgUnit(${index})">✎</button>
                </div>
                <div class="qc-org-line">
                    <input value="${offlineEscapeAttr(unit.name)}" placeholder="请输入一个或多个单位名称" onchange="setOfflineOrgUnitName(${index}, this.value)">
                    <button type="button" class="qc-org-delete" title="删除单位类型" aria-label="删除单位类型" onclick="deleteOfflineOrgUnit(${index})"><span class="trash-icon" aria-hidden="true"></span></button>
                    <button type="button" title="拖拽排序" class="qc-org-drag">⠿</button>
                </div>
            </div>
        `).join('')}
        <button type="button" class="qc-org-add" onclick="addOfflineOrgUnit()">+ 添加单位类型</button>
    </div>`;
}

function getOfflineUnitRoleOption() {
    return OFFLINE_UNIT_ROLE_OPTIONS.find(option => option.key === offlineUnitRole) || OFFLINE_UNIT_ROLE_OPTIONS[0];
}

function renderOfflineUnitRoleSelect() {
    const selected = getOfflineUnitRoleOption();
    return `
    <div class="quiz-unit-role-select ${offlineUnitRoleDropdownOpen ? 'open' : ''}">
        <button type="button" class="quiz-unit-role-trigger" onclick="toggleOfflineUnitRoleDropdown(event)">
            <span>${selected ? selected.label : '选择单位角色'}</span>
            <i></i>
        </button>
        ${offlineUnitRoleDropdownOpen ? `
        <div class="quiz-unit-role-menu">
            <div class="quiz-unit-role-menu-head">
                <strong>单位角色类型</strong>
                <span>请选择本单位的角色类型</span>
            </div>
            <div class="quiz-unit-role-options">
                ${OFFLINE_UNIT_ROLE_OPTIONS.map(option => `
                    <button type="button" class="quiz-unit-role-option ${option.key === offlineUnitRole ? 'selected' : ''}" onclick="selectOfflineUnitRole('${option.key}')">
                        <span>
                            <strong>${option.label}</strong>
                            <em>${option.desc}</em>
                        </span>
                        ${option.key === offlineUnitRole ? '<b>✓</b>' : ''}
                    </button>
                `).join('')}
            </div>
        </div>` : ''}
    </div>`;
}

function renderOfflineSignupTimeInput(which, value, placeholder) {
    const normalizedValue = getOfflineDateTimeLocalValue(value);
    return `
        <input type="datetime-local" class="form-control" value="${normalizedValue}" placeholder="${placeholder}" onchange="setOfflineSignupTime('${which}', this.value)">`;
}

function renderOfflineIntroStep() {
    if (offlineIntroMode === 'free') return renderOfflineIntroFree();
    return renderOfflineIntroStandard();
}

function renderOfflineIntroStandard() {
    return `
    <section class="quiz-config-card intro-card offline-config-section">
        <div class="intro-standard-head">
            <h3>标准模式</h3>
            <button type="button" class="intro-mode-switch intro-mode-switch-static" onclick="switchOfflineIntroMode('free')">⇅ 切换至自由编辑模式</button>
        </div>
        ${renderOfflineIntroControls()}
        ${renderOfflineIntroEditorBlock('活动背景', '请输入活动背景、发起缘由或面向人群说明')}
        ${renderOfflineIntroEditorBlock('活动对象', '请输入活动流程、嘉宾、亮点或参与收益')}
        ${renderOfflineIntroEditorBlock('活动规则', '请输入报名、到场、签到、奖项或注意事项规则')}
    </section>`;
}

function renderOfflineIntroFree() {
    return `
    <section class="quiz-config-card intro-card intro-free-card">
        <div class="intro-free-head">
            <h3>自由模式</h3>
            <button type="button" class="intro-mode-switch intro-mode-switch-static" onclick="switchOfflineIntroMode('standard')">⇅ 切换回标准模式</button>
        </div>
        ${renderOfflineIntroControls()}
        <div class="intro-free-editor">
            <div class="intro-toolbar intro-free-toolbar">
                <span>H</span><span>B</span><span><i>I</i></span><span>U</span><span>S</span><span>✎</span><span>⌁</span><span>🔗</span><span>☷</span><span>≡</span><span>“</span><span>☺</span><span>▧</span><span>▦</span><span>▶</span><span>&gt;_</span><span>↶</span><span>↷</span>
            </div>
            <div class="intro-free-editor-body" contenteditable="true" oninput="markOfflineIntroDeviceEdited()">请输入活动背景、规则说明、交通指引等图文内容。</div>
        </div>
    </section>`;
}

function renderOfflineIntroControls() {
    const isMobile = offlineIntroDevice === 'mobile';
    const mobileStateText = offlineIntroMobileIndependent ? '当前手机端为独立内容' : '当前手机端沿用电脑端内容';
    const inheritButtonText = offlineIntroMobileInherited ? '重新沿用电脑端内容' : '沿用电脑端内容';
    return `
    <div class="intro-device-controls">
        <div class="intro-free-tabs">
            <button type="button" class="${offlineIntroDevice === 'desktop' ? 'active' : ''}" onclick="switchOfflineIntroDevice('desktop')">电脑端</button>
            <button type="button" class="${isMobile ? 'active' : ''}" onclick="switchOfflineIntroDevice('mobile')">手机端</button>
        </div>
        ${isMobile ? `
            <div class="intro-free-inherit">
                <span>${mobileStateText}</span>
                <button type="button" onclick="inheritOfflineDesktopIntroContent()">${inheritButtonText}</button>
            </div>
        ` : ''}
        <div class="intro-free-bg">
            <span>背景色</span>
            <div class="intro-free-swatches">
                ${['#69d4e5', '#fff3ee', '#d8f6e6', '#edefff', 'linear-gradient(135deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f)'].map((color, index) => `<button type="button" class="${index === 0 ? 'active' : ''}" style="background:${color}"></button>`).join('')}
            </div>
        </div>
    </div>
    <p class="intro-free-tip">详情图文属于活动介绍内容，建议先配置电脑端；手机端未单独设置时，将自动沿用电脑端内容。</p>`;
}

function renderOfflineIntroEditorBlock(title, placeholder) {
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

function getOfflineGroupFormSummary(group) {
    return group?.formConfigured
        ? `${group.formFieldCount || 5} 个字段${group.formRealName ? ' · 实名认证' : ''} · 支持代报名`
        : '设置报名字段、实名信息与提交规则';
}

function getOfflineGroupParticipationSummary(group) {
    return group?.participationConfigured
        ? getOfflineSessionSummary(group)
        : '配置场次、名额、空降报名、签到与签退规则';
}

function renderOfflineConfigTile(title, desc, buttonText, buttonClass, onclick, state = 'todo', icon = '◰') {
    return `
    <div class="gc-config-tile ${state}" onclick="${onclick}">
        <div class="gc-tile-top">
            <div class="gc-tile-icon">${icon}</div>
            <span class="gc-tile-state">${state === 'done' ? '已完成' : '待配置'}</span>
        </div>
        <div class="gc-tile-title">${title}</div>
        <div class="gc-tile-desc">${desc}</div>
        <button class="btn ${buttonClass} btn-sm" type="button" onclick="event.stopPropagation();${onclick}">${buttonText}</button>
    </div>`;
}

function renderOfflineSignupStep() {
    return `
    <section class="quiz-config-card offline-settings-board">
        <div class="offline-config-title offline-settings-title">
            <div>
                <h3>活动设置</h3>
                <p>不同组别可配置不同报名表、场次和参与规则，适用于按人群、身份或项目区分报名的活动。</p>
            </div>
        </div>
        <div class="offline-settings-layout">
            <div class="offline-settings-content">
                ${renderOfflineGroupedSignupPanel()}
                ${renderOfflineSignupSettingsPanel()}
                ${renderOfflineCheckinSettingsPanel()}
                ${renderOfflineCheckoutSettingsPanel()}
                ${renderOfflineSignupNoticePanel()}
                ${renderOfflineDefaultRulesPanel()}
            </div>
        </div>
    </section>`;
}

function renderOfflineGroupedSignupPanel() {
    return `
    <section class="offline-setting-panel offline-grouped-panel" id="offlineSettingGroups">
        <div id="offlineGroupList">${offlineGroups.map((group, index) => renderOfflineGroupCard(group, index)).join('')}</div>
        <button class="offline-add-group-dashed" type="button" onclick="addOfflineGroup()">+ 添加组别</button>
    </section>`;
}

function renderOfflineSignupNoticePanel() {
    return `
    <section class="offline-setting-panel" id="offlineSettingNotice">
        <div class="offline-setting-panel-head">
            <div>
                <h3>报名须知</h3>
                <p>展示在用户报名页面，用于说明参与要求、到场提醒和注意事项。</p>
            </div>
        </div>
        <div class="intro-editor-row">
            <div class="intro-editor">
                <div class="intro-toolbar"><span>B</span><span><i>I</i></span><span>U</span><span>🔗</span><span>▧</span></div>
                <div class="intro-editor-body">请输入报名须知、参与说明和注意事项...</div>
            </div>
        </div>
    </section>`;
}

function renderOfflineSignupSettingsPanel() {
    const isSingleMode = offlineSignupSettingsPreviewMode === 'single';
    return `
    <section class="offline-setting-panel offline-signup-settings-panel" id="offlineSettingSignup">
        <div class="offline-signup-settings-shell">
            <div class="offline-signup-preview-tabs" aria-label="报名设置预览切换">
                <button class="${isSingleMode ? 'active' : ''}" type="button" onclick="setOfflineSignupSettingsPreviewMode('single')">单场次时</button>
                <button class="${isSingleMode ? '' : 'active'}" type="button" onclick="setOfflineSignupSettingsPreviewMode('multi')">多场次时</button>
                <span>切换标签仅研发人员可见</span>
            </div>
            <div class="offline-signup-settings-hero">
                <div class="offline-signup-settings-copy">
                    <div class="offline-signup-settings-kicker">${isSingleMode ? ' ' : ' '}</div>
                    <div class="offline-setting-panel-head">
                        <div>
                            <h3>报名设置</h3>
                            <p>${isSingleMode ? '' : '多场次活动下，支持同时限制可报名场次数与单场次报名人数。'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="offline-signup-settings-body ${isSingleMode ? 'single-mode' : 'multi-mode'}">
                <div class="offline-signup-settings-grid">
                    ${isSingleMode ? '' : renderOfflineGlobalMaxSignupSessionsSetting()}
                    ${renderOfflineGlobalSignupQuantitySetting()}
                </div>
            </div>
        </div>
    </section>`;
}

function renderOfflineDefaultRulesPanel() {
    const rules = [
        '多人报名时，默认需为每个参加人填写报名信息。',
        '默认允许用户在报名截止前修改已提交的信息。',
        '开启取消报名后，用户可在截止前取消报名并释放名额。',
        '用户端详情页默认展示可报名名额，减少后台配置项。报名截止前 + 待审核：可以修改；报名截止前 + 已审核通过：修改后应重新进入“待审核”；报名截止后 + 无论待审核还是已通过：用户端都不允许修改。即：报名截止时间决定用户是否还有修改入口；审核状态决定修改后是否需要重新审核。'
    ];
    return `
    <section class="offline-setting-panel offline-default-rules-panel" id="offlineSettingDefaultRules">
        <div class="offline-setting-panel-head">
            <div>
                <h3>系统默认规则</h3>
                <p>研发可见：以下规则由系统默认实现，后台不再提供配置项。</p>
            </div>
        </div>
        <div class="offline-default-rule-list">
            ${rules.map(rule => `<div class="offline-default-rule-item">${rule}</div>`).join('')}
        </div>
    </section>`;
}

function renderOfflineGlobalMaxSignupSessionsSetting() {
    return `
    <div class="offline-setting-row">
        <div>
            <strong>每个账号最多可报名场次数 <span class="offline-help-dot tooltip" data-tooltip="限制同一报名账号最多可选择的场次数。">?</span></strong>
        </div>
        <div class="num-input offline-session-max-input">
            <input type="number" min="1" value="${Math.max(Number(offlineMaxSignupSessionsLimit) || 1, 1)}" onchange="setOfflineMaxSignupSessions(this.value)">
            <span class="unit">场</span>
        </div>
    </div>`;
}

function renderOfflineGlobalSignupQuantitySetting() {
    return `
    <div class="offline-setting-row">
        <div class="${offlineSignupSettingsPreviewMode === 'single' ? 'offline-signup-single-label' : ''}">
            <strong>${offlineSignupSettingsPreviewMode === 'single' ? '每个账号' : '每个账号每场次最多可报名人数'}</strong>
            ${offlineSignupSettingsPreviewMode === 'single' ? '<strong>最多可报名人数 <span class="offline-help-dot tooltip" data-tooltip="限制同一报名账号在单个场次内最多可报名的参与人数。">?</span></strong>' : ''}
            ${offlineSignupSettingsPreviewMode === 'single' ? '' : '<span class="offline-help-dot tooltip" data-tooltip="限制同一报名账号在单个场次内最多可报名的参与人数。">?</span>'}
        </div>
        <div class="num-input offline-session-quantity-input">
            <input type="number" min="1" value="${Number(offlineMaxSignupQuantity) || 1}" onchange="setOfflineGlobalMaxSignupQuantity(this.value)">
            <span class="unit">人</span>
        </div>
    </div>`;
}

function setOfflineSignupSettingsPreviewMode(mode) {
    offlineSignupSettingsPreviewMode = mode === 'single' ? 'single' : 'multi';
    goOfflineStep(3);
}

function renderOfflineCheckinSettingsPanel() {
    return `
    <section class="offline-setting-panel" id="offlineSettingCheckin">
        <div class="offline-setting-panel-head">
            <div>
                <h3>签到设置</h3>
                <p>控制是否开启签到，以及签到时间和签到方式。</p>
            </div>
            ${offlineSwitchStateControl(offlineCheckinEnabled, 'toggleOfflineCheckin(this.checked)', 'offlineStepCheckin')}
        </div>
        ${renderOfflineCheckinConfig(offlineGroups[0] || {}, offlineCheckinEnabled, 'global')}
    </section>`;
}

function renderOfflineCheckoutSettingsPanel() {
    return `
    <section class="offline-setting-panel" id="offlineSettingCheckout">
        <div class="offline-setting-panel-head">
            <div>
                <h3>签退设置</h3>
                <p>开启后默认使用动态签退口令，管理员可设置口令刷新时间。<strong>按场次生成并自动刷新，可点击查看各场次当前口令。</strong></p>
            </div>
            <div class="offline-panel-actions">
                ${offlineCheckoutEnabled ? '<button class="btn btn-outline" type="button" onclick="openOfflineCheckoutCodeModal()">查看动态口令</button>' : ''}
                ${offlineSwitchStateControl(offlineCheckoutEnabled, 'toggleOfflineCheckout(this.checked)', 'offlineStepCheckout')}
            </div>
        </div>
        ${renderOfflineCheckoutConfig(offlineGroups[0] || {}, offlineCheckoutEnabled, 'global')}
    </section>`;
}

function renderOfflineGroupCard(group, index, options = {}) {
    const status = getOfflineGroupStatus(group);
    const statusText = status === 'done' ? '已配置' : status === 'partial' ? '部分配置' : '未配置';
    const statusIcon = status === 'done' ? '✓' : status === 'partial' ? '!' : '•';
    const doneCount = (group.formConfigured ? 1 : 0) + (group.participationConfigured ? 1 : 0);
    const hideGroupConcept = !!options.hideGroupConcept;
    const displayName = hideGroupConcept ? '场次配置' : group.name;
    const nameInputWidth = Math.min(220, Math.max(80, Array.from(displayName || '').length * 18 + 28));
    const menuOpen = offlineGroupMenuOpenIdx === index;
    const formSummary = getOfflineGroupFormSummary(group);
    const participationSummary = getOfflineGroupParticipationSummary(group);
    return `
    <div class="group-card rich offline-group-card gc-${status}">
        <div class="gc-stripe"></div>
        <div class="gc-body">
            <div class="gc-head-row">
                ${hideGroupConcept ? '' : '<span class="gc-drag" title="拖拽排序">⠿</span>'}
                ${hideGroupConcept
                    ? `<div class="gc-name-static" style="width:${nameInputWidth}px">${displayName}</div>`
                    : `<input class="gc-name-edit" style="width:${nameInputWidth}px" value="${offlineEscapeAttr(group.name)}" onchange="updateOfflineGroupName(${index}, this.value)" onkeydown="if(event.key==='Enter') this.blur()" />`}
                <span class="gc-status-pill ${status}"><span class="gc-status-ico">${statusIcon}</span>${statusText}</span>
                ${hideGroupConcept ? '' : `<span class="gc-name-pencil" onclick="focusOfflineGroupName(${index})" title="编辑组别名称">✎</span>`}
                ${options.hideMenu ? '' : `<button class="gc-menu-btn" type="button" onclick="toggleOfflineGroupMenu(${index}, event)" title="更多操作">⋯</button>`}
                ${!options.hideMenu && menuOpen ? `
                <div class="gc-menu" onclick="event.stopPropagation()">
                    <div class="gc-menu-item" onclick="copyOfflineGroup(${index});closeOfflineGroupMenus()">⧉ 复制组别</div>
                    <div class="gc-menu-divider"></div>
                    <div class="gc-menu-item danger" onclick="deleteOfflineGroup(${index});closeOfflineGroupMenus()">删除组别</div>
                </div>` : ''}
            </div>
            <div class="gc-progress-line">
                <span>配置进度</span>
                <div class="gc-mini-progress"><div style="width:${Math.min(100, (doneCount / 2) * 100)}%"></div></div>
                <strong>${doneCount}/2</strong>
            </div>
            <div class="gc-config-grid offline-group-config-grid">
                <div class="gc-config-tile ${group.formConfigured ? 'done' : 'todo'}" onclick="configureOfflineGroupForm(${index})">
                    <div class="gc-tile-top">
                        <div class="gc-tile-icon">◰</div>
                        <span class="gc-tile-state">${group.formConfigured ? '已完成' : '待配置'}</span>
                    </div>
                    <div class="gc-tile-title">报名表</div>
                    <div class="gc-tile-desc">${formSummary}</div>
                    <button class="btn ${group.formConfigured ? 'btn-outline' : 'btn-primary'} btn-sm" type="button" onclick="event.stopPropagation();configureOfflineGroupForm(${index})">${group.formConfigured ? '编辑报名表' : '配置报名表'}</button>
                </div>
                <div class="gc-config-tile ${group.participationConfigured ? 'done' : 'todo'}" onclick="configureOfflineGroupParticipation(${index})">
                    <div class="gc-tile-top">
                        <div class="gc-tile-icon">⚙</div>
                        <span class="gc-tile-state">${group.participationConfigured ? '已完成' : '待配置'}</span>
                    </div>
                    <div class="gc-tile-title">${hideGroupConcept ? '场次配置' : '场次与报名规则'}</div>
                    <div class="gc-tile-desc">${participationSummary}</div>
                    <button class="btn ${group.participationConfigured ? 'btn-outline' : 'btn-dark'} btn-sm" type="button" onclick="event.stopPropagation();configureOfflineGroupParticipation(${index})">${group.participationConfigured ? '编辑规则' : '配置规则'}</button>
                </div>
            </div>
        </div>
    </div>`;
}

function renderOfflineAppearanceStep() {
    const navs = [
        { name: '活动首页', required: true, note: '' },
        { name: '排行榜', required: false, leaderboard: true },
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
                ${navs.map(nav => {
                    const canDrag = !nav.required;
                    const canToggle = !nav.required;
                    const checked = true;
                    const noteHtml = nav.leaderboard ? renderOfflineLeaderboardNavNote() : nav.note;
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

function renderOfflineLeaderboardNavNote() {
    return `
        <span>当前规则：报名人数排行榜，展示前 <span class="nav-hl">${offlineLeaderboardDisplayLimit}</span> 名</span>
        <button class="nav-rule-btn" type="button" onclick="openOfflineLeaderboardRuleModal(event)">修改规则 &gt;</button>
    `;
}

function openOfflineMapPicker() {
    offlineMapSelectedPlaceId = getOfflineCurrentMapPlace()?.id || offlineMapSelectedPlaceId || OFFLINE_MAP_PLACES[0].id;
    offlineMapSearchKeyword = '';
    openModal('地图定位', renderOfflineMapPickerBody(), saveOfflineMapSelection, {
        confirmText: '确认定位',
        modalClass: 'modal-xl offline-map-picker-modal'
    });
}

function renderOfflineMapPickerBody() {
    const results = getOfflineMapSearchResults();
    return `
    <div class="offline-map-picker">
        <div class="offline-map-sidebar">
            <div class="offline-map-search">
                <input id="offlineMapSearchInput" class="qc-input" value="${offlineEscapeAttr(offlineMapSearchKeyword)}" placeholder="搜索地点、学校、图书馆或详细地址" oninput="refreshOfflineMapSearchResults(this.value)" onkeydown="if(event.key==='Enter') event.preventDefault()">
                <button type="button" onclick="refreshOfflineMapSearchResults(document.getElementById('offlineMapSearchInput')?.value || '')">搜索</button>
            </div>
            <div class="offline-map-current">
                <span>当前活动地点</span>
                <strong>${offlineEscapeHtml(getOfflineFullLocationText())}</strong>
            </div>
            <div id="offlineMapResults" class="offline-map-results">
                ${renderOfflineMapSearchResults(results)}
            </div>
        </div>
        <div class="offline-map-stage">
            <div class="offline-map-toolbar">
                <span>广州地图</span>
                <em>拖动缩放为示意，点击标记可选址</em>
            </div>
            <div id="offlineMapCanvas" class="offline-map-canvas">
                <div class="offline-map-river"></div>
                <div class="offline-map-road road-a"></div>
                <div class="offline-map-road road-b"></div>
                <div class="offline-map-road road-c"></div>
                <div class="offline-map-district district-a">天河区</div>
                <div class="offline-map-district district-b">海珠区</div>
                <div class="offline-map-district district-c">越秀区</div>
                ${renderOfflineMapMarkers(results)}
            </div>
            <div id="offlineMapSelectedSummary" class="offline-map-selected">
                ${renderOfflineMapSelectedSummary()}
            </div>
        </div>
    </div>`;
}

function renderOfflineMapSearchResults(results) {
    if (!results.length) {
        return '<div class="offline-map-empty">未找到匹配地点，可换个关键词试试。</div>';
    }
    return results.map(place => `
        <button type="button" class="offline-map-result ${place.id === offlineMapSelectedPlaceId ? 'active' : ''}" onclick="selectOfflineMapPlace('${place.id}')">
            <span class="offline-map-result-pin"></span>
            <span>
                <strong>${offlineEscapeHtml(place.name)}</strong>
                <em>${offlineEscapeHtml(place.province)}-${offlineEscapeHtml(place.city)} ${offlineEscapeHtml(place.district)} · ${offlineEscapeHtml(place.address)}</em>
            </span>
            <b>${offlineEscapeHtml(place.tag)}</b>
        </button>
    `).join('');
}

function renderOfflineMapMarkers(results) {
    return results.map(place => `
        <button type="button" class="offline-map-marker ${place.id === offlineMapSelectedPlaceId ? 'active' : ''}" style="left:${place.x}%;top:${place.y}%;" title="${offlineEscapeAttr(place.name)}" onclick="selectOfflineMapPlace('${place.id}')">
            <span></span>
            <strong>${offlineEscapeHtml(place.name)}</strong>
        </button>
    `).join('');
}

function renderOfflineMapSelectedSummary() {
    const selected = OFFLINE_MAP_PLACES.find(place => place.id === offlineMapSelectedPlaceId) || getOfflineCurrentMapPlace() || OFFLINE_MAP_PLACES[0];
    return `
        <div>
            <span>已选地点</span>
            <strong>${offlineEscapeHtml(selected.name)}</strong>
            <em>${offlineEscapeHtml(selected.province)}-${offlineEscapeHtml(selected.city)} ${offlineEscapeHtml(selected.address)}</em>
        </div>
        <p>坐标：${selected.lng.toFixed(4)}, ${selected.lat.toFixed(4)}</p>
    `;
}

function getOfflineMapSearchResults() {
    const keyword = String(offlineMapSearchKeyword || '').trim().toLowerCase();
    if (!keyword) return OFFLINE_MAP_PLACES;
    return OFFLINE_MAP_PLACES.filter(place => {
        const haystack = [
            place.name,
            place.province,
            place.city,
            place.district,
            place.address,
            place.tag,
            place.keywords
        ].join(' ').toLowerCase();
        return haystack.includes(keyword);
    });
}

function refreshOfflineMapSearchResults(keyword) {
    offlineMapSearchKeyword = keyword || '';
    const results = getOfflineMapSearchResults();
    if (!results.some(place => place.id === offlineMapSelectedPlaceId) && results[0]) {
        offlineMapSelectedPlaceId = results[0].id;
    }
    const resultsEl = document.getElementById('offlineMapResults');
    const canvasEl = document.getElementById('offlineMapCanvas');
    const summaryEl = document.getElementById('offlineMapSelectedSummary');
    if (resultsEl) resultsEl.innerHTML = renderOfflineMapSearchResults(results);
    if (canvasEl) {
        canvasEl.querySelectorAll('.offline-map-marker').forEach(marker => marker.remove());
        canvasEl.insertAdjacentHTML('beforeend', renderOfflineMapMarkers(results));
    }
    if (summaryEl) summaryEl.innerHTML = renderOfflineMapSelectedSummary();
}

function selectOfflineMapPlace(placeId) {
    if (!OFFLINE_MAP_PLACES.some(place => place.id === placeId)) return;
    offlineMapSelectedPlaceId = placeId;
    refreshOfflineMapSearchResults(offlineMapSearchKeyword);
}

function getOfflineCurrentMapPlace() {
    return OFFLINE_MAP_PLACES.find(place =>
        place.province === offlineActivityLocation.province
        && place.city === offlineActivityLocation.city
        && place.address === offlineActivityLocation.address
    );
}

function saveOfflineMapSelection() {
    const place = OFFLINE_MAP_PLACES.find(item => item.id === offlineMapSelectedPlaceId);
    if (!place) return false;
    offlineActivityLocation = {
        province: place.province,
        city: place.city,
        address: place.address,
        placeName: place.name,
        lng: place.lng,
        lat: place.lat
    };
    refreshOfflineStepOne();
}

function openOfflineLeaderboardRuleModal(event) {
    if (event && event.stopPropagation) event.stopPropagation();
    openModal('设置排行榜规则', renderOfflineLeaderboardRuleModalBody(), saveOfflineLeaderboardRule, {
        confirmText: '确定',
        modalClass: 'modal-lg leaderboard-rule-modal offline-leaderboard-rule-modal'
    });
}

function renderOfflineLeaderboardRuleModalBody() {
    const limitOptions = [10, 20, 50, 100];
    return `
        <div class="leaderboard-rule-subtitle">活动报名当前仅支持报名人数排行榜</div>
        <div class="leaderboard-rule-card">
            <div class="leaderboard-rule-option">
                <span class="leaderboard-rule-check">报名人数排行榜</span>
            </div>
            <div class="leaderboard-rule-row">
                <label>展示前</label>
                <select class="form-control leaderboard-limit-select" id="offlineLeaderboardDisplayLimit">
                    ${limitOptions.map(limit => `<option value="${limit}" ${offlineLeaderboardDisplayLimit === limit ? 'selected' : ''}>${limit}</option>`).join('')}
                </select>
                <span>名</span>
            </div>
        </div>
        <div class="leaderboard-rule-preview">
            <div class="leaderboard-rule-preview-title">用户端排行榜字段</div>
            <div class="leaderboard-field-group">
                <strong>报名人数排行榜</strong>
                <div class="leaderboard-field-list"><span>排名</span><span>单位/地区</span><span>报名人数</span></div>
            </div>
            <div class="leaderboard-sort-rule"><strong>排序规则：</strong>按报名人数从高到低排序；报名人数相同，先达到该人数的单位或地区靠前。</div>
        </div>`;
}

function saveOfflineLeaderboardRule() {
    const select = document.getElementById('offlineLeaderboardDisplayLimit');
    offlineLeaderboardDisplayLimit = Number(select?.value) || 100;
    if (offlineActivityStep === 4) {
        document.getElementById('mainContent').innerHTML = renderOfflineActivityCreate();
    }
}

function renderOfflineOtherStep() {
    return `
    <section class="quiz-config-card other-card offline-other-card">
        <h3>功能捷径</h3>
        <p>配置活动详情页底部「功能入口」弹窗中展示的功能捷径</p>
        <div class="shortcut-label">活动功能</div>
        ${[
            ['资料下载', '附件下载', '资料数量：3'],
            ['问题答疑', '查看文本', '']
        ].map(item => `
            <div class="shortcut-row offline-shortcut-row">
                <span>⠿</span><label class="switch mini"><input type="checkbox"><span class="sw-slider"></span></label>
                <div><strong>${item[0]}</strong><em>${item[1]}</em></div>
                <p>${item[2]}</p>
                <button type="button">配置</button><button class="bolt" type="button">↯</button>
            </div>
        `).join('')}
        <button class="add-shortcut" type="button">+ 添加更多按钮</button>

        <div class="service-label">活动服务</div>
        ${renderOfflineFeedbackSettings()}
        <div class="official-group offline-official-group">
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

function renderOfflineFeedbackSettings() {
    return `
        <div class="offline-feedback-card">
            <div class="offline-feedback-head">
                <div>
                    <h4>活动后反馈</h4>
                    <p>活动结束后，参与者可在报名记录中对活动进行评价，便于收集活动满意度反馈</p>
                </div>
                ${offlineSwitchStateControl(offlineFeedbackEnabled, 'toggleOfflineFeedback(this.checked)')}
            </div>
            ${offlineFeedbackEnabled ? `
                <div class="offline-feedback-config">
                    <label>
                        <span>入口名称</span>
                        <input class="form-control" value="${offlineEscapeAttr(offlineFeedbackEntryName)}" placeholder="请输入入口名称" oninput="setOfflineFeedbackField('entryName', this.value)">
                    </label>
                    <label>
                        <span>评价页面正文</span>
                        <textarea class="form-control offline-textarea offline-feedback-textarea" placeholder="在此添加你的自定义提示内容" oninput="setOfflineFeedbackField('body', this.value)">${offlineEscapeHtml(offlineFeedbackBody)}</textarea>
                    </label>
                    <div class="offline-feedback-preview">
                        <strong>你觉的怎么样？（用户填写可见）</strong>
                        <div><span>很不满意</span><span>不满意</span><span>一般</span><span>满意</span><span>非常满意</span></div>
                    </div>
                </div>` : ''}
        </div>`;
}

function renderOfflineCreateActions() {
    const isEdit = currentPageParams?.mode === 'edit';
    const showPublish = isEdit || offlineActivityStep === 5;
    return `
    <div class="quiz-create-actionbar">
        <div>
            ${offlineActivityStep > 1
                ? `<button class="btn btn-ghost" onclick="goOfflineStep(${offlineActivityStep - 1})">← 上一步</button>`
                : ''}
        </div>
        <button class="btn btn-gold-solid" type="button">保存</button>
        <button class="btn btn-gold-outline" type="button" onclick="openOfflinePreview()">预览</button>
        ${offlineActivityStep < 5
            ? `<button class="btn btn-gold-outline" type="button" onclick="goOfflineStep(${offlineActivityStep + 1})">下一步</button>`
            : ''}
        ${showPublish ? '<button class="btn btn-gold-outline" type="button" onclick="openOfflinePublishConfirm()">发布活动</button>' : ''}
    </div>`;
}

function offlineSwitchRow(title, desc, checked, action = '', options = {}) {
    const help = options.help
        ? `<span class="offline-help-dot tooltip" data-tooltip="${offlineEscapeAttr(options.help)}">?</span>`
        : '';
    const descHtml = desc ? `<span>${desc}</span>` : '';
    return `
    <div class="offline-setting-row">
        <div><strong>${title}${help}</strong>${descHtml}</div>
        ${offlineSwitchStateControl(checked, action, '', options.stateText)}
    </div>`;
}

function offlineSwitchStateControl(checked, action = '', id = '', stateText = '') {
    const text = stateText || (checked ? '已开启' : '已关闭');
    return `<div class="offline-switch-control">${offlineSwitchControl(checked, action, id)}<span class="offline-switch-state">${text}</span></div>`;
}

function offlineSwitchControl(checked, action = '', id = '') {
    return `
    <label class="switch">
        <input type="checkbox" ${id ? `id="${id}"` : ''} ${checked ? 'checked' : ''} ${action ? `onchange="${action}"` : ''}>
        <span class="sw-slider"></span>
    </label>`;
}

function getOfflineGroupStatus(group) {
    if (group.formConfigured && group.participationConfigured) return 'done';
    if (group.formConfigured || group.participationConfigured) return 'partial';
    return 'empty';
}

function getOfflineConfiguredGroupCount() {
    return offlineGroups.filter(group => getOfflineGroupStatus(group) === 'done').length;
}

function createOfflineDefaultSession(index = 0) {
    const day = String(9 + index).padStart(2, '0');
    return {
        name: formatOfflineSessionName(index),
        startTime: `2026-06-${day}T00:00`,
        endTime: `2026-06-${day}T01:30`,
        duration: 90,
        capacity: index === 0 ? 99 : 9,
        signupQuantityLimited: true,
        maxSignupQuantity: 1,
        sortOrder: index + 1,
        signupStart: '2026-06-09T00:00',
        signupEnd: `2026-06-${day}T01:30`,
        signupStopBeforeStartMinutes: 0,
        signupReview: false,
        allowWalkIn: false,
        waitlistMode: 'manual',
        signupStatus: index === 0 ? '报名结束' : '报名中',
        sessionStatus: index === 0 ? '场次结束' : '未开始',
        published: true
    };
}

function ensureOfflineGroupSessions(group) {
    if (!group) return [];
    if (!Array.isArray(group.sessions) || !group.sessions.length) {
        group.sessions = [createOfflineDefaultSession(0)];
    }
    group.sessions.forEach((session, index) => {
        if (!session.name) session.name = formatOfflineSessionName(index);
        if (!Number(session.sortOrder)) session.sortOrder = index + 1;
        if (session.signupQuantityLimited === undefined) session.signupQuantityLimited = true;
        if (!Number(session.maxSignupQuantity)) session.maxSignupQuantity = 1;
        if (session.signupStopBeforeStartMinutes === undefined) session.signupStopBeforeStartMinutes = 0;
        if (!session.waitlistMode) session.waitlistMode = 'manual';
        if (session.endTime === undefined) session.endTime = getOfflineSessionComputedEndTime(session.startTime, session.duration);
    });
    group.sessionSignupRule = group.sessionSignupRule || 'single';
    group.maxSignupSessions = Math.max(Number(group.maxSignupSessions) || 1, 1);
    return group.sessions;
}

function refreshOfflineParticipationModal() {
    const overlay = document.getElementById('offlineParticipationFsOverlay');
    if (offlineParticipationFsOpen && overlay) {
        overlay.innerHTML = renderOfflineParticipationFullscreenModal();
    }
}

function formatOfflineDateTimeText(value) {
    return String(value || '').replace('T', ' ');
}

function getOfflineSessionSignupText(session) {
    return `${formatOfflineDateTimeText(session.signupStart)} 至 ${formatOfflineDateTimeText(session.signupEnd)}`;
}

function getOfflineSignupRuleText(group) {
    const maxSignupSessions = getOfflineEffectiveMaxSignupSessions(group);
    if (maxSignupSessions > 1) return `最多可报名 ${maxSignupSessions} 个场次`;
    return '仅可报名 1 个场次';
}

function isOfflineMultiGroupMode() {
    return offlineGroups.length > 1;
}

function getOfflineEffectiveMaxSignupSessions(group) {
    const sessions = ensureOfflineGroupSessions(group);
    const publishedSessionCount = Math.max(sessions.filter(session => session.published !== false).length, 1);
    return Math.min(Math.max(Number(offlineMaxSignupSessionsLimit) || 1, 1), publishedSessionCount);
}

function getOfflineSessionSummary(group) {
    const sessions = ensureOfflineGroupSessions(group);
    const totalCapacity = sessions.reduce((sum, session) => sum + (Number(session.capacity) || 0), 0);
    return `${sessions.length} 个场次 · ${getOfflineSignupRuleText(group)} · 本组 ${totalCapacity || group.capacity || 0} 人`;
}

function offlineNowStamp() {
    const now = new Date();
    const pad = value => String(value).padStart(2, '0');
    return `${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function focusOfflineGroupName(index) {
    const el = document.querySelectorAll('.offline-group-card .gc-name-edit')[index];
    if (el) {
        el.focus();
        el.select && el.select();
    }
}

function updateOfflineGroupName(index, value) {
    if (!offlineGroups[index]) return;
    offlineGroups[index].name = (value || '').trim() || '未命名组别';
    offlineGroups[index].updatedAt = offlineNowStamp();
}

function toggleOfflineGroupMenu(index, event) {
    if (event) event.stopPropagation();
    offlineGroupMenuOpenIdx = offlineGroupMenuOpenIdx === index ? -1 : index;
    goOfflineStep(3);
}

function closeOfflineGroupMenus() {
    if (offlineGroupMenuOpenIdx === -1) return;
    offlineGroupMenuOpenIdx = -1;
    goOfflineStep(3);
}

function addOfflineGroup() {
    const next = offlineGroups.length + 1;
    offlineGroups.push({
        name: `未命名组别${next}`,
        formConfigured: false,
        formFieldCount: 0,
        formRealName: false,
        participationConfigured: false,
        sessionSignupRule: 'single',
        maxSignupSessions: 1,
        sessionCount: 1,
        capacity: 80,
        sessions: [createOfflineDefaultSession(0)],
        updatedAt: offlineNowStamp()
    });
    goOfflineStep(3);
}

function copyOfflineGroup(index) {
    const source = offlineGroups[index];
    if (!source) return;
    offlineGroups.push({
        ...source,
        name: `${source.name}（副本）`,
        updatedAt: offlineNowStamp()
    });
    goOfflineStep(3);
}

function deleteOfflineGroup(index) {
    if (offlineGroups.length <= 1) {
        alert('至少保留 1 个组别');
        return;
    }
    offlineGroups.splice(index, 1);
    goOfflineStep(3);
}

function configureOfflineGroupForm(index) {
    const group = offlineGroups[index];
    if (!group) return;
    offlineFormGroupIdx = index;
    offlineFormFsOpen = true;
    const overlay = document.getElementById('offlineFormFsOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.innerHTML = renderOfflineFormFullscreenModal();
    }
}

function renderOfflineFormFullscreenModal() {
    const group = offlineGroups[offlineFormGroupIdx] || offlineGroups[0];
    const formBody = typeof renderFormConfigPage === 'function'
        ? renderFormConfigPage()
        : '<div class="form-config-shell"><main class="form-canvas"><section class="form-preview-card"><label>报名表配置</label><div class="form-preview-input muted">请先加载报名表配置模块。</div></section></main></div>';
    return `
    <div class="quiz-fs-dialog form-fs-dialog" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
        <div class="quiz-fs-header">
            <div class="qfh-nav">
                <button class="qfh-back" type="button" onclick="closeOfflineGroupFormConfig()">‹ 返回上一级</button>
                <span class="qfh-nav-sep"></span>
                <div class="qfh-title-stack">
                    <div class="qfh-nav-title">${offlineEscapeAttr(group?.name || '组别')} · 报名表配置</div>
                    <div class="qfh-nav-mode">
                        <div class="qfh-mode-inline">
                            <div class="qfh-mode-title"><span class="qfh-mode-label">用于配置：</span>报名字段、实名信息与提交规则</div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="quiz-fs-close" type="button" onclick="closeOfflineGroupFormConfig()">✕</button>
        </div>

        <div class="quiz-fs-body form-fs-body">
            ${formBody}
        </div>

        <div class="quiz-fs-footer form-fs-footer">
            <div class="quiz-fs-footer-actions">
                <button class="btn btn-ghost" type="button" onclick="closeOfflineGroupFormConfig()">取消</button>
                <button class="btn btn-primary btn-gold-save" type="button" onclick="saveOfflineGroupFormConfig()">保存</button>
            </div>
        </div>
    </div>`;
}

function closeOfflineGroupFormConfig() {
    offlineFormFsOpen = false;
    const overlay = document.getElementById('offlineFormFsOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.innerHTML = '';
    }
}

function saveOfflineGroupFormConfig() {
    const group = offlineGroups[offlineFormGroupIdx];
    if (!group) return;
    group.formConfigured = true;
    group.formFieldCount = 5;
    group.formRealName = true;
    group.updatedAt = offlineNowStamp();
    closeOfflineGroupFormConfig();
    goOfflineStep(3);
}

function handleOfflineFormBackdropClick(event) {
    if (event && event.target && event.target.id === 'offlineFormFsOverlay') {
        closeOfflineGroupFormConfig();
    }
}

function configureOfflineGroupParticipation(index) {
    const group = offlineGroups[index];
    if (!group) return;
    offlineParticipationGroupIdx = index;
    offlineParticipationFsOpen = true;
    const overlay = document.getElementById('offlineParticipationFsOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.innerHTML = renderOfflineParticipationFullscreenModal();
    }
}

function renderOfflineParticipationFullscreenModal() {
    const group = offlineGroups[offlineParticipationGroupIdx] || offlineGroups[0];
    const title = isOfflineMultiGroupMode()
        ? `${offlineEscapeAttr(group?.name || '组别')} · 场次配置`
        : '场次配置';
    return `
    <div class="quiz-fs-dialog offline-participation-fs-dialog" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
        <div class="quiz-fs-header offline-participation-fs-header">
            <div class="qfh-title-stack offline-participation-title-stack">
                <div class="qfh-nav-title">${title}</div>
                <div class="qfh-nav-mode">
                    <div class="qfh-mode-inline">
                    </div>
                </div>
            </div>
            <button class="quiz-fs-close" type="button" onclick="closeOfflineGroupParticipationConfig()">✕</button>
        </div>

        <div class="quiz-fs-body offline-participation-fs-body">
            ${renderOfflineParticipationConfigModal(group, offlineParticipationGroupIdx)}
        </div>

        <div class="quiz-fs-footer offline-participation-fs-footer">
            <div class="quiz-fs-footer-meta">保存后将回填该组别的参与配置状态。</div>
            <div class="quiz-fs-footer-actions">
                <button class="btn btn-ghost quiz-fs-cancel-btn" type="button" onclick="closeOfflineGroupParticipationConfig()">取消</button>
                <button class="btn btn-primary btn-gold-save" type="button" onclick="saveOfflineGroupParticipationFullscreenConfig()">保存配置</button>
            </div>
        </div>
    </div>`;
}

function closeOfflineGroupParticipationConfig() {
    offlineParticipationFsOpen = false;
    const overlay = document.getElementById('offlineParticipationFsOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.innerHTML = '';
    }
}

function saveOfflineGroupParticipationFullscreenConfig() {
    saveOfflineGroupParticipationConfig(offlineParticipationGroupIdx);
}

function handleOfflineParticipationBackdropClick(event) {
    if (event && event.target && event.target.id === 'offlineParticipationFsOverlay') {
        closeOfflineGroupParticipationConfig();
    }
}

function renderOfflineParticipationConfigModal(group, index) {
    const sessions = ensureOfflineGroupSessions(group);
    return `
    <div class="offline-participation-modal">
        ${renderOfflineSessionConfigCards(sessions)}
    </div>`;
}

function renderOfflineSessionConfigCards(sessions) {
    const singleSession = sessions.length <= 1;
    return `
    <div class="phase-config-shell offline-session-phase-shell">
        <div class="phase-section-header">
            <div>
                <div class="phase-section-title">场次配置</div>
                <div class="phase-section-subtitle">${singleSession ? '配置本次活动的举办时间、名额和报名规则。' : '可配置多个活动场次，每场可独立设置举办时间、名额和报名规则。'}</div>
            </div>
            <div class="phase-section-actions">
                <button class="btn btn-outline btn-sm" type="button" onclick="addOfflineParticipationSession()">+ 添加场次</button>
            </div>
        </div>
        <div class="cfg-panel phase-main-panel offline-session-main-panel" id="offlineSessionConfig">
            <div class="cfg-panel-body">
                <div class="phase-card-stack">
                    ${sessions.map((session, index) => renderOfflineSessionConfigCard(session, index, sessions.length)).join('')}
                </div>
            </div>
        </div>
    </div>`;
}

function renderOfflineSessionConfigCard(session, index, total) {
    const canDelete = total > 1;
    const canMoveUp = index > 0;
    const canMoveDown = index < total - 1;
    const configured = !!(session.name && session.startTime && getOfflineSessionEndTimeValue(session) && Number(session.capacity) > 0);
    const displayTitle = total <= 1 ? '场次配置' : offlineEscapeHtml(session.name || formatOfflineSessionName(index));
    return `
    <div id="offlineSessionCard_${index}" class="group-card rich gc-${configured ? 'done' : 'empty'} phase-config-card offline-session-config-card">
        <div class="gc-stripe"></div>
        <div class="gc-body">
            <div class="gc-head-row phase-head-row">
                <span class="gc-drag" title="拖拽排序">⠿</span>
                <div class="phase-head-title-wrap">
                    <div class="phase-config-card-title">${displayTitle}</div>
                    <div class="phase-config-card-sub">${total <= 1 ? '活动报名场次配置' : '活动报名场次'}</div>
                </div>
                <span class="phase-chip ${configured ? 'ok' : 'warn'}">${configured ? '已完成配置' : '未完成配置'}</span>
                <div class="phase-config-card-actions">
                    <button class="pli-ic-btn" type="button" title="上移场次" ${canMoveUp ? `onclick="moveOfflineSession(${index}, -1)"` : 'disabled'}>↑</button>
                    <button class="pli-ic-btn" type="button" title="下移场次" ${canMoveDown ? `onclick="moveOfflineSession(${index}, 1)"` : 'disabled'}>↓</button>
                    <button class="pli-ic-btn" type="button" title="复制场次" onclick="copyOfflineParticipationSession(${index})">⧉</button>
                    <button class="pli-ic-btn danger" type="button" title="${canDelete ? '删除场次' : '至少保留 1 个场次'}" ${canDelete ? `onclick="deleteOfflineSession(${index})"` : 'disabled'}>×</button>
                </div>
            </div>
            <div class="phase-config-card-body">
                ${renderOfflineSessionCardFields(session, index, total)}
            </div>
        </div>
    </div>`;
}

function renderOfflineSessionCardFields(session, index, total = 1) {
    const endTimeValue = getOfflineDateTimeLocalValue(getOfflineSessionEndTimeValue(session));
    const showSortOrder = total > 1;
    return `
    <div class="phase-block offline-session-phase-block">
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 场次名称</div>
            <div class="cfg-row-control">
                <input class="form-control" value="${offlineEscapeAttr(session.name || formatOfflineSessionName(index))}" placeholder="请输入场次名称" onchange="setOfflineSessionField(${index}, 'name', this.value)">
            </div>
        </div>
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 本场举办时间</div>
            <div class="cfg-row-control">
                <div class="offline-session-date-range">
                    <input type="datetime-local" class="form-control" value="${offlineEscapeAttr(getOfflineDateTimeLocalValue(session.startTime))}" onchange="setOfflineSessionField(${index}, 'startTime', this.value)">
                    <span class="offline-session-date-separator">至</span>
                    <input type="datetime-local" class="form-control" required value="${offlineEscapeAttr(endTimeValue)}" onchange="setOfflineSessionField(${index}, 'endTime', this.value)">
                </div>
                <div class="cfg-row-hint">用于控制该场次开始和结束时间，不代表报名时间。</div>
                <div class="offline-session-signup-stop-rule">
                    <span>场次开始前</span>
                    <div class="num-input offline-session-stop-before-input">
                        <input type="number" min="0" value="${Number(session.signupStopBeforeStartMinutes) || 0}" onchange="setOfflineSessionField(${index}, 'signupStopBeforeStartMinutes', this.value)">
                        <span class="unit">分钟</span>
                    </div>
                    <span>停止报名</span>
                </div>
            </div>
        </div>
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 场次人数限制</div>
            <div class="cfg-row-control">
                ${renderOfflineSessionCapacityConfig(session, index)}
            </div>
        </div>
        <div class="cfg-row">
            <div class="cfg-row-label">场次报名审核 <span class="offline-help-dot tooltip" data-tooltip="开启后，该场次报名需管理员审核通过后才算报名成功。">?</span></div>
            <div class="cfg-row-control">
                <div class="config-bool-control">
                    <label class="switch config-bool-switch" aria-label="场次报名审核">
                        <input type="checkbox" ${session.signupReview ? 'checked' : ''} onchange="setOfflineSessionField(${index}, 'signupReview', this.checked)">
                        <span class="sw-slider"></span>
                    </label>
                    <span class="config-bool-state">${session.signupReview ? '已开启' : '未开启'}</span>
                </div>
            </div>
        </div>
        ${showSortOrder ? `
        <div class="cfg-row" style="border-bottom:none">
            <div class="cfg-row-label">场次排序 <span class="offline-help-dot tooltip" data-tooltip="序号越小，用户端展示越靠前。">?</span></div>
            <div class="cfg-row-control">
                <div class="num-input offline-session-sort-input">
                    <input type="number" min="1" value="${Number(session.sortOrder) || index + 1}" onchange="setOfflineSessionField(${index}, 'sortOrder', this.value)">
                </div>
            </div>
        </div>
        ` : ''}
    </div>`;
}

function renderOfflineSessionCapacityConfig(session, index) {
    const capacityLimited = session.capacityLimited !== false;
    return `
    <div class="offline-session-capacity-config">
        <div class="offline-capacity-mode-row">
            <div class="offline-capacity-radios">
                <label><input type="radio" name="offlineSessionCapacityMode_${index}" ${capacityLimited ? 'checked' : ''} onchange="setOfflineSessionField(${index}, 'capacityLimited', true)"> 指定人数 <span class="offline-capacity-help" title="达到人数限制时关闭报名。仅已批准的参加者计入人数限制。">?</span></label>
                <label><input type="radio" name="offlineSessionCapacityMode_${index}" ${capacityLimited ? '' : 'checked'} onchange="setOfflineSessionField(${index}, 'capacityLimited', false)"> 不限人数</label>
            </div>
        </div>
        ${capacityLimited ? `
            <div class="offline-capacity-row compact">
                <strong>名额上限</strong>
                <div class="num-input offline-session-capacity-input">
                    <input type="number" min="1" value="${Number(session.capacity) || 1}" onchange="setOfflineSessionField(${index}, 'capacity', this.value)">
                    <span class="unit">人</span>
                </div>
            </div>
        ` : ''}
    </div>`;
}

function formatOfflineSessionName(index) {
    const names = ['场次一', '场次二', '场次三', '场次四', '场次五', '场次六', '场次七', '场次八', '场次九', '场次十'];
    return names[index] || `场次${index + 1}`;
}

function getOfflineSessionEndTimeValue(session) {
    return session?.endTime || '';
}

function getOfflineSessionComputedEndTime(startTime, duration) {
    const start = new Date(startTime);
    if (Number.isNaN(start.getTime())) return '';
    const end = new Date(start.getTime() + (Math.max(Number(duration) || 1, 1) * 60000));
    const pad = value => String(value).padStart(2, '0');
    return `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}`;
}

function setOfflineMaxSignupSessions(value) {
    offlineMaxSignupSessionsLimit = Math.max(Number(value) || 1, 1);
    offlineGroups.forEach(group => {
        if (!group) return;
        const maxSignupSessions = getOfflineEffectiveMaxSignupSessions(group);
        group.maxSignupSessions = maxSignupSessions;
        group.sessionSignupRule = maxSignupSessions > 1 ? 'multiple_limited' : 'single';
        group.updatedAt = offlineNowStamp();
    });
    goOfflineStep(3);
}

function setOfflineGlobalMaxSignupQuantity(value) {
    offlineMaxSignupQuantity = Math.max(Number(value) || 1, 1);
    goOfflineStep(3);
}

function setOfflineSessionField(index, key, value) {
    const group = offlineGroups[offlineParticipationGroupIdx];
    const session = ensureOfflineGroupSessions(group)[index];
    if (!session) return;
    if (key === 'duration' || key === 'capacity' || key === 'sortOrder' || key === 'maxSignupQuantity') {
        session[key] = Math.max(Number(value) || 1, 1);
    } else if (key === 'signupStopBeforeStartMinutes') {
        session[key] = Math.max(Number(value) || 0, 0);
    } else if (key === 'allowWalkIn' || key === 'published' || key === 'signupReview' || key === 'capacityLimited' || key === 'waitlistEnabled' || key === 'signupQuantityLimited') {
        session[key] = !!value;
    } else if (key === 'remark') {
        session[key] = String(value || '').slice(0, 20);
    } else {
        session[key] = value || '';
    }
    if (key === 'startTime' && session.startTime && !session.endTime) {
        session.endTime = getOfflineSessionComputedEndTime(session.startTime, session.duration);
    }
    session.signupStatus = getOfflineSessionSignupStatus(session.signupStart, session.signupEnd);
    session.sessionStatus = getOfflineSessionStatus(session.startTime, session.duration, session.endTime);
    group.sessionCount = ensureOfflineGroupSessions(group).length;
    group.capacity = ensureOfflineGroupSessions(group).reduce((sum, item) => sum + (Number(item.capacity) || 0), 0);
    group.updatedAt = offlineNowStamp();
    refreshOfflineParticipationModal();
}

function addOfflineParticipationSession() {
    const group = offlineGroups[offlineParticipationGroupIdx];
    const sessions = ensureOfflineGroupSessions(group);
    const previous = sessions[sessions.length - 1] || {};
    sessions.push({
        ...createOfflineDefaultSession(sessions.length),
        startTime: '',
        endTime: '',
        duration: Math.max(Number(previous.duration) || 90, 1),
        allowWalkIn: false,
        published: previous.published !== false,
        sortOrder: sessions.length + 1
    });
    group.sessionCount = sessions.length;
    group.capacity = sessions.reduce((sum, session) => sum + (Number(session.capacity) || 0), 0);
    group.updatedAt = offlineNowStamp();
    refreshOfflineParticipationModal();
    requestAnimationFrame(() => {
        const card = document.getElementById(`offlineSessionCard_${sessions.length - 1}`);
        card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

function copyOfflineParticipationSession(index) {
    const group = offlineGroups[offlineParticipationGroupIdx];
    const sessions = ensureOfflineGroupSessions(group);
    const source = sessions[index];
    if (!source) return;
    sessions.push({
        ...source,
        name: `${source.name || formatOfflineSessionName(index)}副本`,
        startTime: '',
        endTime: '',
        sortOrder: sessions.length + 1,
        published: !!source.published
    });
    group.sessionCount = sessions.length;
    group.capacity = sessions.reduce((sum, session) => sum + (Number(session.capacity) || 0), 0);
    group.updatedAt = offlineNowStamp();
    refreshOfflineParticipationModal();
}

function moveOfflineSession(index, direction) {
    const group = offlineGroups[offlineParticipationGroupIdx];
    const sessions = ensureOfflineGroupSessions(group);
    const target = index + direction;
    if (target < 0 || target >= sessions.length) return;
    const current = sessions[index];
    sessions[index] = sessions[target];
    sessions[target] = current;
    sessions.forEach((session, itemIndex) => {
        session.sortOrder = itemIndex + 1;
    });
    group.updatedAt = offlineNowStamp();
    refreshOfflineParticipationModal();
}

function renderOfflineCheckinConfig(group, visible, scope = '') {
    const startOffset = Number(group.checkinStartOffset || 60);
    const endRule = group.checkinEndRule || 'sessionEnd';
    const staffScanCheckin = !!group.staffScanCheckinEnabled;
    const quickCheckin = !!group.quickCheckinEnabled;
    const selfQrCheckin = !!group.qrCheckinEnabled;
    const prefix = getOfflineAttendanceFieldPrefix(scope);
    return `
    <div id="${prefix}CheckinConfig" class="offline-attendance-config ${visible ? '' : 'hidden'}">
        <div class="offline-attendance-card">
            <div class="offline-attendance-card-head">
                <div>
                    <div class="offline-attendance-title required">签到时间窗口</div>
                    <p>报名成功后，用户只能在这里定义的时间范围内签到。</p>
                </div>
            </div>
            <div class="offline-attendance-field-grid">
                <label class="offline-attendance-field">
                    <span>开始签到时间</span>
                    <div class="offline-attendance-inline">
                        <span>场次开始前</span>
                        <div class="offline-number-stepper">
                            <input id="${prefix}CheckinStartOffset" type="number" min="0" value="${startOffset}">
                            <span class="offline-stepper-arrows"><button type="button">⌃</button><button type="button">⌄</button></span>
                        </div>
                        <span>分钟</span>
                    </div>
                </label>
                <label class="offline-attendance-field">
                    <span>停止签到时间</span>
                    <select id="${prefix}CheckinEndRule" class="offline-attendance-select">
                        <option value="sessionEnd" ${endRule === 'sessionEnd' ? 'selected' : ''}>活动场次结束前可签到</option>
                        <option value="sessionStart" ${endRule === 'sessionStart' ? 'selected' : ''}>活动场次开始前停止签到</option>
                    </select>
                </label>
            </div>
        </div>
        <div class="offline-attendance-card">
            <div class="offline-attendance-card-head">
                <div>
                    <div class="offline-attendance-title">签到方式</div>
                    <p>按活动现场核验条件选择可用的签到方式。</p>
                </div>
            </div>
            <div class="offline-attendance-control offline-attendance-options">
                <label><input id="${prefix}StaffScanCheckin" type="checkbox" ${staffScanCheckin ? 'checked' : ''}> 工作人员扫码签到 <span class="offline-help-dot tooltip" data-tooltip="工作人员扫描用户报名凭证二维码完成签到，适用于现场核验入场。">?</span></label>
                <label><input id="${prefix}QrCheckin" type="checkbox" ${selfQrCheckin ? 'checked' : ''}> 用户扫码自助签到 <span class="offline-help-dot tooltip" data-tooltip="用户扫描现场签到二维码自行完成签到，适用于固定签到点。">?</span></label>
                <label><input id="${prefix}QuickCheckin" type="checkbox" ${quickCheckin ? 'checked' : ''}> 用户一键签到 <span class="offline-help-dot tooltip" data-tooltip="开启后，用户可在活动页面自行点击完成签到。该方式不校验现场凭证。">?</span></label>
            </div>
        </div>
    </div>`;
}

function renderOfflineCheckoutConfig(group, visible, scope = '') {
    const refreshSeconds = Number(group.checkoutRefreshSeconds || 180);
    const prefix = getOfflineAttendanceFieldPrefix(scope);
    return `
    <div id="${prefix}CheckoutConfig" class="offline-attendance-config offline-checkout-config ${visible ? '' : 'hidden'}">
        <div class="offline-attendance-card offline-attendance-card-compact offline-checkout-card">
            <div class="offline-attendance-simple-head">
                <div>
                    <div class="offline-attendance-title">动态签退口令</div>
                </div>
            </div>
            <label class="offline-attendance-field compact offline-attendance-field-inline offline-checkout-field">
                <span>口令刷新时间</span>
                <div class="offline-attendance-inline">
                    <div class="offline-number-stepper wide">
                        <input id="${prefix}CheckoutRefreshSeconds" type="number" min="1" value="${refreshSeconds}">
                        <span class="offline-stepper-arrows"><button type="button">⌃</button><button type="button">⌄</button></span>
                    </div>
                    <span>秒</span>
                </div>
            </label>
        </div>
    </div>`;
}

function buildOfflineCheckoutCodeList() {
    const sessions = ensureOfflineGroupSessions(offlineGroups[0] || {});
    return sessions.map((session, index) => {
        const sessionName = session.name || formatOfflineSessionName(index);
        const refreshSeconds = Math.max(Number(offlineGroups[0]?.checkoutRefreshSeconds || 180), 1);
        const currentCode = `QT-${String(index + 1).padStart(2, '0')}-${String(refreshSeconds).padStart(3, '0')}`;
        const countdown = `${Math.max(refreshSeconds - ((index * 27) % refreshSeconds), 12)} 秒后刷新`;
        return { sessionName, currentCode, countdown };
    });
}

function renderOfflineCheckoutCodeModalBody() {
    const rows = buildOfflineCheckoutCodeList();
    return `
    <div class="offline-checkout-code-modal">
        <p class="offline-checkout-code-intro">动态签退口令按场次独立生成并自动刷新，复制后可用于现场播报或投屏展示。</p>
        <div class="offline-checkout-code-list">
            ${rows.map(item => `
                <div class="offline-checkout-code-row">
                    <div class="offline-checkout-code-meta">
                        <strong>${offlineEscapeHtml(item.sessionName)}</strong>
                        <span>${offlineEscapeHtml(item.countdown)}</span>
                    </div>
                    <div class="offline-checkout-code-value">${offlineEscapeHtml(item.currentCode)}</div>
                    <button class="btn btn-outline btn-sm" type="button" onclick="copyOfflineCheckoutCode('${offlineEscapeAttr(item.currentCode)}')">复制</button>
                </div>
            `).join('')}
        </div>
    </div>`;
}

function openOfflineCheckoutCodeModal() {
    openModal('查看动态口令', renderOfflineCheckoutCodeModalBody(), null, {
        hideCancel: true,
        confirmText: '知道了',
        modalClass: 'modal-lg offline-checkout-code-modal-shell'
    });
}

function copyOfflineCheckoutCode(code) {
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(code).then(() => {
            openModal('复制成功', `<p>当前签退口令已复制：${offlineEscapeHtml(code)}</p>`, null, {
                hideCancel: true,
                confirmText: '知道了',
                modalClass: 'modal-md'
            });
        });
        return;
    }
    openModal('当前签退口令', `<p>${offlineEscapeHtml(code)}</p>`, null, {
        hideCancel: true,
        confirmText: '知道了',
        modalClass: 'modal-md'
    });
}

function getOfflineAttendanceFieldPrefix(scope = '') {
    if (scope === 'participation') return 'offlineParticipation';
    if (scope === 'global') return 'offlineGlobal';
    return 'offline';
}

function getOfflineSessionSignupStatus(signupStart, signupEnd) {
    const now = new Date('2026-06-09T10:10');
    const start = new Date(signupStart);
    const end = new Date(signupEnd);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '报名中';
    if (now < start) return '未开始';
    if (now > end) return '报名结束';
    return '报名中';
}

function getOfflineSessionStatus(startTime, duration, endTime = '') {
    const now = new Date('2026-06-09T10:10');
    const start = new Date(startTime);
    if (Number.isNaN(start.getTime())) return '未开始';
    const end = endTime
        ? new Date(endTime)
        : new Date(start.getTime() + (Math.max(Number(duration) || 1, 1) * 60000));
    if (Number.isNaN(end.getTime())) return '未开始';
    if (now < start) return '未开始';
    if (now > end) return '场次结束';
    return '进行中';
}

function deleteOfflineSession(index) {
    const group = offlineGroups[offlineParticipationGroupIdx];
    const sessions = ensureOfflineGroupSessions(group);
    if (sessions.length <= 1) {
        alert('至少保留 1 个场次');
        return;
    }
    sessions.splice(index, 1);
    group.sessionCount = sessions.length;
    group.capacity = sessions.reduce((sum, session) => sum + (Number(session.capacity) || 0), 0);
    group.updatedAt = offlineNowStamp();
    refreshOfflineParticipationModal();
}

function toggleOfflineParticipationDetail(type, checked, scope = '') {
    const prefix = getOfflineAttendanceFieldPrefix(scope);
    const targetId = type === 'checkout' ? `${prefix}CheckoutConfig` : `${prefix}CheckinConfig`;
    const target = document.getElementById(targetId);
    if (target) target.classList.toggle('hidden', !checked);
}

function saveOfflineGroupParticipationConfig(index) {
    const group = offlineGroups[index];
    if (!group) return;
    const fieldPrefix = getOfflineAttendanceFieldPrefix('participation');
    const sessions = ensureOfflineGroupSessions(group);
    const sessionCount = sessions.length;
    const capacity = sessions.reduce((sum, session) => sum + (Number(session.capacity) || 0), 0);
    const needSignup = true;
    const checkinToggle = document.getElementById('offlineParticipationCheckin');
    const checkoutToggle = document.getElementById('offlineParticipationCheckout');
    const checkinEnabled = checkinToggle ? Boolean(checkinToggle.checked) : (group.checkinEnabled ?? offlineCheckinEnabled);
    const checkoutEnabled = checkoutToggle ? Boolean(checkoutToggle.checked) : (group.checkoutEnabled ?? offlineCheckoutEnabled);
    const maxSignupSessions = getOfflineEffectiveMaxSignupSessions(group);
    const sessionSignupRule = maxSignupSessions > 1 ? 'multiple_limited' : 'single';
    const checkinStartEl = document.getElementById(`${fieldPrefix}CheckinStartOffset`);
    const checkinEndEl = document.getElementById(`${fieldPrefix}CheckinEndRule`);
    const staffScanCheckinEl = document.getElementById(`${fieldPrefix}StaffScanCheckin`);
    const quickCheckinEl = document.getElementById(`${fieldPrefix}QuickCheckin`);
    const qrCheckinEl = document.getElementById(`${fieldPrefix}QrCheckin`);
    const checkoutRefreshEl = document.getElementById(`${fieldPrefix}CheckoutRefreshSeconds`);
    const checkinStartOffset = Math.max(Number(checkinStartEl?.value ?? group.checkinStartOffset ?? 60), 0);
    const checkinEndRule = checkinEndEl?.value || group.checkinEndRule || 'sessionEnd';
    const staffScanCheckinEnabled = staffScanCheckinEl ? Boolean(staffScanCheckinEl.checked) : !!group.staffScanCheckinEnabled;
    const quickCheckinEnabled = quickCheckinEl ? Boolean(quickCheckinEl.checked) : !!group.quickCheckinEnabled;
    const qrCheckinEnabled = qrCheckinEl ? Boolean(qrCheckinEl.checked) : !!group.qrCheckinEnabled;
    const checkoutMethod = 'dynamicCode';
    const checkoutRefreshSeconds = Math.max(Number(checkoutRefreshEl?.value ?? group.checkoutRefreshSeconds ?? 180), 1);
    const missingEndIndex = sessions.findIndex(session => !getOfflineSessionEndTimeValue(session));
    if (missingEndIndex >= 0) {
        alert(`请填写${sessions[missingEndIndex].name || formatOfflineSessionName(missingEndIndex)}的场次结束时间`);
        return;
    }

    group.participationConfigured = true;
    group.sessionCount = sessionCount;
    group.capacity = capacity;
    group.needSignup = needSignup;
    group.signupReview = sessions.some(session => !!session.signupReview);
    group.sessionSignupRule = sessionSignupRule;
    group.maxSignupSessions = maxSignupSessions;
    group.checkinEnabled = checkinEnabled;
    group.checkoutEnabled = checkoutEnabled;
    group.checkinStartOffset = checkinStartOffset;
    group.checkinEndRule = checkinEndRule;
    group.staffScanCheckinEnabled = staffScanCheckinEnabled;
    group.quickCheckinEnabled = quickCheckinEnabled;
    group.qrCheckinEnabled = qrCheckinEnabled;
    group.checkoutMethod = checkoutMethod;
    group.checkoutRefreshSeconds = checkoutRefreshSeconds;
    group.updatedAt = offlineNowStamp();
    offlineSessionCount = sessionCount;
    offlineNeedSignup = needSignup;
    offlineCheckinEnabled = checkinEnabled;
    offlineCheckoutEnabled = checkoutEnabled;
    offlineParticipationFsOpen = false;
    goOfflineStep(3);
}

function goOfflineStep(step, options = {}) {
    offlineActivityStep = Math.min(5, Math.max(1, step));
    document.getElementById('mainContent').innerHTML = renderOfflineActivityCreate();
    if (!options.preserveScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function refreshOfflineStepOne() {
    if (offlineActivityStep === 1) goOfflineStep(1);
}

function setOfflineActivityName(value) {
    offlineActivityName = value || '';
}

function toggleOfflineHostMode(mode, checked) {
    if (!OFFLINE_HOST_MODE_OPTIONS.some(option => option.key === mode)) return;
    const selectedModes = new Set(offlineHostModes);
    if (checked) selectedModes.add(mode);
    else selectedModes.delete(mode);
    offlineHostModes = OFFLINE_HOST_MODE_OPTIONS
        .map(option => option.key)
        .filter(option => selectedModes.has(option));
}

function setOfflineActivityTarget(value) {
    offlineActivityTarget = value || '';
}

function setOfflineActivityScope(scope) {
    if (!OFFLINE_ACTIVITY_SCOPE_OPTIONS.some(option => option.key === scope)) return;
    offlineActivityScope = scope;
    if (scope === 'national') offlineActivityRegion = '';
    refreshOfflineStepOne();
}

function setOfflineActivityRegion(region) {
    offlineActivityRegion = region || '';
}

function setOfflineActivityLocationProvince(province) {
    if (!OFFLINE_LOCATION_CITY_OPTIONS[province]) return;
    const cities = OFFLINE_LOCATION_CITY_OPTIONS[province] || [];
    offlineActivityLocation.province = province;
    offlineActivityLocation.city = cities.includes(offlineActivityLocation.city) ? offlineActivityLocation.city : (cities[0] || '');
    refreshOfflineStepOne();
}

function setOfflineActivityLocationCity(city) {
    offlineActivityLocation.city = city || '';
}

function setOfflineActivityLocationAddress(address) {
    offlineActivityLocation.address = address || '';
    offlineActivityLocation.placeName = address || '';
}

function toggleOfflineUnitRoleDropdown(event) {
    if (event && event.stopPropagation) event.stopPropagation();
    offlineUnitRoleDropdownOpen = !offlineUnitRoleDropdownOpen;
    goOfflineStep(1);
}

function selectOfflineUnitRole(role) {
    const option = OFFLINE_UNIT_ROLE_OPTIONS.find(item => item.key === role);
    if (!option) return;
    offlineUnitRole = option.key;
    offlineUnitRoleDropdownOpen = false;
    if (offlineOrgUnits[0]) offlineOrgUnits[0].type = option.type;
    goOfflineStep(1);
}

function setOfflineSignupTime(which, value) {
    const nextValue = formatOfflineDateTimeLocalForStorage(value);
    if (which === 'start') offlineSignupStart = nextValue;
    else offlineSignupEnd = nextValue;
    goOfflineStep(1);
}

function setOfflineOrgUnitName(index, value) {
    if (!offlineOrgUnits[index]) return;
    offlineOrgUnits[index].name = value;
}

function addOfflineOrgUnit() {
    const nextNo = offlineOrgUnits.length + 1;
    offlineOrgUnits.push({ type: `自定义单位${nextNo}`, name: '' });
    goOfflineStep(1);
}

function deleteOfflineOrgUnit(index) {
    if (offlineOrgUnits.length <= 1) return;
    offlineOrgUnits.splice(index, 1);
    goOfflineStep(1);
}

function renameOfflineOrgUnit(index) {
    const current = offlineOrgUnits[index];
    if (!current) return;
    const nextName = window.prompt('请输入单位类型名称', current.type);
    if (!nextName || !nextName.trim()) return;
    current.type = nextName.trim();
    goOfflineStep(1);
}

function switchOfflineIntroMode(mode) {
    offlineIntroMode = mode === 'free' ? 'free' : 'standard';
    goOfflineStep(2);
}

function switchOfflineIntroDevice(device) {
    offlineIntroDevice = device === 'mobile' ? 'mobile' : 'desktop';
    goOfflineStep(2);
}

function markOfflineIntroDeviceEdited() {
    if (offlineIntroDevice === 'mobile') {
        offlineIntroMobileIndependent = true;
        offlineIntroMobileInherited = false;
    }
}

function inheritOfflineDesktopIntroContent() {
    if (offlineIntroMobileIndependent && !window.confirm('重新沿用电脑端内容会覆盖当前手机端单独编辑内容，是否继续？')) return;
    offlineIntroMobileIndependent = false;
    offlineIntroMobileInherited = true;
    goOfflineStep(2);
}

function toggleOfflineNeedSignup() {
    offlineNeedSignup = !offlineNeedSignup;
    goOfflineStep(3);
}

function toggleOfflineCheckin(checked) {
    offlineCheckinEnabled = typeof checked === 'boolean' ? checked : !offlineCheckinEnabled;
    goOfflineStep(3, { preserveScroll: true });
}

function toggleOfflineCheckout(checked) {
    offlineCheckoutEnabled = typeof checked === 'boolean' ? checked : !offlineCheckoutEnabled;
    goOfflineStep(3, { preserveScroll: true });
}

function toggleOfflineFeedback(checked) {
    offlineFeedbackEnabled = typeof checked === 'boolean' ? checked : !offlineFeedbackEnabled;
    goOfflineStep(5);
}

function setOfflineFeedbackField(field, value) {
    if (field === 'entryName') offlineFeedbackEntryName = value || '';
    if (field === 'body') offlineFeedbackBody = value || '';
}

function addOfflineSession() {
    offlineSessionCount += 1;
    goOfflineStep(3);
}

function removeOfflineSession() {
    offlineSessionCount = Math.max(1, offlineSessionCount - 1);
    goOfflineStep(3);
}

function openOfflinePreview() {
    openModal('活动报名预览', `
        <div class="offline-modal-preview">
            <div class="offline-phone-preview"><div></div><h4>${offlineEscapeHtml(offlineActivityName)}</h4><span>${offlineEscapeHtml(offlineActivityLocation.city)} · 2026-06-26 14:00</span><button>立即报名</button></div>
            <p>请重点确认活动标题、地点、场次、报名须知、签到方式和咨询入口。</p>
        </div>
    `, null, { hideCancel: true, confirmText: '知道了', modalClass: 'modal-md' });
}

function openOfflinePublishConfirm() {
    openModal('发布成功', '<p>活动报名已发布。用户端将开放活动详情页，管理员可在活动管理中查看报名、签到与签退数据。</p>', () => {
        navigateTo('activity-list', { params: { activityType: 'offline', activityLabel: '活动报名' } });
    }, { hideCancel: true, confirmText: '返回活动报名列表', modalClass: 'modal-md' });
}

function offlineEscapeAttr(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function offlineEscapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function getOfflineFullLocationText() {
    const province = offlineActivityLocation.province || '';
    const city = offlineActivityLocation.city || '';
    const address = offlineActivityLocation.address || '';
    return `${province}-${city}   ${address}`.trim();
}

function getOfflineDateTimeLocalValue(value, fallbackTime = '00:00') {
    const text = String(value || '').trim();
    if (!text) return '';
    const normalized = text.replace(' ', 'T');
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(normalized)) return normalized.slice(0, 16);
    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return `${normalized}T${fallbackTime}`;
    return '';
}

function formatOfflineDateTimeLocalForStorage(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    return text.replace('T', ' ');
}
