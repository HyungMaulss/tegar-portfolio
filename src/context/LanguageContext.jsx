import { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);

const read = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => read('lang') === 'id' ? 'id' : 'en');

    useEffect(() => {
        document.documentElement.lang = language;
        try { localStorage.setItem('lang', language); } catch { /* private mode: keep in memory only */ }
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};
