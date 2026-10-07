/** @format */

import {
  ChevronRight,
  House,
  LucideProps,
  Users,
  FolderUp,
  Building2,
  Landmark,
  List,
  ChartSpline,
  FolderOpen,
  Tag,
  FileText,
  ClipboardList,
  Gavel,
  CalendarDays,
  LayoutDashboard,
  Newspaper,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { buscarMeusRecursos } from "@/lib/recursos";
import { auth } from "@/lib/auth/auth";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import Link from "../link";

export async function NavMain() {
  interface IMenu {
    icone: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    titulo: string;
    url?: string;
    permissao?: string;
    recurso: string;
    subItens?: ISubMenu[];
  }

  interface ISubMenu {
    titulo: string;
    url: string;
  }

  const menuUsuario: IMenu[] = [
    {
      icone: House,
      titulo: "Página Inicial",
      recurso: "painel_inicial",
      url: "/",
    },
    {
      icone: CalendarDays,
      titulo: "Agenda",
      recurso: "processos",
      url: "/agenda",
    },
    {
      icone: FolderOpen,
      titulo: "Processos",
      recurso: "processos",
      url: "/processos",
    },
    {
      icone: Newspaper,
      titulo: "Publicações",
      recurso: "processos",
      url: "/publicacoes",
    },
  ];

  const menuAdmin: IMenu[] = [
    {
      icone: Users,
      titulo: "Usuários",
      recurso: "usuarios",
      url: "/usuarios",
      permissao: "usuario_buscar_tudo",
    },
    {
      icone: FolderUp,
      titulo: "Importar",
      recurso: "importar",
      url: "/importar",
      permissao: "usuario_buscar_tudo",
    },
    {
      icone: Building2,
      titulo: "Unidades",
      recurso: "unidades",
      url: "/unidades",
      permissao: "usuario_buscar_tudo",
    },
    {
      icone: Landmark,
      titulo: "Subprefeitura",
      recurso: "subprefeituras",
      url: "/subprefeitura",
      permissao: "usuario_buscar_tudo",
    },
    {
      icone: List,
      titulo: "Prazos por alvará",
      recurso: "alvaras",
      url: "/alvara",
      permissao: "usuario_buscar_tudo",
    },
    {
      icone: Gavel,
      titulo: "Pareceres",
      recurso: "pareceres",
      url: "/parecer-admissibilidade",
      permissao: "usuario_buscar_tudo",
    },
    {
      icone: Tag,
      titulo: "Categorias",
      recurso: "categorias",
      url: "/categorias",
      permissao: "usuario_buscar_tudo",
    },
    {
      icone: FileText,
      titulo: "Motivos Inadmissão",
      recurso: "motivos_inadmissao",
      url: "/motivos-inadmissao",
      permissao: "usuario_buscar_tudo",
    },
    {
      icone: ClipboardList,
      titulo: "Pedidos",
      recurso: "pedidos",
      url: "/pedidos",
      permissao: "usuario_buscar_tudo",
    },
    {
      icone: ChartSpline,
      titulo: "Relatórios",
      recurso: "relatorios",
      url: "/relatorios",
      permissao: "usuario_buscar_tudo",
    },
    {
      icone: LayoutDashboard,
      titulo: "Dashboard Admissibilidade",
      recurso: "dashboard_admissibilidade",
      url: "/dashboard/admissibilidade",
      permissao: "usuario_buscar_tudo",
    },
    {
      icone: Mail,
      titulo: "Envio de relatórios",
      recurso: "envio_relatorios",
      url: "/envio-relatorios",
    },
    {
      icone: ShieldCheck,
      titulo: "Permissões",
      recurso: "permissoes",
      url: "/permissoes",
    },
  ];

  // Cada item só aparece se o perfil do usuário tiver o recurso (tela de permissões).
  const session = await auth();
  const recursos = (await buscarMeusRecursos(session?.access_token)) ?? [];
  const itensUsuario = menuUsuario.filter((i) => recursos.includes(i.recurso));
  const itensAdmin = menuAdmin.filter((i) => recursos.includes(i.recurso));

  return (
    <SidebarContent>
      <SidebarGroup className="space-y-2">
        {menuUsuario && (
          <>
            <SidebarGroupLabel>Geral</SidebarGroupLabel>
            <SidebarMenu>
              {itensUsuario.map((item: IMenu) =>
                item.subItens ? (
                  <Collapsible
                    key={item.titulo}
                    asChild
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.titulo}>
                          {item.icone && <item.icone />}
                          <span>{item.titulo}</span>
                          {item.subItens && (
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {item.subItens && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItens?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.titulo}>
                                <Link href={item.url || "#"}>
                                  {item.icone && <item.icone />}
                                  <span>{item.titulo}</span>
                                </Link>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.titulo} className="z-50">
                    <Link href={item.url || "#"}>
                      {item.icone && <item.icone />}
                      <span>{item.titulo}</span>
                    </Link>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </>
        )}
        {itensAdmin.length > 0 && (
            <>
              <SidebarGroupLabel>Administração</SidebarGroupLabel>
              <SidebarMenu>
                {itensAdmin.map((item) =>
                  item.subItens ? (
                    <Collapsible
                      key={item.titulo}
                      asChild
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.titulo}>
                            {item.icone && <item.icone />}
                            <span>{item.titulo}</span>
                            {item.subItens && (
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        {item.subItens && (
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subItens?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.titulo}>
                                  <Link href={item.url || "#"}>
                                    {item.icone && <item.icone />}
                                    <span>{item.titulo}</span>
                                  </Link>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        )}
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.titulo} className="z-50">
                      <Link href={item.url || "#"}>
                        {item.icone && <item.icone />}
                        <span>{item.titulo}</span>
                      </Link>
                    </SidebarMenuItem>
                  ),
                )}
              </SidebarMenu>
            </>
          )}
      </SidebarGroup>
    </SidebarContent>
  );
}
