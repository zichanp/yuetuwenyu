/* vote-activity-create.js - 投票活动创建流程 */

let voteActivityStep = 1;
let voteActivityName = '2026 城市阅读季人气作品评选';
let voteSourceType = 'manual';
let voteSubmitMode = 'batch';
let voteMustUseAll = false;
let voteNeedPhone = true;
let voteNeedUnit = false;
let voteShowRealtimeCount = false;
let voteShowRealtimeRank = 'none';
let voteResultDisplayTiming = 'after_end';
let voteResultShowCount = true;
let voteResultShowPercent = false;
let voteResultShowRank = true;
let voteLimitMode = 'activity';
let votePeriodMaxVotes = 1;
let votePerItemMaxVotes = 1;
let voteAllowCrossDayRepeat = false;
let voteConfigTab = 'candidate';
let voteAdvancedSettingsOpen = true;
let voteCandidateLayout = 'square';
let voteCandidateContentType = 'image-text';
let voteRuleVersion = 'v3';
let voteOptionSelectionMode = 'single';
let voteFrequencyMode = 'once';
let voteStep3EntryInitialized = false;
let voteEnableTotalVoteLimit = false;
let voteEnablePerItemTotalLimit = false;
let voteAdvancedLimitOpen = false;
let voteRuleV1DailyMaxVotes = 5;
let voteRuleV1TotalMaxVotes = 20;
let voteRuleV1PerItemLimit = 1;
let voteMultiSelectLimit = 2;
let voteMinSelectCount = 1;
let voteCandidateDisplayOrder = 'config';
let voteIntroMode = 'standard';
let voteIntroDevice = 'desktop';
let voteIntroMobileIndependent = false;
let voteIntroMobileInherited = false;
let voteActivityTags = ['讲座', '读书'];
let voteActivityTagDropdownOpen = false;
let voteUnitRole = 'organizer';
let voteUnitRoleDropdownOpen = false;
let voteActivityScope = 'national';
let voteActivityRegion = '';
let voteCandidateListLayout = 'horizontal';
let voteThemeColor = '#00527a';
let voteBgColor = '#6fd5e5';
let voteCountUnit = '票';
let voteButtonText = '投票';
let voteLeaderboardEnabled = true;
let voteLeaderboardDisplayLimit = 100;
let voteOrgUnits = [
    { type: '主办单位', name: '中国国际贸易学会、海南大学' },
    { type: '承办单位', name: '' },
    { type: '协办单位', name: '' },
    { type: '支持单位', name: '' }
];

const VOTE_ACTIVITY_STEPS = [
    [1, '基本信息'],
    [2, '活动介绍'],
    [3, '投票设置'],
    [4, '外观装修'],
    [5, '其他设置']
];

let voteCandidates = [
    { id: 'V001', name: '书香校园主题海报', displayType: '图文', author: '复兴小学', unit: '复兴小学', intro: '以阅读推广为主题的校园海报设计', status: '可投票', votes: 2680, cover: 'linear-gradient(135deg,#DDEBFF 0%,#F3F8FF 52%,#BFD9FF 100%)' },
    { id: 'V002', name: '城市书房摄影作品', displayType: '文字', author: '李青', unit: '江南分馆', intro: '记录城市书房中的阅读瞬间', status: '可投票', votes: 2412, cover: '' }
];

const VOTE_CANDIDATE_LAYOUT_OPTIONS = [
    { key: 'square', label: '正方形 1:1', ratio: '1:1' },
    { key: 'landscape', label: '横版 4:3', ratio: '4:3' },
    { key: 'portrait', label: '竖版 3:4', ratio: '3:4' }
];

const VOTE_CANDIDATE_CONTENT_TYPE_OPTIONS = [
    { key: 'text', label: '纯文字' },
    { key: 'image', label: '图片' },
    { key: 'image-text', label: '图文' }
];

const VOTE_CANDIDATE_COVER_OPTIONS = [
    'linear-gradient(135deg,#DDEBFF 0%,#F3F8FF 52%,#BFD9FF 100%)',
    'linear-gradient(135deg,#FFE3D1 0%,#FF9CA8 54%,#FFE39A 100%)',
    'linear-gradient(135deg,#D8F5D1 0%,#F3FFF0 52%,#9FD58E 100%)',
    'linear-gradient(135deg,#ECE7FF 0%,#F7F3FF 52%,#CDBDFF 100%)'
];

const VOTE_SOURCE_OPTIONS = [
    { key: 'manual', title: '手动配置候选项', desc: '手动新增或批量导入候选项，适合大多数投票活动' },
    { key: 'collection', title: '从征集活动获取', desc: '从审核通过的征集作品中一键带入候选项' }
];

const VOTE_UNIT_ROLE_OPTIONS = [
    { key: 'organizer', label: '我是主办单位', type: '主办单位', desc: '负责活动的总体策划与组织' },
    { key: 'executor', label: '我是承办单位', type: '承办单位', desc: '负责活动的具体执行与落地' },
    { key: 'cooperator', label: '我是协办单位', type: '协办单位', desc: '协助主办或承办单位开展活动，参与部分管理和推广工作' },
    { key: 'supporter', label: '我是支持单位', type: '支持单位', desc: '提供资源或宣传支持' },
    { key: 'other', label: '其他', type: '其他', desc: '本单位是其他角色类型' }
];

const VOTE_ACTIVITY_SCOPE_OPTIONS = [
    { key: 'national', label: '全国性活动' },
    { key: 'province', label: '省级活动' },
    { key: 'city', label: '市级活动' },
    { key: 'institution', label: '本机构活动' }
];

const VOTE_ACTIVITY_TAG_OPTIONS = ['讲座', '读书', '分享会', '培训', '展览', '沙龙', '亲子', '论坛'];
const VOTE_ACTIVITY_REGION_OPTIONS = ['北京市', '上海市', '天津市', '重庆市', '浙江省', '江苏省', '广东省', '四川省', '海南省', '杭州市', '南京市', '广州市', '成都市'];
const VOTE_THEME_COLOR_OPTIONS = ['#00527a', '#f33422', '#218d78', '#7b65d6', 'linear-gradient(135deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f)'];
const VOTE_BG_COLOR_OPTIONS = ['#6fd5e5', '#fff3ef', '#d9f7e5', '#eceeff', 'linear-gradient(135deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f)'];

registerPage('vote-activity-create', () => {
    voteActivityStep = Number(currentPageParams?.step) || 1;
    if (voteActivityStep === 3 && !voteStep3EntryInitialized) {
        voteConfigTab = 'rule';
        voteRuleVersion = 'v1';
        voteStep3EntryInitialized = true;
    } else if (voteActivityStep !== 3) {
        voteStep3EntryInitialized = false;
    }
    return renderVoteActivityCreate();
});

document.addEventListener('click', (event) => {
    if (voteActivityTagDropdownOpen && !event.target.closest('.vote-tag-dropdown')) {
        closeVoteActivityTagDropdown();
    }
    if (voteUnitRoleDropdownOpen && !event.target.closest('.vote-unit-role-select')) {
        voteUnitRoleDropdownOpen = false;
        rerenderVoteCreateStep();
    }
});

function renderVoteActivityCreate() {
    return `
    <div class="quiz-create-page vote-create-page">
        ${renderVoteCreateTopbar()}
        <div class="quiz-create-workspace vote-create-workspace">
            <div class="quiz-mobile-preview offline-mobile-preview" aria-label="活动详情页移动端预览示意"></div>
            <main class="quiz-create-main">
                ${renderVoteCreateStepper()}
                ${renderVoteStepContent(voteActivityStep)}
            </main>
        </div>
        ${renderVoteCreateActions()}
    </div>`;
}

function renderVoteCreateTopbar() {
    const isEdit = currentPageParams?.mode === 'edit';
    return `
    <header class="quiz-create-topbar">
        <button class="quiz-top-back" onclick="goBackFromPage('vote-activity-create')" title="返回">≪</button>
        <div class="quiz-top-meta">
            <div class="quiz-top-title-row">
                <strong>${voteActivityName}</strong>
                <span class="quiz-top-badge" style="background:#E6F7FF;color:#1890FF">投票</span>
                <span class="quiz-top-state">未发布</span>
                ${isEdit ? '<span class="quiz-top-state">编辑活动</span>' : ''}
            </div>
            <div class="quiz-top-save"><span>✓</span> 最新保存 10:18</div>
        </div>
    </header>`;
}

function renderVoteCreateStepper() {
    return `
    <nav class="quiz-step-nav" aria-label="创建投票活动步骤">
        ${VOTE_ACTIVITY_STEPS.map(([num, label]) => `
            <button class="quiz-step-card ${voteActivityStep === num ? 'active' : ''} ${voteActivityStep > num ? 'done' : ''}" onclick="goVoteStep(${num})">
                <span class="quiz-step-num">${num}</span>
                <span class="quiz-step-label">${label}</span>
                ${num < VOTE_ACTIVITY_STEPS.length ? '<span class="quiz-step-arrow">»</span>' : ''}
            </button>
        `).join('')}
    </nav>`;
}

function renderVoteStepContent(step) {
    switch (step) {
        case 1: return renderVoteBasicStep();
        case 2: return renderVoteIntroStep();
        case 3: return renderVoteConfigStep();
        case 4: return renderVoteAppearanceStep();
        case 5: return renderVoteOtherStep();
        default: return renderVoteConfigStep();
    }
}

function renderVoteBasicStep() {
    return `
    <section class="quiz-config-card offline-config-section">
        <div class="offline-basic-grid">
            <div class="qc-form-row span-2">
                <label><span class="req">*</span>活动名称</label>
                <input class="qc-input" maxlength="50" value="${escapeHtml(voteActivityName)}" onchange="setVoteActivityName(this.value)" placeholder="请输入活动名称，50字以内">
            </div>
            <div class="qc-form-row">
                <label>活动标签</label>
                ${renderVoteActivityTagDropdown()}
            </div>
            <div class="qc-form-row">
                <label>活动范围</label>
                ${renderVoteActivityScopeRadios()}
            </div>
            ${renderVoteActivityRegionRow()}
            <div class="qc-form-row">
                <label><span class="req">*</span>单位角色</label>
                ${renderVoteUnitRoleSelect()}
            </div>
        </div>
    </section>
    <section class="quiz-config-card offline-config-section">
        <div class="offline-basic-grid">
            <div class="qc-form-row span-2">
                <label><span class="req">*</span>投票时间</label>
                <div class="qc-field-stack">
                    <div class="offline-session-date-range offline-signup-date-range">
                        <input type="datetime-local" class="form-control" value="2026-07-01T09:00">
                        <span class="offline-session-date-separator">至</span>
                        <input type="datetime-local" class="form-control" value="2026-07-10T18:00">
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="quiz-config-card org-card offline-config-section">
        ${renderVoteOrgUnits()}
    </section>`;
}

