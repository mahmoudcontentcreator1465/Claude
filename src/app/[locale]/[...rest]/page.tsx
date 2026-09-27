import { notFound } from "next/navigation";

// Sends every unknown path under /en or /ar to the localized not-found page.
export default function CatchAll() {
  notFound();
}
