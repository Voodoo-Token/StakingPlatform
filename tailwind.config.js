module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false,
    theme: {
        extend: {
            backgroundImage: {
                'custom': "url('/background1.jpg')",
            },
            width: {
                '560': '560px',
            },
            height: {
                '480': '480px',
            },
            backgroundColor: {
                'galaxy_purple': '#00090f'
              },
            gradientColorStops: {
                'galaxy-start': '#2c1d3c', // very deep purple
                'galaxy-middle': '#0b1033', // very deep blue
                'galaxy-end': '#8b3d6c' // dark pink
            },
            fontFamily: {
                'hk-grotesk-wide': ['HK Grotesk Wide', 'sans'],
              },
        },
        variants: {},
        plugins: [],
    }
}
