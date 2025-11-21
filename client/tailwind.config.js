/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    blue: '#2563eb',
                    dark: '#1e40af',
                },
                accent: {
                    purple: '#7c3aed',
                },
                bg: {
                    primary: '#ffffff',
                    secondary: '#f8fafc',
                    card: '#ffffff',
                },
                status: {
                    success: '#10b981',
                    warning: '#f59e0b',
                    danger: '#ef4444',
                    info: '#3b82f6',
                },
                text: {
                    primary: '#0f172a',
                    secondary: '#64748b',
                    muted: '#94a3b8',
                },
                border: '#e2e8f0',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
