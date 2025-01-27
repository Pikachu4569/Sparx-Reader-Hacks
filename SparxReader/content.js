(function () {
    const BUTTON_CONTAINER_ID = 'custom-buttons-container';
    let analyzedText = ''; // Store the full analyzed text for future questions

    // Function to create a button
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

    // Function to inject the buttons into the page
    function injectButtons() {
        let container = document.getElementById(BUTTON_CONTAINER_ID);

        // If the container doesn't exist, create it
        if (!container) {
            container = document.createElement('div');
            container.id = BUTTON_CONTAINER_ID;
            container.style.position = 'fixed';
            container.style.top = '10px'; // Positioned at the top
            container.style.right = '10px';
            container.style.zIndex = '9999';
            container.style.backgroundColor = 'white';
            container.style.border = '1px solid black';
            container.style.padding = '10px';
            container.style.borderRadius = '5px';
            container.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
            document.body.appendChild(container);
        }

        // Clear the container to avoid duplicate buttons
        container.innerHTML = '';

        // Add the existing buttons
        container.appendChild(createButton('analyze-text', 'Analyze Text', analyzeText));
        container.appendChild(createButton('analyze-question', 'Analyze Question', analyzeQuestion));
        
        // Add the new "AI Prompt" button
        container.appendChild(createButton('ai-prompt', 'AI Prompt', copyAIPrompt));

        console.log('Buttons injected successfully!');
    }

    // Function to get the specific text between "Start reading here" and "Stop reading here"
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

    // Function to analyze the text
    function analyzeText() {
        const content = getTextFromPage();

        if (!content) {
            console.log('Text content not found.');
            return;
        }

        analyzedText = content; // Store the specific analyzed text
        console.log('Newly Analyzed Text:', analyzedText);

        // Automatically copy the analyzed text to clipboard
        copyToClipboard(analyzedText);
    }

    // Function to analyze the question and options and copy them automatically
    function analyzeQuestion() {
        if (!analyzedText) {
            console.log('No text has been analyzed yet.');
            return;
        }

        // Attempt to find the question element
        const questionElement = document.querySelector('div[class*="PanelQuestionContent"]');
        const questionText = questionElement ? questionElement.innerText.trim() : '';

        if (!questionText) {
            console.log('No question content found.');
            return;
        }

        // Attempt to find the button elements for options
        const options = [];
        const buttonElements = document.querySelectorAll('button[class*="Button"]');
        if (buttonElements.length > 0) {
            buttonElements.forEach(button => {
                const optionDiv = button.querySelector('div'); // Assuming the text is inside a <div>
                const optionText = optionDiv ? optionDiv.innerText.trim() : '';
                if (optionText) {
                    options.push(optionText);
                }
            });
        }

        if (!options.length) {
            console.log('No options found.');
            return;
        }

        // Add "not in story" as an additional answer option
        options.push('not in story');

        // Combine question and options into a single string
        const questionAndOptionsText = `Question: ${questionText}\nOptions:\n${options.join('\n')}`;
        console.log('Question and Options:', questionAndOptionsText);

        // Automatically copy the question and options to clipboard
        copyToClipboard(questionAndOptionsText);
    }

    // Function to copy the AI prompt text to the clipboard
    function copyAIPrompt() {
        const aiPromptText = "Analyze the text I will provide from a story and thoroughly comprehend its content, context, and details. After analyzing the text, I will send you multiple-choice questions based on it. For each question, identify what the question is asking and respond only with the correct answer, nothing else. If the answer is not clear or not explicitly stated in the story, respond with 'not in story.'";
        copyToClipboard(aiPromptText);
        console.log('AI Prompt copied to clipboard!');
    }

    // Updated function to copy text to the clipboard with permission handling
    function copyToClipboard(text) {
        // Use the Clipboard API for reliable copying
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => console.log('Copied to clipboard!'))
                .catch(err => console.error('Failed to copy: ', err));
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            console.log('Copied to clipboard!');
        }
    }

    // Initialize and inject the buttons when the script runs
    injectButtons();
})();
