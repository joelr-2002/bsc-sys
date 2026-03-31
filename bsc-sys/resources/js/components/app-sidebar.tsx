import { Link } from '@inertiajs/react';
import { 
    LayoutGrid,
    Target,
    TrendingUp,
    Users,
    Database,
    Settings,
    FileText,
    MapPin,
    BarChart3
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Planes Estratégicos',
        href: '/strategic-plans',
        icon: Target,
        items: [
            {
                title: 'Ver Planes',
                href: '/strategic-plans',
            },
            {
                title: 'Crear Plan',
                href: '/strategic-plans/create',
            },
        ],
    },
    {
        title: 'Perspectivas',
        href: '/perspectives',
        icon: MapPin,
    },
    {
        title: 'KPIs',
        href: '/kpis',
        icon: TrendingUp,
        items: [
            {
                title: 'Ver KPIs',
                href: '/kpis',
            },
            {
                title: 'Cargar Datos',
                href: '/kpis/load-data',
            },
        ],
    },
    {
        title: 'Reportes',
        href: '/reports',
        icon: FileText,
    },
    {
        title: 'Mapa Estratégico',
        href: '/strategic-map',
        icon: BarChart3,
    },
    {
        title: 'Fuentes de Datos',
        href: '/data-sources',
        icon: Database,
    },
    {
        title: 'Usuarios',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Configuración',
        href: '/settings',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
