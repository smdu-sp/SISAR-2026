import { AddFeriasDto, CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums, Ferias, Permissao, Usuario } from '@prisma/client';
import { AppService } from 'src/app.service';
import { SGUService } from 'src/sgu/sgu.service';
import { AddSubstitutoDTO, BuscarFuncionariosResponseDTO, BuscarNovoResponseDTO, UsuarioAutorizadoResponseDTO, UsuarioPaginadoResponseDTO, UsuarioResponseDTO } from './dto/usuario-response.dto';
export declare class UsuariosService {
    private prisma;
    private sgu;
    private app;
    constructor(prisma: PrismaService, sgu: SGUService, app: AppService);
    retornaPermissao(id: string): Promise<Permissao>;
    listaCompleta(): Promise<UsuarioResponseDTO[]>;
    validaPermissaoCriador(permissao: $Enums.Permissao, permissaoCriador: $Enums.Permissao): Permissao;
    criar(createUsuarioDto: CreateUsuarioDto, criador?: Usuario): Promise<UsuarioResponseDTO>;
    buscarTudo(usuario?: Usuario, pagina?: number, limite?: number, status?: number | string, busca?: string, permissao?: string, unidade_id?: string): Promise<UsuarioPaginadoResponseDTO>;
    buscarPorId(id: string): Promise<UsuarioResponseDTO>;
    buscarPorEmail(email: string): Promise<UsuarioResponseDTO>;
    buscarPorLogin(login: string): Promise<UsuarioResponseDTO>;
    atualizar(usuario: Usuario, id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioResponseDTO>;
    excluir(id: string): Promise<{
        desativado: boolean;
    }>;
    autorizaUsuario(id: string): Promise<UsuarioAutorizadoResponseDTO>;
    validaUsuario(id: string): Promise<UsuarioResponseDTO>;
    adicionaFerias(id: string, addFeriasDto: AddFeriasDto): Promise<Ferias>;
    buscaUnidade(login: string): Promise<string>;
    buscarNovo(login: string): Promise<BuscarNovoResponseDTO>;
    adicionarSubstituto(usuario_id: string, substituto_id: string): Promise<AddSubstitutoDTO>;
    removerSubstituto(id: string): Promise<boolean>;
    buscarAdministrativos(): Promise<UsuarioResponseDTO[]>;
    buscarFuncionarios(): Promise<BuscarFuncionariosResponseDTO>;
}
