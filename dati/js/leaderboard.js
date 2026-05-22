/* leaderboard.js — 排行榜 + 证书管理 */

// ===== 排行榜 =====
registerPage('leaderboard', () => {
    return `
    ${pageHeader('🏆 排行榜', '活动管理 / [当前活动] / 排行榜')}
    <div class="card">
        <div class="tabs" data-tab-group="lb">
            <div class="tab active" onclick="switchLbTab('personal')">个人榜</div>
            <div class="tab" onclick="switchLbTab('daily')">每日榜</div>
            <div class="tab" onclick="switchLbTab('streak')">连续参与榜</div>
            <div class="tab" onclick="switchLbTab('unit-score')">单位总分榜</div>
            <div class="tab" onclick="switchLbTab('unit-part')">单位参与榜</div>
            <div class="tab" onclick="switchLbTab('unit-avg')">单位平均分榜</div>
        </div>

        <!-- 个人总榜 -->
        <div data-tab-pane="personal" style="display:block">
            <div class="info-box blue" style="margin-bottom:16px">🏆 排序规则：<strong>累计总积分 &gt; 有效参与天数 &gt; 累计用时 &gt; 最早达成时间</strong></div>
            ${tableWrap(
                ['排名', '姓名', '手机号', '选送单位', '累计总积分', '有效参与天数', '累计用时', '最早达成时间'],
                `<tr><td>🥇 1</td><td><strong>张三</strong></td><td>138****1234</td><td>市图书馆</td><td><strong style="color:var(--primary)">2,850</strong></td><td>28 天</td><td>4h 32min</td><td>2026-06-01</td></tr>
                <tr><td>🥈 2</td><td><strong>李四</strong></td><td>139****5678</td><td>大学图书馆</td><td><strong>2,780</strong></td><td>27 天</td><td>5h 10min</td><td>2026-06-02</td></tr>
                <tr><td>🥉 3</td><td><strong>王五</strong></td><td>136****9012</td><td>区图书馆</td><td><strong>2,650</strong></td><td>25 天</td><td>4h 55min</td><td>2026-06-01</td></tr>
                <tr><td>4</td><td>赵六</td><td>137****3456</td><td>省图书馆</td><td>2,520</td><td>24 天</td><td>5h 20min</td><td>2026-06-03</td></tr>
                <tr><td>5</td><td>孙七</td><td>135****7890</td><td>市图书馆</td><td>2,480</td><td>23 天</td><td>4h 45min</td><td>2026-06-02</td></tr>`
            )}
        </div>

        <!-- 每日榜 -->
        <div data-tab-pane="daily" style="display:none">
            <div class="info-box blue" style="margin-bottom:16px">📊 排序规则：<strong>当日有效得分 &gt; 用时 &gt; 提交时间</strong></div>
            <div class="filter-bar" style="margin-bottom:12px"><input type="date" value="2026-06-09"><button class="btn btn-primary btn-sm">查询</button></div>
            ${tableWrap(
                ['排名', '姓名', '手机号', '选送单位', '当日得分', '用时', '提交时间'],
                `<tr><td>🥇 1</td><td><strong>张三</strong></td><td>138****1234</td><td>市图书馆</td><td><strong style="color:var(--primary)">100</strong></td><td>8min 30s</td><td>09:15:30</td></tr>
                <tr><td>🥈 2</td><td><strong>王五</strong></td><td>136****9012</td><td>区图书馆</td><td><strong>95</strong></td><td>9min 15s</td><td>09:22:45</td></tr>
                <tr><td>🥉 3</td><td>赵六</td><td>137****3456</td><td>省图书馆</td><td>90</td><td>10min 05s</td><td>09:30:10</td></tr>`
            )}
        </div>

        <!-- 连续参与榜 -->
        <div data-tab-pane="streak" style="display:none">
            <div class="info-box green" style="margin-bottom:16px">🔥 连续参与天数越多越靠前</div>
            ${tableWrap(
                ['排名', '姓名', '手机号', '选送单位', '连续参与天数'],
                `<tr><td>🥇 1</td><td><strong>张三</strong></td><td>138****1234</td><td>市图书馆</td><td><strong style="color:var(--primary)">28 天</strong></td></tr>
                <tr><td>🥈 2</td><td><strong>李四</strong></td><td>139****5678</td><td>大学图书馆</td><td><strong>27 天</strong></td></tr>
                <tr><td>🥉 3</td><td>孙七</td><td>135****7890</td><td>市图书馆</td><td>25 天</td></tr>`
            )}
        </div>

        <!-- 单位总分榜 -->
        <div data-tab-pane="unit-score" style="display:none">
            <div class="info-box blue" style="margin-bottom:16px">🏢 排序规则：<strong>单位总积分 &gt; 有效参与人数 &gt; 单位平均分 &gt; 单位完成率</strong></div>
            ${tableWrap(
                ['排名', '单位名称', '有效参与人数', '单位总积分', '单位平均分', '单位完成率'],
                `<tr><td>🥇 1</td><td><strong>市图书馆</strong></td><td>156</td><td><strong style="color:var(--primary)">14,280</strong></td><td>91.5</td><td>85%</td></tr>
                <tr><td>🥈 2</td><td><strong>省图书馆</strong></td><td>98</td><td><strong>9,560</strong></td><td>97.6</td><td>92%</td></tr>
                <tr><td>🥉 3</td><td><strong>区图书馆</strong></td><td>42</td><td><strong>3,840</strong></td><td>91.4</td><td>82%</td></tr>`
            )}
        </div>

        <!-- 单位参与榜 -->
        <div data-tab-pane="unit-part" style="display:none">
            <div class="info-box green" style="margin-bottom:16px">👥 有效参与人数越多越靠前</div>
            ${tableWrap(
                ['排名', '单位名称', '有效参与人数', '单位总积分'],
                `<tr><td>🥇 1</td><td><strong>市图书馆</strong></td><td><strong style="color:var(--primary)">156</strong></td><td>14,280</td></tr>
                <tr><td>🥈 2</td><td><strong>省图书馆</strong></td><td><strong>98</strong></td><td>9,560</td></tr>
                <tr><td>🥉 3</td><td><strong>大学图书馆</strong></td><td>28</td><td>2,560</td></tr>`
            )}
        </div>

        <!-- 单位平均分榜 -->
        <div data-tab-pane="unit-avg" style="display:none">
            <div class="info-box yellow" style="margin-bottom:16px">📐 单位平均分 = 单位内有效参与用户的个人有效成绩之和 ÷ 单位内有效参与用户数。需设置最低参与人数门槛。</div>
            <div class="form-group" style="margin-bottom:16px"><label>最低参与人数门槛</label><div class="inline-field"><input type="number" value="5" min="1"><span>人</span></div></div>
            ${tableWrap(
                ['排名', '单位名称', '有效参与人数', '单位平均分', '单位完成率'],
                `<tr><td>🥇 1</td><td><strong>省图书馆</strong></td><td>98</td><td><strong style="color:var(--primary)">97.6</strong></td><td>92%</td></tr>
                <tr><td>🥈 2</td><td><strong>市图书馆</strong></td><td>156</td><td><strong>91.5</strong></td><td>85%</td></tr>
                <tr><td>🥉 3</td><td><strong>区图书馆</strong></td><td>42</td><td>91.4</td><td>82%</td></tr>`
            )}
        </div>
    </div>`;
});

function switchLbTab(tabId) {
    const card = document.querySelector('.card');
    card.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
        t.style.borderBottomColor = 'transparent';
        t.style.color = 'var(--text-muted)';
        t.style.fontWeight = '500';
    });
    card.querySelectorAll('[data-tab-pane]').forEach(p => p.style.display = 'none');
    card.querySelectorAll('.tab').forEach(t => {
        if (t.onclick?.toString().includes(tabId)) {
            t.classList.add('active');
            t.style.borderBottomColor = 'var(--primary)';
            t.style.color = 'var(--primary)';
            t.style.fontWeight = '700';
        }
    });
    const pane = card.querySelector(`[data-tab-pane="${tabId}"]`);
    if (pane) pane.style.display = 'block';
}

// ===== 证书管理 =====
registerPage('certificates', () => renderPlanningEmptyPage('活动证明', '活动证明模块正在规划中。'));
