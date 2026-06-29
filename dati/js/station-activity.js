/* station-activity.js - 老作品导入平台数据迁移工具 */

let legacyImportStep = 1;
let selectedLegacyActivityId = 'legacy-2025-reading';
let selectedTargetActivityId = 'target-2026-reading';
let legacyImportCompleted = false;
let legacyImportValidated = false;
let legacyOldDataDownloaded = false;
let legacyTemplateDownloaded = false;
let legacyImportFileUploaded = false;

const LEGACY_IMPORT_STEPS = [
    [1, '下载文件'],
    [2, '上传作品表'],
    [3, '校验预览']
];

const LEGACY_SOURCE_ACTIVITIES = [
    {
        id: 'legacy-2025-reading',
        title: '2025 年阅读作品征集',
        status: '已结束',
        statusCls: 'badge-status-ended',
        time: '2025-04-01 09:00:00 至 2025-06-30 23:59:59',
        works: 318,
        creator: '阅途文化集团',
        type: '征集类',
        attachments: 286
    },
    {
        id: 'legacy-city-2024',
        title: '2024 城市阅读季作品展播',
        status: '已归档',
        statusCls: 'badge-status-unpublished',
        time: '2024-08-01 09:00:00 至 2024-10-15 23:59:59',
        works: 642,
        creator: '上海图书馆',
        type: '征集类',
        attachments: 611
    },
    {
        id: 'legacy-law-2025',
        title: '第十五届法律翻译作品大赛',
        status: '已结束',
        statusCls: 'badge-status-ended',
        time: '2025-03-10 09:00:00 至 2025-05-20 23:59:59',
        works: 96,
        creator: '华东政法大学图书馆',
        type: '征集类',
        attachments: 74
    }
];

const LEGACY_OPERATION_LOGS = [
    {
        time: '2026-06-18 16:42:18',
        operator: '平台 admin',
        type: '导入',
        sourceActivity: '2025 年阅读作品征集',
        targetActivity: '2026 春季全民读书月 · 全国作品征集',
        file: '2026阅读作品导入模板_整理版.xlsx',
        result: '部分成功',
        resultCls: 'badge-yellow',
        count: '成功 92',
        detail: '失败 8 · 去重跳过 3'
    },
    {
        time: '2026-06-18 15:58:06',
        operator: '平台 admin',
        type: '导出',
        sourceActivity: '2025 年阅读作品征集',
        targetActivity: '-',
        file: '老活动作品数据_2025年阅读作品征集_20260618.zip',
        result: '成功',
        resultCls: 'badge-green',
        count: '导出 318',
        detail: ''
    },
    {
        time: '2026-06-12 11:08:35',
        operator: '集团运营管理员',
        type: '导入',
        sourceActivity: '2024 城市阅读季作品展播',
        targetActivity: '2026 城市阅读季 · 全国作品征集',
        file: '城市阅读季老作品补录.xlsx',
        result: '成功',
        resultCls: 'badge-green',
        count: '成功 128',
        detail: '失败 0 · 去重跳过 11'
    },
    {
        time: '2026-06-12 10:36:12',
        operator: '集团运营管理员',
        type: '导出',
        sourceActivity: '2024 城市阅读季作品展播',
        targetActivity: '-',
        file: '老活动作品数据_2024城市阅读季作品展播_20260612.zip',
        result: '成功',
        resultCls: 'badge-green',
        count: '导出 642',
        detail: ''
    }
];

const LEGACY_TARGET_ACTIVITIES = [
    {
        id: 'target-2026-reading',
        title: '2026 春季全民读书月 · 全国作品征集',
        status: '进行中',
        statusCls: 'badge-status-ongoing',
        type: '征集类',
        works: 1246,
        creator: '阅途文化集团',
        fields: '作品标题、作者、手机号、单位、附件',
        time: '2026-04-01 09:00:00 至 2026-07-31 23:59:59'
    },
    {
        id: 'target-2026-city',
        title: '2026 城市阅读季 · 全国作品征集',
        status: '未开始',
        statusCls: 'badge-status-upcoming',
        type: '征集类',
        works: 0,
        creator: '阅途文化集团',
        fields: '作品标题、作者、单位、作品简介、附件',
        time: '2026-08-01 09:00:00 至 2026-10-15 23:59:59'
    },
    {
        id: 'target-2026-law',
        title: '第十六届“华政杯”全国法律翻译大赛',
        status: '进行中',
        statusCls: 'badge-status-ongoing',
        type: '征集类',
        works: 86,
        creator: '华东政法大学图书馆',
        fields: '作品标题、作者、手机号、译文附件、原文出处',
        time: '2026-03-01 09:00:00 至 2026-06-30 23:59:59'
    }
];

