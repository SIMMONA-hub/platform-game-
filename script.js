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
    "В сердце инкубатора N Factorial жил студент Расул...\n\nОн день и ночь работал над революционным проектом для Demo Day.\n\nЕго ноутбук был верным спутником, полным кода и мечтаний об успехе.",
    
    "Но судьба распорядилась иначе...\n\nЗа несколько часов до финальной презентации Demo Day случилась катастрофа!\n\n*ТРЕСК* 💻⚡\n\nЭкран ноутбука Расула погас. Вся его работа казалась потерянной в мгновение.",
    
    "Стоя в коридорах N Factorial, Расул столкнулся с выбором:\n\nСдаться и забыть о мечтах... ИЛИ...\n\nБЕЖАТЬ! Сбежать из инкубатора и найти способ спасти Demo Day!\n\nС решимостью в сердце он выбрал БЕЖАТЬ! 🏃‍♂️💨",
    
    "Помоги Расулу сбежать из инкубатора N Factorial!\n\nСобирай 🟢 коммиты для восстановления проекта\nИзбегай ❌ багов, которые замедляют\nУклоняйся от 🔥 выгорания, которое может остановить\nХватай ⚡ подсказки менторов для усиления!\n\nДостигни Demo Day и спаси презентацию!"
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
    console.log('Showing screen:', screenName); // отладка
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Специальная обработка для coinCollectionScreen
    if (screenName === 'coinCollectionScreen') {
        document.getElementById('coinCollectionScreen').classList.add('active');
    } else if (screenName === 'sceneAlikhan') {
        document.getElementById('sceneAlikhanScreen').classList.add('active');
    } else if (screenName === 'sceneCocaCola') {
        document.getElementById('sceneCocaColaScreen').classList.add('active');
    } else if (screenName === 'finalStory') {
        document.getElementById('finalStoryScreen').classList.add('active');
    } else if (screenName === 'finalStoryScreen') {
        document.getElementById('finalStoryScreen').classList.add('active');
    } else if (screenName === 'sceneSadRasul') {
        document.getElementById('sceneSadRasulScreen').classList.add('active');
    } else if (screenName === 'sceneAlmas') {
        document.getElementById('sceneAlmasScreen').classList.add('active');
    } else {
        document.getElementById(screenName + 'Screen').classList.add('active');
    }
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
    'Куда собрался, герой? Мои ментики до 6 утра сидят!',
    'Я всю ночь кодил, хочу поспать хоть час...',
    'Настоящие стартаперы не спят! Или ты не настоящий?',
    'Я хочу, чтобы проект работал, а не чтобы я выгорел!',
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
    'Куда бежишь с Demo Day? Я же тебе помогал, забыл?',
    'Кто тебе Docker поднимал, когда всё падало? Кто деплой делал?',
    'А ты даже спасибо не сказал! Поколение нынче... Всё через чат-GPT!',
    'Ладно, удачи! Но помни — без команды никуда не дойдешь!'
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
    console.log('Showing bernar dialog line:', bernarDialogIndex); // отладка
    const dialogBox = document.getElementById('bernarDialog');
    dialogBox.textContent = '';
    bernarTyping = true;
    typeDialogText(dialogBox, bernarDialogLines[bernarDialogIndex], 35, () => {
        bernarTyping = false;
        console.log('Dialog line finished typing'); // отладка
    });
}

