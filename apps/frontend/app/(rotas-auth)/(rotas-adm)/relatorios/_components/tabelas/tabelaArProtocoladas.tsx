// app/(rotas-auth)/(rotas-adm)/relatorios/_components/tabelas/tabelaArProtocoladas.tsx

'use client';

import DataTable from "@/components/data-table";
import { ProgressaoMensalColumn } from "../colunas/progressaoMensalColumn";
import { IListaARProgressaoMensal, IRelatorioARProgressaoMensal } from "@/types/relatorios"; // Importe IRelatorioARProgressaoMensal para tipar o dado bruto
import React, { useState, useEffect, useMemo } from "react"; // Importe useMemo
import formatadorListaArProgressaoMensal from "../../utils/formatadorArProgressao";
import { gerarRelatorio } from "@/services/relatorios/ar-progressao-mensal";
interface ITabelProgressaoARProtocoladasProps {
    dataInicial: null | string | Date;
    dataFinal: null | string | Date;
    access_token?: string | undefined;
}

export function TabelaProgressaoARProtocoladas({ dataInicial, dataFinal, access_token }: ITabelProgressaoARProtocoladasProps) {

    // Estado para os DADOS BRUTOS da API
    const [dadosBrutosApi, setDadosBrutosApi] = useState<IRelatorioARProgressaoMensal[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // useEffect para FAZER A BUSCA DA API
    useEffect(() => {
        const fetchRelatorio = async () => {
            // Só faz a busca se tivermos as datas e o token
            if (dataInicial && dataFinal && access_token) {
                setIsLoading(true); // Inicia carregamento
                setError(null);     // Limpa erros
                try {
                    const resultado = await gerarRelatorio({
                        anoInit: dataInicial as string, // Asserção de tipo
                        anoFinal: dataFinal as string,   // Asserção de tipo
                        access_token: access_token,
                    });

                    if (resultado.ok && resultado.data) {
                        setDadosBrutosApi(resultado.data as IRelatorioARProgressaoMensal[]); // <--- Salva os dados brutos
                    } else {
                        setError(resultado.error || "Erro desconhecido na API.");
                        setDadosBrutosApi(null); // Limpa dados em caso de erro
                    }
                } catch (err: any) {
                    console.error('Erro ao gerar relatório:', err);
                    setError(err.message || "Erro ao conectar com a API.");
                    setDadosBrutosApi(null);
                } finally {
                    setIsLoading(false); // Termina carregamento
                }
            } else {
                // Se faltam props, limpa o estado e não faz a busca
                setDadosBrutosApi(null);
                setIsLoading(false);
                setError(null);
                console.log('Datas inicial, final ou token são necessárias para gerar o relatório.');
            }
        };

        fetchRelatorio();
    }, [dataInicial, dataFinal, access_token]); // Dependências: refetch quando essas props mudarem

    // useMemo para FORMATAR OS DADOS (reage a 'dadosBrutosApi' mudando)
    const listaFormatadaParaUI = useMemo(() => {
        if (!dadosBrutosApi || dadosBrutosApi.length === 0) {
            console.log("Dados brutos API vazios, não formatando.");
            return []; // Retorna array vazio se não houver dados brutos
        }
        try {
            // Chame seu formatador passando os dados brutos
            const formatted = formatadorListaArProgressaoMensal(dadosBrutosApi);
            console.log("Dados formatados para UI:", formatted);
            return formatted; // Seu formatador já retorna IListaARProgressaoMensal[][]
        } catch (err: any) {
            console.error('Erro ao formatar os dados para UI:', err);
            setError("Erro ao formatar os dados para exibição."); // Define um erro de formatação
            return [];
        }
    }, [dadosBrutosApi]); // Dependência: reage quando dadosBrutosApi muda

    // --- Condições de Guarda para a renderização ---
    if (isLoading) {
        return <div className="text-center p-4">Carregando relatório de progressão mensal...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">Erro: {error}</div>;
    }

    if (!listaFormatadaParaUI || listaFormatadaParaUI.length === 0) {
        return <div className="text-center text-gray-500 p-4">Nenhum dado de progressão mensal encontrado para os filtros selecionados.</div>;
    }

    // --- Renderização Principal (o map) ---
    return (

        listaFormatadaParaUI.map((item: IListaARProgressaoMensal[], index: number) => (
            <div key={index} className='mt-8 sm:w-[175px] md:w-[350px] xl:w-[700px]'>
                <DataTable<IListaARProgressaoMensal, any> // Tipar o DataTable corretamente
                    columns={ProgressaoMensalColumn} // Suas colunas tipadas para IListaARProgressaoMensal
                    data={item} // 'item' é do tipo IListaARProgressaoMensal[]
                />
            </div>
        ))


    );
}