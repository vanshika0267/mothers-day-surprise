document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 1. Intro Animation & Start Button
    // ==========================================
    const startBtn = document.getElementById('start-btn');
    const introSection = document.getElementById('intro');
    const mainContent = document.getElementById('main-content');

    // Show intro content slightly after load for a smoother experience
    setTimeout(() => {
        const introContent = document.querySelector('.intro-content');
        introContent.classList.remove('hidden');
        introContent.classList.add('show');
    }, 500);

    startBtn.addEventListener('click', () => {
        // Open curtains
        document.querySelector('.curtain-left').classList.add('open-left');
        document.querySelector('.curtain-right').classList.add('open-right');
        document.querySelector('.intro-content').style.opacity = 0;

        // Transition to main content after curtain opens
        setTimeout(() => {
            introSection.style.display = 'none';
            mainContent.style.display = 'block';

            // Re-trigger GSAP to calculate heights properly for scroll triggers
            ScrollTrigger.refresh();

            // Initialize other dynamic elements
            initParticles();
            createBalloons();

            // Scroll to top
            window.scrollTo(0, 0);
        }, 2000);
    });

    // ==========================================
    // 2. Memory Section Animations
    // ==========================================
    const memoryCards = document.querySelectorAll('.memory-card');

    memoryCards.forEach((card) => {
        // Fade in and slide up
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
        });

        // Parallax effect on the image
        const img = card.querySelector('img');
        gsap.to(img, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: "10%", // moves down as user scrolls, creating parallax
            ease: "none"
        });
    });

    // ==========================================
    // 3. Balloon Game
    // ==========================================
    const balloonData = [
        {
            title: "Happyy mother's dayy mummaaa 😘😘😘",
            img: "images/11.JPG",
            msg: "Happy Mother's Day Mumma ❤️ Aap meri life ka sabse safe aur beautiful part ho. Har situation mein aapne mujhe itna support kiya hai ki words kabhi enough nahi lagenge. Thank you for loving me unconditionally and always standing by my side. Love you the most 🌸"
        },
        {
            title: "My Supermom 🦸‍♀️",
            img: "images/22.jpeg",
            msg: "No matter how much we fight, you are the one I always look for. Your strength inspires me every single day. You are the glue that holds our family together."
        },
        {
            title: "The Best Cook 👩‍🍳",
            img: "images/33.JPG",
            msg: "Nothing in this world can beat the taste of your food. It’s made with pure love. Thank you for always making sure my tummy and heart are full! 🍲❤️"
        },
        {
            title: "My First Friend 👯‍♀️",
            img: "images/44.jpg",
            msg: "Before anyone else, you were my first best friend. I can share everything with you, and I know you'll listen without judging. You're simply the best! ✨"
        },
        {
            title: "Always There For Me 🫂",
            img: "images/55.JPG",
            msg: "Your hugs are my safest place in the whole wide world. When everything goes wrong, just one hug from you fixes everything. Love you mumma! 🥰"
        },
        {
            title: "My Guiding Light 🌟",
            img: "images/66.jpg",
            msg: "Thank you for teaching me right from wrong, for all the values and the endless patience. I am who I am because of you. Happy Mother's Day! ❤️❤️❤️"
        }
    ];

    const balloonColors = ['balloon-color-1', 'balloon-color-2', 'balloon-color-3', 'balloon-color-4', 'balloon-color-5'];

    let poppedCount = 0;
    const maxBalloons = 6;
    let balloonsOnScreen = 0;

    const poppedCountEl = document.getElementById('popped-count');
    const progressBar = document.getElementById('progress-bar');

    function createBalloons() {
        const container = document.getElementById('balloon-container');

        // Create initial set of balloons
        for (let i = 0; i < 4; i++) {
            if (balloonsOnScreen + poppedCount < maxBalloons) {
                setTimeout(() => {
                    createSingleBalloon(container);
                }, i * 1200); // Stagger creation
            }
        }
    }

    function createSingleBalloon(container) {
        if (poppedCount + balloonsOnScreen >= maxBalloons) return;

        balloonsOnScreen++;
        const balloon = document.createElement('div');
        balloon.className = 'balloon';

        // Random horizontal position
        balloon.style.left = `${Math.random() * 70 + 15}%`;

        // Random color
        const colorClass = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        balloon.classList.add(colorClass);

        // Click event
        balloon.addEventListener('click', (e) => popBalloon(e, balloon, container));

        container.appendChild(balloon);

        // Recreate balloon when animation ends (it floats out of view)
        balloon.addEventListener('animationend', () => {
            balloon.remove();
            balloonsOnScreen--;
            createSingleBalloon(container);
        });
    }

    const modal = document.getElementById('message-modal');
    const closeBtn = document.querySelector('.close-btn');
    const modalTitle = document.getElementById('balloon-title');
    const modalImg = document.getElementById('balloon-img');
    const modalText = document.getElementById('balloon-message');

    function popBalloon(e, balloon, container) {
        // Confetti at balloon position
        const rect = balloon.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 60,
            spread: 70,
            origin: { x, y },
            colors: ['#ffb6c1', '#d4af37', '#ffffff', '#e84362']
        });

        // Remove clicked balloon
        balloon.remove();
        balloonsOnScreen--;

        // Update logic
        const data = balloonData[poppedCount];
        poppedCount++;

        poppedCountEl.innerText = poppedCount;
        progressBar.style.width = `${(poppedCount / maxBalloons) * 100}%`;

        // Show a specific card
        modalTitle.innerText = data.title;
        modalImg.src = data.img;
        modalText.innerText = data.msg;
        modal.style.display = 'flex';

        // Add a new balloon to replace the popped one after a delay
        if (poppedCount + balloonsOnScreen < maxBalloons) {
            setTimeout(() => createSingleBalloon(container), 1500);
        }
    }

    // Modal Close logic
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // ==========================================
    // 4. Letter Reveal Animation
    // ==========================================
    const letterParagraphs = document.querySelectorAll('.reveal-text');

    letterParagraphs.forEach((p, index) => {
        gsap.to(p, {
            scrollTrigger: {
                trigger: p,
                start: "top 90%",
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: index * 0.4,
            ease: "power2.out"
        });
    });

    // ==========================================
    // 5. Cake Interaction
    // ==========================================
    const blowBtn = document.getElementById('blow-candle-btn');
    const flame = document.getElementById('flame');
    const smoke = document.getElementById('smoke');
    const cakeMessage = document.getElementById('cake-message');

    blowBtn.addEventListener('click', () => {
        // Extinguish flame and show smoke
        flame.classList.add('extinguished');
        smoke.classList.add('active');

        // Hide button
        blowBtn.style.opacity = 0;
        setTimeout(() => blowBtn.style.display = 'none', 300);

        // Grand Confetti Explosion
        setTimeout(() => {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // Fire from two sides
                confetti(Object.assign({}, defaults, {
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                }));
                confetti(Object.assign({}, defaults, {
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                }));
            }, 250);

            // Show hidden message
            cakeMessage.classList.remove('hidden');
            cakeMessage.style.opacity = 1;
        }, 800);
    });

    // ==========================================
    // 6. Coupon Flip Interaction
    // ==========================================
    const coupons = document.querySelectorAll('.coupon-card');

    coupons.forEach(coupon => {
        coupon.addEventListener('click', () => {
            // Toggle flip state
            coupon.classList.toggle('flipped');

            // Fire small confetti burst when revealing back
            if (coupon.classList.contains('flipped')) {
                const rect = coupon.getBoundingClientRect();
                const x = (rect.left + rect.width / 2) / window.innerWidth;
                const y = (rect.top + rect.height / 2) / window.innerHeight;

                setTimeout(() => {
                    confetti({
                        particleCount: 40,
                        spread: 50,
                        origin: { x, y },
                        colors: ['#d4af37', '#ffffff', '#e84362']
                    });
                }, 300); // Slight delay to match flip animation
            }
        });

        // Add GSAP entry animation for coupons
        gsap.from(coupon, {
            scrollTrigger: {
                trigger: document.getElementById('coupons'),
                start: "top 70%"
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)"
        });
    });

    // ==========================================
    // 7. Replay Button
    // ==========================================
    const replayBtn = document.getElementById('replay-btn');
    replayBtn.addEventListener('click', () => {
        // Scroll to top and reload to reset all states
        window.scrollTo(0, 0);
        setTimeout(() => {
            location.reload();
        }, 300);
    });

    // ==========================================
    // Background Particles System (Canvas)
    // ==========================================
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray = [];

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5; // Small sparkles
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * -0.5 - 0.25; // Slowly float up
                // Soft gold/white sparkles
                this.color = `rgba(212, 175, 55, ${Math.random() * 0.4 + 0.1})`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Twinkle effect by slowly changing size
                if (Math.random() > 0.98) {
                    this.size = Math.random() * 2 + 0.5;
                }

                // Reset position if it goes out of screen
                if (this.y < 0) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x < 0 || this.x > canvas.width) {
                    this.speedX = -this.speedX;
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function createParticles() {
            // Adjust count based on screen size
            const count = window.innerWidth < 768 ? 50 : 120;
            for (let i = 0; i < count; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        createParticles();
        animateParticles();

        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particlesArray = [];
            createParticles();
        });
    }
});
