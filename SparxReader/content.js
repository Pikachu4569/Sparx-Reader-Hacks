(function () {
    const BUTTON_CONTAINER_ID = 'custom-buttons-container';
    let analyzedText = ''; 
    let readingTime = 0; 
    let countdownInterval; 

    function createButton(id, text, onClick) {
        const button = document.createElement('button');
        button.id = id;
        button.innerText = text;
        button.style.margin = '5px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.onclick = onClick;
        return button;
    }

    function createTimerDisplay() {
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'timer-display';
        timerDisplay.innerText = 'Timer: Not started';
        timerDisplay.style.margin = '5px';
        timerDisplay.style.padding = '10px 20px';
        timerDisplay.style.backgroundColor = '#f4a261';
        timerDisplay.style.color = 'white';
        timerDisplay.style.border = 'none';
        timerDisplay.style.borderRadius = '5px';
        timerDisplay.style.textAlign = 'center';
        timerDisplay.style.fontWeight = 'bold';
        return timerDisplay;
    }

    function injectButtons() {
        let container = document.getElementById(BUTTON_CONTAINER_ID);
        if (!container) {
            container = document.createElement('div');
            container.id = BUTTON_CONTAINER_ID;
            container.style.position = 'fixed';
            container.style.top = '10px';
            container.style.right = '10px';
            container.style.zIndex = '9999';
            container.style.backgroundColor = 'white';
            container.style.border = '1px solid black';
            container.style.padding = '10px';
            container.style.borderRadius = '5px';
            container.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
            document.body.appendChild(container);
        }

        container.innerHTML = '';

        container.appendChild(createButton('analyze-text', 'Analyze Text', analyzeText));
        container.appendChild(createButton('analyze-question', 'Analyze Question', analyzeQuestion));
        container.appendChild(createButton('ai-prompt', 'AI Prompt', copyAIPrompt));

        const timerDisplay = createTimerDisplay();
        container.appendChild(timerDisplay);

        console.log('Buttons injected successfully!');
    }

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

    function countWords(text) {
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }

    function analyzeText() {
        const content = getTextFromPage();
        if (!content) {
            console.log('Text content not found.');
            return;
        }

        analyzedText = content;
        const wordCount = countWords(analyzedText);
        readingTime = Math.ceil(wordCount / 500); // Updated formula

        console.log(`Analyzed Text (${wordCount} words)`);
        console.log(`Estimated Reading Time: ${readingTime} minutes`);

        copyToClipboard(analyzedText);
        startCountdown(readingTime * 60);
    }

    function startCountdown(seconds) {
        const timerDisplay = document.getElementById('timer-display');
        let timeLeft = seconds;

        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        function updateTimer() {
            const minutesLeft = Math.floor(timeLeft / 60);
            const secondsLeft = timeLeft % 60;
            timerDisplay.innerText = `Reading Time Left: ${minutesLeft}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                timerDisplay.innerText = 'Reading Time Over!';
                timerDisplay.style.backgroundColor = '#2a9d8f'; 
            } else {
                timeLeft--;
            }
        }

        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);
    }

    function analyzeQuestion() {
        if (!analyzedText) {
            console.log('No text has been analyzed yet.');
            return;
        }

        const questionElement = document.querySelector('div[class*="PanelQuestionContent"]');
        const questionText = questionElement ? questionElement.innerText.trim() : '';

        if (!questionText) {
            console.log('No question content found.');
            return;
        }

        const options = [];
        const buttonElements = document.querySelectorAll('button[class*="Button"]');
        const bannedWords = [
            'cookies', 'settings', 'sign out', 'cookie settings', 
            'Cookie Settings', 'Settings', 'Sign out', 'not in story'
        ];

        buttonElements.forEach(button => {
            const optionText = button.textContent.trim();

            // Exclude specific words and phrases
            if (!bannedWords.includes(optionText.toLowerCase())) {
                options.push(optionText);
            }
        });

        // Always include "Not in Story" as an option
        options.push('Not in Story');

        const questionAndOptionsText = `Question: ${questionText}\nOptions:\n${options.join('\n')}`;
        console.log('Question and Options:', questionAndOptionsText);

        copyToClipboard(questionAndOptionsText);
    }

    function copyAIPrompt() {
        const aiPromptText = "Analyze the text I provide and comprehend its context and details. After analysis, I will send you multiple-choice questions. Identify the correct answer and respond only with it. If the answer is unclear or not in the text, reply with 'not in story.'";
        copyToClipboard(aiPromptText);
    }

    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => console.log('Copied to clipboard!'))
                .catch(err => console.error('Failed to copy: ', err));
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            console.log('Copied to clipboard!');
        }
    }

    injectButtons();
})();
