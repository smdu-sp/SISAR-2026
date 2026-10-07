/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { pageContainer } from "@/lib/utils";
import * as permissoes from "@/services/permissoes";
import MatrizPermissoes from "./_components/matriz-permissoes";

export default async function PermissoesPage() {
  const session = await auth();
  const resposta = await permissoes.buscarMatriz(session?.access_token);

  return (
    <div className={pageContainer}>
      {resposta.ok && resposta.data ? (
        <MatrizPermissoes inicial={resposta.data} />
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {resposta.error ?? "Não foi possível carregar as permissões."}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
