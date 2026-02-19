import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        this.initializeTransporter();
    }

    private initializeTransporter() {
        const mailHost = process.env.MAIL_HOST;
        const mailPort = parseInt(process.env.MAIL_PORT || '587');
        const mailUser = process.env.MAIL_USER;
        const mailPassword = process.env.MAIL_PASSWORD;

        if (mailHost && mailUser && mailPassword) {
            this.transporter = nodemailer.createTransport({
                host: mailHost,
                port: mailPort,
                secure: mailPort === 465, // true para 465, false para otros puertos
                auth: {
                    user: mailUser,
                    pass: mailPassword,
                },
            });

            this.logger.log('✅ Email transporter configurado correctamente');
        } else {
            this.logger.warn(
                '⚠️  MAIL_HOST, MAIL_USER o MAIL_PASSWORD no configurados. Los emails serán solo logueados en consola.',
            );
        }
    }

    async sendTemporaryPassword(
        email: string,
        firstName: string,
        temporaryPassword: string,
        buildingName: string,
    ): Promise<boolean> {
        try {
            const mailFrom = process.env.MAIL_FROM || 'noreply@buildingmanager.com';
            const mailFromName = process.env.MAIL_FROM_NAME || 'Building Manager';

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #667eea; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                        .credentials { background-color: #fff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
                        .footer { font-size: 12px; color: #666; margin-top: 20px; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Bienvenido a Building Manager</h1>
                        </div>
                        <div class="content">
                            <p>Hola <strong>${firstName}</strong>,</p>
                            <p>Se ha creado tu cuenta en el edificio <strong>${buildingName}</strong>.</p>
                            <p>Aquí están tus credenciales de acceso:</p>
                            
                            <div class="credentials">
                                <p><strong>Email:</strong> ${email}</p>
                                <p><strong>Contraseña Temporal:</strong> <code>${temporaryPassword}</code></p>
                            </div>

                            <p>⚠️ <strong>Por favor, cambia esta contraseña en tu primer login.</strong></p>

                            <p>Para acceder a tu cuenta:</p>
                            <ol>
                                <li>Ve a la página de login</li>
                                <li>Ingresa con tu email y la contraseña temporal</li>
                                <li>Cambia tu contraseña en la sección de perfil</li>
                            </ol>

                            <p>Si tienes problemas, contacta al administrador del edificio.</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 Building Manager. Este es un mensaje automático, por favor no respondas.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            if (this.transporter) {
                // Envío real
                await this.transporter.sendMail({
                    from: `${mailFromName} <${mailFrom}>`,
                    to: email,
                    subject: `Credenciales de Acceso - ${buildingName}`,
                    html: htmlContent,
                });

                this.logger.log(`✅ Email enviado correctamente a: ${email}`);
                return true;
            } else {
                // Modo simulado - solo logs
                this.logger.warn(
                    `[MODO SIMULADO] Email NO fue enviado. Credenciales para ${email}:`,
                );
                this.logger.warn(`
╔════════════════════════════════════════════════════╗
║         CREDENCIALES - MODO SIMULADO              ║
╠════════════════════════════════════════════════════╣
║ Email:     ${email}
║ Nombre:    ${firstName}
║ Edificio:  ${buildingName}
║ Contraseña: ${temporaryPassword}
║
║ ⚠️  CONFIGURE EL EMAIL PARA ENVIAR EN PRODUCCIÓN  ║
╚════════════════════════════════════════════════════╝
                `);
                return true; // Retornamos true para no bloquear el flujo
            }
        } catch (error) {
            this.logger.error(`❌ Error al enviar email a ${email}:`, error);
            // No lanzamos el error para no bloquear el flujo de creación de usuario
            // El usuario verá las credenciales en la consola
            return true;
        }
    }
}
