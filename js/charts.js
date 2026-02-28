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
                    tension: 0.3, 
                    yAxisID: 'y' 
                },
                { 
                    label: 'Pressure (bar)', 
                    data: [], 
                    borderColor: '#3b82f6', 
                    tension: 0.3, 
                    yAxisID: 'y1' 
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { type: 'linear', display: true, position: 'left' },
                y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } }
            }
        }
    });
}

export function updateCncChart(chart, temp, pressure) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    if (chart.data.labels.length > 15) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
        chart.data.datasets[1].data.shift();
    }
    
    chart.data.labels.push(timeStr);
    chart.data.datasets[0].data.push(temp);
    chart.data.datasets[1].data.push(pressure);
    chart.update();
}