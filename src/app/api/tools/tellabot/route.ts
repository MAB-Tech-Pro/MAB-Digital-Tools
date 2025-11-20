import { NextResponse } from "next/server";

const ALLOWED_CMDS = new Set<string>([
  "balance",
  "list_services",
  "request",
  "request_status",
  "reject",
  "read_sms",
  "send_sms",
  "ltr_rent",
  "ltr_autorenew",
  "ltr_status",
  "ltr_activate",
  "ltr_release",
  "ltr_report",
  "ltr_reported_status",
  "ltr_switch_service",
  "ltr_forward",
  "proxy_list",
  "proxy_rent",
  "proxy_swap",
  "proxy_redial",
]);

type TellabotRequestBody = {
  cmd: string;
  user: string;
  api_key: string;
  [key: string]: unknown;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TellabotRequestBody;

    const { cmd, user, api_key, ...rest } = body;

    if (!cmd || !user || !api_key) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required parameters: cmd, user, api_key.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_CMDS.has(cmd)) {
      return NextResponse.json(
        {
          status: "error",
          message: `Unsupported Tellabot command: ${cmd}`,
        },
        { status: 400 }
      );
    }

    const params = new URLSearchParams();
    params.set("cmd", cmd);
    params.set("user", String(user));
    params.set("api_key", String(api_key));

    // Allow only non-empty extra params to be forwarded
    Object.entries(rest).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        typeof value === "object"
      ) {
        return;
      }
      params.set(key, String(value));
    });

    const url = `https://www.tellabot.com/sims/api_command.php?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    const text = await res.text();

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid JSON response from Tellabot.",
          raw: text,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Tellabot API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error while calling Tellabot.",
      },
      { status: 500 }
    );
  }
}
