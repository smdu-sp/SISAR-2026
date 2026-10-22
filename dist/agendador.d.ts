interface Tarefa {
    nome: string;
    /** Próxima execução estritamente depois de `apos`. */
    proxima: (apos: Date) => Date;
    executar: () => Promise<unknown>;
}
/** Todo dia em hora:minuto (horário local do servidor, como o cron do Nest). */
declare function diariamente(hora: number, minuto?: number): (apos: Date) => Date;
/** No início de cada minuto. */
declare function aCadaMinuto(apos: Date): Date;
export declare const tarefas: Tarefa[];
export declare function agendadorAtivo(env?: NodeJS.ProcessEnv): boolean;
export declare function iniciarAgendador(): void;
export declare const _paraTestes: {
    diariamente: typeof diariamente;
    aCadaMinuto: typeof aCadaMinuto;
};
export {};
