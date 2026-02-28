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

const firebaseConfig = {
apiKey: "AIzaSyCWEMwRhmkSZ7GARQVuby0hIDMXLasItGE",
  authDomain: "factoryintelli.firebaseapp.com",
  projectId: "factoryintelli",
  storageBucket: "factoryintelli.firebasestorage.app",
  messagingSenderId: "343300625257",
  appId: "1:343300625257:web:c3c1ec5972db691fb423f8",
  measurementId: "G-LCMQCSN51M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const dataRef = collection(db, "factoryData");

// 📊 Chart Initialization
let labels = [];
let powerData = [];
const energyChart = new Chart(document.getElementById("energyChart"), {
  type: "line",
  data: {
    labels: labels,
    datasets: [{ label: "Power Load (kW)", data: powerData, borderColor: "#00f2ff", tension: 0.4 }]
  }
});

const gaugeChart = new Chart(document.getElementById("gaugeChart"), {
  type: "doughnut",
  data: {
    datasets: [{ data: [0, 100], backgroundColor: ["#00ff88", "#333"] }]
  },
  options: { circumference: 180, rotation: 270, cutout: "80%" }
});

// 🚀 1. MANUAL PUSH FUNCTION
window.pushManualData = async function() {
  const p = document.getElementById("manualPower").value;
  const t = document.getElementById("manualTemp").value;
  const pr = document.getElementById("manualPressure").value;

  if(!p || !t || !pr) return alert("Fill all fields!");

  await addDoc(dataRef, {
    timestamp: new Date(),
    power: parseFloat(p),
    temp: parseFloat(t),
    pressure: parseFloat(pr)
  });
  
  // Clear inputs
  document.querySelectorAll(".input-row input").forEach(i => i.value = "");
};

// 📡 2. REAL-TIME LISTENER (Works for both Manual and Sensor input)
const q = query(dataRef, orderBy("timestamp", "desc"), limit(1));

onSnapshot(q, (snapshot) => {
  snapshot.forEach((doc) => {
    const data = doc.data();

    // Display basic values
    document.getElementById("power").innerText = data.power + " kW";
    document.getElementById("temp").innerText = data.temp + " °C";
    document.getElementById("pressure").innerText = data.pressure + " bar";

    // Sustainability: Carbon Logic (0.4 kg/kWh)
    const carbon = (data.power * 0.4).toFixed(2);
    document.getElementById("carbon").innerText = carbon + " kg CO2/h";

    // ⚙️ Weighted Efficiency Model
    const w = { power: 0.5, temp: 0.3, press: 0.2 };
    const pHealth = data.power <= 10 ? 1 : Math.max(0, 1 - (data.power - 10) / 5);
    const tHealth = data.temp <= 850 ? 1 : Math.max(0, 1 - (data.temp - 850) / 100);
    const prHealth = data.pressure <= 7.2 ? 1 : Math.max(0, 1 - (data.pressure - 7.2) / 2);

    const score = Math.round(((pHealth * w.power) + (tHealth * w.temp) + (prHealth * w.press)) * 100);
    document.getElementById("efficiency").innerText = score + "%";

    // Update UI Elements
    gaugeChart.data.datasets[0].data = [score, 100 - score];
    gaugeChart.update();

    if (labels.length > 10) { labels.shift(); powerData.shift(); }
    labels.push(new Date().toLocaleTimeString());
    powerData.push(data.power);
    energyChart.update();

    // Recommendation Logic
    let rec = "System operating within optimal parameters.";
    if (data.power > 11) rec = "⚠ High Power Load: Consolidate CNC tasks.";
    if (data.temp > 880) rec = "⚠ Overheating: Inspect furnace insulation.";
    document.getElementById("recommendation").innerText = rec;

    // Savings
    const savings = Math.max(0, ((12 - data.power) / 12) * 100).toFixed(1);
    document.getElementById("savings").innerText = savings + "% Efficiency Gain";
  });
});

// 📄 REPORT DOWNLOAD
window.downloadReport = function() {
  const content = `FactoryIQ Report\nPower: ${document.getElementById("power").innerText}\nEfficiency: ${document.getElementById("efficiency").innerText}\nRecommendation: ${document.getElementById("recommendation").innerText}`;
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Factory_Report.txt";
  link.click();
};