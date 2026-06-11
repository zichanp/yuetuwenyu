/* station-activity.js - 机构分站活动列表与新建流程 */

let stationActivityStep = 1;

const STATION_ACTIVITY_STEPS = [
    [1, '关联主活动'],
    [2, '基础信息'],
    [3, '报名表单'],
    [4, '同步与审核'],
    [5, '确认发布']
];

const STATION_ACTIVITIES = [
    {
        title: '复旦大学校园作品征集活动',
        main: '2026 春季全民读书月 · 全国作品征集',
        institution: '复旦大学图书馆',
        status: '进行中',
        statusCls: 'badge-status-ongoing',
        sync: '审核后同步',
        works: 186,
        synced: 142,
        pending: 18,
        display: '校内与全国展示',
        updated: '2026-06-08 15:30:00'
    },
    {
        title: '华东政法大学法律翻译作品分站',
        main: '第十六届“华政杯”全国法律翻译大赛',
        institution: '华东政法大学图书馆',
        status: '预告中',
        statusCls: 'badge-status-upcoming',
        sync: '手动选送',
        works: 0,
        synced: 0,
        pending: 0,
        display: '仅校内展示',
        updated: '2026-06-05 11:20:00'
    },
    {
        title: '上海图书馆城市阅读分站',
        main: '2026 城市阅读季 · 全国作品征集',
        institution: '上海图书馆',
        status: '未发布',
        statusCls: 'badge-status-unpublished',
        sync: '审核后同步',
        works: 0,
        synced: 0,
        pending: 0,
        display: '校内与全国展示',
        updated: '2026-06-03 09:10:00'
    },
    {
        title: '海南大学旅居意大利读后感分站',
        main: '阅读与远方 · 全国读后感征集',
        institution: '海南大学图书馆',
        status: '已结束',
        statusCls: 'badge-status-ended',
        sync: '手动选送',
        works: 324,
        synced: 68,
        pending: 0,
        display: '校内与全国展示',
        updated: '2026-05-28 17:45:00'
    }
];

registerPage('station-activity-list', () => renderStationActivityList());

registerPage('station-activity-create', () => {
    stationActivityStep = Number(currentPageParams?.step) || 1;
    return renderStationActivityCreate();
});

function renderStationActivityList() {
    const rows = STATION_ACTIVITIES.map(item => `
        <tr>
            <td>
                <strong>${escapeHtml(item.title)}</strong>
                <div class="table-subtext">${escapeHtml(item.main)}</div>
            </td>
            <td>${escapeHtml(item.institution)}</td>
            <td><span class="badge ${item.statusCls}">${item.status}</span></td>
            <td><span class="badge badge-blue">${item.sync}</span></td>
            <td>
                <strong>${item.works}</strong>
                <div class="table-subtext">已同步 ${item.synced} · 待处理 ${item.pending}</div>
            </td>
            <td>${item.display}</td>
            <td>${formatDateTimeSecond(item.updated)}</td>
            <td>
                <span class="action-link" onclick="navigateTo('station-activity-create', { params: { mode: 'edit' } })">编辑</span>
                <span class="station-action-divider">|</span>
                <span class="action-link">作品</span>
                <span class="station-action-divider">|</span>
                <span class="action-link">数据</span>
            </td>
        </tr>
    `).join('');

    return `
    <div class="station-page">
        <section class="station-hero card">
            <div>
                <div class="station-kicker">分站活动模式</div>
                <h2>机构分站活动</h2>
                <p>全国主活动统一作品规则，各机构分站拥有独立入口、报名字段、校内审核和选送策略，作品进入统一作品库后通过活动关联控制展示。</p>
            </div>
            <button class="btn btn-primary" onclick="navigateTo('station-activity-create')">+ 新建分站活动</button>
        </section>

        <div class="station-metric-grid">
            ${stationMetricCard('18', '分站活动总数', 'blue')}
            ${stationMetricCard('12', '覆盖机构', 'green')}
            ${stationMetricCard('1,246', '分站作品', 'gold')}
            ${stationMetricCard('436', '已同步全国', 'red')}
        </div>

        <section class="card station-filter-card">
            <div class="form-row-4">
                <div class="form-group"><label>分站活动名称</label><input class="form-control" placeholder="请输入分站活动名称"></div>
                <div class="form-group"><label>全国主活动</label><select class="form-control"><option>全部主活动</option><option>2026 春季全民读书月 · 全国作品征集</option><option>第十六届“华政杯”全国法律翻译大赛</option></select></div>
                <div class="form-group"><label>所属机构</label><select class="form-control"><option>全部机构</option><option>复旦大学图书馆</option><option>上海图书馆</option><option>海南大学图书馆</option></select></div>
                <div class="form-group"><label>活动状态</label><select class="form-control"><option>全部状态</option><option>未发布</option><option>预告中</option><option>进行中</option><option>已结束</option></select></div>
            </div>
            <div class="station-filter-actions">
                <button class="btn btn-primary">查询</button>
                <button class="btn btn-ghost">重置</button>
            </div>
        </section>

        <section class="card station-table-card">
            <div class="station-section-head">
                <div>
                    <h3>分站活动列表</h3>
                    <p>基于全国主活动创建机构专属活动，投稿表单继承主活动，报名表单和同步规则可按机构配置。</p>
                </div>
                <button class="btn btn-outline">导出列表</button>
            </div>
            ${tableWrap(['分站活动', '所属机构', '状态', '作品同步', '作品数', '展示规则', '更新时间', '操作'], rows, { total: STATION_ACTIVITIES.length })}
        </section>
    </div>`;
}

