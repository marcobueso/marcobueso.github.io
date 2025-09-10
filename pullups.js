// 52-Week Pull-Up Challenge Tracker
// Future-proof data structure for weekly goals and completion tracking

// Placeholder data structure - replace with actual goals later
const pullupWeeks = [
    { week: 1, goal: 60, completed: 0 },
    { week: 2, goal: 72, completed: 0 },
    { week: 3, goal: 84, completed: 0 },
    { week: 4, goal: 96, completed: 0 },
    { week: 5, goal: 108, completed: 0 },
    { week: 6, goal: 108, completed: 0 },
    { week: 7, goal: 120, completed: 0 },
    { week: 8, goal: 120, completed: 0 },
    { week: 9, goal: 120, completed: 0 },
    { week: 10, goal: 120, completed: 0 },
    { week: 11, goal: 120, completed: 0 },
    { week: 12, goal: 120, completed: 0 },
    { week: 13, goal: 132, completed: 0 },
    { week: 14, goal: 144, completed: 0 },
    { week: 15, goal: 144, completed: 0 },
    { week: 16, goal: 156, completed: 0 },
    { week: 17, goal: 156, completed: 0 },
    { week: 18, goal: 168, completed: 0 },
    { week: 19, goal: 168, completed: 0 },
    { week: 20, goal: 168, completed: 0 },
    { week: 21, goal: 180, completed: 0 },
    { week: 22, goal: 180, completed: 0 },
    { week: 23, goal: 180, completed: 0 },
    { week: 24, goal: 180, completed: 0 },
    { week: 25, goal: 192, completed: 0 },
    { week: 26, goal: 192, completed: 0 },
    { week: 27, goal: 204, completed: 0 },
    { week: 28, goal: 204, completed: 0 },
    { week: 29, goal: 216, completed: 0 },
    { week: 30, goal: 216, completed: 0 },
    { week: 31, goal: 216, completed: 0 },
    { week: 32, goal: 216, completed: 0 },
    { week: 33, goal: 204, completed: 0 },
    { week: 34, goal: 204, completed: 0 },
    { week: 35, goal: 192, completed: 0 },
    { week: 36, goal: 192, completed: 0 },
    { week: 37, goal: 200, completed: 0 },
    { week: 38, goal: 200, completed: 0 },
    { week: 39, goal: 200, completed: 0 },
    { week: 40, goal: 200, completed: 0 },
    { week: 41, goal: 180, completed: 0 },
    { week: 42, goal: 180, completed: 0 },
    { week: 43, goal: 160, completed: 0 },
    { week: 44, goal: 160, completed: 0 },
    { week: 45, goal: 160, completed: 0 },
    { week: 46, goal: 140, completed: 0 },
    { week: 47, goal: 140, completed: 0 },
    { week: 48, goal: 140, completed: 0 },
    { week: 49, goal: 120, completed: 0 },
    { week: 50, goal: 120, completed: 0 },
    { week: 51, goal: 120, completed: 0 },
    { week: 52, goal: 120, completed: 0 }
];

// Initialize empty weeks if no data provided
function initializeWeeks() {
    if (pullupWeeks.length === 0) {
        for (let i = 1; i <= 52; i++) {
            pullupWeeks.push({
                week: i,
                goal: 0, // You can set default goals later
                completed: 0
            });
        }
    }
}

// Calculate cumulative totals
function calculateCumulative(weekIndex) {
    let cumulative = 0;
    for (let i = 0; i <= weekIndex; i++) {
        cumulative += pullupWeeks[i].completed || 0;
    }
    return cumulative;
}

// Generate table rows dynamically
function populatePullupTable() {
    const tbody = document.getElementById('pullup-tbody');
    if (!tbody) return;

    // Clear existing rows
    tbody.innerHTML = '';

    pullupWeeks.forEach((week, index) => {
        const row = document.createElement('tr');
        const cumulative = calculateCumulative(index);
        
        row.innerHTML = `
            <td class="week-number">${week.week}</td>
            <td class="goal-cell">${week.goal}</td>
            <td class="completed-cell">${week.completed}</td>
            <td class="cumulative-cell">${cumulative}</td>
        `;

        // Add class for completed weeks (if completed >= goal and goal > 0)
        if (week.goal > 0 && week.completed >= week.goal) {
            row.classList.add('week-completed');
        }

        tbody.appendChild(row);
    });
}

// Update a specific week's data (for future use)
function updateWeekData(weekNumber, goal, completed) {
    const weekIndex = weekNumber - 1;
    if (weekIndex >= 0 && weekIndex < pullupWeeks.length) {
        pullupWeeks[weekIndex].goal = goal || 0;
        pullupWeeks[weekIndex].completed = completed || 0;
        
        // Re-populate table to update cumulative values
        populatePullupTable();
    }
}

// Get current week progress summary (for future dashboard use)
function getProgressSummary() {
    const totalGoal = pullupWeeks.reduce((sum, week) => sum + (week.goal || 0), 0);
    const totalCompleted = pullupWeeks.reduce((sum, week) => sum + (week.completed || 0), 0);
    const completedWeeks = pullupWeeks.filter(week => 
        week.goal > 0 && week.completed >= week.goal
    ).length;
    
    return {
        totalGoal,
        totalCompleted,
        completedWeeks,
        totalWeeks: pullupWeeks.length,
        percentage: totalGoal > 0 ? Math.round((totalCompleted / totalGoal) * 100) : 0
    };
}

// Initialize the table when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeWeeks();
    populatePullupTable();
});

// Export functions for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        pullupWeeks,
        updateWeekData,
        getProgressSummary,
        populatePullupTable
    };
}
