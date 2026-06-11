/* data-mgmt.js — 报名情况 + 答题情况 + 单位数据 */

// ===== 报名情况 =====
registerPage('registration', () => {
    if (currentManageActivity.type === '活动报名') {
        return renderOfflineRegistrationPage();
    }
    const rows = REGISTRATION_ROWS;
    return `
    ${pageHeader('报名情况', '活动管理 / [当前活动] / 报名情况')}
    <section class="card registration-card">
        <div class="registration-filter">
            <label><span>用户编号</span><input class="form-control" placeholder="请输入用户编号"></label>
            <label><span>答题者</span><input class="form-control" placeholder="请输入答题者姓名"></label>
            <label><span>手机号码</span><input class="form-control" placeholder="请输入手机号码"></label>
            <label><span>答题状态</span>
                <select class="form-control">
                    <option>全部</option><option>已参与答题</option><option>未参与答题</option>
                </select>
            </label>
            <label><span>选送单位</span><input class="form-control" placeholder="请输入选送单位名称"></label>
            <label><span>报名时间</span><input class="form-control" placeholder="开始时间-结束时间"></label>
            <div class="registration-actions">
                <button class="btn btn-primary">查询</button>
                <button class="btn btn-outline">重置</button>
                <div class="registration-export">
                    <button class="btn btn-outline">导出</button>
                    <div class="registration-export-menu">
                        <button>导出当前组别</button>
                        <button>导出全部组别</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="registration-tabs">
            <button class="active">小学组</button>
            <button>初中组</button>
            <button>高中组</button>
            <button>教师组</button>
        </div>
        <div class="registration-table-wrap">
            <table class="registration-table">
                <thead>
                    <tr>
                        <th>序号</th><th>用户编号</th><th>所属组别</th><th>答题者</th><th>手机号码</th><th>选送单位</th><th>报名报表字段</th><th>报名时间</th><th>答题状态</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((row, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${row.userNo}</td>
                            <td>${registrationGroupBadge(row.group)}</td>
                            <td>${row.name}</td>
                            <td>${row.phone}</td>
                            <td>${row.org}</td>
                            <td></td>
                            <td>${formatDateTimeSecond(row.registeredAt)}</td>
                            <td>${registrationStatusBadge(row.answerStatus)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ${renderStandardPagination(300)}
    </section>`;
});

const REGISTRATION_ROWS = [
    { userNo: 'U001', group: '小学组', name: '张三', phone: '138****1234', org: '上海市图书馆', registeredAt: '2026-06-10 10:10', answerStatus: '未答题' },
    { userNo: 'U002', group: '小学组', name: '李四', phone: '139****5678', org: '复旦大学图书馆', registeredAt: '2026-06-10 10:10', answerStatus: '答题中' },
    { userNo: 'U003', group: '初中组', name: '王五', phone: '136****9012', org: '长宁区图书馆', registeredAt: '2026-06-10 10:10', answerStatus: '答题中' },
    { userNo: 'U004', group: '高中组', name: '赵六', phone: '137****3456', org: '华东政法大学图书馆', registeredAt: '2026-06-10 10:10', answerStatus: '答题中' },
    { userNo: 'U005', group: '小学组', name: '孙七', phone: '135****7890', org: '高中部选送单位', registeredAt: '2026-06-10 10:10', answerStatus: '答题中' },
    { userNo: 'U006', group: '初中组', name: '周八', phone: '134****2345', org: '徐汇区文化馆', registeredAt: '2026-06-10 10:10', answerStatus: '答题中' },
    { userNo: 'U007', group: '高中组', name: '吴九', phone: '133****6789', org: '教师发展中心', registeredAt: '2026-06-10 10:10', answerStatus: '未答题' }
];

const OFFLINE_REGISTRATION_REVIEW_ENABLED = true;
const OFFLINE_REGISTRATION_CAPACITY = 12;
let currentOfflineRegistrationGroupId = 'reader';
const OFFLINE_REGISTRATION_ROWS = [
    { id: 'offline-signup-001', signupNo: 'BM20260626001', userNo: 'U001', groupId: 'reader', name: '林悦', phone: '138****1234', group: '普通读者', session: '6月26日 14:00 讲座沙龙', quantity: 1, org: '广州市图书馆', formSummary: '年龄：32；同行：0人', signupStatus: '已报名', auditStatus: '已通过', checkinStatus: '未签到', registeredAt: '2026-06-20 10:10:00', auditTrail: [
        { type: 'submit', title: '提交报名', desc: '用户提交活动报名信息', time: '2026-06-20 10:10:00', operator: '林悦' },
        { type: 'audit', title: '待审核 → 已通过', desc: '管理员审核通过，报名成功', time: '2026-06-20 10:16:00', operator: '管理员 周贺贺' },
        { type: 'notice', title: '已发送：报名确认', desc: '站内信与短信通知已发送', time: '2026-06-20 10:16:30', operator: '系统' }
    ] },
    { id: 'offline-signup-002', signupNo: 'BM20260626002', userNo: 'U002', groupId: 'reader', name: '陈安', phone: '139****5678', group: '普通读者', session: '6月26日 14:00 讲座沙龙', quantity: 2, org: '越秀区文化馆', formSummary: '年龄：28；同行：1人', signupStatus: '待审核', auditStatus: '待审核', checkinStatus: '未签到', registeredAt: '2026-06-20 10:18:00', auditTrail: [
        { type: 'submit', title: '提交报名', desc: '用户提交活动报名信息，等待管理员审核', time: '2026-06-20 10:18:00', operator: '陈安' },
        { type: 'audit', title: '已进入审核队列', desc: '当前报名需审核后才算报名成功', time: '2026-06-20 10:18:03', operator: '系统' }
    ] },
    { id: 'offline-signup-003', signupNo: 'BM20260626003', userNo: 'U003', groupId: 'family', name: '黄嘉', phone: '136****9012', group: '亲子家庭', session: '6月26日 14:00 讲座沙龙', quantity: 3, org: '天河区图书馆', formSummary: '儿童年龄：8岁；同行：2人', signupStatus: '已报名', auditStatus: '已通过', checkinStatus: '已签到', registeredAt: '2026-06-20 10:25:00', auditTrail: [
        { type: 'submit', title: '提交报名', desc: '用户提交亲子家庭报名信息', time: '2026-06-20 10:25:00', operator: '黄嘉' },
        { type: 'audit', title: '待审核 → 已通过', desc: '符合活动参与要求', time: '2026-06-20 10:31:00', operator: '管理员 林月' },
        { type: 'checkin', title: '现场签到成功', desc: '工作人员扫码核验完成签到', time: '2026-06-26 13:42:10', operator: '签到员 叶青' }
    ] },
    { id: 'offline-signup-004', signupNo: 'BM20260626004', userNo: 'U004', groupId: 'reader', name: '周宁', phone: '137****3456', group: '普通读者', session: '6月26日 14:00 讲座沙龙', quantity: 1, org: '广东财经大学图书馆', formSummary: '年龄：41；同行：0人', signupStatus: '未通过', auditStatus: '已拒绝', checkinStatus: '-', registeredAt: '2026-06-20 10:40:00', auditTrail: [
        { type: 'submit', title: '提交报名', desc: '用户提交活动报名信息', time: '2026-06-20 10:40:00', operator: '周宁' },
        { type: 'audit', title: '待审核 → 未通过', desc: '报名信息不完整，已拒绝本次报名', time: '2026-06-20 11:05:00', operator: '管理员 周贺贺' },
        { type: 'notice', title: '已发送：报名被拒绝', desc: '通知用户补充信息后重新提交', time: '2026-06-20 11:05:30', operator: '系统' }
    ] },
    { id: 'offline-signup-005', signupNo: 'BM20260626005', userNo: 'U005', groupId: 'family', name: '许青', phone: '135****7890', group: '亲子家庭', session: '6月26日 14:00 讲座沙龙', quantity: 2, org: '海珠区少年宫', formSummary: '儿童年龄：10岁；同行：1人', signupStatus: '候补', auditStatus: '已通过', checkinStatus: '未签到', registeredAt: '2026-06-20 11:12:00', auditTrail: [
        { type: 'submit', title: '提交报名', desc: '用户提交报名时当前名额已满', time: '2026-06-20 11:12:00', operator: '许青' },
        { type: 'audit', title: '待审核 → 已通过', desc: '审核通过，进入候补名单', time: '2026-06-20 11:20:00', operator: '管理员 林月' }
    ] },
    { id: 'offline-signup-006', signupNo: 'BM20260626006', userNo: 'U006', groupId: 'volunteer', name: '赵明', phone: '134****2345', group: '志愿者', session: '6月26日 14:00 讲座沙龙', quantity: 1, org: '徐汇区文化馆', formSummary: '服务经验：有', signupStatus: '已取消', auditStatus: '已通过', checkinStatus: '-', registeredAt: '2026-06-20 11:28:00', auditTrail: [
        { type: 'submit', title: '提交报名', desc: '用户提交志愿者报名信息', time: '2026-06-20 11:28:00', operator: '赵明' },
        { type: 'audit', title: '待审核 → 已通过', desc: '审核通过', time: '2026-06-20 11:36:00', operator: '管理员 周贺贺' },
        { type: 'cancel', title: '用户取消报名', desc: '用户在报名截止前主动取消', time: '2026-06-21 09:12:00', operator: '赵明' }
    ] }
];

function renderOfflineRegistrationPage() {
    const rows = OFFLINE_REGISTRATION_ROWS;
    const groupTabs = getOfflineRegistrationGroupTabs(rows);
    if (!groupTabs.some(tab => tab.id === currentOfflineRegistrationGroupId)) {
        currentOfflineRegistrationGroupId = groupTabs[0]?.id || 'all';
    }
    const filteredRows = rows.filter(row => row.groupId === currentOfflineRegistrationGroupId);
    const progressStats = getOfflineRegistrationProgressStats(rows);
    const progressSegments = getOfflineRegistrationProgressSegments(progressStats);
    const exportLabel = groupTabs.length > 1 ? '导出当前组别' : '导出';
    return `
    <div class="offline-registration-page">
        <section class="card offline-registration-overview">
            <div class="offline-registration-overview-head">
                <div>
                    <h2>概况</h2>
                    <p>展示当前活动有效报名进度，取消报名不纳入进度统计。</p>
                </div>
                <div class="offline-registration-actions">
                    ${OFFLINE_REGISTRATION_REVIEW_ENABLED ? '<button class="btn btn-outline btn-sm">批量审核</button>' : ''}
                    <button class="btn btn-outline btn-sm">发送签到提醒</button>
                    <button class="btn btn-primary btn-sm">${exportLabel}</button>
                </div>
            </div>
            <div class="offline-registration-progress">
                <div class="offline-registration-progress-top">
                    <strong>${progressStats.joined}<small>参加</small></strong>
                </div>
                <div class="offline-registration-progress-track">
                    ${progressSegments.filter(item => item.value > 0).map(item => `
                        <i class="${item.key}" style="width:${Math.min(100, Math.round(item.value / OFFLINE_REGISTRATION_CAPACITY * 1000) / 10)}%" title="${item.label} ${item.value} 人"></i>
                    `).join('')}
                </div>
                <div class="offline-registration-progress-meta">
                    ${renderOfflineRegistrationProgressMeta(progressStats)}
                </div>
            </div>
        </section>

        <section class="card registration-card offline-registration-card">
            <div class="offline-registration-filter">
                <label><span>报名编号</span><input class="form-control" placeholder="请输入报名编号"></label>
                <label><span>报名人</span><input class="form-control" placeholder="请输入姓名"></label>
                <label><span>手机号码</span><input class="form-control" placeholder="请输入手机号码"></label>
                <label><span>报名状态</span><select class="form-control"><option>全部状态</option><option>已报名</option><option>待审核</option><option>候补</option><option>未通过</option><option>已取消</option></select></label>
                <label><span>审核状态</span><select class="form-control"><option>全部审核状态</option><option>待审核</option><option>已通过</option><option>已拒绝</option></select></label>
                <label><span>签到状态</span><select class="form-control"><option>全部签到状态</option><option>未签到</option><option>已签到</option></select></label>
                <label><span>报名场次</span><select class="form-control"><option>全部场次</option><option>6月26日 14:00 讲座沙龙</option></select></label>
                <label><span>组织单位</span><input class="form-control" placeholder="请输入组织单位"></label>
                <label><span>报名时间</span><input class="form-control" placeholder="开始时间 - 结束时间"></label>
                <div class="registration-actions">
                    <button class="btn btn-primary">查询</button>
                    <button class="btn btn-outline">重置</button>
                    <button class="btn btn-outline">${exportLabel}</button>
                </div>
            </div>
            <div class="offline-registration-group-tabs">
                ${groupTabs.map(tab => renderOfflineRegistrationGroupTab(tab, tab.id === currentOfflineRegistrationGroupId)).join('')}
            </div>
            <div class="registration-table-wrap">
                <table class="registration-table offline-registration-table">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>报名编号</th>
                            <th>报名人</th>
                            <th>手机号码</th>
                            <th>所属组别</th>
                            <th>报名场次</th>
                            <th>报名名额</th>
                            <th>组织单位</th>
                            <th>报名表字段</th>
                            <th>报名状态</th>
                            <th>审核状态</th>
                            <th>签到状态</th>
                            <th>报名时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredRows.map((row, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td><strong>${row.signupNo}</strong><span>${row.userNo}</span></td>
                                <td>${escapeHtml(row.name)}</td>
                                <td>${row.phone}</td>
                                <td>${registrationGroupBadge(row.group)}</td>
                                <td>${escapeHtml(row.session)}</td>
                                <td>${row.quantity} 人</td>
                                <td>${escapeHtml(row.org)}</td>
                                <td>${escapeHtml(row.formSummary)}</td>
                                <td>${offlineRegistrationStatusBadge(row.signupStatus)}</td>
                                <td>${offlineAuditStatusBadge(row.auditStatus)}</td>
                                <td>${offlineCheckinStatusBadge(row.checkinStatus)}</td>
                                <td>${formatDateTimeSecond(row.registeredAt)}</td>
                                <td>
                                    <span class="action-link" onclick="openOfflineRegistrationAudit('${row.id}')">审核记录</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${renderStandardPagination(filteredRows.length)}
        </section>
    </div>`;
}

function getOfflineRegistrationGroupTabs(rows) {
    const groups = Array.from(new Map(rows.map(row => [row.groupId, row.group])).entries());
    return groups.map(([id, label]) => ({ id, label }));
}

function getOfflineRegistrationProgressStats(rows) {
    return {
        joined: sumOfflineRegistrationQuantity(rows, row => row.signupStatus === '已报名'),
        pending: sumOfflineRegistrationQuantity(rows, row => row.auditStatus === '待审核'),
        checked: sumOfflineRegistrationQuantity(rows, row => row.checkinStatus === '已签到'),
        waitlisted: sumOfflineRegistrationQuantity(rows, row => row.signupStatus === '候补'),
        rejected: sumOfflineRegistrationQuantity(rows, row => row.signupStatus === '未通过')
    };
}

function getOfflineRegistrationProgressSegments(stats) {
    return [
        { key: 'joined', label: '参加', value: stats.joined },
        { key: 'pending', label: '待审核', value: stats.pending },
        { key: 'waitlisted', label: '候补', value: stats.waitlisted },
        { key: 'rejected', label: '不参加', value: stats.rejected }
    ];
}

function renderOfflineRegistrationProgressMeta(stats) {
    return [
        { key: 'pending', label: '待审核', value: stats.pending },
        { key: 'checked', label: '已签到', value: stats.checked }
    ].filter(item => item.value > 0).map(item => `<span class="${item.key}">${item.value} 人${item.label}</span>`).join('');
}

function sumOfflineRegistrationQuantity(rows, predicate) {
    return rows.filter(predicate).reduce((sum, row) => sum + Number(row.quantity || 1), 0);
}

function renderOfflineRegistrationGroupTab(tab, active = false) {
    return `<button class="${active ? 'active' : ''}" onclick="switchOfflineRegistrationGroup('${tab.id}')">${escapeHtml(tab.label)}</button>`;
}

function offlineRegistrationStatusBadge(status) {
    const clsMap = { '已报名': 'badge-green', '待审核': 'badge-yellow', '候补': 'badge-blue', '未通过': 'badge-red', '已取消': 'badge-gray' };
    return `<span class="badge ${clsMap[status] || 'badge-gray'}">${status}</span>`;
}

function offlineAuditStatusBadge(status) {
    const clsMap = { '已通过': 'badge-green', '待审核': 'badge-yellow', '已拒绝': 'badge-red' };
    return `<span class="badge ${clsMap[status] || 'badge-gray'}">${status}</span>`;
}

function offlineCheckinStatusBadge(status) {
    if (!status || status === '-') return '<span class="text-muted">-</span>';
    const clsMap = { '已签到': 'badge-green', '未签到': 'badge-gray' };
    return `<span class="badge ${clsMap[status] || 'badge-gray'}">${status}</span>`;
}

