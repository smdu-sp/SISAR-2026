import path from 'node:path';

type ModuloNode = { createRequire: (caminho: string) => NodeRequire };

/**
 * Módulo "module" do Node obtido em tempo de execução: o webpack/turbopack do Next reescreve
 * tanto require.resolve quanto o createRequire importado, devolvendo caminhos que não existem.
 */
function moduloNode(): ModuloNode {
	const proc = process as unknown as { getBuiltinModule?: (nome: string) => unknown };
	if (typeof proc.getBuiltinModule === 'function') return proc.getBuiltinModule('module') as ModuloNode;
	// Node < 20.16: require nativo, fora do alcance do empacotador.
	return (0, eval)('require')('module') as ModuloNode;
}

/**
 * require do Node resolvido a partir do diretório do app. Use só para localizar arquivos de
 * pacotes em disco (ex.: as fontes do pdfmake).
 */
export function requireNode(): NodeRequire {
	return moduloNode().createRequire(path.join(process.cwd(), 'package.json'));
}
