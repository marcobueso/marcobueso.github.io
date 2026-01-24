// Books data - single source of truth
// Status options: "Reading", "Finished", "Want to Read"
const allBooks = [
    // Currently Reading
     
    {
        title: "El Mito de Sísifo",
        author: "Albert Camus",
        isbn: "9788420618418",
        status: "Reading",
        progress: 40,
        genre: "Literary Fiction",
        startDate: "2026-01-11",
        thoughts: "Camus el GOAT"
    },

    // Books I've Read (add your finished books here)
    {
        title: "Siddhartha",
        author: "Hermann Hesse",
        isbn: "9780976072645",
        status: "Finished",
        progress: 100,
        genre: "Literary Fiction",
        startDate: "2025-10-01",
        finishDate: "2025-12-06",
        thoughts: "Think. Wait. Fast."
    },
        {
        title: "Child of God",
        author: "Cormac McCarthy",
        isbn: "0679728740",
        status: "Finished",
        progress: 100,
        genre: "Literary Fiction",
        startDate: "2025-12-07",
        finishDate: "2026-01-06",
        thoughts: "Ed Gein vibes."
    },
    {
        title: "Norwegian Wood",
        author: "Haruki Murakami",
        isbn: "9780375704024",
        status: "Finished",
        progress: 100,
        genre: "Fiction",
        startDate: "2025-07-15",
        finishDate: "2025-08-20",
        thoughts: "Good read. Took me years to get around it."
    },
    {
        title: "The Pragmatic Programmer",
        author: "David Thomas, Andrew Hunt",
        isbn: "9780135957059",
        status: "Want to Read",
        progress: 0,
        genre: "Programming",
        thoughts: "Recommended at work."
    },
    {
        title: "The First Man",
        author: "Albert Camus",
        isbn: "9780679732730",
        status: "Finished",
        progress: 100,
        genre: "Literary Fiction",
        startDate: "2025-08-01",
        finishDate: "2025-09-25",
        thoughts: "One of my favorite philosophers. Unfinished work which made it more intriguing."
    }

];

// Cache for book covers
const bookCoverCache = {};

// Initialize books section
async function initializeBooks() {
    const readingContainer = document.getElementById('reading-container');
    const readContainer = document.getElementById('read-container');
    
    if (!readingContainer && !readContainer) return;

    // Show loading state
    if (readingContainer) readingContainer.innerHTML = '<div class="loading">Loading...</div>';
    if (readContainer) readContainer.innerHTML = '<div class="loading">Loading...</div>';
    
    try {
        const booksWithCovers = await Promise.all(
            allBooks.map(async (book) => {
                const cover = await getBookCover(book.isbn);
                return { ...book, coverUrl: cover };
            })
        );
        
        // Split books by status
        const readingBooks = booksWithCovers.filter(book => book.status === 'Reading');
        const finishedBooks = booksWithCovers.filter(book => book.status === 'Finished');
        
        // Render to separate containers
        if (readingContainer) renderBooks(readingBooks, readingContainer, 'reading');
        if (readContainer) renderBooks(finishedBooks, readContainer, 'finished');
        
    } catch (error) {
        console.error('Error loading books:', error);
        const booksWithoutCovers = allBooks.map(book => ({ ...book, coverUrl: null }));
        const readingBooks = booksWithoutCovers.filter(book => book.status === 'Reading');
        const finishedBooks = booksWithoutCovers.filter(book => book.status === 'Finished');
        
        if (readingContainer) renderBooks(readingBooks, readingContainer, 'reading');
        if (readContainer) renderBooks(finishedBooks, readContainer, 'finished');
    }
}

// Fetch book cover from Open Library API
async function getBookCover(isbn) {
    if (bookCoverCache[isbn]) {
        return bookCoverCache[isbn];
    }
    
    try {
        // Try Open Library Covers API with ISBN
        const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
        
        // Test if the image exists
        const response = await fetch(coverUrl, { method: 'HEAD' });
        if (response.ok) {
            bookCoverCache[isbn] = coverUrl;
            return coverUrl;
        }
    } catch (error) {
        console.log(`No cover found for ISBN ${isbn}:`, error.message);
    }
    
    // Fallback to placeholder
    const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjBmMGYwIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiIvPgo8cmVjdCB4PSIyMCIgeT0iNDAiIHdpZHRoPSIxNjAiIGhlaWdodD0iNCIgZmlsbD0iI2RkZCIvPgo8cmVjdCB4PSIyMCIgeT0iNjAiIHdpZHRoPSIxMjAiIGhlaWdodD0iNCIgZmlsbD0iI2RkZCIvPgo8cmVjdCB4PSIyMCIgeT0iMTAwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjQiIGZpbGw9IiNkZGQiLz4KPHJlY3QgeD0iMjAiIHk9IjEyMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI0IiBmaWxsPSIjZGRkIi8+CjxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIxMjAiIGhlaWdodD0iNCIgZmlsbD0iI2RkZCIvPgo8dGV4dCB4PSIxMDAiIHk9IjI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2Ij5ObyBDb3ZlcjwvdGV4dD4KPC9zdmc+';
    bookCoverCache[isbn] = placeholder;
    return placeholder;
}

// Render books list to a specific container
function renderBooks(books, container, type) {
    if (books.length === 0) {
        container.innerHTML = `<p class="empty-message">No books ${type === 'reading' ? 'currently being read' : 'finished yet'}.</p>`;
        return;
    }
    
    const html = books.map(book => {
        const progressBar = book.status === 'Reading' ? 
            `<div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${book.progress}%"></div>
                </div>
                <span class="progress-text">${book.progress}%</span>
            </div>` : '';

        const dateInfo = book.status === 'Finished' ? 
            `<p class="book-date">Finished: ${formatDate(book.finishDate)}</p>` :
            book.status === 'Reading' ? 
            `<p class="book-date">Started: ${formatDate(book.startDate)}</p>` : '';

        return `
            <div class="book-item">
                <div class="book-cover">
                    <img src="${book.coverUrl || 'placeholder.jpg'}" 
                         alt="${book.title} cover" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjBmMGYwIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiIvPgo8cmVjdCB4PSIyMCIgeT0iNDAiIHdpZHRoPSIxNjAiIGhlaWdodD0iNCIgZmlsbD0iI2RkZCIvPgo8cmVjdCB4PSIyMCIgeT0iNjAiIHdpZHRoPSIxMjAiIGhlaWdodD0iNCIgZmlsbD0iI2RkZCIvPgo8cmVjdCB4PSIyMCIgeT0iMTAwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjQiIGZpbGw9IiNkZGQiLz4KPHJlY3QgeD0iMjAiIHk9IjEyMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI0IiBmaWxsPSIjZGRkIi8+CjxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIxMjAiIGhlaWdodD0iNCIgZmlsbD0iI2RkZCIvPgo8dGV4dCB4PSIxMDAiIHk9IjI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2Ij5ObyBDb3ZlcjwvdGV4dD4KPC9zdmc+'">
                </div>
                <div class="book-details">
                    <h4 class="book-title">${book.title}</h4>
                    <p class="book-author">${book.author}</p>
                    <p class="book-genre">${book.genre}</p>
                    ${dateInfo}
                    ${progressBar}
                    ${book.thoughts ? `<p class="book-thoughts">"${book.thoughts}"</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Add to window load event or call directly
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBooks);
} else {
    initializeBooks();
}
