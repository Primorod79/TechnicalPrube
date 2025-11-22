export interface ApiError {
  message: string;
  statusCode: number;
  errors?: { [key: string]: string[] };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
