const BASE = (document.querySelector('base')?.getAttribute('href') || '').replace(/\/$/, '') || '/ord';
const API = BASE + '/api';

let currentUser = null;
let siteLang = localStorage.getItem('ord_site_lang') || 'en';

const SITE_LANGS = { en: 'English', sv: 'Svenska', no: 'Norsk', da: 'Dansk', de: 'Deutsch', hi: 'हिन्दी', ur: 'اردو' };

const TR = {
  en: {
    features: 'Features', languages: 'Languages', tutorials: 'Tutorials', pricing: 'Pricing', download: 'Download',
    login: 'Log in', getStarted: 'Get Started Free', logout: 'Log out',
    heroBadge: 'AI-Powered Writing Assistant',
    heroTitle1: 'Write perfectly in ', heroTitle2: 'every language',
    heroDesc: 'Ord uses advanced AI to check grammar, spelling, and style in 23+ languages. From Swedish to Urdu, Hindi to Japanese — write with confidence everywhere.',
    startFree: 'Start Free', seeFeatures: 'See Features',
    featBadge: 'Features', featTitle: 'Everything you need to write better',
    featDesc: 'Powered by advanced AI that understands context, tone, and nuance in every language.',
    feat1: 'Grammar Check', feat1d: 'AI detects grammar errors that rule-based checkers miss. Understands context and meaning, not just patterns.',
    feat2: 'Spell Check', feat2d: 'Smart spelling correction that knows the difference between similar words and understands compound words in Nordic languages.',
    feat3: 'Style & Tone', feat3d: 'Adjust your writing to be formal, casual, concise, or elaborate. Perfect for business emails or friendly messages.',
    feat4: 'Auto-Check', feat4d: 'Works in real-time as you type in any text field on any website. Gmail, Google Docs, social media — everywhere.',
    feat5: 'Privacy First', feat5d: 'Your text is processed and forgotten. We never store your writing. Your words stay yours.',
    feat6: '23+ Languages', feat6d: 'From Swedish to Urdu, Hindi to Japanese. The most comprehensive multilingual AI writing assistant available.',
    langBadge: 'Languages', langTitle: 'Write in any language',
    langDesc: 'Ord supports 23+ languages with deep understanding of grammar rules, idioms, and cultural nuances.',
    howBadge: 'How It Works', howTitle: 'Up and running in 2 minutes',
    howDesc: 'Install the Chrome extension and start writing better instantly.',
    step1: 'Install Extension', step1d: 'Add Ord to Chrome. One click install.',
    step2: 'Create Account', step2d: 'Sign up free and get your API key. 20 checks per day included.',
    step3: 'Start Writing', step3d: 'Type anywhere on the web. Ord checks your text automatically.',
    step4: 'Apply Fixes', step4d: 'Review suggestions and apply corrections with one click.',
    dlBadge: 'Download', dlTitle: 'Get the Chrome Extension',
    dlDesc: 'Install Ord in your browser and start checking your writing instantly.',
    dlBtn: 'Download for Chrome',
    dlStep1: 'Download the extension files from GitHub',
    dlStep2: 'Open chrome://extensions in your browser',
    dlStep3: 'Enable "Developer mode" and click "Load unpacked"',
    dlStep4: 'Select the extension folder and start writing!',
    tutBadge: 'Tutorials', tutTitle: 'Learn how to use Ord',
    tutDesc: 'Step-by-step guides to get the most out of your AI writing assistant.',
    tutGS: 'Getting Started', tutInstall: 'Install & Setup',
    tutInstallDesc: 'How to install the Chrome extension, create your account, and configure your first language.',
    tutFeat: 'Features', tutGrammar: 'Grammar & Style Check',
    tutGrammarDesc: 'Understanding grammar issues, style suggestions, and how to use the rephrase tools effectively.',
    tutAdv: 'Advanced', tutMulti: 'Multi-Language Setup',
    tutMultiDesc: 'Switch between languages, auto-detect text language, and configure preferences per website.',
    priceBadge: 'Pricing', priceTitle: 'Simple, affordable pricing',
    priceDesc: 'Start free. Upgrade when you need more.',
    free: 'Free', foreverFree: 'Forever free', pro: 'Pro', cancelAnytime: 'Cancel anytime',
    mostPopular: 'MOST POPULAR',
    pFree1: '20 checks per day', pFree2: 'All 23+ languages', pFree3: 'Grammar & spelling',
    pFree4: 'Chrome extension', pFree5: 'Basic style suggestions',
    pPro1: 'Unlimited checks', pPro2: 'All 23+ languages', pPro3: 'Grammar, spelling & style',
    pPro4: 'Rephrase & tone adjustment', pPro5: 'Priority AI processing',
    pPro6: 'API access', pPro7: 'Usage analytics',
    startPro: 'Start Pro',
    ctaTitle: 'Ready to write better?',
    ctaDesc: 'Join thousands of writers using Ord to communicate clearly in any language.',
    product: 'Product', company: 'Company', allLanguages: 'All Languages',
    about: 'About', privacy: 'Privacy', terms: 'Terms', contact: 'Contact',
    footerDesc: 'AI-powered writing assistant for every language. Write with confidence in Swedish, English, Urdu, Hindi, and 15+ more languages.',
  },
  sv: {
    features: 'Funktioner', languages: 'Språk', tutorials: 'Guider', pricing: 'Priser', download: 'Ladda ner',
    login: 'Logga in', getStarted: 'Börja gratis', logout: 'Logga ut',
    heroBadge: 'AI-driven skrivassistent',
    heroTitle1: 'Skriv perfekt på ', heroTitle2: 'alla språk',
    heroDesc: 'Ord använder avancerad AI för att kontrollera grammatik, stavning och stil på 23+ språk. Från svenska till urdu, hindi till japanska — skriv med självförtroende överallt.',
    startFree: 'Börja gratis', seeFeatures: 'Se funktioner',
    featBadge: 'Funktioner', featTitle: 'Allt du behöver för att skriva bättre',
    featDesc: 'Drivs av avancerad AI som förstår kontext, ton och nyanser på alla språk.',
    feat1: 'Grammatikkontroll', feat1d: 'AI upptäcker grammatikfel som regelbaserade verktyg missar. Förstår kontext och mening, inte bara mönster.',
    feat2: 'Stavningskontroll', feat2d: 'Smart stavningskorrigering som känner till skillnaden mellan liknande ord och förstår sammansatta ord.',
    feat3: 'Stil och ton', feat3d: 'Anpassa din text till formell, vardaglig, koncis eller utförlig. Perfekt för affärsmejl eller vardagliga meddelanden.',
    feat4: 'Automatisk kontroll', feat4d: 'Fungerar i realtid när du skriver i alla textfält på alla webbplatser. Gmail, Google Docs, sociala medier — överallt.',
    feat5: 'Integritet först', feat5d: 'Din text behandlas och glöms bort. Vi lagrar aldrig din text. Dina ord förblir dina.',
    feat6: '23+ språk', feat6d: 'Från svenska till urdu, hindi till japanska. Den mest omfattande flerspråkiga AI-skrivassistenten.',
    langBadge: 'Språk', langTitle: 'Skriv på alla språk',
    langDesc: 'Ord stödjer 23+ språk med djup förståelse för grammatikregler, idiom och kulturella nyanser.',
    howBadge: 'Så fungerar det', howTitle: 'Kom igång på 2 minuter',
    howDesc: 'Installera Chrome-tillägget och börja skriva bättre direkt.',
    step1: 'Installera tillägg', step1d: 'Lägg till Ord i Chrome. Ett klick.',
    step2: 'Skapa konto', step2d: 'Registrera dig gratis och få din API-nyckel. 20 kontroller per dag.',
    step3: 'Börja skriva', step3d: 'Skriv var som helst på webben. Ord kontrollerar automatiskt.',
    step4: 'Tillämpa rättningar', step4d: 'Granska förslag och tillämpa korrigeringar med ett klick.',
    dlBadge: 'Ladda ner', dlTitle: 'Hämta Chrome-tillägget',
    dlDesc: 'Installera Ord i din webbläsare och börja kontrollera din text direkt.',
    dlBtn: 'Ladda ner för Chrome',
    dlStep1: 'Ladda ner tillägget från GitHub',
    dlStep2: 'Öppna chrome://extensions i din webbläsare',
    dlStep3: 'Aktivera "Utvecklarläge" och klicka "Ladda okomprimerad"',
    dlStep4: 'Välj tilläggsmappen och börja skriva!',
    tutBadge: 'Guider', tutTitle: 'Lär dig använda Ord',
    tutDesc: 'Steg-för-steg-guider för att få ut det mesta av din AI-skrivassistent.',
    tutGS: 'Kom igång', tutInstall: 'Installation',
    tutInstallDesc: 'Hur du installerar Chrome-tillägget, skapar ditt konto och konfigurerar ditt första språk.',
    tutFeat: 'Funktioner', tutGrammar: 'Grammatik och stil',
    tutGrammarDesc: 'Förstå grammatikproblem, stilförslag och hur du använder omformuleringsverktygen.',
    tutAdv: 'Avancerat', tutMulti: 'Flerspråksinställningar',
    tutMultiDesc: 'Byt mellan språk, autodetektera textens språk och konfigurera inställningar per webbplats.',
    priceBadge: 'Priser', priceTitle: 'Enkla, prisvärda priser',
    priceDesc: 'Börja gratis. Uppgradera när du behöver mer.',
    free: 'Gratis', foreverFree: 'Gratis för alltid', pro: 'Pro', cancelAnytime: 'Avbryt när som helst',
    mostPopular: 'MEST POPULÄR',
    pFree1: '20 kontroller per dag', pFree2: 'Alla 23+ språk', pFree3: 'Grammatik och stavning',
    pFree4: 'Chrome-tillägg', pFree5: 'Grundläggande stilförslag',
    pPro1: 'Obegränsade kontroller', pPro2: 'Alla 23+ språk', pPro3: 'Grammatik, stavning och stil',
    pPro4: 'Omformulering och tonjustering', pPro5: 'Prioriterad AI-bearbetning',
    pPro6: 'API-åtkomst', pPro7: 'Användningsstatistik',
    startPro: 'Börja Pro',
    ctaTitle: 'Redo att skriva bättre?',
    ctaDesc: 'Gå med tusentals skribenter som använder Ord för att kommunicera tydligt på alla språk.',
    product: 'Produkt', company: 'Företag', allLanguages: 'Alla språk',
    about: 'Om oss', privacy: 'Integritet', terms: 'Villkor', contact: 'Kontakt',
    footerDesc: 'AI-driven skrivassistent för alla språk. Skriv med självförtroende på svenska, engelska, urdu, hindi och 15+ fler språk.',
  },
  no: {
    features: 'Funksjoner', languages: 'Språk', tutorials: 'Guider', pricing: 'Priser', download: 'Last ned',
    login: 'Logg inn', getStarted: 'Kom i gang gratis', logout: 'Logg ut',
    heroBadge: 'AI-drevet skriveassistent',
    heroTitle1: 'Skriv perfekt på ', heroTitle2: 'alle språk',
    heroDesc: 'Ord bruker avansert AI for å sjekke grammatikk, stavemåte og stil på 23+ språk. Fra svensk til urdu, hindi til japansk — skriv med selvtillit overalt.',
    startFree: 'Start gratis', seeFeatures: 'Se funksjoner',
    featBadge: 'Funksjoner', featTitle: 'Alt du trenger for å skrive bedre',
    featDesc: 'Drevet av avansert AI som forstår kontekst, tone og nyanser på alle språk.',
    langBadge: 'Språk', langTitle: 'Skriv på alle språk',
    langDesc: 'Ord støtter 23+ språk med dyp forståelse for grammatikkregler, idiomer og kulturelle nyanser.',
    howBadge: 'Slik fungerer det', howTitle: 'Kom i gang på 2 minutter',
    howDesc: 'Installer Chrome-utvidelsen og begynn å skrive bedre med en gang.',
    dlBadge: 'Last ned', dlTitle: 'Hent Chrome-utvidelsen',
    dlDesc: 'Installer Ord i nettleseren din og begynn å sjekke teksten din med en gang.',
    dlBtn: 'Last ned for Chrome',
    tutBadge: 'Guider', tutTitle: 'Lær deg å bruke Ord',
    tutDesc: 'Trinn-for-trinn-guider for å få mest mulig ut av din AI-skriveassistent.',
    priceBadge: 'Priser', priceTitle: 'Enkle, rimelige priser',
    priceDesc: 'Start gratis. Oppgrader når du trenger mer.',
    ctaTitle: 'Klar til å skrive bedre?',
    ctaDesc: 'Bli med tusenvis av skribenter som bruker Ord for å kommunisere tydelig på alle språk.',
  },
  da: {
    features: 'Funktioner', languages: 'Sprog', tutorials: 'Guides', pricing: 'Priser', download: 'Download',
    login: 'Log ind', getStarted: 'Kom i gang gratis', logout: 'Log ud',
    heroBadge: 'AI-drevet skriveassistent',
    heroTitle1: 'Skriv perfekt på ', heroTitle2: 'alle sprog',
    heroDesc: 'Ord bruger avanceret AI til at kontrollere grammatik, stavning og stil på 23+ sprog. Fra svensk til urdu, hindi til japansk — skriv med selvtillid overalt.',
    startFree: 'Start gratis', seeFeatures: 'Se funktioner',
    featBadge: 'Funktioner', featTitle: 'Alt hvad du behøver for at skrive bedre',
    featDesc: 'Drevet af avanceret AI der forstår kontekst, tone og nuancer på alle sprog.',
    langBadge: 'Sprog', langTitle: 'Skriv på alle sprog',
    langDesc: 'Ord understøtter 23+ sprog med dyb forståelse for grammatikregler, idiomer og kulturelle nuancer.',
    howBadge: 'Sådan fungerer det', howTitle: 'Kom i gang på 2 minutter',
    howDesc: 'Installer Chrome-udvidelsen og begynd at skrive bedre med det samme.',
    dlBadge: 'Download', dlTitle: 'Hent Chrome-udvidelsen',
    dlDesc: 'Installer Ord i din browser og begynd at kontrollere din tekst med det samme.',
    dlBtn: 'Download til Chrome',
    tutBadge: 'Guides', tutTitle: 'Lær at bruge Ord',
    tutDesc: 'Trin-for-trin guider til at få mest muligt ud af din AI-skriveassistent.',
    priceBadge: 'Priser', priceTitle: 'Simple, overkommelige priser',
    priceDesc: 'Start gratis. Opgrader når du har brug for mere.',
    ctaTitle: 'Klar til at skrive bedre?',
    ctaDesc: 'Bliv en del af tusindvis af skribenter der bruger Ord til at kommunikere tydeligt på alle sprog.',
  },
  de: {
    features: 'Funktionen', languages: 'Sprachen', tutorials: 'Anleitungen', pricing: 'Preise', download: 'Herunterladen',
    login: 'Anmelden', getStarted: 'Kostenlos starten', logout: 'Abmelden',
    heroBadge: 'KI-gesteuerter Schreibassistent',
    heroTitle1: 'Schreibe perfekt in ', heroTitle2: 'jeder Sprache',
    heroDesc: 'Ord verwendet fortschrittliche KI, um Grammatik, Rechtschreibung und Stil in 23+ Sprachen zu prüfen. Von Schwedisch bis Urdu, Hindi bis Japanisch — schreibe überall mit Zuversicht.',
    startFree: 'Kostenlos starten', seeFeatures: 'Funktionen ansehen',
    featBadge: 'Funktionen', featTitle: 'Alles was du brauchst, um besser zu schreiben',
    featDesc: 'Angetrieben von fortschrittlicher KI, die Kontext, Ton und Nuancen in jeder Sprache versteht.',
    feat1: 'Grammatikprüfung', feat1d: 'KI erkennt Grammatikfehler, die regelbasierte Prüfer übersehen. Versteht Kontext und Bedeutung, nicht nur Muster.',
    feat2: 'Rechtschreibprüfung', feat2d: 'Intelligente Rechtschreibkorrektur, die ähnliche Wörter unterscheidet und zusammengesetzte Wörter versteht.',
    feat3: 'Stil & Ton', feat3d: 'Passe deinen Text an: formell, lässig, knapp oder ausführlich. Perfekt für Geschäfts-E-Mails oder freundliche Nachrichten.',
    feat4: 'Automatische Prüfung', feat4d: 'Funktioniert in Echtzeit beim Tippen in jedem Textfeld auf jeder Website. Gmail, Google Docs, soziale Medien — überall.',
    feat5: 'Datenschutz zuerst', feat5d: 'Dein Text wird verarbeitet und vergessen. Wir speichern nie deine Texte. Deine Worte bleiben deine.',
    feat6: '23+ Sprachen', feat6d: 'Von Schwedisch bis Urdu, Hindi bis Japanisch. Der umfassendste mehrsprachige KI-Schreibassistent.',
    langBadge: 'Sprachen', langTitle: 'Schreibe in jeder Sprache',
    langDesc: 'Ord unterstützt 23+ Sprachen mit tiefem Verständnis für Grammatikregeln, Redewendungen und kulturelle Nuancen.',
    howBadge: 'So funktioniert es', howTitle: 'In 2 Minuten startklar',
    howDesc: 'Installiere die Chrome-Erweiterung und beginne sofort besser zu schreiben.',
    step1: 'Erweiterung installieren', step1d: 'Füge Ord zu Chrome hinzu. Ein Klick.',
    step2: 'Konto erstellen', step2d: 'Registriere dich kostenlos und erhalte deinen API-Schlüssel. 20 Prüfungen pro Tag inklusive.',
    step3: 'Losschreiben', step3d: 'Schreibe überall im Web. Ord prüft deinen Text automatisch.',
    step4: 'Korrekturen anwenden', step4d: 'Überprüfe Vorschläge und wende Korrekturen mit einem Klick an.',
    dlBadge: 'Herunterladen', dlTitle: 'Chrome-Erweiterung herunterladen',
    dlDesc: 'Installiere Ord in deinem Browser und beginne sofort mit der Textprüfung.',
    dlBtn: 'Für Chrome herunterladen',
    dlStep1: 'Lade die Erweiterung von GitHub herunter',
    dlStep2: 'Öffne chrome://extensions in deinem Browser',
    dlStep3: 'Aktiviere den "Entwicklermodus" und klicke "Entpackte Erweiterung laden"',
    dlStep4: 'Wähle den Erweiterungsordner und fange an zu schreiben!',
    tutBadge: 'Anleitungen', tutTitle: 'Lerne Ord zu nutzen',
    tutDesc: 'Schritt-für-Schritt-Anleitungen, um das Beste aus deinem KI-Schreibassistenten herauszuholen.',
    tutGS: 'Erste Schritte', tutInstall: 'Installation',
    tutInstallDesc: 'So installierst du die Chrome-Erweiterung, erstellst dein Konto und konfigurierst deine erste Sprache.',
    tutFeat: 'Funktionen', tutGrammar: 'Grammatik & Stil',
    tutGrammarDesc: 'Grammatikprobleme verstehen, Stilvorschläge nutzen und die Umformulierungswerkzeuge effektiv einsetzen.',
    tutAdv: 'Fortgeschritten', tutMulti: 'Mehrsprachige Einrichtung',
    tutMultiDesc: 'Zwischen Sprachen wechseln, Textsprache automatisch erkennen und Einstellungen pro Website konfigurieren.',
    priceBadge: 'Preise', priceTitle: 'Einfache, erschwingliche Preise',
    priceDesc: 'Starte kostenlos. Upgrade wenn du mehr brauchst.',
    free: 'Kostenlos', foreverFree: 'Für immer kostenlos', pro: 'Pro', cancelAnytime: 'Jederzeit kündbar',
    mostPopular: 'AM BELIEBTESTEN',
    pFree1: '20 Prüfungen pro Tag', pFree2: 'Alle 23+ Sprachen', pFree3: 'Grammatik & Rechtschreibung',
    pFree4: 'Chrome-Erweiterung', pFree5: 'Grundlegende Stilvorschläge',
    pPro1: 'Unbegrenzte Prüfungen', pPro2: 'Alle 23+ Sprachen', pPro3: 'Grammatik, Rechtschreibung & Stil',
    pPro4: 'Umformulierung & Tonanpassung', pPro5: 'Priorisierte KI-Verarbeitung',
    pPro6: 'API-Zugang', pPro7: 'Nutzungsstatistiken',
    startPro: 'Pro starten',
    ctaTitle: 'Bereit, besser zu schreiben?',
    ctaDesc: 'Schließe dich tausenden Autoren an, die Ord nutzen, um in jeder Sprache klar zu kommunizieren.',
    product: 'Produkt', company: 'Unternehmen', allLanguages: 'Alle Sprachen',
    about: 'Über uns', privacy: 'Datenschutz', terms: 'AGB', contact: 'Kontakt',
    footerDesc: 'KI-gesteuerter Schreibassistent für jede Sprache. Schreibe mit Zuversicht auf Schwedisch, Englisch, Urdu, Hindi und 15+ weiteren Sprachen.',
  },
  hi: {
    features: 'विशेषताएं', languages: 'भाषाएं', tutorials: 'ट्यूटोरियल', pricing: 'मूल्य', download: 'डाउनलोड',
    login: 'लॉग इन', getStarted: 'मुफ्त शुरू करें', logout: 'लॉग आउट',
    heroBadge: 'AI-संचालित लेखन सहायक',
    heroTitle1: 'हर भाषा में ', heroTitle2: 'परफेक्ट लिखें',
    heroDesc: 'Ord उन्नत AI का उपयोग करके 23+ भाषाओं में व्याकरण, वर्तनी और शैली की जांच करता है। स्वीडिश से उर्दू, हिंदी से जापानी — हर जगह आत्मविश्वास से लिखें।',
    startFree: 'मुफ्त शुरू करें', seeFeatures: 'विशेषताएं देखें',
    featBadge: 'विशेषताएं', featTitle: 'बेहतर लिखने के लिए सब कुछ',
    featDesc: 'उन्नत AI द्वारा संचालित जो हर भाषा में संदर्भ, स्वर और बारीकियों को समझता है।',
    feat1: 'व्याकरण जांच', feat1d: 'AI उन व्याकरण त्रुटियों का पता लगाता है जो नियम-आधारित चेकर चूक जाते हैं।',
    feat2: 'वर्तनी जांच', feat2d: 'स्मार्ट वर्तनी सुधार जो समान शब्दों के बीच अंतर जानता है।',
    feat3: 'शैली और स्वर', feat3d: 'अपने लेखन को औपचारिक, अनौपचारिक, संक्षिप्त या विस्तृत बनाएं।',
    feat4: 'ऑटो-चेक', feat4d: 'किसी भी वेबसाइट पर रीयल-टाइम में काम करता है।',
    feat5: 'गोपनीयता पहले', feat5d: 'आपका टेक्स्ट प्रोसेस किया जाता है और भुला दिया जाता है। हम कभी आपका लेखन संग्रहीत नहीं करते।',
    feat6: '23+ भाषाएं', feat6d: 'स्वीडिश से उर्दू, हिंदी से जापानी तक। सबसे व्यापक बहुभाषी AI लेखन सहायक।',
    langBadge: 'भाषाएं', langTitle: 'किसी भी भाषा में लिखें',
    langDesc: 'Ord 23+ भाषाओं का समर्थन करता है।',
    howBadge: 'कैसे काम करता है', howTitle: '2 मिनट में शुरू करें',
    howDesc: 'Chrome एक्सटेंशन इंस्टॉल करें और तुरंत बेहतर लिखना शुरू करें।',
    step1: 'एक्सटेंशन इंस्टॉल करें', step1d: 'Ord को Chrome में जोड़ें। एक क्लिक।',
    step2: 'खाता बनाएं', step2d: 'मुफ्त में साइन अप करें। प्रतिदिन 20 जांच शामिल।',
    step3: 'लिखना शुरू करें', step3d: 'वेब पर कहीं भी लिखें। Ord स्वचालित रूप से जांच करता है।',
    step4: 'सुधार लागू करें', step4d: 'सुझावों की समीक्षा करें और एक क्लिक से सुधार लागू करें।',
    dlBadge: 'डाउनलोड', dlTitle: 'Chrome एक्सटेंशन प्राप्त करें',
    dlDesc: 'अपने ब्राउज़र में Ord इंस्टॉल करें।',
    dlBtn: 'Chrome के लिए डाउनलोड करें',
    tutBadge: 'ट्यूटोरियल', tutTitle: 'Ord का उपयोग सीखें',
    tutDesc: 'अपने AI लेखन सहायक का अधिकतम लाभ उठाने के लिए चरण-दर-चरण गाइड।',
    priceBadge: 'मूल्य', priceTitle: 'सरल, किफायती मूल्य',
    priceDesc: 'मुफ्त शुरू करें। जरूरत पड़ने पर अपग्रेड करें।',
    free: 'मुफ्त', foreverFree: 'हमेशा मुफ्त', pro: 'प्रो', cancelAnytime: 'कभी भी रद्द करें',
    mostPopular: 'सबसे लोकप्रिय',
    pFree1: 'प्रतिदिन 20 जांच', pFree2: 'सभी 23+ भाषाएं', pFree3: 'व्याकरण और वर्तनी',
    pFree4: 'Chrome एक्सटेंशन', pFree5: 'बुनियादी शैली सुझाव',
    pPro1: 'असीमित जांच', pPro2: 'सभी 23+ भाषाएं', pPro3: 'व्याकरण, वर्तनी और शैली',
    pPro4: 'पुनर्लेखन और स्वर समायोजन', pPro5: 'प्राथमिकता AI प्रसंस्करण',
    pPro6: 'API एक्सेस', pPro7: 'उपयोग विश्लेषण',
    startPro: 'प्रो शुरू करें',
    ctaTitle: 'बेहतर लिखने के लिए तैयार?',
    ctaDesc: 'हजारों लेखकों से जुड़ें जो किसी भी भाषा में स्पष्ट रूप से संवाद करने के लिए Ord का उपयोग करते हैं।',
    product: 'उत्पाद', company: 'कंपनी', allLanguages: 'सभी भाषाएं',
    about: 'हमारे बारे में', privacy: 'गोपनीयता', terms: 'शर्तें', contact: 'संपर्क',
    footerDesc: 'हर भाषा के लिए AI-संचालित लेखन सहायक।',
  },
  ur: {
    features: 'خصوصیات', languages: 'زبانیں', tutorials: 'ٹیوٹوریلز', pricing: 'قیمتیں', download: 'ڈاؤن لوڈ',
    login: 'لاگ ان', getStarted: 'مفت شروع کریں', logout: 'لاگ آؤٹ',
    heroBadge: 'AI سے چلنے والا تحریری معاون',
    heroTitle1: 'ہر زبان میں ', heroTitle2: 'بالکل درست لکھیں',
    heroDesc: 'Ord جدید AI استعمال کرتا ہے 23+ زبانوں میں گرامر، املا اور طرز کی جانچ کے لیے۔ سویڈش سے اردو، ہندی سے جاپانی — ہر جگہ اعتماد سے لکھیں۔',
    startFree: 'مفت شروع کریں', seeFeatures: 'خصوصیات دیکھیں',
    featBadge: 'خصوصیات', featTitle: 'بہتر لکھنے کے لیے سب کچھ',
    featDesc: 'جدید AI سے چلتا ہے جو ہر زبان میں سیاق و سباق، لہجہ اور باریکیوں کو سمجھتا ہے۔',
    feat1: 'گرامر چیک', feat1d: 'AI ان گرامر کی غلطیوں کا پتہ لگاتا ہے جو قاعدے پر مبنی چیکرز چھوڑ دیتے ہیں۔',
    feat2: 'املا چیک', feat2d: 'ذہین املا اصلاح جو ملتے جلتے الفاظ میں فرق جانتی ہے۔',
    feat3: 'طرز اور لہجہ', feat3d: 'اپنی تحریر کو رسمی، غیر رسمی، مختصر یا تفصیلی بنائیں۔',
    feat4: 'آٹو چیک', feat4d: 'کسی بھی ویب سائٹ پر ریئل ٹائم میں کام کرتا ہے۔',
    feat5: 'رازداری پہلے', feat5d: 'آپ کا متن پروسیس ہوتا ہے اور بھلا دیا جاتا ہے۔ ہم کبھی آپ کی تحریر محفوظ نہیں کرتے۔',
    feat6: '23+ زبانیں', feat6d: 'سویڈش سے اردو، ہندی سے جاپانی۔ سب سے جامع کثیر لسانی AI تحریری معاون۔',
    langBadge: 'زبانیں', langTitle: 'کسی بھی زبان میں لکھیں',
    langDesc: 'Ord 23+ زبانوں کی حمایت کرتا ہے۔',
    howBadge: 'یہ کیسے کام کرتا ہے', howTitle: '2 منٹ میں شروع کریں',
    howDesc: 'Chrome ایکسٹینشن انسٹال کریں اور فوری طور پر بہتر لکھنا شروع کریں۔',
    dlBadge: 'ڈاؤن لوڈ', dlTitle: 'Chrome ایکسٹینشن حاصل کریں',
    dlDesc: 'اپنے براؤزر میں Ord انسٹال کریں۔',
    dlBtn: 'Chrome کے لیے ڈاؤن لوڈ کریں',
    tutBadge: 'ٹیوٹوریلز', tutTitle: 'Ord استعمال کرنا سیکھیں',
    tutDesc: 'اپنے AI تحریری معاون سے زیادہ سے زیادہ فائدہ اٹھانے کے لیے مرحلہ وار گائیڈ۔',
    priceBadge: 'قیمتیں', priceTitle: 'آسان، سستی قیمتیں',
    priceDesc: 'مفت شروع کریں۔ ضرورت پڑنے پر اپ گریڈ کریں۔',
    free: 'مفت', foreverFree: 'ہمیشہ مفت', pro: 'پرو', cancelAnytime: 'کسی بھی وقت منسوخ کریں',
    mostPopular: 'سب سے مقبول',
    pFree1: 'روزانہ 20 جانچ', pFree2: 'تمام 23+ زبانیں', pFree3: 'گرامر اور املا',
    pFree4: 'Chrome ایکسٹینشن', pFree5: 'بنیادی طرز کی تجاویز',
    pPro1: 'لامحدود جانچ', pPro2: 'تمام 23+ زبانیں', pPro3: 'گرامر، املا اور طرز',
    pPro4: 'دوبارہ لکھنا اور لہجہ ایڈجسٹمنٹ', pPro5: 'ترجیحی AI پروسیسنگ',
    pPro6: 'API رسائی', pPro7: 'استعمال کے اعداد و شمار',
    startPro: 'پرو شروع کریں',
    ctaTitle: 'بہتر لکھنے کے لیے تیار؟',
    ctaDesc: 'ہزاروں لکھاریوں میں شامل ہوں جو کسی بھی زبان میں واضح طور پر بات چیت کرنے کے لیے Ord استعمال کرتے ہیں۔',
    product: 'پروڈکٹ', company: 'کمپنی', allLanguages: 'تمام زبانیں',
    about: 'ہمارے بارے میں', privacy: 'رازداری', terms: 'شرائط', contact: 'رابطہ',
    footerDesc: 'ہر زبان کے لیے AI سے چلنے والا تحریری معاون۔',
  },
};

