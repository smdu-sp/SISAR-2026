import { ApiProperty } from "@nestjs/swagger"
import { Nivel_Unidade } from "@prisma/client"

export class UnidadeResponseDTO {
    @ApiProperty()
    id: string
    @ApiProperty()
    nome: string
    @ApiProperty({ required: false })
    sigla: string
    @ApiProperty({ required: false })
    codigo: string
    @ApiProperty()
    status: number
    @ApiProperty({ enum: Nivel_Unidade })
    nivel: Nivel_Unidade
    @ApiProperty({ required: false })
    unidade_pai_id: string
}
