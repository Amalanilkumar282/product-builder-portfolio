import { fetchServices } from '@/lib/api';

export const metadata = {
  title: 'Services',
  description: 'Professional services I offer as a product builder.',
};

export default async function ServicesPage() {
  const services = await fetchServices();

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Services</h1>

      <ul className="space-y-6">
        {services.map((service: any) => (
          <li key={service.id} className="border-b pb-4">
            <h2 className="text-xl font-semibold">
              <a href={`/services/${service.slug}`} className="hover:underline">
                {service.title}
              </a>
            </h2>

            <p className="text-gray-600 mt-2">
              {service.description}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