function stationMetricCard(value, label, tone) {
    return `
    <div class="station-metric-card ${tone}">
        <strong>${value}</strong>
        <span>${label}</span>
    </div>`;
}

function renderStationActivityCreate() {
    const isEdit = currentPageParams?.mode === 'edit';
    return `
    <div class="station-create-page">
        <section class="card station-create-top">
            <button class="station-back-btn" onclick="goBackFromPage('station-activity-create')" title="返回">‹</button>
            <div>
                <div class="station-kicker">全国主活动 + 机构分站活动</div>
                <h2>${isEdit ? '编辑分站活动' : '新建机构分站活动'}</h2>
                <p>分站活动继承全国主活动的投稿字段，管理员只配置机构入口、校内报名信息、审核与选送规则。</p>
            </div>
            <div class="station-save-state">已保存草稿 10:10</div>
        </section>

        <div class="station-create-layout">
            <aside class="station-step-card card">
                ${STATION_ACTIVITY_STEPS.map(([num, label]) => `
                    <button class="station-step-item ${stationActivityStep === num ? 'active' : ''} ${stationActivityStep > num ? 'done' : ''}" onclick="goStationActivityStep(${num})">
                        <span>${num}</span>
                        <strong>${label}</strong>
                    </button>
                `).join('')}
            </aside>
            <main class="station-create-main">
                ${renderStationActivityStep(stationActivityStep)}
                ${renderStationCreateActions()}
            </main>
        </div>
    </div>`;
}

function renderStationActivityStep(step) {
    if (step === 1) return renderStationStepMainRelation();
    if (step === 2) return renderStationStepBasicInfo();
    if (step === 3) return renderStationStepRegistrationForm();
    if (step === 4) return renderStationStepSyncRules();
    return renderStationStepConfirm();
}

function renderStationStepMainRelation() {
    return `
    <section class="card station-form-panel">
        <div class="station-section-head">
            <div><h3>关联主活动与机构</h3><p>主活动决定统一投稿字段和全国作品库规则，机构决定分站作品归属范围。</p></div>
            <span class="badge badge-blue">必填</span>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label><span class="req">*</span> 全国主活动</label>
                <select class="form-control">
                    <option>2026 春季全民读书月 · 全国作品征集</option>
                    <option>第十六届“华政杯”全国法律翻译大赛</option>
                    <option>阅读与远方 · 全国读后感征集</option>
                </select>
            </div>
            <div class="form-group">
                <label><span class="req">*</span> 所属机构</label>
                <select class="form-control">
                    <option>复旦大学图书馆</option>
                    <option>上海图书馆</option>
                    <option>海南大学图书馆</option>
                    <option>华东政法大学图书馆</option>
                </select>
            </div>
        </div>
        <div class="station-inherit-grid">
            <div>
                <strong>投稿表单继承</strong>
                <span>作品标题、作者、作品文件、作品简介、版权声明</span>
            </div>
            <div>
                <strong>全国作品库规则</strong>
                <span>作品只存一份，通过作品活动关系进入全国与分站展示</span>
            </div>
            <div>
                <strong>机构归属规则</strong>
                <span>按分站活动来源与用户报名机构确定校内作品列表</span>
            </div>
        </div>
    </section>`;
}

function renderStationStepBasicInfo() {
    return `
    <section class="card station-form-panel">
        <div class="station-section-head">
            <div><h3>活动基础信息</h3><p>用于生成机构专属活动入口，活动时间不能超出全国主活动时间。</p></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label><span class="req">*</span> 分站活动标题</label><input class="form-control" value="复旦大学校园作品征集活动"></div>
            <div class="form-group"><label>活动状态</label><select class="form-control"><option>保存草稿</option><option>预告中</option><option>立即发布</option></select></div>
        </div>
        <div class="form-group"><label>活动介绍</label><textarea class="form-control station-textarea">面向本机构读者征集阅读作品，校内审核通过后可同步至全国作品库参与统一展示。</textarea></div>
        <div class="form-row">
            <div class="form-group"><label><span class="req">*</span> 报名时间</label><input class="form-control" value="2026-06-15 09:00:00 至 2026-07-10 23:59:59"></div>
            <div class="form-group"><label><span class="req">*</span> 投稿时间</label><input class="form-control" value="2026-06-15 09:00:00 至 2026-07-20 23:59:59"></div>
        </div>
        <div class="station-cover-uploader">
            <div class="station-cover-preview">封面</div>
            <div>
                <strong>活动封面</strong>
                <p>建议上传带有机构视觉的活动封面，用户从分站入口进入时展示。</p>
                <button class="btn btn-outline btn-sm">上传封面</button>
            </div>
        </div>
    </section>`;
}

