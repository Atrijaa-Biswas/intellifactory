import { 
    collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

const dataRef = collection(db, "factoryData");
let autoInterval = null;
let currentRuntime = 120.5;

// We store the "Current State" of the machine so it fluctuates naturally
let currentPower = 9.5;
let currentTemp = 840.0;
let currentPressure = 7.0;

/** * Pushes data to Firebase.
 * We also update the "Current State" here so that if you push MANUAL data,
 * the machine actually stays at your new numbers and drifts from there!
 */
export async function pushData(payload) {
    try {
        // Sync the generator to manual inputs
        if (payload.power) currentPower = payload.power;
        if (payload.temp) currentTemp = payload.temp;
        if (payload.pressure) currentPressure = payload.pressure;

        await addDoc(dataRef, { 
            ...payload, 
            timestamp: serverTimestamp() 
        });
    } catch(e) { 
        console.error("Firebase sync failed:", e); 
    }
}

/** * Simulator: Uses a "Random Walk" for smooth, realistic machine behavior.
 */
export function toggleAutoMode(isEnabled) {
    if (isEnabled) {
        autoInterval = setInterval(() => {
            currentRuntime += (10 / 3600); 

            // Add tiny fluctuations (jitter) to the current state
            currentPower += (Math.random() * 0.4 - 0.2);     // Fluctuate by +/- 0.2 kW
            currentTemp += (Math.random() * 4.0 - 2.0);      // Fluctuate by +/- 2.0 °C
            currentPressure += (Math.random() * 0.2 - 0.1);  // Fluctuate by +/- 0.1 bar

            // Soft limits so the machine doesn't naturally drift into a permanent FAULT
            // (Unless you force it to with a manual input!)
            if (currentPower > 11.5) currentPower -= 0.5;
            if (currentPower < 7.5) currentPower += 0.5;
            if (currentTemp > 865) currentTemp -= 3;
            if (currentTemp < 810) currentTemp += 3;
            if (currentPressure > 7.4) currentPressure -= 0.2;
            if (currentPressure < 6.5) currentPressure += 0.2;

            pushData({
                power: parseFloat(currentPower.toFixed(2)),       
                temp: parseFloat(currentTemp.toFixed(1)),     
                pressure: parseFloat(currentPressure.toFixed(2)), 
                runtime: parseFloat(currentRuntime.toFixed(2))
            });
        }, 10000); // 10 seconds
    } else {
        clearInterval(autoInterval);
    }
}

/** Fetches 360 records (1 Hour) for smooth continuous graphs */
export function subscribeToHistory(callback, limitCount = 360) {
    const q = query(dataRef, orderBy("timestamp", "desc"), limit(limitCount)); 
    return onSnapshot(q, (snap) => {
        const historyArray = [];
        snap.forEach(doc => historyArray.push(doc.data()));
        callback(historyArray.reverse()); 
    });
}

/** Real-time listener for dashboard numbers */
export function subscribeToLive(callback) {
    const q = query(dataRef, orderBy("timestamp", "desc"), limit(1));
    return onSnapshot(q, (snap) => {
        if (!snap.empty) callback(snap.docs[0].data());
    });
}