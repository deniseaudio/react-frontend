module.exports = {
  root: true,

  parser: "@typescript-eslint/parser",

  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.eslint.json"],
  },

  settings: {
    "import/resolver": {},
  },

  plugins: ["@typescript-eslint", "import"],

  extends: [
    "airbnb",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
  ],

  rules: {
    "import/extensions": "off",
    "import/no-extraneous-dependencies": "off",
    "import/prefer-default-export": "off",
    "prettier/prettier": "error",
    "react/function-component-definition": ["error", { namedComponents: "arrow-function" }],
    "react/jsx-no-constructed-context-values": "warn",
    "react/prop-types": "off",
    // Can be turned off since React 17 doesn't require React to be imported
    // with JSX.
    "react/react-in-jsx-scope": "off",
    "react/require-default-props": "off",
  },
};
