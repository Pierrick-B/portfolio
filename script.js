// ==============================================
// CONFIGURATION ET VARIABLES GLOBALES
// ==============================================

const CONFIG = {
  // Délais d'animation et transitions
  animationDelay: 200,
  scrollThreshold: 100,
  typingSpeed: 100,
  
  // Options d'intersection observer
  observerOptions: {
    root: null,
    rootMargin: '0px 0px -20% 0px',
    threshold: 0.1
  },
  
  // Textes pour l'animation de frappe
  typingTexts: [
    'Étudiant BUT Informatique',
    'Développeur Frontend',
    'Passionné de code',
    'Future développeur fullstack'
  ]
};

// Variables globales
let currentTheme = localStorage.getItem('theme') || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
let currentTypingIndex = 0;
let isTyping = false;
let navScrolled = false;

// ==============================================
// UTILITAIRES GLOBAUX
// ==============================================

/**
 * Utilitaire pour sélectionner des éléments DOM
 */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/**
 * Debounce function pour optimiser les performances
 */
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

/**
 * Throttle function pour les événements de scroll
 */
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

/**
 * Animation smooth vers une section
 */
function smoothScrollTo(target, offset = 0) {
  const element = typeof target === 'string' ? $(target) : target;
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

/**
 * Génère un ID unique
 */
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// ==============================================
// GESTION DES THÈMES
// ==============================================

class ThemeManager {
  constructor() {
    this.initTheme();
    this.bindEvents();
  }
  
  initTheme() {
    // Appliquer le thème au chargement
    document.documentElement.setAttribute('data-theme', currentTheme);
    this.updateThemeIcon();
    
    // Forcer l'application du thème sur le body aussi
    document.body.setAttribute('data-theme', currentTheme);
  }
  
  toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    this.updateThemeIcon();
    
    // Animation de transition fluide
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
    
    // Annoncer le changement pour l'accessibilité
    if (window.announceToScreenReader) {
      window.announceToScreenReader(
        `Mode ${currentTheme === 'dark' ? 'sombre' : 'clair'} activé`
      );
    }
  }
  
  updateThemeIcon() {
    const toggle = $('.theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-label', 
        currentTheme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'
      );
    }
  }
    bindEvents() {
    const themeToggle = $('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        currentTheme = e.matches ? 'dark' : 'light';
        this.initTheme();
      }
    });
  }
}

// ==============================================
// NAVIGATION INTELLIGENTE
// ==============================================

class NavigationManager {
  constructor() {
    this.nav = $('#mainNav');
    this.navLinks = $$('.nav-link');
    this.sections = $$('section[id]');
    this.navToggle = $('#navToggle');
    this.navMenu = $('#navMenu');
    this.isMenuOpen = false;
    
    this.initNavigation();
    this.bindEvents();
    this.initIntersectionObserver();
  }
  
  initNavigation() {
    // Marquer la section active au chargement
    this.updateActiveSection();
  }
  
