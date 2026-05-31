import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { Resend } from 'resend';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private resend: Resend | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const apiKey = this.config.get<string>('app.resend.apiKey');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn('RESEND_API_KEY not set — email notifications disabled');
    }
  }

  async create(dto: CreateContactInquiryDto) {
    const inquiry = await this.prisma.contactInquiry.create({ data: dto });

    // Fire-and-forget email notification
    this.sendNotificationEmail(inquiry).catch((err) =>
      this.logger.error('Failed to send contact notification email', err),
    );

    return { message: 'Your message has been received. I will get back to you soon!' };
  }

  private async sendNotificationEmail(inquiry: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const fromEmail = this.config.get<string>('app.resend.fromEmail');
    const notifyEmail = this.config.get<string>('app.resend.notifyEmail');

    if (!notifyEmail || !fromEmail || !this.resend) return;

    await this.resend.emails.send({
      from: fromEmail,
      to: notifyEmail,
      subject: `New Contact Inquiry: ${inquiry.subject}`,
      html: `
        <h2>New Contact Inquiry</h2>
        <p><strong>From:</strong> ${inquiry.name} (${inquiry.email})</p>
        <p><strong>Subject:</strong> ${inquiry.subject}</p>
        <hr />
        <p>${inquiry.message.replace(/\n/g, '<br />')}</p>
      `,
    });
  }

  findAll() {
    return this.prisma.contactInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const inquiry = await this.prisma.contactInquiry.findUnique({ where: { id } });
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }

  async updateStatus(id: string, dto: UpdateContactStatusDto) {
    await this.findOne(id);
    return this.prisma.contactInquiry.update({ where: { id }, data: { status: dto.status } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contactInquiry.delete({ where: { id } });
  }
}
