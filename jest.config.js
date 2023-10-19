module.exports = {
	preset: 'ts-jest',
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**', '!**/vendor/**'],
};
