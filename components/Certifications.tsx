import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import type { Certification } from "@/sanity/types";

interface Props {
  certifications: Certification[];
}

export default function Certifications({ certifications }: Props) {
  if (!certifications?.length) return null;

  return (
    <section id="certifications" className="section-surface bg-surface py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-6">
          Certifications
        </span>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {certifications.map((cert) => (
            <div key={cert._id} className="inline-flex items-center gap-2">
              {cert.badge && (
                <Image
                  src={urlFor(cert.badge).width(24).height(24).url()}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded"
                />
              )}
              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  {cert.name}
                </a>
              ) : (
                <span className="text-sm text-foreground">{cert.name}</span>
              )}
              <span className="text-xs text-muted">{cert.issuer}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
