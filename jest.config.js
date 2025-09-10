const nextJest = require("next/jest");

const createJestConfig = nextJest({
	dir: "./",
});

const customJestConfig = {
	testEnvironment: "node",
	testMatch: ["**/__tests__/**/*.test.js"],
	collectCoverage: true,
	coverageDirectory: "coverage",
	reporters: ["default", "jest-junit"],
	coverageReporters: ["text", "html", "lcov"],
	coverageThreshold: {
		global: {
			branches: 60,
			functions: 90,
			lines: 85,
			statements: 85,
		},
	},
};

module.exports = createJestConfig(customJestConfig);
