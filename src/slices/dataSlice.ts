import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Papa from 'papaparse';
import type { ParseResult } from 'papaparse';
import type { CostMetrics, CostsByFrom, DataLoadState, RawCostRow, RawSiteRow, Site } from '../types';
import { parseNumberSafe } from '../types';

const SITES_URL = '/data/sites.csv';
const COSTS_URL = '/data/costs.csv';

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return await res.text();
}

function parseSites(csvText: string): Site[] {
  const result: ParseResult<RawSiteRow> = Papa.parse<RawSiteRow>(csvText, { header: true, delimiter: ';', skipEmptyLines: true });
  const rows = result.data || [];
  return rows
    .filter((r: RawSiteRow) => r.site_id && r.site_name)
    .map((r: RawSiteRow) => ({
      site_id: String(r.site_id),
      site_name: r.site_name,
      longitude: parseNumberSafe(r.longitude),
      latitude: parseNumberSafe(r.latitude),
    }))
    .filter((s: Site) => Number.isFinite(s.longitude) && Number.isFinite(s.latitude));
}

function parseCosts(csvText: string): CostsByFrom {
  const result: ParseResult<RawCostRow> = Papa.parse<RawCostRow>(csvText, { header: true, delimiter: ';', skipEmptyLines: true });
  const rows = result.data || [];
  const byFrom: CostsByFrom = {};
  for (const r of rows as RawCostRow[]) {
    const fromId = String(r.site_id_from);
    const toId = String(r.site_id_to);
    const metrics: CostMetrics = {
      iwait: parseNumberSafe(r.iwait),
      inveht: parseNumberSafe(r.inveht),
      xpen: parseNumberSafe(r.xpen),
      xnum: parseNumberSafe(r.xnum),
      cost: parseNumberSafe(r.cost),
    };
    if (!byFrom[fromId]) byFrom[fromId] = {};
    byFrom[fromId][toId] = metrics;
  }
  return byFrom;
}

export const loadData = createAsyncThunk('data/load', async () => {
  const [sitesCsv, costsCsv] = await Promise.all([fetchText(SITES_URL), fetchText(COSTS_URL)]);
  const sites = parseSites(sitesCsv);
  const costs = parseCosts(costsCsv);
  return { sites, costs } as { sites: Site[]; costs: CostsByFrom };
});

const initialState: DataLoadState = {
  sites: [],
  costs: {},
  isLoading: false,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadData.pending, state => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(loadData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sites = action.payload.sites;
        state.costs = action.payload.costs;
      })
      .addCase(loadData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load data';
      });
  },
});

export default dataSlice.reducer;