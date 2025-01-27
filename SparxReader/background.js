chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Capture visible text from a specific part of the page (quiz-related content)
  if (request.action === "getText") {
    let quizContainer = document.querySelector('.quiz-container, .quiz-content, .quiz'); // Adjust based on the actual container
    if (quizContainer) {
      let pageText = quizContainer.innerText;  // Get the text from the quiz-related content
      console.log("Captured Page Text:", pageText);  // Log the captured text
      sendResponse({ text: pageText });
    } else {
      console.log("No quiz container found.");
      sendResponse({ text: "No quiz content found." });
    }
  }

  // Extract question and options (assuming question starts with "Q1." or similar)
  if (request.action === "getQuestionAndOptions") {
    let quizContainer = document.querySelector('.quiz-container, .quiz-content, .quiz');  // Adjust selector
    if (!quizContainer) {
      sendResponse({ question: "No quiz content found.", options: ["No options found."] });
      return;
    }

    let pageText = quizContainer.innerText;
    let question = "";
    let options = [];

    // Regex to match the question pattern like "Q1.", "Q2.", etc., followed by a question
    const questionMatch = pageText.match(/(Q\d+\..+?\?)/);  // Match something like "Q1. What is the capital of France?"

    if (questionMatch) {
      question = questionMatch[0].trim();
    } else {
      question = "No question found.";
    }

    // Extracting options based on expected structure, e.g., list items or divs with options
    let optionsElements = Array.from(quizContainer.querySelectorAll('.answer-option, li, .option'));  // Adjust based on actual page structure
    if (optionsElements.length > 0) {
      options = optionsElements.map(option => option.innerText.trim());
    } else {
      options = ["No options found."];
    }

    console.log("Question:", question);
    console.log("Options:", options);

    sendResponse({ question: question, options: options });
  }
});