const LEGACY_IMPORT_ERRORS = [
    ['3', '春日共读札记', '王晓宁', '作品名称为空', '补充作品名称后重新上传'],
    ['8', '城市阅读影像', '李佳', '附件“001.jpg”未在附件包中找到', '确认附件文件名与 Excel 一致'],
    ['12', '纸页里的远方', '陈思雨', '手机号格式不正确', '修正手机号格式'],
    ['20', '法典翻译心得', '周沐', '疑似重复作品', '确认后跳过或继续导入']
];

const NEW_WORKS_IMPORT_LOGS = [
    {
        time: '2026-06-24 14:26:12',
        operator: '平台 admin',
        targetActivity: '2026 春季全民读书月 · 全国作品征集',
        file: '新作品导入模板_整理版.xlsx',
        result: '部分成功',
        resultCls: 'badge-yellow',
        count: '成功 86',
        detail: '失败 4 · 去重跳过 2'
    },
    {
        time: '2026-06-22 10:15:48',
        operator: '集团运营管理员',
        targetActivity: '2026 城市阅读季 · 全国作品征集',
        file: '城市阅读季新增作品.xlsx',
        result: '成功',
        resultCls: 'badge-green',
        count: '成功 128',
        detail: '失败 0 · 去重跳过 0'
    },
    {
        time: '2026-06-20 16:40:06',
        operator: '平台 admin',
        targetActivity: '第十六届“华政杯”全国法律翻译大赛',
        file: '法律翻译大赛新作品补录.xlsx',
        result: '成功',
        resultCls: 'badge-green',
        count: '成功 42',
        detail: '失败 0 · 去重跳过 1'
    }
];

const NEW_WORKS_PREVIEW_ROWS = [
    ['通过', '3000000003', '李三', '13800000003', '公共组', '阅读文化创意海报', '3000000003.zip', '无'],
    ['通过', '3000000004', '王四', '13800000004', '学院组', '书香城市视觉设计', '3000000004.zip', '无'],
    ['异常', '3000000005', '赵五', '13800000005', '未知组别', '城市阅读空间', '3000000005.zip', '组别不存在'],
    ['异常', '3000000001', '陈一', '13800000001', '学院组', '重复投稿作品', '3000000001.zip', '重复作品']
];

let newWorksImportState = {
    step: 'upload',
    archive: null,
    sheet: null
};

registerPage('station-activity-list', () => renderLegacyImportList());

registerPage('station-activity-create', () => {
    if (currentPageParams?.step) {
        legacyImportStep = Math.max(1, Math.min(LEGACY_IMPORT_STEPS.length, Number(currentPageParams.step) || 1));
    }
    return renderLegacyImportWorkflow();
});

registerPage('new-works-import', () => renderNewWorksImportList());
registerPage('new-works-import-create', () => renderNewWorksImportPage());

function getSelectedLegacyActivity() {
    return LEGACY_SOURCE_ACTIVITIES.find(item => item.id === selectedLegacyActivityId) || LEGACY_SOURCE_ACTIVITIES[0];
}

function getSelectedTargetActivity() {
    return LEGACY_TARGET_ACTIVITIES.find(item => item.id === selectedTargetActivityId) || LEGACY_TARGET_ACTIVITIES[0];
}

