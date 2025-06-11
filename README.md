# Portfolio BUT Informatique - Guide de Personnalisation

## 🎯 Présentation

Ce portfolio a été conçu spécifiquement pour les étudiants BUT Informatique afin de présenter leurs compétences selon le référentiel officiel. Il respecte tous les critères pédagogiques demandés tout en offrant une expérience utilisateur moderne et engageante.

## 📁 Structure du Projet

```
Portfolio/
├── index.html          # Structure HTML principale
├── style.css          # Styles CSS avec variables personnalisables
├── script.js          # JavaScript pour les interactions
├── assets/            # Ressources (images, icônes, etc.)
│   ├── favicon.svg    # Icône du site
│   └── project1.jpg   # Images de projets (placeholder)
└── README.md          # Ce fichier
```

## 🎨 Personnalisation Facile

### 1. Modification des Informations Personnelles

#### Dans `index.html`, modifiez les sections suivantes :

**Hero Section (ligne ~60)** :
```html
<h1 class="hero-title">
    <span class="typing-text">Votre Nom</span>
    <span class="cursor">|</span>
</h1>
<p class="hero-subtitle">
    Votre description personnelle...
</p>
```

**Section À Propos (ligne ~200)** :
```html
<p>
    Remplacez par votre parcours personnel...
</p>
```

**Contact (ligne ~800)** :
```html
<p>votre.email@example.com</p>
<p>Votre localisation</p>
<p>github.com/votre-username</p>
```

### 2. Choix des Compétences à Analyser

Le portfolio est configuré pour **2 compétences**. Pour changer les compétences analysées :

#### Modifier les titres des sections (lignes ~300 et ~500) :
```html
<!-- Compétence 1 -->
<h2 class="section-title">Votre Compétence 1</h2>

<!-- Compétence 2 -->
<h2 class="section-title">Votre Compétence 2</h2>
```

#### Mettre à jour les contenus des composantes essentielles :
Modifiez les `.component-card` avec vos propres composantes selon le référentiel BUT.

### 3. Ajout de vos SAÉ et Projets

#### Pour ajouter une SAÉ (section `.sae-showcase`) :
```html
<div class="sae-card" data-sae="VOTRE_ID">
    <div class="sae-front">
        <div class="sae-header">
            <span class="sae-type">SAÉ X.XX</span>
            <h4>Titre de votre SAÉ</h4>
        </div>
        <div class="sae-preview">
            <!-- Votre aperçu (code, mockup, etc.) -->
        </div>
        <div class="sae-flip-hint">Cliquer pour plus de détails</div>
    </div>
    <div class="sae-back">
        <h4>Traces et analyse</h4>
        <div class="trace-content">
            <p><strong>Contexte :</strong> Description du contexte</p>
            <p><strong>Technologies :</strong> Liste des technologies</p>
            <p><strong>Compétences mobilisées :</strong></p>
            <ul>
                <li>Compétence 1</li>
                <li>Compétence 2</li>
                <!-- etc. -->
            </ul>
            <div class="trace-files">
                <span class="file-tag">📄 Type de trace</span>
                <!-- Autres traces -->
            </div>
        </div>
    </div>
</div>
```

#### Pour ajouter un projet (section `.projects-grid`) :
```html
<div class="project-card" data-category="web app sae">
    <div class="project-image">
        <img src="assets/votre-image.jpg" alt="Votre Projet" loading="lazy">
        <div class="project-overlay">
            <button class="btn-zoom" data-project="ID_UNIQUE">
                <!-- Icône zoom -->
            </button>
        </div>
    </div>
    <div class="project-content">
        <div class="project-tags">
            <span class="tag">Technologie1</span>
            <span class="tag">Technologie2</span>
        </div>
        <h3>Nom du Projet</h3>
        <p>Description courte du projet</p>
        <div class="project-links">
            <a href="LIEN_GITHUB" class="project-link">
                <!-- Icône + texte -->
                Voir le projet
            </a>
        </div>
    </div>
</div>
```

