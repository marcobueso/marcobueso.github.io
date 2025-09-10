// Songs I'm learning on guitar with MusicBrainz API integration
const guitarSongs = [
    {
        title: "Stairway to Heaven",
        artist: "Led Zeppelin",
        album: "Led Zeppelin IV",
        status: "Learning", // Learning, Practicing, Mastered
        difficulty: "Advanced"
    },
    {
        title: "Wish You Were Here",
        artist: "Pink Floyd",
        album: "Wish You Were Here",
        status: "Practicing",
        difficulty: "Intermediate"
    },
    {
        title: "Mother",
        artist: "Pink Floyd",
        album: "The Wall",
        status: "Mastered",
        difficulty: "Intermediate"
    },
    {
        title: "Something in the Orange",
        artist: "Zach Bryan",
        album: "American Heartbreak",
        status: "Practicing",
        difficulty: "Beginner"
    },
    {
        title: "Mi Historia Entre tus Dedos",
        artist: "Gianluca Grignani",
        album: "Destino Paraiso",
        status: "Practicing",
        difficulty: "Intermediate"
    }
];

// Cache for album covers
const albumCoverCache = {};

// Initialize guitar songs section
async function initializeGuitarSongs() {
    const container = document.getElementById('guitar-songs-container');
    if (!container) return;

    container.innerHTML = '<div class="loading">Loading album covers...</div>';
    
    try {
        const songsWithCovers = await Promise.all(
            guitarSongs.map(async (song) => {
                const cover = await getAlbumCover(song.artist, song.album);
                return { ...song, coverUrl: cover };
            })
        );
        
        renderGuitarSongs(songsWithCovers);
    } catch (error) {
        console.error('Error loading guitar songs:', error);
        renderGuitarSongs(guitarSongs.map(song => ({ ...song, coverUrl: null })));
    }
}

// Fetch album cover from MusicBrainz API using artist and album name
async function getAlbumCover(artist, album) {
    const cacheKey = `${artist}-${album}`;
    if (albumCoverCache[cacheKey]) {
        return albumCoverCache[cacheKey];
    }
    
    try {
        // Search for the release using artist and album name
        const searchQuery = encodeURIComponent(`artist:"${artist}" AND release:"${album}"`);
        const searchResponse = await fetch(`https://musicbrainz.org/ws/2/release/?query=${searchQuery}&fmt=json&limit=1`);
        
        if (!searchResponse.ok) throw new Error('MusicBrainz search API error');
        
        const searchData = await searchResponse.json();
        if (!searchData.releases || searchData.releases.length === 0) {
            throw new Error('No releases found');
        }
        
        const releaseId = searchData.releases[0].id;
        
        // Try to get cover art from Cover Art Archive using the found release ID
        const coverResponse = await fetch(`https://coverartarchive.org/release/${releaseId}/front-250`);
        if (coverResponse.ok) {
            const coverUrl = coverResponse.url;
            albumCoverCache[cacheKey] = coverUrl;
            return coverUrl;
        }
    } catch (error) {
        console.log(`No cover found for ${artist} - ${album}:`, error.message);
    }
    
    // Fallback to placeholder
    const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDI1MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik0xMjUgNzVMMTc1IDEyNUwxMjUgMTc1TDc1IDEyNUwxMjUgNzVaIiBmaWxsPSIjY2NjIi8+Cjx0ZXh0IHg9IjEyNSIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjYiPk5vIENvdmVyPC90ZXh0Pgo8L3N2Zz4K';
    albumCoverCache[cacheKey] = placeholder;
    return placeholder;
}

// Render guitar songs list
function renderGuitarSongs(songs) {
    const container = document.getElementById('guitar-songs-container');
    
    const html = songs.map(song => `
        <div class="song-item">
            <div class="song-cover">
                <img src="${song.coverUrl || 'placeholder.jpg'}" 
                     alt="${song.album} cover" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDI1MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik0xMjUgNzVMMTc1IDEyNUwxMjUgMTc1TDc1IDEyNUwxMjUgNzVaIiBmaWxsPSIjY2NjIi8+Cjx0ZXh0IHg9IjEyNSIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjYiPk5vIENvdmVyPC90ZXh0Pgo8L3N2Zz4K'">
            </div>
            <div class="song-details">
                <h4 class="song-title">${song.title}</h4>
                <p class="song-artist">${song.artist}</p>
                <p class="song-album">${song.album}</p>
                <div class="song-meta">
                    <span class="song-status status-${song.status.toLowerCase()}">${song.status}</span>
                    <span class="song-difficulty">${song.difficulty}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Add to window load event or call directly
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGuitarSongs);
} else {
    initializeGuitarSongs();
}
