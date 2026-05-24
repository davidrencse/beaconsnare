export type TargetType = 'domain' | 'cidr';
export type TargetStatus = 'active' | 'archived';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'closed';
export type SourceType = 'http' | 'webhook' | 'doh';
export type SourceTypeFilter = SourceType | 'all';
export type SessionStatus = 'open' | 'closed';
export type Severity = 'low' | 'medium' | 'high';
export type Confidence = 'low' | 'medium' | 'high';

export interface PaginationMeta { page: number; pageSize: number; totalItems: number; totalPages: number; }
export interface HealthResponse { status: 'ok' | 'degraded'; service: string; version: string; timestamp: string; }
export interface BackendConfig { maxPageSize: number; pollingDefaults: { eventsMs: number; sessionsMs: number; }; safety: { publicIpBlockingEnabled: boolean; allowlistRequiredForCampaigns: boolean; auditLoggingEnabled: boolean; }; }
export interface Target { id: string; type: TargetType; value: string; normalizedValue: string; status: TargetStatus; notes: string; createdAt: string; updatedAt: string; createdByLabel: string; }
export interface CampaignSummary { id: string; name: string; status: CampaignStatus; createdAt: string; updatedAt: string; targetCount: number; beaconCount: number; eventCount: number; sessionCount: number; }
export interface BeaconEndpoint { id: string; campaignId: string; tokenHint: string; type: SourceType; label: string; path: string; fullUrl: string; isActive: boolean; createdAt: string; }
export interface CampaignDetail { id: string; name: string; description: string; status: CampaignStatus; operatorLabel: string; createdAt: string; updatedAt: string; targets: Target[]; beacons: BeaconEndpoint[]; stats: { eventCount: number; sessionCount: number; lastEventAt: string | null; }; }
export interface RuleMatch { ruleId: string; label: string; severity: Severity; confidence: Confidence; explanation: string; }
export interface CallbackEvent { id: string; campaignId: string; sessionId: string | null; beaconEndpointId: string; sourceType: SourceType; method: string | null; path: string; sourceIp: string; userAgent: string | null; occurredAt: string; accepted: boolean; rejectionReason: string | null; ruleMatches: RuleMatch[]; }
export interface RequestFingerprint { headerNames: string[]; contentType: string | null; contentLength: number | null; transportHints: string[]; timingBucket: string; payloadCharacteristics: string[]; }
export interface CallbackEventDetail extends CallbackEvent { query: Record<string, string | string[]>; headers: Record<string, string>; bodyPreview: string | null; bodySize: number; fingerprint: RequestFingerprint; }
export interface SessionSummary { id: string; campaignId: string; correlationKey: string; firstSeenAt: string; lastSeenAt: string; eventCount: number; status: SessionStatus; topSourceTypes: string[]; }
export interface SessionTimelineEntry { timestamp: string; eventId: string; sourceType: SourceType; label: string; details: string; }
export interface SessionDetail { id: string; campaignId: string; correlationKey: string; firstSeenAt: string; lastSeenAt: string; eventCount: number; status: SessionStatus; timeline: SessionTimelineEntry[]; summary: { sourceTypes: string[]; ruleMatchCounts: Record<string, number>; }; }
export interface AuditLogEntry { id: string; actionType: string; actorLabel: string; entityType: string; entityId: string; details: Record<string, unknown>; createdAt: string; immutableHash: string; }
export interface EvidenceExport { id: string; scopeType: 'campaign' | 'session'; scopeId: string; status: 'pending' | 'ready' | 'failed'; fileName: string; downloadUrl: string | null; createdAt: string; requestedByLabel: string; summary: Record<string, unknown>; }
export interface ListResponse<T> { items: T[]; pagination: PaginationMeta; }
export interface ItemResponse<T> { item: T; }
export interface CreateTargetResponse { item: Target; validation: { accepted: boolean; warnings: string[]; }; }
export interface CreateCampaignResponse { item: CampaignDetail; beacons: BeaconEndpoint[]; }
export interface GenerateBeaconResponse { items: BeaconEndpoint[]; }