function nextBernarDialog() {
    console.log('nextBernarDialog called, bernarTyping:', bernarTyping); // отладка
    if (bernarTyping) return;
    bernarDialogIndex++;
    console.log('bernarDialogIndex:', bernarDialogIndex, 'bernarDialogLines.length:', bernarDialogLines.length); // отладка
    if (bernarDialogIndex < bernarDialogLines.length) {
        showBernarDialogLine();
    } else {
        // Переходим к игре с монетками
        console.log('Dialog finished, starting coin collection...'); // отладка
        startCoinCollectionScene();
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
    } else if (e.code === 'Enter' || e.code === 'KeyE') {
        // Завершить диалог нажатием Enter или E
        nextBernarDialog();
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
                startCoinCollectionScene();
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

// === Coin Collection Game ===
let coinGameState = {
    timeLeft: 10,
    score: 0,
    gameActive: false,
    coins: [],
    rasulPosition: { x: 50 }
};

let coinKeys = {};
let coinGameInterval;
let coinSpawnInterval;

function startCoinCollectionScene() {
    console.log('Starting coin collection scene...'); // отладка
    showScreen('coinCollectionScreen');
    
    // Сброс состояния игры
    coinGameState = {
        timeLeft: 10,
        score: 0,
        gameActive: true,
        coins: [],
        rasulPosition: { x: 50 }
    };
    
    coinKeys = {};
    
    // Обновить UI
    updateCoinUI();
    
    // Установить управление
    document.addEventListener('keydown', coinKeyDown);
    document.addEventListener('keyup', coinKeyUp);
    
    // Запустить таймер
    coinGameInterval = setInterval(() => {
        coinGameState.timeLeft--;
        updateCoinUI();
        
        if (coinGameState.timeLeft <= 0) {
            endCoinGame();
        }
    }, 1000);
    
    // Запустить спавн монет
    coinSpawnInterval = setInterval(() => {
        if (coinGameState.gameActive) {
            console.log('Spawning coin...'); // для отладки
            spawnCoin();
        }
    }, 800); // монета каждые 0.8 секунд
    
    console.log('Coin game started, intervals set up'); // для отладки
    
    // Запустить игровой цикл
    coinGameLoop();
}

function spawnCoin() {
    const coin = {
        id: Date.now() + Math.random(),
        x: Math.random() * 90 + 5, // от 5% до 95%
        y: -10,
        speed: 0.8 + Math.random() * 1.0 // скорость от 0.8 до 1.8
    };
    
    coinGameState.coins.push(coin);
    
    // Создать DOM элемент
    const coinElement = document.createElement('div');
    coinElement.className = 'coin';
    coinElement.id = `coin-${coin.id}`;
    coinElement.innerHTML = '₿';
    coinElement.style.left = coin.x + '%';
    coinElement.style.top = coin.y + '%';
    coinElement.style.position = 'absolute';
    coinElement.style.zIndex = '5';
    
    document.querySelector('.coin-scene-container').appendChild(coinElement);
    
    console.log('Coin spawned:', coin); // для отладки
}

function coinGameLoop() {
    if (!coinGameState.gameActive) return;
    
    // Обновить позицию Расула
    updateCoinRasulPosition();
    
    // Обновить монеты и проверить коллизии
    for (let i = coinGameState.coins.length - 1; i >= 0; i--) {
        const coin = coinGameState.coins[i];
        coin.y += coin.speed;
        
        // Обновить позицию DOM элемента
        const coinElement = document.getElementById(`coin-${coin.id}`);
        if (coinElement) {
            coinElement.style.top = coin.y + '%';
        }
        
        // Проверить коллизию с Расулом
        if (checkCoinCollision(coin)) {
            collectCoin(coin, i);
            continue; // пропустить остальные проверки для этой монеты
        }
        
        // Удалить монеты, которые упали слишком низко
        if (coin.y > 110) {
            removeCoin(coin.id);
            coinGameState.coins.splice(i, 1);
        }
    }
    
    requestAnimationFrame(coinGameLoop);
}

function updateCoinRasulPosition() {
    // Горизонтальное движение
    if (coinKeys['ArrowLeft'] && coinGameState.rasulPosition.x > 0) {
        coinGameState.rasulPosition.x -= 2;
    }
    if (coinKeys['ArrowRight'] && coinGameState.rasulPosition.x < 90) {
        coinGameState.rasulPosition.x += 2;
    }
    
    // Применить позицию
    const rasul = document.getElementById('coinRasul');
    if (rasul) {
        rasul.style.left = coinGameState.rasulPosition.x + '%';
    }
}

function checkCoinCollision(coin) {
    const rasulX = coinGameState.rasulPosition.x;
    const rasulWidth = 15; // примерная ширина персонажа в %
    const coinWidth = 5; // примерная ширина монеты в %
    
    // Проверить пересечение по X
    const coinLeft = coin.x;
    const coinRight = coin.x + coinWidth;
    const rasulLeft = rasulX;
    const rasulRight = rasulX + rasulWidth;
    
    const xOverlap = coinRight > rasulLeft && coinLeft < rasulRight;
    
    // Проверить пересечение по Y (монета должна быть на уровне персонажа)
    const yOverlap = coin.y > 70 && coin.y < 95;
    
    return xOverlap && yOverlap;
}

function collectCoin(coin, index) {
    coinGameState.score++;
    
    // Показать "+1 commit to github"
    showCommitPopup(coin.x);
    
    // Удалить монету
    removeCoin(coin.id);
    coinGameState.coins.splice(index, 1);
    
    // Обновить UI
    updateCoinUI();
}

function showCommitPopup(x) {
    const popup = document.createElement('div');
    popup.className = 'commit-popup';
    popup.innerHTML = '+1 коммит в github';
    popup.style.left = x + '%';
    popup.style.top = '60%';
    
    document.querySelector('.coin-scene-container').appendChild(popup);
    
    // Удалить через 1 секунду
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 1000);
}

function removeCoin(coinId) {
    const coinElement = document.getElementById(`coin-${coinId}`);
    if (coinElement && coinElement.parentNode) {
        coinElement.parentNode.removeChild(coinElement);
    }
}

function updateCoinUI() {
    document.getElementById('coinTimer').textContent = `Время: ${coinGameState.timeLeft}`;
    document.getElementById('coinScore').textContent = `Коммиты: ${coinGameState.score}`;
}

function endCoinGame() {
    coinGameState.gameActive = false;
    
    // Остановить интервалы
    clearInterval(coinGameInterval);
    clearInterval(coinSpawnInterval);
    
    // Удалить обработчики событий
    document.removeEventListener('keydown', coinKeyDown);
    document.removeEventListener('keyup', coinKeyUp);
    
    // Очистить монеты
    coinGameState.coins.forEach(coin => removeCoin(coin.id));
    coinGameState.coins = [];
    
    // Показать результат
    setTimeout(() => {
        if (coinGameState.score >= 5) {
            alert(`🎉 Отлично! Собрал ${coinGameState.score} коммитов! Переходим дальше...`);
            startAlikhanScene(); // переходим к диалогу с Алиханом
        } else {
            alert(`😔 Собрал только ${coinGameState.score} коммитов. Нужно было 5+. Попробуй еще раз!`);
            startCoinCollectionScene(); // перезапуск
        }
    }, 500);
}

function coinKeyDown(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        coinKeys[e.code] = true;
    }
}

