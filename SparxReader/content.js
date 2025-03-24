(function () {
    const BUTTON_CONTAINER_ID = 'custom-buttons-container';
    let analyzedText = '';
    let readingTime = 0;
    let countdownInterval;

    // Words to ban from being copied or analyzed
    const bannedWords = [
        '1', '2 MONTHS AGO', 'You\'ve been awarded a Gold Reader star',
        'Reach 5 to earn a Gold Reader pass', 'Find out more', 'Menu', 'Settings', 'Feedback', 'Cookie Settings', 
        'Sign out', 'Analyze Text', 'Analyze Question', 'AI Prompt', 'Go to ChatGPT', 'Go to Microsoft Copilot',
        'Daniel Wai', 'John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis', 'Chris Brown'
    ];

    // Function to create buttons
    function createButton(id, text, onClick, width = 'auto', initialColor = '#4CAF50') {
        const button = document.createElement('button');
        button.id = id;
        button.innerText = text;
        button.style.margin = '3px';
        button.style.padding = '4px 10px'; // Smaller padding for compact look
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = initialColor; // Default green
        button.style.width = width;
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.height = '35px'; // Shorter height

        // Dynamic font sizing so text fits within the button
        const fontSize = Math.max(12, Math.min(18, 130 / text.length));
        button.style.fontSize = `${fontSize}px`;

        button.onclick = onClick;
        return button;
    }

    // Function to create the timer display
    function createTimerDisplay() {
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'timer-display';
        timerDisplay.innerText = 'Timer: Not started';
        timerDisplay.style.margin = '3px';
        timerDisplay.style.padding = '4px 10px'; // Matching button padding
        timerDisplay.style.backgroundColor = '#f4a261';
        timerDisplay.style.color = 'white';
        timerDisplay.style.border = 'none';
        timerDisplay.style.borderRadius = '8px';
        timerDisplay.style.textAlign = 'center';
        timerDisplay.style.fontWeight = 'bold';
        timerDisplay.style.height = '35px'; // Same height as buttons
        timerDisplay.style.fontSize = '16px';
        return timerDisplay;
    }

    // Inject buttons into the container
    function injectButtons() {
        let container = document.getElementById(BUTTON_CONTAINER_ID);
        if (!container) {
            container = document.createElement('div');
            container.id = BUTTON_CONTAINER_ID;
            container.style.position = 'fixed';
            container.style.top = '50%';
            container.style.right = '0';
            container.style.transform = 'translateY(-50%)';
            container.style.zIndex = '9999';
            container.style.backgroundColor = 'white';
            container.style.padding = '8px';
            container.style.borderRadius = '15px';
            container.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.2)';
            container.style.width = '320px';
            container.style.textAlign = 'center';
            document.body.appendChild(container);
        }

        container.innerHTML = '';

        // Top row of buttons (Analyze Text, Analyze Question, AI Prompt)
        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.justifyContent = 'space-between';

        // Only the "Analyze Text" button will start as red
        const analyzeTextButton = createButton('analyze-text', 'Analyze Text', analyzeText, '32%', '#f44336'); // Red initially
        buttonRow.appendChild(analyzeTextButton);

        const analyzeQuestionButton = createButton('analyze-question', 'Analyze Question', analyzeQuestion, '32%');
        analyzeQuestionButton.disabled = true; // Disable until text is analyzed
        buttonRow.appendChild(analyzeQuestionButton);

        buttonRow.appendChild(createButton('ai-prompt', 'AI Prompt', copyAIPrompt, '32%'));
        container.appendChild(buttonRow);

        // Timer display underneath the buttons
        const timerDisplay = createTimerDisplay();
        container.appendChild(timerDisplay);

        // Bottom row of "Go to" buttons
        const goToRow = document.createElement('div');
        goToRow.style.display = 'flex';
        goToRow.style.justifyContent = 'space-between';
        goToRow.style.marginTop = '5px';

        goToRow.appendChild(createButton('chatgpt-website', 'Go to ChatGPT', goToChatGPT, '48%'));
        goToRow.appendChild(createButton('copilot-website', 'Go to Microsoft Copilot', goToMicrosoftCopilot, '48%'));
        container.appendChild(goToRow);

        console.log('Buttons injected successfully!');
    }

    // Get the text from the page
    function getTextFromPage() {
        const bodyText = document.body.innerText;
        const startReading = 'Start reading here';
        const stopReading = 'Stop reading here';

        const startIndex = bodyText.indexOf(startReading) + startReading.length;
        const stopIndex = bodyText.indexOf(stopReading);

        if (startIndex !== -1 && stopIndex !== -1 && stopIndex > startIndex) {
            return bodyText.substring(startIndex, stopIndex).trim();
        }

        return '';
    }

    // Count the number of words in the text
    function countWords(text) {
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }

    // Analyze the text on the page
    function analyzeText() {
        const content = getTextFromPage();
        if (!content) {
            console.log('Text content not found.');
            return;
        }

        analyzedText = content;
        const wordCount = countWords(analyzedText);
        readingTime = wordCount / 500;

        console.log(`Analyzed Text (${wordCount} words)`);
        console.log(`Estimated Reading Time: ${readingTime.toFixed(2)} minutes`);

        // Change the "Analyze Text" button color to green after clicking
        document.getElementById('analyze-text').style.backgroundColor = '#4CAF50'; // Green

        // Enable the "Analyze Question" button now that text has been analyzed
        document.getElementById('analyze-question').disabled = false;

        copyToClipboard(analyzedText);
        startCountdown(Math.floor(readingTime * 60));
    }

    // Start the countdown for the reading time
    function startCountdown(seconds) {
        const timerDisplay = document.getElementById('timer-display');
        let timeLeft = seconds;

        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        timerDisplay.style.backgroundColor = '#f4a261';

        function updateTimer() {
            const minutesLeft = Math.floor(timeLeft / 60);
            const secondsLeft = timeLeft % 60;
            timerDisplay.innerText = `Reading Time Left: ${minutesLeft}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                timerDisplay.innerText = 'Reading Time Over!';
                timerDisplay.style.backgroundColor = '#4CAF50';
            } else {
                timeLeft--;
            }
        }

        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);
    }

    // Analyze and copy question and options from any div element
    function analyzeQuestion() {
        // Change the "Analyze Text" button color back to red when analyzing question
        document.getElementById('analyze-text').style.backgroundColor = '#f44336'; // Red

        const divElements = document.querySelectorAll('div');
        let questionText = '';
        let options = [];

        divElements.forEach(div => {
            const divText = div.innerText.trim();

            // If it's the question, keep the structure like "<div class='sr_33a0cc62'>Question</div>"
            if (div.classList.contains('sr_33a0cc62')) {
                questionText = divText; // This is the question
            }

            // Check for options (assuming options may also be within divs)
            else if (divText.toLowerCase().includes('option') || divText.length > 0) {
                options.push(divText);
            }
        });

        // Remove banned words from options, but not from the question itself
        options = options.filter(option =>
            !bannedWords.some(bannedWord => option.toLowerCase().includes(bannedWord.toLowerCase()))
        );

        // Remove duplicate options
        options = [...new Set(options)];

        if (!questionText || options.length === 0) {
            console.log('No valid question or options found.');
            return;
        }

        const questionAndOptionsText = `Question: ${questionText}\nOptions:\n${options.join('\n')}`;
        console.log('Question and Options:', questionAndOptionsText);

        copyToClipboard(questionAndOptionsText);
    }

    // Copy AI prompt to clipboard
    function copyAIPrompt() {
        const aiPromptText = 
            'Analyze the text I provide and comprehend its context and details.\n' +
            'After analysis, I will send you multiple-choice questions.\n' +
            'Identify the correct answer and respond only with it.\n' +
            'If the answer is unclear or not in the text, reply with "not in story."\n' +
            'Ignore any repeated options and names outside of the question and options.\n';
        
        copyToClipboard(aiPromptText);
    }

    // Copy text to clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // Go to ChatGPT
    function goToChatGPT() {
        window.open('https://chat.openai.com', '_blank');
    }

    // Go to Microsoft Copilot
    function goToMicrosoftCopilot() {
        window.open('https://copilot.microsoft.com', '_blank');
    }

    // Inject the buttons into the page
    injectButtons();
})();
