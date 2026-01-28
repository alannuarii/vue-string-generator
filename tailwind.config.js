/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#5048e5",
                "primary-glow": "#818cf8",
                "background-light": "#f6f6f8",
                "background-dark": "#121212",
                "surface-dark": "#1E1E1E",
                "card-light": "#ffffff",
                "card-dark": "#1e1e2e",
                "border-light": "#e5e7eb",
                "border-dark": "#2a2938",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"],
                "mono": ["JetBrains Mono", "monospace"],
            },
            boxShadow: {
                "neon": "0 0 10px rgba(80, 72, 229, 0.5), 0 0 20px rgba(80, 72, 229, 0.3)",
                "text-neon": "0 0 8px rgba(129, 140, 248, 0.6)",
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "2xl": "2rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}
