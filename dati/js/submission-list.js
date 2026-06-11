/* submission-list.js — 投稿情况列表（多主题 × 多类型 × 多附件）
   粒度：一次投稿行为 = 一行
   附件展示：标签+数量，Drawer/详情页查看
*/

// ===== Mock Data =====
const SUBMISSION_THEMES = ['校园摄影', '红色文化', 'AI 创意', '书香校园'];
const SUBMISSION_TYPES = ['摄影', '书法', '文创', '短视频', '文章', '音频'];
const SUBMISSION_GROUPS = ['学院组', '专业组', '社会组', '青少年组'];

const SUBMISSIONS = [
    { id: '202605080001', title: '春日校园·晨光', author: '张三', phone: '138****1234', org: '华东师范大学', group: '学院组', theme: '校园摄影', type: '摄影', subCount: 1, images: 5, videos: 1, audios: 0, docs: 1, status: '已提交', review: '待审核', violation: '正常', likes: 12, votes: 8, submitTime: '2026-05-08 09:30', updateTime: '2026-05-08 09:30',
      attachments: { images: ['晨光.jpg', '教学楼.jpg', '操场.jpg', '图书馆.jpg', '湖面.jpg'], videos: ['校园航拍.mp4'], audios: [], docs: ['拍摄说明.docx'] } },
    { id: '202605080002', title: '笔墨校园·隶书', author: '张三', phone: '138****1234', org: '华东师范大学', group: '学院组', theme: '校园摄影', type: '书法', subCount: 2, images: 3, videos: 0, audios: 0, docs: 2, status: '已提交', review: '通过', violation: '正常', likes: 6, votes: 3, submitTime: '2026-05-08 10:15', updateTime: '2026-05-08 14:20',
      attachments: { images: ['隶书作品1.jpg', '隶书作品2.jpg', '创作过程.jpg'], videos: [], audios: [], docs: ['作品说明.docx', '创作心得.pdf'] } },
    { id: '202605080003', title: '红色记忆·文创笔记本', author: '张三', phone: '138****1234', org: '华东师范大学', group: '学院组', theme: '红色文化', type: '文创', subCount: 3, images: 8, videos: 2, audios: 1, docs: 3, status: '已提交', review: '待审核', violation: '正常', likes: 25, votes: 19, submitTime: '2026-05-08 11:00', updateTime: '2026-05-08 11:00',
      attachments: { images: ['笔记本正面.jpg', '笔记本内页1.jpg', '笔记本内页2.jpg', '包装盒.jpg', '设计稿1.png', '设计稿2.png', '实物图1.jpg', '实物图2.jpg'], videos: ['开箱视频.mp4', '设计理念.mp4'], audios: ['创作自述.mp3'], docs: ['设计说明.docx', '材料清单.xlsx', '成本预算.pdf'] } },
    { id: '202605090004', title: 'AI 绘梦·未来城市', author: '李四', phone: '139****5678', org: '复旦大学', group: '专业组', theme: 'AI 创意', type: '摄影', subCount: 1, images: 4, videos: 0, audios: 0, docs: 1, status: '已提交', review: '驳回', violation: '正常', likes: 3, votes: 1, submitTime: '2026-05-09 08:20', updateTime: '2026-05-09 16:45',
      attachments: { images: ['未来城市1.png', '未来城市2.png', '未来城市3.png', '未来城市4.png'], videos: [], audios: [], docs: ['AI生成参数.txt'] } },
    { id: '202605090005', title: 'AI 之声·电子音乐', author: '李四', phone: '139****5678', org: '复旦大学', group: '专业组', theme: 'AI 创意', type: '音频', subCount: 2, images: 0, videos: 0, audios: 3, docs: 2, status: '已提交', review: '待审核', violation: '正常', likes: 8, votes: 5, submitTime: '2026-05-09 14:30', updateTime: '2026-05-09 14:30',
      attachments: { images: [], videos: [], audios: ['旋律片段1.mp3', '旋律片段2.mp3', '完整作品.mp3'], docs: ['创作说明.docx', 'AI模型说明.pdf'] } },
    { id: '202605100006', title: '书香满园·阅读角', author: '王五', phone: '136****9012', org: '上海交通大学', group: '学院组', theme: '书香校园', type: '摄影', subCount: 1, images: 6, videos: 1, audios: 0, docs: 0, status: '草稿', review: '待审核', violation: '正常', likes: 0, votes: 0, submitTime: '2026-05-10 07:45', updateTime: '2026-05-10 09:10',
      attachments: { images: ['阅读角1.jpg', '阅读角2.jpg', '书架.jpg', '窗边.jpg', '光影.jpg', '角落.jpg'], videos: ['阅读角全景.mp4'], audios: [], docs: [] } },
    { id: '202605100007', title: '红色印记·微纪录片', author: '赵六', phone: '137****3456', org: '同济大学', group: '专业组', theme: '红色文化', type: '短视频', subCount: 1, images: 2, videos: 3, audios: 1, docs: 4, status: '已提交', review: '通过', violation: '正常', likes: 42, votes: 38, submitTime: '2026-05-10 10:00', updateTime: '2026-05-10 10:00',
      attachments: { images: ['封面图.jpg', '花絮.jpg'], videos: ['正片.mp4', '预告片.mp4', '幕后花絮.mp4'], audios: ['旁白音频.wav'], docs: ['拍摄脚本.docx', '分镜脚本.pdf', '版权声明.docx', '参与者授权书.pdf'] } },
    { id: '202605100008', title: '红色故事·征文', author: '孙七', phone: '135****7890', org: '长宁区图书馆', group: '社会组', theme: '红色文化', type: '文章', subCount: 1, images: 0, videos: 0, audios: 0, docs: 1, status: '已提交', review: '待审核', violation: '正常', likes: 5, votes: 2, submitTime: '2026-05-10 13:20', updateTime: '2026-05-10 13:20',
      attachments: { images: [], videos: [], audios: [], docs: ['红色故事征文.docx'] } },
    { id: '202605110009', title: '校园秋色·水彩', author: '周八', phone: '134****2345', org: '上海大学', group: '学院组', theme: '校园摄影', type: '书法', subCount: 1, images: 4, videos: 0, audios: 0, docs: 1, status: '已提交', review: '通过', violation: '违规下架', likes: 0, votes: 0, submitTime: '2026-05-11 09:50', updateTime: '2026-05-11 15:30',
      attachments: { images: ['水彩1.jpg', '水彩2.jpg', '水彩3.jpg', '水彩4.jpg'], videos: [], audios: [], docs: ['作品说明.pdf'] } },
    { id: '202605110010', title: 'AI 诗画·古韵新生', author: '吴九', phone: '133****6789', org: '东华大学', group: '专业组', theme: 'AI 创意', type: '文创', subCount: 1, images: 7, videos: 1, audios: 2, docs: 2, status: '已撤回', review: '待审核', violation: '正常', likes: 0, votes: 0, submitTime: '2026-05-11 15:30', updateTime: '2026-05-11 16:00',
      attachments: { images: ['诗画1.jpg', '诗画2.jpg', '诗画3.jpg', '诗画4.jpg', '诗画5.jpg', '诗画6.jpg', '诗画7.jpg'], videos: ['制作过程.mp4'], audios: ['配乐.mp3', '朗诵.wav'], docs: ['创作思路.docx', 'AI训练数据.pdf'] } },
];

