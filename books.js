// Books I'm currently reading
const currentBooks = [
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
        status: "Reading",
        progress: 80,
        genre: "Literary Fiction",
        startDate: "2025-02-01",
        thoughts: "One of my favorite philosophers."
    },
];

// Cache for book covers
const bookCoverCache = {};

// Initialize books section
async function initializeBooks() {
    const container = document.getElementById('books-container');
    if (!container) return;

    container.innerHTML = '<div class="loading">Loading book covers...</div>';
    
    try {
        const booksWithCovers = await Promise.all(
            currentBooks.map(async (book) => {
                const cover = await getBookCover(book.isbn);
                return { ...book, coverUrl: cover };
            })
        );
        
        renderBooks(booksWithCovers);
    } catch (error) {
        console.error('Error loading books:', error);
        renderBooks(currentBooks.map(book => ({ ...book, coverUrl: null })));
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

// Render books list
function renderBooks(books) {
    const container = document.getElementById('books-container');
    
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
                    <div class="book-meta">
                        <span class="book-status status-${book.status.toLowerCase().replace(/\s+/g, '-')}">${book.status}</span>
                    </div>
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
