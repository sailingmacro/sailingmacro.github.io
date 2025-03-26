/**
 * Sailing the Macro Workshop - Website JavaScript
 * Handles interactive functionality for the modern, section-based website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initSectionScrolling();
    initCountdown();
    initTabs();
    initAccordion();
    initAnimations();
    initLogoAnimation(); // Add this line
});

// Add animation for submission options when they come into view
document.addEventListener('DOMContentLoaded', () => {
    // Set up the observer for submission options
    const submissionOptions = document.querySelectorAll('.submission-option');
    
    // Use Intersection Observer to detect when elements are in viewport
    const submissionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add animation class when element is in viewport
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, entry.target === submissionOptions[0] ? 0 : 300); // Stagger the animations
                
                // Once animated, unobserve
                submissionObserver.unobserve(entry.target);
            }
        });
    }, {
        // Element is considered in view when it's 15% visible
        threshold: 0.15,
        // Start observing slightly before element enters viewport
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all submission options
    submissionOptions.forEach(option => {
        submissionObserver.observe(option);
    });
    
    // Add a nice animation for the special focus section
    const specialFocusSection = document.querySelector('.special-focus-section');
    if (specialFocusSection) {
        const specialFocusObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                    specialFocusObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        specialFocusObserver.observe(specialFocusSection);
    }
});

// Add fadeInUp animation to CSS
document.addEventListener('DOMContentLoaded', () => {
    // Create a style element
    const style = document.createElement('style');
    
    // Add the keyframes animation
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    // Append the style to the head
    document.head.appendChild(style);
});

/**
 * Header and Navigation
 */
function initNavigation() {
    const header = document.getElementById('header');
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-links a:not(.dropdown-toggle)');
    const logo = document.querySelector('.logo a');
    
    // Mobile menu toggle
    mobileMenuIcon.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
        });
    });
    
    // Logo click behavior - ensure it sets the correct active state
    logo.addEventListener('click', () => {
        updateActiveNavLinkById('home');
    });
    
    // Enhanced header scroll effect - only apply scrolled class beyond threshold
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            logo.style.fontSize = '1.1rem'; // Slightly smaller logo text on scroll
        } else {
            header.classList.remove('scrolled');
            logo.style.fontSize = ''; // Reset to original size
        }
    });
    
    // Initial check to prevent header expansion on page load
    if (window.scrollY <= 50) {
        header.classList.remove('scrolled');
        logo.style.fontSize = '';
    }
    
    // Update active link on scroll
    updateActiveNavLink();
    window.addEventListener('scroll', debounce(updateActiveNavLink, 100));
}

/**
 * Smooth Section Scrolling
 */
function initSectionScrolling() {
    // Smooth scroll to section when clicking nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip dropdown toggles
            if (this.classList.contains('dropdown-toggle')) return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            scrollToSection(targetElement);
        });
    });
    
    // Scroll down buttons
    document.querySelectorAll('.scroll-down a').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                scrollToSection(targetElement);
            }
        });
    });
    
    // Intersection Observer for section detection
    const sections = document.querySelectorAll('.section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Update URL hash without scrolling
                const id = entry.target.getAttribute('id');
                history.replaceState(null, null, `#${id}`);
                
                // Update active nav link
                updateActiveNavLinkById(id);
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a:not(.dropdown-toggle)');
    
    // Get current scroll position
    const scrollPos = window.scrollY + window.innerHeight / 3;
    
    // Find the current section
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos <= sectionBottom) {
            const id = section.getAttribute('id');
            updateActiveNavLinkById(id);
        }
    });
}

/**
 * Update active navigation link by section ID
 */
function updateActiveNavLinkById(sectionId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Smooth scroll to target element
 */
function scrollToSection(element) {
    const headerOffset = document.getElementById('header').offsetHeight;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/**
 * Countdown Timer
 */
function initCountdown() {
    // Set the conference date (September 5, 2025)
    const conferenceDate = new Date('2025-05-05T12:00:00').getTime();
    
    // Update the countdown every second
    const countdownInterval = setInterval(() => {
        // Get today's date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the conference date
        const distance = conferenceDate - now;
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        document.getElementById('days').textContent = formatNumber(days);
        document.getElementById('hours').textContent = formatNumber(hours);
        document.getElementById('minutes').textContent = formatNumber(minutes);
        document.getElementById('seconds').textContent = formatNumber(seconds);
        
        // If the countdown is finished, clear interval and display message
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }, 1000);
}

/**
 * Format number to have leading zero if under 10
 */
function formatNumber(number) {
    return number < 10 ? `0${number}` : number;
}

/**
 * Program Schedule Tabs
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * FAQ Accordion
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const icon = item.querySelector('.accordion-icon i');
        
        header.addEventListener('click', () => {
            // Toggle accordion item
            item.classList.toggle('active');
            
            // Toggle icon
            if (item.classList.contains('active')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        });
    });
}

/**
 * Animations and Effects
 */
function initAnimations() {
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll(
        '.topic-item, .timeline-item, .schedule-item, .speaker-card, .info-card, .cta-box, .special-issue-box'
    );
    
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                elementObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -100px 0px' });
    
    animatedElements.forEach(element => {
        // Add initial invisible class
        element.classList.add('animate-hidden');
        elementObserver.observe(element);
    });
}

/**
 * Card spotlight effect
 */
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.info-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--x', x + 'px');
            this.style.setProperty('--y', y + 'px');
        });
    });
});

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
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

/**
 * Logo sailing animation
 */
function initLogoAnimation() {
    const logoContainers = document.querySelectorAll('.logo');
    
    logoContainers.forEach(logo => {
        const logoLink = logo.querySelector('a');
        const logoImg = logo.querySelector('.logo-img');
        
        // Create a text span if it doesn't exist
        if (!logo.querySelector('.logo-text')) {
            const text = logoLink.lastChild;
            if (text && text.nodeType === 3) { // Text node
                const textSpan = document.createElement('span');
                textSpan.className = 'logo-text';
                textSpan.textContent = text.textContent;
                text.replaceWith(textSpan);
            }
        }
        
        // Add click event
        logoLink.addEventListener('click', function(e) {
            if (!logo.classList.contains('logo-sailing')) {
                logo.classList.add('logo-sailing');
                
                // Remove the class after animation completes
                setTimeout(() => {
                    logo.classList.remove('logo-sailing');
                }, 2000); // Updated to match the 2s animation duration
            }
        });
    });
}