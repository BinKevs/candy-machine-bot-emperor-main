module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			backgroundImage: {
				"landing-bg-image":
					"url('/src/static/Red-Linear-Gradient.png')",
			},
			colors: {
				"landing-button-color": "#DB5342",
			},

			fontFamily: {
				bebas: ["Bebas Neue"],
				robotoCondensed: ["Roboto Condensed"],
				lux: ["Luxurious Script"],
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
