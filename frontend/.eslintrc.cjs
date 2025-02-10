module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: { react: { version: "detect" } },

  plugins: [],

  rules: {
    "no-unused-vars": "off", // 사용하지 않는 변수 경고 비활성화
    "react/prop-types": "off",
    "react/no-unknown-property": "off",
    "react/jsx-no-undef": "off",
    "react/react-in-jsx-scope": "off",
  },
};
