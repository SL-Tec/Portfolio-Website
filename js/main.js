// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Initialize Particles.js
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#7c3aed'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#7c3aed',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        }
    },
    retina_detect: true
});

// Initialize Hero Canvas Animation
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Configuration
    const particlesArray = [];
    const numberOfParticles = 100;
    const colors = ['#7c3aed', '#ec4899', '#8b5cf6', '#3b82f6'];
    
    // Mouse position
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Create particle class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.alpha = 0.5;
        }
        
        // Method to draw individual particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
        }
        
        // Check particle position, mouse position, move the particle, draw the particle
        update() {
            // Check if particle is still within canvas
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            
            // Check collision detection - mouse position / particle position
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 5;
                    this.alpha = 1;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 5;
                    this.alpha = 1;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 5;
                    this.alpha = 1;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 5;
                    this.alpha = 1;
                }
            } else {
                if (this.alpha > 0.5) {
                    this.alpha -= 0.02;
                }
            }
            
            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;
            
            // Draw particle
            this.draw();
        }
    }
    
    // Create particle array
    function init() {
        particlesArray.length = 0;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * 5 + 1;
            let x = Math.random() * (canvas.width - size * 2 - size * 2) + size * 2;
            let y = Math.random() * (canvas.height - size * 2 - size * 2) + size * 2;
            let directionX = Math.random() * 0.5 - 0.25;
            let directionY = Math.random() * 0.5 - 0.25;
            let color = colors[Math.floor(Math.random() * colors.length)];
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        
        connect();
    }
    
    // Connect particles with lines if they are close enough
    function connect() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    ctx.strokeStyle = 'rgba(124, 58, 237, 0.1)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        mouse.radius = 150;
        init();
    });
    
    // Mouse out event
    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });
    
    init();
    animate();
}

// Initialize About Sphere Animation
function initSphereAnimation() {
    const container = document.getElementById('sphere-animation');
    if (!container) return;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 300;
    
    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(150, 32, 32);
    
    // Create material with custom shader
    const material = new THREE.ShaderMaterial({
        wireframe: true,
        transparent: true,
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x7c3aed) }
        },
        vertexShader: `
            uniform float time;
            varying float vNoise;
            
            void main() {
                vec3 newPosition = position;
                float noise = sin(position.x * 0.05 + time) * sin(position.y * 0.05 + time) * sin(position.z * 0.05 + time) * 10.0;
                newPosition += normalize(position) * noise;
                vNoise = noise;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            varying float vNoise;
            
            void main() {
                float alpha = 0.2 + abs(vNoise) * 0.02;
                gl_FragColor = vec4(color, alpha);
            }
        `
    });
    
    // Create mesh
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    // Animation loop
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();
        material.uniforms.time.value = time * 0.5;
        
        sphere.rotation.x = time * 0.2;
        sphere.rotation.y = time * 0.3;
        
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    animate();
}

// Initialize Tab System
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (!tabButtons.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all tabs
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Activate the clicked tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Count Up Animation for Numbers
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    
    counters.forEach(counter => {
        const target = parseInt(counter.innerText);
        counter.innerText = '0';
        
        const countUp = () => {
            const count = parseInt(counter.innerText);
            const increment = Math.ceil(target / 20);
            
            if (count < target) {
                counter.innerText = count + increment;
                setTimeout(countUp, 100);
            } else {
                counter.innerText = target;
            }
        };
        
        // Start counting when the element comes into view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                countUp();
                observer.disconnect();
            }
        });
        
        observer.observe(counter);
    });
}

// Initialize Typed.js
function initTyped() {
    const typedElement = document.getElementById('typed-text');
    if (!typedElement) return;
    
    new Typed('#typed-text', {
        strings: ['Software Engineer', 'Web Developer', 'UI/UX Designer', 'Problem Solver'],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true
    });
}

