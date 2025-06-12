/**
 * ===============================================
 * GESTIONNAIRE DES MODALS
 * ===============================================
 * 
 * Gère l'affichage et la fermeture des différents types de modals :
 * - Modals SAÉ (détails des projets scolaires)
 * - Modal d'images (affichage en grand format)
 * - Gestion des interactions clavier et clic externe
 * 
 * @author Portfolio BUT Informatique
 * @version 1.0.0
 */

// ==============================================
// GESTIONNAIRE DES MODALS SAÉ
// ==============================================

/**
 * Gestionnaire principal des modals SAÉ
 */
class SaeModalManager {
  constructor() {
    this.setupModalEvents();
    this.setupKeyboardEvents();
  }

  /**
   * Ouvre un modal SAÉ spécifique
   * @param {string} saeId - ID du SAÉ à afficher
   */
  openSaeModal(saeId) {
    const modal = document.getElementById(`saeModal${saeId}`);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Empêche le scroll de la page
      
      // Focus sur le bouton de fermeture pour l'accessibilité
      const closeBtn = modal.querySelector('.sae-modal-close');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 100);
      }
      
      console.log(`📋 Modal SAÉ ${saeId} ouverte`);
    }
  }

  /**
   * Ferme un modal SAÉ spécifique
   * @param {string} saeId - ID du SAÉ à fermer
   */
  closeSaeModal(saeId) {
    const modal = document.getElementById(`saeModal${saeId}`);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restaure le scroll de la page
      
      console.log(`📋 Modal SAÉ ${saeId} fermée`);
    }
  }

  /**
   * Configure les événements de fermeture des modals
   */
  setupModalEvents() {
    // Ferme les modals en cliquant à l'extérieur
    document.querySelectorAll('.sae-modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          const saeId = modal.id.replace('saeModal', '');
          this.closeSaeModal(saeId);
        }
      });
    });
  }

  /**
   * Gestion de la touche Escape pour fermer les modals
   */
  setupKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.sae-modal.active').forEach(modal => {
          const saeId = modal.id.replace('saeModal', '');
          this.closeSaeModal(saeId);
        });
      }
    });
  }
}

// ==============================================
// GESTIONNAIRE DES MODALS D'IMAGES
// ==============================================

/**
 * Gestionnaire des modals pour l'affichage d'images en grand format
 */
class ImageModalManager {
  constructor() {
    this.setupImageModalEvents();
    this.setupImageClickHandlers();
  }

  /**
   * Ouvre la modal pour afficher une image en grand
   * @param {string} imageSrc - Source de l'image
   * @param {string} caption - Légende de l'image (optionnel)
   */
  openImageModal(imageSrc, caption = '') {
    const modal = $('#imageModal');
    const modalImage = $('#modalImage');
    const modalCaption = $('#modalCaption');
    
    if (modal && modalImage) {
      modalImage.src = imageSrc;
      modalImage.alt = caption;
      
      // Gestion de la légende
      if (modalCaption) {
        if (caption) {
          modalCaption.textContent = caption;
          modalCaption.style.display = 'block';
        } else {
          modalCaption.style.display = 'none';
        }
      }
      
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Empêcher le scroll de la page
      
      // Focus sur le bouton de fermeture
      const closeBtn = modal.querySelector('.image-modal-close');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 100);
      }
      
      console.log('📸 Image modal ouverte:', imageSrc);
    }
  }

  /**
   * Ferme la modal d'image
   */
  closeImageModal() {
    const modal = $('#imageModal');
    
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Rétablir le scroll
      
      console.log('📸 Image modal fermée');
    }
  }

  /**
   * Configure les événements de fermeture de la modal d'image
   */
  setupImageModalEvents() {
    // Fermeture en cliquant en dehors de l'image
    document.addEventListener('click', (e) => {
      const modal = $('#imageModal');
      if (e.target === modal) {
        this.closeImageModal();
      }
    });

    // Fermeture avec la touche Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = $('#imageModal');
        if (modal?.classList.contains('active')) {
          this.closeImageModal();
        }
      }
    });

    // Bouton de fermeture
    const closeBtn = $('.image-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeImageModal());
    }
  }

  /**
   * Configure les gestionnaires de clic pour les images cliquables
   */
  setupImageClickHandlers() {
    // Image Quixo spécifique
    document.addEventListener('DOMContentLoaded', () => {
      const quixoImage = $('.quixo-menu-image');
      if (quixoImage && !quixoImage.onclick) {
        quixoImage.style.cursor = 'pointer';
        quixoImage.onclick = () => {
          this.openImageModal('assets/menu_quixo.png', 'Interface du jeu Quixo');
        };
      }

      // Images SAÉ dans les modals
      const saeImages = $$('.sae-image');
      saeImages.forEach(img => {
        if (!img.onclick) {
          img.style.cursor = 'pointer';
          img.onclick = () => {
            const caption = img.alt || 'Image du projet';
            this.openImageModal(img.src, caption);
          };
        }
      });

      // Images e-commerce
      const ecommerceImage = $('.ecommerce-site-image');
      if (ecommerceImage && !ecommerceImage.onclick) {
        ecommerceImage.style.cursor = 'pointer';
        ecommerceImage.onclick = () => {
          this.openImageModal(ecommerceImage.src, 'Interface du site e-commerce');
        };
      }
    });
  }
}

// ==============================================
// GESTIONNAIRE GLOBAL DES MODALS
// ==============================================

/**
 * Gestionnaire principal qui coordonne tous les types de modals
 */
class ModalManager {
  constructor() {
    this.saeModals = new SaeModalManager();
    this.imageModals = new ImageModalManager();
    
    // Exposer les méthodes globalement pour compatibilité
    this.exposeGlobalMethods();
  }

  /**
   * Expose les méthodes pour usage global (compatibilité avec HTML onclick)
   */
  exposeGlobalMethods() {
    // Méthodes SAÉ
    window.openSaeModal = (saeId) => this.saeModals.openSaeModal(saeId);
    window.closeSaeModal = (saeId) => this.saeModals.closeSaeModal(saeId);
    
    // Méthodes images
    window.openImageModal = (src, caption) => this.imageModals.openImageModal(src, caption);
    window.closeImageModal = () => this.imageModals.closeImageModal();
  }

  /**
   * Initialise tous les gestionnaires de modals
   */
  init() {
    console.log('🎭 Gestionnaire de modals initialisé');
  }
}

// ==============================================
// FONCTIONS GLOBALES POUR LES MODALS
// ==============================================

/**
 * Fonctions globales exposées pour l'usage dans le HTML
 */
window.openSaeModal = function(saeId) {
  if (window.modalManager && window.modalManager.saeModalManager) {
    window.modalManager.saeModalManager.openSaeModal(saeId);
  }
};

window.closeSaeModal = function(saeId) {
  if (window.modalManager && window.modalManager.saeModalManager) {
    window.modalManager.saeModalManager.closeSaeModal(saeId);
  }
};

window.openImageModal = function(imageSrc, caption = '') {
  if (window.modalManager && window.modalManager.imageModalManager) {
    window.modalManager.imageModalManager.openImageModal(imageSrc, caption);
  }
};

window.closeImageModal = function() {
  if (window.modalManager && window.modalManager.imageModalManager) {
    window.modalManager.imageModalManager.closeImageModal();
  }
};

// Export pour usage modulaire
window.ModalManager = ModalManager;

// Auto-initialisation si le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new ModalManager();
    window.modalManager.init();
  });
} else {
  window.modalManager = new ModalManager();
  window.modalManager.init();
}
