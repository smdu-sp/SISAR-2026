import { Reflector } from '@nestjs/core';
declare const RefreshAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class RefreshAuthGuard extends RefreshAuthGuard_base {
    private reflector;
    constructor(reflector: Reflector);
}
export {};
