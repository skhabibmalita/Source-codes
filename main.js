// Face Emoji Mood Detector - Interactive Game Logic

class EmojiMoodDetector {
    constructor() {
        this.currentMood = 'happy';
        this.currentEmoji = '😊';
        this.moodChanges = 0;
        this.moodStats = {};
        this.isAnimating = false;
        
        // Emoji variations for different intensities
        this.emojiVariations = {
            happy: ['🙂', '😊', '😄', '😃', '😁', '🤣', '😆', '🤗', '🥰', '😍'],
            sad: ['😐', '😔', '😞', '😢', '😭', '😿', '💔', '😩', '😰', '😱'],
            angry: ['😠', '😡', '🤬', '👿', '💢', '🔥', '⚡', '💥', '🌋', '👺'],
            excited: ['😮', '🤩', '🌟', '✨', '🎉', '🎊', '🚀', '⭐', '💫', '🎆'],
            cool: ['😎', '🕶️', '😏', '🆒', '👑', '💎', '🔥', '⚡', '🌟', '👨‍💼'],
            surprised: ['😯', '😲', '😱', '🤯', '😵', '🤪', '🙄', '😵‍💫', '💫', '⚡'],
            love: ['😍', '🥰', '😘', '💕', '💖', '💗', '💓', '💞', '💘', '❤️'],
            tired: ['😴', '😪', '🥱', '😑', '😶', '🫥', '💤', '🛌', '🥴', '😵']
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.createParticles();
        this.updateStats();
        this.startIdleAnimation();
    }
    
    bindEvents() {
        // Emotion buttons
        document.querySelectorAll('.emoji-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeMood(e.target.closest('.emoji-btn')));
        });
        
        // Sliders
        document.getElementById('intensitySlider').addEventListener('input', (e) => {
            this.updateIntensity(parseInt(e.target.value));
            document.getElementById('intensityValue').textContent = e.target.value;
        });
        
        document.getElementById('sizeSlider').addEventListener('input', (e) => {
            this.updateSize(parseInt(e.target.value));
            document.getElementById('sizeValue').textContent = e.target.value + '%';
        });
        
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.updateAnimationSpeed(parseInt(e.target.value));
            document.getElementById('speedValue').textContent = e.target.value;
        });
        
        // Effect buttons
        document.getElementById('glowEffect').addEventListener('click', () => this.addGlowEffect());
        document.getElementById('shakeEffect').addEventListener('click', () => this.addShakeEffect());
        document.getElementById('bounceEffect').addEventListener('click', () => this.addBounceEffect());
        document.getElementById('randomMood').addEventListener('click', () => this.randomMood());
        
        // Emoji click interaction
        document.getElementById('emojiFace').addEventListener('click', () => this.onEmojiClick());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    changeMood(button) {
        if (this.isAnimating) return;
        
        const mood = button.dataset.mood;
        const emoji = button.dataset.emoji;
        
        // Update active button
        document.querySelectorAll('.emoji-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Change mood with animation
        this.animateMoodChange(mood, emoji);
        
        // Update stats
        this.moodChanges++;
        this.moodStats[mood] = (this.moodStats[mood] || 0) + 1;
        this.updateStats();
        
        // Play button click effect
        this.addButtonClickEffect(button);
    }
    
    animateMoodChange(mood, emoji) {
        this.isAnimating = true;
        const emojiElement = document.getElementById('emojiFace');
        const moodLabel = document.getElementById('moodLabel');
        
        // Fade out
        emojiElement.style.opacity = '0';
        emojiElement.style.transform = 'scale(0.5) rotate(180deg)';
        
        setTimeout(() => {
            // Update content
            this.currentMood = mood;
            this.currentEmoji = emoji;
            emojiElement.textContent = emoji;
            moodLabel.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
            
            // Apply intensity-based emoji if slider is not at default
            const intensity = parseInt(document.getElementById('intensitySlider').value);
            if (intensity !== 5) {
                this.updateIntensity(intensity);
            }
            
            // Fade in with bounce
            emojiElement.style.opacity = '1';
            emojiElement.style.transform = 'scale(1.2) rotate(0deg)';
            
            setTimeout(() => {
                emojiElement.style.transform = 'scale(1) rotate(0deg)';
                this.isAnimating = false;
            }, 200);
        }, 300);
    }
    
    updateIntensity(intensity) {
        const emojiElement = document.getElementById('emojiFace');
        const variations = this.emojiVariations[this.currentMood];
        
        if (variations) {
            const index = Math.min(intensity - 1, variations.length - 1);
            emojiElement.textContent = variations[index];
            
            // Add intensity-based effects
            if (intensity >= 8) {
                this.addGlowEffect();
            }
            if (intensity >= 9) {
                this.addShakeEffect();
            }
        }
    }
    
    updateSize(size) {
        const emojiElement = document.getElementById('emojiFace');
        emojiElement.style.fontSize = `${(size / 100) * 8}rem`;
    }
    
    updateAnimationSpeed(speed) {
        const root = document.documentElement;
        const duration = 11 - speed; // Inverse relationship
        root.style.setProperty('--animation-duration', `${duration}s`);
    }
    
    addGlowEffect() {
        const container = document.getElementById('emojiDisplay');
        const glowElement = document.getElementById('emojiGlow');
        
        container.classList.add('emoji-glow-active');
        glowElement.style.opacity = '1';
        
        setTimeout(() => {
            container.classList.remove('emoji-glow-active');
            glowElement.style.opacity = '0';
        }, 2000);
    }
    
    addShakeEffect() {
        const emojiElement = document.getElementById('emojiFace');
        emojiElement.classList.add('emoji-shake');
        
        setTimeout(() => {
            emojiElement.classList.remove('emoji-shake');
        }, 500);
    }
    
    addBounceEffect() {
        const emojiElement = document.getElementById('emojiFace');
        emojiElement.classList.add('emoji-bounce');
        
        setTimeout(() => {
            emojiElement.classList.remove('emoji-bounce');
        }, 1000);
    }
    
    randomMood() {
        const buttons = document.querySelectorAll('.emoji-btn');
        const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
        
        // Add random effect animation
        const randomBtn = document.getElementById('randomMood');
        randomBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            randomBtn.style.transform = 'rotate(0deg)';
        }, 500);
        
        // Trigger random mood after animation
        setTimeout(() => {
            this.changeMood(randomButton);
        }, 250);
    }
    
    onEmojiClick() {
        const effects = ['shake', 'bounce', 'glow'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        
        switch(randomEffect) {
            case 'shake': this.addShakeEffect(); break;
            case 'bounce': this.addBounceEffect(); break;
            case 'glow': this.addGlowEffect(); break;
        }
    }
    
    addButtonClickEffect(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    handleKeyboard(e) {
        const keyMoodMap = {
            '1': 'happy',
            '2': 'sad', 
            '3': 'angry',
            '4': 'excited',
            '5': 'cool',
            '6': 'surprised',
            '7': 'love',
            '8': 'tired',
            ' ': 'random', // Space for random
            'g': 'glow',
            's': 'shake',
            'b': 'bounce'
        };
        
        const key = e.key.toLowerCase();
        
        if (keyMoodMap[key]) {
            e.preventDefault();
            
            if (key === ' ') {
                this.randomMood();
            } else if (['g', 's', 'b'].includes(key)) {
                if (key === 'g') this.addGlowEffect();
                if (key === 's') this.addShakeEffect();
                if (key === 'b') this.addBounceEffect();
            } else {
                const targetButton = document.querySelector(`[data-mood="${keyMoodMap[key]}"]`);
                if (targetButton) {
                    this.changeMood(targetButton);
                }
            }
        }
    }
    
    updateStats() {
        document.getElementById('currentMoodStat').textContent = 
            this.currentMood.charAt(0).toUpperCase() + this.currentMood.slice(1);
        document.getElementById('moodChangesStat').textContent = this.moodChanges;
        
        // Find most used mood
        let mostUsed = 'happy';
        let maxCount = 0;
        for (const [mood, count] of Object.entries(this.moodStats)) {
            if (count > maxCount) {
                maxCount = count;
                mostUsed = mood;
            }
        }
        
        const mostUsedEmoji = document.querySelector(`[data-mood="${mostUsed}"]`)?.dataset.emoji || '😊';
        document.getElementById('mostUsedStat').textContent = mostUsedEmoji;
    }
    
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            
            // Random colors
            const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            particlesContainer.appendChild(particle);
        }
    }
    
    startIdleAnimation() {
        setInterval(() => {
            if (!this.isAnimating) {
                const emojiElement = document.getElementById('emojiFace');
                emojiElement.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    emojiElement.style.transform = 'scale(1)';
                }, 200);
            }
        }, 5000);
    }
}

