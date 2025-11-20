import type { Metadata } from "next";
import { TellabotClient } from "./TellabotClient";

export const metadata: Metadata = {
  title: "Tellabot Integration Tool • MAB Digital Tools",
  description:
    "Tellabot Integration Tool lets you manage virtual numbers, request MDNs, read SMS, and control Tellabot SIMs using your username and API key.",
  alternates: {
    canonical: "/tools/tellabot",
  },
  openGraph: {
    title: "Tellabot Integration Tool • MAB Digital Tools",
    description:
      "Manage Tellabot virtual numbers, request MDNs, monitor SMS codes, and reactivate numbers directly from your browser.",
    url: "/tools/tellabot",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tellabot Integration Tool • MAB Digital Tools",
    description:
      "Manage Tellabot SIM requests and SMS verification codes with a simple browser interface.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TellabotPage() {
  return <TellabotClient />;
}
