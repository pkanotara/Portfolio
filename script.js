
// ==========================================
// GLOBAL VARIABLES & CONFIGURATION
// ==========================================

let isScrolling = false;
let ticking = false;
let currentTheme = localStorage.getItem('theme') || 'dark';
let typingAnimationRunning = false;

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const themeSwitcher = document.getElementById('theme-switcher');
const typingText = document.getElementById('typing-text');
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');
const contactForm = document.getElementById('contact-form');

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Random number generator
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }

    // Initialize all features
    initializeTheme();
    initializeNavigation();
    initializeCustomCursor();
    initializeTypingAnimation();
    initializeScrollEffects();
    initializeMatrixBackground();
    initializeSkillAnimations();
    initializeProjectCards();
    initializeContactForm();
    initializeGlitchEffects();
    initializeParticleSystem();
    initializeLoadingEffects();
    
    // Initialize performance optimizations
    setupIntersectionObserver();
    setupLazyLoading();
    
    // Add smooth reveal animations
    addRevealAnimations();
    
    console.log('🚀 Portfolio initialized successfully!');
}

// ==========================================
// THEME SYSTEM
// ==========================================

function initializeTheme() {
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update theme switcher state
    updateThemeSwitcher();
    
    // Theme switcher event listener
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', handleSystemThemeChange);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeSwitcher();
    
    // Add theme transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
    
    // Trigger custom event
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: currentTheme }));
}

function updateThemeSwitcher() {
    if (themeSwitcher) {
        const thumb = themeSwitcher.querySelector('.switch-thumb');
        if (currentTheme === 'dark') {
            thumb.style.transform = 'translateX(30px)';
        } else {
            thumb.style.transform = 'translateX(0)';
        }
    }
}

function handleSystemThemeChange(e) {
    if (!localStorage.getItem('theme')) {
        currentTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeSwitcher();
    }
}

// ==========================================
// NAVIGATION SYSTEM
// ==========================================

function initializeNavigation() {
    // Hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Smooth scrolling for footer links
    const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', handleOutsideClick);
    
    // Navbar scroll effect
    window.addEventListener('scroll', throttle(updateNavbarOnScroll, 10));
    
    // Active link highlighting
    window.addEventListener('scroll', throttle(updateActiveNavLink, 50));
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function handleNavLinkClick(e) {
    e.preventDefault();
    const link = e.target.closest('.nav-link');
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        // Close mobile menu
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Smooth scroll to section
        const offsetTop = targetSection.offsetTop - 100;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Add active class
        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
        });
        link.classList.add('active');
    }
}

function handleOutsideClick(e) {
    if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateNavbarOnScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function handleKeyboardNavigation(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    // Enter key activates focused nav link
    if (e.key === 'Enter' && document.activeElement.classList.contains('nav-link')) {
        document.activeElement.click();
    }
}

// ==========================================
// CUSTOM CURSOR
// ==========================================

function initializeCustomCursor() {
    if (!cursorDot || !cursorOutline) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    // Mouse move event
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    // Smooth cursor outline animation
    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.1;
        outlineY += (mouseY - outlineY) * 0.1;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .skill-card, .project-card, .social-link');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'scale(2)';
            cursorOutline.style.transform = 'scale(1.5)';
            cursorOutline.style.opacity = '0.6';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'scale(1)';
            cursorOutline.style.transform = 'scale(1)';
            cursorOutline.style.opacity = '0.3';
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '0.3';
    });
}

// ==========================================
// TYPING ANIMATION
// ==========================================

function initializeTypingAnimation() {
    if (!typingText || typingAnimationRunning) return;
    
   const texts = [
    'Full-Stack Developer',
    'React.js Developer',
    'UI/UX Designer',
    'Problem Solver',
    'Computer Science Student'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    typingAnimationRunning = true;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next text
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    // Start typing animation after a delay
    setTimeout(typeText, 1000);
}

// ==========================================
// SCROLL EFFECTS
// ==========================================

function initializeScrollEffects() {
    // Parallax scrolling for floating shapes
    const shapes = document.querySelectorAll('.shape');
    const floatingElements = document.querySelectorAll('.floating-element');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            shape.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
        
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.2;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    }, 10));
    
    // Scroll progress indicator
    createScrollProgress();
    

}

