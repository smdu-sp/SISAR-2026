
export class Data {
  nome: string;
  count: number;
}

export class Smul_Graproem {
  quantidade: number;
  data: Data[];
}

export class RelatorioData {
  smul: Smul_Graproem;
  graproem: Smul_Graproem;
  total_parcial: number;
}

export class RelatorioResopnseDto {
  total: number;
  analise: number;
  inadimissiveis: number;
  admissiveis: number;
  data_gerado: string;
  em_analise?: RelatorioData;
  deferidos?: RelatorioData;
  indeferidos?: RelatorioData;
}

export class PeriodFilterDto {
  gte: Date;
  lte: Date
}
