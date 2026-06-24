const BLACKLIST_REASON_OPTIONS = ['全部原因', '恶意占位未到场', '扰乱活动秩序', '违规填写报名信息', '重复爽约', '其他原因'];
const BLACKLIST_STATUS_OPTIONS = ['全部', '拉黑中', '已解除'];
const BLACKLIST_SCOPE_LABEL = '当前活动';
const BLACKLIST_ADMIN_PERMISSIONS = {
    view: true,
    unblock: true,
    viewHistory: true
};

let currentBlacklistFilters = getDefaultBlacklistFilters();
let blacklistFilterDraft = { ...currentBlacklistFilters };

const BLACKLIST_USER_DIRECTORY = [
    { userId: 'U001', userNo: 'WY123456', wenyuNo: '123456', name: '林悦', nickname: '阅途小悦', phone: '138****1234', avatar: '林', org: '广州市图书馆' },
    { userId: 'U003', userNo: 'WY345678', wenyuNo: '345678', name: '黄嘉', nickname: '嘉嘉妈妈', phone: '136****9012', avatar: '黄', org: '天河区图书馆' },
    { userId: 'U007', userNo: 'WY789012', wenyuNo: '789012', name: '苏晴', nickname: '晴空读者', phone: '133****1122', avatar: '苏', org: '海珠区图书馆' },
    { userId: 'U009', userNo: 'WY901234', wenyuNo: '901234', name: '', nickname: '书海拾贝', phone: '131****8821', avatar: '书', org: '深圳少年阅读中心' },
    { userId: 'U011', userNo: 'WY112358', wenyuNo: '112358', name: '程默', nickname: '默默', phone: '132****4509', avatar: '程', org: '佛山市图书馆' }
];

const BLACKLIST_RECORDS = [
    { id: 'bl-001', userId: 'U001', reason: '恶意占位未到场', detail: '连续两场报名成功后未到场，且未提前取消，占用活动席位。', blockedAt: '2026-06-27 16:25', operatorId: 'admin-001', operatorName: '周贺贺', status: '拉黑中', unblockedAt: '', unblockedBy: '', unblockNote: '' },
    { id: 'bl-002', userId: 'U003', reason: '扰乱活动秩序', detail: '活动现场多次与工作人员发生争执，经管理员确认限制参与当前活动。', blockedAt: '2026-06-26 18:40', operatorId: 'admin-002', operatorName: '林月', status: '已解除', unblockedAt: '2026-06-28 09:15', unblockedBy: '林月', unblockNote: '已沟通确认，恢复参与权限。' },
    { id: 'bl-003', userId: 'U007', reason: '重复爽约', detail: '三次报名后未按要求签到，影响候补补录安排。', blockedAt: '2026-06-25 11:30', operatorId: 'admin-001', operatorName: '周贺贺', status: '拉黑中', unblockedAt: '', unblockedBy: '', unblockNote: '' },
    { id: 'bl-004', userId: 'U009', reason: '其他原因', detail: '用户多次使用不同昵称重复提交相同报名信息，需人工复核后再开放参与。', blockedAt: '2026-06-22 14:05', operatorId: 'admin-003', operatorName: '叶青', status: '已解除', unblockedAt: '2026-06-24 10:20', unblockedBy: '周贺贺', unblockNote: '核验为同一家庭成员代报，已修正资料。' },
    { id: 'bl-005', userId: 'U011', reason: '违规填写报名信息', detail: '报名手机号与实名信息长期不一致，补充资料前暂停参与。', blockedAt: '2026-06-29 08:50', operatorId: 'admin-002', operatorName: '林月', status: '拉黑中', unblockedAt: '', unblockedBy: '', unblockNote: '' },
    { id: 'bl-006', userId: 'U003', reason: '其他原因', detail: '首次拉黑记录保留，用于展示再次拉黑前的历史轨迹。', blockedAt: '2026-06-18 15:10', operatorId: 'admin-003', operatorName: '叶青', status: '已解除', unblockedAt: '2026-06-19 10:05', unblockedBy: '叶青', unblockNote: '已补充说明，解除限制。' }
];

registerPage('blacklist-mgmt', () => renderBlacklistPage());

function getDefaultBlacklistFilters() {
    return {
        keyword: '',
        status: '拉黑中',
        reason: '全部原因',
        dateRange: '',
        operator: ''
    };
}

