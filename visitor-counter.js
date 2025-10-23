/**
 * Real Cross-Device Visitor Counter
 * Uses CountAPI.xyz free service for shared visitor counting
 */

class VisitorCounter {
    constructor() {
        this.namespace = 'marcobueso.github.io';
        this.key = 'visitors';
        this.apiUrl = `https://api.countapi.xyz`;
        this.hasVisitedKey = 'marcobueso-has-visited';
        this.init();
    }

    async init() {
        try {
            // Check if this user has visited before (to avoid multiple counts from same user)
            const hasVisited = this.hasUserVisited();
            
            if (!hasVisited) {
                // New visitor - increment the global counter
                await this.incrementCounter();
                this.markUserAsVisited();
            } else {
                // Returning visitor - just get current count
                await this.getCounter();
            }
        } catch (error) {
            console.error('Visitor counter error:', error);
            this.displayFallback();
        }
    }

    hasUserVisited() {
        return localStorage.getItem(this.hasVisitedKey) !== null;
    }

    markUserAsVisited() {
        const timestamp = new Date().toISOString();
        localStorage.setItem(this.hasVisitedKey, timestamp);
    }

    async incrementCounter() {
        try {
            const response = await fetch(`${this.apiUrl}/hit/${this.namespace}/${this.key}`);
            const data = await response.json();
            
            if (data.value) {
                this.displayCounter(data.value);
            } else {
                throw new Error('Failed to increment counter');
            }
        } catch (error) {
            console.error('Error incrementing counter:', error);
            this.displayFallback();
        }
    }

    async getCounter() {
        try {
            const response = await fetch(`${this.apiUrl}/get/${this.namespace}/${this.key}`);
            const data = await response.json();
            
            if (data.value) {
                this.displayCounter(data.value);
            } else {
                throw new Error('Failed to get counter');
            }
        } catch (error) {
            console.error('Error getting counter:', error);
            this.displayFallback();
        }
    }

    displayCounter(count) {
        const counterElement = document.getElementById('visitor-counter');
        
        if (counterElement) {
            // Simple display without animation for reliability
            counterElement.textContent = `You are visitor #${count.toLocaleString()}`;
        }
    }

    displayFallback() {
        const counterElement = document.getElementById('visitor-counter');
        
        if (counterElement) {
            // Fallback to a generic message if API fails
            counterElement.textContent = 'Thanks for visiting!';
        }
    }

    // Method to reset the user's visited status (for testing)
    resetUserVisited() {
        localStorage.removeItem(this.hasVisitedKey);
        console.log('User visited status reset');
    }
}

// Initialize the visitor counter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VisitorCounter();
});

// Expose reset method globally for debugging
window.resetUserVisited = () => {
    localStorage.removeItem('marcobueso-has-visited');
    console.log('User visited status reset - refresh page to count as new visitor');
};