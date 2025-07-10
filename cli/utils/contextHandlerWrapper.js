module.exports = async function handleWithContext({ options, handleBasic, handleWithContext }) {
  const {
    file: filePath,
    name: componentName,
    description,
    language = 'JavaScript',
    fileType,
    output,
    outputPath,
    goal,
    context,
    contextText,
  } = options;

  const sharedArgs = {
    filePath,
    componentName,
    description,
    language,
    fileType,
    output,
    outputPath,
    goal,
    contextText,
  };

  if (context || contextText) {
    await handleWithContext(sharedArgs);
  } else {
    await handleBasic(sharedArgs);
  }
};