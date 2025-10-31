// 统计打卡数据
export async function onRequestGet(context) {
    const { env } = context;
    
    try {
        // 从 KV 获取记录
        const existingRecords = await env.KV_STORAGE.get('checkin_records');
        const records = existingRecords ? JSON.parse(existingRecords) : [];

        // 计算30天前的日期
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

        // 筛选30天内的记录
        const recentRecords = records.filter(record => record.date >= thirtyDaysAgoStr);

        // 统计每个成员的打卡次数
        const memberStats = {};
        recentRecords.forEach(record => {
            memberStats[record.gameName] = (memberStats[record.gameName] || 0) + 1;
        });

        return new Response(JSON.stringify({
            success: true,
            data: {
                memberStats,
                totalRecords: recentRecords.length,
                period: `${thirtyDaysAgoStr} 至 ${new Date().toISOString().split('T')[0]}`
            }
        }), {
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('统计错误:', error);
        return new Response(JSON.stringify({
            success: false,
            msg: '统计失败'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}