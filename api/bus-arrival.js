/**
 * LTA Datamall v3 BusArrival API Endpoint
 * Endpoint: GET /api/bus-arrival?BusStopCode=04121&ServiceNo=7
 * Proxies LTA Datamall v3 with secure server-side AccountKey injection.
 * Compatible with Vercel Serverless Functions and Node.js HTTP handlers.
 */

export default async function handler(req, res) {
  // Enable CORS for cross-origin callers
  if (typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  }

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(200).end();
    res.statusCode = 200;
    return res.end();
  }

  // Parse query parameters
  let busStopCode = '';
  let serviceNo = '';

  if (req.query) {
    busStopCode = req.query.BusStopCode || req.query.busStopCode || '';
    serviceNo = req.query.ServiceNo || req.query.serviceNo || '';
  } else if (req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      busStopCode = parsedUrl.searchParams.get('BusStopCode') || parsedUrl.searchParams.get('busStopCode') || '';
      serviceNo = parsedUrl.searchParams.get('ServiceNo') || parsedUrl.searchParams.get('serviceNo') || '';
    } catch (e) {
      // ignore
    }
  }

  if (!busStopCode) {
    const errorResponse = {
      error: 'Missing required parameter: BusStopCode',
      example: '/api/bus-arrival?BusStopCode=04121&ServiceNo=7',
      documentation: 'https://datamall.lta.gov.sg'
    };
    if (typeof res.status === 'function') {
      return res.status(400).json(errorResponse);
    }
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(errorResponse));
  }

  // Format 5-digit string (e.g. 4121 -> 04121)
  const normalizedStopCode = String(busStopCode).padStart(5, '0');
  const accountKey = process.env.LTA_ACCOUNT_KEY || process.env.VITE_LTA_ACCOUNT_KEY || '';

  // 1. Live LTA DataMall call if AccountKey is present
  if (accountKey && accountKey.trim().length > 0) {
    try {
      let ltaUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(normalizedStopCode)}`;
      if (serviceNo && serviceNo.trim().length > 0) {
        ltaUrl += `&ServiceNo=${encodeURIComponent(serviceNo.trim())}`;
      }

      const ltaResponse = await fetch(ltaUrl, {
        method: 'GET',
        headers: {
          AccountKey: accountKey.trim(),
          accept: 'application/json'
        }
      });

      if (!ltaResponse.ok) {
        const errorText = await ltaResponse.text();
        const errPayload = {
          error: `LTA DataMall responded with status ${ltaResponse.status}`,
          status: ltaResponse.status,
          details: errorText,
          BusStopCode: normalizedStopCode
        };
        if (typeof res.status === 'function') {
          return res.status(ltaResponse.status).json(errPayload);
        }
        res.statusCode = ltaResponse.status;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(errPayload));
      }

      const data = await ltaResponse.json();

      // Return live LTA data with 15s cache-control (LTA refreshes every 20s)
      if (typeof res.setHeader === 'function') {
        res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=5');
        res.setHeader('Content-Type', 'application/json');
      }

      if (typeof res.status === 'function') {
        return res.status(200).json(data);
      }
      res.statusCode = 200;
      return res.end(JSON.stringify(data));
    } catch (err) {
      console.error('Error fetching from LTA DataMall:', err);
      const fallbackPayload = getFallbackBusArrival(normalizedStopCode, serviceNo, err.message);
      if (typeof res.status === 'function') {
        return res.status(200).json(fallbackPayload);
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(fallbackPayload));
    }
  }

  // 2. Fallback simulation when LTA_ACCOUNT_KEY is not yet configured in Vercel
  const fallbackPayload = getFallbackBusArrival(
    normalizedStopCode,
    serviceNo,
    'LTA_ACCOUNT_KEY environment variable is not configured yet. Set LTA_ACCOUNT_KEY in your Vercel Project Settings > Environment Variables.'
  );

  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
  }

  if (typeof res.status === 'function') {
    return res.status(200).json(fallbackPayload);
  }
  res.statusCode = 200;
  return res.end(JSON.stringify(fallbackPayload));
}

/**
 * Generate synthetic LTA v3 BusArrival payload for seamless local development
 * and preview before the user adds LTA_ACCOUNT_KEY in Vercel.
 */
function getFallbackBusArrival(stopCode, filterServiceNo, warningMessage) {
  const now = Date.now();
  const formatIso = (addMinutes) => new Date(now + addMinutes * 60000).toISOString();

  // Preset services for popular stop codes (04121 People's Park Ctr, 01112 Orchard, etc.)
  let services = [
    {
      ServiceNo: '2',
      Operator: 'GAS',
      NextBus: {
        OriginCode: '02099',
        DestinationCode: '02101',
        EstimatedArrival: formatIso(1),
        Latitude: '1.284200',
        Longitude: '103.844100',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD'
      },
      NextBus2: {
        OriginCode: '02099',
        DestinationCode: '02101',
        EstimatedArrival: formatIso(8),
        Latitude: '1.289000',
        Longitude: '103.850000',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus3: {
        OriginCode: '02099',
        DestinationCode: '02101',
        EstimatedArrival: formatIso(17),
        Latitude: '1.295000',
        Longitude: '103.855000',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'DD'
      }
    },
    {
      ServiceNo: '12',
      Operator: 'GAS',
      NextBus: {
        OriginCode: '77009',
        DestinationCode: '05019',
        EstimatedArrival: formatIso(3),
        Latitude: '1.285500',
        Longitude: '103.842000',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus2: {
        OriginCode: '77009',
        DestinationCode: '05019',
        EstimatedArrival: formatIso(11),
        Latitude: '1.292000',
        Longitude: '103.849000',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus3: {
        OriginCode: '77009',
        DestinationCode: '05019',
        EstimatedArrival: formatIso(20),
        Latitude: '1.300000',
        Longitude: '103.858000',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD'
      }
    },
    {
      ServiceNo: '147',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '64009',
        DestinationCode: '28009',
        EstimatedArrival: formatIso(0),
        Latitude: '1.283800',
        Longitude: '103.844500',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus2: {
        OriginCode: '64009',
        DestinationCode: '28009',
        EstimatedArrival: formatIso(7),
        Latitude: '1.291000',
        Longitude: '103.848000',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus3: {
        OriginCode: '64009',
        DestinationCode: '28009',
        EstimatedArrival: formatIso(15),
        Latitude: '1.299000',
        Longitude: '103.851000',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD'
      }
    },
    {
      ServiceNo: '190',
      Operator: 'SMRT',
      NextBus: {
        OriginCode: '44009',
        DestinationCode: '05019',
        EstimatedArrival: formatIso(4),
        Latitude: '1.286000',
        Longitude: '103.841000',
        VisitNumber: '1',
        Load: 'LSD',
        Feature: 'WAB',
        Type: 'BD'
      },
      NextBus2: {
        OriginCode: '44009',
        DestinationCode: '05019',
        EstimatedArrival: formatIso(12),
        Latitude: '1.294000',
        Longitude: '103.847000',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      }
    }
  ];

  if (filterServiceNo) {
    const matched = services.filter((s) => s.ServiceNo.toLowerCase() === filterServiceNo.toLowerCase());
    if (matched.length > 0) {
      services = matched;
    } else {
      services = [
        {
          ServiceNo: filterServiceNo,
          Operator: 'SBST',
          NextBus: {
            OriginCode: '00000',
            DestinationCode: '00000',
            EstimatedArrival: formatIso(2),
            Latitude: '1.285000',
            Longitude: '103.843000',
            VisitNumber: '1',
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'DD'
          },
          NextBus2: {
            OriginCode: '00000',
            DestinationCode: '00000',
            EstimatedArrival: formatIso(9),
            Latitude: '1.290000',
            Longitude: '103.848000',
            VisitNumber: '1',
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'SD'
          }
        }
      ];
    }
  }

  return {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/v3/$metadata#BusArrival',
    BusStopCode: stopCode,
    Services: services,
    _simulated: true,
    _warning: warningMessage
  };
}
