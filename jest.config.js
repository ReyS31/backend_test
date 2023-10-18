module.exports = {
	preset: 'ts-jest',
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.ts', '!**/node_modules/**', '!**/vendor/**'],
};
