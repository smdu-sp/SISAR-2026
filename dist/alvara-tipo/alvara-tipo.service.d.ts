import { CreateAlvaraTipoDto } from './dto/create-alvara-tipo.dto';
import { UpdateAlvaraTipoDto } from './dto/update-alvara-tipo.dto';
import { Alvara_Tipo } from '@prisma/client';
import { PrismaService } from '../config/prisma';
import { AppService } from '../app.service';
import { AlvaraTipoPaginadoDTO, AlvaraTipoResponseDTO } from './dto/alvara-tipo-responses.dto';
export declare class AlvaraTipoService {
    private prisma;
    private app;
    constructor(prisma: PrismaService, app: AppService);
    verificaSeExiste(nome: string, id?: string): Promise<void>;
    criar(createAlvaraTipoDto: CreateAlvaraTipoDto): Promise<Alvara_Tipo>;
    listaCompleta(): Promise<AlvaraTipoResponseDTO[]>;
    buscarTudo(pagina?: number, limite?: number, busca?: string): Promise<AlvaraTipoPaginadoDTO>;
    buscarPorId(id: string): Promise<Alvara_Tipo>;
    atualizar(id: string, updateAlvaraTipoDto: UpdateAlvaraTipoDto): Promise<AlvaraTipoResponseDTO>;
    alterarStatus(id: string, status: number): Promise<AlvaraTipoResponseDTO>;
}
