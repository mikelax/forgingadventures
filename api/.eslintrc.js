module.exports = {
  "extends": "airbnb",
  "env": {
    "node": true,
    "es6": true
  },
  "rules": {
    // LOL no
    "function-paren-newline": [0],
    // needed overrides
    "no-underscore-dangle": [2, { "allow": ["__knexQueryUid"] }],

    // disabled - disagree with airbnb
    "space-before-function-paren": [0],
    "consistent-return": [0],

    // disabled - makes debgging more difficult
    "arrow-body-style": [0],

    // IMHO, more sensible overrides to existing airbnb error definitions
    "max-len": [2, 120, 4, { "ignoreComments": true, "ignoreUrls": true }],
    "comma-dangle": [2, "never"],
    "no-multi-spaces": [2, { "exceptions": { "VariableDeclarator": true, "Property": true }, "ignoreEOLComments": true }],
    "no-unused-expressions": [2, { "allowShortCircuit": true, "allowTernary": true }],
    "no-use-before-define": [2, "nofunc"],
    "no-param-reassign": [2, { "props": false }],
    "no-cond-assign": [2, "except-parens"],
    "no-return-assign": [2, "except-parens"],
    "no-else-return": [0]
  },
  "settings": {
    "import/resolver": {
      "babel-module": {}
    }
  },
  "parser": "babel-eslint"
}