### 4. Personnalisation des Couleurs et Styles

#### Variables CSS dans `style.css` (lignes 1-50) :
```css
:root {
  /* Couleurs principales - Modifiez ces valeurs */
  --color-primary: #3b82f6;        /* Bleu principal */
  --color-secondary: #10b981;      /* Vert secondaire */
  
  /* Vous pouvez changer vers d'autres bleus/gris */
  --color-primary: #1e40af;        /* Bleu plus foncé */
  --color-secondary: #0ea5e9;      /* Cyan */
}
```

#### Pour changer la palette vers d'autres bleus :
- **Bleu marine** : `#1e3a8a` et `#3730a3`
- **Bleu ciel** : `#0ea5e9` et `#0284c7`
- **Bleu indigo** : `#4f46e5` et `#7c3aed`

### 5. Modification du Contenu Textuel

#### Textes de l'animation de frappe (dans `script.js`, ligne ~15) :
```javascript
typingTexts: [
  'Votre titre principal',
  'Votre spécialité',
  'Votre passion',
  'Votre objectif'
]
```

#### Statistiques dans la section À Propos :
Modifiez les attributs `data-target` des `.stat-number` pour refléter vos propres chiffres.

## 🖼️ Gestion des Images

### 1. Remplacement des Images de Projets

1. Ajoutez vos images dans le dossier `assets/`
2. Nommez-les de façon descriptive : `projet-portfolio.jpg`, `sae-biblio.png`, etc.
3. Modifiez les attributs `src` dans le HTML
4. **Format recommandé** : JPG ou PNG, max 800px de large, optimisées

### 2. Captures d'Écran et Traces

Pour illustrer vos compétences avec des traces visuelles :

- **Captures d'écran** de vos interfaces
- **Diagrammes** d'architecture
- **Extraits de code** (utilisez les blocs `.code-preview`)
- **Mockups** d'applications

### 3. Création d'Images Placeholder

