import type { AuditLogEntry, BackendConfig, BeaconEndpoint, CallbackEvent, CallbackEventDetail, CampaignDetail, CampaignSummary, CreateCampaignResponse, CreateTargetResponse, EvidenceExport, GenerateBeaconResponse, HealthResponse, ItemResponse, ListResponse, SessionDetail, SessionSummary, SourceType, SourceTypeFilter, Target, TargetStatus, TargetType } from '../types';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:3000';

type QueryValue = string | number | boolean | null | undefined;
type Query = Record<string, QueryValue>;

export class ApiError extends Error {
  status: number;
  details: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function queryString(query?: Query): string {
  if (!query) return '';
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });
  const text = params.toString();
  return text ? `?${text}` : '';
}

async function parseError(response: Response): Promise<ApiError> {
  let details: unknown;
  let message = `Request failed with status ${response.status}`;
  try {
    details = await response.json();
    if (details && typeof details === 'object') {
      const record = details as Record<string, unknown>;
      if (typeof record.message === 'string') message = record.message;
      else if (typeof record.error === 'string') message = record.error;
    }
  } catch {
    const text = await response.text().catch(() => '');
    if (text) message = text;
  }
  return new ApiError(message, response.status, details);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, credentials: 'include' });
  if (!response.ok) throw await parseError(response);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  health: () => request<HealthResponse>('/api/health'),
  config: () => request<BackendConfig>('/api/config'),
  listTargets: (q: { type?: TargetType | 'all'; status?: TargetStatus | 'all'; search?: string; page?: number; pageSize?: number }) => request<ListResponse<Target>>(`/api/targets${queryString(q)}`),
  createTarget: (body: { type: TargetType; value: string; notes: string; createdByLabel: string }) => request<CreateTargetResponse>('/api/targets', { method: 'POST', body: JSON.stringify(body) }),
  updateTarget: (id: string, body: { notes: string; status: TargetStatus; updatedByLabel: string }) => request<ItemResponse<Target>>(`/api/targets/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(body) }),
  listCampaigns: (q: { status?: CampaignSummary['status'] | 'all'; page?: number; pageSize?: number }) => request<ListResponse<CampaignSummary>>(`/api/campaigns${queryString(q)}`),
  createCampaign: (body: { name: string; description: string; targetIds: string[]; operatorLabel: string }) => request<CreateCampaignResponse>('/api/campaigns', { method: 'POST', body: JSON.stringify(body) }),
  getCampaign: (id: string) => request<ItemResponse<CampaignDetail>>(`/api/campaigns/${encodeURIComponent(id)}`),
  updateCampaign: (id: string, body: { status: CampaignDetail['status']; description: string; operatorLabel: string }) => request<ItemResponse<CampaignDetail>>(`/api/campaigns/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(body) }),
  generateBeacons: (id: string, body: { types: SourceType[]; label: string; operatorLabel: string }) => request<GenerateBeaconResponse>(`/api/campaigns/${encodeURIComponent(id)}/beacons`, { method: 'POST', body: JSON.stringify(body) }),
  listEvents: (q: { campaignId?: string; sessionId?: string; sourceType?: SourceTypeFilter; ruleMatch?: string; since?: string; until?: string; page?: number; pageSize?: number }) => request<ListResponse<CallbackEvent>>(`/api/events${queryString(q)}`),
  getEvent: (id: string) => request<ItemResponse<CallbackEventDetail>>(`/api/events/${encodeURIComponent(id)}`),
  listSessions: (q: { campaignId?: string; status?: SessionSummary['status'] | 'all'; page?: number; pageSize?: number }) => request<ListResponse<SessionSummary>>(`/api/sessions${queryString(q)}`),
  getSession: (id: string) => request<ItemResponse<SessionDetail>>(`/api/sessions/${encodeURIComponent(id)}`),
  listAudit: (q: { actionType?: string; campaignId?: string; since?: string; until?: string; page?: number; pageSize?: number }) => request<ListResponse<AuditLogEntry>>(`/api/audit${queryString(q)}`),
  listExports: (q: { scopeType?: 'campaign' | 'session' | 'all'; page?: number; pageSize?: number }) => request<ListResponse<EvidenceExport>>(`/api/exports${queryString(q)}`),
  createExport: (body: { scopeType: 'campaign' | 'session'; scopeId: string; includeRawEvents: boolean; includeAuditTrail: boolean; requestedByLabel: string }) => request<ItemResponse<EvidenceExport>>('/api/exports', { method: 'POST', body: JSON.stringify(body) }),
  getExport: (id: string) => request<ItemResponse<EvidenceExport>>(`/api/exports/${encodeURIComponent(id)}`),
  downloadExport: async (id: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/api/exports/${encodeURIComponent(id)}/download`, { credentials: 'include' });
    if (!response.ok) throw await parseError(response);
    return response.blob();
  }
};
