module.exports = function (api) {
  api.cache(true);

  const presets = ['babel-preset-expo'];
  const plugins = [];

  // Try to include react-native-worklets plugin if available. Use try/catch
  // so web bundling doesn't fail if the package isn't resolvable in this env.
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    require.resolve('react-native-worklets/plugin');
    plugins.push('react-native-worklets/plugin');
  } catch (e) {
    // plugin not found — skip it (prevents "Cannot find module 'react-native-worklets/plugin'" on web)
    // This is safe for web builds; native/bundling CI should have the dependency installed.
  }

  return {
    presets,
    plugins,
  };
};
