export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const { gameName, map, date, time } = await request.json();
        
        if (!gameName || !map) {
            return new Response(JSON.stringify({
                success: false,
                msg: '游戏名称和地图不能为空'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }

        // 获取现有记录
        const existingRecords = await env.KV_STORAGE.get('checkin_records');
        const records = existingRecords ? JSON.parse(existingRecords) : [];
        
        // 添加新记录
        const newRecord = {
            id: Date.now().toString(),
            gameName,
            map,
            date,
            time,
            timestamp: new Date().toISOString()
        };
        records.push(newRecord);
        
        // 保存回KV
        await env.KV_STORAGE.put('checkin_records', JSON.stringify(records));
        
        return new Response(JSON.stringify({
            success: true,
            msg: `打卡成功！${gameName} 在 ${map} 地图完成打卡`
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
        
    } catch (error) {
        console.error('打卡错误:', error);
        return new Response(JSON.stringify({
            success: false,
            msg: '服务器错误'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

export async function onRequestOptions(context) {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}