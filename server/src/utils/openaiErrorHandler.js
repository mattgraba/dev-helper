/**
 * Handles OpenAI API errors and returns user-friendly error responses
 * @param {Error} error - The error from OpenAI API
 * @returns {{ status: number, message: string, retryAfter?: number }}
 */
export function handleOpenAIError(error) {
  // OpenAI API error structure
  const status = error.status || error.response?.status;
  const errorCode = error.code || error.error?.code;
  const errorType = error.type || error.error?.type;

  // Rate limit exceeded (429)
  if (status === 429 || errorCode === 'rate_limit_exceeded') {
    const retryAfter = error.headers?.['retry-after']
      ? parseInt(error.headers['retry-after'], 10)
      : 60;

    return {
      status: 429,
      message: 'OpenAI rate limit reached. Please wait a moment and try again.',
      retryAfter,
    };
  }

  // Quota exceeded (insufficient_quota)
  if (errorCode === 'insufficient_quota' || errorType === 'insufficient_quota') {
    return {
      status: 503,
      message: 'AI service temporarily unavailable. Please try again later.',
    };
  }

  // Invalid API key
  if (status === 401 || errorCode === 'invalid_api_key') {
    console.error('OpenAI API key is invalid or missing');
    return {
      status: 503,
      message: 'AI service configuration error. Please contact support.',
    };
  }

  // Model overloaded
  if (status === 503 || errorCode === 'model_overloaded') {
    return {
      status: 503,
      message: 'AI service is currently busy. Please try again in a few seconds.',
      retryAfter: 10,
    };
  }

  // Context length exceeded
  if (errorCode === 'context_length_exceeded') {
    return {
      status: 400,
      message: 'Input too long. Please reduce the amount of code or context provided.',
    };
  }

  // Token limit exceeded (our own check)
  if (error.message?.includes('Token estimate')) {
    return {
      status: 400,
      message: error.message,
    };
  }

  // Generic server error
  console.error('OpenAI API error:', error);
  return {
    status: 500,
    message: 'Failed to process request. Please try again.',
  };
}

/**
 * Wrapper to execute OpenAI calls with proper error handling
 * @param {Function} fn - Async function that makes OpenAI API call
 * @param {Response} res - Express response object
 */
export async function withOpenAIErrorHandling(fn, res) {
  try {
    return await fn();
  } catch (error) {
    const { status, message, retryAfter } = handleOpenAIError(error);
    const response = { error: message };
    if (retryAfter) {
      response.retryAfter = retryAfter;
      res.set('Retry-After', retryAfter.toString());
    }
    return res.status(status).json(response);
  }
}