function coinKeyUp(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        coinKeys[e.code] = false;
    }
}

// === Alikhan Scene ===
const alikhanDialogLines = [
    'Эй, Расул! Видел твои коммиты в GitHub! Неплохо!',
    'Да, но это все фиксы багов... Ничего серьезного.',
    'Ты много коммитов собрал за короткое время.',
    'Это потому что у меня код был полон ошибок...',
    'Такая активность показывает серьезность к проекту.',
    'Серьезно? Я просто пытаюсь не сломать то, что работает.',
    'Продолжай в том же духе! Успехов!',
    'Спасибо, но я не уверен, что мой код кому-то нужен...',
    ')))...'
];
let alikhanDialogIndex = 0;
let alikhanTyping = false;

// Управление Расулом в сцене с Алиханом
let alikhanRasulPos = { x: 5, y: 2, velocityY: 0, isJumping: false };
let alikhanKeys = {};
let alikhanAttackActive = false;

function startAlikhanScene() {
    console.log('Starting Alikhan scene...'); // отладка
    showScreen('sceneAlikhan');
    alikhanDialogIndex = 0;
    showAlikhanDialogLine();
    document.getElementById('sceneAlikhanScreen').onclick = nextAlikhanDialog;
    
    // Инициализация управления Расулом
    alikhanRasulPos = { x: 5, y: 2, velocityY: 0, isJumping: false };
    alikhanKeys = {};
    alikhanAttackActive = false;
    updateAlikhanRasulPosition();
    
    // Добавляем обработчики клавиш
    window.addEventListener('keydown', alikhanKeyDown);
    window.addEventListener('keyup', alikhanKeyUp);
    
    // Запускаем анимацию движения
    animateAlikhanRasul();
}

