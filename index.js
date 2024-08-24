const isRaining = true;
const intensity = 300;
const speed = 4;
const wind = - 4;
const thickness = 0.5;
const color = "rgba(255, 255, 255, 1)";
const splashColor = "rgba(255, 255, 255, 1)";
const splashDuration = 10;

const canvas = document.getElementById('rain');

const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const raindrops = Array.from({ length: intensity }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    length: Math.random() * 20 + 10,
    velocityY: (Math.random() * 2 + 2) * speed,
    velocityX: wind,
}))

const splashes = [];

const drawRaindrop = (drop) => {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x + drop.velocityX, drop.y + drop.length);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
}

const drawSplash = (splash) => {
    ctx.beginPath();
    ctx.arc(
        splash.x + splash.radius * Math.cos(splash.angle),
        splash.y + splash.radius * Math.sin(splash.angle),
        splash.radius / 4,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = splashColor.replace(/[\d.]+\)$/g, `${splash.opacity})`);
    ctx.fill();
}

const updateRaindrop = (drop) => {
    drop.y += drop.velocityY;
    drop.x += drop.velocityX;

    if(drop.y > canvas.height) {
        for(let i = 0; i < 5; i++) {
            splashes.push({
                x: drop.x,
                y: canvas.height,
                radius: Math.random() * 2 + 1,
                opacity: 1,
                angle: Math.random() * 2 * Math.PI,
                velocity: Math.random() * 2 + 0.5,
            })
        }
        drop.y = 0 - drop.length;
        drop.x = Math.random() * canvas.width;
    }

    if(drop.x > canvas.width) {
        drop.x = 0;
    } else if (drop.x < 0) {
        drop.x = canvas.width;
    }
}

const updateSplash = (splash, index) => {
    splash.radius += splash.velocity;
    splash.opacity -= 1 / splashDuration;

    if(splash.opacity <= 0) {
        splashes.splice(index, 1);
    }
}

const animate = () => {
    if(!isRaining) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    raindrops.forEach((drop) => {
        drawRaindrop(drop);
        updateRaindrop(drop);
    });

    splashes.forEach((splash, index) => {
        drawSplash(splash);
        updateSplash(splash, index);
    });

    window.requestAnimationFrame(animate);
}

const handleResize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

const init = () =>  {
    window.addEventListener('resize', handleResize)
    animate();
}

init()