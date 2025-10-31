export async function onRequestGet(context) {
    const { env } = context;
    
    console.log('=== 开始调试 KV_STORAGE ===');
    console.log('环境变量Keys:', Object.keys(env));
    console.log('KV_STORAGE 类型:', typeof env.KV_STORAGE);
    console.log('KV_STORAGE 值:', env.KV_STORAGE);
    
    try {
        // 检查 KV_STORAGE 是否存在
        if (!env.KV_STORAGE) {
            const errorMsg = 'KV_STORAGE 环境变量不存在。当前环境变量: ' + JSON.stringify(Object.keys(env));
            console.error(errorMsg);
            return new Response(JSON.stringify({
                success: false,
                msg: errorMsg,
                debug: {
                    envKeys: Object.keys(env),
                    hasKVStorage: !!env.KV_STORAGE
                }
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        // 测试 KV 存储基本操作
        console.log('开始读取 checkin_records...');
        const existingRecords = await env.KV_STORAGE.get('checkin_records');
        console.log('读取结果:', existingRecords);
        
        const records = existingRecords ? JSON.parse(existingRecords) : [];
        
        console.log('解析后的记录:', records);
        
        return new Response(JSON.stringify({
            success: true,
            data: records,
            debug: {
                recordCount: records.length,
                hasKVStorage: true,
                readSuccess: true
            }
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
            debug: {
                error: error.toString(),
                stack: error.stack
            }
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}