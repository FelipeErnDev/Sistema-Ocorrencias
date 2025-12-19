import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private slackWebhook?: string;
  private genericWebhook?: string;

  constructor(private config: ConfigService) {
    this.slackWebhook = this.config.get<string>('SLACK_WEBHOOK_URL');
    this.genericWebhook = this.config.get<string>('GENERIC_WEBHOOK_URL');
  }

  async notifyCreate(payload: any) {
    const text = `Nova ocorrencia criada: #${payload.id} - ${payload.titulo}`;
    await this.sendNotifications('create', payload, text);
  }

  async notifyStatusChange(payload: any, oldStatus?: string, newStatus?: string) {
    const text = `Ocorrencia #${payload.id} mudou status: ${oldStatus ?? 'desconhecido'} -> ${newStatus ?? 'desconhecido'}`;
    await this.sendNotifications('status_change', { ...payload, oldStatus, newStatus }, text);
  }

  async notifyAssignment(payload: any, assignedTo?: any) {
    const text = `Ocorrencia #${payload.id} atribuida a ${assignedTo?.nome ?? assignedTo?.email ?? 'usuário desconhecido'}`;
    await this.sendNotifications('assignment', { ...payload, assignedTo }, text);
  }

  private async sendNotifications(event: string, payload: any, text: string) {
    const body = { event, payload, text, timestamp: new Date().toISOString() };
    // send to generic webhook if configured
    if (this.genericWebhook) {
      try {
        await this.postJson(this.genericWebhook, body);
      } catch (err) {
        this.logger.warn(`Failed to send generic webhook: ${err}`);
      }
    }

    // send to slack if configured
    if (this.slackWebhook) {
      try {
        // Slack incoming webhook expects { text: '...' }
        await this.postJson(this.slackWebhook, { text });
      } catch (err) {
        this.logger.warn(`Failed to send slack webhook: ${err}`);
      }
    }
  }

  private postJson(url: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const parsed = new URL(url);
        const body = JSON.stringify(data);
        const opts: https.RequestOptions = {
          hostname: parsed.hostname,
          port: parsed.port ? Number(parsed.port) : (parsed.protocol === 'https:' ? 443 : 80),
          path: parsed.pathname + (parsed.search || ''),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        };

        const req = https.request(opts, (res) => {
          const chunks: Uint8Array[] = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => {
            const resp = Buffer.concat(chunks).toString('utf8');
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve();
            } else {
              reject(new Error(`Webhook ${url} returned ${res.statusCode}: ${resp}`));
            }
          });
        });
        req.on('error', (e) => reject(e));
        req.write(body);
        req.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
