class HttpClientError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpClientError";
  }
}

export { HttpClientError };
