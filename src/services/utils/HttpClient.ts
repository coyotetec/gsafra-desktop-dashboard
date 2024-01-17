import APIError from '../../errors/APIError';

interface Options {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: object;
  headers?: object;
}

interface ReqOptions {
  body?: object;
  headers?: object;
}

class HttpClient {
  private baseURL: string;
  private defaultHeaders: object = {};

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setDefaultHeaders(headers: object) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };
  }

  get(path: string, options?: ReqOptions) {
    return this.makeRequest(path, {
      method: 'GET',
      headers: options?.headers,
    });
  }

  post(path: string, options?: ReqOptions) {
    return this.makeRequest(path, {
      method: 'POST',
      body: options?.body,
      headers: options?.headers,
    });
  }

  put(path: string, options?: ReqOptions) {
    return this.makeRequest(path, {
      method: 'PUT',
      body: options?.body,
      headers: options?.headers,
    });
  }

  delete(path: string, options?: ReqOptions) {
    return this.makeRequest(path, {
      method: 'DELETE',
      headers: options?.headers,
    });
  }

  async makeRequest(path: string, options: Options) {
    const headers = new Headers();

    if (options.body) {
      headers.append('Content-Type', 'application/json');
    }

    if (options.headers) {
      Object.entries(options.headers).forEach(([name, value]) => {
        headers.append(name, value);
      });
    }

    if (Object.keys(this.defaultHeaders).length > 0) {
      Object.entries(this.defaultHeaders).forEach(([name, value]) => {
        headers.append(name, value);
      });
    }

    const response = await fetch(`${this.baseURL}${path}`, {
      method: options.method,
      body: JSON.stringify(options.body),
      headers,
    });
    const contentType = response.headers.get('Content-Type');
    let reponseBody = null;

    if (contentType?.includes('application/json')) {
      reponseBody = await response.json();
    }

    if (response.ok) {
      return reponseBody;
    }

    throw new APIError(response, reponseBody);
  }
}

export default HttpClient;