  bindEvents() {
    // Gestion du scroll pour la nav flottante
    window.addEventListener('scroll', throttle(() => {
      this.handleScroll();
    }, 16));
    
    // Navigation par liens
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = $(targetId);
        
        if (target) {
          smoothScrollTo(target, 100);
          this.closeMenu();
        }
      });
    });
    
    // Toggle menu mobile
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMenu());
    }
    
    // Fermer le menu sur clic extérieur
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.nav.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // Navigation au clavier
    this.navLinks.forEach(link => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    });
  }
  
  handleScroll() {
    const scrollY = window.scrollY;
    
    // Effet de flottement de la nav
    if (scrollY > CONFIG.scrollThreshold && !navScrolled) {
      this.nav?.classList.add('scrolled');
      navScrolled = true;
    } else if (scrollY <= CONFIG.scrollThreshold && navScrolled) {
      this.nav?.classList.remove('scrolled');
      navScrolled = false;
    }
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.navMenu?.classList.toggle('active', this.isMenuOpen);
    this.navToggle?.classList.toggle('active', this.isMenuOpen);
    
    // Accessibility
    this.navToggle?.setAttribute('aria-expanded', this.isMenuOpen);
    this.navToggle?.setAttribute('aria-label', 
      this.isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'
    );
  }
  
  closeMenu() {
    this.isMenuOpen = false;
    this.navMenu?.classList.remove('active');
    this.navToggle?.classList.remove('active');
    this.navToggle?.setAttribute('aria-expanded', 'false');
    this.navToggle?.setAttribute('aria-label', 'Ouvrir le menu');
  }
  
  updateActiveSection() {
    let currentSection = '';
    const scrollY = window.scrollY;
    
    this.sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top + scrollY - 150;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    // Mettre à jour les liens actifs
    this.navLinks.forEach(link => {
      const targetSection = link.getAttribute('href')?.substring(1);
      link.classList.toggle('active', targetSection === currentSection);
    });
  }
  
  initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.setActiveLink(id);
        }
      });
    }, CONFIG.observerOptions);
    
    this.sections.forEach(section => {
      observer.observe(section);
    });
  }
  
  setActiveLink(sectionId) {
    this.navLinks.forEach(link => {
      const targetSection = link.getAttribute('href')?.substring(1);
      link.classList.toggle('active', targetSection === sectionId);
    });
  }
}

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
    
    // Démarrer l'animation après un court délai
    setTimeout(typeText, 1000);
  }
  
  initProgressBars() {
    const progressBars = $$('.progress-bar');
    const progressRings = $$('.progress-ring-circle');
    
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          if (element.classList.contains('progress-bar')) {
            const width = element.dataset.width || 0;
            setTimeout(() => {
              element.style.width = `${width}%`;
            }, 200);
          }
          
          if (element.classList.contains('progress-ring-circle')) {
            const progress = element.dataset.progress || 0;
            const circumference = 2 * Math.PI * 52; // 52 est le rayon
            const offset = circumference - (progress / 100) * circumference;
            
            setTimeout(() => {
              element.style.strokeDashoffset = offset;
            }, 500);
          }
          
          progressObserver.unobserve(element);
        }
      });
    }, { threshold: 0.5 });
    
    [...progressBars, ...progressRings].forEach(el => {
      progressObserver.observe(el);
    });
  }
  
  initStatCounters() {
    const statNumbers = $$('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.dataset.target) || 0;
          const duration = 2000;
          const start = performance.now();
          
          const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            element.textContent = current;
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              element.textContent = target;
            }
          };
          
          requestAnimationFrame(animate);
          counterObserver.unobserve(element);
        }
      });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(el => {
      counterObserver.observe(el);
    });
  }
}

// ==============================================
// GESTIONNAIRE DE COMPÉTENCES INTERACTIVES
// ==============================================

class CompetenceManager {
  constructor() {
    this.saeCards = $$('.sae-card');
    this.initSAECards();
  }
  
  initSAECards() {
    this.saeCards.forEach(card => {
      card.addEventListener('click', () => this.flipCard(card));
      
      // Accessibilité clavier
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.flipCard(card);
        }
      });
      
      // Rendre focusable
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Cliquer pour voir les détails du projet');
    });
  }
  
  flipCard(card) {
    card.classList.toggle('flipped');
    
    // Mise à jour de l'accessibilité
    const isFlipped = card.classList.contains('flipped');
    card.setAttribute('aria-label', 
      isFlipped ? 'Cliquer pour revenir à l\'aperçu' : 'Cliquer pour voir les détails du projet'
    );
  }
}

// ==============================================
// GESTIONNAIRE DE PROJETS ET FILTRAGE
// ==============================================

class ProjectManager {
  constructor() {
    this.filterBtns = $$('.filter-btn');
    this.projectCards = $$('.project-card');
    this.lightbox = $('#lightbox');
    this.lightboxBody = $('#lightboxBody');
    this.lightboxClose = $('#lightboxClose');
    
    this.initFilters();
    this.initLightbox();
  }
  
  initFilters() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.filterProjects(filter);
        this.updateActiveFilter(btn);
      });
    });
  }
  
  filterProjects(filter) {
    this.projectCards.forEach(card => {
      const categories = card.dataset.category?.split(' ') || [];
      const shouldShow = filter === 'all' || categories.includes(filter);
      
      if (shouldShow) {
        card.classList.remove('hidden');
        card.style.display = 'block';
      } else {
        card.classList.add('hidden');
        setTimeout(() => {
          if (card.classList.contains('hidden')) {
            card.style.display = 'none';
          }
        }, 300);
      }
    });
  }
  
  updateActiveFilter(activeBtn) {
    this.filterBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }
  
  initLightbox() {
    // Boutons zoom sur les projets
    const zoomBtns = $$('.btn-zoom');
    zoomBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = btn.dataset.project;
        this.openLightbox(projectId);
      });
    });
    
    // Fermeture du lightbox
    if (this.lightboxClose) {
      this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    }
    
    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) {
          this.closeLightbox();
        }
      });
    }
    
    // Fermeture par échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox?.classList.contains('active')) {
        this.closeLightbox();
      }
    });
  }
  
  openLightbox(projectId) {
    if (!this.lightbox || !this.lightboxBody) return;
    
    // Contenu dynamique du lightbox (à personnaliser)
    const content = this.generateProjectContent(projectId);
    this.lightboxBody.innerHTML = content;
    
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    this.lightboxClose?.focus();
  }
  
  closeLightbox() {
    if (!this.lightbox) return;
    
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  generateProjectContent(projectId) {
    // Contenu exemple - à personnaliser selon vos projets
    const projects = {
      '1': {
        title: 'Portfolio Responsive',
        description: 'Site web personnel avec animations CSS et interactivité JavaScript',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Git'],
        features: [
          'Design responsive mobile-first',
          'Animations CSS fluides',
          'Navigation intelligente',
          'Mode sombre/clair',
          'Optimisation des performances'
        ],
        github: '#',
        demo: '#',
        images: ['assets/project1-1.jpg', 'assets/project1-2.jpg']
      }
    };
    
    const project = projects[projectId];
    if (!project) return '<p>Projet non trouvé</p>';
    
    return `
      <div class="project-detail">
        <h2>${project.title}</h2>
        <p class="project-description">${project.description}</p>
        
        <div class="project-tech">
          <h3>Technologies utilisées</h3>
          <div class="tech-tags">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        </div>
        
        <div class="project-features">
          <h3>Fonctionnalités principales</h3>
          <ul>
            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        <div class="project-links">
          <a href="${project.github}" class="btn btn-primary" target="_blank">
            Voir sur GitHub
          </a>
          <a href="${project.demo}" class="btn btn-secondary" target="_blank">
            Démo en ligne
          </a>
        </div>
      </div>
    `;
  }
}

