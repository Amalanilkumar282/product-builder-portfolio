import { fetchProjects } from '@/lib/api';

export const metadata = {
  title: 'Projects',
  description: 'Case studies and projects I have built as a product builder.',
};

export default async function ProjectsPage() {
  const projects = await fetchProjects();

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>

      <ul className="space-y-6">
        {projects.map((project: any) => (
          <li key={project.id} className="border-b pb-4">
            <h2 className="text-xl font-semibold">
              <a
                href={`/projects/${project.slug}`}
                className="hover:underline"
              >
                {project.title}
              </a>
            </h2>

            <p className="text-gray-600 mt-2">
              {project.summary}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
