/* question-bank.js — 题库管理 + 题目管理子页面 */

// ===== Mock Data =====
const questionBanks = [
    { id: 1, name: '图书馆知识题库', count: 860, creator: '管理员', date: '2026-04-15', status: '启用', desc: '涵盖图书馆学基础知识、文献检索、图书分类等' },
    { id: 2, name: '历史文化题库', count: 620, creator: '管理员', date: '2026-04-18', status: '启用', desc: '涵盖中国历史、传统文化、非物质文化遗产等' },
    { id: 3, name: '非遗知识题库', count: 450, creator: '管理员', date: '2026-04-20', status: '启用', desc: '涵盖非物质文化遗产保护、传承与推广等' },
    { id: 4, name: '安全知识题库', count: 300, creator: '管理员', date: '2026-05-01', status: '停用', desc: '涵盖消防安全、网络安全、应急处理等' }
];

const questionTypes = SYSTEM_QUESTION_TYPE_LABELS;
const QUESTION_BANK_CHOICES = ['默认题库', '题库名称一', '题库名称二', '题库名称三'];

function getQuestionFormBankValue(q) {
    const currentBank = questionBanks.find(b => b.id === currentBankId);
    return q?.bankName || q?.bank || currentBank?.name || QUESTION_BANK_CHOICES[0];
}

function renderQuestionBankOptions(selected) {
    return QUESTION_BANK_CHOICES.map(name => `<option ${selected === name ? 'selected' : ''}>${name}</option>`).join('');
}