function showAlikhanDialogLine() {
    console.log('Showing alikhan dialog line:', alikhanDialogIndex); // отладка
    const dialogBox = document.getElementById('alikhanDialog');
    dialogBox.textContent = '';
    alikhanTyping = true;
    
    // Определяем, кто говорит (четные индексы - Алихан, нечетные - Расул)
    const isAlikhanSpeaking = alikhanDialogIndex % 2 === 0;
    
    // Устанавливаем соответствующий стиль
    dialogBox.className = 'alikhan-dialog pixel-text ' + (isAlikhanSpeaking ? 'alikhan-speaking' : 'rasul-speaking');
    
    typeDialogText(dialogBox, alikhanDialogLines[alikhanDialogIndex], 35, () => {
        alikhanTyping = false;
        console.log('Alikhan dialog line finished typing'); // отладка
    });
}

function nextAlikhanDialog() {
    console.log('nextAlikhanDialog called, alikhanTyping:', alikhanTyping); // отладка
    if (alikhanTyping) return;
    alikhanDialogIndex++;
    console.log('alikhanDialogIndex:', alikhanDialogIndex, 'alikhanDialogLines.length:', alikhanDialogLines.length); // отладка
    if (alikhanDialogIndex < alikhanDialogLines.length) {
        showAlikhanDialogLine();
    } else {
        // Диалог окончен, ждем нажатия S
        console.log('Alikhan dialog finished, waiting for S key...'); // отладка
    }
} 



function alikhanKeyDown(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        alikhanKeys[e.code] = true;
    } else if (e.code === 'Space') {
        if (!alikhanRasulPos.isJumping) {
            alikhanRasulPos.velocityY = 7;
            alikhanRasulPos.isJumping = true;
        }
    } else if (e.code === 'KeyS') {
        if (alikhanDialogIndex >= alikhanDialogLines.length) {
            // Диалог окончен и нажата S - переходим к следующей сцене
            console.log('S key pressed, moving to CocaCola scene...'); // отладка
            window.removeEventListener('keydown', alikhanKeyDown);
            window.removeEventListener('keyup', alikhanKeyUp);
            startCocaColaScene();
        } else if (!alikhanAttackActive) {
            // Показать атаку
            alikhanAttackActive = true;
            document.querySelector('.alikhan-rasul-character').style.display = 'none';
            document.querySelector('.alikhan-rasul-attack').style.display = 'block';
            
            // Убрать Алихана
            const alikhanChar = document.getElementById('alikhanChar');
            const alikhanDialog = document.getElementById('alikhanDialog');
            alikhanChar.classList.add('alikhan-exit-right');
            alikhanDialog.style.display = 'none';
            
            setTimeout(() => {
                // Вернуть обычный спрайт Расула
                document.querySelector('.alikhan-rasul-character').style.display = 'block';
                document.querySelector('.alikhan-rasul-attack').style.display = 'none';
                alikhanChar.style.display = 'none';
                alikhanAttackActive = false;
                
                // Перейти к сцене с грустным Расулом
                startSadRasulScene();
            }, 1200);
        }
    }
}

function alikhanKeyUp(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        alikhanKeys[e.code] = false;
    }
}

function animateAlikhanRasul() {
    if (document.getElementById('sceneAlikhanScreen').classList.contains('active')) {
        updateAlikhanRasulPosition();
        requestAnimationFrame(animateAlikhanRasul);
    }
}

function updateAlikhanRasulPosition() {
    // Горизонтальное движение
    if (alikhanKeys['ArrowLeft'] && alikhanRasulPos.x > 0) {
        alikhanRasulPos.x -= 0.7;
    }
    if (alikhanKeys['ArrowRight'] && alikhanRasulPos.x < 60) {
        alikhanRasulPos.x += 0.7;
    }
    // Прыжок
    if (alikhanRasulPos.isJumping) {
        alikhanRasulPos.y += alikhanRasulPos.velocityY;
        alikhanRasulPos.velocityY -= 0.7;
        if (alikhanRasulPos.y <= 2) {
            alikhanRasulPos.y = 2;
            alikhanRasulPos.velocityY = 0;
            alikhanRasulPos.isJumping = false;
        }
    }
    // Применить позицию к обоим спрайтам
    const rasul = document.querySelector('.alikhan-rasul-character');
    const rasulAttack = document.querySelector('.alikhan-rasul-attack');
    if (rasul) {
        rasul.style.left = alikhanRasulPos.x + '%';
        rasul.style.bottom = alikhanRasulPos.y + '%';
    }
    if (rasulAttack) {
        rasulAttack.style.left = alikhanRasulPos.x + '%';
        rasulAttack.style.bottom = alikhanRasulPos.y + '%';
    }
}





function startCocaColaScene() {
    showScreen('sceneCocaCola');
    // По клику или через 2 секунды показать финальный экран
    const cocaColaScreen = document.getElementById('sceneCocaColaScreen');
    function finishCocaCola() {
        cocaColaScreen.onclick = null;
        showEndScreen();
    }
    cocaColaScreen.onclick = finishCocaCola;
    setTimeout(finishCocaCola, 2500);
} 

// === Sad Rasul Scene ===
function startSadRasulScene() {
    console.log('Starting sad Rasul scene...'); // отладка
    showScreen('sceneSadRasul');
    
    // Через 5 секунд перейти к сцене с Алмасом
    setTimeout(() => {
        startAlmasScene();
    }, 5000);
}

// === Almas Scene ===
const almasDialogLines = [
    'Эй, ты че Расул уходишь?',
    'Ну ты лошок, бросил проект на полпути!',
    'Настоящие программисты не сдаются!',
    'Или ты не настоящий программист?',
    'Ладно, иди домой спать, слабак!'
];
let almasDialogIndex = 0;
let almasTyping = false;

// Управление Расулом в сцене с Алмасом
let almasRasulPos = { x: 5, y: 2, velocityY: 0, isJumping: false };
let almasKeys = {};
let almasAttackActive = false; 

function startAlmasScene() {
    console.log('Starting Almas scene...'); // отладка
    showScreen('sceneAlmas');
    almasDialogIndex = 0;
    showAlmasDialogLine();
    document.getElementById('sceneAlmasScreen').onclick = nextAlmasDialog;
    
    // Инициализация управления Расулом
    almasRasulPos = { x: 5, y: 2, velocityY: 0, isJumping: false };
    almasKeys = {};
    almasAttackActive = false;
    updateAlmasRasulPosition();
    
    // Добавляем обработчики клавиш
    window.addEventListener('keydown', almasKeyDown);
    window.addEventListener('keyup', almasKeyUp);
    
    // Запускаем анимацию движения
    animateAlmasRasul();
}

function showAlmasDialogLine() {
    console.log('Showing almas dialog line:', almasDialogIndex); // отладка
    const dialogBox = document.getElementById('almasDialog');
    dialogBox.textContent = '';
    almasTyping = true;
    
    // Определяем, кто говорит (четные индексы - Алихан, нечетные - Расул)
    const isAlmasSpeaking = almasDialogIndex % 2 === 0;
    
    // Устанавливаем соответствующий стиль
    dialogBox.className = 'alikhan-dialog pixel-text ' + (isAlmasSpeaking ? 'alikhan-speaking' : 'rasul-speaking');
    
    typeDialogText(dialogBox, almasDialogLines[almasDialogIndex], 35, () => {
        almasTyping = false;
        console.log('Almas dialog line finished typing'); // отладка
    });
}

function nextAlmasDialog() {
    console.log('nextAlmasDialog called, almasTyping:', almasTyping); // отладка
    if (almasTyping) return;
    almasDialogIndex++;
    console.log('almasDialogIndex:', almasDialogIndex, 'almasDialogLines.length:', almasDialogLines.length); // отладка
    if (almasDialogIndex < almasDialogLines.length) {
        showAlmasDialogLine();
    } else {
        // Диалог окончен, ждем нажатия S
        console.log('Almas dialog finished, waiting for S key...'); // отладка
    }
} 



