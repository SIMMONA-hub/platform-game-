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

let bakhredinDialogLines = [
    'Ты что уходишь рано? Других не знаю, но мои ментики остаются даже до 6!',
    'Я всю ночь кодил, мне бы домой хоть немного поспать...',
    'Настоящие стартаперы не спят! Ты хочешь успеха или нет?',
    'Я хочу, чтобы мой проект работал, а не чтобы я выгорел!',
    'Выгоришь — значит не твое! Мои ментики не сдаются!'
];
let bakhredinDialogIndex = 0;
let bakhredinTyping = false;

// Управление Расулом в сцене с Бахредином
let bakhredinRasulPos = { x: 5, y: 2, velocityY: 0, isJumping: false };
let bakhredinKeys = {};
let bakhredinAttackActive = false;

function startBakhredinScene() {
    showScreen('scene5');
    bakhredinDialogIndex = 0;
    showBakhredinDialogLine();
    document.getElementById('scene5Screen').onclick = nextBakhredinDialog;
    // Управление: инициализировать только если еще не было
    if (!window._bakhredinSceneStarted) {
        bakhredinRasulPos = { x: 5, y: 2, velocityY: 0, isJumping: false };
        bakhredinAttackActive = false;
        bakhredinKeys = {};
        updateBakhredinRasulPosition();
        window.addEventListener('keydown', bakhredinKeyDown);
        window.addEventListener('keyup', bakhredinKeyUp);
        animateBakhredinRasul();
        window._bakhredinSceneStarted = true;
    }
}

function showBakhredinDialogLine() {
    const dialogBox = document.getElementById('bakhredinDialog');
    dialogBox.textContent = '';
    bakhredinTyping = true;
    typeDialogText(dialogBox, bakhredinDialogLines[bakhredinDialogIndex], 35, () => {
        bakhredinTyping = false;
    });
}

function nextBakhredinDialog() {
    if (bakhredinTyping) return;
    bakhredinDialogIndex++;
    if (bakhredinDialogIndex < bakhredinDialogLines.length) {
        showBakhredinDialogLine();
    } else {
        // Диалог окончен, можно добавить переход к следующей сцене или действию
        // Например: showEndScreen();
    }
}

function typeDialogText(element, text, speed = 35, onDone) {
    element.textContent = '';
    let i = 0;
    function typeChar() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, speed);
        } else if (onDone) {
            onDone();
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

function bakhredinKeyDown(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        bakhredinKeys[e.code] = true;
    } else if (e.code === 'Space') {
        if (!bakhredinRasulPos.isJumping) {
            bakhredinRasulPos.velocityY = 7;
            bakhredinRasulPos.isJumping = true;
        }
    } else if (e.code === 'KeyS') {
        // Проверка близости к Бахредину
        if (isNearBakhredin()) {
            // Каждый раз при нажатии S — показываем атаку
            document.getElementById('bakhredinRasul').style.display = 'none';
            document.getElementById('bakhredinRasulAttack').style.display = 'block';
            setTimeout(() => {
                document.getElementById('bakhredinRasul').style.display = 'block';
                document.getElementById('bakhredinRasulAttack').style.display = 'none';
            }, 1200);
            // Анимация ухода Бахредина вправо + скрытие диалога
            const bakhredinChar = document.getElementById('bakhredinChar');
            const bakhredinDialog = document.getElementById('bakhredinDialog');
            if (bakhredinChar.style.display !== 'none') {
                bakhredinChar.classList.add('bakhredin-exit-right');
                bakhredinDialog.style.display = 'none';
                setTimeout(() => {
                    bakhredinChar.style.display = 'none';
                    // Переход к story7Slides
                    startStory7Slides();
                }, 1200);
            }
        }
    }
}

function bakhredinKeyUp(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        bakhredinKeys[e.code] = false;
    }
}

function animateBakhredinRasul() {
    if (document.getElementById('scene5Screen').classList.contains('active')) {
        updateBakhredinRasulPosition();
        requestAnimationFrame(animateBakhredinRasul);
    }
}

function updateBakhredinRasulPosition() {
    // Горизонтальное движение
    if (bakhredinKeys['ArrowLeft'] && bakhredinRasulPos.x > 0) {
        bakhredinRasulPos.x -= 0.7;
    }
    if (bakhredinKeys['ArrowRight'] && bakhredinRasulPos.x < 60) {
        bakhredinRasulPos.x += 0.7;
    }
    // Прыжок
    if (bakhredinRasulPos.isJumping) {
        bakhredinRasulPos.y += bakhredinRasulPos.velocityY;
        bakhredinRasulPos.velocityY -= 0.7;
        if (bakhredinRasulPos.y <= 2) {
            bakhredinRasulPos.y = 2;
            bakhredinRasulPos.velocityY = 0;
            bakhredinRasulPos.isJumping = false;
        }
    }
    // Применить позицию
    const rasul = document.getElementById('bakhredinRasul');
    const rasulAttack = document.getElementById('bakhredinRasulAttack');
    rasul.style.left = rasulAttack.style.left = bakhredinRasulPos.x + '%';
    rasul.style.bottom = rasulAttack.style.bottom = bakhredinRasulPos.y + '%';
}

