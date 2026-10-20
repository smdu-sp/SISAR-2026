import { Inicial } from "@prisma/client";

export class AvisosResponseDTO {
  id: string;
  titulo: string;
  descricao: string;
  data: Date;
  usuario_id: string | null;
  inicial_id: number;
  criado_em: Date;
  alterado_em: Date;
}

export class AvisosPorDataResponseDTO {
  inicial: Inicial;
}
