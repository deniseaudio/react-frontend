/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,

  extends: ["@totominc/react"],

  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.eslint.json",
  },
};
