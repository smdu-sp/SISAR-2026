/** @format */

'use client';

import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

interface AreaChartsApexProps {
    title: string;
    categories?: string[];
    data?: any[];
    series?: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined;
    height: string | number | undefined;
}

export default function GraficoArProgressaoMensal(props: AreaChartsApexProps) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Verifica se o tema atual é escuro
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);

    const options: ApexCharts.ApexOptions = {
        chart: {
            id: 'line-bar',
            stacked: false,
            width: '100%',
            type: 'line',
            foreColor: isDarkMode ? 'var(--color-foreground)' : 'var(--color-foreground)',
            zoom: {
                enabled: false,
            },
            toolbar: {
                autoSelected: 'pan',
                show: false,
            },
        },
        legend: {
            showForSingleSeries: false,
            position: 'top',
            horizontalAlign: 'center',
            fontSize: '16x',
            fontWeight: 'bold',
            onItemHover: { highlightDataSeries: true },
            onItemClick: { toggleDataSeries: false },
            itemMargin: {
                vertical: 4,
                horizontal: 20,
            },
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            xaxis: {
                lines: {
                    show: true,
                },
            },
            show: true,

            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        dataLabels: {
            formatter: (val: number | string) => `${val}`,
            enabled: false,

            distributed: false,
            background: {
                enabled: true,
                borderRadius: 4,
                padding: 8,
                borderWidth: 1,
                foreColor: 'var(--color-foreground)',
            },
            style: {
                colors: ['var(--color-chart-1)', 'var(--color-chart-2)'],
                fontSize: '16px',
            },
        },
        tooltip: {
            y: {
                formatter: (val: number | string) => `${val}`,
            },
        },
        colors: ['var(--color-chart-1)', 'var(--color-chart-2)'],
        title: {
            align: 'center',
            text: props.title,
            style: { fontWeight: 'bold', fontSize: '18px' },
        },
        fill: {
            gradient: {
                opacityFrom: 0.5,
                opacityTo: 0.2,
            },
        },
        markers: {
            size: 3,
            colors: ['var(--color-chart-1)', 'var(--color-chart-2)'],
            hover: { size: 5 },
            strokeWidth: 1,
        },

        xaxis: {
            type: 'category',
            tickPlacement: 'between',
            axisBorder: { show: true },
            categories: props.categories,
        },
        yaxis: {
            show: true,
            labels: {
                show: true,
                style: { fontSize: '9px' },
                formatter: (val: number | string) => `${val}`,
            },
            axisBorder: { show: true },
        },
        stroke: { curve: 'smooth', width: 2 },
        responsive: [
            {
                breakpoint: 580,
                options: {
                    chart: {
                        height: 580,
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    xaxis: {
                        axisTicks: { show: true },
                        tickPlacement: 'on',
                        offsetY: 2,
                        labels: {
                            trim: false,
                            style: { fontSize: '10px' },
                            hideOverlappingLabels: true,
                            rotate: -45,
                        },
                    },
                    legend: {
                        position: 'bottom',
                        offsetY: 10,
                        fontSize: '14x',
                        itemMargin: {
                            vertical: 8,
                            horizontal: 8,
                        },
                    },
                },
            },
            {
                breakpoint: 3000,
                options: {
                    chart: {
                        height: 340,
                    },
                    dataLabels: {
                        enabled: true,
                    },
                    xaxis: {
                        labels: {
                            trim: false,
                            style: { fontSize: '12px' },
                            rotate: 0,
                            hideOverlappingLabels: true,
                        },
                    },
                    legend: {
                        position: 'top',
                        offsetY: 0,
                        fontSize: '12x',
                        itemMargin: {
                            vertical: 14,
                            horizontal: 12,
                        },
                    },
                },
            },
        ],
    };

    return (
        <Chart
            options={options}
            series={props.series}
            type="line"
            width={'100%'}
            height={props.height}></Chart>
    );
}

interface IListaARProgressaoMensal {
    ano: number;
    meses: { acc: number; valor: number }[];
}

interface GraficoProgressaoMensalProps {
    dados: IListaARProgressaoMensal[];
}

export function GraficoProgressaoMensal({ dados }: GraficoProgressaoMensalProps) {
    // Extrair categorias (meses) e séries (valores) a partir dos dados
    const categorias: string[] = [];
    const seriesData: { name: string; data: number[] }[] = [];

    dados.forEach((item) => {
        item.meses.forEach((mes) => {
            const mesAno = `${mes.acc + 1}/${item.ano}`;
            if (!categorias.includes(mesAno)) {
                categorias.push(mesAno);
            }
        });
    });

    dados.forEach((item) => {
        const serie = {
            name: `${item.ano}`,
            data: new Array(categorias.length).fill(0),
        };

        item.meses.forEach((mes) => {
            const mesAno = `${mes.acc + 1}/${item.ano}`;
            const index = categorias.indexOf(mesAno);
            if (index !== -1) {
                serie.data[index] = mes.valor;
            }
        });

        seriesData.push(serie);
    });

    return (
        <GraficoArProgressaoMensal
            title="Progressão Mensal"
            categories={categorias}
            series={seriesData}
            height={400}
        />
    );
}
