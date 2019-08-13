module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  env: {
    es6: true,
    browser: true,
    node: true
  },
  plugins: [
    "prettier",
    "svelte3"
  ],
  overrides: [
    {
      files: ["**/*.svelte"],
      processor: "svelte3/svelte3"
    }
  ],
  extends: [
    "eslint:recommended", 
    "prettier"
  ],
  rules: {
    'prettier/prettier': "error"
  }
}