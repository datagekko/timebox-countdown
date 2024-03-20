const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const firstIntervallBtn = document.getElementById('time-selector-30');
const secondIntervallBtn = document.getElementById('time-selector-60');
const thirdIntervallBtn = document.getElementById('time-selector-90');
const selectedTime = document.getElementById('timer');

const countdownEl = document.getElementById('countdown');
const countDownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownTime = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;

// // Populate Countdown / Complete UI
function updateDOM(countdownTime, endTime = new Date(savedCountdown.endTime)) {

    countdownActive = setInterval(() => {
        const now = new Date();
        const duration = (endTime - now) / 1000;

        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);

        // Hide Input
        inputContainer.hidden = true;
        countdownEl. hidden = false;

        // If the countdown had ended, show complete
        if (duration < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `You have completed ${countdownTitle}.`;
            completeEl.hidden = false;

            // Send a notification if permission was granted
            if (Notification.permission === "granted") {
                new Notification("Countdown Finished", {
                    body: `Your countdown for ${countdownTitle} is complete!`,
                });
            } else {
                console.log("Notification permission not granted.");
            }
        } else {
            // Else, show the countdown in Progress.
            countDownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${minutes}`;
            timeElements[1].textContent = `${seconds < 10 ? '0' : ''}${seconds}`;
            completeEl.hidden = true;
            countdownEl. hidden = false;
        }
    }, second);
}

// Take Value from Buttons
function updateTimer(event) {
    event.preventDefault();
    let countdownTime;
    if (event.target.id === 'time-selector-30') {
        countdownTime = '00:10';
    } else if (event.target.id === 'time-selector-60') {
        countdownTime = '60:00';
    } else if (event.target.id === 'time-selector-90') {
        countdownTime = '90:00';
    }
    selectedTime.textContent = countdownTime;
}

// Take Value from Form Input
function updateCountdown(event, countdownTime) {
    askNotificationPermission()
    event.preventDefault();
    if (countdownTitle==='') {
        countdownTitle = event.srcElement[0].value;
    } else {
        countdownTitle = event.target.elements["title"].value;
    }
    countdownTime = selectedTime.textContent;

    const currentTime = new Date();
    const endTime = new Date(currentTime.getTime() + parseCountdownTime(countdownTime) * 1000);

    savedCountdown = {
        title: countdownTitle,
        endTime: endTime.getTime(),
    };

    localStorage.setItem('countdown', JSON.stringify(savedCountdown));

    // Check for valid date
    if (countdownTime === '') {
        alert('Please select a time for the countdown.');
    } else {
        updateDOM(countdownTime, endTime);
    }
}

function parseCountdownTime(countdownTime) {
    // Assuming countdownTime is in the format "MM:SS"
    const parts = countdownTime.split(':');
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return minutes * 60 + seconds; // Convert to total seconds
}

// Request Notification Permission
function askNotificationPermission() {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support system notifications.");
    } else if (Notification.permission === "default") {
        // Ask the user for permission
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
                // You can optionally show a demo notification here
                // new Notification("Thank you for enabling notifications!");
            } else if (permission === "denied") {
                console.log("Notification permission denied.");
            }
        });
    } else if (Notification.permission === "granted") {
        console.log("Notification permission was already granted.");
    } else {
        console.log("Notification permission denied.");
    }
}

// Reset All Values
function reset() {
    // Hide Countdowns, show Input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // Stop the countdown
    clearInterval(countdownActive);
    // Reset values
    countdownTitle = '';
    countdownTime = '';
    localStorage.removeItem('countdown');
}

// Restore Previous Countdown
function restorePreviousCountdown() {
    // Get countdown from localStorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownTime = savedCountdown.time;
        updateDOM(countdownTime);
    }
}

// Event Listener
firstIntervallBtn.addEventListener('click', updateTimer);
secondIntervallBtn.addEventListener('click', updateTimer);
thirdIntervallBtn.addEventListener('click', updateTimer);
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On Load, check localStorage
restorePreviousCountdown();