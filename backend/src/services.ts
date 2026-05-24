import { randomUUID } from 'crypto';
import { GenericRecord } from './types';

export function createRecord(input: Record<string, unknown>): GenericRecord {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...input
  };
}

export function updateRecord(record: GenericRecord, updates: Record<string, unknown>): GenericRecord {
  return {
    ...record,
    ...updates,
    updatedAt: new Date().toISOString()
  };
}

export function matchesSearch(record: Record<string, unknown>, query: string): boolean {
  const needle = query.toLowerCase();

  return Object.values(record).some((value) =>
    String(value).toLowerCase().includes(needle)
  );
}
