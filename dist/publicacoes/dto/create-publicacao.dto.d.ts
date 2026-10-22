import { $Enums } from '@prisma/client';
export declare class CreatePublicacaoDto {
    numero_processo: string;
    tipo_documento: $Enums.Tipo_Documento;
    colegiado: $Enums.Colegiado;
    tecnico_rf: string;
    unidade_id: string;
    data_emissao: Date;
    data_publicacao: Date;
    prazo: number;
}
