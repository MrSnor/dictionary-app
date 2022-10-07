const colors = require('tailwindcss/colors')
module.exports = {
    content: [
        './*.html',
        './node_modules/tw-elements/dist/js/**/*.js'
    ],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                //add your own color
                //https://tailwindcss.com/docs/customizing-colors
            },
            container: {
                center: true,
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('tw-elements/dist/plugin'),
        require("daisyui"),
    ],
}