-- AlterTable
ALTER TABLE `usuarios` MODIFY `permissao` ENUM('DEV', 'SUP', 'ADM', 'USR', 'GAB_ASC') NOT NULL DEFAULT 'USR';

-- CreateTable
CREATE TABLE `relatorio_agendamentos` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `tipo_relatorio` VARCHAR(191) NOT NULL,
    `formato_pdf` BOOLEAN NOT NULL DEFAULT true,
    `formato_excel` BOOLEAN NOT NULL DEFAULT true,
    `destinatarios` JSON NOT NULL,
    `assunto` VARCHAR(191) NULL,
    `mensagem` TEXT NULL,
    `frequencia` ENUM('DIARIA', 'SEMANAL', 'MENSAL') NOT NULL DEFAULT 'MENSAL',
    `dia_do_mes` INTEGER NULL,
    `dia_da_semana` INTEGER NULL,
    `hora` INTEGER NOT NULL DEFAULT 8,
    `minuto` INTEGER NOT NULL DEFAULT 0,
    `periodo` ENUM('MES_ANTERIOR', 'MES_ATUAL', 'ANO_ATUAL') NOT NULL DEFAULT 'MES_ANTERIOR',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `proximo_envio_em` DATETIME(3) NULL,
    `ultimo_envio_em` DATETIME(3) NULL,
    `criado_por_id` VARCHAR(191) NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `alterado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `relatorio_agendamentos_ativo_proximo_envio_em_idx`(`ativo`, `proximo_envio_em`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relatorio_agendamento_envios` (
    `id` VARCHAR(191) NOT NULL,
    `agendamento_id` VARCHAR(191) NOT NULL,
    `executado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `origem` VARCHAR(191) NOT NULL,
    `sucesso` BOOLEAN NOT NULL,
    `destinatarios` JSON NOT NULL,
    `arquivos` JSON NULL,
    `erro` TEXT NULL,

    INDEX `relatorio_agendamento_envios_agendamento_id_executado_em_idx`(`agendamento_id`, `executado_em`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `relatorio_agendamento_envios` ADD CONSTRAINT `relatorio_agendamento_envios_agendamento_id_fkey` FOREIGN KEY (`agendamento_id`) REFERENCES `relatorio_agendamentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