// ===== Status Badge Helpers =====
function submissionStatusBadge(status) {
    const map = { '草稿': 'badge-gray', '已提交': 'badge-green', '已撤回': 'badge-yellow' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function reviewStatusBadge(status) {
    const map = { '待审核': 'badge-yellow', '通过': 'badge-green', '驳回': 'badge-red' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function violationStatusBadge(status) {
    const map = { '正常': 'badge-green', '违规下架': 'badge-red' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

// ===== Attachment Tag Helper =====
function attachmentTags(images, videos, audios, docs) {
    let tags = '';
    if (images > 0) tags += `<span class="sub-attach-tag sub-attach-img">🖼 图片(${images})</span>`;
    if (videos > 0) tags += `<span class="sub-attach-tag sub-attach-video">🎬 视频(${videos})</span>`;
    if (audios > 0) tags += `<span class="sub-attach-tag sub-attach-audio">🎵 音频(${audios})</span>`;
    if (docs > 0)   tags += `<span class="sub-attach-tag sub-attach-doc">📄 文档(${docs})</span>`;
    if (!tags) tags = '<span style="color:var(--text-quaternary);font-size:var(--font-size-xs)">无附件</span>';
    return tags;
}

// ===== Type Badge =====
function typeBadge(type) {
    const map = { '摄影': 'badge-blue', '书法': 'badge-gold', '文创': 'badge-mode', '短视频': 'badge-red', '文章': 'badge-green', '音频': 'badge-yellow' };
    return `<span class="badge ${map[type] || 'badge-gray'}">${type}</span>`;
}

// ===== Main Page Registration =====
registerPage('submission-list', () => renderSubmissionListPage());

// ===== Page Render =====
function renderSubmissionListPage() {
    const totalSubmissions = SUBMISSIONS.length;
    const totalImages = SUBMISSIONS.reduce((s, r) => s + r.images, 0);
    const totalVideos = SUBMISSIONS.reduce((s, r) => s + r.videos, 0);
    const totalAudios = SUBMISSIONS.reduce((s, r) => s + r.audios, 0);
    const totalDocs = SUBMISSIONS.reduce((s, r) => s + r.docs, 0);
    const pendingReview = SUBMISSIONS.filter(r => r.review === '待审核').length;

    return `
    ${pageHeader('📬 投稿情况', '活动管理 / [当前活动] / 投稿情况')}

    <!-- Stats Row -->
    <div class="stat-grid">
        ${statCard(totalSubmissions, '投稿总数', 'linear-gradient(135deg, var(--primary), var(--primary-hover))')}
        ${statCard(pendingReview, '待审核', 'linear-gradient(135deg, var(--warning), var(--warning-600))')}
        ${statCard(totalImages + totalVideos, '图片/视频', 'linear-gradient(135deg, var(--info), var(--info-600))')}
        ${statCard(totalAudios + totalDocs, '音频/文档', 'linear-gradient(135deg, var(--success), var(--success-hover))')}
    </div>

    <!-- Filter Section -->
    <div class="card" style="padding:var(--spacing-lg);margin-bottom:var(--spacing-md)">
        <!-- Row 1: Basic Filters -->
        <div style="display:flex;gap:var(--spacing-sm);align-items:center;flex-wrap:wrap;margin-bottom:var(--spacing-sm)">
            <input type="text" class="form-control" placeholder="投稿编号" style="width:140px">
            <input type="text" class="form-control" placeholder="投稿人姓名" style="width:130px">
            <input type="text" class="form-control" placeholder="手机号" style="width:130px">
            <input type="text" class="form-control" placeholder="所属单位" style="width:140px">
            <select class="form-control" style="width:110px">
                <option>所属组别</option>
                ${SUBMISSION_GROUPS.map(g => `<option>${g}</option>`).join('')}
            </select>
        </div>
        <!-- Row 2: Structure Filters -->
        <div style="display:flex;gap:var(--spacing-sm);align-items:center;flex-wrap:wrap;margin-bottom:var(--spacing-sm)">
            <select class="form-control" style="width:120px">
                <option>主题名称</option>
                ${SUBMISSION_THEMES.map(t => `<option>${t}</option>`).join('')}
            </select>
            <select class="form-control" style="width:120px">
                <option>作品类型</option>
                ${SUBMISSION_TYPES.map(t => `<option>${t}</option>`).join('')}
            </select>
            <label class="checkbox-item" style="margin:0"><input type="checkbox"> 含图片</label>
            <label class="checkbox-item" style="margin:0"><input type="checkbox"> 含视频</label>
            <label class="checkbox-item" style="margin:0"><input type="checkbox"> 含音频</label>
            <label class="checkbox-item" style="margin:0"><input type="checkbox"> 含文档</label>
        </div>
        <!-- Row 3: Status + Time Filters -->
        <div style="display:flex;gap:var(--spacing-sm);align-items:center;flex-wrap:wrap;margin-bottom:var(--spacing-sm)">
            <select class="form-control" style="width:110px">
                <option>投稿状态</option><option>草稿</option><option>已提交</option><option>已撤回</option>
            </select>
            <select class="form-control" style="width:110px">
                <option>审核状态</option><option>待审核</option><option>通过</option><option>驳回</option>
            </select>
            <select class="form-control" style="width:110px">
                <option>违规状态</option><option>正常</option><option>违规下架</option>
            </select>
            <input type="date" class="form-control" style="width:140px" title="投稿开始时间">
            <span style="color:var(--text-quaternary);font-size:var(--font-size-sm)">至</span>
            <input type="date" class="form-control" style="width:140px" title="投稿结束时间">
        </div>
        <!-- Action Row -->
        <div style="display:flex;gap:var(--spacing-xs);align-items:center;margin-top:var(--spacing-sm)">
            <button class="btn btn-primary btn-sm" onclick="filterSubmissions()">查询</button>
            <button class="btn btn-ghost btn-sm" onclick="resetSubmissionFilters()">重置</button>
            <div style="flex:1"></div>
            <button class="btn btn-outline btn-sm" onclick="exportSubmissions()">📥 导出主表</button>
            <button class="btn btn-outline btn-sm" onclick="exportAttachments()">📎 导出附件明细</button>
            <button class="btn btn-success btn-sm" onclick="batchReview()">✅ 批量审核</button>
        </div>
    </div>

    <!-- Table -->
    <div class="card" style="padding:0;overflow:hidden">
        <div class="sub-table-toolbar">
            <span style="font-size:var(--font-size-sm);color:var(--text-secondary);font-weight:600">投稿记录</span>
            <span style="font-size:var(--font-size-xs);color:var(--text-tertiary)">共 ${totalSubmissions} 条</span>
        </div>
        <div class="table-wrap" style="border:none;border-radius:0">
            <table class="sub-table">
                <thead>
                    <tr>
                        <th style="width:40px"><input type="checkbox" id="subSelectAll" onchange="toggleSelectAll(this)"></th>
                        <th>投稿编号</th>
                        <th>投稿标题</th>
                        <th>投稿人</th>
                        <th>手机号</th>
                        <th>所属单位</th>
                        <th>组别</th>
                        <th>主题</th>
                        <th>类型</th>
                        <th>附件</th>
                        <th>投稿状态</th>
                        <th>审核状态</th>
                        <th>违规</th>
                        <th>投稿时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${SUBMISSIONS.map((s, i) => renderSubmissionRow(s, i)).join('')}
                </tbody>
            </table>
        </div>
        <!-- Pagination -->
        <div class="sub-table-footer">
            <span style="font-size:var(--font-size-xs);color:var(--text-tertiary)">已选 <strong id="selectedCount">0</strong> 条</span>
            ${renderStandardPagination(totalSubmissions)}
        </div>
    </div>`;
}

// ===== Table Row =====
function renderSubmissionRow(s, idx) {
    return `
    <tr class="sub-row" data-id="${s.id}">
        <td><input type="checkbox" class="sub-checkbox" data-id="${s.id}" onchange="updateSelectedCount()"></td>
        <td><span style="font-family:monospace;font-size:var(--font-size-xs);color:var(--text-brand)">${s.id}</span></td>
        <td><div class="truncate" style="max-width:160px;font-weight:600;color:var(--text-primary)" title="${s.title}">${s.title}</div><div style="font-size:11px;color:var(--text-quaternary)">第${s.subCount}次投稿</div></td>
        <td><strong>${s.author}</strong></td>
        <td><span style="font-family:monospace;font-size:var(--font-size-xs)">${s.phone}</span></td>
        <td><span class="truncate" style="max-width:120px;display:inline-block" title="${s.org}">${s.org}</span></td>
        <td><span class="badge badge-blue" style="font-size:11px">${s.group}</span></td>
        <td><span class="badge badge-gold">${s.theme}</span></td>
        <td>${typeBadge(s.type)}</td>
        <td>
            <div class="sub-attach-tags" onmouseenter="showAttachPreview(event, ${idx})" onmouseleave="hideAttachPreview()">
                ${attachmentTags(s.images, s.videos, s.audios, s.docs)}
            </div>
        </td>
        <td>${submissionStatusBadge(s.status)}</td>
        <td>${reviewStatusBadge(s.review)}</td>
        <td>${violationStatusBadge(s.violation)}</td>
        <td><span style="font-size:var(--font-size-xs);color:var(--text-tertiary)">${formatDateTimeSecond(s.submitTime)}</span></td>
        <td>
            <div class="sub-actions">
                <span class="action-link" onclick="viewSubmissionDetail('${s.id}')">详情</span>
                <span class="action-link" onclick="openReviewModal('${s.id}')">审核</span>
                <span class="action-link" onclick="openAttachmentDrawer('${s.id}')">附件</span>
                <span class="action-link" onclick="openSubmissionMore('${s.id}')">更多▾</span>
            </div>
        </td>
    </tr>`;
}

// ===== Attachment Hover Preview =====
function showAttachPreview(event, idx) {
    const s = SUBMISSIONS[idx];
    if (!s) return;

    hideAttachPreview();

    const el = document.createElement('div');
    el.className = 'attach-preview-popup';
    el.id = 'attachPreviewPopup';

    let html = '';
    if (s.attachments.images.length) {
        html += `<div class="attach-preview-section"><div class="attach-preview-label">🖼 图片 (${s.attachments.images.length})</div>`;
        html += s.attachments.images.map(f => `<div class="attach-preview-file">${f}</div>`).join('');
        html += '</div>';
    }
    if (s.attachments.videos.length) {
        html += `<div class="attach-preview-section"><div class="attach-preview-label">🎬 视频 (${s.attachments.videos.length})</div>`;
        html += s.attachments.videos.map(f => `<div class="attach-preview-file">${f}</div>`).join('');
        html += '</div>';
    }
    if (s.attachments.audios.length) {
        html += `<div class="attach-preview-section"><div class="attach-preview-label">🎵 音频 (${s.attachments.audios.length})</div>`;
        html += s.attachments.audios.map(f => `<div class="attach-preview-file">${f}</div>`).join('');
        html += '</div>';
    }
    if (s.attachments.docs.length) {
        html += `<div class="attach-preview-section"><div class="attach-preview-label">📄 文档 (${s.attachments.docs.length})</div>`;
        html += s.attachments.docs.map(f => `<div class="attach-preview-file">${f}</div>`).join('');
        html += '</div>';
    }

    el.innerHTML = html;
    document.body.appendChild(el);

    const rect = event.currentTarget.getBoundingClientRect();
    const popupW = el.offsetWidth;
    let left = rect.left + rect.width / 2 - popupW / 2;
    if (left < 8) left = 8;
    if (left + popupW > window.innerWidth - 8) left = window.innerWidth - popupW - 8;
    el.style.left = left + 'px';
    el.style.top = (rect.bottom + 6) + 'px';
}

function hideAttachPreview() {
    const existing = document.getElementById('attachPreviewPopup');
    if (existing) existing.remove();
}

// ===== Select / Checkbox =====
function toggleSelectAll(checkbox) {
    document.querySelectorAll('.sub-checkbox').forEach(cb => { cb.checked = checkbox.checked; });
    updateSelectedCount();
}

function updateSelectedCount() {
    const count = document.querySelectorAll('.sub-checkbox:checked').length;
    const el = document.getElementById('selectedCount');
    if (el) el.textContent = count;
}

// ===== Filter / Reset =====
function filterSubmissions() {
    // Prototype: just show a toast-like message
    showToast('已按筛选条件查询');
}

function resetSubmissionFilters() {
    showToast('筛选条件已重置');
}

// ===== Export =====
function exportSubmissions() {
    openModal('导出投稿记录', `
        <div style="margin-bottom:var(--spacing-md)">
            <div style="font-size:var(--font-size-sm);color:var(--text-secondary);margin-bottom:var(--spacing-sm)">将导出 <strong>投稿记录主表</strong>，每条投稿记录一行，包含：</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-xs);font-size:var(--font-size-xs);color:var(--text-tertiary)">
                <span>✓ 投稿编号 / 标题 / 投稿人</span><span>✓ 手机号 / 单位 / 组别</span>
                <span>✓ 主题 / 类型</span><span>✓ 附件数量汇总</span>
                <span>✓ 投稿状态 / 审核状态</span><span>✓ 投稿时间 / 更新时间</span>
            </div>
        </div>
        <div style="background:var(--color-info-50);border:1px solid var(--color-info-100);padding:var(--spacing-sm) var(--spacing-md);border-radius:var(--radius-md);font-size:var(--font-size-xs);color:var(--info-600)">
            💡 附件文件链接请使用「导出附件明细」获取独立的 Sheet
        </div>
    `, () => { showToast('导出任务已创建'); }, { confirmText: '确认导出' });
}

function exportAttachments() {
    openModal('导出附件明细', `
        <div style="margin-bottom:var(--spacing-md)">
            <div style="font-size:var(--font-size-sm);color:var(--text-secondary);margin-bottom:var(--spacing-sm)">将导出 <strong>附件明细表</strong>，每个附件一行：</div>
            <div style="display:grid;gap:var(--spacing-xs);font-size:var(--font-size-xs);color:var(--text-tertiary)">
                <span>✓ 投稿编号（用于关联回主表）</span>
                <span>✓ 附件类型（图片/视频/音频/文档）</span>
                <span>✓ 文件名</span>
                <span>✓ 文件下载链接</span>
            </div>
        </div>
        <div style="background:var(--warning-light);border:1px solid var(--color-warning-100);padding:var(--spacing-sm) var(--spacing-md);border-radius:var(--radius-md);font-size:var(--font-size-xs);color:var(--warning-600)">
            ⚠️ 附件明细表与主表通过「投稿编号」关联，建议两个 Sheet 一同下载
        </div>
    `, () => { showToast('附件明细导出任务已创建'); }, { confirmText: '确认导出' });
}

// ===== Batch Review =====
function batchReview() {
    const count = document.querySelectorAll('.sub-checkbox:checked').length;
    if (count === 0) {
        showToast('请先勾选需要审核的投稿', 'warning');
        return;
    }
    openModal('批量审核', `
        <div style="margin-bottom:var(--spacing-md)">
            <div style="font-size:var(--font-size-sm);color:var(--text-secondary);margin-bottom:var(--spacing-sm)">已选择 <strong>${count}</strong> 条投稿记录</div>
        </div>
        <div class="form-group">
            <label>审核结果</label>
            <div class="radio-group">
                <label class="radio-item"><input type="radio" name="batchReviewResult" value="通过" checked> 通过</label>
                <label class="radio-item"><input type="radio" name="batchReviewResult" value="驳回"> 驳回</label>
            </div>
        </div>
        <div class="form-group">
            <label>审核意见</label>
            <textarea class="form-control" rows="3" placeholder="请输入审核意见（驳回时必填）"></textarea>
        </div>
    `, () => { showToast(`已批量审核 ${count} 条投稿`); }, { confirmText: '提交审核' });
}

// ===== Single Review Modal =====
function openReviewModal(id) {
    const s = SUBMISSIONS.find(r => r.id === id);
    if (!s) return;
    openModal('审核投稿', `
        <div style="margin-bottom:var(--spacing-md);padding:var(--spacing-sm) var(--spacing-md);background:var(--bg-hover);border-radius:var(--radius-md)">
            <div style="font-size:var(--font-size-sm);font-weight:600">${s.title}</div>
            <div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">投稿人：${s.author} | 主题：${s.theme} | 类型：${s.type}</div>
        </div>
        <div class="form-group">
            <label>审核结果 <span class="req">*</span></label>
            <div class="radio-group">
                <label class="radio-item"><input type="radio" name="reviewResult" value="通过" checked> 审核通过</label>
                <label class="radio-item"><input type="radio" name="reviewResult" value="驳回"> 驳回</label>
            </div>
        </div>
        <div class="form-group">
            <label>审核意见</label>
            <textarea class="form-control" rows="3" placeholder="请输入审核意见"></textarea>
        </div>
    `, () => { showToast('审核结果已提交'); }, { confirmText: '提交审核' });
}

// ===== More Actions Dropdown =====
function openSubmissionMore(id) {
    const s = SUBMISSIONS.find(r => r.id === id);
    if (!s) return;

    const violationBtn = s.violation === '正常'
        ? `<div class="more-menu-item more-menu-danger" onclick="closeSubmissionMore(); showToast('已标记为违规下架')">⚠ 违规下架</div>`
        : `<div class="more-menu-item" onclick="closeSubmissionMore(); showToast('已撤销违规标记')">↩ 撤销违规</div>`;

    const html = `
        <div class="more-menu-item" onclick="closeSubmissionMore(); showToast('附件下载任务已创建')">📥 下载全部附件</div>
        ${violationBtn}
        <div class="more-menu-item more-menu-danger" onclick="closeSubmissionMore(); showToast('投稿已删除')">🗑 删除投稿</div>
    `;

    // Remove existing
    closeSubmissionMore();

    const menu = document.createElement('div');
    menu.className = 'more-menu';
    menu.id = 'submissionMoreMenu';
    menu.innerHTML = html;
    document.body.appendChild(menu);

    // Position near the clicked "更多"
    const btn = event.target;
    const rect = btn.getBoundingClientRect();
    menu.style.top = (rect.bottom + 4) + 'px';
    menu.style.right = (window.innerWidth - rect.right) + 'px';

    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', closeSubmissionMore, { once: true });
    }, 10);
}

function closeSubmissionMore() {
    const el = document.getElementById('submissionMoreMenu');
    if (el) el.remove();
}

// ===== Attachment Drawer (右侧滑出) =====
function openAttachmentDrawer(id) {
    const s = SUBMISSIONS.find(r => r.id === id);
    if (!s) return;

    closeAttachmentDrawer();

    const drawer = document.createElement('div');
    drawer.id = 'submissionDrawer';
    drawer.className = 'sub-drawer-overlay';
    drawer.onclick = (e) => { if (e.target === drawer) closeAttachmentDrawer(); };

    let content = `
    <div class="sub-drawer">
        <div class="sub-drawer-head">
            <div>
                <div style="font-size:var(--font-size-md);font-weight:700">${s.title}</div>
                <div style="font-size:var(--font-size-xs);color:var(--text-tertiary);margin-top:2px">${s.id} · ${s.author} · ${s.theme} · ${s.type}</div>
            </div>
            <button class="modal-close" onclick="closeAttachmentDrawer()">✕</button>
        </div>
        <div class="sub-drawer-body">`;

    // Images
    if (s.attachments.images.length) {
        content += `
            <div class="sub-drawer-section">
                <div class="sub-drawer-section-title">🖼 图片 (${s.attachments.images.length})</div>
                <div class="sub-drawer-grid">
                    ${s.attachments.images.map((f, i) => `
                        <div class="sub-drawer-thumb" onclick="showToast('预览: ${f}')">
                            <div class="sub-drawer-thumb-placeholder" style="background:var(--primary-light);color:var(--primary)">🖼</div>
                            <div class="sub-drawer-thumb-name">${f}</div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }

    // Videos
    if (s.attachments.videos.length) {
        content += `
            <div class="sub-drawer-section">
                <div class="sub-drawer-section-title">🎬 视频 (${s.attachments.videos.length})</div>
                <div class="sub-drawer-list">
                    ${s.attachments.videos.map(f => `
                        <div class="sub-drawer-file-item" onclick="showToast('播放: ${f}')">
                            <div class="sub-drawer-file-icon" style="background:var(--danger-light);color:var(--danger)">▶</div>
                            <div class="sub-drawer-file-info">
                                <div class="sub-drawer-file-name">${f}</div>
                                <div class="sub-drawer-file-meta">点击在线播放</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }

    // Audios
    if (s.attachments.audios.length) {
        content += `
            <div class="sub-drawer-section">
                <div class="sub-drawer-section-title">🎵 音频 (${s.attachments.audios.length})</div>
                <div class="sub-drawer-list">
                    ${s.attachments.audios.map(f => `
                        <div class="sub-drawer-file-item" onclick="showToast('播放: ${f}')">
                            <div class="sub-drawer-file-icon" style="background:var(--warning-light);color:var(--warning-600)">🎵</div>
                            <div class="sub-drawer-file-info">
                                <div class="sub-drawer-file-name">${f}</div>
                                <div class="sub-drawer-file-meta">点击播放</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }

    // Documents
    if (s.attachments.docs.length) {
        content += `
            <div class="sub-drawer-section">
                <div class="sub-drawer-section-title">📄 文档 (${s.attachments.docs.length})</div>
                <div class="sub-drawer-list">
                    ${s.attachments.docs.map(f => `
                        <div class="sub-drawer-file-item" onclick="showToast('下载: ${f}')">
                            <div class="sub-drawer-file-icon" style="background:var(--success-light);color:var(--success)">📄</div>
                            <div class="sub-drawer-file-info">
                                <div class="sub-drawer-file-name">${f}</div>
                                <div class="sub-drawer-file-meta">点击下载</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }

    if (!s.attachments.images.length && !s.attachments.videos.length && !s.attachments.audios.length && !s.attachments.docs.length) {
        content += `<div class="empty-state" style="padding:var(--spacing-3xl)"><div class="empty-state-icon">📎</div><div class="empty-state-title">暂无附件</div></div>`;
    }

    content += `
        </div>
        <div class="sub-drawer-foot">
            <button class="btn btn-ghost btn-sm" onclick="closeAttachmentDrawer()">关闭</button>
            <button class="btn btn-outline btn-sm" onclick="showToast('全部附件下载任务已创建')">📥 下载全部</button>
        </div>
    </div>`;

    drawer.innerHTML = content;
    document.body.appendChild(drawer);
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
        drawer.classList.add('show');
    });
}

function closeAttachmentDrawer() {
    const drawer = document.getElementById('submissionDrawer');
    if (!drawer) return;
    drawer.classList.remove('show');
    setTimeout(() => {
        drawer.remove();
        document.body.style.overflow = '';
    }, 300);
}

// ===== Detail Page =====
function viewSubmissionDetail(id) {
    const s = SUBMISSIONS.find(r => r.id === id);
    if (!s) return;

    const main = document.getElementById('mainContent');
    const prevContent = main.innerHTML;

    main.innerHTML = `
    <div class="review-crumb-card platform-review-back">
        <span class="action-link muted" onclick="navigateBackToList()">‹ 返回投稿列表</span>
        <span class="review-divider"></span>
        <strong>投稿详情</strong>
    </div>

    <!-- 1. 基础信息区 -->
    <div class="section">
        <div class="section-head">
            <div class="sec-icon blue">📋</div>
            <div><div class="sec-title">基础信息</div><div class="sec-subtitle">投稿编号：${s.id}</div></div>
        </div>
        <div class="section-body">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--spacing-md)">
                ${detailField('投稿标题', s.title)}
                ${detailField('投稿人', s.author)}
                ${detailField('手机号', s.phone)}
                ${detailField('所属单位', s.org)}
                ${detailField('所属组别', `<span class="badge badge-blue">${s.group}</span>`)}
                ${detailField('投稿次数', `第 ${s.subCount} 次`)}
                ${detailField('主题名称', `<span class="badge badge-gold">${s.theme}</span>`)}
                ${detailField('作品类型', typeBadge(s.type))}
                ${detailField('投稿状态', submissionStatusBadge(s.status))}
                ${detailField('审核状态', reviewStatusBadge(s.review))}
                ${detailField('违规状态', violationStatusBadge(s.violation))}
                ${detailField('点赞/票数', `${s.likes} 赞 / ${s.votes} 票`)}
                ${detailField('投稿时间', formatDateTimeSecond(s.submitTime))}
                ${detailField('更新时间', formatDateTimeSecond(s.updateTime))}
            </div>
        </div>
    </div>

    <!-- 2. 投稿表单区 -->
    <div class="section">
        <div class="section-head">
            <div class="sec-icon green">📝</div>
            <div><div class="sec-title">投稿表单</div><div class="sec-subtitle">用户提交的表单内容</div></div>
        </div>
        <div class="section-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)">
                ${detailField('作品名称', s.title)}
                ${detailField('创作时间', '2026年4月')}
                ${detailField('创作说明', '本作品以校园春日晨光为主题，捕捉了华东师范大学清晨的美景，展现了大学校园的宁静与活力。')}
                ${detailField('创作工具', s.type === '摄影' ? '佳能 EOS R5 / 24-70mm f/2.8' : s.type === '书法' ? '毛笔 / 宣纸 / 墨汁' : 'Adobe Illustrator / Midjourney')}
            </div>
        </div>
    </div>

    <!-- 3. 附件内容区 -->
    <div class="section">
        <div class="section-head">
            <div class="sec-icon yellow">📎</div>
            <div><div class="sec-title">附件内容</div><div class="sec-subtitle">图片 ${s.images} · 视频 ${s.videos} · 音频 ${s.audios} · 文档 ${s.docs}</div></div>
        </div>
        <div class="section-body" style="padding:0">
            <!-- Tabs -->
            <div class="tabs" style="padding:0 var(--spacing-xl)">
                ${s.attachments.images.length ? '<div class="tab active" onclick="switchDetailTab(this, \'img\')">🖼 图片</div>' : ''}
                ${s.attachments.videos.length ? `<div class="tab${!s.attachments.images.length ? ' active' : ''}" onclick="switchDetailTab(this, 'vid')">🎬 视频</div>` : ''}
                ${s.attachments.audios.length ? `<div class="tab${!s.attachments.images.length && !s.attachments.videos.length ? ' active' : ''}" onclick="switchDetailTab(this, 'aud')">🎵 音频</div>` : ''}
                ${s.attachments.docs.length ? `<div class="tab${!s.attachments.images.length && !s.attachments.videos.length && !s.attachments.audios.length ? ' active' : ''}" onclick="switchDetailTab(this, 'doc')">📄 文档</div>` : ''}
            </div>

            <!-- Tab Panes -->
            <div style="padding:var(--spacing-xl)">
                ${s.attachments.images.length ? `
                <div class="detail-tab-pane" data-tab="img" style="display:grid">
                    <div class="sub-drawer-grid" style="max-width:100%">
                        ${s.attachments.images.map(f => `
                            <div class="sub-drawer-thumb" onclick="showToast('预览: ${f}')">
                                <div class="sub-drawer-thumb-placeholder" style="background:var(--primary-light);color:var(--primary)">🖼</div>
                                <div class="sub-drawer-thumb-name">${f}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>` : ''}
                ${s.attachments.videos.length ? `
                <div class="detail-tab-pane" data-tab="vid" style="display:none">
                    ${s.attachments.videos.map(f => `
                        <div class="sub-drawer-file-item" onclick="showToast('播放: ${f}')" style="margin-bottom:var(--spacing-sm)">
                            <div class="sub-drawer-file-icon" style="background:var(--danger-light);color:var(--danger);width:48px;height:48px;font-size:var(--font-size-xl)">▶</div>
                            <div class="sub-drawer-file-info">
                                <div class="sub-drawer-file-name" style="font-size:var(--font-size-base)">${f}</div>
                                <div class="sub-drawer-file-meta">点击在线播放 · 1080p</div>
                            </div>
                        </div>
                    `).join('')}
                </div>` : ''}
                ${s.attachments.audios.length ? `
                <div class="detail-tab-pane" data-tab="aud" style="display:none">
                    ${s.attachments.audios.map(f => `
                        <div class="sub-drawer-file-item" onclick="showToast('播放: ${f}')" style="margin-bottom:var(--spacing-sm)">
                            <div class="sub-drawer-file-icon" style="background:var(--warning-light);color:var(--warning-600);width:48px;height:48px;font-size:var(--font-size-xl)">🎵</div>
                            <div class="sub-drawer-file-info">
                                <div class="sub-drawer-file-name" style="font-size:var(--font-size-base)">${f}</div>
                                <div class="sub-drawer-file-meta">点击播放 · 03:24</div>
                            </div>
                        </div>
                    `).join('')}
                </div>` : ''}
                ${s.attachments.docs.length ? `
                <div class="detail-tab-pane" data-tab="doc" style="display:none">
                    ${s.attachments.docs.map(f => `
                        <div class="sub-drawer-file-item" onclick="showToast('下载: ${f}')" style="margin-bottom:var(--spacing-sm)">
                            <div class="sub-drawer-file-icon" style="background:var(--success-light);color:var(--success);width:48px;height:48px;font-size:var(--font-size-xl)">📄</div>
                            <div class="sub-drawer-file-info">
                                <div class="sub-drawer-file-name" style="font-size:var(--font-size-base)">${f}</div>
                                <div class="sub-drawer-file-meta">点击下载 · 2.3 MB</div>
                            </div>
                        </div>
                    `).join('')}
                </div>` : ''}
            </div>
        </div>
    </div>

    <!-- 4. 审核记录区 -->
    <div class="section">
        <div class="section-head">
            <div class="sec-icon red">✅</div>
            <div><div class="sec-title">审核记录</div></div>
        </div>
        <div class="section-body" style="padding:0">
            <table>
                <thead>
                    <tr><th>时间</th><th>审核人</th><th>结果</th><th>原因</th></tr>
                </thead>
                <tbody>
                    ${s.review !== '待审核' ? `
                    <tr><td>${formatDateTimeSecond(s.updateTime)}</td><td>管理员A</td><td>${reviewStatusBadge(s.review)}</td><td>${s.review === '通过' ? '作品符合征集要求' : '作品不符合征集主题要求，请重新投稿'}</td></tr>
                    ` : `<tr><td colspan="4" style="text-align:center;color:var(--text-quaternary);padding:var(--spacing-xl)">暂无审核记录</td></tr>`}
                </tbody>
            </table>
        </div>
    </div>

    <!-- 5. 操作区 -->
    <div class="card" style="display:flex;gap:var(--spacing-sm);flex-wrap:wrap;align-items:center">
        <span style="font-size:var(--font-size-sm);color:var(--text-tertiary);margin-right:var(--spacing-sm)">操作：</span>
        <button class="btn btn-success btn-sm" onclick="showToast('审核通过')">✅ 审核通过</button>
        <button class="btn btn-danger btn-sm" onclick="showToast('已驳回')">❌ 驳回</button>
        ${s.violation === '正常'
            ? '<button class="btn btn-warning btn-sm" onclick="showToast(\'已违规下架\')">⚠ 违规下架</button>'
            : '<button class="btn btn-outline btn-sm" onclick="showToast(\'已撤销违规\')">↩ 撤销违规</button>'}
        <button class="btn btn-outline btn-sm" onclick="showToast('全部附件下载任务已创建')">📥 下载全部附件</button>
        <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="showToast('投稿已删除')">🗑 删除投稿</button>
    </div>`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function detailField(label, value) {
    return `
    <div style="padding:var(--spacing-xs) 0">
        <div style="font-size:var(--font-size-xs);color:var(--text-tertiary);margin-bottom:2px">${label}</div>
        <div style="font-size:var(--font-size-sm);color:var(--text-primary);font-weight:500">${value}</div>
    </div>`;
}

function switchDetailTab(tabEl, tabId) {
    const container = tabEl.closest('.section-body');
    container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');
    container.querySelectorAll('.detail-tab-pane').forEach(p => {
        p.style.display = p.dataset.tab === tabId ? 'grid' : 'none';
    });
}

function navigateBackToList() {
    navigateTo('submission-list');
}

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    const existing = document.getElementById('submissionToast');
    if (existing) existing.remove();

    const colors = {
        success: { bg: 'var(--success-light)', border: 'var(--color-success-100)', color: 'var(--success-hover)', icon: '✓' },
        warning: { bg: 'var(--warning-light)', border: 'var(--color-warning-100)', color: 'var(--warning-600)', icon: '⚠' },
        error:   { bg: 'var(--danger-light)', border: 'var(--color-error-100)', color: 'var(--danger-hover)', icon: '✕' }
    };
    const c = colors[type] || colors.success;

    const toast = document.createElement('div');
    toast.id = 'submissionToast';
    toast.style.cssText = `
        position:fixed;top:80px;right:24px;z-index:10000;
        background:${c.bg};border:1px solid ${c.border};color:${c.color};
        padding:12px 20px;border-radius:var(--radius-lg);
        font-size:var(--font-size-sm);font-weight:600;
        box-shadow:var(--shadow-lg);
        display:flex;align-items:center;gap:8px;
        animation:slideInRight 0.3s ease-out;
    `;
    toast.innerHTML = `<span style="font-size:var(--font-size-md)">${c.icon}</span> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