// ==============================================
// FORMULAIRE DE CONTACT INTELLIGENT
// ==============================================

class ContactFormManager {
  constructor() {
    this.form = $('#contactForm');
    this.inputs = $$('#contactForm input, #contactForm textarea');
    
    if (this.form) {
      this.initForm();
    }
  }
  
  initForm() {
    // Validation en temps réel
    this.inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearErrors(input));
    });
    
    // Soumission du formulaire
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const group = field.closest('.form-group');
    const feedback = group?.querySelector('.form-feedback');
    
    let isValid = true;
    let message = '';
    
    // Validation selon le type de champ
    switch (fieldName) {
      case 'name':
        if (!value) {
          isValid = false;
          message = 'Le nom est requis';
        } else if (value.length < 2) {
          isValid = false;
          message = 'Le nom doit contenir au moins 2 caractères';
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          isValid = false;
          message = 'L\'email est requis';
        } else if (!emailRegex.test(value)) {
          isValid = false;
          message = 'Format d\'email invalide';
        }
        break;
        
      case 'subject':
        if (!value) {
          isValid = false;
          message = 'Le sujet est requis';
        } else if (value.length < 5) {
          isValid = false;
          message = 'Le sujet doit contenir au moins 5 caractères';
        }
        break;
        
      case 'message':
        if (!value) {
          isValid = false;
          message = 'Le message est requis';
        } else if (value.length < 10) {
          isValid = false;
          message = 'Le message doit contenir au moins 10 caractères';
        }
        break;
    }
    
    // Mettre à jour l'interface
    this.updateFieldStatus(group, feedback, isValid, message);
    return isValid;
  }
  
  updateFieldStatus(group, feedback, isValid, message) {
    if (!group || !feedback) return;
    
    group.classList.remove('valid', 'invalid');
    feedback.classList.remove('success', 'error');
    
    if (isValid) {
      group.classList.add('valid');
      feedback.classList.add('success');
      feedback.textContent = '✓ Valide';
    } else {
      group.classList.add('invalid');
      feedback.classList.add('error');
      feedback.textContent = message;
    }
  }
  
  clearErrors(field) {
    const group = field.closest('.form-group');
    if (group?.classList.contains('invalid')) {
      group.classList.remove('invalid');
      const feedback = group.querySelector('.form-feedback');
      if (feedback) {
        feedback.classList.remove('error');
        feedback.textContent = '';
      }
    }
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    // Valider tous les champs
    let isFormValid = true;
    this.inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      this.showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }
    
    // Simulation d'envoi (remplacer par votre logique d'envoi)
    this.simulateFormSubmission();
  }
  
  simulateFormSubmission() {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // État de chargement
    submitBtn.innerHTML = '<span>Envoi en cours...</span>';
    submitBtn.disabled = true;
    
    // Simulation d'envoi
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Reset du formulaire
      this.form.reset();
      this.inputs.forEach(input => {
        const group = input.closest('.form-group');
        group?.classList.remove('valid', 'invalid');
        const feedback = group?.querySelector('.form-feedback');
        if (feedback) {
          feedback.classList.remove('success', 'error');
          feedback.textContent = '';
        }
      });
      
      this.showNotification('Message envoyé avec succès !', 'success');
    }, 2000);
  }
  
  showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles inline pour la notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      color: 'white',
      backgroundColor: type === 'success' ? '#10b981' : 
                      type === 'error' ? '#ef4444' : '#3b82f6',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      zIndex: '9999',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 4000);
  }
}

