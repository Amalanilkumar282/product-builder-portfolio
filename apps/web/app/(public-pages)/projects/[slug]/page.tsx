import { fetchProject } from '@/lib/api';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const project = await fetchProject(params.slug);

  if (!project) return {};

  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await fetchProject(params.slug);

  if (!project) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">
        {project.title}
      </h1>

      <p className="text-gray-600 mb-6">
        {project.summary}
      </p>

      <div className="flex gap-4 mb-8">
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            className="px-4 py-2 bg-black text-white rounded"
          >
            Live Demo
          </a>
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            className="px-4 py-2 border rounded"
          >
            GitHub
          </a>
        )}
      </div>

      <article className="prose max-w-none">
        {project.content}
      </article>
    </main>
  );
}