function qbEscapeHtml(value = '') {
    if (typeof escapeHtml === 'function') return escapeHtml(value);
    return String(value).replace(/[&<>"']/g, match => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[match]));
}

function qbStripHtml(value = '') {
    const temp = document.createElement('div');
    temp.innerHTML = value || '';
    return (temp.textContent || temp.innerText || '').trim();
}

function qbContentSummary(value = '') {
    const text = qbStripHtml(value);
    if (text) return text;
    if (/<img\b/i.test(value)) return '[图片题干]';
    if (/<audio\b/i.test(value)) return '[音频题干]';
    if (/<video\b/i.test(value)) return '[视频题干]';
    return '';
}

function qbContentForPlainEditor(value = '') {
    return qbEscapeHtml(qbStripHtml(value));
}

function generateQuestions(bankId, count) {
    const questions = [];
    const bankName = questionBanks.find(b => b.id === bankId)?.name || '题库';
    const templates = [
        { type: '单选题', content: '以下关于图书馆分类法的描述，哪项是正确的？', options: 'A. 中图法 / B. 杜威法 / C. 国会法 / D. 以上都是', answer: 'D' },
        { type: '多选题', content: '以下哪些属于非物质文化遗产？', options: 'A. 京剧 / B. 昆曲 / C. 书法 / D. 古琴艺术', answer: 'ABCD' },
        { type: '判断题', content: '《四库全书》是清代乾隆年间编纂的中国古代最大的一部丛书。', options: '对 / 错', answer: '对' },
        { type: '单选题', content: '中国最早的公共图书馆建于哪个城市？', options: 'A. 北京 / B. 上海 / C. 南京 / D. 武汉', answer: 'B' },
        { type: '多选题', content: '图书馆的四大基本职能包括？', options: 'A. 文献收集 / B. 文献整理 / C. 文献保管 / D. 文献提供', answer: 'ABCD' },
        { type: '判断题', content: 'ISBN是国际标准书号的简称。', options: '对 / 错', answer: '对' },
        { type: '单选题', content: '以下哪个不属于文献检索的基本方法？', options: 'A. 追溯法 / B. 工具法 / C. 交替法 / D. 经验法', answer: 'D' },
        { type: '填空题', content: '中国图书馆分类法简称____。', options: '—', answer: '中图法' },
        { type: '简答题', content: '请简述公共图书馆在全民阅读推广中的主要作用。', options: '主观作答', answer: '围绕资源服务、阅读推广、文化传播等要点作答' },
        { type: '排序题', content: '请按图书借阅流程排序：检索书目、找到图书、办理借阅、归还图书。', options: 'A. 找到图书 / B. 办理借阅 / C. 检索书目 / D. 归还图书', answer: 'CABD' },
        { type: '单选题', content: '《尚书》属于哪种文献类型？', options: 'A. 经部 / B. 史部 / C. 子部 / D. 集部', answer: 'A' },
        { type: '判断题', content: '数字图书馆不需要实体建筑。', options: '对 / 错', answer: '错' }
    ];
    for (let i = 0; i < count; i++) {
        const tpl = templates[i % templates.length];
        questions.push({
            id: (bankId * 1000) + i + 1,
            bankId,
            bankName,
            type: tpl.type,
            content: tpl.content,
            options: tpl.options,
            answer: tpl.answer,
            creator: '管理员',
            date: `2026-04-${String(10 + (i % 20)).padStart(2, '0')}`,
            status: i % 7 === 0 ? '停用' : '启用'
        });
    }
    return questions;
}

let currentBankId = null;
let currentBankView = 'list'; // 'list' | 'questions'

// ===== 题库列表 =====
registerPage('question-bank', () => {
    currentBankView = 'list';
    return renderQuestionBankList();
});

function renderQuestionBankList() {
    return `
    ${shouldHideSecondaryMenuReturnBar('question-bank') ? '' : `
    <div class="review-crumb-card platform-review-back">
        ${renderSourceBack('question-bank')}
        <span class="review-divider"></span>
        <strong>题库管理</strong>
    </div>`}
    <div class="card">
        <div style="display:flex;justify-content:space-between;margin-bottom:16px">
            <div>${filterBar([
                { type: 'input', placeholder: '题库名称' },
                { type: 'select', options: ['全部状态', '启用', '停用'] }
            ])}</div>
            <button class="btn btn-primary" onclick="openCreateBankModal()">+ 创建题库</button>
        </div>
        ${tableWrap(
            ['序号', '题库名称', '题目数量', '创建人', '创建时间', '状态', '操作'],
            questionBanks.map((b, i) => `<tr>
                <td>${i + 1}</td>
                <td><strong>${b.name}</strong><div style="font-size:11px;color:var(--text-muted);margin-top:2px">${b.desc}</div></td>
                <td><strong style="color:var(--primary)">${b.count}</strong></td>
                <td>${b.creator}</td>
                <td>${formatDateTimeSecond(b.date)}</td>
                <td><span class="badge ${b.status === '启用' ? 'badge-green' : 'badge-gray'}">${b.status}</span></td>
                <td>
                    <span class="action-link" onclick="openQuestionManage(${b.id})">管理题目</span>
                    <span class="action-link" onclick="openEditBankModal(${b.id})">编辑</span>
                    <span class="action-link" onclick="exportBank(${b.id})">导出</span>
                    <span class="action-link danger" onclick="deleteBank(${b.id})">删除</span>
                </td>
            </tr>`).join('')
        )}
    </div>
    <div style="text-align:right;color:var(--text-muted);font-size:var(--font-size-xs)">共 ${questionBanks.length} 条记录</div>`;
}

// ===== 题目管理子页面 =====
function openQuestionManage(bankId) {
    currentBankId = bankId;
    currentBankView = 'questions';
    const main = document.getElementById('mainContent');
    main.innerHTML = renderQuestionManagePage();
}

function renderQuestionManagePage() {
    const bank = questionBanks.find(b => b.id === currentBankId);
    if (!bank) return '';
    const questions = generateQuestions(bank.id, Math.min(bank.count, 15)); // Show up to 15
    const typeStatGradients = {
        '单选题': 'linear-gradient(135deg,var(--success),var(--color-success-100))',
        '多选题': 'linear-gradient(135deg,var(--warning),var(--color-warning-100))',
        '判断题': 'linear-gradient(135deg,#F97316,#FDBA74)',
        '填空题': 'linear-gradient(135deg,#8B5CF6,#A78BFA)',
        '简答题': 'linear-gradient(135deg,#06B6D4,#67E8F9)',
        '排序题': 'linear-gradient(135deg,#EC4899,#F9A8D4)'
    };

    // Stats for this bank
    const typeCounts = {};
    questions.forEach(q => {
        typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
    });

    return `
    <div class="review-crumb-card platform-review-back">
        <span class="action-link muted" onclick="navigateTo('question-bank')">‹ 返回上一级</span>
        <span class="review-divider"></span>
        <strong>${bank.name} / 题目管理</strong>
    </div>
    
    <div class="stat-grid question-type-stat-grid">
        ${statCard(bank.count, '总题目数', 'linear-gradient(135deg,var(--primary),var(--primary-hover))')}
        ${questionTypes.map(type => statCard(typeCounts[type] || 0, type, typeStatGradients[type])).join('')}
    </div>

    <div class="card">
        <div style="display:flex;justify-content:space-between;margin-bottom:16px">
            <div class="filter-bar">
                <select id="qbTypeFilter" onchange="filterQuestions()">
                    ${questionTypeOptions('全部题型', true)}
                </select>
                <input placeholder="搜索题目内容" id="qbSearchInput" oninput="filterQuestions()">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="openCreateQuestionModal()">+ 添加题目</button>
                <button class="btn btn-outline" onclick="openBatchImportModal()">批量导入</button>
            </div>
        </div>
        ${tableWrap(
            ['序号', '题型', '题目内容', '选项/答案', '状态', '操作'],
            questions.map((q, i) => `<tr data-qid="${q.id}">
                <td>${i + 1}</td>
                <td><span class="badge ${questionTypeBadgeClass(q.type)}">${q.type}</span></td>
                <td style="max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${qbEscapeHtml(qbContentSummary(q.content))}">${qbEscapeHtml(qbContentSummary(q.content))}</td>
                <td style="font-size:12px;color:var(--text-muted);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${q.options}</td>
                <td><span class="badge ${q.status === '启用' ? 'badge-green' : 'badge-gray'}">${q.status}</span></td>
                <td>
                    <span class="action-link" onclick="openEditQuestionModal(${q.id})">编辑</span>
                    <span class="action-link" onclick="previewQuestion(${q.id})">预览</span>
                    <span class="action-link danger" onclick="deleteQuestion(${q.id})">删除</span>
                </td>
            </tr>`).join('')
        )}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="color:var(--text-muted);font-size:var(--font-size-xs)">共 ${questions.length} 条记录（演示数据，最多显示15条）</div>
        <div class="btn-group">
            <button class="btn btn-ghost" onclick="navigateTo('question-bank')">← 返回上一级</button>
        </div>
    </div>`;
}

function filterQuestions() {
    // Simple visual feedback — in a real app this would filter the table
    const typeFilter = document.getElementById('qbTypeFilter')?.value || '全部题型';
    const search = document.getElementById('qbSearchInput')?.value || '';
    
    const rows = document.querySelectorAll('tr[data-qid]');
    const questions = generateQuestions(currentBankId, 15);
    
    rows.forEach((row, i) => {
        const q = questions[i];
        if (!q) return;
        let show = true;
        if (typeFilter !== '全部题型' && q.type !== typeFilter) show = false;
        if (search && !q.content.includes(search)) show = false;
        row.style.display = show ? '' : 'none';
    });
}

// ===== Modal: 创建题库 =====
function openCreateBankModal() {
    openModal('创建题库', `
        <div class="form-group"><label><span class="req">*</span> 题库名称</label><input class="form-control" id="newBankName" placeholder="填写题库名称"></div>
        <div class="form-group"><label>题库说明</label><textarea class="form-control" rows="3" id="newBankDesc" placeholder="填写题库说明"></textarea></div>
        <div class="form-group"><label>状态</label><select class="form-control" id="newBankStatus"><option>启用</option><option>停用</option></select></div>
    `, () => {
        const name = document.getElementById('newBankName').value.trim();
        if (!name) { alert('请填写题库名称'); return; }
        questionBanks.push({
            id: questionBanks.length + 1,
            name,
            count: 0,
            creator: '管理员',
            date: formatDateTimeSecond(new Date().toISOString().slice(0, 19)),
            status: document.getElementById('newBankStatus').value,
            desc: document.getElementById('newBankDesc').value.trim()
        });
        navigateTo('question-bank');
    }, { confirmText: '创建' });
}

// ===== Modal: 编辑题库 =====
function openEditBankModal(bankId) {
    const bank = questionBanks.find(b => b.id === bankId);
    if (!bank) return;
    openModal('编辑题库', `
        <div class="form-group"><label><span class="req">*</span> 题库名称</label><input class="form-control" id="editBankName" value="${bank.name}"></div>
        <div class="form-group"><label>题库说明</label><textarea class="form-control" rows="3" id="editBankDesc">${bank.desc}</textarea></div>
        <div class="form-group"><label>状态</label><select class="form-control" id="editBankStatus"><option ${bank.status === '启用' ? 'selected' : ''}>启用</option><option ${bank.status === '停用' ? 'selected' : ''}>停用</option></select></div>
    `, () => {
        const name = document.getElementById('editBankName').value.trim();
        if (!name) { alert('请填写题库名称'); return; }
        bank.name = name;
        bank.desc = document.getElementById('editBankDesc').value.trim();
        bank.status = document.getElementById('editBankStatus').value;
        navigateTo('question-bank');
    }, { confirmText: '保存' });
}

// ===== 删除题库 =====
function deleteBank(bankId) {
    const bank = questionBanks.find(b => b.id === bankId);
    if (!bank) return;
    openModal('删除确认', `<div style="text-align:center;padding:10px 0"><div style="font-size:40px;margin-bottom:12px"></div><p>确定删除题库 <strong>${bank.name}</strong> 吗？</p><p style="color:var(--danger);font-size:12px;margin-top:8px">删除后该题库下所有题目将一并删除，操作不可恢复！</p></div>`, () => {
        const idx = questionBanks.findIndex(b => b.id === bankId);
        if (idx > -1) questionBanks.splice(idx, 1);
        navigateTo('question-bank');
    }, { confirmText: '确认删除', danger: true });
}

// ===== 导出题库 =====
function exportBank(bankId) {
    const bank = questionBanks.find(b => b.id === bankId);
    if (!bank) return;
    openModal('导出题库', `
        <div class="form-group"><label>导出格式</label>
            <div class="radio-group">
                <div class="radio-item"><input type="radio" name="exportFmt" checked><label>Excel (.xlsx)</label></div>
                <div class="radio-item"><input type="radio" name="exportFmt"><label>CSV</label></div>
                <div class="radio-item"><input type="radio" name="exportFmt"><label>JSON</label></div>
            </div>
        </div>
        <div class="form-group"><label>导出范围</label>
            <div class="radio-group">
                <div class="radio-item"><input type="radio" name="exportScope" checked><label>全部题目 (${bank.count}道)</label></div>
                <div class="radio-item"><input type="radio" name="exportScope"><label>按条件筛选</label></div>
            </div>
        </div>
        <div class="info-box blue">💡 导出文件将包含题目内容、选项、正确答案、题型等完整信息。</div>
    `, () => {
        alert(`题库「${bank.name}」导出成功！（演示提示）`);
    }, { confirmText: '导出' });
}

// ===== Modal: 添加题目 =====
function openCreateQuestionModal() {
    openModal('添加题目', renderQuestionForm(), () => {
        if (!validateQuestionForm()) return false;
        const values = getQuestionFormValues();
        alert('题目添加成功！（演示提示）');
        openQuestionManage(currentBankId);
    }, { confirmText: '添加题目', modalClass: 'modal-xl question-form-modal' });
    initQuestionForm();
}

// ===== Modal: 编辑题目 =====
function openEditQuestionModal(qId) {
    const questions = generateQuestions(currentBankId, 15);
    const q = questions.find(q => q.id === qId);
    if (!q) return;
    openModal('编辑题目', renderQuestionForm(q), () => {
        if (!validateQuestionForm()) return false;
        const values = getQuestionFormValues();
        alert('题目修改成功！（演示提示）');
        openQuestionManage(currentBankId);
    }, { confirmText: '保存', modalClass: 'modal-xl question-form-modal' });
    initQuestionForm(q);
}

function renderQuestionForm(q, options = {}) {
    const isEdit = !!q;
    const allowedTypes = Array.isArray(options.allowedTypes) && options.allowedTypes.length ? options.allowedTypes : SYSTEM_QUESTION_TYPE_LABELS;
    const type = isEdit ? (q.type === '问答题' ? '简答题' : q.type) : '单选题';
    const answer = isEdit ? q.answer : 'A';
    const bankValue = getQuestionFormBankValue(q);
    return `
    <div class="qb-question-editor qb-standard-editor" data-answer="${answer}">
        <section class="qb-standard-top">
            <div class="qb-section-head">
                    <div>
                        <strong>基础信息</strong>
                        <span>选择题型后，下方仅展示该题型对应的配置项</span>
                    </div>
            </div>
            <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="form-group"><label><span class="req">*</span> 题型</label>
                    <select class="form-control" id="qType" onchange="setQuestionType(this.value)">
                        ${allowedTypes.map(t => `<option ${type === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>题库</label>
                    <select class="form-control" id="qBank">${renderQuestionBankOptions(bankValue)}</select>
                </div>
            </div>
            <div class="form-group qb-field-full">
                <div class="qb-label-row">
                    <label><span class="req">*</span> 题目内容</label>
                    <button type="button" class="btn btn-outline btn-sm" id="qInsertBlankBtn" onclick="insertQuestionBlank()">+ 插入填空</button>
                </div>
                <div class="hint qb-question-content-hint">请输入题干内容，可添加文字说明、材料说明或答题要求。</div>
                <textarea class="form-control qb-question-title" id="qContentEditor" rows="5" oninput="syncQuestionRichContent()" placeholder="请输入题目内容，例如：请阅读下列材料，并选择正确答案。">${isEdit ? qbContentForPlainEditor(q.content) : ''}</textarea>
                <div class="qb-stem-assets">
                    <div>
                        <div class="qb-stem-assets-title">题干素材（可选）</div>
                        <div class="qb-stem-assets-desc">用于上传与题目相关的图片、音频或视频，用户答题时将在题干下方展示。</div>
                    </div>
                    <div class="qb-stem-asset-actions">
                        <button class="btn btn-outline btn-sm" type="button" onclick="openQuestionMediaPicker('image')">上传图片</button>
                        <button class="btn btn-outline btn-sm" type="button" onclick="openQuestionMediaPicker('audio')">上传音频</button>
                        <button class="btn btn-outline btn-sm" type="button" onclick="openQuestionMediaPicker('video')">上传视频</button>
                    </div>
                    <div class="qb-stem-asset-list" id="qStemAssetList"></div>
                </div>
                <input type="hidden" id="qContent" value="${isEdit ? qbEscapeHtml(q.content) : ''}">
                <input type="file" id="qMediaImageInput" accept="image/*" hidden onchange="insertQuestionMediaFromInput('image', this)">
                <input type="file" id="qMediaAudioInput" accept="audio/*" hidden onchange="insertQuestionMediaFromInput('audio', this)">
                <input type="file" id="qMediaVideoInput" accept="video/*" hidden onchange="insertQuestionMediaFromInput('video', this)">
            </div>
        </section>
        <section class="qb-standard-middle">
            <div class="qb-dynamic-config">
                <div class="qb-section-head">
                    <div>
                        <strong id="qDynamicTitle">选项设置</strong>
                        <span id="qAnswerHelp">根据题型配置答案</span>
                    </div>
                </div>
                <div id="qDynamicArea"></div>
            </div>
        </section>
        <section class="qb-standard-bottom">
            <div class="form-group qb-field-full"><label>答案解析</label>
                <textarea class="form-control" rows="4" id="qAnalysis" placeholder="填写答案解析（选填）"></textarea>
            </div>
        </section>
        <input type="hidden" id="qOptions" value="">
        <input type="hidden" id="qAnswer" value="${answer}">
    </div>`;
}

function getQuestionFormInitialOptions(q, fallbackPrefix = 'A') {
    if (q?.type === '判断题') return [{ label: '正确', text: '正确' }, { label: '错误', text: '错误' }];
    if (q?.options && !['—', '主观作答'].includes(q.options)) {
        return q.options.split(' / ').map(opt => {
            const match = opt.match(/^([A-Z]|\d+|正确|错误|是|否|对|错)[.、]?\s*(.*)$/);
            return {
                label: match ? match[1] : '',
                text: match ? match[2] : opt
            };
        });
    }
    if (fallbackPrefix === 'number') return [1, 2, 3, 4].map(label => ({ label: String(label), text: '' }));
    return ['A', 'B', 'C', 'D'].map(label => ({ label, text: '' }));
}

function initQuestionForm(q) {
    const editor = document.querySelector('.qb-question-editor');
    if (!editor) return;
    editor.typeState = {
        '单选题': {
            optionsText: getChoiceOptionsText(q?.type === '单选题' ? q : null),
            answerText: q?.type === '单选题' ? q.answer : ''
        },
        '多选题': {
            optionsText: getChoiceOptionsText(q?.type === '多选题' ? q : null),
            answerText: q?.type === '多选题' ? q.answer : ''
        },
        '判断题': { answer: q?.type === '判断题' ? normalizeJudgeAnswer(q.answer) : '正确', mode: '正确 / 错误' },
        '填空题': { answerText: q?.type === '填空题' ? q.answer : '' },
        '简答题': { reference: q?.type === '简答题' ? q.answer : '' },
        '排序题': {
            itemsText: q?.type === '排序题' && q.options && !['—', '主观作答'].includes(q.options)
                ? q.options.split(' / ').map((opt, i) => `${i + 1}. ${opt.replace(/^[A-Z0-9]+[.、]?\s*/, '')}`).join('\n')
                : '1. \n2. \n3. \n4. ',
            answerText: q?.type === '排序题' ? q.answer : ''
        }
    };
    syncQuestionRichContent();
    setQuestionType(document.getElementById('qType')?.value || '单选题', true);
}

function getQuestionAnswerMode(type = document.getElementById('qType')?.value) {
    if (['填空题', '简答题'].includes(type)) return type === '填空题' ? 'blank' : 'essay';
    if (type === '单选题' || type === '判断题') return 'single';
    return 'multiple';
}

function setQuestionType(type, keepAnswer = false) {
    const editor = document.querySelector('.qb-question-editor');
    if (!editor) return;
    if (editor.currentType && editor.currentType !== type) {
        saveCurrentQuestionTypeState(editor.currentType);
    } else {
        saveCurrentQuestionTypeState(type);
    }
    const help = document.getElementById('qAnswerHelp');
    const title = document.getElementById('qDynamicTitle');
    const state = editor.typeState[type];
    editor.currentType = type;
    document.getElementById('qAnswer').value = getStateAnswer(type, state);
    if (title) title.textContent = getQuestionDynamicTitle(type);
    if (help) help.textContent = getQuestionDynamicHelp(type);
    const blankBtn = document.getElementById('qInsertBlankBtn');
    if (blankBtn) blankBtn.style.display = type === '填空题' ? '' : 'none';
    const contentEditor = document.getElementById('qContentEditor');
    if (contentEditor) {
        contentEditor.placeholder = type === '填空题'
            ? '例如：中国的首都是____，简称____。'
            : '请输入题目内容';
    }
    renderQuestionDynamicArea(type);
    syncQuestionAnswerState();
}

function insertQuestionBlank() {
    const editor = document.getElementById('qContentEditor');
    if (!editor) return;
    editor.focus();
    const start = editor.selectionStart ?? editor.value.length;
    const end = editor.selectionEnd ?? editor.value.length;
    editor.value = `${editor.value.slice(0, start)}____${editor.value.slice(end)}`;
    editor.selectionStart = editor.selectionEnd = start + 4;
    syncQuestionRichContent();
}

function syncQuestionRichContent() {
    const editor = document.getElementById('qContentEditor');
    const input = document.getElementById('qContent');
    if (!editor || !input) return;
    input.value = editor.value.trim();
}

function openQuestionMediaPicker(type) {
    const inputMap = {
        image: 'qMediaImageInput',
        audio: 'qMediaAudioInput',
        video: 'qMediaVideoInput'
    };
    document.getElementById(inputMap[type])?.click();
}

function insertQuestionMediaFromInput(type, input) {
    const file = input?.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const name = qbEscapeHtml(file.name);
    const labelMap = { image: '图片', audio: '音频', video: '视频' };
    const previewMap = {
        image: `<img src="${url}" alt="${name}">`,
        audio: `<div class="qb-stem-asset-audio-icon">音频</div><audio controls src="${url}"></audio>`,
        video: `<video controls src="${url}"></video>`
    };
    const list = document.getElementById('qStemAssetList');
    if (list) {
        list.insertAdjacentHTML('beforeend', `
            <div class="qb-stem-asset-card ${type}">
                <button type="button" class="qb-stem-asset-remove" title="移除素材" onclick="removeQuestionStemAsset(this)">×</button>
                <div class="qb-stem-asset-preview">${previewMap[type] || ''}</div>
                <div class="qb-stem-asset-name">${labelMap[type] || '素材'} · ${name}</div>
            </div>`);
    }
    input.value = '';
    syncQuestionRichContent();
}

function removeQuestionStemAsset(button) {
    button?.closest?.('.qb-stem-asset-card')?.remove();
}

function getQuestionDynamicTitle(type) {
    return {
        '单选题': '选项设置',
        '多选题': '选项设置',
        '判断题': '判断题设置',
        '填空题': '填空设置',
        '简答题': '简答题设置',
        '排序题': '排序项设置'
    }[type] || '题型配置';
}

function getQuestionDynamicHelp(type) {
    return {
        '单选题': '选项每行一个，格式：A. 选项内容；正确答案填写一个字母，如 A',
        '多选题': '选项每行一个，格式：A. 选项内容；正确答案填写多个字母，如 AB',
        '判断题': '选择正确或错误，可切换文案模式',
        '填空题': '多个填空按题干中的空位顺序填写，答案之间使用 # 分割',
        '简答题': '填写参考答案',
        '排序题': '按格式录入排序项，并手动填写正确顺序'
    }[type] || '根据题型配置答案';
}

function renderQuestionDynamicArea(type) {
    const area = document.getElementById('qDynamicArea');
    const editor = document.querySelector('.qb-question-editor');
    if (!area || !editor) return;
    if (['单选题', '多选题'].includes(type)) {
        const state = editor.typeState[type];
        const answerPlaceholder = type === '单选题' ? '例如：A' : '例如：AB';
        const answerHint = type === '单选题'
            ? '填写一个正确选项字母，例如 A。'
            : '填写多个正确选项字母，不需要分隔符，例如 AB。';
        area.innerHTML = `
            <div class="form-group qb-field-full">
                <label><span class="req">*</span> 选项</label>
                <textarea class="form-control qb-options-textarea" id="qChoiceOptionsText" placeholder="请按格式输入，每行一个选项&#10;A. 选项一&#10;B. 选项二&#10;C. 选项三&#10;D. 选项四">${state.optionsText || ''}</textarea>
                <div class="hint">每行一个选项，格式：A. 选项内容。选项标识请使用大写字母 A、B、C、D。</div>
            </div>
            <div class="form-group qb-inline-field">
                <label><span class="req">*</span> 正确答案</label>
                <input class="form-control" id="qChoiceAnswerText" value="${state.answerText || ''}" placeholder="${answerPlaceholder}">
                <div class="hint">${answerHint}</div>
            </div>`;
        return;
    }
    if (type === '判断题') {
        const state = editor.typeState[type];
        area.innerHTML = `
            <div class="form-group qb-inline-field"><label>判断文案模式</label>
                <select class="form-control" id="qJudgeMode" onchange="changeJudgeMode(this.value)">
                    ${['正确 / 错误', '是 / 否'].map(v => `<option ${state.mode === v ? 'selected' : ''}>${v}</option>`).join('')}
                </select>
            </div>
            <div class="qb-answer-picker qb-answer-picker-standalone">
                <label><span class="req">*</span> 正确答案</label>
                <div id="qJudgeChoices" class="qb-answer-choice-row"></div>
            </div>`;
        renderJudgeChoices();
        return;
    }
    if (type === '填空题') {
        const state = editor.typeState[type];
        area.innerHTML = `
            <div class="form-group qb-field-full">
                <label><span class="req">*</span> 正确答案</label>
                <input class="form-control" id="qBlankAnswerText" value="${state.answerText || ''}" placeholder="例如：北京#京">
                <div class="hint">多个填空按题干中的空位顺序填写，答案之间使用 # 分割。</div>
            </div>
            `;
        return;
    }
    if (type === '简答题') {
        const state = editor.typeState[type];
        area.innerHTML = `
            <div class="form-group qb-field-full"><label><span class="req">*</span> 参考答案</label><textarea class="form-control qb-reference-answer" id="qReferenceAnswer" placeholder="填写参考答案" oninput="saveCurrentQuestionTypeState();syncQuestionAnswerState()">${state.reference || ''}</textarea></div>`;
        return;
    }
    const state = editor.typeState[type];
    area.innerHTML = `
        <div class="form-group qb-field-full">
            <label><span class="req">*</span> 排序项内容</label>
            <textarea class="form-control qb-sort-textarea" id="qSortItemsText" placeholder="请按格式输入，每行一个排序项&#10;1. 起床&#10;2. 刷牙&#10;3. 吃早饭&#10;4. 出门">${state.itemsText || ''}</textarea>
            <div class="hint">格式示例：1. 起床、2. 刷牙。每行一个排序项。</div>
        </div>
        <div class="form-group qb-inline-field">
            <label><span class="req">*</span> 正确顺序</label>
            <input class="form-control" id="qSortAnswerText" value="${state.answerText || ''}" placeholder="例如：3124">
            <div class="hint">按排序项编号填写正确顺序，例如 3124。</div>
        </div>`;
}

function syncQuestionAnswerState() {
    const editor = document.querySelector('.qb-question-editor');
    const type = document.getElementById('qType')?.value || '单选题';
    const answerEl = document.getElementById('qAnswer');
    const optionsEl = document.getElementById('qOptions');
    if (!answerEl) return;
    saveCurrentQuestionTypeState();
    const state = editor?.typeState?.[type];
    answerEl.value = getStateAnswer(type, state);
    const options = getStateOptionsText(type, state);
    if (optionsEl) optionsEl.value = options;
}

document.addEventListener('input', (e) => {
    if (e.target?.closest?.('.qb-question-editor')) {
        syncQuestionAnswerState();
    }
});

function saveCurrentQuestionTypeState(typeOverride) {
    const editor = document.querySelector('.qb-question-editor');
    const type = typeOverride || document.getElementById('qType')?.value || editor?.currentType || '单选题';
    const state = editor?.typeState?.[type];
    if (!state) return;
    if (['单选题', '多选题'].includes(type)) {
        state.optionsText = document.getElementById('qChoiceOptionsText')?.value || state.optionsText || '';
        state.answerText = (document.getElementById('qChoiceAnswerText')?.value || state.answerText || '').toUpperCase().replace(/[^A-Z]/g, '');
    }
    if (type === '判断题') state.mode = document.getElementById('qJudgeMode')?.value || state.mode;
    if (type === '填空题') {
        state.answerText = document.getElementById('qBlankAnswerText')?.value || state.answerText || '';
    }
    if (type === '简答题') {
        state.reference = document.getElementById('qReferenceAnswer')?.value || state.reference;
    }
    if (type === '排序题') {
        state.itemsText = document.getElementById('qSortItemsText')?.value || state.itemsText || '';
        state.answerText = document.getElementById('qSortAnswerText')?.value || state.answerText || '';
    }
}

function getStateAnswer(type, state) {
    if (!state) return '';
    if (['单选题', '多选题'].includes(type)) return state.answerText || '';
    if (type === '判断题') return state.answer || '';
    if (type === '填空题') return state.answerText || '';
    if (type === '简答题') return state.reference || '';
    if (type === '排序题') return state.answerText || '';
    return '';
}

function getStateOptionsText(type, state) {
    if (!state) return '';
    if (['单选题', '多选题'].includes(type)) return parseChoiceOptionsText(state.optionsText).map(opt => `${opt.label}. ${opt.text || '选项内容'}`).join(' / ');
    if (type === '判断题') return getJudgeLabels(state.mode).join(' / ');
    if (type === '排序题') return parseSortItemsText(state.itemsText).map(item => `${item.label}. ${item.text || '排序项内容'}`).join(' / ');
    return type === '填空题' ? '—' : '主观作答';
}

function getChoiceOptionsText(q) {
    if (q?.options && !['—', '主观作答'].includes(q.options)) {
        return q.options.split(' / ').map(opt => opt.replace(/^([A-Z])[.、]?\s*/, '$1. ')).join('\n');
    }
    return 'A. \nB. \nC. \nD. ';
}

function parseChoiceOptionsText(text = '') {
    return text.split('\n').map(line => line.trim()).filter(Boolean).map((line, index) => {
        const match = line.match(/^([A-Z])[.、]\s*(.*)$/i);
        return {
            label: match ? match[1].toUpperCase() : String.fromCharCode(65 + index),
            text: match ? match[2] : line
        };
    });
}

function normalizeJudgeAnswer(answer) {
    if (['错误', '否', '错'].includes(answer)) return '错误';
    return '正确';
}

function getJudgeLabels(mode) {
    if (mode === '是 / 否') return ['是', '否'];
    return ['正确', '错误'];
}

function changeJudgeMode(mode) {
    const editor = document.querySelector('.qb-question-editor');
    const state = editor?.typeState?.['判断题'];
    if (!state) return;
    const oldAnswerIndex = getJudgeLabels(state.mode).indexOf(state.answer);
    state.mode = mode;
    state.answer = getJudgeLabels(mode)[oldAnswerIndex >= 0 ? oldAnswerIndex : 0];
    renderJudgeChoices();
    syncQuestionAnswerState();
}

function renderJudgeChoices() {
    const editor = document.querySelector('.qb-question-editor');
    const state = editor?.typeState?.['判断题'];
    const wrap = document.getElementById('qJudgeChoices');
    if (!state || !wrap) return;
    wrap.innerHTML = getJudgeLabels(state.mode).map(label => `
        <label><input type="radio" name="qJudgeAnswer" value="${label}" ${state.answer === label ? 'checked' : ''} onchange="stateJudgeAnswer(this.value)"> ${label}</label>
    `).join('');
}

function stateJudgeAnswer(value) {
    const state = document.querySelector('.qb-question-editor')?.typeState?.['判断题'];
    if (!state) return;
    state.answer = value;
    syncQuestionAnswerState();
}

function parseSortItemsText(text = '') {
    return text.split('\n').map(line => line.trim()).filter(Boolean).map((line, index) => {
        const match = line.match(/^(\d+)[.、]\s*(.*)$/);
        return {
            label: match ? match[1] : String(index + 1),
            text: match ? match[2] : line
        };
    });
}

function validateQuestionForm() {
    syncQuestionAnswerState();
    syncQuestionRichContent();
    const type = document.getElementById('qType')?.value || '';
    const bank = document.getElementById('qBank')?.value || '';
    const content = document.getElementById('qContent')?.value.trim();
    const answer = document.getElementById('qAnswer')?.value.trim();
    const state = document.querySelector('.qb-question-editor')?.typeState?.[type];
    if (!type) { alert('请选择题型'); return false; }
    if (!bank) { alert('请选择题库'); return false; }
    if (!qbContentSummary(content)) { alert('请填写题目内容'); return false; }
    if (['单选题', '多选题'].includes(type)) {
        const options = parseChoiceOptionsText(state?.optionsText || '');
        const labels = options.map(opt => opt.label);
        const answerChars = (state?.answerText || '').split('');
        if (!options.length || options.some(opt => !opt.text.trim())) {
            alert('请按 A. B. 格式填写选项内容');
            return false;
        }
        if (type === '单选题' && answerChars.length !== 1) {
            alert('单选题正确答案请填写一个字母，例如 A');
            return false;
        }
        if (type === '多选题' && answerChars.length < 2) {
            alert('多选题正确答案请填写多个字母，例如 AB');
            return false;
        }
        if (answerChars.some(label => !labels.includes(label))) {
            alert('正确答案需来自选项标识，例如 A 或 AB');
            return false;
        }
    }
    if (type === '填空题' && !state?.answerText?.trim()) {
        alert('多个填空按题干中的空位顺序填写，答案之间使用 # 分割');
        return false;
    }
    if (type === '排序题') {
        const items = parseSortItemsText(state?.itemsText || '');
        const answerChars = (state?.answerText || '').split('');
        const labels = items.map(item => item.label);
        if (!items.length || items.some(item => !item.text.trim())) {
            alert('请按 1. 2. 格式填写排序项内容');
            return false;
        }
        if (!state?.answerText?.trim() || answerChars.some(label => !labels.includes(label))) {
            alert('请填写正确顺序，例如 3124，且编号需来自排序项');
            return false;
        }
    }
    if (!answer) { alert('请设置正确答案'); return false; }
    return true;
}

function getQuestionFormValues() {
    syncQuestionAnswerState();
    syncQuestionRichContent();
    const type = document.getElementById('qType')?.value || '单选题';
    const bank = document.getElementById('qBank')?.value || QUESTION_BANK_CHOICES[0];
    const content = document.getElementById('qContent')?.value.trim() || '';
    const answer = document.getElementById('qAnswer')?.value.trim() || '';
    const analysis = document.getElementById('qAnalysis')?.value.trim() || '';
    const state = document.querySelector('.qb-question-editor')?.typeState?.[type] || {};
    return { type, bank, content, answer, analysis, state };
}

// ===== 预览题目 =====
function previewQuestion(qId) {
    const questions = generateQuestions(currentBankId, 15);
    const q = questions.find(q => q.id === qId);
    if (!q) return;
    openModal('题目预览', `
        <div style="display:grid;gap:14px">
            <div style="display:flex;gap:8px;align-items:center">
                <span class="badge ${questionTypeBadgeClass(q.type)}">${q.type}</span>
                <span class="badge ${q.status === '启用' ? 'badge-green' : 'badge-gray'}">${q.status}</span>
            </div>
            <div style="font-size:var(--font-size-base);font-weight:600;line-height:1.6">${q.content}</div>
            <div style="background:var(--color-neutral-50);padding:var(--spacing-md);border-radius:var(--radius-md);border:1px solid var(--border-light)">
                ${q.options.split(' / ').map((opt, i) => `<div style="padding:6px 0;${i > 0 ? 'border-top:1px solid var(--border-light)' : ''};display:flex;align-items:center;gap:var(--spacing-xs)">
                    <div style="width:22px;height:22px;border-radius:50%;border:1.5px solid ${q.answer.includes(opt.charAt(0)) ? 'var(--success)' : 'var(--border)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;${q.answer.includes(opt.charAt(0)) ? 'background:var(--success-light);color:var(--success);font-weight:700' : 'color:var(--text-muted)'};font-size:11px">${opt.charAt(0)}</div>
                    <span style="font-size:var(--font-size-xs);${q.answer.includes(opt.charAt(0)) ? 'color:var(--success);font-weight:600' : ''}">${opt.substring(3)}</span>
                </div>`).join('')}
            </div>
            <div style="display:flex;gap:var(--spacing-md);padding-top:var(--spacing-xs);border-top:1px solid var(--border-light)">
                <span style="color:var(--text-muted);font-size:var(--font-size-xs)">正确答案：</span>
                <strong style="color:var(--success)">${q.answer}</strong>
            </div>
        </div>
    `, null, { confirmText: '关闭', hideCancel: true });
}

// ===== 删除题目 =====
function deleteQuestion(qId) {
    openModal('删除确认', '<div style="text-align:center;padding:10px 0"><div style="font-size:40px;margin-bottom:12px"></div><p>确定删除该题目吗？</p><p style="color:var(--danger);font-size:12px;margin-top:8px">操作不可恢复！</p></div>', () => {
        alert('题目已删除！（演示提示）');
        openQuestionManage(currentBankId);
    }, { confirmText: '确认删除', danger: true });
}

// ===== 批量导入 =====
function openBatchImportModal() {
    const bank = questionBanks.find(b => b.id === currentBankId);
    openModal('批量导入题目', `
        <div class="info-box blue">💡 请下载模板文件，按照模板格式填写后上传。支持 Excel (.xlsx) 格式。</div>
        <div class="form-group"><label>下载模板</label>
            <button class="btn btn-outline btn-sm" onclick="alert('模板下载中...（演示提示）')">下载导入模板</button>
        </div>
        <div class="form-group"><label>上传文件</label>
            <div style="border:2px dashed var(--border);border-radius:var(--radius-md);padding:32px;text-align:center;cursor:pointer;transition:var(--t-fast)" onmouseover="this.style.borderColor='var(--primary)';this.style.background='var(--primary-light)'" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--surface)'">
                <div style="font-size:32px;margin-bottom:8px">📤</div>
                <div style="font-weight:600;color:var(--text-secondary)">点击或拖拽文件到此处</div>
                <div style="font-size:12px;color:var(--text-muted);margin-top:4px">支持 .xlsx 格式，单次最多 500 道题目</div>
            </div>
        </div>
        <div class="form-group"><label>导入选项</label>
            <div class="config-block">
                <div class="sw-row"><div class="sw-text"><div class="sw-label">导入后自动启用</div></div><label class="switch"><input type="checkbox" checked><span class="sw-slider"></span></label></div>
            </div>
        </div>
    `, () => {
        alert('题目导入成功！（演示提示）');
        openQuestionManage(currentBankId);
    }, { confirmText: '开始导入' });
}
