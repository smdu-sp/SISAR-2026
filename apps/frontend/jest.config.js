/** Testes do servidor (API migrada do NestJS). */
module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/server'],
	testRegex: '.*\.spec\.ts$',
	transform: {
		'^.+\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }],
	},
	moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
};
