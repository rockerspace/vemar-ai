export type IndianLanguage =
  | 'hi' // Hindi (हिन्दी)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'mr' // Marathi (मराठी)
  | 'bn' // Bengali (বাংলা)
  | 'te' // Telugu (తెలుగు)
  | 'ta' // Tamil (தமிழ்)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ml' // Malayalam (മലയാളം)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'or' // Odia (ଓଡ଼ିଆ)
  | 'ur' // Urdu (اردو)
  | 'as'; // Assamese (অসমীয়া)

export type GlobalForeignLanguage =
  | 'es' // Spanish (Español)
  | 'zh' // Mandarin Chinese - Simplified (简体中文)
  | 'zh_tw' // Traditional Chinese (繁體中文)
  | 'ja' // Japanese (日本語)
  | 'de' // German (Deutsch)
  | 'fr' // French (Français)
  | 'ar' // Arabic (العربية)
  | 'pt' // Portuguese (Português)
  | 'ko' // Korean (한국어)
  | 'it' // Italian (Italiano)
  | 'ru' // Russian (Русский)
  | 'nl'; // Dutch (Nederlands)

export type Language = 'en' | IndianLanguage | GlobalForeignLanguage;

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  region: 'IN' | 'GLOBAL';
  category: 'INDIAN_REGIONAL' | 'GLOBAL_FOREIGN' | 'COMMON';
  script: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
  marketCenter: string;
  jurisdictionTag: string;
  sampleGreeting: string;
}

export const INDIAN_LANGUAGES_META: LanguageMeta[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'IN',
    category: 'INDIAN_REGIONAL',
    script: 'Devanagari',
    flag: '🇮🇳',
    dir: 'ltr',
    marketCenter: 'National Capital Region / North India',
    jurisdictionTag: 'SEBI / NSE / BSE',
    sampleGreeting: 'नमस्ते'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    region: 'IN',
    category: 'INDIAN_REGIONAL',
    script: 'Gujarati',
    flag: '🇮🇳',
    dir: 'ltr',
    marketCenter: 'GIFT City / Dalal Street / Ahmedabad',
    jurisdictionTag: 'SEBI / IFSCA',
    sampleGreeting: 'નમસ્તે'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    region: 'IN',
    category: 'INDIAN_REGIONAL',
    script: 'Devanagari',
    flag: '🇮🇳',
    dir: 'ltr',
    marketCenter: 'Mumbai (BSE / NSE Headquarters) & Pune',
    jurisdictionTag: 'SEBI / RBI',
    sampleGreeting: 'नमस्कार'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'IN',
    category: 'INDIAN_REGIONAL',
    script: 'Bengali-Assamese',
    flag: '🇮🇳',
    dir: 'ltr',
    marketCenter: 'Kolkata / Eastern Capital Markets',
    jurisdictionTag: 'SEBI / CSE',
    sampleGreeting: 'নমস্কার'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'IN',
    category: 'INDIAN_REGIONAL',
    script: 'Telugu',
    flag: '🇮🇳',
    dir: 'ltr',
    marketCenter: 'Hyderabad FinTech & Andhra Pradesh',
    jurisdictionTag: 'SEBI / FinTech Hub',
    sampleGreeting: 'నమస్కారం'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'IN',
    category: 'INDIAN_REGIONAL',
    script: 'Tamil',
    flag: '🇮🇳',
    dir: 'ltr',
    marketCenter: 'Chennai FinTech & Coimbatore Hub',
    jurisdictionTag: 'SEBI / MSE',
    sampleGreeting: 'வணக்கம்'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    region: 'IN',
    category: 'INDIAN_REGIONAL',
    script: 'Kannada',
    flag: '🇮🇳',
    dir: 'ltr',
    marketCenter: 'Bengaluru Tech & Venture Capital Hub',
    jurisdictionTag: 'SEBI / VC Ecosystem',
    sampleGreeting: 'ನಮಸ್ಕಾರ'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    region: 'IN',
    category: 'INDIAN_REGIONAL',
    script: 'Malayalam',
    flag: '🇮🇳',
    dir: 'ltr',
    marketCenter: 'Kochi & Kerala NRI Remittance Hub',
    jurisdictionTag: 'SEBI / NRI Desk',
    sampleGreeting: 'നമസ്കാരം'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    region: 'IN',
    category: 'INDIAN_REGIONAL',
    script: 'Gurmukhi',
    flag: '🇮🇳',
    dir: 'ltr',
    marketCenter: 'Chandigarh, Ludhiana & Delhi NCR',
    jurisdictionTag: 'SEBI / Commodity Hub',
    sampleGreeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    region: 'IN',
    category: 'INDIAN_REGIONAL',
    script: 'Odia',
    flag: '🇮🇳',
    dir: 'ltr',
    marketCenter: 'Bhubaneswar IT & Mining Corridor',
    jurisdictionTag: 'SEBI / East Coast',
    sampleGreeting: 'ନମସ୍କାର'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    region: 'IN',
    category: 'INDIAN_REGIONAL',
    script: 'Perso-Arabic (Nastaliq)',
    flag: '🇮🇳',
    dir: 'rtl',
    marketCenter: 'Hyderabad, Lucknow & Delhi Markets',
    jurisdictionTag: 'SEBI / Sharia Compliance',
    sampleGreeting: 'آداب'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    region: 'IN',
    category: 'INDIAN_REGIONAL',
    script: 'Assamese',
    flag: '🇮🇳',
    dir: 'ltr',
    marketCenter: 'Guwahati & North Eastern Corridor',
    jurisdictionTag: 'SEBI / Tea & Oil Corridor',
    sampleGreeting: 'নমস্কাৰ'
  }
];