function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00d4ff, #8338ec);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, 10));
}

// ==========================================
// MATRIX BACKGROUND
// ==========================================

function initializeMatrixBackground() {
    const matrixBg = document.getElementById('matrix-bg');
    if (!matrixBg) return;
    
    // Create enhanced matrix effect
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    matrixBg.appendChild(canvas);
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0.05';
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', debounce(resizeCanvas, 250));
    
    const columns = Math.floor(canvas.width / 20);
    const drops = Array(columns).fill(0);
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00d4ff';
        ctx.font = '15px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = characters[Math.floor(Math.random() * characters.length)];
            ctx.fillText(text, i * 20, drops[i] * 20);
            
            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 50);
}

// ==========================================
// SKILL ANIMATIONS
// ==========================================

function initializeSkillAnimations() {
    const skillCards = document.querySelectorAll('.skill-card');
    const skillLevelBars = document.querySelectorAll('.level-bar');
    
    // Animate skill bars when they come into view
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const levelBar = entry.target.querySelector('.level-bar');
                if (levelBar) {
                    levelBar.style.transform = 'translateX(0)';
                }
            }
        });
    }, { threshold: 0.5 });
    
    skillCards.forEach(card => {
        skillObserver.observe(card);
        
        // Add hover sound effect (if audio is enabled)
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateY(0)';
        });
    });
    
    // Category title animations
    const categoryTitles = document.querySelectorAll('.category-title');
    categoryTitles.forEach((title, index) => {
        title.style.animationDelay = `${index * 0.2}s`;
        title.classList.add('fade-in-up');
    });
}

// ==========================================
// PROJECT CARDS
// ==========================================

function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        // Stagger animation delays
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) rotateX(5deg)';
            
            // Add glow effect to overlay
            const overlay = card.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.opacity = '0.1';
            }
            
            // Animate tech tags
            const techTags = card.querySelectorAll('.tech-tag');
            techTags.forEach((tag, tagIndex) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-2px)';
                    tag.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
                }, tagIndex * 50);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0)';
            
            const overlay = card.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
            }
            
            const techTags = card.querySelectorAll('.tech-tag');
            techTags.forEach(tag => {
                tag.style.transform = 'translateY(0)';
                tag.style.boxShadow = 'none';
            });
        });
        
        // Add click ripple effect
        card.addEventListener('click', createRippleEffect);
    });
}

