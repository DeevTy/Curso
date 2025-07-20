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
    }

    initializeGame() {
        this.loadProgress();
        this.loadDarkMode();
        this.bindEvents();
        this.insertAudioButton();
        this.showWelcome();
    }

    insertAudioButton() {
        // Si ya existe, no hacer nada
        if (document.getElementById('audio-btn')) return;
        // Buscar el contenedor de controles
        let controls = document.querySelector('.game-controls');
        if (!controls) return;
        // Crear el contenedor fijo si no existe
        let audioContainer = document.getElementById('audio-container');
        if (!audioContainer) {
            audioContainer = document.createElement('div');
            audioContainer.id = 'audio-container';
            audioContainer.style.position = 'fixed';
            audioContainer.style.top = '20px';
            audioContainer.style.right = '20px';
            audioContainer.style.zIndex = '9999';
            audioContainer.style.background = 'red';
            audioContainer.style.border = '3px solid yellow';
            audioContainer.style.borderRadius = '10px';
            audioContainer.style.padding = '10px';
            audioContainer.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
            document.body.appendChild(audioContainer);
        }
        // Crear el botón
        let audioBtn = document.createElement('button');
        audioBtn.id = 'audio-btn';
        audioBtn.innerHTML = '<i class="fas fa-volume-up"></i> 🎵 ESCUCHAR 🎵';
        audioBtn.style.background = 'red';
        audioBtn.style.color = 'white';
        audioBtn.style.border = 'none';
        audioBtn.style.padding = '15px 25px';
        audioBtn.style.borderRadius = '8px';
        audioBtn.style.fontSize = '16px';
        audioBtn.style.fontWeight = 'bold';
        audioBtn.style.cursor = 'pointer';
        audioBtn.style.display = 'block';
        audioBtn.onclick = () => this.playQuestionAudio();
        audioContainer.innerHTML = '';
        audioContainer.appendChild(audioBtn);
    }

    bindEvents() {
        // Age selection
        document.querySelectorAll('.age-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.ageGroup = e.target.closest('.age-btn').dataset.age;
                this.showPlayerInfo();
            });
        });

        // Modo oscuro con la huella del logo
        const pawBtn = document.getElementById('dark-mode-toggle');
        if (pawBtn) {
            pawBtn.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

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
        const audioBtn = document.getElementById('audio-btn');
        console.log('Audio button found in bindEvents:', audioBtn);
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                console.log('Audio button clicked!');
                this.playQuestionAudio();
            });
        } else {
            console.error('Audio button not found in bindEvents!');
        }
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
        
        // Show audio button for testing - always visible
        const audioBtn = document.getElementById('audio-btn');
        audioBtn.style.display = 'inline-block';
        console.log('Audio button should be visible for all groups');
        
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
            '3-6': {
                1: [
                    { question: "¿De qué color es el sol?", options: ["Yellow", "Blue", "Red", "Green"], correct: 0, hint: "¡Mira el cielo cuando hace sol!", image: null },
                    { question: "¿Qué animal dice 'guau'?", options: ["Cat", "Dog", "Fish", "Bird"], correct: 1, hint: "Es el mejor amigo del hombre.", image: null },
                    { question: "¿Qué fruta es amarilla?", options: ["Apple", "Banana", "Grape", "Orange"], correct: 1, hint: "Los monos la comen.", image: null },
                    { question: "¿Qué color es el cielo?", options: ["Blue", "Red", "Green", "Yellow"], correct: 0, hint: "Mira hacia arriba.", image: null },
                    { question: "¿Qué animal es grande y gris?", options: ["Cat", "Dog", "Elephant", "Bird"], correct: 2, hint: "Tiene una trompa larga.", image: null },
                    { question: "¿Qué usas para beber agua?", options: ["Cup", "Book", "Pencil", "Ball"], correct: 0, hint: "Es redondo y tiene asa.", image: null },
                    { question: "¿Qué animal vuela?", options: ["Fish", "Bird", "Dog", "Cat"], correct: 1, hint: "Tiene plumas y alas.", image: null },
                    { question: "¿Qué fruta es naranja?", options: ["Apple", "Banana", "Orange", "Grape"], correct: 2, hint: "Se llama igual que su color.", image: null },
                    { question: "¿Qué usas para dormir?", options: ["Chair", "Bed", "Table", "Cup"], correct: 1, hint: "Es suave y cómodo.", image: null },
                    { question: "¿Qué animal es pequeño y rojo?", options: ["Elephant", "Ladybug", "Dog", "Bird"], correct: 1, hint: "Tiene puntos negros.", image: null },
                    { question: "¿Qué color es la hierba?", options: ["Blue", "Red", "Green", "Yellow"], correct: 2, hint: "Es el color de las plantas.", image: null },
                    { question: "¿Qué fruta es pequeña y morada?", options: ["Apple", "Banana", "Grape", "Orange"], correct: 2, hint: "Crece en racimos.", image: null },
                    { question: "¿Qué animal es blanco y negro?", options: ["Cat", "Dog", "Panda", "Bird"], correct: 2, hint: "Vive en China.", image: null },
                    { question: "¿Qué usas para jugar?", options: ["Ball", "Cup", "Book", "Pencil"], correct: 0, hint: "Es redondo y bota.", image: null },
                    { question: "¿Qué color es el fuego?", options: ["Blue", "Red", "Green", "Yellow"], correct: 1, hint: "Es caliente y brillante.", image: null },
                    { question: "¿Qué animal vive en el agua?", options: ["Bird", "Fish", "Dog", "Cat"], correct: 1, hint: "Respira bajo el agua.", image: null },
                    { question: "¿Qué fruta es verde y ácida?", options: ["Apple", "Banana", "Lemon", "Orange"], correct: 2, hint: "Es muy amarga.", image: null },
                    { question: "¿Qué usas para sentarte?", options: ["Bed", "Chair", "Table", "Cup"], correct: 1, hint: "Tiene respaldo.", image: null },
                    { question: "¿Qué animal es rápido?", options: ["Turtle", "Horse", "Fish", "Bird"], correct: 1, hint: "Tiene cuatro patas largas.", image: null },
                    { question: "¿Qué color es la nieve?", options: ["Blue", "Red", "White", "Green"], correct: 2, hint: "Es fría y blanda.", image: null },
                    { question: "¿Qué fruta es rosa por dentro?", options: ["Apple", "Watermelon", "Banana", "Orange"], correct: 1, hint: "Es muy grande y jugosa.", image: null },
                    { question: "¿Qué animal es muy alto?", options: ["Cat", "Giraffe", "Dog", "Bird"], correct: 1, hint: "Tiene el cuello muy largo.", image: null },
                    { question: "¿Qué usas para escribir?", options: ["Pencil", "Cup", "Ball", "Book"], correct: 0, hint: "Tiene punta afilada.", image: null },
                    { question: "¿Qué color es el chocolate?", options: ["Blue", "Red", "Brown", "Green"], correct: 2, hint: "Es dulce y marrón.", image: null },
                    { question: "¿Qué animal es peludo?", options: ["Fish", "Bear", "Bird", "Snake"], correct: 1, hint: "Es grande y fuerte.", image: null },
                    { question: "¿Qué fruta es amarilla y curva?", options: ["Apple", "Banana", "Grape", "Orange"], correct: 1, hint: "Es suave y dulce.", image: null },
                    { question: "¿Qué usas para comer?", options: ["Fork", "Ball", "Book", "Cup"], correct: 0, hint: "Tiene dientes puntiagudos.", image: null },
                    { question: "¿Qué animal es muy pequeño?", options: ["Elephant", "Ant", "Horse", "Dog"], correct: 1, hint: "Vive en el suelo.", image: null },
                    { question: "¿Qué color es el arcoíris?", options: ["Blue", "Red", "Rainbow", "Green"], correct: 2, hint: "Tiene muchos colores.", image: null },
                    { question: "¿Qué fruta es roja y pequeña?", options: ["Apple", "Strawberry", "Banana", "Orange"], correct: 1, hint: "Tiene semillas afuera.", image: null },
                    { question: "¿Qué animal es muy lento?", options: ["Horse", "Turtle", "Bird", "Fish"], correct: 1, hint: "Lleva su casa encima.", image: null }
                ],
                2: [
                    { question: "¿Qué fruta es roja y redonda?", options: ["Banana", "Apple", "Grape", "Orange"], correct: 1, hint: "Blanca por dentro, roja por fuera.", image: null },
                    { question: "¿Qué animal tiene rayas?", options: ["Cat", "Dog", "Zebra", "Bird"], correct: 2, hint: "Es blanco y negro.", image: null },
                    { question: "¿Qué color es el pasto?", options: ["Blue", "Red", "Green", "Yellow"], correct: 2, hint: "Es el color de las plantas.", image: null },
                    { question: "¿Qué usas para dibujar?", options: ["Pencil", "Fork", "Spoon", "Cup"], correct: 0, hint: "¡Lo usas en la escuela!", image: null },
                    { question: "¿Qué animal es muy grande?", options: ["Mouse", "Elephant", "Bird", "Fish"], correct: 1, hint: "Tiene una trompa larga.", image: null },
                    { question: "¿Qué fruta es naranja?", options: ["Apple", "Banana", "Orange", "Grape"], correct: 2, hint: "Se llama igual que su color.", image: null },
                    { question: "¿Qué usas para beber?", options: ["Cup", "Book", "Ball", "Pencil"], correct: 0, hint: "Es redondo y tiene asa.", image: null },
                    { question: "¿Qué animal vuela alto?", options: ["Fish", "Bird", "Dog", "Cat"], correct: 1, hint: "Tiene plumas y alas.", image: null },
                    { question: "¿Qué color es el cielo de noche?", options: ["Blue", "Black", "Green", "Yellow"], correct: 1, hint: "Se ven las estrellas.", image: null },
                    { question: "¿Qué fruta es amarilla y larga?", options: ["Apple", "Banana", "Grape", "Orange"], correct: 1, hint: "Los monos la comen.", image: null },
                    { question: "¿Qué animal es muy rápido?", options: ["Turtle", "Horse", "Fish", "Bird"], correct: 1, hint: "Tiene cuatro patas largas.", image: null },
                    { question: "¿Qué usas para dormir?", options: ["Chair", "Bed", "Table", "Cup"], correct: 1, hint: "Es suave y cómodo.", image: null },
                    { question: "¿Qué color es el fuego?", options: ["Blue", "Red", "Green", "Yellow"], correct: 1, hint: "Es caliente y brillante.", image: null },
                    { question: "¿Qué animal es muy pequeño?", options: ["Elephant", "Ant", "Horse", "Dog"], correct: 1, hint: "Vive en el suelo.", image: null },
                    { question: "¿Qué fruta es morada y pequeña?", options: ["Apple", "Banana", "Grape", "Orange"], correct: 2, hint: "Crece en racimos.", image: null },
                    { question: "¿Qué usas para sentarte?", options: ["Bed", "Chair", "Table", "Cup"], correct: 1, hint: "Tiene respaldo.", image: null },
                    { question: "¿Qué animal es muy alto?", options: ["Cat", "Giraffe", "Dog", "Bird"], correct: 1, hint: "Tiene el cuello muy largo.", image: null },
                    { question: "¿Qué color es la nieve?", options: ["Blue", "Red", "White", "Green"], correct: 2, hint: "Es fría y blanda.", image: null },
                    { question: "¿Qué fruta es verde y ácida?", options: ["Apple", "Banana", "Lemon", "Orange"], correct: 2, hint: "Es muy amarga.", image: null },
                    { question: "¿Qué animal vive en el agua?", options: ["Bird", "Fish", "Dog", "Cat"], correct: 1, hint: "Respira bajo el agua.", image: null },
                    { question: "¿Qué usas para jugar?", options: ["Ball", "Cup", "Book", "Pencil"], correct: 0, hint: "Es redondo y bota.", image: null },
                    { question: "¿Qué color es el chocolate?", options: ["Blue", "Red", "Brown", "Green"], correct: 2, hint: "Es dulce y marrón.", image: null },
                    { question: "¿Qué animal es blanco y negro?", options: ["Cat", "Dog", "Panda", "Bird"], correct: 2, hint: "Vive en China.", image: null },
                    { question: "¿Qué fruta es rosa por dentro?", options: ["Apple", "Watermelon", "Banana", "Orange"], correct: 1, hint: "Es muy grande y jugosa.", image: null },
                    { question: "¿Qué animal es muy lento?", options: ["Horse", "Turtle", "Bird", "Fish"], correct: 1, hint: "Lleva su casa encima.", image: null },
                    { question: "¿Qué usas para escribir?", options: ["Pencil", "Cup", "Ball", "Book"], correct: 0, hint: "Tiene punta afilada.", image: null },
                    { question: "¿Qué color es el arcoíris?", options: ["Blue", "Red", "Rainbow", "Green"], correct: 2, hint: "Tiene muchos colores.", image: null },
                    { question: "¿Qué animal es peludo?", options: ["Fish", "Bear", "Bird", "Snake"], correct: 1, hint: "Es grande y fuerte.", image: null },
                    { question: "¿Qué fruta es roja y pequeña?", options: ["Apple", "Strawberry", "Banana", "Orange"], correct: 1, hint: "Tiene semillas afuera.", image: null },
                    { question: "¿Qué usas para comer?", options: ["Fork", "Ball", "Book", "Cup"], correct: 0, hint: "Tiene dientes puntiagudos.", image: null },
                    { question: "¿Qué animal es muy fuerte?", options: ["Mouse", "Lion", "Bird", "Fish"], correct: 1, hint: "Es el rey de la selva.", image: null }
                ],
                3: [
                    { question: "¿Qué haces cuando tienes sueño?", options: ["Eat", "Sleep", "Run", "Play"], correct: 1, hint: "Cierras los ojos.", image: null },
                    { question: "¿Qué haces cuando tienes hambre?", options: ["Eat", "Sleep", "Run", "Play"], correct: 0, hint: "Pones comida en la boca.", image: null },
                    { question: "¿Qué haces cuando quieres divertirte?", options: ["Eat", "Sleep", "Run", "Play"], correct: 3, hint: "Es divertido.", image: null },
                    { question: "¿Qué haces cuando quieres ir rápido?", options: ["Walk", "Run", "Sleep", "Eat"], correct: 1, hint: "Mueves las piernas rápido.", image: null },
                    { question: "¿Qué haces cuando quieres ir lento?", options: ["Run", "Walk", "Sleep", "Eat"], correct: 1, hint: "Mueves las piernas despacio.", image: null },
                    { question: "¿Qué haces cuando quieres beber?", options: ["Eat", "Drink", "Sleep", "Play"], correct: 1, hint: "Pones líquido en la boca.", image: null },
                    { question: "¿Qué haces cuando quieres ver algo?", options: ["Hear", "See", "Touch", "Smell"], correct: 1, hint: "Usas los ojos.", image: null },
                    { question: "¿Qué haces cuando quieres escuchar?", options: ["See", "Hear", "Touch", "Smell"], correct: 1, hint: "Usas los oídos.", image: null },
                    { question: "¿Qué haces cuando quieres tocar algo?", options: ["See", "Hear", "Touch", "Smell"], correct: 2, hint: "Usas las manos.", image: null },
                    { question: "¿Qué haces cuando quieres oler?", options: ["See", "Hear", "Touch", "Smell"], correct: 3, hint: "Usas la nariz.", image: null },
                    { question: "¿Qué haces cuando quieres saltar?", options: ["Walk", "Run", "Jump", "Sleep"], correct: 2, hint: "Te levantas del suelo.", image: null },
                    { question: "¿Qué haces cuando quieres bailar?", options: ["Sleep", "Eat", "Dance", "Run"], correct: 2, hint: "Mueves el cuerpo con música.", image: null },
                    { question: "¿Qué haces cuando quieres cantar?", options: ["Speak", "Sing", "Eat", "Sleep"], correct: 1, hint: "Haces música con la voz.", image: null },
                    { question: "¿Qué haces cuando quieres hablar?", options: ["Sing", "Speak", "Eat", "Sleep"], correct: 1, hint: "Usas la boca para comunicarte.", image: null },
                    { question: "¿Qué haces cuando quieres reír?", options: ["Cry", "Laugh", "Sleep", "Eat"], correct: 1, hint: "Es cuando estás feliz.", image: null },
                    { question: "¿Qué haces cuando estás triste?", options: ["Laugh", "Cry", "Sleep", "Eat"], correct: 1, hint: "Salen lágrimas de los ojos.", image: null },
                    { question: "¿Qué haces cuando quieres abrazar?", options: ["Kick", "Hug", "Sleep", "Eat"], correct: 1, hint: "Usas los brazos para mostrar cariño.", image: null },
                    { question: "¿Qué haces cuando quieres besar?", options: ["Hug", "Kiss", "Sleep", "Eat"], correct: 1, hint: "Usas los labios para mostrar cariño.", image: null },
                    { question: "¿Qué haces cuando quieres saludar?", options: ["Wave", "Sleep", "Eat", "Run"], correct: 0, hint: "Mueves la mano.", image: null },
                    { question: "¿Qué haces cuando quieres aplaudir?", options: ["Wave", "Clap", "Sleep", "Eat"], correct: 1, hint: "Golpeas las manos juntas.", image: null },
                    { question: "¿Qué haces cuando quieres señalar?", options: ["Clap", "Point", "Sleep", "Eat"], correct: 1, hint: "Usas el dedo para indicar.", image: null },
                    { question: "¿Qué haces cuando quieres agarrar?", options: ["Point", "Hold", "Sleep", "Eat"], correct: 1, hint: "Usas las manos para tomar algo.", image: null },
                    { question: "¿Qué haces cuando quieres lanzar?", options: ["Hold", "Throw", "Sleep", "Eat"], correct: 1, hint: "Haces que algo vaya por el aire.", image: null },
                    { question: "¿Qué haces cuando quieres atrapar?", options: ["Throw", "Catch", "Sleep", "Eat"], correct: 1, hint: "Recibes algo que viene por el aire.", image: null },
                    { question: "¿Qué haces cuando quieres patear?", options: ["Catch", "Kick", "Sleep", "Eat"], correct: 1, hint: "Usas el pie para golpear.", image: null },
                    { question: "¿Qué haces cuando quieres nadar?", options: ["Kick", "Swim", "Sleep", "Eat"], correct: 1, hint: "Te mueves en el agua.", image: null },
                    { question: "¿Qué haces cuando quieres volar?", options: ["Swim", "Fly", "Sleep", "Eat"], correct: 1, hint: "Te mueves por el aire.", image: null },
                    { question: "¿Qué haces cuando quieres trepar?", options: ["Fly", "Climb", "Sleep", "Eat"], correct: 1, hint: "Subes por algo alto.", image: null },
                    { question: "¿Qué haces cuando quieres deslizar?", options: ["Climb", "Slide", "Sleep", "Eat"], correct: 1, hint: "Te deslizas por una superficie.", image: null },
                    { question: "¿Qué haces cuando quieres girar?", options: ["Slide", "Turn", "Sleep", "Eat"], correct: 1, hint: "Cambias de dirección.", image: null },
                    { question: "¿Qué haces cuando quieres parar?", options: ["Turn", "Stop", "Sleep", "Eat"], correct: 1, hint: "No te mueves más.", image: null },
                    { question: "¿Qué haces cuando quieres empezar?", options: ["Stop", "Start", "Sleep", "Eat"], correct: 1, hint: "Comienzas a hacer algo.", image: null },
                    { question: "¿Qué haces cuando quieres terminar?", options: ["Start", "Finish", "Sleep", "Eat"], correct: 1, hint: "Acabas de hacer algo.", image: null }
                ]
            '6-12': {
                1: [
                    { question: "¿Cómo se dice 'libro' en inglés?", options: ["Book", "Table", "Chair", "Pen"], correct: 0, hint: "Lo lees en la escuela.", image: null },
                    { question: "¿Cómo se dice 'casa' en inglés?", options: ["House", "Car", "Tree", "Dog"], correct: 0, hint: "Donde vives.", image: null },
                    { question: "¿Cómo se dice 'perro' en inglés?", options: ["Cat", "Dog", "Bird", "Fish"], correct: 1, hint: "El mejor amigo del hombre.", image: null },
                    { question: "¿Cómo se dice 'gato' en inglés?", options: ["Dog", "Cat", "Bird", "Fish"], correct: 1, hint: "Dice 'miau'.", image: null },
                    { question: "¿Cómo se dice 'agua' en inglés?", options: ["Food", "Water", "Milk", "Juice"], correct: 1, hint: "Es transparente.", image: null },
                    { question: "¿Cómo se dice 'pan' en inglés?", options: ["Rice", "Bread", "Meat", "Fish"], correct: 1, hint: "Se hace con harina.", image: null },
                    { question: "¿Cómo se dice 'leche' en inglés?", options: ["Water", "Milk", "Juice", "Coffee"], correct: 1, hint: "Es blanca y viene de las vacas.", image: null },
                    { question: "¿Cómo se dice 'manzana' en inglés?", options: ["Banana", "Apple", "Orange", "Grape"], correct: 1, hint: "Es roja o verde.", image: null },
                    { question: "¿Cómo se dice 'coche' en inglés?", options: ["Bike", "Car", "Bus", "Train"], correct: 1, hint: "Tiene cuatro ruedas.", image: null },
                    { question: "¿Cómo se dice 'árbol' en inglés?", options: ["Flower", "Tree", "Grass", "Bush"], correct: 1, hint: "Es alto y tiene hojas.", image: null },
                    { question: "¿Cómo se dice 'sol' en inglés?", options: ["Moon", "Sun", "Star", "Cloud"], correct: 1, hint: "Brilla en el día.", image: null },
                    { question: "¿Cómo se dice 'luna' en inglés?", options: ["Sun", "Moon", "Star", "Cloud"], correct: 1, hint: "Brilla en la noche.", image: null },
                    { question: "¿Cómo se dice 'estrella' en inglés?", options: ["Sun", "Moon", "Star", "Cloud"], correct: 2, hint: "Brilla en el cielo.", image: null },
                    { question: "¿Cómo se dice 'nube' en inglés?", options: ["Sun", "Moon", "Star", "Cloud"], correct: 3, hint: "Está en el cielo.", image: null },
                    { question: "¿Cómo se dice 'lluvia' en inglés?", options: ["Snow", "Rain", "Wind", "Storm"], correct: 1, hint: "Cae del cielo.", image: null },
                    { question: "¿Cómo se dice 'nieve' en inglés?", options: ["Rain", "Snow", "Wind", "Storm"], correct: 1, hint: "Es blanca y fría.", image: null },
                    { question: "¿Cómo se dice 'viento' en inglés?", options: ["Rain", "Snow", "Wind", "Storm"], correct: 2, hint: "Mueve las hojas.", image: null },
                    { question: "¿Cómo se dice 'tormenta' en inglés?", options: ["Rain", "Snow", "Wind", "Storm"], correct: 3, hint: "Tiene truenos y relámpagos.", image: null },
                    { question: "¿Cómo se dice 'flor' en inglés?", options: ["Tree", "Flower", "Grass", "Bush"], correct: 1, hint: "Es bonita y colorida.", image: null },
                    { question: "¿Cómo se dice 'hierba' en inglés?", options: ["Tree", "Flower", "Grass", "Bush"], correct: 2, hint: "Está en el suelo.", image: null },
                    { question: "¿Cómo se dice 'arbusto' en inglés?", options: ["Tree", "Flower", "Grass", "Bush"], correct: 3, hint: "Es pequeño y verde.", image: null },
                    { question: "¿Cómo se dice 'montaña' en inglés?", options: ["Hill", "Mountain", "Valley", "River"], correct: 1, hint: "Es muy alta.", image: null },
                    { question: "¿Cómo se dice 'río' en inglés?", options: ["Lake", "River", "Sea", "Ocean"], correct: 1, hint: "Tiene agua que fluye.", image: null },
                    { question: "¿Cómo se dice 'lago' en inglés?", options: ["River", "Lake", "Sea", "Ocean"], correct: 1, hint: "Es agua quieta.", image: null },
                    { question: "¿Cómo se dice 'mar' en inglés?", options: ["Lake", "River", "Sea", "Ocean"], correct: 2, hint: "Es agua salada.", image: null },
                    { question: "¿Cómo se dice 'océano' en inglés?", options: ["Lake", "River", "Sea", "Ocean"], correct: 3, hint: "Es muy grande.", image: null },
                    { question: "¿Cómo se dice 'playa' en inglés?", options: ["Beach", "Island", "Coast", "Shore"], correct: 0, hint: "Tiene arena.", image: null },
                    { question: "¿Cómo se dice 'isla' en inglés?", options: ["Beach", "Island", "Coast", "Shore"], correct: 1, hint: "Está rodeada de agua.", image: null },
                    { question: "¿Cómo se dice 'bosque' en inglés?", options: ["Jungle", "Forest", "Park", "Garden"], correct: 1, hint: "Tiene muchos árboles.", image: null },
                    { question: "¿Cómo se dice 'jardín' en inglés?", options: ["Park", "Garden", "Forest", "Jungle"], correct: 1, hint: "Tiene flores y plantas.", image: null },
                    { question: "¿Cómo se dice 'parque' en inglés?", options: ["Garden", "Park", "Forest", "Jungle"], correct: 1, hint: "Donde juegan los niños.", image: null }
                ],
                2: [
                    { question: "¿Cuál es el plural de 'child'?", options: ["Childs", "Childes", "Children", "Childrens"], correct: 2, hint: "Es una palabra irregular.", image: null },
                    { question: "¿Cuál es el plural de 'man'?", options: ["Mans", "Men", "Manes", "Mens"], correct: 1, hint: "Es una palabra irregular.", image: null },
                    { question: "¿Cuál es el plural de 'woman'?", options: ["Womans", "Women", "Womanes", "Womens"], correct: 1, hint: "Es una palabra irregular.", image: null },
                    { question: "¿Cuál es el plural de 'foot'?", options: ["Foots", "Feet", "Footes", "Feets"], correct: 1, hint: "Es una palabra irregular.", image: null },
                    { question: "¿Cuál es el plural de 'tooth'?", options: ["Tooths", "Teeth", "Toothes", "Teeths"], correct: 1, hint: "Es una palabra irregular.", image: null },
                    { question: "¿Cuál es el plural de 'mouse'?", options: ["Mouses", "Mice", "Mousees", "Mices"], correct: 1, hint: "Es una palabra irregular.", image: null },
                    { question: "¿Cuál es el plural de 'goose'?", options: ["Gooses", "Geese", "Goosees", "Geeses"], correct: 1, hint: "Es una palabra irregular.", image: null },
                    { question: "¿Cuál es el plural de 'person'?", options: ["Persons", "People", "Persones", "Peoples"], correct: 1, hint: "Es una palabra irregular.", image: null },
                    { question: "¿Cuál es el plural de 'fish'?", options: ["Fishs", "Fishes", "Fish", "Fishies"], correct: 2, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'sheep'?", options: ["Sheeps", "Sheepes", "Sheep", "Sheepies"], correct: 2, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'deer'?", options: ["Deers", "Deeres", "Deer", "Deeries"], correct: 2, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'aircraft'?", options: ["Aircrafts", "Aircraftes", "Aircraft", "Aircrafties"], correct: 2, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'series'?", options: ["Series", "Serieses", "Serie", "Seriess"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'species'?", options: ["Species", "Specieses", "Specie", "Speciess"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'means'?", options: ["Means", "Meanses", "Mean", "Meanies"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'headquarters'?", options: ["Headquarters", "Headquarterses", "Headquarter", "Headquarteries"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'news'?", options: ["News", "Newses", "New", "Newies"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'mathematics'?", options: ["Mathematics", "Mathematicss", "Mathematic", "Mathematicies"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'physics'?", options: ["Physics", "Physicss", "Physic", "Physicies"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'economics'?", options: ["Economics", "Economicss", "Economic", "Economicies"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'politics'?", options: ["Politics", "Politicss", "Politic", "Politicies"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'athletics'?", options: ["Athletics", "Athleticss", "Athletic", "Athleticies"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'gymnastics'?", options: ["Gymnastics", "Gymnasticss", "Gymnastic", "Gymnasticies"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'measles'?", options: ["Measles", "Measless", "Measle", "Measlies"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'mumps'?", options: ["Mumps", "Mumpss", "Mump", "Mumpies"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'shingles'?", options: ["Shingles", "Shingless", "Shingle", "Shinglies"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'rabies'?", options: ["Rabies", "Rabiess", "Rabie", "Rabieses"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'diabetes'?", options: ["Diabetes", "Diabetess", "Diabete", "Diabeteses"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'arthritis'?", options: ["Arthritis", "Arthritiss", "Arthriti", "Arthritises"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'bronchitis'?", options: ["Bronchitis", "Bronchitiss", "Bronchiti", "Bronchitises"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null },
                    { question: "¿Cuál es el plural de 'appendicitis'?", options: ["Appendicitis", "Appendicitiss", "Appendiciti", "Appendicitises"], correct: 0, hint: "Puede ser igual en singular y plural.", image: null }
                ],
                3: [
                    { question: "¿Cómo se dice 'comer' en inglés?", options: ["Eat", "Run", "Play", "Sleep"], correct: 0, hint: "Lo haces cuando tienes hambre.", image: null },
                    { question: "¿Cómo se dice 'beber' en inglés?", options: ["Eat", "Drink", "Play", "Sleep"], correct: 1, hint: "Lo haces cuando tienes sed.", image: null },
                    { question: "¿Cómo se dice 'dormir' en inglés?", options: ["Eat", "Drink", "Sleep", "Play"], correct: 2, hint: "Lo haces cuando tienes sueño.", image: null },
                    { question: "¿Cómo se dice 'jugar' en inglés?", options: ["Eat", "Drink", "Sleep", "Play"], correct: 3, hint: "Lo haces cuando quieres divertirte.", image: null },
                    { question: "¿Cómo se dice 'correr' en inglés?", options: ["Walk", "Run", "Sleep", "Play"], correct: 1, hint: "Lo haces cuando quieres ir rápido.", image: null },
                    { question: "¿Cómo se dice 'caminar' en inglés?", options: ["Run", "Walk", "Sleep", "Play"], correct: 1, hint: "Lo haces cuando quieres ir lento.", image: null },
                    { question: "¿Cómo se dice 'saltar' en inglés?", options: ["Walk", "Run", "Jump", "Sleep"], correct: 2, hint: "Te levantas del suelo.", image: null },
                    { question: "¿Cómo se dice 'bailar' en inglés?", options: ["Sleep", "Eat", "Dance", "Run"], correct: 2, hint: "Mueves el cuerpo con música.", image: null },
                    { question: "¿Cómo se dice 'cantar' en inglés?", options: ["Speak", "Sing", "Eat", "Sleep"], correct: 1, hint: "Haces música con la voz.", image: null },
                    { question: "¿Cómo se dice 'hablar' en inglés?", options: ["Sing", "Speak", "Eat", "Sleep"], correct: 1, hint: "Usas la boca para comunicarte.", image: null },
                    { question: "¿Cómo se dice 'reír' en inglés?", options: ["Cry", "Laugh", "Sleep", "Eat"], correct: 1, hint: "Es cuando estás feliz.", image: null },
                    { question: "¿Cómo se dice 'llorar' en inglés?", options: ["Laugh", "Cry", "Sleep", "Eat"], correct: 1, hint: "Salen lágrimas de los ojos.", image: null },
                    { question: "¿Cómo se dice 'abrazar' en inglés?", options: ["Kick", "Hug", "Sleep", "Eat"], correct: 1, hint: "Usas los brazos para mostrar cariño.", image: null },
                    { question: "¿Cómo se dice 'besar' en inglés?", options: ["Hug", "Kiss", "Sleep", "Eat"], correct: 1, hint: "Usas los labios para mostrar cariño.", image: null },
                    { question: "¿Cómo se dice 'saludar' en inglés?", options: ["Wave", "Sleep", "Eat", "Run"], correct: 0, hint: "Mueves la mano.", image: null },
                    { question: "¿Cómo se dice 'aplaudir' en inglés?", options: ["Wave", "Clap", "Sleep", "Eat"], correct: 1, hint: "Golpeas las manos juntas.", image: null },
                    { question: "¿Cómo se dice 'señalar' en inglés?", options: ["Clap", "Point", "Sleep", "Eat"], correct: 1, hint: "Usas el dedo para indicar.", image: null },
                    { question: "¿Cómo se dice 'agarrar' en inglés?", options: ["Point", "Hold", "Sleep", "Eat"], correct: 1, hint: "Usas las manos para tomar algo.", image: null },
                    { question: "¿Cómo se dice 'lanzar' en inglés?", options: ["Hold", "Throw", "Sleep", "Eat"], correct: 1, hint: "Haces que algo vaya por el aire.", image: null },
                    { question: "¿Cómo se dice 'atrapar' en inglés?", options: ["Throw", "Catch", "Sleep", "Eat"], correct: 1, hint: "Recibes algo que viene por el aire.", image: null },
                    { question: "¿Cómo se dice 'patear' en inglés?", options: ["Catch", "Kick", "Sleep", "Eat"], correct: 1, hint: "Usas el pie para golpear.", image: null },
                    { question: "¿Cómo se dice 'nadar' en inglés?", options: ["Kick", "Swim", "Sleep", "Eat"], correct: 1, hint: "Te mueves en el agua.", image: null },
                    { question: "¿Cómo se dice 'volar' en inglés?", options: ["Swim", "Fly", "Sleep", "Eat"], correct: 1, hint: "Te mueves por el aire.", image: null },
                    { question: "¿Cómo se dice 'trepar' en inglés?", options: ["Fly", "Climb", "Sleep", "Eat"], correct: 1, hint: "Subes por algo alto.", image: null },
                    { question: "¿Cómo se dice 'deslizar' en inglés?", options: ["Climb", "Slide", "Sleep", "Eat"], correct: 1, hint: "Te deslizas por una superficie.", image: null },
                    { question: "¿Cómo se dice 'girar' en inglés?", options: ["Slide", "Turn", "Sleep", "Eat"], correct: 1, hint: "Cambias de dirección.", image: null },
                    { question: "¿Cómo se dice 'parar' en inglés?", options: ["Turn", "Stop", "Sleep", "Eat"], correct: 1, hint: "No te mueves más.", image: null },
                    { question: "¿Cómo se dice 'empezar' en inglés?", options: ["Stop", "Start", "Sleep", "Eat"], correct: 1, hint: "Comienzas a hacer algo.", image: null },
                    { question: "¿Cómo se dice 'terminar' en inglés?", options: ["Start", "Finish", "Sleep", "Eat"], correct: 1, hint: "Acabas de hacer algo.", image: null },
                    { question: "¿Cómo se dice 'abrir' en inglés?", options: ["Close", "Open", "Sleep", "Eat"], correct: 1, hint: "Lo contrario de cerrar.", image: null },
                    { question: "¿Cómo se dice 'cerrar' en inglés?", options: ["Open", "Close", "Sleep", "Eat"], correct: 1, hint: "Lo contrario de abrir.", image: null }
                ]
            '12-18': {
                1: [
                    { question: "Completa: 'She ___ to the gym every day.'", options: ["go", "goes", "going", "gone"], correct: 1, hint: "Presente simple, tercera persona.", image: null },
                    { question: "Completa: 'I ___ English every day.'", options: ["study", "studies", "studying", "studied"], correct: 0, hint: "Presente simple, primera persona.", image: null },
                    { question: "Completa: 'They ___ soccer on weekends.'", options: ["play", "plays", "playing", "played"], correct: 0, hint: "Presente simple, tercera persona plural.", image: null },
                    { question: "Completa: 'He ___ TV every evening.'", options: ["watch", "watches", "watching", "watched"], correct: 1, hint: "Presente simple, tercera persona.", image: null },
                    { question: "Completa: 'We ___ dinner at 8 PM.'", options: ["have", "has", "having", "had"], correct: 0, hint: "Presente simple, primera persona plural.", image: null },
                    { question: "Completa: 'She ___ her homework after school.'", options: ["do", "does", "doing", "did"], correct: 1, hint: "Presente simple, tercera persona.", image: null },
                    { question: "Completa: 'I ___ to music while I work.'", options: ["listen", "listens", "listening", "listened"], correct: 0, hint: "Presente simple, primera persona.", image: null },
                    { question: "Completa: 'He ___ a car to work.'", options: ["drive", "drives", "driving", "drove"], correct: 1, hint: "Presente simple, tercera persona.", image: null },
                    { question: "Completa: 'They ___ in a big house.'", options: ["live", "lives", "living", "lived"], correct: 0, hint: "Presente simple, tercera persona plural.", image: null },
                    { question: "Completa: 'She ___ coffee every morning.'", options: ["drink", "drinks", "drinking", "drank"], correct: 1, hint: "Presente simple, tercera persona.", image: null },
                    { question: "Completa: 'I ___ books in my free time.'", options: ["read", "reads", "reading", "read"], correct: 0, hint: "Presente simple, primera persona.", image: null },
                    { question: "Completa: 'He ___ basketball twice a week.'", options: ["play", "plays", "playing", "played"], correct: 1, hint: "Presente simple, tercera persona.", image: null },
                    { question: "Completa: 'We ___ to the movies on Fridays.'", options: ["go", "goes", "going", "went"], correct: 0, hint: "Presente simple, primera persona plural.", image: null },
                    { question: "Completa: 'She ___ French at university.'", options: ["study", "studies", "studying", "studied"], correct: 1, hint: "Presente simple, tercera persona.", image: null },
                    { question: "Completa: 'They ___ dinner together.'", options: ["cook", "cooks", "cooking", "cooked"], correct: 0, hint: "Presente simple, tercera persona plural.", image: null },
                    { question: "Completa: 'I ___ my teeth twice a day.'", options: ["brush", "brushes", "brushing", "brushed"], correct: 0, hint: "Presente simple, primera persona.", image: null },
                    { question: "Completa: 'He ___ the newspaper every morning.'", options: ["read", "reads", "reading", "read"], correct: 1, hint: "Presente simple, tercera persona.", image: null },
                    { question: "Completa: 'We ___ English in class.'", options: ["speak", "speaks", "speaking", "spoke"], correct: 0, hint: "Presente simple, primera persona plural.", image: null },
                    { question: "Completa: 'She ___ her room every weekend.'", options: ["clean", "cleans", "cleaning", "cleaned"], correct: 1, hint: "Presente simple, tercera persona.", image: null },
                    { question: "Completa: 'They ___ to the beach in summer.'", options: ["go", "goes", "going", "went"], correct: 0, hint: "Presente simple, tercera persona plural.", image: null },
                    { question: "Completa: 'I ___ my keys on the table.'", options: ["leave", "leaves", "leaving", "left"], correct: 0, hint: "Presente simple, primera persona.", image: null },
                    { question: "Completa: 'He ___ his phone at home.'", options: ["forget", "forgets", "forgetting", "forgot"], correct: 1, hint: "Presente simple, tercera persona.", image: null },
                    { question: "Completa: 'We ___ our homework on time.'", options: ["finish", "finishes", "finishing", "finished"], correct: 0, hint: "Presente simple, primera persona plural.", image: null },
                    { question: "Completa: 'She ___ her friends every day.'", options: ["call", "calls", "calling", "called"], correct: 1, hint: "Presente simple, tercera persona.", image: null },
                    { question: "Completa: 'They ___ the bus to school.'", options: ["take", "takes", "taking", "took"], correct: 0, hint: "Presente simple, tercera persona plural.", image: null },
                    { question: "Completa: 'I ___ my bed every morning.'", options: ["make", "makes", "making", "made"], correct: 0, hint: "Presente simple, primera persona.", image: null },
                    { question: "Completa: 'He ___ his shoes before entering.'", options: ["take off", "takes off", "taking off", "took off"], correct: 1, hint: "Presente simple, tercera persona.", image: null },
                    { question: "Completa: 'We ___ our hands before eating.'", options: ["wash", "washes", "washing", "washed"], correct: 0, hint: "Presente simple, primera persona plural.", image: null },
                    { question: "Completa: 'She ___ her hair every morning.'", options: ["brush", "brushes", "brushing", "brushed"], correct: 1, hint: "Presente simple, tercera persona.", image: null },
                    { question: "Completa: 'They ___ their clothes in the closet.'", options: ["put", "puts", "putting", "put"], correct: 0, hint: "Presente simple, tercera persona plural.", image: null },
                    { question: "Completa: 'I ___ my computer at night.'", options: ["turn off", "turns off", "turning off", "turned off"], correct: 0, hint: "Presente simple, primera persona.", image: null },
                    { question: "Completa: 'He ___ the lights when he leaves.'", options: ["turn off", "turns off", "turning off", "turned off"], correct: 1, hint: "Presente simple, tercera persona.", image: null }
                ],
                2: [
                    { question: "¿Cuál es el pasado de 'see'?", options: ["Seed", "Saw", "Seen", "Sees"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'go'?", options: ["Goed", "Went", "Gone", "Goes"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'come'?", options: ["Comed", "Came", "Come", "Comes"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'take'?", options: ["Taked", "Took", "Taken", "Takes"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'give'?", options: ["Gived", "Gave", "Given", "Gives"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'get'?", options: ["Getted", "Got", "Gotten", "Gets"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'make'?", options: ["Maked", "Made", "Made", "Makes"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'know'?", options: ["Knowed", "Knew", "Known", "Knows"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'think'?", options: ["Thinked", "Thought", "Thought", "Thinks"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'find'?", options: ["Finded", "Found", "Found", "Finds"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'tell'?", options: ["Telled", "Told", "Told", "Tells"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'say'?", options: ["Sayed", "Said", "Said", "Says"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'feel'?", options: ["Feeled", "Felt", "Felt", "Feels"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'keep'?", options: ["Keeped", "Kept", "Kept", "Keeps"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'leave'?", options: ["Leaved", "Left", "Left", "Leaves"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'put'?", options: ["Puted", "Put", "Put", "Puts"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'bring'?", options: ["Bringed", "Brought", "Brought", "Brings"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'buy'?", options: ["Buyed", "Bought", "Bought", "Buys"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'sell'?", options: ["Selled", "Sold", "Sold", "Sells"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'catch'?", options: ["Catched", "Caught", "Caught", "Catches"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'teach'?", options: ["Teached", "Taught", "Taught", "Teaches"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'learn'?", options: ["Learned", "Learnt", "Learnt", "Learns"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'build'?", options: ["Builded", "Built", "Built", "Builds"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'send'?", options: ["Sended", "Sent", "Sent", "Sends"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'spend'?", options: ["Spended", "Spent", "Spent", "Spends"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'lend'?", options: ["Lended", "Lent", "Lent", "Lends"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'bend'?", options: ["Bended", "Bent", "Bent", "Bends"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'send'?", options: ["Sended", "Sent", "Sent", "Sends"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'meet'?", options: ["Meeted", "Met", "Met", "Meets"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'eat'?", options: ["Eated", "Ate", "Eaten", "Eats"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'drink'?", options: ["Drinked", "Drank", "Drunk", "Drinks"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'write'?", options: ["Writed", "Wrote", "Written", "Writes"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'read'?", options: ["Readed", "Read", "Read", "Reads"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'run'?", options: ["Runned", "Ran", "Run", "Runs"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'swim'?", options: ["Swimed", "Swam", "Swum", "Swims"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'fly'?", options: ["Flyed", "Flew", "Flown", "Flies"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'drive'?", options: ["Drived", "Drove", "Driven", "Drives"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'ride'?", options: ["Rided", "Rode", "Ridden", "Rides"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'speak'?", options: ["Speaked", "Spoke", "Spoken", "Speaks"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'break'?", options: ["Breaked", "Broke", "Broken", "Breaks"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'choose'?", options: ["Choosed", "Chose", "Chosen", "Chooses"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'freeze'?", options: ["Freezed", "Froze", "Frozen", "Freezes"], correct: 1, hint: "Verbo irregular.", image: null },
                    { question: "¿Cuál es el pasado de 'wake'?", options: ["Waked", "Woke", "Woken", "Wakes"], correct: 1, hint: "Verbo irregular.", image: null }
                ],
                3: [
                    { question: "¿Cómo se dice 'lograr' en inglés?", options: ["Achieve", "Arrive", "Allow", "Answer"], correct: 0, hint: "Empieza con 'A'.", image: null },
                    { question: "¿Cómo se dice 'desarrollar' en inglés?", options: ["Design", "Develop", "Discover", "Discuss"], correct: 1, hint: "Empieza con 'D'.", image: null },
                    { question: "¿Cómo se dice 'mejorar' en inglés?", options: ["Improve", "Include", "Increase", "Indicate"], correct: 0, hint: "Empieza con 'I'.", image: null },
                    { question: "¿Cómo se dice 'mantener' en inglés?", options: ["Maintain", "Manage", "Measure", "Meet"], correct: 0, hint: "Empieza con 'M'.", image: null },
                    { question: "¿Cómo se dice 'proporcionar' en inglés?", options: ["Provide", "Prove", "Protect", "Produce"], correct: 0, hint: "Empieza con 'P'.", image: null },
                    { question: "¿Cómo se dice 'reducir' en inglés?", options: ["Reduce", "Receive", "Record", "Report"], correct: 0, hint: "Empieza con 'R'.", image: null },
                    { question: "¿Cómo se dice 'sugerir' en inglés?", options: ["Suggest", "Support", "Supply", "Survey"], correct: 0, hint: "Empieza con 'S'.", image: null },
                    { question: "¿Cómo se dice 'considerar' en inglés?", options: ["Consider", "Continue", "Control", "Create"], correct: 0, hint: "Empieza con 'C'.", image: null },
                    { question: "¿Cómo se dice 'determinar' en inglés?", options: ["Determine", "Describe", "Design", "Develop"], correct: 0, hint: "Empieza con 'D'.", image: null },
                    { question: "¿Cómo se dice 'establecer' en inglés?", options: ["Establish", "Explain", "Express", "Expect"], correct: 0, hint: "Empieza con 'E'.", image: null },
                    { question: "¿Cómo se dice 'identificar' en inglés?", options: ["Identify", "Improve", "Include", "Indicate"], correct: 0, hint: "Empieza con 'I'.", image: null },
                    { question: "¿Cómo se dice 'localizar' en inglés?", options: ["Locate", "Learn", "Leave", "Like"], correct: 0, hint: "Empieza con 'L'.", image: null },
                    { question: "¿Cómo se dice 'observar' en inglés?", options: ["Observe", "Obtain", "Occur", "Offer"], correct: 0, hint: "Empieza con 'O'.", image: null },
                    { question: "¿Cómo se dice 'preparar' en inglés?", options: ["Prepare", "Provide", "Prove", "Protect"], correct: 0, hint: "Empieza con 'P'.", image: null },
                    { question: "¿Cómo se dice 'reconocer' en inglés?", options: ["Recognize", "Receive", "Record", "Reduce"], correct: 0, hint: "Empieza con 'R'.", image: null },
                    { question: "¿Cómo se dice 'representar' en inglés?", options: ["Represent", "Require", "Research", "Return"], correct: 0, hint: "Empieza con 'R'.", image: null },
                    { question: "¿Cómo se dice 'seleccionar' en inglés?", options: ["Select", "Serve", "Show", "Start"], correct: 0, hint: "Empieza con 'S'.", image: null },
                    { question: "¿Cómo se dice 'separar' en inglés?", options: ["Separate", "Serve", "Show", "Start"], correct: 0, hint: "Empieza con 'S'.", image: null },
                    { question: "¿Cómo se dice 'simplificar' en inglés?", options: ["Simplify", "Solve", "Speak", "Start"], correct: 0, hint: "Empieza con 'S'.", image: null },
                    { question: "¿Cómo se dice 'situar' en inglés?", options: ["Situate", "Solve", "Speak", "Start"], correct: 0, hint: "Empieza con 'S'.", image: null },
                    { question: "¿Cómo se dice 'solicitar' en inglés?", options: ["Request", "Require", "Research", "Return"], correct: 0, hint: "Empieza con 'R'.", image: null },
                    { question: "¿Cómo se dice 'someter' en inglés?", options: ["Submit", "Suggest", "Support", "Supply"], correct: 0, hint: "Empieza con 'S'.", image: null },
                    { question: "¿Cómo se dice 'sostener' en inglés?", options: ["Support", "Suggest", "Supply", "Survey"], correct: 0, hint: "Empieza con 'S'.", image: null },
                    { question: "¿Cómo se dice 'sufrir' en inglés?", options: ["Suffer", "Suggest", "Support", "Supply"], correct: 0, hint: "Empieza con 'S'.", image: null },
                    { question: "¿Cómo se dice 'suministrar' en inglés?", options: ["Supply", "Suggest", "Support", "Survey"], correct: 0, hint: "Empieza con 'S'.", image: null },
                    { question: "¿Cómo se dice 'superar' en inglés?", options: ["Overcome", "Observe", "Obtain", "Occur"], correct: 0, hint: "Empieza con 'O'.", image: null },
                    { question: "¿Cómo se dice 'sustituir' en inglés?", options: ["Substitute", "Submit", "Suggest", "Support"], correct: 0, hint: "Empieza con 'S'.", image: null },
                    { question: "¿Cómo se dice 'transformar' en inglés?", options: ["Transform", "Translate", "Travel", "Treat"], correct: 0, hint: "Empieza con 'T'.", image: null },
                    { question: "¿Cómo se dice 'utilizar' en inglés?", options: ["Use", "Understand", "Underline", "Update"], correct: 0, hint: "Empieza con 'U'.", image: null },
                    { question: "¿Cómo se dice 'valorar' en inglés?", options: ["Value", "Visit", "View", "Voice"], correct: 0, hint: "Empieza con 'V'.", image: null },
                    { question: "¿Cómo se dice 'verificar' en inglés?", options: ["Verify", "Visit", "View", "Voice"], correct: 0, hint: "Empieza con 'V'.", image: null },
                    { question: "¿Cómo se dice 'visualizar' en inglés?", options: ["Visualize", "Visit", "View", "Voice"], correct: 0, hint: "Empieza con 'V'.", image: null },
                    { question: "¿Cómo se dice 'vulnerable' en inglés?", options: ["Vulnerable", "Valuable", "Various", "Visible"], correct: 0, hint: "Empieza con 'V'.", image: null }
                ]

        return questions[ageGroup] && questions[ageGroup][level] ? questions[ageGroup][level] : [];
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
            '3-6': {
                1: "Colores y Animales",
                2: "Frutas y Objetos",
                3: "Acciones Básicas"
            },
            '6-12': {
                1: "Vocabulario Escolar",
                2: "Gramática Básica",
                3: "Verbos y Acciones"
            },
            '12-18': {
                1: "Gramática Intermedia",
                2: "Tiempos Verbales",
                3: "Vocabulario Avanzado"
            }
        };
        const descriptions = {
            '3-6': {
                1: "Aprende colores y animales con imágenes.",
                2: "Identifica frutas y objetos cotidianos.",
                3: "Acciones simples para los más pequeños."
            },
            '6-12': {
                1: "Palabras útiles para la escuela.",
                2: "Reglas básicas de gramática.",
                3: "Verbos comunes y su uso."
            },
            '12-18': {
                1: "Gramática para secundaria.",
                2: "Domina los tiempos verbales.",
                3: "Palabras y expresiones avanzadas."
            }
        };
        const group = this.ageGroup;
        const lvl = this.currentLevel;
        document.getElementById('level-title').textContent = titles[group][lvl] || `Nivel ${lvl}`;
        document.getElementById('level-description').textContent = descriptions[group][lvl] || '';
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

        // Asegurar que el botón de audio esté visible
        const audioContainer = document.getElementById('audio-container');
        const audioBtn = document.getElementById('audio-btn');
        
        if (audioContainer) {
            audioContainer.style.display = 'block';
            audioContainer.style.visibility = 'visible';
            audioContainer.style.opacity = '1';
        }
        
        if (audioBtn) {
            audioBtn.style.display = 'block';
            audioBtn.style.visibility = 'visible';
            audioBtn.style.opacity = '1';
        }

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
        
        // Keep audio button visible for 3-6 age group
        const audioBtn = document.getElementById('audio-btn');
        if (this.ageGroup === '3-6') {
            audioBtn.style.display = 'inline-block';
        }
        
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

    playQuestionAudio() {
        const question = this.questions[this.currentQuestionIndex];
        const audioBtn = document.getElementById('audio-btn');
        
        if (!audioBtn) {
            alert('Error: No se encontró el botón de audio');
            return;
        }
        
        // Check if speech synthesis is supported
        if ('speechSynthesis' in window) {
            // Stop any current speech
            window.speechSynthesis.cancel();
            
            // Create speech utterance
            const utterance = new SpeechSynthesisUtterance(question.question);
            utterance.lang = 'es-ES'; // Spanish
            utterance.rate = 0.8; // Slightly slower for children
            utterance.pitch = 1.1; // Slightly higher pitch for children
            
            // Add visual feedback
            audioBtn.style.background = '#00b894';
            audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i> 🔴 REPRODUCIENDO 🔴';
            
            // Handle speech end
            utterance.onend = () => {
                audioBtn.style.background = 'red';
                audioBtn.innerHTML = '<i class="fas fa-volume-up"></i> 🎵 ESCUCHAR 🎵';
            };
            
            utterance.onerror = (event) => {
                audioBtn.style.background = 'red';
                audioBtn.innerHTML = '<i class="fas fa-volume-up"></i> 🎵 ESCUCHAR 🎵';
                alert('Error al reproducir audio: ' + event.error);
            };
            
            // Start speaking
            window.speechSynthesis.speak(utterance);
        } else {
            // Fallback for browsers without speech synthesis
            alert('Tu navegador no soporta la función de audio. La pregunta es: ' + question.question);
        }
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

    loadDarkMode() {
        const saved = localStorage.getItem('englishAdventureDarkMode');
        if (saved === 'true') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    toggleDarkMode() {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('englishAdventureDarkMode', isDark ? 'true' : 'false');
        // Animación de la huella
        const pawIcon = document.querySelector('#dark-mode-toggle i');
        if (pawIcon) {
            pawIcon.style.transform = 'rotate(360deg) scale(1.2)';
            setTimeout(() => {
                pawIcon.style.transform = '';
            }, 300);
        }
    }


}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EnglishAdventureGame();
}); 