function renderBlacklistPage() {
    const rows = getBlacklistDisplayRows();
    return `
    ${pageHeader('黑名单管理', '系统设置 / 黑名单管理')}
    <section class="blacklist-page-card">
        <div class="blacklist-page-hero">
            <div>
                <h2>黑名单管理</h2>
                <p>管理当前活动中被拉黑的用户。用户被拉黑后，将无法报名参与平台活动；解除拉黑后，可恢复正常报名和参与权限。</p>
            </div>
        </div>
    </section>
    <section class="card blacklist-filter-card">
        <div class="blacklist-filter-grid">
            <label>
                <span>用户信息</span>
                <input class="form-control" value="${escapeHtml(blacklistFilterDraft.keyword)}" placeholder="姓名 / 手机号 / 用户编号" oninput="updateBlacklistDraft('keyword', this.value)">
            </label>
            <label>
                <span>拉黑状态</span>
                <select class="form-control" onchange="updateBlacklistDraft('status', this.value)">
                    ${BLACKLIST_STATUS_OPTIONS.map(option => `<option ${blacklistFilterDraft.status === option ? 'selected' : ''}>${option}</option>`).join('')}
                </select>
            </label>
            <label>
                <span>拉黑原因</span>
                <select class="form-control" onchange="updateBlacklistDraft('reason', this.value)">
                    ${BLACKLIST_REASON_OPTIONS.map(option => `<option ${blacklistFilterDraft.reason === option ? 'selected' : ''}>${option}</option>`).join('')}
                </select>
            </label>
            <label>
                <span>拉黑时间</span>
                <input class="form-control" value="${escapeHtml(blacklistFilterDraft.dateRange)}" placeholder="2026-06-20 至 2026-06-30" oninput="updateBlacklistDraft('dateRange', this.value)">
            </label>
            <label>
                <span>操作人</span>
                <input class="form-control" value="${escapeHtml(blacklistFilterDraft.operator)}" placeholder="请输入管理员姓名" oninput="updateBlacklistDraft('operator', this.value)">
            </label>
            <div class="blacklist-filter-actions">
                <button class="btn btn-primary" type="button" onclick="applyBlacklistFilters()">查询</button>
                <button class="btn btn-outline" type="button" onclick="resetBlacklistFilters()">重置</button>
            </div>
        </div>
    </section>
    <section class="card blacklist-table-card">
        <div class="blacklist-table-head">
            <div>
                <h3>黑名单用户列表</h3>
                <p>默认仅展示拉黑中的用户，并按拉黑时间倒序排列。</p>
            </div>
        </div>
        ${renderBlacklistTable(rows)}
    </section>`;
}

function updateBlacklistDraft(field, value) {
    blacklistFilterDraft[field] = value;
}

function applyBlacklistFilters() {
    currentBlacklistFilters = { ...blacklistFilterDraft };
    navigateTo('blacklist-mgmt', { topNavSection: 'system' });
}

function resetBlacklistFilters() {
    currentBlacklistFilters = getDefaultBlacklistFilters();
    blacklistFilterDraft = { ...currentBlacklistFilters };
    navigateTo('blacklist-mgmt', { topNavSection: 'system' });
}

function getBlacklistStats() {
    const latestRecords = getBlacklistLatestRecordMap();
    const values = Object.values(latestRecords);
    return {
        activeCount: values.filter(item => item.status === '拉黑中').length,
        releasedCount: values.filter(item => item.status === '已解除').length
    };
}

function getBlacklistLatestRecordMap() {
    return BLACKLIST_RECORDS.reduce((acc, record) => {
        const prev = acc[record.userId];
        if (!prev || parseBlacklistDateTime(record.blockedAt) > parseBlacklistDateTime(prev.blockedAt)) {
            acc[record.userId] = record;
        }
        return acc;
    }, {});
}

function getBlacklistDisplayRows() {
    const latestRows = Object.values(getBlacklistLatestRecordMap())
        .map(record => buildBlacklistDisplayRow(record))
        .filter(Boolean);
    const filters = currentBlacklistFilters;
    return latestRows
        .filter(row => {
            if (filters.status !== '全部' && row.status !== filters.status) return false;
            if (filters.reason !== '全部原因' && row.reason !== filters.reason) return false;
            if (filters.operator && !row.operatorName.includes(filters.operator.trim())) return false;
            if (filters.keyword) {
                const keyword = filters.keyword.trim();
                const text = [row.name, row.nickname, row.phone, row.userNo, row.wenyuNo].join(' ');
                if (!text.includes(keyword)) return false;
            }
            if (filters.dateRange && !isBlacklistDateInRange(row.blockedAt, filters.dateRange)) return false;
            return true;
        })
        .sort((a, b) => parseBlacklistDateTime(b.blockedAt) - parseBlacklistDateTime(a.blockedAt));
}