function almasKeyDown(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        almasKeys[e.code] = true;
    } else if (e.code === 'Space') {
        if (!almasRasulPos.isJumping) {
            almasRasulPos.velocityY = 7;
            almasRasulPos.isJumping = true;
        }
    } else if (e.code === 'KeyS') {
        if (!almasAttackActive) {
            console.log('S key pressed, starting attack...'); // отладка
            // Показать атаку
            almasAttackActive = true;
            
            // Немедленно удаляем все обработчики, чтобы избежать повторных вызовов
            document.getElementById('sceneAlmasScreen').onclick = null;
            window.removeEventListener('keydown', almasKeyDown);
            window.removeEventListener('keyup', almasKeyUp);
            
            document.querySelector('.almas-rasul-character').style.display = 'none';
            document.querySelector('.almas-rasul-attack').style.display = 'block';
            
            // Убрать Алмаса
            const almasChar = document.querySelector('.almas-character');
            const almasDialog = document.querySelector('.almas-dialog');
            almasChar.classList.add('almas-exit-right');
            if (almasDialog) almasDialog.style.display = 'none';
            
            setTimeout(() => {
                console.log('Attack animation finished, showing final slide...'); // отладка
                // Вернуть обычный спрайт Расула
                document.querySelector('.almas-rasul-character').style.display = 'block';
                document.querySelector('.almas-rasul-attack').style.display = 'none';
                almasChar.style.display = 'none';
                almasAttackActive = false;
                
                console.log('About to call startFinalSlides...'); // отладка
                // Переход к финальным слайдам
                startFinalSlides();
                console.log('startFinalSlides called successfully'); // отладка
            }, 1200);
        }
    }
}

function almasKeyUp(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        almasKeys[e.code] = false;
    }
}

function animateAlmasRasul() {
    if (document.getElementById('sceneAlmasScreen').classList.contains('active')) {
        updateAlmasRasulPosition();
        requestAnimationFrame(animateAlmasRasul);
    }
}

function updateAlmasRasulPosition() {
    // Горизонтальное движение
    if (almasKeys['ArrowLeft'] && almasRasulPos.x > 0) {
        almasRasulPos.x -= 0.7;
    }
    if (almasKeys['ArrowRight'] && almasRasulPos.x < 60) {
        almasRasulPos.x += 0.7;
    }
    // Прыжок
    if (almasRasulPos.isJumping) {
        almasRasulPos.y += almasRasulPos.velocityY;
        almasRasulPos.velocityY -= 0.7;
        if (almasRasulPos.y <= 2) {
            almasRasulPos.y = 2;
            almasRasulPos.velocityY = 0;
            almasRasulPos.isJumping = false;
        }
    }
    // Применить позицию к обоим спрайтам
    const rasul = document.querySelector('.almas-rasul-character');
    const rasulAttack = document.querySelector('.almas-rasul-attack');
    if (rasul) {
        rasul.style.left = almasRasulPos.x + '%';
        rasul.style.bottom = almasRasulPos.y + '%';
    }
    if (rasulAttack) {
        rasulAttack.style.left = almasRasulPos.x + '%';
        rasulAttack.style.bottom = almasRasulPos.y + '%';
    }
} 

// === CocaCola Scene ===
const cocaColaDialogLines = [
    'Эй, Расул! Ты сбежал с Demo Day!',
    'Я тебе рад! Теперь ты настоящий стартапер!',
    'Спасибо, но я не уверен, что мой код кому-то нужен...',
    ')))...'
];
let cocaColaDialogIndex = 0;
let cocaColaTyping = false;

// Управление Расулом в сцене с Кока-Колой
let cocaColaRasulPos = { x: 5, y: 2, velocityY: 0, isJumping: false };
let cocaColaKeys = {};
let cocaColaAttackActive = false;

function startCocaColaScene() {
    console.log('Starting CocaCola scene...'); // отладка
    showScreen('sceneCocaCola');
    cocaColaDialogIndex = 0;
    showCocaColaDialogLine();
    document.getElementById('sceneCocaColaScreen').onclick = nextCocaColaDialog;
    
    // Инициализация управления Расулом
    cocaColaRasulPos = { x: 5, y: 2, velocityY: 0, isJumping: false };
    cocaColaKeys = {};
    cocaColaAttackActive = false;
    updateCocaColaRasulPosition();
    
    // Добавляем обработчики клавиш
    window.addEventListener('keydown', cocaColaKeyDown);
    window.addEventListener('keyup', cocaColaKeyUp);
    
    // Запускаем анимацию движения
    animateCocaColaRasul();
}

