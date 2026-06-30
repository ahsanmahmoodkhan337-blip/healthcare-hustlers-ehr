/**
 * WhatsAppFloat — Floating WhatsApp Button
 *
 * Persistent floating button on the right side of every page.
 * Shows a chat bubble icon that opens the WhatsApp support chat.
 *
 * Inspiration: Common healthcare SaaS support widgets
 */

import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=923350340888&text=Hi%21%20I%20need%20help%20with%20the%20EHR%20Simulation%20Portal.&type=phone_number&app_absent=0";

export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:bg-green-400 hover:scale-110 hover:shadow-xl active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping" />
    </a>
  );
}

/**
 * Compact variant for inside the app (smaller, positioned relative to its container)
 */
export function WhatsAppFloatMini() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-500 transition-colors"
    >
      <MessageCircle className="h-3.5 w-3.5" />
      WhatsApp Support
    </a>
  );
}