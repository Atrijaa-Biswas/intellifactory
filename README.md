# intellifactory

https://atrijaa-biswas.github.io/intellifactory/
<div align="center">

# 🏭 IntelliFactory

**A real-time command center for smart factory monitoring — machine health, power, cost, and sustainability in one dashboard.**

[Live Demo](https://atrijaa-biswas.github.io/intellifactory/)

</div>

IntelliFactory is a live IoT-style command center for a manufacturing floor. It streams simulated machine telemetry (temperature, pressure, load, health) straight to Firebase and visualizes it across dedicated views — helping operators spot machine issues, cost spikes, and inefficiencies as they happen.

- 📊 **Overview** — Live machine status board with real-time health % and current load (kW) at a glance.
- 🌡️ **CNC Monitoring** — Dedicated temperature & pressure tracking to catch drift before it becomes downtime.
- ⚡ **Power & Cost** — Real-time energy consumption trend chart (last 1 hour) tied to running cost.
- 🌱 **Sustainability** — Tracks the factory's energy footprint over time.
- 🧠 **Intelligence** — Higher-level insights derived from the live sensor data.
- 🕒 **Shift Analytics** — Breaks down performance and efficiency by shift.
- ⚙️ **Simulation & Logging** — Auto Mode generates sensor data every 10 seconds and logs each sample to Firebase.

**Stack:** Firebase (real-time data logging) · Charting/dashboard front-end