// ==============================================
// GESTIONNAIRE DE PERFORMANCES
// ==============================================

class PerformanceManager {
  constructor() {
    this.initLazyLoading();
    this.initPreloader();
  }
  
  initLazyLoading() {
    const images = $$('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
      });
    }
  }
  
  initPreloader() {
    window.addEventListener('load', () => {
      // Masquer le preloader s'il existe
      const preloader = $('.preloader');
      if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 300);
      }
      
      // Déclencher les animations d'entrée
      document.body.classList.add('loaded');
    });
  }
}

// ==============================================
// EFFETS VISUELS AVANCÉS
// ==============================================

class VisualEffectsManager {
  constructor() {
    this.initParallax();
    this.initMouseEffects();
    this.initCodeRain();
  }
  
  initParallax() {
    const parallaxElements = $$('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', throttle(() => {
      const scrollY = window.scrollY;
      
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }, 16));
  }
    initMouseEffects() {
    // Effet de suivi de souris simplifié pour les cartes
    const cards = $$('.component-card, .sae-card, .project-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.3s ease';
        card.style.transform = 'translateY(-2px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }
  
  initCodeRain() {
    const codeRain = $('.code-rain');
    if (!codeRain) return;
    
    // Créer des particules de code animées
    const particles = [];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: rgba(59, 130, 246, 0.1);
        pointer-events: none;
        user-select: none;
      `;
      
      particle.textContent = Math.random() > 0.5 ? '0' : '1';
      codeRain.appendChild(particle);
      
      particles.push({
        element: particle,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.5 + Math.random() * 1.5
      });
    }
    
    // Animation des particules
    const animateParticles = () => {
      particles.forEach(particle => {
        particle.y += particle.speed;
        
        if (particle.y > 100) {
          particle.y = -10;
          particle.x = Math.random() * 100;
        }
        
        particle.element.style.left = `${particle.x}%`;
        particle.element.style.top = `${particle.y}%`;
      });
      
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
  }
}

// ==============================================
// GESTIONNAIRE D'ACCESSIBILITÉ
// ==============================================

class AccessibilityManager {
  constructor() {
    this.initKeyboardNavigation();
    this.initFocusManagement();
    this.initScreenReaderSupport();
  }
  
  initKeyboardNavigation() {
    // Navigation par Tab améliorée
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
  
  initFocusManagement() {
    // Gestion du focus pour les éléments interactifs
    const focusableElements = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.classList.add('focused');
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('focused');
      });
    });
  }
  
  initScreenReaderSupport() {
    // Announcements pour les changements dynamiques
    const createAnnouncement = (message) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    };
    
    // Exposer la fonction globalement pour les autres composants
    window.announceToScreenReader = createAnnouncement;
  }
}

// ==============================================
// INITIALISATION PRINCIPALE
// ==============================================

class PortfolioApp {
  constructor() {
    this.managers = {};
    this.init();
  }
  
  async init() {
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeManagers());
    } else {
      this.initializeManagers();
    }
  }
  
  initializeManagers() {
    try {
      // Initialiser tous les gestionnaires
      this.managers.theme = new ThemeManager();
      this.managers.navigation = new NavigationManager();
      this.managers.animation = new AnimationManager();
      this.managers.competence = new CompetenceManager();
      this.managers.project = new ProjectManager();
      this.managers.contactForm = new ContactFormManager();
      this.managers.performance = new PerformanceManager();
      this.managers.visualEffects = new VisualEffectsManager();
      this.managers.accessibility = new AccessibilityManager();
      
      // Ajouter les styles CSS pour l'accessibilité
      this.addAccessibilityStyles();
      
      console.log('🎉 Portfolio initialisé avec succès !');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
    }
  }
  
  addAccessibilityStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      .keyboard-navigation *:focus {
        outline: 2px solid var(--color-primary) !important;
        outline-offset: 2px !important;
      }
      
      .focused {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3) !important;
      }
      
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
}

// ==============================================
// LANCEMENT DE L'APPLICATION
// ==============================================

// Initialiser l'application
const app = new PortfolioApp();

// Exposer certaines fonctions globalement pour le debug
window.portfolioApp = app;
window.smoothScrollTo = smoothScrollTo;

// Service Worker pour la mise en cache (optionnel)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker enregistré:', registration);
      })
      .catch(error => {
        console.log('Échec de l\'enregistrement du Service Worker:', error);
      });
  });
}

// Analytics et performance monitoring (à personnaliser)
window.addEventListener('load', () => {
  // Mesurer les performances de chargement
  const performanceData = {
    loadTime: performance.now(),
    domContentLoaded: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd,
    firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
    firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
  };
  
  console.log('📊 Performances de chargement:', performanceData);
});

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
  console.error('❌ Erreur JavaScript:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('❌ Promise rejetée:', e.reason);
});
