interface EnviarEmailComAnexoParams {
    to: string[];
    subject: string;
    html: string;
    text?: string;
    attachments: Array<{
        filename: string;
        content: Buffer;
        contentType?: string;
    }>;
}
export declare class EmailService {
    configurado(): boolean;
    enviarComAnexo(params: EnviarEmailComAnexoParams): Promise<import("resend").CreateEmailResponseSuccess>;
    private normalizarDestinatarios;
    private tamanhoMaximoAnexoBytes;
}
export {};
