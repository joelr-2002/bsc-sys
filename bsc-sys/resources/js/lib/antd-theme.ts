import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

/**
 * Configuración del tema de Ant Design para BSC Scorecard
 * Sincronizado con los tokens de Tailwind CSS
 */

export const lightTheme: ThemeConfig = {
    algorithm: theme.defaultAlgorithm,
    token: {
        // Colores principales
        colorPrimary: '#1677ff',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#ff4d4f',
        colorInfo: '#1677ff',

        // Tipografía
        fontSize: 14,
        fontFamily:
            "'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",

        // Bordes y radios
        borderRadius: 6,
        borderRadiusLG: 10,
        borderRadiusSM: 4,

        // Espaciado
        controlHeight: 36,
        controlHeightLG: 40,
        controlHeightSM: 28,

        // Colores de fondo
        colorBgContainer: '#ffffff',
        colorBgLayout: '#f5f5f5',
    },
    components: {
        Button: {
            controlHeight: 36,
            controlHeightLG: 40,
            controlHeightSM: 28,
            primaryShadow: 'none',
        },
        Input: {
            controlHeight: 36,
            controlHeightLG: 40,
            controlHeightSM: 28,
        },
        Select: {
            controlHeight: 36,
            controlHeightLG: 40,
            controlHeightSM: 28,
        },
        DatePicker: {
            controlHeight: 36,
            controlHeightLG: 40,
            controlHeightSM: 28,
        },
        Card: {
            borderRadiusLG: 10,
        },
        Table: {
            borderRadius: 6,
        },
        Modal: {
            borderRadiusLG: 10,
        },
        Drawer: {
            borderRadiusLG: 10,
        },
    },
};

export const darkTheme: ThemeConfig = {
    algorithm: theme.darkAlgorithm,
    token: {
        ...lightTheme.token,
        colorBgContainer: '#1f1f1f',
        colorBgLayout: '#141414',
    },
    components: lightTheme.components,
};

/**
 * Obtiene la configuración del tema basada en el modo actual
 */
export function getThemeConfig(isDark: boolean): ThemeConfig {
    return isDark ? darkTheme : lightTheme;
}

/**
 * Tokens de semáforos BSC personalizados
 */
export const bscTrafficLightColors = {
    green: '#52c41a',
    yellow: '#faad14',
    red: '#ff4d4f',
    grey: '#d9d9d9',
} as const;

/**
 * Tokens de perspectivas BSC personalizados
 */
export const bscPerspectiveColors = {
    financial: '#1677ff',
    customer: '#52c41a',
    process: '#faad14',
    learning: '#722ed1',
    custom: '#8c8c8c',
} as const;
