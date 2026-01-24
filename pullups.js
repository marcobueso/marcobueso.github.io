// 52-Week Pull-Up Challenge - Cumulative Progress Chart
// Update the 'actual' array weekly with your pull-up counts

const WEEKLY_TARGET = 196;
const TOTAL_WEEKS = 52;
const MAX_CUMULATIVE = WEEKLY_TARGET * TOTAL_WEEKS; // 10,192

// Weekly pull-up data - UPDATE THIS ARRAY with your actual weekly counts
const pullupData = {
    actual: [
        0, 0, 100, 95, 0, 0, 0, 0, 0, 0,  // Weeks 1-10
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  // Weeks 11-20
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  // Weeks 21-30
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  // Weeks 31-40
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  // Weeks 41-50
        0, 0                           // Weeks 51-52
    ]
};

// Generate week labels [1, 2, 3, ..., 52]
function generateWeekLabels() {
    return Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);
}

// Generate expected cumulative data [196, 392, 588, ..., 10192]
function generateExpectedData() {
    return Array.from({ length: TOTAL_WEEKS }, (_, i) => (i + 1) * WEEKLY_TARGET);
}

// Calculate cumulative sums from actual weekly data
function calculateCumulativeActual(actualData) {
    const cumulative = [];
    let runningTotal = 0;
    
    for (let i = 0; i < actualData.length; i++) {
        runningTotal += actualData[i];
        cumulative.push(runningTotal);
    }
    
    return cumulative;
}

// Find the last week index with a non-zero entry
function findLastNonZeroIndex(actualData) {
    for (let i = actualData.length - 1; i >= 0; i--) {
        if (actualData[i] > 0) {
            return i;
        }
    }
    return -1; // No non-zero entries
}

// Prepare actual data array with null for hidden weeks
function prepareActualDataForChart(actualData) {
    const cumulative = calculateCumulativeActual(actualData);
    const lastNonZeroIndex = findLastNonZeroIndex(actualData);
    
    // If no data yet, return all nulls
    if (lastNonZeroIndex === -1) {
        return cumulative.map(() => null);
    }
    
    // Show data up to and including the last non-zero week
    return cumulative.map((value, index) => {
        return index <= lastNonZeroIndex ? value : null;
    });
}

// Initialize the chart
function initializePullupChart() {
    const canvas = document.getElementById('pullups-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set Chart.js global defaults for theming
    Chart.defaults.font.family = "'JetBrains Mono', monospace";
    Chart.defaults.color = '#e8e8e8';

    const weekLabels = generateWeekLabels();
    const expectedData = generateExpectedData();
    const actualData = prepareActualDataForChart(pullupData.actual);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weekLabels,
            datasets: [
                {
                    label: 'Expected',
                    data: expectedData,
                    borderColor: '#4A90E2',
                    backgroundColor: '#4A90E2',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    tension: 0
                },
                {
                    label: 'Actual',
                    data: actualData,
                    borderColor: '#50C878',
                    backgroundColor: '#50C878',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointBackgroundColor: '#50C878',
                    fill: false,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#2a2a2a',
                        font: {
                            family: "'JetBrains Mono', monospace"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#222222',
                    titleColor: '#f5f5f5',
                    bodyColor: '#e8e8e8',
                    borderColor: '#2a2a2a',
                    borderWidth: 1,
                    cornerRadius: 0,
                    titleFont: {
                        family: "'JetBrains Mono', monospace"
                    },
                    bodyFont: {
                        family: "'JetBrains Mono', monospace"
                    },
                    callbacks: {
                        title: function(context) {
                            return 'Week ' + context[0].label;
                        },
                        label: function(context) {
                            const datasetLabel = context.dataset.label;
                            const value = context.parsed.y;
                            if (value === null) {
                                return datasetLabel + ': --';
                            }
                            return datasetLabel + ': ' + value.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0a0'
                    },
                    title: {
                        display: true,
                        text: 'Week',
                        color: '#a0a0a0'
                    }
                },
                y: {
                    min: 0,
                    max: MAX_CUMULATIVE,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0a0',
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    },
                    title: {
                        display: true,
                        text: 'Cumulative Pull-ups',
                        color: '#a0a0a0'
                    }
                }
            }
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializePullupChart);