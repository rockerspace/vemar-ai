export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { name, tier } = body;
    const newKey = {
      keyId: `key_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: name || 'Enterprise Gateway Client',
      maskedKey: `sk_live_...${Math.random().toString(36).substring(2, 6)}`,
      tier: tier || 'Institutional Brokerage',
      rateLimitPerMin: tier === 'MII / Exchange Surveillance' ? 50000 : tier === 'Institutional Brokerage' ? 10000 : 1000,
      requestsToday: 0,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };
    return res.status(200).json({ success: true, key: newKey });
  }

  return res.status(200).json({
    success: true,
    keys: [
      {
        keyId: 'key_prod_88912',
        name: 'Hedge Fund Execution Feed (FIX 4.4 Engine)',
        maskedKey: 'sk_live_...9f2a',
        tier: 'MII / Exchange Surveillance',
        rateLimitPerMin: 50000,
        requestsToday: 14220,
        createdDate: '2026-01-15',
        status: 'ACTIVE'
      }
    ]
  });
}
