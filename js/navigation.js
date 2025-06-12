// ==============================================
// NAVIGATION INTELLIGENTE
// ==============================================

class NavigationManager {
  constructor() {
    this.nav = $('.nav-floating');
    this.navLinks = $$('.nav-link');
    this.sections = $$('section[id]');
    this.navToggle = $('.nav-toggle');
    this.navMenu = $('.nav-menu');
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
    
    // Navigation clavier pour accessibilité
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          this.navigateToSection(targetId);
          this.closeMenu();
        }
      });
      
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    });
    
    // Toggle menu mobile
    if (this.navToggle) {
      this.navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMenu();
      });
    }
    
    // Fermer le menu si clic en dehors
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.nav.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // Gestion du redimensionnement
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMenu();
      }
    }, 250));
  }
  
  handleScroll() {
    const scrolled = window.pageYOffset > 100;
    
    if (scrolled !== navScrolled) {
      navScrolled = scrolled;
      
      if (this.nav) {
        this.nav.classList.toggle('scrolled', scrolled);
      }
    }
    
    // Mettre à jour la section active
    this.updateActiveSection();
  }
  
  updateActiveSection() {
    let current = '';
    const scrollY = window.pageYOffset;
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  navigateToSection(targetId) {
    const target = $(targetId);
    if (target) {
      const offset = this.nav ? this.nav.offsetHeight + 20 : 80;
      smoothScrollTo(target, offset);
      
      // Mettre à jour l'URL sans recharger la page
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    }
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    if (this.navMenu) {
      this.navMenu.classList.toggle('active', this.isMenuOpen);
    }
    
    if (this.navToggle) {
      this.navToggle.classList.toggle('active', this.isMenuOpen);
      this.navToggle.setAttribute('aria-expanded', this.isMenuOpen);
    }
    
    // Prévenir le scroll du body quand le menu est ouvert
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }
  
  closeMenu() {
    if (this.isMenuOpen) {
      this.toggleMenu();
    }
  }
  
  initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetId = entry.target.getAttribute('id');
          const correspondingLink = $(`.nav-link[href="#${targetId}"]`);
          
          if (correspondingLink) {
            this.navLinks.forEach(link => link.classList.remove('active'));
            correspondingLink.classList.add('active');
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0.1
    });
    
    this.sections.forEach(section => {
      observer.observe(section);
    });
  }
}

// Export pour utilisation globale
window.NavigationManager = NavigationManager;
