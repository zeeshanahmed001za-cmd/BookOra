const fs = require('fs');

// Helper sleep function for rate limiting
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper fetch function with retry logic
async function fetchWithRetry(url, options = {}, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      console.warn(`Fetch warning: HTTP status ${res.status}. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
    } catch (err) {
      console.warn(`Fetch error: ${err.message}. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
    }
    await sleep(delay);
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts.`);
}

async function fetchBooks() {
  try {
    const subjects = [
      'fiction', 'science', 'biography', 'history', 'self-help',
      'fantasy', 'romance', 'mystery', 'children', 'business', 'science_fiction'
    ];
    let allBooks = [];
    const seenTitles = new Set();

    for (const subject of subjects) {
      console.log(`Fetching subject "${subject}" from Open Library...`);
      // Request a decent limit to get plenty of works with cover IDs
      const url = `https://openlibrary.org/subjects/${subject}.json?limit=65`;
      
      let data;
      try {
        const res = await fetchWithRetry(url);
        data = await res.json();
      } catch (err) {
        console.error(`Skipping subject "${subject}" due to failure:`, err.message);
        continue;
      }

      if (!data || !Array.isArray(data.works)) {
        console.warn(`No works found for subject "${subject}"`);
        continue;
      }

      // Map the subject to a category that conforms strictly to the DB enum
      let category = 'General';
      if (subject === 'fiction') category = 'Fiction';
      else if (subject === 'fantasy') category = 'Fiction'; // Fantasy is Fiction
      else if (subject === 'romance') category = 'Romance';
      else if (subject === 'mystery') category = 'Mystery';
      else if (subject === 'science') category = 'Science';
      else if (subject === 'biography') category = 'Biography';
      else if (subject === 'history') category = 'History';
      else if (subject === 'self-help') category = 'Self Help';
      else if (subject === 'children') category = 'Children';
      else if (subject === 'business') category = 'Non-Fiction'; // Business is Non-Fiction
      else if (subject === 'science_fiction') category = 'Sci-Fi';

      const books = data.works
        .filter(w => w.cover_id && w.title)
        .map(work => {
          // Clean title
          const title = work.title.trim();
          
          // Skip if we have already seen this title to keep collection unique
          const titleKey = title.toLowerCase();
          if (seenTitles.has(titleKey)) return null;
          seenTitles.add(titleKey);

          return {
            title,
            author: Array.isArray(work.authors) && work.authors[0] ? work.authors[0].name : 'Unknown Author',
            price: Math.floor(Math.random() * 600) + 200, // Random price 200-800
            description: `A fascinating book about ${subject}. "${title}" will keep you engaged from start to finish.`,
            category,
            stock: Math.floor(Math.random() * 45) + 5,
            coverId: work.cover_id,
            cover: `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg`,
            ratingsAverage: parseFloat((Math.random() * 1.8 + 3.2).toFixed(1)), // 3.2 - 5.0
            isBestseller: Math.random() > 0.8
          };
        })
        .filter(Boolean) // filter out nulls (duplicates)
        .slice(0, 35); // Keep up to 35 books per category

      allBooks = [...allBooks, ...books];
      console.log(`Successfully parsed ${books.length} books for category "${category}"`);
      
      // Sleep between requests to avoid rate limits
      await sleep(1500);
    }

    fs.writeFileSync('./dev-data/data/books.json', JSON.stringify(allBooks, null, 2));
    console.log(`\nSuccess! Saved ${allBooks.length} books to ./dev-data/data/books.json`);
  } catch (err) {
    console.error('Fatal error seeding books:', err);
  }
}

fetchBooks();
