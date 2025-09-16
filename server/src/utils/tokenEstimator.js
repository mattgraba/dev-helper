function estimateTokens(text) {
    // Rough heuristic: 1 token ≈ 4 characters of English text
    return Math.ceil(text.length / 4);
  }
  
  function estimateTotalTokens(...parts) {
    return parts.reduce((sum, part) => sum + estimateTokens(part || ''), 0);
  }
  
  export {
    estimateTokens,
    estimateTotalTokens,
  };
  