import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    shop: 'Shop',
    customize: 'Customize',
    wishlist: 'Wishlist',
    login: 'Login / Sign Up',
    account: 'Account',
    cart: 'Cart',
    
    // Product related
    viewDetails: 'View Details',
    addToCart: 'Add to Cart',
    chooseMetal: 'Choose Metal',
    caratWeight: 'Carat weight',
    engagementRings: 'Engagement Rings',
    labGrownDiamonds: 'Lab-Grown Diamonds',
    diamondRing: 'Diamond Ring',
    carat: 'ct',
    metal: 'Metal',
    shape: 'Shape',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    added: 'Added!',
    priceOnRequest: 'Price on request',
    off: 'OFF',
    clearFilters: 'Clear Filters',
    sortByPrice: 'Sort by Price',
    sortByDate: 'Sort by Date',
    priceLowHigh: 'Price: Low to High',
    priceHighLow: 'Price: High to Low',
    latest: 'Latest',
    oldest: 'Oldest',
    showDiscountedOnly: 'Show Discounted Only',
    noProductsFound: 'No products found for selected filters.',
    viewAllProducts: 'View All Products',
    
    // Footer
    contact: 'Contact',
    about: 'About',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    newsletter: 'Newsletter',
    subscribe: 'Subscribe',
    yourEmail: 'Your email',
    allRightsReserved: 'All rights reserved.',
    exquisiteLabGrown: 'Exquisite lab-grown diamond rings for life\'s most precious moments.',
    links: 'Links',
    
    // Home page
    bestsellers: 'Bestsellers',
    ourStory: 'Our Story',
    testimonials: 'What Our Customers Say',
    whyChooseLabGrown: 'Why Choose Lab-Grown Diamonds?',
    readyToDiscover: 'Ready to discover sustainable luxury?',
    shopOurCollection: 'Shop Our Collection',
    signUpSave: 'Sign Up & Save',
    startDesigning: 'Start Designing',
    customRingDesign: 'Custom Ring Design',
    celebrateLove: 'Celebrate your unique love story.',
    labGrownDiamondsBrilliant: 'Lab-Grown Diamonds: 30% More Brilliant',
    specialOffers: 'Special Offers',
    upTo50Off: 'Up to 50% off on selected engagement rings',
    customDesignDiscount: '15% off when you design your own ring',
    freeShipping: 'Free Shipping',
    onAllOrdersOver500: 'On all orders over $500',
    lifetimeWarranty: 'Lifetime Warranty',
    onAllLabGrownDiamonds: 'On all lab-grown diamonds',
    thirtyDayReturns: '30-Day Returns',
    noQuestionsAsked: 'No questions asked',
    sustainableJewelry: 'Grown Lab Diamond is at the forefront of the sustainable jewelry revolution.',
    sustainableDescription: 'We specialize in creating stunning lab-grown diamonds that offer the same brilliance, clarity, and beauty as mined diamonds, but with a clear conscience and a smaller environmental footprint.',
    ourMission: 'Our mission is to provide ethically conscious consumers with access to luxury jewelry that doesn\'t compromise on quality or style.',
    perfectHarmony: 'Every piece in our collection represents the perfect harmony of cutting-edge technology and timeless elegance.',
    customerTestimonial1: '"The lab-grown diamond is absolutely stunning and knowing it\'s ethical makes it even more special!"',
    customerTestimonial2: '"Incredible quality and the custom design process was seamless. Love that it\'s sustainable!"',
    danielS: '– Daniel S.',
    sarahL: '– Sarah L.',
    noDiscountedProducts: 'No discounted products available at the moment.',
    loadingBestsellers: 'Loading bestsellers...',
    
    // Contact
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    businessHours: 'Business Hours',
    diamondAvenue: '123 Diamond Avenue',
    globalHeadquarters: 'Global Headquarters',
    contactInfo: 'Contact Info',
    contactUs: 'Contact Us',
    contactInformation: 'Contact Information',
    name: 'Name',
    yourName: 'Your Name',
    message: 'Message',
    howCanWeHelp: 'How can we help you?',
    sendMessage: 'Send Message',
    sending: 'Sending...',
    messageSent: 'Message sent! We will get back to you soon.',
    errorSendingMessage: 'Error sending message. Please try again.',
    leadingProvider: 'Leading provider of ethically grown diamonds and sustainable luxury jewelry.',
    
    // Product details
    sku: 'SKU',
    natural: 'Natural',
    homeBreadcrumb: 'Home',
    engagementRingsBreadcrumb: 'ENGAGEMENT RINGS',
    
    // Cart and checkout
    quantity: 'Quantity',
    total: 'Total',
    checkout: 'Checkout',
    continueShopping: 'Continue Shopping',
    remove: 'Remove',
    emptyCart: 'Your cart is empty',
    proceedToCheckout: 'Proceed to Checkout',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    items: 'items',
    each: 'each',
    
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    createAccount: 'Create Account',
    loggingIn: 'Logging in...',
    signingUp: 'Signing up...',
    loadingCheckout: 'Loading checkout...',
    secureCheckout: 'Secure Checkout',
    
    // Admin
    adminPanel: 'Admin Panel',
    adminLogin: 'Admin Login',
    accessDenied: 'Access denied',
    
    // Customization
    ringCustomizer: 'Ring Customizer',
    selectDesign: 'Select Design',
    selectMetal: 'Select Metal',
    selectShape: 'Select Shape',
    selectCarat: 'Select Carat',
    preview: 'Preview',
    
    // Wishlist
    myWishlist: 'My Wishlist',
    moveToCart: 'Move to Cart',
    removeFromWishlist: 'Remove from Wishlist',
    wishlistEmpty: 'Your wishlist is empty',
    addedToCart: 'Added to cart!',
    
    // Account
    myAccount: 'My Account',
    profile: 'Profile',
    orders: 'Orders',
    settings: 'Settings',
    logout: 'Logout',
    
    // Metal types
    whiteGold: 'White Gold',
    yellowGold: 'Yellow Gold',
    roseGold: 'Rose Gold',
    platinum: 'Platinum',
    
    // Diamond shapes
    round: 'Round',
    princess: 'Princess',
    emerald: 'Emerald',
    oval: 'Oval',
    square: 'Square',
    
    // Design types
    classicSolitaire: 'Classic Solitaire',
    haloSetting: 'Halo Setting',
    vintageAntique: 'Vintage/Antique',
    threeStone: 'Three Stone',
  },
  
  nl: {
    // Navigation
    home: 'Home',
    shop: 'Winkel',
    customize: 'Aanpassen',
    wishlist: 'Verlanglijst',
    login: 'Inloggen / Registreren',
    account: 'Account',
    cart: 'Winkelwagen',
    
    // Product related
    viewDetails: 'Details Bekijken',
    addToCart: 'Toevoegen aan Winkelwagen',
    chooseMetal: 'Kies Metaal',
    caratWeight: 'Karaat gewicht',
    engagementRings: 'Verlovingsringen',
    labGrownDiamonds: 'Lab-Gekweekte Diamanten',
    diamondRing: 'Diamanten Ring',
    carat: 'kt',
    metal: 'Metaal',
    shape: 'Vorm',
    
    // Common
    loading: 'Laden...',
    error: 'Fout',
    added: 'Toegevoegd!',
    priceOnRequest: 'Prijs op aanvraag',
    off: 'KORTING',
    clearFilters: 'Filters Wissen',
    sortByPrice: 'Sorteer op Prijs',
    sortByDate: 'Sorteer op Datum',
    priceLowHigh: 'Prijs: Laag naar Hoog',
    priceHighLow: 'Prijs: Hoog naar Laag',
    latest: 'Nieuwste',
    oldest: 'Oudste',
    showDiscountedOnly: 'Toon Alleen Aanbiedingen',
    noProductsFound: 'Geen producten gevonden voor geselecteerde filters.',
    viewAllProducts: 'Bekijk Alle Producten',
    
    // Footer
    contact: 'Contact',
    about: 'Over ons',
    privacy: 'Privacybeleid',
    terms: 'Algemene voorwaarden',
    newsletter: 'Nieuwsbrief',
    subscribe: 'Abonneren',
    yourEmail: 'Uw e-mail',
    allRightsReserved: 'Alle rechten voorbehouden.',
    exquisiteLabGrown: 'Prachtige lab-gekweekte diamanten ringen voor de meest kostbare momenten in het leven.',
    links: 'Links',
    
    // Home page
    bestsellers: 'Bestsellers',
    ourStory: 'Ons Verhaal',
    testimonials: 'Wat Onze Klanten Zeggen',
    signUpSave: 'Registreer & Bespaar',
    startDesigning: 'Begin met Ontwerpen',
    customRingDesign: 'Aangepaste Ring Ontwerp',
    celebrateLove: 'Vier je unieke liefdesverhaal.',
    labGrownDiamondsBrilliant: 'Lab-Gekweekte Diamanten: 30% Briljanter',
    specialOffers: 'Speciale Aanbiedingen',
    upTo50Off: 'Tot 50% korting op geselecteerde verlovingsringen',
    customDesignDiscount: '15% korting wanneer je je eigen ring ontwerpt',
    freeShipping: 'Gratis Verzending',
    onAllOrdersOver500: 'Op alle bestellingen boven €500',
    lifetimeWarranty: 'Levenslange Garantie',
    onAllLabGrownDiamonds: 'Op alle lab-gekweekte diamanten',
    thirtyDayReturns: '30-Dagen Retour',
    noQuestionsAsked: 'Geen vragen gesteld',
    sustainableJewelry: 'Grown Lab Diamond staat aan de voorhoede van de duurzame sieraden revolutie.',
    sustainableDescription: 'We zijn gespecialiseerd in het creëren van prachtige lab-gekweekte diamanten die dezelfde schittering, helderheid en schoonheid bieden als gedolven diamanten, maar met een zuiver geweten en een kleinere ecologische voetafdruk.',
    ourMission: 'Onze missie is om ethisch bewuste consumenten toegang te geven tot luxe sieraden die niet inboeten op kwaliteit of stijl.',
    perfectHarmony: 'Elk stuk in onze collectie vertegenwoordigt de perfecte harmonie van geavanceerde technologie en tijdloze elegantie.',
    customerTestimonial1: '"De lab-gekweekte diamant is absoluut prachtig en het feit dat het ethisch verantwoord is maakt het nog specialer!"',
    customerTestimonial2: '"Ongelooflijke kwaliteit en het aangepaste ontwerpproces was naadloos. Geweldig dat het duurzaam is!"',
    danielS: '– Daniel S.',
    sarahL: '– Sarah L.',
    noDiscountedProducts: 'Momenteel geen producten met korting beschikbaar.',
    loadingBestsellers: 'Bestsellers laden...',
    whyChooseLabGrown: 'Waarom Lab-Gekweekte Diamanten Kiezen?',
    readyToDiscover: 'Klaar om duurzame luxe te ontdekken?',
    shopOurCollection: 'Bekijk Onze Collectie',
    
    // Contact
    address: 'Adres',
    phone: 'Telefoon',
    email: 'E-mail',
    businessHours: 'Openingstijden',
    diamondAvenue: '123 Diamant Avenue',
    globalHeadquarters: 'Wereldwijde Hoofdkantoor',
    contactInfo: 'Contactgegevens',
    contactUs: 'Contact Opnemen',
    contactInformation: 'Contactgegevens',
    name: 'Naam',
    yourName: 'Uw Naam',
    message: 'Bericht',
    howCanWeHelp: 'Hoe kunnen we u helpen?',
    sendMessage: 'Bericht Versturen',
    sending: 'Versturen...',
    messageSent: 'Bericht verzonden! We nemen binnenkort contact met u op.',
    errorSendingMessage: 'Fout bij het verzenden van bericht. Probeer het opnieuw.',
    leadingProvider: 'Toonaangevende leverancier van ethisch gekweekte diamanten en duurzame luxe sieraden.',
    
    // Product details
    sku: 'SKU',
    natural: 'Natuurlijk',
    homeBreadcrumb: 'Home',
    engagementRingsBreadcrumb: 'VERLOVINGSRINGEN',
    
    // Cart and checkout
    quantity: 'Aantal',
    total: 'Totaal',
    checkout: 'Afrekenen',
    continueShopping: 'Verder Winkelen',
    remove: 'Verwijderen',
    emptyCart: 'Je winkelwagen is leeg',
    proceedToCheckout: 'Doorgaan naar Afrekenen',
    orderSummary: 'Besteloverzicht',
    subtotal: 'Subtotaal',
    shipping: 'Verzending',
    tax: 'Belasting',
    items: 'artikelen',
    each: 'per stuk',
    
    // Auth
    signIn: 'Inloggen',
    signUp: 'Registreren',
    emailAddress: 'E-mailadres',
    password: 'Wachtwoord',
    confirmPassword: 'Bevestig Wachtwoord',
    forgotPassword: 'Wachtwoord Vergeten?',
    alreadyHaveAccount: 'Heb je al een account?',
    dontHaveAccount: 'Heb je nog geen account?',
    createAccount: 'Account Aanmaken',
    loggingIn: 'Inloggen...',
    signingUp: 'Registreren...',
    loadingCheckout: 'Afrekenen laden...',
    secureCheckout: 'Veilig Afrekenen',
    
    // Admin
    adminPanel: 'Beheerpaneel',
    adminLogin: 'Beheerder Login',
    accessDenied: 'Toegang geweigerd',
    
    // Customization
    ringCustomizer: 'Ring Aanpassen',
    selectDesign: 'Selecteer Ontwerp',
    selectMetal: 'Selecteer Metaal',
    selectShape: 'Selecteer Vorm',
    selectCarat: 'Selecteer Karaat',
    preview: 'Voorvertoning',
    
    // Wishlist
    myWishlist: 'Mijn Verlanglijst',
    moveToCart: 'Verplaats naar Winkelwagen',
    removeFromWishlist: 'Verwijder van Verlanglijst',
    wishlistEmpty: 'Je verlanglijst is leeg',
    addedToCart: 'Toegevoegd aan winkelwagen!',
    
    // Account
    myAccount: 'Mijn Account',
    profile: 'Profiel',
    orders: 'Bestellingen',
    settings: 'Instellingen',
    logout: 'Uitloggen',
    
    // Metal types
    whiteGold: 'Wit Goud',
    yellowGold: 'Geel Goud',
    roseGold: 'Roze Goud',
    platinum: 'Platina',
    
    // Diamond shapes
    round: 'Rond',
    princess: 'Prinses',
    emerald: 'Smaragd',
    oval: 'Ovaal',
    square: 'Vierkant',
    
    // Design types
    classicSolitaire: 'Klassieke Solitair',
    haloSetting: 'Halo Setting',
    vintageAntique: 'Vintage/Antiek',
    threeStone: 'Drie Steen',
  },
  
  fr: {
    // Navigation
    home: 'Accueil',
    shop: 'Boutique',
    customize: 'Personnaliser',
    wishlist: 'Liste de souhaits',
    login: 'Connexion / Inscription',
    account: 'Compte',
    cart: 'Panier',
    
    // Product related
    viewDetails: 'Voir les détails',
    addToCart: 'Ajouter au panier',
    chooseMetal: 'Choisir le métal',
    caratWeight: 'Poids en carats',
    engagementRings: 'Bagues de fiançailles',
    labGrownDiamonds: 'Diamants de Laboratoire',
    diamondRing: 'Bague en Diamant',
    carat: 'ct',
    metal: 'Métal',
    shape: 'Forme',
    
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    added: 'Ajouté !',
    priceOnRequest: 'Prix sur demande',
    off: 'RÉDUCTION',
    clearFilters: 'Effacer les filtres',
    sortByPrice: 'Trier par prix',
    sortByDate: 'Trier par date',
    priceLowHigh: 'Prix: Croissant',
    priceHighLow: 'Prix: Décroissant',
    latest: 'Plus récent',
    oldest: 'Plus ancien',
    showDiscountedOnly: 'Afficher uniquement les réductions',
    noProductsFound: 'Aucun produit trouvé pour les filtres sélectionnés.',
    viewAllProducts: 'Voir tous les produits',
    
    // Footer
    contact: 'Contact',
    about: 'À propos',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions de service',
    newsletter: 'Newsletter',
    subscribe: 'S\'abonner',
    yourEmail: 'Votre e-mail',
    allRightsReserved: 'Tous droits réservés.',
    exquisiteLabGrown: 'Exquises bagues en diamants de laboratoire pour les moments les plus précieux de la vie.',
    links: 'Liens',
    
    // Home page
    bestsellers: 'Meilleures ventes',
    ourStory: 'Notre histoire',
    testimonials: 'Ce que disent nos clients',
    signUpSave: 'S\'inscrire et économiser',
    startDesigning: 'Commencer à concevoir',
    customRingDesign: 'Conception de bague personnalisée',
    celebrateLove: 'Célébrez votre histoire d\'amour unique.',
    labGrownDiamondsBrilliant: 'Diamants de Laboratoire: 30% Plus Brillants',
    specialOffers: 'Offres Spéciales',
    upTo50Off: 'Jusqu\'à 50% de réduction sur les bagues de fiançailles sélectionnées',
    customDesignDiscount: '15% de réduction quand vous concevez votre propre bague',
    freeShipping: 'Livraison gratuite',
    onAllOrdersOver500: 'Sur toutes les commandes de plus de 500€',
    lifetimeWarranty: 'Garantie à vie',
    onAllLabGrownDiamonds: 'Sur tous les diamants de laboratoire',
    thirtyDayReturns: 'Retours sous 30 jours',
    noQuestionsAsked: 'Sans questions',
    sustainableJewelry: 'Grown Lab Diamond est à l\'avant-garde de la révolution des bijoux durables.',
    sustainableDescription: 'Nous nous spécialisons dans la création de magnifiques diamants de laboratoire qui offrent la même brillance, clarté et beauté que les diamants extraits, mais avec une conscience claire et une empreinte environnementale plus faible.',
    ourMission: 'Notre mission est de fournir aux consommateurs éthiquement conscients l\'accès à des bijoux de luxe qui ne compromettent pas la qualité ou le style.',
    perfectHarmony: 'Chaque pièce de notre collection représente l\'harmonie parfaite entre technologie de pointe et élégance intemporelle.',
    customerTestimonial1: '"Le diamant de laboratoire est absolument magnifique et savoir qu\'il est éthique le rend encore plus spécial !"',
    customerTestimonial2: '"Qualité incroyable et le processus de conception personnalisée était transparent. J\'adore que ce soit durable !"',
    danielS: '– Daniel S.',
    sarahL: '– Sarah L.',
    noDiscountedProducts: 'Aucun produit en réduction disponible pour le moment.',
    loadingBestsellers: 'Chargement des meilleures ventes...',
    whyChooseLabGrown: 'Pourquoi Choisir les Diamants de Laboratoire ?',
    readyToDiscover: 'Prêt à découvrir le luxe durable ?',
    shopOurCollection: 'Voir Notre Collection',
    
    // Contact
    address: 'Adresse',
    phone: 'Téléphone',
    email: 'E-mail',
    businessHours: 'Heures d\'ouverture',
    diamondAvenue: '123 Avenue du Diamant',
    globalHeadquarters: 'Siège Social Mondial',
    contactInfo: 'Informations de contact',
    contactUs: 'Nous Contacter',
    contactInformation: 'Informations de contact',
    name: 'Nom',
    yourName: 'Votre nom',
    message: 'Message',
    howCanWeHelp: 'Comment pouvons-nous vous aider ?',
    sendMessage: 'Envoyer le message',
    sending: 'Envoi...',
    messageSent: 'Message envoyé ! Nous vous répondrons bientôt.',
    errorSendingMessage: 'Erreur lors de l\'envoi du message. Veuillez réessayer.',
    leadingProvider: 'Fournisseur leader de diamants éthiquement cultivés et de bijoux de luxe durables.',
    
    // Product details
    sku: 'SKU',
    natural: 'Naturel',
    homeBreadcrumb: 'Accueil',
    engagementRingsBreadcrumb: 'BAGUES DE FIANÇAILLES',
    
    // Cart and checkout
    quantity: 'Quantité',
    total: 'Total',
    checkout: 'Commander',
    continueShopping: 'Continuer les achats',
    remove: 'Supprimer',
    emptyCart: 'Votre panier est vide',
    proceedToCheckout: 'Procéder au paiement',
    orderSummary: 'Résumé de la commande',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    tax: 'Taxe',
    items: 'articles',
    each: 'chacun',
    
    // Auth
    signIn: 'Se connecter',
    signUp: 'S\'inscrire',
    emailAddress: 'Adresse e-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    dontHaveAccount: 'Vous n\'avez pas de compte ?',
    createAccount: 'Créer un compte',
    loggingIn: 'Connexion...',
    signingUp: 'Inscription...',
    loadingCheckout: 'Chargement du paiement...',
    secureCheckout: 'Paiement Sécurisé',
    
    // Admin
    adminPanel: 'Panneau d\'administration',
    adminLogin: 'Connexion administrateur',
    accessDenied: 'Accès refusé',
    
    // Customization
    ringCustomizer: 'Personnalisateur de bague',
    selectDesign: 'Sélectionner le design',
    selectMetal: 'Sélectionner le métal',
    selectShape: 'Sélectionner la forme',
    selectCarat: 'Sélectionner le carat',
    preview: 'Aperçu',
    
    // Wishlist
    myWishlist: 'Ma liste de souhaits',
    moveToCart: 'Déplacer vers le panier',
    removeFromWishlist: 'Retirer de la liste de souhaits',
    wishlistEmpty: 'Votre liste de souhaits est vide',
    addedToCart: 'Ajouté au panier !',
    
    // Account
    myAccount: 'Mon compte',
    profile: 'Profil',
    orders: 'Commandes',
    settings: 'Paramètres',
    logout: 'Se déconnecter',
    
    // Metal types
    whiteGold: 'Or blanc',
    yellowGold: 'Or jaune',
    roseGold: 'Or rose',
    platinum: 'Platine',
    
    // Diamond shapes
    round: 'Rond',
    princess: 'Princesse',
    emerald: 'Émeraude',
    oval: 'Oval',
    square: 'Carré',
    
    // Design types
    classicSolitaire: 'Solitaire classique',
    haloSetting: 'Sertissage halo',
    vintageAntique: 'Vintage/Antique',
    threeStone: 'Trois pierres',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const value = {
    language,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 