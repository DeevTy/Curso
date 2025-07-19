// Game State Management
class EnglishAdventureGame {
    constructor() {
        this.currentScreen = 'welcome';
        this.playerName = '';
        this.ageGroup = '';
        this.currentLevel = 1;
        this.score = 0;
        this.stars = 0;
        this.completedLevels = [];
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.achievements = [];
        
        this.initializeGame();
        this.bindEvents();
    }

    initializeGame() {
        this.loadProgress();
        this.updateUI();
    }

    bindEvents() {
        // Age selection
        document.querySelectorAll('.age-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.ageGroup = e.target.closest('.age-btn').dataset.age;
                this.showPlayerInfo();
            });
        });

        // Start game
        document.getElementById('start-game').addEventListener('click', () => {
            this.playerName = document.getElementById('player-name').value.trim();
            if (this.playerName) {
                this.startGame();
            } else {
                alert('¡Por favor escribe tu nombre!');
            }
        });

        // Navigation
        document.getElementById('home-btn').addEventListener('click', () => this.showWelcome());
        document.getElementById('levels-btn').addEventListener('click', () => this.showLevels());
        document.getElementById('progress-btn').addEventListener('click', () => this.showProgress());

        // Back buttons
        document.getElementById('back-to-game').addEventListener('click', () => this.showGame());
        document.getElementById('back-to-game-progress').addEventListener('click', () => this.showGame());

        // Game controls
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());

        // Modal buttons
        document.getElementById('next-level-btn').addEventListener('click', () => this.nextLevel());
        document.getElementById('replay-level-btn').addEventListener('click', () => this.replayLevel());
        document.getElementById('retry-btn').addEventListener('click', () => this.retryLevel());
        document.getElementById('home-from-gameover').addEventListener('click', () => this.showWelcome());

        // Enter key for name input
        document.getElementById('player-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('start-game').click();
            }
        });
    }

    showPlayerInfo() {
        document.querySelector('.player-info').style.display = 'block';
        document.getElementById('player-name').focus();
    }

    startGame() {
        this.currentScreen = 'game';
        this.loadLevel(this.currentLevel);
        this.showScreen('game-screen');
        this.updateUI();
    }

    showWelcome() {
        this.currentScreen = 'welcome';
        this.showScreen('welcome-screen');
        document.querySelector('.player-info').style.display = 'none';
        document.getElementById('player-name').value = '';
    }

    showGame() {
        this.currentScreen = 'game';
        this.showScreen('game-screen');
    }

    showLevels() {
        this.currentScreen = 'levels';
        this.showScreen('levels-screen');
        this.generateLevelsGrid();
    }

    showProgress() {
        this.currentScreen = 'progress';
        this.showScreen('progress-screen');
        this.updateProgressUI();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    updateUI() {
        if (this.currentScreen === 'game') {
            document.querySelector('.player-name').textContent = this.playerName;
            document.querySelector('.current-level').textContent = `Nivel ${this.currentLevel}`;
            document.querySelector('.score').textContent = `Puntos: ${this.score}`;
            document.querySelector('.stars').textContent = `⭐ ${this.stars}`;
            
            // Update progress bar
            const progress = (this.currentQuestionIndex / this.questions.length) * 100;
            document.querySelector('.progress-fill').style.width = `${progress}%`;
        }
    }

    // Question Data for Different Age Groups
    getQuestionsForLevel(level, ageGroup) {
        const questions = {
            young: {
                1: [
                    {
                        question: "What color is the sky?",
                        options: ["Blue", "Red", "Green", "Yellow"],
                        correct: 0,
                        hint: "Look up during the day!",
                        image: null
                    },
                    {
                        question: "Which animal says 'meow'?",
                        options: ["Dog", "Cat", "Bird", "Fish"],
                        correct: 1,
                        hint: "It's a small pet that likes to sleep!",
                        image: null
                    },
                    {
                        question: "How many fingers do you have on one hand?",
                        options: ["3", "4", "5", "6"],
                        correct: 2,
                        hint: "Count your fingers!",
                        image: null
                    },
                    {
                        question: "What do you drink when you're thirsty?",
                        options: ["Food", "Water", "Air", "Light"],
                        correct: 1,
                        hint: "It's clear and comes from the tap!",
                        image: null
                    },
                    {
                        question: "What shape is a circle?",
                        options: ["Square", "Triangle", "Circle", "Rectangle"],
                        correct: 2,
                        hint: "It's round like a ball!",
                        image: null
                    }
                ],
                2: [
                    {
                        question: "What do you wear on your feet?",
                        options: ["Hat", "Shoes", "Gloves", "Scarf"],
                        correct: 1,
                        hint: "You put them on before going outside!",
                        image: null
                    },
                    {
                        question: "Which fruit is yellow and grows on trees?",
                        options: ["Apple", "Banana", "Orange", "Grape"],
                        correct: 1,
                        hint: "Monkeys love to eat this fruit!",
                        image: null
                    },
                    {
                        question: "What do you use to write?",
                        options: ["Fork", "Pencil", "Spoon", "Cup"],
                        correct: 1,
                        hint: "You hold it in your hand to make marks!",
                        image: null
                    },
                    {
                        question: "What do you say when you meet someone?",
                        options: ["Goodbye", "Hello", "Thank you", "Sorry"],
                        correct: 1,
                        hint: "It's a friendly greeting!",
                        image: null
                    },
                    {
                        question: "What do you do when you're tired?",
                        options: ["Eat", "Sleep", "Run", "Jump"],
                        correct: 1,
                        hint: "You close your eyes and rest!",
                        image: null
                    }
                ],
                3: [
                    {
                        question: "What do you call your mother's mother?",
                        options: ["Sister", "Grandmother", "Aunt", "Cousin"],
                        correct: 1,
                        hint: "She's older than your mother!",
                        image: null
                    },
                    {
                        question: "What do you do with a book?",
                        options: ["Eat it", "Read it", "Throw it", "Hide it"],
                        correct: 1,
                        hint: "You look at the words and pictures!",
                        image: null
                    },
                    {
                        question: "What do you use to brush your teeth?",
                        options: ["Spoon", "Toothbrush", "Fork", "Knife"],
                        correct: 1,
                        hint: "It has bristles and toothpaste!",
                        image: null
                    },
                    {
                        question: "What do you say when someone gives you something?",
                        options: ["Hello", "Goodbye", "Thank you", "Sorry"],
                        correct: 2,
                        hint: "It's a polite word!",
                        image: null
                    },
                    {
                        question: "What do you do when you're happy?",
                        options: ["Cry", "Sleep", "Smile", "Hide"],
                        correct: 2,
                        hint: "Your mouth goes up!",
                        image: null
                    }
                ]
            },
            older: {
                1: [
                    {
                        question: "Complete the sentence: 'I ___ to school every day.'",
                        options: ["go", "goes", "going", "went"],
                        correct: 0,
                        hint: "Use the present simple tense!",
                        image: null
                    },
                    {
                        question: "What is the opposite of 'big'?",
                        options: ["Large", "Huge", "Small", "Tall"],
                        correct: 2,
                        hint: "Think about size!",
                        image: null
                    },
                    {
                        question: "Which word is a noun?",
                        options: ["Run", "Happy", "House", "Quickly"],
                        correct: 2,
                        hint: "It's a person, place, or thing!",
                        image: null
                    },
                    {
                        question: "What do you call a group of fish?",
                        options: ["Herd", "Flock", "School", "Pack"],
                        correct: 2,
                        hint: "Fish swim together in a...",
                        image: null
                    },
                    {
                        question: "Complete: 'The sun ___ in the east.'",
                        options: ["rise", "rises", "rising", "rose"],
                        correct: 1,
                        hint: "Use present simple for facts!",
                        image: null
                    }
                ],
                2: [
                    {
                        question: "What is the past tense of 'go'?",
                        options: ["Goed", "Went", "Gone", "Going"],
                        correct: 1,
                        hint: "It's an irregular verb!",
                        image: null
                    },
                    {
                        question: "Which sentence is correct?",
                        options: ["I have 2 apple", "I have 2 apples", "I has 2 apples", "I having 2 apples"],
                        correct: 1,
                        hint: "Countable nouns need 's' for plural!",
                        image: null
                    },
                    {
                        question: "What do you call someone who writes books?",
                        options: ["Artist", "Author", "Actor", "Athlete"],
                        correct: 1,
                        hint: "They create stories and novels!",
                        image: null
                    },
                    {
                        question: "Complete: 'If it rains, I ___ stay home.'",
                        options: ["will", "would", "am", "have"],
                        correct: 0,
                        hint: "First conditional structure!",
                        image: null
                    },
                    {
                        question: "What is the comparative form of 'good'?",
                        options: ["Gooder", "More good", "Better", "Best"],
                        correct: 2,
                        hint: "It's an irregular adjective!",
                        image: null
                    }
                ],
                3: [
                    {
                        question: "What is the passive voice of 'The cat catches the mouse'?",
                        options: ["The mouse catches the cat", "The mouse is caught by the cat", "The cat is caught by the mouse", "The mouse catches by the cat"],
                        correct: 1,
                        hint: "The object becomes the subject!",
                        image: null
                    },
                    {
                        question: "Which word is an adverb?",
                        options: ["Beautiful", "Beauty", "Beautifully", "Beautify"],
                        correct: 2,
                        hint: "It describes how something is done!",
                        image: null
                    },
                    {
                        question: "What is a synonym for 'happy'?",
                        options: ["Sad", "Joyful", "Angry", "Tired"],
                        correct: 1,
                        hint: "It means the same thing!",
                        image: null
                    },
                    {
                        question: "Complete: 'She has been studying ___ 2 hours.'",
                        options: ["since", "for", "from", "at"],
                        correct: 1,
                        hint: "Use 'for' with duration!",
                        image: null
                    },
                    {
                        question: "What is the superlative form of 'far'?",
                        options: ["Farrer", "More far", "Farthest", "Most far"],
                        correct: 2,
                        hint: "It's an irregular adjective!",
                        image: null
                    }
                ]
            }
        };

        return questions[ageGroup][level] || [];
    }

    loadLevel(level) {
        this.currentLevel = level;
        this.questions = this.getQuestionsForLevel(level, this.ageGroup);
        this.currentQuestionIndex = 0;
        
        if (this.questions.length > 0) {
            this.displayQuestion();
            this.updateLevelTitle();
        }
    }

    updateLevelTitle() {
        const titles = {
            young: {
                1: "Colores Básicos y Animales",
                2: "Objetos Cotidianos",
                3: "Familia y Actividades"
            },
            older: {
                1: "Gramática Básica",
                2: "Gramática Intermedia",
                3: "Gramática Avanzada"
            }
        };

        const descriptions = {
            young: {
                1: "¡Aprende sobre colores, animales y conteo básico!",
                2: "¡Descubre objetos cotidianos y palabras simples!",
                3: "¡Aprende sobre familia y actividades diarias!"
            },
            older: {
                1: "¡Domina las reglas básicas de gramática inglesa!",
                2: "¡Practica conceptos de gramática intermedia!",
                3: "¡Desafíate con gramática avanzada!"
            }
        };

        document.getElementById('level-title').textContent = titles[this.ageGroup][this.currentLevel] || `Nivel ${this.currentLevel}`;
        document.getElementById('level-description').textContent = descriptions[this.ageGroup][this.currentLevel] || "¡Vamos a aprender inglés!";
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.completeLevel();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        const questionContainer = document.getElementById('question-container');
        const answerContainer = document.getElementById('answer-container');

        // Display question
        questionContainer.innerHTML = `
            <div class="question-text">${question.question}</div>
            ${question.image ? `<img src="${question.image}" alt="Question" class="question-image">` : ''}
        `;

        // Display answer options
        answerContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = option;
            button.addEventListener('click', () => this.checkAnswer(index));
            answerContainer.appendChild(button);
        });

        // Reset controls
        document.getElementById('hint-btn').style.display = 'inline-block';
        document.getElementById('next-btn').style.display = 'none';
        
        this.updateUI();
    }

    checkAnswer(selectedIndex) {
        const question = this.questions[this.currentQuestionIndex];
        const buttons = document.querySelectorAll('.answer-btn');
        
        // Disable all buttons
        buttons.forEach(btn => btn.style.pointerEvents = 'none');
        
        // Show correct/incorrect
        buttons.forEach((btn, index) => {
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && index !== question.correct) {
                btn.classList.add('incorrect');
            }
        });

        // Update score
        if (selectedIndex === question.correct) {
            this.score += 10;
            this.stars += 1;
            this.showCorrectFeedback();
        } else {
            this.showIncorrectFeedback();
        }

        // Show next button
        document.getElementById('next-btn').style.display = 'inline-block';
        document.getElementById('hint-btn').style.display = 'none';
        
        this.updateUI();
    }

    showCorrectFeedback() {
        // Add celebration animation
        const questionContainer = document.getElementById('question-container');
        const celebration = document.createElement('div');
        celebration.innerHTML = '<i class="fas fa-star" style="color: #ffd700; font-size: 2rem; animation: bounce 0.5s;"></i>';
        celebration.style.textAlign = 'center';
        celebration.style.marginTop = '20px';
        questionContainer.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 1000);
    }

    showIncorrectFeedback() {
        const questionContainer = document.getElementById('question-container');
        const feedback = document.createElement('div');
        feedback.innerHTML = '<p style="color: #ff6b6b; font-weight: 600; margin-top: 20px;">¡Inténtalo la próxima vez!</p>';
        feedback.style.textAlign = 'center';
        questionContainer.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }

    showHint() {
        const question = this.questions[this.currentQuestionIndex];
        alert(`Hint: ${question.hint}`);
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.displayQuestion();
    }

    completeLevel() {
        if (!this.completedLevels.includes(this.currentLevel)) {
            this.completedLevels.push(this.currentLevel);
        }
        
        this.saveProgress();
        this.showLevelComplete();
    }

    showLevelComplete() {
        document.getElementById('level-score').textContent = this.score;
        document.getElementById('level-stars').textContent = this.stars;
        document.getElementById('level-complete').style.display = 'block';
    }

    nextLevel() {
        document.getElementById('level-complete').style.display = 'none';
        this.currentLevel++;
        this.loadLevel(this.currentLevel);
    }

    replayLevel() {
        document.getElementById('level-complete').style.display = 'none';
        this.loadLevel(this.currentLevel);
    }

    retryLevel() {
        document.getElementById('game-over').style.display = 'none';
        this.loadLevel(this.currentLevel);
    }

    generateLevelsGrid() {
        const levelsGrid = document.getElementById('levels-grid');
        levelsGrid.innerHTML = '';
        
        const maxLevels = this.ageGroup === 'young' ? 3 : 3;
        
        for (let i = 1; i <= maxLevels; i++) {
            const levelBtn = document.createElement('button');
            levelBtn.className = 'level-btn';
            
            if (this.completedLevels.includes(i)) {
                levelBtn.classList.add('completed');
                levelBtn.innerHTML = `<i class="fas fa-check"></i><span>Nivel ${i}</span>`;
            } else if (i === 1 || this.completedLevels.includes(i - 1)) {
                levelBtn.innerHTML = `<i class="fas fa-play"></i><span>Nivel ${i}</span>`;
            } else {
                levelBtn.classList.add('locked');
                levelBtn.innerHTML = `<i class="fas fa-lock"></i><span>Nivel ${i}</span>`;
            }
            
            if (!levelBtn.classList.contains('locked')) {
                levelBtn.addEventListener('click', () => {
                    this.loadLevel(i);
                    this.showGame();
                });
            }
            
            levelsGrid.appendChild(levelBtn);
        }
    }

    updateProgressUI() {
        document.getElementById('total-score').textContent = this.score;
        document.getElementById('total-stars').textContent = this.stars;
        document.getElementById('levels-completed').textContent = this.completedLevels.length;
        
        this.generateAchievements();
    }

    generateAchievements() {
        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = '';
        
        const achievements = [
            { id: 'first_level', title: 'Primeros Pasos', description: 'Completa tu primer nivel', icon: 'fas fa-star', unlocked: this.completedLevels.length >= 1 },
            { id: 'score_50', title: 'Maestro de Puntos', description: 'Alcanza 50 puntos', icon: 'fas fa-trophy', unlocked: this.score >= 50 },
            { id: 'stars_10', title: 'Coleccionista de Estrellas', description: 'Gana 10 estrellas', icon: 'fas fa-star', unlocked: this.stars >= 10 },
            { id: 'all_levels', title: 'Campeón de Inglés', description: 'Completa todos los niveles', icon: 'fas fa-crown', unlocked: this.completedLevels.length >= 3 }
        ];
        
        achievements.forEach(achievement => {
            const achievementItem = document.createElement('div');
            achievementItem.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            achievementItem.innerHTML = `
                <i class="${achievement.icon}"></i>
                <div class="achievement-info">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                </div>
            `;
            achievementsList.appendChild(achievementItem);
        });
    }

    saveProgress() {
        const progress = {
            playerName: this.playerName,
            ageGroup: this.ageGroup,
            currentLevel: this.currentLevel,
            score: this.score,
            stars: this.stars,
            completedLevels: this.completedLevels
        };
        localStorage.setItem('englishAdventureProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('englishAdventureProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.playerName = progress.playerName || '';
            this.ageGroup = progress.ageGroup || '';
            this.currentLevel = progress.currentLevel || 1;
            this.score = progress.score || 0;
            this.stars = progress.stars || 0;
            this.completedLevels = progress.completedLevels || [];
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EnglishAdventureGame();
}); 