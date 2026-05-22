/**
 * Lightweight auth token helper used by Knowledge Base / Book Details / Guidelines pages.
 * Retrieves a bearer token from sessionStorage (set during login / SSO flow).
 */
export function getKbAuthToken(): string {
  try {
    return (
      sessionStorage.getItem("kbAuthToken") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      ""
    );
  } catch {
    return "";
  }
}

export function setKbAuthToken(token: string) {
  try {
    sessionStorage.setItem("kbAuthToken", token);
  } catch {
    /* ignore */
  }
}

export function clearKbAuthToken() {
  try {
    sessionStorage.removeItem("kbAuthToken");
  } catch {
    /* ignore */
  }
}