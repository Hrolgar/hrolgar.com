"use client";

import ContactFormModal from "@/components/ContactFormModal";
import type { ContactForm } from "@/sanity/types";
import type { Locale } from "@/sanity/locale";

/**
 * The short inquiry form, embedded at the bottom of a service page.
 *
 * Someone who has read a service page (and anyone arriving from an ad later) should not have
 * to click through to /contact to start a conversation. The form itself is a Sanity contactForm
 * document, so the wording is edited in Studio; the service name rides along with the
 * submission so the email says which page it came from.
 */
export default function ServiceInquiry({
  form,
  locale,
  privacyNote,
  service,
}: {
  form: ContactForm;
  locale: Locale;
  privacyNote?: string;
  service: string;
}) {
  return (
    <ContactFormModal
      form={form}
      isOpen
      onClose={() => {}}
      variant="embedded"
      locale={locale}
      privacyNote={privacyNote}
      extraFields={{ service }}
    />
  );
}
