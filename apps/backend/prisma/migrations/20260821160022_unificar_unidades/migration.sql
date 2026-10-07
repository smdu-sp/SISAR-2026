-- DropForeignKey
ALTER TABLE `diretorias` DROP FOREIGN KEY `diretorias_coordenadoria_id_fkey`;

-- DropForeignKey
ALTER TABLE `publicacoes` DROP FOREIGN KEY `publicacoes_coordenadoria_id_fkey`;

-- DropIndex
DROP INDEX `unidades_codigo_key` ON `unidades`;

-- DropIndex
DROP INDEX `unidades_nome_key` ON `unidades`;

-- DropIndex
DROP INDEX `unidades_sigla_key` ON `unidades`;

-- AlterTable
ALTER TABLE `unidades` ADD COLUMN `nivel` ENUM('COORDENADORIA', 'DIRETORIA', 'UNIDADE') NOT NULL DEFAULT 'UNIDADE',
    ADD COLUMN `unidade_pai_id` VARCHAR(191) NULL,
    MODIFY `sigla` VARCHAR(191) NULL,
    MODIFY `codigo` VARCHAR(191) NULL,
    MODIFY `status` INTEGER NOT NULL DEFAULT 1;

-- MigrateData: coordenadorias e diretorias passam a ser unidades (mesmos ids)
INSERT INTO `unidades` (`id`, `nome`, `sigla`, `codigo`, `status`, `nivel`, `unidade_pai_id`)
SELECT `id`, `nome`, `sigla`, NULL, 1, 'COORDENADORIA', NULL FROM `coordenadorias`;

INSERT INTO `unidades` (`id`, `nome`, `sigla`, `codigo`, `status`, `nivel`, `unidade_pai_id`)
SELECT `id`, `nome`, NULL, NULL, 1, 'DIRETORIA', `coordenadoria_id` FROM `diretorias`;

-- AlterTable: publicacoes passa a referenciar a unidade (coluna criada nula para religar os dados)
ALTER TABLE `publicacoes` ADD COLUMN `unidade_id` VARCHAR(191) NULL;

UPDATE `publicacoes` SET `unidade_id` = `coordenadoria_id`;

ALTER TABLE `publicacoes` DROP COLUMN `coordenadoria_id`,
    MODIFY `unidade_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `coordenadorias`;

-- DropTable
DROP TABLE `diretorias`;

-- AddForeignKey
ALTER TABLE `publicacoes` ADD CONSTRAINT `publicacoes_unidade_id_fkey` FOREIGN KEY (`unidade_id`) REFERENCES `unidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unidades` ADD CONSTRAINT `unidades_unidade_pai_id_fkey` FOREIGN KEY (`unidade_pai_id`) REFERENCES `unidades`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
