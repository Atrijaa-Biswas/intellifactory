import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 🔥 Firebase Config (Replace with your actual keys)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const dataRef = collection(db, "factoryData");

// 📊 Chart.js Initialization
let labels = [];
let powerData = [];

const energyChart = new Chart(document.getElementById("energyChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Power Load (kW)",
        data: powerData,
        borderColor: "#00f2ff",
        backgroundColor: "rgba(0, 242, 255, 0.1)",
        fill: true,
        tension: 0.4
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: false } } }
});

const gaugeChart = new Chart(document.getElementById("gaugeChart"), {
    type: "doughnut",
    data: {
      datasets: [{
        data: [80, 20],
        backgroundColor: ["#00ff88", "#334155"],
        borderWidth: 0
      }]
    },
    options: {
      circumference: 180,
      rotation: 270,
      cutout: "80%",
      plugins: { legend: { display: false } }
    }
});

// 🏭 Engineering Simulation: Correlated Data Generation
function generateFactoryData() {
  const power = parseFloat((Math.random() * 5 + 7).toFixed(2)); // 7-12 kW
  return {
    timestamp: new Date(),
    power: power,
    // Correlate temp slightly to power (higher power = higher heat)
    temp: parseFloat((800 + (power * 5) + Math.random() * 20).toFixed(1)),
    pressure: parseFloat((Math.random() * 2.5 + 6).toFixed(2)) // 6-8.5 bar
  };
}

// Push to Firebase every 4 seconds
setInterval(async () => {
  try { await addDoc(dataRef, generateFactoryData()); } 
  catch (e) { console.error("Firebase Error: ", e); }
}, 4000);

// 📡 Real-Time Listener & Intelligence Engine
const q = query(dataRef, orderBy("timestamp", "desc"), limit(1));

onSnapshot(q, (snapshot) => {
  snapshot.forEach((doc) => {
    const data = doc.data();

    // 1. Update UI Basic Values
    document.getElementById("power").innerText = data.power + " kW";
    document.getElementById("temp").innerText = data.temp + " °C";
    document.getElementById("pressure").innerText = data.pressure + " bar";

    // 2. 🌍 Sustainability Logic (0.4 kg CO2 per kWh)
    const carbonEmissions = (data.power * 0.4).toFixed(2);
    document.getElementById("carbon").innerText = carbonEmissions + " kg CO2/h";

    // 3. ⚙️ Weighted Efficiency Engineering Model
    const weights = { power: 0.5, temp: 0.3, pressure: 0.2 };
    
    // Sub-component Health Scores (1.0 = Ideal)
    const pHealth = data.power <= 10 ? 1 : Math.max(0, 1 - (data.power - 10) / 4);
    const tHealth = data.temp <= 860 ? 1 : Math.max(0, 1 - (data.temp - 860) / 80);
    const prHealth = data.pressure <= 7.2 ? 1 : Math.max(0, 1 - (data.pressure - 7.2) / 1.5);

    const score = Math.round(((pHealth * weights.power) + (tHealth * weights.temp) + (prHealth * weights.pressure)) * 100);
    
    document.getElementById("efficiency").innerText = score + "%";
    
    // Dynamic Color Coding
    const color = score > 85 ? "#00ff88" : score > 65 ? "#ffaa00" : "#ff4444";
    document.getElementById("efficiency").style.color = color;

    // 4. Update Charts
    gaugeChart.data.datasets[0].data = [score, 100 - score];
    gaugeChart.data.datasets[0].backgroundColor[0] = color;
    gaugeChart.update();

    if (labels.length > 12) { labels.shift(); powerData.shift(); }
    labels.push(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    powerData.push(data.power);
    energyChart.update();

    // 5. 💡 Optimization Logic
    let rec = "System health optimal. No action required.";
    if (data.pressure > 7.5) {
      rec = "⚠ High Pressure: Check for pneumatic leaks or reduce compressor load.";
    } else if (data.temp > 880) {
      rec = "⚠ Thermal Deviation: Inspect furnace insulation to prevent heat loss.";
    } else if (data.power > 11) {
      rec = "⚠ Peak Load: Optimize CNC job scheduling to reduce peak demand.";
    }
    document.getElementById("recommendation").innerText = rec;

    // 6. Savings Projection
    const baseline = 12.0;
    const savingPercent = Math.max(0, ((baseline - data.power) / baseline) * 100);
    document.getElementById("savings").innerText = savingPercent.toFixed(1) + "% vs Baseline";
  });
});

// 📄 Enhanced Report Generation
window.downloadReport = function () {
  const now = new Date().toLocaleString();
  const report = `
FACTORY IQ - OPTIMIZATION REPORT
Generated: ${now}
---------------------------------------
[OPERATIONAL METRICS]
CNC Power: ${document.getElementById("power").innerText}
Furnace Temp: ${document.getElementById("temp").innerText}
Compressor Pressure: ${document.getElementById("pressure").innerText}

[PERFORMANCE DATA]
System Efficiency: ${document.getElementById("efficiency").innerText}
Sustainability: ${document.getElementById("carbon").innerText}
Current Savings: ${document.getElementById("savings").innerText}

[ENGINEERING RECOMMENDATION]
${document.getElementById("recommendation").innerText}
---------------------------------------
End of Report
`;

  const blob = new Blob([report], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `FactoryIQ_Report_${Date.now()}.txt`;
  link.click();
};