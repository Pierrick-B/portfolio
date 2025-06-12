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
    'Hello moi c\'est Pierrick',
    'Étudiant BUT Informatique',
    'Développeur en devenir',
    'Passionné de numérique'
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
  
  const targetPosition = element.offsetTop - offset;
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

/**
 * Attend qu'un élément soit disponible dans le DOM
 */
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = $(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      const element = $(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Gestion des erreurs gracieuse
 */
function handleError(error, context = '') {
  console.error(`Erreur ${context}:`, error);
  // En production, on pourrait envoyer l'erreur à un service de monitoring
}

/**
 * Vérifie si un élément est visible dans le viewport
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Attend que le DOM soit prêt
 */
function domReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

// Export pour utilisation dans d'autres modules
window.portfolioUtils = {
  CONFIG,
  $,
  $$,
  debounce,
  throttle,
  smoothScrollTo,
  waitForElement,
  handleError,
  isElementInViewport,
  domReady
};
