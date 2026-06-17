/** @format */

'use client';

import React from "react";

export function TabelaDeUnidades() {

    return (
        <table className='w-full h-auto py-2 flex flex-col bg-[ring] border-2 border-black items-center justify-start gap-2 px-4 sm:flex-row sm:justify-start sm:h-[60px]'>
            <thead className="w-full h-auto py-2 flex justify-start">
                <tr className="w-full h-auto py-2 flex justify-between">
                    <th className="text-foreground wight text-2xl">Código</th>
                    <th className="text-foreground wight text-2xl">Sigla</th>
                    <th className="text-foreground wight text-2xl">Nome</th>
                    <th className="text-foreground wight text-2xl"></th>
                    <th className="text-foreground wight text-2xl"></th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    )
}