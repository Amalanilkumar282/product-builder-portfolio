export class CreateServiceDto {
  title: string;
  slug: string;
  description: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublished?: boolean;
}
