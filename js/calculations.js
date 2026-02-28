// ⚙️ Core Industrial Constants
const CONFIG = {
    COST_PER_KWH: 8,       // ₹8 per kWh
    CO2_FACTOR: 0.82,      // kg CO2 per kWh
};

/** Calculates hourly cost based on power load */
export function calculateCost(power) {
    if (power === undefined || power === null) return "0.00";
    return (power * CONFIG.COST_PER_KWH).toFixed(2);
}

/** Calculates carbon footprint based on power load */
export function calculateCarbon(power) {
    if (power === undefined || power === null) return "0.00";
    return (power * CONFIG.CO2_FACTOR).toFixed(2);
}

/** * 🔮 Predictive Risk Engine 
 * Calculates risk % based on stress parameters 
 */
export function calculateFailureRisk(data) {
    if (!data) return 0;
    let risk = 0;

    // Temperature Stress (Threshold: 880°C)
    if (data.temp > 880) risk += 50;
    else if (data.temp > 850) risk += 20;

    // Pressure Stress (Threshold: 7.5 bar)
    if (data.pressure > 7.5) risk += 30;
    else if (data.pressure > 7.0) risk += 15;

    // Power Load Stress
    if (data.power > 11.5) risk += 20;

    return Math.min(risk, 100); // Caps at 100%
}

/** 🚦 Determines Machine Operating State */
export function getMachineStatus(data) {
    if (!data) return "WAITING";
    if (data.temp >= 880 || data.pressure >= 8.0) return "FAULT";
    if (data.power < 1) return "IDLE";
    return "RUNNING";
}