function showCocaColaDialogLine() {
    console.log('Showing cocaCola dialog line:', cocaColaDialogIndex); // отладка
    const dialogBox = document.getElementById('cocaColaDialog');
    dialogBox.textContent = '';
    cocaColaTyping = true;
    
    // Определяем, кто говорит (четные индексы - Кока-Кола, нечетные - Расул)
    const isCocaColaSpeaking = cocaColaDialogIndex % 2 === 0;
    
    // Устанавливаем соответствующий стиль
    dialogBox.className = 'alikhan-dialog pixel-text ' + (isCocaColaSpeaking ? 'alikhan-speaking' : 'rasul-speaking');
    
    typeDialogText(dialogBox, cocaColaDialogLines[cocaColaDialogIndex], 35, () => {
        cocaColaTyping = false;
        console.log('CocaCola dialog line finished typing'); // отладка
    });
}

function nextCocaColaDialog() {
    console.log('nextCocaColaDialog called, cocaColaTyping:', cocaColaTyping); // отладка
    if (cocaColaTyping) return;
    cocaColaDialogIndex++;
    console.log('cocaColaDialogIndex:', cocaColaDialogIndex, 'cocaColaDialogLines.length:', cocaColaDialogLines.length); // отладка
    if (cocaColaDialogIndex < cocaColaDialogLines.length) {
        showCocaColaDialogLine();
    } else {
        // Диалог окончен, ждем нажатия S
        console.log('CocaCola dialog finished, waiting for S key...'); // отладка
    }
} 



function cocaColaKeyDown(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        cocaColaKeys[e.code] = true;
    } else if (e.code === 'Space') {
        if (!cocaColaRasulPos.isJumping) {
            cocaColaRasulPos.velocityY = 7;
            cocaColaRasulPos.isJumping = true;
        }
    } else if (e.code === 'KeyS') {
        if (cocaColaDialogIndex >= cocaColaDialogLines.length) {
            // Диалог окончен и нажата S - переходим к следующей сцене
            console.log('S key pressed, moving to end screen...'); // отладка
            window.removeEventListener('keydown', cocaColaKeyDown);
            window.removeEventListener('keyup', cocaColaKeyUp);
            showEndScreen();
        } else if (!cocaColaAttackActive) {
            // Показать атаку
            cocaColaAttackActive = true;
            document.querySelector('.alikhan-rasul-character').style.display = 'none';
            document.querySelector('.alikhan-rasul-attack').style.display = 'block';
            
            // Убрать Кока-Колу
            const cocaColaChar = document.getElementById('cocaColaChar');
            const cocaColaDialog = document.getElementById('cocaColaDialog');
            cocaColaChar.classList.add('alikhan-exit-right');
            cocaColaDialog.style.display = 'none';
            
            setTimeout(() => {
                // Вернуть обычный спрайт Расула
                document.querySelector('.alikhan-rasul-character').style.display = 'block';
                document.querySelector('.alikhan-rasul-attack').style.display = 'none';
                cocaColaChar.style.display = 'none';
                cocaColaAttackActive = false;
                
                // Перейти к сцене с грустным Расулом
                startSadRasulScene();
            }, 1200);
        }
    }
}

function cocaColaKeyUp(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        cocaColaKeys[e.code] = false;
    }
}

function animateCocaColaRasul() {
    if (document.getElementById('sceneCocaColaScreen').classList.contains('active')) {
        updateCocaColaRasulPosition();
        requestAnimationFrame(animateCocaColaRasul);
    }
}

function updateCocaColaRasulPosition() {
    // Горизонтальное движение
    if (cocaColaKeys['ArrowLeft'] && cocaColaRasulPos.x > 0) {
        cocaColaRasulPos.x -= 0.7;
    }
    if (cocaColaKeys['ArrowRight'] && cocaColaRasulPos.x < 60) {
        cocaColaRasulPos.x += 0.7;
    }
    // Прыжок
    if (cocaColaRasulPos.isJumping) {
        cocaColaRasulPos.y += cocaColaRasulPos.velocityY;
        cocaColaRasulPos.velocityY -= 0.7;
        if (cocaColaRasulPos.y <= 2) {
            cocaColaRasulPos.y = 2;
            cocaColaRasulPos.velocityY = 0;
            cocaColaRasulPos.isJumping = false;
        }
    }
    // Применить позицию к обоим спрайтам
    const rasul = document.querySelector('.alikhan-rasul-character');
    const rasulAttack = document.querySelector('.alikhan-rasul-attack');
    if (rasul) {
        rasul.style.left = cocaColaRasulPos.x + '%';
        rasul.style.bottom = cocaColaRasulPos.y + '%';
    }
    if (rasulAttack) {
        rasulAttack.style.left = cocaColaRasulPos.x + '%';
        rasulAttack.style.bottom = cocaColaRasulPos.y + '%';
    }
} 

