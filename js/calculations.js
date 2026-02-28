// ⚙️ Core Industrial Constants
const CONFIG = {
    COST_PER_KWH: 8,       // ₹8 per kWh
    CO2_FACTOR: 0.82,      // kg CO2 per kWh
};

export function calculateCost(power) {
    return (power * CONFIG.COST_PER_KWH).toFixed(2);
}

export function calculateCarbon(power) {
    return (power * CONFIG.CO2_FACTOR).toFixed(2);
}

// 🔮 AI-Style Failure Risk Engine
export function calculateFailureRisk(data) {
    if (!data) return 0;
    let risk = 0;

    // Temperature Weights
    if (data.temp > 880) risk += 50;
    else if (data.temp > 850) risk += 20;

    // Pressure Weights
    if (data.pressure > 7.5) risk += 30;
    else if (data.pressure > 7.0) risk += 15;

    // Power Load Weights
    if (data.power > 11.5) risk += 20;

    return Math.min(risk, 100); // Max cap at 100%
}

// 🚦 Machine State Logic
export function getMachineStatus(data) {
    if (!data) return "WAITING";
    if (data.temp >= 880 || data.pressure >= 8.0) return "FAULT";
    if (data.power < 1) return "IDLE";
    return "RUNNING";
}