function renderVoteIntroStep() {
    if (voteIntroMode === 'free') return renderVoteIntroFree();
    return renderVoteIntroStandard();
}

function renderVoteAppearanceStep() {
    const leaderboardRule = getVoteLeaderboardSummary();
    return `
    <section class="quiz-config-card appearance-card">
        <div class="appearance-row">
            <label>主题色</label>
            <div class="color-swatches">${VOTE_THEME_COLOR_OPTIONS.map(c => `<button class="color-swatch ${voteThemeColor === c ? 'active' : ''}" style="background:${c}" onclick="setVoteThemeColor('${c}')"></button>`).join('')}</div>
        </div>
        <div class="appearance-row">
            <label>背景色</label>
            <div class="color-swatches">${VOTE_BG_COLOR_OPTIONS.map(c => `<button class="color-swatch bg ${voteBgColor === c ? 'active' : ''}" style="background:${c}" onclick="setVoteBgColor('${c}')"></button>`).join('')}</div>
        </div>
        <div class="cover-config">
            <div><strong>封面图</strong><span>建议宽高比为 16 : 9</span></div>
            <div class="cover-preview">文脉之光</div>
            <div class="cover-actions"><button>AI帮我设计主题</button><button>自行上传新主题</button></div>
        </div>
        <div class="nav-config">
            <div class="nav-title"><strong>导航显隐</strong><span>管理活动详情页导航菜单的名称与展示</span></div>
            <div class="nav-list">
                ${[
                    { name: '活动首页', required: true, note: '' },
                    { name: '排行榜', required: false, checked: voteLeaderboardEnabled && voteResultDisplayTiming !== 'none', leaderboardRule },
                    { name: '活动动态', required: false, note: '活动发布后，可前往「活动列表-进入管理-活动动态」模块管理动态。' },
                    { name: '资源推荐', required: false, note: '活动发布后，可前往「活动列表-进入管理-资源推荐」模块管理资源。' }
                ].map(nav => `
                    <div class="nav-item">
                        <span class="drag-dot">${nav.required ? '' : '⠿'}</span>
                        <label class="switch mini nav-switch">
                            <input type="checkbox" ${(nav.checked ?? true) ? 'checked' : ''} ${nav.required ? 'disabled' : ''} ${nav.name === '排行榜' && voteResultDisplayTiming === 'none' ? 'disabled' : ''} ${nav.name === '排行榜' ? 'onchange="setVoteLeaderboardEnabled(this.checked)"' : ''}>
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
                            ${nav.leaderboardRule ? `
                            <div class="nav-current-rule">
                                <span>当前规则：</span>
                                <strong>${nav.leaderboardRule}</strong>
                                <button type="button" onclick="editVoteLeaderboardRule(event)">修改规则 &gt;</button>
                            </div>` : nav.note ? `<div class="nav-note">${nav.note}</div>` : ''}
                        </div>
                    </div>
                `).join('')}
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
                        <button class="active" type="button" title="居左"><span class="logo-align-icon align-left" aria-hidden="true"><i></i><i></i><i></i></span></button>
                        <button type="button" title="居右"><span class="logo-align-icon align-right" aria-hidden="true"><i></i><i></i><i></i></span></button>
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
                        <button class="active" type="button" title="居左"><span class="logo-align-icon align-left" aria-hidden="true"><i></i><i></i><i></i></span></button>
                        <button type="button" title="居右"><span class="logo-align-icon align-right" aria-hidden="true"><i></i><i></i><i></i></span></button>
                    </div>
                    <button class="logo-delete-btn" type="button" title="删除">⌫</button>
                </div>
            </div>
            <button class="add-logo">+添加 LOGO</button>
        </div>
    </section>`;
}

