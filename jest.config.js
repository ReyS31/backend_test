module.exports = {
	preset: 'ts-jest',
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/types/**/*.ts',
		'!**/node_modules/**',
		'!**/vendor/**',
	],
};
