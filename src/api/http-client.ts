import { HttpClient, HttpClientError } from "@/api/core/http-client";

const httpGet = <T>(path: string): Promise<T> => HttpClient.get<T>(path);

const httpPost = <T>(path: string, body: unknown): Promise<T> => HttpClient.post<T>(path, body);

const httpAuthGet = <T>(path: string, signal?: AbortSignal): Promise<T> =>
  HttpClient.authGet<T>(path, signal);

const httpAuthPost = <T>(path: string, body: unknown): Promise<T> =>
  HttpClient.authPost<T>(path, body);

const httpAuthPatchWithBody = <T>(path: string, body: unknown): Promise<T> =>
  HttpClient.authPatchWithBody<T>(path, body);

const httpAuthPatch = (path: string): Promise<void> => HttpClient.authPatch(path);

const httpAuthDelete = <T>(path: string): Promise<T> => HttpClient.authDelete<T>(path);

const httpAuthGetBlob = (path: string): Promise<Blob> => HttpClient.authGetBlob(path);

export {
  HttpClientError,
  httpAuthDelete,
  httpAuthGet,
  httpAuthGetBlob,
  httpAuthPatch,
  httpAuthPatchWithBody,
  httpAuthPost,
  httpGet,
  httpPost,
};
