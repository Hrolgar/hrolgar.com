"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ContactForm } from "@/sanity/types";

interface Props {
  form: ContactForm;
  isOpen: boolean;
  onClose: () => void;
  variant?: "desktop" | "inline";
}

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactFormModal({
  form,
  isOpen,
  onClose,
  variant = "desktop",
}: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isInlineVisible, setIsInlineVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const inlineTimeoutRef = useRef<number | null>(null);
  const isDesktopModal = variant === "desktop";

  const fields = useMemo(() => form.fields || [], [form.fields]);

  useEffect(() => {
    if (!isOpen) return;

    setFormData({});
    setErrors({});
    setStatus("idle");
    setErrorMessage("");
  }, [isOpen]);

  useEffect(() => {
    if (variant !== "inline") return;

    if (inlineTimeoutRef.current) {
      window.clearTimeout(inlineTimeoutRef.current);
      inlineTimeoutRef.current = null;
    }

    if (!isOpen) {
      setIsInlineVisible(false);
      return;
    }

    setIsInlineVisible(false);
    inlineTimeoutRef.current = window.setTimeout(() => {
      setIsInlineVisible(true);
      inlineTimeoutRef.current = null;
    }, 16);

    return () => {
      if (inlineTimeoutRef.current) {
        window.clearTimeout(inlineTimeoutRef.current);
        inlineTimeoutRef.current = null;
      }
    };
  }, [isOpen, variant]);

  useEffect(() => {
    if (!isDesktopModal || !isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTarget = window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !containerRef.current) return;

      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTarget);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDesktopModal, isOpen, onClose]);

  if (!isOpen) return null;

  const validateField = (name: string, value: string) => {
    const field = fields.find((item) => item.name === name);
    if (!field?.required) return "";
    return value.trim() ? "" : `${field.label} is required.`;
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    for (const field of fields) {
      const error = validateField(field.name, formData[field.name] || "");
      if (error) nextErrors[field.name] = error;
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const focusFirstInvalidField = (nextErrors: Record<string, string>) => {
    const firstInvalidName = Object.keys(nextErrors)[0];
    if (!firstInvalidName) return;

    const element = containerRef.current?.querySelector<HTMLElement>(
      `[name="${CSS.escape(firstInvalidName)}"]`,
    );
    element?.focus();
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        const error = validateField(name, value);

        if (error) next[name] = error;
        else delete next[name];

        return next;
      });
    }
  };

  const handleBlur = (name: string) => {
    const error = validateField(name, formData[name] || "");

    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setErrorMessage("Please correct the highlighted fields and try again.");
      focusFirstInvalidField(nextErrors);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          formName: form.name,
          fields: formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact form");
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or email directly.");
    }
  };

  const renderField = (field: NonNullable<ContactForm["fields"]>[number], index: number) => {
    const sharedProps = {
      id: `field-${field.name}`,
      name: field.name,
      value: formData[field.name] || "",
      required: field.required,
      "aria-invalid": Boolean(errors[field.name]),
      "aria-describedby": errors[field.name] ? `field-${field.name}-error` : undefined,
      onBlur: () => handleBlur(field.name),
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
      ) => handleChange(field.name, event.target.value),
      className:
        "min-h-11 w-full rounded-[var(--radius)] border border-border bg-bg px-4 py-3 text-sm text-foreground placeholder:text-muted transition-colors focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      ref:
        index === 0
          ? (element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null) => {
              firstFieldRef.current = element;
            }
          : undefined,
    };

    if (field.type === "textarea") {
      return <textarea {...sharedProps} placeholder={field.placeholder} rows={5} />;
    }

    if (field.type === "select") {
      return (
        <select {...sharedProps}>
          <option value="">{field.placeholder || "Select an option"}</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        {...sharedProps}
        type={field.type || "text"}
        placeholder={field.placeholder}
        autoComplete={field.name === "email" ? "email" : field.name === "name" ? "name" : "off"}
      />
    );
  };

  const closeButtonClassName = isDesktopModal
    ? "absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    : "inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  const handleInlineClose = () => {
    if (inlineTimeoutRef.current) {
      window.clearTimeout(inlineTimeoutRef.current);
      inlineTimeoutRef.current = null;
    }

    setIsInlineVisible(false);
    inlineTimeoutRef.current = window.setTimeout(() => {
      onClose();
      inlineTimeoutRef.current = null;
    }, 180);
  };

  const handleClose = isDesktopModal ? onClose : handleInlineClose;

  const formBody = (
    <>
      <div className={isDesktopModal ? undefined : "flex items-start justify-between gap-4"}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Contact</p>
          <h2
            id={titleId}
            className={`mt-3 font-[family-name:var(--font-serif)] text-3xl font-bold text-foreground ${
              isDesktopModal ? "pr-10" : ""
            }`}
          >
            {form.heading || form.name}
          </h2>
          {form.description ? (
            <p id={descriptionId} className="mt-3 max-w-[42ch] text-sm leading-relaxed text-muted">
              {form.description}
            </p>
          ) : null}
        </div>

        {!isDesktopModal ? (
          <button
            type="button"
            onClick={handleClose}
            className={closeButtonClassName}
            aria-label="Collapse contact form"
          >
            Close
          </button>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        {fields.map((field, index) => (
          <div key={field._key || field.name}>
            <label
              htmlFor={`field-${field.name}`}
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              {field.label}
              {field.required ? <span className="ml-1 text-accent">*</span> : null}
            </label>
            {renderField(field, index)}
            {errors[field.name] ? (
              <p id={`field-${field.name}-error`} className="mt-1.5 text-sm text-accent">
                {errors[field.name]}
              </p>
            ) : null}
          </div>
        ))}

        {status === "error" && errorMessage ? (
          <p className="rounded-[var(--radius)] border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--radius)] bg-accent px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-[color:color-mix(in_srgb,var(--color-accent)_88%,white)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending..." : form.submitText || "Send Message"}
        </button>
      </form>
    </>
  );

  const successBody = (
    <div className="py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/12 text-accent">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      </div>
      <h2 id={titleId} className="mt-5 font-[family-name:var(--font-serif)] text-3xl font-bold text-foreground">
        Message sent
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {form.successMessage || "Thanks! I'll get back to you soon."}
      </p>
      <button
        type="button"
        onClick={handleClose}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Close
      </button>
    </div>
  );

  if (!isDesktopModal) {
    return (
      <div
        className={`overflow-hidden transition-[opacity,transform] duration-200 ease-out ${
          isInlineVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        }`}
      >
        <div
          ref={containerRef}
          role="region"
          aria-labelledby={titleId}
          aria-describedby={form.description ? descriptionId : undefined}
          className="mt-6 rounded-[calc(var(--radius)*2)] border border-border bg-[color:color-mix(in_srgb,var(--color-surface)_90%,black)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
        >
          {status === "success" ? successBody : formBody}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close contact form"
        onClick={onClose}
      />

      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={form.description ? descriptionId : undefined}
        className="relative z-[101] w-full max-w-lg rounded-[calc(var(--radius)*2)] border border-border bg-surface p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className={closeButtonClassName}
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </button>

        {status === "success" ? successBody : formBody}
      </div>
    </div>
  );
}
