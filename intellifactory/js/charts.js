/** * Configures a professional dual-axis industrial chart.
 * Left Axis: Temperature (°C)
 * Right Axis: Pressure (bar)
 */
export function initCncChart(ctx) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { 
                    label: 'Temperature (°C)', 
                    data: [], 
                    borderColor: '#ef4444', 
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    tension: 0.4, 
                    fill: true,
                    yAxisID: 'y' 
                },
                { 
                    label: 'Pressure (bar)', 
                    data: [], 
                    borderColor: '#3b82f6', 
                    borderWidth: 2,
                    tension: 0.4, 
                    yAxisID: 'y1' 
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    type: 'linear', 
                    display: true, 
                    position: 'left',
                    title: { display: true, text: 'Celsius' }
                },
                y1: { 
                    type: 'linear', 
                    display: true, 
                    position: 'right', 
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Bar' }
                }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}