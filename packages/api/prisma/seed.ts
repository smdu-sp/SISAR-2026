import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const devUser = {
  login: 'd854440',
  nome: 'Bruno Luiz Vieira',
  email: 'blvieira@prefeitura.sp.gov.br',
  status: 1,
  permissao: 'DEV' as const,
};

const unidadeAtic = {
  nome: 'Assessoria de Tecnologia da Informação e Comunicação',
  sigla: 'ATIC',
  codigo: 'ATIC',
  status: 1,
};

const subprefeituraSe = {
  nome: 'Subprefeitura da Sé',
  sigla: 'SÉ',
  status: 1,
};

const unidadesSetoriais = [
  { sigla: 'PARHIS', nome: 'Patrimônio Histórico', codigo: 'PARHIS' },
  { sigla: 'RESID', nome: 'Residencial', codigo: 'RESID' },
  { sigla: 'SERVIN', nome: 'Serviços Institucionais', codigo: 'SERVIN' },
  { sigla: 'COMIN', nome: 'Comercial e Industrial', codigo: 'COMIN' },
  { sigla: 'CAEPP', nome: 'Centro de Apoio ao Empreendimento', codigo: 'CAEPP' },
  { sigla: 'SMUL', nome: 'Secretaria Municipal de Urbanismo e Licenciamento', codigo: 'SMUL' },
  { sigla: 'GRAPROEM', nome: 'GRAPROEM', codigo: 'GRAPROEM' },
];

// Sigla deixou de ser única (unidades unificadas com níveis), então
// upsert por sigla vira findFirst + create/update manual.
async function upsertUnidadePorSigla(data: {
  sigla: string;
  nome: string;
  codigo: string;
  status?: number;
}) {
  const existente = await prisma.unidade.findFirst({
    where: { sigla: data.sigla },
  });
  if (existente)
    return prisma.unidade.update({
      where: { id: existente.id },
      data: { nome: data.nome, codigo: data.codigo, status: data.status ?? 1 },
    });
  return prisma.unidade.create({ data: { ...data, status: data.status ?? 1 } });
}

async function main() {
  const unidade = await upsertUnidadePorSigla(unidadeAtic);

  const subprefeitura = await prisma.subprefeitura.upsert({
    where: { sigla: subprefeituraSe.sigla },
    create: subprefeituraSe,
    update: subprefeituraSe,
  });

  const setores = [];
  for (const u of unidadesSetoriais) {
    setores.push(await upsertUnidadePorSigla({ ...u, status: 1 }));
  }

  const existingByEmail = await prisma.usuario.findUnique({
    where: { email: devUser.email },
  });

  const root = existingByEmail
    ? await prisma.usuario.update({
        where: { email: devUser.email },
        data: { ...devUser, unidade_id: unidade.id },
      })
    : await prisma.usuario.upsert({
        where: { login: devUser.login },
        create: { ...devUser, unidade_id: unidade.id },
        update: { ...devUser, unidade_id: unidade.id },
      });

  console.log({ unidade, subprefeitura, setores: setores.length, usuario: root });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
