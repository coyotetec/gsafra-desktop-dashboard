class APIError extends Error {
  public response: Response;
  public body: any;

  constructor(response: Response, body: any) {
    super();

    this.name = 'APIError';
    this.response = response;
    this.body = body;
    this.message = body?.error || `${response.status} - ${response.statusText}`;
  }
}

export default APIError;
