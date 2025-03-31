const NEWS_API = "https://triphla-yv9t.onrender.com/api/stock-news";

export async function getNews() {
  try {
    const response = await fetch(NEWS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching stock news:", error);
    return null;
  }
} 