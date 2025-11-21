const withOpacityValue = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    blue: withOpacityValue('--color-primary-blue'),
                    dark: withOpacityValue('--color-primary-dark'),
                },
                accent: {
                    purple: withOpacityValue('--color-accent-purple'),
                },
                bg: {
                    primary: withOpacityValue('--color-bg-primary'),
                    secondary: withOpacityValue('--color-bg-secondary'),
                    card: withOpacityValue('--color-bg-card'),
                },
                status: {
                    success: withOpacityValue('--color-status-success'),
                    warning: withOpacityValue('--color-status-warning'),
                    danger: withOpacityValue('--color-status-danger'),
                    info: withOpacityValue('--color-status-info'),
                },
                text: {
                    primary: withOpacityValue('--color-text-primary'),
                    secondary: withOpacityValue('--color-text-secondary'),
                    muted: withOpacityValue('--color-text-muted'),
                },
                border: withOpacityValue('--color-border'),
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
