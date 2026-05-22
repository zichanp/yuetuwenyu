/* practice-mgmt.js — 答题练习管理 */

const PRACTICE_ITEMS = [
  {
    id: 'prac-1',
    name: '第一场考试 · 模拟练习',
    scope: '场次级',
    relationType: '考试场次',
    relation: '第一场考试',
    mode: '模拟考试',
    source: '按第一场考试组卷规则生成模拟试卷',
    time: '2026-06-06 09:00 - 2026-06-20 22:00',
    participants: 186,
    attempts: 342,
    avg: '88%',
    updatedAt: '2026-05-28 14:20',
    status: '练习中',
    createdAt: '2026-05-28 14:20'
  },
  {
    id: 'prac-2',
    name: '图书馆知识题库刷题',
    scope: '活动级',
    relationType: '答题闯关',
    relation: '答题闯关活动',
    mode: '题库刷题',
    source: '图书馆知识题库、历史文化题库',
    time: '2026-06-01 00:00 - 2026-06-30 23:59',
    participants: 268,
    attempts: 916,
    avg: '76%',
    updatedAt: '2026-05-25 10:12',
    status: '练习中',
    createdAt: '2026-05-25 10:12'
  },
  {
    id: 'prac-3',
    name: '每日答题 · 题库刷题',
    scope: '活动级',
    relationType: '每日答题',
    relation: '每日答题活动',
    mode: '题库刷题',
    source: '非遗知识题库',
    time: '2026-06-10 09:00 - 2026-06-25 21:00',
    participants: 0,
    attempts: 0,
    avg: '-',
    updatedAt: '2026-06-02 16:45',
    status: '活动未开放',
    createdAt: '2026-06-02 16:45'
  },
  {
    id: 'prac-4',
    name: '第二场考试 · 模拟练习',
    scope: '场次级',
    relationType: '考试场次',
    relation: '第二场考试',
    mode: '模拟考试',
    source: '按第二场考试组卷规则生成模拟试卷',
    time: '2026-05-01 09:00 - 2026-05-10 20:00',
    participants: 142,
    attempts: 205,
    avg: '87%',
    updatedAt: '2026-04-24 11:30',
    status: '练习已结束',
    createdAt: '2026-04-24 11:30'
  }
];

const PRACTICE_RECORDS = [
  { id: 'rec-1', user: '王小明', phone: '138****1234', org: '生产部', practiceId: 'prac-1', practiceName: '第一场考试 · 模拟练习', relation: '第一场考试', mode: '模拟考试', seq: 3, total: 25, correct: 22, wrong: 3, accuracy: '88%', score: 92, duration: '18分42秒', submittedAt: '2026-06-12 15:30' },
  { id: 'rec-2', user: '李小红', phone: '139****5678', org: '技术部', practiceId: 'prac-2', practiceName: '图书馆知识题库刷题', relation: '答题闯关活动', mode: '题库刷题', seq: 2, total: 40, correct: 34, wrong: 6, accuracy: '85%', score: '-', duration: '24分18秒', submittedAt: '2026-06-12 10:20' },
  { id: 'rec-3', user: '张小刚', phone: '137****9012', org: '销售部', practiceId: 'prac-2', practiceName: '图书馆知识题库刷题', relation: '答题闯关活动', mode: '题库刷题', seq: 1, total: 40, correct: 27, wrong: 13, accuracy: '68%', score: '-', duration: '31分06秒', submittedAt: '2026-06-11 19:05' },
  { id: 'rec-4', user: '赵一一', phone: '136****7788', org: '综合办公室', practiceId: 'prac-4', practiceName: '第二场考试 · 模拟练习', relation: '第二场考试', mode: '模拟考试', seq: 1, total: 30, correct: 26, wrong: 4, accuracy: '87%', score: 86, duration: '20分12秒', submittedAt: '2026-05-08 16:44' }
];

