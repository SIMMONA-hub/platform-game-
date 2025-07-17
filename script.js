// Game state
let currentScreen = 'start';
let currentSlide = 0;
let isTyping = false;

// Character control
let rasulPosition = { x: 50, y: 8, velocityY: 0, isJumping: false };
let keysPressed = {};
let isInteractiveScene = false;

// Story text for Rasul's adventure
const storyTexts = [
    "In the heart of N Factorial incubator, there lived a determined student named Rasul...\n\nHe had been working day and night on his revolutionary project for Demo Day.\n\nHis laptop was his trusted companion, filled with countless lines of code and dreams of success.",
    
    "But fate had other plans...\n\nJust hours before the final Demo Day presentation, disaster struck!\n\n*CRACK* 💻⚡\n\nRasul's laptop screen went black. All his hard work seemed lost in an instant.",
    
    "Standing in the N Factorial corridors, Rasul faced a choice:\n\nGive up on his dreams... OR...\n\nRUN! Run from the incubator and find a way to save Demo Day!\n\nWith determination in his heart, he chose to RUN! 🏃‍♂️💨",
    
    "Help Rasul escape from N Factorial incubator!\n\nCollect 🟢 commits to rebuild his project\nAvoid ❌ bugs that slow him down\nDodge 🔥 burnout that could stop him\nGrab ⚡ mentor hints for power boosts!\n\nReach Demo Day and save his presentation!"
];

// Removed game variables - no longer needed

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    showScreen('start');
    setupEventListeners();
});

function setupEventListeners() {
    // Click/touch events for screen transitions
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Touch events for mobile
    document.addEventListener('touchstart', function(e) {
        e.preventDefault();
        handleClick(e);
    });
}

function handleClick(e) {
    if (currentScreen === 'start') {
        createFallingItems(e);
        // Delay story start to show the falling effect
        setTimeout(() => {
            startStory();
        }, 300);
    } else if (currentScreen === 'story' && !isTyping) {
        nextSlide();
    } else if (currentScreen === 'end') {
        // Restart the story
        currentScreen = 'start';
        showScreen('start');
    }
}

function handleKeyDown(e) {
    // Character controls in interactive scene
    if (isInteractiveScene) {
        if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
            e.preventDefault();
            keysPressed[e.code] = true;
        } else if (e.code === 'Space') {
            e.preventDefault();
            jumpRasul();
        }
        return;
    }
    
    // Regular navigation
    if (e.code === 'Space') {
        e.preventDefault();
        if (currentScreen === 'story' && !isTyping) {
            nextSlide();
        } else if (currentScreen === 'start') {
            createFallingItems();
            setTimeout(() => {
                startStory();
            }, 300);
        } else if (currentScreen === 'end') {
            // Restart the story
            currentScreen = 'start';
            showScreen('start');
        }
    } else if (e.code === 'Escape' && currentScreen === 'story') {
        e.preventDefault();
        skipStory();
    }
}

function handleKeyUp(e) {
    if (isInteractiveScene) {
        if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
            keysPressed[e.code] = false;
        }
    }
}

function createFallingItems(clickEvent) {
    const stickers = ['💻', '⚡', '🔥', '🟢', '❌', '🚀', '💡', '🎯', '⭐', '🎮', '🔧', '📱', '⌨️', '🖱️', '💾'];
    const numItems = Math.random() * 8 + 5; // 5-12 items
    
    for (let i = 0; i < numItems; i++) {
        const item = document.createElement('div');
        item.className = 'falling-item';
        item.textContent = stickers[Math.floor(Math.random() * stickers.length)];
        
        // Random horizontal position
        item.style.left = Math.random() * window.innerWidth + 'px';
        
        // Random animation duration (2-4 seconds)
        item.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        // Random delay for more natural effect
        item.style.animationDelay = Math.random() * 0.5 + 's';
        
        document.getElementById('startScreen').appendChild(item);
        
        // Remove the item after animation
        setTimeout(() => {
            if (item.parentNode) {
                item.parentNode.removeChild(item);
            }
        }, 5000);
    }
}

function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.getElementById(screenName + 'Screen').classList.add('active');
    currentScreen = screenName;
}

