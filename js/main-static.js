// Static Language Loading System for Jenselius Strategy & Ops
// This version loads translations from JSON files for GitHub Pages compatibility

let translations = {};
let currentLanguage = 'en';

// Load language files statically
async function loadLanguageFiles() {
    try {
        // Load English translations
        const enResponse = await fetch('./lang/en.json');
        const enData = await enResponse.json();
        
        // Load German translations  
        const deResponse = await fetch('./lang/de.json');
        const deData = await deResponse.json();
        
        translations = {
            en: enData,
            de: deData
        };
        
        // Initialize the page with saved language preference
        const savedLanguage = localStorage.getItem('preferred-language') || 'en';
        setLanguage(savedLanguage);
        
    } catch (error) {
        console.error('Error loading language files:', error);
        // Fallback to English if loading fails
        setLanguage('en');
    }
}

// Set language and update all translatable elements
function setLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Language ${lang} not available, falling back to English`);
        lang = 'en';
    }
    
    currentLanguage = lang;
    localStorage.setItem('preferred-language', lang);
    
    // Update language buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update placeholder text
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
}

// Language switching functionality
function switchLanguage(lang) {
    setLanguage(lang);
}

// ====== EMAIL FORM FUNCTIONALITY (NEW!) ======
function handleResourcesForm(event) {
    event.preventDefault(); // Verhindert Standard-Formular-Submit
    
    const form = document.getElementById('resourcesForm');
    const emailInput = form.querySelector('input[type="email"]');
    const thankYouSection = document.getElementById('thankYouSection');
    
    // Validierung
    if (!emailInput || !emailInput.value || !emailInput.value.includes('@')) {
        alert(currentLanguage === 'de' ? 
            'Bitte geben Sie eine gültige E-Mail-Adresse ein.' : 
            'Please enter a valid email address.');
        return;
    }
    
    // Email-Adresse speichern (optional - für Analytics/Tracking)
    console.log('Email submitted:', emailInput.value);
    
    // Formular ausblenden
    form.style.display = 'none';
    
    // Thank-You-Sektion anzeigen
    if (thankYouSection) {
        thankYouSection.classList.remove('hidden');
        
        // Sanft zur Thank-You-Sektion scrollen
        thankYouSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}

// Calendly integration
function openCalendly() {
    window.open('https://calendly.com/jenselius-strategy-ops/30min', '_blank');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load language files and initialize
    loadLanguageFiles();
    
    // Set up language button event listeners
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            if (lang) {
                switchLanguage(lang);
            }
        });
    });
    
    // Set up email form submission handler
    const resourcesForm = document.getElementById('resourcesForm');
    if (resourcesForm) {
        resourcesForm.addEventListener('submit', handleResourcesForm);
    }
});

// Make functions globally available
window.switchLanguage = switchLanguage;
window.openCalendly = openCalendly;
