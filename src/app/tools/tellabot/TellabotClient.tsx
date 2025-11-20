"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "waiting" | "message" | "expired";
type LocationMode = "none" | "state" | "areacode" | "mdn";

interface TellabotRequest {
  id: number;
  mdn: string;
  service: string;
  status: string;
  state?: string;
  markup: number;
  price: number;
  carrier?: string;
  tillExpiration: number;
  createdAt: number;
  expiresAt: number;
  remainingSeconds: number;
  mode: Mode;
  smsText?: string;
}

interface StoredTellabotRequest {
  id: number;
  mdn: string;
  service: string;
  status: string;
  state?: string;
  markup: number;
  price: number;
  carrier?: string;
  tillExpiration: number;
  createdAt: number;
  expiresAt: number;
  mode: Mode;
  smsText?: string;
}

interface TellabotService {
  name: string;
  price?: string; // one-time price only for UI
  ltr_price?: string;
  ltr_short_price?: string;
  available?: string;
  ltr_available?: string;
  recommended_markup?: string;
}

const STORAGE_USERNAME_KEY = "tellabot_username";
const STORAGE_APIKEY_KEY = "tellabot_apiKey";
const STORAGE_REQUESTS_KEY = "tellabot_requests";
const STORAGE_REMEMBER_KEY = "tellabot_remember";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

type FlashType = "success" | "error" | "info";

