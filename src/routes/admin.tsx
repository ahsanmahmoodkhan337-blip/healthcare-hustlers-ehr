/**
 * AdminPage — Admin Panel for Access Request Management
 *
 * Password-gated admin dashboard where administrators can:
 * - View all pending access requests
 * - Approve or reject requests
 * - See approved phone numbers
 * - Simple authentication with "admin123" password
 *
 * Inspiration: Epic security / admin workflow
 */

import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  LogOut,
  Key,
  Lock,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import {
  getAccessRequests,
  updateRequestStatus,
  getApprovedPhones,
  type AccessRequest,
} from "../store/accessStore";
import {
  getAllPins,
  setStagePin,
  resetAllPins,
  getStagePin,
  type StagePinMap,
} from "../store/pinStore";
import type { Role } from "../store/pipelineStore";
import { WhatsAppFloat } from "../components/WhatsAppFloat";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [approvedPhones, setApprovedPhones] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pins, setPins] = useState<StagePinMap>({ scribe: "1111", coder: "2222", biller: "3333", "prior-auth": "4444", "ar-voice": "5555" });
  const [editPinRole, setEditPinRole] = useState<Role | null>(null);
  const [editPinValue, setEditPinValue] = useState("");
  const [showPins, setShowPins] = useState(false);
  const [pinSaved, setPinSaved] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    if (authenticated) {
      setRequests(getAccessRequests());
      setApprovedPhones(getApprovedPhones());
      setPins(getAllPins());
      setEditPinRole(null);
      setPinSaved(false);
    }
  }, [authenticated, refreshKey]);

  const handleLogin = () => {
    if (password === "Khankhail@1122") {
      setAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Invalid admin password");
    }
  };

  const handleApprove = (id: string) => {
    updateRequestStatus(id, "approved");
    setRefreshKey((k) => k + 1);
  };

  const handleReject = (id: string) => {
    updateRequestStatus(id, "rejected");
    setRefreshKey((k) => k + 1);
  };

  const handleSavePin = (role: Role) => {
    if (editPinValue.length >= 4) {
      updateStagePin(role, editPinValue);
      setPins(getAllPins());
      setEditPinRole(null);
      setPinSaved(true);
      setTimeout(() => setPinSaved(false), 2000);
    }
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-900 p-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
          <div className="mb-6 text-center">
            <Shield className="mx-auto mb-3 h-10 w-10 text-sky-400" />
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-slate-400">Enter admin password to continue</p>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter admin password"
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-sm text-white placeholder-slate-400 outline-none focus:border-sky-500"
            />
            {passwordError && (
              <p className="text-xs text-red-400">{passwordError}</p>
            )}
            <button
              onClick={handleLogin}
              className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-medium text-white hover:bg-sky-600"
            >
              Sign In
            </button>
          </div>
          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-slate-500 underline hover:text-slate-300">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedRequests = requests.filter((r) => r.status === "approved");
  const rejectedRequests = requests.filter((r) => r.status === "rejected");

  return (
    <div className="min-h-dvh bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-sky-400" />
          <h1 className="text-sm font-bold text-white">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="flex items-center gap-1 rounded-lg bg-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-600"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
          <button
            onClick={() => setAuthenticated(false)}
            className="flex items-center gap-1 rounded-lg bg-red-900/50 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900"
          >
            <LogOut className="h-3 w-3" />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl p-4 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-xs text-slate-400">Pending</p>
            <p className="text-2xl font-bold text-amber-400">{pendingRequests.length}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-xs text-slate-400">Approved</p>
            <p className="text-2xl font-bold text-green-400">{approvedRequests.length}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-xs text-slate-400">Approved Phones</p>
            <p className="text-2xl font-bold text-sky-400">{approvedPhones.length}</p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-700 px-4 py-3">
            <Clock className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Pending Requests</h2>
            <span className="rounded-full bg-amber-900/50 px-2 py-0.5 text-[10px] font-medium text-amber-300">
              {pendingRequests.length}
            </span>
          </div>
          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">No pending requests</div>
          ) : (
            <div className="divide-y divide-slate-700">
              {pendingRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{req.fullName}</p>
                    <p className="text-xs text-slate-400">
                      {req.phone} | {req.paymentMethod} | ID: {req.transactionId}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(req.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-500"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
                    >
                      <XCircle className="h-3 w-3" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Approved */}
          <div className="rounded-xl border border-slate-700 bg-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-700 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <h2 className="text-sm font-semibold text-white">Approved</h2>
            </div>
            {approvedRequests.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">None</div>
            ) : (
              <div className="divide-y divide-slate-700">
                {approvedRequests.slice(0, 5).map((req) => (
                  <div key={req.id} className="px-4 py-2">
                    <p className="text-xs text-white">{req.fullName}</p>
                    <p className="text-[10px] text-slate-400">{req.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Phone Numbers */}
          <div className="rounded-xl border border-slate-700 bg-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-700 px-4 py-3">
              <Shield className="h-4 w-4 text-sky-400" />
              <h2 className="text-sm font-semibold text-white">Active Logins</h2>
            </div>
            {approvedPhones.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">No active logins</div>
            ) : (
              <div className="divide-y divide-slate-700">
                {approvedPhones.map((phone) => (
                  <div key={phone} className="px-4 py-2">
                    <p className="text-xs text-white">{phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── PIN Management ─── */}
        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800">
          <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Stage PIN Management</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPins(!showPins)}
                className="flex items-center gap-1 rounded-lg bg-slate-700 px-2.5 py-1 text-[10px] text-slate-300 hover:bg-slate-600"
              >
                {showPins ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showPins ? "Hide" : "Show"}
              </button>
              <button
                onClick={() => {
                  resetAllPins();
                  setPins(getAllPins());
                  setPinSaved(true);
                  setTimeout(() => setPinSaved(false), 2000);
                }}
                className="flex items-center gap-1 rounded-lg bg-red-900/50 px-2.5 py-1 text-[10px] text-red-300 hover:bg-red-800"
              >
                Reset All to Defaults
              </button>
              {pinSaved && (
                <span className="text-[10px] text-green-400">PIN saved!</span>
              )}
            </div>
          </div>
          <div className="divide-y divide-slate-700">
            {(Object.entries(pins) as [Role, string][]).map(([role, pin]) => (
              <div key={role} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-sm text-slate-200">
                    {role === "prior-auth" ? "Prior Auth" :
                     role === "ar-voice" ? "AR Voice" :
                     role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {editPinRole === role ? (
                    <>
                      <input
                        type="text"
                        value={editPinValue}
                        onChange={(e) => setEditPinValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        onKeyDown={(e) => e.key === "Enter" && handleSavePin(role)}
                        className="w-20 rounded border border-sky-600 bg-slate-700 px-2 py-1 text-center text-xs text-white outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSavePin(role)}
                        className="flex items-center gap-1 rounded bg-green-600 px-2 py-1 text-[10px] font-medium text-white hover:bg-green-500"
                      >
                        <Save className="h-3 w-3" /> Save
                      </button>
                      <button
                        onClick={() => setEditPinRole(null)}
                        className="rounded bg-slate-600 px-2 py-1 text-[10px] text-slate-300 hover:bg-slate-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className={`font-mono text-sm ${showPins ? "text-sky-300" : "text-slate-500"}`}>
                        {showPins ? pin : "••••"}
                      </span>
                      <button
                        onClick={() => {
                          setEditPinRole(role);
                          setEditPinValue(pin);
                        }}
                        className="rounded bg-slate-700 px-2 py-1 text-[10px] text-slate-400 hover:bg-slate-600 hover:text-white"
                      >
                        Change
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-500 underline hover:text-slate-300">
            Back to home
          </Link>
        </div>
      </div>

      <WhatsAppFloat />
    </div>
  );
}