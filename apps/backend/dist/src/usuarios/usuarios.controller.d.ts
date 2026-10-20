import { UsuariosService } from './usuarios.service';
import { AddFeriasDto, CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Ferias, Usuario } from '@prisma/client';
import { AddSubstitutoDTO, BuscarFuncionariosResponseDTO, BuscarNovoResponseDTO, UsuarioAutorizadoResponseDTO, UsuarioDesativadoResponseDTO, UsuarioPaginadoResponseDTO, UsuarioResponseDTO } from './dto/usuario-response.dto';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    criar(usuario: Usuario, createUsuarioDto: CreateUsuarioDto): Promise<UsuarioResponseDTO>;
    buscarTudo(usuario: Usuario, pagina?: string, limite?: string, status?: string, busca?: string, permissao?: string): Promise<UsuarioPaginadoResponseDTO>;
    buscarPorId(id: string): Promise<UsuarioResponseDTO>;
    atualizar(usuario: Usuario, id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioResponseDTO>;
    listaCompleta(): Promise<UsuarioResponseDTO[]>;
    excluir(id: string): Promise<UsuarioDesativadoResponseDTO>;
    autorizarUsuario(id: string): Promise<UsuarioAutorizadoResponseDTO>;
    adicionaFerias(id: string, addFeriasDto: AddFeriasDto): Promise<Ferias>;
    validaUsuario(usuario: Usuario): Promise<UsuarioResponseDTO>;
    buscarNovo(login: string): Promise<BuscarNovoResponseDTO>;
    buscarAdministrativos(): Promise<UsuarioResponseDTO[]>;
    buscarFuncionarios(): Promise<BuscarFuncionariosResponseDTO>;
    adicionarSubstituto({ usuario_id, substituto_id }: AddSubstitutoDTO): Promise<AddSubstitutoDTO>;
    removerSubstituto(id: string): Promise<boolean>;
}
