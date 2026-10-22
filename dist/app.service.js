export class AppService {
    getHello() {
        return { message: 'Hello World!' };
    }
    getOla() {
        return { message: 'Olá, Mundo!' };
    }
    verificaPagina(pagina, limite) {
        if (!pagina)
            pagina = 1;
        if (!limite)
            limite = 10;
        if (pagina < 1)
            pagina = 1;
        if (limite < 1)
            limite = 10;
        return [pagina, limite];
    }
    verificaLimite(pagina, limite, total) {
        if ((pagina - 1) * limite >= total)
            pagina = Math.ceil(total / limite);
        return [pagina, limite];
    }
}
