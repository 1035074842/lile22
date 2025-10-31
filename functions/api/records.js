export async function onRequestGet(context) {
    const { env } = context;
    
    try {
        // 检查 KV 存储是否可用
        if (!env.KV_STORAGE) {
            throw new Error('KV_STORAGE 未正确配置');
        }
        
        const existingRecords = await env.KV_STORAGE.get('checkin_records');
        console.log('从KV获取的记录:', existingRecords);
        
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
        console.error('获取记录详细错误:', error);
        return new Response(JSON.stringify({
            success: false,
            msg: `获取记录失败: ${error.message}`
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}