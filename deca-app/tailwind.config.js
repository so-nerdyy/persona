/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        screens: {
            'xs': '475px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                background: "#0B0F19", // Deep dark blue/slate
                surface: "#151B2B", // Slightly lighter for cards
                primary: {
                    DEFAULT: "#6366f1", // Indigo 500
                    dark: "#4f46e5", // Indigo 600
                    light: "#818cf8", // Indigo 400
                },
                secondary: {
                    DEFAULT: "#8b5cf6", // Violet 500
                    dark: "#7c3aed", // Violet 600
                    light: "#a78bfa", // Violet 400
                },
                accent: {
                    DEFAULT: "#10b981", // Emerald 500
                    glow: "#34d399", // Emerald 400
                },
                glass: {
                    light: "rgba(255, 255, 255, 0.1)",
                    medium: "rgba(255, 255, 255, 0.05)",
                    heavy: "rgba(15, 23, 42, 0.6)",
                    border: "rgba(255, 255, 255, 0.1)",
                }
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '112': '28rem',
                '128': '32rem',
            },
            backdropBlur: {
                xs: '2px',
                sm: '4px',
                md: '8px',
                lg: '12px',
                xl: '20px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
                '3xs': ['0.5rem', { lineHeight: '0.625rem' }],
            },
            minHeight: {
                'touch': '44px', // Minimum touch target size
            },
            maxWidth: {
                '8xl': '88rem',
                '9xl': '96rem',
            },
        },
    },
    plugins: [],
}
