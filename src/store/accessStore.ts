/**
 * Access Store — localStorage-based access control utilities
 *
 * Manages student access requests, approved phone numbers,
 * and login sessions using localStorage. This is a temporary
 * store for the educational prototype — production would use
 * a real database.
 */

const ACCESS_REQUESTS_KEY = "hh_access_requests";
const APPROVED_PHONES_KEY = "hh_approved_phones";
const LOGGED_IN_PHONE_KEY = "hh_logged_in_phone";

// ─── Types ────────────────────────────────────────────────────────

export interface AccessRequest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  paymentMethod: "bank-islami" | "easypaisa" | "paypal";
  transactionId: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

// ─── Access Requests ──────────────────────────────────────────────

export function getAccessRequests(): AccessRequest[] {
  try {
    const raw = localStorage.getItem(ACCESS_REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAccessRequest(request: AccessRequest): void {
  const requests = getAccessRequests();
  requests.push(request);
  localStorage.setItem(ACCESS_REQUESTS_KEY, JSON.stringify(requests));
}

export function updateRequestStatus(
  id: string,
  status: "approved" | "rejected"
): void {
  const requests = getAccessRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx >= 0) {
    requests[idx].status = status;
    localStorage.setItem(ACCESS_REQUESTS_KEY, JSON.stringify(requests));

    // If approved, add phone to approved list
    if (status === "approved") {
      addApprovedPhone(requests[idx].phone);
    }
  }
}

// ─── Approved Phones ──────────────────────────────────────────────

export function getApprovedPhones(): string[] {
  try {
    const raw = localStorage.getItem(APPROVED_PHONES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addApprovedPhone(phone: string): void {
  const phones = getApprovedPhones();
  if (!phones.includes(phone)) {
    phones.push(phone);
    localStorage.setItem(APPROVED_PHONES_KEY, JSON.stringify(phones));
  }
}

export function isPhoneApproved(phone: string): boolean {
  return getApprovedPhones().includes(phone);
}

// ─── Login Session ────────────────────────────────────────────────

export function getLoggedInPhone(): string | null {
  return localStorage.getItem(LOGGED_IN_PHONE_KEY);
}

export function setLoggedInPhone(phone: string): void {
  localStorage.setItem(LOGGED_IN_PHONE_KEY, phone);
}

export function logout(): void {
  localStorage.removeItem(LOGGED_IN_PHONE_KEY);
}

export function isLoggedIn(): boolean {
  const phone = getLoggedInPhone();
  return phone !== null && isPhoneApproved(phone);
}