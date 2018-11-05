module.exports = {
  extends: 'react-app',
  env: {
    browser: true,
    es6: true,
    node: true
  },
  rules: {
    quotes: [2, 'single', { avoidEscape: true }],
    semi: 1, // come on! Gotta have ; set it to warn(1) otherwise react stops rendering
    'object-curly-spacing': [1, 'always'],
    'comma-dangle': [1, 'never'],
    'react/no-access-state-in-setstate': [2]
  }
}
