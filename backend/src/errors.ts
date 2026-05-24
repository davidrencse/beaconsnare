export class ApiError extends Error {
  statusCode: number;
  code: string;
  details: Record<string, string[]> | null;

  constructor(statusCode: number, code: string, message: string, details: Record<string, string[]> | null = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function errorResponse(error: ApiError) {
  return {
    success: false,
    data: null,
    error: {
      code: error.code,
      message: error.message,
      details: error.details
    }
  };
}
