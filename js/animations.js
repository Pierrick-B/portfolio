// ==============================================
// ANIMATIONS ET EFFETS VISUELS
// ==============================================

class AnimationManager {
  constructor() {
    this.initAnimations();
    this.initScrollAnimations();
    this.initTypingAnimation();
    this.initProgressBars();
    this.initStatCounters();
  }
  
  initAnimations() {
    // Animation d'apparition au scroll
    const animatedElements = $$('.fade-in, .slide-up');
    
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
      animationObserver.observe(el);
    });
  }
  
  initScrollAnimations() {
    // Parallax subtil pour certains éléments
    const parallaxElements = $$('.hero-bg, .floating-card');
    
    window.addEventListener('scroll', throttle(() => {
      const scrollY = window.scrollY;
      
      parallaxElements.forEach(el => {
        const speed = el.dataset.speed || 0.5;
        const transform = `translateY(${scrollY * speed}px)`;
        el.style.transform = transform;
      });
    }, 16));
  }
  
  initTypingAnimation() {
    const typingElement = $('.typing-text');
    if (!typingElement) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typeText = () => {
      const currentText = CONFIG.typingTexts[textIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }
      
      let typeSpeed = CONFIG.typingSpeed;
      
      if (isDeleting) {
        typeSpeed /= 2;
      }
      
      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000; // Pause à la fin
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % CONFIG.typingTexts.length;
        typeSpeed = 500; // Pause avant le nouveau texte
      }
      
      setTimeout(typeText, typeSpeed);
    };
    
    // Démarrer l'animation après un délai
    setTimeout(typeText, 1000);
  }
  
  initProgressBars() {
    const progressBars = $$('.progress-bar');
    
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const targetWidth = progressBar.dataset.width;
          
          setTimeout(() => {
            progressBar.style.width = `${targetWidth}%`;
          }, 200);
          
          progressObserver.unobserve(progressBar);
        }
      });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
      progressObserver.observe(bar);
    });
    
    // Gestion des cercles de progression
    const progressRings = $$('.progress-ring-circle');
    
    const ringObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const ring = entry.target;
          const progress = parseInt(ring.dataset.progress);
          const circumference = 2 * Math.PI * 52; // r = 52
          const offset = circumference - (progress / 100) * circumference;
          
          setTimeout(() => {
            ring.style.strokeDashoffset = offset;
          }, 500);
          
          ringObserver.unobserve(ring);
        }
      });
    }, { threshold: 0.5 });
    
    progressRings.forEach(ring => {
      const circumference = 2 * Math.PI * 52;
      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = circumference;
      ringObserver.observe(ring);
    });
  }
  
  initStatCounters() {
    const statNumbers = $$('.stat-number');
    
    const countUp = (element, target) => {
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current);
      }, 16);
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.dataset.target);
          
          setTimeout(() => {
            countUp(element, target);
          }, 300);
          
          counterObserver.unobserve(element);
        }
      });
    }, { threshold: 0.7 });
    
    statNumbers.forEach(stat => {
      counterObserver.observe(stat);
    });
  }
  
  // Animation pour les cartes SAÉ qui se retournent
  initCardFlips() {
    const saeCards = $$('.sae-card');
    
    saeCards.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
      
      // Gestion clavier pour accessibilité
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('flipped');
        }
      });
    });
  }
  
  // Animation d'apparition pour les projets
  initProjectAnimations() {
    const projectCards = $$('.project-card');
    
    const projectObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          
          projectObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    projectCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      projectObserver.observe(card);
    });
  }
}

// Export pour utilisation globale
window.AnimationManager = AnimationManager;
