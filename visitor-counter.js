/**
 * Reliable Visitor Counter
 * Uses localStorage-based counting with domain persistence
 */

class VisitorCounter {
    constructor() {
        this.hasVisitedKey = 'marcobueso-has-visited';
        this.globalCountKey = 'marcobueso-global-count';
        this.init();
    }

    async init() {
        try {
            // Check if this user has visited before
            const hasVisited = this.hasUserVisited();
            
            if (!hasVisited) {
                // New visitor - increment counter
                this.incrementCounter();
                this.markUserAsVisited();
            }
            
            // Display current count
            this.displayCurrentCount();
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

    incrementCounter() {
        let count = this.getGlobalCount();
        count++;
        this.saveGlobalCount(count);
        return count;
    }

    displayCurrentCount() {
        const count = this.getGlobalCount();
        this.displayCounter(count);
    }

    getGlobalCount() {
        const stored = localStorage.getItem(this.globalCountKey);
        return stored ? parseInt(stored, 10) : 42; // Start from 42 as a fun default
    }

    saveGlobalCount(count) {
        localStorage.setItem(this.globalCountKey, count.toString());
    }

    displayCounter(count) {
        const counterElement = document.getElementById('visitor-counter');
        
        if (counterElement) {
            counterElement.textContent = `You are visitor #${count.toLocaleString()}`;
        }
    }

    displayFallback() {
        const counterElement = document.getElementById('visitor-counter');
        
        if (counterElement) {
            counterElement.textContent = 'Thanks for visiting!';
        }
    }

    // Method to reset the user's visited status (for testing)
    resetUserVisited() {
        localStorage.removeItem(this.hasVisitedKey);
        console.log('User visited status reset');
    }

    // Method to reset counter (for testing)
    resetCounter() {
        localStorage.removeItem(this.globalCountKey);
        console.log('Counter reset');
    }
}

// Initialize the visitor counter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VisitorCounter();
});

// Expose reset methods globally for debugging
window.resetUserVisited = () => {
    localStorage.removeItem('marcobueso-has-visited');
    console.log('User visited status reset - refresh page to count as new visitor');
};

window.resetCounter = () => {
    localStorage.removeItem('marcobueso-global-count');
    console.log('Counter reset');
};