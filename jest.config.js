/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    "@/domain/(.*)": "<rootDir>/src/core/domain/$1",
    "@/application/(.*)": "<rootDir>/src/core/application/$1",
    "@/persistence/(.*)": "<rootDir>/src/infrastructure/persistence/$1",
  }
};