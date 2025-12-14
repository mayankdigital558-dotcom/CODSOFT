document.addEventListener('DOMContentLoaded', () => {
    // --- Global State & Data (In-Memory Mock) ---
    const MOCK_QUIZ_DATA = [
        {
            id: 1,
            title: "Fundamentals of Web Development",
            creator: "Admin",
            questions: [
                {
                    questionText: "What does HTML stand for?",
                    options: ["Hyper Text Markup Language", "Hyperlink and Text Markup Language", "High-level Text Management Logic", "Home Tool Markup Language"],
                    correctAnswer: "Hyper Text Markup Language"
                },
                {
                    questionText: "Which property is used to change the background color in CSS?",
                    options: ["color", "bgcolor", "background-color", "bg"],
                    correctAnswer: "background-color"
                },
                {
                    questionText: "Inside which HTML element do we put the JavaScript?",
                    options: ["<js>", "<scripting>", "<script>", "<link>"],
                    correctAnswer: "<script>"
                }
            ]
        }
    ];

    let currentQuiz = null; // Stores the quiz being taken
    let userAnswers = [];
    let currentQuestionIndex = 0;

    // --- DOM Elements ---
    const pages = document.querySelectorAll('.page-view');
    const mainNav = document.getElementById('main-nav');
    const creationForm = document.getElementById('quiz-creation-form');
    const questionsContainer = document.getElementById('questions-container');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const quizListContainer = document.getElementById('quiz-list');
    const quizContainer = document.getElementById('quiz-container');
    const questionArea = document.getElementById('question-area');
    const nextQuestionBtn = document.getElementById('next-question-btn');

    // --- Helper Functions ---

    /**
     * Switches the active view (page) based on the data-page attribute.
     * @param {string} pageId - The ID of the page to display (e.g., 'home', 'creation').
     */
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.add('hidden');
        });
        document.getElementById(`${pageId}-page`).classList.remove('hidden');

        // Update active navigation link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });

        // Specific actions for pages
        if (pageId === 'listing') {
            renderQuizListing();
        }
    }

    /**
     * Renders the question and options for the current step of the quiz.
     */
    function renderQuestion() {
        if (!currentQuiz || currentQuestionIndex >= currentQuiz.questions.length) {
            showResults();
            return;
        }

        const questionData = currentQuiz.questions[currentQuestionIndex];
        const questionNum = currentQuestionIndex + 1;
        const totalQuestions = currentQuiz.questions.length;
        const optionsHTML = questionData.options.map((option, index) => {
            // Use a character code for options (A, B, C, D)
            const optionChar = String.fromCharCode(65 + index);
            return `
                <label class="option-label">
                    <input type="radio" name="currentQuestion" value="${option}" required>
                    **${optionChar}.** ${option}
                </label>
            `;
        }).join('');

        questionArea.innerHTML = `
            <h3>${questionNum}. ${questionData.questionText}</h3>
            <div class="options-list">
                ${optionsHTML}
            </div>
        `;

        document.getElementById('quiz-taking-title').textContent = currentQuiz.title;
        document.getElementById('current-q-num').textContent = questionNum;
        document.getElementById('total-q-num').textContent = totalQuestions;
        nextQuestionBtn.textContent = (questionNum === totalQuestions) ? 'Finish Quiz' : 'Next Question';

        // Check if an answer was previously selected for this question
        const savedAnswer = userAnswers[currentQuestionIndex];
        if (savedAnswer) {
             const radioInput = questionArea.querySelector(`input[value="${savedAnswer}"]`);
             if(radioInput) radioInput.checked = true;
        }

        showPage('taking');
    }

    /**
     * Calculates the score and displays the results page.
     */
    function showResults() {
        let score = 0;
        currentQuiz.questions.forEach((q, index) => {
            if (userAnswers[index] === q.correctAnswer) {
                score++;
            }
        });

        document.getElementById('final-score').textContent = `${score} / ${currentQuiz.questions.length}`;
        showPage('results');
        
        // Reset state
        currentQuiz = null;
        userAnswers = [];
        currentQuestionIndex = 0;
    }

    /**
     * Generates the HTML for a single question card in the creation form.
     * @param {number} questionNumber - The index of the question.
     * @returns {string} The HTML string.
     */
    function createQuestionCardHTML(questionNumber) {
        const index = questionNumber;
        const alphabet = ['A', 'B', 'C', 'D', 'E', 'F']; // Max options

        let optionsHTML = '';
        for (let i = 0; i < 4; i++) { // Default 4 options
            optionsHTML += `
                <div class="option-group">
                    <input type="text" name="option-${index}-${i}" placeholder="Option ${alphabet[i]}" required>
                </div>
            `;
        }

        return `
            <div class="question-card" data-q-index="${index}">
                <h4>Question ${questionNumber + 1}</h4>
                <div class="form-group">
                    <label>Question Text</label>
                    <input type="text" name="question-text-${index}" placeholder="Write your question here..." required>
                </div>
                
                <label>Options (4 required)</label>
                <div class="options-list-creation">
                    ${optionsHTML}
                </div>

                <div class="correct-answer-select">
                    <label>Correct Answer:</label>
                    <select name="correct-answer-${index}" required>
                        <option value="">Select Correct Option</option>
                        <option value="0">A</option>
                        <option value="1">B</option>
                        <option value="2">C</option>
                        <option value="3">D</option>
                    </select>
                </div>
            </div>
        `;
    }

    /**
     * Renders the list of available quizzes from the mock data.
     */
    function renderQuizListing() {
        quizListContainer.innerHTML = MOCK_QUIZ_DATA.map(quiz => `
            <div class="quiz-card" data-quiz-id="${quiz.id}">
                <h3>${quiz.title}</h3>
                <p>${quiz.questions.length} Questions | Created by: ${quiz.creator}</p>
                <button class="btn-secondary take-quiz-btn" data-quiz-id="${quiz.id}">Start Quiz</button>
            </div>
        `).join('');
    }


    // --- Event Listeners ---

    // 1. Navigation/Page Switching
    document.body.addEventListener('click', (e) => {
        const pageId = e.target.getAttribute('data-page');
        const quizId = e.target.getAttribute('data-quiz-id');

        if (pageId) {
            e.preventDefault();
            showPage(pageId);
        } else if (e.target.classList.contains('take-quiz-btn') && quizId) {
            e.preventDefault();
            currentQuiz = MOCK_QUIZ_DATA.find(q => q.id === parseInt(quizId));
            currentQuestionIndex = 0;
            userAnswers = [];
            if (currentQuiz) {
                renderQuestion();
            }
        }
    });

    // 2. Quiz Creation: Add Question Button
    let questionCount = 0;
    addQuestionBtn.addEventListener('click', () => {
        questionsContainer.insertAdjacentHTML('beforeend', createQuestionCardHTML(questionCount));
        questionCount++;
    });
    
    // Initialize with one question on load
    addQuestionBtn.click(); 

    // 3. Quiz Creation: Submission (Mock functionality)
    creationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('quiz-title').value;
        const newQuestions = [];
        let isValid = true;

        document.querySelectorAll('.question-card').forEach((card, qIndex) => {
            const qText = card.querySelector(`input[name="question-text-${qIndex}"]`).value;
            const correctIndex = card.querySelector(`select[name="correct-answer-${qIndex}"]`).value;
            const options = [];
            
            for(let i=0; i<4; i++) {
                const optionInput = card.querySelector(`input[name="option-${qIndex}-${i}"]`);
                options.push(optionInput.value);
            }

            if (!qText || correctIndex === "") {
                isValid = false;
                alert(`Please complete Question ${qIndex + 1} fields.`);
                return;
            }

            newQuestions.push({
                questionText: qText,
                options: options,
                correctAnswer: options[parseInt(correctIndex)]
            });
        });

        if (!isValid) return;

        // Mock saving the new quiz to the state
        const newQuiz = {
            id: MOCK_QUIZ_DATA.length + 1,
            title: title,
            creator: "New User (You)",
            questions: newQuestions
        };

        MOCK_QUIZ_DATA.push(newQuiz);
        alert(`Quiz "${title}" created and published!`);
        
        // Reset form and go to listing
        creationForm.reset();
        questionsContainer.innerHTML = '';
        questionCount = 0;
        addQuestionBtn.click(); // Add a new initial question
        showPage('listing');
    });

    // 4. Quiz Taking: Next Question Button
    nextQuestionBtn.addEventListener('click', () => {
        const selectedOption = questionArea.querySelector('input[name="currentQuestion"]:checked');
        
        if (!selectedOption) {
            alert("Please select an answer before proceeding.");
            return;
        }

        userAnswers[currentQuestionIndex] = selectedOption.value;
        currentQuestionIndex++;
        renderQuestion();
    });

    // 5. Initial Load: Show Home Page
    showPage('home');
    renderQuizListing(); // Pre-load listing data
});