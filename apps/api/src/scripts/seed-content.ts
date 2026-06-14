import { PrismaClient, ExperienceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing existing content...');

  // Clear in reverse FK-dependency order
  // Disconnect M2M by deleting parents first (Prisma handles join tables)
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.award.deleteMany();
  await prisma.techStack.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.contactInquiry.deleteMany();

  console.log('✅ Cleared.\n');

  // ─── 1. TAGS ─────────────────────────────────────────────────────────────────
  console.log('🏷️  Seeding tags...');
  const tagData = [
    { name: 'React', slug: 'react' },
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'Node.js', slug: 'nodejs' },
    { name: 'NestJS', slug: 'nestjs' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'Python', slug: 'python' },
    { name: 'React Native', slug: 'react-native' },
    { name: '.NET', slug: 'dotnet' },
    { name: 'MongoDB', slug: 'mongodb' },
    { name: 'PostgreSQL', slug: 'postgresql' },
    { name: 'Stripe', slug: 'stripe' },
    { name: 'Flask', slug: 'flask' },
    { name: 'Azure DevOps', slug: 'azure-devops' },
    { name: 'Scikit-learn', slug: 'scikit-learn' },
    { name: 'Streamlit', slug: 'streamlit' },
    { name: 'Full-Stack', slug: 'full-stack' },
    { name: 'Mobile', slug: 'mobile' },
    { name: 'Backend', slug: 'backend' },
    { name: 'Enterprise', slug: 'enterprise' },
    { name: 'AI / ML', slug: 'ai-ml' },
    { name: 'Frontend', slug: 'frontend' },
    { name: 'MERN Stack', slug: 'mern-stack' },
  ];

  const tags: Record<string, string> = {};
  for (const t of tagData) {
    const created = await prisma.tag.create({ data: t });
    tags[t.slug] = created.id;
  }
  console.log(`  → ${tagData.length} tags created.\n`);

  // ─── 2. PROFILE ──────────────────────────────────────────────────────────────
  console.log('👤 Seeding profile...');
  await prisma.profile.create({
    data: {
      name: 'Amal A',
      title: 'Full-Stack & Mobile Engineer',
      headline:
        'Building scalable, client-ready products — from concept to deployment.',
      bio: `Software Engineer with a vision to build a future where technology and nature thrive in harmony. Driven to contribute to sustainable innovation through continuous learning and impactful tech solutions.`,
      email: 'amalanilkumar282@gmail.com',
      alternateEmail: 'amalanilkumaredu@gmail.com',
      location: 'Kerala, India',
      socialLinks: JSON.stringify({
        github: 'https://github.com/Amalanilkumar282',
        linkedin: 'https://www.linkedin.com/in/amal-a-99360b31b/',
      }),
      isPublished: true,
    },
  });
  console.log('  → Profile created.\n');

  // ─── 3. EDUCATION ────────────────────────────────────────────────────────────
  console.log('🎓 Seeding education...');
  const educationData = [
    // ── Degrees ──
    {
      institution: "St. Joseph's College of Engineering and Technology, Palai",
      degree: 'B.Tech in Computer Science and Engineering',
      field: 'CGPA: 8.62 · Best Outgoing Student Award 2025',
      startDate: new Date('2021-09-01'),
      endDate: new Date('2025-05-31'),
      order: 0,
      isPublished: true,
    },
    {
      institution: 'St. George HSS, Kothamangalam',
      degree: 'Higher Secondary (12th)',
      field: 'Science Stream · 98.58%',
      startDate: new Date('2019-06-01'),
      endDate: new Date('2021-03-31'),
      order: 1,
      isPublished: true,
    },
    {
      institution: 'LFHS, Oonnukal',
      degree: 'SSLC (10th)',
      field: 'Secondary Education · 95%',
      startDate: new Date('2017-06-01'),
      endDate: new Date('2019-03-31'),
      order: 2,
      isPublished: true,
    },
    // ── Certifications ──
    {
      institution: 'Infosys Springboard',
      degree: 'Certification',
      field: 'Introduction to Cyber Security',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-06-30'),
      order: 3,
      isPublished: true,
    },
    {
      institution: 'Infosys Springboard',
      degree: 'Certification',
      field: 'Introduction to Artificial Intelligence',
      startDate: new Date('2022-07-01'),
      endDate: new Date('2022-12-31'),
      order: 4,
      isPublished: true,
    },
    {
      institution: 'Infosys Springboard',
      degree: 'Certification',
      field: 'Introduction to Deep Learning',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-06-30'),
      order: 5,
      isPublished: true,
    },
    {
      institution: 'IIT Bombay (Spoken Tutorial)',
      degree: 'Certification',
      field: 'C Programming (Spoken Tutorial)',
      startDate: new Date('2021-06-01'),
      endDate: new Date('2021-09-30'),
      order: 6,
      isPublished: true,
    },
    {
      institution: 'Government of India',
      degree: 'Certification',
      field: 'Smart India Hackathon 2023 — Prelims Qualifier',
      startDate: new Date('2023-08-01'),
      endDate: new Date('2023-09-30'),
      order: 7,
      isPublished: true,
    },
    {
      institution: 'YIP (Youth Innovation Program)',
      degree: 'Certification',
      field: 'VoC 2021 Program',
      startDate: new Date('2021-01-01'),
      endDate: new Date('2021-06-30'),
      order: 8,
      isPublished: true,
    },
  ];
  await prisma.education.createMany({ data: educationData });
  console.log(`  → ${educationData.length} education records created.\n`);

  // ─── 4. EXPERIENCE ───────────────────────────────────────────────────────────
  console.log('💼 Seeding experience...');
  const experienceData = [
    // ── Professional Work ──
    {
      company: 'Experion Technologies',
      role: 'Associate Software Engineer',
      description:
        'Working in a professional product engineering environment following industrial-grade standards. Skilled in CQRS architecture, Azure DevOps pipelines, React Native mobile development, and .NET backend systems. Served as Team Lead during the ILP (Initial Learning Program) training batch — led the team to build a Jira-inspired project management tool that won the Best Project Award for ILP Batch 2025.',
      startDate: new Date('2025-08-01'),
      isPresent: true,
      experienceType: ExperienceType.WORK,
      order: 0,
      isPublished: true,
    },
    {
      company: 'Freelance',
      role: 'Full-Stack Developer',
      description:
        'Delivered multiple client projects independently post-graduation: an Employee Management System, an Expense Management System, and several professional branding and service websites. Managed the full project lifecycle — from scoping and architecture to deployment — for confidential clients.',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-07-31'),
      isPresent: false,
      experienceType: ExperienceType.FREELANCE,
      order: 1,
      isPublished: true,
    },
    // ── Internships ──
    {
      company: 'Qmark Technolabs Pvt Ltd',
      role: 'Frontend Developer Intern',
      description:
        'Contributed to frontend development in a professional product environment, gaining hands-on experience with modern frontend frameworks, workflows, and team-based development practices across real-world product features.',
      startDate: new Date('2025-01-27'),
      endDate: new Date('2025-04-27'),
      isPresent: false,
      experienceType: ExperienceType.INTERNSHIP,
      order: 2,
      isPublished: true,
    },
    {
      company: 'Revertech IT Solutions',
      role: 'Backend Developer Intern',
      description:
        'Gained foundational exposure to server-side development, API design, and backend engineering practices during a focused 2-week internship. Worked with the backend team on live codebases.',
      startDate: new Date('2023-05-16'),
      endDate: new Date('2023-05-30'),
      isPresent: false,
      experienceType: ExperienceType.INTERNSHIP,
      order: 3,
      isPublished: true,
    },
    // ── Leadership & Positions of Responsibility ──
    {
      company: 'IEEE IAS SBC, SJCET',
      role: 'Chairman',
      description:
        'Led the IEEE Industry Applications Society Student Branch Chapter at SJCET — organising technical events, workshops, and industry-engagement initiatives that advanced student learning and professional development across the campus.',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2024-05-31'),
      isPresent: false,
      experienceType: ExperienceType.LEADERSHIP,
      order: 4,
      isPublished: true,
    },
    {
      company: 'IEEE IAS SBC, SJCET',
      role: 'Vice Chairman',
      description:
        'Supported chapter operations and event execution as Vice Chairman, contributing to technical workshops, speaker sessions, and industry engagement programmes for fellow students.',
      startDate: new Date('2022-06-01'),
      endDate: new Date('2023-05-31'),
      isPresent: false,
      experienceType: ExperienceType.LEADERSHIP,
      order: 5,
      isPublished: true,
    },
    {
      company: 'SJCET',
      role: 'Placement Coordinator',
      description:
        'Coordinated campus placement activities for the CSE department — bridging students with industry opportunities, managing recruiter communications, and organising pre-placement preparation sessions.',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-05-31'),
      isPresent: false,
      experienceType: ExperienceType.LEADERSHIP,
      order: 6,
      isPublished: true,
    },
    {
      company: 'CSI SJCET',
      role: 'Secretary',
      description:
        'Managed administrative operations for the CSI Student Chapter — organising tech talks, coding competitions, and hackathons while coordinating with national CSI chapters and mentors.',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-05-31'),
      isPresent: false,
      experienceType: ExperienceType.LEADERSHIP,
      order: 7,
      isPublished: true,
    },
    {
      company: 'IEEE SB, SJCET',
      role: 'Publicity Coordinator',
      description:
        "Drove awareness and engagement for IEEE student branch events through social media campaigns, campus outreach, and digital communications — growing event participation and the chapter's online presence.",
      startDate: new Date('2024-05-01'),
      endDate: new Date('2025-04-30'),
      isPresent: false,
      experienceType: ExperienceType.LEADERSHIP,
      order: 8,
      isPublished: true,
    },
    {
      company: 'CSI SJCET (Execom)',
      role: 'Event Team Member',
      description:
        'Active member of the CSI executive committee — contributed to planning, logistics, and execution of multiple technical and non-technical events throughout the academic year.',
      startDate: new Date('2023-12-01'),
      endDate: new Date('2024-12-31'),
      isPresent: false,
      experienceType: ExperienceType.LEADERSHIP,
      order: 9,
      isPublished: true,
    },
    {
      company: 'SJCET — ASTHRA 8.0',
      role: 'Event Sub-Coordinator',
      description:
        "Served as sub-coordinator for ASTHRA 8.0 — the college's flagship technical festival — managing event scheduling, venue coordination, volunteer teams, and participant experience across the event.",
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-31'),
      isPresent: false,
      experienceType: ExperienceType.LEADERSHIP,
      order: 10,
      isPublished: true,
    },
  ];
  await prisma.experience.createMany({ data: experienceData });
  console.log(`  → ${experienceData.length} experience records created.\n`);

  // ─── 5. SKILLS ───────────────────────────────────────────────────────────────
  console.log('⚡ Seeding skills...');
  const skillsData = [
    // Programming Languages
    {
      name: 'JavaScript / TypeScript',
      category: 'Programming Languages',
      proficiency: 90,
      order: 0,
    },
    {
      name: 'Python',
      category: 'Programming Languages',
      proficiency: 80,
      order: 1,
    },
    {
      name: 'HTML / CSS',
      category: 'Programming Languages',
      proficiency: 88,
      order: 2,
    },
    {
      name: 'SQL',
      category: 'Programming Languages',
      proficiency: 75,
      order: 3,
    },
    {
      name: 'Java',
      category: 'Programming Languages',
      proficiency: 65,
      order: 4,
    },
    { name: 'C', category: 'Programming Languages', proficiency: 62, order: 5 },
    // Frontend
    { name: 'React.js', category: 'Frontend', proficiency: 90, order: 0 },
    { name: 'Next.js', category: 'Frontend', proficiency: 88, order: 1 },
    { name: 'Tailwind CSS', category: 'Frontend', proficiency: 85, order: 2 },
    {
      name: 'Responsive Design',
      category: 'Frontend',
      proficiency: 87,
      order: 3,
    },
    // Backend
    { name: 'NestJS', category: 'Backend', proficiency: 85, order: 0 },
    {
      name: 'Node.js / Express',
      category: 'Backend',
      proficiency: 88,
      order: 1,
    },
    { name: '.NET (C#)', category: 'Backend', proficiency: 68, order: 2 },
    { name: 'Flask', category: 'Backend', proficiency: 72, order: 3 },
    { name: 'REST API Design', category: 'Backend', proficiency: 88, order: 4 },
    // Mobile
    {
      name: 'React Native (iOS & Android)',
      category: 'Mobile',
      proficiency: 82,
      order: 0,
    },
    // Database
    { name: 'PostgreSQL', category: 'Database', proficiency: 82, order: 0 },
    { name: 'MongoDB', category: 'Database', proficiency: 80, order: 1 },
    { name: 'Prisma ORM', category: 'Database', proficiency: 85, order: 2 },
    {
      name: 'SQL Design & Optimisation',
      category: 'Database',
      proficiency: 75,
      order: 3,
    },
    // Cloud & DevOps
    {
      name: 'Azure DevOps',
      category: 'Cloud & DevOps',
      proficiency: 70,
      order: 0,
    },
    {
      name: 'Git / GitHub',
      category: 'Cloud & DevOps',
      proficiency: 90,
      order: 1,
    },
    {
      name: 'Cloudinary',
      category: 'Cloud & DevOps',
      proficiency: 72,
      order: 2,
    },
    // Architecture & Patterns
    {
      name: 'CQRS Architecture',
      category: 'Architecture & Patterns',
      proficiency: 75,
      order: 0,
    },
    {
      name: 'RBAC (Role-Based Access)',
      category: 'Architecture & Patterns',
      proficiency: 82,
      order: 1,
    },
    {
      name: 'MVC / Component Architecture',
      category: 'Architecture & Patterns',
      proficiency: 88,
      order: 2,
    },
    {
      name: 'Agile / Scrum',
      category: 'Architecture & Patterns',
      proficiency: 78,
      order: 3,
    },
    // AI / ML
    { name: 'Scikit-learn', category: 'AI / ML', proficiency: 70, order: 0 },
    { name: 'AutoML', category: 'AI / ML', proficiency: 65, order: 1 },
    {
      name: 'Deep Learning (Intro)',
      category: 'AI / ML',
      proficiency: 55,
      order: 2,
    },
    {
      name: 'AI Integration in Web Apps',
      category: 'AI / ML',
      proficiency: 68,
      order: 3,
    },
    // Soft Skills
    {
      name: 'Team Leadership',
      category: 'Soft Skills',
      proficiency: 88,
      order: 0,
    },
    {
      name: 'Problem Solving',
      category: 'Soft Skills',
      proficiency: 90,
      order: 1,
    },
    {
      name: 'Communication',
      category: 'Soft Skills',
      proficiency: 85,
      order: 2,
    },
    {
      name: 'Adaptability',
      category: 'Soft Skills',
      proficiency: 85,
      order: 3,
    },
    {
      name: 'Attention to Detail',
      category: 'Soft Skills',
      proficiency: 84,
      order: 4,
    },
  ];
  await prisma.skill.createMany({ data: skillsData });
  console.log(`  → ${skillsData.length} skills created.\n`);

  // ─── 6. TECH STACK ───────────────────────────────────────────────────────────
  console.log('🛠️  Seeding tech stack...');
  const techStackData = [
    // Frontend
    {
      name: 'React.js',
      category: 'Frontend',
      url: 'https://react.dev/',
      order: 0,
    },
    {
      name: 'Next.js',
      category: 'Frontend',
      url: 'https://nextjs.org/',
      order: 1,
    },
    {
      name: 'TypeScript',
      category: 'Frontend',
      url: 'https://www.typescriptlang.org/',
      order: 2,
    },
    {
      name: 'Tailwind CSS',
      category: 'Frontend',
      url: 'https://tailwindcss.com/',
      order: 3,
    },
    // Backend
    {
      name: 'NestJS',
      category: 'Backend',
      url: 'https://nestjs.com/',
      order: 0,
    },
    {
      name: 'Node.js',
      category: 'Backend',
      url: 'https://nodejs.org/',
      order: 1,
    },
    {
      name: '.NET',
      category: 'Backend',
      url: 'https://dotnet.microsoft.com/',
      order: 2,
    },
    {
      name: 'Flask',
      category: 'Backend',
      url: 'https://flask.palletsprojects.com/',
      order: 3,
    },
    {
      name: 'Prisma ORM',
      category: 'Backend',
      url: 'https://www.prisma.io/',
      order: 4,
    },
    // Mobile
    {
      name: 'React Native',
      category: 'Mobile',
      url: 'https://reactnative.dev/',
      order: 0,
    },
    // Database
    {
      name: 'PostgreSQL',
      category: 'Database',
      url: 'https://www.postgresql.org/',
      order: 0,
    },
    {
      name: 'Neon DB',
      category: 'Database',
      url: 'https://neon.tech/',
      order: 1,
    },
    {
      name: 'MongoDB',
      category: 'Database',
      url: 'https://www.mongodb.com/',
      order: 2,
    },
    // Cloud & DevOps
    {
      name: 'Azure DevOps',
      category: 'Cloud & DevOps',
      url: 'https://azure.microsoft.com/en-us/products/devops',
      order: 0,
    },
    {
      name: 'Cloudinary',
      category: 'Cloud & DevOps',
      url: 'https://cloudinary.com/',
      order: 1,
    },
    {
      name: 'Git / GitHub',
      category: 'Cloud & DevOps',
      url: 'https://github.com/',
      order: 2,
    },
    // Tools
    { name: 'Stripe', category: 'Tools', url: 'https://stripe.com/', order: 0 },
    { name: 'Resend', category: 'Tools', url: 'https://resend.com/', order: 1 },
    {
      name: 'Jira',
      category: 'Tools',
      url: 'https://www.atlassian.com/software/jira',
      order: 2,
    },
    {
      name: 'Postman',
      category: 'Tools',
      url: 'https://www.postman.com/',
      order: 3,
    },
  ];
  await prisma.techStack.createMany({ data: techStackData });
  console.log(`  → ${techStackData.length} tech stack items created.\n`);

  // ─── 7. SERVICES ─────────────────────────────────────────────────────────────
  console.log('🚀 Seeding services...');

  const servicesData = [
    {
      title: 'Full-Stack Web Development',
      slug: 'full-stack-web-development',
      description:
        'From idea to deployment — I build complete, scalable web applications with clean architecture, fast performance, and maintainable code that your team can own long-term.',
      content: `## What You Get

A complete, production-ready web application — designed, built, and deployed. I handle the full stack so you don't have to coordinate between multiple developers.

### Frontend
Pixel-perfect, responsive UIs built with **React** and **Next.js** — fast, SEO-friendly, and accessible on every device. Whether it's a marketing site, SaaS dashboard, or customer portal, the frontend is built to convert and engage.

### Backend
Robust REST APIs built with **NestJS** and **Node.js** — with proper authentication, role-based access control, data validation, and error handling baked in from day one. No shortcuts that bite you later.

### Database
Structured, performant data layers using **PostgreSQL** or **MongoDB**, with migrations and a clean ORM layer (Prisma) so your data model evolves cleanly with your product.

### Deployment & CI
Production deployments to cloud platforms with CI/CD pipelines, environment configuration, and monitoring in place.

## Ideal For
- SaaS products and internal tools
- Client portals and dashboards
- Marketplaces and booking platforms
- Corporate websites with CMS capabilities

## Process
1. **Discovery** — requirements, user flows, architecture planning
2. **Design** — wireframes and component library
3. **Development** — iterative sprints with regular demos
4. **Launch** — deployment, testing, handover`,
      isPublished: true,
      seoTitle: 'Full-Stack Web Development | Amal A',
      seoDescription:
        'End-to-end web application development with React, Next.js, NestJS, and PostgreSQL. Clean architecture. Production-ready.',
      tagSlugs: [
        'react',
        'nextjs',
        'nodejs',
        'nestjs',
        'typescript',
        'postgresql',
        'full-stack',
      ],
    },
    {
      title: 'Mobile App Development',
      slug: 'mobile-app-development',
      description:
        'Cross-platform iOS and Android applications built with React Native — native performance, single codebase, and a significantly faster time-to-market compared to building two separate apps.',
      content: `## One Codebase. Two Platforms.

React Native lets us build a truly native mobile experience for both iOS and Android from a single, maintainable codebase — cutting your build cost without cutting corners on quality.

### What I Build
- Consumer-facing mobile apps
- Internal enterprise tools
- Companion apps for existing web platforms
- Event and booking applications

### Technical Approach
- **React Native** with TypeScript for type-safe, maintainable code
- Clean component architecture and navigation
- API integration with your existing or new backend
- Push notifications, offline support, and device features
- App Store and Google Play submission support

### Professional Standards
Having built React Native applications at **Experion Technologies** in a professional, enterprise-grade environment, I bring real-world mobile engineering practices — not just tutorial-level code.

## Ideal For
- Startups needing fast, cross-platform mobile presence
- Businesses extending their web product to mobile
- Internal team apps and field tools`,
      isPublished: true,
      seoTitle: 'Mobile App Development with React Native | Amal A',
      seoDescription:
        'Cross-platform iOS and Android mobile app development with React Native. Fast time-to-market, native performance, professional quality.',
      tagSlugs: ['react-native', 'typescript', 'mobile'],
    },
    {
      title: 'Backend API & System Architecture',
      slug: 'backend-api-architecture',
      description:
        'Robust, secure REST APIs and backend systems designed for scale — whether you need a clean microservice, a CQRS-based enterprise backend, or a well-structured monolith with room to grow.',
      content: `## APIs That Last

The difference between a backend that works and one that scales is architecture. I design and build backend systems with the long term in mind — clean separation of concerns, proper error handling, and security built in from the start.

### What I Deliver
- **REST API design** — clear contracts, proper status codes, versioning
- **Authentication & authorisation** — JWT, refresh tokens, RBAC
- **CQRS architecture** — for complex domains and high-throughput systems
- **Data validation & sanitisation** — at every layer
- **Database design** — normalised schemas, migrations, performance indexing

### Technology
- **NestJS** — enterprise-grade Node.js framework with dependency injection
- **.NET** — for high-performance, strongly-typed enterprise backends
- **Prisma ORM** + **PostgreSQL** — type-safe queries, clean migrations
- **Azure DevOps** — CI/CD pipelines for automated testing and deployment

### Security
Input validation, parameterised queries, rate limiting, CORS configuration, and secure credential management — your API won't become a liability.

## Ideal For
- Startups that need a solid API backbone
- Teams replacing a fragile legacy backend
- Businesses adding a backend to an existing frontend`,
      isPublished: true,
      seoTitle: 'Backend API & System Architecture | Amal A',
      seoDescription:
        'Scalable backend APIs and system architecture with NestJS, .NET, CQRS, and PostgreSQL. Built for security, performance, and long-term maintainability.',
      tagSlugs: ['nestjs', 'nodejs', 'postgresql', 'typescript', 'backend'],
    },
    {
      title: 'Enterprise Software Solutions',
      slug: 'enterprise-software-solutions',
      description:
        'Custom enterprise-grade tools — CRM systems, project management platforms, role-based dashboards, and operational software — built to the standards professional teams actually need.',
      content: `## Software Built for Real Business Needs

Off-the-shelf tools don't always fit. Sometimes your business needs software built specifically for your processes — and built to the quality standards that enterprise teams expect.

### What I Build
- **CRM systems** — customer pipelines, communication tracking, role-based portals
- **Project management tools** — task tracking, team collaboration, reporting dashboards
- **Employee and HR platforms** — onboarding, management, payroll tracking
- **Expense and finance tools** — approval workflows, reporting, integrations
- **Internal admin dashboards** — multi-role access, data management, analytics

### Real Enterprise Experience
At **Experion Technologies**, I built a full Jira-inspired project management platform that won the **Best Project Award** for ILP Batch 2025. This was built following professional engineering standards including CQRS architecture, Azure DevOps pipelines, and enterprise-grade code review processes.

During my freelance period, I delivered an Employee Management System and Expense Management System for real clients — on time, production-ready, and confidential.

### Technical Stack
- **TypeScript** end-to-end for type safety across large codebases
- **RBAC** — granular role-based access control
- **Audit trails** — full history logging for compliance
- **REST APIs** — clean integrations with third-party tools`,
      isPublished: true,
      seoTitle: 'Enterprise Software Solutions | Amal A',
      seoDescription:
        'Custom enterprise software — CRM, project management tools, role-based dashboards — built with TypeScript, NestJS, and .NET to professional standards.',
      tagSlugs: ['typescript', 'nestjs', 'dotnet', 'enterprise', 'full-stack'],
    },
    {
      title: 'Frontend Development & UI/UX',
      slug: 'frontend-development',
      description:
        'Pixel-perfect, performant frontends that turn visitors into clients — fast, accessible, mobile-first, and built with the attention to detail that separates great products from average ones.',
      content: `## First Impressions Are Built in Code

Your frontend is the first thing clients see. A slow, clunky, or confusing interface loses business before a conversation even starts. I build frontends that are fast, beautiful, and intuitive.

### What I Deliver
- **Responsive layouts** — perfect on mobile, tablet, and desktop
- **Component systems** — reusable, documented UI libraries
- **Performance optimisation** — Core Web Vitals, lazy loading, image optimisation
- **Accessibility** — WCAG compliance for broader reach
- **Animations & interactions** — smooth, purposeful motion that enhances UX

### Technology
- **React.js** — component-based architecture, React 18+ features
- **Next.js** — SSR, SSG, ISR for SEO and performance
- **Tailwind CSS** — utility-first styling, design system consistency
- **Framer Motion** — smooth, accessible animations
- **TypeScript** — type-safe, refactorable code

### I'm Not a Designer — I'm a Builder
I work best with an existing design (Figma, etc.) or with design systems, translating visual intent into precise, responsive, maintainable code. I can also work from wireframes or rough briefs for simpler layouts.

## Ideal For
- Marketing sites and landing pages
- SaaS product frontends
- Redesigning slow or outdated UIs`,
      isPublished: true,
      seoTitle: 'Frontend Development with React & Next.js | Amal A',
      seoDescription:
        'High-performance, responsive frontend development with React, Next.js, and Tailwind CSS. Pixel-perfect, accessible, and fast.',
      tagSlugs: ['react', 'nextjs', 'typescript', 'frontend'],
    },
    {
      title: 'AI / ML Integration',
      slug: 'ai-ml-integration',
      description:
        'Bring intelligent features to your product — from recommendation engines and no-code ML platforms to AI-powered analytics and automation — without the complexity of building an ML team.',
      content: `## Intelligence as a Feature

AI and ML don't have to be black boxes. I help you add intelligent, data-driven features to your product in a way that's practical, explainable, and built to last.

### What I Build
- **Recommendation systems** — personalised content, product, or event suggestions
- **No-code ML platforms** — upload data, train models, get predictions (see: EasyML)
- **Data analysis dashboards** — real-time insights from structured data
- **AI-powered analytics** — stock analysis, trend detection, anomaly alerts
- **Automation pipelines** — intelligent data processing and classification

### Real Projects
- **EasyML** — a complete no-code machine learning platform where non-technical users upload datasets, receive model recommendations, run predictions, and download trained models. Built with Python, Streamlit, and Scikit-learn.
- **AI Stock Market Analyzer** — an AI-powered stock analysis tool in active development, combining real-time market data with ML-based prediction models.

### Technology
- **Python** — primary language for data science and ML
- **Scikit-learn** — supervised and unsupervised learning
- **Flask / FastAPI** — lightweight Python APIs to serve ML models
- **Pandas / NumPy** — data wrangling and preprocessing
- **Streamlit** — rapid, interactive data apps

## Ideal For
- Startups wanting to add smart features without a data science team
- Products with datasets that could drive recommendations or insights
- Teams wanting to automate classification, sorting, or pattern detection`,
      isPublished: true,
      seoTitle: 'AI/ML Integration for Web Products | Amal A',
      seoDescription:
        'Practical AI and ML integration — recommendation engines, no-code ML platforms, and intelligent analytics built with Python, Scikit-learn, and Flask.',
      tagSlugs: ['python', 'flask', 'scikit-learn', 'streamlit', 'ai-ml'],
    },
  ];

  for (const s of servicesData) {
    const { tagSlugs, ...serviceFields } = s;
    await prisma.service.create({
      data: {
        ...serviceFields,
        tags: {
          connect: tagSlugs.map((slug) => ({ slug })),
        },
      },
    });
  }
  console.log(`  → ${servicesData.length} services created.\n`);

  // ─── 8. PROJECTS ─────────────────────────────────────────────────────────────
  console.log('📦 Seeding projects...');

  const projectsData = [
    {
      title: 'Jira-like Project Management Tool',
      slug: 'jira-like-project-management-tool',
      summary:
        'Award-winning enterprise project management platform built during Experion ILP — full task tracking, sprint boards, team collaboration, and progress reporting.',
      content: `## Overview

Built during Experion Technologies' Initial Learning Program (ILP) in 2025, this project management tool was inspired by Jira and built to enterprise standards. The project won the **Best Project Award for ILP Batch 2025** at Experion Technologies.

## What It Does

- **Task & issue tracking** — create, assign, prioritise, and track tasks across sprints
- **Board views** — Kanban-style sprint boards with drag-and-drop
- **Team collaboration** — comments, mentions, activity feeds
- **Project workflows** — customisable status workflows per project
- **Reporting** — sprint velocity, burndown charts, workload distribution

## Architecture

Built using **CQRS (Command Query Responsibility Segregation)** architecture, separating read and write operations for clarity, scalability, and testability. Development followed professional Azure DevOps pipelines with automated builds and deployments.

## Key Achievements

- 🏆 **Best Project Award — ILP Batch 2025**, Experion Technologies
- 👥 Built and delivered as **Team Lead**
- ✅ Followed enterprise code review, testing, and deployment practices`,
      isPublished: true,
      seoTitle: 'Jira-like Project Management Tool | Amal A',
      seoDescription:
        'Award-winning enterprise project management tool built at Experion Technologies ILP 2025. CQRS architecture, sprint boards, task tracking, and team collaboration.',
      tagSlugs: ['typescript', 'dotnet', 'enterprise', 'full-stack'],
    },
    {
      title: 'Collab-E — University Event Management Platform',
      slug: 'collab-e',
      summary:
        'Full-featured event management web app for university campuses — event creation, Stripe-powered booking, AI-powered personalised recommendations, and multi-platform authentication.',
      content: `## Overview

Collab-E is a comprehensive event management platform built for university campuses. It brings together event discovery, booking, and community engagement in one place.

## Key Features

- **Event creation & management** — full event lifecycle from creation to post-event analytics
- **Stripe payment integration** — secure ticket booking with real-time payment processing
- **AI-powered recommendations** — personalised event suggestions based on user interests and history
- **Multi-platform authentication** — social login and email-based auth
- **Real-time data** — live updates for seat availability and event status
- **Responsive design** — seamless experience across mobile and desktop

## Tech Stack

Built on the **MERN Stack** (MongoDB, Express, React, Node.js) with:
- **Stripe** for payment processing
- **AI integration** for personalisation
- JWT-based authentication with refresh tokens
- RESTful API architecture`,
      isPublished: true,
      seoTitle: 'Collab-E — Event Management Platform | Amal A',
      seoDescription:
        'University event management web app with Stripe payments, AI recommendations, and multi-platform auth. Built with the MERN stack.',
      tagSlugs: [
        'react',
        'nodejs',
        'mongodb',
        'stripe',
        'mern-stack',
        'full-stack',
      ],
    },
    {
      title: 'Sharetable — Food Distribution Platform',
      slug: 'sharetable',
      summary:
        'A socially responsible platform connecting food donors with public food hubs — optimising resource allocation, reducing waste, and ensuring food reaches communities that need it most.',
      content: `## Overview

Sharetable addresses food waste and food insecurity simultaneously — a platform that connects surplus food sources with public food hubs, making the distribution process transparent, efficient, and scalable.

## The Problem

Tonnes of food go to waste daily while communities nearby lack access to meals. The gap between surplus and need is a logistics and coordination problem — one that software can meaningfully address.

## What Sharetable Does

- **Food hub management** — register, manage, and track food hubs and their capacity
- **Donation workflows** — donors submit contributions, hubs confirm receipt
- **Resource allocation optimisation** — smart matching of donations to nearby hubs
- **Waste reduction tracking** — metrics on food diverted from landfill
- **User authentication** — secure accounts for donors, hubs, and administrators
- **Impact dashboard** — real-time data on meals distributed and waste reduced

## Tech Stack

MERN Stack (MongoDB, Express, React, Node.js) with:
- Role-based access for donors, hub managers, and admins
- REST API with proper authentication
- Real-time status updates`,
      isPublished: true,
      seoTitle: 'Sharetable — Food Distribution Platform | Amal A',
      seoDescription:
        'Social impact platform for food distribution — connecting donors with public food hubs to reduce waste and fight food insecurity. Built with MERN.',
      tagSlugs: ['react', 'nodejs', 'mongodb', 'mern-stack', 'full-stack'],
    },
    {
      title: 'CRM System — Role-Based Customer Management',
      slug: 'crm-system',
      summary:
        'Enterprise CRM with three distinct portals — Admin, Employee, and Client — built with TypeScript, role-based access control, and scalable architecture for streamlined customer relationship management.',
      content: `## Overview

A fully-featured Customer Relationship Management (CRM) system with distinct, purpose-built portals for each role type — ensuring that every user sees exactly what they need, nothing more.

## Role Portals

### Admin Portal
- Full system oversight — users, clients, pipelines, and analytics
- User management: create, update, deactivate accounts
- Reporting and performance metrics

### Employee Portal
- Personal client pipeline management
- Task and follow-up tracking
- Communication history with clients

### Client Portal
- Self-service account management
- Service request and status tracking
- Communication with assigned employees

## Technical Highlights

- **TypeScript** throughout — type-safe, refactorable codebase
- **RBAC** — granular permissions per role
- **JWT authentication** — secure sessions with refresh tokens
- **Clean architecture** — separation of business logic from controllers and persistence
- RESTful API with proper data validation at every layer`,
      isPublished: true,
      seoTitle: 'CRM System with RBAC | Amal A',
      seoDescription:
        'Enterprise CRM with Admin, Employee, and Client portals. Built with TypeScript, NestJS, and role-based access control.',
      tagSlugs: ['typescript', 'nodejs', 'nestjs', 'enterprise', 'full-stack'],
    },
    {
      title: 'EasyML — No-Code Machine Learning Platform',
      slug: 'easyml',
      summary:
        'A no-code ML platform that democratises machine learning — upload a dataset, get model recommendations, run predictions, and download trained models. No coding required.',
      content: `## Overview

EasyML makes machine learning accessible to anyone — business analysts, researchers, and domain experts — without requiring a single line of Python. Upload your data, choose your goal, and let the platform handle the rest.

## How It Works

1. **Upload your dataset** — CSV, Excel, or JSON
2. **Auto-preprocessing** — EasyML handles missing values, encoding, and normalisation automatically
3. **Model recommendation** — the platform evaluates multiple algorithms and recommends the best fit
4. **Train & evaluate** — see accuracy metrics, feature importance, and model diagnostics
5. **Make predictions** — input new data and get instant predictions
6. **Download your model** — export the trained model for integration into other systems

## Supported Tasks

- **Classification** — spam detection, customer churn, disease diagnosis, sentiment analysis
- **Regression** — price prediction, demand forecasting, performance estimation

## Tech Stack

- **Python** — core ML processing
- **Scikit-learn** — model training, evaluation, AutoML pipeline
- **Streamlit** — interactive web interface (no frontend framework needed)
- **Pandas / NumPy** — data preprocessing and analysis
- **Pickle / Joblib** — model serialisation and download`,
      isPublished: true,
      seoTitle: 'EasyML — No-Code Machine Learning Platform | Amal A',
      seoDescription:
        'Upload your dataset, get model recommendations, run predictions, and download trained ML models. No coding required. Built with Python, Scikit-learn, and Streamlit.',
      tagSlugs: ['python', 'scikit-learn', 'streamlit', 'flask', 'ai-ml'],
    },
    {
      title: 'AI Stock Market Analyzer',
      slug: 'ai-stock-analyzer',
      summary:
        'An AI-powered stock market analysis tool in active development — combining real-time market data, ML-based trend detection, and interactive dashboards for smarter investment insights.',
      content: `## Overview

The AI Stock Market Analyzer is an ongoing project that combines real-time financial data with machine learning models to surface actionable market insights — going beyond raw charts to provide intelligent analysis.

## Vision

Most retail investors are overwhelmed by data but starved of insight. This tool bridges that gap — processing historical prices, news sentiment, and technical indicators to provide clear, data-backed signals.

## Planned Features

- **Real-time price feeds** — live data from stock market APIs
- **Technical indicator analysis** — RSI, MACD, Bollinger Bands with ML-enhanced signals
- **Trend prediction** — supervised ML models trained on historical patterns
- **News sentiment analysis** — NLP-based processing of financial news
- **Interactive dashboards** — visualise patterns, correlations, and predictions
- **Portfolio tracking** — monitor holdings against predictions

## Current Status

**In active development.** Core data pipeline and ML models are being built and evaluated. Frontend dashboard design in progress.

## Tech Stack

- Python (ML pipeline)
- Financial data APIs
- Scikit-learn / time-series ML
- Interactive visualisation (in progress)`,
      isPublished: true,
      seoTitle: 'AI Stock Market Analyzer | Amal A',
      seoDescription:
        'AI-powered stock market analysis tool combining real-time data, ML trend detection, and interactive dashboards. In active development.',
      tagSlugs: ['python', 'scikit-learn', 'ai-ml'],
    },
    {
      title: 'Product Builder Portfolio',
      slug: 'product-builder-portfolio',
      summary:
        'This portfolio site — a full-stack CMS-powered portfolio with Next.js, NestJS, PostgreSQL, Cloudinary, and Resend. Production-grade architecture demonstrating what I build for clients.',
      content: `## Overview

This portfolio itself is a product — built with the same standards, architecture, and attention to detail I bring to every client project. It's not a template; it's a full-stack application.

## Architecture

### Backend (NestJS)
- 14 domain modules (Profile, Projects, Services, Skills, Experience, Education, Testimonials, Blog, Awards, and more)
- JWT authentication with refresh token rotation
- Role-based admin panel with full CMS capabilities
- File uploads via Cloudinary
- Transactional email via Resend
- Swagger API documentation
- Rate limiting and security headers

### Frontend (Next.js)
- Server-side rendering with ISR for performance + SEO
- Dynamic OG image generation
- RSS feed, sitemap, robots.txt
- JSON-LD structured data for rich search results
- Framer Motion animations
- Dark mode with glassmorphism design

### Infrastructure
- PostgreSQL on Neon DB (serverless)
- API deployed on cloud
- Frontend deployed on Vercel

## Why This Matters

Every feature of this portfolio is something I can build for you. The admin panel, the CMS, the email system, the SEO infrastructure — it all exists and works in production.`,
      isPublished: true,
      seoTitle: 'Product Builder Portfolio | Amal A',
      seoDescription:
        'Full-stack CMS-powered portfolio built with Next.js, NestJS, PostgreSQL, Cloudinary, and Resend. Production-grade architecture.',
      tagSlugs: ['nextjs', 'nestjs', 'typescript', 'postgresql', 'full-stack'],
    },
  ];

  for (const p of projectsData) {
    const { tagSlugs, ...projectFields } = p;
    await prisma.project.create({
      data: {
        ...projectFields,
        tags: {
          connect: tagSlugs.map((slug) => ({ slug })),
        },
      },
    });
  }
  console.log(`  → ${projectsData.length} projects created.\n`);

  // ─── 9. AWARDS ───────────────────────────────────────────────────────────────
  console.log('🏆 Seeding awards...');
  const awardsData = [
    {
      title: 'Best Outgoing Student — CSE Department',
      issuer: "St. Joseph's College of Engineering and Technology, Palai",
      description:
        'Awarded for outstanding academic performance (CGPA 8.62), leadership contributions across IEEE and CSI, and overall impact on the CSE department throughout B.Tech.',
      year: 2025,
      order: 0,
      isPublished: true,
    },
    {
      title: 'Best Project Award — ILP Batch 2025',
      issuer: 'Experion Technologies',
      description:
        'Won Best Project Award for building a Jira-inspired enterprise project management tool during the Initial Learning Program at Experion Technologies. Led the team as Team Lead.',
      year: 2025,
      order: 1,
      isPublished: true,
    },
    {
      title: "First Prize — 'Arcane' Hackathon",
      issuer: "Kerala's First Tri-Venue Hackathon",
      description:
        "Won first place at 'Arcane' — Kerala's first tri-venue hackathon, spanning three simultaneous venues. Competed and won against teams from colleges across the state.",
      year: 2024,
      order: 2,
      isPublished: true,
    },
    {
      title: "Second Prize — 'Beyond the Loop' Hackathon",
      issuer: 'IEEE SB ICET × NocoDB',
      description:
        "Runner-up at the 24-hour hackathon 'Beyond the Loop' organised by IEEE SB ICET in collaboration with NocoDB. Competed over a full day of intensive building.",
      year: 2024,
      order: 3,
      isPublished: true,
    },
    {
      title: 'Smart India Hackathon 2023 — Prelims Qualifier',
      issuer: 'Government of India',
      description:
        'Qualified for the preliminary round of Smart India Hackathon 2023 — one of the largest hackathons in the world, competing among thousands of student teams nationwide.',
      year: 2023,
      order: 4,
      isPublished: true,
    },
  ];
  await prisma.award.createMany({ data: awardsData });
  console.log(`  → ${awardsData.length} awards created.\n`);

  console.log('🎉 Seeding complete!');
  console.log('   Profile: 1 | Education: 9 | Experience: 11');
  console.log('   Skills: 35 | TechStack: 20 | Services: 6');
  console.log('   Projects: 7 | Awards: 5 | Tags: 22');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
