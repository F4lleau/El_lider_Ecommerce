export type ApiResponse<T> = {
  ok: boolean;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  ok: false;
  message: string;
  errors?: Record<string, string[]>;
};