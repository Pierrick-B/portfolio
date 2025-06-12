// ==============================================
// FICHIER PRINCIPAL - INITIALISATION
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Portfolio - Initialisation...');
  
  try {
    // Initialiser la gestion des thèmes
    const themeManager = new ThemeManager();
    console.log('✅ ThemeManager initialisé');
    
    // Initialiser la navigation
    const navigationManager = new NavigationManager();
    console.log('✅ NavigationManager initialisé');
    
    // Initialiser les animations
    if (window.AnimationManager) {
      const animationManager = new AnimationManager();
      console.log('✅ AnimationManager initialisé');
    }
    
    // Initialiser les modales
    if (window.ModalManager) {
      const modalManager = new ModalManager();
      console.log('✅ ModalManager initialisé');
    }
    
    // Initialiser les projets
    if (window.ProjectManager) {
      const projectManager = new ProjectManager();
      console.log('✅ ProjectManager initialisé');
    }
    
    console.log('🎉 Portfolio entièrement initialisé!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  }
});
