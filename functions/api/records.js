export async function onRequestGet(context) {
    const { env } = context;
    
    // 调试：检查环境变量中是否有KV_STORAGE
    const hasKV = typeof env.KV_STORAGE !== 'undefined';
    
    try {
        if (!hasKV) {
            throw new Error('KV_STORAGE 环境变量未定义');
        }

        const existingRecords = await env.KV_STORAGE.get('checkin_records');
        const records = existingRecords ? JSON.parse(existingRecords) : [];
        
        return new Response(JSON.stringify({
            success: true,
            data: records
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        
    } catch (error) {
        console.error('获取记录错误:', error);
        return new Response(JSON.stringify({
            success: false,
            msg: `获取记录失败: ${error.message}`,
            debug: { hasKV } // 返回调试信息
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}