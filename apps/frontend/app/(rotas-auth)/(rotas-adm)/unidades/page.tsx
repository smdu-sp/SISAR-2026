/** @format */

import { TableSkeleton } from "@/components/data-table";
import { Filtros } from "@/components/filtros";
import { auth } from "@/lib/auth/auth";
import * as unidades from "@/services/unidades";
import { Suspense } from "react";
import { IUnidadeArvore, IUnidades } from "@/types/unidades";
import { pageContainerComBotaoFlutuante } from "@/lib/utils";
import ModalUnidade from "./_components/modal-unidade";
import ArvoreUnidades from "./_components/arvore-unidades";
import { BotaoCadastroFlutuante } from "@/components/cadastro/cadastro-lista";

export default async function UnidadesSuspense({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <Unidades searchParams={searchParams} />
    </Suspense>
  );
}

async function Unidades({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { busca = "" } = await searchParams;
  let arvore: IUnidadeArvore[] = [];
  let todas: IUnidades[] = [];

  const session = await auth();
  if (session && session.access_token) {
    const [respArvore, respTodas] = await Promise.all([
      unidades.arvore(session.access_token, busca as string),
      unidades.listaCompleta(session.access_token),
    ]);
    if (respArvore.ok && Array.isArray(respArvore.data))
      arvore = respArvore.data as IUnidadeArvore[];
    if (respTodas.ok && Array.isArray(respTodas.data))
      todas = respTodas.data as IUnidades[];
  }

  return (
    <div className={pageContainerComBotaoFlutuante}>
      <div className="grid grid-cols-1 max-w-sm mx-auto md:max-w-full gap-y-3 w-full">
        <Filtros
          camposFiltraveis={[
            {
              nome: "Busca",
              tag: "busca",
              tipo: 0,
              placeholder: "Buscar por nome, sigla ou código...",
            },
          ]}
        />

        <ArvoreUnidades arvore={arvore} todas={todas} />
      </div>
      <BotaoCadastroFlutuante>
        <ModalUnidade todas={todas} />
      </BotaoCadastroFlutuante>
    </div>
  );
}
