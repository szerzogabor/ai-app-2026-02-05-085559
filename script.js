let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let lapTimes = [];
let isRunning = false;

// DOM elements
const displayMinutes = document.getElementById('minutes');
const displaySeconds = document.getElementById('seconds');
const displayMilliseconds = document.getElementById('milliseconds');
const lapTimesList = document.getElementById('lapTimesList');

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const lapButton = document.getElementById('lapButton');
const resetButton = document.getElementById('resetButton');

/**
 * Formats a given time in milliseconds into a readable MM:SS.msms format.
 * @param {number} ms - The time in milliseconds.
 * @returns {{minutes: string, seconds: string, milliseconds: string}}
 */
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10); // Display 2 digits for milliseconds

    return {
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        milliseconds: String(milliseconds).padStart(2, '0')
    };
}

/**
 * Updates the stopwatch display with the current elapsed time.
 */
function updateDisplay() {
    const time = formatTime(elapsedTime);
    displayMinutes.textContent = time.minutes;
    displaySeconds.textContent = time.seconds;
    displayMilliseconds.textContent = time.milliseconds;
}

/**
 * Updates the disabled state of control buttons based on the stopwatch's current state.
 */
function updateButtonStates() {
    startButton.disabled = isRunning;
    stopButton.disabled = !isRunning || elapsedTime === 0; // Stop only enabled if running and time has elapsed
    lapButton.disabled = !isRunning;
    // Reset button is enabled if not running AND either time has elapsed OR there are lap times
    resetButton.disabled = isRunning || (elapsedTime === 0 && lapTimes.length === 0);
}

/**
 * Starts the stopwatch timer.
 */
function startTimer() {
    if (isRunning) return; // Prevent multiple start calls
    isRunning = true;
    // Set startTime to ensure accurate elapsed time even if paused and restarted
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
    }, 10); // Update every 10ms for smooth millisecond display
    updateButtonStates();
}

/**
 * Stops the stopwatch timer.
 */
function stopTimer() {
    if (!isRunning) return; // Prevent multiple stop calls or stopping when not running
    isRunning = false;
    clearInterval(timerInterval);
    updateButtonStates();
}

/**
 * Records the current elapsed time as a lap and adds it to the lap times list.
 */
function recordLap() {
    if (!isRunning) return;
    const lapTime = elapsedTime;
    lapTimes.push(lapTime);

    const time = formatTime(lapTime);
    const lapItem = document.createElement('li');
    lapItem.innerHTML = `<span>Lap ${lapTimes.length}:</span> <span>${time.minutes}:${time.seconds}.${time.milliseconds}</span>`;
    lapTimesList.prepend(lapItem); // Add new laps to the top for chronological order
}

/**
 * Resets the stopwatch to its initial state, clearing time and laps.
 */
function resetTimer() {
    // If the timer is running, stop it first before resetting
    if (isRunning) {
        stopTimer();
    }
    
    elapsedTime = 0;
    lapTimes = [];
    lapTimesList.innerHTML = ''; // Clear lap times display
    updateDisplay();
    updateButtonStates();
}

// Event Listeners for control buttons
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
lapButton.addEventListener('click', recordLap);
resetButton.addEventListener('click', resetTimer);

// Initial setup when the script loads
updateDisplay();
updateButtonStates();