function isNearBakhredin() {
    // Если Расул ближе 30% к правому краю (где стоит Бахредин)
    return bakhredinRasulPos.x > 45;
}

// --- Платформер Mario-style ---
function startPlatformerScene() {
    showScreen('scene6');
    const canvas = document.getElementById('platformerCanvas');
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;
    const ctx = canvas.getContext('2d');

    // Платформы (x, y, width, height)
    const platforms = [
        {x:0, y:canvas.height-50, w:canvas.width, h:50},
        {x:canvas.width*0.18, y:canvas.height-150, w:180, h:20},
        {x:canvas.width*0.42, y:canvas.height-230, w:160, h:20},
        {x:canvas.width*0.68, y:canvas.height-300, w:120, h:20},
        {x:canvas.width*0.88, y:canvas.height-400, w:100, h:20},
        {x:canvas.width*0.3, y:canvas.height-420, w:100, h:20},
        {x:canvas.width*0.6, y:canvas.height-500, w:80, h:20}
    ];
    // Препятствия: типы - red (опасные), blue (можно стоять), green (двигаются)
    const obstacles = [
        {x:canvas.width*0.5, y:canvas.height-70, w:60, h:20, type:'red'},
        {x:canvas.width*0.25, y:canvas.height-170, w:60, h:20, type:'blue'},
        {x:canvas.width*0.7, y:canvas.height-320, w:60, h:20, type:'green', dir:1}
    ];
    // Дверь (рядом с верхним правым блоком)
    const door = {
        x: canvas.width*0.88 + 120, y: canvas.height-400-100, w: 44, h: 100,
        open: false, openAnim: 0
    };
    let doorOpening = false;

    // Персонаж (крупнее)
    let rasul = {
        x: 60, y: canvas.height-140, w: 110, h: 160,
        vx: 0, vy: 0,
        onGround: false,
        img: new Image(),
        walkImg: new Image(),
        walkFrame: 0
    };
    rasul.img.src = 'assets/Rasul.png';
    rasul.walkImg.src = 'assets/Rasulwithlaptop.gif';

    let keys = {};

    document.onkeydown = e => keys[e.code] = true;
    document.onkeyup = e => keys[e.code] = false;

    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        // Платформы
        ctx.fillStyle = '#222';
        platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
        // Препятствия
        for (let o of obstacles) {
            if (o.type==='red') ctx.fillStyle = '#ff2222';
            else if (o.type==='blue') ctx.fillStyle = '#2288ff';
            else if (o.type==='green') ctx.fillStyle = '#22cc44';
            ctx.fillRect(o.x, o.y, o.w, o.h);
        }
        // Красивая дверь с аркой, ручкой и панелями
        if (!door.open) {
            ctx.save();
            ctx.globalAlpha = 1-door.openAnim;
            ctx.translate(door.x + door.w/2 + door.openAnim*120, door.y + door.h/2);
            ctx.rotate(door.openAnim * 0.7);
            // Светящийся контур
            ctx.shadowColor = '#00ffe6';
            ctx.shadowBlur = 18;
            // Арка
            ctx.beginPath();
            ctx.moveTo(-door.w/2, -door.h/2+20);
            ctx.lineTo(-door.w/2, door.h/2);
            ctx.lineTo(door.w/2, door.h/2);
            ctx.lineTo(door.w/2, -door.h/2+20);
            ctx.arc(0, -door.h/2+20, door.w/2, Math.PI, 0, false);
            ctx.closePath();
            ctx.fillStyle = '#1a2a4d';
            ctx.fill();
            ctx.shadowBlur = 0;
            // Панели
            ctx.strokeStyle = '#3a4a7d';
            ctx.lineWidth = 2;
            ctx.strokeRect(-door.w/2+7, -door.h/2+35, door.w-14, 20);
            ctx.strokeRect(-door.w/2+7, -door.h/2+60, door.w-14, 28);
            // Ручка
            ctx.beginPath();
            ctx.arc(door.w/2-12, 0, 7, 0, 2*Math.PI);
            ctx.fillStyle = '#ffd700';
            ctx.shadowColor = '#fff8b0';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
        }
        // Персонаж
        let img = (Math.abs(rasul.vx)>0.5) ? rasul.walkImg : rasul.img;
        ctx.drawImage(img, rasul.x, rasul.y, rasul.w, rasul.h);
    }

    function update() {
        // Управление
        if (keys['ArrowLeft']) rasul.vx = -6;
        else if (keys['ArrowRight']) rasul.vx = 6;
        else rasul.vx = 0;
        if (keys['Space'] && rasul.onGround) {
            rasul.vy = -18;
            rasul.onGround = false;
        }
        // Физика
        rasul.x += rasul.vx;
        rasul.y += rasul.vy;
        rasul.vy += 1.1; // гравитация
        // Границы
        if (rasul.x < 0) rasul.x = 0;
        if (rasul.x + rasul.w > canvas.width) rasul.x = canvas.width - rasul.w;
        if (rasul.y > canvas.height - rasul.h) {
            rasul.y = canvas.height - rasul.h;
            rasul.vy = 0;
            rasul.onGround = true;
        }
        // Платформы
        rasul.onGround = false;
        for (let p of platforms) {
            if (rasul.x + rasul.w > p.x && rasul.x < p.x + p.w &&
                rasul.y + rasul.h > p.y && rasul.y + rasul.h < p.y + p.h + 20 && rasul.vy >= 0) {
                rasul.y = p.y - rasul.h;
                rasul.vy = 0;
                rasul.onGround = true;
            }
        }
        // Препятствия
        for (let o of obstacles) {
            // Красные — сбрасывают
            if (o.type==='red' && rasul.x + rasul.w > o.x && rasul.x < o.x + o.w &&
                rasul.y + rasul.h > o.y && rasul.y < o.y + o.h) {
                rasul.x = 60; rasul.y = canvas.height-140; rasul.vx = 0; rasul.vy = 0;
            }
            // Синие — можно стоять
            if (o.type==='blue' && rasul.x + rasul.w > o.x && rasul.x < o.x + o.w &&
                rasul.y + rasul.h > o.y && rasul.y + rasul.h < o.y + o.h + 20 && rasul.vy >= 0) {
                rasul.y = o.y - rasul.h;
                rasul.vy = 0;
                rasul.onGround = true;
            }
            // Зелёные — двигаются
            if (o.type==='green') {
                o.x += o.dir * 2;
                if (o.x < canvas.width*0.6 || o.x > canvas.width*0.8) o.dir *= -1;
                // Можно стоять
                if (rasul.x + rasul.w > o.x && rasul.x < o.x + o.w &&
                    rasul.y + rasul.h > o.y && rasul.y + rasul.h < o.y + o.h + 20 && rasul.vy >= 0) {
                    rasul.y = o.y - rasul.h;
                    rasul.vy = 0;
                    rasul.onGround = true;
                    rasul.x += o.dir * 2; // едет вместе с платформой
                }
            }
        }
        // Дверь — анимация открытия
        if (!door.open && rasul.x + rasul.w > door.x && rasul.x < door.x + door.w &&
            rasul.y + rasul.h > door.y && rasul.y < door.y + door.h && !doorOpening) {
            doorOpening = true;
        }
        if (doorOpening && !door.open) {
            door.openAnim += 0.04;
            if (door.openAnim >= 1) {
                door.openAnim = 1;
                door.open = true;
                setTimeout(nextLocation, 400);
            }
        }
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }
    loop();
}

