// Digital Clock with Day/Night Mode
class DigitalClock {
    constructor() {
        this.isAutoMode = true;
        this.isNightMode = false;
        this.timeFormat = 12; // 12-hour format
        
        this.initializeElements();
        this.initializeEventListeners();
        this.startClock();
        this.checkAutoMode();
        
        // Set initial theme
        this.applyTheme();
        
        // Update every second
        setInterval(() => {
            this.updateClock();
        }, 1000);
        
        // Check auto mode every minute
        setInterval(() => {
            if (this.isAutoMode) {
                this.checkAutoMode();
            }
        }, 60000);
    }
    
    initializeElements() {
        // Time elements
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.periodElement = document.getElementById('period');
        
        // Date elements
        this.dayNameElement = document.getElementById('dayName');
        this.dateElement = document.getElementById('date');
        this.monthYearElement = document.getElementById('monthYear');
        
        // Control elements
        this.modeToggle = document.getElementById('modeToggle');
        this.autoModeToggle = document.getElementById('autoModeToggle');
        this.statusText = document.getElementById('statusText');
        
        // Body element for theme switching
        this.body = document.body;
    }
    
    initializeEventListeners() {
        // Manual mode toggle
        this.modeToggle.addEventListener('click', () => {
            // Disable auto mode when manually toggling
            this.isAutoMode = false;
            this.autoModeToggle.checked = false;
            this.toggleMode();
        });
        
        // Auto mode toggle
        this.autoModeToggle.addEventListener('change', (e) => {
            this.isAutoMode = e.target.checked;
            this.updateStatusText();
            
            if (this.isAutoMode) {
                this.checkAutoMode();
            }
        });
        
        // Add click sound effect
        this.addClickSoundEffect();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'n' || e.key === 'N') {
                if (!this.isAutoMode) {
                    this.toggleMode();
                }
            } else if (e.key === 'a' || e.key === 'A') {
                this.autoModeToggle.checked = !this.autoModeToggle.checked;
                this.autoModeToggle.dispatchEvent(new Event('change'));
            }
        });
    }
    
    addClickSoundEffect() {
        const buttons = [this.modeToggle, this.autoModeToggle];
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Create audio context for click sound (optional enhancement)
                this.playClickSound();
            });
        });
    }
    
    playClickSound() {
        // Simple click sound using Web Audio API
        if (window.AudioContext || window.webkitAudioContext) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }
    
    updateClock() {
        const now = new Date();
        
        // Update time
        this.updateTime(now);
        
        // Update date
        this.updateDate(now);
        
        // Add number animation effect
        this.addNumberChangeEffect();
    }
    
    updateTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        
        let period = 'AM';
        
        if (this.timeFormat === 12) {
            if (hours === 0) {
                hours = 12;
            } else if (hours > 12) {
                hours -= 12;
                period = 'PM';
            } else if (hours === 12) {
                period = 'PM';
            }
        }
        
        // Format with leading zeros
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        // Update DOM elements with animation check
        this.updateElementWithAnimation(this.hoursElement, formattedHours);
        this.updateElementWithAnimation(this.minutesElement, formattedMinutes);
        this.updateElementWithAnimation(this.secondsElement, formattedSeconds);
        this.updateElementWithAnimation(this.periodElement, period);
    }
    
    updateDate(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const dayName = days[date.getDay()];
        const dateNumber = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        this.dayNameElement.textContent = dayName;
        this.dateElement.textContent = dateNumber;
        this.monthYearElement.textContent = `${month} ${year}`;
    }
    
    updateElementWithAnimation(element, newValue) {
        if (element.textContent !== newValue) {
            element.style.transform = 'scale(1.1)';
            element.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'scale(1)';
            }, 100);
        }
    }
    
    addNumberChangeEffect() {
        const timeNumbers = [this.hoursElement, this.minutesElement, this.secondsElement];
        
        timeNumbers.forEach((element, index) => {
            const currentValue = element.textContent;
            const previousValue = element.dataset.previous || currentValue;
            
            if (currentValue !== previousValue) {
                // Add glow effect for changed numbers
                element.style.textShadow = `
                    0 0 30px rgba(255, 255, 255, 1),
                    0 0 60px rgba(255, 255, 255, 0.8),
                    0 0 90px rgba(255, 255, 255, 0.6)
                `;
                
                if (this.isNightMode) {
                    element.style.textShadow = `
                        0 0 30px rgba(138, 43, 226, 1),
                        0 0 60px rgba(30, 144, 255, 0.8),
                        0 0 90px rgba(138, 43, 226, 0.6)
                    `;
                }
                
                setTimeout(() => {
                    element.style.textShadow = '';
                }, 500);
            }
            
            element.dataset.previous = currentValue;
        });
    }
    
    checkAutoMode() {
        if (!this.isAutoMode) return;
        
        const now = new Date();
        const hour = now.getHours();
        
        // Night mode: 7 PM to 6 AM (19:00 to 06:00)
        const shouldBeNight = hour >= 19 || hour < 6;
        
        if (shouldBeNight !== this.isNightMode) {
            this.isNightMode = shouldBeNight;
            this.applyTheme();
            this.updateStatusText();
        }
    }
    
    toggleMode() {
        this.isNightMode = !this.isNightMode;
        this.applyTheme();
        this.updateStatusText();
        
        // Add toggle animation
        this.addToggleAnimation();
    }
    
    applyTheme() {
        if (this.isNightMode) {
            this.body.classList.remove('day-mode');
            this.body.classList.add('night-mode');
        } else {
            this.body.classList.remove('night-mode');
            this.body.classList.add('day-mode');
        }
        
        // Add theme transition effect
        this.addThemeTransitionEffect();
    }
    
    addThemeTransitionEffect() {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${this.isNightMode ? 
                'radial-gradient(circle, rgba(26, 26, 46, 0.8) 0%, transparent 70%)' : 
                'radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, transparent 70%)'};
            pointer-events: none;
            z-index: 9999;
            animation: themeRipple 0.8s ease-out;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            document.body.removeChild(ripple);
        }, 800);
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes themeRipple {
                0% { 
                    transform: scale(0);
                    opacity: 1;
                }
                100% { 
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.head.removeChild(style);
        }, 1000);
    }
    
    addToggleAnimation() {
        this.modeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.modeToggle.style.transform = 'scale(1)';
        }, 150);
    }
    
    updateStatusText() {
        const modeText = this.isNightMode ? 'Night Mode' : 'Day Mode';
        const autoText = this.isAutoMode ? 'Auto' : 'Manual';
        
        this.statusText.textContent = `${modeText} Active (${autoText})`;
        
        // Add status update animation
        this.statusText.style.transform = 'scale(1.05)';
        setTimeout(() => {
            this.statusText.style.transform = 'scale(1)';
        }, 200);
    }
    
    startClock() {
        // Initial update
        this.updateClock();
        
        // Add startup animation
        this.addStartupAnimation();
    }
    
    addStartupAnimation() {
        const clockContainer = document.querySelector('.clock-container');
        const timeNumbers = document.querySelectorAll('.time-number');
        
        // Initial state
        clockContainer.style.opacity = '0';
        clockContainer.style.transform = 'scale(0.8) translateY(50px)';
        
        timeNumbers.forEach((number, index) => {
            number.style.opacity = '0';
            number.style.transform = 'translateY(30px)';
        });
        
        // Animate in
        setTimeout(() => {
            clockContainer.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            clockContainer.style.opacity = '1';
            clockContainer.style.transform = 'scale(1) translateY(0)';
            
            timeNumbers.forEach((number, index) => {
                setTimeout(() => {
                    number.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    number.style.opacity = '1';
                    number.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
        
        // Welcome pulse
        setTimeout(() => {
            clockContainer.style.animation = 'clockPulse 2s ease-in-out';
        }, 1000);
    }
}

// Additional Enhancement Features
class ClockEnhancements {
    constructor(clock) {
        this.clock = clock;
        this.initializeEnhancements();
    }
    
    initializeEnhancements() {
        this.addMouseInteractions();
        this.addKeyboardShortcuts();
        this.addPerformanceOptimizations();
        this.addAccessibilityFeatures();
    }
    
    addMouseInteractions() {
        const clockContainer = document.querySelector('.clock-container');
        
        // Mouse hover effects
        clockContainer.addEventListener('mouseenter', () => {
            clockContainer.style.transform = 'scale(1.02)';
            clockContainer.style.transition = 'transform 0.3s ease';
        });
        
        clockContainer.addEventListener('mouseleave', () => {
            clockContainer.style.transform = 'scale(1)';
        });
        
        // Click to toggle format (12/24 hour)
        const timeDisplay = document.querySelector('.time-display');
        timeDisplay.addEventListener('click', () => {
            this.clock.timeFormat = this.clock.timeFormat === 12 ? 24 : 12;
            this.showFormatNotification();
        });
    }
    
    showFormatNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 10000;
            animation: fadeInOut 2s ease;
        `;
        notification.textContent = `Switched to ${this.clock.timeFormat}-hour format`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.head.removeChild(style);
        }, 2500);
    }
    
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 't':
                    // Toggle time format
                    this.clock.timeFormat = this.clock.timeFormat === 12 ? 24 : 12;
                    this.showFormatNotification();
                    break;
                case 'f':
                    // Toggle fullscreen
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(() => {});
                    } else {
                        document.exitFullscreen().catch(() => {});
                    }
                    break;
            }
        });
    }
    
    addPerformanceOptimizations() {
        // Reduced motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addAccessibilityFeatures() {
        // Add ARIA labels
        document.getElementById('hours').setAttribute('aria-label', 'Hours');
        document.getElementById('minutes').setAttribute('aria-label', 'Minutes');
        document.getElementById('seconds').setAttribute('aria-label', 'Seconds');
        
        // Add screen reader announcements for time changes
        let lastAnnouncement = '';
        setInterval(() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            
            if (timeString !== lastAnnouncement) {
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.setAttribute('aria-atomic', 'true');
                announcement.style.position = 'absolute';
                announcement.style.left = '-10000px';
                announcement.textContent = `Current time: ${timeString}`;
                
                document.body.appendChild(announcement);
                
                setTimeout(() => {
                    document.body.removeChild(announcement);
                }, 1000);
                
                lastAnnouncement = timeString;
            }
        }, 60000); // Announce every minute
    }
}

// Initialize the clock when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const clock = new DigitalClock();
    const enhancements = new ClockEnhancements(clock);
    
    // Add loading completion indicator
    setTimeout(() => {
        console.log('🕐 Digital Clock loaded successfully!');
        console.log('⌨️  Keyboard shortcuts:');
        console.log('  • N: Toggle night/day mode (manual)');
        console.log('  • A: Toggle auto mode');
        console.log('  • T: Toggle 12/24 hour format');
        console.log('  • F: Toggle fullscreen');
        console.log('🖱️  Click time display to change format');
    }, 1000);
});