const NEWS_API = process.env.NEXT_PUBLIC_AI_BACKEND_API+"api/stock-news";

export async function getNews() {
  try {
    // Using fetch API for server-side fetching and revalidation (ISR)
    const response = await fetch(NEWS_API, {
      method: 'POST', // Assuming POST is required as per original code
      headers: {
        'Content-Type': 'application/json', // Add headers if needed by the API
      },
      // Add body if the POST request needs data: body: JSON.stringify({ key: 'value' })
      next: { revalidate: 3600 } // Revalidate every hour (3600 seconds)
    });
    if (!response.ok) {
      // Log detailed error for server-side debugging
      console.error(`Error fetching stock news: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error("Error body:", errorBody);
      return null; // Return null or throw an error
    }
    const newsData = await response.json()||["No news available"];
    // console.log(newsData);
    return newsData;
  } catch (error) {
    console.error("Error fetching stock news:", error);
    return null; // Return null or handle error appropriately
  }
}