const PRACTICE_DETAIL_QUESTIONS = [
  { no: 1, type: '单选题', title: '以下哪一项最符合正式考试前模拟练习的目标？', userAnswer: 'B', correctAnswer: 'B', ok: true, score: 4, analysis: '模拟练习用于熟悉题型、流程和考试节奏，不计入正式成绩。' },
  { no: 2, type: '多选题', title: '题库刷题默认会展示哪些反馈内容？', userAnswer: 'A、B、C', correctAnswer: 'A、B、C', ok: true, score: 6, analysis: '题库刷题固定即时显示对错、正确答案和解析。' },
  { no: 3, type: '判断题', title: '练习成绩会计入正式考试排名。', userAnswer: '正确', correctAnswer: '错误', ok: false, score: 0, analysis: '练习仅用于自测和后台统计，不计入正式成绩、排名或评奖。' },
  { no: 4, type: '单选题', title: '随机练习同一次练习内是否允许重复题目？', userAnswer: '允许', correctAnswer: '不允许', ok: false, score: 0, analysis: '同一次随机练习内题目不可重复，多次练习之间允许重复抽题。' }
];

const PRACTICE_ACTIVITY_BANK_RULES = [
  { bank: '图书馆知识题库', type: '全部标准答案题', count: 10, score: 1 },
  { bank: '历史文化题库', type: '全部标准答案题', count: 10, score: 1 },
  { bank: '非遗知识题库', type: '全部标准答案题', count: 10, score: 1 }
];

let practiceCreateMode = 'exam';
let practiceQuestionWay = 'sequence';

registerPage('practice-list', () => renderPracticeListPage());
registerPage('practice-create', () => renderPracticeCreatePage());
registerPage('practice-records', () => renderPracticeRecordsPage());

