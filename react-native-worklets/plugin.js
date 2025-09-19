// Minimal stub for react-native-worklets/plugin to allow web bundling in environments
// where the native worklets package isn't available. This file is intentionally
// minimal and only exists to satisfy require() during web builds.

module.exports = function reactNativeWorkletsPlugin() {
  return {
    visitor: {},
  };
};
