-- Corrige drift: distribuicoes.administrativo_responsavel_id passa a ser opcional
-- (com FK ON DELETE SET NULL) e o índice único de reuniao_processos passa a ser
-- composto (inicial_id, instancia), permitindo mais de uma reunião por processo.

-- DropForeignKey
ALTER TABLE `distribuicoes` DROP FOREIGN KEY `distribuicoes_administrativo_responsavel_id_fkey`;

-- AlterTable: tornar o administrativo responsável opcional
ALTER TABLE `distribuicoes` MODIFY `administrativo_responsavel_id` VARCHAR(191) NULL;

-- Limpa referências órfãs (usuário inexistente) antes de re-validar a FK
UPDATE `distribuicoes` SET `administrativo_responsavel_id` = NULL
  WHERE `administrativo_responsavel_id` IS NOT NULL
    AND `administrativo_responsavel_id` NOT IN (SELECT `id` FROM `usuarios`);

-- AddForeignKey (ON DELETE SET NULL)
ALTER TABLE `distribuicoes` ADD CONSTRAINT `distribuicoes_administrativo_responsavel_id_fkey` FOREIGN KEY (`administrativo_responsavel_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Reuniao: cria o índice composto ANTES de dropar o antigo (a FK usa o índice)
CREATE UNIQUE INDEX `reuniao_processos_inicial_id_instancia_key` ON `reuniao_processos`(`inicial_id`, `instancia`);
DROP INDEX `reuniao_processos_inicial_id_key` ON `reuniao_processos`;
