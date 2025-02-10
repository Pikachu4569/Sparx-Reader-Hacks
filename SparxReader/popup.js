// Function to analyze text and store the question and options in chrome storage
function analyzeTextAndStoreData() {
    // Extracting the question (modify based on actual structure of the page)
    var question = document.querySelector('.question-selector') ? document.querySelector('.question-selector').innerText : '';
    console.log("Extracted Question: ", question);

    // Extracting options (modify based on actual structure)
    var options = [];
    var optionElements = document.querySelectorAll('.option-selector'); // Modify based on actual selectors
    optionElements.forEach(function(optionElement) {
        options.push(optionElement.innerText);
    });
    console.log("Extracted Options: ", options);

    // Save the extracted question and options to chrome storage
    chrome.storage.local.set({
        analyzedQuestion: question,
        analyzedOptions: options
    }, function() {
        console.log("Data saved to chrome storage.");
    });
}

// Function to analyze the question and options, then find the answer
function analyzeQuestionAndFindAnswer() {
    // Retrieve the analyzed data from chrome storage
    chrome.storage.local.get(['analyzedQuestion', 'analyzedOptions'], function(result) {
        console.log("Data retrieved from local storage:");
        console.log(result);

        var question = result.analyzedQuestion;
        var options = result.analyzedOptions;

        if (question && options.length > 0) {
            // Example logic to find the answer (you can improve this logic)
            var answer = options.find(option => question.includes(option));
            console.log("Found answer: ", answer);

            // Display the answer in the popup
            document.getElementById("output").innerText = "Answer: " + answer;
        } else {
            console.log("No analyzed data found. Please analyze the text and question first.");
            document.getElementById("output").innerText = "Please analyze the text and question first.";
        }
    });
}

// Add event listeners to the buttons
document.getElementById('analyzeQuestionAndAnswerButton').addEventListener('click', analyzeQuestionAndFindAnswer);

// Permanent button that triggers the analysis of both text & question
document.getElementById('analyzeButton').addEventListener('click', analyzeTextAndStoreData);