function startStory() {
    showScreen('story');
    currentSlide = 0;
    showSlide(0);
}

function showSlide(slideIndex) {
    // Hide all slides
    document.querySelectorAll('.story-slide').forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    const slide = document.getElementById(`slide${slideIndex + 1}`);
    slide.classList.add('active');
    
    // Start typewriter effect
    const textElement = document.getElementById(`storyText${slideIndex + 1}`);
    typewriterEffect(textElement, storyTexts[slideIndex]);
}

function typewriterEffect(element, text) {
    isTyping = true;
    element.textContent = '';
    let i = 0;
    
    function typeChar() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, 50); // Adjust speed here
        } else {
            isTyping = false;
        }
    }
    
    typeChar();
}

function nextSlide() {
    currentSlide++;
    if (currentSlide >= storyTexts.length) {
        startScenes();
    } else {
        showSlide(currentSlide);
    }
}

function startScenes() {
    console.log('Starting scenes...');
    // Scene 1: image.gif for 3 seconds
    showScreen('scene1');
    
    setTimeout(() => {
        console.log('Scene 2 starting...');
        // Scene 2: image(2).gif for 3 seconds
        showScreen('scene2');
        
        setTimeout(() => {
            console.log('Scene 3 starting (DEMO DAY)...');
            // Scene 3: dm.jpg with shock animation for 2 seconds
            showScreen('scene3');
            
            setTimeout(() => {
                console.log('Scene 4 starting (interactive scene)...');
                // Scene 4: Interactive scene with Rasul character (бесконечно)
                showScreen('scene4');
                startInteractiveScene();
                // Через 7 секунд появляется Бахредин
                setTimeout(() => {
                    stopInteractiveScene();
                    startBakhredinScene();
                }, 7000);
            }, 2000); // 2 seconds for dm.jpg
        }, 3000); // 3 seconds for image(2).gif
    }, 3000); // 3 seconds for image.gif
}

function startBakhredinScene() {
    showScreen('scene5');
    const dialog = [
        'Ты что уходишь рано? Других не знаю, но мои ментики остаются даже до 6!'
    ];
    typeDialogText(document.getElementById('bakhredinDialog'), dialog[0]);
}

function typeDialogText(element, text, speed = 35) {
    element.textContent = '';
    let i = 0;
    function typeChar() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, speed);
        }
    }
    typeChar();
}

function showEndScreen() {
    showScreen('end');
}

function skipStory() {
    startScenes();
}

function updateRasulPosition() {
    const rasul = document.getElementById('rasulCharacter');
    if (!rasul || !isInteractiveScene) return;
    
    // Handle horizontal movement - более быстрое и отзывчивое движение
    if (keysPressed['ArrowLeft'] && rasulPosition.x > 5) {
        rasulPosition.x -= 2.5;
    }
    if (keysPressed['ArrowRight'] && rasulPosition.x < 95) {
        rasulPosition.x += 2.5;
    }
    
    // Handle jumping physics - более приземленный прыжок
    if (rasulPosition.isJumping) {
        rasulPosition.y += rasulPosition.velocityY;
        rasulPosition.velocityY -= 1.2; // более сильная гравитация
        
        // Ground collision
        if (rasulPosition.y <= 8) {
            rasulPosition.y = 8;
            rasulPosition.velocityY = 0;
            rasulPosition.isJumping = false;
        }
    }
    
    // Apply position to character
    rasul.style.left = rasulPosition.x + '%';
    rasul.style.bottom = rasulPosition.y + '%';
}

function jumpRasul() {
    if (!rasulPosition.isJumping && isInteractiveScene) {
        rasulPosition.velocityY = 8; // более низкий прыжок
        rasulPosition.isJumping = true;
    }
}

function startInteractiveScene() {
    isInteractiveScene = true;
    rasulPosition = { x: 50, y: 8, velocityY: 0, isJumping: false };
    
    // Reset keys
    keysPressed = {};
    
    // Start animation loop
    function animateRasul() {
        if (isInteractiveScene) {
            updateRasulPosition();
            requestAnimationFrame(animateRasul);
        }
    }
    animateRasul();
}

function stopInteractiveScene() {
    isInteractiveScene = false;
}

// Game functions removed - no longer needed 