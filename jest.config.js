module.exports = {
  roots: ['./src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.*.test.ts',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
