import { createInertiaApp } from '@inertiajs/react';
import { ConfigProvider, theme } from 'antd';
import esES from 'antd/locale/es_ES';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'BSC Scorecard';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        // Detectar tema oscuro desde el DOM
        const isDark = document.documentElement.classList.contains('dark');
        
        return (
            <ConfigProvider
                locale={esES}
                theme={{
                    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    token: {
                        colorPrimary: '#1C0E66',
                        colorInfo: '#199178',
                        colorSuccess: '#199178',
                        colorWarning: '#E39F1E',
                        borderRadius: 6,
                        fontSize: 14,
                    },
                    components: {
                        Button: {
                            controlHeight: 36,
                        },
                        Input: {
                            controlHeight: 36,
                        },
                        Select: {
                            controlHeight: 36,
                        },
                    },
                }}
            >
                <TooltipProvider delayDuration={0}>{app}</TooltipProvider>
            </ConfigProvider>
        );
    },
    progress: {
        color: '#1C0E66',
    },
});

// This will set light / dark mode on load...
initializeTheme();
