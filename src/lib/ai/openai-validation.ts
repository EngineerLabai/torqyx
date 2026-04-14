import "server-only";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();

/**
 * Validates that OpenAI API key is configured and has a valid format.
 * Throws an error if missing or invalid.
 */
export const validateOpenAIApiKey = () => {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set. The AI explanation feature will not be available.");
  }

  if (!OPENAI_API_KEY.startsWith("sk-")) {
    throw new Error("OPENAI_API_KEY appears to be in an invalid format. It should start with 'sk-'.");
  }

  return OPENAI_API_KEY;
};

/**
 * Returns the OpenAI API key if configured, or null if missing.
 * Use this for optional validation.
 */
export const getOpenAIApiKey = (): string | null => {
  if (!OPENAI_API_KEY) {
    return null;
  }

  if (!OPENAI_API_KEY.startsWith("sk-")) {
    return null;
  }

  return OPENAI_API_KEY;
};

/**
 * Checks if OpenAI API key is configured and valid.
 */
export const isOpenAIConfigured = (): boolean => {
  return getOpenAIApiKey() !== null;
};
