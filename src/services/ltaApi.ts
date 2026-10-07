import { BusArrivalData, NextBus, CrowdingLevel, BusType, ServiceCategory } from '../types/transit';

export interface ApiHealthResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
  ltaIntegration: {
    accountKeyConfigured: boolean;
    datamallEndpoint: string;
    note: string;
  };
}

export interface LtaRawBusSlot {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string;
  Feature?: 'WAB' | string;
  Type?: 'SD' | 'DD' | 'BD' | string;
}

export interface LtaRawService {
  ServiceNo: string;
  Operator: string;
  NextBus?: LtaRawBusSlot;
  NextBus2?: LtaRawBusSlot;
  NextBus3?: LtaRawBusSlot;
}

export interface LtaBusArrivalResponse {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services: LtaRawService[];
  _simulated?: boolean;
  _warning?: string;
}

/**
 * Checks API server health and whether LTA_ACCOUNT_KEY is configured
 */
export async function checkApiHealth(): Promise<ApiHealthResponse> {
  const response = await fetch('/api/health');
  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }
  return await response.json();
}

/**
 * Fetches live bus arrival predictions from /api/bus-arrival
 * and normalizes the LTA Datamall v3 payload into application state.
 */
export async function fetchLiveBusArrival(
  busStopCode: string,
  serviceNo?: string
): Promise<{
  services: BusArrivalData[];
  raw: LtaBusArrivalResponse;
  isSimulated: boolean;
}> {
  const code = busStopCode.trim();
  let url = `/api/bus-arrival?BusStopCode=${encodeURIComponent(code)}`;
  if (serviceNo && serviceNo.trim().length > 0) {
    url += `&ServiceNo=${encodeURIComponent(serviceNo.trim())}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch arrivals for stop ${code}: HTTP ${response.status}`);
  }

  const data: LtaBusArrivalResponse = await response.json();
  const services = (data.Services || []).map((rawSvc) => normalizeLtaService(rawSvc));

  return {
    services,
    raw: data,
    isSimulated: Boolean(data._simulated),
  };
}

/**
 * Normalizes an LTA raw service entry into application model
 */
function normalizeLtaService(raw: LtaRawService): BusArrivalData {
  const operatorMap: Record<string, 'SBS Transit' | 'SMRT' | 'Tower Transit' | 'Go-Ahead'> = {
    SBST: 'SBS Transit',
    SMRT: 'SMRT',
    TTS: 'Tower Transit',
    GAS: 'Go-Ahead',
  };

  const operator = operatorMap[raw.Operator] || 'SBS Transit';

  // Determine category
  let category: ServiceCategory = 'Trunk';
  const num = parseInt(raw.ServiceNo, 10);
  if (raw.ServiceNo.startsWith('50') || raw.ServiceNo.endsWith('e') || raw.ServiceNo.endsWith('M')) {
    category = 'Express';
  } else if (!isNaN(num) && (num >= 200 && num <= 399 && num !== 190)) {
    category = 'Feeder';
  }

  return {
    serviceNo: raw.ServiceNo,
    category,
    operator,
    destinationName: getDestinationName(raw.ServiceNo, raw.NextBus?.DestinationCode),
    nextBus: normalizeBusSlot(raw.NextBus),
    nextBus2: raw.NextBus2?.EstimatedArrival ? normalizeBusSlot(raw.NextBus2) : undefined,
    nextBus3: raw.NextBus3?.EstimatedArrival ? normalizeBusSlot(raw.NextBus3) : undefined,
  };
}

function normalizeBusSlot(slot?: LtaRawBusSlot): NextBus {
  if (!slot || !slot.EstimatedArrival) {
    return {
      etaMinutes: 99,
      load: 'SEA',
      type: 'SD',
      wab: false,
    };
  }

  const arrivalTime = new Date(slot.EstimatedArrival).getTime();
  const now = Date.now();
  const diffMinutes = Math.round((arrivalTime - now) / 60000);
  const etaMinutes = Math.max(0, diffMinutes);

  const load: CrowdingLevel =
    slot.Load === 'LSD' ? 'LSD' : slot.Load === 'SDA' ? 'SDA' : 'SEA';

  const type: BusType =
    slot.Type === 'DD' ? 'DD' : slot.Type === 'BD' ? 'BD' : 'SD';

  const wab = slot.Feature === 'WAB';

  return {
    etaMinutes,
    load,
    type,
    wab,
    estimatedDistanceKm: etaMinutes === 0 ? 0.2 : Number((etaMinutes * 0.35).toFixed(1)),
  };
}

function getDestinationName(serviceNo: string, destinationCode?: string): string {
  const destinations: Record<string, string> = {
    '147': 'Jurong East Int',
    '65': 'HarbourFront Int',
    '190': 'New Bridge Rd Ter',
    '7': 'Clementi Int',
    '502': 'Soon Lee Bus Park',
    '2': 'Kampong Bahru Ter',
    '12': 'Pasir Ris Int',
    '851': 'Bukit Merah Int',
    '10': 'Kent Ridge Ter',
    '166': 'Ang Mo Kio Int',
    '334': 'Jurong West St 42 (Loop)',
    '66': 'Bedok Int',
  };

  return destinations[serviceNo] || (destinationCode ? `Stop ${destinationCode}` : 'Terminal');
}
