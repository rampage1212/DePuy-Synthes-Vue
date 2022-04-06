/*eslint-env node*/
module.exports = {
  root: true,
  extends: [
    // add more generic rulesets here, such as:
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'prettier',
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
}
