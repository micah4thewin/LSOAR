import lunr from 'lunr';

const LUNR_DB_URL = 'http://localhost:3001/LSOAR.json';
const ARTICLE_BASE_URL = 'http://localhost:3001/';

export const getSearchResults = async (userQuery) => {
  try {
    const lunrDatabaseResponse = await fetch(LUNR_DB_URL);
    if (!lunrDatabaseResponse.ok) {
      throw new Error(`HTTP error! status: ${lunrDatabaseResponse.status}`);
    }
    const lunrDatabase = await lunrDatabaseResponse.json();
    const idx = lunr.Index.load(lunrDatabase);
    const results = idx.search(userQuery);

    const matchedArticles = await Promise.all(
      results.map(result => {
        // Fetch the article from the correct directory and filename
        return fetchArticle(ARTICLE_BASE_URL, result.ref);
      })
    );

    return matchedArticles.filter(article => article !== null);
  } catch (error) {
    console.error('An error occurred while searching:', error);
    return [];
  }
};

const fetchArticle = async (baseUrl, articlePath) => {
  // Construct the full path to the article
  const fullPath = `${baseUrl}${articlePath}`;

  try {
    const articleResponse = await fetch(fullPath);
    if (!articleResponse.ok) {
      throw new Error(`HTTP error! status: ${articleResponse.status}`);
    }
    const article = await articleResponse.json();
    // Return the article object with the expected properties
    return {
      id: article.metadata.title.replace(/\s+/g, '_'),
      title: article.metadata.title,
      content: article.article,
      length: article.metadata.length,
      generated_by: article.metadata.generated_by,
      timestamp: article.metadata.timestamp
    };
  } catch (error) {
    console.error(`Error fetching article at ${fullPath}: ${error}`);
    return null;
  }
};
