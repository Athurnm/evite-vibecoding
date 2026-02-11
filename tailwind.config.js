/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./app.jsx",
        "./guideline/**/*.{js,ts,jsx,tsx,html}",
        "./*.{js,ts,jsx,tsx,html}"
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
