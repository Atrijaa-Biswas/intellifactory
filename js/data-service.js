import { collection, addDoc, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

const dataRef = collection(db, "factoryData");
let autoInterval = null;
let currentRuntime = 120.5; // Starting base for runtime hours

// 📥 Push Data to Cloud
export async function pushData(payload) {
    try {
        await addDoc(dataRef, { ...payload, timestamp: new Date() });
    } catch(e) { 
        console.error("Data push failed:", e); 
    }
}

// Alias to maintain compatibility with index.html naming
export const pushManualData = pushData; 

// ⚙️ Auto Mode Simulation (Generates realistic drifting patterns)
export function toggleAutoMode(isEnabled) {
    if (isEnabled) {
        autoInterval = setInterval(() => {
            currentRuntime += 0.05; 
            pushData({
                power: parseFloat((8 + (Math.random() * 3)).toFixed(2)),       // 8 to 11 kW
                temp: parseFloat((820 + (Math.random() * 45)).toFixed(1)),     // 820 to 865 C
                pressure: parseFloat((6.5 + (Math.random() * 1.0)).toFixed(2)), // 6.5 to 7.5 bar
                runtime: parseFloat(currentRuntime.toFixed(2))
            });
        }, 4000); // Pushes realistic data every 4 seconds
    } else {
        clearInterval(autoInterval);
    }
}

// 📡 Real-Time Listeners
export function subscribeToLive(callback) {
    const q = query(dataRef, orderBy("timestamp", "desc"), limit(1));
    return onSnapshot(q, (snap) => {
        snap.forEach(doc => callback(doc.data()));
    });
}

export const subscribeToData = subscribeToLive; // Alias for cnc.html

// 📅 History Listener (For Analytics Page)
export function subscribeToHistory(callback) {
    const q = query(dataRef, orderBy("timestamp", "desc"), limit(100)); // Grabs last 100 points
    return onSnapshot(q, (snap) => {
        const arr = [];
        snap.forEach(doc => arr.push(doc.data()));
        callback(arr);
    });
}