type Token = unknown;
type Provider = Token | {
    provide: Token;
    useValue: unknown;
};
export interface TestingModule {
    get<T = any>(token: Token): T;
}
export declare const Test: {
    createTestingModule({ providers }: {
        providers: Provider[];
    }): {
        compile: () => Promise<TestingModule>;
    };
};
export {};
