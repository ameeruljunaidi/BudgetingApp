/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    forceExit: true,
    verbose: true,
    resetModules: false,
    testPathIgnorePatterns: ["./node_modules", "./build"],
    setupFilesAfterEnv: ["./src/tests/testUtils/setup.ts"],
};