// Sound Effects (Web Audio API)
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.init();
    }
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playMoodSound(mood) {
        const moodSounds = {
            happy: [523.25, 0.2], // C5
            sad: [220, 0.5], // A3
            angry: [130.81, 0.3], // C3
            excited: [659.25, 0.15], // E5
            cool: [392, 0.25], // G4
            surprised: [880, 0.1], // A5
            love: [523.25, 0.3], // C5
            tired: [196, 0.6] // G3
        };
        
        const [frequency, duration] = moodSounds[mood] || [440, 0.2];
        this.playTone(frequency, duration);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new EmojiMoodDetector();
    const soundEffects = new SoundEffects();
    
    // Add sound effects to mood changes
    const originalChangeMood = game.changeMood.bind(game);
    game.changeMood = function(button) {
        const mood = button.dataset.mood;
        soundEffects.playMoodSound(mood);
        originalChangeMood(button);
    };
    
    // Add welcome message
    setTimeout(() => {
        console.log('🎮 Face Emoji Mood Detector Loaded!');
        console.log('🎹 Keyboard shortcuts:');
        console.log('   1-8: Select moods');
        console.log('   Space: Random mood');
        console.log('   G: Glow effect');
        console.log('   S: Shake effect');
        console.log('   B: Bounce effect');
    }, 1000);
});

// Export for potential external use
window.EmojiMoodDetector = EmojiMoodDetector;