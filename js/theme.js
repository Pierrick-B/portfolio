// ==============================================
// GESTION DES THÈMES
// ==============================================

class ThemeManager {
  constructor() {
    this.initTheme();
    // Retarder l'initialisation des événements pour s'assurer que le DOM est prêt
    setTimeout(() => this.bindEvents(), 100);
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
    console.log('🎨 ThemeManager: Initialisation des événements...');
    const themeToggle = $('.theme-toggle');
    console.log('🎨 ThemeManager: Bouton trouvé:', themeToggle);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🎨 ThemeManager: Clic sur le bouton de thème détecté');
        this.toggleTheme();
      });
      console.log('🎨 ThemeManager: Événement de clic attaché avec succès');
    } else {
      console.error('❌ ThemeManager: Bouton de thème non trouvé! Tentative de réessai...');
      // Réessayer après un délai si le bouton n'est pas trouvé
      setTimeout(() => this.bindEvents(), 500);
      return;
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

// Export pour utilisation globale
window.ThemeManager = ThemeManager;
