export type CrowdingLevel = 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing
export type BusType = 'DD' | 'SD' | 'BD'; // Double Decker, Single Decker, Bendy
export type ServiceCategory = 'Trunk' | 'Feeder' | 'Express' | 'CityDirect';

export interface NextBus {
  etaMinutes: number; // 0 means 'Arr'
  load: CrowdingLevel;
  type: BusType;
  wab: boolean; // Wheelchair accessible bus
  estimatedDistanceKm?: number;
}

export interface BusArrivalData {
  serviceNo: string;
  category: ServiceCategory;
  operator: 'SBS Transit' | 'SMRT' | 'Tower Transit' | 'Go-Ahead';
  destinationName: string;
  nextBus: NextBus;
  nextBus2?: NextBus;
  nextBus3?: NextBus;
}

export interface BusStop {
  id: string; // e.g. "B01112"
  code: string; // "01112"
  name: string; // "Opp Orchard Stn/ION"
  road: string; // "Orchard Turn"
  nearbyMrt?: string; // e.g. "NS22/TE14 Orchard"
  coordinates: {
    lat: number;
    lng: number;
  };
  services: BusArrivalData[];
  isInterchange?: boolean;
}

export interface RouteWaypoint {
  stopCode: string;
  stopName: string;
  roadName: string;
  fareStage: number;
  cumulativeKm: number;
  hasActiveBus?: boolean;
  activeBusDetails?: {
    plateNumber: string;
    load: CrowdingLevel;
    type: BusType;
    speedKmH: number;
  };
}

export interface RouteDetail {
  serviceNo: string;
  operator: 'SBS Transit' | 'SMRT' | 'Tower Transit' | 'Go-Ahead';
  category: ServiceCategory;
  origin: string;
  destination: string;
  operatingHours: string;
  frequencyRange: string;
  direction1: {
    origin: string;
    destination: string;
    stops: RouteWaypoint[];
  };
  direction2?: {
    origin: string;
    destination: string;
    stops: RouteWaypoint[];
  };
}

export interface InterchangeBerth {
  berthNumber: string;
  services: string[];
  destinationSummary: string;
  wheelchairFriendly: boolean;
}

export interface TransitInterchange {
  id: string;
  name: string;
  mrtLines: { code: string; name: string; color: string }[];
  address: string;
  berths: InterchangeBerth[];
}

export interface ServiceAlert {
  id: string;
  category: 'Disruption' | 'Diversion' | 'Weather' | 'Advisory';
  severity: 'high' | 'medium' | 'info';
  title: string;
  affectedServices: string[];
  affectedLines?: string[];
  timestamp: string;
  description: string;
  status: 'Active' | 'Investigating' | 'Resolved';
}
