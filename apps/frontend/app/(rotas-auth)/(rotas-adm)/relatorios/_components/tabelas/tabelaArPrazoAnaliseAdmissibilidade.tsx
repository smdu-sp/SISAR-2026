import DataTable from "@/components/data-table"
import { prazoAnaliseAdmissibilidadeArColumn } from "../colunas/prazoAnaliseAdmissibilidadeArColumn"
import { gerarRelatorio } from "@/services/relatorios/ar-analise-adissibilidade/query-functions/getRelatorio"
import { ICabecalhoRelatorioPrazoAnaliseAdmissibilidade, IAdmissibilidadesAnalise, IRelatorioPrazoAnaliseRetorno } from "@/types/relatorios"
import React, { useState, useEffect } from "react"

interface ITabelaArPrazoAnaliseAdmissibilidadeProps {
    sectionTitle?: string;
    dataInicial: null | string | Date;
    dataFinal: null | string | Date;
    access_token?: string | undefined;
}

export function TabelaArPrazoAnaliseAdmissibilidade({ sectionTitle, dataInicial, dataFinal, access_token }: ITabelaArPrazoAnaliseAdmissibilidadeProps) {

    const [isLoading, setIsLoading] = useState(false);
    const [dadosBrutosApi, setDadosBrutosApi] = useState<IRelatorioPrazoAnaliseRetorno | null>(null);
    const [dadosTransformados, setDadosTransformados] = useState<IAdmissibilidadesAnalise[]>([]);
    const [cabecalho, setCabecalho] = useState<ICabecalhoRelatorioPrazoAnaliseAdmissibilidade | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Função para transformar dados agrupados em array plano
    const transformarDados = (dados: IRelatorioPrazoAnaliseRetorno): IAdmissibilidadesAnalise[] => {
        const dadosPlanos: IAdmissibilidadesAnalise[] = [];

        // Iterar pelos anos (2024, 2025, etc.)
        Object.entries(dados).forEach(([ano, mesesData]) => {
            // Iterar pelos meses dentro de cada ano
            if (mesesData && typeof mesesData === 'object') {
                Object.entries(mesesData).forEach(([mes, admissibilidades]) => {
                    // Se o mês tem dados (array não vazio)
                    if (admissibilidades && Array.isArray(admissibilidades) && admissibilidades.length > 0) {
                        dadosPlanos.push(...admissibilidades);
                    }
                });
            }
        });

        return dadosPlanos;
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await gerarRelatorio({ dataInicial, dataFinal, access_token });

                // console.log("Resposta completa da API:", response);
                // console.log("Estrutura response.data:", response.data);

                if (!response.ok) {
                    setError(response.error || "Erro ao carregar dados");
                    setDadosBrutosApi(null);
                    setDadosTransformados([]);
                } else {
                    setError(null);

                    // Ajustar para a nova estrutura da API onde os dados estão dentro da chave "dados"
                    const dadosRecebidos = response.data?.dados || response.data;
                    const cabecalhoRecebido = response.data?.cabecalho || null;
                    setDadosBrutosApi(dadosRecebidos);
                    setCabecalho(cabecalhoRecebido);

                    // Os dados devem ser um objeto com anos como chaves
                    if (dadosRecebidos && typeof dadosRecebidos === 'object' && !Array.isArray(dadosRecebidos)) {
                        const dadosPlanos = transformarDados(dadosRecebidos);
                        console.log("Dados transformados:", dadosPlanos);
                        setDadosTransformados(dadosPlanos);
                    } else {
                        console.warn("Dados recebidos não estão no formato esperado:", dadosRecebidos);
                        setDadosTransformados([]);
                    }
                }

            } catch (err) {
                setError("Erro inesperado ao carregar dados");
                setDadosBrutosApi(null);
                setDadosTransformados([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dataInicial, dataFinal, access_token]);

    console.log(dadosBrutosApi)

    return (
        <>
            {error ? (
                <h2 style={{ color: 'red' }}>{error}</h2>
            ) : (
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
                        columns={prazoAnaliseAdmissibilidadeArColumn}
                        data={dadosTransformados}
                        stickers={{ active: true, columnNumber: 5 }}
                    />

                </>
            )}
        </>
    );
}