import { TabelaProgressaoARProtocoladas } from "./tabelas/tabelaArProtocoladas";
import { TabelaRRQuantitativo } from "./tabelas/tabelaRRQuantitativo";
import { TabelaARQuantitativo } from "./tabelas/tabelaARQuantitativo";
import { TabelaArPrazoAnaliseAdmissibilidade } from "./tabelas/tabelaArPrazoAnaliseAdmissibilidade";
import { TabelaRRPrazoAnaliseAdmissibilidade } from "./tabelas/tabelaRRPrazoAnaliseAdmissibilidade";
import { TabelaArGabinetePrefeito } from "./colunas/ArGabinetePrefeito";

interface ITabelaDinamica {
    tipo: string | null;
    lista?: any[];
    obj?: any;
}

interface IFiltrosDinamicos {
    tipoRelatorio: null | string;
    extensaoArquivo?: null | string;
    periodoString: string;
    dataInicial: null | string | Date;
    dataFinal: null | string | Date;
    anoInicial: null | string | Date;
    anoFinal: null | string | Date;
    access_token: string;
}

export default function TabelaDinamica({
    tipoRelatorio,
    extensaoArquivo,
    periodoString,
    dataInicial,
    dataFinal,
    anoInicial,
    anoFinal,
    access_token
}: IFiltrosDinamicos) {

    if (tipoRelatorio === 'ar-progressao-mensal') {
        return (
            <TabelaProgressaoARProtocoladas
                dataInicial={anoInicial}
                dataFinal={anoFinal}
                access_token={access_token}
            />
        );
    }

    if (tipoRelatorio === 'rr-quantitativo') {

        return (
            <TabelaRRQuantitativo
                sectionTitle="Requalifica Rápido"
                period={periodoString}
                access_token={access_token}
            />
        );
    }

    if (tipoRelatorio === 'ar-quantitativo') {
        return (
            <TabelaARQuantitativo
                sectionTitle="Aprova Rápido"
                period={periodoString}
                access_token={access_token}
            />
        )
    }

    if (tipoRelatorio === 'ar-analise-admissibilidade') {
        return (
            <TabelaArPrazoAnaliseAdmissibilidade
                sectionTitle="Prazo Análise Admissibilidade"
                dataInicial={dataInicial}
                dataFinal={dataFinal}
                access_token={access_token}
            />
        )
    }

    if (tipoRelatorio === 'rr-analise-admissibilidade') {
        return (
            <TabelaRRPrazoAnaliseAdmissibilidade
                sectionTitle="Prazo Analise Admissibilidade Requalifica Rápido"
                dataInicial={dataInicial}
                dataFinal={dataFinal}
                access_token={access_token}
            />
        )
    }

    if (tipoRelatorio === 'ar-gabinete-prefeito') {
        return (
            <TabelaArGabinetePrefeito
                sectionTitle="Relatório Gabinete do Prefeito"
                access_token={access_token}
            />
        )
    }

    return <h2>Nenhum relatório selecionado</h2>;
}