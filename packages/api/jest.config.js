module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/src'],
	testRegex: '.*\.spec\.ts$',
	transform: {
		'^.+\.ts$': ['ts-jest', { tsconfig: { module: 'commonjs', moduleResolution: 'node', esModuleInterop: true, experimentalDecorators: true, emitDecoratorMetadata: true, strictNullChecks: false, noImplicitAny: false, isolatedModules: true } }],
	},
};