function nextLocation() {
    // alert('Следующая локация! (Здесь может быть новый уровень или сцена)');
    startBernarScene();
    // Здесь можно вызвать другую функцию или сцену
}

// Game functions removed - no longer needed 

// --- Story slides перед платформером ---
const story7Slides = [
    'Преодолев Бахредина, Расул отправился дальше... ',
    'Но впереди его ждали новые испытания!',
    'На пути появились платформы и опасные препятствия...'
];
let story7Index = 0;
let story7Typing = false;

function startStory7Slides() {
    showScreen('story7');
    story7Index = 0;
    showStory7Slide(0);
    document.getElementById('story7Screen').onclick = nextStory7Slide;
}

function showStory7Slide(idx) {
    // Hide all
    for (let i=1; i<=3; ++i) document.getElementById('story7slide'+i).style.display = 'none';
    document.getElementById('story7slide'+(idx+1)).style.display = 'block';
    const textEl = document.getElementById('story7Text'+(idx+1));
    story7Typing = true;
    typeDialogText(textEl, story7Slides[idx], 35, () => { story7Typing = false; });
}

function nextStory7Slide() {
    if (story7Typing) return;
    story7Index++;
    if (story7Index < story7Slides.length) {
        showStory7Slide(story7Index);
    } else {
        startPlatformerScene();
    }
} 