function buildBlacklistDisplayRow(record) {
    const user = BLACKLIST_USER_DIRECTORY.find(item => item.userId === record.userId);
    if (!user) return null;
    return {
        ...record,
        ...user,
        displayName: user.name || user.nickname
    };
}

function parseBlacklistDateTime(value) {
    return new Date(String(value || '').replace(/-/g, '/')).getTime() || 0;
}

function isBlacklistDateInRange(dateText, rangeText) {
    const parts = String(rangeText).split('至').map(item => item.trim()).filter(Boolean);
    if (!parts.length) return true;
    const current = parseBlacklistDateTime(dateText);
    const start = parts[0] ? parseBlacklistDateTime(`${parts[0]} 00:00`) : 0;
    const end = parts[1] ? parseBlacklistDateTime(`${parts[1]} 23:59`) : Number.MAX_SAFE_INTEGER;
    return current >= start && current <= end;
}

function renderBlacklistTable(rows) {
    if (!rows.length) {
        const isDefaultEmpty = currentBlacklistFilters.status === '拉黑中'
            && !currentBlacklistFilters.keyword
            && currentBlacklistFilters.reason === '全部原因'
            && !currentBlacklistFilters.dateRange
            && !currentBlacklistFilters.operator;
        return `
        <div class="empty-state">
            <div class="empty-state-title">${isDefaultEmpty ? '暂无黑名单用户' : '未找到符合条件的用户，请调整筛选条件后重试。'}</div>
            <div class="empty-state-desc">${isDefaultEmpty ? '当前活动下暂无处于拉黑状态的用户。' : '可以尝试放宽状态、时间或用户信息筛选条件。'}</div>
        </div>`;
    }
    return `
    <div class="table-wrap blacklist-table-wrap">
        <table class="blacklist-table">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>用户信息</th>
                    <th>手机号</th>
                    <th>用户编号</th>
                    <th>拉黑原因</th>
                    <th>原因说明</th>
                    <th>拉黑时间</th>
                    <th>操作人</th>
                    <th>当前状态</th>
                    <th>解除时间</th>
                    <th>解除操作人</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                ${rows.map((row, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            <div class="blacklist-user-cell">
                                <div class="blacklist-user-avatar">${escapeHtml(row.avatar)}</div>
                                <div>
                                    <strong>${escapeHtml(row.displayName)}</strong>
                                    <span>${escapeHtml(row.org)}</span>
                                </div>
                            </div>
                        </td>
                        <td>${escapeHtml(row.phone)}</td>
                        <td>
                            <div>${escapeHtml(row.userNo)}</div>
                            <span class="table-subtext">文遇号 ${escapeHtml(row.wenyuNo)}</span>
                        </td>
                        <td>${escapeHtml(row.reason)}</td>
                        <td><span class="blacklist-reason-ellipsis" title="${escapeHtml(row.detail)}">${escapeHtml(row.detail)}</span></td>
                        <td>${escapeHtml(row.blockedAt)}</td>
                        <td>${escapeHtml(row.operatorName)}</td>
                        <td>${renderBlacklistStatusBadge(row.status)}</td>
                        <td>${row.unblockedAt ? escapeHtml(row.unblockedAt) : '-'}</td>
                        <td>${row.unblockedBy ? escapeHtml(row.unblockedBy) : '-'}</td>
                        <td>
                            <div class="blacklist-table-actions">
                                ${row.status === '拉黑中' && BLACKLIST_ADMIN_PERMISSIONS.unblock ? `<button class="btn btn-outline btn-sm" type="button" onclick="openBlacklistUnblockModal('${row.id}')">解除拉黑</button>` : ''}
                                ${BLACKLIST_ADMIN_PERMISSIONS.viewHistory ? `<button class="btn btn-ghost btn-sm" type="button" onclick="openBlacklistHistoryDrawer('${row.userId}')">查看记录</button>` : ''}
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ${renderStandardPagination(rows.length)}`;
}

function renderBlacklistStatusBadge(status) {
    const badgeClass = status === '拉黑中' ? 'badge badge-red' : 'badge badge-green';
    return `<span class="${badgeClass}">${status}</span>`;
}

