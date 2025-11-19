import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Mic, 
  GraduationCap, 
  Users, 
  Image as ImageIcon, 
  Settings,
  Globe
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Blog', url: '/admin/blog', icon: FileText },
  { title: 'Depoimentos', url: '/admin/testimonials', icon: MessageSquare },
  { title: 'Palestras', url: '/admin/palestras', icon: Mic },
  { title: 'Mentorias', url: '/admin/mentorias', icon: GraduationCap },
  { title: 'Leads', url: '/admin/leads', icon: Users },
  { title: 'Mídia', url: '/admin/media', icon: ImageIcon },
  { title: 'Configurações', url: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath.startsWith(path);

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-border">
          {!collapsed && (
            <>
              <h2 className="font-serif text-xl font-bold text-primary mb-1">Admin</h2>
              <p className="text-xs text-muted-foreground">Janice Correia</p>
            </>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className="hover:bg-muted/50" 
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="p-4 mt-auto border-t border-border">
            <Button 
              variant="outline" 
              className="w-full" 
              size="sm"
              onClick={() => window.open('/', '_blank')}
            >
              <Globe className="h-4 w-4 mr-2" />
              Ver Site
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
