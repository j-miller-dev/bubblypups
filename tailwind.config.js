import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.tsx',
        './resources/js/**/*.ts',
    ],

    theme: {
        extend: {
            // Brand colors - Bubbly Pups pastel theme
            colors: {
                // Primary pink palette (based on PMS 517 C)
                brand: {
                    50: '#fef5fb',
                    100: '#f1dfee',  // PMS 7436 C - Lightest
                    200: '#ebb9d7',  // PMS 517 C - Primary pink
                    300: '#e89ac8',
                    400: '#e47bb9',
                    500: '#e15caa',
                    600: '#c74a93',
                    700: '#9e3b75',
                    800: '#752c57',
                    900: '#4c1d39',
                },
                // Purple accent (based on PMS 256 C)
                purple: {
                    50: '#faf7fa',
                    100: '#f3ecf3',
                    200: '#d4b0d4',  // PMS 256 C
                    300: '#c899c8',
                    400: '#bc82bc',
                    500: '#b06bb0',
                    600: '#975a97',
                    700: '#784778',
                    800: '#5a355a',
                    900: '#3c233c',
                },
                // Blue accent (based on PMS 656 C)
                blue: {
                    50: '#f0f9fd',
                    100: '#cae6f5',  // PMS 656 C
                    200: '#9fceec',
                    300: '#74b6e3',
                    400: '#499eda',
                    500: '#3688c7',
                    600: '#2b6da0',
                    700: '#22567f',
                    800: '#1a405e',
                    900: '#11293d',
                },
            },

            // Typography
            fontFamily: {
                display: ['"Baloo Bhai 2"', 'cursive', ...defaultTheme.fontFamily.sans],
                sans: ['Rajdhani', ...defaultTheme.fontFamily.sans],
            },
            fontWeight: {
                normal: '400',    // Rajdhani Regular
                medium: '500',    // Baloo Bhai Medium
                bold: '700',      // Rajdhani Bold
                extrabold: '800', // Baloo Bhai ExtraBold
            },

            // Consistent border radius
            borderRadius: {
                'card': '0.75rem',    // 12px for cards
                'button': '0.5rem',   // 8px for buttons
            },

            // Custom spacing for sections
            spacing: {
                'section': '4rem',      // 64px
                'section-sm': '3rem',   // 48px
            },
        },
    },

    plugins: [forms],
};