Si vous n'avez pas encore d'images, utilisez des services comme :
- [Unsplash](https://unsplash.com) pour des photos de qualité
- [Lorem Picsum](https://picsum.photos) pour des placeholders
- Canva pour créer des mockups simples

## 📝 Personnalisation de l'Analyse Réflexive

### Structure Recommandée pour Chaque Compétence :

1. **Composantes Essentielles** (obligatoire)
   - Listez les 3-4 composantes principales
   - Ajoutez une barre de progression réaliste

2. **Savoirs et Savoir-faire** (obligatoire)
   - Théories apprises
   - Technologies maîtrisées
   - Outils utilisés

3. **Illustration par les SAÉ** (obligatoire)
   - Minimum 2 SAÉ par compétence
   - Contexte, technologies, traces

4. **Analyse Réflexive** (obligatoire)
   - Points forts développés
   - Axes d'amélioration
   - Perspectives d'évolution

### Exemple de Contenu pour une Réflexion :

```html
<div class="reflexion-card">
    <h4>Points forts développés</h4>
    <ul>
        <li>Maîtrise de [technologie] acquise lors de [SAÉ]</li>
        <li>Capacité à [compétence] démontrée par [exemple concret]</li>
        <li>Amélioration de [aspect] grâce à [méthode/outil]</li>
    </ul>
</div>
```

## 🚀 Déploiement

### 1. GitHub Pages (Gratuit)

1. Créez un repository GitHub
2. Uploadez tous les fichiers
3. Activez GitHub Pages dans les settings
4. Votre portfolio sera accessible via `https://username.github.io/repository-name`

### 2. Netlify (Gratuit)

1. Connectez votre repository GitHub à Netlify
2. Déploiement automatique à chaque push
3. Domaine personnalisé possible

### 3. Optimisations Avant Déploiement

- Vérifiez que toutes les images existent
- Testez sur mobile et desktop
- Validez l'accessibilité (navigation au clavier)
- Optimisez les images (compression)

## 📱 Responsive Design

Le portfolio est **entièrement responsive**. Les points de rupture sont :

- **Desktop** : > 1024px
- **Tablet** : 768px - 1024px  
- **Mobile** : < 768px

### Tester la Responsivité :

1. Ouvrez les outils de développement (F12)
2. Activez le mode responsive
3. Testez les différentes tailles d'écran
4. Vérifiez que le menu mobile fonctionne

## ♿ Accessibilité

Le portfolio respecte les standards d'accessibilité :

- **Navigation au clavier** : Tab, Enter, Escape
- **Contrastes suffisants** pour la lisibilité
- **Alternatives textuelles** pour les images
- **Structure sémantique** HTML5

### Test d'Accessibilité :

1. Naviguez uniquement au clavier (Tab)
2. Utilisez un lecteur d'écran si possible
3. Vérifiez les contrastes avec des outils en ligne

## 🔧 Personnalisations Avancées

### 1. Ajouter de Nouvelles Animations

Dans `script.js`, vous pouvez créer de nouvelles animations :

```javascript
// Exemple d'animation personnalisée
const monElement = $('.mon-element');
monElement.addEventListener('mouseenter', () => {
    monElement.style.transform = 'scale(1.05)';
});
```

### 2. Modifier les Effets Visuels

Les effets sont dans la classe `VisualEffectsManager`. Vous pouvez :
- Ajuster la vitesse de parallaxe
- Modifier les effets de hover
- Personnaliser l'animation de code

### 3. Formulaire de Contact Fonctionnel

Pour rendre le formulaire fonctionnel :

1. Utilisez un service comme [Formspree](https://formspree.io)
2. Ou [Netlify Forms](https://www.netlify.com/products/forms/)
3. Modifiez l'action du formulaire dans `handleSubmit()`

## 📋 Checklist Avant Soumission

### Contenu Pédagogique :
- [ ] 2 compétences choisies et nommées précisément
- [ ] Composantes essentielles listées pour chaque compétence
- [ ] Savoirs/savoir-faire niveau 1ère année identifiés
- [ ] Minimum 2 SAÉ illustrées par compétence
- [ ] Traces pertinentes ajoutées (captures, code, documents)
- [ ] Analyse réflexive critique rédigée
- [ ] Perspectives d'évolution mentionnées

### Technique :
- [ ] Site responsive (mobile + desktop)
- [ ] Navigation flottante fonctionnelle
- [ ] Mode sombre/clair opérationnel
- [ ] Toutes les images chargent correctement
- [ ] Formulaire de contact validé
- [ ] Pas d'erreurs JavaScript (console)
- [ ] Accessibilité testée (navigation clavier)

### Design :
- [ ] Palette bleu/gris respectée
- [ ] Typographie claire et lisible
- [ ] Animations fluides sans excès
- [ ] Cohérence visuelle générale
- [ ] Contraste suffisant en mode clair/sombre

## 💡 Conseils pour se Démarquer

1. **Personnalisez les micro-interactions** : ajustez les animations selon votre style
2. **Soignez vos traces** : captures d'écran annotées, extraits de code commentés
3. **Racontez une histoire** : liez vos SAÉ à une progression logique
4. **Montrez votre personnalité** : section "À propos" authentique
5. **Optimisez les performances** : site rapide = meilleure impression

## 📞 Support et Questions

Si vous rencontrez des difficultés :

1. Vérifiez la console du navigateur (F12) pour les erreurs
2. Consultez ce guide et les commentaires dans le code
3. Testez sur différents navigateurs
4. Validez votre HTML/CSS avec les outils W3C

---

**Bonne chance pour votre portfolio ! 🚀**

Ce template vous donne toutes les bases pour créer un portfolio qui répond parfaitement aux exigences pédagogiques du BUT Informatique tout en vous démarquant par son design moderne et ses interactions soignées.
