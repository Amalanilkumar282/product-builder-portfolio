import Link from 'next/link';
import { fetchServices, fetchProjects } from '@/lib/api';

export const metadata = {
  title: 'Freelance Product Builder',
  description:
    'I build modern websites, admin panels, and scalable digital products.',
};

export default async function HomePage() {
  const services = await fetchServices();
  const projects = await fetchProjects();

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 space-y-24">
      {/* HERO */}
      <section>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          I build digital products that scale.
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          I’m a freelance product builder helping startups and businesses
          build websites, admin panels, and complete systems.
        </p>

        <div className="flex gap-4">
          <Link
            href="/contact"
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Contact Me
          </Link>

          <Link
            href="/projects"
            className="px-6 py-3 border rounded-lg"
          >
            View Projects
          </Link>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Services</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {services.slice(0, 4).map((service: any) => (
            <div key={service.id} className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                <Link href={`/services/${service.slug}`}>
                  {service.title}
                </Link>
              </h3>

              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link href="/services" className="underline">
            View all services →
          </Link>
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Projects</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.slice(0, 4).map((project: any) => (
            <div key={project.id} className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                <Link href={`/projects/${project.slug}`}>
                  {project.title}
                </Link>
              </h3>

              <p className="text-gray-600">
                {project.summary}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link href="/projects" className="underline">
            View all projects →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center border-t pt-16">
        <h2 className="text-3xl font-bold mb-4">
          Let’s build something together
        </h2>

        <p className="text-gray-600 mb-6">
          Have an idea or need a reliable developer? Let’s talk.
        </p>

        <Link
          href="/contact"
          className="px-8 py-4 bg-black text-white rounded-lg"
        >
          Get in touch
        </Link>
      </section>
    </main>
  );
}
