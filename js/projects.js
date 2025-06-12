/**
 * ===============================================
 * GESTIONNAIRE DES PROJETS
 * ===============================================
 * 
 * Gère l'affichage, le filtrage et les interactions avec les projets :
 * - Système de filtrage par catégorie
 * - Lightbox pour détails des projets
 * - Gestion des animations et transitions
 * - Boutons zoom et navigation
 * 
 * @author Portfolio BUT Informatique
 * @version 1.0.0
 */

// ==============================================
// GESTIONNAIRE PRINCIPAL DES PROJETS
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
    this.initProjectAnimations();
    
    console.log('🎯 Gestionnaire de projets initialisé');
  }

  // ==============================================
  // SYSTÈME DE FILTRAGE
  // ==============================================

  /**
   * Initialise le système de filtrage des projets
   */
  initFilters() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.filterProjects(filter);
        this.updateActiveFilter(btn);
      });
    });
  }

  /**
   * Filtre les projets selon la catégorie sélectionnée
   * @param {string} filter - Catégorie de filtrage ('all', 'web', 'app', 'sae')
   */
  filterProjects(filter) {
    this.projectCards.forEach((card, index) => {
      const categories = card.dataset.category?.split(' ') || [];
      const shouldShow = filter === 'all' || categories.includes(filter);
      
      if (shouldShow) {
        card.classList.remove('hidden');
        card.style.display = 'block';
        
        // Animation d'apparition échelonnée
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      } else {
        card.classList.add('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          if (card.classList.contains('hidden')) {
            card.style.display = 'none';
          }
        }, 300);
      }
    });

    console.log(`🔍 Projets filtrés par: ${filter}`);
  }

  /**
   * Met à jour le bouton de filtre actif
   * @param {HTMLElement} activeBtn - Bouton de filtre sélectionné
   */
  updateActiveFilter(activeBtn) {
    this.filterBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  // ==============================================
  // LIGHTBOX POUR DÉTAILS DES PROJETS
  // ==============================================

  /**
   * Initialise le système de lightbox pour les projets
   */
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

  /**
   * Ouvre le lightbox pour un projet spécifique
   * @param {string} projectId - ID du projet à afficher
   */
  openLightbox(projectId) {
    if (!this.lightbox || !this.lightboxBody) return;

    const content = this.generateProjectContent(projectId);
    this.lightboxBody.innerHTML = content;

    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus management pour l'accessibilité
    if (this.lightboxClose) {
      setTimeout(() => this.lightboxClose.focus(), 100);
    }

    console.log(`🔍 Lightbox ouvert pour le projet: ${projectId}`);
  }

  /**
   * Ferme le lightbox
   */
  closeLightbox() {
    if (!this.lightbox) return;

    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';

    console.log('🔍 Lightbox fermé');
  }

  /**
   * Génère le contenu détaillé d'un projet
   * @param {string} projectId - ID du projet
   * @returns {string} HTML du contenu du projet
   */
  generateProjectContent(projectId) {
    const projects = {
      '1': {
        title: 'Portfolio BUT Informatique',
        description: 'Site web personnel moderne avec thème sombre/clair, animations fluides et analyse de compétences BUT',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Git', 'Responsive Design'],
        features: [
          'Design responsive mobile-first',
          'Animations CSS fluides et performantes',
          'Navigation intelligente avec scroll spy',
          'Mode sombre/clair avec préférences utilisateur',
          'Optimisation des performances et accessibilité',
          'Modularisation du code CSS et JavaScript'
        ],
        github: 'https://github.com/Pierrick-B',
        demo: '#',
        images: ['assets/project1.jpg'],
        context: 'Projet personnel pour présenter mes compétences et projets dans le cadre de ma formation BUT Informatique.',
        challenges: [
          'Création d\'une interface moderne et professionnelle',
          'Implémentation d\'animations fluides sans impact sur les performances',
          'Gestion des thèmes avec persistance des préférences',
          'Optimisation pour tous les types d\'écrans'
        ]
      },
      '2': {
        title: 'Pauvocoder - Traitement Audio',
        description: 'Application Java de traitement audio en temps réel avec interface graphique pour créer des effets vocoder',
        technologies: ['Java', 'JavaFX', 'Audio DSP', 'Algorithmes'],
        features: [
          'Interface graphique intuitive avec JavaFX',
          'Traitement audio en temps réel',
          'Effets vocoder personnalisables',
          'Gestion des fichiers audio',
          'Visualisation des signaux audio'
        ],
        github: '#',
        demo: '#',
        images: ['assets/project1.jpg'],
        context: 'SAÉ 1.2 - Projet de développement en binôme pour créer une application de traitement audio.',
        challenges: [
          'Compréhension des algorithmes de traitement du signal',
          'Optimisation des performances pour le temps réel',
          'Conception d\'une interface utilisateur ergonomique',
          'Collaboration en équipe et gestion du code'
        ]
      },
      '3': {
        title: 'Site d\'analyse Thales',
        description: 'Plateforme web d\'analyse avec intégration iframe pour visualiser et analyser des données complexes',
        technologies: ['HTML', 'CSS', 'JavaScript', 'API', 'Data Visualization'],
        features: [
          'Interface d\'analyse de données',
          'Intégration d\'iframes pour l\'affichage',
          'Visualisation de données complexes',
          'Interface responsive et moderne',
          'Navigation intuitive'
        ],
        github: '#',
        demo: 'https://laura1726.github.io/SAE/histoire.html',
        images: ['assets/project1.jpg'],
        context: 'SAÉ 5.6 - Travail en groupe pour créer une plateforme d\'analyse de données.',
        challenges: [
          'Intégration de sources de données externes',
          'Création d\'interfaces de visualisation',
          'Travail collaboratif en équipe',
          'Gestion de la complexité des données'
        ]
      },
      '4': {
        title: 'Jeu Quixo avec IA',
        description: 'Jeu de stratégie Java avec intelligence artificielle, interface JavaFX et algorithmes de décision',
        technologies: ['Java', 'JavaFX', 'IA', 'Algorithmes', 'Architecture MVC'],
        features: [
          'Jeu Quixo complet avec règles officielles',
          'Intelligence artificielle avec algorithmes de décision',
          'Interface graphique JavaFX moderne',
          'Architecture MVC bien structurée',
          'Gestion des événements et interactions utilisateur'
        ],
        github: '#',
        demo: '#',
        images: ['assets/menu_quixo.png'],
        context: 'SAÉ 1.2.6 - Développement d\'un jeu intelligent en binôme avec implémentation d\'algorithmes d\'IA.',
        challenges: [
          'Implémentation des règles complexes du Quixo',
          'Développement d\'algorithmes d\'intelligence artificielle',
          'Création d\'une interface utilisateur attrayante',
          'Optimisation des performances de l\'IA'
        ]
      }
    };

    const project = projects[projectId];
    if (!project) {
      return '<p class="error-message">Projet non trouvé</p>';
    }

    return `
      <div class="project-detail">
        <div class="project-detail-header">
          <h2 class="project-detail-title">${project.title}</h2>
          <p class="project-detail-description">${project.description}</p>
        </div>

        <div class="project-detail-content">
          <div class="project-detail-section">
            <h3>🛠️ Technologies utilisées</h3>
            <div class="tech-tags">
              ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
          </div>

          <div class="project-detail-section">
            <h3>⚡ Fonctionnalités principales</h3>
            <ul class="features-list">
              ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>

          <div class="project-detail-section">
            <h3>📋 Contexte du projet</h3>
            <p class="project-context">${project.context}</p>
          </div>

          <div class="project-detail-section">
            <h3>🎯 Défis relevés</h3>
            <ul class="challenges-list">
              ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
            </ul>
          </div>

          <div class="project-detail-actions">
            <a href="${project.github}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Voir le code
            </a>
            ${project.demo !== '#' ? `
              <a href="${project.demo}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                  <path d="M18 13V6A2 2 0 0 0 16 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H11"/>
                  <circle cx="18" cy="18" r="3"/>
                  <path d="M22 18L20 20L18 18"/>
                </svg>
                Voir la démo
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // ==============================================
  // ANIMATIONS DES PROJETS
  // ==============================================

  /**
   * Initialise les animations d'apparition des projets
   */
  initProjectAnimations() {
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

    this.projectCards.forEach(card => {
      // État initial pour l'animation
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      projectObserver.observe(card);
    });
  }

  /**
   * Anime l'hover des cartes de projet
   */
  initHoverEffects() {
    this.projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }

  // ==============================================
  // MÉTHODES UTILITAIRES
  // ==============================================

  /**
   * Compte le nombre de projets par catégorie
   * @returns {Object} Comptage par catégorie
   */
  getProjectStats() {
    const stats = { all: 0, web: 0, app: 0, sae: 0 };
    
    this.projectCards.forEach(card => {
      stats.all++;
      const categories = card.dataset.category?.split(' ') || [];
      categories.forEach(cat => {
        if (stats[cat] !== undefined) {
          stats[cat]++;
        }
      });
    });

    return stats;
  }

  /**
   * Recherche des projets par mot-clé
   * @param {string} keyword - Mot-clé de recherche
   */
  searchProjects(keyword) {
    if (!keyword.trim()) {
      this.filterProjects('all');
      return;
    }

    this.projectCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const description = card.querySelector('p')?.textContent.toLowerCase() || '';
      const tags = Array.from(card.querySelectorAll('.tag')).map(tag => 
        tag.textContent.toLowerCase()
      ).join(' ');

      const searchText = `${title} ${description} ${tags}`;
      const isMatch = searchText.includes(keyword.toLowerCase());

      card.style.display = isMatch ? 'block' : 'none';
      card.style.opacity = isMatch ? '1' : '0';
    });

    console.log(`🔍 Recherche effectuée: "${keyword}"`);
  }
}

// Export pour usage modulaire
window.ProjectManager = ProjectManager;

// Auto-initialisation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.projectManager = new ProjectManager();
  });
} else {
  window.projectManager = new ProjectManager();
}