function renderVoteOtherStep() {
    return `
    <section class="quiz-config-card offline-config-section vote-display-settings-card vote-other-display-card">
        <div class="offline-config-title">
            <div>
                <h3>展示设置</h3>
            </div>
        </div>
        <div class="vote-display-settings">
            <div class="vote-display-settings-row">
                <div class="vote-display-settings-label">候选项展示布局</div>
                <div class="vote-option-mode-group vote-option-mode-group-inline vote-display-settings-control">
                    <button type="button" class="vote-option-mode-pill ${voteCandidateListLayout === 'horizontal' ? 'active' : ''}" aria-pressed="${voteCandidateListLayout === 'horizontal' ? 'true' : 'false'}" onclick="setVoteCandidateListLayout('horizontal')">
                        <span class="vote-option-mode-dot" aria-hidden="true"></span>
                        <span>单列列表</span>
                    </button>
                    <button type="button" class="vote-option-mode-pill ${voteCandidateListLayout === 'double-column' ? 'active' : ''}" aria-pressed="${voteCandidateListLayout === 'double-column' ? 'true' : 'false'}" onclick="setVoteCandidateListLayout('double-column')">
                        <span class="vote-option-mode-dot" aria-hidden="true"></span>
                        <span>双列卡片</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="vote-config-grid vote-display-copy-grid">
            <div class="qc-form-row">
                <label>票数单位</label>
                <input class="qc-input" maxlength="6" value="${escapeHtml(voteCountUnit)}" onchange="setVoteCountUnit(this.value)" placeholder="如：票">
            </div>
            <div class="qc-form-row">
                <label>投票按钮名称</label>
                <input class="qc-input" maxlength="12" value="${escapeHtml(voteButtonText)}" onchange="setVoteButtonText(this.value)" placeholder="如：投票">
            </div>
        </div>
    </section>

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
            <p>请上传群二维码图片，该二维码将在用户投票成功后弹出，引导用户扫码入群</p>
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

function renderVoteConfigStep() {
    const isCandidateTab = voteConfigTab === 'candidate';
    return `
    <section class="quiz-config-card offline-config-section vote-config-tabs-card">
        <div class="vote-config-tabs" role="tablist" aria-label="投票设置标签页">
            <button type="button" class="vote-config-tab ${!isCandidateTab ? 'active' : ''}" onclick="switchVoteConfigTab('rule')">投票规则</button>
            <button type="button" class="vote-config-tab ${isCandidateTab ? 'active' : ''}" onclick="switchVoteConfigTab('candidate')">候选项</button>
        </div>
    </section>

    ${isCandidateTab ? renderVoteCandidateConfigTab() : renderVoteRuleConfigTab()}`;
}

function renderVoteCandidateConfigTab() {
    const showImageConfig = voteCandidateContentType !== 'text';
    return `
    <section class="quiz-config-card offline-config-section">
        <div class="offline-config-title">
            <div>
                <h3>候选项配置</h3>
            </div>
        </div>

        <div class="vote-candidate-editor">
            <div class="vote-candidate-type-bar">
                <div class="vote-candidate-type-copy">
                    <strong>候选项内容类型</strong>
                </div>
                <div class="vote-candidate-type-switch qc-radios" role="radiogroup" aria-label="候选项内容类型">
                    ${VOTE_CANDIDATE_CONTENT_TYPE_OPTIONS.map(item => `
                        <label><input type="radio" name="voteCandidateContentType" value="${item.key}" ${voteCandidateContentType === item.key ? 'checked' : ''} onchange="setVoteCandidateContentType('${item.key}')"> ${item.label}</label>
                    `).join('')}
                </div>
            </div>
            ${showImageConfig ? `
            <div class="vote-candidate-style-bar">
                <div class="vote-candidate-style-copy">
                    <strong>图片比例：</strong>
                </div>
                <div class="vote-candidate-style-switch">
                    ${VOTE_CANDIDATE_LAYOUT_OPTIONS.map(item => `
                        <label class="vote-candidate-style-chip ${voteCandidateLayout === item.key ? 'active' : ''}">
                            <input type="radio" name="voteCandidateLayout" value="${item.key}" ${voteCandidateLayout === item.key ? 'checked' : ''} onchange="setVoteCandidateLayout('${item.key}')">
                            <span>${item.label}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            <div class="vote-candidate-editor-list">
                ${voteCandidates.map((item, index) => renderVoteCandidateEditorRow(item, index, voteCandidateLayout)).join('')}
            </div>
            <div class="vote-candidate-bottom-actions">
                <button type="button" class="vote-add-candidate-btn" onclick="addVoteCandidateItem()">＋ 添加选项</button>
            </div>
            <div class="vote-candidate-error">${voteCandidates.length ? '' : '投票内容不能为空！'}</div>
        </div>
    </section>`;
}

function renderVoteRuleConfigTab() {
    if (voteRuleVersion === 'v2') {
        voteRuleVersion = 'v3';
    }
    const candidateCount = voteCandidates.length;
    const ruleValidation = getVoteRuleValidation();
    const resultHidden = voteResultDisplayTiming === 'none';
    const isV1 = voteRuleVersion === 'v1';
    const isMultiple = voteOptionSelectionMode === 'multiple';
    const isV3 = voteRuleVersion === 'v3';
    const dailyQuotaLabel = isV3 ? '每日提交额度' : '每日投票额度';
    const dailyQuotaText = isV3 ? '每人每天最多提交' : '每人每天最多可投';
    const dailyQuotaHelp = isV3
        ? '当天多次提交的次数累计计算；达到每日提交额度后，当天不能继续提交。'
        : '当天多次提交的票数累计计算；达到每日额度后，当天不能继续投票。';
    const dailyQuotaUnit = isV3 ? '次' : '票';
    const selectionHelp = isV3
        ? '选择 1 个候选项，该候选项获得 1 票。'
        : '选择 1 个候选项消耗 1 票。每次最多选择数量不能超过每人每天最多投票数。';
    const v1Panel = `
        <div class="vote-rule-version-panel">
            <div class="vote-rule-v1-lines">
                <div class="vote-rule-v1-line">
                    <span class="vote-rule-v1-text">每人每天最多可投：</span>
                    <div class="vote-rule-v1-inline-control">
                        <div class="vote-rule-v1-stepper">
                            <button type="button" onclick="changeVoteRuleV1DailyMaxVotes(-1)">−</button>
                            <input type="text" inputmode="numeric" value="${voteRuleV1DailyMaxVotes}" onchange="setVoteRuleV1DailyMaxVotes(this.value)">
                            <button type="button" onclick="changeVoteRuleV1DailyMaxVotes(1)">＋</button>
                        </div>
                        <span class="vote-rule-v1-unit">票，</span>
                    </div>
                    <span class="vote-rule-v1-text">每人活动期间最多可投</span>
                    <div class="vote-rule-v1-inline-control">
                        <div class="vote-rule-v1-stepper">
                            <button type="button" onclick="changeVoteRuleV1TotalMaxVotes(-1)">−</button>
                            <input type="text" inputmode="numeric" value="${voteRuleV1TotalMaxVotes}" onchange="setVoteRuleV1TotalMaxVotes(this.value)">
                            <button type="button" onclick="changeVoteRuleV1TotalMaxVotes(1)">＋</button>
                        </div>
                        <span class="vote-rule-v1-unit">票</span>
                    </div>
                </div>
                <div class="vote-rule-v1-line">
                    <span class="vote-rule-v1-text">活动期间，每人对同一候选项最多可投</span>
                    <div class="vote-rule-v1-inline-control">
                        <div class="vote-rule-v1-stepper">
                            <button type="button" onclick="changeVoteRuleV1PerItemLimit(-1)">−</button>
                            <input type="text" inputmode="numeric" value="${voteRuleV1PerItemLimit}" onchange="setVoteRuleV1PerItemLimit(this.value)">
                            <button type="button" onclick="changeVoteRuleV1PerItemLimit(1)">＋</button>
                        </div>
                        <span class="vote-rule-v1-unit">票</span>
                    </div>
                </div>
            </div>
        </div>`;
    const multiSimplePanel = `
            <div class="vote-rule-layout">
                <div class="vote-rule-layout-row vote-rule-layout-row-inline">
                    <div class="vote-rule-layout-label">选择方式</div>
                    <div class="vote-rule-layout-content">
                        <div class="vote-rule-chipset">
                            <button type="button" class="vote-rule-radio ${voteOptionSelectionMode === 'single' ? 'active' : ''}" onclick="setVoteOptionSelectionMode('single')">
                                <span class="vote-rule-radio-dot"></span>
                                <span>单选</span>
                            </button>
                            <button type="button" class="vote-rule-radio ${voteOptionSelectionMode === 'multiple' ? 'active' : ''}" onclick="setVoteOptionSelectionMode('multiple')">
                                <span class="vote-rule-radio-dot"></span>
                                <span>多选</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="vote-rule-layout-row vote-rule-layout-row-inline">
                    <div class="vote-rule-layout-label">投票频次</div>
                    <div class="vote-rule-layout-content">
                        <div class="vote-rule-chipset">
                            <button type="button" class="vote-rule-radio ${voteFrequencyMode === 'once' ? 'active' : ''}" onclick="setVoteFrequencyMode('once')">
                                <span class="vote-rule-radio-dot"></span>
                                <span>整个活动仅投一次</span>
                            </button>
                            <button type="button" class="vote-rule-radio ${voteFrequencyMode === 'daily' ? 'active' : ''}" onclick="setVoteFrequencyMode('daily')">
                                <span class="vote-rule-radio-dot"></span>
                                <span>每天可投</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="vote-rule-layout-row vote-rule-layout-row-inline">
                    <div class="vote-rule-layout-label vote-rule-layout-label-top">每次提交 ${renderVoteConfigHelp(selectionHelp)}</div>
                    <div class="vote-rule-layout-content vote-rule-layout-card">
                        <div class="vote-rule-v2-line vote-rule-v2-line-sentence">
                            <span class="vote-rule-v2-text">每次需选择</span>
                            <div class="vote-rule-v2-inline-field">
                                <input class="vote-rule-v2-input" type="text" inputmode="numeric" value="${voteMinSelectCount}" onchange="setVoteMinSelectCount(this.value)">
                                <span class="vote-rule-v1-unit">个候选项</span>
                            </div>
                            <span class="vote-rule-v2-text">至</span>
                            <div class="vote-rule-v2-inline-field">
                                <input class="vote-rule-v2-input" type="text" inputmode="numeric" value="${voteMultiSelectLimit}" onchange="setVoteMultiSelectLimit(this.value)">
                                <span class="vote-rule-v1-unit">个候选项</span>
                            </div>
                        </div>
                        ${ruleValidation.selectionRange ? `<div class="vote-field-error vote-rule-screenshot-error vote-rule-v2-error">${ruleValidation.selectionRange}</div>` : ''}
                        ${ruleValidation.multiSelect ? `<div class="vote-field-error vote-rule-screenshot-error vote-rule-v2-error">${ruleValidation.multiSelect}</div>` : ''}
                    </div>
                </div>
                ${voteFrequencyMode === 'daily' ? `
                <div class="vote-rule-layout-row">
                    <div class="vote-rule-layout-label vote-rule-layout-label-top">${dailyQuotaLabel} ${renderVoteConfigHelp(dailyQuotaHelp)}</div>
                    <div class="vote-rule-layout-content vote-rule-layout-card">
                        <div class="vote-rule-v2-line vote-rule-v2-line-wide">
                            <span class="vote-rule-v2-text">${dailyQuotaText}</span>
                            <div class="vote-rule-v2-inline-field">
                                <input class="vote-rule-v2-input" type="text" inputmode="numeric" value="${votePeriodMaxVotes}" onchange="setVotePeriodMaxVotes(this.value)">
                                <span class="vote-rule-v1-unit">${dailyQuotaUnit}</span>
                            </div>
                            <span class="vote-rule-v2-text">每人每天对同一候选项最多可投</span>
                            <div class="vote-rule-v2-inline-field">
                                <input class="vote-rule-v2-input" type="text" inputmode="numeric" value="${votePerItemMaxVotes}" onchange="setVotePerItemMaxVotes(this.value)">
                                <span class="vote-rule-v1-unit">票</span>
                            </div>
                        </div>
                        ${ruleValidation.perItem ? `<div class="vote-field-error vote-rule-screenshot-error vote-rule-v2-error">${ruleValidation.perItem}</div>` : ''}
                        ${ruleValidation.limit ? `<div class="vote-field-error vote-rule-screenshot-error vote-rule-v2-error">${ruleValidation.limit}</div>` : ''}
                    </div>
                </div>
                <div class="vote-rule-layout-row">
                    <div class="vote-rule-layout-label vote-rule-layout-label-top">高级限制</div>
                    <div class="vote-rule-layout-content vote-rule-layout-card vote-rule-layout-card-subtle">
                        <div class="vote-rule-advanced-head">
                            <label class="switch mini vote-rule-advanced-switch">
                                <input type="checkbox" ${voteAdvancedLimitOpen ? 'checked' : ''} onchange="setVoteAdvancedLimitOpen(this.checked)">
                                <span class="sw-slider"></span>
                            </label>
                        </div>
                        ${voteAdvancedLimitOpen ? `
                        <label class="vote-rule-toggle-line">
                            <input type="checkbox" ${voteEnableTotalVoteLimit ? 'checked' : ''} onchange="setVoteEnableTotalVoteLimit(this.checked)">
                            <span>限制活动期间总票数</span>
                        </label>
                        ${voteEnableTotalVoteLimit ? `
                        <div class="vote-rule-v2-line">
                            <span class="vote-rule-v2-text">每人活动期间累计最多可投</span>
                            <div class="vote-rule-v1-inline-control">
                                <div class="vote-rule-v1-stepper">
                                    <button type="button" onclick="changeVoteRuleV1TotalMaxVotes(-1)">−</button>
                                    <input type="text" inputmode="numeric" value="${voteRuleV1TotalMaxVotes}" onchange="setVoteRuleV1TotalMaxVotes(this.value)">
                                    <button type="button" onclick="changeVoteRuleV1TotalMaxVotes(1)">＋</button>
                                </div>
                                <span class="vote-rule-v1-unit">票</span>
                            </div>
                        </div>` : ''}
                        <label class="vote-rule-toggle-line">
                            <input type="checkbox" ${voteEnablePerItemTotalLimit ? 'checked' : ''} onchange="setVoteEnablePerItemTotalLimit(this.checked)">
                            <span>限制同一候选项总票数</span>
                        </label>
                        ${voteEnablePerItemTotalLimit ? `
                        <div class="vote-rule-v2-line">
                            <span class="vote-rule-v2-text">每人活动期间对同一候选项累计最多可投</span>
                            <div class="vote-rule-v1-inline-control">
                                <div class="vote-rule-v1-stepper">
                                    <button type="button" onclick="changeVoteRuleV1PerItemLimit(-1)">−</button>
                                    <input type="text" inputmode="numeric" value="${voteRuleV1PerItemLimit}" onchange="setVoteRuleV1PerItemLimit(this.value)">
                                    <button type="button" onclick="changeVoteRuleV1PerItemLimit(1)">＋</button>
                                </div>
                                <span class="vote-rule-v1-unit">票</span>
                            </div>
                        </div>` : ''}` : ''}
                    </div>
                </div>` : ''}
            </div>
    `;
    const singlePanel = `
            <div class="vote-rule-layout vote-rule-layout-single">
                <div class="vote-rule-layout-row vote-rule-layout-row-inline">
                    <div class="vote-rule-layout-label">选择方式</div>
                    <div class="vote-rule-layout-content">
                        <div class="vote-rule-chipset">
                            <button type="button" class="vote-rule-radio ${voteOptionSelectionMode === 'single' ? 'active' : ''}" onclick="setVoteOptionSelectionMode('single')">
                                <span class="vote-rule-radio-dot"></span>
                                <span>单选</span>
                            </button>
                            <button type="button" class="vote-rule-radio ${voteOptionSelectionMode === 'multiple' ? 'active' : ''}" onclick="setVoteOptionSelectionMode('multiple')">
                                <span class="vote-rule-radio-dot"></span>
                                <span>多选</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="vote-rule-layout-row vote-rule-layout-row-inline">
                    <div class="vote-rule-layout-label">投票频次</div>
                    <div class="vote-rule-layout-content">
                        <div class="vote-rule-chipset">
                            <button type="button" class="vote-rule-radio ${voteFrequencyMode === 'once' ? 'active' : ''}" onclick="setVoteFrequencyMode('once')">
                                <span class="vote-rule-radio-dot"></span>
                                <span>整个活动仅可投一次</span>
                            </button>
                            <button type="button" class="vote-rule-radio ${voteFrequencyMode === 'daily' ? 'active' : ''}" onclick="setVoteFrequencyMode('daily')">
                                <span class="vote-rule-radio-dot"></span>
                                <span>每日可投</span>
                            </button>
                        </div>
                        ${voteFrequencyMode === 'daily' ? `
                        <div class="vote-rule-single-daily-lines">
                            <div class="vote-rule-v2-line">
                                <span class="vote-rule-v2-text">每人每天最多可投</span>
                                <span class="vote-rule-fixed-value">1</span>
                                <span class="vote-rule-v1-unit">次</span>
                            </div>
                            <div class="vote-rule-v2-line">
                                <span class="vote-rule-v2-text">每人活动期间对同一候选项累计最多可投</span>
                                <div class="vote-rule-v1-inline-control">
                                    <div class="vote-rule-v1-stepper">
                                        <button type="button" onclick="changeVoteRuleV1PerItemLimit(-1)">−</button>
                                        <input type="text" inputmode="numeric" value="${voteRuleV1PerItemLimit}" onchange="setVoteRuleV1PerItemLimit(this.value)">
                                        <button type="button" onclick="changeVoteRuleV1PerItemLimit(1)">＋</button>
                                    </div>
                                    <span class="vote-rule-v1-unit">票</span>
                                </div>
                            </div>
                            ${ruleValidation.perItem ? `<div class="vote-field-error vote-rule-screenshot-error vote-rule-v2-error">${ruleValidation.perItem}</div>` : ''}
                        </div>` : ''}
                    </div>
                </div>
            </div>`;
    const v2Panel = `
        <div class="vote-rule-screenshot-body">
            ${isMultiple ? multiSimplePanel : singlePanel}
        </div>`;
    return `
    <section class="quiz-config-card offline-config-section vote-rule-screenshot-card">
        <div class="vote-rule-screenshot-head">
            <div class="vote-rule-screenshot-titlebar">
                <h3>投票规则</h3>
                <div class="vote-rule-version-tabs">
                    <button type="button" class="vote-rule-version-tab ${voteRuleVersion === 'v1' ? 'active' : ''}" onclick="setVoteRuleVersion('v1')">版本一</button>
                    <span class="vote-rule-version-recommended tooltip" data-tooltip="为什么推荐版本二？&#10;&#10;可完整设置每次选几项、每天提交几次、是否允许重复投票及活动总票数，更符合作品评选、文化活动投票和单位推选等常见场景。&#10;&#10;相比版本一只限制“用户有多少票”，版本二还能明确“用户应该怎么投”，规则更完整，也更容易理解。">
                        <button type="button" class="vote-rule-version-tab ${voteRuleVersion === 'v3' ? 'active' : ''}" onclick="setVoteRuleVersion('v3')">版本二</button>
                        <span class="vote-rule-recommend-badge">推荐</span>
                    </span>
                </div>
            </div>
        </div>
        ${isV1 ? v1Panel : v2Panel}
    </section>

    <section class="quiz-config-card offline-config-section vote-display-settings-card">
        <div class="offline-config-title">
            <div>
                <h3>展示设置</h3>
            </div>
        </div>
        <div class="vote-display-settings">
            <div class="vote-display-settings-row">
                <div class="vote-display-settings-label">
                    候选项排序方式
                    ${renderVoteConfigHelp('设置用户端候选项的展示顺序。随机排序可减少固定位置对投票结果的影响。')}
                </div>
                <div class="vote-option-mode-group vote-option-mode-group-inline vote-display-settings-control">
                    <button type="button" class="vote-option-mode-pill ${voteCandidateDisplayOrder === 'config' ? 'active' : ''}" aria-pressed="${voteCandidateDisplayOrder === 'config' ? 'true' : 'false'}" onclick="setVoteCandidateDisplayOrder('config')">
                        <span class="vote-option-mode-dot" aria-hidden="true"></span>
                        <span>按配置顺序</span>
                    </button>
                    <button type="button" class="vote-option-mode-pill ${voteCandidateDisplayOrder === 'random' ? 'active' : ''}" aria-pressed="${voteCandidateDisplayOrder === 'random' ? 'true' : 'false'}" onclick="setVoteCandidateDisplayOrder('random')">
                        <span class="vote-option-mode-dot" aria-hidden="true"></span>
                        <span>随机排序</span>
                    </button>
                </div>
            </div>
            ${resultHidden ? '' : `
            <div class="vote-display-settings-row">
                <div class="vote-display-settings-label">
                    投票结果展示
                    ${renderVoteConfigHelp('选择用户端需要展示的投票结果信息。')}
                </div>
                <div class="qc-checks vote-display-settings-checks">
                    <label><input type="checkbox" ${voteResultShowCount ? 'checked' : ''} onchange="setVoteResultShowCount(this.checked)"> 票数</label>
                    <label><input type="checkbox" ${voteResultShowRank ? 'checked' : ''} onchange="setVoteResultShowRank(this.checked)"> 当前排名</label>
                    <label><input type="checkbox" ${voteResultShowPercent ? 'checked' : ''} onchange="setVoteResultShowPercent(this.checked)"> 得票占比</label>
                </div>
                ${ruleValidation.resultDisplay ? `<div class="vote-field-error vote-display-settings-error">${ruleValidation.resultDisplay}</div>` : ''}
            </div>`}
        </div>
    </section>

    <section class="quiz-config-card offline-config-section vote-rule-preview-card">
        <div class="offline-config-title">
            <div>
                <h3>当前规则预览</h3>
                <p>根据当前配置自动生成自然语言描述，方便快速确认规则是否符合预期。</p>
            </div>
        </div>
        ${ruleValidation.publish ? `<div class="vote-rule-alert">${ruleValidation.publish}</div>` : ''}
        <div class="vote-rule-preview-copy">
            <strong>当前投票规则</strong>
            <p>${renderVoteRulePreviewText(candidateCount)}</p>
            <div class="vote-static-rule">
                <strong>得票占比计算规则</strong>
                <span>得票占比＝该候选项获得的有效票数 ÷ 所有候选项获得的有效总票数 × 100%。</span>
            </div>
            <div class="vote-static-rule">
                <strong>排名规则</strong>
                <span>系统固定按有效票数从高到低排列；票数相同的候选项显示为并列排名。</span>
            </div>
        </div>
    </section>
    `;
}

function renderVoteCandidateEditorRow(item, index, layout) {
    const number = ['一', '二', '三', '四', '五', '六'][index] || String(index + 1);
    const canShowImage = voteCandidateContentType !== 'text';
    const hasImage = canShowImage && voteCandidateHasImage(item);
    const showImageSlot = canShowImage;
    const previewBackground = hasImage ? item.cover : VOTE_CANDIDATE_COVER_OPTIONS[0];
    return `
    <div class="vote-candidate-editor-row ${showImageSlot ? 'has-image' : 'is-text-only'}">
        <div class="vote-candidate-no">选项${number}</div>
        <div class="vote-candidate-main ${showImageSlot ? 'has-image' : 'text-only'}">
            ${showImageSlot ? `
            <div class="vote-candidate-preview-shell">
                <button type="button" class="vote-candidate-upload ${layout}" style="background:${previewBackground}" onclick="cycleVoteCandidateCover('${item.id}')" title="${hasImage ? '更换图片' : '上传图片'}">
                    <span>${hasImage ? '更换图片' : '上传图片'}</span>
                </button>
                ${hasImage ? `
                <button type="button" class="vote-candidate-image-delete" title="删除图片" aria-label="删除图片" onclick="removeVoteCandidateCover('${item.id}'); event.stopPropagation();">
                    <span class="vote-candidate-image-delete-icon" aria-hidden="true">×</span>
                </button>` : ''}
            </div>
            ` : ''}
            <label class="vote-candidate-text-wrap">
                <textarea
                    class="vote-candidate-editor-textarea"
                    maxlength="64"
                    placeholder="请输入选项内容"
                    onchange="setVoteCandidateText('${item.id}', this.value)">${escapeHtml(item.name)}</textarea>
                <em>${(item.name || '').length}/64</em>
            </label>
        </div>
        <div class="vote-candidate-actions">
            ${canShowImage ? `<button type="button" class="vote-candidate-sort vote-candidate-media-trigger" title="${hasImage ? '更换图片' : '上传图片'}" onclick="cycleVoteCandidateCover('${item.id}')">图片</button>` : ''}
            <button type="button" class="vote-candidate-remove" title="删除选项" onclick="removeVoteCandidateItem('${item.id}')">⊖</button>
            <div class="vote-candidate-reorder-actions">
                <button type="button" class="vote-candidate-sort" title="上移" onclick="moveVoteCandidate('${item.id}', ${index === 0 ? 0 : -1})">↑</button>
                <button type="button" class="vote-candidate-sort" title="下移" onclick="moveVoteCandidate('${item.id}', 1)">↓</button>
            </div>
        </div>
    </div>`;
}

function renderVoteCreateActions() {
    const isEdit = currentPageParams?.mode === 'edit';
    const showPublish = isEdit || voteActivityStep === 5;
    return `
    <div class="quiz-create-actionbar">
        <div>
            ${voteActivityStep > 1
                ? `<button class="btn btn-ghost" type="button" onclick="goVotePrevStep()">← 上一步</button>`
                : ''}
        </div>
        <button class="btn btn-gold-solid" type="button">保存</button>
        <button class="btn btn-gold-outline" type="button" onclick="openVotePreview()">预览</button>
        ${voteActivityStep < 5
            ? `<button class="btn btn-gold-outline" type="button" onclick="goVoteNextStep()">下一步</button>`
            : ''}
        ${showPublish ? '<button class="btn btn-gold-outline" type="button" onclick="openVotePublishModal()">发布活动</button>' : ''}
    </div>`;
}

function renderVoteActivityScopeRadios() {
    return `<div class="qc-radios">
        ${VOTE_ACTIVITY_SCOPE_OPTIONS.map(option => `
            <label><input type="radio" name="voteScope" value="${option.key}" ${voteActivityScope === option.key ? 'checked' : ''} onchange="setVoteActivityScope('${option.key}')"> ${option.label}</label>
        `).join('')}
    </div>`;
}

function renderVoteActivityTagDropdown() {
    const selectedHtml = voteActivityTags.length
        ? voteActivityTags.map(tag => `<span class="offline-tag-chip">${escapeHtml(tag)}</span>`).join('')
        : '<span class="offline-tag-placeholder">请选择活动标签</span>';
    return `
    <div class="activity-dropdown offline-tag-dropdown vote-tag-dropdown ${voteActivityTagDropdownOpen ? 'open' : ''}" id="voteActivityTagDropdown">
        <button type="button" class="offline-tag-trigger" onclick="toggleVoteActivityTagDropdown(event)" aria-expanded="${voteActivityTagDropdownOpen ? 'true' : 'false'}">
            <span class="offline-tag-values" id="voteActivityTagValues">${selectedHtml}</span>
            <span class="offline-tag-caret" aria-hidden="true"></span>
        </button>
        <div class="activity-dropdown-menu offline-tag-menu ${voteActivityTagDropdownOpen ? 'show' : ''}" id="voteActivityTagMenu" onclick="event.stopPropagation()">
            ${VOTE_ACTIVITY_TAG_OPTIONS.map(tag => {
                const checked = voteActivityTags.includes(tag);
                return `
                    <label class="offline-tag-option ${checked ? 'selected' : ''}" data-tag="${tag}">
                        <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleVoteActivityTag('${tag}', this.checked)">
                        <span>${tag}</span>
                    </label>`;
            }).join('')}
        </div>
    </div>`;
}

function renderVoteActivityRegionRow() {
    if (voteActivityScope === 'national') return '';
    return `
        <div class="qc-form-row activity-region-row">
            <label class="activity-region-label"><span class="req">*</span>活动地区<span class="qc-help" title="非全国性活动需选择活动开放地区">?</span></label>
            <div class="activity-region-picker">
                <select class="activity-region-select" aria-label="活动地区" onchange="setVoteActivityRegion(this.value)">
                    <option value="" ${voteActivityRegion ? '' : 'selected'}>请选择开放的省市</option>
                    ${VOTE_ACTIVITY_REGION_OPTIONS.map(region => `<option value="${region}" ${voteActivityRegion === region ? 'selected' : ''}>${region}</option>`).join('')}
                </select>
                <span class="activity-region-arrow"></span>
            </div>
        </div>`;
}

function renderVoteOrgUnits() {
    return `
    <div class="qc-org-label">组织机构</div>
    <div class="qc-org-fields">
        ${voteOrgUnits.map((unit, index) => `
            <div class="qc-org-unit">
                <div class="qc-org-title">
                    <span>${unit.type}</span>
                    <button type="button" title="编辑单位类型" onclick="renameVoteOrgUnit(${index})">✎</button>
                </div>
                <div class="qc-org-line">
                    <input value="${escapeHtml(unit.name)}" placeholder="请输入一个或多个单位名称" onchange="setVoteOrgUnitName(${index}, this.value)">
                    <button type="button" class="qc-org-delete" title="删除单位类型" aria-label="删除单位类型" onclick="deleteVoteOrgUnit(${index})"><span class="trash-icon" aria-hidden="true"></span></button>
                    <button type="button" title="拖拽排序" class="qc-org-drag">⠿</button>
                </div>
            </div>
        `).join('')}
        <button type="button" class="qc-org-add" onclick="addVoteOrgUnit()">+ 添加单位类型</button>
    </div>`;
}

function getVoteUnitRoleOption() {
    return VOTE_UNIT_ROLE_OPTIONS.find(option => option.key === voteUnitRole) || VOTE_UNIT_ROLE_OPTIONS[0];
}

function renderVoteUnitRoleSelect() {
    const selected = getVoteUnitRoleOption();
    return `
    <div class="quiz-unit-role-select vote-unit-role-select ${voteUnitRoleDropdownOpen ? 'open' : ''}">
        <button type="button" class="quiz-unit-role-trigger" onclick="toggleVoteUnitRoleDropdown(event)">
            <span>${selected ? selected.label : '选择单位角色'}</span>
            <i></i>
        </button>
        ${voteUnitRoleDropdownOpen ? `
        <div class="quiz-unit-role-menu">
            <div class="quiz-unit-role-menu-head">
                <strong>单位角色类型</strong>
                <span>请选择本单位的角色类型</span>
            </div>
            <div class="quiz-unit-role-options">
                ${VOTE_UNIT_ROLE_OPTIONS.map(option => `
                    <button type="button" class="quiz-unit-role-option ${option.key === voteUnitRole ? 'selected' : ''}" onclick="selectVoteUnitRole('${option.key}')">
                        <span>
                            <strong>${option.label}</strong>
                            <em>${option.desc}</em>
                        </span>
                        ${option.key === voteUnitRole ? '<b>✓</b>' : ''}
                    </button>
                `).join('')}
            </div>
        </div>` : ''}
    </div>`;
}

function renderVoteIntroStandard() {
    return `
    <section class="quiz-config-card intro-card offline-config-section">
        <div class="intro-standard-head">
            <h3>标准模式</h3>
            <button type="button" class="intro-mode-switch intro-mode-switch-static" onclick="switchVoteIntroMode('free')">⇅ 切换至自由编辑模式</button>
        </div>
        ${renderVoteIntroControls()}
        ${renderVoteIntroEditorBlock('活动简介', '请输入活动背景、发起缘由或面向人群说明')}
        ${renderVoteIntroEditorBlock('投票规则', '请输入投票时间、投票规则、评选说明或注意事项')}
    </section>`;
}

function renderVoteIntroFree() {
    return `
    <section class="quiz-config-card intro-card intro-free-card">
        <div class="intro-free-head">
            <h3>自由模式</h3>
            <button type="button" class="intro-mode-switch intro-mode-switch-static" onclick="switchVoteIntroMode('standard')">⇅ 切换回标准模式</button>
        </div>
        ${renderVoteIntroControls()}
        <div class="intro-free-editor">
            <div class="intro-toolbar intro-free-toolbar">
                <span>H</span><span>B</span><span><i>I</i></span><span>U</span><span>S</span><span>✎</span><span>⌁</span><span>🔗</span><span>☷</span><span>≡</span><span>“</span><span>☺</span><span>▧</span><span>▦</span><span>▶</span><span>&gt;_</span><span>↶</span><span>↷</span>
            </div>
            <div class="intro-free-editor-body" contenteditable="true" oninput="markVoteIntroDeviceEdited()">请输入活动背景、规则说明、交通指引等图文内容。</div>
        </div>
    </section>`;
}

function renderVoteIntroControls() {
    const isMobile = voteIntroDevice === 'mobile';
    const mobileStateText = voteIntroMobileIndependent ? '当前手机端为独立内容' : '当前手机端沿用电脑端内容';
    const inheritButtonText = voteIntroMobileInherited ? '重新沿用电脑端内容' : '沿用电脑端内容';
    return `
    <div class="intro-device-controls">
        <div class="intro-free-tabs">
            <button type="button" class="${voteIntroDevice === 'desktop' ? 'active' : ''}" onclick="switchVoteIntroDevice('desktop')">电脑端</button>
            <button type="button" class="${isMobile ? 'active' : ''}" onclick="switchVoteIntroDevice('mobile')">手机端</button>
        </div>
        ${isMobile ? `
            <div class="intro-free-inherit">
                <span>${mobileStateText}</span>
                <button type="button" onclick="inheritVoteDesktopIntroContent()">${inheritButtonText}</button>
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

function renderVoteIntroEditorBlock(title, placeholder) {
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

function goVoteStep(step) {
    if (step === 3 && voteActivityStep !== 3) {
        voteConfigTab = 'rule';
        voteRuleVersion = 'v1';
        voteStep3EntryInitialized = true;
    } else if (step !== 3) {
        voteStep3EntryInitialized = false;
    }
    voteActivityStep = step;
    navigateTo('vote-activity-create', { params: { ...currentPageParams, step } });
}

function goVotePrevStep() {
    if (voteActivityStep <= 1) return;
    goVoteStep(voteActivityStep - 1);
}

function goVoteNextStep() {
    if (voteActivityStep >= 5) return;
    goVoteStep(voteActivityStep + 1);
}

function rerenderVoteCreateStep() {
    navigateTo('vote-activity-create', { params: { ...currentPageParams, step: voteActivityStep }, refresh: true, fromTabSwitch: true, reuseTabKey: activeTabKey });
}

function setVoteSourceType(type) { voteSourceType = type; rerenderVoteCreateStep(); }
function setVoteCandidateLayout(layout) {
    voteCandidateLayout = VOTE_CANDIDATE_LAYOUT_OPTIONS.some(item => item.key === layout) ? layout : 'square';
    rerenderVoteCreateStep();
}
function setVoteCandidateContentType(type) {
    voteCandidateContentType = VOTE_CANDIDATE_CONTENT_TYPE_OPTIONS.some(item => item.key === type) ? type : 'image-text';
    rerenderVoteCreateStep();
}
function setVoteSubmitMode(mode) { voteSubmitMode = mode; if (mode !== 'batch') voteMustUseAll = false; rerenderVoteCreateStep(); }
function setVoteMustUseAll(flag) { voteMustUseAll = flag; rerenderVoteCreateStep(); }
function switchVoteConfigTab(tab) { voteConfigTab = tab === 'rule' ? 'rule' : 'candidate'; rerenderVoteCreateStep(); }
function toggleVoteAdvancedSettings() { voteAdvancedSettingsOpen = !voteAdvancedSettingsOpen; rerenderVoteCreateStep(); }
function toggleVoteNeedPhone(flag) { voteNeedPhone = flag; rerenderVoteCreateStep(); }
function toggleVoteNeedUnit(flag) { voteNeedUnit = flag; rerenderVoteCreateStep(); }
function setVoteShowRealtimeCount(flag) { voteShowRealtimeCount = flag; rerenderVoteCreateStep(); }
function setVoteCountHidden(flag) { voteShowRealtimeCount = !flag; rerenderVoteCreateStep(); }
function setVoteShowRealtimeRank(value) { voteShowRealtimeRank = value; rerenderVoteCreateStep(); }
function setVoteResultDisplayTiming(value) { voteResultDisplayTiming = value; rerenderVoteCreateStep(); }
function setVoteResultShowCount(flag) { voteResultShowCount = flag; rerenderVoteCreateStep(); }
function setVoteResultShowRank(flag) { voteResultShowRank = flag; rerenderVoteCreateStep(); }
function setVoteCountUnit(value) { voteCountUnit = (value || '').trim() || '票'; rerenderVoteCreateStep(); }
function setVoteButtonText(value) { voteButtonText = (value || '').trim() || '投票'; rerenderVoteCreateStep(); }
function setVoteActivityName(value) { voteActivityName = value || ''; }
function setVoteActivityScope(scope) { voteActivityScope = scope; if (scope === 'national') voteActivityRegion = ''; rerenderVoteCreateStep(); }
function setVoteActivityRegion(region) { voteActivityRegion = region || ''; }
function toggleVoteActivityTagDropdown(event) {
    event?.stopPropagation();
    voteActivityTagDropdownOpen = !voteActivityTagDropdownOpen;
    rerenderVoteCreateStep();
}
function closeVoteActivityTagDropdown() {
    if (!voteActivityTagDropdownOpen) return;
    voteActivityTagDropdownOpen = false;
    rerenderVoteCreateStep();
}
function toggleVoteActivityTag(tag, checked) {
    const selected = new Set(voteActivityTags);
    if (checked) selected.add(tag);
    else selected.delete(tag);
    voteActivityTags = VOTE_ACTIVITY_TAG_OPTIONS.filter(item => selected.has(item));
    rerenderVoteCreateStep();
}
function toggleVoteUnitRoleDropdown(event) {
    event?.stopPropagation();
    voteUnitRoleDropdownOpen = !voteUnitRoleDropdownOpen;
    rerenderVoteCreateStep();
}
function selectVoteUnitRole(role) {
    const option = VOTE_UNIT_ROLE_OPTIONS.find(item => item.key === role);
    if (!option) return;
    voteUnitRole = option.key;
    voteUnitRoleDropdownOpen = false;
    if (voteOrgUnits[0]) voteOrgUnits[0].type = option.type;
    rerenderVoteCreateStep();
}
function setVoteOrgUnitName(index, value) {
    if (!voteOrgUnits[index]) return;
    voteOrgUnits[index].name = value || '';
}
function addVoteOrgUnit() {
    const nextNo = voteOrgUnits.length + 1;
    voteOrgUnits.push({ type: `自定义单位${nextNo}`, name: '' });
    rerenderVoteCreateStep();
}
function deleteVoteOrgUnit(index) {
    if (voteOrgUnits.length <= 1) return;
    voteOrgUnits.splice(index, 1);
    rerenderVoteCreateStep();
}
function renameVoteOrgUnit(index) {
    const current = voteOrgUnits[index];
    if (!current) return;
    const nextName = window.prompt('请输入单位类型名称', current.type);
    if (!nextName || !nextName.trim()) return;
    current.type = nextName.trim();
    rerenderVoteCreateStep();
}
function switchVoteIntroMode(mode) {
    voteIntroMode = mode === 'free' ? 'free' : 'standard';
    rerenderVoteCreateStep();
}
function switchVoteIntroDevice(device) {
    voteIntroDevice = device === 'mobile' ? 'mobile' : 'desktop';
    rerenderVoteCreateStep();
}
function markVoteIntroDeviceEdited() {
    if (voteIntroDevice === 'mobile') {
        voteIntroMobileIndependent = true;
        voteIntroMobileInherited = false;
    }
}
function inheritVoteDesktopIntroContent() {
    voteIntroMobileIndependent = false;
    voteIntroMobileInherited = true;
    rerenderVoteCreateStep();
}
function setVoteThemeColor(color) { voteThemeColor = color; rerenderVoteCreateStep(); }
function setVoteBgColor(color) { voteBgColor = color; rerenderVoteCreateStep(); }
function setVoteLeaderboardEnabled(flag) { voteLeaderboardEnabled = !!flag; rerenderVoteCreateStep(); }
function editVoteLeaderboardRule(event) {
    if (event && event.stopPropagation) event.stopPropagation();
    openModal('投票活动排行榜配置', renderVoteLeaderboardRuleModalBody(), saveVoteLeaderboardRule, {
        confirmText: '确定',
        modalClass: 'modal-lg vote-leaderboard-rule-modal'
    });
}
function setVoteRuleVersion(version) {
    voteRuleVersion = ['v1', 'v3'].includes(version) ? version : 'v3';
    rerenderVoteCreateStep();
}
function setVoteFrequencyMode(mode) {
    voteFrequencyMode = mode === 'daily' ? 'daily' : 'once';
    voteLimitMode = voteFrequencyMode === 'daily' ? 'daily' : 'activity';
    if (voteFrequencyMode === 'once') {
        votePeriodMaxVotes = 1;
        votePerItemMaxVotes = 1;
        voteEnableTotalVoteLimit = false;
        voteEnablePerItemTotalLimit = false;
    }
    rerenderVoteCreateStep();
}
function setVoteEnableTotalVoteLimit(flag) {
    voteEnableTotalVoteLimit = !!flag;
    rerenderVoteCreateStep();
}
function setVoteEnablePerItemTotalLimit(flag) {
    voteEnablePerItemTotalLimit = !!flag;
    rerenderVoteCreateStep();
}
function setVoteAdvancedLimitOpen(flag) {
    voteAdvancedLimitOpen = !!flag;
    rerenderVoteCreateStep();
}
function setVoteRuleV1DailyMaxVotes(value) {
    const nextValue = Number.parseInt(value, 10);
    voteRuleV1DailyMaxVotes = Number.isFinite(nextValue) ? Math.min(Math.max(nextValue, 1), 999) : 1;
    if (voteRuleV1DailyMaxVotes > voteRuleV1TotalMaxVotes) voteRuleV1TotalMaxVotes = voteRuleV1DailyMaxVotes;
    if (voteRuleV1PerItemLimit > voteRuleV1TotalMaxVotes) voteRuleV1PerItemLimit = voteRuleV1TotalMaxVotes;
    rerenderVoteCreateStep();
}
function changeVoteRuleV1DailyMaxVotes(delta) {
    setVoteRuleV1DailyMaxVotes(voteRuleV1DailyMaxVotes + delta);
}
function setVoteRuleV1TotalMaxVotes(value) {
    const nextValue = Number.parseInt(value, 10);
    voteRuleV1TotalMaxVotes = Number.isFinite(nextValue) ? Math.min(Math.max(nextValue, voteRuleV1DailyMaxVotes), 999) : voteRuleV1DailyMaxVotes;
    if (voteRuleV1PerItemLimit > voteRuleV1TotalMaxVotes) voteRuleV1PerItemLimit = voteRuleV1TotalMaxVotes;
    rerenderVoteCreateStep();
}
function changeVoteRuleV1TotalMaxVotes(delta) {
    setVoteRuleV1TotalMaxVotes(voteRuleV1TotalMaxVotes + delta);
}
function setVoteRuleV1PerItemLimit(value) {
    const nextValue = Number.parseInt(value, 10);
    voteRuleV1PerItemLimit = Number.isFinite(nextValue) ? Math.min(Math.max(nextValue, 1), voteRuleV1TotalMaxVotes) : 1;
    rerenderVoteCreateStep();
}
function changeVoteRuleV1PerItemLimit(delta) {
    setVoteRuleV1PerItemLimit(voteRuleV1PerItemLimit + delta);
}
function setVoteRuleV1AllowRepeat(flag) {
    rerenderVoteCreateStep();
}
function setVoteLimitMode(mode) {
    voteLimitMode = mode === 'daily' ? 'daily' : 'activity';
    if (voteOptionSelectionMode === 'single') {
        votePeriodMaxVotes = 1;
        votePerItemMaxVotes = 1;
    }
    rerenderVoteCreateStep();
}
function setVotePeriodMaxVotes(value) {
    const nextValue = Number.parseInt(value, 10);
    votePeriodMaxVotes = Number.isFinite(nextValue) ? Math.min(Math.max(nextValue, 1), 999) : 1;
    rerenderVoteCreateStep();
}
function changeVotePeriodMaxVotes(delta) { setVotePeriodMaxVotes(votePeriodMaxVotes + delta); }
function setVotePerItemMaxVotes(value) {
    const nextValue = Number.parseInt(value, 10);
    votePerItemMaxVotes = Number.isFinite(nextValue) ? Math.min(Math.max(nextValue, 1), 999) : 1;
    rerenderVoteCreateStep();
}
function changeVotePerItemMaxVotes(delta) { setVotePerItemMaxVotes(votePerItemMaxVotes + delta); }
function setVoteAllowCrossDayRepeat(flag) { voteAllowCrossDayRepeat = !!flag; rerenderVoteCreateStep(); }
function setVoteSingleDailyMode(flag) {
    voteLimitMode = flag ? 'daily' : 'activity';
    rerenderVoteCreateStep();
}

function addVoteCandidateItem() {
    voteCandidates.push({
        id: getNextVoteCandidateId(),
        name: '',
        displayType: '文字',
        author: '',
        unit: '',
        intro: '',
        status: '可投票',
        votes: 0,
        cover: ''
    });
    rerenderVoteCreateStep();
}

function cycleVoteCandidateCover(candidateId) {
    const candidate = getVoteCandidateById(candidateId);
    if (!candidate) return;
    const currentIndex = VOTE_CANDIDATE_COVER_OPTIONS.indexOf(candidate.cover);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % VOTE_CANDIDATE_COVER_OPTIONS.length : 0;
    candidate.cover = VOTE_CANDIDATE_COVER_OPTIONS[nextIndex];
    candidate.displayType = '图文';
    rerenderVoteCreateStep();
}

function removeVoteCandidateCover(candidateId) {
    const candidate = getVoteCandidateById(candidateId);
    if (!candidate) return;
    candidate.cover = '';
    rerenderVoteCreateStep();
}

function removeVoteCandidateItem(candidateId) {
    if (voteCandidates.length <= 1) return;
    voteCandidates = voteCandidates.filter(item => item.id !== candidateId);
    rerenderVoteCreateStep();
}

function setVoteCandidateText(candidateId, value) {
    const candidate = getVoteCandidateById(candidateId);
    if (!candidate) return;
    candidate.name = (value || '').slice(0, 200);
}

function renumberVoteCandidates() {
    voteCandidates = voteCandidates.map((item, index) => ({ ...item, id: `V${String(index + 1).padStart(3, '0')}` }));
    rerenderVoteCreateStep();
}

function moveVoteCandidate(candidateId, direction) {
    const index = voteCandidates.findIndex(item => item.id === candidateId);
    if (index < 0) return;
    const nextIndex = direction < 0 ? Math.max(index - 1, 0) : Math.min(index + 1, voteCandidates.length - 1);
    if (nextIndex === index) return;
    const list = [...voteCandidates];
    const [current] = list.splice(index, 1);
    list.splice(nextIndex, 0, current);
    voteCandidates = list;
    rerenderVoteCreateStep();
}

function setVoteOptionSelectionMode(mode) {
    voteOptionSelectionMode = mode === 'single' ? 'single' : 'multiple';
    voteMinSelectCount = 1;
    if (voteOptionSelectionMode === 'single') {
        voteMultiSelectLimit = 2;
        votePeriodMaxVotes = 1;
        votePerItemMaxVotes = 1;
    }
    if (voteOptionSelectionMode === 'multiple' && voteFrequencyMode === 'once') {
        votePeriodMaxVotes = 1;
        votePerItemMaxVotes = 1;
    }
    rerenderVoteCreateStep();
}

function setVoteMultiSelectLimit(value) {
    const nextValue = Number.parseInt(value, 10);
    voteMultiSelectLimit = Number.isFinite(nextValue) ? Math.min(Math.max(nextValue, 0), 99) : 0;
    rerenderVoteCreateStep();
}

function changeVoteMultiSelectLimit(delta) {
    setVoteMultiSelectLimit(voteMultiSelectLimit + delta);
}

function setVoteMinSelectCount(value) {
    const nextValue = Number.parseInt(value, 10);
    voteMinSelectCount = Number.isFinite(nextValue) ? Math.min(Math.max(nextValue, 1), 99) : 1;
    rerenderVoteCreateStep();
}

function changeVoteMinSelectCount(delta) {
    setVoteMinSelectCount(voteMinSelectCount + delta);
}

function setVoteCandidateDisplayOrder(value) {
    voteCandidateDisplayOrder = value === 'config' ? 'config' : 'random';
    rerenderVoteCreateStep();
}

function setVoteCandidateListLayout(value) {
    voteCandidateListLayout = value === 'double-column' ? 'double-column' : 'horizontal';
    rerenderVoteCreateStep();
}

function getVoteCandidateById(id) {
    return voteCandidates.find(item => item.id === id) || null;
}

function voteCandidateHasImage(candidate) {
    return Boolean(candidate?.cover);
}

function getVoteCandidateLayoutMeta(layout) {
    return VOTE_CANDIDATE_LAYOUT_OPTIONS.find(item => item.key === layout) || VOTE_CANDIDATE_LAYOUT_OPTIONS[0];
}

function getNextVoteCandidateId() {
    const maxNo = voteCandidates.reduce((max, item) => {
        const matched = String(item.id).match(/^V(\d+)$/);
        if (!matched) return max;
        return Math.max(max, Number(matched[1]));
    }, 0);
    return `V${String(maxNo + 1).padStart(3, '0')}`;
}

function setVoteResultShowPercent(flag) {
    voteResultShowPercent = !!flag;
    rerenderVoteCreateStep();
}

function getVoteResultTimingDescription() {
    if (voteResultDisplayTiming === 'realtime') return '用户在投票期间即可查看当前投票结果。';
    if (voteResultDisplayTiming === 'after_vote') return '用户完成首次投票后，可以查看当前投票结果。';
    if (voteResultDisplayTiming === 'none') return '用户端不展示投票结果，仅管理员可在管理后台查看。';
    return '投票期间不公开结果，投票结束后自动展示。';
}

function getVoteRuleValidation() {
    const errors = { multiSelect: '', limit: '', perItem: '', selectionRange: '', resultDisplay: '', publish: '' };
    if (voteRuleVersion === 'v1' && voteRuleV1DailyMaxVotes > voteRuleV1TotalMaxVotes) {
        errors.limit = '每人每天最多可投票数不能超过活动期间最多可投票总数。';
    } else if (voteRuleVersion === 'v1' && voteRuleV1PerItemLimit > voteRuleV1TotalMaxVotes) {
        errors.perItem = '活动期间，每人对同一候选项最多可投票数不能超过活动期间最多可投票总数。';
    }
    if (voteRuleVersion !== 'v3' && voteFrequencyMode === 'daily' && voteOptionSelectionMode === 'multiple' && votePerItemMaxVotes > votePeriodMaxVotes) {
        errors.perItem = '每人对单项最多可投次数不能超过每个投票周期内可参与投票的总次数。';
    }
    if (voteOptionSelectionMode === 'multiple') {
        if (voteFrequencyMode === 'once' && (voteMultiSelectLimit < 1 || voteMultiSelectLimit > voteCandidates.length)) {
            errors.multiSelect = '当前候选项数量不足，请调整最多可选择数量或增加候选项。';
        }
        if (voteMinSelectCount < 1) {
            errors.selectionRange = '每次投票最少选择项数不能小于 1。';
        } else if (voteMultiSelectLimit > 0 && voteMinSelectCount > voteMultiSelectLimit) {
            errors.selectionRange = '每次投票最少选择项数不能大于每次最多选择项数。';
        } else if (voteRuleVersion !== 'v3' && voteFrequencyMode === 'daily' && voteMultiSelectLimit > votePeriodMaxVotes) {
            errors.selectionRange = '每次最多选择数量不能超过每人每天最多投票数。';
        }
        if (voteRuleVersion !== 'v3' && voteFrequencyMode === 'daily' && voteEnableTotalVoteLimit && voteRuleV1TotalMaxVotes < votePeriodMaxVotes) {
            errors.limit = '每人活动期间累计投票数不能小于每人每天最多投票数。';
        }
        if (voteFrequencyMode === 'daily' && voteEnablePerItemTotalLimit && voteEnableTotalVoteLimit && voteRuleV1PerItemLimit > voteRuleV1TotalMaxVotes) {
            errors.perItem = '每人对同一候选项的累计投票上限，不能超过每人活动累计投票数。';
        }
    }
    if (voteResultDisplayTiming !== 'none' && !voteResultShowCount && !voteResultShowPercent && !voteResultShowRank) {
        errors.resultDisplay = '请至少选择一项投票结果展示内容。';
    }
    errors.publish = errors.multiSelect || errors.limit || errors.perItem || errors.selectionRange || errors.resultDisplay;
    return errors;
}

function renderVoteRulePreviewText(candidateCount) {
    if (voteRuleVersion === 'v1') {
        const cycleText = `每人每天最多可投 ${voteRuleV1DailyMaxVotes} 票，每人活动期间最多可投 ${voteRuleV1TotalMaxVotes} 票，`;
        const repeatText = voteRuleV1PerItemLimit > 1
            ? `活动期间，每人对同一候选项最多可投 ${voteRuleV1PerItemLimit} 票。`
            : '活动期间，每人对同一候选项最多可投 1 票，不可重复投票。';
        const orderText = voteCandidateDisplayOrder === 'random'
            ? '候选项进入页面后随机排序展示。'
            : '候选项按管理员配置顺序展示。';
        const layoutText = voteCandidateListLayout === 'double-column'
            ? '候选项列表按双列排列展示。'
            : '候选项列表按横向排列展示。';
        const resultItems = [];
        if (voteResultShowCount) resultItems.push('票数');
        if (voteResultShowPercent) resultItems.push('得票占比');
        if (voteResultShowRank) resultItems.push('当前排名');
        const resultText = voteResultDisplayTiming === 'none'
            ? '投票结果不向用户公开。'
            : `投票结果${voteResultDisplayTiming === 'realtime' ? '将在投票期间实时展示' : voteResultDisplayTiming === 'after_vote' ? '将在用户投票后展示' : '将在活动结束后展示'}，用户可查看${resultItems.join('、')}。`;
        return `${cycleText}${repeatText}${orderText}${layoutText}${resultText}`;
    }
    const voteModeText = voteOptionSelectionMode === 'single'
        ? '本活动采用单选投票。'
        : '本活动采用多选投票。';
    const frequencyText = voteFrequencyMode === 'once'
        ? '投票频次为整个活动仅投一次。'
        : '投票频次为每天可投。';
    const orderText = voteCandidateDisplayOrder === 'random'
        ? '候选项进入页面后随机排序展示。'
        : '候选项按管理员配置顺序展示。';
    const layoutText = voteCandidateListLayout === 'double-column'
        ? '候选项列表按双列排列展示。'
        : '候选项列表按横向排列展示。';
    const ruleText = voteFrequencyMode === 'once'
        ? (voteOptionSelectionMode === 'single'
            ? '单选模式下无需额外配置。'
            : `整个活动仅投一次，每次需选择 ${voteMinSelectCount} 至 ${voteMultiSelectLimit} 个候选项。`)
        : (voteOptionSelectionMode === 'single'
            ? `${voteRuleVersion === 'v3' ? '每人每天最多提交' : '每人每天最多可投'} 1 次；每人活动期间对同一候选项累计最多可投 ${voteRuleV1PerItemLimit} 票。`
            : `每次需选择 ${voteMinSelectCount} 至 ${voteMultiSelectLimit} 个候选项；${voteRuleVersion === 'v3' ? '每人每天最多提交' : '每人每天最多可投'} ${votePeriodMaxVotes} ${voteRuleVersion === 'v3' ? '次' : '票'}，同一候选项每天最多可投 ${votePerItemMaxVotes} 票${voteEnableTotalVoteLimit ? `；每人活动期间累计最多可投 ${voteRuleV1TotalMaxVotes} 票` : ''}${voteEnablePerItemTotalLimit ? `；每人活动期间对同一候选项累计最多可投 ${voteRuleV1PerItemLimit} 票` : ''}。`);
    const resultItems = [];
    if (voteResultShowCount) resultItems.push('票数');
    if (voteResultShowPercent) resultItems.push('得票占比');
    if (voteResultShowRank) resultItems.push('当前排名');
    const resultText = voteResultDisplayTiming === 'none'
        ? '投票结果不向用户公开。'
        : `投票结果${voteResultDisplayTiming === 'realtime' ? '将在投票期间实时展示' : voteResultDisplayTiming === 'after_vote' ? '将在用户投票后展示' : '将在活动结束后展示'}，用户可查看${resultItems.join('、')}。`;
    const candidateHint = voteOptionSelectionMode === 'multiple' && voteFrequencyMode === 'once' && voteMultiSelectLimit > candidateCount
        ? '当前候选项数量少于每次最多可选项数，请先补充候选项。'
        : '';
    return `${voteModeText}${voteOptionSelectionMode === 'multiple' ? frequencyText : ''}${ruleText}${orderText}${layoutText}${resultText}${candidateHint}`;
}

function renderVoteConfigHelp(text) {
    return `<span class="offline-help-dot tooltip vote-config-help" data-tooltip="${escapeHtml(text)}">?</span>`;
}

function getVoteLeaderboardSummary() {
    if (voteResultDisplayTiming === 'none') {
        return '投票结果不公开，用户端不展示排行榜';
    }
    if (!voteLeaderboardEnabled) {
        return '已关闭排行榜入口';
    }
    return `候选项票数排行榜，展示前 ${voteLeaderboardDisplayLimit} 名`;
}

function renderVoteLeaderboardRuleModalBody() {
    const limitOptions = [10, 20, 50, 100];
    return `
        <div class="vote-leaderboard-rule-subtitle">投票活动当前支持候选项票数排行榜</div>
        <div class="vote-leaderboard-rule-card">
            <div class="vote-leaderboard-rule-option">
                <span class="vote-leaderboard-rule-check">候选项票数排行榜</span>
            </div>
            <div class="vote-leaderboard-rule-row">
                <label>展示前</label>
                <select class="form-control vote-leaderboard-limit-select" id="voteLeaderboardDisplayLimit">
                    ${limitOptions.map(limit => `<option value="${limit}" ${voteLeaderboardDisplayLimit === limit ? 'selected' : ''}>${limit}</option>`).join('')}
                </select>
                <span>名</span>
            </div>
        </div>
        <div class="vote-leaderboard-rule-preview">
            <div class="vote-leaderboard-rule-preview-title">用户端排行榜字段</div>
            <div class="vote-leaderboard-field-group">
                <strong>候选项票数排行榜</strong>
                <div class="vote-leaderboard-field-list"><span>排名</span><span>候选项</span><span>票数</span></div>
            </div>
            <div class="vote-leaderboard-sort-rule"><strong>排序规则：</strong>按候选项有效票数从高到低排序；票数相同显示为并列排名。</div>
        </div>`;
}

function saveVoteLeaderboardRule() {
    const select = document.getElementById('voteLeaderboardDisplayLimit');
    voteLeaderboardDisplayLimit = Number(select?.value) || 100;
    rerenderVoteCreateStep();
}

function openVotePreview() {
    openModal('投票活动预览', `
        <div class="vote-publish-modal">
            <p>这里展示投票活动用户端预览示意（Demo）。</p>
        </div>
    `, () => {
        closeModal();
    }, { confirmText: '关闭' });
}

function openVotePublishModal() {
    openModal('配置信息确认', renderVotePublishConfirm(), () => {
        if (!document.getElementById('votePublishAgreement')?.checked) {
            const tip = document.getElementById('votePublishAgreementTip');
            if (tip) tip.textContent = '请先阅读并同意相关协议及管理规范';
            return false;
        }
        currentManageActivity.name = voteActivityName;
        currentManageActivity.type = '投票';
        currentManageActivity.status = '未开始';
        currentManageActivity.time = '2026-07-01 09:00:00 至 2026-07-10 18:00:00';
        openModal('发布成功', renderVotePublishSuccessModal(), () => {
            navigateTo('vote-activity-list', { params: { activityType: 'vote', activityLabel: '投票', module: '活动列表' } });
        }, { hideCancel: true, confirmText: '关闭', modalClass: 'modal-lg publish-success-modal' });
        return false;
    }, {
        confirmText: '发布活动',
        cancelText: '取消',
        modalClass: 'modal-xl exam-publish-confirm-modal'
    });
    setupVotePublishAgreement();
}

function renderVotePublishConfirm() {
    const candidateType = VOTE_CANDIDATE_CONTENT_TYPE_OPTIONS.find(item => item.key === voteCandidateContentType)?.label || '图文';
    const orgSummary = voteOrgUnits
        .filter(unit => unit.name)
        .map(unit => `${escapeHtml(unit.type)}：${escapeHtml(unit.name)}`)
        .join('<br>') || '未填写';
    const resultDisplayItems = [];
    if (voteResultShowCount) resultDisplayItems.push('票数');
    if (voteResultShowRank) resultDisplayItems.push('当前排名');
    if (voteResultShowPercent) resultDisplayItems.push('得票占比');

    return `
    <div class="exam-confirm-shell">
        <div class="exam-confirm-note">
            <strong>请在发布前确认以下配置。</strong>
            <span>活动发布后，候选项、投票规则、结果展示和排行榜配置将直接影响用户投票体验，请确认无误后发布。</span>
        </div>
        <div class="exam-confirm-layout vote-publish-confirm-layout">
            <div class="exam-confirm-content">
                <section class="exam-confirm-section" id="examConfirmBasic">
                    <div class="exam-confirm-section-head">
                        <h4>基本信息</h4>
                        <button type="button" class="exam-confirm-edit" disabled title="暂不支持跳转修改">修改</button>
                    </div>
                    ${renderVoteConfirmRows([
                        { label: '活动名称', value: escapeHtml(voteActivityName || '投票活动') },
                        { label: '活动类型', value: '<span class="badge badge-blue">投票</span>' },
                        { label: '活动标签', value: voteActivityTags.length ? voteActivityTags.map(tag => `<span class="locked-tag">${escapeHtml(tag)}</span>`).join('') : '未选择' },
                        { label: '组织机构', value: orgSummary }
                    ])}
                </section>
                <section class="exam-confirm-section" id="examConfirmSettings">
                    <div class="exam-confirm-section-head">
                        <h4>投票设置</h4>
                        <button type="button" class="exam-confirm-edit" disabled title="暂不支持跳转修改">修改</button>
                    </div>
                    <div class="confirm-preview-grid">
                        <div class="confirm-preview-card"><strong>候选项配置</strong><span>${candidateType} · ${voteCandidates.length} 个候选项</span><span>展示排序：${voteCandidateDisplayOrder === 'random' ? '随机排序' : '按配置顺序'}</span></div>
                        <div class="confirm-preview-card"><strong>投票规则</strong><span>${renderVoteRulePreviewText(voteCandidates.length)}</span></div>
                    </div>
                </section>
                <section class="exam-confirm-section" id="examConfirmAppearance">
                    <div class="exam-confirm-section-head">
                        <h4>外观与展示</h4>
                        <button type="button" class="exam-confirm-edit" disabled title="暂不支持跳转修改">修改</button>
                    </div>
                    <div class="confirm-preview-grid">
                        <div class="confirm-preview-card"><strong>投票展示文案</strong><span>票数单位：${escapeHtml(voteCountUnit || '票')}</span><span>投票按钮：${escapeHtml(voteButtonText || '投票')}</span></div>
                        <div class="confirm-preview-card"><strong>结果与排行榜</strong><span>结果展示：${voteResultDisplayTiming === 'none' ? '不公开' : resultDisplayItems.join('、') || '未选择'}</span><span>排行榜：${escapeHtml(getVoteLeaderboardSummary())}</span></div>
                    </div>
                </section>
            </div>
            <aside class="exam-confirm-side">
                <strong>确认清单</strong>
                <a href="#examConfirmBasic">基本信息</a>
                <a href="#examConfirmSettings">投票设置</a>
                <a href="#examConfirmAppearance">外观与展示</a>
            </aside>
        </div>
    </div>`;
}

function renderVoteConfirmRows(rows) {
    return rows.map(row => `
        <div class="exam-confirm-row">
            <div class="exam-confirm-label">${row.label}</div>
            <div class="exam-confirm-value">${row.value}</div>
        </div>
    `).join('');
}

function setupVotePublishAgreement() {
    const foot = document.getElementById('modalFoot');
    const confirmBtn = document.getElementById('modalConfirm');
    if (!foot || !confirmBtn) return;
    if (!document.getElementById('votePublishAgreementWrap')) {
        foot.insertAdjacentHTML('afterbegin', `
            <div class="exam-publish-agreement-wrap" id="votePublishAgreementWrap">
                <label class="exam-publish-agreement">
                    <input type="checkbox" id="votePublishAgreement">
                    <span>已阅读并同意 <a href="javascript:void(0)">《阅途文遇活动发布与管理规范》</a></span>
                </label>
                <div class="exam-publish-agreement-tip" id="votePublishAgreementTip"></div>
            </div>
        `);
    }
    const checkbox = document.getElementById('votePublishAgreement');
    if (!checkbox) return;
    checkbox.addEventListener('change', () => {
        const tip = document.getElementById('votePublishAgreementTip');
        if (tip) tip.textContent = '';
    });
}

function getVotePublishSuccessData() {
    return {
        activityName: voteActivityName || '投票活动',
        activityTime: '2026-07-01 09:00 至 2026-07-10 18:00',
        url: 'https://www.yuetu100.com/vote-demo'
    };
}

function renderVotePublishSuccessModal() {
    const data = getVotePublishSuccessData();
    return `
    <div class="publish-success-shell">
        <div class="publish-success-hero">
            <div class="publish-success-title">${escapeHtml(data.activityName)}</div>
            <div class="publish-success-time">活动时间：${escapeHtml(data.activityTime)}</div>
            <div class="publish-success-icon">!</div>
            <div class="publish-success-status">发布成功</div>
            <div class="publish-success-actions">
                <button type="button" class="btn btn-primary" onclick="navigateTo('vote-activity-list', { params: { activityType: 'vote', activityLabel: '投票', module: '活动列表' } });closeModal();">进入活动列表</button>
                <button type="button" class="btn btn-outline" onclick="visitVotePublishedActivity()">立即访问</button>
            </div>
        </div>
        <div class="publish-success-link-card">
            <div class="publish-success-link-row">
                <strong>活动网址：</strong>
                <a href="${escapeHtml(data.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(data.url)}</a>
                <div class="publish-success-link-actions">
                    <button type="button" class="btn btn-outline btn-sm" onclick="copyVotePublishedActivityUrl()">复制</button>
                    <button type="button" class="btn btn-outline btn-sm" onclick="editVotePublishedActivityUrl()">修改网址</button>
                    <button type="button" class="btn btn-outline btn-sm" onclick="visitVotePublishedActivity()">访问</button>
                </div>
            </div>
            <div class="publish-success-qr-wrap">
                <div class="publish-success-qr-demo" aria-hidden="true"></div>
                <div class="publish-success-qr-text">扫一扫，马上访问</div>
                <button type="button" class="btn btn-outline publish-success-download-btn" onclick="downloadVotePublishQr()">下载大图</button>
            </div>
        </div>
    </div>`;
}

function copyVotePublishedActivityUrl() {
    const { url } = getVotePublishSuccessData();
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            openModal('复制成功', `<p>活动链接已复制：${escapeHtml(url)}</p>`, null, {
                hideCancel: true,
                confirmText: '知道了',
                modalClass: 'modal-md'
            });
        }).catch(() => {
            openModal('复制链接', `<p>请手动复制活动链接：</p><p><strong>${escapeHtml(url)}</strong></p>`, null, {
                hideCancel: true,
                confirmText: '知道了',
                modalClass: 'modal-md'
            });
        });
    } else {
        openModal('复制链接', `<p>请手动复制活动链接：</p><p><strong>${escapeHtml(url)}</strong></p>`, null, {
            hideCancel: true,
            confirmText: '知道了',
            modalClass: 'modal-md'
        });
    }
}

function visitVotePublishedActivity() {
    window.open(getVotePublishSuccessData().url, '_blank', 'noopener,noreferrer');
}

function editVotePublishedActivityUrl() {
    openModal('修改网址', '<p>演示稿中暂不支持修改活动网址。</p>', null, {
        hideCancel: true,
        confirmText: '知道了',
        modalClass: 'modal-md'
    });
}

function downloadVotePublishQr() {
    openModal('下载大图', '<p>演示稿中暂不支持下载二维码大图。</p>', null, {
        hideCancel: true,
        confirmText: '知道了',
        modalClass: 'modal-md'
    });
}
