// utils/contextHandlerWrapper.js
module.exports = function handleWithContext({ options, handleBasic, handleWithContext }) {
    if (options.context) {
      return handleWithContext(options);
    }
    return handleBasic(options);
  };
  