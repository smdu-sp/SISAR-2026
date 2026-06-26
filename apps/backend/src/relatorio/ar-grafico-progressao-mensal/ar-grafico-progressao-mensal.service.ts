import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

export interface ProgressaoMensalAno {
  ano: number;
  mes: number[];
  acc: number[];
}

@Injectable()
export class ArGraficoProgressaoMensalService {
  constructor(private prisma: PrismaService) {}

  async getAllByYear(year: number): Promise<ProgressaoMensalAno[]> {
    return this.getByYearRange(year, year);
  }

  async getByYearRange(
    anoInicial: number,
    anoFinal: number,
  ): Promise<ProgressaoMensalAno[]> {
    const inicio = this.normalizarAno(anoInicial, 'anoInicial');
    const fim = this.normalizarAno(anoFinal, 'anoFinal');

    if (inicio > fim) {
      throw new BadRequestException('Ano inicial não pode ser maior que o ano final.');
    }

    const dataInicio = new Date(inicio, 0, 1);
    const dataFim = new Date(fim + 1, 0, 1);

    const admissibilidades = await this.prisma.admissibilidade.findMany({
      where: {
        criado_em: {
          gte: dataInicio,
          lt: dataFim,
        },
      },
      select: {
        criado_em: true,
      },
      orderBy: {
        criado_em: 'asc',
      },
    });

    const porAno = new Map<number, number[]>();
    for (let ano = inicio; ano <= fim; ano++) {
      porAno.set(ano, Array(12).fill(0));
    }

    for (const admissibilidade of admissibilidades) {
      const data = admissibilidade.criado_em;
      const ano = data.getFullYear();
      const mes = data.getMonth();
      const mensal = porAno.get(ano);

      if (mensal) {
        mensal[mes] += 1;
      }
    }

    const resultado = Array.from(porAno.entries()).map(([ano, mes]) => {
      let acumulado = 0;
      const acc = mes.map((totalMes) => {
        acumulado += totalMes;
        return acumulado;
      });

      return { ano, mes, acc };
    });

    return resultado;
  }

  private normalizarAno(valor: number, nomeCampo: string): number {
    const ano = Number(valor);

    if (!Number.isInteger(ano) || ano < 1900 || ano > 3000) {
      throw new BadRequestException(`${nomeCampo} inválido.`);
    }

    return ano;
  }
}