function openOfflineRegistrationAudit(rowId) {
    const row = OFFLINE_REGISTRATION_ROWS.find(item => item.id === rowId);
    if (!row) return;
    openModal('报名人员审核记录', `
        <div class="offline-registration-audit-modal">
            <div class="offline-registration-audit-person">
                <div class="offline-registration-avatar">${escapeHtml(row.name).slice(0, 1)}</div>
                <div>
                    <strong>${escapeHtml(row.name)}</strong>
                    <span>${row.phone} · ${escapeHtml(row.session)}</span>
                </div>
                <em>${row.signupStatus}</em>
            </div>
            <div class="offline-registration-audit-summary">
                <span>报名编号：${row.signupNo}</span>
                <span>报名名额：${row.quantity} 人</span>
                <span>审核状态：${row.auditStatus}</span>
                <span>签到状态：${row.checkinStatus}</span>
            </div>
            <div class="offline-registration-timeline">
                ${row.auditTrail.map(item => `
                    <div class="offline-registration-timeline-item ${item.type}">
                        <i></i>
                        <div>
                            <strong>${escapeHtml(item.title)}</strong>
                            <p>${escapeHtml(item.desc)}</p>
                            <span>${formatDateTimeSecond(item.time)} · ${escapeHtml(item.operator)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `, null, { modalClass: 'modal-lg', hideCancel: true, confirmText: '关闭' });
}

function switchOfflineRegistrationGroup(groupId) {
    if (!groupId || groupId === currentOfflineRegistrationGroupId) return;
    currentOfflineRegistrationGroupId = groupId;
    navigateTo(currentPage, {
        params: currentPageParams,
        source: currentPageSource,
        refresh: true,
        fromTabSwitch: true,
        reuseTabKey: activeTabKey
    });
}

// ===== 用户达标情况 =====
registerPage('user-qualified', () => {
    const rows = USER_QUALIFIED_ROWS;
    return `
    <div class="user-qualified-page">
        <section class="card user-qualified-filter-card">
            <div class="user-qualified-note">该功能页面为每日答题专有页面</div>
            <div class="user-qualified-filter">
                <label><span>组别</span>
                    <select class="form-control">
                        <option>小学组</option>
                        <option>初中组</option>
                        <option>高中组</option>
                        <option>教师组</option>
                    </select>
                </label>
                <label class="user-qualified-date"><span>日期</span>
                    <span class="score-range-control">
                        <input class="form-control" type="date" aria-label="开始日期">
                        <span>-</span>
                        <input class="form-control" type="date" aria-label="结束日期">
                    </span>
                </label>
                <label><span>姓名</span><input class="form-control" placeholder="请输入用户姓名"></label>
                <label><span>选送单位</span><input class="form-control" placeholder="请输入选送单位"></label>
                <div class="user-qualified-actions">
                    <button class="btn btn-primary btn-sm">查询</button>
                    <button class="btn btn-outline btn-sm">重置</button>
                    <button class="btn btn-outline btn-sm">导出</button>
                </div>
            </div>
        </section>
        <section class="card user-qualified-table-card">
            <div class="review-list-title">每日答题用户列表</div>
            <div class="user-qualified-table-wrap">
                <table class="user-qualified-table">
                    <thead>
                        <tr>
                            <th>排名 ${fieldHelpIcon('排名：按达标天数和得分综合排序；未答题用户不参与排名。')}</th>
                            <th>姓名</th>
                            <th>手机号码</th>
                            <th>组别</th>
                            <th>选送单位</th>
                            <th>答题天数 ${fieldHelpIcon('答题天数：已答题天数 / 活动开放天数')}</th>
                            <th>达标天数 ${fieldHelpIcon('达标天数：每日答题达到达标条件的天数')}</th>
                            <th>得分 ${fieldHelpIcon('得分：每日答题累计得分')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                <td>${row.rank}</td>
                                <td><strong>${row.name}</strong></td>
                                <td>${row.phone}</td>
                                <td>${row.group}</td>
                                <td>${row.org}</td>
                                <td>${row.answerDays}</td>
                                <td>${row.qualifiedDays}</td>
                                <td>${row.score}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${renderStandardPagination(rows.length)}
        </section>
    </div>`;
});

const USER_QUALIFIED_ROWS = [
    { rank: '1', name: '张三', phone: '138****1234', group: '小学组', org: '上海市图书馆', answerDays: '4/31', qualifiedDays: 4, score: 356 },
    { rank: '2', name: '周八', phone: '134****2345', group: '初中组', org: '徐汇区文化馆', answerDays: '1/31', qualifiedDays: 1, score: 95 },
    { rank: '3', name: '陈一', phone: '132****4567', group: '小学组', org: '浦东新区图书馆', answerDays: '1/31', qualifiedDays: 1, score: 88 },
    { rank: '4', name: '李四', phone: '139****5678', group: '小学组', org: '复旦大学图书馆', answerDays: '1/31', qualifiedDays: 1, score: 86 },
    { rank: '5', name: '王五', phone: '136****9012', group: '初中组', org: '长宁区图书馆', answerDays: '1/31', qualifiedDays: 1, score: 78 },
    { rank: '--', name: '孙七', phone: '135****7890', group: '高中组', org: '高中部选送单位', answerDays: '0/31', qualifiedDays: 0, score: 0 },
    { rank: '--', name: '吴九', phone: '133****6789', group: '教师组', org: '教师发展中心', answerDays: '0/31', qualifiedDays: 0, score: 0 },
    { rank: '--', name: '冯十二', phone: '138****6677', group: '初中组', org: '杨浦区文化馆', answerDays: '0/31', qualifiedDays: 0, score: 0 }
];

function registrationGroupBadge(group) {
    const clsMap = { '小学组': 'badge-blue', '初中组': 'badge-green', '高中组': 'badge-yellow', '普通读者': 'badge-blue', '亲子家庭': 'badge-green', '志愿者': 'badge-yellow' };
    return `<span class="badge ${clsMap[group] || 'badge-gray'}">${group}</span>`;
}

function registrationStatusBadge(status) {
    const clsMap = { '答题中': 'badge-yellow', '未答题': 'badge-gray' };
    return `<span class="badge ${clsMap[status] || 'badge-gray'}">${status}</span>`;
}

let examRecordGroup = 'all';
let examRecordPaper = 'all';
let answerStatsMode = 'exam';
let dailyRecordDay = 'all';
let levelRecordStage = 'all';
let unitDataMode = 'exam';
let dailyScoreDetailType = 'all';
const DAILY_ACTIVITY_START = '2026-06-09';
const DAILY_ACTIVITY_END = '2026-07-09';
const DAILY_MAX_ATTEMPTS = 3;
const DAILY_SCORE_RULE = 'highest';
const DAILY_QUALIFIED_SCORE = 60;

const DAILY_SCORE_DETAIL_TYPES = [
    { value: 'all', label: '全部' },
    { value: 'ANSWER_SCORE', label: '每日答题得分（取当日最高分）' },
    { value: 'CONTINUOUS_REWARD', label: '连续答题天数奖励分' },
    { value: 'ACCUMULATED_REWARD', label: '累计答题天数奖励分' },
    { value: 'SHARE_REWARD', label: '分享活动奖励分' }
];

const DAILY_SCORE_DETAIL_ROWS = [
    { id: 'score-flow-001', userId: 'U001', userNo: '10001', name: '丁夏容', phone: '19289999000', group: '学院组', org: '广州打卡', type: 'SHARE_REWARD', typeName: '分享活动奖励分', points: 5, relatedId: 'share-0603-001', receivedAt: '2026-06-03 10:20', detail: '分享活动', remark: '分享活动成功' },
    { id: 'score-flow-002', userId: 'U001', userNo: '10001', name: '丁夏容', phone: '19289999000', group: '学院组', org: '广州打卡', type: 'ACCUMULATED_REWARD', typeName: '累计答题天数奖励分', points: 50, relatedId: 'daily-total-30', receivedAt: '2026-06-03 09:15', detail: '累计答题30天', remark: '累计完成30天答题' },
    { id: 'score-flow-003', userId: 'U001', userNo: '10001', name: '丁夏容', phone: '19289999000', group: '学院组', org: '广州打卡', type: 'CONTINUOUS_REWARD', typeName: '连续答题天数奖励分', points: 20, relatedId: 'daily-streak-7', receivedAt: '2026-06-03 09:15', detail: '连续答题7天', remark: '连续答题7天' },
    { id: 'score-flow-004', userId: 'U001', userNo: '10001', name: '丁夏容', phone: '19289999000', group: '学院组', org: '广州打卡', type: 'ANSWER_SCORE', typeName: '每日答题得分（取当日最高分）', points: 10, relatedId: 'daily-0603-answer', receivedAt: '2026-06-03 09:15', detail: '答题日期：2026-06-03', remark: '答对10题' },
    { id: 'score-flow-005', userId: 'U002', userNo: '10002', name: '杨静云', phone: '19578012123', group: '学院组', org: '广州打卡', type: 'ANSWER_SCORE', typeName: '每日答题得分（取当日最高分）', points: 8, relatedId: 'daily-0602-answer', receivedAt: '2026-06-02 09:28', detail: '答题日期：2026-06-02', remark: '答对8题' },
    { id: 'score-flow-006', userId: 'U002', userNo: '10002', name: '杨静云', phone: '19578012123', group: '学院组', org: '广州打卡', type: 'SHARE_REWARD', typeName: '分享活动奖励分', points: 5, relatedId: 'share-0602-001', receivedAt: '2026-06-02 09:05', detail: '分享活动', remark: '分享活动成功' },
    { id: 'score-flow-007', userId: 'U003', userNo: '10003', name: '赵丽', phone: '19533319000', group: '专业组', org: '中山大学', type: 'ANSWER_SCORE', typeName: '每日答题得分（取当日最高分）', points: 9, relatedId: 'daily-0601-answer', receivedAt: '2026-06-01 08:54', detail: '答题日期：2026-06-01', remark: '答对9题' },
    { id: 'score-flow-008', userId: 'U003', userNo: '10003', name: '赵丽', phone: '19533319000', group: '专业组', org: '中山大学', type: 'CONTINUOUS_REWARD', typeName: '连续答题天数奖励分', points: 10, relatedId: 'daily-streak-3', receivedAt: '2026-05-31 09:17', detail: '连续答题3天', remark: '连续答题3天' }
];

const EXAM_RECORD_GROUPS = [
    { id: 'all', name: '全部组别', count: 528 },
    { id: 'primary', name: '小学组', count: 128 },
    { id: 'middle', name: '初中组', count: 256 },
    { id: 'high', name: '高中组', count: 198 },
    { id: 'teacher', name: '教师组', count: 64 }
];

const EXAM_RECORD_PAPERS = [
    { id: 'all', groupId: 'all', examName: '全部试卷', paper: '全部场次', desc: '全部场次汇总', time: '全部时间', status: '汇总', expected: 528, joined: 486, submitted: 386, pendingReview: 44, reviewed: 342, avg: 78.5, reviewProgress: 88 },
    { id: 'exam-1', groupId: 'primary', examName: '第一场考试', paper: '安全生产知识试卷', desc: '面向小学组开展的基础安全生产知识测评，重点了解用户对安全常识、应急处置和日常防护要求的掌握情况。', time: '2026-06-10 09:00 - 10:00', status: '已结束', expected: 128, joined: 120, submitted: 110, pendingReview: 18, reviewed: 92, avg: 82.5, reviewProgress: 84 },
    { id: 'exam-2', groupId: 'primary', examName: '第二场考试', paper: '安全生产进阶试卷', desc: '在基础知识测评之后继续考察用户对安全生产场景判断、风险识别和综合应用题目的掌握情况。', time: '2026-06-12 09:00 - 10:00', status: '进行中', expected: 128, joined: 92, submitted: 60, pendingReview: 20, reviewed: 40, avg: 76.8, reviewProgress: 67 },
    { id: 'exam-3', groupId: 'middle', examName: '初赛', paper: '图书馆知识竞赛试卷', desc: '用于初中组初赛阶段的图书馆知识竞赛，覆盖公共文化服务、馆藏资源使用和阅读推广基础知识。', time: '2026-06-10 14:00 - 15:00', status: '已结束', expected: 256, joined: 238, submitted: 220, pendingReview: 12, reviewed: 208, avg: 79.2, reviewProgress: 95 },
    { id: 'exam-4', groupId: 'middle', examName: '复赛', paper: '企业文化综合测评卷', desc: '面向复赛用户的综合能力测评，重点查看用户对活动主题、组织文化和综合知识点的理解深度。', time: '2026-06-13 14:00 - 15:00', status: '已结束', expected: 180, joined: 168, submitted: 156, pendingReview: 0, reviewed: 156, avg: 80.1, reviewProgress: 100 },
    { id: 'exam-5', groupId: 'high', examName: '决赛考试', paper: '安全生产决赛试卷', desc: '面向高中组决赛阶段的高阶测评，重点考察用户在复杂安全生产情境下的分析和判断能力。', time: '2026-06-15 09:00 - 10:30', status: '未开始', expected: 198, joined: 0, submitted: 0, pendingReview: 0, reviewed: 0, avg: '-', reviewProgress: 0 },
    { id: 'exam-6', groupId: 'teacher', examName: '教师专场', paper: '新员工入职培训考试', desc: '面向教师组的新员工入职培训考试，用于检验培训学习成果和岗位基础规范掌握情况。', time: '2026-06-16 09:00 - 10:00', status: '已结束', expected: 64, joined: 60, submitted: 58, pendingReview: 6, reviewed: 52, avg: 86.4, reviewProgress: 90 }
];

const EXAM_UNPARTICIPATED_USER_NAMES = new Set(['陆安', '许诺']);

const EXAM_RECORD_ROWS = [
    { groupId: 'primary', group: '小学组', paperId: 'exam-1', examName: '第一场考试', name: '张三', phone: '138****1234', org: '上海市图书馆', paper: '安全生产知识试卷', phase: '初赛第 1 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 60, subjective: 25, total: 85, full: 100, rank: 1, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-10 09:45', duration: '18分35秒', certificate: '已发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-2', examName: '第二场考试', name: '张三', phone: '138****1234', org: '上海市图书馆', paper: '安全生产进阶试卷', phase: '初赛第 2 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 64, subjective: 24, total: 88, full: 100, rank: 2, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-12 09:49', duration: '20分02秒', certificate: '已发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-1', examName: '第一场考试', name: '顾晨', phone: '137****2468', org: '上海市图书馆', paper: '安全生产知识试卷', phase: '初赛第 1 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 62, subjective: 21, total: 83, full: 100, rank: 3, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-10 09:50', duration: '19分48秒', certificate: '已发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-1', examName: '第一场考试', name: '陆安', phone: '136****3579', org: '上海市图书馆', paper: '安全生产知识试卷', phase: '初赛第 1 期', answerStatus: '已交卷', reviewStatus: '待阅卷', objective: 67, subjective: 0, total: 67, full: 100, rank: '-', passed: '待判定', promoted: '待判定', attempts: '1/1', submitTime: '2026-06-10 09:56', duration: '23分15秒', certificate: '未发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-2', examName: '第二场考试', name: '沈悦', phone: '135****4680', org: '上海市图书馆', paper: '安全生产进阶试卷', phase: '初赛第 2 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 59, subjective: 22, total: 81, full: 100, rank: 5, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-12 09:58', duration: '21分34秒', certificate: '已发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-2', examName: '第二场考试', name: '韩宁', phone: '134****5791', org: '上海市图书馆', paper: '安全生产进阶试卷', phase: '初赛第 2 期', answerStatus: '答题中', reviewStatus: '-', objective: '-', subjective: '-', total: '-', full: 100, rank: '-', passed: '待判定', promoted: '待判定', attempts: '1/1', submitTime: '-', duration: '进行中', certificate: '未发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-1', examName: '第一场考试', name: '许诺', phone: '133****6802', org: '上海市图书馆', paper: '安全生产知识试卷', phase: '初赛第 1 期', answerStatus: '缺考', reviewStatus: '-', objective: '-', subjective: '-', total: '-', full: 100, rank: '-', passed: '未达标', promoted: '未晋级', attempts: '0/1', submitTime: '-', duration: '-', certificate: '未发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-2', examName: '第二场考试', name: '林晓', phone: '132****7913', org: '上海市图书馆', paper: '安全生产进阶试卷', phase: '初赛第 2 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 72, subjective: 20, total: 92, full: 100, rank: 1, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-12 09:46', duration: '18分12秒', certificate: '已发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-1', examName: '第一场考试', name: '李四', phone: '139****5678', org: '复旦大学图书馆', paper: '安全生产知识试卷', phase: '初赛第 1 期', answerStatus: '已交卷', reviewStatus: '待阅卷', objective: 70, subjective: 0, total: 70, full: 100, rank: '-', passed: '待判定', promoted: '待判定', attempts: '1/1', submitTime: '2026-06-10 09:52', duration: '21分08秒', certificate: '未发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-1', examName: '第一场考试', name: '陈一', phone: '132****4567', org: '浦东新区图书馆', paper: '安全生产知识试卷', phase: '初赛第 1 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 58, subjective: 23, total: 81, full: 100, rank: 2, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-10 09:47', duration: '19分12秒', certificate: '已发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-2', examName: '第二场考试', name: '陈一', phone: '132****4567', org: '浦东新区图书馆', paper: '安全生产进阶试卷', phase: '初赛第 2 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 60, subjective: 20, total: 80, full: 100, rank: 4, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-12 09:55', duration: '22分12秒', certificate: '已发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-1', examName: '第一场考试', name: '刘二', phone: '131****8899', org: '上海少年儿童图书馆', paper: '安全生产知识试卷', phase: '初赛第 1 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 52, subjective: 18, total: 70, full: 100, rank: 3, passed: '达标', promoted: '待判定', attempts: '1/1', submitTime: '2026-06-10 09:58', duration: '24分06秒', certificate: '未发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-2', examName: '第二场考试', name: '赵六', phone: '137****3456', org: '华东政法大学图书馆', paper: '安全生产进阶试卷', phase: '初赛第 2 期', answerStatus: '答题中', reviewStatus: '-', objective: '-', subjective: '-', total: '-', full: 100, rank: '-', passed: '待判定', promoted: '待判定', attempts: '1/1', submitTime: '-', duration: '进行中', certificate: '未发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-2', examName: '第二场考试', name: '钱十', phone: '130****5566', org: '静安区图书馆', paper: '安全生产进阶试卷', phase: '初赛第 2 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 62, subjective: 26, total: 88, full: 100, rank: 1, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-12 09:51', duration: '20分18秒', certificate: '已发放' },
    { groupId: 'middle', group: '初中组', paperId: 'exam-3', examName: '初赛', name: '王五', phone: '136****9012', org: '长宁区图书馆', paper: '图书馆知识竞赛试卷', phase: '初赛', answerStatus: '已交卷', reviewStatus: '无需阅卷', objective: 80, subjective: '-', total: 80, full: 100, rank: 2, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-10 14:48', duration: '16分20秒', certificate: '发放中' },
    { groupId: 'middle', group: '初中组', paperId: 'exam-3', examName: '初赛', name: '郑十一', phone: '139****1122', org: '闵行区图书馆', paper: '图书馆知识竞赛试卷', phase: '初赛', answerStatus: '已交卷', reviewStatus: '无需阅卷', objective: 92, subjective: '-', total: 92, full: 100, rank: 1, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-10 14:42', duration: '14分36秒', certificate: '已发放' },
    { groupId: 'middle', group: '初中组', paperId: 'exam-4', examName: '复赛', name: '周八', phone: '134****2345', org: '徐汇区文化馆', paper: '企业文化综合测评卷', phase: '复赛', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 66, subjective: 22, total: 88, full: 100, rank: 1, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-13 14:50', duration: '22分10秒', certificate: '已发放' },
    { groupId: 'middle', group: '初中组', paperId: 'exam-4', examName: '复赛', name: '冯十二', phone: '138****6677', org: '杨浦区文化馆', paper: '企业文化综合测评卷', phase: '复赛', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 61, subjective: 20, total: 81, full: 100, rank: 2, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-13 14:53', duration: '23分44秒', certificate: '已发放' },
    { groupId: 'high', group: '高中组', paperId: 'exam-5', examName: '决赛考试', name: '孙七', phone: '135****7890', org: '高中部选送单位', paper: '安全生产决赛试卷', phase: '决赛', answerStatus: '未开始', reviewStatus: '-', objective: '-', subjective: '-', total: '-', full: 100, rank: '-', passed: '待判定', promoted: '待判定', attempts: '0/1', submitTime: '-', duration: '-', certificate: '未发放' },
    { groupId: 'teacher', group: '教师组', paperId: 'exam-6', examName: '教师专场', name: '吴九', phone: '133****6789', org: '教师发展中心', paper: '新员工入职培训考试', phase: '教师专场', answerStatus: '缺考', reviewStatus: '-', objective: '-', subjective: '-', total: '-', full: 100, rank: '-', passed: '未达标', promoted: '未晋级', attempts: '0/1', submitTime: '-', duration: '-', certificate: '未发放' },
    { groupId: 'teacher', group: '教师组', paperId: 'exam-6', examName: '教师专场', name: '蒋十三', phone: '137****7788', org: '教师发展中心', paper: '新员工入职培训考试', phase: '教师专场', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 68, subjective: 24, total: 92, full: 100, rank: 1, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-16 09:43', duration: '17分02秒', certificate: '已发放' }
];

const DAILY_RECORD_DAYS = [
    { id: 'all', title: '全部日期', subtitle: '活动期累计', date: '2026-06-09 - 07-09', status: '汇总', rules: '50 题 / 100 分 / 达标 60 分', expected: 528, joined: 416, completed: 388, qualified: 302, avg: 82.6 },
    { id: 'day-01', title: '6月9日', subtitle: '每日答题', date: '2026-06-09', status: '已结束', rules: '50 题 / 100 分 / 达标 60 分', expected: 528, joined: 386, completed: 360, qualified: 286, avg: 84.2 },
    { id: 'day-02', title: '6月10日', subtitle: '每日答题', date: '2026-06-10', status: '已结束', rules: '50 题 / 100 分 / 达标 60 分', expected: 528, joined: 372, completed: 351, qualified: 271, avg: 81.8 },
    { id: 'day-03', title: '6月11日', subtitle: '每日答题', date: '2026-06-11', status: '进行中', rules: '50 题 / 100 分 / 达标 60 分', expected: 528, joined: 296, completed: 248, qualified: 180, avg: 79.6 },
    { id: 'day-04', title: '6月12日', subtitle: '每日答题', date: '2026-06-12', status: '未开始', rules: '50 题 / 100 分 / 达标 60 分', expected: 528, joined: 0, completed: 0, qualified: 0, avg: '-' }
];

const DAILY_RECORD_ROWS = [
    { groupId: 'primary', group: '小学组', dayId: 'day-01', name: '张三', phone: '138****1234', org: '上海市图书馆', dailyScore: 92, cumulativeScore: 256, qualifiedDays: 3, attempts: '1/1', bestScore: 92, accuracy: '92%', duration: '08分35秒', status: '已完成', submitTime: '2026-06-09 09:45', streak: 3 },
    { groupId: 'primary', group: '小学组', dayId: 'day-02', name: '张三', phone: '138****1234', org: '上海市图书馆', dailyScore: 88, cumulativeScore: 180, qualifiedDays: 2, attempts: '1/1', bestScore: 88, accuracy: '88%', duration: '08分48秒', status: '已完成', submitTime: '2026-06-10 09:38', streak: 2 },
    { groupId: 'primary', group: '小学组', dayId: 'day-03', name: '张三', phone: '138****1234', org: '上海市图书馆', dailyScore: 90, cumulativeScore: 270, qualifiedDays: 3, attempts: '1/1', bestScore: 90, accuracy: '90%', duration: '08分22秒', status: '已完成', submitTime: '2026-06-11 09:41', streak: 3 },
    { groupId: 'primary', group: '小学组', dayId: 'day-04', name: '张三', phone: '138****1234', org: '上海市图书馆', dailyScore: 86, cumulativeScore: 356, qualifiedDays: 4, attempts: '1/1', bestScore: 86, accuracy: '86%', duration: '09分04秒', status: '已完成', submitTime: '2026-06-12 09:50', streak: 4 },
    { groupId: 'primary', group: '小学组', dayId: 'day-01', name: '李四', phone: '139****5678', org: '复旦大学图书馆', dailyScore: 86, cumulativeScore: 238, qualifiedDays: 3, attempts: '1/1', bestScore: 86, accuracy: '86%', duration: '09分12秒', status: '已完成', submitTime: '2026-06-09 10:08', streak: 3 },
    { groupId: 'middle', group: '初中组', dayId: 'day-01', name: '王五', phone: '136****9012', org: '长宁区图书馆', dailyScore: 78, cumulativeScore: 210, qualifiedDays: 2, attempts: '1/1', bestScore: 78, accuracy: '78%', duration: '10分20秒', status: '已完成', submitTime: '2026-06-09 11:18', streak: 2 },
    { groupId: 'middle', group: '初中组', dayId: 'day-02', name: '周八', phone: '134****2345', org: '徐汇区文化馆', dailyScore: 95, cumulativeScore: 269, qualifiedDays: 3, attempts: '1/1', bestScore: 95, accuracy: '95%', duration: '07分46秒', status: '已完成', submitTime: '2026-06-10 09:22', streak: 3 },
    { groupId: 'high', group: '高中组', dayId: 'day-02', name: '孙七', phone: '135****7890', org: '高中部选送单位', dailyScore: 58, cumulativeScore: 162, qualifiedDays: 1, attempts: '1/1', bestScore: 58, accuracy: '58%', duration: '12分30秒', status: '已完成', submitTime: '2026-06-10 15:41', streak: 0 },
    { groupId: 'primary', group: '小学组', dayId: 'day-03', name: '陈一', phone: '132****4567', org: '浦东新区图书馆', dailyScore: 88, cumulativeScore: 241, qualifiedDays: 3, attempts: '1/1', bestScore: 88, accuracy: '88%', duration: '08分54秒', status: '已完成', submitTime: '2026-06-11 09:33', streak: 3 },
    { groupId: 'teacher', group: '教师组', dayId: 'day-03', name: '吴九', phone: '133****6789', org: '教师发展中心', dailyScore: '-', cumulativeScore: 172, qualifiedDays: 2, attempts: '0/1', bestScore: '-', accuracy: '-', duration: '-', status: '未答题', submitTime: '-', streak: 0 },
    { groupId: 'middle', group: '初中组', dayId: 'day-03', name: '冯十二', phone: '138****6677', org: '杨浦区文化馆', dailyScore: '答题中', cumulativeScore: 196, qualifiedDays: 2, attempts: '1/1', bestScore: '-', accuracy: '-', duration: '进行中', status: '答题中', submitTime: '-', streak: 2 }
];

const DAILY_UNPARTICIPATED_USER_NAMES = new Set(['孙七', '吴九', '冯十二']);

const DAILY_REGISTERED_USERS = [
    { userNo: 'U0001', groupId: 'primary', group: '小学组', name: '张三', phone: '138****1234', org: '上海市图书馆' },
    { userNo: 'U0002', groupId: 'primary', group: '小学组', name: '李四', phone: '139****5678', org: '复旦大学图书馆' },
    { userNo: 'U0003', groupId: 'middle', group: '初中组', name: '王五', phone: '136****9012', org: '长宁区图书馆' },
    { userNo: 'U0004', groupId: 'middle', group: '初中组', name: '周八', phone: '134****2345', org: '徐汇区文化馆' },
    { userNo: 'U0005', groupId: 'high', group: '高中组', name: '孙七', phone: '135****7890', org: '高中部选送单位' },
    { userNo: 'U0006', groupId: 'primary', group: '小学组', name: '陈一', phone: '132****4567', org: '浦东新区图书馆' },
    { userNo: 'U0007', groupId: 'teacher', group: '教师组', name: '吴九', phone: '133****6789', org: '教师发展中心' },
    { userNo: 'U0008', groupId: 'middle', group: '初中组', name: '冯十二', phone: '138****6677', org: '杨浦区文化馆' }
];

const DAILY_ATTEMPT_RECORDS = [
    { attemptId: 'daily-0609-zhangsan-1', dayId: 'day-01', name: '张三', attemptNo: 1, score: 76, accuracy: '76%', duration: '10分18秒', status: '已提交', startTime: '2026-06-09 09:20', submitTime: '2026-06-09 09:31', correct: 38, total: 50 },
    { attemptId: 'daily-0609-zhangsan-2', dayId: 'day-01', name: '张三', attemptNo: 2, score: 92, accuracy: '92%', duration: '08分35秒', status: '已提交', startTime: '2026-06-09 09:36', submitTime: '2026-06-09 09:45', correct: 46, total: 50 },
    { attemptId: 'daily-0610-zhangsan-1', dayId: 'day-02', name: '张三', attemptNo: 1, score: 88, accuracy: '88%', duration: '08分48秒', status: '已提交', startTime: '2026-06-10 09:29', submitTime: '2026-06-10 09:38', correct: 44, total: 50 },
    { attemptId: 'daily-0611-zhangsan-1', dayId: 'day-03', name: '张三', attemptNo: 1, score: 90, accuracy: '90%', duration: '08分22秒', status: '已提交', startTime: '2026-06-11 09:32', submitTime: '2026-06-11 09:41', correct: 45, total: 50 },
    { attemptId: 'daily-0612-zhangsan-1', dayId: 'day-04', name: '张三', attemptNo: 1, score: 86, accuracy: '86%', duration: '09分04秒', status: '已提交', startTime: '2026-06-12 09:40', submitTime: '2026-06-12 09:50', correct: 43, total: 50 },
    { attemptId: 'daily-0609-lisi-1', dayId: 'day-01', name: '李四', attemptNo: 1, score: 86, accuracy: '86%', duration: '09分12秒', status: '已提交', startTime: '2026-06-09 09:58', submitTime: '2026-06-09 10:08', correct: 43, total: 50 },
    { attemptId: 'daily-0609-lisi-2', dayId: 'day-01', name: '李四', attemptNo: 2, score: 82, accuracy: '82%', duration: '08分58秒', status: '已提交', startTime: '2026-06-09 10:20', submitTime: '2026-06-09 10:30', correct: 41, total: 50 },
    { attemptId: 'daily-0609-wangwu-1', dayId: 'day-01', name: '王五', attemptNo: 1, score: 58, accuracy: '58%', duration: '11分06秒', status: '已提交', startTime: '2026-06-09 10:46', submitTime: '2026-06-09 10:58', correct: 29, total: 50 },
    { attemptId: 'daily-0609-wangwu-2', dayId: 'day-01', name: '王五', attemptNo: 2, score: 78, accuracy: '78%', duration: '10分20秒', status: '已提交', startTime: '2026-06-09 11:07', submitTime: '2026-06-09 11:18', correct: 39, total: 50 },
    { attemptId: 'daily-0610-zhouba-1', dayId: 'day-02', name: '周八', attemptNo: 1, score: 82, accuracy: '82%', duration: '09分18秒', status: '已提交', startTime: '2026-06-10 08:58', submitTime: '2026-06-10 09:08', correct: 41, total: 50 },
    { attemptId: 'daily-0610-zhouba-2', dayId: 'day-02', name: '周八', attemptNo: 2, score: 95, accuracy: '95%', duration: '07分46秒', status: '已提交', startTime: '2026-06-10 09:14', submitTime: '2026-06-10 09:22', correct: 48, total: 50 },
    { attemptId: 'daily-0610-zhouba-3', dayId: 'day-02', name: '周八', attemptNo: 3, score: 90, accuracy: '90%', duration: '08分02秒', status: '已提交', startTime: '2026-06-10 09:36', submitTime: '2026-06-10 09:44', correct: 45, total: 50 },
    { attemptId: 'daily-0610-sunqi-1', dayId: 'day-02', name: '孙七', attemptNo: 1, score: 58, accuracy: '58%', duration: '12分30秒', status: '已提交', startTime: '2026-06-10 15:28', submitTime: '2026-06-10 15:41', correct: 29, total: 50 },
    { attemptId: 'daily-0610-sunqi-2', dayId: 'day-02', name: '孙七', attemptNo: 2, score: 54, accuracy: '54%', duration: '13分02秒', status: '已提交', startTime: '2026-06-10 16:10', submitTime: '2026-06-10 16:24', correct: 27, total: 50 },
    { attemptId: 'daily-0610-sunqi-3', dayId: 'day-02', name: '孙七', attemptNo: 3, score: 52, accuracy: '52%', duration: '12分48秒', status: '已提交', startTime: '2026-06-10 16:38', submitTime: '2026-06-10 16:51', correct: 26, total: 50 },
    { attemptId: 'daily-0611-chenyi-1', dayId: 'day-03', name: '陈一', attemptNo: 1, score: 88, accuracy: '88%', duration: '08分54秒', status: '已提交', startTime: '2026-06-11 09:24', submitTime: '2026-06-11 09:33', correct: 44, total: 50 },
    { attemptId: 'daily-0611-fengshier-1', dayId: 'day-03', name: '冯十二', attemptNo: 1, score: '-', accuracy: '-', duration: '进行中', status: '答题中', startTime: '2026-06-11 10:12', submitTime: '-', correct: '-', total: 50 }
];

const LEVEL_RECORD_STAGES = [
    { id: 'all', title: '全部关卡', subtitle: '闯关总览', date: '2026-02-20 - 05-01', status: '汇总', rules: '按顺序解锁 / 答对题数过关', expected: 312, joined: 286, completed: 168, qualified: 168, questionCount: 50, passQuestions: 30, avgCorrect: 38.5 },
    { id: 'level-01', title: '第 1 关', subtitle: '阅读常识', date: '开放中', status: '已开放', rules: '50 题 / 答对 30 题过关', expected: 312, joined: 286, completed: 260, qualified: 238, questionCount: 50, passQuestions: 30, avgCorrect: 41.2 },
    { id: 'level-02', title: '第 2 关', subtitle: '历史文化', date: '顺序解锁', status: '已开放', rules: '50 题 / 答对 30 题过关', expected: 238, joined: 212, completed: 186, qualified: 168, questionCount: 50, passQuestions: 30, avgCorrect: 39.5 },
    { id: 'level-03', title: '第 3 关', subtitle: '非遗知识', date: '顺序解锁', status: '未配置', rules: '待配置抽题规则', expected: 168, joined: 0, completed: 0, qualified: 0, questionCount: 50, passQuestions: 30, avgCorrect: '-' }
];

const LEVEL_RECORD_ROWS = [
    { groupId: 'primary', group: '小学组', levelId: 'level-01', name: '张三', phone: '138****1234', org: '上海市图书馆', currentLevel: '第 2 关', passedLevels: 1, correctCount: 43, totalCorrect: 43, attempts: '1/3', passStatus: '已通关', unlockStatus: '已解锁下一关', accuracy: '86%', duration: '18分35秒', submitTime: '2026-02-20 09:45' },
    { groupId: 'primary', group: '小学组', levelId: 'level-02', name: '李四', phone: '139****5678', org: '复旦大学图书馆', currentLevel: '第 2 关', passedLevels: 2, correctCount: 44, totalCorrect: 84, attempts: '2/3', passStatus: '已通关', unlockStatus: '已解锁下一关', accuracy: '88%', duration: '21分08秒', submitTime: '2026-02-22 10:12' },
    { groupId: 'middle', group: '初中组', levelId: 'level-02', name: '王五', phone: '136****9012', org: '长宁区图书馆', currentLevel: '第 2 关', passedLevels: 1, correctCount: 28, totalCorrect: 68, attempts: '3/3', passStatus: '未通关', unlockStatus: '停留本关', accuracy: '56%', duration: '24分06秒', submitTime: '2026-02-22 15:20' },
    { groupId: 'middle', group: '初中组', levelId: 'level-01', name: '周八', phone: '134****2345', org: '徐汇区文化馆', currentLevel: '第 1 关', passedLevels: 1, correctCount: 47, totalCorrect: 47, attempts: '1/3', passStatus: '已通关', unlockStatus: '已解锁下一关', accuracy: '94%', duration: '16分20秒', submitTime: '2026-02-20 14:48' },
    { groupId: 'high', group: '高中组', levelId: 'level-01', name: '孙七', phone: '135****7890', org: '高中部选送单位', currentLevel: '第 1 关', passedLevels: 0, correctCount: 26, totalCorrect: 26, attempts: '2/3', passStatus: '未通关', unlockStatus: '停留本关', accuracy: '52%', duration: '22分10秒', submitTime: '2026-02-21 09:12' },
    { groupId: 'teacher', group: '教师组', levelId: 'level-03', name: '吴九', phone: '133****6789', org: '教师发展中心', currentLevel: '第 3 关', passedLevels: 2, correctCount: '-', totalCorrect: 78, attempts: '0/3', passStatus: '待挑战', unlockStatus: '未开放', accuracy: '-', duration: '-', submitTime: '-' }
];

const UNIT_DATA_ROWS = [
    { name: '上海市图书馆', group: '小学组', level: '市级', expected: 168, joined: 156, submitted: 143, absent: 25, pendingReview: 8, reviewed: 135, totalScore: 12384, avgScore: 86.6, highestScore: 98, lowestScore: 65, passed: 128, promoted: 42, rank: 1 },
    { name: '复旦大学图书馆', group: '小学组', level: '高校', expected: 112, joined: 104, submitted: 98, absent: 14, pendingReview: 6, reviewed: 92, totalScore: 8246, avgScore: 84.1, highestScore: 96, lowestScore: 62, passed: 84, promoted: 28, rank: 2 },
    { name: '长宁区图书馆', group: '初中组', level: '区级', expected: 96, joined: 88, submitted: 80, absent: 16, pendingReview: 0, reviewed: 80, totalScore: 6428, avgScore: 80.4, highestScore: 94, lowestScore: 58, passed: 68, promoted: 18, rank: 3 },
    { name: '徐汇区文化馆', group: '初中组', level: '区级', expected: 74, joined: 66, submitted: 58, absent: 16, pendingReview: 3, reviewed: 55, totalScore: 4652, avgScore: 80.2, highestScore: 92, lowestScore: 56, passed: 48, promoted: 12, rank: 4 },
    { name: '华东政法大学图书馆', group: '高中组', level: '高校', expected: 48, joined: 31, submitted: 22, absent: '-', pendingReview: 7, reviewed: 15, totalScore: 1168, avgScore: 77.9, highestScore: 90, lowestScore: 52, passed: 12, promoted: 5, rank: 5 },
    { name: '教师发展中心', group: '教师组', level: '市级', expected: 64, joined: 60, submitted: 58, absent: 6, pendingReview: 6, reviewed: 52, totalScore: 4493, avgScore: 86.4, highestScore: 99, lowestScore: 68, passed: 50, promoted: 20, rank: 6 }
];

const UNIT_DAILY_DATA_ROWS = [
    { name: '上海市图书馆', group: '小学组', expected: 168, joined: 156, answeredUsers: 143, cumulativeAnswerDays: 386, cumulativeAttempts: 512, qualifiedDays: 324, missedDays: 132, totalScore: 32184, avgScore: 83.4, activeRate: 85.1, qualifiedRate: 83.9 },
    { name: '复旦大学图书馆', group: '小学组', expected: 112, joined: 104, answeredUsers: 98, cumulativeAnswerDays: 276, cumulativeAttempts: 341, qualifiedDays: 228, missedDays: 71, totalScore: 22844, avgScore: 82.8, activeRate: 87.5, qualifiedRate: 82.6 },
    { name: '长宁区图书馆', group: '初中组', expected: 96, joined: 88, answeredUsers: 80, cumulativeAnswerDays: 214, cumulativeAttempts: 263, qualifiedDays: 176, missedDays: 74, totalScore: 17382, avgScore: 81.2, activeRate: 83.3, qualifiedRate: 82.2 },
    { name: '徐汇区文化馆', group: '初中组', expected: 74, joined: 66, answeredUsers: 58, cumulativeAnswerDays: 162, cumulativeAttempts: 207, qualifiedDays: 129, missedDays: 67, totalScore: 12868, avgScore: 79.4, activeRate: 78.4, qualifiedRate: 79.6 },
    { name: '华东政法大学图书馆', group: '高中组', expected: 48, joined: 31, answeredUsers: 22, cumulativeAnswerDays: 64, cumulativeAttempts: 88, qualifiedDays: 41, missedDays: 52, totalScore: 4582, avgScore: 71.6, activeRate: 45.8, qualifiedRate: 64.1 },
    { name: '教师发展中心', group: '教师组', expected: 64, joined: 60, answeredUsers: 58, cumulativeAnswerDays: 184, cumulativeAttempts: 219, qualifiedDays: 166, missedDays: 34, totalScore: 15640, avgScore: 85.0, activeRate: 90.6, qualifiedRate: 90.2 }
];

const UNIT_LEVEL_DATA_ROWS = [
    { name: '上海市图书馆', group: '小学组', expected: 168, joined: 156, challengedUsers: 143, totalAttempts: 286, passedLevels: 238, completedUsers: 42, totalCorrect: 9240, avgCorrect: 38.8, passRate: 83.2, avgPassedLevels: 1.7 },
    { name: '复旦大学图书馆', group: '小学组', expected: 112, joined: 104, challengedUsers: 98, totalAttempts: 196, passedLevels: 174, completedUsers: 31, totalCorrect: 6684, avgCorrect: 38.4, passRate: 88.8, avgPassedLevels: 1.8 },
    { name: '长宁区图书馆', group: '初中组', expected: 96, joined: 88, challengedUsers: 80, totalAttempts: 172, passedLevels: 132, completedUsers: 18, totalCorrect: 5016, avgCorrect: 38.0, passRate: 76.7, avgPassedLevels: 1.7 },
    { name: '徐汇区文化馆', group: '初中组', expected: 74, joined: 66, challengedUsers: 58, totalAttempts: 128, passedLevels: 96, completedUsers: 12, totalCorrect: 3534, avgCorrect: 36.8, passRate: 75.0, avgPassedLevels: 1.7 },
    { name: '华东政法大学图书馆', group: '高中组', expected: 48, joined: 31, challengedUsers: 22, totalAttempts: 61, passedLevels: 28, completedUsers: 4, totalCorrect: 1022, avgCorrect: 36.5, passRate: 45.9, avgPassedLevels: 1.3 },
    { name: '教师发展中心', group: '教师组', expected: 64, joined: 60, challengedUsers: 58, totalAttempts: 116, passedLevels: 104, completedUsers: 18, totalCorrect: 4108, avgCorrect: 39.5, passRate: 89.7, avgPassedLevels: 1.8 }
];

// ===== 每日答题得分明细 =====
registerPage('daily-score-detail', () => renderDailyScoreDetailPage());

function renderDailyScoreDetailPage() {
    const rows = getDailyScoreDetailRows();
    return `
    <div class="daily-score-detail-page">
        <div class="daily-score-page-title">得分明细<span>（//得分明细为每日答题专有页面）</span></div>
        <section class="card daily-score-flow-card">
            <p class="daily-score-total-note">分数来源包括每日答题得分（取当日最高分）、连续答题天数奖励分、累计答题天数奖励分和分享活动奖励分；详细描述用于说明对应答题日期、奖励天数或分享活动来源。</p>
            ${renderDailyScoreDetailFilter()}
            ${rows.length ? renderDailyScoreFlowTable(rows) : renderDailyScoreEmptyState()}
        </section>
    </div>`;
}

function renderDailyScoreDetailFilter() {
    return `
    <div class="daily-score-filter-panel">
        <label><span>文遇号</span><input class="form-control" placeholder="请输入用户文遇编号"></label>
        <label><span>用户姓名</span><input class="form-control" placeholder="请输入用户姓名"></label>
        <label><span>手机号码</span><input class="form-control" placeholder="请输入手机号码"></label>
        <label><span>所属组别</span>
            <select class="form-control">
                <option>全部</option><option>学院组</option><option>专业组</option><option>公共组</option>
            </select>
        </label>
        <label><span>分数来源</span>
            <select class="form-control" onchange="switchDailyScoreDetailType(this.value)">
                ${DAILY_SCORE_DETAIL_TYPES.map(type => `<option value="${type.value}" ${dailyScoreDetailType === type.value ? 'selected' : ''}>${type.label}</option>`).join('')}
            </select>
        </label>
        <label><span>选送单位</span><input class="form-control" placeholder="请输入选送单位"></label>
        <label><span>发生时间</span><input class="form-control" placeholder="开始-结束"></label>
        <div class="daily-score-filter-actions">
            <button class="btn btn-primary btn-sm">查询</button>
            <button class="btn btn-outline btn-sm">重置</button>
            <button class="btn btn-outline btn-sm">导出</button>
        </div>
    </div>`;
}

function getDailyScoreDetailRows() {
    return DAILY_SCORE_DETAIL_ROWS
        .filter(row => dailyScoreDetailType === 'all' || row.type === dailyScoreDetailType)
        .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
}

function renderDailyScoreFlowTable(rows) {
    return `
    <div class="daily-score-flow-table-wrap">
        <table class="daily-score-flow-table">
            <thead>
                <tr><th>序号</th><th>文遇号</th><th>用户姓名</th><th>手机号码</th><th>所属组别</th><th>选送单位</th><th>分数来源</th><th>详细描述</th><th>分数变动</th><th>发生时间</th></tr>
            </thead>
            <tbody>
                ${rows.map((row, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${row.userNo}</td>
                        <td>${row.name}</td>
                        <td>${row.phone}</td>
                        <td>${row.group}</td>
                        <td>${row.org}</td>
                        <td><span class="daily-score-source">${row.typeName}</span></td>
                        <td>${row.detail}</td>
                        <td><span class="daily-score-points">${formatDailyScorePoints(row.points)}</span></td>
                        <td>${row.receivedAt}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ${renderStandardPagination(rows.length)}`;
}

function renderDailyScoreEmptyState() {
    return `
    <div class="daily-score-empty">
        <strong>暂无分数记录</strong>
        <span>完成每日答题后可获得分数</span>
    </div>`;
}

function formatDailyScorePoints(points) {
    const value = Number(points) || 0;
    return `${value > 0 ? '+' : ''}${value}`;
}

function switchDailyScoreDetailType(type) {
    dailyScoreDetailType = type || 'all';
    navigateTo('daily-score-detail');
}

// ===== 答题情况 =====
registerPage('exam-records', () => {
    const rows = getAnswerRecordRows();
    const displayRows = getRankedAnswerRows(rows);
    const pagedRows = displayRows.slice(0, 10);
    return `
    <div class="exam-record-page">
        ${renderAnswerStatsModeSwitch()}
        ${answerStatsMode === 'exam' ? '' : renderAnswerObjectSwitcher()}
        <section class="card exam-score-filter">
            ${renderExamRecordFilter()}
        </section>
        <section class="card exam-score-table-card">
            ${renderExamRecordPaperInfo()}
            <div class="review-list-title">${getAnswerTableTitle()}</div>
            <div class="exam-record-table-wrap">
                ${renderAnswerRecordTable(pagedRows)}
            </div>
            ${renderStandardPagination(displayRows.length)}
        </section>
    </div>`;
});

function getAnswerTableTitle() {
    if (answerStatsMode === 'level') {
        return '趣味闯关用户列表';
    }
    return getAnswerModeConfig().tableTitle;
}

function renderExamRecordPaperInfo() {
    if (answerStatsMode !== 'exam') return '';
    const paper = EXAM_RECORD_PAPERS.find(item => item.id === examRecordPaper)
        || EXAM_RECORD_PAPERS.find(item => item.id !== 'all' && item.groupId === getRequiredExamGroupId())
        || EXAM_RECORD_PAPERS[0];
    const title = paper?.paper || '-';
    const subtitle = paper?.desc || '展示当前考试场次的组织参与、交卷完成和成绩表现。';
    return `
        <div class="exam-paper-text-info">
            <div class="exam-paper-title">${title}</div>
            <p>场次描述：${subtitle}</p>
        </div>`;
}

function renderExamRecordFilter() {
    if (answerStatsMode === 'level') return renderLevelRecordFilter();
    const config = getAnswerModeConfig();
    if (answerStatsMode === 'daily') {
        return `
        <div class="exam-filter-form">
            <label><span>组别</span>${renderExamRequiredGroupSelect()}</label>
            <label class="exam-filter-range"><span>日期</span>
                <span class="score-range-control">
                    <input class="form-control" type="date" aria-label="开始日期">
                    <span>-</span>
                    <input class="form-control" type="date" aria-label="结束日期">
                </span>
            </label>
            <label><span>姓名</span><input class="form-control" placeholder="请输入用户姓名"></label>
            <label><span>选送单位</span><input class="form-control" placeholder="请输入选送单位"></label>
            <div class="exam-filter-actions">
                <button class="btn btn-primary btn-sm">查询</button>
                <button class="btn btn-outline btn-sm">重置</button>
                <button class="btn btn-outline btn-sm">导出</button>
            </div>
        </div>`;
    }
    if (answerStatsMode === 'exam') {
        return `
        <div class="exam-filter-form">
            <label><span>组别</span>${renderExamRequiredGroupSelect()}</label>
            <label><span>场次</span>${renderExamPaperSelect()}</label>
            <label><span>姓名</span><input class="form-control" placeholder="请输入${config.userLabel}姓名"></label>
            <label><span>选送单位</span><input class="form-control" placeholder="请输入选送单位"></label>
            <label class="exam-filter-range"><span>分值范围</span>
                <span class="score-range-control">
                    <input class="form-control" type="number" min="0" max="100" placeholder="最小分值">
                    <span>-</span>
                    <input class="form-control" type="number" min="0" max="100" placeholder="最大分值">
                </span>
            </label>
            <div class="exam-filter-actions">
                <button class="btn btn-primary btn-sm">查询</button>
                <button class="btn btn-outline btn-sm">重置</button>
                <button class="btn btn-outline btn-sm">导出</button>
            </div>
        </div>`;
    }
    return `
    <div class="exam-score-filter-row">
        ${answerStatsMode === 'exam' ? renderExamRequiredGroupSelect() : renderExamGroupSelect()}
        ${answerStatsMode === 'exam' ? renderExamPaperSelect() : ''}
        <input class="form-control" placeholder="请输入${config.userLabel}姓名">
        <input class="form-control" placeholder="请输入选送单位">
        ${config.extraFilter || ''}
        <span class="score-range-control">
            <input class="form-control" type="number" min="0" max="100" placeholder="最小分值">
            <span>-</span>
            <input class="form-control" type="number" min="0" max="100" placeholder="最大分值">
        </span>
        <button class="btn btn-primary btn-sm">查询</button>
        <button class="btn btn-outline btn-sm">重置</button>
        <button class="btn btn-outline btn-sm">导出</button>
    </div>`;
}

function renderLevelRecordFilter() {
    return `
    <div class="exam-filter-form">
        <label><span>组别</span>${renderExamRequiredGroupSelect()}</label>
        <label><span>关卡</span>${renderLevelStageSelect()}</label>
        <label><span>姓名</span><input class="form-control" placeholder="请输入用户姓名"></label>
        <label><span>选送单位</span><input class="form-control" placeholder="请输入选送单位"></label>
        <label class="exam-filter-range"><span>过关数</span>
            <span class="score-range-control">
                <input class="form-control" type="number" min="0" placeholder="最少过关数">
                <span>-</span>
                <input class="form-control" type="number" min="0" placeholder="最多过关数">
            </span>
        </label>
        <div class="exam-filter-actions">
            <button class="btn btn-primary btn-sm">查询</button>
            <button class="btn btn-outline btn-sm">重置</button>
            <button class="btn btn-outline btn-sm">导出</button>
        </div>
    </div>`;
}

function getAnswerModeConfig() {
    const configs = {
        exam: {
            key: 'exam',
            title: '在线考试',
            desc: '按考试 / 试卷查看用户成绩、阅卷状态与交卷明细。',
            objectTitle: '考试 / 试卷',
            tableTitle: '成绩列表',
            userLabel: '考生',
            scoreField: 'total',
            extraFilter: ''
        },
        daily: {
            key: 'daily',
            title: '每日答题',
            desc: '按用户查看每日答题累计表现、达标天数和最近答题情况。',
            objectTitle: '每日计划',
            tableTitle: '每日答题用户列表',
            userLabel: '用户',
            scoreField: 'dailyScore',
            extraFilter: `<select class="form-control"><option>全部答题状态</option><option>已完成</option><option>答题中</option><option>未答题</option><option>未达标</option></select>`
        },
        level: {
            key: 'level',
            title: '趣味闯关',
            desc: '按关卡查看用户当前进度、本关答对题数、过关状态、挑战次数和解锁情况。',
            objectTitle: '关卡',
            tableTitle: '闯关记录列表',
            userLabel: '用户',
            extraFilter: `<select class="form-control"><option>本关过关状态</option><option>已过关</option><option>未过关</option></select>`
        }
    };
    return configs[answerStatsMode] || configs.exam;
}

function renderAnswerStatsModeSwitch() {
    const modes = [
        { key: 'exam', label: '在线考试', count: EXAM_RECORD_ROWS.length },
        { key: 'daily', label: '每日答题', count: DAILY_RECORD_ROWS.length },
        { key: 'level', label: '趣味闯关', count: LEVEL_RECORD_ROWS.length }
    ];
    return `
    <section class="card answer-mode-panel">
        <div class="answer-mode-tabs" role="tablist" aria-label="答题模式">
            ${modes.map(mode => `
                <button class="${answerStatsMode === mode.key ? 'active' : ''}" onclick="switchAnswerStatsMode('${mode.key}')">
                    <strong>${mode.label}</strong>
                </button>
            `).join('')}
        </div>
        <p>${getAnswerModeConfig().desc}</p>
    </section>`;
}

function switchAnswerStatsMode(mode) {
    answerStatsMode = mode;
    examRecordPaper = 'all';
    dailyRecordDay = 'all';
    levelRecordStage = mode === 'level' ? getDefaultLevelStageId() : 'all';
    navigateTo('exam-records');
}

function renderAnswerObjectSwitcher() {
    if (answerStatsMode === 'daily') return '';
    if (answerStatsMode === 'level') return '';
    return renderExamPaperSwitcher();
}

function getAnswerRecordRows() {
    if (answerStatsMode === 'daily') return getDailyOverviewRows();
    if (answerStatsMode === 'level') return getLevelOverviewRows();
    return getExamRecordRows();
}

function getDailyRecordRows() {
    const rows = DAILY_RECORD_DAYS
        .filter(day => day.id !== 'all')
        .flatMap(day => getDailyRowsForDate(day.date));
    return rows.filter(row => {
        if (examRecordGroup !== 'all' && row.groupId !== examRecordGroup) return false;
        if (dailyRecordDay !== 'all' && row.dayId !== dailyRecordDay) return false;
        return true;
    });
}

function getLevelRecordRows() {
    return LEVEL_RECORD_ROWS.filter(row => {
        if (examRecordGroup !== 'all' && row.groupId !== examRecordGroup) return false;
        if (levelRecordStage !== 'all' && row.levelId !== levelRecordStage) return false;
        return true;
    });
}

function getLevelOverviewRows() {
    const groupId = getRequiredExamGroupId();
    return LEVEL_RECORD_ROWS
        .filter(row => row.groupId === groupId)
        .map(row => {
            const progressRows = getLevelRecordRowsForUser(row);
            const totalAttempts = progressRows.reduce((sum, level) => sum + level.attemptCount, 0);
            return {
                ...row,
                totalAttempts,
                totalDuration: getUserLevelTotalDuration(progressRows)
            };
        });
}

function getDefaultLevelStageId() {
    const stages = getLevelStagesForCurrentGroup().filter(stage => stage.id !== 'all');
    return stages[0]?.id || 'level-01';
}

function getRankedAnswerRows(rows) {
    if (answerStatsMode === 'daily') return getRankedDailyRows(rows);
    if (answerStatsMode === 'level') {
        return [...rows].sort((a, b) => b.passedLevels - a.passedLevels || b.totalAttempts - a.totalAttempts || numericScore(getLevelCorrectCount(b)) - numericScore(getLevelCorrectCount(a))).map((row, index) => ({
            ...row,
            displayRank: row.passStatus === '待挑战' ? '-' : index + 1
        }));
    }
    return getRankedExamRows(rows);
}

function rankRowsByField(rows, field) {
    return [...rows].sort((a, b) => numericScore(b[field]) - numericScore(a[field])).map((row, index) => ({
        ...row,
        displayRank: typeof row[field] === 'number' ? index + 1 : '-'
    }));
}

function getRankedDailyRows(rows) {
    let participantRank = 0;
    return [...rows].sort((a, b) => {
        const aParticipated = a.participatedDays > 0;
        const bParticipated = b.participatedDays > 0;
        if (aParticipated !== bParticipated) return aParticipated ? -1 : 1;
        return numericScore(b.cumulativeScore) - numericScore(a.cumulativeScore);
    }).map(row => {
        if (row.participatedDays <= 0) {
            return { ...row, displayRank: '--' };
        }
        participantRank += 1;
        return { ...row, displayRank: participantRank };
    });
}

function numericScore(value) {
    return typeof value === 'number' ? value : -1;
}

function getAnswerScoreStats(rows) {
    if (answerStatsMode === 'daily') return getDailyScoreStats(rows);
    if (answerStatsMode === 'level') return getLevelScoreStats(rows);
    return getExamScoreStats(rows);
}

function renderAnswerScoreOverview(stats) {
    if (answerStatsMode === 'level') return renderLevelScoreOverview(stats);
    return renderExamScoreOverview(stats);
}

function getDailyScoreStats(rows) {
    const doneRows = rows.filter(row => typeof row.dailyScore === 'number');
    const qualified = doneRows.filter(row => row.dailyScore >= 60);
    const totals = doneRows.map(row => row.dailyScore);
    return {
        participants: rows.filter(row => row.status !== '未答题').length,
        passed: qualified.length,
        passRate: doneRows.length ? `${Math.round(qualified.length / doneRows.length * 100)}%` : '-',
        avg: totals.length ? `${(totals.reduce((sum, value) => sum + value, 0) / totals.length).toFixed(1)}分` : '-',
        highest: totals.length ? `${Math.max(...totals)}分` : '-',
        lowest: totals.length ? `${Math.min(...totals)}分` : '-'
    };
}

function getLevelScoreStats(rows) {
    if (levelRecordStage === 'all') return getLevelOverallStats(rows);
    const challengedRows = rows.filter(row => typeof getLevelCorrectCount(row) === 'number');
    const passedRows = rows.filter(row => row.passStatus === '已通关');
    const correctCounts = challengedRows.map(row => getLevelCorrectCount(row));
    return {
        participants: rows.filter(row => row.passStatus !== '待挑战').length,
        passed: passedRows.length,
        passRate: challengedRows.length ? `${Math.round(passedRows.length / challengedRows.length * 100)}%` : '-',
        avg: correctCounts.length ? `${(correctCounts.reduce((sum, value) => sum + value, 0) / correctCounts.length).toFixed(1)}题` : '-',
        highest: correctCounts.length ? `${Math.max(...correctCounts)}题` : '-',
        lowest: correctCounts.length ? `${Math.min(...correctCounts)}题` : '-'
    };
}

function getLevelOverallStats(rows) {
    const totalLevels = Math.max(1, LEVEL_RECORD_STAGES.filter(stage => stage.id !== 'all' && stage.status !== '未配置').length);
    const startedRows = rows.filter(row => row.passStatus !== '待挑战');
    const completedRows = rows.filter(row => row.passedLevels >= totalLevels);
    const totalPassedLevels = rows.reduce((sum, row) => sum + (Number(row.passedLevels) || 0), 0);
    const totalAttempts = rows.reduce((sum, row) => sum + (Number(String(row.attempts || '0').split('/')[0]) || 0), 0);
    const maxAttempts = rows.reduce((sum, row) => sum + (Number(String(row.attempts || '0/3').split('/')[1]) || 3), 0);
    return {
        mode: 'level-overall',
        started: startedRows.length,
        completed: completedRows.length,
        completionRate: rows.length ? `${Math.round(completedRows.length / rows.length * 100)}%` : '-',
        avgPassedLevels: rows.length ? (totalPassedLevels / rows.length).toFixed(1) : '-',
        totalPassedLevels,
        challengeProgress: maxAttempts ? `${Math.round(totalAttempts / maxAttempts * 100)}%` : '-'
    };
}

function renderAnswerRecordTable(rows) {
    if (answerStatsMode === 'daily') return renderDailyRecordTable(rows);
    if (answerStatsMode === 'level') return renderLevelRecordTable(rows);
    return renderExamRecordTable(rows);
}

function renderExamRecordTable(rows) {
    return `
    <table class="exam-record-table">
        <thead>
            <tr><th>排名 ${rankRuleHelpIcon('exam')}</th><th>用户姓名</th><th>手机号</th><th>所属组别</th><th>选送单位</th><th>参与场次 ${fieldHelpIcon('参与场次：已答题的考试场次 / 该活动考试总场次')}</th><th>累计得分 ${fieldHelpIcon('累计得分：该用户已出分考试场次的得分合计')}</th></tr>
        </thead>
        <tbody>
            ${rows.map((row) => `
                <tr>
                    <td>${row.displayRank}</td>
                    <td><strong>${row.name}</strong></td>
                    <td>${row.phone}</td>
                    <td>${row.group}</td>
                    <td>${row.org}</td>
                    <td><span class="action-link" onclick="openExamSessionDetail('${escHtml(row.name)}', '${escHtml(row.phone)}')">${formatUserExamSessionProgress(row)}</span></td>
                    <td>${scoreValue(getCumulativeScore(row))}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

function renderDailyRecordTable(rows) {
    return `
        <table class="exam-record-table answer-record-table daily">
        <thead>
            <tr><th>排名 ${rankRuleHelpIcon('daily')}</th><th>姓名</th><th>手机号码</th><th>组别</th><th>选送单位</th><th>答题天数 ${fieldHelpIcon('答题天数：已答题天数 / 活动开放天数')}</th><th>得分 ${fieldHelpIcon('得分：每日最高分累计之和')}</th></tr>
        </thead>
        <tbody>
            ${rows.map(row => `
                <tr>
                    <td>${row.displayRank}</td>
                    <td><strong>${row.name}</strong></td>
                    <td>${row.phone}</td>
                    <td>${row.group}</td>
                    <td>${row.org}</td>
                    <td><span class="action-link" onclick="openDailyUserOverview('${escHtml(row.name)}')">${row.participatedDays}/${row.expectedDays}</span></td>
                    <td>${scoreValue(row.cumulativeScore)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

function renderLevelRecordTable(rows) {
    return `
    <table class="exam-record-table answer-record-table level">
        <thead>
            <tr><th>排名 ${rankRuleHelpIcon('level')}</th><th>姓名</th><th>手机号码</th><th>组别</th><th>选送单位</th><th>过关数 ${fieldHelpIcon('过关数：已过关关卡数 / 活动总关卡数')}</th><th>闯关次数 ${fieldHelpIcon('闯关次数：所有关卡闯关累计的总次数')}</th><th>用时 ${fieldHelpIcon('用时：是指各关卡通关那次耗时之和。失败或重试的耗时不计入统计。')}</th></tr>
        </thead>
        <tbody>
            ${rows.map(row => `
                <tr>
                    <td>${row.displayRank}</td>
                    <td><strong>${row.name}</strong></td>
                    <td>${row.phone}</td>
                    <td>${row.group}</td>
                    <td>${row.org}</td>
                    <td><span class="action-link" onclick="openLevelUserDetail('${escHtml(row.name)}', '${escHtml(row.phone)}')">${formatPassedLevelCount(row)}</span></td>
                    <td>${row.totalAttempts || 0}</td>
                    <td>${row.totalDuration || '-'}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

function rankRuleHelpIcon(mode) {
    const rules = {
        exam: '排名规则：按累计得分从高到低排序；未出分或未参与考试的用户不参与排名，排名显示 --。活动配置中的个人成绩排行榜规则为：按得分高到低，同分按用时短优先。',
        daily: '排名规则：按总分从高到低排序；查询日期范围内答题次数为 0 的用户不参与排名，排名显示 --。总分包含每日最高分累计、连续答题天数奖励分、累计答题天数奖励分和分享活动奖励分；同分时用时少的用户靠前。',
        level: '排名规则：按过关数从高到低排序；过关数相同，闯关次数越少排名越高；若仍相同，用时越短排名越高。查询关卡范围内闯关次数为 0 的用户不参与排名，排名显示 --。'
    };
    return fieldHelpIcon(rules[mode] || rules.exam);
}

registerPage('answer-detail', () => {
    const { name, paperId, mode, dayId, attemptId } = currentPageParams || {};
    if (mode === 'daily') {
        return renderDailyAnswerDetailPage(name, dayId, attemptId);
    }
    const row = EXAM_RECORD_ROWS.find(item => item.name === name && item.paperId === paperId) || EXAM_RECORD_ROWS[0];
    return renderAnswerDetailPage(row);
});

registerPage('exam-session-detail', () => {
    const { name, phone } = currentPageParams || {};
    return renderExamSessionDetailPage(name || '', phone || '');
});

registerPage('daily-user-detail', () => {
    const { name } = currentPageParams || {};
    return renderDailyUserDetailPage(name || DAILY_RECORD_ROWS[0]?.name || '');
});

registerPage('level-user-detail', () => {
    const { name, phone } = currentPageParams || {};
    return renderLevelUserDetailPage(name || '', phone || '');
});

registerPage('level-answer-detail', () => {
    const { name, phone, levelId, attemptId } = currentPageParams || {};
    return renderLevelAnswerDetailPage(name || '', phone || '', levelId || '', attemptId || '');
});

function escHtml(s) { return s.replace(/'/g, "\\'").replace(/\n/g, ''); }

function getExamRecordRows() {
    const groupId = getRequiredExamGroupId();
    return EXAM_RECORD_ROWS.filter(row => {
        if (row.groupId !== groupId) return false;
        if (examRecordPaper !== 'all' && row.paperId !== examRecordPaper) return false;
        return true;
    });
}

function getRankedExamRows(rows) {
    const scoredRows = rows
        .filter(row => typeof row.total === 'number' && !isExamUnparticipatedUser(row))
        .sort((a, b) => b.total - a.total || String(a.submitTime).localeCompare(String(b.submitTime)));
    const rankMap = new Map(scoredRows.map((row, index) => [`${row.name}-${row.paperId}`, index + 1]));
    return [...rows].sort((a, b) => {
        const aScore = typeof a.total === 'number' ? a.total : -1;
        const bScore = typeof b.total === 'number' ? b.total : -1;
        return bScore - aScore;
    }).map(row => ({
        ...row,
        displayRank: isExamUnparticipatedUser(row) || getUserExamAnsweredCount(row) <= 0 ? '--' : (rankMap.get(`${row.name}-${row.paperId}`) || '-')
    }));
}

function openAnswerDetail(name, paperId) {
    const source = currentPage === 'exam-session-detail'
        ? { pageId: 'exam-session-detail', params: currentPageParams || {}, tabKey: activeTabKey }
        : { pageId: 'exam-records', params: {}, tabKey: activeTabKey };
    navigateTo('answer-detail', {
        params: { name, paperId },
        source
    });
}

function openExamSessionDetail(name, phone) {
    navigateTo('exam-session-detail', {
        params: { name, phone },
        source: { pageId: 'exam-records', params: {}, tabKey: activeTabKey }
    });
}

function openDailyAnswerDetailPage(name, dayId, attemptId = '') {
    const params = { mode: 'daily', name, dayId };
    if (attemptId) params.attemptId = attemptId;
    navigateTo('answer-detail', {
        params,
        source: { pageId: 'daily-user-detail', params: { name }, tabKey: activeTabKey }
    });
}

function openLevelUserDetail(name, phone) {
    navigateTo('level-user-detail', {
        params: { name, phone },
        source: { pageId: 'exam-records', params: {}, tabKey: activeTabKey }
    });
}

function openLevelAnswerDetailPage(name, phone, levelId, attemptId = '') {
    const params = { name, phone, levelId };
    if (attemptId) params.attemptId = attemptId;
    navigateTo('level-answer-detail', {
        params,
        source: { pageId: 'level-user-detail', params: { name, phone }, tabKey: activeTabKey }
    });
}

function getLevelRecordKey(row) {
    return `${String(row.name || '').trim()}__${String(row.phone || '').trim()}`;
}

function parseLevelNo(levelLabel) {
    const match = String(levelLabel || '').match(/(\d+)/);
    return match ? Number(match[1]) || 0 : 0;
}

function getLevelRecordRowsForUser(row) {
    if (!row) return [];
    const participatedLevels = getUserLevelParticipationCount(row);
    const passedLevels = Number(row.passedLevels) || 0;
    const rows = [];
    for (let i = 1; i <= participatedLevels; i += 1) {
        const stage = LEVEL_RECORD_STAGES.find(item => item.id !== 'all' && parseLevelNo(item.title) === i) || LEVEL_RECORD_STAGES[i] || null;
        const isPassed = i <= passedLevels;
        const isCurrent = !isPassed && i === participatedLevels && row.passStatus !== '待挑战';
        const attempts = getLevelAttemptRecords(row, i, isCurrent);
        const latestAttempt = attempts[attempts.length - 1] || null;
        rows.push({
            levelNo: i,
            levelId: stage?.id || `level-${String(i).padStart(2, '0')}`,
            title: stage ? `${stage.title} · ${stage.subtitle}` : `第 ${i} 关`,
            attemptCount: attempts.length,
            passed: isPassed,
            status: isPassed ? '已通关' : isCurrent ? '未通关' : '待挑战',
            correctCount: isPassed ? (typeof row.correctCount === 'number' && i === participatedLevels ? row.correctCount : Math.max(0, 45 - (i - 1) * 4)) : (isCurrent ? getLevelCorrectCount(row) : '-'),
            questionCount: stage?.questionCount || 50,
            passQuestions: stage?.passQuestions || 30,
            duration: latestAttempt?.duration || row.duration || '-',
            submitTime: latestAttempt?.submitTime || row.submitTime || '-',
            attempts,
            current: isCurrent
        });
    }
    return rows;
}

function renderLevelUserDetailPage(name, phone) {
    const baseRow = LEVEL_RECORD_ROWS.find(item => item.name === name && item.phone === phone) || LEVEL_RECORD_ROWS[0];
    if (!baseRow) return `<div class="empty-state">暂无关卡记录</div>`;
    const rows = getLevelRecordRowsForUser(baseRow);
    return `
    <div class="daily-user-detail-page level-user-detail-page">
        <section class="card answer-detail-titlebar daily-user-detail-titlebar">
            <div class="answer-detail-title-left">
                ${renderSourceBack('level-user-detail')}
                <div class="answer-detail-heading">
                    <strong>关卡记录</strong>
                </div>
            </div>
        </section>
        <section class="card exam-session-user-line">
            用户信息：${baseRow.name} / ${baseRow.phone} / ${baseRow.group} / ${baseRow.org}
        </section>
        <section class="card daily-user-record-card">
            <div class="daily-user-record-head">
                <strong>关卡记录</strong>
                <div class="daily-user-record-actions">
                    <button class="btn btn-outline btn-sm">导出</button>
                </div>
            </div>
            <div class="daily-answer-table-wrap">
                <table class="daily-answer-table level-user-detail-table">
                    <thead>
                        <tr><th>关卡</th><th>是否过关</th><th>闯关次数</th><th>用时 ${fieldHelpIcon('用时：指闯关那一次的耗时')}</th><th>过关时间</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                        ${rows.map(level => `
                            <tr>
                                <td>${formatLevelStageName(level)}</td>
                                <td>${level.passed ? '是' : '否'}</td>
                                <td>${level.attemptCount}次</td>
                                <td>${level.passed ? level.duration : '-'}</td>
                                <td>${level.passed ? formatDateTimeSecond(level.submitTime) : '-'}</td>
                                <td>${level.passed ? `<span class="action-link" onclick="openLevelAnswerDetailPage('${escHtml(baseRow.name)}', '${escHtml(baseRow.phone)}', '${escHtml(level.levelId)}')">过关详情</span>` : '<span style="color:var(--text-tertiary)">-</span>'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${renderStandardPagination(rows.length)}
        </section>
    </div>`;
}

function renderLevelAnswerDetailPage(name, phone, levelId, attemptId = '') {
    const baseRow = LEVEL_RECORD_ROWS.find(item => item.name === name && item.phone === phone) || LEVEL_RECORD_ROWS[0];
    if (!baseRow) return `<div class="empty-state">暂无过关详情</div>`;
    const progressRows = getLevelRecordRowsForUser(baseRow);
    const level = progressRows.find(item => item.levelId === levelId) || progressRows.find(item => item.passed) || progressRows[0];
    const attempts = level?.attempts || [];
    const passedAttempt = getLastPassedLevelAttempt(level);
    const activeAttempt = attempts.find(item => item.attemptId === attemptId) || passedAttempt || attempts[attempts.length - 1] || null;
    return `
    <div class="answer-detail-page daily-answer-detail-page level-answer-detail-page">
        <section class="card answer-detail-titlebar">
            <div class="answer-detail-title-left">
                ${renderSourceBack('level-answer-detail')}
                <div class="answer-detail-heading">
                    <strong>过关详情</strong>
                </div>
            </div>
        </section>
        <section class="card answer-paper-banner level-answer-summary">
            <div class="answer-paper-banner-head">
                <div class="answer-paper-banner-text">
                    <span class="badge badge-blue">趣味闯关</span>
                    <strong>${formatLevelStageName(level)}</strong>
                    <p>是否过关：${level?.passed ? '是' : '否'} / 用时：${activeAttempt?.duration || level?.duration || '-'}</p>
                </div>
            </div>
        </section>
        <section class="card answer-detail-card daily-answer-detail-card">
            <h3>当前关卡挑战记录</h3>
            ${renderLevelAttemptTimeline(baseRow, level, attempts, activeAttempt)}
            ${renderLevelAttemptPaperTabs(baseRow, level, attempts, activeAttempt, true)}
        </section>
    </div>`;
}

function getLastPassedLevelAttempt(level) {
    const attempts = level?.attempts || [];
    return [...attempts].reverse().find(attempt => attempt.correct >= getLevelPassQuestionCount(attempt)) || null;
}

function renderLevelAnswerDetailCardTitle(attempt, level) {
    if (!attempt) return '<h3>答题详情</h3>';
    return `
        <h3 class="level-answer-detail-card-title">
            <strong>过关答卷详情</strong>
        </h3>`;
}

function formatLevelStageName(level) {
    if (!level) return '-';
    const labels = ['第一关 · 语文', '第二关 · 数学', '第三关 · 英语'];
    const levelNo = Number(level.levelNo) || parseLevelNo(level.title || level.levelId);
    if (labels[levelNo - 1]) return labels[levelNo - 1];
    const subtitle = String(level.title || '').split('·')[1]?.trim();
    return `第${levelNo || '-'}关${subtitle ? ` · ${subtitle}` : ''}`;
}

function getUserLevelTotalDuration(progressRows) {
    const seconds = progressRows.reduce((sum, level) => sum + parseChineseDurationSeconds(level.duration), 0);
    return seconds ? formatChineseDuration(seconds) : '-';
}

function parseChineseDurationSeconds(value) {
    const match = String(value || '').match(/(\d+)分(\d+)秒/);
    return match ? Number(match[1]) * 60 + Number(match[2]) : 0;
}

function formatChineseDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}分${String(seconds).padStart(2, '0')}秒`;
}

function formatPassedLevelCount(row) {
    return `${Number(row?.passedLevels) || 0}/${getLevelTotalCount()}`;
}

function getLevelTotalCount() {
    return 9;
}

function levelAllPassedText(row) {
    return (Number(row?.passedLevels) || 0) >= getLevelTotalCount() ? '是' : '否';
}

function getUserLevelParticipationCount(row) {
    const currentLevelNo = parseLevelNo(row?.currentLevel);
    const passedLevels = Number(row?.passedLevels) || 0;
    if (row?.passStatus === '待挑战') {
        return Math.max(passedLevels, Math.max(1, currentLevelNo - 1));
    }
    return Math.max(passedLevels, currentLevelNo || passedLevels || 1);
}

function getLevelAttemptRecords(row, levelNo, isCurrent) {
    const baseCorrect = typeof row?.correctCount === 'number'
        ? row.correctCount
        : Math.max(25, 47 - levelNo * 3);
    const passed = levelNo <= (Number(row?.passedLevels) || 0);
    const usedAttempts = Number(String(row?.attempts || '1/3').split('/')[0]) || 1;
    const maxAttempts = Number(String(row?.attempts || '1/3').split('/')[1]) || 3;
    const attemptCount = (passed || isCurrent) ? Math.min(maxAttempts, Math.max(3, usedAttempts)) : 0;
    if (!attemptCount) return [];
    const startHour = 9 + (levelNo - 1) * 2;
    const records = [];
    for (let i = 1; i <= attemptCount; i += 1) {
        const success = passed && i === attemptCount;
        const correct = success
            ? (i === 1 ? Math.max(30, baseCorrect - 3) : baseCorrect)
            : Math.max(0, baseCorrect - (attemptCount - i + 1) * 4);
        const total = 50;
        const date = row?.submitTime?.slice(0, 10) || '2026-02-20';
        records.push({
            attemptId: `${getLevelRecordKey(row)}__level-${levelNo}__${i}`,
            attemptNo: i,
            correct,
            total,
            accuracy: `${Math.round(correct / total * 100)}%`,
            duration: `${String(12 - Math.min(4, i)).padStart(2, '0')}分${String(18 + levelNo * 2 + i).padStart(2, '0')}秒`,
            status: success ? '已提交' : (isCurrent && i === attemptCount ? '答题中' : '已提交'),
            startTime: `${date} ${String(startHour + i - 1).padStart(2, '0')}:${String(12 + i * 3).padStart(2, '0')}:00`,
            submitTime: success
                ? `${date} ${String(startHour + i - 1).padStart(2, '0')}:${String(20 + i * 4).padStart(2, '0')}:00`
                : (isCurrent && i === attemptCount ? '-' : `${date} ${String(startHour + i - 1).padStart(2, '0')}:${String(25 + i * 3).padStart(2, '0')}:00`),
            passQuestions: 30
        });
    }
    return records;
}

function openLevelChallengeDetail(name, phone, focus = 'all') {
    const row = LEVEL_RECORD_ROWS.find(item => item.name === name && item.phone === phone) || LEVEL_RECORD_ROWS[0];
    if (!row) return;
    const progressRows = getLevelRecordRowsForUser(row);
    openModal(`${row.name} - 趣味闯关详情`, `
        <div class="daily-detail-modal level-detail-modal">
            ${renderLevelDetailSummary(row, progressRows, focus)}
            ${renderLevelProgressTable(row, progressRows, focus)}
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide level-detail-modal-shell' });
}

function renderLevelDetailSummary(row, progressRows, focus) {
    return `
        <section class="daily-detail-summary level-detail-summary">
            <div class="level-detail-summary-bar">
                <div class="level-detail-summary-user">
                    <strong>${row?.name || '-'}</strong>
                    <span>${row?.phone || '-'} · ${row?.group || '-'} · ${row?.org || '-'}</span>
                </div>
            </div>
        </section>`;
}

function renderLevelProgressTable(row, progressRows, focus) {
    const filteredRows = focus === 'passed'
        ? progressRows.filter(item => item.passed)
        : focus === 'participated'
            ? progressRows
            : progressRows;
    return `
        <section class="daily-detail-section level-progress-section">
            <div class="daily-detail-section-head">
                <h4>关卡进度明细</h4>
                <span>${focus === 'passed' ? '已通关关卡' : focus === 'participated' ? '参与关卡' : '全部关卡'}</span>
            </div>
            <div class="daily-attempt-table-wrap">
                <table class="daily-attempt-table level-progress-table">
                    <thead>
                        <tr><th>关卡</th><th>答题次数</th><th>本关答对题数</th><th>过关状态</th><th>最近提交时间</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                        ${filteredRows.map(level => `
                            <tr class="${level.current ? 'active' : ''}">
                                <td>
                                    <strong>${level.title}</strong>
                                </td>
                                <td>${level.attemptCount}次</td>
                                <td>${formatCorrectCount(level.correctCount, level.questionCount, true)}</td>
                                <td>${levelPassBadge(level.status)}</td>
                                <td>${formatDateTimeSecond(level.submitTime)}</td>
                                <td><span class="action-link" onclick="openLevelAttemptDetail('${escHtml(row.name)}', '${escHtml(row.phone)}', '${escHtml(level.levelId)}')">查看详情</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>`;
}

function getLevelAttemptRowsForUser(row, levelId) {
    const levelNo = parseLevelNo(levelId);
    const progressRows = getLevelRecordRowsForUser(row);
    const target = progressRows.find(item => item.levelId === levelId) || progressRows.find(item => item.levelNo === levelNo) || null;
    return target?.attempts || [];
}

function openLevelAttemptDetail(name, phone, levelId, attemptId = '') {
    const row = LEVEL_RECORD_ROWS.find(item => item.name === name && item.phone === phone) || LEVEL_RECORD_ROWS[0];
    if (!row) return;
    const progressRows = getLevelRecordRowsForUser(row);
    const level = progressRows.find(item => item.levelId === levelId) || progressRows[0];
    const attempts = getLevelAttemptRowsForUser(row, level.levelId);
    const activeAttempt = attempts.find(item => item.attemptId === attemptId) || attempts[attempts.length - 1] || null;
    openModal(`${row.name} - ${level.title} 答题详情`, `
        <div class="daily-detail-modal level-detail-modal">
            ${renderLevelAttemptTimeline(row, level, attempts, activeAttempt)}
            ${renderLevelAttemptPaperTabs(row, level, attempts, activeAttempt)}
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide level-detail-modal-shell' });
}

function renderLevelAttemptTimeline(row, level, attempts, activeAttempt) {
    if (!attempts.length) {
        return `<section class="daily-detail-section"><h4>挑战次数记录</h4><div class="daily-detail-empty">该关暂无答题记录。</div></section>`;
    }
    return `
        <section class="daily-detail-section">
            <div class="daily-detail-section-head">
                <h4>挑战次数记录</h4>
            </div>
            <div class="daily-attempt-table-wrap">
                <table class="daily-attempt-table">
                    <thead>
                        <tr><th>次数</th><th>是否过关</th><th>用时</th><th>开始时间</th><th>提交时间</th></tr>
                    </thead>
                    <tbody>
                        ${attempts.map(attempt => `
                            <tr class="${activeAttempt?.attemptId === attempt.attemptId ? 'active' : ''}">
                                <td>第${attempt.attemptNo}次</td>
                                <td>${attempt === attempts[attempts.length - 1] ? '是' : '否'}</td>
                                <td>${attempt.duration}</td>
                                <td>${formatDateTimeSecond(attempt.startTime)}</td>
                                <td>${formatDateTimeSecond(attempt.submitTime)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>`;
}

function renderLevelAttemptPaperTabs(row, level, attempts, activeAttempt, asPage = false) {
    if (!attempts.length) {
        return `<section class="daily-detail-section daily-paper-section"><h4>答卷详情</h4><div class="daily-detail-empty">暂无可查看的答卷内容。</div></section>`;
    }
    return `
        <section class="daily-detail-section daily-paper-section">
            <div class="daily-paper-tabs">
                ${attempts.map(attempt => `
                    <button class="${activeAttempt?.attemptId === attempt.attemptId ? 'active' : ''}" onclick="${asPage ? `openLevelAnswerDetailPage('${escHtml(row.name)}', '${escHtml(row.phone)}', '${escHtml(level.levelId)}', '${escHtml(attempt.attemptId)}')` : `openLevelAttemptDetail('${escHtml(row.name)}', '${escHtml(row.phone)}', '${escHtml(level.levelId)}', '${escHtml(attempt.attemptId)}')`}">
                        第${attempt.attemptNo}次挑战
                    </button>
                `).join('')}
            </div>
            ${renderLevelAttemptPaper(activeAttempt, row, level, asPage ? 'answer-detail' : '')}
        </section>`;
}

function renderLevelAttemptPaper(attempt, row, level, variant = '') {
    if (!attempt) {
        return `<div class="daily-detail-empty">暂无可查看的答卷内容。</div>`;
    }
    if (attempt.status === '答题中') {
        return `<div class="daily-detail-empty">该关当前正在答题，提交后可查看题目答案、答题判定和解析。</div>`;
    }
    const questions = getLevelAttemptQuestions(level, attempt);
    if (variant === 'answer-detail') {
        return `
        <div>
            <div class="daily-question-list">
                ${questions.map((question, index) => renderAnswerQuestionCard({
                    no: index + 1,
                    type: question.type,
                    status: question.status,
                    score: question.score || 1,
                    awardedScore: question.awardedScore ?? (question.status === '正确' ? (question.score || 1) : 0),
                    title: question.title,
                    userAnswer: question.userAnswer,
                    correctAnswer: question.correctAnswer,
                    analysis: question.analysis
                }, { showScore: false })).join('')}
            </div>
        </div>`;
    }
    return `
        <div>
            <div class="daily-detail-section-head">
                <h4>${variant === 'answer-detail' ? `第${attempt.attemptNo}次挑战详情` : `第${attempt.attemptNo}次答卷`}</h4>
                <span>${level.title} · 答对 ${attempt.correct}/${attempt.total} 题 · ${attempt.duration}</span>
            </div>
            <div class="daily-question-list">
                ${questions.map((question, index) => renderAnswerQuestionCard({
                    no: index + 1,
                    type: question.type,
                    status: question.status,
                    score: question.score || 1,
                    awardedScore: question.awardedScore ?? (question.status === '正确' ? (question.score || 1) : 0),
                    title: question.title,
                    userAnswer: question.userAnswer,
                    correctAnswer: question.correctAnswer,
                    analysis: question.analysis
                }, { showScore: false })).join('')}
            </div>
        </div>`;
}

function getLevelAttemptQuestions(level, attempt) {
    const correct = typeof attempt.correct === 'number' ? attempt.correct : 0;
    const levelName = String(level?.title || '当前关卡').replace(/^第\s*\d+\s*关\s*[·.-]?\s*/, '') || '当前关卡';
    return [
        { type: '单选题', title: `${levelName}中，哪项最符合活动要求？`, userAnswer: correct >= 30 ? '符合' : '不符合', correctAnswer: '符合', status: correct >= 30 ? '正确' : '错误', score: 2, awardedScore: correct >= 30 ? 2 : 0, analysis: '这是一道用于展示关卡作答判定的示例题。' },
        { type: '判断题', title: `${levelName}中的基础规则是否需要按顺序完成？`, userAnswer: '正确', correctAnswer: '正确', status: '正确', score: 2, awardedScore: 2, analysis: '顺序闯关通常会保留关卡递进关系。' },
        { type: '多选题', title: `${levelName}中，哪些环节属于有效答题过程？`, userAnswer: correct >= 40 ? '阅读题干、选择答案、提交' : '阅读题干、提交', correctAnswer: '阅读题干、选择答案、提交', status: correct >= 40 ? '正确' : '部分正确', score: 4, awardedScore: correct >= 40 ? 4 : 2, analysis: '多选题可以帮助管理员查看每次答卷的差异。' },
        { type: '填空题', title: `${levelName}的核心关键词是____。`, userAnswer: '闯关', correctAnswer: '闯关', status: '正确', score: 2, awardedScore: 2, analysis: '示例题用于展示答题详情与解析位置。' }
    ];
}

function renderAnswerDetailPage(row) {
    return `
    <div class="answer-detail-page">
        <section class="card answer-detail-titlebar">
            <div class="answer-detail-title-left">
                ${renderSourceBack('answer-detail')}
                <div class="answer-detail-heading">
                    <strong>答卷详情</strong>
                </div>
            </div>
        </section>
        ${renderAnswerPaperBanner(row)}
        <section class="card answer-detail-card">
            <h3>试卷详情</h3>
            <div class="answer-question-list paper-view">
                ${renderAnswerQuestionSections(row).join('')}
            </div>
        </section>
    </div>`;
}

function renderExamSessionDetailPage(name, phone) {
    const baseRow = EXAM_RECORD_ROWS.find(item => item.name === name && item.phone === phone) || EXAM_RECORD_ROWS[0];
    if (!baseRow) return `<div class="empty-state">暂无考试场次明细</div>`;
    const rows = getUserExamSessionRows(baseRow);
    return `
    <div class="answer-detail-page exam-session-detail-page">
        <section class="card answer-detail-titlebar">
            <div class="answer-detail-title-left">
                ${renderSourceBack('exam-session-detail')}
                <div class="answer-detail-heading">
                    <strong>考试场次</strong>
                </div>
            </div>
        </section>
        <section class="card exam-session-user-line">
            用户信息：${baseRow.name} / ${baseRow.phone} / ${baseRow.group} / ${baseRow.org}
        </section>
        <section class="card exam-score-table-card">
            <div class="review-list-title">考试场次</div>
            <div class="exam-record-table-wrap">
                <table class="exam-record-table exam-session-detail-table">
                    <thead>
                        <tr><th>场次</th><th>得分</th><th>是否及格</th><th>主观题得分</th><th>客观题得分</th><th>交卷时间</th><th>阅卷状态</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                <td>${row.examName}</td>
                                <td>${scoreValue(row.total, true)}</td>
                                <td>${examPassText(row.passed)}</td>
                                <td>${scoreValue(row.subjective)}</td>
                                <td>${scoreValue(row.objective)}</td>
                                <td>${formatDateTimeSecond(row.submitTime)}</td>
                                <td>${examReviewStatusText(row)}</td>
                                <td><span class="action-link" onclick="openAnswerDetail('${escHtml(row.name)}', '${escHtml(row.paperId)}')">答卷详情</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${renderStandardPagination(rows.length)}
        </section>
    </div>`;
}

function examReviewStatusText(row) {
    if (row.reviewStatus === '已阅卷' || row.reviewStatus === '无需阅卷') return '已阅卷';
    return '未阅卷';
}

function renderAnswerPaperBanner(row) {
    const paper = getAnswerPaperBlueprint(row);
    return `
    <section class="card answer-paper-banner">
        <div class="answer-paper-banner-head">
            <div class="answer-paper-banner-text">
                <span class="badge badge-blue">${paper.mode}</span>
                <strong>${paper.title}</strong>
                <p>${paper.subtitle}</p>
            </div>
            <div class="answer-paper-banner-score">
                <span>总分</span>
                <strong>${scoreValue(row.total, true)}</strong>
            </div>
        </div>
    </section>`;
}

function answerInfoSection(title, items, variant = '') {
    return `
    <section class="card answer-detail-card">
        <h3>${title}</h3>
        <div class="answer-info-grid ${variant}">
            ${items.map(([label, value]) => `
                <div class="answer-info-item">
                    <span>${label}</span>
                    <strong>${value}</strong>
                </div>
            `).join('')}
        </div>
    </section>`;
}

function renderAnswerQuestionSections(row) {
    const paper = getAnswerPaperBlueprint(row);
    return paper.sections.map((section) => {
        const sectionScore = section.questions.reduce((sum, question) => sum + (Number(question.score) || 0), 0);
        return `
        <section class="answer-paper-section">
            <header class="answer-paper-section-head">
                <div>
                    <strong>${section.title}</strong>
                    <span>${section.questions.length} 题 · 共 ${sectionScore} 分</span>
                </div>
            </header>
            <div class="answer-paper-question-list">
                ${section.questions.map(question => renderAnswerQuestionCard(question)).join('')}
            </div>
        </section>`;
    });
}

function renderAnswerQuestionCard(question, options = {}) {
    const showScore = options.showScore !== false;
    const statusClass = question.status === '正确' || question.status === '已批阅'
        ? 'badge-green'
        : question.status === '待阅'
            ? 'badge-yellow'
            : 'badge-gray';
    return `
        <article class="answer-question-card paper-question-card">
            <div class="answer-question-head">
                <div>
                    <strong>${question.no}.</strong>
                    <em>${question.type}</em>
                    <span class="badge ${statusClass}">${question.status}</span>
                </div>
                ${showScore ? `<b>${question.awardedScore} 分</b>` : ''}
            </div>
            <p class="answer-question-title">${question.title}</p>
            <div class="answer-paper-question-body">
                <div class="answer-paper-answer-grid">
                    <div>
                        <span>用户答案</span>
                        <strong>${question.userAnswer}</strong>
                    </div>
                    <div>
                        <span>正确答案</span>
                        <strong>${question.correctAnswer}</strong>
                    </div>
                </div>
                ${question.analysis ? `
                <div class="answer-paper-analysis">
                    <span>解析</span>
                    <p>${question.analysis}</p>
                </div>` : ''}
            </div>
        </article>`;
}

function getAnswerPaperBlueprint(row) {
    const objectiveScore = typeof row.objective === 'number' ? row.objective : 0;
    const subjectiveScore = typeof row.subjective === 'number' ? row.subjective : 0;
    const sections = [
        {
            title: '第一大题',
            questions: [
                {
                    no: 1,
                    sectionTitle: '第一大题',
                    type: '单选题',
                    status: objectiveScore >= 5 ? '正确' : '错误',
                    score: 5,
                    title: '1 + 1 = ?',
                    userAnswer: '2',
                    correctAnswer: '2',
                    awardedScore: objectiveScore >= 5 ? 5 : 0,
                    answerTime: answerDetailDate(row, '09:05:00'),
                    analysis: '基础计算题，考查学生对加法运算的掌握情况。'
                },
                {
                    no: 2,
                    sectionTitle: '第一大题',
                    type: '多选题',
                    status: objectiveScore >= 10 ? '正确' : '错误',
                    score: 5,
                    title: '下列哪些属于常见的计算设备？',
                    userAnswer: '台式机、笔记本电脑',
                    correctAnswer: '台式机、笔记本电脑、平板电脑',
                    awardedScore: objectiveScore >= 10 ? 5 : 3,
                    answerTime: answerDetailDate(row, '09:08:00'),
                    analysis: '按答题配置中的客观题规则展示正确答案和部分得分。'
                },
                {
                    no: 3,
                    sectionTitle: '第一大题',
                    type: '判断题',
                    status: objectiveScore >= 15 ? '正确' : '错误',
                    score: 5,
                    title: '计算机可以帮助人们高效处理信息。',
                    userAnswer: '正确',
                    correctAnswer: '正确',
                    awardedScore: objectiveScore >= 15 ? 5 : 0,
                    answerTime: answerDetailDate(row, '09:10:00'),
                    analysis: '判断题展示标准答案与得分，方便核对客观题得分。'
                }
            ]
        },
        {
            title: '第二大题',
            questions: [
                {
                    no: 1,
                    sectionTitle: '第二大题',
                    type: '简答题',
                    status: subjectiveScore > 0 ? '已批阅' : row.subjective === '待阅' ? '待阅' : '未作答',
                    score: 10,
                    title: '请简述计算机的发展历史。',
                    userAnswer: '计算机的发展经历了电子管、晶体管、集成电路、超大规模集成电路四个阶段。',
                    correctAnswer: '计算机的发展经历了电子管、晶体管、集成电路、超大规模集成电路四个阶段。',
                    awardedScore: subjectiveScore > 0 ? 10 : 0,
                    answerTime: answerDetailDate(row, '09:20:00'),
                    analysis: '主观题按阅卷后的得分和参考答案展示，便于与答题配置对应。'
                },
                {
                    no: 2,
                    sectionTitle: '第二大题',
                    type: '简答题',
                    status: subjectiveScore > 0 ? '已批阅' : row.subjective === '待阅' ? '待阅' : '未作答',
                    score: 5,
                    title: '请结合实例说明信息技术在学习中的作用。',
                    userAnswer: '可以提高查找资料、整理知识和交流协作的效率。',
                    correctAnswer: '可从资料检索、协作学习、效率提升等角度作答。',
                    awardedScore: subjectiveScore > 0 ? 5 : 0,
                    answerTime: answerDetailDate(row, '09:24:00'),
                    analysis: '简答题通常需要按要点给分，这里展示标准答案与得分拆分。'
                },
                {
                    no: 3,
                    sectionTitle: '第二大题',
                    type: '简答题',
                    status: subjectiveScore > 0 ? '已批阅' : row.subjective === '待阅' ? '待阅' : '未作答',
                    score: 5,
                    title: '请说明日常学习中如何规范使用电脑。',
                    userAnswer: '注意正确坐姿、保护视力、合理安排使用时间。',
                    correctAnswer: '注意姿势、用眼卫生、设备安全与时间管理。',
                    awardedScore: subjectiveScore > 0 ? 5 : 0,
                    answerTime: answerDetailDate(row, '09:27:00'),
                    analysis: '按题目配置中对主观题的标准答案和评分规则进行展示。'
                }
            ]
        }
    ];
    return {
        title: row.paper || '考试答卷',
        subtitle: `${row.examName || '考试'} · ${row.name || '考生'} · ${row.group || '未知组别'}`,
        mode: '在线考试',
        total: typeof row.full === 'number' ? row.full : 100,
        sectionCount: sections.length,
        questionCount: sections.reduce((sum, section) => sum + section.questions.length, 0),
        sections
    };
}

function answerDetailPhone(phone) {
    return String(phone || '').replace('****', '0013');
}

function answerDetailDate(row, fallbackTime) {
    const date = row.submitTime && row.submitTime !== '-' ? row.submitTime.slice(0, 10) : '2024-06-15';
    return `${date} ${fallbackTime}`;
}

function scoreWithUnit(value) {
    if (typeof value === 'number') return `${value}分`;
    return scoreValue(value);
}

function getExamScoreStats(rows) {
    const numericRows = rows.filter(row => typeof row.total === 'number');
    const passRows = numericRows.filter(row => row.total >= 60);
    const totals = numericRows.map(row => row.total);
    return {
        participants: rows.filter(row => row.answerStatus !== '未开始' && row.answerStatus !== '缺考').length,
        passed: passRows.length,
        passRate: numericRows.length ? `${Math.round(passRows.length / numericRows.length * 100)}%` : '-',
        avg: numericRows.length ? `${(totals.reduce((sum, value) => sum + value, 0) / numericRows.length).toFixed(1)}分` : '-',
        highest: numericRows.length ? `${Math.max(...totals)}分` : '-',
        lowest: numericRows.length ? `${Math.min(...totals)}分` : '-'
    };
}

function renderExamScoreOverview(stats) {
    const items = [
        { label: '参考人数', value: `${stats.participants}人` },
        { label: '及格人数', value: `${stats.passed}人`, accent: 'green' },
        { label: '及格率', value: stats.passRate, accent: 'green' },
        { label: '平均分', value: stats.avg },
        { label: '最高分', value: stats.highest, accent: 'blue' },
        { label: '最低分', value: stats.lowest }
    ];
    return `
    <section class="card exam-score-overview">
        ${items.map(item => `
            <div class="exam-score-stat ${item.accent || ''}">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
            </div>
        `).join('')}
    </section>`;
}

function renderLevelScoreOverview(stats) {
    const isOverall = stats.mode === 'level-overall';
    const items = isOverall ? [
        { label: '已开始闯关人数', value: `${stats.started}人` },
        { label: '全部通关人数', value: `${stats.completed}人` },
        { label: '全部通关率', value: stats.completionRate },
        { label: '人均通关关数', value: `${stats.avgPassedLevels}关` },
        { label: '累计通关关次', value: `${stats.totalPassedLevels}次` },
        { label: '挑战进度', value: stats.challengeProgress }
    ] : [
        { label: '本关挑战人数', value: `${stats.participants}人` },
        { label: '本关通关人数', value: `${stats.passed}人` },
        { label: '本关通关率', value: stats.passRate },
        { label: '平均答对题数', value: stats.avg },
        { label: '最多答对题数', value: stats.highest },
        { label: '最少答对题数', value: stats.lowest }
    ];
    return `
    <section class="card exam-score-overview level-score-overview">
        ${items.map(item => `
            <div class="exam-score-stat">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
            </div>
        `).join('')}
    </section>`;
}

function getExamRecordPapersForCurrentGroup() {
    const groupPapers = EXAM_RECORD_PAPERS.filter(item => item.id !== 'all' && item.groupId === getRequiredExamGroupId());
    return groupPapers.length ? groupPapers : [];
}

function getExamRecordStats(rows) {
    const selectedPaper = EXAM_RECORD_PAPERS.find(item => item.id === examRecordPaper);
    if (selectedPaper && selectedPaper.id !== 'all') return selectedPaper;
    const papers = EXAM_RECORD_PAPERS.filter(item => item.id !== 'all' && (examRecordGroup === 'all' || item.groupId === examRecordGroup));
    const expected = papers.reduce((sum, item) => sum + item.expected, 0);
    const joined = papers.reduce((sum, item) => sum + item.joined, 0);
    const submitted = papers.reduce((sum, item) => sum + item.submitted, 0);
    const pendingReview = papers.reduce((sum, item) => sum + item.pendingReview, 0);
    const reviewed = papers.reduce((sum, item) => sum + item.reviewed, 0);
    const avgRows = rows.filter(row => typeof row.total === 'number');
    const avg = avgRows.length ? (avgRows.reduce((sum, row) => sum + row.total, 0) / avgRows.length).toFixed(1) : '-';
    return { expected, joined, submitted, pendingReview, reviewed, avg };
}

function renderExamGroupSelect() {
    return `
    <select class="form-control" onchange="switchExamRecordGroup(this.value)">
        ${EXAM_RECORD_GROUPS.map(group => `
            <option value="${group.id}" ${examRecordGroup === group.id ? 'selected' : ''}>${group.name}</option>
        `).join('')}
    </select>`;
}

function renderExamRequiredGroupSelect() {
    const groups = EXAM_RECORD_GROUPS.filter(group => group.id !== 'all');
    const selectedGroup = getRequiredExamGroupId();
    return `
    <select class="form-control" onchange="switchExamRecordGroup(this.value)">
        ${groups.map(group => `
            <option value="${group.id}" ${selectedGroup === group.id ? 'selected' : ''}>${group.name}</option>
        `).join('')}
    </select>`;
}

function renderLevelStageSelect() {
    return `
    <select class="form-control">
        <option>全部关卡</option>
        ${LEVEL_RECORD_STAGES.filter(stage => stage.id !== 'all').map(stage => `
            <option>${formatLevelStageName({ levelNo: parseLevelNo(stage.title), title: `${stage.title} · ${stage.subtitle}` })}</option>
        `).join('')}
    </select>`;
}

function getRequiredExamGroupId() {
    if (examRecordGroup !== 'all') return examRecordGroup;
    return EXAM_RECORD_GROUPS.find(group => group.id !== 'all')?.id || 'all';
}

function renderExamPaperSelect() {
    const papers = getExamRecordPapersForCurrentGroup();
    return `
    <select class="form-control" onchange="switchExamRecordPaper(this.value)">
        <option value="all" ${examRecordPaper === 'all' ? 'selected' : ''}>全部场次</option>
        ${papers.map(paper => `
            <option value="${paper.id}" ${examRecordPaper === paper.id ? 'selected' : ''}>${paper.examName} - ${paper.paper}</option>
        `).join('')}
    </select>`;
}

function renderExamPaperSwitcher() {
    const papers = getExamRecordPapersForCurrentGroup();
    if (!papers.length) return `<section class="card exam-paper-switcher"><div class="exam-empty">当前组别暂未配置考试/试卷</div></section>`;
    return `
    <section class="card exam-paper-switcher">
        <div class="exam-section-title">考试 / 试卷</div>
        <div class="exam-paper-cards">
            ${papers.map(paper => `
                <button class="exam-paper-card ${examRecordPaper === paper.id ? 'active' : ''}" onclick="switchExamRecordPaper('${paper.id}')">
                    <strong>${paper.examName}</strong>
                    <span>试卷：${paper.paper}</span>
                    <span>时间：${formatDateTimeRangeSecond(paper.time)}</span>
                    <div>
                        ${examPaperStatusBadge(paper.status)}
                        <em>已交卷 ${paper.submitted} / ${paper.expected}</em>
                    </div>
                </button>
            `).join('')}
        </div>
    </section>`;
}

function getDailyOverviewRows() {
    const expectedDays = 31;
    const unique = new Map();
    DAILY_RECORD_ROWS.forEach((row, index) => {
        const isUnparticipatedUser = DAILY_UNPARTICIPATED_USER_NAMES.has(row.name);
        const current = unique.get(row.name) || {
            userNo: `U${String(index + 1).padStart(4, '0')}`,
            name: row.name,
            phone: row.phone,
            group: row.group,
            groupId: row.groupId,
            org: row.org,
            scores: [],
            fallbackAttempts: 0,
            participatedDays: 0,
            qualifiedDays: 0,
            streak: row.streak || 0,
            latestAnswerTime: '-',
            todayStatus: '未答题'
        };
        if (isUnparticipatedUser) {
            unique.set(row.name, current);
            return;
        }
        const score = typeof row.dailyScore === 'number' ? row.dailyScore : null;
        current.fallbackAttempts += Number(String(row.attempts || '0').split('/')[0]) || 0;
        if (row.status !== '未答题') current.participatedDays += 1;
        if (score !== null) current.scores.push(score);
        if (score !== null && score >= 60) current.qualifiedDays += 1;
        if (row.submitTime && row.submitTime !== '-') {
            current.latestAnswerTime = formatDateTimeSecond(row.submitTime);
            current.todayStatus = row.status;
        }
        current.streak = Math.max(current.streak, row.streak || 0);
        unique.set(row.name, current);
    });
    const rows = Array.from(unique.values()).map(row => {
        const cumulativeScore = row.scores.reduce((sum, value) => sum + value, 0);
        const attemptRecords = DAILY_ATTEMPT_RECORDS.filter(record => record.name === row.name);
        return {
            ...row,
            expectedDays,
            totalAttempts: attemptRecords.length || row.fallbackAttempts,
            missedDays: Math.max(0, expectedDays - row.participatedDays),
            consecutiveAnswerDays: getConsecutiveDailyAnswerDays(row.name),
            cumulativeScore,
            avgScore: row.scores.length ? (cumulativeScore / row.scores.length).toFixed(1) : '-'
        };
    });
    return rows.sort((a, b) => b.qualifiedDays - a.qualifiedDays || b.cumulativeScore - a.cumulativeScore);
}

function getConsecutiveDailyAnswerDays(name) {
    const answeredDates = DAILY_RECORD_ROWS
        .filter(row => row.name === name && row.status !== '未答题')
        .map(row => DAILY_RECORD_DAYS.find(day => day.id === row.dayId)?.date)
        .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date))
        .sort((a, b) => new Date(b) - new Date(a));
    if (!answeredDates.length) return 0;

    let streak = 1;
    for (let i = 1; i < answeredDates.length; i += 1) {
        const prev = new Date(answeredDates[i - 1]);
        const current = new Date(answeredDates[i]);
        const diffDays = Math.round((prev - current) / 86400000);
        if (diffDays !== 1) break;
        streak += 1;
    }
    return streak;
}

function openDailyUserOverview(name) {
    navigateTo('daily-user-detail', {
        params: { name },
        source: { pageId: 'exam-records', params: {}, tabKey: activeTabKey }
    });
}

function renderDailyUserDetailPage(name) {
    const rows = getDailyUserDateRows(name);
    const user = rows.find(row => row.name === name) || DAILY_REGISTERED_USERS.find(row => row.name === name) || DAILY_RECORD_ROWS[0];
    return `
    <div class="daily-user-detail-page">
        <section class="card answer-detail-titlebar daily-user-detail-titlebar">
            <div class="answer-detail-title-left">
                ${renderSourceBack('daily-user-detail')}
                <div class="answer-detail-heading">
                    <strong>每日记录</strong>
                </div>
            </div>
        </section>
        <section class="card exam-session-user-line">
            用户信息：${name} / ${user?.phone || '-'} / ${user?.group || '-'} / ${user?.org || '-'}
        </section>
        <section class="card daily-user-record-card">
            <div class="daily-user-record-head">
                <strong>每日记录</strong>
                <div class="daily-user-record-actions">
                    <button class="btn btn-outline btn-sm">导出</button>
                </div>
            </div>
            <div class="daily-answer-table-wrap">
                <table class="daily-answer-table daily-user-detail-table">
                    <thead>
                        <tr><th>日期</th><th>答题次数</th><th>达标次数</th><th>得分</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                <td>${dailyDayLabel(row.dayId)}</td>
                                <td>${row.attempts}</td>
                                <td>${dailyQualifiedAttemptCount(row)}</td>
                                <td>${scoreValue(row.dailyScore)}</td>
                                <td>${row.status === '未答题' ? '<span style="color:var(--text-tertiary)">-</span>' : `<span class="action-link" onclick="openDailyAnswerDetailPage('${escHtml(row.name)}', '${escHtml(row.dayId)}')">答卷详情</span>`}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${renderStandardPagination(rows.length)}
        </section>
    </div>`;
}

function getDailyUserDateRows(name) {
    return DAILY_RECORD_DAYS
        .filter(day => day.id !== 'all')
        .map(day => {
            const row = getDailyRowsForDate(day.date).find(item => item.name === name);
            if (row) return row;
            const user = DAILY_REGISTERED_USERS.find(item => item.name === name) || {};
            return {
                ...user,
                dayId: day.id,
                dailyScore: '-',
                attempts: '0/1',
                duration: '-',
                status: '未答题',
                submitTime: '-'
            };
        });
}

function renderLevelStageSwitcher() {
    const stages = getLevelStagesForCurrentGroup().filter(stage => stage.id !== 'all');
    if (!stages.some(stage => stage.id === levelRecordStage) && stages.length) {
        levelRecordStage = stages[0].id;
    }
    return `
    <section class="card exam-paper-switcher answer-object-switcher level">
        <div class="exam-section-title">关卡</div>
        <div class="exam-paper-cards">
            ${stages.map(stage => `
                <button class="exam-paper-card answer-object-card ${levelRecordStage === stage.id ? 'active' : ''}" onclick="switchLevelRecordStage('${stage.id}')">
                    <strong>${stage.id === 'all' ? '全部关卡' : `${stage.title} · ${stage.subtitle}`}</strong>
                    <span>开放：${stage.date}</span>
                    <span>规则：${stage.rules}</span>
                    <div>
                        ${levelStageStatusBadge(stage.status)}
                    </div>
                </button>
            `).join('')}
        </div>
    </section>`;
}

function getDailyDaysForCurrentGroup() {
    if (examRecordGroup === 'all') return DAILY_RECORD_DAYS;
    const activeDayIds = new Set(DAILY_RECORD_ROWS.filter(row => row.groupId === examRecordGroup).map(row => row.dayId));
    return DAILY_RECORD_DAYS.filter(day => day.id === 'all' || activeDayIds.has(day.id));
}

function getLevelStagesForCurrentGroup() {
    if (examRecordGroup === 'all') return LEVEL_RECORD_STAGES;
    const activeLevelIds = new Set(LEVEL_RECORD_ROWS.filter(row => row.groupId === examRecordGroup).map(row => row.levelId));
    return LEVEL_RECORD_STAGES.filter(stage => stage.id === 'all' || activeLevelIds.has(stage.id));
}

function switchExamRecordGroup(groupId) {
    examRecordGroup = groupId;
    examRecordPaper = 'all';
    dailyRecordDay = 'all';
    levelRecordStage = answerStatsMode === 'level' ? getDefaultLevelStageId() : 'all';
    navigateTo(currentPage === 'unit-data' ? 'unit-data' : 'exam-records');
}

function switchExamRecordPaper(paperId) {
    examRecordPaper = paperId;
    navigateTo(currentPage === 'unit-data' ? 'unit-data' : 'exam-records', { keepExamRecordPaper: true });
}

function switchDailyRecordDay(dayId) {
    dailyRecordDay = dayId;
    navigateTo('exam-records');
}

function getDailyRowsForDate(date) {
    const day = DAILY_RECORD_DAYS.find(item => item.date === date);
    const baseRows = day ? DAILY_RECORD_ROWS.filter(row => row.dayId === day.id) : [];
    if (baseRows.length) return buildDailyRowsWithAbsences(date, day.id, baseRows);
    const seedRows = DAILY_RECORD_ROWS.slice(0, 7);
    const fallbackRows = seedRows.map((row, index) => {
        const score = index === 6 ? '-' : Math.max(52, 94 - index * 6 + (Number(date.slice(-2)) % 5));
        return {
            ...row,
            userNo: `U${date.slice(-2)}${String(index + 1).padStart(3, '0')}`,
            dailyScore: score,
            attempts: index === 6 ? '0/1' : '1/1',
            accuracy: typeof score === 'number' ? `${score}%` : '-',
            duration: index === 6 ? '-' : `${String(7 + index).padStart(2, '0')}分${String(22 + index * 3).padStart(2, '0')}秒`,
            status: index === 6 ? '未答题' : score >= 60 ? '已完成' : '未达标',
            submitTime: index === 6 ? '-' : `${date} ${String(9 + index).padStart(2, '0')}:${String(12 + index * 4).padStart(2, '0')}`
        };
    });
    return buildDailyRowsWithAbsences(date, day?.id || date, fallbackRows);
}

function getDailyAttemptsForUserDay(name, dayId) {
    return DAILY_ATTEMPT_RECORDS
        .filter(item => item.name === name && item.dayId === dayId)
        .sort((a, b) => a.attemptNo - b.attemptNo);
}

function getScoredDailyAttempts(name, dayId) {
    return getDailyAttemptsForUserDay(name, dayId).filter(item => typeof item.score === 'number');
}

function getCountedDailyAttempt(name, dayId) {
    const scored = getScoredDailyAttempts(name, dayId);
    if (!scored.length) return null;
    if (DAILY_SCORE_RULE === 'last') {
        return scored[scored.length - 1];
    }
    return [...scored].sort((a, b) => b.score - a.score || a.submitTime.localeCompare(b.submitTime))[0];
}

function getDailyRuleLabel() {
    return DAILY_SCORE_RULE === 'last' ? '最后一次计入' : '最高分计入';
}

function getDailyMaxAttemptsLabel() {
    return DAILY_MAX_ATTEMPTS ? String(DAILY_MAX_ATTEMPTS) : '不限';
}

function dailyQualifiedAttemptCount(row) {
    const attempts = getScoredDailyAttempts(row.name, row.dayId);
    const qualified = attempts.filter(item => item.score >= DAILY_QUALIFIED_SCORE).length;
    return qualified;
}

function buildDailyRowsWithAbsences(date, dayId, rows) {
    const rowMap = new Map(rows.map(row => [row.name, row]));
    return DAILY_REGISTERED_USERS
        .filter(user => examRecordGroup === 'all' || user.groupId === examRecordGroup)
        .map(user => {
            const row = rowMap.get(user.name);
            const attempts = getDailyAttemptsForUserDay(user.name, dayId);
            const submittedAttempts = attempts.filter(item => item.status === '已提交');
            const countedAttempt = getCountedDailyAttempt(user.name, dayId);
            const latestSubmitted = submittedAttempts[submittedAttempts.length - 1];
            if (row) {
                return {
                    ...user,
                    ...row,
                    userNo: user.userNo,
                    countedAttemptId: countedAttempt?.attemptId || '',
                    dailyScore: countedAttempt ? countedAttempt.score : row.dailyScore,
                    attempts: `${submittedAttempts.length}/${getDailyMaxAttemptsLabel()}`,
                    accuracy: countedAttempt ? countedAttempt.accuracy : row.accuracy,
                    duration: countedAttempt ? countedAttempt.duration : row.duration,
                    status: attempts.some(item => item.status === '答题中') ? '答题中' : submittedAttempts.length >= DAILY_MAX_ATTEMPTS ? '次数已用完' : row.status,
                    submitTime: latestSubmitted?.submitTime || row.submitTime,
                    scoreRule: getDailyRuleLabel()
                };
            }
            return {
                ...user,
                dayId,
                dailyScore: '-',
                cumulativeScore: '-',
                qualifiedDays: 0,
                attempts: '0/1',
                bestScore: '-',
                accuracy: '-',
                duration: '-',
                status: '未答题',
                submitTime: '-',
                streak: 0,
                absenceDate: date,
                countedAttemptId: '',
                scoreRule: getDailyRuleLabel()
            };
        });
}

function dailyPassBadge(row) {
    if (row.status === '答题中' || row.dailyScore === '答题中') return '<span class="badge badge-yellow">待提交</span>';
    if (row.status === '未答题' || row.dailyScore === '-') return '<span class="badge badge-gray">未答题</span>';
    return typeof row.dailyScore === 'number' && row.dailyScore >= 60
        ? '<span class="badge badge-green">已达标</span>'
        : '<span class="badge badge-red">未达标</span>';
}

function dailyPassText(row) {
    if (row.status === '答题中' || row.dailyScore === '答题中') return '待提交';
    if (row.status === '未答题' || row.dailyScore === '-') return '未答题';
    return typeof row.dailyScore === 'number' && row.dailyScore >= DAILY_QUALIFIED_SCORE ? '是' : '否';
}

function formatDailyModalDate(date) {
    const [, month, day] = date.split('-');
    return `${Number(month)}月${Number(day)}日`;
}

function formatDateTimeSecond(value) {
    const text = String(value ?? '').trim();
    if (!text || text === '-') return '-';
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
    if (text.includes(' 至 ')) return text.split(' 至 ').map(part => formatDateTimeSecond(part)).join(' 至 ');
    if (text.includes(' - ')) {
        const parts = text.split(' - ');
        const startDate = parts[0]?.match(/^(\d{4}-\d{2}-\d{2}) /)?.[1];
        if (parts.length === 2 && startDate && /^\d{1,2}:\d{2}$/.test(parts[1])) {
            return `${formatDateTimeSecond(parts[0])} - ${formatDateTimeSecond(`${startDate} ${parts[1]}`)}`;
        }
        return parts.map(part => formatDateTimeSecond(part)).join(' - ');
    }
    return formatDateTimeSecond(text);
}

function switchLevelRecordStage(stageId) {
    levelRecordStage = stageId;
    navigateTo(currentPage === 'unit-data' ? 'unit-data' : 'exam-records');
}

function examAnswerStatusBadge(status) {
    const map = {
        '未开始': 'badge-gray',
        '答题中': 'badge-yellow',
        '已交卷': 'badge-blue',
        '缺考': 'badge-red'
    };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function examReviewStatusBadge(status) {
    if (status === '-') return '<span style="color:var(--text-tertiary)">-</span>';
    const map = {
        '无需阅卷': 'badge-gray',
        '待阅卷': 'badge-yellow',
        '阅卷中': 'badge-blue',
        '已阅卷': 'badge-green'
    };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function examPaperStatusBadge(status) {
    const map = { '汇总': 'badge-gray', '未开始': 'badge-gray', '进行中': 'badge-yellow', '已结束': 'badge-green' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function levelStageStatusBadge(status) {
    const map = { '汇总': 'badge-gray', '已开放': 'badge-green', '未配置': 'badge-yellow', '未开放': 'badge-gray' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function dailyStatusBadge(status) {
    const map = { '已完成': 'badge-green', '答题中': 'badge-yellow', '未答题': 'badge-gray', '未达标': 'badge-red', '次数已用完': 'badge-blue' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function dailyAnsweredStatusBadge(row) {
    const answered = (Number(String(row.attempts || '0').split('/')[0]) || 0) > 0;
    return answered
        ? '<span class="badge badge-green">已答题</span>'
        : '<span class="badge badge-gray">未答题</span>';
}

function levelPassBadge(status) {
    const map = { '已通关': 'badge-green', '未通关': 'badge-red', '待挑战': 'badge-gray' };
    const labelMap = { '已通关': '已过关', '未通关': '未过关' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${labelMap[status] || status}</span>`;
}

function dailyDayLabel(dayId) {
    const day = DAILY_RECORD_DAYS.find(item => item.id === dayId);
    return day ? day.date : '-';
}

function passBadge(status) {
    const map = { '达标': 'badge-green', '未达标': 'badge-red', '待判定': 'badge-gray' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function examPassText(status) {
    if (status === '达标') return '是';
    if (status === '未达标') return '否';
    return status || '-';
}

function promoteBadge(status) {
    const map = { '晋级': 'badge-green', '未晋级': 'badge-red', '待判定': 'badge-gray' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function certificateBadge(status) {
    const map = { '已发放': 'badge-green', '发放中': 'badge-yellow', '未发放': 'badge-gray', '发放失败': 'badge-red' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function scoreValue(value, primary = false) {
    if (value === '待生成') return '<span class="badge badge-yellow">待生成</span>';
    if (value === '待阅') return '<span class="badge badge-yellow">待阅</span>';
    if (value === '-') return '<span style="color:var(--text-tertiary)">-</span>';
    return primary ? `<strong style="color:var(--primary)">${value}</strong>` : value;
}

function getLevelStageByRow(row) {
    return LEVEL_RECORD_STAGES.find(stage => stage.id === row?.levelId) || LEVEL_RECORD_STAGES.find(stage => stage.id !== 'all') || {};
}

function getLevelRecordQuestionCount(row) {
    return Number(row?.questionCount) || Number(getLevelStageByRow(row).questionCount) || 50;
}

function getLevelRecordTotalQuestionCount(row) {
    return Math.max(1, Number(row?.passedLevels) || 1) * getLevelRecordQuestionCount(row);
}

function getLevelCorrectCount(row) {
    if (typeof row?.correctCount === 'number') return row.correctCount;
    return '-';
}

function getLevelTotalCorrect(row) {
    if (typeof row?.totalCorrect === 'number') return row.totalCorrect;
    return '-';
}

function getLevelPassQuestionCount(rowOrLevel) {
    return Number(rowOrLevel?.passQuestions) || Number(getLevelStageByRow(rowOrLevel).passQuestions) || 30;
}

function formatCorrectCount(correct, total, primary = false) {
    if (correct === '-') return '<span style="color:var(--text-tertiary)">-</span>';
    const value = `${correct}/${total}`;
    return primary ? `<strong style="color:var(--primary)">${value}</strong>` : value;
}

function scoreAccuracy(row) {
    return typeof row.total === 'number' && typeof row.full === 'number' ? `${Math.round(row.total / row.full * 100)}%` : '-';
}

function scoreReviewStatus(row) {
    if (row.answerStatus === '未开始' || row.answerStatus === '答题中' || row.answerStatus === '缺考') {
        return examAnswerStatusBadge(row.answerStatus);
    }
    return examReviewStatusBadge(row.reviewStatus);
}

function getUserExamKey(row) {
    return `${String(row.name || '').trim()}__${String(row.phone || '').trim()}`;
}

function getUserExamSessionRows(row) {
    if (!row) return [];
    const key = getUserExamKey(row);
    return EXAM_RECORD_ROWS
        .filter(item => getUserExamKey(item) === key)
        .sort((a, b) => String(a.submitTime || '').localeCompare(String(b.submitTime || '')));
}

function formatUserExamSessionProgress(row) {
    const totalCount = getExamRecordPapersForCurrentGroup().length;
    return `${getUserExamAnsweredCount(row)}/${totalCount}`;
}

function getUserExamAnsweredCount(row) {
    if (isExamUnparticipatedUser(row)) return 0;
    return getUserExamSessionRows(row).filter(item => item.answerStatus === '已交卷').length;
}

function isExamUnparticipatedUser(row) {
    return EXAM_UNPARTICIPATED_USER_NAMES.has(row?.name);
}

function getUserExamSessionStats(row) {
    const rows = getUserExamSessionRows(row);
    const scoredRows = rows.filter(item => typeof item.total === 'number');
    const scores = scoredRows.map(item => item.total);
    const cumulativeScore = scores.reduce((sum, value) => sum + value, 0);
    const passedRows = scoredRows.filter(item => item.total >= 60);
    return {
        sessionCount: rows.length,
        cumulativeScore: scoredRows.length ? cumulativeScore : '-',
        avgScore: scoredRows.length ? (cumulativeScore / scoredRows.length).toFixed(1) : '-',
        highestScore: scoredRows.length ? Math.max(...scores) : '-',
        lowestScore: scoredRows.length ? Math.min(...scores) : '-',
        passCount: passedRows.length,
        passRate: scoredRows.length ? `${Math.round(passedRows.length / scoredRows.length * 100)}%` : '-'
    };
}

function getCumulativeScore(row) {
    if (isExamUnparticipatedUser(row)) return '--';
    if (typeof row.cumulativeScore !== 'undefined') return row.cumulativeScore;
    return getUserExamSessionStats(row).cumulativeScore;
}

function getQualifiedDays(row) {
    if (typeof row.qualifiedDays !== 'undefined') return row.qualifiedDays;
    return getUserExamSessionStats(row).passCount;
}

function sessionStatCard(label, value, hint = '') {
    return `
        <div style="padding:14px 16px;border:1px solid var(--border-color-light);border-radius:8px;background:#fff;display:grid;gap:6px">
            <span style="font-size:12px;color:var(--text-secondary)">${label}</span>
            <strong style="font-size:22px;line-height:1.1;color:var(--text-primary)">${value}</strong>
            ${hint ? `<em style="font-size:12px;color:var(--text-tertiary);font-style:normal">${hint}</em>` : ''}
        </div>`;
}

function renderUserExamSessionsTable(row) {
    const rows = getUserExamSessionRows(row);
    return `
        <div class="exam-session-table-wrap">
            <table class="exam-session-table">
                <thead>
                    <tr><th>场次</th><th>考试 / 试卷</th><th>本场得分</th><th>状态</th><th>操作</th></tr>
                </thead>
                <tbody>
                    ${rows.map((item, index) => {
                        return `
                            <tr>
                                <td>第${index + 1}场</td>
                                <td>
                                    <strong>${item.examName}</strong>
                                    <div style="margin-top:4px;color:var(--text-tertiary);font-size:12px">${item.paper} · ${formatDateTimeSecond(item.submitTime)}</div>
                                </td>
                                <td>${scoreValue(item.total, true)}</td>
                                <td>${scoreReviewStatus(item)}</td>
                                <td><span class="action-link" onclick="closeModal();openAnswerDetail('${escHtml(item.name)}', '${escHtml(item.paperId)}')">查看详情</span></td>
                            </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
}

function openUserExamSessions(name, phone) {
    const row = EXAM_RECORD_ROWS.find(item => item.name === name && item.phone === phone) || EXAM_RECORD_ROWS[0];
    if (!row) return;
    const stats = getUserExamSessionStats(row);
    openModal(`${row.name} - 参与考试场次记录`, `
        <div style="display:grid;gap:var(--spacing-md)">
            <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start">
                <div style="display:grid;gap:4px">
                    <strong style="font-size:16px">${row.name}</strong>
                    <span style="color:var(--text-secondary)">手机号 ${row.phone} · ${row.group} · ${row.org}</span>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px">
                ${sessionStatCard('参与场次', `${stats.sessionCount}场`)}
                ${sessionStatCard('累计得分', scoreValue(stats.cumulativeScore, true), '已出分场次汇总')}
                ${sessionStatCard('平均分', stats.avgScore === '-' ? '-' : `${stats.avgScore}分`)}
                ${sessionStatCard('及格次数', `${stats.passCount}次`, `及格率 ${stats.passRate}`)}
            </div>
            ${renderUserExamSessionsTable(row)}
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide' });
}

function openAnswerSheet(name, paper) {
    openModal('查看答卷', `
        <div style="display:grid;gap:var(--spacing-md)">
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border-color-light);padding-bottom:var(--spacing-sm)"><span>考生</span><strong>${name}</strong></div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border-color-light);padding-bottom:var(--spacing-sm)"><span>试卷</span><strong>${paper}</strong></div>
            <div class="info-box blue">这里展示用户本次作答详情、题目答案、客观题判分和主观题评分明细。</div>
        </div>
    `, null, { confirmText: '关闭', hideCancel: true });
}

function openDailyAnswerDetail(name, dayId, attemptId = '') {
    const day = DAILY_RECORD_DAYS.find(item => item.id === dayId) || DAILY_RECORD_DAYS[1];
    const row = getDailyRowsForDate(day.date).find(item => item.name === name) || DAILY_REGISTERED_USERS.find(item => item.name === name);
    const attempts = getDailyAttemptsForUserDay(name, dayId);
    const countedAttempt = getCountedDailyAttempt(name, dayId);
    const activeAttempt = attempts.find(item => item.attemptId === attemptId) || countedAttempt || attempts[0] || null;
    openModal(`${name} - ${day.date} 每日答题详情`, `
        <div class="daily-detail-modal">
            ${renderDailyDetailSummary(row, day, attempts, countedAttempt)}
            ${renderDailyAttemptTimeline(name, dayId, attempts, activeAttempt)}
            ${renderDailyAttemptPaperTabs(name, dayId, attempts, activeAttempt, row, day)}
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide daily-detail-modal-shell' });
}

function renderDailyAnswerDetailPage(name, dayId, attemptId = '') {
    const day = DAILY_RECORD_DAYS.find(item => item.id === dayId) || DAILY_RECORD_DAYS[1];
    const row = getDailyRowsForDate(day.date).find(item => item.name === name) || DAILY_REGISTERED_USERS.find(item => item.name === name);
    const attempts = getDailyAttemptsForUserDay(name, dayId);
    const countedAttempt = getCountedDailyAttempt(name, dayId);
    const activeAttempt = attempts.find(item => item.attemptId === attemptId) || countedAttempt || attempts[0] || null;
    return `
    <div class="answer-detail-page daily-answer-detail-page">
        <section class="card answer-detail-titlebar">
            <div class="answer-detail-title-left">
                ${renderSourceBack('answer-detail')}
                <div class="answer-detail-heading">
                    <strong>答卷详情</strong>
                </div>
            </div>
        </section>
        ${renderDailyAnswerPaperBanner(day, activeAttempt, row)}
        <section class="card answer-detail-card daily-answer-detail-card">
            <h3>当日答题次数记录</h3>
            ${renderDailyAttemptTimeline(name, dayId, attempts, activeAttempt)}
            ${renderDailyAttemptPaperTabs(name, dayId, attempts, activeAttempt, row, day, true)}
        </section>
    </div>`;
}

function renderDailyAnswerPaperBanner(day, activeAttempt = null, row = null) {
    return `
    <section class="card answer-paper-banner daily-answer-paper-banner">
        <div class="answer-paper-banner-head">
            <div class="answer-paper-banner-text">
                <span class="badge badge-blue">每日答题</span>
                <strong>图书馆知识题库</strong>
                <p>日期：${day?.date || '-'}</p>
            </div>
            <div class="answer-paper-banner-score">
                <span>总分</span>
                <strong>${scoreValue(activeAttempt?.score ?? row?.dailyScore ?? '-', true)}</strong>
            </div>
        </div>
    </section>`;
}

function renderDailyDetailSummary(row, day, attempts, countedAttempt) {
    const submittedCount = attempts.filter(item => item.status === '已提交').length;
    const maxLabel = getDailyMaxAttemptsLabel();
    return `
        <section class="daily-detail-summary">
            <div class="daily-detail-user">
                <strong>${row?.name || '-'}</strong>
                <span>${row?.phone || '-'} · ${row?.group || '-'} · ${row?.org || '-'}</span>
            </div>
            <div class="daily-detail-stat-grid">
                ${dailyDetailStat('答题次数', `${submittedCount}/${maxLabel}`, attempts.some(item => item.status === '答题中') ? '有进行中答题' : '')}
                ${dailyDetailStat('最近提交时间', attempts.filter(item => item.submitTime !== '-').at(-1)?.submitTime || '-')}
            </div>
        </section>`;
}

function dailyDetailStat(label, value, hint = '') {
    return `
        <div class="daily-detail-stat">
            <span>${label}</span>
            <strong>${value}</strong>
            ${hint ? `<em>${hint}</em>` : ''}
        </div>`;
}

function renderDailyAttemptTimeline(name, dayId, attempts, activeAttempt) {
    if (!attempts.length) {
        return `<section class="daily-detail-section"><h4>答题次数记录</h4><div class="daily-detail-empty">当天暂无答题记录。</div></section>`;
    }
    return `
        <section class="daily-detail-section">
            <div class="daily-detail-section-head">
                <h4>答题次数记录</h4>
            </div>
            <div class="daily-attempt-table-wrap">
                <table class="daily-attempt-table">
                    <thead>
                        <tr><th>次数</th><th>得分</th><th>用时</th><th>开始时间</th><th>提交时间</th></tr>
                    </thead>
                    <tbody>
                        ${attempts.map(attempt => {
                            return `
                                <tr class="${activeAttempt?.attemptId === attempt.attemptId ? 'active' : ''}">
                                    <td>第${attempt.attemptNo}次</td>
                                    <td>${scoreValue(attempt.score, true)}</td>
                                    <td>${attempt.duration}</td>
                                    <td>${formatDateTimeSecond(attempt.startTime)}</td>
                                    <td>${formatDateTimeSecond(attempt.submitTime)}</td>
                                </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </section>`;
}

function renderDailyAttemptPaperTabs(name, dayId, attempts, activeAttempt, row, day, asPage = false) {
    if (!attempts.length) {
        return `<section class="daily-detail-section"><h4>答卷详情</h4><div class="daily-detail-empty">暂无可查看的答卷内容。</div></section>`;
    }
    return `
        <section class="daily-detail-section daily-paper-section">
            <div class="daily-paper-tabs">
                ${attempts.map(attempt => `
                    <button class="${activeAttempt?.attemptId === attempt.attemptId ? 'active' : ''}" onclick="${asPage ? `openDailyAnswerDetailPage('${escHtml(name)}', '${escHtml(dayId)}', '${escHtml(attempt.attemptId)}')` : `openDailyAnswerDetail('${name}', '${dayId}', '${attempt.attemptId}')`}">
                        第${attempt.attemptNo}次答卷
                    </button>
                `).join('')}
            </div>
            ${renderDailyAttemptPaper(activeAttempt, row, day)}
        </section>`;
}

function renderDailyAttemptPaper(attempt, row, day) {
    if (!attempt) {
        return `<div class="daily-detail-empty">暂无可查看的答卷内容。</div>`;
    }
    if (attempt.status === '答题中') {
        return `
        <div>
            <div class="daily-detail-empty">该用户当前正在答题，提交后可查看题目答案、判分和解析。</div>
        </div>`;
    }
    const questions = getDailyAttemptQuestions(attempt);
    return `
        <div>
            <div class="daily-detail-section-head">
                <h4>第${attempt.attemptNo}次答卷</h4>
                <span>${day.date} · ${row?.group || '-'} · ${attempt.score}分 · ${attempt.duration}</span>
            </div>
            <div class="daily-question-list">
                ${questions.map((question, index) => renderDailyQuestionCard(question, index)).join('')}
            </div>
        </div>`;
}

function getDailyAttemptQuestions(attempt) {
    const score = typeof attempt.score === 'number' ? attempt.score : 0;
    return [
        { type: '单选题', title: '公共图书馆向社会公众提供服务应遵循哪项原则？', userAnswer: score >= 60 ? '免费、平等、开放' : '仅面向会员开放', correctAnswer: '免费、平等、开放', score: 2, awardedScore: score >= 60 ? 2 : 0, status: score >= 60 ? '正确' : '错误', analysis: '公共文化服务强调均等、开放和公益属性。' },
        { type: '判断题', title: '读者证遗失后应及时挂失，避免被他人冒用。', userAnswer: '正确', correctAnswer: '正确', score: 2, awardedScore: 2, status: '正确', analysis: '证件遗失后及时挂失是常见读者服务规范。' },
        { type: '多选题', title: '下列哪些属于图书馆常见数字资源？', userAnswer: score >= 80 ? '电子书、数据库、数字报刊' : '电子书、数据库', correctAnswer: '电子书、数据库、数字报刊', score: 4, awardedScore: score >= 80 ? 4 : 2, status: score >= 80 ? '正确' : '部分正确', analysis: '多选题可展示部分得分，便于管理员核对得分率。' },
        { type: '填空题', title: '世界读书日是每年的____。', userAnswer: '4月23日', correctAnswer: '4月23日', score: 2, awardedScore: 2, status: '正确', analysis: '本题为标准答案填空题，系统自动判分。' }
    ];
}

function renderDailyQuestionCard(question, index) {
    const statusClass = question.status === '正确' ? 'badge-green' : question.status === '部分正确' ? 'badge-yellow' : 'badge-red';
    const resultText = typeof question.score === 'number' ? `${question.awardedScore} 分` : '按答对题数计入';
    return `
        <article class="daily-question-card">
            <div class="daily-question-head">
                <div>
                    <strong>${index + 1}. ${question.type}</strong>
                    <span class="badge ${statusClass}">${question.status}</span>
                </div>
                <b>${resultText}</b>
            </div>
            <p>${question.title}</p>
            <div class="daily-question-answer-grid">
                <div><span>用户答案</span><strong>${question.userAnswer}</strong></div>
                <div><span>正确答案</span><strong>${question.correctAnswer}</strong></div>
            </div>
            <div class="daily-question-analysis"><span>解析</span><p>${question.analysis}</p></div>
        </article>`;
}

function openExamRecord(name, phone, org, status, examName, score, total, pass, passed, startTime, endTime, submitTime) {
    const statusBadge = status === '已交卷' ? 'badge-green' : status === '进行中' ? 'badge-yellow' : 'badge-gray';
    openModal('考试记录', `<div style="display:grid;gap:var(--spacing-md)">
        <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">考试名称</span><strong>${examName}</strong></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-sm)">
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">姓名</span><strong>${name}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">手机号</span><span>${phone}</span></div>
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">得分</span><strong style="color:var(--primary)">${score}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">总分</span><strong>${total}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">及格分</span><strong>${pass}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">是否及格</span><span class="badge badge-green">${passed}</span></div>
        </div>
        <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">状态</span><span class="badge ${statusBadge}">${status}</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-sm)">
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">开始时间</span><span>${formatDateTimeSecond(startTime)}</span></div>
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">结束时间</span><span>${endTime}</span></div>
        </div>
        <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0"><span style="color:var(--text-muted)">交卷时间</span><span>${formatDateTimeSecond(submitTime)}</span></div>
    </div>`, null, { confirmText: '关闭', hideCancel: true });
}

// renderExamRecordModal — kept as reference for future dynamic data


// ===== 单位数据 =====
registerPage('unit-data', () => {
    return `
    ${pageHeader('🏢 单位数据情况', '活动管理 / [当前活动] / 单位数据情况')}
    <div class="unit-data-page">
        ${renderUnitDataModeSwitch()}
        ${renderUnitDataObjectSwitcher()}
        <section class="card exam-score-filter unit-data-filter">
            ${renderUnitDataFilter()}
        </section>

        <section class="card unit-data-table-card">
            ${unitDataMode === 'exam' ? renderExamRecordPaperInfo() : ''}
            <div class="review-list-title">${getUnitDataTableTitle()}</div>
            <div class="unit-data-table-wrap">
                ${renderUnitDataTable()}
            </div>
            ${renderStandardPagination(getUnitDataRows().length)}
        </section>
    </div>`;
});

function renderUnitDataFilter() {
    if (unitDataMode === 'exam') {
        // Dev note: 场次选择为单场次时，列表中才展示“及格人数”列。
        return `
        <div class="exam-filter-form unit-exam-filter-form">
            <label><span>组别</span>${renderExamRequiredGroupSelect()}</label>
            <label><span>场次</span>${renderExamPaperSelect()}</label>
            <label><span>选送单位</span><input class="form-control" placeholder="请输入选送单位"></label>
            <div class="exam-filter-actions">
                <button class="btn btn-primary btn-sm">查询</button>
                <button class="btn btn-outline btn-sm">重置</button>
                <button class="btn btn-outline btn-sm">导出</button>
            </div>
        </div>`;
    }
    if (unitDataMode === 'daily') {
        return `
        <div class="exam-filter-form unit-daily-filter-form">
            <label><span>组别</span>${renderExamRequiredGroupSelect()}</label>
            <label><span>选送单位</span><input class="form-control" placeholder="请输入选送单位"></label>
            <label class="exam-filter-range"><span>日期</span>
                <span class="score-range-control">
                    <input class="form-control" type="date" aria-label="开始日期">
                    <span>-</span>
                    <input class="form-control" type="date" aria-label="结束日期">
                </span>
            </label>
            <div class="exam-filter-actions">
                <button class="btn btn-primary btn-sm">查询</button>
                <button class="btn btn-outline btn-sm">重置</button>
                <button class="btn btn-outline btn-sm">导出</button>
            </div>
        </div>`;
    }
    if (unitDataMode === 'level') {
        return `
        <div class="exam-filter-form unit-level-filter-form">
            <label><span>组别</span>${renderExamRequiredGroupSelect()}</label>
            <label><span>选送单位</span><input class="form-control" placeholder="请输入选送单位"></label>
            <label><span>关卡</span>${renderLevelStageSelect()}</label>
            <div class="exam-filter-actions">
                <button class="btn btn-primary btn-sm">查询</button>
                <button class="btn btn-outline btn-sm">重置</button>
                <button class="btn btn-outline btn-sm">导出</button>
            </div>
        </div>`;
    }
    const objectLabel = unitDataMode === 'exam' ? '全部考试 / 试卷' : unitDataMode === 'daily' ? '全部每日答题' : '全部关卡';
    const objectOptions = unitDataMode === 'exam'
        ? ['第一场考试', '第二场考试', '初赛', '复赛']
        : unitDataMode === 'daily'
            ? ['6月9日', '6月10日', '6月11日', '全部日期']
            : ['第 1 关', '第 2 关', '第 3 关', '全部关卡'];
    return `
    <div class="unit-data-filter-row">
        ${renderExamGroupSelect()}
        <input class="form-control" placeholder="单位名称">
        <select class="form-control">
            <option>${objectLabel}</option>
            ${objectOptions.map(option => `<option>${option}</option>`).join('')}
        </select>
        <button class="btn btn-primary btn-sm">查询</button>
        <button class="btn btn-outline btn-sm">重置</button>
    </div>`;
}

function getUnitDataModeConfig(mode = unitDataMode) {
    const configs = {
        exam: { label: '在线考试', title: '考试 / 试卷', tableTitle: '单位考试数据', desc: '看各单位是否组织到位、交卷是否充分，以及已出分用户的成绩表现。' },
        daily: { label: '每日答题', title: '每日计划', tableTitle: '单位每日答题数据', desc: '看各单位每日答题的参与覆盖、达标质量和平均成绩。' },
        level: { label: '趣味闯关', title: '关卡', tableTitle: '单位闯关数据', desc: '看各单位闯关参与覆盖、通关质量和平均答对情况。' }
    };
    return configs[mode] || configs.exam;
}

function renderUnitDataModeSwitch() {
    const modes = ['exam', 'daily', 'level'];
    return `
    <section class="card answer-mode-panel unit-mode-panel">
        <div class="answer-mode-tabs" role="tablist" aria-label="单位数据模式">
            ${modes.map(mode => {
                const config = getUnitDataModeConfig(mode);
                return `
                <button class="${unitDataMode === mode ? 'active' : ''}" onclick="switchUnitDataMode('${mode}')">
                    <strong>${config.label}</strong>
                </button>`;
            }).join('')}
        </div>
        <p>${getUnitDataModeConfig().desc}</p>
    </section>`;
}

function switchUnitDataMode(mode) {
    unitDataMode = mode;
    answerStatsMode = mode;
    examRecordPaper = 'all';
    dailyRecordDay = 'all';
    levelRecordStage = mode === 'level' ? getDefaultLevelStageId() : 'all';
    navigateTo('unit-data');
}

function renderUnitDataObjectSwitcher() {
    if (unitDataMode === 'exam') return '';
    if (unitDataMode === 'level') return '';
    return '';
}

function renderUnitDailyObjectSwitcher() {
    const days = DAILY_RECORD_DAYS.filter(day => day.id !== 'all');
    return `
    <section class="card exam-paper-switcher answer-object-switcher daily">
        <div class="exam-section-title">每日计划</div>
        <div class="exam-paper-cards">
            ${days.map(day => `
                <button class="exam-paper-card answer-object-card ${dailyRecordDay === day.id ? 'active' : ''}" onclick="switchUnitDailyRecordDay('${day.id}')">
                    <strong>${day.title} · ${day.subtitle}</strong>
                    <span>日期：${day.date}</span>
                    <span>规则：${day.rules}</span>
                    <div>
                        ${examPaperStatusBadge(day.status)}
                        <em>完成 / 报名人数 ${day.completed} / ${day.expected}</em>
                    </div>
                    <small>达标率：${day.completed ? formatPercent(day.qualified, day.completed) : 0}% ｜ 平均分：${day.avg}</small>
                </button>
            `).join('')}
        </div>
    </section>`;
}

function switchUnitDailyRecordDay(dayId) {
    dailyRecordDay = dayId;
    navigateTo('unit-data');
}

function getUnitDataRows() {
    if (unitDataMode === 'daily') return getUnitDailyDataRows();
    if (unitDataMode === 'level') return getUnitLevelDataRows();
    return getUnitExamDataRows();
}

function getUnitDataTableTitle() {
    return getUnitDataModeConfig().tableTitle;
}

function renderUnitDataTable() {
    if (unitDataMode === 'daily') return renderUnitDailyDataTable();
    if (unitDataMode === 'level') return renderUnitLevelDataTable();
    return renderUnitExamDataTable();
}

function renderUnitExamDataTable() {
    const rows = getUnitDataRows();
    const isSingleExam = isUnitExamSingleSession();
    const avgScoreHelp = '平均分：该单位下参与考试人员的总分数之和 / 参与考试人数。';
    return `
    <table class="unit-data-table">
        <thead>
            <tr><th>单位名称</th><th>报名人数</th><th>参与人数</th>${isSingleExam ? '<th>及格人数</th>' : ''}<th>平均分 ${fieldHelpIcon(avgScoreHelp)}</th><th>操作</th></tr>
        </thead>
        <tbody>
            ${rows.map((row, index) => `
                <tr>
                    <td><strong>${row.name}</strong></td>
                    <td>${row.expected}</td>
                    <td>${row.participants}</td>
                    ${isSingleExam ? `<td>${row.passed}</td>` : ''}
                    <td>${row.avgScore}</td>
                    <td><span class="action-link" onclick="openUnitExamDetail('${escHtml(row.name)}')">查看详情</span></td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

function renderUnitDailyDataTable() {
    const rows = getUnitDataRows();
    return `
    <table class="unit-data-table">
        <thead>
            <tr><th>单位名称</th><th>报名人数</th><th>参与答题人数</th><th>平均分 ${fieldHelpIcon('平均分：该单位内已参与用户每日答题个人总分的平均值，个人总分按每日最高分累计计算')}</th><th>操作</th></tr>
        </thead>
        <tbody>
            ${rows.map((row, index) => `
                <tr>
                    <td><strong>${row.name}</strong></td>
                    <td>${row.expected}</td>
                    <td>${row.answeredUsers}</td>
                    <td>${row.avgScore}</td>
                    <td><span class="action-link" onclick="openUnitDailyDetail('${escHtml(row.name)}')">查看详情</span></td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

function renderUnitLevelDataTable() {
    const rows = getUnitDataRows();
    return `
    <table class="unit-data-table">
        <thead>
            <tr><th>单位名称</th><th>报名人数</th><th>参与闯关人数</th><th>闯关成功人数 ${fieldHelpIcon('闯关成功人数：已成功通过活动全部关卡的用户数量')}</th><th>操作</th></tr>
        </thead>
        <tbody>
            ${rows.map((row, index) => `
                <tr>
                    <td><strong>${row.name}</strong></td>
                    <td>${row.expected}</td>
                    <td>${row.challengedUsers}</td>
                    <td>${row.successUsers}</td>
                    <td><span class="action-link" onclick="openUnitLevelDetail('${escHtml(row.name)}')">查看详情</span></td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

function getUnitExamDataRows() {
    const rows = getExamRecordRows();
    return groupRowsByOrg(rows).map(([org, orgRows]) => {
        const base = UNIT_DATA_ROWS.find(item => item.name === org) || {};
        const personRows = getUnitExamPersonRows(org, examRecordPaper);
        const participatedRows = personRows.filter(row => row.participated);
        const totalScore = participatedRows.reduce((sum, row) => sum + (typeof row.score === 'number' ? row.score : 0), 0);
        const passedRows = participatedRows.filter(row => row.passed === '达标' || (typeof row.score === 'number' && row.score >= 60));
        const expected = base.expected || getExpectedUsersByOrg(org, orgRows);
        return {
            ...base,
            name: org,
            expected,
            participants: participatedRows.length,
            submitted: participatedRows.length,
            pendingReview: orgRows.filter(row => row.reviewStatus === '待阅卷').length,
            reviewed: participatedRows.filter(row => typeof row.score === 'number').length,
            totalScore,
            avgScore: participatedRows.length ? (totalScore / participatedRows.length).toFixed(1) : '-',
            passed: passedRows.length
        };
    });
}

function getUnitDailyDataRows() {
    const users = getDailyUsersForRequiredGroup();
    return groupRowsByOrg(users).map(([org, orgUsers]) => {
        const personRows = getUnitDailyPersonRows(org);
        const answeredRows = personRows.filter(row => row.participated);
        const scoredRows = answeredRows.filter(row => typeof row.avgScore === 'number');
        const totalScore = scoredRows.reduce((sum, row) => sum + row.avgScore, 0);
        return {
            name: org,
            expected: orgUsers.length,
            answeredUsers: answeredRows.length,
            avgScore: scoredRows.length ? (totalScore / scoredRows.length).toFixed(1) : '-'
        };
    });
}

function getUnitLevelDataRows() {
    const groupId = getRequiredExamGroupId();
    const rows = LEVEL_RECORD_ROWS.filter(row => row.groupId === groupId);
    return groupRowsByOrg(rows).map(([org, orgRows]) => {
        const personRows = getUnitLevelPersonRows(org);
        const challengedRows = personRows.filter(row => row.participated);
        return {
            name: org,
            expected: orgRows.length,
            challengedUsers: challengedRows.length,
            successUsers: challengedRows.filter(row => (Number(row.passedLevels) || 0) > 0).length
        };
    });
}

function groupRowsByOrg(rows) {
    const map = new Map();
    rows.forEach(row => {
        const org = row.org || '未填写单位';
        if (!map.has(org)) map.set(org, []);
        map.get(org).push(row);
    });
    return Array.from(map.entries());
}

function uniqueCount(rows, keyGetter) {
    return new Set(rows.map(keyGetter)).size;
}

function getExpectedUsersByOrg(org, rows) {
    const registered = DAILY_REGISTERED_USERS.filter(user => user.org === org && (examRecordGroup === 'all' || user.groupId === examRecordGroup));
    if (registered.length) return registered.length;
    return uniqueCount(rows, row => `${row.name}-${row.phone}`);
}

function getUnitDataSummary() {
    const expected = UNIT_DATA_ROWS.reduce((sum, row) => sum + row.expected, 0);
    const submitted = UNIT_DATA_ROWS.reduce((sum, row) => sum + row.submitted, 0);
    const pendingReview = UNIT_DATA_ROWS.reduce((sum, row) => sum + row.pendingReview, 0);
    const reviewed = UNIT_DATA_ROWS.reduce((sum, row) => sum + row.reviewed, 0);
    const totalScore = UNIT_DATA_ROWS.reduce((sum, row) => sum + row.totalScore, 0);
    return {
        unitCount: UNIT_DATA_ROWS.length,
        expected,
        submitted,
        pendingReview,
        avgScore: reviewed ? (totalScore / reviewed).toFixed(1) : '-'
    };
}

function unitOverviewCard(label, value, desc) {
    return `
    <div class="unit-overview-card">
        <span>${label}</span>
        <strong>${value}</strong>
        <em>${desc}</em>
    </div>`;
}

function fieldHelpIcon(text) {
    return `<span class="field-help tooltip" data-tooltip="${text}" aria-label="${text}">?</span>`;
}

function formatPercent(part, total) {
    if (!total || total === '-') return '0';
    return Math.round(part / total * 1000) / 10;
}

function unitAbsenceValue(value) {
    if (value === '-') return '<span style="color:var(--text-tertiary)">暂未统计</span>';
    return value > 0 ? `<span class="badge badge-red">${value}</span>` : '<span class="badge badge-green">0</span>';
}

function unitPendingReviewValue(value) {
    return value > 0 ? `<span class="badge badge-yellow">${value}</span>` : '<span class="badge badge-green">0</span>';
}

function unitRateBadge(rate) {
    const cls = rate >= 80 ? 'badge-green' : rate >= 60 ? 'badge-yellow' : 'badge-red';
    return `<span class="badge ${cls}">${rate}%</span>`;
}

function openUnitAnswerDetail(unitName) {
    if (unitDataMode === 'daily') return openUnitDailyDetail(unitName);
    if (unitDataMode === 'level') return openUnitLevelDetail(unitName);
    return openUnitExamDetail(unitName);
}

function openUnitLevelDetail(unitName) {
    navigateTo('unit-level-detail', {
        params: { unitName },
        source: { pageId: 'unit-data', params: {}, tabKey: activeTabKey }
    });
}

registerPage('unit-level-detail', () => {
    const { unitName } = currentPageParams || {};
    return renderUnitLevelDetailPage(unitName || '');
});

function renderUnitLevelDetailPage(unitName) {
    const rows = getUnitLevelPersonRows(unitName);
    return `
    <div class="daily-user-detail-page unit-level-detail-page">
        <section class="card answer-detail-titlebar daily-user-detail-titlebar">
            <div class="answer-detail-title-left">
                ${renderSourceBack('unit-level-detail')}
                <div class="answer-detail-heading">
                    <strong>${unitName || '-'}</strong>
                </div>
            </div>
        </section>
        <section class="card daily-user-record-card">
            <div class="daily-user-record-head">
                <strong>报名人员列表</strong>
                <div class="daily-user-record-actions">
                    <button class="btn btn-outline btn-sm">导出</button>
                </div>
            </div>
            <div class="daily-answer-table-wrap">
                <table class="daily-answer-table unit-level-detail-table">
                    <thead>
                        <tr><th>姓名</th><th>手机号码</th><th>组别</th><th>是否参与闯关</th><th>过关数 ${fieldHelpIcon('过关数：已过关关卡数 / 活动总关卡数')}</th><th>闯关次数 ${fieldHelpIcon('闯关次数：所有关卡闯关累计的总次数')}</th><th>用时 ${fieldHelpIcon('用时：是指各关卡通关那次耗时之和。失败或重试的耗时不计入统计。')}</th></tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                <td><strong>${row.name}</strong></td>
                                <td>${row.phone}</td>
                                <td>${row.group}</td>
                                <td>${row.participated ? '是' : '否'}</td>
                                <td>${row.passedCountText}</td>
                                <td>${row.totalAttempts}</td>
                                <td>${row.totalDuration}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${renderStandardPagination(rows.length)}
        </section>
    </div>`;
}

function getUnitLevelDetailSummary(unitName, rows) {
    const unitRow = getUnitLevelDataRows().find(row => row.name === unitName) || {};
    return {
        expected: unitRow.expected ?? rows.length,
        challengedUsers: unitRow.challengedUsers ?? rows.filter(row => row.participated).length,
        successUsers: unitRow.successUsers ?? rows.filter(row => (Number(row.passedLevels) || 0) >= getLevelTotalCount()).length
    };
}

function getUnitLevelPersonRows(unitName) {
    const groupId = getRequiredExamGroupId();
    return LEVEL_RECORD_ROWS
        .filter(row => row.groupId === groupId && row.org === unitName)
        .map(row => {
            const progressRows = getLevelRecordRowsForUser(row);
            const totalAttempts = progressRows.reduce((sum, level) => sum + level.attemptCount, 0);
            return {
                ...row,
                participated: row.passStatus !== '待挑战',
                passedCountText: formatPassedLevelCount(row),
                totalAttempts,
                totalDuration: getUserLevelTotalDuration(progressRows)
            };
        });
}

function openUnitDailyDetail(unitName) {
    navigateTo('unit-daily-detail', {
        params: { unitName },
        source: { pageId: 'unit-data', params: {}, tabKey: activeTabKey }
    });
}

registerPage('unit-daily-detail', () => {
    const { unitName } = currentPageParams || {};
    return renderUnitDailyDetailPage(unitName || '');
});

function renderUnitDailyDetailPage(unitName) {
    const rows = getUnitDailyPersonRows(unitName);
    return `
    <div class="daily-user-detail-page unit-daily-detail-page">
        <section class="card answer-detail-titlebar daily-user-detail-titlebar">
            <div class="answer-detail-title-left">
                ${renderSourceBack('unit-daily-detail')}
                <div class="answer-detail-heading">
                    <strong>${unitName || '-'}</strong>
                </div>
            </div>
        </section>
        <section class="card daily-user-record-card">
            <div class="daily-user-record-head">
                <strong>报名人员列表</strong>
                <div class="daily-user-record-actions">
                    <button class="btn btn-outline btn-sm">导出</button>
                </div>
            </div>
            <div class="daily-answer-table-wrap">
                <table class="daily-answer-table unit-daily-detail-table">
                    <thead>
                        <tr><th>姓名</th><th>手机号码</th><th>组别</th><th>是否参与答题</th><th>总分 ${fieldHelpIcon('总分：每日最高分累计之和')}</th></tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                <td><strong>${row.name}</strong></td>
                                <td>${row.phone}</td>
                                <td>${row.group}</td>
                                <td>${row.participated ? '是' : '否'}</td>
                                <td>${scoreValue(row.score)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${renderStandardPagination(rows.length)}
        </section>
    </div>`;
}

function getUnitDailyDetailSummary(unitName) {
    return getUnitDailyDataRows().find(row => row.name === unitName) || {
        expected: 0,
        answeredUsers: 0,
        avgScore: '-'
    };
}

function getUnitDailyPersonRows(unitName) {
    return getDailyUsersForRequiredGroup()
        .filter(user => user.org === unitName)
        .map(user => {
            const records = DAILY_RECORD_ROWS.filter(row => row.name === user.name && row.phone === user.phone);
            const scoredRows = records.filter(row => typeof row.dailyScore === 'number');
            const totalScore = scoredRows.reduce((sum, row) => sum + row.dailyScore, 0);
            const qualifiedDays = scoredRows.filter(row => row.dailyScore >= DAILY_QUALIFIED_SCORE).length;
            return {
                ...user,
                participated: scoredRows.length > 0,
                score: scoredRows.length ? totalScore : '-',
                avgScore: scoredRows.length ? totalScore / scoredRows.length : '-',
                qualifiedDays
            };
        });
}

function getDailyUsersForRequiredGroup() {
    const groupId = getRequiredExamGroupId();
    return DAILY_REGISTERED_USERS.filter(user => user.groupId === groupId);
}

function openUnitExamDetail(unitName) {
    navigateTo('unit-exam-detail', {
        params: { unitName, paperId: examRecordPaper },
        source: { pageId: 'unit-data', params: {}, tabKey: activeTabKey }
    });
}

registerPage('unit-exam-detail', () => {
    const { unitName, paperId } = currentPageParams || {};
    return renderUnitExamDetailPage(unitName || '', paperId || examRecordPaper);
});

function renderUnitExamDetailPage(unitName, paperId) {
    const resolvedUnitName = unitName || getDefaultUnitExamDetailName();
    const isSingleExam = isUnitExamSingleSession(paperId);
    const rows = getUnitExamPersonRows(resolvedUnitName, paperId);
    return `
    <div class="daily-user-detail-page unit-exam-detail-page">
        <section class="card answer-detail-titlebar daily-user-detail-titlebar">
            <div class="answer-detail-title-left">
                ${renderSourceBack('unit-exam-detail')}
                <div class="answer-detail-heading">
                    <strong>${resolvedUnitName || '-'}</strong>
                </div>
            </div>
        </section>
        <section class="card daily-user-record-card">
            <div class="daily-user-record-head">
                <strong>报名人员列表</strong>
                <div class="daily-user-record-actions">
                    <button class="btn btn-outline btn-sm">导出</button>
                </div>
            </div>
            <div class="daily-answer-table-wrap">
                <table class="daily-answer-table unit-exam-detail-table">
                    <thead>
                        <tr><th>姓名</th><th>手机号码</th><th>组别</th><th>是否参与考试</th><th>分数</th>${isSingleExam ? '<th>是否及格</th>' : ''}</tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                <td><strong>${row.name}</strong></td>
                                <td>${row.phone}</td>
                                <td>${row.group}</td>
                                <td>${row.participated ? '是' : '否'}</td>
                                <td>${scoreValue(row.score)}</td>
                                ${isSingleExam ? `<td>${row.participated ? examPassText(row.passed) : '-'}</td>` : ''}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${renderStandardPagination(rows.length)}
        </section>
    </div>`;
}

function getDefaultUnitExamDetailName() {
    return getUnitExamDataRows()[0]?.name || '';
}

function getUnitExamDetailSummary(unitName, rows) {
    const unitRow = getUnitExamDataRows().find(row => row.name === unitName) || {};
    const participatedRows = rows.filter(row => row.participated);
    const totalScore = participatedRows.reduce((sum, row) => sum + (typeof row.score === 'number' ? row.score : 0), 0);
    return {
        expected: unitRow.expected ?? rows.length,
        participants: participatedRows.length,
        avgScore: participatedRows.length ? (totalScore / participatedRows.length).toFixed(1) : '-'
    };
}

function getUnitExamPersonRows(unitName, paperId = examRecordPaper) {
    const singleExam = isUnitExamSingleSession(paperId);
    const totalSessions = singleExam ? 1 : getExamRecordPapersForCurrentGroup().length;
    const sourceRows = EXAM_RECORD_ROWS.filter(row => row.org === unitName && (singleExam ? row.paperId === paperId : true));
    const userMap = new Map();
    sourceRows.forEach(row => {
        const key = `${row.name}-${row.phone}`;
        const current = userMap.get(key) || {
            name: row.name,
            phone: row.phone,
            group: row.group,
            groupId: row.groupId,
            participated: false,
            participatedSessions: 0,
            totalSessions,
            scores: [],
            passedCount: 0,
            passed: row.passed
        };
        current.participated = current.participated || isExamParticipated(row);
        if (isExamParticipated(row)) current.participatedSessions += 1;
        if (typeof row.total === 'number') current.scores.push(row.total);
        if (row.passed === '达标' || (typeof row.total === 'number' && row.total >= 60)) current.passedCount += 1;
        current.passed = row.passed;
        userMap.set(key, current);
    });
    return Array.from(userMap.values()).map(row => ({
        ...row,
        sessionProgress: `${row.participatedSessions}/${row.totalSessions}`,
        score: row.participated
            ? (singleExam
                ? (row.scores[0] ?? '-')
                : (row.scores.length ? row.scores.reduce((sum, value) => sum + value, 0) : '-'))
            : '--',
        passed: singleExam ? row.passed : row.passedCount > 0 ? '达标' : '未达标'
    }));
}

function isExamParticipated(row) {
    if (isExamUnparticipatedUser(row)) return false;
    return row.answerStatus === '已交卷' || row.answerStatus === '答题中';
}

function isUnitExamSingleSession(paperId = examRecordPaper) {
    return paperId && paperId !== 'all';
}

function getExamPaperName(paperId) {
    return EXAM_RECORD_PAPERS.find(item => item.id === paperId)?.examName || '全部场次';
}

function openUnitExamAnswerDetailModal(unitName) {
    const fallbackRows = getExamRecordRows().filter(row => row.org === unitName);
    openModal('单位答题明细', `
        <div class="unit-detail-meta">
            <div><span>单位名称</span><strong>${unitName}</strong></div>
            <div><span>明细人数</span><strong>${fallbackRows.length}</strong></div>
        </div>
        <div class="unit-detail-table-wrap">
            <table class="unit-detail-table">
                <thead>
                    <tr><th>姓名</th><th>手机号</th><th>组别</th><th>考试名称</th><th>试卷名称</th><th>答题状态</th><th>阅卷状态</th><th>客观题得分</th><th>主观题得分</th><th>总得分</th><th>排名</th><th>是否及格</th><th>交卷时间</th><th>答题用时</th><th>操作</th></tr>
                </thead>
                <tbody>
                    ${fallbackRows.map(row => `
                        <tr>
                            <td><strong>${row.name}</strong></td>
                            <td>${row.phone}</td>
                            <td>${row.group}</td>
                            <td>${row.examName}</td>
                            <td>${row.paper}</td>
                            <td>${examAnswerStatusBadge(row.answerStatus)}</td>
                            <td>${examReviewStatusBadge(row.reviewStatus)}</td>
                            <td>${row.objective}</td>
                            <td>${scoreValue(row.subjective)}</td>
                            <td>${scoreValue(row.total, true)}</td>
                            <td>${row.rank}</td>
                            <td>${examPassText(row.passed)}</td>
                            <td>${formatDateTimeSecond(row.submitTime)}</td>
                            <td>${row.duration}</td>
                            <td><span class="action-link" onclick="openAnswerSheet('${row.name}', '${row.paper}')">查看答卷</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide' });
}

function openUnitDailyAnswerDetail(unitName) {
    const rows = getDailyRecordRows().filter(row => row.org === unitName);
    openModal('单位每日答题明细', `
        <div class="unit-detail-meta">
            <div><span>单位名称</span><strong>${unitName}</strong></div>
            <div><span>明细记录</span><strong>${rows.length}</strong></div>
        </div>
        <div class="unit-detail-table-wrap">
            <table class="unit-detail-table">
                <thead>
                    <tr><th>姓名</th><th>手机号</th><th>组别</th><th>日期</th><th>计入成绩</th><th>达标状态</th><th>答题次数</th><th>达标次数</th><th>提交时间</th><th>操作</th></tr>
                </thead>
                <tbody>
                    ${rows.map(row => `
                        <tr>
                            <td><strong>${row.name}</strong></td>
                            <td>${row.phone}</td>
                            <td>${row.group}</td>
                            <td>${dailyDayLabel(row.dayId)}</td>
                            <td>${scoreValue(row.dailyScore, true)}</td>
                            <td>${dailyPassBadge(row)}</td>
                            <td>${row.attempts}</td>
                            <td>${dailyQualifiedAttemptCount(row)}</td>
                            <td>${formatDateTimeSecond(row.submitTime)}</td>
                            <td>${row.status === '未答题' ? '<span style="color:var(--text-tertiary)">-</span>' : `<span class="action-link" onclick="openDailyAnswerDetail('${escHtml(row.name)}', '${escHtml(row.dayId)}')">查看答卷</span>`}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide' });
}

function openUnitLevelAnswerDetail(unitName) {
    const rows = getLevelRecordRows().filter(row => row.org === unitName);
    openModal('单位闯关明细', `
        <div class="unit-detail-meta">
            <div><span>单位名称</span><strong>${unitName}</strong></div>
            <div><span>明细记录</span><strong>${rows.length}</strong></div>
        </div>
        <div class="unit-detail-table-wrap">
            <table class="unit-detail-table">
                <thead>
                    <tr><th>姓名</th><th>手机号</th><th>组别</th><th>当前关卡</th><th>已通关数</th><th>本关答对题数</th><th>累计答对题数</th><th>挑战次数</th><th>过关状态</th><th>操作</th></tr>
                </thead>
                <tbody>
                    ${rows.map(row => `
                        <tr>
                            <td><strong>${row.name}</strong></td>
                            <td>${row.phone}</td>
                            <td>${row.group}</td>
                            <td>${row.currentLevel}</td>
                            <td>${formatPassedLevelCount(row)}</td>
                            <td>${formatCorrectCount(getLevelCorrectCount(row), getLevelRecordQuestionCount(row), true)}</td>
                            <td>${formatCorrectCount(getLevelTotalCorrect(row), getLevelRecordTotalQuestionCount(row), true)}</td>
                            <td>${row.attempts}</td>
                            <td>${levelPassBadge(row.passStatus)}</td>
                            <td><span class="action-link" onclick="openLevelAttemptDetail('${escHtml(row.name)}', '${escHtml(row.phone)}', '${escHtml(row.levelId)}')">查看答卷</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide' });
}
