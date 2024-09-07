let image1 = document.getElementById('image1');
let image2 = document.getElementById('image2');
let textFrames = document.querySelectorAll('.text');
let staticContent = document.getElementById('staticContent');
let isAnimating = false; // avoids overlapping animations


// code with the help of: https://stackoverflow.com/questions/15944245/how-to-open-pdf-on-a-new-tab
// Function to open a PDF or asset file in a new tab
function openInNewTab(fileName) {
    const filePath = `./assets/${fileName}`; // Dynamic path to file in /assets/ folder
    const newWindow = window.open(filePath, '_blank'); // Open the file in a new tab
    if (newWindow) {
        newWindow.focus(); // Focus on the new window if it opens
    } else {
        alert('Please allow popups for this website'); // Alert if popups are blocked
    }
}

// Function to animate the first frame for banner ad which slides in left to right
function animateFrame1() {
    if (isAnimating) return;
    isAnimating = true;

    resetAnimation();

    // slide in Image 1
    image1.classList.add('slideIn');
    textFrames[0].style.opacity = 1;
    textFrames[0].style.visibility = 'visible';

    // Static content for frame 1 (scene 1)
    setTimeout(() => {
        staticContent.classList.add('show-static-content');
    }, 1000);


    // coded with help of: https://stackoverflow.com/questions/77498799/classlist-add-does-not-work-inside-settimeout-function
    // will transition to next frame after 4s
    setTimeout(() => {
        image1.classList.remove('slideIn');
        image1.classList.add('slideOut');
        textFrames[0].style.opacity = 0;
        textFrames[0].style.visibility = 'hidden';
        animateFrame2();
    }, 4000);
}


// Function to animate the second frame for banner ad which zooms in
function animateFrame2() {
    // Zoom in Image 2 and show Text 2
    image2.classList.add('zoomIn');
    textFrames[1].style.opacity = 1;
    textFrames[1].style.visibility = 'visible';


    // coded with help of: https://stackoverflow.com/questions/77498799/classlist-add-does-not-work-inside-settimeout-function
    // will transition to third frame after 4s
    setTimeout(() => {
        textFrames[1].style.opacity = 0;
        textFrames[1].style.visibility = 'hidden';
        image2.classList.remove('zoomIn');
        animateFrame3();
    }, 4000);
}

// Function to animate the third frame - zooms out
function animateFrame3() {
    // zoom out Image 2 and show Text 3
    image2.classList.add('zoomOut');
    textFrames[2].style.opacity = 1;
    textFrames[2].style.visibility = 'visible';

    // Reset the animation after 5 seconds and loop back to frame 1
    setTimeout(() => {
        textFrames[2].style.opacity = 0;
        textFrames[2].style.visibility = 'hidden';
        resetAnimation();  // Reset and start again from frame 1
        setTimeout(() => {
            isAnimating = false; // Reset animation flag
            animateFrame1();  // Loop back to frame 1
        }, 1000);
    }, 5000);
}

// Function to reset the animation and prepare for looping
function resetAnimation() {
    image1.classList.remove('slideIn', 'slideOut');
    image2.classList.remove('zoomIn', 'zoomOut');
    image1.style.opacity = 0;
    image2.style.opacity = 0;
    staticContent.classList.remove('show-static-content');
}

// Start the banner animation loop
function startBanner() {
    animateFrame1();
}

document.addEventListener("DOMContentLoaded", function() {
    startBanner();  // Start the banner animation when the document is loaded
    startSidebarAd();  // Start the sidebar ad rotation when the document is loaded
    document.getElementById("replay-button").addEventListener("click", replayAd);  // Replay the sidebar ad animation
});

// Sidebar Ad Handling
function showAdFrame(frame) {
    const frames = document.getElementsByClassName('ad-frame');
    for (let i = 0; i < frames.length; i++) {
        frames[i].classList.remove('visible');
    }
    frames[frame].classList.add('visible');
}