function practiceStatusBadge(status) {
  const map = {
    '活动未开放': 'badge-gray',
    '练习未开始': 'badge-yellow',
    '练习中': 'badge-green',
    '练习已结束': 'badge-blue',
    '启用': 'badge-green'
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function practiceModeBadge(mode) {
  return `<span class="badge ${mode === '模拟考试' ? 'badge-blue' : 'badge-green'}">${mode}</span>`;
}

function practiceScopeBadge(scope) {
  return `<span class="badge ${scope === '场次级' ? 'badge-blue' : 'badge-green'}">${scope}</span>`;
}

function renderPracticeListPage() {
  const rows = PRACTICE_ITEMS.map(item => `
    <tr>
      <td><strong>${item.name}</strong><div class="table-subtext">${item.source}</div></td>
      <td><strong>${item.relation}</strong><div class="table-subtext">${item.relationType}</div></td>
      <td>${practiceScopeBadge(item.scope)}</td>
      <td>${practiceModeBadge(item.mode)}</td>
      <td>${item.time}</td>
      <td>${item.participants}</td>
      <td>${item.attempts}</td>
      <td><strong>${item.avg}</strong></td>
      <td>${practiceStatusBadge(item.status)}</td>
      <td>${item.updatedAt}</td>
      <td>
        <span class="action-link" onclick="navigateTo('practice-records', { params: { practiceId: '${item.id}' } })">查看记录</span>
      </td>
    </tr>`).join('');

  return `
    <div class="practice-page">
      <div class="practice-page-head">
        <div>
          <h2>练习记录</h2>
          <p>集中查看本活动的练习状态与参与记录；如需调整练习配置，请点击“前往活动列表”，再点击对应活动的“编辑活动”按钮进行管理。</p>
        </div>
        <button class="btn btn-outline" onclick="navigateTo('quiz-activity-list')">前往活动列表</button>
      </div>

      <div class="practice-table-card">
        <div class="practice-card-title"><strong>练习能力列表</strong><span>共 ${PRACTICE_ITEMS.length} 条</span></div>
        ${tableWrap(['练习名称', '关联对象', '配置范围', '练习模式', '开放时间', '参与人数', '练习次数', '平均表现', '状态', '更新时间', '操作'], rows)}
      </div>
    </div>`;
}

function renderPracticeCreatePage() {
  return `
    <div class="practice-page">
      <div class="review-crumb-card platform-review-back">
        <span class="action-link muted" onclick="goBackFromPage('practice-create')">‹ 返回练习列表</span>
        <span class="review-divider"></span>
        <strong>新建练习</strong>
      </div>

      <div class="practice-page-head">
        <div>
          <h2>新建练习</h2>
          <p>练习活动用于用户考前自测和复习，不单独报名，练习成绩不计入正式考试成绩。</p>
        </div>
        <div class="btn-group"><button class="btn btn-outline">保存草稿</button><button class="btn btn-primary" onclick="savePracticeDraft()">立即发布</button></div>
      </div>

      <div class="practice-create-layout">
        <div class="practice-form-stack">
          ${renderPracticeBasicSection()}
          ${renderPracticeModeSection()}
          ${renderPracticeQuestionSection()}
          ${renderPracticeRulesSection()}
          ${renderPracticeDevRulesSection()}
        </div>
      </div>
    </div>`;
}

function renderPracticeBasicSection() {
  return `
    <section class="practice-form-card" id="practiceBasic">
      <div class="practice-section-title"><strong>基本信息</strong></div>
      <div class="practice-form-grid two">
        <label><span><em>*</em>练习名称</span><input class="form-control" value="华服知识竞赛考前练习"></label>
        <label class="span-2"><span>练习简介</span><textarea class="form-control" rows="3" placeholder="用于说明练习目的和规则">用于正式考试前熟悉题型、流程和重点题库内容。</textarea></label>
        <label><span><em>*</em>练习开始时间</span><input class="form-control" type="datetime-local" value="2026-06-06T09:00"></label>
        <label><span><em>*</em>练习结束时间</span><input class="form-control" type="datetime-local" value="2026-06-20T22:00"></label>
      </div>
      <div class="practice-check-row">
        <span>用户端展示位置</span>
        <label><input type="checkbox" checked> 正式考试详情页展示</label>
        <label><input type="checkbox" checked> 独立练习入口展示</label>
      </div>
    </section>`;
}

function renderPracticeModeSection() {
  return `
    <section class="practice-form-card" id="practiceMode">
      <div class="practice-section-title"><strong>练习模式</strong></div>
      <div class="practice-mode-grid">
        ${practiceModeCard('exam', '模拟考试', '按已有试卷进行完整模拟答题，默认显示倒计时，适合正式考试前的仿真演练。')}
        ${practiceModeCard('bank', '题库刷题', '基于指定题库进行刷题练习，答题后即时显示对错、答案和解析，适合考前复习。')}
      </div>
    </section>`;
}

function renderPracticeQuestionSection() {
  return `
    <section class="practice-form-card" id="practiceQuestion">
      <div class="practice-section-title"><strong>题目配置</strong></div>
      <div id="practiceExamQuestion" style="display:${practiceCreateMode === 'exam' ? 'block' : 'none'}">
        <div class="practice-fixed-row"><span>题目来源</span><strong>选择已有试卷</strong><button class="btn btn-outline btn-sm" onclick="openPracticePaperPicker()">选择试卷</button></div>
        <div class="practice-selected-card">
          <div><span>已选择试卷</span><strong>2026 华服知识竞赛模拟试卷</strong></div>
          <div><span>试卷类型</span><strong>固定题目</strong></div>
          <div><span>题目数量</span><strong>25 题</strong></div>
          <div><span>试卷总分</span><strong>100 分</strong></div>
          <div><span>答题时长</span><strong>20 分钟</strong></div>
        </div>
        <div class="practice-warning">当前模拟考试可能包含正式考试相关题目，如开启答案或解析展示，可能影响正式考试公平性，请谨慎配置。</div>
      </div>
      <div id="practiceBankQuestion" style="display:${practiceCreateMode === 'bank' ? 'block' : 'none'}">
        <div class="practice-fixed-row"><span>题目来源</span><strong>默认使用本活动已配置题库</strong></div>
        ${renderPracticeActivityBankRules()}
        ${renderBankQuestionConfig()}
      </div>
    </section>`;
}

function renderPracticeActivityBankRules() {
  const total = PRACTICE_ACTIVITY_BANK_RULES.reduce((sum, rule) => sum + rule.count * rule.score, 0);
  return `
    <div class="practice-bank-rules">
      <div class="practice-bank-rules-head"><strong>抽题规则</strong><span>（${PRACTICE_ACTIVITY_BANK_RULES.length}条）</span></div>
      <div class="practice-bank-rule-grid head">
        <span>题库</span><span>题型</span><span>数量</span><span>分值</span><span>小计</span><span>操作</span>
      </div>
      ${PRACTICE_ACTIVITY_BANK_RULES.map((rule, index) => `
        <div class="practice-bank-rule-grid">
          <select class="form-control"><option>${rule.bank}</option><option>图书馆知识题库</option><option>历史文化题库</option><option>非遗知识题库</option></select>
          <select class="form-control"><option>${rule.type}</option><option>单选题</option><option>多选题</option><option>判断题</option></select>
          <input class="form-control" type="number" value="${rule.count}" min="1">
          <input class="form-control" type="number" value="${rule.score}" min="0.5" step="0.5">
          <strong>${rule.count * rule.score}分</strong>
          <button class="practice-icon-link danger" title="删除本条规则" aria-label="删除本条规则">删除</button>
        </div>`).join('')}
      <div class="practice-bank-rules-foot">
        <button class="btn btn-outline btn-sm" onclick="openPracticeBankPicker()">+ 添加规则</button>
        <span>小计分值：<strong>${total}</strong> 分</span>
      </div>
    </div>`;
}

function renderBankQuestionConfig() {
  return `
    <div class="practice-subconfig">
      <div class="practice-subtitle">${practiceQuestionWay === 'random' ? '随机练习配置' : '顺序练习配置'}</div>
      <div class="practice-form-grid">
        <label><span>出题顺序</span><select class="form-control" onchange="setPracticeQuestionWay(this.value)">
          <option value="sequence" ${practiceQuestionWay === 'sequence' ? 'selected' : ''}>按题库题目顺序依次出题</option>
          <option value="random" ${practiceQuestionWay === 'random' ? 'selected' : ''}>每次从题库中随机抽题</option>
        </select></label>
      </div>
      ${practiceQuestionWay === 'random' ? `<div class="practice-form-grid three" style="margin-top:12px">
        <label><span><em>*</em>每次随机抽题数</span><input class="form-control" type="number" value="10" min="1"></label>
        <label><span>同一次练习重复题目</span><input class="form-control" value="固定不允许重复" disabled></label>
        <label><span>多次练习重复抽题</span><input class="form-control" value="允许重复" disabled></label>
      </div>` : `<div class="practice-check-row"><label><input type="checkbox" checked> 记录练习进度</label><label><input type="checkbox" checked> 下次进入继续上次进度</label></div>`}
    </div>`;
}

function renderPracticeRulesSection() {
  return `
    <section class="practice-form-card" id="practiceRules">
      <div class="practice-section-title"><strong>答题规则</strong></div>
      <div class="practice-inline-config">
        <span>练习次数限制</span>
        <em>每人每天最多练习</em>
        <input class="form-control" type="number" value="3" min="1">
        <em>次</em>
      </div>
    </section>`;
}

function renderPracticeDevRulesSection() {
  return `
    <section class="practice-form-card practice-dev-rules">
      <div class="practice-section-title"><strong>研发实现默认规则</strong></div>
      <div class="practice-dev-rule-list">
        <div><strong>练习对象</strong><span>练习无需报名，默认所有登录用户均可练习；不再提供“仅已报名用户可练习”配置。</span></div>
        <div><strong>关联正式考试</strong><span>系统默认支持关联正式考试，练习归属于当前考试活动，可在正式考试详情页展示练习入口。</span></div>
        <div><strong>提前提交</strong><span>系统默认允许用户提前提交练习，不提供管理员开关。</span></div>
        <div><strong>练习次数</strong><span>仅保留“每人每天最多练习 N 次”，默认值为 3。</span></div>
        <div><strong>答题明细</strong><span>系统默认允许用户查看答题明细，不提供管理员开关。</span></div>
        <div><strong>模拟考试结果</strong><span>交卷后展示成绩、答案解析展示、是否生成错题等不在当前配置页提供独立开关；如后续需要，由需求单独扩展。</span></div>
      </div>
    </section>`;
}

function renderPracticeRecordsPage() {
  const practiceId = currentPageParams?.practiceId || '';
  const records = practiceId ? PRACTICE_RECORDS.filter(item => item.practiceId === practiceId) : PRACTICE_RECORDS;
  const rows = records.map(item => `
    <tr>
      <td>${item.user}</td>
      <td>${item.phone}</td>
      <td>${item.org}</td>
      <td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${item.practiceName}">${item.practiceName}</td>
      <td>${item.relation}</td>
      <td>${practiceModeBadge(item.mode)}</td>
      <td>第 ${item.seq} 次</td>
      <td>${item.total}</td>
      <td>${item.correct}</td>
      <td>${item.wrong}</td>
      <td><strong>${item.accuracy}</strong></td>
      <td>${item.score}</td>
      <td>${item.duration}</td>
      <td>${item.submittedAt}</td>
      <td><span class="action-link" onclick="openPracticeRecordDrawer('${item.id}')">查看答题详情</span></td>
    </tr>`).join('');
  return `
    <div class="practice-page">
      <div class="practice-page-head">
        <div><h2>练习提交明细</h2><p>按练习能力、关联对象和用户维度查询提交记录，可进入右侧抽屉浏览每道题答题明细。</p></div>
        <button class="btn btn-outline">导出练习记录</button>
      </div>
      <div class="practice-filter-card">
        <div class="practice-filter-grid records">
          <label><span>练习名称</span><select class="form-control"><option>全部练习</option>${PRACTICE_ITEMS.map(item => `<option ${item.id === practiceId ? 'selected' : ''}>${item.name}</option>`).join('')}</select></label>
          <label><span>关联对象</span><select class="form-control"><option>全部</option>${Array.from(new Set(PRACTICE_ITEMS.map(item => item.relation))).map(name => `<option>${name}</option>`).join('')}</select></label>
          <label><span>练习模式</span><select class="form-control"><option>全部</option><option>题库刷题</option><option>模拟考试</option></select></label>
          <label><span>用户姓名</span><input class="form-control" placeholder="请输入用户姓名"></label>
          <label><span>手机号</span><input class="form-control" placeholder="请输入手机号"></label>
          <label><span>所属单位</span><input class="form-control" placeholder="请输入所属单位"></label>
          <label><span>提交时间</span><input class="form-control" type="date"></label>
          <div class="practice-filter-actions"><button class="btn btn-primary">搜索</button><button class="btn btn-outline">重置</button></div>
        </div>
      </div>
      <div class="practice-table-card">
        <div class="practice-card-title"><strong>练习提交记录</strong><span>共 ${records.length} 条</span></div>
        ${tableWrap(['用户姓名', '手机号', '所属单位', '练习名称', '关联对象', '练习模式', '练习次数', '题目数量', '答对', '答错', '正确率', '得分', '用时', '提交时间', '操作'], rows)}
      </div>
    </div>`;
}

function practiceMetric(label, value, hint) {
  return `<div class="practice-metric"><span>${label}</span><strong>${value}</strong><em>${hint}</em></div>`;
}

function practiceModeCard(value, title, desc) {
  return `<button type="button" class="practice-mode-card ${practiceCreateMode === value ? 'active' : ''}" onclick="setPracticeMode('${value}')"><strong>${title}</strong><span>${desc}</span></button>`;
}

function radioPill(name, value, label, activeValue, fnName) {
  return `<label class="practice-radio-pill ${activeValue === value ? 'active' : ''}"><input type="radio" name="${name}" value="${value}" ${activeValue === value ? 'checked' : ''} onchange="${fnName}('${value}')"> ${label}</label>`;
}

function setPracticeMode(mode) {
  practiceCreateMode = mode;
  if (mode === 'exam') practiceQuestionWay = 'sequence';
  navigateTo('practice-create', { params: currentPageParams || {}, source: currentPageSource, fromTabSwitch: true, reuseTabKey: activeTabKey });
}

function setPracticeQuestionWay(way) {
  practiceQuestionWay = way;
  navigateTo('practice-create', { params: currentPageParams || {}, source: currentPageSource, fromTabSwitch: true, reuseTabKey: activeTabKey });
}

function openPracticePaperPicker() {
  openModal('选择试卷', `
    <div class="practice-modal-filter"><input class="form-control" placeholder="试卷名称"><select class="form-control"><option>全部试卷类型</option><option>固定题目</option><option>随机抽题</option></select><select class="form-control"><option>可用试卷</option></select></div>
    ${tableWrap(['试卷名称', '试卷类型', '题目数量', '试卷总分', '答题时长', '更新时间', '操作'], `
      <tr><td>2026 华服知识竞赛模拟试卷</td><td>固定题目</td><td>25</td><td>100</td><td>20 分钟</td><td>2026-05-26</td><td><span class="action-link">选择</span></td></tr>
      <tr><td>华服知识竞赛随机模拟试卷</td><td>随机抽题</td><td>25</td><td>100</td><td>20 分钟</td><td>2026-05-30</td><td><span class="action-link">选择</span></td></tr>
    `)}
  `, null, { hideCancel: true, confirmText: '关闭', modalClass: 'modal-xl' });
}

function openPracticeBankPicker() {
  openModal('选择题库', `
    <div class="practice-modal-filter"><input class="form-control" placeholder="题库名称"><select class="form-control"><option>全部题型</option><option>单选题</option><option>多选题</option><option>判断题</option></select><select class="form-control"><option>启用题库</option></select></div>
    ${tableWrap(['题库名称', '题目数量', '可用题量', '题型覆盖', '状态', '操作'], `
      <tr><td>图书馆知识题库</td><td>86</td><td>82</td><td>单选/多选/判断</td><td>${practiceStatusBadge('启用')}</td><td><span class="action-link">选择</span></td></tr>
      <tr><td>历史文化题库</td><td>104</td><td>104</td><td>单选/判断</td><td>${practiceStatusBadge('启用')}</td><td><span class="action-link">选择</span></td></tr>
    `)}
  `, null, { hideCancel: true, confirmText: '关闭', modalClass: 'modal-xl' });
}

function savePracticeDraft() {
  openModal('发布校验通过', '<p>练习名称、练习时间、题目来源和题目数量均已通过校验。该练习将发布到用户端展示位置。</p>', () => navigateTo('practice-list'), { confirmText: '完成' });
}

function confirmDeletePractice(name) {
  openModal('删除练习', `<p>确定删除「<strong>${name}</strong>」吗？已产生练习记录的练习建议先下架。</p>`, null, { confirmText: '确认删除', danger: true });
}

function openPracticeRecordDrawer(recordId) {
  const record = PRACTICE_RECORDS.find(item => item.id === recordId) || PRACTICE_RECORDS[0];
  closePracticeRecordDrawer();
  const drawer = document.createElement('div');
  drawer.className = 'practice-drawer-overlay';
  drawer.id = 'practiceRecordDrawer';
  drawer.onclick = e => { if (e.target === drawer) closePracticeRecordDrawer(); };
  drawer.innerHTML = `
    <aside class="practice-drawer">
      <div class="practice-drawer-head">
        <div><strong>答题详情</strong><span>${record.user} · ${record.practiceName}</span></div>
        <button class="modal-close" onclick="closePracticeRecordDrawer()">✕</button>
      </div>
      <div class="practice-drawer-body">
        <div class="practice-detail-grid">
          ${practiceDetailField('用户姓名', record.user)}
          ${practiceDetailField('手机号', record.phone)}
          ${practiceDetailField('关联对象', record.relation)}
          ${practiceDetailField('练习模式', record.mode)}
          ${practiceDetailField('得分', record.score)}
          ${practiceDetailField('正确率', record.accuracy)}
          ${practiceDetailField('用时', record.duration)}
          ${practiceDetailField('提交时间', record.submittedAt)}
        </div>
        <div class="practice-question-list">
          ${PRACTICE_DETAIL_QUESTIONS.map(q => `
            <section class="practice-question-card ${q.ok ? 'ok' : 'wrong'}">
              <div class="practice-question-head"><strong>${q.no}. ${q.type}</strong><span>${q.ok ? '正确' : '错误'} · ${q.score} 分</span></div>
              <p>${q.title}</p>
              <div class="practice-answer-grid"><div><span>用户答案</span><strong>${q.userAnswer}</strong></div><div><span>正确答案</span><strong>${q.correctAnswer}</strong></div></div>
              <div class="practice-analysis"><span>解析</span>${q.analysis}</div>
            </section>`).join('')}
        </div>
      </div>
    </aside>`;
  document.body.appendChild(drawer);
  requestAnimationFrame(() => drawer.classList.add('show'));
}

function closePracticeRecordDrawer() {
  const drawer = document.getElementById('practiceRecordDrawer');
  if (!drawer) return;
  drawer.classList.remove('show');
  setTimeout(() => drawer.remove(), 180);
}

function practiceDetailField(label, value) {
  return `<div><span>${label}</span><strong>${value}</strong></div>`;
}