// === End Screen ===
const endDialogLines = [
    'Спасибо за игру!',
    'Надеюсь, ты узнал много нового о стартапах и программировании.',
    'Желаю тебе успехов в твоем пути!',
    ')))...'
];
let endDialogIndex = 0;
let endTyping = false;

function showEndScreen() {
    console.log('Showing end screen...'); // отладка
    showScreen('end');
    endDialogIndex = 0;
    showEndDialogLine();
    document.getElementById('endScreen').onclick = nextEndDialog;
}

function showEndDialogLine() {
    console.log('Showing end dialog line:', endDialogIndex); // отладка
    const dialogBox = document.getElementById('endDialog');
    dialogBox.textContent = '';
    endTyping = true;
    typeDialogText(dialogBox, endDialogLines[endDialogIndex], 35, () => {
        endTyping = false;
        console.log('End dialog line finished typing'); // отладка
    });
}

function nextEndDialog() {
    console.log('nextEndDialog called, endTyping:', endTyping); // отладка
    if (endTyping) return;
    endDialogIndex++;
    console.log('endDialogIndex:', endDialogIndex, 'endDialogLines.length:', endDialogLines.length); // отладка
    if (endDialogIndex < endDialogLines.length) {
        showEndDialogLine();
    } else {
        // Диалог окончен, перезапуск игры
        console.log('End dialog finished, restarting game...'); // отладка
        currentScreen = 'start';
        showScreen('start');
    }
} 

// === Final Story Slides ===
const finalStoryTexts = [
    'В итоге Расул понял, что его путь в IT только начинается...\n\nСбежав с Demo Day, он осознал главное — дело не в идеальном коде или безупречной презентации.',
    
    'Настоящий разработчик — это тот, кто не сдается перед трудностями, учится на ошибках и всегда готов начать заново.\n\nЗа время своего приключения Расул обрел уверенность в себе.',
    
    'А еще... он понял, что в N Factorial у него есть друзья, которые всегда поддержат, даже если проект не идеален.\n\nТЕПЕРЬ ОН ГОТОВ К НОВЫМ ВЫЗОВАМ!\n\nTHE END'
];

let finalSlideIndex = 0;
let finalTyping = false;

function startFinalSlides() {
    console.log('Starting final slides...'); // отладка
    showScreen('finalStoryScreen');
    finalSlideIndex = 0;
    showFinalSlide();
    document.getElementById('finalStoryScreen').onclick = nextFinalSlide;
}

function showFinalSlide() {
    console.log('Showing final slide:', finalSlideIndex); // отладка
    // Скрыть все слайды
    document.querySelectorAll('#finalStoryScreen .story-slide').forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Показать текущий слайд
    const slide = document.getElementById(`finalSlide${finalSlideIndex + 1}`);
    slide.classList.add('active');
    
    // Начать печатный эффект
    const textElement = document.getElementById(`finalText${finalSlideIndex + 1}`);
    finalTyping = true;
    typeDialogText(textElement, finalStoryTexts[finalSlideIndex], 35, () => {
        finalTyping = false;
        console.log('Final slide finished typing'); // отладка
    });
}

function nextFinalSlide() {
    if (finalTyping) return;
    finalSlideIndex++;
    if (finalSlideIndex < finalStoryTexts.length) {
        showFinalSlide();
    } else {
        // Последний слайд, перезапуск игры
        document.getElementById('finalStoryScreen').onclick = restartGame;
    }
}

function restartGame() {
    console.log('Restarting game...'); // отладка
    document.getElementById('finalStoryScreen').onclick = null;
    currentScreen = 'start';
    showScreen('start');
}