function openBlacklistUnblockModal(recordId) {
    const row = buildBlacklistDisplayRow(BLACKLIST_RECORDS.find(item => item.id === recordId));
    if (!row) return;
    openModal('确认解除拉黑？', `
        <div class="blacklist-modal-body">
            <div class="blacklist-modal-user">
                <div><span>用户姓名</span><strong>${escapeHtml(row.displayName)}</strong></div>
                <div><span>手机号</span><strong>${escapeHtml(row.phone)}</strong></div>
                <div><span>拉黑时间</span><strong>${escapeHtml(row.blockedAt)}</strong></div>
                <div><span>拉黑原因</span><strong>${escapeHtml(row.reason)}</strong></div>
            </div>
            <p class="blacklist-modal-tip">解除拉黑后，该用户将恢复当前活动的报名及参与权限。已取消、已驳回或已失效的报名记录不会自动恢复。</p>
            <label class="blacklist-modal-field">
                <span>解除说明</span>
                <textarea id="blacklistUnblockNote" class="form-control" maxlength="200" placeholder="请输入解除拉黑原因或备注，最多 200 字"></textarea>
            </label>
        </div>
    `, () => {
        const note = document.getElementById('blacklistUnblockNote')?.value?.trim() || '';
        const target = BLACKLIST_RECORDS.find(item => item.id === recordId);
        if (!target || target.status !== '拉黑中') return false;
        target.status = '已解除';
        target.unblockedAt = '2026-06-30 10:30';
        target.unblockedBy = '林月';
        target.unblockNote = note;
        navigateTo('blacklist-mgmt', { topNavSection: 'system' });
        if (typeof showToast === 'function') showToast('已解除该用户的拉黑状态。');
    }, { confirmText: '确认解除', danger: true, modalClass: 'modal-md' });
}

function openBlacklistHistoryDrawer(userId) {
    closeBlacklistHistoryDrawer();
    const user = BLACKLIST_USER_DIRECTORY.find(item => item.userId === userId);
    const history = getBlacklistHistory(userId);
    if (!user) return;
    const drawer = document.createElement('div');
    drawer.id = 'blacklistHistoryDrawer';
    drawer.className = 'blacklist-drawer-overlay';
    drawer.onclick = event => {
        if (event.target === drawer) closeBlacklistHistoryDrawer();
    };
    drawer.innerHTML = `
        <aside class="blacklist-drawer">
            <div class="blacklist-drawer-head">
                <div>
                    <h3>${escapeHtml(user.name || user.nickname)}的黑名单记录</h3>
                    <p>${escapeHtml(user.phone)} · ${escapeHtml(user.userNo)} · ${escapeHtml(user.org)}</p>
                </div>
                <button class="modal-close" type="button" onclick="closeBlacklistHistoryDrawer()">✕</button>
            </div>
            <div class="blacklist-drawer-body">
                <div class="blacklist-history-list">
                    ${history.map(item => `
                        <div class="blacklist-history-item">
                            <div class="blacklist-history-top">
                                <strong>${escapeHtml(item.type)}</strong>
                                <span class="blacklist-history-time">${escapeHtml(item.time)}</span>
                            </div>
                            <div class="blacklist-history-meta">操作人：${escapeHtml(item.operator)}</div>
                            <div class="blacklist-history-grid">
                                <div class="blacklist-history-field blacklist-history-field-wide">
                                    <span>操作原因</span>
                                    <p>${escapeHtml(item.reason)}</p>
                                </div>
                                <div class="blacklist-history-field">
                                    <span>操作前状态</span>
                                    <p>${escapeHtml(item.beforeStatus)}</p>
                                </div>
                                <div class="blacklist-history-field">
                                    <span>操作后状态</span>
                                    <p>${escapeHtml(item.afterStatus)}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </aside>`;
    document.body.appendChild(drawer);
    requestAnimationFrame(() => drawer.classList.add('show'));
}

function closeBlacklistHistoryDrawer() {
    const drawer = document.getElementById('blacklistHistoryDrawer');
    if (!drawer) return;
    drawer.classList.remove('show');
    setTimeout(() => drawer.remove(), 180);
}

function getBlacklistHistory(userId) {
    return BLACKLIST_RECORDS
        .filter(item => item.userId === userId)
        .flatMap(item => {
            const history = [{
                type: '拉黑',
                time: item.blockedAt,
                operator: item.operatorName,
                reason: `${item.reason}：${item.detail}`,
                beforeStatus: '正常',
                afterStatus: '拉黑中'
            }];
            if (item.unblockedAt) {
                history.push({
                    type: '解除拉黑',
                    time: item.unblockedAt,
                    operator: item.unblockedBy || '-',
                    reason: item.unblockNote || '管理员解除拉黑',
                    beforeStatus: '拉黑中',
                    afterStatus: '已解除'
                });
            }
            return history;
        })
        .sort((a, b) => parseBlacklistDateTime(b.time) - parseBlacklistDateTime(a.time));
}
