export function checkAlerts(data) {
    if (!data) return null;

    if (data.temp > 880) return `CRITICAL: Furnace overheating detected at ${data.temp.toFixed(1)}°C`;
    if (data.pressure > 7.5) return `WARNING: Compressor over-pressure at ${data.pressure.toFixed(1)} bar`;
    if (data.power > 12) return `WARNING: Power spike detected at ${data.power.toFixed(1)} kW`;
    
    return null; // No alerts, system healthy
}