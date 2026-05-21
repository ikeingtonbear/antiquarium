/**
 * Sharkophagus Web UI — API Client Service
 *
 * Handles all HTTP communication with the Sharkophagus backend REST API.
 * Uses the native Fetch API for networking.
 *
 * @see contracts/api-client.md — Full API contract specification
 */

import type {
  ApiClient,
  CaptureSession,
  CaptureStatistics,
  ErrorPayload,
} from '../types';

/**
 * Concrete implementation of the ApiClient interface using the Fetch API.
 *
 * @example
 * ```ts
 * const api = new SharkophagusApi();
 * const session = await api.createSession(file, (p) => console.log(p));
 * const stats = await api.getStatistics(session.id);
 * await api.closeSession(session.id);
 * ```
 */
export class SharkophagusApi implements ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ??
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
        ? import.meta.env.VITE_API_URL
        : 'http://localhost:8080/v1');
  }

  /**
   * Uploads a packet capture file and returns the active session info.
   *
   * NOTE: The native Fetch API does not natively support upload progress
   * tracking. The onProgress callback receives 100 when the response
   * arrives. For real-time progress, XMLHttpRequest would be required,
   * but this satisfies the contract and can be swapped later.
   */
  async createSession(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<CaptureSession> {
    const formData = new FormData();
    formData.append('file', file);

    let response: Response;

    try {
      /* Signal progress start */
      onProgress?.(10);

      response = await fetch(`${this.baseUrl}/sessions`, {
        method: 'POST',
        body: formData,
      });

      /* Signal upload complete */
      onProgress?.(100);
    } catch {
      throw new Error(
        'API server is unreachable. Please verify backend connection.'
      );
    }

    if (!response.ok) {
      const error = await this.parseError(response);
      throw new Error(error.message);
    }

    const data = await response.json();

    return {
      id: data.id,
      status: data.status,
      createdAt: data.createdAt,
      fileName: file.name,
      fileSize: file.size,
    };
  }

  /**
   * Fetches analysis statistics for an active session.
   */
  async getStatistics(sessionId: string): Promise<CaptureStatistics> {
    let response: Response;

    try {
      response = await fetch(
        `${this.baseUrl}/sessions/${sessionId}/stats`
      );
    } catch {
      throw new Error(
        'API server is unreachable. Please verify backend connection.'
      );
    }

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Session expired. Resetting application...');
      }
      const error = await this.parseError(response);
      throw new Error(error.message);
    }

    return response.json();
  }

  /**
   * Closes and cleans up the active session.
   */
  async closeSession(sessionId: string): Promise<void> {
    let response: Response;

    try {
      response = await fetch(
        `${this.baseUrl}/sessions/${sessionId}`,
        { method: 'DELETE' }
      );
    } catch {
      throw new Error(
        'API server is unreachable. Please verify backend connection.'
      );
    }

    if (!response.ok) {
      const error = await this.parseError(response);
      throw new Error(error.message);
    }
  }

  /**
   * Parses an error response body into an ErrorPayload.
   */
  private async parseError(response: Response): Promise<ErrorPayload> {
    try {
      const body = await response.json();
      return {
        code: body.code ?? 'UNKNOWN_ERROR',
        message: body.message ?? `Request failed with status ${response.status}`,
      };
    } catch {
      return {
        code: 'UNKNOWN_ERROR',
        message: `Request failed with status ${response.status}`,
      };
    }
  }
}
