import { IRelatorioARProgressaoMensal } from "@/types/relatorios";

interface IListaARProgressaoMensal {
    ano: number,
    mes: string,
    mensal: number,
    acc: number
}

function formatadorArProgressaoMensal(obj: IRelatorioARProgressaoMensal) {
    const lista: IListaARProgressaoMensal[] = []

    for (let i = 0; 12 > i; i++) {
        const dataTemp = new Date(2000, i, 1)
        const newObj: { ano: number, mes: string, mensal: number, acc: number } = {
            ano: obj.ano,
            mes: dataTemp.toLocaleDateString('pt-BR', { month: 'long' }),
            mensal: obj.mes[i],
            acc: obj.acc[i]
        }
        lista.push(newObj)
    }
    return lista
}

export default function formatadorListaArProgressaoMensal(lista: IRelatorioARProgressaoMensal[]): IListaARProgressaoMensal[][] {
    const dataList: IListaARProgressaoMensal[][] = []

    for (let i = 0; lista.length > i; i++) {
        const novaLista = formatadorArProgressaoMensal(lista[i])
        dataList.push(novaLista)
    }
    return dataList
}