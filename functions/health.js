export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    status: 'ok',
    service: '战术小队打卡系统',
    timestamp: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}