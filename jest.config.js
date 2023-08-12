module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['<rootDir>/test/**/*.ts?(x)'],
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
        'node_modules/(?!shuffle.ts)',
    ],
}
