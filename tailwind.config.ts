/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["entrypoints/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "hooks/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--pump-border))",
                input: "hsl(var(--pump-input))",
                ring: "hsl(var(--pump-ring))",
                background: "hsl(var(--pump-background))",
                foreground: "hsl(var(--pump-foreground))",
                primary: {
                    DEFAULT: "hsl(var(--pump-primary))",
                    foreground: "hsl(var(--pump-primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--pump-secondary))",
                    foreground: "hsl(var(--pump-secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--pump-destructive))",
                    foreground: "hsl(var(--pump-destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--pump-muted))",
                    foreground: "hsl(var(--pump-muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--pump-accent))",
                    foreground: "hsl(var(--pump-accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--pump-popover))",
                    foreground: "hsl(var(--pump-popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--pump-card))",
                    foreground: "hsl(var(--pump-card-foreground))",
                },
            },
            borderRadius: {
                lg: `var(--pump-radius)`,
                md: `calc(var(--pump-radius) - 2px)`,
                sm: "calc(var(--pump-radius) - 4px)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