function createRippleEffect(e) {
    const card = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    // Add ripple keyframes if not exists
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    card.style.position = 'relative';
    card.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ==========================================
// CONTACT FORM
// ==========================================

function initializeContactForm() {
    if (!contactForm) return;
    
    const formInputs = contactForm.querySelectorAll('input, textarea');
    const submitBtn = contactForm.querySelector('.submit-btn');
    
    // Enhanced form validation
    formInputs.forEach(input => {
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
        input.addEventListener('input', handleInputChange);
    });
    
    // Form submission
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    setupRealTimeValidation();
}

function handleInputFocus(e) {
    const formGroup = e.target.closest('.form-group');
    formGroup.classList.add('focused');
    
    // Add focus glow effect
    e.target.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
}

function handleInputBlur(e) {
    const formGroup = e.target.closest('.form-group');
    formGroup.classList.remove('focused');
    
    // Remove focus glow
    e.target.style.boxShadow = 'none';
    
    // Validate field
    validateField(e.target);
}

function handleInputChange(e) {
    // Clear previous error states
    const formGroup = e.target.closest('.form-group');
    formGroup.classList.remove('error');
    
    // Real-time character count for textarea
    if (e.target.tagName === 'TEXTAREA') {
        updateCharacterCount(e.target);
    }
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Display error
    if (!isValid) {
        formGroup.classList.add('error');
        showFieldError(formGroup, errorMessage);
    } else {
        formGroup.classList.remove('error');
        hideFieldError(formGroup);
    }
    
    return isValid;
}

function showFieldError(formGroup, message) {
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            color: #fb5607;
            font-size: 0.8rem;
            margin-top: 0.5rem;
            opacity: 0;
            animation: fadeInError 0.3s ease forwards;
        `;
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function hideFieldError(formGroup) {
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function updateCharacterCount(textarea) {
    const maxLength = 500;
    const currentLength = textarea.value.length;
    
    let counter = textarea.parentNode.querySelector('.char-counter');
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            font-size: 0.8rem;
            color: var(--text-muted);
            text-align: right;
            margin-top: 0.5rem;
        `;
        textarea.parentNode.appendChild(counter);
    }
    
    counter.textContent = `${currentLength}/${maxLength}`;
    
    if (currentLength > maxLength * 0.9) {
        counter.style.color = '#fb5607';
    } else {
        counter.style.color = 'var(--text-muted)';
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const formInputs = contactForm.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    formInputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Please correct the errors above', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';
    submitBtn.classList.add('loading');
    
    // Simulate form submission (replace with actual form submission)
    setTimeout(() => {
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Create mailto link
        const mailtoLink = `mailto:22bce139@nirmauni.ac.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Reset form
        contactForm.reset();
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = originalText;
        submitBtn.classList.remove('loading');
        
        // Show success message
        showNotification('Message sent successfully! Your email client should open shortly.', 'success');
        
        // Add success animation
        contactForm.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            contactForm.style.animation = '';
        }, 500);
        
    }, 2000);
}

function setupRealTimeValidation() {
    // Add error animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInError {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .form-group.error input,
        .form-group.error textarea {
            border-bottom-color: #fb5607 !important;
        }
        
        .submit-btn.loading {
            pointer-events: none;
            opacity: 0.7;
        }
        
        .submit-btn.loading .btn-effect {
            animation: loading-pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes loading-pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// GLITCH EFFECTS
// ==========================================

function initializeGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
        // Random glitch trigger
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                triggerGlitch(element);
            }
        }, 3000);
    });
    
    // Add glitch effect to section titles on scroll
    const sectionTitles = document.querySelectorAll('.section-title');
    const glitchObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    triggerGlitch(entry.target);
                }, random(500, 1500));
            }
        });
    }, { threshold: 0.5 });
    
    sectionTitles.forEach(title => {
        glitchObserver.observe(title);
    });
}

function triggerGlitch(element) {
    element.classList.add('glitching');
    
    // Create glitch clones
    const clone1 = element.cloneNode(true);
    const clone2 = element.cloneNode(true);
    
    clone1.style.cssText = `
        position: absolute;
        top: 0;
        left: 2px;
        color: #ff006e;
        opacity: 0.8;
        z-index: -1;
        animation: glitch-1 0.3s ease-in-out;
    `;
    
    clone2.style.cssText = `
        position: absolute;
        top: 0;
        left: -2px;
        color: #00d4ff;
        opacity: 0.8;
        z-index: -1;
        animation: glitch-2 0.3s ease-in-out;
    `;
    
    element.style.position = 'relative';
    element.appendChild(clone1);
    element.appendChild(clone2);
    
    // Add glitch keyframes
    if (!document.querySelector('#glitch-styles')) {
        const style = document.createElement('style');
        style.id = 'glitch-styles';
        style.textContent = `
            @keyframes glitch-1 {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-2px); }
                40% { transform: translateX(2px); }
                60% { transform: translateX(-1px); }
                80% { transform: translateX(1px); }
            }
            
            @keyframes glitch-2 {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(2px); }
                45% { transform: translateX(-2px); }
                65% { transform: translateX(1px); }
                85% { transform: translateX(-1px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove glitch effect after animation
    setTimeout(() => {
        element.classList.remove('glitching');
        clone1.remove();
        clone2.remove();
    }, 300);
}

// ==========================================
// PARTICLE SYSTEM
// ==========================================

function initializeParticleSystem() {
    createFloatingParticles();
    createMouseFollowParticles();
}

function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    document.body.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    const size = random(2, 6);
    const x = random(0, window.innerWidth);
    const y = random(0, window.innerHeight);
    const duration = random(10, 30);
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, #00d4ff, transparent);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        opacity: ${random(0.1, 0.5)};
        animation: float-particle ${duration}s linear infinite;
    `;
    
    // Add floating animation
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes float-particle {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.5;
                }
                90% {
                    opacity: 0.5;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
            // Create new particle
            createParticle(container);
        }
    }, duration * 1000);
}

function createMouseFollowParticles() {
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create particle at mouse position
        if (Math.random() < 0.1) { // 10% chance
            createMouseParticle(mouseX, mouseY);
        }
    });
    
    function createMouseParticle(x, y) {
        const particle = document.createElement('div');
        const size = random(2, 4);
        
        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: #00d4ff;
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
            animation: mouse-particle 1s ease-out forwards;
        `;
        
        // Add mouse particle animation
        if (!document.querySelector('#mouse-particle-styles')) {
            const style = document.createElement('style');
            style.id = 'mouse-particle-styles';
            style.textContent = `
                @keyframes mouse-particle {
                    0% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0) translateY(-20px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// ==========================================
// INTERSECTION OBSERVER
// ==========================================

function setupIntersectionObserver() {
    // Observe elements for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger specific animations based on element type
                if (entry.target.classList.contains('skill-card')) {
                    animateSkillCard(entry.target);
                }
                
                if (entry.target.classList.contains('project-card')) {
                    animateProjectCard(entry.target);
                }
                
                if (entry.target.classList.contains('achievement-card')) {
                    animateAchievementCard(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.skill-card, .project-card, .achievement-card, .contact-method, .text-block');
    animatableElements.forEach(element => {
        fadeInObserver.observe(element);
    });
    
    // Count-up animation for stats
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatValue(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateSkillCard(card) {
    const icon = card.querySelector('.skill-icon');
    const levelBar = card.querySelector('.level-bar');
    
    if (icon) {
        setTimeout(() => {
            icon.style.animation = 'bounce 0.6s ease';
        }, 200);
    }
    
    if (levelBar) {
        setTimeout(() => {
            levelBar.style.transform = 'translateX(0)';
        }, 400);
    }
}

function animateProjectCard(card) {
    const techTags = card.querySelectorAll('.tech-tag');
    
    techTags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.animation = 'slideInUp 0.5s ease forwards';
        }, index * 100);
    });
}

function animateAchievementCard(card) {
    const icon = card.querySelector('.achievement-icon');
    
    if (icon) {
        setTimeout(() => {
            icon.style.animation = 'rotateIn 0.8s ease';
        }, 300);
    }
}

function animateStatValue(statElement) {
    const finalValue = statElement.textContent;
    const numericValue = parseFloat(finalValue);
    
    if (isNaN(numericValue)) return;
    
    let currentValue = 0;
    const increment = numericValue / 50; // 50 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        
        // Format the value based on original format
        if (finalValue.includes('.')) {
            statElement.textContent = currentValue.toFixed(2);
        } else if (finalValue.includes('+')) {
            statElement.textContent = Math.floor(currentValue) + '+';
        } else {
            statElement.textContent = Math.floor(currentValue);
        }
    }, stepTime);
}

// ==========================================
// LAZY LOADING
// ==========================================

function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                lazyImageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        lazyImageObserver.observe(img);
    });
}

// ==========================================
// LOADING EFFECTS
// ==========================================

function initializeLoadingEffects() {
    // Page load animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger entrance animations
        setTimeout(() => {
            triggerEntranceAnimations();
        }, 500);
    });
    
    // Preloader
    createPreloader();
}

function createPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    `;
    
    const loader = document.createElement('div');
    loader.style.cssText = `
        width: 60px;
        height: 60px;
        border: 3px solid transparent;
        border-top: 3px solid #00d4ff;
        border-right: 3px solid #8338ec;
        border-radius: 50%;
        animation: preloader-spin 1s linear infinite;
    `;
    
    // Add preloader styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes preloader-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        body.loaded #preloader {
            opacity: 0;
            visibility: hidden;
        }
    `;
    document.head.appendChild(style);
    
    preloader.appendChild(loader);
    document.body.appendChild(preloader);
    
    // Remove preloader after load
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.remove();
        }, 1000);
    });
}

function triggerEntranceAnimations() {
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.animation = 'slideInUp 0.8s ease forwards';
        }, index * 200);
    });
    
    // Animate navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        setTimeout(() => {
            link.style.animation = 'slideInDown 0.6s ease forwards';
        }, index * 100);
    });
}

// ==========================================
// REVEAL ANIMATIONS
// ==========================================

function addRevealAnimations() {
    // Add CSS for reveal animations
    const revealStyles = document.createElement('style');
    revealStyles.textContent = `
        .animate-in {
            animation: slideInUp 0.8s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes rotateIn {
            from {
                opacity: 0;
                transform: rotate(-180deg) scale(0.5);
            }
            to {
                opacity: 1;
                transform: rotate(0deg) scale(1);
            }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(revealStyles);
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        color: white;
        font-family: var(--font-mono);
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border-left: 4px solid;
    `;
    
    // Set colors based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #00f5ff, #00d4ff)';
            notification.style.borderLeftColor = '#00f5ff';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #fb5607, #ff006e)';
            notification.style.borderLeftColor = '#fb5607';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #ffbe0b, #fb8500)';
            notification.style.borderLeftColor = '#ffbe0b';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #8338ec, #3a86ff)';
            notification.style.borderLeftColor = '#8338ec';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// ==========================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================

// Optimize scroll events
function optimizeScrollEvents() {
    let ticking = false;
    
    function updateOnScroll() {
        updateNavbarOnScroll();
        updateActiveNavLink();
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
}

// Optimize resize events
function optimizeResizeEvents() {
    window.addEventListener('resize', debounce(() => {
        // Handle responsive adjustments
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250));
}

// Initialize performance optimizations
optimizeScrollEvents();
optimizeResizeEvents();

// ==========================================
// EASTER EGGS & SPECIAL EFFECTS
// ==========================================

// Konami code easter egg
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        triggerEasterEgg();
        konamiCode = [];
    }
});

function triggerEasterEgg() {
    showNotification('🎉 Konami Code activated! You found the easter egg!', 'success');
    
    // Trigger special effects
    document.body.style.animation = 'rainbow 2s ease-in-out';
    
    // Add rainbow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            25% { filter: hue-rotate(90deg); }
            50% { filter: hue-rotate(180deg); }
            75% { filter: hue-rotate(270deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
    }, 2000);
}

// Console message
console.log(`
%c
██████╗ ██████╗  █████╗ ██╗   ██╗██╗███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗██║   ██║██║████╗  ██║
██████╔╝██████╔╝███████║██║   ██║██║██╔██╗ ██║
██╔═══╝ ██╔══██╗██╔══██║╚██╗ ██╔╝██║██║╚██╗██║
██║     ██║  ██║██║  ██║ ╚████╔╝ ██║██║ ╚████║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═╝  ╚═══╝

👋 Hey there, fellow developer!
Thanks for checking out the console.

🔍 Try the Konami code: ↑↑↓↓←→←→BA
💫 Built with modern JavaScript and lots of ☕

Portfolio by Pravin Kanotara
`, 
'color: #00d4ff; font-family: monospace; font-size: 12px;'
);

// ==========================================
// SERVICE WORKER (Optional PWA Support)
// ==========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ==========================================
// EXPORT FOR TESTING (Optional)
// ==========================================

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleTheme,
        showNotification,
        triggerGlitch,
        validateField
    };
}
