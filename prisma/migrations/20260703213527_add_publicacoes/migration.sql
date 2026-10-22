-- CreateTable
CREATE TABLE `publicacoes` (
    `id` VARCHAR(191) NOT NULL,
    `numero_processo` VARCHAR(191) NOT NULL,
    `tipo_documento` ENUM('COMUNIQUESE', 'INDEFERIMENTO', 'DEFERIMENTO') NOT NULL,
    `colegiado` ENUM('AR', 'RR', 'CEUSO', 'CAIEPS', 'CAEHIS', 'CPPU', 'CTLU') NOT NULL,
    `data_emissao` DATE NOT NULL,
    `data_publicacao` DATE NOT NULL,
    `prazo` INTEGER NOT NULL,
    `tecnico_id` VARCHAR(191) NOT NULL,
    `coordenadoria_id` VARCHAR(191) NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `alterado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `publicacoes` ADD CONSTRAINT `publicacoes_tecnico_id_fkey` FOREIGN KEY (`tecnico_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `publicacoes` ADD CONSTRAINT `publicacoes_coordenadoria_id_fkey` FOREIGN KEY (`coordenadoria_id`) REFERENCES `coordenadorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
