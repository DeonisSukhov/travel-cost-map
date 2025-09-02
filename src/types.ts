export type Site = {
  site_id: string;
  site_name: string;
  longitude: number;
  latitude: number;
};

export type RawSiteRow = {
  site_id: string;
  site_name: string;
  longitude: string;
  latitude: string;
};

export type CostMetrics = {
  iwait: number;
  inveht: number;
  xpen: number;
  xnum: number;
  cost: number;
};

export type RawCostRow = {
  site_id_from: string;
  site_id_to: string;
  iwait: string;
  inveht: string;
  xpen: string;
  xnum: string;
  cost: string;
};

export type CostsByFrom = Record<string, Record<string, CostMetrics>>;

export type DataLoadState = {
  sites: Site[];
  costs: CostsByFrom;
  isLoading: boolean;
  error?: string;
};

export type SelectionState = {
  selectedFromId?: string;
};

export function parseNumberSafe(value: string): number {
  if (value == null) return NaN;
  const normalized = value.replace(',', '.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

export function costToColor(cost: number | undefined): string {
  if (cost == null || !Number.isFinite(cost)) return '#000000';
  if (cost <= 5) return '#1DB954';
  if (cost <= 15) return '#D8A71D';
  if (cost <= 30) return '#EF476F';
  return '#5010e3';
}