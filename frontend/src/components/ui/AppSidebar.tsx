import {
  Home, Package, Tag, TrendingUp, Users, MapPin, Phone,
  UserPlus, LogIn, ShoppingCart, ChevronDown,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const path = location.pathname;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Inicio */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                    <Home className="h-4 w-4" />
                    {!collapsed && <span>Inicio</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Productos */}
              <Collapsible defaultOpen={path.startsWith("/productos")}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Package className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">Productos</span>
                          <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!collapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/productos/categorias" activeClassName="text-primary font-medium">
                              <Tag className="h-3.5 w-3.5" />
                              <span>Categorías</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/productos/ofertas" activeClassName="text-primary font-medium">
                              <Tag className="h-3.5 w-3.5" />
                              <span>Ofertas</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/productos/mas-vendidos" activeClassName="text-primary font-medium">
                              <TrendingUp className="h-3.5 w-3.5" />
                              <span>Más Vendidos</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>

              {/* Quiénes Somos */}
              <Collapsible defaultOpen={path.startsWith("/nosotros")}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Users className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">Quiénes Somos</span>
                          <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!collapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/nosotros" end activeClassName="text-primary font-medium">
                              <Users className="h-3.5 w-3.5" />
                              <span>Sobre Nosotros</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/nosotros/direccion" activeClassName="text-primary font-medium">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>Dirección</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/nosotros/contacto" activeClassName="text-primary font-medium">
                              <Phone className="h-3.5 w-3.5" />
                              <span>Contacto</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>

              {/* Usuarios */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/registro" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                    <UserPlus className="h-4 w-4" />
                    {!collapsed && <span>Registro</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/login" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                    <LogIn className="h-4 w-4" />
                    {!collapsed && <span>Iniciar Sesión</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Carrito */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/carrito" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                    <ShoppingCart className="h-4 w-4" />
                    {!collapsed && <span>Carrito</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
