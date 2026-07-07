import { ApiProperty } from '@nestjs/swagger';

export type StatusLinhaImportacao = 'criado' | 'duplicado' | 'erro';

export class DetalheLinhaImportacaoDTO {
  @ApiProperty()
  linha: number;
  @ApiProperty()
  sei: string;
  @ApiProperty({ enum: ['criado', 'duplicado', 'erro'] })
  status: StatusLinhaImportacao;
  @ApiProperty({ required: false })
  mensagem?: string;
}

export class ImportarInicialResponseDTO {
  @ApiProperty({ description: 'Total de linhas de dados lidas na planilha.' })
  total: number;
  @ApiProperty({ description: 'Processos criados com sucesso.' })
  criados: number;
  @ApiProperty({ description: 'Linhas ignoradas por SEI já existente.' })
  duplicados: number;
  @ApiProperty({ description: 'Linhas com erro de validação/criação.' })
  erros: number;
  @ApiProperty({ type: [DetalheLinhaImportacaoDTO] })
  detalhes: DetalheLinhaImportacaoDTO[];
}
