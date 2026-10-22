/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { pageContainer } from "@/lib/utils";
import * as envios from "@/services/envio-relatorios";
import EnvioRelatoriosClient from "./_components/envio-relatorios-client";

export default async function EnvioRelatoriosPage() {
  const session = await auth();
  const [lista, email] = await Promise.all([
    envios.listar(session?.access_token),
    envios.statusEmail(session?.access_token),
  ]);

  return (
    <div className={pageContainer}>
      {lista.ok && lista.data ? (
        <EnvioRelatoriosClient
          envios={lista.data}
          emailConfigurado={email.data?.configurado ?? false}
        />
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {lista.error ?? "Não foi possível carregar os envios agendados."}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
