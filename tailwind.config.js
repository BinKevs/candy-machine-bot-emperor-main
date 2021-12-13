module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			backgroundImage: {
				"landing-bg-image":
					"url('/src/static/SOL.jpg')",
			},
			colors: {
				"landing-button-color": "#DB5342",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
