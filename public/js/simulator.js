document.getElementById('simulation-form').addEventListener('submit', function(e) {
  e.preventDefault();
  runSimulation();
});

function runSimulation() {
  const numEvents = parseInt(document.getElementById('num-events').value);
  const energyChangesInput = document.getElementById('energy-changes').value;
  const kValue = parseInt(document.getElementById('k-value').value);
  const threshold = parseInt(document.getElementById('threshold').value);

  const energyChanges = energyChangesInput.split(',').map(str => parseInt(str.trim()));

  if (energyChanges.length !== numEvents) {
    alert(`Error: You specified ${numEvents} events but provided ${energyChanges.length} energy changes. Please match the counts.`);
    return;
  }

  if (energyChanges.some(isNaN)) {
    alert('Error: All energy changes must be valid integers.');
    return;
  }

  const result = simulateEnergyExplosions(energyChanges, threshold, kValue);

  displayResults(result, threshold);
}

function simulateEnergyExplosions(energyChanges, threshold, k) {
  let energy = 0;
  const explosionList = [];
  const eventLog = [];

  for (let i = 0; i < energyChanges.length; i++) {
    const change = energyChanges[i];
    const previousEnergy = energy;
    energy += change;

    const eventData = {
      index: i + 1,
      change: change,
      previousEnergy: previousEnergy,
      newEnergy: energy,
      isExplosion: false
    };

    if (energy >= threshold) {
      explosionList.push(i + 1);
      eventData.isExplosion = true;
      eventData.energyAfterExplosion = 0;
      energy = 0;
    }

    eventLog.push(eventData);
  }

  let kAnswer = 'NEVER';
  if (k <= explosionList.length) {
    kAnswer = explosionList[k - 1];
  }

  return {
    explosions: explosionList,
    totalExplosions: explosionList.length,
    finalEnergy: energy,
    kAnswer: kAnswer,
    eventLog: eventLog,
    threshold: threshold
  };
}

function displayResults(result, threshold) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.style.display = 'block';

  const energyPercentage = (result.finalEnergy / threshold) * 100;
  document.getElementById('energy-level').textContent = `${result.finalEnergy}%`;
  document.getElementById('energy-fill').style.width = `${Math.min(energyPercentage, 100)}%`;
  document.getElementById('energy-fill').textContent = `${result.finalEnergy}%`;

  document.getElementById('total-explosions').textContent = result.totalExplosions;
  document.getElementById('final-energy').textContent = `${result.finalEnergy}%`;
  document.getElementById('k-answer').textContent = result.kAnswer;

  const explosionsContainer = document.getElementById('explosions-container');
  if (result.explosions.length === 0) {
    explosionsContainer.innerHTML = '<p style="color: #888;">No explosions occurred during the simulation.</p>';
  } else {
    explosionsContainer.innerHTML = result.explosions
      .map(eventNum => `<div class="explosion-item">💥 Explosion at Event ${eventNum}</div>`)
      .join('');
  }

  const timelineContainer = document.getElementById('timeline-container');
  timelineContainer.innerHTML = result.eventLog
    .map(event => {
      const explosionText = event.isExplosion
        ? ` → <strong>EXPLOSION!</strong> Reset to ${event.energyAfterExplosion}%`
        : '';
      const className = event.isExplosion ? 'event-item explosion' : 'event-item';

      return `
        <div class="${className}">
          <strong>Event ${event.index}:</strong>
          Change: ${event.change > 0 ? '+' : ''}${event.change} |
          Energy: ${event.previousEnergy}% → ${event.newEnergy}%${explosionText}
        </div>
      `;
    })
    .join('');

  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
