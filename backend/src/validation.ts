export function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

export function optionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
