-- Campos adicionais dos processos levantados pelos usuários na revisão da
-- planilha de importação (detalhes operacionais do fluxo).

-- AlterTable
ALTER TABLE `iniciais`
  ADD COLUMN `numero_requerimento` VARCHAR(191) NULL,
  ADD COLUMN `ar_ou_rr` VARCHAR(191) NULL,
  ADD COLUMN `numero_guia_tev` VARCHAR(191) NULL,
  ADD COLUMN `guia_vinculada_outro` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `reuniao_processos`
  ADD COLUMN `data_publicacao` DATE NULL;
