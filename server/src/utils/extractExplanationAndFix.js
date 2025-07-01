function extractExplanationAndFix(aiResponse) {
    const codeBlockRegex = /```[\w-]*\n([\s\S]*?)```/i; // [\w-]* matches any optional code block language
  
    const match = aiResponse.match(codeBlockRegex);
  
    let explanation = '';
    let fix = '';
  
    if (match) {
      fix = match[1].trim();
      explanation = aiResponse.slice(0, match.index).replace(/explanation:/i, '').trim();
    } else {
      // Fallback: no code block found
      explanation = aiResponse.trim();
      fix = '[Fix not clearly detected in response]';
    }
  
    return { explanation, fix };
  }
  
  module.exports = extractExplanationAndFix;
  