// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    


    // Smooth scrolling for internal links
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

    // Interactive link effects
    const linkItems = document.querySelectorAll('.link-item');
    linkItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.setProperty('--hover-translate', '8px');
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.setProperty('--hover-translate', '4px');
        });
    });

    // Academy mention click handler
    const academyMention = document.querySelector('.academy-mention');
    if (academyMention) {
        academyMention.addEventListener('click', function() {
            // Can link to external academy URL or keep as placeholder
            console.log('Academy link clicked');
        });
    }

    // Typing effect for the name (optional enhancement)
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const originalText = nameElement.textContent;
        nameElement.textContent = '';
        
        let index = 0;
        const typeWriter = () => {
            if (index < originalText.length) {
                nameElement.textContent += originalText.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 500);
    }

    // Copy email functionality
    const emailLink = document.querySelector('.email-link');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            const email = 'v.kovalenko.ba@gmail.com';
            
            // Try to copy to clipboard
            if (navigator.clipboard) {
                e.preventDefault();
                navigator.clipboard.writeText(email).then(() => {
                    showNotification('Email copied to clipboard!');
                }).catch(() => {
                    // Fallback to mailto if copy fails
                    window.location.href = `mailto:${email}`;
                });
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Lazy loading for images (when you add images)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Performance monitoring
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        }
    });

    // Add ripple effect to buttons
    function addRippleEffect(element) {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    // Add ripple to all link items and buttons
    linkItems.forEach(addRippleEffect);
    if (emailLink) addRippleEffect(emailLink);

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Dark mode toggle (optional)
    function initDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            const isDarkMode = localStorage.getItem('darkMode') === 'true';
            
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
            }
            
            darkModeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                const isNowDark = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isNowDark);
            });
        }
    }

    initDarkMode();
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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
    };
}

// Export functions for use in other scripts
window.VKWebsite = {
    debounce,
    throttle
}; 