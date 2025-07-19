// Game State Management
class EnglishAdventureGame {
    constructor() {
        this.currentScreen = 'welcome';
        this.playerName = '';
        this.ageGroup = '';
        this.currentLevel = 1;
        this.score = 100; // Puntos iniciales de regalo
        this.stars = 0;
        this.completedLevels = [];
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.achievements = [];
        this.darkMode = false;
        
        this.initializeGame();
        this.bindEvents();
        this.initializeDarkMode();
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

        // Dark mode toggle buttons
        document.getElementById('dark-mode-toggle').addEventListener('click', () => {
            this.toggleDarkMode();
        });

        document.getElementById('dark-mode-toggle-game').addEventListener('click', () => {
            this.toggleDarkMode();
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
        
        // Mostrar mensaje de bienvenida con puntos iniciales
        this.showWelcomeMessage();
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
                        question: "¿De qué color es el cielo?",
                        options: ["Blue", "Red", "Green", "Yellow"],
                        correct: 0,
                        hint: "¡Mira hacia arriba durante el día!",
                        image: null
                    },
                    {
                        question: "¿Qué animal hace 'meow'?",
                        options: ["Dog", "Cat", "Bird", "Fish"],
                        correct: 1,
                        hint: "¡Es una mascota pequeña que le gusta dormir!",
                        image: null
                    },
                    {
                        question: "¿Cuántos dedos tienes en una mano?",
                        options: ["3", "4", "5", "6"],
                        correct: 2,
                        hint: "¡Cuenta tus dedos!",
                        image: null
                    },
                    {
                        question: "¿Qué bebes cuando tienes sed?",
                        options: ["Food", "Water", "Air", "Light"],
                        correct: 1,
                        hint: "¡Es transparente y sale del grifo!",
                        image: null
                    },
                    {
                        question: "¿Qué forma tiene un círculo?",
                        options: ["Square", "Triangle", "Circle", "Rectangle"],
                        correct: 2,
                        hint: "¡Es redondo como una pelota!",
                        image: null
                    }
                ],
                2: [
                    {
                        question: "¿Qué te pones en los pies?",
                        options: ["Hat", "Shoes", "Gloves", "Scarf"],
                        correct: 1,
                        hint: "¡Te los pones antes de salir!",
                        image: null
                    },
                    {
                        question: "¿Qué fruta es amarilla y crece en árboles?",
                        options: ["Apple", "Banana", "Orange", "Grape"],
                        correct: 1,
                        hint: "¡A los monos les encanta comer esta fruta!",
                        image: null
                    },
                    {
                        question: "¿Qué usas para escribir?",
                        options: ["Fork", "Pencil", "Spoon", "Cup"],
                        correct: 1,
                        hint: "¡Lo sostienes en la mano para hacer marcas!",
                        image: null
                    },
                    {
                        question: "¿Qué dices cuando conoces a alguien?",
                        options: ["Goodbye", "Hello", "Thank you", "Sorry"],
                        correct: 1,
                        hint: "¡Es un saludo amigable!",
                        image: null
                    },
                    {
                        question: "¿Qué haces cuando estás cansado?",
                        options: ["Eat", "Sleep", "Run", "Jump"],
                        correct: 1,
                        hint: "¡Cierras los ojos y descansas!",
                        image: null
                    }
                ],
                3: [
                    {
                        question: "¿Cómo llamas a la madre de tu madre?",
                        options: ["Sister", "Grandmother", "Aunt", "Cousin"],
                        correct: 1,
                        hint: "¡Es mayor que tu madre!",
                        image: null
                    },
                    {
                        question: "¿Qué haces con un libro?",
                        options: ["Eat it", "Read it", "Throw it", "Hide it"],
                        correct: 1,
                        hint: "¡Miras las palabras y las imágenes!",
                        image: null
                    },
                    {
                        question: "¿Qué usas para cepillarte los dientes?",
                        options: ["Spoon", "Toothbrush", "Fork", "Knife"],
                        correct: 1,
                        hint: "¡Tiene cerdas y pasta de dientes!",
                        image: null
                    },
                    {
                        question: "¿Qué dices cuando alguien te da algo?",
                        options: ["Hello", "Goodbye", "Thank you", "Sorry"],
                        correct: 2,
                        hint: "¡Es una palabra educada!",
                        image: null
                    },
                    {
                        question: "¿Qué haces cuando estás feliz?",
                        options: ["Cry", "Sleep", "Smile", "Hide"],
                        correct: 2,
                        hint: "¡Tu boca se levanta!",
                        image: null
                    }
                ]
            },
            older: {
                1: [
                    {
                        question: "Completa la oración: 'I ___ to school every day.'",
                        options: ["go", "goes", "going", "went"],
                        correct: 0,
                        hint: "¡Usa el tiempo presente simple!",
                        image: null
                    },
                    {
                        question: "¿Cuál es el opuesto de 'big'?",
                        options: ["Large", "Huge", "Small", "Tall"],
                        correct: 2,
                        hint: "¡Piensa en el tamaño!",
                        image: null
                    },
                    {
                        question: "¿Cuál palabra es un sustantivo?",
                        options: ["Run", "Happy", "House", "Quickly"],
                        correct: 2,
                        hint: "¡Es una persona, lugar o cosa!",
                        image: null
                    },
                    {
                        question: "¿Cómo se llama un grupo de peces?",
                        options: ["Herd", "Flock", "School", "Pack"],
                        correct: 2,
                        hint: "Los peces nadan juntos en una...",
                        image: null
                    },
                    {
                        question: "Completa: 'The sun ___ in the east.'",
                        options: ["rise", "rises", "rising", "rose"],
                        correct: 1,
                        hint: "¡Usa presente simple para hechos!",
                        image: null
                    }
                ],
                2: [
                    {
                        question: "¿Cuál es el tiempo pasado de 'go'?",
                        options: ["Goed", "Went", "Gone", "Going"],
                        correct: 1,
                        hint: "¡Es un verbo irregular!",
                        image: null
                    },
                    {
                        question: "¿Cuál oración es correcta?",
                        options: ["I have 2 apple", "I have 2 apples", "I has 2 apples", "I having 2 apples"],
                        correct: 1,
                        hint: "¡Los sustantivos contables necesitan 's' en plural!",
                        image: null
                    },
                    {
                        question: "¿Cómo se llama alguien que escribe libros?",
                        options: ["Artist", "Author", "Actor", "Athlete"],
                        correct: 1,
                        hint: "¡Crean historias y novelas!",
                        image: null
                    },
                    {
                        question: "Completa: 'If it rains, I ___ stay home.'",
                        options: ["will", "would", "am", "have"],
                        correct: 0,
                        hint: "¡Estructura de primera condicional!",
                        image: null
                    },
                    {
                        question: "¿Cuál es la forma comparativa de 'good'?",
                        options: ["Gooder", "More good", "Better", "Best"],
                        correct: 2,
                        hint: "¡Es un adjetivo irregular!",
                        image: null
                    }
                ],
                3: [
                    {
                        question: "¿Cuál es la voz pasiva de 'The cat catches the mouse'?",
                        options: ["The mouse catches the cat", "The mouse is caught by the cat", "The cat is caught by the mouse", "The mouse catches by the cat"],
                        correct: 1,
                        hint: "¡El objeto se convierte en sujeto!",
                        image: null
                    },
                    {
                        question: "¿Cuál palabra es un adverbio?",
                        options: ["Beautiful", "Beauty", "Beautifully", "Beautify"],
                        correct: 2,
                        hint: "¡Describe cómo se hace algo!",
                        image: null
                    },
                    {
                        question: "¿Cuál es un sinónimo de 'happy'?",
                        options: ["Sad", "Joyful", "Angry", "Tired"],
                        correct: 1,
                        hint: "¡Significa lo mismo!",
                        image: null
                    },
                    {
                        question: "Completa: 'She has been studying ___ 2 hours.'",
                        options: ["since", "for", "from", "at"],
                        correct: 1,
                        hint: "¡Usa 'for' con duración!",
                        image: null
                    },
                    {
                        question: "¿Cuál es la forma superlativa de 'far'?",
                        options: ["Farrer", "More far", "Farthest", "Most far"],
                        correct: 2,
                        hint: "¡Es un adjetivo irregular!",
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
        // Add celebration animation with happy face
        const questionContainer = document.getElementById('question-container');
        const celebration = document.createElement('div');
        celebration.innerHTML = `
            <div style="text-align: center; margin-top: 20px;">
                <i class="fas fa-star" style="color: #ffd700; font-size: 2rem; animation: bounce 0.5s; margin-right: 10px;"></i>
                <span style="font-size: 3rem; animation: happyBounce 1s;">😊</span>
                <p style="color: #4ecdc4; font-weight: 600; margin-top: 10px; font-size: 1.2rem;">¡Correcto! ¡Muy bien!</p>
            </div>
        `;
        celebration.style.textAlign = 'center';
        questionContainer.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 2000);
    }

    showIncorrectFeedback() {
        const questionContainer = document.getElementById('question-container');
        const feedback = document.createElement('div');
        feedback.innerHTML = `
            <div style="text-align: center; margin-top: 20px;">
                <span style="font-size: 3rem; animation: sadShake 1s;">😔</span>
                <p style="color: #ff6b6b; font-weight: 600; margin-top: 10px; font-size: 1.2rem;">¡Inténtalo la próxima vez!</p>
            </div>
        `;
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
            { id: 'score_200', title: 'Experto en Puntos', description: 'Alcanza 200 puntos', icon: 'fas fa-trophy', unlocked: this.score >= 200 },
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

    showWelcomeMessage() {
        // Crear mensaje de bienvenida con puntos iniciales
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `
            <div class="welcome-message-content">
                <i class="fas fa-gift" style="color: #ffd700; font-size: 3rem; margin-bottom: 15px;"></i>
                <h3>¡Bienvenido, ${this.playerName}!</h3>
                <p>🎁 <strong>¡Regalo de bienvenida!</strong></p>
                <p>Has recibido <strong>100 puntos iniciales</strong> para comenzar tu aventura.</p>
                <p>¡Diviértete aprendiendo inglés!</p>
                <button class="welcome-close-btn">¡Entendido!</button>
            </div>
        `;
        
        // Agregar estilos al mensaje
        welcomeMessage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        `;
        
        const content = welcomeMessage.querySelector('.welcome-message-content');
        content.style.cssText = `
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: modalSlideIn 0.3s ease;
        `;
        
        const closeBtn = welcomeMessage.querySelector('.welcome-close-btn');
        closeBtn.style.cssText = `
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
            border: none;
            border-radius: 15px;
            padding: 12px 30px;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 20px;
        `;
        
        closeBtn.addEventListener('click', () => {
            welcomeMessage.remove();
        });
        
        // Cerrar con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                welcomeMessage.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        document.body.appendChild(welcomeMessage);
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            if (welcomeMessage.parentNode) {
                welcomeMessage.remove();
            }
        }, 5000);
    }

    loadProgress() {
        const saved = localStorage.getItem('englishAdventureProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.playerName = progress.playerName || '';
            this.ageGroup = progress.ageGroup || '';
            this.currentLevel = progress.currentLevel || 1;
            this.score = progress.score || 100; // Puntos iniciales si es la primera vez
            this.stars = progress.stars || 0;
            this.completedLevels = progress.completedLevels || [];
        }
    }

    initializeDarkMode() {
        // Cargar preferencia de modo oscuro
        const savedDarkMode = localStorage.getItem('englishAdventureDarkMode');
        if (savedDarkMode === 'true') {
            this.darkMode = true;
            document.body.classList.add('dark-mode');
        }
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('englishAdventureDarkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('englishAdventureDarkMode', 'false');
        }

        // Animación de la patita
        const pawIcon = document.querySelector('.dark-mode-btn i');
        pawIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            pawIcon.style.transform = '';
        }, 300);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EnglishAdventureGame();
}); 