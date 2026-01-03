const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// ---------- SERVICES ----------

export async function fetchServices() {
  const res = await fetch(`${API_URL}/services`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch services');
  }

  return res.json();
}

export async function fetchService(slug: string) {
  const res = await fetch(`${API_URL}/services/${slug}`);

  if (!res.ok) {
    return null;
  }

  return res.json();
}

// ---------- PROJECTS ----------

export async function fetchProjects() {
  const res = await fetch(`${API_URL}/projects`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  return res.json();
}

export async function fetchProject(slug: string) {
  const res = await fetch(`${API_URL}/projects/${slug}`);

  if (!res.ok) {
    return null;
  }

  return res.json();
}
