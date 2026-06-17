import DataTable from "@/components/data-table";
import { gerarRelatorio } from "@/services/relatorios/rr-analise-admissibilidade";
import React, { useState, useEffect } from "react";
import { prazoAnaliseAdmissibilidadeRrColumn } from "../colunas/prazoAnaliseAdmissibilidadeRrColumn";
import { IAdmissibilidadesAnalise, ICabecalhoRelatorioPrazoAnaliseAdmissibilidade } from "@/types/relatorios";

interface ITabelaArPrazoAnaliseAdmissibilidadeProps {
    sectionTitle?: string;
    dataInicial: null | string | Date;
    dataFinal: null | string | Date;
    access_token?: string | undefined;
}

export function TabelaRRPrazoAnaliseAdmissibilidade({ sectionTitle, dataInicial, dataFinal, access_token }: ITabelaArPrazoAnaliseAdmissibilidadeProps) {

    const [isLoading, setIsLoading] = useState(false);
    const [dados, setDados] = useState<IAdmissibilidadesAnalise[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [cabecalho, setCabecalho] = useState<ICabecalhoRelatorioPrazoAnaliseAdmissibilidade | null>(null);

    useEffect(() => {
        // Verifica se os dados necessários estão disponíveis
        if (!dataInicial || !dataFinal || !access_token) {
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await gerarRelatorio({
                    dataInicial,
                    dataFinal,
                    access_token
                });

                if (!response.ok) {
                    console.error("Resposta da API não é OK:", response.error);
                    setError(response.error || "Erro ao carregar dados");
                    setDados([]);
                    setCabecalho(null);
                } else {
                    setError(null);
                    const dadosRecebidos = response.data;

                    // Verifica se a resposta tem a estrutura esperada com cabecalho e dados
                    if (dadosRecebidos && typeof dadosRecebidos === 'object') {
                        // Define o cabeçalho se existir
                        if (dadosRecebidos.cabecalho) {
                            setCabecalho(dadosRecebidos.cabecalho);
                        }

                        // Define os dados se existirem e for um array
                        if (dadosRecebidos.dados && Array.isArray(dadosRecebidos.dados)) {
                            setDados(dadosRecebidos.dados);
                        } else {
                            setDados([]);
                        }
                    } else {
                        setDados([]);
                        setCabecalho(null);
                    }
                }

            } catch (error) {
                console.error("💥 Erro no fetchData:", error);
                setError("Erro inesperado ao carregar dados");
                setDados([]);
                setCabecalho(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dataInicial, dataFinal, access_token]);

    if (error) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-500">Erro: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-4 text-center">
                <p>Carregando dados...</p>
            </div>
        );
    }

    return (
        <>
            {cabecalho && (
                <div className="mb-4 p-4 bg-gray-50 rounded">
                    <h3 className="text-lg font-semibold mb-2">{sectionTitle}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <strong>Período:</strong> {cabecalho.dataInicio} a {cabecalho.dataFim}
                        </div>
                        <div>
                            <strong>Análises Finalizadas:</strong> {cabecalho.qtdAnaliseFinalizada}
                        </div>
                        <div>
                            <strong>No Prazo:</strong> {cabecalho.qtdAnaliseNoPrazo}
                        </div>
                        <div>
                            <strong>Excedidas:</strong> {cabecalho.qtdAnaliseExcedido}
                        </div>
                        <div>
                            <strong>Prazo Para Análises:</strong> {cabecalho.prazoFixoAnalise}
                        </div>
                        <div>
                            <strong>Média de Tempo Para Análises:</strong> {cabecalho.mediaPeriodoAnalise}
                        </div>
                    </div>
                </div>

            )}

            <DataTable
                columns={prazoAnaliseAdmissibilidadeRrColumn}
                data={dados}
            />

            {dados.length === 0 && !isLoading && !error && (
                <div className="p-4 text-center text-gray-500">
                    Nenhum dado encontrado para o período selecionado.
                </div>
            )}
        </>
    )

}