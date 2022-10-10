module.exports = (config) => {
  return {
    ...config,
    output: { ...config.output, preserveModules: true },
  };
};
