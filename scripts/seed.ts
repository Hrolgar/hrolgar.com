import { createClient } from "@sanity/client";
import { randomUUID } from "crypto";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

function block(text: string) {
  return {
    _type: "block",
    style: "normal",
    _key: randomUUID().slice(0, 8),
    children: [
      {
        _type: "span",
        _key: randomUUID().slice(0, 8),
        text,
        marks: [],
      },
    ],
    markDefs: [],
  };
}

async function seed() {
  console.log("Seeding Sanity CMS...\n");

  // --- Clean up old data ---
  console.log("Cleaning up old data...");

  // Delete all certifications
  const certifications = await client.fetch(`*[_type == "certification"]._id`);
  for (const id of certifications) {
    await client.delete(id);
  }

  // Delete old homelab services that no longer exist
  const oldHomelabIds = [
    "homelab-nginx-proxy-manager",
    "homelab-grafana",
    "homelab-portainer",
  ];
  for (const id of oldHomelabIds) {
    try { await client.delete(id); } catch { /* may not exist */ }
  }

  // Delete old skill that no longer exists
  try { await client.delete("skill-raspberry-pi"); } catch { /* may not exist */ }

  // --- Site Settings ---
  console.log("Creating site settings...");
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "Ullrhome",
    siteDescription: "Personal portfolio and blog of Hrolgar",
  });

  // --- About ---
  console.log("Creating about...");
  await client.createOrReplace({
    _id: "about",
    _type: "about",
    heading: "Hrolgar",
    tagline: "System developer and self-hosting enthusiast from Norway",
    roles: [
      "Senior System Developer",
      "Infrastructure Tinkerer",
      "Self-Hosting Enthusiast",
    ],
    body: [
      block(
        "I'm a system developer at SpareBank 1, working with .NET and modern cloud technologies in the Norwegian financial sector. Previously a partner at XLENT Ålesund building full-stack solutions with C#/.NET, Blazor, and Microsoft Azure — from CRM integrations and ERP systems to secure member portals."
      ),
      block(
        "Outside of client work I run a homelab that's probably more infrastructure than one person needs. Proxmox cluster, a dozen Docker stacks, GitLab, Authentik for SSO, Cloudflare tunnels — the whole thing managed with OpenTofu. My current obsession is Hrolbot: an AI agent system running on a VM in the lab, where autonomous Claude Code agents coordinate through a message mesh to write and review code. It works better than it has any right to."
      ),
    ],
  });

  // --- Contact Info ---
  console.log("Creating contact info...");
  await client.createOrReplace({
    _id: "contactInfo",
    _type: "contactInfo",
    email: "helgiskafta@proton.me",
    github: "https://github.com/Hrolgar",
    location: "Ålesund, Norway",
    availableForWork: false,
    upworkUrl: "https://www.upwork.com/freelancers/~01c51821d92bb54232",
    freelancerUrl: "https://www.freelancer.com/u/Hrolgar",
  });

  // --- Skills ---
  console.log("Creating skills...");
  const skills = [
    // Languages
    { name: "C#", category: "language", order: 1 },
    { name: "Python", category: "language", order: 2 },
    { name: "TypeScript", category: "language", order: 3 },
    { name: "JavaScript", category: "language", order: 4 },
    { name: "SQL", category: "language", order: 5 },
    { name: "Bash", category: "language", order: 6 },
    { name: "Go", category: "language", order: 7 },
    { name: "HCL", category: "language", order: 8 },
    // Frameworks
    { name: ".NET", category: "framework", order: 9 },
    { name: "ASP.NET Core", category: "framework", order: 10 },
    { name: "Entity Framework", category: "framework", order: 11 },
    { name: "React", category: "framework", order: 12 },
    { name: "Next.js", category: "framework", order: 13 },
    { name: "Blazor", category: "framework", order: 14 },
    // DevOps
    { name: "Docker", category: "devops", order: 15 },
    { name: "Proxmox", category: "devops", order: 16 },
    { name: "OpenTofu", category: "devops", order: 17 },
    { name: "GitHub Actions", category: "devops", order: 18 },
    { name: "GitLab CI", category: "devops", order: 19 },
    { name: "Cloudflare", category: "devops", order: 20 },
    // Tools
    { name: "Git", category: "tool", order: 21 },
    { name: "Linux", category: "tool", order: 22 },
    { name: "Traefik", category: "tool", order: 23 },
    { name: "Authentik", category: "tool", order: 24 },
    { name: "Infisical", category: "tool", order: 25 },
    { name: "VS Code", category: "tool", order: 26 },
    // Databases
    { name: "SQL Server", category: "database", order: 27 },
    { name: "PostgreSQL", category: "database", order: 28 },
    { name: "SQLite", category: "database", order: 29 },
    { name: "Redis", category: "database", order: 30 },
    // Platforms
    { name: "Azure", category: "platform", order: 31 },
    { name: "Vercel", category: "platform", order: 32 },
  ];

  const skillIds: Record<string, string> = {};
  for (const skill of skills) {
    const id = `skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    skillIds[skill.name] = id;
    await client.createOrReplace({
      _id: id,
      _type: "skill",
      ...skill,
    });
  }

  // --- Experience ---
  console.log("Creating experience...");

  await client.createOrReplace({
    _id: "exp-sparebank1",
    _type: "experience",
    company: "SpareBank 1",
    role: "Senior System Developer",
    location: "Norway",
    startDate: "2026-03-01",
    description: [
      block(
        "System development in the Norwegian financial sector. Working with .NET and modern cloud technologies."
      ),
    ],
    order: 0,
  });

  await client.createOrReplace({
    _id: "exp-xlent",
    _type: "experience",
    company: "XLENT Ålesund AS",
    role: "Senior System Developer & Partner",
    location: "Ålesund, Norway",
    startDate: "2023-08-01",
    endDate: "2026-02-01",
    description: [
      block(
        "Full-stack solutions with C#/.NET, Blazor, and Microsoft Azure. CRM integrations, ERP systems, and secure member portals for clients including 62°Nord Hotel & Adventures and Reisegarantifondet. Data integrations via Azure Service Bus and Dynamics 365, authentication with Duende, cloud storage with Cosmos DB and Blob Storage."
      ),
    ],
    order: 1,
  });

  await client.createOrReplace({
    _id: "exp-leba",
    _type: "experience",
    company: "LEBA AS",
    role: "Software Developer",
    location: "Ålesund, Norway",
    startDate: "2021-01-01",
    endDate: "2023-06-01",
    description: [
      block(
        "Built the company website and custom in-house ERP, CMS, and CRM systems from scratch."
      ),
    ],
    order: 2,
  });

  await client.createOrReplace({
    _id: "exp-freelance",
    _type: "experience",
    company: "Helgi Skaftason Consulting",
    role: "Freelance Developer",
    location: "Ålesund, Norway",
    startDate: "2017-07-01",
    description: [
      block(
        "Apps, websites, and software for national and international businesses. Everything from invoicing systems to full web applications."
      ),
    ],
    order: 3,
  });

  await client.createOrReplace({
    _id: "exp-restaurant",
    _type: "experience",
    company: "Ålesund Restaurant & Bar",
    role: "Owner & Manager",
    location: "Ålesund, Norway",
    startDate: "2014-01-01",
    endDate: "2016-02-01",
    description: [
      block(
        "Owned and managed a pub and live music venue. Staff leadership, financial management, event coordination, and business development."
      ),
    ],
    order: 4,
  });

  // --- Categories ---
  console.log("Creating categories...");
  const categories = [
    { title: "Homelab", slug: "homelab", description: "Home server setups, hardware, and infrastructure projects." },
    { title: "Self-Hosting", slug: "self-hosting", description: "Running your own services instead of relying on the cloud." },
    { title: "Development", slug: "development", description: "Software development, coding, and programming topics." },
    { title: "DevOps", slug: "devops", description: "CI/CD, infrastructure as code, and deployment automation." },
  ];

  const categoryIds: Record<string, string> = {};
  for (const cat of categories) {
    const id = `category-${cat.slug}`;
    categoryIds[cat.slug] = id;
    await client.createOrReplace({
      _id: id,
      _type: "category",
      title: cat.title,
      slug: { _type: "slug", current: cat.slug },
      description: cat.description,
    });
  }

  // --- Homelab Services ---
  console.log("Creating homelab services...");
  const homelabServices = [
    // Virtualization
    { name: "Proxmox VE", description: "Bare-metal hypervisor running all VMs and containers", category: "virtualization", order: 1 },
    { name: "Docker", description: "Container runtime on all application VMs", category: "virtualization", order: 2 },
    // Networking
    { name: "Cloudflare Tunnels", description: "Zero Trust access to internal services — no exposed ports", category: "networking", order: 3 },
    { name: "Traefik", description: "Reverse proxy with Authentik forward auth on every VM", category: "networking", order: 4 },
    // Identity
    { name: "Authentik", description: "Self-hosted SSO and identity provider for all services", category: "identity", order: 5 },
    // Security
    { name: "Infisical", description: "Self-hosted secrets management for credentials and API keys", category: "security", order: 6 },
    // Media
    { name: "Jellyfin", description: "Media server for movies, TV, and music", category: "media", order: 7 },
    { name: "Sonarr & Radarr", description: "Automated media management and downloads", category: "media", order: 8 },
    { name: "Audiobookshelf", description: "Audiobook and podcast server", category: "media", order: 9 },
    { name: "Tdarr", description: "Automated media transcoding", category: "media", order: 10 },
    // Storage
    { name: "Immich", description: "Self-hosted photo and video backup (Google Photos alternative)", category: "storage", order: 11 },
    { name: "ZFS", description: "Storage pools with 40TB NAS and SSD caching", category: "storage", order: 12 },
    // Development
    { name: "GitLab", description: "Self-hosted Git with CI/CD pipelines", category: "development", order: 13 },
    { name: "Hrolbot", description: "Multi-agent AI system for autonomous development", category: "development", order: 14 },
    // Automation
    { name: "OpenTofu", description: "Infrastructure as Code for the entire homelab", category: "automation", order: 15 },
  ];

  for (const svc of homelabServices) {
    const id = `homelab-${svc.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    await client.createOrReplace({
      _id: id,
      _type: "homelabService",
      selfHosted: true,
      ...svc,
    });
  }

  // --- Blog Posts ---
  console.log("Creating blog posts...");
  await client.createOrReplace({
    _id: "post-ai-agent-mesh-rpi",
    _type: "post",
    title: "Building an AI Agent Mesh in My Homelab",
    slug: { _type: "slug", current: "building-ai-agent-mesh-homelab" },
    excerpt:
      "How I built Hrolbot — a multi-agent AI system running on a Proxmox VM, where Claude Code agents coordinate through an MCP mesh to write and review real code.",
    publishedAt: "2026-03-10T10:00:00Z",
    featured: true,
    categories: [
      { _type: "reference", _ref: categoryIds["homelab"], _key: "c1" },
      { _type: "reference", _ref: categoryIds["development"], _key: "c2" },
    ],
    tags: ["proxmox", "ai", "claude", "mcp", "hrolbot"],
    body: [
      block(
        "A few months ago I had one of those ideas that sounds reasonable at 2 AM: what if I ran a fleet of AI agents on a Proxmox VM in my homelab? Not as a proof of concept, but as something I actually use daily. That idea became Hrolbot."
      ),
      block(
        "Hrolbot is a multi-agent system where each agent — a frontend developer, a backend developer, a reviewer — runs as an autonomous Claude Code instance. They coordinate through an MCP (Model Context Protocol) mesh, passing messages, sharing state, and handing off tasks to each other. An orchestrator agent receives instructions from Discord and delegates work to the right specialist."
      ),
      block(
        "The Proxmox VM handles the coordination layer: the MCP server, the message bus, the state store. The actual AI inference happens in the cloud via the Anthropic API, so the VM doesn't need to do any heavy lifting on that front. It just needs to keep the mesh running and the agents talking."
      ),
      block(
        "One of the more interesting challenges was getting the agents to work together without stepping on each other. Each agent operates in its own workspace, commits to its own branch, and communicates through structured messages. The orchestrator handles merge coordination and conflict resolution. It's not perfect, but it works surprisingly well for a system running on a 4-core VM with 8GB of RAM."
      ),
      block(
        "The whole thing is open source. If you're curious about running your own agent mesh — or you just want to see what happens when you give a VM more responsibility than it probably deserves — check out the repo on GitHub."
      ),
    ],
  });

  await client.createOrReplace({
    _id: "post-why-self-host",
    _type: "post",
    title: "Why I Self-Host Everything",
    slug: { _type: "slug", current: "why-i-self-host-everything" },
    excerpt:
      "On the philosophy of running your own infrastructure, owning your data, and why I'd rather debug a Proxmox cluster at midnight than pay for another SaaS subscription.",
    publishedAt: "2026-02-20T10:00:00Z",
    featured: false,
    categories: [
      { _type: "reference", _ref: categoryIds["self-hosting"], _key: "c1" },
      { _type: "reference", _ref: categoryIds["homelab"], _key: "c2" },
    ],
    tags: ["self-hosting", "proxmox", "docker", "privacy", "homelab"],
    body: [
      block(
        "I self-host almost everything. Email filtering, media streaming, password management, identity, monitoring — if there's a self-hosted alternative, I'm probably running it. People sometimes ask why I bother when there are perfectly good cloud services for all of this. The honest answer is a mix of principle and stubbornness."
      ),
      block(
        "The principle part is straightforward: I want to own my data. Not in a tinfoil-hat way, but in the practical sense that I want to know where my data lives, who has access to it, and what happens if a provider decides to change their terms or shut down. When your photos are on your own Jellyfin server and your secrets are in your own Infisical instance, those questions have simple answers."
      ),
      block(
        "The stubbornness part is that I genuinely enjoy the process. Running Proxmox VE as my virtualization layer, spinning up containers in Docker, wiring everything together through Cloudflare Tunnels and Nginx Proxy Manager — it's the kind of infrastructure work that scratches the same itch as building software. You're designing systems, solving problems, and occasionally staring at logs at 1 AM wondering why Authentik decided to invalidate all sessions."
      ),
      block(
        "Is it more work than just paying for SaaS? Absolutely. But it's also more educational, more flexible, and more satisfying. Every service in my homelab is something I understand end-to-end. When something breaks, I learn something. When something works, I know exactly why. That's worth a few late nights."
      ),
    ],
  });

  // --- Projects ---
  console.log("Creating projects...");
  await client.createOrReplace({
    _id: "project-hrolbot",
    _type: "project",
    title: "Hrolbot",
    slug: { _type: "slug", current: "hrolbot" },
    summary:
      "Multi-agent AI system running on a Proxmox VM. Autonomous Claude Code agents coordinated through an MCP mesh — each specializing in frontend, backend, review, or DevOps.",
    description: [
      block(
        "Hrolbot started as a Discord bot that calls Claude Code. It evolved into a multi-agent system where specialized workers — frontend, backend, reviewer, testing, research — operate autonomously on separate Linux user accounts. They coordinate through a shared message mesh, write code on feature branches, review each other's work, and push to GitHub."
      ),
      block(
        "The orchestrator receives tasks from Discord, delegates to the right workers, and reports results. The whole system runs on a 4-core Proxmox VM with 8GB RAM. Workers use tmux sessions for long tasks and a SQLite database for task tracking."
      ),
    ],
    githubUrl: "https://github.com/Hrolgar/hrolbot",
    featured: true,
    problem:
      "Managing a growing homelab with dozens of services, containers, and scheduled tasks was becoming unmanageable manually.",
    approach:
      "Built an autonomous AI agent platform that orchestrates worker agents for code review, deployment, monitoring, and system maintenance.",
    outcome:
      "A self-improving system that handles routine ops, delegates to specialized workers, and maintains continuity across sessions.",
    technologies: [
      { _type: "reference", _ref: skillIds["Python"], _key: "t1" },
      { _type: "reference", _ref: skillIds["TypeScript"], _key: "t2" },
      { _type: "reference", _ref: skillIds["Docker"], _key: "t3" },
      { _type: "reference", _ref: skillIds["Linux"], _key: "t4" },
    ],
    order: 1,
  });

  await client.createOrReplace({
    _id: "project-codex",
    _type: "project",
    title: "Codex",
    slug: { _type: "slug", current: "codex" },
    summary:
      "Self-hosted book and audiobook library manager with duplicate detection, series tracking, and provider-based metadata fetching.",
    description: [
      block(
        "Codex is a library manager for ebooks and audiobooks. It scans directories, detects duplicates, tracks series, and fetches metadata from multiple providers (Google Books, Open Library, Audnexus). Built with FastAPI and React, designed to run self-hosted alongside Audiobookshelf."
      ),
    ],
    githubUrl: "https://github.com/Hrolgar/codex",
    featured: false,
    problem:
      "No existing book/audiobook manager handled both formats well with proper metadata and a clean interface.",
    approach:
      "Built a full-stack application with a FastAPI backend and React frontend, integrating multiple metadata APIs for automatic book enrichment.",
    outcome:
      "A personal library manager that automatically fetches metadata, tracks reading progress, and handles both ebooks and audiobooks.",
    technologies: [
      { _type: "reference", _ref: skillIds["Python"], _key: "t1" },
      { _type: "reference", _ref: skillIds["TypeScript"], _key: "t2" },
      { _type: "reference", _ref: skillIds["React"], _key: "t3" },
      { _type: "reference", _ref: skillIds["SQLite"], _key: "t4" },
    ],
    order: 2,
  });

  await client.createOrReplace({
    _id: "project-ullrhome",
    _type: "project",
    title: "Ullrhome",
    slug: { _type: "slug", current: "ullrhome" },
    summary:
      "Personal portfolio and blog built with Next.js 16 and Sanity v5 CMS.",
    description: [
      block(
        "A personal portfolio site built with Next.js 16 and Sanity v5. Content is fully CMS-managed — projects, blog posts, skills, and work experience can all be updated without touching the code. The design uses Fraunces and DM Sans typography with a dark editorial aesthetic."
      ),
    ],
    githubUrl: "https://github.com/Hrolgar/ullrhome",
    featured: false,
    problem:
      "The previous online presence did not clearly present services, project case studies, and technical writing in a way that reflected current professional work.",
    approach:
      "Built a structured portfolio on Next.js with Sanity as the content layer, making projects, blog posts, skills, and experience easy to manage through a single editorial workflow.",
    outcome:
      "A professional portfolio that is easier to maintain, better suited for showcasing consulting work, and flexible enough to grow with new case studies and articles.",
    technologies: [
      { _type: "reference", _ref: skillIds["TypeScript"], _key: "t1" },
      { _type: "reference", _ref: skillIds["Next.js"], _key: "t2" },
      { _type: "reference", _ref: skillIds["React"], _key: "t3" },
      { _type: "reference", _ref: skillIds["Vercel"], _key: "t4" },
    ],
    order: 3,
  });

  // --- Services ---
  console.log("Creating services...");
  await client.createOrReplace({
    _id: "service-api-integration",
    _type: "service",
    title: "API & Integration Development",
    slug: { _type: "slug", current: "api-integration" },
    summary:
      "Connect your systems with reliable, well-documented APIs and integrations that handle edge cases gracefully.",
    description: [
      block(
        "I build APIs and integrations that make separate systems work together cleanly, with attention to validation, edge cases, observability, and clear contracts."
      ),
    ],
    icon: "api",
    featured: true,
    order: 1,
  });

  await client.createOrReplace({
    _id: "service-backend-dotnet",
    _type: "service",
    title: "Backend Systems & .NET Development",
    slug: { _type: "slug", current: "backend-dotnet" },
    summary:
      "Scalable backend architecture in C#/.NET — from green-field builds to modernizing legacy systems.",
    description: [
      block(
        "I design and implement backend systems in C# and .NET with a focus on maintainable architecture, clear boundaries, and pragmatic modernization of legacy codebases."
      ),
    ],
    icon: "backend",
    featured: true,
    order: 2,
  });

  await client.createOrReplace({
    _id: "service-infrastructure-automation",
    _type: "service",
    title: "Infrastructure & Automation",
    slug: { _type: "slug", current: "infrastructure-automation" },
    summary:
      "Automated pipelines, self-hosted infrastructure, and DevOps tooling that keeps your systems running.",
    description: [
      block(
        "I automate the repetitive operational work around delivery and hosting, from deployment pipelines and environment setup to self-hosted tooling and ongoing system upkeep."
      ),
    ],
    icon: "automation",
    featured: true,
    order: 3,
  });

  console.log("\nSeeding complete!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