// Function to loop through the sidebar ad frames
function startSidebarAd() {
    let currentSidebarFrame = 0;  // Track the sidebar frame separately
    const totalSidebarFrames = document.getElementsByClassName('ad-frame').length;

    function nextSidebarFrame() {
        showAdFrame(currentSidebarFrame);
        currentSidebarFrame = (currentSidebarFrame + 1) % totalSidebarFrames;
    }

    // Show the first sidebar frame initially
    nextSidebarFrame();

    // Start cycling through the sidebar frames
    sidebarIntervalId = setInterval(nextSidebarFrame, 3000); // 3 second transition for frame
}

// Function to replay ad sidebar
function replayAd() {
    clearInterval(sidebarIntervalId);  // Stop the current sidebar interval
    startSidebarAd();  // Restart sidebar ad
}

// Booking form handling
let currentStep = 0;

function showStep(step) {
    const steps = document.getElementsByClassName("form-step");
    const progress = document.getElementById("progress");
    const stepText = document.getElementById("step-text");

    for (let i = 0; i < steps.length; i++) {
        steps[i].style.display = "none"; // Hide all steps
    }
    steps[step].style.display = "block"; // will show current step

    // used to update progress bar and the steps
    if (step < steps.length - 1) {  // Exclude summary from step count
        progress.style.width = `${((step) / (steps.length - 2)) * 100}%`;
        stepText.textContent = `Step ${step + 1} of 4`;
        progress.classList.remove('hidden');
        stepText.classList.remove('hidden');
    }


    // code with help of: https://stackoverflow.com/questions/71591379/how-can-i-change-button-type-from-button-to-submit-button-at-the-last-step-in-m
    // for the button visibility
    document.getElementById("prevBtn").style.display = step === 0 ? "none" : "inline";
    document.getElementById("nextBtn").style.display = step === steps.length - 2 ? "none" : "inline";
    document.getElementById("submitBtn").style.display = step === steps.length - 2 ? "inline" : "none";
    document.getElementById("newBookingBtn").style.display = step === steps.length - 1 ? "inline" : "none";

    // ensures button "next" is not shown on summary page
    if (step === steps.length - 1) {
        document.getElementById("nextBtn").style.display = "none";
        document.getElementById("submitBtn").style.display = "none";
        document.getElementById("confirmation-message").style.display = "block";  // Show confirmation message

        // Set the progress bar to 100% for the summary step
        progress.style.width = "100%"; // Make progress bar full for summary step
    } else {
        // Make sure the progress bar and step text are visible on non-summary steps
        progress.classList.remove('hidden');
        stepText.classList.remove('hidden');
    }
}

function nextPrev(n) {
    const steps = document.getElementsByClassName("form-step");

    currentStep += n;
    if (currentStep >= steps.length) {
        currentStep = steps.length - 1;
    }
    showStep(currentStep);
}

// Function for booking summary, showing all user input details
function submitBooking() {
    document.getElementById("summary-date").textContent = document.getElementById("date").value;
    document.getElementById("summary-adults").textContent = document.getElementById("adults").value;
    document.getElementById("summary-children").textContent = document.getElementById("children").value;
    document.getElementById("summary-last-name").textContent = document.getElementById("last-name").value;
    document.getElementById("summary-first-name").textContent = document.getElementById("first-name").value;
    document.getElementById("summary-email").textContent = document.getElementById("email").value;
    document.getElementById("summary-ticket-color").textContent = document.getElementById("ticket-color").value;

    // checks if storage option is selected and then only displays if true
    const storageValue = document.querySelector('input[name="storage"]:checked')?.value || "";
    document.getElementById("summary-storage").textContent = storageValue; // will be left blank if no option is selected

    currentStep++;
    showStep(currentStep);
}

function newBooking() {
    location.reload();
}

document.addEventListener("DOMContentLoaded", function() {
    showStep(currentStep);
    document.getElementById("prevBtn").style.display = "none";
});
