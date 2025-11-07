// src/app/contact-us/page.tsx
import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us • MAB Digital Tools",
  description:
    "Support, feedback ya feature requests ke liye humse contact karein. Fast response aur simple process.",
  alternates: { canonical: "/contact-us" },
  openGraph: {
    title: "Contact Us • MAB Digital Tools",
    description:
      "Support, feedback ya feature requests ke liye humse contact karein. Fast response aur simple process.",
    url: "/contact-us",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us • MAB Digital Tools",
    description:
      "Support, feedback ya feature requests ke liye humse contact karein. Fast response aur simple process.",
  },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return <ContactForm />;
}
