import { fetchService } from '@/lib/api';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const service = await fetchService(params.slug);

  if (!service) return {};

  return {
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = await fetchService(params.slug);

  if (!service) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">{service.title}</h1>

      <p className="text-gray-600 mb-8">
        {service.description}
      </p>

      <article className="prose max-w-none">
        {service.content}
      </article>
    </main>
  );
}