function t(k) { return (TR[siteLang] && TR[siteLang][k]) || TR.en[k] || k; }
function setSiteLang(l) { siteLang = l; localStorage.setItem('ord_site_lang', l); route(); }

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('ord_token');
  if (token) {
    fetchMe();
  } else {
    route();
  }
  window.addEventListener('hashchange', route);
});

function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

function toast(msg, type = 'info') {
  const c = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

async function api(url, opts = {}) {
  const token = localStorage.getItem('ord_token');
  const headers = { ...(opts.headers || {}) };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  if (opts.body && typeof opts.body === 'object') {
    headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(opts.body);
  }
  const res = await fetch(API + url, { ...opts, headers });
  if (res.status === 401) { localStorage.removeItem('ord_token'); currentUser = null; route(); throw new Error('Unauthorized'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function fetchMe() {
  try {
    const data = await api('/auth/me');
    currentUser = data.user;
    route();
  } catch {
    localStorage.removeItem('ord_token');
    route();
  }
}

function route() {
  const hash = window.location.hash.replace('#', '') || '';
  if (hash.startsWith('dashboard') && currentUser) return renderDashboard();
  if (hash === 'tutorials') return renderTutorialsPage();
  renderLanding();
}

// ─── Landing Page ───
function renderLanding() {
  document.getElementById('app').innerHTML = `
    <nav class="nav">
      <div class="nav-inner">
        <a class="nav-brand" href="#" onclick="event.preventDefault();window.location.hash='';route()">
          <div class="nav-logo">O</div>
          Ord
        </a>
        <ul class="nav-links">
          <li><a href="#features" onclick="scrollToSection(event,'features-section')">${t('features')}</a></li>
          <li><a href="#languages" onclick="scrollToSection(event,'languages-section')">${t('languages')}</a></li>
          <li><a href="#download" onclick="scrollToSection(event,'download-section')">${t('download')}</a></li>
          <li><a href="#tutorials" onclick="scrollToSection(event,'tutorials-section')">${t('tutorials')}</a></li>
          <li><a href="#pricing" onclick="scrollToSection(event,'pricing-section')">${t('pricing')}</a></li>
        </ul>
        <div class="nav-lang-switcher">
          <select onchange="setSiteLang(this.value)" class="lang-select">
            ${Object.entries(SITE_LANGS).map(([code, name]) => '<option value="' + code + '"' + (code === siteLang ? ' selected' : '') + '>' + name + '</option>').join('')}
          </select>
        </div>
        <div class="nav-auth">
          ${currentUser ? `
            <button class="btn btn-ghost" onclick="window.location.hash='dashboard'">${esc(currentUser.name || currentUser.email)}</button>
            <button class="btn btn-secondary btn-sm" onclick="logout()">${t('logout')}</button>
          ` : `
            <button class="btn btn-ghost" onclick="showAuthModal('login')">${t('login')}</button>
            <button class="btn btn-primary btn-sm" onclick="showAuthModal('register')">${t('getStarted')}</button>
          `}
        </div>
        <button class="nav-hamburger" onclick="toggleMobileMenu()" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
      <a href="#features" onclick="scrollToSection(event,'features-section');closeMobileMenu()">${t('features')}</a>
      <a href="#languages" onclick="scrollToSection(event,'languages-section');closeMobileMenu()">${t('languages')}</a>
      <a href="#download" onclick="scrollToSection(event,'download-section');closeMobileMenu()">${t('download')}</a>
      <a href="#tutorials" onclick="scrollToSection(event,'tutorials-section');closeMobileMenu()">${t('tutorials')}</a>
      <a href="#pricing" onclick="scrollToSection(event,'pricing-section');closeMobileMenu()">${t('pricing')}</a>
      <div class="mobile-menu-lang">
        <select onchange="setSiteLang(this.value);closeMobileMenu()" class="lang-select" style="width:100%">
          ${Object.entries(SITE_LANGS).map(([code, name]) => '<option value="' + code + '"' + (code === siteLang ? ' selected' : '') + '>' + name + '</option>').join('')}
        </select>
      </div>
      <div class="mobile-menu-auth">
        ${currentUser ? `
          <button class="btn btn-ghost" onclick="window.location.hash='dashboard';closeMobileMenu()">${esc(currentUser.name || currentUser.email)}</button>
          <button class="btn btn-secondary btn-sm" onclick="logout()">${t('logout')}</button>
        ` : `
          <button class="btn btn-ghost" onclick="showAuthModal('login');closeMobileMenu()">${t('login')}</button>
          <button class="btn btn-primary btn-sm" style="width:100%" onclick="showAuthModal('register');closeMobileMenu()">${t('getStarted')}</button>
        `}
      </div>
    </div>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <div>
          <div class="hero-badge">&#9889; ${t('heroBadge')}</div>
          <h1>${t('heroTitle1')}<span class="gradient-text">${t('heroTitle2')}</span></h1>
          <p class="hero-desc">${t('heroDesc')}</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="showAuthModal('register')">${t('startFree')} &rarr;</button>
            <button class="btn btn-secondary btn-lg" onclick="scrollToSection(event,'features-section')">${t('seeFeatures')}</button>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="hero-stat-value">23+</div><div class="hero-stat-label">${t('languages')}</div></div>
            <div class="hero-stat"><div class="hero-stat-value">AI</div><div class="hero-stat-label">Advanced AI Engine</div></div>
            <div class="hero-stat"><div class="hero-stat-value">$5</div><div class="hero-stat-label">/month Pro</div></div>
          </div>
        </div>
        <div class="hero-demo">
          <div class="demo-window">
            <div class="demo-titlebar">
              <div class="demo-dot demo-dot-red"></div>
              <div class="demo-dot demo-dot-yellow"></div>
              <div class="demo-dot demo-dot-green"></div>
            </div>
            <div class="demo-body">
              <div class="demo-text">
                Hej! Jag vill <span class="demo-error">berrata</span> om <span class="demo-error">mote</span> vi hade igar. Det var <span class="demo-error">valdigt</span> produktivt och vi <span class="demo-error">besultade</span> att...
              </div>
              <div class="demo-panel">
                <div class="demo-panel-header">
                  <div class="demo-panel-icon">O</div>
                  <div class="demo-panel-title">4 issues found</div>
                </div>
                <div class="demo-panel-issue"><del>berrata</del> &rarr; <strong>beratta</strong> &nbsp;Stavning</div>
                <div class="demo-panel-issue"><del>mote</del> &rarr; <strong>motet</strong> &nbsp;Grammatik</div>
                <div class="demo-panel-issue"><del>valdigt</del> &rarr; <strong>valdigt</strong> &nbsp;Stavning</div>
                <div class="demo-panel-issue"><del>besultade</del> &rarr; <strong>beslutade</strong> &nbsp;Stavning</div>
                <div class="demo-score">
                  <span style="font-size:12px;color:#94a3b8">Quality</span>
                  <div class="demo-score-bar"><div class="demo-score-fill"></div></div>
                  <div class="demo-score-value">78</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features" id="features-section">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">&#10024; ${t('featBadge')}</div>
          <h2>${t('featTitle')}</h2>
          <p>${t('featDesc')}</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon" style="background:#eff6ff;color:#3b82f6">&#128269;</div>
            <h3>${t('feat1')}</h3>
            <p>${t('feat1d')}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:#fef3c7;color:#f59e0b">&#128221;</div>
            <h3>${t('feat2')}</h3>
            <p>${t('feat2d')}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:#f0fdf4;color:#22c55e">&#127912;</div>
            <h3>${t('feat3')}</h3>
            <p>${t('feat3d')}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:#faf5ff;color:#8b5cf6">&#128640;</div>
            <h3>${t('feat4')}</h3>
            <p>${t('feat4d')}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:#fef2f2;color:#ef4444">&#128274;</div>
            <h3>${t('feat5')}</h3>
            <p>${t('feat5d')}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:#ecfdf5;color:#059669">&#127760;</div>
            <h3>${t('feat6')}</h3>
            <p>${t('feat6d')}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Languages -->
    <section class="languages" id="languages-section">
      <div class="container">
        <div class="section-header">
          <div class="section-badge" style="background:rgba(59,130,246,0.15);color:#93c5fd">&#127760; ${t('langBadge')}</div>
          <h2 style="color:#fff">${t('langTitle')}</h2>
          <p style="color:#94a3b8">${t('langDesc')}</p>
        </div>
        <div class="lang-grid">
          ${[
            ['&#127480;&#127466;','Svenska','Nordic'],
            ['&#127468;&#127463;','English','Global'],
            ['&#127475;&#127476;','Norsk','Nordic'],
            ['&#127465;&#127472;','Dansk','Nordic'],
            ['&#127467;&#127470;','Suomi','Nordic'],
            ['&#127465;&#127466;','Deutsch','European'],
            ['&#127467;&#127479;','Francais','European'],
            ['&#127466;&#127480;','Espanol','European'],
            ['&#127470;&#127481;','Italiano','European'],
            ['&#127477;&#127481;','Portugues','European'],
            ['&#127475;&#127473;','Nederlands','European'],
            ['&#127477;&#127473;','Polski','European'],
            ['&#127477;&#127472;','Urdu','South Asian'],
            ['&#127470;&#127475;','Hindi','South Asian'],
            ['&#127470;&#127475;','Punjabi','South Asian'],
            ['&#127462;&#127467;','Dari','South Asian'],
            ['&#127462;&#127466;','Arabic','Middle East'],
            ['&#127464;&#127475;','Chinese','East Asian'],
            ['&#127471;&#127477;','Japanese','East Asian'],
            ['&#127472;&#127479;','Korean','East Asian'],
            ['&#127479;&#127482;','Russian','European'],
            ['&#127481;&#127479;','Turkish','European'],
            ['<img src="images/flag-phr.png" style="width:24px;height:16px;border-radius:2px">','Pahari','South Asian']
          ].map(([flag, name]) => `
            <div class="lang-card">
              <span class="lang-flag">${flag}</span>
              <div>
                <div class="lang-name">${name}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">&#128736; ${t('howBadge')}</div>
          <h2>${t('howTitle')}</h2>
          <p>${t('howDesc')}</p>
        </div>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>${t('step1')}</h3>
            <p>${t('step1d')}</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>${t('step2')}</h3>
            <p>${t('step2d')}</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>${t('step3')}</h3>
            <p>${t('step3d')}</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h3>${t('step4')}</h3>
            <p>${t('step4d')}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Download Extension -->
    <section class="download-section" id="download-section">
      <div class="container">
        <div class="section-header">
          <div class="section-badge" style="background:rgba(34,197,94,0.12);color:#4ade80">&#11015; ${t('dlBadge')}</div>
          <h2>${t('dlTitle')}</h2>
          <p>${t('dlDesc')}</p>
        </div>
        <div class="download-card">
          <div class="download-card-inner">
            <div style="width:80px;height:80px;border-radius:20px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:40px;color:#fff;box-shadow:0 8px 32px rgba(59,130,246,0.3);margin:0 auto 20px">O</div>
            <h3 style="font-size:24px;font-weight:700;margin-bottom:8px">Ord - AI Writing Assistant</h3>
            <p style="color:var(--text-light);margin-bottom:24px;font-size:15px">Chrome Extension &middot; ${t('free')} &middot; 23+ ${t('languages')}</p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
              <a href="${BASE}/ord-chrome-extension.zip" class="btn btn-primary btn-lg">${t('dlBtn')} &darr;</a>
            </div>
            <div style="margin-top:32px;text-align:left;max-width:420px;margin-left:auto;margin-right:auto">
              <h4 style="font-size:14px;font-weight:600;margin-bottom:12px;color:var(--text-light);text-transform:uppercase;letter-spacing:0.5px">Quick Install</h4>
              <ol style="padding-left:20px;font-size:14px;line-height:2.2;color:#475569">
                <li>${t('dlStep1')}</li>
                <li>${t('dlStep2')}</li>
                <li>${t('dlStep3')}</li>
                <li>${t('dlStep4')}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tutorials -->
    <section class="tutorials" id="tutorials-section">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">&#128218; ${t('tutBadge')}</div>
          <h2>${t('tutTitle')}</h2>
          <p>${t('tutDesc')}</p>
        </div>
        <div class="tutorial-grid">
          <div class="tutorial-card" onclick="window.location.hash='tutorials'">
            <div class="tutorial-thumb" style="background:linear-gradient(135deg,#1e40af,#3b82f6)">&#128187;</div>
            <div class="tutorial-body">
              <div class="tutorial-tag">${t('tutGS')}</div>
              <h3>${t('tutInstall')}</h3>
              <p>${t('tutInstallDesc')}</p>
            </div>
          </div>
          <div class="tutorial-card" onclick="window.location.hash='tutorials'">
            <div class="tutorial-thumb" style="background:linear-gradient(135deg,#7c3aed,#a78bfa)">&#128221;</div>
            <div class="tutorial-body">
              <div class="tutorial-tag">${t('tutFeat')}</div>
              <h3>${t('tutGrammar')}</h3>
              <p>${t('tutGrammarDesc')}</p>
            </div>
          </div>
          <div class="tutorial-card" onclick="window.location.hash='tutorials'">
            <div class="tutorial-thumb" style="background:linear-gradient(135deg,#059669,#34d399)">&#127760;</div>
            <div class="tutorial-body">
              <div class="tutorial-tag">${t('tutAdv')}</div>
              <h3>${t('tutMulti')}</h3>
              <p>${t('tutMultiDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="pricing" id="pricing-section">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">&#128176; ${t('priceBadge')}</div>
          <h2>${t('priceTitle')}</h2>
          <p>${t('priceDesc')}</p>
        </div>
        <div class="pricing-grid">
          <div class="price-card">
            <h3>${t('free')}</h3>
            <div class="price-amount">$0</div>
            <div class="price-period">${t('foreverFree')}</div>
            <ul class="price-features">
              <li>${t('pFree1')}</li>
              <li>${t('pFree2')}</li>
              <li>${t('pFree3')}</li>
              <li>${t('pFree4')}</li>
              <li>${t('pFree5')}</li>
            </ul>
            <button class="btn btn-outline" onclick="showAuthModal('register')">${t('getStarted')}</button>
          </div>
          <div class="price-card featured">
            <div class="price-badge">${t('mostPopular')}</div>
            <h3>${t('pro')}</h3>
            <div class="price-amount">$5 <span>/month</span></div>
            <div class="price-period">${t('cancelAnytime')}</div>
            <ul class="price-features">
              <li>${t('pPro1')}</li>
              <li>${t('pPro2')}</li>
              <li>${t('pPro3')}</li>
              <li>${t('pPro4')}</li>
              <li>${t('pPro5')}</li>
              <li>${t('pPro6')}</li>
              <li>${t('pPro7')}</li>
            </ul>
            <button class="btn btn-primary" onclick="showAuthModal('register')">${t('startPro')} &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="container">
        <h2>${t('ctaTitle')}</h2>
        <p>${t('ctaDesc')}</p>
        <div class="cta-actions">
          <button class="btn btn-primary btn-lg" onclick="showAuthModal('register')">${t('getStarted')} &rarr;</button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand"><div class="nav-logo" style="width:28px;height:28px;font-size:16px">O</div> Ord</div>
            <p class="footer-desc">${t('footerDesc')}</p>
          </div>
          <div>
            <h4>${t('product')}</h4>
            <ul>
              <li><a href="#features" onclick="scrollToSection(event,'features-section')">${t('features')}</a></li>
              <li><a href="#pricing" onclick="scrollToSection(event,'pricing-section')">${t('pricing')}</a></li>
              <li><a href="#tutorials">${t('tutorials')}</a></li>
              <li><a href="#download" onclick="scrollToSection(event,'download-section')">Chrome Extension</a></li>
            </ul>
          </div>
          <div>
            <h4>${t('languages')}</h4>
            <ul>
              <li><a href="#">Swedish</a></li>
              <li><a href="#">English</a></li>
              <li><a href="#">Urdu</a></li>
              <li><a href="#">Hindi</a></li>
              <li><a href="#">Pahari</a></li>
              <li><a href="#">${t('allLanguages')}</a></li>
            </ul>
          </div>
          <div>
            <h4>${t('company')}</h4>
            <ul>
              <li><a href="#">${t('about')}</a></li>
              <li><a href="#">${t('privacy')}</a></li>
              <li><a href="#">${t('terms')}</a></li>
              <li><a href="#">${t('contact')}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          &copy; ${new Date().getFullYear()} Ord. All rights reserved.
        </div>
      </div>
    </footer>

    <!-- Chatbot -->
    <div id="ord-chatbot">
      <div class="chatbot-window hidden" id="chatbotWindow">
        <div class="chatbot-header">
          <div class="chatbot-header-left">
            <div class="chatbot-avatar">O</div>
            <div>
              <h4>Ord Assistant</h4>
              <p>Ask me anything about Ord</p>
            </div>
          </div>
          <button class="chatbot-close" onclick="toggleChatbot()">&times;</button>
        </div>
        <div class="chatbot-messages" id="chatbotMessages">
          <div class="chatbot-msg bot">Hi! I'm the Ord assistant. I can help you with questions about our AI writing tool, supported languages, pricing, or how to get started. What would you like to know?</div>
        </div>
        <div class="chatbot-input-area">
          <input type="text" id="chatbotInput" placeholder="Type a message..." onkeydown="if(event.key==='Enter')sendChatMsg()">
          <button onclick="sendChatMsg()">Send</button>
        </div>
      </div>
      <button class="chatbot-fab" onclick="toggleChatbot()" title="Chat with us">&#128172;</button>
    </div>

    <!-- Auth Modal -->
    <div class="modal-overlay hidden" id="authModal">
      <div class="modal">
        <div class="modal-header">
          <h2 id="authModalTitle">Log In</h2>
          <button class="modal-close" onclick="closeAuthModal()">&times;</button>
        </div>
        <div class="modal-body" id="authModalBody"></div>
      </div>
    </div>
  `;
}

function toggleChatbot() {
  const w = document.getElementById('chatbotWindow');
  if (w) w.classList.toggle('hidden');
}

async function sendChatMsg() {
  const input = document.getElementById('chatbotInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';

  const messages = document.getElementById('chatbotMessages');
  messages.innerHTML += '<div class="chatbot-msg user">' + escHtml(msg) + '</div>';
  messages.innerHTML += '<div class="chatbot-msg typing" id="chatTyping">Thinking...</div>';
  messages.scrollTop = messages.scrollHeight;

  try {
    const resp = await fetch(API + '/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await resp.json();
    const typing = document.getElementById('chatTyping');
    if (typing) typing.remove();

    if (data.reply) {
      messages.innerHTML += '<div class="chatbot-msg bot">' + escHtml(data.reply) + '</div>';
    } else {
      messages.innerHTML += '<div class="chatbot-msg bot">Sorry, I could not process that. Try again!</div>';
    }
  } catch {
    const typing = document.getElementById('chatTyping');
    if (typing) typing.remove();
    messages.innerHTML += '<div class="chatbot-msg bot">Something went wrong. Please try again.</div>';
  }
  messages.scrollTop = messages.scrollHeight;
}

function escHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function scrollToSection(e, id) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.querySelector('.nav-hamburger');
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}
function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.querySelector('.nav-hamburger');
  menu.classList.remove('open');
  btn.classList.remove('open');
}

// ─── Auth ───
function showAuthModal(mode) {
  const modal = document.getElementById('authModal');
  const title = document.getElementById('authModalTitle');
  const body = document.getElementById('authModalBody');
  modal.classList.remove('hidden');

  if (mode === 'login') {
    title.textContent = 'Log In';
    body.innerHTML = `
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="authEmail" placeholder="your@email.com">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="authPassword" placeholder="Your password">
      </div>
      <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px" onclick="doLogin()">Log In</button>
      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--text-light)">
        Don't have an account? <a href="#" onclick="event.preventDefault();showAuthModal('register')">Sign up free</a>
      </p>
    `;
  } else {
    title.textContent = 'Create Account';
    body.innerHTML = `
      <div class="form-group">
        <label>Name</label>
        <input type="text" id="authName" placeholder="Your name">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="authEmail" placeholder="your@email.com">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="authPassword" placeholder="Choose a password (min 6 chars)">
      </div>
      <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px" onclick="doRegister()">Create Account</button>
      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--text-light)">
        Already have an account? <a href="#" onclick="event.preventDefault();showAuthModal('login')">Log in</a>
      </p>
    `;
  }
}

function closeAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
}

async function doLogin() {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  if (!email || !password) return toast('Fill in all fields', 'error');
  try {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } });
    localStorage.setItem('ord_token', data.token);
    currentUser = data.user;
    closeAuthModal();
    window.location.hash = 'dashboard';
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function doRegister() {
  const name = document.getElementById('authName').value.trim();
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  if (!email || !password) return toast('Fill in email and password', 'error');
  if (password.length < 6) return toast('Password must be at least 6 characters', 'error');
  try {
    const data = await api('/auth/register', { method: 'POST', body: { name, email, password } });
    localStorage.setItem('ord_token', data.token);
    currentUser = data.user;
    closeAuthModal();
    toast('Welcome to Ord!', 'success');
    window.location.hash = 'dashboard';
  } catch (e) {
    toast(e.message, 'error');
  }
}

function logout() {
  localStorage.removeItem('ord_token');
  currentUser = null;
  window.location.hash = '';
  route();
}

// ─── Dashboard ───
let dashTab = 'overview';

function renderDashboard() {
  document.getElementById('app').innerHTML = `
    <nav class="nav">
      <div class="nav-inner">
        <a class="nav-brand" href="#" onclick="event.preventDefault();window.location.hash='';route()">
          <div class="nav-logo">O</div>
          Ord
        </a>
        <div class="nav-auth">
          <span style="color:#94a3b8;font-size:13px">${esc(currentUser.email)}</span>
          <span style="display:inline-block;padding:3px 10px;background:${currentUser.plan === 'pro' ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : '#334155'};color:#fff;border-radius:12px;font-size:11px;font-weight:600">${currentUser.plan === 'pro' ? 'PRO' : 'FREE'}</span>
          ${currentUser.role === 'admin' ? '<span style="display:inline-block;padding:3px 10px;background:#ef4444;color:#fff;border-radius:12px;font-size:11px;font-weight:600">ADMIN</span>' : ''}
          <button class="btn btn-ghost btn-sm" onclick="logout()">Log out</button>
        </div>
      </div>
    </nav>
    <div class="dashboard">
      <div class="dash-grid">
        <div class="dash-sidebar">
          <button class="dash-nav-item ${dashTab === 'writer' ? 'active' : ''}" onclick="dashTab='writer';renderDashContent()">&#9998; Writer</button>
          <button class="dash-nav-item ${dashTab === 'overview' ? 'active' : ''}" onclick="dashTab='overview';renderDashContent()">&#128200; Overview</button>
          <button class="dash-nav-item ${dashTab === 'apikey' ? 'active' : ''}" onclick="dashTab='apikey';renderDashContent()">&#128273; API Key</button>
          <button class="dash-nav-item ${dashTab === 'usage' ? 'active' : ''}" onclick="dashTab='usage';renderDashContent()">&#128202; Usage</button>
          <button class="dash-nav-item ${dashTab === 'writing-stats' ? 'active' : ''}" onclick="dashTab='writing-stats';renderDashContent()">&#128200; Writing Stats</button>
          <button class="dash-nav-item ${dashTab === 'profile' ? 'active' : ''}" onclick="dashTab='profile';renderDashContent()">&#128100; Profile</button>
          <button class="dash-nav-item ${dashTab === 'subscription' ? 'active' : ''}" onclick="dashTab='subscription';renderDashContent()">&#11088; Subscription</button>
          ${currentUser.role === 'admin' ? `
            <div style="border-top:1px solid var(--border);margin:16px 0;padding-top:16px">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);padding:0 16px;margin-bottom:8px">Admin</div>
              <button class="dash-nav-item ${dashTab === 'admin-users' ? 'active' : ''}" onclick="dashTab='admin-users';renderDashContent()">&#128101; Users</button>
              <button class="dash-nav-item ${dashTab === 'admin-stats' ? 'active' : ''}" onclick="dashTab='admin-stats';renderDashContent()">&#128202; Statistics</button>
            </div>
          ` : ''}
        </div>
        <div class="dash-content" id="dashContent"></div>
      </div>
    </div>
  `;
  renderDashContent();
}

async function renderDashContent() {
  const cont = document.getElementById('dashContent');
  document.querySelectorAll('.dash-nav-item').forEach((el, i) => {
    const tabs = ['writer', 'overview', 'apikey', 'usage', 'writing-stats', 'profile', 'subscription'];
    if (currentUser.role === 'admin') tabs.push('admin-users', 'admin-stats');
    el.classList.toggle('active', tabs[i] === dashTab);
  });

  if (dashTab === 'writer') {
    cont.innerHTML = `
      <div class="writer-layout">
        <div class="writer-main">
          <div class="editor-area" id="editorArea" contenteditable="true" data-placeholder="Start writing or paste your text here..." spellcheck="false"></div>
          <div class="editor-toolbar">
            <div class="editor-toolbar-left">
              <button class="btn btn-primary btn-sm" onclick="editorCheck()">Check</button>
              <button class="btn btn-outline btn-sm" onclick="editorRephrase('rephrase')">Rephrase</button>
              <div class="editor-tone-group">
                <button class="btn btn-sm editor-tone-btn" onclick="editorRephrase('formal')">Formal</button>
                <button class="btn btn-sm editor-tone-btn" onclick="editorRephrase('casual')">Casual</button>
                <button class="btn btn-sm editor-tone-btn" onclick="editorRephrase('concise')">Concise</button>
              </div>
            </div>
            <div class="editor-toolbar-right">
              <label class="editor-autocheck-label">
                <input type="checkbox" id="editorAutoCheck" onchange="toggleAutoCheck(this.checked)">
                <span>Auto-check</span>
              </label>
              <button class="btn btn-sm btn-ghost" style="color:var(--text-light)" onclick="editorClear()">Clear</button>
            </div>
          </div>
        </div>
        <div class="writer-sidebar">
          <div class="writing-score-container">
            <div class="writing-score" id="writerScore">
              <svg viewBox="0 0 120 120" class="score-ring">
                <circle cx="60" cy="60" r="52" stroke="#e2e8f0" stroke-width="8" fill="none"/>
                <circle cx="60" cy="60" r="52" stroke="url(#scoreGradient)" stroke-width="8" fill="none"
                  stroke-dasharray="326.73" stroke-dashoffset="0" stroke-linecap="round"
                  transform="rotate(-90 60 60)" id="scoreCircle"/>
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#22c55e"/>
                    <stop offset="100%" stop-color="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="score-value" id="scoreValue">--</div>
              <div class="score-label">Score</div>
            </div>
          </div>
          <div class="writer-status" id="writerStatus"></div>
          <div class="writer-errors" id="writerErrors">
            <div class="error-count-row">
              <span class="error-dot error-dot-grammar"></span>
              <span>Grammar</span>
              <span class="error-count" id="errGrammar">0</span>
            </div>
            <div class="error-count-row">
              <span class="error-dot error-dot-spelling"></span>
              <span>Spelling</span>
              <span class="error-count" id="errSpelling">0</span>
            </div>
            <div class="error-count-row">
              <span class="error-dot error-dot-style"></span>
              <span>Style</span>
              <span class="error-count" id="errStyle">0</span>
            </div>
          </div>
          <div class="writer-meta">
            <div class="meta-row">
              <span>Words</span>
              <span id="writerWords">0</span>
            </div>
            <div class="meta-row">
              <span>Characters</span>
              <span id="writerChars">0</span>
            </div>
          </div>
          <div class="writer-lang-select">
            <label>Language</label>
            <select id="editorLang" onchange="editorLangChanged()">
              <option value="en">English</option>
              <option value="sv">Swedish</option>
              <option value="no">Norwegian</option>
              <option value="da">Danish</option>
              <option value="fi">Finnish</option>
              <option value="de">German</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="nl">Dutch</option>
              <option value="pl">Polish</option>
              <option value="ar">Arabic</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="ru">Russian</option>
              <option value="tr">Turkish</option>
              <option value="hi">Hindi</option>
              <option value="ur">Urdu</option>
              <option value="pa">Punjabi</option>
              <option value="phr">Pahari</option>
              <option value="prs">Dari</option>
            </select>
          </div>
        </div>
      </div>
      <div class="ord-suggestion-popup hidden" id="suggestionPopup"></div>
      <div class="ord-rephrase-popup hidden" id="rephrasePopup"></div>
    `;
    initEditor();
    return;
  } else if (dashTab === 'overview') {
    let usage = { totals: { total_checks: 0, total_chars: 0 }, langStats: [] };
    try { usage = await api('/usage?days=30'); } catch {}
    const remaining = currentUser.plan === 'pro' ? 'Unlimited' : (currentUser.remaining_calls ?? '20');

    cont.innerHTML = `
      <div class="dash-header"><h2>Welcome, ${esc(currentUser.name || 'Writer')}!</h2></div>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Total Checks</div>
          <div class="stat-value">${usage.totals.total_checks || 0}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Characters Checked</div>
          <div class="stat-value">${((usage.totals.total_chars || 0) / 1000).toFixed(1)}k</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Remaining Today</div>
          <div class="stat-value">${remaining}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Quick Start</h3></div>
        <div class="card-body">
          <p style="margin-bottom:16px;color:var(--text-light)">Get started with Ord in 3 easy steps:</p>
          <ol style="padding-left:20px;line-height:2;font-size:14px">
            <li>Install the <strong>Ord Chrome Extension</strong> from the download page</li>
            <li>Open the extension popup and paste your <strong>API Key</strong></li>
            <li>Start typing in any text field &mdash; Ord will check automatically!</li>
          </ol>
          <div style="margin-top:20px">
            <button class="btn btn-primary btn-sm" onclick="dashTab='apikey';renderDashContent()">Get Your API Key &rarr;</button>
          </div>
        </div>
      </div>
      ${usage.langStats && usage.langStats.length > 0 ? `
        <div class="card">
          <div class="card-header"><h3>Top Languages</h3></div>
          <div class="card-body">
            ${usage.langStats.slice(0, 5).map(l => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                <span style="font-size:14px;font-weight:500">${esc(l.language || 'Unknown')}</span>
                <span style="font-size:13px;color:var(--text-light)">${l.count} checks</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  } else if (dashTab === 'apikey') {
    cont.innerHTML = `
      <div class="dash-header"><h2>API Key</h2></div>
      <div class="card">
        <div class="card-body">
          <p style="margin-bottom:16px;color:var(--text-light)">Use this API key in the Ord Chrome Extension or to access the API directly.</p>
          <div class="api-key-box" id="apiKeyDisplay">${esc(currentUser.api_key || 'Loading...')}</div>
          <div style="display:flex;gap:12px;margin-top:16px">
            <button class="btn btn-sm btn-primary" onclick="copyApiKey()">Copy Key</button>
            <button class="btn btn-sm btn-outline" onclick="regenerateKey()">Regenerate Key</button>
          </div>
          <div style="margin-top:24px;padding:16px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px">
            <p style="font-size:13px;color:#92400e;font-weight:600;margin-bottom:4px">&#9888; Keep your API key secret</p>
            <p style="font-size:13px;color:#a16207">Don't share this key publicly. If compromised, regenerate it immediately.</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Extension Setup</h3></div>
        <div class="card-body">
          <ol style="padding-left:20px;line-height:2.2;font-size:14px">
            <li>Install the Ord Chrome Extension</li>
            <li>Click the Ord icon in your browser toolbar</li>
            <li>Paste your API key in the settings</li>
            <li>Select your preferred language</li>
            <li>Start typing anywhere &mdash; Ord will check automatically!</li>
          </ol>
        </div>
      </div>
    `;
  } else if (dashTab === 'usage') {
    let usage = { stats: [], totals: {}, langStats: [] };
    try { usage = await api('/usage?days=30'); } catch {}

    cont.innerHTML = `
      <div class="dash-header"><h2>Usage Statistics</h2></div>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Total Checks</div>
          <div class="stat-value">${usage.totals.total_checks || 0}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Characters Checked</div>
          <div class="stat-value">${((usage.totals.total_chars || 0) / 1000).toFixed(1)}k</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Languages Used</div>
          <div class="stat-value">${(usage.langStats || []).length}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Last 30 Days</h3></div>
        <div class="card-body">
          ${(usage.stats || []).length === 0 ? '<p style="color:var(--text-light);font-size:14px">No usage data yet. Start using Ord to see your statistics!</p>' : `
            <div style="max-height:300px;overflow-y:auto">
              ${usage.stats.map(s => `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                  <span style="font-size:14px">${esc(s.day)}</span>
                  <span style="font-size:13px;color:var(--text-light)">${s.language || '-'}</span>
                  <span style="font-size:13px;font-weight:600">${s.checks} checks</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  } else if (dashTab === 'writing-stats') {
    let ws = { totals: {}, byEndpoint: [], byLanguage: [], last7days: [], last30days: [], today: {}, streak: 0 };
    try { ws = await api('/writing-stats'); } catch {}

    const maxChecks7 = Math.max(...(ws.last7days || []).map(d => d.checks), 1);
    const streakEmoji = ws.streak >= 7 ? '&#128293;' : ws.streak >= 3 ? '&#11088;' : '&#128170;';

    cont.innerHTML = `
      <div class="dash-header"><h2>Writing Statistics</h2></div>
      <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
        <div class="stat-card">
          <div class="stat-label">Total Checks</div>
          <div class="stat-value">${ws.totals.total_checks || 0}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Characters</div>
          <div class="stat-value">${((ws.totals.total_chars || 0) / 1000).toFixed(1)}k</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Active Days</div>
          <div class="stat-value">${ws.totals.active_days || 0}</div>
        </div>
        <div class="stat-card" style="background:linear-gradient(135deg,#fef3c7,#fde68a);border-color:#fbbf24">
          <div class="stat-label">Streak ${streakEmoji}</div>
          <div class="stat-value">${ws.streak || 0} day${ws.streak === 1 ? '' : 's'}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Today</h3></div>
        <div class="card-body">
          <div style="display:flex;gap:40px">
            <div><span style="font-size:28px;font-weight:700;color:var(--primary)">${ws.today?.checks || 0}</span><br><span style="font-size:12px;color:var(--text-light)">checks today</span></div>
            <div><span style="font-size:28px;font-weight:700;color:var(--primary)">${((ws.today?.chars || 0) / 1000).toFixed(1)}k</span><br><span style="font-size:12px;color:var(--text-light)">characters today</span></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Last 7 Days</h3></div>
        <div class="card-body">
          <div style="display:flex;align-items:flex-end;gap:8px;height:120px;padding-top:10px">
            ${(ws.last7days || []).map(d => `
              <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
                <span style="font-size:11px;font-weight:600;color:var(--text-light)">${d.checks}</span>
                <div style="width:100%;background:linear-gradient(to top,#3b82f6,#60a5fa);border-radius:4px;min-height:4px;height:${Math.round(d.checks / maxChecks7 * 100)}px;transition:height 0.3s"></div>
                <span style="font-size:10px;color:var(--text-muted)">${d.day.slice(5)}</span>
              </div>
            `).join('')}
            ${(ws.last7days || []).length === 0 ? '<p style="color:var(--text-muted);font-size:13px;padding:20px">No data yet. Start checking text to see your stats!</p>' : ''}
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
        <div class="card">
          <div class="card-header"><h3>By Type</h3></div>
          <div class="card-body">
            ${(ws.byEndpoint || []).map(e => `
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                <span style="font-size:13px;text-transform:capitalize">${esc(e.endpoint)}</span>
                <span style="font-size:13px;font-weight:600;color:var(--primary)">${e.count}</span>
              </div>
            `).join('') || '<p style="color:var(--text-muted);font-size:13px">No data yet</p>'}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3>By Language</h3></div>
          <div class="card-body">
            ${(ws.byLanguage || []).slice(0, 8).map(l => `
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                <span style="font-size:13px">${esc(l.language || 'Unknown')}</span>
                <span style="font-size:13px;font-weight:600;color:var(--primary)">${l.count}</span>
              </div>
            `).join('') || '<p style="color:var(--text-muted);font-size:13px">No data yet</p>'}
          </div>
        </div>
      </div>
    `;
  } else if (dashTab === 'profile') {
    cont.innerHTML = `
      <div class="dash-header"><h2>Profile</h2></div>
      <div class="card">
        <div class="card-body">
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="profileName" value="${esc(currentUser.name || '')}">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" value="${esc(currentUser.email)}" disabled style="background:#f8fafc">
          </div>
          <div class="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input type="password" id="profilePassword" placeholder="New password">
          </div>
          <button class="btn btn-primary" onclick="updateProfile()">Save Changes</button>
        </div>
      </div>
    `;
  } else if (dashTab === 'subscription') {
    cont.innerHTML = `
      <div class="dash-header"><h2>Subscription</h2></div>
      <div class="card">
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
            <span style="display:inline-block;padding:6px 16px;background:${currentUser.plan === 'pro' ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : '#e2e8f0'};color:${currentUser.plan === 'pro' ? '#fff' : '#475569'};border-radius:20px;font-size:14px;font-weight:700">${currentUser.plan === 'pro' ? 'PRO' : 'FREE'}</span>
            <span style="font-size:14px;color:var(--text-light)">${currentUser.plan === 'pro' ? '$5/month - Unlimited checks' : '20 checks per day'}</span>
          </div>
          ${currentUser.plan === 'pro' ? `
            <p style="font-size:14px;color:var(--text-light);margin-bottom:16px">You have unlimited grammar checks and full access to all features.</p>
            <button class="btn btn-danger btn-sm" onclick="cancelSubscription()">Cancel Subscription</button>
          ` : `
            <p style="font-size:14px;color:var(--text-light);margin-bottom:20px">Upgrade to Pro for unlimited checks, rephrase tools, and priority processing.</p>
            <div class="price-card featured" style="max-width:400px;border:2px solid var(--primary)">
              <h3>Pro Plan</h3>
              <div class="price-amount">$5 <span>/month</span></div>
              <ul class="price-features">
                <li>Unlimited checks</li>
                <li>Rephrase & tone adjustment</li>
                <li>Priority AI processing</li>
                <li>Usage analytics</li>
              </ul>
              <button class="btn btn-primary" onclick="upgradeToPro()">Upgrade to Pro &rarr;</button>
            </div>
          `}
        </div>
      </div>
    `;
  } else if (dashTab === 'admin-users') {
    cont.innerHTML = '<div class="dash-header"><h2>User Management</h2></div><div id="adminUsersContent"><p style="color:var(--text-light)">Loading users...</p></div>';
    loadAdminUsers();
  } else if (dashTab === 'admin-stats') {
    try {
      const stats = await api('/admin/stats');
      cont.innerHTML = `
        <div class="dash-header"><h2>Platform Statistics</h2></div>
        <div class="stat-grid">
          <div class="stat-card"><div class="stat-label">Total Users</div><div class="stat-value">${stats.totalUsers}</div></div>
          <div class="stat-card"><div class="stat-label">Pro Users</div><div class="stat-value">${stats.proUsers}</div></div>
          <div class="stat-card"><div class="stat-label">Total Checks</div><div class="stat-value">${stats.totalChecks}</div></div>
          <div class="stat-card"><div class="stat-label">Today's Checks</div><div class="stat-value">${stats.todayChecks}</div></div>
        </div>
      `;
    } catch (e) {
      cont.innerHTML = '<div class="dash-header"><h2>Platform Statistics</h2></div><p style="color:var(--danger)">Failed to load stats: ' + esc(e.message) + '</p>';
    }
  }
}

function copyApiKey() {
  navigator.clipboard.writeText(currentUser.api_key || '').then(() => toast('API key copied!', 'success'));
}

async function regenerateKey() {
  if (!confirm('Regenerate API key? Your current key will stop working.')) return;
  try {
    const data = await api('/regenerate-key', { method: 'POST' });
    currentUser.api_key = data.api_key;
    document.getElementById('apiKeyDisplay').textContent = data.api_key;
    toast('New API key generated!', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function updateProfile() {
  const name = document.getElementById('profileName').value.trim();
  const password = document.getElementById('profilePassword').value;
  try {
    const body = { name };
    if (password) body.password = password;
    const data = await api('/profile', { method: 'PUT', body });
    currentUser = { ...currentUser, ...data.user };
    toast('Profile updated!', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function upgradeToPro() {
  try {
    const data = await api('/create-checkout', { method: 'POST' });
    if (data.url) window.location.href = data.url;
    else toast('Stripe is not configured yet', 'error');
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function cancelSubscription() {
  if (!confirm('Cancel your Pro subscription? You will lose unlimited checks.')) return;
  try {
    await api('/cancel-subscription', { method: 'POST' });
    currentUser.plan = 'free';
    toast('Subscription cancelled', 'info');
    renderDashContent();
  } catch (e) {
    toast(e.message, 'error');
  }
}

// ─── Admin Functions ───
async function loadAdminUsers() {
  const cont = document.getElementById('adminUsersContent');
  if (!cont) return;
  try {
    const data = await api('/admin/users');
    cont.innerHTML = `
      <div class="card" style="margin-bottom:24px">
        <div class="card-header"><h3>Add New User</h3></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px;align-items:end">
            <div class="form-group" style="margin-bottom:0"><label>Email</label><input type="email" id="newUserEmail" placeholder="email@example.com"></div>
            <div class="form-group" style="margin-bottom:0"><label>Name</label><input type="text" id="newUserName" placeholder="Full name"></div>
            <div class="form-group" style="margin-bottom:0"><label>Password</label><input type="password" id="newUserPass" placeholder="Min 6 chars"></div>
            <button class="btn btn-primary btn-sm" onclick="adminAddUser()">Add User</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>All Users (${data.users.length})</h3></div>
        <div class="card-body" style="overflow-x:auto">
          <table class="admin-table">
            <thead>
              <tr><th>Email</th><th>Name</th><th>Role</th><th>Plan</th><th>Checks Today</th><th>Created</th><th>Actions</th></tr>
            </thead>
            <tbody>
              ${data.users.map(u => `
                <tr>
                  <td>${esc(u.email)}</td>
                  <td>${esc(u.name || '-')}</td>
                  <td><select onchange="adminUpdateField('${u.id}','role',this.value)" style="padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:13px">
                    <option value="user" ${u.role === 'user' ? 'selected' : ''}>User</option>
                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                  </select></td>
                  <td><select onchange="adminUpdateField('${u.id}','plan',this.value)" style="padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:13px">
                    <option value="free" ${u.plan === 'free' ? 'selected' : ''}>Free</option>
                    <option value="pro" ${u.plan === 'pro' ? 'selected' : ''}>Pro</option>
                  </select></td>
                  <td>${u.api_calls_today || 0}</td>
                  <td>${u.created_at ? u.created_at.split('T')[0] : '-'}</td>
                  <td><button class="btn btn-danger btn-sm" onclick="adminDeleteUser('${u.id}','${esc(u.email).replace(/'/g, "\\'")}')">Delete</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (e) {
    cont.innerHTML = '<p style="color:var(--danger)">Failed to load users: ' + esc(e.message) + '</p>';
  }
}

async function adminAddUser() {
  const email = document.getElementById('newUserEmail').value.trim();
  const name = document.getElementById('newUserName').value.trim();
  const password = document.getElementById('newUserPass').value;
  if (!email || !password) return toast('Email and password required', 'error');
  if (password.length < 6) return toast('Password must be at least 6 characters', 'error');
  try {
    await api('/admin/users', { method: 'POST', body: { email, name, password } });
    toast('User created!', 'success');
    loadAdminUsers();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function adminUpdateField(userId, field, value) {
  try {
    await api('/admin/users/' + userId, { method: 'PUT', body: { [field]: value } });
    toast('User updated', 'success');
  } catch (e) {
    toast(e.message, 'error');
    loadAdminUsers();
  }
}

async function adminDeleteUser(userId, email) {
  if (!confirm('Delete user ' + email + '? This cannot be undone.')) return;
  try {
    await api('/admin/users/' + userId, { method: 'DELETE' });
    toast('User deleted', 'success');
    loadAdminUsers();
  } catch (e) {
    toast(e.message, 'error');
  }
}

// ─── Tutorials Page ───
function renderTutorialsPage() {
  document.getElementById('app').innerHTML = `
    <nav class="nav">
      <div class="nav-inner">
        <a class="nav-brand" href="#" onclick="event.preventDefault();window.location.hash='';route()">
          <div class="nav-logo">O</div>
          Ord
        </a>
        <div class="nav-auth">
          ${currentUser ? `
            <button class="btn btn-ghost" onclick="window.location.hash='dashboard'">${esc(currentUser.name || currentUser.email)}</button>
          ` : `
            <button class="btn btn-ghost" onclick="showAuthModal('login')">${t('login')}</button>
            <button class="btn btn-primary btn-sm" onclick="showAuthModal('register')">${t('getStarted')}</button>
          `}
        </div>
      </div>
    </nav>
    <div style="padding-top:100px;max-width:860px;margin:0 auto;padding-left:24px;padding-right:24px;padding-bottom:80px">
      <h1 style="font-size:36px;font-weight:800;margin-bottom:8px">${t('tutorials')}</h1>
      <p style="font-size:16px;color:var(--text-light);margin-bottom:16px">${t('tutDesc')}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:48px">
        <a href="#tut-install" style="padding:8px 16px;background:#eff6ff;color:#3b82f6;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;border:1px solid #bfdbfe">1. Install Extension</a>
        <a href="#tut-setup" style="padding:8px 16px;background:#eff6ff;color:#3b82f6;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;border:1px solid #bfdbfe">2. Set Up Account</a>
        <a href="#tut-check" style="padding:8px 16px;background:#eff6ff;color:#3b82f6;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;border:1px solid #bfdbfe">3. Check Grammar</a>
        <a href="#tut-inline" style="padding:8px 16px;background:#eff6ff;color:#3b82f6;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;border:1px solid #bfdbfe">4. Inline Fixes</a>
        <a href="#tut-rephrase" style="padding:8px 16px;background:#eff6ff;color:#3b82f6;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;border:1px solid #bfdbfe">5. Rephrase & Tone</a>
        <a href="#tut-desktop" style="padding:8px 16px;background:#eff6ff;color:#3b82f6;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;border:1px solid #bfdbfe">6. Desktop App</a>
        <a href="#tut-stats" style="padding:8px 16px;background:#eff6ff;color:#3b82f6;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;border:1px solid #bfdbfe">7. Writing Stats</a>
        <a href="#tut-languages" style="padding:8px 16px;background:#eff6ff;color:#3b82f6;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;border:1px solid #bfdbfe">8. Languages</a>
        <a href="#tut-firefox" style="padding:8px 16px;background:#eff6ff;color:#3b82f6;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;border:1px solid #bfdbfe">9. Firefox</a>
      </div>

      <!-- STEP 1: Install -->
      <div id="tut-install" style="margin-bottom:56px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <span style="width:36px;height:36px;border-radius:50%;background:#3b82f6;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0">1</span>
          <h2 style="font-size:24px;font-weight:700">Install the Chrome Extension</h2>
        </div>
        <div class="card">
          <div class="card-body" style="line-height:1.9;font-size:15px;color:#334155">
            <ol style="padding-left:24px;margin-bottom:20px">
              <li style="margin-bottom:12px"><strong>Download the extension</strong> - Click the button below:<br>
                <a href="${BASE}/ord-chrome-extension.zip" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#3b82f6;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Download Ord for Chrome</a>
              </li>
              <li style="margin-bottom:12px"><strong>Unzip</strong> the downloaded file to a folder on your computer</li>
              <li style="margin-bottom:12px">Open Chrome and type <code style="background:#f1f5f9;padding:3px 8px;border-radius:4px;font-size:13px;font-weight:600">chrome://extensions</code> in the address bar</li>
              <li style="margin-bottom:12px">Enable <strong>"Developer mode"</strong> using the toggle in the top-right corner</li>
              <li style="margin-bottom:12px">Click <strong>"Load unpacked"</strong> and select the Ord extension folder you unzipped</li>
              <li>The Ord icon (blue "O") will appear in your Chrome toolbar</li>
            </ol>
            <img src="${BASE}/images/tutorials/01-chrome-extensions.png" alt="Chrome Extensions page" style="width:100%;border-radius:8px;border:1px solid #e2e8f0;margin-top:8px">
            <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:8px">The Chrome Extensions page with Ord installed</p>
          </div>
        </div>
      </div>

      <!-- STEP 2: Setup Account -->
      <div id="tut-setup" style="margin-bottom:56px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <span style="width:36px;height:36px;border-radius:50%;background:#3b82f6;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0">2</span>
          <h2 style="font-size:24px;font-weight:700">Set Up Your Account & API Key</h2>
        </div>
        <div class="card">
          <div class="card-body" style="line-height:1.9;font-size:15px;color:#334155">
            <ol style="padding-left:24px;margin-bottom:20px">
              <li style="margin-bottom:12px">Visit <a href="https://skylarkmedia.se/ord" target="_blank"><strong>skylarkmedia.se/ord</strong></a> and click <strong>"Get Started Free"</strong></li>
              <li style="margin-bottom:12px">Create your account with email and password</li>
              <li style="margin-bottom:12px">Once logged in, go to your <strong>Dashboard</strong></li>
              <li style="margin-bottom:12px">Click <strong>"API Key"</strong> in the sidebar and copy your key (starts with <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px">ord_...</code>)</li>
              <li style="margin-bottom:12px">Click the <strong>Ord extension icon</strong> in Chrome toolbar</li>
              <li style="margin-bottom:12px">Paste your API key in the <strong>"Ord API Key"</strong> field</li>
              <li>Select your language and click <strong>"Save Settings"</strong></li>
            </ol>
            <img src="${BASE}/images/tutorials/02-popup-settings.png" alt="Ord popup settings" style="width:360px;display:block;margin:0 auto;border-radius:8px;border:1px solid #e2e8f0">
            <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:8px">Extension popup with API key configured</p>
          </div>
        </div>
      </div>

      <!-- STEP 3: Check Grammar -->
      <div id="tut-check" style="margin-bottom:56px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <span style="width:36px;height:36px;border-radius:50%;background:#3b82f6;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0">3</span>
          <h2 style="font-size:24px;font-weight:700">Check Your Grammar</h2>
        </div>
        <div class="card">
          <div class="card-body" style="line-height:1.9;font-size:15px;color:#334155">
            <p style="margin-bottom:16px">There are 3 ways to check your text:</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
              <div style="padding:16px;background:#f8fafc;border-radius:8px;text-align:center;border:1px solid #e2e8f0">
                <div style="font-size:28px;margin-bottom:8px">&#128308;</div>
                <div style="font-weight:600;margin-bottom:4px">Blue O Button</div>
                <div style="font-size:13px;color:#64748b">Click the blue O button in the bottom-right corner of any page</div>
              </div>
              <div style="padding:16px;background:#f8fafc;border-radius:8px;text-align:center;border:1px solid #e2e8f0">
                <div style="font-size:28px;margin-bottom:8px">&#9000;</div>
                <div style="font-weight:600;margin-bottom:4px">Keyboard Shortcut</div>
                <div style="font-size:13px;color:#64748b">Press Ctrl+Shift+G while in any text field</div>
              </div>
              <div style="padding:16px;background:#f8fafc;border-radius:8px;text-align:center;border:1px solid #e2e8f0">
                <div style="font-size:28px;margin-bottom:8px">&#128433;</div>
                <div style="font-weight:600;margin-bottom:4px">Right-Click Menu</div>
                <div style="font-size:13px;color:#64748b">Select text, right-click, choose "Ord: Check grammar"</div>
              </div>
            </div>
            <img src="${BASE}/images/tutorials/03-fab-button.png" alt="FAB button on webpage" style="width:100%;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:8px">
            <p style="font-size:12px;color:#94a3b8;text-align:center;margin-bottom:24px">The blue O button appears on every webpage</p>

            <h3 style="font-size:18px;margin-bottom:12px">Understanding the Results Panel</h3>
            <p style="margin-bottom:12px">After checking, the Ord panel shows all issues found, each color-coded by type:</p>
            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px">
              <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#fef2f2;border-radius:6px;font-size:13px"><span style="width:20px;height:20px;border-radius:4px;background:#ef4444;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">G</span> Grammar</span>
              <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#fffbeb;border-radius:6px;font-size:13px"><span style="width:20px;height:20px;border-radius:4px;background:#f59e0b;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">S</span> Spelling</span>
              <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#f5f3ff;border-radius:6px;font-size:13px"><span style="width:20px;height:20px;border-radius:4px;background:#8b5cf6;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">P</span> Punctuation</span>
              <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#eff6ff;border-radius:6px;font-size:13px"><span style="width:20px;height:20px;border-radius:4px;background:#3b82f6;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">T</span> Style</span>
            </div>
            <img src="${BASE}/images/tutorials/05-panel-results.png" alt="Results panel" style="width:380px;display:block;margin:0 auto;border-radius:8px;border:1px solid #e2e8f0">
            <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:8px">The Ord panel showing issues, tone analysis, and quality score</p>
          </div>
        </div>
      </div>

      <!-- STEP 4: Inline Fixes -->
      <div id="tut-inline" style="margin-bottom:56px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <span style="width:36px;height:36px;border-radius:50%;background:#22c55e;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0">4</span>
          <h2 style="font-size:24px;font-weight:700">Inline Underlines & One-Click Fixes</h2>
        </div>
        <div class="card">
          <div class="card-body" style="line-height:1.9;font-size:15px;color:#334155">
            <p style="margin-bottom:16px">Like Grammarly, Ord underlines errors <strong>directly inside your text</strong> as you type:</p>
            <ul style="padding-left:24px;margin-bottom:20px">
              <li style="margin-bottom:8px"><span style="border-bottom:2.5px solid #ef4444;padding-bottom:1px">Red underline</span> = Grammar error</li>
              <li style="margin-bottom:8px"><span style="border-bottom:2.5px solid #f59e0b;padding-bottom:1px">Yellow underline</span> = Spelling mistake</li>
              <li style="margin-bottom:8px"><span style="border-bottom:2.5px solid #8b5cf6;padding-bottom:1px">Purple underline</span> = Punctuation issue</li>
              <li><span style="border-bottom:2.5px solid #3b82f6;padding-bottom:1px">Blue underline</span> = Style suggestion</li>
            </ul>
            <p style="margin-bottom:16px"><strong>How to fix:</strong> Hover over any underlined word to see a popup card. Click <strong>"Accept"</strong> to apply the fix instantly, or <strong>"Ignore"</strong> to dismiss it.</p>
            <img src="${BASE}/images/tutorials/04-inline-underlines.png" alt="Inline underlines with hover card" style="width:100%;border-radius:8px;border:1px solid #e2e8f0">
            <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:8px">Hover over underlined text to see the fix and click Accept</p>
          </div>
        </div>
      </div>

      <!-- STEP 5: Rephrase & Tone -->
      <div id="tut-rephrase" style="margin-bottom:56px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <span style="width:36px;height:36px;border-radius:50%;background:#8b5cf6;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0">5</span>
          <h2 style="font-size:24px;font-weight:700">Rephrase & Tone Detection</h2>
        </div>
        <div class="card">
          <div class="card-body" style="line-height:1.9;font-size:15px;color:#334155">
            <p style="margin-bottom:16px">Ord can rewrite your text in different styles:</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px">
              <div style="padding:14px;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd">
                <div style="font-weight:600;margin-bottom:4px">Rephrase</div>
                <div style="font-size:13px;color:#64748b">Rewrite for clarity while keeping the same meaning</div>
              </div>
              <div style="padding:14px;background:#f5f3ff;border-radius:8px;border:1px solid #ddd6fe">
                <div style="font-weight:600;margin-bottom:4px">Formal</div>
                <div style="font-size:13px;color:#64748b">Professional language for business emails and documents</div>
              </div>
              <div style="padding:14px;background:#fef3c7;border-radius:8px;border:1px solid #fde68a">
                <div style="font-weight:600;margin-bottom:4px">Casual</div>
                <div style="font-size:13px;color:#64748b">Friendly language for social media and chat</div>
              </div>
              <div style="padding:14px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0">
                <div style="font-weight:600;margin-bottom:4px">Tone Detection</div>
                <div style="font-size:13px;color:#64748b">See if your text sounds formal, casual, confident, or friendly</div>
              </div>
            </div>
            <p style="margin-bottom:12px"><strong>How to use:</strong> Click the Rephrase, Formal, or Casual buttons in the Ord panel. Or select text, right-click, and choose from the Ord menu.</p>
            <p>After checking grammar, Ord also shows a <strong>Tone Analysis</strong> section with visual bars showing how formal, casual, confident, and friendly your writing sounds.</p>
          </div>
        </div>
      </div>

      <!-- STEP 6: Desktop App -->
      <div id="tut-desktop" style="margin-bottom:56px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <span style="width:36px;height:36px;border-radius:50%;background:#f59e0b;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0">6</span>
          <h2 style="font-size:24px;font-weight:700">Desktop App (Word, Notepad, Any App)</h2>
        </div>
        <div class="card">
          <div class="card-body" style="line-height:1.9;font-size:15px;color:#334155">
            <p style="margin-bottom:16px">Use Ord in <strong>any application</strong> on your computer - Microsoft Word, Notepad, email clients, chat apps, everywhere! Available for Windows, Mac, and Linux.</p>

            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px">
              <a href="https://github.com/anirudhatalmale6-alt/ord-desktop/releases/download/v1.4.0/Ord.1.4.0.exe" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 20px;background:#f59e0b;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
                <span style="font-size:20px">&#9654;</span> Windows
              </a>
              <a href="https://github.com/anirudhatalmale6-alt/ord-desktop/releases/download/v1.4.0/Ord-1.4.0-Mac.zip" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 20px;background:#334155;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
                <span style="font-size:20px">&#63743;</span> Mac
              </a>
              <a href="https://github.com/anirudhatalmale6-alt/ord-desktop/releases/download/v1.4.0/Ord-1.4.0.AppImage" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 20px;background:#e95420;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
                <span style="font-size:20px">&#128039;</span> Linux
              </a>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px">
              <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px">
                <h3 style="font-size:16px;margin-bottom:10px;color:#92400e">Windows Setup</h3>
                <ol style="padding-left:20px;font-size:13px;color:#78350f">
                  <li style="margin-bottom:6px">Download and run <strong>Ord.1.4.0.exe</strong> (portable, no install needed)</li>
                  <li style="margin-bottom:6px">If SmartScreen appears, click "More info" then "Run anyway"</li>
                  <li style="margin-bottom:6px">The Ord icon appears in your <strong>system tray</strong> (near the clock)</li>
                  <li>Sign in with your Ord account</li>
                </ol>
              </div>
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px">
                <h3 style="font-size:16px;margin-bottom:10px;color:#1e293b">Mac Setup</h3>
                <ol style="padding-left:20px;font-size:13px;color:#334155">
                  <li style="margin-bottom:6px">Download and extract <strong>Ord-1.4.0-Mac.zip</strong></li>
                  <li style="margin-bottom:6px">Move <strong>Ord.app</strong> to your Applications folder</li>
                  <li style="margin-bottom:6px">Right-click Ord.app and select <strong>Open</strong> (first time only, to bypass Gatekeeper)</li>
                  <li style="margin-bottom:6px">If blocked: go to System Settings &gt; Privacy &amp; Security &gt; click "Open Anyway"</li>
                  <li>Sign in with your Ord account</li>
                </ol>
              </div>
              <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px">
                <h3 style="font-size:16px;margin-bottom:10px;color:#9a3412">Linux Setup</h3>
                <ol style="padding-left:20px;font-size:13px;color:#7c2d12">
                  <li style="margin-bottom:6px">Download <strong>Ord-1.4.0.AppImage</strong></li>
                  <li style="margin-bottom:6px">Make it executable: <code style="background:#fef3c7;padding:2px 6px;border-radius:3px;font-size:12px">chmod +x Ord-1.4.0.AppImage</code></li>
                  <li style="margin-bottom:6px">Double-click to run, or from terminal: <code style="background:#fef3c7;padding:2px 6px;border-radius:3px;font-size:12px">./Ord-1.4.0.AppImage</code></li>
                  <li>Sign in with your Ord account</li>
                </ol>
              </div>
            </div>

            <h3 style="font-size:18px;margin-bottom:12px">How to Use (All Platforms)</h3>
            <ol style="padding-left:24px;margin-bottom:20px">
              <li style="margin-bottom:8px">Select text in <strong>any application</strong> (Word, Pages, email, etc.)</li>
              <li style="margin-bottom:8px">Copy it (<strong>Ctrl+C</strong> on Windows/Linux, <strong>Cmd+C</strong> on Mac)</li>
              <li style="margin-bottom:8px">Press <strong>Ctrl+Shift+G</strong> (or <strong>Cmd+Shift+G</strong> on Mac) - the Ord window appears with your text</li>
              <li style="margin-bottom:8px">Click <strong>Check</strong>, <strong>Rephrase</strong>, <strong>Formal</strong>, or <strong>Casual</strong></li>
              <li style="margin-bottom:8px">Click <strong>"Copy to Clipboard"</strong> to get the corrected text</li>
              <li>Go back to your app and paste (<strong>Ctrl+V</strong> / <strong>Cmd+V</strong>)</li>
            </ol>
            <img src="${BASE}/images/tutorials/06-desktop-app.png" alt="Ord Desktop App" style="width:420px;display:block;margin:0 auto;border-radius:8px;border:1px solid #e2e8f0">
            <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:8px">The Ord Desktop app works with any application on your computer</p>
          </div>
        </div>
      </div>

      <!-- STEP 7: Writing Stats -->
      <div id="tut-stats" style="margin-bottom:56px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <span style="width:36px;height:36px;border-radius:50%;background:#6366f1;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0">7</span>
          <h2 style="font-size:24px;font-weight:700">Track Your Writing Statistics</h2>
        </div>
        <div class="card">
          <div class="card-body" style="line-height:1.9;font-size:15px;color:#334155">
            <p style="margin-bottom:16px">Your dashboard tracks your writing activity:</p>
            <ul style="padding-left:24px;margin-bottom:20px">
              <li style="margin-bottom:8px"><strong>Total Checks</strong> - How many times you have checked text</li>
              <li style="margin-bottom:8px"><strong>Characters Checked</strong> - Total amount of text processed</li>
              <li style="margin-bottom:8px"><strong>Active Days</strong> - Days you used Ord</li>
              <li style="margin-bottom:8px"><strong>Writing Streak</strong> - Consecutive days of use (keep it going!)</li>
              <li style="margin-bottom:8px"><strong>7-Day Chart</strong> - Visual bar chart of your recent activity</li>
              <li><strong>Language Breakdown</strong> - Which languages you check most</li>
            </ul>
            <p style="margin-bottom:16px">Go to <strong>Dashboard &gt; Writing Stats</strong> to see your data.</p>
            <img src="${BASE}/images/tutorials/07-writing-stats.png" alt="Writing Statistics" style="width:100%;border-radius:8px;border:1px solid #e2e8f0">
            <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:8px">The Writing Stats dashboard with streak tracking and activity charts</p>
          </div>
        </div>
      </div>

      <!-- STEP 8: Languages -->
      <div id="tut-languages" style="margin-bottom:56px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <span style="width:36px;height:36px;border-radius:50%;background:#ec4899;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0">8</span>
          <h2 style="font-size:24px;font-weight:700">22+ Supported Languages</h2>
        </div>
        <div class="card">
          <div class="card-body" style="line-height:1.9;font-size:15px;color:#334155">
            <p style="margin-bottom:16px">Ord supports grammar and spell checking in 22+ languages:</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 32px;margin-bottom:20px">
              <div><strong>Nordic:</strong> Swedish, Norwegian, Danish, Finnish</div>
              <div><strong>South Asian:</strong> Hindi, Urdu, Punjabi, Dari, Pahari</div>
              <div><strong>Western European:</strong> English, German, French, Spanish, Italian, Portuguese, Dutch</div>
              <div><strong>Eastern European:</strong> Polish, Russian, Turkish</div>
              <div><strong>East Asian:</strong> Chinese, Japanese, Korean</div>
              <div><strong>Middle Eastern:</strong> Arabic</div>
            </div>
            <p style="margin-bottom:12px">To switch language: Click the Ord extension icon, select your language from the grid, and click Save. All grammar rules, spelling, and style suggestions adapt to the selected language.</p>
          </div>
        </div>
      </div>

      <!-- STEP 9: Firefox -->
      <div id="tut-firefox" style="margin-bottom:56px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <span style="width:36px;height:36px;border-radius:50%;background:#e67e22;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0">9</span>
          <h2 style="font-size:24px;font-weight:700">Firefox Extension</h2>
        </div>
        <div class="card">
          <div class="card-body" style="line-height:1.9;font-size:15px;color:#334155">
            <p style="margin-bottom:16px">Ord is also available for Firefox with the same features as the Chrome version.</p>
            <div style="margin-bottom:20px">
              <a href="${BASE}/ord-firefox-extension.zip" style="display:inline-block;padding:10px 20px;background:#e67e22;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Download Ord for Firefox</a>
            </div>
            <ol style="padding-left:24px;margin-bottom:16px">
              <li style="margin-bottom:8px">Download and unzip the extension</li>
              <li style="margin-bottom:8px">In Firefox, type <code style="background:#f1f5f9;padding:3px 8px;border-radius:4px;font-size:13px;font-weight:600">about:debugging#/runtime/this-firefox</code></li>
              <li style="margin-bottom:8px">Click <strong>"Load Temporary Add-on"</strong></li>
              <li style="margin-bottom:8px">Select any file from the unzipped Ord folder</li>
              <li>Configure your API key in the Ord popup and start using!</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Keyboard Shortcuts Summary -->
      <div style="margin-bottom:56px">
        <h2 style="font-size:24px;font-weight:700;margin-bottom:20px">Keyboard Shortcuts</h2>
        <div class="card">
          <div class="card-body" style="padding:0">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #f1f5f9">
              <span style="font-size:15px">Open Ord / Check grammar</span>
              <span><kbd style="background:#e2e8f0;padding:3px 8px;border-radius:4px;font-size:12px;border:1px solid #cbd5e1;font-weight:600">Ctrl</kbd> + <kbd style="background:#e2e8f0;padding:3px 8px;border-radius:4px;font-size:12px;border:1px solid #cbd5e1;font-weight:600">Shift</kbd> + <kbd style="background:#e2e8f0;padding:3px 8px;border-radius:4px;font-size:12px;border:1px solid #cbd5e1;font-weight:600">G</kbd></span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #f1f5f9">
              <span style="font-size:15px">Rephrase text (Desktop app)</span>
              <span><kbd style="background:#e2e8f0;padding:3px 8px;border-radius:4px;font-size:12px;border:1px solid #cbd5e1;font-weight:600">Ctrl</kbd> + <kbd style="background:#e2e8f0;padding:3px 8px;border-radius:4px;font-size:12px;border:1px solid #cbd5e1;font-weight:600">Shift</kbd> + <kbd style="background:#e2e8f0;padding:3px 8px;border-radius:4px;font-size:12px;border:1px solid #cbd5e1;font-weight:600">R</kbd></span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px">
              <span style="font-size:15px">Right-click context menu</span>
              <span style="font-size:13px;color:#64748b">Select text &rarr; Right-click &rarr; Ord menu</span>
            </div>
          </div>
        </div>
      </div>

      <div style="text-align:center;padding:40px 0;background:linear-gradient(135deg,#eff6ff,#f0f9ff);border-radius:16px;margin-bottom:40px">
        <h2 style="font-size:24px;font-weight:700;margin-bottom:12px">Ready to get started?</h2>
        <p style="color:var(--text-light);margin-bottom:24px;font-size:15px">Create a free account and start writing better in any language.</p>
        <button class="btn btn-primary" onclick="showAuthModal('register')" style="padding:12px 32px;font-size:16px;margin-right:12px">Create Free Account</button>
        <button class="btn btn-outline" onclick="window.location.hash=''" style="padding:12px 32px;font-size:16px">Back to Home</button>
      </div>
    </div>

    <!-- Auth Modal -->
    <div class="modal-overlay hidden" id="authModal">
      <div class="modal">
        <div class="modal-header">
          <h2 id="authModalTitle">Log In</h2>
          <button class="modal-close" onclick="closeAuthModal()">&times;</button>
        </div>
        <div class="modal-body" id="authModalBody"></div>
      </div>
    </div>
  `;
}

// ─── Writer / Editor ───
let editorCleanText = '';
let editorLastCheckedText = '';
let editorAutoCheckEnabled = false;
let editorDebounceTimer = null;
let editorIsChecking = false;
let editorIssues = [];
let editorScore = null;

function initEditor() {
  const area = document.getElementById('editorArea');
  if (!area) return;

  area.addEventListener('input', onEditorInput);
  area.addEventListener('paste', onEditorPaste);
  area.addEventListener('click', onEditorClick);
  document.addEventListener('click', onDocumentClickForPopup);

  const savedLang = localStorage.getItem('ord_editor_lang');
  if (savedLang) {
    const sel = document.getElementById('editorLang');
    if (sel) sel.value = savedLang;
  }

  updateEditorStats();
}

function onEditorPaste(e) {
  e.preventDefault();
  const text = (e.clipboardData || window.clipboardData).getData('text/plain');
  document.execCommand('insertText', false, text);
}

function onEditorInput() {
  updateEditorStats();
  clearSuggestionPopup();

  if (editorAutoCheckEnabled) {
    clearTimeout(editorDebounceTimer);
    editorDebounceTimer = setTimeout(function() {
      const text = getEditorPlainText();
      if (text.trim().length >= 2 && text !== editorLastCheckedText) {
        editorCheck();
      }
    }, 1500);
  }
}

function getEditorPlainText() {
  const area = document.getElementById('editorArea');
  if (!area) return '';
  return area.innerText || area.textContent || '';
}

function updateEditorStats() {
  const text = getEditorPlainText();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const wEl = document.getElementById('writerWords');
  const cEl = document.getElementById('writerChars');
  if (wEl) wEl.textContent = words;
  if (cEl) cEl.textContent = chars;
}

function setWriterStatus(msg, type) {
  const el = document.getElementById('writerStatus');
  if (!el) return;
  if (!msg) { el.innerHTML = ''; return; }
  const colors = { checking: '#3b82f6', error: '#ef4444', success: '#22c55e' };
  el.innerHTML = '<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:' +
    (type === 'checking' ? '#eff6ff' : type === 'error' ? '#fef2f2' : '#f0fdf4') +
    ';border-radius:8px;font-size:13px;color:' + (colors[type] || '#64748b') + '">' +
    (type === 'checking' ? '<span class="checking-spinner"></span>' : '') +
    esc(msg) + '</div>';
}

function updateScoreDisplay(score) {
  const circle = document.getElementById('scoreCircle');
  const valueEl = document.getElementById('scoreValue');
  if (!circle || !valueEl) return;

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;
  circle.setAttribute('stroke-dashoffset', offset);

  const gradient = document.querySelector('#scoreGradient');
  if (gradient) {
    const stops = gradient.querySelectorAll('stop');
    if (score >= 80) {
      stops[0].setAttribute('stop-color', '#22c55e');
      stops[1].setAttribute('stop-color', '#3b82f6');
    } else if (score >= 50) {
      stops[0].setAttribute('stop-color', '#f59e0b');
      stops[1].setAttribute('stop-color', '#f97316');
    } else {
      stops[0].setAttribute('stop-color', '#ef4444');
      stops[1].setAttribute('stop-color', '#dc2626');
    }
  }

  valueEl.textContent = score;
}

function updateErrorCounts(issues) {
  const counts = { grammar: 0, spelling: 0, style: 0 };
  (issues || []).forEach(function(issue) {
    const t = (issue.type || '').toLowerCase();
    if (t === 'grammar' || t === 'punctuation') counts.grammar++;
    else if (t === 'spelling') counts.spelling++;
    else if (t === 'style') counts.style++;
  });
  const gEl = document.getElementById('errGrammar');
  const sEl = document.getElementById('errSpelling');
  const stEl = document.getElementById('errStyle');
  if (gEl) gEl.textContent = counts.grammar;
  if (sEl) sEl.textContent = counts.spelling;
  if (stEl) stEl.textContent = counts.style;
}

async function editorCheck() {
  const text = getEditorPlainText();
  if (!text || text.trim().length < 2) {
    toast('Please enter at least 2 characters to check.', 'error');
    return;
  }
  if (editorIsChecking) return;

  editorIsChecking = true;
  editorCleanText = text;
  setWriterStatus('Checking...', 'checking');

  const langEl = document.getElementById('editorLang');
  const lang = langEl ? langEl.value : 'en';

  try {
    const data = await api('/editor/check', { method: 'POST', body: { text: text, language: lang } });
    const result = data.result;
    editorLastCheckedText = text;
    editorIssues = result.issues || [];
    editorScore = result.score != null ? result.score : 100;

    updateScoreDisplay(editorScore);
    updateErrorCounts(editorIssues);

    if (editorIssues.length === 0) {
      setWriterStatus('No issues found!', 'success');
    } else {
      setWriterStatus(editorIssues.length + ' issue' + (editorIssues.length !== 1 ? 's' : '') + ' found', 'error');
      highlightErrors(text, editorIssues);
    }
  } catch (e) {
    setWriterStatus('Check failed: ' + e.message, 'error');
    toast('Check failed: ' + e.message, 'error');
  } finally {
    editorIsChecking = false;
  }
}

function highlightErrors(originalText, issues) {
  const area = document.getElementById('editorArea');
  if (!area || !issues || issues.length === 0) return;

  const replacements = [];

  issues.forEach(function(issue, idx) {
    if (!issue.original) return;
    const pos = originalText.indexOf(issue.original);
    if (pos === -1) return;

    let errorType = (issue.type || 'grammar').toLowerCase();
    if (errorType === 'punctuation') errorType = 'grammar';
    if (['grammar', 'spelling', 'style'].indexOf(errorType) === -1) errorType = 'grammar';

    replacements.push({
      start: pos, end: pos + issue.original.length,
      original: issue.original, suggestion: issue.suggestion || '',
      explanation: issue.explanation || '', type: errorType, idx: idx
    });
  });

  replacements.sort(function(a, b) { return a.start - b.start; });

  const filtered = [];
  let lastEnd = 0;
  for (let i = 0; i < replacements.length; i++) {
    if (replacements[i].start >= lastEnd) {
      filtered.push(replacements[i]);
      lastEnd = replacements[i].end;
    }
  }

  let html = '';
  let cursor = 0;
  for (let j = 0; j < filtered.length; j++) {
    const r = filtered[j];
    html += escHtml(originalText.slice(cursor, r.start));
    html += '<span class="ord-error ord-error-' + r.type + '" data-idx="' + r.idx +
      '" data-original="' + escAttr(r.original) +
      '" data-suggestion="' + escAttr(r.suggestion) +
      '" data-explanation="' + escAttr(r.explanation) +
      '" data-type="' + r.type + '">' + escHtml(r.original) + '</span>';
    cursor = r.end;
  }
  html += escHtml(originalText.slice(cursor));
  html = html.replace(/\n/g, '<br>');

  area.innerHTML = html;
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function escAttr(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function onEditorClick(e) {
  const errorSpan = e.target.closest('.ord-error');
  if (errorSpan) {
    e.stopPropagation();
    showSuggestionPopup(errorSpan);
  }
}

function showSuggestionPopup(errorSpan) {
  const popup = document.getElementById('suggestionPopup');
  if (!popup) return;

  const original = errorSpan.getAttribute('data-original');
  const suggestion = errorSpan.getAttribute('data-suggestion');
  const explanation = errorSpan.getAttribute('data-explanation');
  const type = errorSpan.getAttribute('data-type');
  const idx = errorSpan.getAttribute('data-idx');

  const typeLabels = { grammar: 'Grammar', spelling: 'Spelling', style: 'Style' };
  const typeColors = { grammar: '#ef4444', spelling: '#3b82f6', style: '#10b981' };

  popup.innerHTML =
    '<div class="suggestion-header">' +
      '<span class="suggestion-badge" style="background:' + (typeColors[type] || '#64748b') + '">' + (typeLabels[type] || 'Issue') + '</span>' +
      '<button class="suggestion-close" onclick="clearSuggestionPopup()">&times;</button>' +
    '</div>' +
    '<div class="suggestion-body">' +
      '<div class="suggestion-original"><del>' + escHtml(original) + '</del></div>' +
      (suggestion ? '<div class="suggestion-fix">' + escHtml(suggestion) + '</div>' : '') +
      (explanation ? '<div class="suggestion-explanation">' + escHtml(explanation) + '</div>' : '') +
    '</div>' +
    '<div class="suggestion-actions">' +
      (suggestion ? '<button class="btn btn-sm btn-primary" onclick="applySuggestionFix(' + idx + ')">Apply Fix</button>' : '') +
      '<button class="btn btn-sm btn-ghost" style="color:var(--text-light)" onclick="ignoreSuggestion(' + idx + ')">Ignore</button>' +
    '</div>';

  const rect = errorSpan.getBoundingClientRect();
  const dashContent = document.getElementById('dashContent');
  if (dashContent) {
    const contRect = dashContent.getBoundingClientRect();
    popup.style.top = (rect.bottom - contRect.top + 8) + 'px';
    popup.style.left = Math.max(0, Math.min(rect.left - contRect.left, contRect.width - 330)) + 'px';
  }
  popup.classList.remove('hidden');
}

function clearSuggestionPopup() {
  const popup = document.getElementById('suggestionPopup');
  if (popup) popup.classList.add('hidden');
}

function onDocumentClickForPopup(e) {
  if (e.target.closest('.ord-suggestion-popup') || e.target.closest('.ord-error') || e.target.closest('.ord-rephrase-popup')) return;
  clearSuggestionPopup();
  clearRephrasePopup();
}

function applySuggestionFix(issueIdx) {
  const area = document.getElementById('editorArea');
  if (!area) return;
  const span = area.querySelector('.ord-error[data-idx="' + issueIdx + '"]');
  if (!span) return;
  const suggestion = span.getAttribute('data-suggestion');
  if (!suggestion) return;

  const textNode = document.createTextNode(suggestion);
  span.parentNode.replaceChild(textNode, span);
  clearSuggestionPopup();
  editorCleanText = getEditorPlainText();
  updateEditorStats();
  editorIssues = editorIssues.filter(function(_, i) { return i !== issueIdx; });
  updateErrorCounts(editorIssues);

  const remaining = area.querySelectorAll('.ord-error');
  if (remaining.length === 0) {
    setWriterStatus('All issues fixed!', 'success');
  } else {
    setWriterStatus(remaining.length + ' issue' + (remaining.length !== 1 ? 's' : '') + ' remaining', 'error');
  }
}

function ignoreSuggestion(issueIdx) {
  const area = document.getElementById('editorArea');
  if (!area) return;
  const span = area.querySelector('.ord-error[data-idx="' + issueIdx + '"]');
  if (!span) return;

  const textNode = document.createTextNode(span.textContent);
  span.parentNode.replaceChild(textNode, span);
  clearSuggestionPopup();

  const remaining = area.querySelectorAll('.ord-error');
  if (remaining.length === 0) {
    setWriterStatus('No issues found!', 'success');
  } else {
    setWriterStatus(remaining.length + ' issue' + (remaining.length !== 1 ? 's' : '') + ' remaining', 'error');
  }
}

function getSelectedText() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return '';
  return sel.toString();
}

async function editorRephrase(style) {
  const selected = getSelectedText();
  const text = selected || getEditorPlainText();
  if (!text || text.trim().length < 2) {
    toast('Please enter or select text to rephrase.', 'error');
    return;
  }

  setWriterStatus('Rephrasing...', 'checking');
  const langEl = document.getElementById('editorLang');
  const lang = langEl ? langEl.value : 'en';

  try {
    const data = await api('/editor/rephrase', { method: 'POST', body: { text: text, language: lang, style: style } });
    const result = data.result;

    if (selected) {
      showRephrasePopup(result.rephrased, result.changes);
    } else {
      const area = document.getElementById('editorArea');
      if (area) {
        area.textContent = result.rephrased;
        editorCleanText = result.rephrased;
      }
      setWriterStatus('Text rephrased!', 'success');
      updateEditorStats();
    }
  } catch (e) {
    setWriterStatus('Rephrase failed: ' + e.message, 'error');
    toast('Rephrase failed: ' + e.message, 'error');
  }
}

function showRephrasePopup(rephrased, changes) {
  const popup = document.getElementById('rephrasePopup');
  if (!popup) return;

  popup.innerHTML =
    '<div class="suggestion-header">' +
      '<span class="suggestion-badge" style="background:#8b5cf6">Rephrase</span>' +
      '<button class="suggestion-close" onclick="clearRephrasePopup()">&times;</button>' +
    '</div>' +
    '<div class="suggestion-body">' +
      '<div class="suggestion-fix" style="font-size:15px;line-height:1.6">' + escHtml(rephrased) + '</div>' +
      (changes ? '<div class="suggestion-explanation">' + escHtml(changes) + '</div>' : '') +
    '</div>' +
    '<div class="suggestion-actions">' +
      '<button class="btn btn-sm btn-primary" onclick="applyRephrase()">Replace</button>' +
      '<button class="btn btn-sm btn-ghost" style="color:var(--text-light)" onclick="clearRephrasePopup()">Dismiss</button>' +
    '</div>';

  const dashContent = document.getElementById('dashContent');
  const area = document.getElementById('editorArea');
  if (dashContent && area) {
    const contRect = dashContent.getBoundingClientRect();
    const aRect = area.getBoundingClientRect();
    popup.style.top = (aRect.top - contRect.top + 40) + 'px';
    popup.style.left = '20px';
  }

  popup.classList.remove('hidden');
  popup._rephrased = rephrased;
  setWriterStatus('Rephrase ready', 'success');
}

function clearRephrasePopup() {
  const popup = document.getElementById('rephrasePopup');
  if (popup) popup.classList.add('hidden');
}

function applyRephrase() {
  const popup = document.getElementById('rephrasePopup');
  const area = document.getElementById('editorArea');
  if (!popup || !area) return;

  const rephrased = popup._rephrased;
  if (!rephrased) return;

  const sel = window.getSelection();
  if (sel && !sel.isCollapsed && area.contains(sel.anchorNode)) {
    document.execCommand('insertText', false, rephrased);
  } else {
    area.textContent = rephrased;
  }

  editorCleanText = getEditorPlainText();
  updateEditorStats();
  clearRephrasePopup();
  setWriterStatus('Rephrase applied!', 'success');
}

function toggleAutoCheck(enabled) {
  editorAutoCheckEnabled = enabled;
  if (!enabled) clearTimeout(editorDebounceTimer);
}

function editorClear() {
  const area = document.getElementById('editorArea');
  if (area) area.innerHTML = '';
  editorCleanText = '';
  editorLastCheckedText = '';
  editorIssues = [];
  editorScore = null;
  updateEditorStats();
  updateErrorCounts([]);
  setWriterStatus('', '');
  clearSuggestionPopup();
  clearRephrasePopup();

  const circle = document.getElementById('scoreCircle');
  const valueEl = document.getElementById('scoreValue');
  if (circle) circle.setAttribute('stroke-dashoffset', '0');
  if (valueEl) valueEl.textContent = '--';
}

function editorLangChanged() {
  const langEl = document.getElementById('editorLang');
  const lang = langEl ? langEl.value : 'en';
  localStorage.setItem('ord_editor_lang', lang);
}
