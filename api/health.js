/**
 * Health check endpoint for TransitSG API
 * Monitored by uptime services & frontend diagnostic widgets.
 * Compatible with Vercel Serverless Functions and Node.js HTTP handlers.
 */

export default async function handler(req, res) {
  const accountKey = process.env.LTA_ACCOUNT_KEY || process.env.VITE_LTA_ACCOUNT_KEY || '';
  const isLtaConfigured = Boolean(accountKey && accountKey.trim().length > 0);

  const payload = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    service: 'singapore-transit-api',
    version: '1.0.0',
    ltaIntegration: {
      accountKeyConfigured: isLtaConfigured,
      datamallEndpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
      note: isLtaConfigured
        ? 'LTA_ACCOUNT_KEY is configured and active'
        : 'LTA_ACCOUNT_KEY not set yet in environment variables; fallback simulation enabled'
    },
    endpoints: [
      {
        path: '/api/health',
        method: 'GET',
        description: 'Health & connectivity status monitor'
      },
      {
        path: '/api/bus-arrival',
        method: 'GET',
        params: ['BusStopCode (required)', 'ServiceNo (optional)'],
        description: 'LTA Datamall v3 live bus arrival countdowns, passenger loads, and vehicle types'
      }
    ]
  };

  if (typeof res.status === 'function') {
    return res.status(200).json(payload);
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(payload, null, 2));
}
