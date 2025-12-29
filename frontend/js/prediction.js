// Auto-fill current time
document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  document.getElementById("timeInput").value = currentTime;
});

// Detect Time Slot
function getTimeSlot(timeValue) {
  const hour = parseInt(timeValue.split(":")[0]);

  if ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 21)) {
    return { slot: "Peak", score: 3 };
  }

  if (hour >= 10 && hour < 17) {
    return { slot: "Normal", score: 2 };
  }

  return { slot: "Off-Peak", score: 1 };
}

// Main Prediction Function
function predictCrowd() {
  let score = 0;
  let reasons = [];

  // Route
  const route = document.getElementById("route").value;
  if (route === "high") { score += 3; reasons.push("Busy route"); }
  if (route === "medium") score += 2;
  if (route === "low") score += 1;

  // Time Slot (Auto)
  const timeValue = document.getElementById("timeInput").value;
  if (!timeValue) {
    alert("Please select time");
    return;
  }

  const timeData = getTimeSlot(timeValue);
  score += timeData.score;
  reasons.push(timeData.slot + " hour");

  document.getElementById("timeSlot").innerText =
    "Detected Time Slot: " + timeData.slot;

  // Day
  const day = document.getElementById("day").value;
  if (day === "weekday") { score += 2; reasons.push("Weekday travel"); }
  if (day === "weekend") score += 1;

  // Weather
  const weather = document.getElementById("weather").value;
  if (weather === "rain") { score += 2; reasons.push("Rainy weather"); }
  if (weather === "extreme") { score += 3; reasons.push("Extreme weather"); }

  // Holiday
  const holiday = document.getElementById("holiday").value;
  if (holiday === "yes") {
    score -= 2;
    reasons.push("Holiday");
  }

  // Event
  const event = document.getElementById("event").value;
  if (event === "yes") {
    score += 3;
    reasons.push("Nearby event");
  }

  // Final Result
  let level = "";
  let color = "";

  if (score >= 9) {
    level = "🔴 HIGH CROWD";
    color = "red";
  } else if (score >= 5) {
    level = "🟡 MEDIUM CROWD";
    color = "orange";
  } else {
    level = "🟢 LOW CROWD";
    color = "green";
  }

  document.getElementById("result").innerText = level;
  document.getElementById("result").style.color = color;

  document.getElementById("reason").innerHTML =
    "<b>Reason:</b> " + reasons.join(", ");
}

fetch("http://127.0.0.1:5000/api/predict", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    route,
    time: timeValue,
    time_slot: timeData.slot,
    day,
    weather,
    holiday,
    event
  })
})
.then(res => res.json())
.then(data => {
  document.getElementById("result").innerText = data.crowd_level;
  document.getElementById("reason").innerHTML =
    "<b>Reason:</b> " + data.reasons.join(", ");
});
