module.exports = {
  "extends": "react-app",
  "rules": {
    "quotes": [2, "single"],
    "semi": 1,     // come on! Gotta have ; set it to warn(1) otherwise react stops rendering
    "object-curly-spacing": [1, "always"],
    "comma-dangle": [1, "never"],
    "react/no-access-state-in-setstate": [2]
  }
}
