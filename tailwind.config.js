/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/spiritual/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Legacy Admin Palette (still used in some places)
        kesari: {
          DEFAULT: '#FF6A00',
          light: '#FF8D33',
          lighter: '#FFB066',
          dark: '#CC5500',
          darker: '#993F00',
        },
        khalsaNavy: {
          DEFAULT: '#0A1756',
          light: '#243073',
          lighter: '#3B468C',
          dark: '#060E42',
          darker: '#020726',
        },
        gold: {
          DEFAULT: '#D9A441',
          light: '#E8C76B',
          dark: '#A37A1B',
        },
        slateText: '#2B2B2B',
        grey: {
          soft: '#F5F5F5',
          mid: '#BFBFBF',
          rich: '#595959',
        },

        // Heritage Admin Theme
        heritage: {
          bgMain: '#FAF4E6',
          card: '#F4EBD3',
          highlight: '#FCECD1',
          primary: '#EBA83A',
          secondary: '#D97A32',
          maroon: '#762A25',
          gold: '#C8A55C',
          text: '#6B5A45',
          textDark: '#44201A',
        },
        glass: {
          base: 'rgba(255,255,255,0.7)',
          stroke: 'rgba(255,255,255,0.35)',
        },
        // Travel Theme - Premium, Family-Friendly
        travel: {
          primary: '#CBA26A',       // Champagne Gold
          secondary: '#6FA7C8',      // Gentle Sky Blue
          sand: '#F4D9B3',          // Warm Sand (highlight)
          coral: '#E5785D',         // Coral Glow (CTA)
          white: '#FFFFFF',         // Pure White
          greige: '#D9D5CC',        // Soft Greige (mid neutral)
          charcoal: '#2A2A2A',      // Deep Charcoal (dark neutral)
          border: '#E6E2DA',        // Linen Gray (borders)
        },
        // Spiritual Theme - Calm Zen palette for the spiritual module
        spiritual: {
          saffron: '#9BBFA4',       // Soft Moss (primary accent)
          saffronLight: '#DFF5E1',  // Zen mist
          saffronDark: '#3D6A54',   // Forest Sage
          navy: '#3D6A54',          // Used for headings / CTAs
          navyLight: '#5C8F75',     // Hover / outlines
          navyDark: '#2F3B37',      // Deep charcoal
          gold: '#FFFDF7',          // Calm cream highlight
          goldLight: '#EEF7ED',
          // Legacy soft-yellow palette (kept for reference)
          yellow: {
            cornsilk: '#FFFDF7',
            lemonChiffon: '#DFF5E1',
            vanilla: '#EEF7ED',
            jasmine: '#C7E5D5',
            naples: '#3D6A54',
          },
          cream: '#FFFDF7',         // Default background
          creamLight: '#DFF5E1',    // Subtle section background
          sage: '#9BBFA4',          // Success badges
          neutral: '#EEF5F0',       // Light neutral
          neutralLight: '#F8FBF9',
          text: '#2F3B37',          // Primary text
          textLight: '#5F6D66',     // Secondary text
          textLighter: '#8A9892',   // Muted captions
          dark: '#2F3B37',          // Deep charcoal surfaces
          accent: '#3D6A54',        // CTA background
          success: '#3D6A54',       // Success state
          error: '#C75B5B',         // Error state
        },
        // Palette options referenced in the brief
        paletteOptions: {
          softYellow: {
            base: '#FDF8E1',
            accent: '#F9DC5C',
            deep: '#6A5215',
          },
          coolBlue: {
            base: '#E6F0FF',
            accent: '#5E8CF5',
            deep: '#0F1E33',
          },
          zenGreen: {
            base: '#FFFDF7',
            accent: '#9BBFA4',
            deep: '#3D6A54',
          },
        },
        // Dedicated utility tokens for the zen palette
        'spiritual-zen-surface': '#FFFDF7',
        'spiritual-zen-mist': '#DFF5E1',
        'spiritual-zen-highlight': '#EEF7ED',
        'spiritual-zen-accent': '#9BBFA4',
        'spiritual-zen-forest': '#3D6A54',
        'spiritual-zen-charcoal': '#2F3B37',
        // Keep existing colors for non-admin pages
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        accent: {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
      },
      boxShadow: {
        glass: '0 25px 50px rgba(118, 42, 37, 0.12)',
        'glass-soft': '0 10px 30px rgba(200, 165, 92, 0.18)',
      },
      borderRadius: {
        glass: '22px',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}

