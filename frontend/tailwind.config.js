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
                    DEFAULT: '#3b82f6',
                    foreground: '#ffffff',
                },
                background: '#ffffff',
                foreground: '#0a0a0a',
                card: '#f9fafb',
                'card-foreground': '#0a0a0a',
                muted: '#f3f4f6',
                'muted-foreground': '#6b7280',
                accent: '#f3f4f6',
                'accent-foreground': '#0a0a0a',
                destructive: '#ef4444',
                'destructive-foreground': '#ffffff',
                border: '#e5e7eb',
            },
        },
    },
    plugins: [],
}