export const GLOBAL_FOREIGN_LANGUAGES_META: LanguageMeta[] = [
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'GLOBAL',
    category: 'GLOBAL_FOREIGN',
    script: 'Latin',
    flag: '🇪🇸',
    dir: 'ltr',
    marketCenter: 'Madrid (BME) / Latin America (BMV, B3)',
    jurisdictionTag: 'CNMV / SEC / LatAm',
    sampleGreeting: 'Hola'
  },
  {
    code: 'zh',
    name: 'Simplified Chinese',
    nativeName: '简体中文',
    region: 'GLOBAL',
    category: 'GLOBAL_FOREIGN',
    script: 'Simplified Han',
    flag: '🇨🇳',
    dir: 'ltr',
    marketCenter: 'Shanghai (SSE) / Shenzhen (SZSE) / Singapore (SGX)',
    jurisdictionTag: 'CSRC / MAS',
    sampleGreeting: '你好'
  },
  {
    code: 'zh_tw',
    name: 'Traditional Chinese',
    nativeName: '繁體中文',
    region: 'GLOBAL',
    category: 'GLOBAL_FOREIGN',
    script: 'Traditional Han',
    flag: '🇭🇰',
    dir: 'ltr',
    marketCenter: 'Hong Kong (HKEX) / Taipei (TWSE)',
    jurisdictionTag: 'SFC / FSC',
    sampleGreeting: '您好'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    region: 'GLOBAL',
    category: 'GLOBAL_FOREIGN',
    script: 'Kanji / Kana',
    flag: '🇯🇵',
    dir: 'ltr',
    marketCenter: 'Tokyo (TSE / Japan Exchange Group)',
    jurisdictionTag: 'FSA / JPX',
    sampleGreeting: 'こんにちは'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    region: 'GLOBAL',
    category: 'GLOBAL_FOREIGN',
    script: 'Latin',
    flag: '🇩🇪',
    dir: 'ltr',
    marketCenter: 'Frankfurt (Deutsche Börse / DAX) / Zurich (SIX)',
    jurisdictionTag: 'BaFin / FINMA',
    sampleGreeting: 'Guten Tag'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    region: 'GLOBAL',
    category: 'GLOBAL_FOREIGN',
    script: 'Latin',
    flag: '🇫🇷',
    dir: 'ltr',
    marketCenter: 'Paris (Euronext Paris / CAC 40) / Geneva',
    jurisdictionTag: 'AMF / ESMA',
    sampleGreeting: 'Bonjour'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    region: 'GLOBAL',
    category: 'GLOBAL_FOREIGN',
    script: 'Arabic',
    flag: '🇦🇪',
    dir: 'rtl',
    marketCenter: 'Dubai (DFM) / Abu Dhabi (ADX) / Riyadh (Tadawul)',
    jurisdictionTag: 'DFSA / SCA / CMA',
    sampleGreeting: 'مرحباً'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'GLOBAL',
    category: 'GLOBAL_FOREIGN',
    script: 'Latin',
    flag: '🇧🇷',
    dir: 'ltr',
    marketCenter: 'São Paulo (B3 Brasil) / Lisbon (Euronext)',
    jurisdictionTag: 'CVM / CMVM',
    sampleGreeting: 'Olá'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    region: 'GLOBAL',
    category: 'GLOBAL_FOREIGN',
    script: 'Hangul',
    flag: '🇰🇷',
    dir: 'ltr',
    marketCenter: 'Seoul (Korea Exchange / KRX / KOSPI)',
    jurisdictionTag: 'FSC / FSS',
    sampleGreeting: '안녕하세요'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    region: 'GLOBAL',
    category: 'GLOBAL_FOREIGN',
    script: 'Latin',
    flag: '🇮🇹',
    dir: 'ltr',
    marketCenter: 'Milan (Borsa Italiana / FTSE MIB)',
    jurisdictionTag: 'CONSOB / ESMA',
    sampleGreeting: 'Ciao'
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    region: 'GLOBAL',
    category: 'GLOBAL_FOREIGN',
    script: 'Cyrillic',
    flag: '🌐',
    dir: 'ltr',
    marketCenter: 'Eastern Europe / Central Asian Exchanges',
    jurisdictionTag: 'International Markets',
    sampleGreeting: 'Здравствуйте'
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    region: 'GLOBAL',
    category: 'GLOBAL_FOREIGN',
    script: 'Latin',
    flag: '🇳🇱',
    dir: 'ltr',
    marketCenter: 'Amsterdam (Euronext Amsterdam / AEX)',
    jurisdictionTag: 'AFM / ESMA',
    sampleGreeting: 'Hallo'
  }
];

export const ENGLISH_META: LanguageMeta = {
  code: 'en',
  name: 'English',
  nativeName: 'English (US/UK/IN)',
  region: 'GLOBAL',
  category: 'COMMON',
  script: 'Latin',
  flag: '🌐',
  dir: 'ltr',
  marketCenter: 'New York (NYSE/NASDAQ) / London (LSE) / Mumbai (BSE)',
  jurisdictionTag: 'SEC / FINRA / SEBI / Global',
  sampleGreeting: 'Welcome'
};

export const ALL_LANGUAGES_META: LanguageMeta[] = [
  ENGLISH_META,
  ...INDIAN_LANGUAGES_META,
  ...GLOBAL_FOREIGN_LANGUAGES_META
];

export const getLanguageMeta = (code: Language): LanguageMeta => {
  return ALL_LANGUAGES_META.find((lang) => lang.code === code) || ENGLISH_META;
};

export const isIndianLanguageCode = (code: string): boolean => {
  return INDIAN_LANGUAGES_META.some((lang) => lang.code === code);
};

export const isGlobalLanguageCode = (code: string): boolean => {
  return GLOBAL_FOREIGN_LANGUAGES_META.some((lang) => lang.code === code);
};