async function callTellabotApi(params: Record<string, string>) {
  const res = await fetch("/api/tools/tellabot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const json = await res.json();
  return json as {
    status: "ok" | "error";
    message: any;
  };
}

function formatSeconds(seconds: number): string {
  if (seconds <= 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export function TellabotClient() {
  const [username, setUsername] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [services, setServices] = useState<TellabotService[]>([]);
  const [serviceName, setServiceName] = useState("");

  const [locationMode, setLocationMode] = useState<LocationMode>("none");
  const [stateCode, setStateCode] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [mdn, setMdn] = useState("");

  const [isRequesting, setIsRequesting] = useState(false);
  const [currentRequests, setCurrentRequests] = useState<TellabotRequest[]>([]);
  const [unknownResponse, setUnknownResponse] = useState<string | null>(null);

  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [flashType, setFlashType] = useState<FlashType>("info");

  const [isCancellingId, setIsCancellingId] = useState<number | null>(null);
  const [isReactivatingId, setIsReactivatingId] = useState<number | null>(null);

  const hasWaitingRequests = useMemo(
    () => currentRequests.some((r) => r.mode === "waiting"),
    [currentRequests]
  );

  const selectedService = useMemo(
    () => services.find((s) => s.name === serviceName),
    [services, serviceName]
  );

  // Load credentials and stored requests on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedRemember = window.localStorage.getItem(STORAGE_REMEMBER_KEY);
    if (savedRemember === "false") {
      setRememberMe(false);
    }

    const savedUser = window.localStorage.getItem(STORAGE_USERNAME_KEY);
    const savedKey = window.localStorage.getItem(STORAGE_APIKEY_KEY);

    if (savedUser) setUsername(savedUser);
    if (savedKey) setApiKey(savedKey);

    // Load stored requests
    const stored = window.localStorage.getItem(STORAGE_REQUESTS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredTellabotRequest[];
        const now = Date.now();

        const restored: TellabotRequest[] = parsed.map((r) => {
          const remainingSeconds = Math.max(
            0,
            Math.floor((r.expiresAt - now) / 1000)
          );

          let mode: Mode = r.mode;
          if (remainingSeconds <= 0 && r.mode === "waiting") {
            mode = "expired";
          }

          return {
            ...r,
            remainingSeconds,
            mode,
          };
        });

        setCurrentRequests(restored);
      } catch {
        // ignore parse errors
      }
    }

    // Auto-login only if we have saved credentials
    if (savedUser && savedKey) {
      void performLogin(savedUser, savedKey, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist requests to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return;

    const toStore: StoredTellabotRequest[] = currentRequests.map((r) => ({
      id: r.id,
      mdn: r.mdn,
      service: r.service,
      status: r.status,
      state: r.state,
      markup: r.markup,
      price: r.price,
      carrier: r.carrier,
      tillExpiration: r.tillExpiration,
      createdAt: r.createdAt,
      expiresAt: r.expiresAt,
      mode: r.mode,
      smsText: r.smsText,
    }));

    window.localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(toStore));
  }, [currentRequests]);

  // Countdown interval (1 second)
  useEffect(() => {
    if (!hasWaitingRequests) return;

    const interval = setInterval(() => {
      setCurrentRequests((prev) =>
        prev.map((r) => {
          if (r.mode !== "waiting") return r;
          const next = r.remainingSeconds - 1;
          return {
            ...r,
            remainingSeconds: next <= 0 ? 0 : next,
            mode: next <= 0 ? "expired" : "waiting",
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [hasWaitingRequests]);

  // SMS polling every 10 seconds
  useEffect(() => {
    if (!hasWaitingRequests || !isLoggedIn) return;

    const interval = setInterval(() => {
      setCurrentRequests((prev) => {
        const waiting = prev.filter((r) => r.mode === "waiting");
        waiting.forEach((req) => {
          void pollForSms(req);
        });
        return prev;
      });
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasWaitingRequests, isLoggedIn]);

  // Flash auto-hide
  useEffect(() => {
    if (!flashMessage) return;
    const timeoutMs =
      flashType === "error" ? 9000 : 6000; // error thoda zyada time

    const id = setTimeout(() => {
      setFlashMessage(null);
    }, timeoutMs);

    return () => clearTimeout(id);
  }, [flashMessage, flashType]);

  async function performLogin(
    userValue: string,
    apiKeyValue: string,
    silent = false
  ) {
    setIsLoggingIn(true);
    if (!silent) {
      setLoginError("");
      setFlashMessage(null);
    }

    try {
      const resp = await callTellabotApi({
        cmd: "balance",
        user: userValue,
        api_key: apiKeyValue,
      });

      if (resp.status === "error") {
        if (!silent) {
          setLoginError("Username or API key is invalid.");
          setFlashMessage("Login failed: Username or API key is invalid.");
          setFlashType("error");
        }
        setIsLoggedIn(false);
        setBalance(null);
        return;
      }

      const bal = String(resp.message ?? "0.00");

      setIsLoggedIn(true);
      setBalance(bal);
      setUsername(userValue);
      setApiKey(apiKeyValue);

      if (typeof window !== "undefined") {
        if (rememberMe) {
          window.localStorage.setItem(STORAGE_USERNAME_KEY, userValue);
          window.localStorage.setItem(STORAGE_APIKEY_KEY, apiKeyValue);
          window.localStorage.setItem(
            STORAGE_REMEMBER_KEY,
            rememberMe ? "true" : "false"
          );
        } else {
          window.localStorage.removeItem(STORAGE_USERNAME_KEY);
          window.localStorage.removeItem(STORAGE_APIKEY_KEY);
          window.localStorage.setItem(STORAGE_REMEMBER_KEY, "false");
        }
      }

      if (!silent) {
        setFlashMessage("Logged in successfully.");
        setFlashType("success");
      }

      // Fetch services list (with prices)
      try {
        const svcResp = await callTellabotApi({
          cmd: "list_services",
          user: userValue,
          api_key: apiKeyValue,
        });

        if (svcResp.status === "ok" && Array.isArray(svcResp.message)) {
          const parsed: TellabotService[] = svcResp.message
            .map((s: any) => ({
              name: String(s.name ?? "").trim(),
              price: s.price ? String(s.price) : undefined,
              ltr_price: s.ltr_price ? String(s.ltr_price) : undefined,
              ltr_short_price: s.ltr_short_price
                ? String(s.ltr_short_price)
                : undefined,
              available: s.available ? String(s.available) : undefined,
              ltr_available: s.ltr_available
                ? String(s.ltr_available)
                : undefined,
              recommended_markup: s.recommended_markup
                ? String(s.recommended_markup)
                : undefined,
            }))
            .filter((s) => s.name);

          const uniqueByName = Array.from(
            new Map(parsed.map((s) => [s.name, s])).values()
          ).sort((a, b) => a.name.localeCompare(b.name));

          setServices(uniqueByName);
          if (!serviceName && uniqueByName.length > 0) {
            setServiceName(uniqueByName[0].name);
          }
        }
      } catch {
        // If list_services fails, tool still works with manual service input
      }
    } catch {
      if (!silent) {
        setLoginError("Failed to connect to Tellabot.");
        setFlashMessage("Failed to connect to Tellabot.");
        setFlashType("error");
      }
      setIsLoggedIn(false);
      setBalance(null);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !apiKey) {
      setLoginError("Username and API key are required.");
      return;
    }
    await performLogin(username.trim(), apiKey.trim());
  }

  async function handleGetNumber(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn || !username || !apiKey) {
      setFlashMessage("Please login with your Tellabot credentials first.");
      setFlashType("error");
      return;
    }
    if (!serviceName) {
      setFlashMessage("Please select a service.");
      setFlashType("error");
      return;
    }

    // Strong validation (per filter)
    if (locationMode === "state") {
      if (!stateCode) {
        setFlashMessage("Please select a state.");
        setFlashType("error");
        return;
      }
    }

    if (locationMode === "areacode") {
      if (!areaCode || areaCode.length !== 3) {
        setFlashMessage("Area code must be exactly 3 digits (201–999).");
        setFlashType("error");
        return;
      }
      const acNum = Number(areaCode);
      if (!Number.isFinite(acNum) || acNum < 201 || acNum > 999) {
        setFlashMessage("Area code must be between 201 and 999.");
        setFlashType("error");
        return;
      }
    }

    if (locationMode === "mdn") {
      if (!/^\d{11}$/.test(mdn)) {
        setFlashMessage("MDN must be exactly 11 digits.");
        setFlashType("error");
        return;
      }
    }

    setIsRequesting(true);
    setUnknownResponse(null);

    const params: Record<string, string> = {
      cmd: "request",
      user: username,
      api_key: apiKey,
      service: serviceName,
    };

    if (locationMode === "state" && stateCode) {
      params.state = stateCode;
    } else if (locationMode === "areacode" && areaCode) {
      params.areacode = areaCode;
    } else if (locationMode === "mdn" && mdn) {
      params.mdn = mdn;
    }

    try {
      const resp = await callTellabotApi(params);

      if (resp.status === "error") {
        setFlashMessage(String(resp.message ?? "Request failed."));
        setFlashType("error");
        return;
      }

      // Expect array in message
      if (!Array.isArray(resp.message) || resp.message.length === 0) {
        setUnknownResponse(JSON.stringify(resp.message));
        setFlashMessage("Request succeeded but returned no numbers.");
        setFlashType("info");
        return;
      }

      const item = resp.message[0];

      const id = Number(item.id);
      const mdnValue = String(item.mdn ?? "");
      const svc = String(item.service ?? serviceName);
      const st = item.state ? String(item.state) : "";
      const markup = Number(item.markup ?? 0);
      const price = Number(item.price ?? 0);
      const carrier = item.carrier ? String(item.carrier) : "";
      const tillExp = Number(item.till_expiration ?? 0);

      const now = Date.now();
      const expiresAt = now + tillExp * 1000;

      const request: TellabotRequest = {
        id,
        mdn: mdnValue,
        service: svc,
        status: String(item.status ?? "Reserved"),
        state: st || undefined,
        markup: Number.isFinite(markup) ? markup : 0,
        price: Number.isFinite(price) ? price : 0,
        carrier: carrier || undefined,
        tillExpiration: tillExp,
        createdAt: now,
        expiresAt,
        remainingSeconds: tillExp,
        mode: tillExp > 0 ? "waiting" : "expired",
      };

      setCurrentRequests((prev) => [request, ...prev]);
      setFlashMessage("Number reserved successfully.");
      setFlashType("success");
    } catch {
      setFlashMessage("Failed to request number from Tellabot.");
      setFlashType("error");
    } finally {
      setIsRequesting(false);
    }
  }

  async function pollForSms(req: TellabotRequest) {
    try {
      const resp = await callTellabotApi({
        cmd: "read_sms",
        user: username,
        api_key: apiKey,
        service: req.service,
        mdn: req.mdn,
      });

      if (resp.status === "error") {
        // "No messages" etc — ignore silently
        return;
      }

      if (!Array.isArray(resp.message) || resp.message.length === 0) return;

      const msg = resp.message[0];
      const reply: string = String(msg.reply ?? "");
      const pin: string = msg.pin ? String(msg.pin) : "";

      const text =
        pin && reply && reply.includes(pin)
          ? `${reply} (PIN: ${pin})`
          : reply || pin || "SMS received.";

      setCurrentRequests((prev) =>
        prev.map((r) =>
          r.id === req.id
            ? {
                ...r,
                mode: "message",
                remainingSeconds: r.remainingSeconds,
                smsText: text,
              }
            : r
        )
      );

      setFlashMessage("SMS received for your Tellabot number.");
      setFlashType("success");
    } catch {
      // Ignore polling errors
    }
  }

  async function handleCancel(request: TellabotRequest) {
    if (!isLoggedIn) return;

    setIsCancellingId(request.id);
    try {
      const resp = await callTellabotApi({
        cmd: "reject",
        user: username,
        api_key: apiKey,
        id: String(request.id),
      });

      if (resp.status === "error") {
        setFlashMessage(String(resp.message ?? "Failed to cancel number."));
        setFlashType("error");
        return;
      }

      setCurrentRequests((prev) =>
        prev.map((r) =>
          r.id === request.id
            ? {
                ...r,
                mode: "expired",
                remainingSeconds: 0,
                smsText: "Number cancelled.",
              }
            : r
        )
      );

      setFlashMessage("Number cancelled successfully.");
      setFlashType("success");
    } catch {
      setFlashMessage("Failed to cancel number.");
      setFlashType("error");
    } finally {
      setIsCancellingId(null);
    }
  }

  async function handleReactivate(request: TellabotRequest) {
    if (!isLoggedIn) return;

    setIsReactivatingId(request.id);
    try {
      const resp = await callTellabotApi({
        cmd: "request",
        user: username,
        api_key: apiKey,
        service: request.service,
        mdn: request.mdn,
      });

      if (resp.status === "error") {
        setFlashMessage(String(resp.message ?? "Failed to reactivate number."));
        setFlashType("error");
        return;
      }

      if (!Array.isArray(resp.message) || resp.message.length === 0) {
        setUnknownResponse(JSON.stringify(resp.message));
        setFlashMessage("Reactivation returned no data.");
        setFlashType("info");
        return;
      }

      const item = resp.message[0];
      const id = Number(item.id ?? request.id);
      const mdnValue = String(item.mdn ?? request.mdn);
      const tillExp = Number(item.till_expiration ?? 0);
      const now = Date.now();
      const expiresAt = now + tillExp * 1000;

      const newReq: TellabotRequest = {
        id,
        mdn: mdnValue,
        service: request.service,
        status: String(item.status ?? "Reserved"),
        state: item.state ? String(item.state) : request.state,
        markup: Number(item.markup ?? request.markup ?? 0),
        price: Number(item.price ?? request.price ?? 0),
        carrier: item.carrier
          ? String(item.carrier)
          : request.carrier ?? undefined,
        tillExpiration: tillExp,
        createdAt: now,
        expiresAt,
        remainingSeconds: tillExp,
        mode: tillExp > 0 ? "waiting" : "expired",
      };

      setCurrentRequests((prev) => [newReq, ...prev]);
      setFlashMessage("Number reactivated successfully.");
      setFlashType("success");
    } catch {
      setFlashMessage("Failed to reactivate number.");
      setFlashType("error");
    } finally {
      setIsReactivatingId(null);
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setBalance(null);
    setServices([]);
    setServiceName("");
    setLocationMode("none");
    setStateCode("");
    setAreaCode("");
    setMdn("");
    setCurrentRequests([]);
    setUnknownResponse(null);
    setFlashMessage(null);
    setFlashType("info");
    setRememberMe(false);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_USERNAME_KEY);
      window.localStorage.removeItem(STORAGE_APIKEY_KEY);
      window.localStorage.removeItem(STORAGE_REQUESTS_KEY);
      window.localStorage.removeItem(STORAGE_REMEMBER_KEY);
    }
  }

  const canSubmitRequest = useMemo(() => {
    if (!isLoggedIn) return false;
    if (!serviceName) return false;

    if (locationMode === "state") {
      if (!stateCode) return false;
    } else if (locationMode === "areacode") {
      if (!areaCode || areaCode.length !== 3) return false;
    } else if (locationMode === "mdn") {
      if (!mdn || mdn.length !== 11) return false;
    }

    return true;
  }, [isLoggedIn, serviceName, locationMode, stateCode, areaCode, mdn]);

  // Helper to show service price text - only OTP price
  function getServiceLabel(service: TellabotService): string {
    if (service.price) {
      return `${service.name} – $${service.price}`;
    }
    return service.name;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Local header */}
      <header className="border-b border-slate-200 bg-[#112244] text-slate-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-lg font-semibold">
              Tellabot Integration Tool
            </h1>
            <p className="text-xs text-slate-200/80">
              Manage Tellabot virtual numbers, requests and SMS codes.
            </p>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {balance !== null && (
                <div className="rounded-full bg-slate-900/40 px-4 py-1 text-xs sm:text-sm">
                  Balance: <span className="font-semibold">{balance}$</span>
                </div>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-800 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Flash message */}
        {flashMessage && (
          <div
            className={`rounded-lg border px-4 py-2 text-sm ${
              flashType === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : flashType === "error"
                ? "border-red-300 bg-red-50 text-red-800"
                : "border-sky-300 bg-sky-50 text-sky-800"
            }`}
          >
            {flashMessage}
          </div>
        )}

        {/* -------- LOGIN VIEW -------- */}
        {!isLoggedIn && (
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold sm:text-lg">
                Tellabot Account Login
              </h2>
              <p className="text-xs text-slate-500 sm:text-sm">
                Enter your Tellabot username and API key to fetch balance and
                open your dashboard.
              </p>
            </div>

            <form
              onSubmit={handleLoginSubmit}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="sm:col-span-1">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Tellabot Username or Email
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  API Key
                </label>
                <input
                  type="password"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="flex items-center gap-2 sm:col-span-1">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-xs font-medium text-slate-700"
                >
                  Remember credentials in this browser
                </label>
              </div>

              <div className="flex items-center justify-end sm:col-span-1">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingIn ? "Checking..." : "Login & Fetch Balance"}
                </button>
              </div>
            </form>

            {loginError && (
              <p className="mt-3 text-xs font-medium text-red-600">
                {loginError}
              </p>
            )}
          </section>
        )}

        {/* -------- DASHBOARD VIEW -------- */}
        {isLoggedIn && (
          <>
            {/* Request Form */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-3 text-base font-semibold sm:text-lg">
                Request a One-Time MDN
              </h2>
              <p className="mb-2 text-xs text-slate-500 sm:text-sm">
                Select a service and optionally filter by state, area code, or a
                specific MDN. Tellabot will reserve a number if available.
              </p>
              {selectedService && (
                <p className="mb-4 text-xs text-slate-600">
                  <span className="font-semibold">Selected service price:</span>{" "}
                  {selectedService.price
                    ? `$${selectedService.price} (one-time)`
                    : "One-time price not available"}
                </p>
              )}

              <form onSubmit={handleGetNumber} className="space-y-4">
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <tbody>
                      {/* Service row */}
                      <tr className="border-b border-slate-200 bg-slate-50/80">
                        <td className="w-40 px-3 py-2 font-medium text-slate-700">
                          Service
                        </td>
                        <td className="px-3 py-2">
                          {services.length > 0 ? (
                            <select
                              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                              value={serviceName}
                              onChange={(e) => setServiceName(e.target.value)}
                            >
                              {services.map((s) => (
                                <option key={s.name} value={s.name}>
                                  {getServiceLabel(s)}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                              placeholder="Enter service name (e.g. Google, Amazon, OnePay)"
                              value={serviceName}
                              onChange={(e) => setServiceName(e.target.value)}
                            />
                          )}
                        </td>
                      </tr>

                      {/* Filter row */}
                      <tr className="border-b border-slate-200">
                        <td className="px-3 py-2 font-medium text-slate-700">
                          Filter
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <select
                              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 sm:w-56"
                              value={locationMode}
                              onChange={(e) =>
                                setLocationMode(
                                  e.target.value as LocationMode
                                )
                              }
                            >
                              <option value="none">No Filter</option>
                              <option value="areacode">Area Code</option>
                              <option value="state">State</option>
                              <option value="mdn">MDN</option>
                            </select>

                            {/* Dynamic input based on filter */}
                            {locationMode === "state" && (
                              <select
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 sm:w-48"
                                value={stateCode}
                                onChange={(e) => setStateCode(e.target.value)}
                              >
                                <option value="">Select state</option>
                                {US_STATES.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            )}

                            {locationMode === "areacode" && (
                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Area code 201 - 999"
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 sm:w-48"
                                value={areaCode}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^\d]/g,
                                    ""
                                  );
                                  if (value.length <= 3) {
                                    setAreaCode(value);
                                  }
                                }}
                              />
                            )}

                            {locationMode === "mdn" && (
                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="11-digit MDN"
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 sm:w-56"
                                value={mdn}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^\d]/g,
                                    ""
                                  );
                                  if (value.length <= 11) {
                                    setMdn(value);
                                  }
                                }}
                              />
                            )}

                            {locationMode === "none" && (
                              <span className="text-[11px] text-slate-500">
                                No geo filter, any available MDN will be used.
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={!canSubmitRequest || isRequesting}
                    className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isRequesting ? "Requesting..." : "Get Number"}
                  </button>
                </div>
              </form>

              {unknownResponse && (
                <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
                  <div className="font-semibold">Raw Tellabot response:</div>
                  <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap text-[11px]">
                    {unknownResponse}
                  </pre>
                </div>
              )}
            </section>

            {/* Requests Table */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-3 text-base font-semibold sm:text-lg">
                Current Requests &amp; SMS Status
              </h2>
              <p className="mb-4 text-xs text-slate-500 sm:text-sm">
                Recent MDN requests with countdown timers, SMS polling, and
                cancel/reactivate controls.
              </p>

              {currentRequests.length === 0 ? (
                <p className="text-xs text-slate-500 sm:text-sm">
                  No requests yet. Request a number above to see it listed here.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-xs sm:text-[13px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-left">
                        <th className="px-3 py-2 font-semibold text-slate-700">
                          Status
                        </th>
                        <th className="px-3 py-2 font-semibold text-slate-700">
                          ID
                        </th>
                        <th className="px-3 py-2 font-semibold text-slate-700">
                          MDN
                        </th>
                        <th className="px-3 py-2 font-semibold text-slate-700">
                          Service
                        </th>
                        <th className="px-3 py-2 font-semibold text-slate-700">
                          State
                        </th>
                        <th className="px-3 py-2 font-semibold text-slate-700">
                          Markup
                        </th>
                        <th className="px-3 py-2 font-semibold text-slate-700">
                          Price
                        </th>
                        <th className="px-3 py-2 font-semibold text-slate-700">
                          Carrier
                        </th>
                        <th className="px-3 py-2 font-semibold text-slate-700">
                          Till Exp.
                        </th>
                        <th className="px-3 py-2 font-semibold text-slate-700">
                          Message
                        </th>
                        <th className="px-3 py-2 font-semibold text-slate-700">
                          Settings
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRequests.map((req) => (
                        <tr
                          key={`${req.id}-${req.createdAt}`}
                          className="border-b border-slate-100"
                        >
                          <td className="px-3 py-2 align-top">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                req.mode === "waiting"
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                                  : req.mode === "message"
                                  ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                                  : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                              }`}
                            >
                              {req.mode === "waiting"
                                ? "Waiting"
                                : req.mode === "message"
                                ? "SMS"
                                : "Expired"}
                            </span>
                          </td>
                          <td className="px-3 py-2 align-top">{req.id}</td>
                          <td className="px-3 py-2 align-top font-mono text-[11px]">
                            {req.mdn}
                          </td>
                          <td className="px-3 py-2 align-top">
                            {req.service}
                          </td>
                          <td className="px-3 py-2 align-top">
                            {req.state || "-"}
                          </td>
                          <td className="px-3 py-2 align-top">{req.markup}</td>
                          <td className="px-3 py-2 align-top">
                            {req.price.toFixed(2)}$
                          </td>
                          <td className="px-3 py-2 align-top">
                            {req.carrier || "-"}
                          </td>
                          <td className="px-3 py-2 align-top">
                            {req.mode === "waiting"
                              ? `${req.remainingSeconds}s`
                              : "—"}
                          </td>
                          <td className="px-3 py-2 align-top">
                            {req.mode === "message" ? (
                              <div className="max-w-xs whitespace-pre-wrap text-[11px] text-slate-800">
                                {req.smsText}
                              </div>
                            ) : req.mode === "waiting" ? (
                              <span className="font-mono text-[11px] text-slate-700">
                                {formatSeconds(req.remainingSeconds)}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                No message
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 align-top">
                            {req.mode === "message" ? (
                              <button
                                type="button"
                                onClick={() => void handleReactivate(req)}
                                disabled={
                                  isReactivatingId !== null &&
                                  isReactivatingId !== req.id
                                }
                                className="rounded-md bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isReactivatingId === req.id
                                  ? "Reactivating..."
                                  : "Reactivate"}
                              </button>
                            ) : req.mode === "waiting" ? (
                              <button
                                type="button"
                                onClick={() => void handleCancel(req)}
                                disabled={
                                  isCancellingId !== null &&
                                  isCancellingId !== req.id
                                }
                                className="rounded-md bg-red-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isCancellingId === req.id
                                  ? "Cancelling..."
                                  : "Cancel"}
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="mt-6 border-t border-slate-200 bg-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <span>Tellabot Integration Tool</span>
          <span>Powered by MAB Digital Tools</span>
        </div>
      </footer>
    </div>
  );
}
