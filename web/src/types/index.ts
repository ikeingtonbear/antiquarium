/**
 * Sharkophagus Web UI — TypeScript Entity Definitions
 *
 * Data models and API interfaces aligned with the backend
 * OpenAPI schema and the Sharkophagus data-model.md specification.
 */

/* ──────────────────────────────────────────────────────
   1. API ENTITIES
   ────────────────────────────────────────────────────── */

/**
 * Represents an active or closed packet analysis session.
 * Maps to the backend `/sessions` response schema with
 * additional client-side metadata for file upload tracking.
 */
export interface CaptureSession {
  /** UUID assigned by the backend */
  id: string;
  /** Current session lifecycle status */
  status: "active" | "closed";
  /** ISO 8601 timestamp of session creation */
  createdAt: string;

  /* ── Client-derived fields ── */

  /** Original name of the uploaded file */
  fileName: string;
  /** File size in bytes */
  fileSize: number;
}

/**
 * Packet capture analysis results returned from the
 * backend `GET /sessions/{id}/stats` endpoint.
 */
export interface CaptureStatistics {
  /** Total number of packets/frames */
  frames: number;
  /** Duration of capture in seconds */
  duration: number;
  /** File size in bytes */
  bytes?: number;
  /** Filename of the loaded PCAP */
  filename?: string;
}

/**
 * Capture analysis results returned from the
 * backend `GET /sessions/{id}/analyse` endpoint.
 */
export interface CaptureAnalysis {
  /** Total number of frames analysed */
  frames: number;
  /** List of protocols present in the capture */
  protocols: string[];
  /** Start time of the capture (epoch timestamp in seconds) */
  first: number;
  /** End time of the capture (epoch timestamp in seconds) */
  last: number;
}

export interface InfoColumn {
  name: string;
  format: string;
}

export interface InfoItem {
  name: string;
  tap: string;
}

export interface InfoType {
  name: string;
  description: string;
}

export interface SystemInfo {
  version: string;
  columns: InfoColumn[];
  stats: InfoItem[];
  ftypes: string[];
  capture_types: InfoType[];
  encap_types: InfoType[];
  nstat: InfoItem[];
  convs: InfoItem[];
  seqa: InfoItem[];
  taps: InfoItem[];
  eo: InfoItem[];
  srt: InfoItem[];
  rtd: InfoItem[];
  follow: InfoItem[];
}

/**
 * Standard shape for error responses returned from the backend API.
 */
export interface ErrorPayload {
  /** Machine-readable error code (e.g. "BAD_REQUEST", "SHARKD_ERROR") */
  code: string;
  /** Human-readable explanation of the error */
  message: string;
}

/* ──────────────────────────────────────────────────────
   2. CLIENT-SIDE STATE
   ────────────────────────────────────────────────────── */

/**
 * Application lifecycle states for the single-page dashboard.
 *
 * @see data-model.md §2 — Client-Side Lifecycle & State Machine
 */
export type AppState = "idle" | "uploading" | "ready" | "deleting";

/* ──────────────────────────────────────────────────────
   3. API CLIENT INTERFACE
   ────────────────────────────────────────────────────── */

/**
 * Contract for the API client connecting to the Sharkophagus backend.
 *
 * @see contracts/api-client.md §3 — Frontend client implementation interface
 */
export interface ApiClient {
  /**
   * Uploads a packet capture file and returns the active session info.
   * @param file - The file to upload (PCAP, PCAPNG, CAP, DMP)
   * @param onProgress - Callback for tracking upload percentage (0–100)
   */
  createSession(
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<CaptureSession>;

  /**
   * Fetches analysis statistics for an active session.
   * @param sessionId - The UUID of the session
   */
  getStatistics(sessionId: string): Promise<CaptureStatistics>;

  /**
   * Fetches deep analysis results for an active session.
   * @param sessionId - The UUID of the session
   */
  getAnalysis(sessionId: string): Promise<CaptureAnalysis>;

  /**
   * Closes and cleans up the active session.
   * @param sessionId - The UUID of the session
   */
  closeSession(sessionId: string): Promise<void>;

  /**
   * Fetches general system info and capabilities from the backend.
   */
  getSystemInfo(): Promise<SystemInfo>;
}

/* ──────────────────────────────────────────────────────
   4. VALIDATION CONSTANTS
   ────────────────────────────────────────────────────── */

/**
 * Allowed file extensions for upload (case-insensitive).
 * @see data-model.md §3 — Validation Rules
 */
export const ALLOWED_EXTENSIONS = [".pcap", ".pcapng", ".cap", ".dmp"] as const;

/**
 * Regular expression matching allowed capture file extensions.
 */
export const EXTENSION_REGEX = /^.*\.(pcap|pcapng|cap|dmp)$/i;

/**
 * Maximum file size in bytes (10 MB).
 */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Maximum file size label for display.
 */
export const MAX_FILE_SIZE_LABEL = "10 MB";
