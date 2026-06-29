/* offline-activity-create.js - 活动报名创建流程 */

let offlineActivityStep = 1;
let offlineSessionCount = 1;
let offlineNeedSignup = true;
let offlineCheckinEnabled = true;
let offlineCheckoutEnabled = false;
let offlineAttendanceMode = 'code';
let offlineSelfCheckinEnabled = false;
let offlineCheckinStartOffset = 60;
let offlineCheckinEndRule = 'sessionEnd';
let offlineCheckoutMethod = 'staffScan';
let offlineIntroMode = 'standard';
let offlineIntroDevice = 'desktop';
let offlineIntroMobileIndependent = false;
let offlineIntroMobileInherited = false;
let offlineGroupMenuOpenIdx = -1;
let offlineFormFsOpen = false;
let offlineFormGroupIdx = 0;
let offlineParticipationFsOpen = false;
let offlineParticipationGroupIdx = 0;
let offlineActivityName = '阅读与远方：在不确定中找到自我——《旅居意大利》校友对谈分享会';
let offlineUnitRole = 'organizer';
let offlineUnitRoleDropdownOpen = false;
let offlineHostModes = ['online'];
let offlineActivityTags = ['讲座', '读书'];
let offlineActivityTagDropdownOpen = false;
let offlineSignupStart = '2026-06-09T00:00';
let offlineSignupEnd = '2026-06-09T01:30';
let offlineSignupReview = false;
let offlineMaxSignupSessions = 1;
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
        attendanceMode: 'code',
        sessions: [
            {
                name: '场次一',
                subtitle: '',
                startTime: '2026-06-09T00:00',
                endTime: '2026-06-09T01:30',
                duration: 90,
                capacity: 99,
                signupQuantityLimited: true,
                maxSignupQuantity: 1,
                location: {
                    province: '广东省',
                    city: '广州市',
                    address: '广东财经大学广州校区图书馆801',
                    placeName: '广东财经大学广州校区图书馆',
                    lng: 113.3568,
                    lat: 23.0896
                },
                sortOrder: 1,
                signupStart: '2026-06-09T00:00',
                signupEnd: '2026-06-09T01:30',
                signupStopBeforeStartMinutes: 0,
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
const OFFLINE_DEFAULT_RULES = [
    '不限制单账号可报名人数；活动名额由各场次名额控制。',
    '单人最多可参与场次数由活动配置控制，默认 1 个场次。',
    '代报人为多人报名时，默认需为每个参加人填写报名信息。',
    '每个场次至少保留 1 个场次，不支持删除最后一个场次。',
    '场次名称默认按“场次一、场次二...”自动生成，支持手动修改。',
    '拖拽或上下移动场次后，系统会自动更新场次展示顺序。',
    '由工作人员扫码核销是系统默认签到方式，始终保留；用户自助签到是增强能力。',
    '用户自助签到开启后，用户端展示自助签到能力；关闭后，用户只能由工作人员扫码核销。',
    '签退默认关闭；仅培训、志愿服务、需要统计完整出勤时长的活动建议开启。',
    '每个场次的签到签退方式统一配置，仅可二选一；是否需要用户实际执行签退，由主办方现场安排决定。',
    '默认允许用户在报名截止前修改已提交的信息。报名截止前 + 待审核：可以修改；报名截止前 + 已审核通过：修改后应重新进入“待审核”；报名截止后 + 无论待审核还是已通过：用户端都不允许修改。即：报名截止时间决定用户是否还有修改入口；审核状态决定修改后是否需要重新审核。',
    '系统默认用户可在截止前取消报名并释放名额。',
    '用户取消报名或报名未通过后，不计入可签到、可签退名单。',
    '用户端详情页默认展示剩余名额，减少后台配置项。'
];
const OFFLINE_ATTENDANCE_UNIFIED_TIP = '当前默认使用「工作人员扫码核销」。如需支持用户自行签到，可切换为「用户自助签到」。具体执行方式可由主办方根据现场安排决定。';
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
    [3, '报名与参与'],
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
        <div class="offline-basic-grid">
            <div class="qc-form-row span-2">
                <label><span class="req">*</span>活动名称</label>
                <input class="qc-input" maxlength="50" value="${offlineEscapeAttr(offlineActivityName)}" onchange="setOfflineActivityName(this.value)" placeholder="请输入活动名称，50字以内">
            </div>
            ${renderOfflineSignupTimeBasicRow()}
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
    <section class="quiz-config-card org-card offline-config-section">
        ${renderOfflineOrgUnits()}
    </section>`;
}

function renderOfflineSignupTimeBasicRow() {
    return `
            <div class="qc-form-row span-2 offline-signup-time-basic-row">
                <label><span class="req">*</span>报名时间</label>
                <div class="offline-signup-time-basic-control">
                    <div class="offline-session-date-range">
                        <input type="datetime-local" class="form-control" value="${offlineEscapeAttr(getOfflineDateTimeLocalValue(offlineSignupStart))}" onchange="setOfflineActivitySignupTime('start', this.value)">
                        <span class="offline-session-date-separator">至</span>
                        <input type="datetime-local" class="form-control" required value="${offlineEscapeAttr(getOfflineDateTimeLocalValue(offlineSignupEnd))}" onchange="setOfflineActivitySignupTime('end', this.value)">
                    </div>
                </div>
            </div>`;
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

function renderOfflineLocationProvinceOptions(location = offlineActivityLocation) {
    const provinces = Object.keys(OFFLINE_LOCATION_CITY_OPTIONS);
    const current = location?.province || provinces[0];
    return provinces.map(province => `<option value="${province}" ${province === current ? 'selected' : ''}>${province}</option>`).join('');
}

function renderOfflineLocationCityOptions(province = offlineActivityLocation.province, location = offlineActivityLocation) {
    const cities = OFFLINE_LOCATION_CITY_OPTIONS[province] || [];
    const current = location?.city || cities[0] || '';
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
        : '配置报名字段与填写规则';
}

function getOfflineGroupParticipationSummary(group) {
    return group?.participationConfigured
        ? getOfflineSessionSummary(group)
        : '配置场次、时间、名额与参与规则';
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
        <div class="offline-settings-layout">
            <div class="offline-settings-content">
                ${renderOfflineGroupedSignupPanel()}
                ${renderOfflineSignupNoticePanel()}
                ${renderOfflineDefaultRulesPanel()}
            </div>
        </div>
    </section>`;
}

function renderOfflineActivitySignupRuleRows() {
    return `
    <div class="offline-activity-signup-rule-rows">
        <div class="offline-session-rule-stack">
            <div class="offline-session-inner-row">
                <div class="offline-session-inner-label">是否需要审核报名 <span class="offline-help-dot tooltip" data-tooltip="开启后，用户提交活动报名后需管理员审核通过，才算报名成功。">?</span></div>
                <div class="offline-session-inner-control">
                    <div class="offline-attendance-radio-options">
                        <label><input type="radio" name="offlineActivitySignupReviewRequired" value="yes" ${offlineSignupReview ? 'checked' : ''} onchange="setOfflineSignupReview(true)"> 是</label>
                        <label><input type="radio" name="offlineActivitySignupReviewRequired" value="no" ${offlineSignupReview ? '' : 'checked'} onchange="setOfflineSignupReview(false)"> 否</label>
                    </div>
                </div>
            </div>
            <div class="offline-session-inner-row">
                <div class="offline-session-inner-label">单人最多可参与场次 <span class="offline-help-dot tooltip" data-tooltip="限制同一参加人在当前活动下最多可选择几个场次。">?</span></div>
                <div class="offline-session-inner-control">
                    <div class="offline-session-checkin-offset">
                        <span>最多参与</span>
                        <input class="offline-rule-number-input" type="number" min="1" value="${Number(offlineMaxSignupSessions) || 1}" onchange="setOfflineMaxSignupSessions(this.value)">
                        <span>个场次</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderOfflineGroupedSignupPanel() {
    const primaryGroup = offlineGroups[0];
    return `
    <section class="offline-setting-panel offline-grouped-panel" id="offlineSettingGroups">
        <div id="offlineGroupList">${primaryGroup ? renderOfflineGroupCard(primaryGroup, 0, { hideGroupConcept: true, hideMenu: true }) : ''}</div>
    </section>`;
}

function getOfflineAttendanceCurrentMethodText(selfCheckinEnabled = false, checkoutEnabled = false) {
    const checkinText = selfCheckinEnabled ? '用户自助签到' : '工作人员扫码签到';
    const checkoutText = checkoutEnabled
        ? (selfCheckinEnabled ? '用户自助签退' : '工作人员扫码签退')
        : '无需签退';
    return `${checkinText}，${checkoutText}`;
}

function getOfflineSessionAttendanceConfig(session = {}) {
    const attendanceMode = (session.attendanceMode || offlineAttendanceMode || 'code') === 'quick' ? 'quick' : 'code';
    const checkoutEnabled = !!(session.checkoutEnabled ?? offlineCheckoutEnabled);
    const checkinStartOffset = Math.max(Number(session.checkinStartOffset ?? offlineCheckinStartOffset ?? 60) || 0, 0);
    const checkinEndRule = (session.checkinEndRule || offlineCheckinEndRule || 'sessionEnd') === 'sessionStart' ? 'sessionStart' : 'sessionEnd';
    return {
        attendanceMode,
        selfCheckinEnabled: attendanceMode === 'quick',
        checkoutEnabled,
        checkinStartOffset,
        checkinEndRule,
        checkoutMethod: attendanceMode === 'quick' ? 'self' : 'staffScan'
    };
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
                <div class="intro-editor-body">请输入...</div>
            </div>
        </div>
    </section>`;
}

function renderOfflineDefaultRulesPanel() {
    return `
    <section class="offline-setting-panel offline-default-rules-panel" id="offlineSettingDefaultRules">
        <div class="offline-setting-panel-head">
            <div>
                <h3>系统默认规则</h3>
                <p>研发可见：以下规则由系统默认实现，后台不再提供配置项。</p>
            </div>
        </div>
        <div class="offline-default-rule-list">
            ${OFFLINE_DEFAULT_RULES.map(rule => `<div class="offline-default-rule-item">${rule}</div>`).join('')}
        </div>
    </section>`;
}

function renderOfflineCheckinSettingsPanel() {
    return '';
}

function renderOfflineCheckoutSettingsPanel() {
    return '';
}

function renderOfflineGroupCard(group, index, options = {}) {
    const status = getOfflineGroupStatus(group);
    const statusText = status === 'done' ? '已配置' : status === 'partial' ? '部分配置' : '未配置';
    const statusIcon = status === 'done' ? '✓' : status === 'partial' ? '!' : '•';
    const doneCount = (group.formConfigured ? 1 : 0) + (group.participationConfigured ? 1 : 0);
    const hideGroupConcept = !!options.hideGroupConcept;
    const displayName = hideGroupConcept ? '报名配置' : group.name;
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
                ${hideGroupConcept ? '' : `<span class="gc-status-pill ${status}"><span class="gc-status-ico">${statusIcon}</span>${statusText}</span>`}
                ${hideGroupConcept ? '' : `<span class="gc-name-pencil" onclick="focusOfflineGroupName(${index})" title="编辑组别名称">✎</span>`}
                ${options.hideMenu ? '' : `<button class="gc-menu-btn" type="button" onclick="toggleOfflineGroupMenu(${index}, event)" title="更多操作">⋯</button>`}
                ${!options.hideMenu && menuOpen ? `
                <div class="gc-menu" onclick="event.stopPropagation()">
                    <div class="gc-menu-item" onclick="copyOfflineGroup(${index});closeOfflineGroupMenus()">⧉ 复制组别</div>
                    ${offlineGroups.length > 1 ? `
                    <div class="gc-menu-divider"></div>
                    <div class="gc-menu-item danger" onclick="deleteOfflineGroup(${index});closeOfflineGroupMenus()">删除组别</div>` : ''}
                </div>` : ''}
            </div>
            <div class="gc-progress-line">
                <span>${hideGroupConcept ? '设置进度' : '配置进度'}</span>
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
                    <div class="gc-tile-title">场次配置</div>
                    <div class="gc-tile-desc">${participationSummary}</div>
                    <button class="btn ${group.participationConfigured ? 'btn-outline' : 'btn-dark'} btn-sm" type="button" onclick="event.stopPropagation();configureOfflineGroupParticipation(${index})">${group.participationConfigured ? '编辑规则' : '配置规则'}</button>
                </div>
            </div>
            ${hideGroupConcept ? renderOfflineActivitySignupRuleRows() : ''}
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

function openOfflineMapPicker(sessionIndex = null) {
    offlineMapSelectedPlaceId = getOfflineCurrentMapPlace(sessionIndex)?.id || offlineMapSelectedPlaceId || OFFLINE_MAP_PLACES[0].id;
    offlineMapSearchKeyword = '';
    openModal('地图定位', renderOfflineMapPickerBody(sessionIndex), () => saveOfflineMapSelection(sessionIndex), {
        confirmText: '确认定位',
        modalClass: 'modal-xl offline-map-picker-modal'
    });
}

function renderOfflineMapPickerBody(sessionIndex = null) {
    const results = getOfflineMapSearchResults();
    return `
    <div class="offline-map-picker">
        <div class="offline-map-sidebar">
            <div class="offline-map-search">
                <input id="offlineMapSearchInput" class="qc-input" value="${offlineEscapeAttr(offlineMapSearchKeyword)}" placeholder="搜索地点、学校、图书馆或详细地址" oninput="refreshOfflineMapSearchResults(this.value)" onkeydown="if(event.key==='Enter') event.preventDefault()">
                <button type="button" onclick="refreshOfflineMapSearchResults(document.getElementById('offlineMapSearchInput')?.value || '')">搜索</button>
            </div>
            <div class="offline-map-current">
                <span>${sessionIndex === null ? '当前活动地点' : '当前场次地点'}</span>
                <strong>${offlineEscapeHtml(getOfflineFullLocationText(sessionIndex))}</strong>
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

function getOfflineCurrentMapPlace(sessionIndex = null) {
    const location = getOfflineLocationContext(sessionIndex);
    return OFFLINE_MAP_PLACES.find(place =>
        place.province === location.province
        && place.city === location.city
        && place.address === location.address
    );
}

function saveOfflineMapSelection(sessionIndex = null) {
    const place = OFFLINE_MAP_PLACES.find(item => item.id === offlineMapSelectedPlaceId);
    if (!place) return false;
    const nextLocation = {
        province: place.province,
        city: place.city,
        address: place.address,
        placeName: place.name,
        lng: place.lng,
        lat: place.lat
    };
    if (sessionIndex === null || sessionIndex === undefined) {
        offlineActivityLocation = nextLocation;
        refreshOfflineStepOne();
    } else {
        const group = offlineGroups[offlineParticipationGroupIdx];
        const session = ensureOfflineGroupSessions(group)[sessionIndex];
        if (!session) return false;
        session.location = nextLocation;
        group.updatedAt = offlineNowStamp();
        refreshOfflineParticipationModal();
    }
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
        subtitle: '',
        startTime: `2026-06-${day}T00:00`,
        endTime: `2026-06-${day}T01:30`,
        duration: 90,
        capacity: index === 0 ? 99 : 9,
        signupQuantityLimited: true,
        maxSignupQuantity: 1,
        location: { ...offlineActivityLocation },
        sortOrder: index + 1,
        signupStart: '2026-06-09T00:00',
        signupEnd: `2026-06-${day}T01:30`,
        signupReview: false,
        attendanceMode: 'code',
        checkinStartOffset: 60,
        checkinEndRule: 'sessionEnd',
        checkoutEnabled: false,
        signupStopBeforeStartMinutes: 0,
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
        if (session.signupReview === undefined) session.signupReview = offlineSignupReview;
        if (!session.attendanceMode) session.attendanceMode = offlineAttendanceMode || 'code';
        if (session.checkinStartOffset === undefined) session.checkinStartOffset = offlineCheckinStartOffset ?? 60;
        if (!session.checkinEndRule) session.checkinEndRule = offlineCheckinEndRule || 'sessionEnd';
        if (session.checkoutEnabled === undefined) session.checkoutEnabled = offlineCheckoutEnabled;
        if (!session.waitlistMode) session.waitlistMode = 'manual';
        if (session.endTime === undefined) session.endTime = getOfflineSessionComputedEndTime(session.startTime, session.duration);
        if (!session.location || typeof session.location !== 'object') session.location = { ...offlineActivityLocation };
        if (session.collapsed === undefined) session.collapsed = false;
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
    return `${formatOfflineDateTimeText(offlineSignupStart)} 至 ${formatOfflineDateTimeText(offlineSignupEnd)}`;
}

function getOfflineSignupRuleText(group) {
    return '报名场次数量不限';
}

function isOfflineMultiGroupMode() {
    return offlineGroups.length > 1;
}

function getOfflineSessionSummary(group) {
    const sessions = ensureOfflineGroupSessions(group);
    return `本组已设置 ${sessions.length} 个场次`;
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
        sessions: ensureOfflineGroupSessions(source).map(session => ({
            ...session,
            location: session?.location && typeof session.location === 'object'
                ? { ...session.location }
                : { ...offlineActivityLocation }
        })),
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
    const title = isOfflineMultiGroupMode()
        ? `${offlineEscapeAttr(group?.name || '组别')} · 报名表配置`
        : '报名表配置';
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
                    <div class="qfh-nav-title">${title}</div>
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
            <div class="quiz-fs-footer-meta">保存后将回填活动设置状态。</div>
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
                <div class="phase-section-subtitle">${singleSession ? '单场活动只需配置默认场次；多场次活动可继续添加场次。' : '可配置多个活动场次，每场独立设置举办时间、名额与签到/签退规则。'}</div>
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
    const configured = !!(
        String(session.name || '').trim()
        && session.startTime
        && getOfflineSessionEndTimeValue(session)
        && Number(session.capacity) > 0
    );
    const collapsed = !!session.collapsed;
    const displayTitle = total <= 1 ? '场次配置' : offlineEscapeHtml(session.name || formatOfflineSessionName(index));
    return `
    <div id="offlineSessionCard_${index}" class="group-card rich gc-${configured ? 'done' : 'empty'} phase-config-card offline-session-config-card ${collapsed ? 'is-collapsed' : ''}">
        <div class="gc-stripe"></div>
        <div class="gc-body">
            <div class="gc-head-row phase-head-row">
                <span class="gc-drag" title="拖拽排序">⠿</span>
                <div class="phase-head-title-wrap">
                    <div class="phase-config-card-title">${displayTitle}</div>
                </div>
                <span class="phase-chip ${configured ? 'ok' : 'warn'}">${configured ? '已完成配置' : '未完成配置'}</span>
                <div class="phase-config-card-actions">
                    <button class="pli-ic-btn" type="button" title="上移场次" ${canMoveUp ? `onclick="moveOfflineSession(${index}, -1)"` : 'disabled'}>↑</button>
                    <button class="pli-ic-btn" type="button" title="下移场次" ${canMoveDown ? `onclick="moveOfflineSession(${index}, 1)"` : 'disabled'}>↓</button>
                    <button class="pli-ic-btn" type="button" title="复制场次" onclick="copyOfflineParticipationSession(${index})">⧉</button>
                    <button class="pli-ic-btn danger" type="button" title="${canDelete ? '删除场次' : '至少保留 1 个场次'}" ${canDelete ? `onclick="deleteOfflineSession(${index})"` : 'disabled'}>×</button>
                    <button class="pli-ic-btn offline-session-collapse-btn" type="button" title="${collapsed ? '展开场次' : '折叠场次'}" aria-expanded="${collapsed ? 'false' : 'true'}" onclick="toggleOfflineSessionCollapsed(${index})">${collapsed ? '⌄' : '⌃'}</button>
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
    const location = getOfflineSessionLocation(session);
    const attendanceConfig = getOfflineSessionAttendanceConfig(session);
    const selfCheckinEnabled = attendanceConfig.selfCheckinEnabled;
    const checkoutEnabled = attendanceConfig.checkoutEnabled;
    const checkinStartOffset = attendanceConfig.checkinStartOffset;
    const checkinEndRule = attendanceConfig.checkinEndRule;
    return `
    <div class="phase-block offline-session-phase-block offline-session-field-list">
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 场次名称</div>
            <div class="cfg-row-control">
                <input class="form-control" value="${offlineEscapeAttr(session.name || formatOfflineSessionName(index))}" placeholder="请输入场次名称" onchange="setOfflineSessionField(${index}, 'name', this.value)">
            </div>
        </div>
        <div class="cfg-row">
            <div class="cfg-row-label">场次说明</div>
            <div class="cfg-row-control">
                <textarea class="form-control" rows="3" placeholder="请输入场次说明（选填）" onchange="setOfflineSessionField(${index}, 'subtitle', this.value)">${offlineEscapeHtml(session.subtitle || '')}</textarea>
            </div>
        </div>
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 举办时间</div>
            <div class="cfg-row-control">
                <div class="offline-session-date-range">
                    <input type="datetime-local" class="form-control" value="${offlineEscapeAttr(getOfflineDateTimeLocalValue(session.startTime))}" onchange="setOfflineSessionField(${index}, 'startTime', this.value)">
                    <span class="offline-session-date-separator">至</span>
                    <input type="datetime-local" class="form-control" required value="${offlineEscapeAttr(endTimeValue)}" onchange="setOfflineSessionField(${index}, 'endTime', this.value)">
                </div>
            </div>
        </div>
        <div class="cfg-row">
            <div class="cfg-row-label">活动地点</div>
            <div class="cfg-row-control">
                <div class="offline-location-grid">
                    <select class="qc-input" onchange="setOfflineSessionLocationProvince(${index}, this.value)">
                        ${renderOfflineLocationProvinceOptions(location)}
                    </select>
                    <select class="qc-input" onchange="setOfflineSessionLocationCity(${index}, this.value)">
                        ${renderOfflineLocationCityOptions(location.province, location)}
                    </select>
                    <input class="qc-input" value="${offlineEscapeAttr(location.address)}" onchange="setOfflineSessionLocationAddress(${index}, this.value)" placeholder="请输入详细地址">
                </div>
            </div>
        </div>
        <div class="cfg-row">
            <div class="cfg-row-label"><span class="req">*</span> 名额上限 <span class="offline-help-dot tooltip" data-tooltip="限制当前场次最多可报名的参与人数。">?</span></div>
            <div class="cfg-row-control">
                <div class="offline-session-capacity-field">
                    <div class="num-input offline-session-capacity-input">
                        <input type="number" min="1" value="${Number(session.capacity) || 1}" onchange="setOfflineSessionField(${index}, 'capacity', this.value)">
                        <span class="unit">人</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="cfg-row offline-session-signup-attendance-row">
            <div class="cfg-row-control">
                <div class="offline-session-rule-stack">
                    <div class="offline-session-inner-row">
                        <div class="offline-session-inner-label">签到提前时长</div>
                        <div class="offline-session-inner-control">
                            <div class="offline-session-checkin-offset">
                                <span>场次开始前</span>
                                <input class="offline-rule-number-input" type="number" min="0" value="${checkinStartOffset}" onchange="setOfflineSessionRuleField(${index}, 'checkinStartOffset', this.value)">
                                <span>分钟</span>
                            </div>
                        </div>
                    </div>
                    <div class="offline-session-inner-row">
                        <div class="offline-session-inner-label">签到截止规则</div>
                        <div class="offline-session-inner-control">
                            <div class="offline-attendance-mode-select">
                                <select class="offline-attendance-select" onchange="setOfflineSessionRuleField(${index}, 'checkinEndRule', this.value)">
                                    <option value="sessionStart" ${checkinEndRule === 'sessionStart' ? 'selected' : ''}>场次开始时</option>
                                    <option value="sessionEnd" ${checkinEndRule === 'sessionEnd' ? 'selected' : ''}>场次结束时</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="offline-session-inner-row">
                        <div class="offline-session-inner-label">是否需要签退</div>
                        <div class="offline-session-inner-control">
                            <div class="offline-attendance-radio-options">
                                <label><input type="radio" name="offlineCheckoutRequired_${index}" value="yes" ${checkoutEnabled ? 'checked' : ''} onchange="setOfflineSessionRuleField(${index}, 'checkoutEnabled', true)"> 是</label>
                                <label><input type="radio" name="offlineCheckoutRequired_${index}" value="no" ${checkoutEnabled ? '' : 'checked'} onchange="setOfflineSessionRuleField(${index}, 'checkoutEnabled', false)"> 否</label>
                            </div>
                        </div>
                    </div>
                    <div class="offline-session-inner-row">
                        <div class="offline-session-inner-label">签到/签退方式</div>
                        <div class="offline-session-inner-control">
                            <div class="offline-attendance-radio-options">
                                <label><input type="radio" name="offlineAttendanceUnifiedMethod_${index}" value="quick" ${selfCheckinEnabled ? 'checked' : ''} onchange="setOfflineSessionRuleField(${index}, 'attendanceMode', 'quick')"> 用户自助 <span class="offline-help-dot tooltip" data-tooltip="勾选后，用户可在报名凭证页自行点击「签到」或「签退」按钮完成操作。">?</span></label>
                                <label><input type="radio" name="offlineAttendanceUnifiedMethod_${index}" value="staff" ${selfCheckinEnabled ? '' : 'checked'} onchange="setOfflineSessionRuleField(${index}, 'attendanceMode', 'code')"> 工作人员扫码</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function getOfflineSessionLocation(session) {
    if (!session.location || typeof session.location !== 'object') {
        session.location = { ...offlineActivityLocation };
    }
    return session.location;
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

function setOfflineSignupReview(enabled) {
    offlineSignupReview = !!enabled;
    goOfflineStep(3, { preserveScroll: true });
}

function setOfflineActivitySignupTime(type, value) {
    if (type === 'start') offlineSignupStart = value || '';
    if (type === 'end') offlineSignupEnd = value || '';
}

function setOfflineMaxSignupSessions(value) {
    offlineMaxSignupSessions = Math.max(Number(value) || 1, 1);
    goOfflineStep(3, { preserveScroll: true });
}

function setOfflineCheckinEnabled(enabled) {
    offlineCheckinEnabled = !!enabled;
    offlineGroups.forEach(group => {
        if (!group) return;
        group.checkinEnabled = offlineCheckinEnabled;
        group.staffScanCheckinEnabled = offlineCheckinEnabled;
        group.quickCheckinEnabled = offlineCheckinEnabled && offlineSelfCheckinEnabled;
    });
    goOfflineStep(3, { preserveScroll: true });
}

function setOfflineSessionField(index, key, value) {
    const group = offlineGroups[offlineParticipationGroupIdx];
    const session = ensureOfflineGroupSessions(group)[index];
    if (!session) return;
    if (key === 'duration' || key === 'capacity' || key === 'sortOrder' || key === 'maxSignupQuantity') {
        session[key] = Math.max(Number(value) || 1, 1);
    } else if (key === 'signupStopBeforeStartMinutes') {
        session[key] = Math.max(Number(value) || 0, 0);
    } else if (key === 'allowWalkIn' || key === 'published' || key === 'capacityLimited' || key === 'waitlistEnabled' || key === 'signupQuantityLimited') {
        session[key] = !!value;
    } else if (key === 'remark') {
        session[key] = String(value || '').slice(0, 20);
    } else {
        session[key] = value || '';
    }
    if (key === 'startTime' && session.startTime && !session.endTime) {
        session.endTime = getOfflineSessionComputedEndTime(session.startTime, session.duration);
    }
    session.signupStatus = getOfflineSessionSignupStatus(offlineSignupStart, offlineSignupEnd);
    session.sessionStatus = getOfflineSessionStatus(session.startTime, session.duration, session.endTime);
    group.sessionCount = ensureOfflineGroupSessions(group).length;
    group.capacity = ensureOfflineGroupSessions(group).reduce((sum, item) => sum + (Number(item.capacity) || 0), 0);
    group.updatedAt = offlineNowStamp();
    refreshOfflineParticipationModal();
}

function setOfflineSessionRuleField(index, key, value) {
    const group = offlineGroups[offlineParticipationGroupIdx];
    const session = ensureOfflineGroupSessions(group)[index];
    if (!session) return;
    if (key === 'checkoutEnabled') {
        session[key] = !!value;
    } else if (key === 'checkinStartOffset') {
        session[key] = Math.max(Number(value) || 0, 0);
    } else if (key === 'attendanceMode') {
        session[key] = value === 'quick' ? 'quick' : 'code';
    } else if (key === 'checkinEndRule') {
        session[key] = value === 'sessionStart' ? 'sessionStart' : 'sessionEnd';
    } else {
        session[key] = value;
    }
    group.updatedAt = offlineNowStamp();
    refreshOfflineParticipationModal();
}

function setOfflineSessionLocationProvince(index, province) {
    const group = offlineGroups[offlineParticipationGroupIdx];
    const session = ensureOfflineGroupSessions(group)[index];
    if (!session || !OFFLINE_LOCATION_CITY_OPTIONS[province]) return;
    const location = getOfflineSessionLocation(session);
    const cities = OFFLINE_LOCATION_CITY_OPTIONS[province] || [];
    location.province = province;
    location.city = cities.includes(location.city) ? location.city : (cities[0] || '');
    group.updatedAt = offlineNowStamp();
    refreshOfflineParticipationModal();
}

function setOfflineSessionLocationCity(index, city) {
    const group = offlineGroups[offlineParticipationGroupIdx];
    const session = ensureOfflineGroupSessions(group)[index];
    if (!session) return;
    getOfflineSessionLocation(session).city = city || '';
    group.updatedAt = offlineNowStamp();
    refreshOfflineParticipationModal();
}

function setOfflineSessionLocationAddress(index, address) {
    const group = offlineGroups[offlineParticipationGroupIdx];
    const session = ensureOfflineGroupSessions(group)[index];
    if (!session) return;
    const location = getOfflineSessionLocation(session);
    location.address = address || '';
    location.placeName = address || '';
    group.updatedAt = offlineNowStamp();
}

function addOfflineParticipationSession() {
    const group = offlineGroups[offlineParticipationGroupIdx];
    const sessions = ensureOfflineGroupSessions(group);
    const previous = sessions[sessions.length - 1] || {};
    const previousAttendanceConfig = getOfflineSessionAttendanceConfig(previous);
    sessions.forEach(session => {
        session.collapsed = true;
    });
    sessions.push({
        ...createOfflineDefaultSession(sessions.length),
        signupStart: '',
        signupEnd: '',
        startTime: '',
        endTime: '',
        duration: Math.max(Number(previous.duration) || 90, 1),
        signupReview: !!(previous.signupReview ?? false),
        attendanceMode: previousAttendanceConfig.attendanceMode,
        checkinStartOffset: previousAttendanceConfig.checkinStartOffset,
        checkinEndRule: previousAttendanceConfig.checkinEndRule,
        checkoutEnabled: previousAttendanceConfig.checkoutEnabled,
        allowWalkIn: false,
        published: previous.published !== false,
        sortOrder: sessions.length + 1,
        collapsed: false
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

function toggleOfflineSessionCollapsed(index) {
    const group = offlineGroups[offlineParticipationGroupIdx];
    const session = ensureOfflineGroupSessions(group)[index];
    if (!session) return;
    session.collapsed = !session.collapsed;
    refreshOfflineParticipationModal();
}

function copyOfflineParticipationSession(index) {
    const group = offlineGroups[offlineParticipationGroupIdx];
    const sessions = ensureOfflineGroupSessions(group);
    const source = sessions[index];
    if (!source) return;
    sessions.push({
        ...source,
        location: source?.location && typeof source.location === 'object'
            ? { ...source.location }
            : { ...offlineActivityLocation },
        name: `${source.name || formatOfflineSessionName(index)}副本`,
        signupStart: '',
        signupEnd: '',
        startTime: '',
        endTime: '',
        sortOrder: sessions.length + 1,
        published: !!source.published,
        collapsed: false
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
                <label><input id="${prefix}QuickCheckin" type="checkbox" ${quickCheckin ? 'checked' : ''}> 用户自助 <span class="offline-help-dot tooltip" data-tooltip="开启后，用户可在活动页面自行点击完成签到。该方式不校验现场凭证。">?</span></label>
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

function getOfflineSessionTimeValidationError(session, index) {
    const sessionName = session.name || formatOfflineSessionName(index);
    const signupStart = new Date(offlineSignupStart);
    const signupEnd = new Date(offlineSignupEnd);
    const startTime = new Date(session.startTime);
    const endTime = new Date(getOfflineSessionEndTimeValue(session));
    if (startTime > endTime) {
        return `${sessionName}的本场举办开始时间不能晚于本场举办结束时间`;
    }
    if (signupStart > startTime) {
        return `活动报名开始时间不能晚于${sessionName}的举办开始时间`;
    }
    if (signupEnd > endTime) {
        return `活动报名结束时间不能晚于${sessionName}的举办结束时间`;
    }
    return '';
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
    const sessions = ensureOfflineGroupSessions(group);
    const firstSession = sessions[0] || {};
    const firstAttendanceConfig = getOfflineSessionAttendanceConfig(firstSession);
    const sessionCount = sessions.length;
    const capacity = sessions.reduce((sum, session) => sum + (Number(session.capacity) || 0), 0);
    const needSignup = true;
    const selfCheckinEnabled = firstAttendanceConfig.selfCheckinEnabled;
    const attendanceMode = firstAttendanceConfig.attendanceMode;
    const checkinEnabled = true;
    const checkoutEnabled = firstAttendanceConfig.checkoutEnabled;
    const maxSignupSessions = offlineMaxSignupSessions;
    const sessionSignupRule = sessions.length > 1 ? 'multiple' : 'single';
    const checkinStartOffset = firstAttendanceConfig.checkinStartOffset;
    const checkinEndRule = firstAttendanceConfig.checkinEndRule;
    const staffScanCheckinEnabled = attendanceMode === 'code';
    const quickCheckinEnabled = selfCheckinEnabled;
    const qrCheckinEnabled = false;
    const checkoutMethod = firstAttendanceConfig.checkoutMethod;
    const checkoutSelfEnabled = checkoutEnabled && checkoutMethod === 'self';
    const checkoutStaffEnabled = checkoutEnabled && checkoutMethod === 'staffScan';
    const checkoutRefreshSeconds = Math.max(Number(group.checkoutRefreshSeconds ?? 180), 1);
    const missingNameIndex = sessions.findIndex(session => !String(session.name || '').trim());
    if (missingNameIndex >= 0) {
        alert(`请填写${formatOfflineSessionName(missingNameIndex)}的场次名称`);
        return;
    }
    if (!offlineSignupStart) {
        alert('请填写活动报名开始时间');
        return;
    }
    if (!offlineSignupEnd) {
        alert('请填写活动报名结束时间');
        return;
    }
    if (new Date(offlineSignupStart) > new Date(offlineSignupEnd)) {
        alert('活动报名开始时间不能晚于活动报名结束时间');
        return;
    }
    const missingStartIndex = sessions.findIndex(session => !session.startTime);
    if (missingStartIndex >= 0) {
        alert(`请填写${sessions[missingStartIndex].name || formatOfflineSessionName(missingStartIndex)}的本场举办开始时间`);
        return;
    }
    const missingEndIndex = sessions.findIndex(session => !getOfflineSessionEndTimeValue(session));
    if (missingEndIndex >= 0) {
        alert(`请填写${sessions[missingEndIndex].name || formatOfflineSessionName(missingEndIndex)}的场次结束时间`);
        return;
    }
    const invalidTimeIndex = sessions.findIndex((session, sessionIndex) => !!getOfflineSessionTimeValidationError(session, sessionIndex));
    if (invalidTimeIndex >= 0) {
        alert(getOfflineSessionTimeValidationError(sessions[invalidTimeIndex], invalidTimeIndex));
        return;
    }

    group.participationConfigured = true;
    group.sessionCount = sessionCount;
    group.capacity = capacity;
    group.needSignup = needSignup;
    group.signupReview = offlineSignupReview;
    group.sessionSignupRule = sessionSignupRule;
    group.maxSignupSessions = maxSignupSessions;
    group.attendanceMode = attendanceMode;
    group.checkinEnabled = checkinEnabled;
    group.checkoutEnabled = checkoutEnabled;
    group.checkinStartOffset = checkinStartOffset;
    group.checkinEndRule = checkinEndRule;
    group.staffScanCheckinEnabled = staffScanCheckinEnabled;
    group.quickCheckinEnabled = quickCheckinEnabled;
    group.qrCheckinEnabled = qrCheckinEnabled;
    group.checkoutMethod = checkoutMethod;
    group.checkoutSelfEnabled = checkoutSelfEnabled;
    group.checkoutStaffEnabled = checkoutStaffEnabled;
    group.checkoutRefreshSeconds = checkoutRefreshSeconds;
    group.updatedAt = offlineNowStamp();
    offlineAttendanceMode = attendanceMode;
    offlineSelfCheckinEnabled = selfCheckinEnabled;
    offlineCheckinStartOffset = checkinStartOffset;
    offlineCheckinEndRule = checkinEndRule;
    offlineCheckoutMethod = checkoutMethod;
    offlineSessionCount = sessionCount;
    offlineNeedSignup = needSignup;
    offlineCheckinEnabled = checkinEnabled;
    offlineCheckoutEnabled = checkoutEnabled;
    offlineParticipationFsOpen = false;
    goOfflineStep(3);
}

function setOfflineAttendanceMode(enabled) {
    setOfflineSelfCheckinEnabled(enabled);
}

function setOfflineCheckinMethod(value) {
    const method = value === 'quick' ? 'quick' : 'code';
    offlineAttendanceMode = method;
    offlineSelfCheckinEnabled = method === 'quick';
    offlineCheckoutMethod = offlineSelfCheckinEnabled ? 'self' : 'staffScan';
    offlineGroups.forEach(group => {
        if (!group) return;
        group.attendanceMode = offlineAttendanceMode;
        group.staffScanCheckinEnabled = offlineCheckinEnabled && method === 'code';
        group.quickCheckinEnabled = offlineCheckinEnabled && method === 'quick';
        group.checkoutMethod = offlineCheckoutMethod;
        group.checkoutSelfEnabled = offlineCheckoutEnabled && offlineCheckoutMethod === 'self';
        group.checkoutStaffEnabled = offlineCheckoutEnabled && offlineCheckoutMethod === 'staffScan';
    });
    goOfflineStep(3, { preserveScroll: true });
}

function setOfflineSelfCheckinEnabled(enabled) {
    setOfflineCheckinMethod(enabled ? 'quick' : 'code');
}

function setOfflineCheckoutEnabled(enabled) {
    offlineCheckoutEnabled = !!enabled;
    offlineGroups.forEach(group => {
        if (!group) return;
        group.checkoutEnabled = offlineCheckoutEnabled;
        group.checkoutMethod = offlineCheckoutMethod;
        group.checkoutSelfEnabled = offlineCheckoutEnabled && offlineCheckoutMethod === 'self';
        group.checkoutStaffEnabled = offlineCheckoutEnabled && offlineCheckoutMethod === 'staffScan';
    });
    goOfflineStep(3, { preserveScroll: true });
}

function setOfflineCheckoutMethod(value) {
    offlineCheckoutMethod = value === 'self' ? 'self' : 'staffScan';
    offlineGroups.forEach(group => {
        if (!group) return;
        group.checkoutMethod = offlineCheckoutMethod;
        group.checkoutSelfEnabled = offlineCheckoutEnabled && offlineCheckoutMethod === 'self';
        group.checkoutStaffEnabled = offlineCheckoutEnabled && offlineCheckoutMethod === 'staffScan';
    });
    goOfflineStep(3, { preserveScroll: true });
}

function setOfflineCheckinStartOffset(value) {
    offlineCheckinStartOffset = Math.max(Number(value) || 0, 0);
    offlineGroups.forEach(group => {
        if (!group) return;
        group.checkinStartOffset = offlineCheckinStartOffset;
    });
    goOfflineStep(3, { preserveScroll: true });
}

function setOfflineCheckinEndRule(value) {
    offlineCheckinEndRule = value === 'sessionStart' ? 'sessionStart' : 'sessionEnd';
    offlineGroups.forEach(group => {
        if (!group) return;
        group.checkinEndRule = offlineCheckinEndRule;
    });
    goOfflineStep(3, { preserveScroll: true });
}

function getOfflineAttendanceSummaryText() {
    const sessions = (offlineGroups || []).flatMap(group => ensureOfflineGroupSessions(group));
    if (!sessions.length) return '未配置';
    const firstConfig = getOfflineSessionAttendanceConfig(sessions[0]);
    const sameConfig = sessions.every(session => {
        const config = getOfflineSessionAttendanceConfig(session);
        return config.attendanceMode === firstConfig.attendanceMode
            && config.checkoutEnabled === firstConfig.checkoutEnabled
            && config.checkinStartOffset === firstConfig.checkinStartOffset
            && config.checkinEndRule === firstConfig.checkinEndRule;
    });
    if (!sameConfig) {
        return `共 ${sessions.length} 个场次，已按场次分别配置签到/签退规则`;
    }
    const deadlineText = firstConfig.checkinEndRule === 'sessionStart' ? '场次开始时停止签到' : '场次结束时停止签到';
    return `${getOfflineAttendanceCurrentMethodText(firstConfig.selfCheckinEnabled, firstConfig.checkoutEnabled)}；提前 ${firstConfig.checkinStartOffset} 分钟可签到；${deadlineText}`;
}

function goOfflineStep(step, options = {}) {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    offlineActivityStep = Math.min(5, Math.max(1, step));
    document.getElementById('mainContent').innerHTML = renderOfflineActivityCreate();
    if (options.preserveScroll) {
        window.scrollTo({ top: scrollY, behavior: 'auto' });
        requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: 'auto' }));
    } else {
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
    goOfflineStep(3, { preserveScroll: true });
}

function toggleOfflineCheckin(checked) {
    setOfflineCheckinEnabled(typeof checked === 'boolean' ? checked : !offlineCheckinEnabled);
}

function toggleOfflineCheckout(checked) {
    setOfflineCheckoutEnabled(typeof checked === 'boolean' ? checked : !offlineCheckoutEnabled);
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
    openModal('配置信息确认', renderOfflinePublishConfirm(), () => {
        if (!document.getElementById('offlinePublishAgreement')?.checked) {
            const tip = document.getElementById('offlinePublishAgreementTip');
            if (tip) tip.textContent = '请先阅读并同意相关协议及管理规范';
            return false;
        }
        openModal('发布成功', renderOfflinePublishSuccessModal(), () => {
            navigateTo('activity-list', { params: { activityType: 'offline', activityLabel: '活动报名' } });
        }, { hideCancel: true, confirmText: '关闭', modalClass: 'modal-lg publish-success-modal' });
        return false;
    }, {
        confirmText: '发布活动',
        cancelText: '取消',
        modalClass: 'modal-xl exam-publish-confirm-modal'
    });
    setupOfflinePublishAgreement();
}

function getOfflinePublishSuccessData() {
    const activityName = offlineActivityName || '活动报名';
    const startTime = offlineSignupStart || '';
    const endTime = offlineSignupEnd || '';
    const activityTime = startTime && endTime ? `${formatOfflineDateTimeText(startTime)} 至 ${formatOfflineDateTimeText(endTime)}` : '';

    return {
        activityName,
        activityTime,
        url: 'https://www.yuetu100.com/bexcbk'
    };
}

function renderOfflinePublishSuccessModal() {
    const data = getOfflinePublishSuccessData();
    const timeBlock = data.activityTime
        ? `<div class="publish-success-time">活动时间：${offlineEscapeHtml(data.activityTime)}</div>`
        : '';

    return `
    <div class="publish-success-shell">
        <div class="publish-success-hero">
            <div class="publish-success-title">${offlineEscapeHtml(data.activityName)}</div>
            ${timeBlock}
            <div class="publish-success-icon">!</div>
            <div class="publish-success-status">发布成功</div>
            <div class="publish-success-actions">
                <button type="button" class="btn btn-primary" onclick="navigateTo('activity-list', { params: { activityType: 'offline', activityLabel: '活动报名' } });closeModal();">进入活动列表</button>
                <button type="button" class="btn btn-outline" onclick="visitOfflinePublishedActivity()">立即访问</button>
            </div>
        </div>
        <div class="publish-success-link-card">
            <div class="publish-success-link-row">
                <strong>活动网址：</strong>
                <a href="${offlineEscapeAttr(data.url)}" target="_blank" rel="noopener noreferrer">${offlineEscapeHtml(data.url)}</a>
                <div class="publish-success-link-actions">
                    <button type="button" class="btn btn-outline btn-sm" onclick="copyOfflinePublishedActivityUrl()">复制</button>
                    <button type="button" class="btn btn-outline btn-sm" onclick="editOfflinePublishedActivityUrl()">修改网址</button>
                    <button type="button" class="btn btn-outline btn-sm" onclick="visitOfflinePublishedActivity()">访问</button>
                </div>
            </div>
            <div class="publish-success-qr-wrap">
                <div class="publish-success-qr-demo" aria-hidden="true"></div>
                <div class="publish-success-qr-text">扫一扫，马上访问</div>
                <button type="button" class="btn btn-outline publish-success-download-btn" onclick="downloadOfflinePublishQr()">下载大图</button>
            </div>
        </div>
    </div>`;
}

function copyOfflinePublishedActivityUrl() {
    const { url } = getOfflinePublishSuccessData();
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            openModal('复制成功', `<p>活动链接已复制：${offlineEscapeHtml(url)}</p>`, null, {
                hideCancel: true,
                confirmText: '知道了',
                modalClass: 'modal-md'
            });
        }).catch(() => {
            prompt('请手动复制链接：', url);
        });
        return;
    }
    prompt('请手动复制链接：', url);
}

function visitOfflinePublishedActivity() {
    const { url } = getOfflinePublishSuccessData();
    window.open(url, '_blank', 'noopener,noreferrer');
}

function editOfflinePublishedActivityUrl() {
    openModal('修改网址', '<p>演示稿中暂不支持修改活动网址。</p>', null, {
        hideCancel: true,
        confirmText: '知道了',
        modalClass: 'modal-md'
    });
}

function downloadOfflinePublishQr() {
    openModal('下载大图', '<p>演示稿中暂不支持下载二维码大图。</p>', null, {
        hideCancel: true,
        confirmText: '知道了',
        modalClass: 'modal-md'
    });
}

function setupOfflinePublishAgreement() {
    const foot = document.getElementById('modalFoot');
    const confirmBtn = document.getElementById('modalConfirm');
    if (!foot || !confirmBtn) return;

    if (!document.getElementById('offlinePublishAgreementWrap')) {
        foot.insertAdjacentHTML('afterbegin', `
            <div class="exam-publish-agreement-wrap" id="offlinePublishAgreementWrap">
                <label class="exam-publish-agreement">
                    <input type="checkbox" id="offlinePublishAgreement">
                    <span>已阅读并同意 <a href="javascript:void(0)">《阅途文遇活动发布与管理规范》</a></span>
                </label>
                <div class="exam-publish-agreement-tip" id="offlinePublishAgreementTip"></div>
            </div>
        `);
    }

    const checkbox = document.getElementById('offlinePublishAgreement');
    if (!checkbox) return;

    const sync = () => {
        const checked = checkbox.checked;
        confirmBtn.disabled = !checked;
        confirmBtn.classList.toggle('is-disabled', !checked);
        const tip = document.getElementById('offlinePublishAgreementTip');
        if (tip && checked) tip.textContent = '';
    };

    checkbox.onchange = sync;
    sync();
}

function renderOfflineConfirmRows(rows) {
    return rows.map(row => `
        <div class="exam-confirm-row">
            <div class="exam-confirm-label">${row.label}</div>
            <div class="exam-confirm-value">${row.value}</div>
        </div>
    `).join('');
}

function renderOfflineConfirmRules(rules) {
    return rules.map(rule => `
        <div class="exam-rule-item">
            <span class="exam-rule-check">✓</span>
            <div><strong>${rule.title}</strong><span>${rule.desc}</span></div>
        </div>
    `).join('');
}

function renderOfflineConfirmEditButton() {
    return '<button type="button" class="exam-confirm-edit" disabled title="暂不支持跳转修改">修改</button>';
}

function renderOfflinePublishConfirm() {
    const sections = [
        { step: 1, key: 'basic', title: '基本信息' },
        { step: 2, key: 'intro', title: '活动介绍' },
        { step: 3, key: 'settings', title: '活动设置' },
        { step: 4, key: 'appearance', title: '外观装修' },
        { step: 5, key: 'other', title: '其他设置（可选）' }
    ];
    const scopeOption = OFFLINE_ACTIVITY_SCOPE_OPTIONS.find(option => option.key === offlineActivityScope);
    const hostModeText = offlineHostModes.length ? offlineHostModes.map(mode => {
        const option = OFFLINE_HOST_MODE_OPTIONS.find(item => item.key === mode);
        return option ? option.label : mode;
    }).join('、') : '线上活动';
    const groups = offlineGroups || [];
    const firstGroup = groups[0] || {};
    const sessions = ensureOfflineGroupSessions(firstGroup);
    const firstSession = sessions[0] || {};
    const groupSummary = groups.map(group => {
        const groupSessions = ensureOfflineGroupSessions(group);
        return `<div class="confirm-group-card">
            <div class="confirm-group-head"><strong>${offlineEscapeHtml(group.name || '未命名组别')}</strong><span class="badge badge-green">${getOfflineGroupStatus(group) === 'done' ? '已配置' : '待完善'}</span><em>场次 ${groupSessions.length} 个</em></div>
            <div class="confirm-preview-grid">
                <div class="confirm-preview-card"><strong>报名表</strong><span>${group.formConfigured ? `${group.formFieldCount || 5} 个字段${group.formRealName ? ' · 实名认证' : ''}` : '待配置报名表字段'}</span><span>${group.formConfigured ? '实名信息与提交规则已配置' : '支持代报名与实名规则待确认'}</span></div>
                <div class="confirm-preview-card"><strong>场次与规则</strong><span>${getOfflineSessionSummary(group)}</span><span>${group.participationConfigured ? '名额与参与规则已配置' : '场次与名额规则待确认'}</span></div>
            </div>
        </div>`;
    }).join('');
    const signupTimeText = offlineSignupStart && offlineSignupEnd
        ? `${formatOfflineDateTimeText(offlineSignupStart)} 至 ${formatOfflineDateTimeText(offlineSignupEnd)}`
        : '请选择活动报名时间';
    const locationText = firstSession?.location
        ? `${firstSession.location.province || ''}${firstSession.location.city || ''} ${firstSession.location.address || ''}`.trim()
        : getOfflineFullLocationText(0);

    return `
    <div class="exam-confirm-shell">
        <div class="exam-confirm-note">
            <strong>请在发布前确认以下配置。</strong>
            <span>活动发布后，报名时间、场次安排、人数上限、签到签退方式等关键信息将直接影响用户报名参与，请确认无误后发布。</span>
        </div>
        <div class="exam-confirm-layout">
            <div class="exam-confirm-content">
                <section class="exam-confirm-section" id="examConfirmBasic">
                    <div class="exam-confirm-section-head">
                        <h4>基本信息</h4>
                        ${renderOfflineConfirmEditButton()}
                    </div>
                    ${renderOfflineConfirmRows([
                        { label: '活动名称', value: offlineEscapeHtml(offlineActivityName || '活动报名') },
                        { label: '活动类型', value: '<span class="badge badge-blue">活动报名</span>' },
                        { label: '活动标签', value: offlineActivityTags.length ? offlineActivityTags.map(tag => `<span class="locked-tag" style="margin-right:8px">${offlineEscapeHtml(tag)}</span>`).join('') : '未选择' },
                        { label: '单位角色', value: offlineEscapeHtml(getOfflineUnitRoleOption().label) }
                    ])}
                    <div class="confirm-chip-row"><span>${hostModeText}</span><span>${scopeOption?.label || '全国性活动'}</span><span>${offlineEscapeHtml(getOfflineUnitRoleOption().label)}</span></div>
                    <div class="confirm-preview-grid">
                        <div class="confirm-preview-card"><strong>报名时间</strong><span>${signupTimeText}</span></div>
                        <div class="confirm-preview-card"><strong>组织机构</strong>${offlineOrgUnits.map(unit => `<span>${offlineEscapeHtml(unit.type)}：${offlineEscapeHtml(unit.name || '未填写')}</span>`).join('')}</div>
                    </div>
                </section>

                <section class="exam-confirm-section" id="examConfirmIntro">
                    <div class="exam-confirm-section-head">
                        <h4>活动介绍</h4>
                        ${renderOfflineConfirmEditButton()}
                    </div>
                    <div class="confirm-rich-list">
                        <div><strong>活动背景</strong><p>已完成活动背景、发起缘由或面向人群说明配置，发布后将在活动详情页展示。</p></div>
                        <div><strong>活动对象</strong><p>${offlineEscapeHtml(offlineActivityTarget || '面向活动受众开放报名参与。')}</p></div>
                        <div><strong>活动规则</strong><p>已配置活动规则、参与须知和图文介绍内容，用户可在详情页查看活动亮点与参与说明。</p></div>
                    </div>
                </section>

                <section class="exam-confirm-section" id="examConfirmSettings">
                    <div class="exam-confirm-section-head">
                        <h4>活动设置</h4>
                        ${renderOfflineConfirmEditButton()}
                    </div>
                    ${groupSummary}
                    <div class="exam-paper-confirm-card">
                        <div class="exam-paper-confirm-title">首个场次概览 <span class="badge badge-green">${offlineEscapeHtml(firstSession.name || '场次一')}</span></div>
                        <div class="exam-paper-confirm-grid"><span>举办时间：${formatOfflineDateTimeText(firstSession.startTime || '')} 至 ${formatOfflineDateTimeText(firstSession.endTime || '')}</span><span>人数上限：${Number(firstSession.capacity) || 0} 人 <span class="locked-tag">锁定</span></span><span>报名审核：${offlineSignupReview ? '开启' : '关闭'}</span><span>单人最多参与：${Number(offlineMaxSignupSessions) || 1} 个场次</span></div>
                    </div>
                    ${renderOfflineConfirmRows([
                        { label: '活动地点', value: offlineEscapeHtml(locationText || '未配置活动地点') },
                        { label: '签到签退', value: getOfflineAttendanceSummaryText() },
                        { label: '排行榜规则', value: `报名人数排行榜，展示前 ${offlineLeaderboardDisplayLimit} 名` },
                        { label: '报名须知', value: '已配置报名须知、参与说明和注意事项' }
                    ])}
                </section>

                <section class="exam-confirm-section" id="examConfirmAppearance">
                    <div class="exam-confirm-section-head">
                        <h4>外观装修</h4>
                        ${renderOfflineConfirmEditButton()}
                    </div>
                    <div class="confirm-appearance-grid">
                        <div class="confirm-theme-card"><strong>主题色 / 背景色</strong><div><i style="background:#00527a"></i><i style="background:#6fd5e5"></i></div><span>已选择活动主题色与背景色</span></div>
                        <div class="confirm-cover-card"><strong>封面图</strong><div>文脉之光</div><span>16:9 活动封面已配置</span></div>
                    </div>
                    <div class="confirm-nav-preview">
                        <strong>导航显隐</strong>
                        <span>活动首页 <em>必选</em></span><span>排行榜：报名人数排行榜，展示前 ${offlineLeaderboardDisplayLimit} 名</span><span>活动动态：已开启</span><span>资源推荐：已开启</span>
                    </div>
                    <div class="confirm-logo-row"><strong>LOGO配置</strong><span class="confirm-logo-box">阅途文遇<small>www.yuetu100.com</small></span><em>跳转：https://www.yuetu100.com · 居左展示</em></div>
                </section>

                <section class="exam-confirm-section" id="examConfirmOther">
                    <div class="exam-confirm-section-head">
                        <h4>其他设置（可选）</h4>
                        ${renderOfflineConfirmEditButton()}
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
                        ${renderOfflineConfirmRules([
                            { title: '报名截止前可修改信息', desc: '系统默认允许用户在报名截止前修改已提交的信息；审核通过后修改将重新进入待审核。' },
                            { title: '允许取消报名', desc: '用户可在截止前取消报名并释放名额，取消后不计入可签到名单。' },
                            { title: '签到签退状态联动', desc: '报名未通过、已取消或已失效的报名记录不进入签到签退名单。' },
                            { title: '展示剩余名额', desc: '用户端详情页默认展示剩余名额，便于实时判断报名情况。' }
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

function getOfflineLocationContext(sessionIndex = null) {
    if (sessionIndex === null || sessionIndex === undefined) return offlineActivityLocation;
    const group = offlineGroups[offlineParticipationGroupIdx];
    const session = ensureOfflineGroupSessions(group)[sessionIndex];
    return session ? getOfflineSessionLocation(session) : offlineActivityLocation;
}

function getOfflineFullLocationText(sessionIndex = null) {
    const location = getOfflineLocationContext(sessionIndex);
    const province = location.province || '';
    const city = location.city || '';
    const address = location.address || '';
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
