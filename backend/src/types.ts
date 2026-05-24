export type ApiError = {
  code: string;
  message: string;
  details: Record<string, string[]> | null;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: ApiError | null;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type StoredUser = PublicUser & {
  password?: string;
};

export type GenericRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
};