// Initialize Three.js Animation for Project Section
function initThreeJS() {
    const container = document.getElementById('scene-container');
    if (!container) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create geometry
    const particles = new THREE.BufferGeometry();
    const particleCount = 1500;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color = new THREE.Color();
    
    // Set particle positions and colors
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Position
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
        
        // Color
        const colorIndex = Math.floor(Math.random() * 3);
        if (colorIndex === 0) {
            color.setHSL(0.73, 0.9, 0.5); // Purple
        } else if (colorIndex === 1) {
            color.setHSL(0.9, 0.9, 0.5); // Pink
        } else {
            color.setHSL(0.5, 0.9, 0.5); // Blue
        }
        
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Material
    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    // Create particle system
    const pointCloud = new THREE.Points(particles, material);
    scene.add(pointCloud);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        pointCloud.rotation.x += 0.001;
        pointCloud.rotation.y += 0.002;
        
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Start animation
    animate();
}

// Initialize Swiper for Projects Carousel
function initSwiper() {
    const swiper = new Swiper('.project-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    });

    return swiper;
}

// Initialize Lottie Animation
function initLottie() {
    lottie.loadAnimation({
        container: document.getElementById('scroll-lottie'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets8.lottiefiles.com/packages/lf20_fcfjwiyb.json'
    });
}

// GSAP Animations with ScrollTrigger
function initGSAPAnimations() {
    // Hero section animations with reduced complexity
    const heroTimeline = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    heroTimeline
        .from('.hero-section-ultra .mega-title', {
            duration: 1,
            y: 30,
            opacity: 0
        })
        .from('.hero-section-ultra .hero-badge', {
            duration: 0.8,
            x: -20,
            opacity: 0
        }, '-=0.6')
        .from('.hero-section-ultra .hero-subtitle', {
            duration: 0.8,
            y: 20,
            opacity: 0
        }, '-=0.6')
        .from('.hero-section-ultra .hero-cta', {
            duration: 0.8,
            y: 20,
            opacity: 0
        }, '-=0.6');

    // Scroll-triggered animations with reduced complexity
    gsap.utils.toArray('.project-card-3d').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.2
        });
    });
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations only if device can handle them
    const isLowEndDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth < 768;

    // Initialize AOS with optimized settings
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        disable: isLowEndDevice
    });

    // Initialize Particles.js with reduced particles for mobile
    if (!isLowEndDevice) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: window.innerWidth < 768 ? 30 : 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#7c3aed'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: false
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#7c3aed',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            }
        });
    }

    // Initialize Three.js only on desktop
    if (!isLowEndDevice && window.innerWidth >= 768) {
        initThreeJS();
        initSphereAnimation();
    }

    // Optimize GSAP animations
    if (!isLowEndDevice) {
        gsap.registerPlugin(ScrollTrigger);
        initGSAPAnimations();
    }

    // Initialize other components
    initTyped();
    initSwiper();
    initTabs();
    initCounters();
    
    // Add scroll progress indicator with throttling
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (window.scrollY / windowHeight) * 100;
                progressBar.style.width = `${scrolled}%`;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Cleanup function for animations
    window.addEventListener('beforeunload', () => {
        // Cleanup Three.js
        if (window.scene) {
            window.scene.dispose();
        }
        // Remove event listeners
        window.removeEventListener('scroll', handleScroll);
    });

    // Theme Switcher
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        
        // Update icon
        themeIcon.classList.replace(
            isDark ? 'fa-moon' : 'fa-sun',
            isDark ? 'fa-sun' : 'fa-moon'
        );
        
        // Save preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Navigation smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            try {
                // Here you would typically send the data to your backend
                // For now, we'll just show a success message
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } catch (error) {
                alert('Sorry, there was an error sending your message. Please try again later.');
            }
        });
    }
});

// Navbar scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Project cards hover effect
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add this CSS for the progress bar
const style = document.createElement('style');
style.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--primary-color);
        z-index: 9999;
        transition: width 0.1s ease;
    }
`;
document.head.appendChild(style); 