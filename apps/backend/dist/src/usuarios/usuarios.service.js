"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const app_service_1 = require("../app.service");
const sgu_service_1 = require("../sgu/sgu.service");
const ldapjs_1 = require("ldapjs");
let UsuariosService = class UsuariosService {
    constructor(prisma, sgu, app) {
        this.prisma = prisma;
        this.sgu = sgu;
        this.app = app;
    }
    async retornaPermissao(id) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id }
        });
        return usuario.permissao;
    }
    async listaCompleta() {
        const lista = await this.prisma.usuario.findMany({
            orderBy: { nome: 'asc' },
        });
        if (!lista || lista.length == 0)
            throw new common_1.ForbiddenException('Nenhum usuário encontrado.');
        return lista;
    }
    validaPermissaoCriador(permissao, permissaoCriador) {
        if (permissao === client_1.$Enums.Permissao.DEV &&
            permissaoCriador === client_1.$Enums.Permissao.SUP)
            permissao = client_1.$Enums.Permissao.SUP;
        if ((permissao === client_1.$Enums.Permissao.DEV ||
            permissao === client_1.$Enums.Permissao.SUP) &&
            permissaoCriador === client_1.$Enums.Permissao.ADM)
            permissao = client_1.$Enums.Permissao.ADM;
        return permissao;
    }
    async criar(createUsuarioDto, criador) {
        const loguser = await this.buscarPorLogin(createUsuarioDto.login);
        if (loguser)
            throw new common_1.ForbiddenException('Login já cadastrado.');
        const emailuser = await this.buscarPorEmail(createUsuarioDto.email);
        if (emailuser)
            throw new common_1.ForbiddenException('Email já cadastrado.');
        if (!criador)
            createUsuarioDto.permissao = 'USR';
        if (criador) {
            const permissaoCriador = await this.retornaPermissao(criador.id);
            if (permissaoCriador !== client_1.$Enums.Permissao.DEV)
                createUsuarioDto.permissao = this.validaPermissaoCriador(createUsuarioDto.permissao, permissaoCriador);
        }
        const usuario = await this.prisma.usuario.create({
            data: { ...createUsuarioDto }
        });
        if (!usuario)
            throw new common_1.InternalServerErrorException('Não foi possível criar o usuário, tente novamente.');
        return usuario;
    }
    async buscarTudo(usuario = null, pagina = 1, limite = 10, status = 1, busca, permissao, unidade_id) {
        [pagina, limite] = this.app.verificaPagina(pagina, limite);
        let statusFiltro = 1;
        if (usuario?.permissao === 'DEV') {
            if (typeof status === 'string') {
                const statusNormalizado = status.trim().toUpperCase();
                if (statusNormalizado === '' || statusNormalizado === 'ALL' || statusNormalizado === '4') {
                    statusFiltro = null;
                }
                else if (statusNormalizado === 'ATIVO') {
                    statusFiltro = 1;
                }
                else if (statusNormalizado === 'INATIVO') {
                    statusFiltro = 2;
                }
                else {
                    const statusNumerico = Number(status);
                    statusFiltro = !Number.isNaN(statusNumerico) && statusNumerico !== 4
                        ? statusNumerico
                        : null;
                }
            }
            else {
                statusFiltro = Number.isNaN(status) || status === 4 ? null : status;
            }
        }
        const permissaoFiltro = permissao && permissao !== '' && permissao !== 'all'
            ? client_1.$Enums.Permissao[permissao]
            : undefined;
        const searchParams = {
            ...(busca && {
                OR: [
                    { nome: { contains: busca } },
                    { login: { contains: busca } },
                    { email: { contains: busca } },
                ],
            }),
            ...(unidade_id && unidade_id !== '' && { unidade_id }),
            ...(permissaoFiltro && { permissao: permissaoFiltro }),
            ...(statusFiltro !== null && { status: statusFiltro }),
        };
        const total = await this.prisma.usuario.count({ where: searchParams });
        if (total == 0)
            return { total: 0, pagina: 0, limite: 0, data: [] };
        [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
        const usuarios = await this.prisma.usuario.findMany({
            where: searchParams,
            orderBy: { nome: 'asc' },
            include: {
                unidade: true
            },
            skip: (pagina - 1) * limite,
            take: limite,
        });
        return {
            total: +total,
            pagina: +pagina,
            limite: +limite,
            data: usuarios,
        };
    }
    async buscarPorId(id) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id },
            include: {
                ferias: {
                    where: {
                        OR: [
                            { inicio: { gte: new Date() } },
                            { final: { lte: new Date() } },
                        ]
                    }
                },
                substitutos: {
                    include: {
                        substituto: true,
                        usuario: true
                    },
                    orderBy: { criado_em: 'asc' }
                },
                usuarios: {
                    include: {
                        substituto: true,
                        usuario: true
                    },
                    orderBy: { criado_em: 'asc' }
                }
            }
        });
        return usuario;
    }
    async buscarPorEmail(email) {
        return await this.prisma.usuario.findUnique({ where: { email } });
    }
    async buscarPorLogin(login) {
        return await this.prisma.usuario.findUnique({ where: { login } });
    }
    async atualizar(usuario, id, updateUsuarioDto) {
        const usuarioLogado = await this.buscarPorId(usuario.id);
        if (!usuarioLogado || ['TEC', 'USR'].includes(usuarioLogado.permissao) && id !== usuarioLogado.id)
            throw new common_1.ForbiddenException('Operação não autorizada para este usuário.');
        if (updateUsuarioDto.login) {
            const usuario = await this.buscarPorLogin(updateUsuarioDto.login);
            if (usuario && usuario.id !== id)
                throw new common_1.ForbiddenException('Login já cadastrado.');
        }
        if (updateUsuarioDto.permissao)
            updateUsuarioDto.permissao = this.validaPermissaoCriador(updateUsuarioDto.permissao, usuarioLogado.permissao);
        const usuarioAtualizado = await this.prisma.usuario.update({
            data: updateUsuarioDto,
            where: { id },
        });
        return usuarioAtualizado;
    }
    async excluir(id) {
        await this.prisma.usuario.update({
            data: { status: 2 },
            where: { id },
        });
        return {
            desativado: true,
        };
    }
    async autorizaUsuario(id) {
        const autorizado = await this.prisma.usuario.update({
            where: { id },
            data: { status: 1 },
        });
        if (autorizado && autorizado.status === 1)
            return { autorizado: true };
        throw new common_1.ForbiddenException('Erro ao autorizar o usuário.');
    }
    async validaUsuario(id) {
        const usuario = await this.prisma.usuario.findUnique({ where: { id } });
        if (!usuario)
            throw new common_1.ForbiddenException('Usuário não encontrado.');
        if (usuario.status !== 1)
            throw new common_1.ForbiddenException('Usuário inativo.');
        return usuario;
    }
    async adicionaFerias(id, addFeriasDto) {
        const usuario = await this.prisma.usuario.findUnique({ where: { id } });
        if (!usuario)
            throw new common_1.ForbiddenException('Usuário não encontrado.');
        if (usuario.status !== 1)
            throw new common_1.ForbiddenException('Usuário inativo.');
        const ferias = await this.prisma.ferias.create({
            data: { ...addFeriasDto, usuario_id: id },
        });
        if (!ferias)
            throw new common_1.ForbiddenException('Erro ao adicionar ferias.');
        return ferias;
    }
    async buscaUnidade(login) {
        let unidade_id = '';
        const usuario_sgu = await this.sgu.tblUsuarios.findFirst({
            where: {
                cpRF: { startsWith: login.substring(1) },
            },
        });
        if (usuario_sgu) {
            const codigo = usuario_sgu.cpUnid;
            const unidade = await this.prisma.unidade.findFirst({
                where: { codigo }
            });
            unidade_id = unidade ? unidade.id : '';
        }
        return unidade_id;
    }
    async buscarNovo(login) {
        const usuarioExiste = await this.buscarPorLogin(login);
        if (usuarioExiste && usuarioExiste.status === 1)
            throw new common_1.ForbiddenException('Login já cadastrado.');
        if (usuarioExiste && usuarioExiste.status !== 1) {
            const usuarioReativado = await this.prisma.usuario.update({
                where: { id: usuarioExiste.id },
                data: { status: 1 }
            });
            return usuarioReativado;
        }
        const client = (0, ldapjs_1.createClient)({
            url: process.env.LDAP_SERVER,
        });
        let unidade_id = await this.buscaUnidade(login);
        await new Promise((resolve, reject) => {
            client.bind(`${process.env.USER_LDAP}${process.env.LDAP_DOMAIN}`, process.env.PASS_LDAP, (err) => {
                if (err) {
                    client.destroy();
                    reject(new common_1.UnauthorizedException('Credenciais incorretas 2.'));
                }
                resolve();
            });
        });
        const usuario_ldap = await new Promise((resolve, reject) => {
            client.search(process.env.LDAP_BASE, {
                filter: `(&(samaccountname=${login})(company=SMUL))`,
                scope: 'sub',
                attributes: ['name', 'mail'],
            }, (err, res) => {
                if (err) {
                    client.destroy();
                    resolve('erro');
                }
                res.on('searchEntry', async (entry) => {
                    const nome = JSON.stringify(entry.pojo.attributes[0].values[0]).replaceAll('"', '');
                    const email = JSON.stringify(entry.pojo.attributes[1].values[0]).replaceAll('"', '').toLowerCase();
                    resolve({ nome, email });
                });
                res.on('error', (err) => {
                    client.destroy();
                    resolve('erro');
                });
                res.on('end', () => {
                    client.destroy();
                    resolve('erro');
                });
            });
        });
        client.destroy();
        if (!usuario_ldap.email)
            throw new common_1.UnauthorizedException('Credenciais incorretas.');
        return {
            login,
            nome: usuario_ldap.nome,
            email: usuario_ldap.email,
            unidade_id,
        };
    }
    async adicionarSubstituto(usuario_id, substituto_id) {
        if (usuario_id === substituto_id)
            throw new common_1.ForbiddenException('Substituto não pode ser o usuário.');
        const substituto = await this.prisma.substituto.findFirst({
            where: { substituto_id, usuario_id },
        });
        if (substituto)
            throw new common_1.ForbiddenException('Substituto ja adicionado.');
        const novo_substituto = await this.prisma.substituto.create({
            data: {
                substituto_id,
                usuario_id,
            },
        });
        return novo_substituto;
    }
    async removerSubstituto(id) {
        const substituto = await this.prisma.substituto.findUnique({
            where: { id }
        });
        if (!substituto)
            throw new common_1.ForbiddenException('Substituto não cadastrado.');
        await this.prisma.substituto.delete({ where: { id } });
        return true;
    }
    async buscarAdministrativos() {
        const administrativos = await this.prisma.usuario.findMany({
            where: { cargo: 'ADM' },
        });
        if (!administrativos)
            throw new common_1.ForbiddenException('Nenhum administrativo encontrado.');
        return administrativos;
    }
    async buscarFuncionarios() {
        const administrativos = await this.prisma.usuario.findMany({
            where: { cargo: 'ADM' },
        });
        const tecnicos = await this.prisma.usuario.findMany({
            where: { cargo: 'TEC' },
        });
        return { administrativos, tecnicos };
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        sgu_service_1.SGUService,
        app_service_1.AppService])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map