function renderStationStepRegistrationForm() {
    return `
    <section class="card station-form-panel">
        <div class="station-section-head">
            <div><h3>报名表单</h3><p>全国必填字段会锁定，机构可新增学院、班级、学号等校内字段。</p></div>
            <button class="btn btn-outline btn-sm">+ 添加字段</button>
        </div>
        <div class="station-form-field locked">
            <div><strong>姓名</strong><span>全国必填字段，不可删除</span></div>
            <span class="badge badge-gray">锁定</span>
        </div>
        <div class="station-form-field locked">
            <div><strong>手机号</strong><span>全国必填字段，不可删除</span></div>
            <span class="badge badge-gray">锁定</span>
        </div>
        <div class="station-form-field">
            <div><strong>学院 / 部门</strong><span>单行文本 · 校内扩展字段</span></div>
            <span class="action-link">编辑</span>
        </div>
        <div class="station-form-field">
            <div><strong>班级 / 工号</strong><span>单行文本 · 校内扩展字段</span></div>
            <span class="action-link">编辑</span>
        </div>
        <div class="station-readonly-box">
            <strong>投稿表单只读继承</strong>
            <p>作品标题、作品分类、作品附件、作品简介、版权授权等字段由全国主活动统一维护，分站活动不可修改。</p>
        </div>
    </section>`;
}

function renderStationStepSyncRules() {
    return `
    <section class="card station-form-panel">
        <div class="station-section-head">
            <div><h3>作品同步、审核与展示</h3><p>第一期优先支持“校内审核通过后同步”和“手动选送到全国作品库”。</p></div>
        </div>
        <div class="station-option-grid">
            <label class="station-option-card active">
                <input type="radio" name="syncRule" checked>
                <strong>校内审核通过后同步</strong>
                <span>校内管理员审核通过后，作品自动关联至全国主活动。</span>
            </label>
            <label class="station-option-card">
                <input type="radio" name="syncRule">
                <strong>手动选送到全国作品库</strong>
                <span>校内管理员从作品列表中选择优秀作品推送全国。</span>
            </label>
        </div>
        <div class="form-row">
            <div class="form-group"><label>校内审核</label><select class="form-control"><option>需要校内审核</option><option>无需校内审核</option></select></div>
            <div class="form-group"><label>展示范围</label><select class="form-control"><option>校内与全国展示</option><option>仅校内展示</option><option>仅全国展示</option></select></div>
        </div>
        <label class="station-checkline"><input type="checkbox" checked> 创建分站后，按机构归属自动归集历史全国投稿作品</label>
        <label class="station-checkline"><input type="checkbox" checked> 全国驳回作品仅取消全国展示，保留校内作品记录</label>
    </section>`;
}

function renderStationStepConfirm() {
    return `
    <section class="card station-form-panel">
        <div class="station-section-head">
            <div><h3>确认配置</h3><p>发布后将生成机构分站入口，并按关联关系控制作品进入统一作品库。</p></div>
            <span class="badge badge-green">可发布</span>
        </div>
        <div class="station-summary-list">
            <div><span>全国主活动</span><strong>2026 春季全民读书月 · 全国作品征集</strong></div>
            <div><span>所属机构</span><strong>复旦大学图书馆</strong></div>
            <div><span>投稿表单</span><strong>继承主活动，不允许分站修改</strong></div>
            <div><span>报名表单</span><strong>全国必填字段 + 2 个校内扩展字段</strong></div>
            <div><span>作品同步</span><strong>校内审核通过后同步到全国作品库</strong></div>
            <div><span>展示规则</span><strong>校内与全国展示</strong></div>
        </div>
    </section>`;
}

function renderStationCreateActions() {
    const prev = stationActivityStep > 1
        ? `<button class="btn btn-outline" onclick="goStationActivityStep(${stationActivityStep - 1})">上一步</button>`
        : `<button class="btn btn-outline" onclick="goBackFromPage('station-activity-create')">取消</button>`;
    const next = stationActivityStep < STATION_ACTIVITY_STEPS.length
        ? `<button class="btn btn-primary" onclick="goStationActivityStep(${stationActivityStep + 1})">下一步</button>`
        : `<button class="btn btn-success" onclick="publishStationActivity()">发布分站活动</button>`;
    return `
    <div class="station-create-actions">
        <button class="btn btn-ghost">保存草稿</button>
        <div>${prev}${next}</div>
    </div>`;
}

function goStationActivityStep(step) {
    stationActivityStep = Math.max(1, Math.min(STATION_ACTIVITY_STEPS.length, step));
    document.getElementById('mainContent').innerHTML = renderStationActivityCreate();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function publishStationActivity() {
    openModal('发布成功', '<p>机构分站活动已发布。作品将进入统一作品库，并按当前同步与展示规则建立活动关联。</p>', () => navigateTo('station-activity-list'));
}
