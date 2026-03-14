// =======================================================
// SERVICE WORKER SETUP (Offline Mode)
// =======================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// =======================================================
// VERTEX VOICE (Web Speech API Dictation)
// =======================================================
let recognition;
let isRecording = false;

// Check if the browser supports Speech Recognition (Safari/Chrome)
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening until the user hits stop
    recognition.interimResults = true; // Show words as they are spoken

    recognition.onresult = (event) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }
        
        // Append the final confirmed text to the text area
        if (finalTranscript) {
            const noteArea = document.getElementById('noteOutput');
            noteArea.value += finalTranscript + ' ';
            // Auto-scroll to the bottom as they talk
            noteArea.scrollTop = noteArea.scrollHeight; 
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        stopDictation();
    };
} else {
    alert("Your browser doesn't support Voice Dictation. Please use Safari or Chrome.");
}

function toggleDictation() {
    if (!recognition) return;
    
    if (isRecording) {
        stopDictation();
    } else {
        startDictation();
    }
}

function startDictation() {
    try {
        recognition.start();
        isRecording = true;
        const micBtn = document.getElementById('micBtn');
        micBtn.classList.add('recording');
        micBtn.innerHTML = '🛑 Stop Dictation';
    } catch(e) {
        console.log("Recognition already started.");
    }
}

function stopDictation() {
    recognition.stop();
    isRecording = false;
    const micBtn = document.getElementById('micBtn');
    micBtn.classList.remove('recording');
    micBtn.innerHTML = '🎤 Start Dictation';
}

function processWithGemini() {
    const text = document.getElementById('noteOutput').value;
    if(!text.trim()) {
        alert("Please dictate or type some notes first!");
        return;
    }
    
    // For right now, just show the user what we captured!
    alert("Ready to send this raw block to Gemini:\n\n" + text);
    
    // NEXT UP: Wiring this to Google Firebase & Gemini 1.5 Flash
}