function renderLegacyImportList() {
    const logRows = LEGACY_OPERATION_LOGS.map(item => `
        <tr>
            <td>
                <strong>${formatDateTimeSecond(item.time)}</strong>
            </td>
            <td>${escapeHtml(item.operator)}</td>
            <td>
                <strong>${escapeHtml(item.sourceActivity)}</strong>
            </td>
            <td>
                <strong>${escapeHtml(item.targetActivity)}</strong>
            </td>
            <td>${escapeHtml(item.file)}</td>
            <td><span class="badge ${item.resultCls}">${escapeHtml(item.result)}</span></td>
            <td>
                <strong>${escapeHtml(item.count)}</strong>
                <div class="table-subtext">${escapeHtml(item.detail)}</div>
            </td>
        </tr>
    `).join('');

    return `
    <div class="station-page legacy-import-page">
        <section class="station-hero card legacy-import-hero">
            <div>
                <h2>老作品导入</h2>
                <p>用于将平台现有活动中的历史作品迁移到目标活动</p>
            </div>
            <button class="btn btn-primary" onclick="navigateTo('station-activity-create')">+ 发起导入</button>
        </section>

        <section class="card station-table-card">
            <div class="station-section-head">
                <div>
                    <h3>操作日志</h3>
                    <p>按操作分行记录导出和导入动作，明确从哪个老活动导出数据，以及整理后导入到哪个新活动。</p>
                </div>
                <button class="btn btn-outline">导出操作日志</button>
            </div>
            ${tableWrap(['操作时间', '操作人', '导出来源活动', '导入目标活动', '导入文件', '结果', '数量'], logRows, { total: LEGACY_OPERATION_LOGS.length })}
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

function legacyRuleItem(title, desc) {
    return `
    <div>
        <strong>${title}</strong>
        <span>${desc}</span>
    </div>`;
}

function renderLegacyImportWorkflow() {
    const selected = getSelectedLegacyActivity();
    const target = getSelectedTargetActivity();
    return `
    <div class="legacy-shot-page">
        <div class="legacy-shot-shell">
            <aside class="legacy-shot-steps">
                ${renderLegacyShotSteps()}
            </aside>
            <main class="legacy-shot-panel">
                ${renderLegacyShotStepContent(selected, target)}
            </main>
        </div>
        <footer class="new-works-actionbar legacy-shot-actionbar">
            <p>${getLegacyFooterHint()}</p>
            <div>
                ${legacyImportStep === 3
                    ? `<button class="btn btn-outline" onclick="goLegacyImportStep(2)">重新上传</button>
                       <button class="btn btn-primary" onclick="confirmLegacyImport()">确认导入</button>`
                    : renderLegacyShotPager()}
            </div>
        </footer>
    </div>`;
}

function renderLegacyShotSteps() {
    return `
    ${LEGACY_IMPORT_STEPS.map(([num, label], index) => {
        const status = legacyImportStep === num ? 'active' : legacyImportStep > num || legacyImportCompleted ? 'done' : 'todo';
        const clickable = canEnterLegacyStep(num);
        return `${index > 0 ? '<i class="legacy-shot-connector"></i>' : ''}<button class="legacy-shot-step ${status}" onclick="${clickable ? `goLegacyImportStep(${num})` : 'event.preventDefault()'}" ${clickable ? '' : 'disabled'}>
            <span>${status === 'done' ? '✓' : num}</span>
            <strong>${label}</strong>
        </button>`;
    }).join('')}`;
}

function renderLegacyShotStepContent(selected, target) {
    if (legacyImportStep === 1) return renderLegacyShotDownloadStep(selected, target);
    if (legacyImportStep === 2) return renderLegacyShotUploadStep(target);
    return renderLegacyShotPreviewStep();
}

function renderLegacyShotDownloadStep(selected, target) {
    return `
    <section class="legacy-shot-content">
        <div class="legacy-shot-head">
            <h2>下载文件</h2>
            <p>请先下载老活动作品表和目标活动作品模板，并按目标活动模板的表头字段整理老活动数据。确认字段一致后，再进入下一步导入作品。</p>
        </div>
        <div class="legacy-shot-dual-grid">
            <div class="legacy-shot-card">
                <h3>1. 选择老活动并下载作品数据</h3>
                <label class="legacy-shot-field-label">老活动名称</label>
                <select class="form-control" onchange="selectLegacyActivity(this.value)">
                    ${LEGACY_SOURCE_ACTIVITIES.map(item => `<option value="${item.id}" ${item.id === selectedLegacyActivityId ? 'selected' : ''}>${escapeHtml(item.title)}</option>`).join('')}
                </select>
                <div class="legacy-shot-info-row compact">
                    <div><span>活动状态</span><strong>${escapeHtml(selected.status)}</strong></div>
                    <div><span>作品数量</span><strong>${selected.works} 条</strong></div>
                    <div><span>附件数量</span><strong>${selected.attachments} 个</strong></div>
                    <div><span>创建单位</span><strong>${escapeHtml(selected.creator)}</strong></div>
                </div>
                <button class="btn btn-primary" onclick="showLegacyDownloadModal('old')">下载</button>
            </div>
            <div class="legacy-shot-card">
                <h3>2. 选导入目标活动并下载作品模板</h3>
                <label class="legacy-shot-field-label">目标活动名称</label>
                <select class="form-control" onchange="selectTargetActivity(this.value)">
                    ${LEGACY_TARGET_ACTIVITIES.map(item => `<option value="${item.id}" ${item.id === selectedTargetActivityId ? 'selected' : ''}>${escapeHtml(item.title)}</option>`).join('')}
                </select>
                <div class="legacy-shot-info-row compact">
                    <div><span>活动状态</span><strong>${escapeHtml(target.status)}</strong></div>
                    <div><span>作品数量</span><strong>${selected.works} 条</strong></div>
                    <div><span>附件数量</span><strong>${selected.attachments} 个</strong></div>
                    <div><span>创建单位</span><strong>${escapeHtml(target.creator)}</strong></div>
                </div>
                <button class="btn btn-primary" onclick="showLegacyDownloadModal('template')">下载</button>
            </div>
        </div>
    </section>`;
}

function renderLegacyShotUploadStep(target) {
    return `
    <section class="legacy-shot-content">
        <div class="legacy-shot-head">
            <h2>上传作品表</h2>
            <p>请上传已按目标活动模板字段整理完成的老活动作品数据表。</p>
        </div>
        <div class="legacy-upload-box legacy-upload-box-large">
            <div class="legacy-upload-icon">↑</div>
            <div>
                <strong>上传文件</strong>
                ${legacyImportFileUploaded ? '<p>已上传整理好的老活动作品数据表，可继续配置导入处理规则。</p>' : ''}
                <span>${legacyImportFileUploaded ? '2026春季作品导入模板_整理版.xlsx' : '未上传文件'}</span>
            </div>
            <button class="btn btn-primary" onclick="uploadLegacyImportFile()">${legacyImportFileUploaded ? '重新上传' : '上传文件'}</button>
        </div>
        <div class="legacy-target-spotlight">
            <span class="legacy-target-chip">导入目标</span>
            <strong>${escapeHtml(target.title)}</strong>
        </div>
        <div class="legacy-rule-form legacy-inline-rule-form">
            <h4>导入处理规则</h4>
            <div class="form-group">
                <label>审核状态处理</label>
                <select class="form-control">
                    <option>按当前活动规则处理</option>
                    <option>导入后直接通过</option>
                </select>
            </div>
            <div class="form-group">
                <label>投稿时间处理</label>
                <select class="form-control">
                    <option>使用导入时间</option>
                    <option>保留原投稿时间</option>
                </select>
            </div>
        </div>
    </section>`;
}

function renderLegacyShotPreviewStep() {
    const rows = LEGACY_IMPORT_ERRORS.map(item => `
        <tr>
            <td><span class="badge ${item[3].includes('重复') ? 'badge-red' : 'badge-green'}">${item[3].includes('重复') || item[3].includes('为空') || item[3].includes('未在') || item[3].includes('格式') ? '异常' : '通过'}</span></td>
            <td>${item[3].includes('重复') ? '3000000001' : item[0] === '8' ? '3000000005' : item[0] === '12' ? '3000000006' : '3000000004'}</td>
            <td>${escapeHtml(item[2])}</td>
            <td>${item[0] === '8' ? '13800000005' : item[0] === '12' ? '13800000006' : item[0] === '20' ? '13800000001' : '13800000004'}</td>
            <td>${item[0] === '8' ? '未知组别' : '学院组'}</td>
            <td>${escapeHtml(item[1])}</td>
            <td>${item[0] === '8' ? '3000000005.zip' : item[0] === '12' ? '3000000006.zip' : item[0] === '20' ? '3000000001.zip' : '3000000004.zip'}</td>
            <td>${escapeHtml(item[3])}</td>
        </tr>
    `).join('');
    return `
    <section class="legacy-shot-content legacy-preview-content">
        <div class="legacy-shot-head">
            <h2>校验预览</h2>
            <p>系统已完成作品编号、用户信息和附件匹配校验。异常数据不会导入，可下载明细后修正。</p>
        </div>
        <div class="new-works-preview-tools legacy-preview-tools">
            <button class="btn btn-outline" onclick="downloadLegacyErrorRows()">下载异常明细</button>
        </div>
        <div class="new-works-preview-metrics legacy-preview-metrics">
            <div class="station-metric-grid legacy-validate-grid">
                ${stationMetricCard('4', '识别作品数', 'blue')}
                ${stationMetricCard('2', '校验通过', 'green')}
                ${stationMetricCard('2', '异常数据', 'red')}
                ${stationMetricCard('2', '可导入作品', 'gold')}
            </div>
        </div>
        ${tableWrap(['校验状态', '作品编号', '投稿者', '手机号', '所属组别', '作品主题', '附件名称', '问题说明'], rows, { total: LEGACY_IMPORT_ERRORS.length, pagination: false })}
    </section>`;
}

function renderLegacyShotPager() {
    const isFirstStep = legacyImportStep === 1;
    const isLastStep = legacyImportStep === LEGACY_IMPORT_STEPS.length;
    const nextStep = legacyImportStep + 1;
    const nextDisabled = legacyImportStep === 2
            ? !legacyImportFileUploaded
            : false;
    const nextAction = legacyImportStep === 2
        ? 'validateLegacyImportInline()'
        : isLastStep
            ? 'confirmLegacyImport()'
            : `goLegacyImportStep(${nextStep})`;
    const nextLabel = legacyImportStep === 1
        ? '已下载并下一步'
        : legacyImportStep === 2
            ? '开始导入'
            : isLastStep
                ? '确认导入'
                : '下一步';

    return `
    <div class="legacy-shot-actions-nav">
        <button class="btn btn-outline" onclick="${isFirstStep ? `navigateTo('station-activity-list')` : `goLegacyImportStep(${legacyImportStep - 1})`}">${isFirstStep ? '取消导入' : '上一步'}</button>
        <button class="btn btn-primary" onclick="${nextAction}" ${nextDisabled ? 'disabled' : ''}>${nextLabel}</button>
    </div>`;
}

function getLegacyFooterHint() {
    if (legacyImportStep === 3) return '校验通过 2 条，可确认导入；异常 2 条将被跳过';
    if (legacyImportStep === 2 && legacyImportFileUploaded) return '文件已上传，可以开始导入';
    if (legacyImportStep === 2) return '请先上传整理好的导入模板';
    return '请先下载老活动作品表和目标活动作品表';
}

function uploadLegacyImportFile() {
    legacyImportFileUploaded = true;
    legacyImportValidated = false;
    legacyImportCompleted = false;
    document.getElementById('mainContent').innerHTML = renderLegacyImportWorkflow();
}

function validateLegacyImportInline() {
    legacyImportValidated = true;
    goLegacyImportStep(3);
}

function legacyUploadBox(title, fileName, desc) {
    return `
    <div class="legacy-upload-box">
        <div class="legacy-upload-icon">↑</div>
        <div>
            <strong>${title}</strong>
            <p>${desc}</p>
            <span>${fileName}</span>
        </div>
    </div>`;
}

function renderLegacyValidationResult() {
    const rows = LEGACY_IMPORT_ERRORS.map(item => `
        <tr>
            <td>第 ${item[0]} 行</td>
            <td>${escapeHtml(item[1])}</td>
            <td>${escapeHtml(item[2])}</td>
            <td><span class="badge ${item[3].includes('重复') ? 'badge-yellow' : 'badge-red'}">${escapeHtml(item[3])}</span></td>
            <td>${escapeHtml(item[4])}</td>
        </tr>
    `).join('');
    return `
    <div class="legacy-validation-block">
        <div class="station-section-head">
            <div>
                <h3>校验结果</h3>
                <p>校验通过的数据可先导入，异常数据可下载修改后再次上传。当前活动开启审核，导入后默认进入待审核。</p>
            </div>
            <span class="badge badge-yellow">部分通过</span>
        </div>
        <div class="station-metric-grid legacy-validate-grid">
            ${stationMetricCard('100', '总数据条数', 'blue')}
            ${stationMetricCard('92', '可导入条数', 'green')}
            ${stationMetricCard('8', '异常条数', 'red')}
            ${stationMetricCard('3', '疑似重复条数', 'gold')}
        </div>
        ${tableWrap(['行号', '作品名称', '作者姓名', '异常原因', '处理建议'], rows, { total: LEGACY_IMPORT_ERRORS.length, pagination: false })}
    </div>`;
}

function canEnterLegacyStep(step) {
    if (step <= 2) return true;
    if (step === 3) return legacyImportValidated || legacyImportFileUploaded;
    return false;
}

function selectLegacyActivity(id) {
    selectedLegacyActivityId = id;
    legacyImportCompleted = false;
    legacyOldDataDownloaded = false;
    document.getElementById('mainContent').innerHTML = renderLegacyImportWorkflow();
}

function selectTargetActivity(id) {
    selectedTargetActivityId = id;
    legacyImportValidated = false;
    legacyImportCompleted = false;
    document.getElementById('mainContent').innerHTML = renderLegacyImportWorkflow();
}

function goLegacyImportStep(step) {
    if (!canEnterLegacyStep(step)) return;
    legacyImportStep = Math.max(1, Math.min(LEGACY_IMPORT_STEPS.length, step));
    if (legacyImportStep < 4) legacyImportValidated = false;
    if (legacyImportStep < 5) legacyImportCompleted = false;
    document.getElementById('mainContent').innerHTML = renderLegacyImportWorkflow();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLegacyDownloadModal(type) {
    const isTemplate = type === 'template';
    const source = getSelectedLegacyActivity();
    const target = getSelectedTargetActivity();
    if (isTemplate) {
        legacyTemplateDownloaded = true;
    } else {
        legacyOldDataDownloaded = true;
    }
    openModal(
        isTemplate ? '当前活动导入模板已生成' : '老作品数据已打包',
        `<p>${isTemplate ? `文件名：${escapeHtml(target.title)}_作品导入模板.xlsx` : `文件名：老活动作品数据_${escapeHtml(source.title)}_20260625.zip`}</p><p class="text-muted">${isTemplate ? '请使用该目标活动模板整理后上传，系统不会识别老活动原始表格。' : '压缩包包含作品数据表、作品附件文件夹和导入说明。'}</p>`,
        null,
        { hideCancel: true, confirmText: '知道了' }
    );
    if (isTemplate) {
        document.getElementById('mainContent').innerHTML = renderLegacyImportWorkflow();
    }
}

function downloadLegacyErrorRows() {
    openModal('异常数据已生成', '<p>已生成异常数据文件，可修正后重新上传。本原型不执行真实下载。</p>', null, { hideCancel: true, confirmText: '知道了' });
}

function confirmLegacyImport() {
    showLegacyResultModal();
}

function validateLegacyImport() {
    showLegacyValidationModal();
}

function showLegacyUploadModal() {
    openModal(
        '导入文件',
        `<div class="legacy-upload-modal">
            <p class="text-muted">请上传已整理好的当前活动导入模板。</p>
            <div class="legacy-upload-grid compact">
                ${legacyUploadBox('导入文件', '2026春季作品导入模板_整理版.xlsx', '请上传使用当前活动导入模板整理后的 Excel 文件')}
            </div>
            <div class="legacy-rule-form">
                <h4>导入处理规则</h4>
                <div class="form-group">
                    <label>审核状态处理</label>
                    <select class="form-control"><option>按当前活动规则处理</option><option>导入后直接通过</option></select>
                </div>
                <div class="form-group">
                    <label>投稿时间处理</label>
                    <select class="form-control"><option>使用导入时间</option><option>保留原投稿时间</option></select>
                </div>
            </div>
        </div>`,
        () => showLegacyValidationModal(),
        { modalClass: 'legacy-modal-wide', confirmText: '开始校验', cancelText: '取消' }
    );
}

function showLegacyValidationModal() {
    legacyImportValidated = true;
    const rows = LEGACY_IMPORT_ERRORS.map(item => `
        <tr>
            <td>第 ${item[0]} 行</td>
            <td>${escapeHtml(item[1])}</td>
            <td>${escapeHtml(item[2])}</td>
            <td><span class="badge ${item[3].includes('重复') ? 'badge-yellow' : 'badge-red'}">${escapeHtml(item[3])}</span></td>
            <td>${escapeHtml(item[4])}</td>
        </tr>
    `).join('');
    openModal(
        '导入校验结果',
        `<div class="legacy-modal-result">
            <div class="legacy-modal-stats">
                ${stationMetricCard('100', '总数据条数', 'blue')}
                ${stationMetricCard('92', '可导入条数', 'green')}
                ${stationMetricCard('8', '异常条数', 'red')}
                ${stationMetricCard('3', '疑似重复条数', 'gold')}
            </div>
            ${tableWrap(['行号', '作品名称', '作者姓名', '异常原因', '处理建议'], rows, { total: LEGACY_IMPORT_ERRORS.length, pagination: false })}
        </div>`,
        () => showLegacyResultModal(),
        { modalClass: 'legacy-modal-wide', confirmText: '仅导入通过数据', cancelText: '返回修改' }
    );
}

function showLegacyResultModal() {
    legacyImportCompleted = true;
    openModal(
        '导入完成',
        `<div class="legacy-result-panel">
            <div><span>导入时间</span><strong>2026-06-25 14:30:00</strong></div>
            <div><span>操作人</span><strong>平台 admin</strong></div>
            <div><span>目标活动</span><strong>${escapeHtml(getSelectedTargetActivity().title)}</strong></div>
            <div><span>来源老活动</span><strong>${escapeHtml(getSelectedLegacyActivity().title)}</strong></div>
            <div><span>成功导入</span><strong>92 条</strong></div>
            <div><span>失败数据</span><strong>8 条</strong></div>
            <div><span>跳过重复</span><strong>3 条</strong></div>
        </div>`,
        () => navigateTo('station-activity-list'),
        { modalClass: 'legacy-modal-wide', confirmText: '返回操作日志', cancelText: '继续导入' }
    );
}

function confirmLeaveLegacyImport() {
    if (legacyImportValidated || legacyImportCompleted) {
        openModal(
            '确认离开',
            '<p>当前导入流程尚未完成，离开后已上传文件和校验结果可能不会保留，是否确认离开？</p>',
            () => goBackFromPage('station-activity-create'),
            { confirmText: '确认离开', cancelText: '继续导入' }
        );
        return;
    }
    goBackFromPage('station-activity-create');
}

function resetLegacyImport() {
    legacyImportStep = 1;
    legacyImportValidated = false;
    legacyImportCompleted = false;
    legacyOldDataDownloaded = false;
    legacyTemplateDownloaded = false;
    navigateTo('station-activity-create');
}

function renderNewWorksImportList() {
    const logRows = NEW_WORKS_IMPORT_LOGS.map(item => `
        <tr>
            <td>
                <strong>${formatDateTimeSecond(item.time)}</strong>
            </td>
            <td>${escapeHtml(item.operator)}</td>
            <td>
                <strong>${escapeHtml(item.targetActivity)}</strong>
                <div class="table-subtext">导入到该活动</div>
            </td>
            <td>${escapeHtml(item.file)}</td>
            <td><span class="badge ${item.resultCls}">${escapeHtml(item.result)}</span></td>
            <td>
                <strong>${escapeHtml(item.count)}</strong>
                <div class="table-subtext">${escapeHtml(item.detail)}</div>
            </td>
        </tr>
    `).join('');

    return `
    <div class="station-page legacy-import-page new-works-import-list-page">
        <section class="station-hero card legacy-import-hero new-works-log-hero">
            <div>
                <h2>新作品导入</h2>
                <p>用于将系统中尚不存在的新作品批量导入目标活动</p>
            </div>
            <button class="btn btn-primary" onclick="startNewWorksImport()">+ 发起导入</button>
        </section>

        <section class="card station-table-card">
            <div class="station-section-head">
                <div>
                    <h3>操作日志</h3>
                    <p>按操作分行记录新作品导入动作，明确导入到哪个活动、使用哪个文件，以及本次导入结果。</p>
                </div>
                <button class="btn btn-outline">导出操作日志</button>
            </div>
            ${tableWrap(['操作时间', '操作人', '导入目标活动', '导入文件', '结果', '数量'], logRows, { total: NEW_WORKS_IMPORT_LOGS.length })}
        </section>
    </div>`;
}

function renderNewWorksImportPage() {
    const isPreview = newWorksImportState.step === 'preview';
    return `
    <div class="new-works-import-page ${isPreview ? 'is-preview' : 'is-upload'}">
        <section class="new-works-import-card">
            <nav class="new-works-steps" aria-label="新作品导入步骤">
                <div class="new-works-step ${isPreview ? 'done' : 'active'}">
                    <span>1</span>
                    <strong>上传导入文件</strong>
                </div>
                <i></i>
                <div class="new-works-step ${isPreview ? 'active' : ''}">
                    <span>2</span>
                    <strong>校验预览</strong>
                </div>
            </nav>

            ${isPreview ? renderNewWorksPreviewPanel() : renderNewWorksUploadPanel()}
        </section>

        <footer class="new-works-actionbar">
            <p>${getNewWorksFooterHint()}</p>
            <div>
                <button class="btn btn-outline" onclick="${isPreview ? 'resetNewWorksImport()' : `navigateTo('new-works-import')`}">${isPreview ? '重新上传' : '取消导入'}</button>
                <button class="btn btn-primary" onclick="${isPreview ? 'showNewWorksImportConfirm()' : 'validateNewWorksImport()'}" ${!isPreview && !canValidateNewWorksImport() ? 'disabled' : ''}>${isPreview ? '确认导入' : '开始校验'}</button>
            </div>
        </footer>
    </div>`;
}

function renderNewWorksUploadPanel() {
    return `
    <div class="new-works-section-head">
        <h3>上传导入文件</h3>
        <p>请先上传作品附件压缩包，再上传作品数据表。系统校验通过后，作品将作为新投稿追加至当前投稿列表。</p>
    </div>

    <div class="new-works-upload-grid">
        ${renderNewWorksUploadCard({
            kind: 'archive',
            title: '1. 作品附件压缩包',
            button: '上传作品压缩包',
            desc: '请将所有作品附件放入同一个压缩包，并为每个作品设置唯一作品编号，如 001、002、003。作品编号需与「2. 作品数据表」中的作品编号保持一致。',
            note: '支持 .zip、.rar、.7z 格式。',
            accept: '.zip,.rar,.7z'
        })}
        ${renderNewWorksUploadCard({
            kind: 'sheet',
            title: '2. 作品数据表',
            button: '上传作品数据表',
            desc: '请下载模板填写作品信息，每行对应一个作品。表格中的作品编号需与「1. 作品附件压缩包」内作品编号保持一致。',
            note: '支持 .csv、.xlsx 格式。',
            accept: '.csv,.xlsx,.xls',
            template: true
        })}
    </div>`;
}

function renderNewWorksUploadCard(config) {
    const file = newWorksImportState[config.kind];
    return `
    <article class="new-works-upload-card ${file ? 'is-uploaded' : ''}">
        <div>
            <h4>${config.title}</h4>
            <p>${config.desc}</p>
            <small>${config.note}</small>
            ${config.template ? `<button class="link-button new-works-template-link" onclick="showNewWorksTemplateModal()">下载作品数据表模板</button>` : ''}
            <strong class="new-works-upload-status">${file ? `已上传：${escapeHtml(file)}` : '未上传'}</strong>
        </div>
        <label class="btn btn-primary new-works-file-button" for="newWorks${config.kind}Input">${file ? '重新上传' : config.button}</label>
        <input id="newWorks${config.kind}Input" class="new-works-file-input" type="file" accept="${config.accept}" onchange="handleNewWorksFile('${config.kind}', this)">
        ${file ? `<button class="new-works-clear" onclick="clearNewWorksFile('${config.kind}')">删除</button>` : ''}
    </article>`;
}

function renderNewWorksPreviewPanel() {
    const rows = NEW_WORKS_PREVIEW_ROWS.map(item => `
        <tr>
            <td><span class="badge ${item[0] === '通过' ? 'badge-green' : 'badge-red'}">${item[0]}</span></td>
            <td>${escapeHtml(item[1])}</td>
            <td>${escapeHtml(item[2])}</td>
            <td>${escapeHtml(item[3])}</td>
            <td>${escapeHtml(item[4])}</td>
            <td>${escapeHtml(item[5])}</td>
            <td>${escapeHtml(item[6])}</td>
            <td>${escapeHtml(item[7])}</td>
        </tr>
    `).join('');

    return `
    <div class="new-works-section-head">
        <h3>校验预览</h3>
        <p>系统已完成作品编号、用户信息和附件匹配校验。异常数据不会导入，可下载明细后修正。</p>
    </div>
    <div class="new-works-preview-tools">
        <button class="btn btn-outline" onclick="showNewWorksErrorsModal()">下载异常明细</button>
    </div>
    <div class="new-works-preview-metrics">
        <div class="station-metric-grid">
            ${stationMetricCard('4', '识别作品数', 'blue')}
            ${stationMetricCard('2', '校验通过', 'green')}
            ${stationMetricCard('2', '异常数据', 'red')}
            ${stationMetricCard('2', '可导入作品', 'gold')}
        </div>
    </div>
    ${tableWrap(['校验状态', '作品编号', '投稿者', '手机号', '所属组别', '作品主题', '附件名称', '问题说明'], rows, { total: NEW_WORKS_PREVIEW_ROWS.length, pagination: false })}`;
}

function startNewWorksImport() {
    newWorksImportState = { step: 'upload', archive: null, sheet: null };
    navigateTo('new-works-import-create');
}

function handleNewWorksFile(kind, input) {
    const file = input.files?.[0];
    if (!file) return;
    newWorksImportState[kind] = file.name;
    document.getElementById('mainContent').innerHTML = renderNewWorksImportPage();
}

function clearNewWorksFile(kind) {
    newWorksImportState[kind] = null;
    newWorksImportState.step = 'upload';
    document.getElementById('mainContent').innerHTML = renderNewWorksImportPage();
}

function canValidateNewWorksImport() {
    return Boolean(newWorksImportState.archive && newWorksImportState.sheet);
}

function validateNewWorksImport() {
    if (!canValidateNewWorksImport()) return;
    newWorksImportState.step = 'preview';
    document.getElementById('mainContent').innerHTML = renderNewWorksImportPage();
}

function resetNewWorksImport() {
    newWorksImportState = { step: 'upload', archive: null, sheet: null };
    document.getElementById('mainContent').innerHTML = renderNewWorksImportPage();
}

function getNewWorksFooterHint() {
    if (newWorksImportState.step === 'preview') return '校验通过 2 条，可确认导入；异常 2 条将被跳过';
    if (newWorksImportState.archive && newWorksImportState.sheet) return '文件已上传，可以开始校验';
    if (newWorksImportState.archive) return '还需上传作品数据表后，才可开始校验';
    if (newWorksImportState.sheet) return '还需上传作品附件压缩包后，才可开始校验';
    return '请先上传作品附件压缩包和作品数据表';
}

function showNewWorksTemplateModal() {
    openModal('作品数据表模板已生成', '<p>文件名：新作品导入模板.xlsx</p><p class="text-muted">请按当前活动字段填写作品编号、投稿者、手机号、所属组别、作品主题和附件名称。</p>', null, { hideCancel: true, confirmText: '知道了' });
}

function showNewWorksErrorsModal() {
    openModal('异常明细已生成', '<p>已生成异常明细文件，请修正组别不存在、重复作品等问题后重新上传。</p>', null, { hideCancel: true, confirmText: '知道了' });
}

function showNewWorksImportConfirm() {
    openModal('确认导入新作品？', '<p>本次将导入 2 条校验通过的新作品数据至当前活动。另有 2 条异常数据不会导入。</p>', () => showNewWorksImportResult(), { confirmText: '确认导入', cancelText: '取消' });
}

function showNewWorksImportResult() {
    openModal('导入完成', '<p>成功导入 2 条新作品，失败 0 条，跳过 2 条异常数据。</p>', () => navigateTo('new-works-import'), { hideCancel: true, confirmText: '返回操作日志' });
}
