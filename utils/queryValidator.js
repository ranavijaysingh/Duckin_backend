const FORBIDDEN_KEYWORDS = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER'];

const validateQuery = (query) => {
  if (!query) {
    throw new Error('Query is required');
  }

  const upperQuery = query.toUpperCase();
  
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (upperQuery.includes(keyword)) {
      throw new Error(`${keyword} operations are not allowed`);
    }
  }

  return true;
};

module.exports = {
  validateQuery
};