/* dashboard.js — 工作台 */
registerPage('dashboard', () => {
    return `
    ${pageHeader('📊 运营驾驶舱', '活动管理 / 运营驾驶舱')}
    <div class="stat-grid">
        ${statCard('24', '进行中活动', 'linear-gradient(135deg,var(--primary),var(--primary-hover))')}
        ${statCard('1,256', '总参与人数', 'linear-gradient(135deg,var(--success),var(--color-success-100))')}
        ${statCard('3,892', '总答题次数', 'linear-gradient(135deg,var(--warning),var(--color-warning-100))')}
        ${statCard('156', '发放证书', 'linear-gradient(135deg,var(--danger),var(--color-error-100))')}
    </div>

    <div class="card">
        <h3 style="font-size:var(--font-size-base);font-weight:700;margin-bottom:var(--spacing-md);color:var(--text-primary)">最近活动</h3>
        <table>
            <thead><tr><th>活动名称</th><th>模式</th><th>状态</th><th>参与人数</th><th>操作</th></tr></thead>
            <tbody>
                <tr><td><strong>图书馆知识竞赛</strong></td><td><span class="badge badge-blue">在线考试</span></td><td><span class="badge badge-green">进行中</span></td><td>528</td><td><span class="action-link" onclick="navigateTo('activity-list')">查看</span></td></tr>
                <tr><td><strong>21天阅读知识闯关</strong></td><td><span class="badge badge-green">每日趣味闯关</span></td><td><span class="badge badge-green">进行中</span></td><td>728</td><td><span class="action-link" onclick="navigateTo('activity-list')">查看</span></td></tr>
                <tr><td><strong>历史文化知识测试</strong></td><td><span class="badge badge-blue">在线考试</span></td><td><span class="badge badge-yellow">未开始</span></td><td>0</td><td><span class="action-link" onclick="navigateTo('activity-list')">查看</span></td></tr>
                <tr><td><strong>非遗文化知识闯关</strong></td><td><span class="badge badge-green">每日趣味闯关</span></td><td><span class="badge badge-gray">已结束</span></td><td>1,204</td><td><span class="action-link" onclick="navigateTo('activity-list')">查看</span></td></tr>
            </tbody>
        </table>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)">
        <div class="card">
            <h3 style="font-size:var(--font-size-base);font-weight:700;margin-bottom:var(--spacing-md)">快速操作</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                <button class="btn btn-primary" onclick="navigateTo('activity-create')" style="justify-content:center">创建活动</button>
                <button class="btn btn-outline" onclick="navigateTo('question-bank')" style="justify-content:center">题库管理</button>
                <button class="btn btn-outline" onclick="navigateTo('paper-mgmt')" style="justify-content:center">试卷管理</button>
                <button class="btn btn-outline" onclick="navigateTo('exam-records')" style="justify-content:center">答题情况</button>
            </div>
        </div>
        <div class="card">
            <h3 style="font-size:var(--font-size-base);font-weight:700;margin-bottom:var(--spacing-md)">数据概览</h3>
            <div style="display:grid;gap:var(--spacing-md)">
                <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-secondary)">题库总数</span><strong>12 个</strong></div>
                <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-secondary)">题目总数</span><strong>2,480 道</strong></div>
                <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-secondary)">试卷总数</span><strong>18 份</strong></div>
                <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0"><span style="color:var(--text-secondary)">今日新增答题</span><strong style="color:var(--primary)">342 次</strong></div>
            </div>
        </div>
    </div>`;
});