// --- Сцена с Бернаром ---
const bernarDialogLines = [
    'Эй, ты куда уходишь с Demo Day? Я же тебе помогал, не помнишь?',
    'Кто тебе поднимал Docker, когда у тебя всё падало? Кто деплой на сервер сделал?',
    'А ты даже спасибо не сказал! Ну поколение пошло сейчас... Всё через чат-GPT делают!',
    'Ладно, удачи тебе, но помни — без команды далеко не уедешь!'
];
let bernarDialogIndex = 0;
let bernarTyping = false;

// Управление Расулом в сцене с Бернаром
let bernarRasulPos = { x: 5, y: 2, velocityY: 0, isJumping: false };
let bernarKeys = {};
let bernarAttackActive = false;

function startBernarScene() {
    showScreen('sceneBernar');
    bernarDialogIndex = 0;
    showBernarDialogLine();
    document.getElementById('sceneBernarScreen').onclick = nextBernarDialog;
    // Управление
    bernarRasulPos = { x: 5, y: 2, velocityY: 0, isJumping: false };
    bernarKeys = {};
    updateBernarRasulPosition();
    window.addEventListener('keydown', bernarKeyDown);
    window.addEventListener('keyup', bernarKeyUp);
    animateBernarRasul();
}

function showBernarDialogLine() {
    const dialogBox = document.getElementById('bernarDialog');
    dialogBox.textContent = '';
    bernarTyping = true;
    typeDialogText(dialogBox, bernarDialogLines[bernarDialogIndex], 35, () => {
        bernarTyping = false;
    });
}

function nextBernarDialog() {
    if (bernarTyping) return;
    bernarDialogIndex++;
    if (bernarDialogIndex < bernarDialogLines.length) {
        showBernarDialogLine();
    } else {
        // Здесь можно вызвать следующую сцену или платформер
        startPlatformerScene();
    }
} 

function bernarKeyDown(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        bernarKeys[e.code] = true;
    } else if (e.code === 'Space') {
        if (!bernarRasulPos.isJumping) {
            bernarRasulPos.velocityY = 7;
            bernarRasulPos.isJumping = true;
        }
    } else if (e.code === 'KeyS') {
        if (isNearBernar() && !bernarAttackActive) {
            bernarAttackActive = true;
            // Показать атаку
            document.querySelector('.bernar-rasul-character').style.display = 'none';
            document.querySelector('.bernar-rasul-attack').style.display = 'block';
            
            // Убрать Бернара
            const bernarChar = document.getElementById('bernarChar');
            const bernarDialog = document.getElementById('bernarDialog');
            bernarChar.classList.add('bakhredin-exit-right');
            bernarDialog.style.display = 'none';
            
            setTimeout(() => {
                // Вернуть обычный спрайт Расула
                document.querySelector('.bernar-rasul-character').style.display = 'block';
                document.querySelector('.bernar-rasul-attack').style.display = 'none';
                bernarChar.style.display = 'none';
                // Переход к следующей сцене
                startPlatformerScene();
            }, 1200);
        }
    }
}

function isNearBernar() {
    return bernarRasulPos.x > 45;
}

function bernarKeyUp(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        bernarKeys[e.code] = false;
    }
}

function animateBernarRasul() {
    if (document.getElementById('sceneBernarScreen').classList.contains('active')) {
        updateBernarRasulPosition();
        requestAnimationFrame(animateBernarRasul);
    }
}

function updateBernarRasulPosition() {
    // Горизонтальное движение
    if (bernarKeys['ArrowLeft'] && bernarRasulPos.x > 0) {
        bernarRasulPos.x -= 0.7;
    }
    if (bernarKeys['ArrowRight'] && bernarRasulPos.x < 60) {
        bernarRasulPos.x += 0.7;
    }
    // Прыжок
    if (bernarRasulPos.isJumping) {
        bernarRasulPos.y += bernarRasulPos.velocityY;
        bernarRasulPos.velocityY -= 0.7;
        if (bernarRasulPos.y <= 2) {
            bernarRasulPos.y = 2;
            bernarRasulPos.velocityY = 0;
            bernarRasulPos.isJumping = false;
        }
    }
    // Применить позицию к обоим спрайтам
    const rasul = document.querySelector('.bernar-rasul-character');
    const rasulAttack = document.querySelector('.bernar-rasul-attack');
    if (rasul) {
        rasul.style.left = bernarRasulPos.x + '%';
        rasul.style.bottom = bernarRasulPos.y + '%';
    }
    if (rasulAttack) {
        rasulAttack.style.left = bernarRasulPos.x + '%';
        rasulAttack.style.bottom = bernarRasulPos.y + '%';
    }
} 