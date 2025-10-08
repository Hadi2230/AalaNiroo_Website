import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { companyInfo as defaultCompanyInfo } from '@/data/companyData';

interface ContentHistoryItem {
  content: CompanyData;
  timestamp: string;
  user: string;
}

interface CompanyData {
  fa: {
    name: string;
    tagline: string;
    description: string;
    phone: string;
    whatsapp?: string;
    address: string;
    email: string;
    logoUrl?: string;
    quoteMessage?: string;
    contactMessage?: string;
    addressMessage?: string;
  };
  en: {
    name: string;
    tagline: string;
    description: string;
    phone: string;
    whatsapp?: string;
    address: string;
    email: string;
    logoUrl?: string;
    quoteMessage?: string;
    contactMessage?: string;
    addressMessage?: string;
  };
}

interface CompanyContextType {
  companyData: CompanyData;
  updateCompanyData: (lang: 'fa' | 'en', field: string, value: string) => void;
  saveCompanyData: () => Promise<boolean>;
  resetToDefault: () => void;
  isLoading: boolean;
  lastModified: string | null;
  modifiedBy: string | null;
  contentHistory: ContentHistoryItem[];
  setContentHistory: React.Dispatch<React.SetStateAction<ContentHistoryItem[]>>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

interface CompanyProviderProps {
  children: ReactNode;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [companyData, setCompanyData] = useState<CompanyData>(defaultCompanyInfo);
  const [isLoading, setIsLoading] = useState(true);
  const [lastModified, setLastModified] = useState<string | null>(null);
  const [modifiedBy, setModifiedBy] = useState<string | null>(null);
  const [contentHistory, setContentHistory] = useState<ContentHistoryItem[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadCompanyData = () => {
      try {
        const savedData = localStorage.getItem('companyContent');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setCompanyData(parsedData);
          setLastModified(parsedData.lastModified || null);
          setModifiedBy(parsedData.modifiedBy || null);
        }

        // Load content history
        const savedHistory = localStorage.getItem('contentHistory');
        if (savedHistory) {
          setContentHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Error loading company data from localStorage:', error);
        // Fallback to default data
        setCompanyData(defaultCompanyInfo);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyData();

    // Listen for company data updates from other components
    const handleCompanyDataUpdate = (event: CustomEvent) => {
      if (event.detail) {
        setCompanyData(event.detail);
        setLastModified(event.detail.lastModified || new Date().toISOString());
        setModifiedBy(event.detail.modifiedBy || 'Admin User');
      }
    };

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'companyContent' && event.newValue) {
        try {
          const parsedData = JSON.parse(event.newValue);
          setCompanyData(parsedData);
          setLastModified(parsedData.lastModified);
          setModifiedBy(parsedData.modifiedBy);
        } catch (error) {
          console.error('Error parsing storage data:', error);
        }
      }
    };

    window.addEventListener('companyDataUpdated', handleCompanyDataUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('companyDataUpdated', handleCompanyDataUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateCompanyData = (lang: 'fa' | 'en', field: string, value: string) => {
    const newData = {
      ...companyData,
      [lang]: {
        ...companyData[lang],
        [field]: value
      }
    };
    
    setCompanyData(newData);
    
    // Immediately save to localStorage for instant sync
    localStorage.setItem('companyContent', JSON.stringify({
      ...newData,
      lastModified: new Date().toISOString(),
      modifiedBy: 'Admin User'
    }));
    
    // Trigger event for other components
    window.dispatchEvent(new CustomEvent('companyDataUpdated', {
      detail: newData
    }));
  };

  const saveCompanyData = async () => {
    try {
      const timestamp = new Date().toISOString();
      const dataToSave = {
        ...companyData,
        lastModified: timestamp,
        modifiedBy: 'Admin User' // In real app, get from auth context
      };

      localStorage.setItem('companyContent', JSON.stringify(dataToSave));
      localStorage.setItem('contentHistory', JSON.stringify(contentHistory));
      
      // Update state immediately
      setLastModified(timestamp);
      setModifiedBy('Admin User');

      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('companyDataUpdated', {
        detail: dataToSave
      }));

      console.log('Company data saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving company data:', error);
      return false;
    }
  };

  const resetToDefault = () => {
    setCompanyData(defaultCompanyInfo);
    setLastModified(null);
    setModifiedBy(null);
    setContentHistory([]);
    localStorage.removeItem('companyContent');
    localStorage.removeItem('contentHistory');
    console.log('Company data reset to default');
  };

  const value: CompanyContextType = {
    companyData,
    updateCompanyData,
    saveCompanyData,
    resetToDefault,
    isLoading,
    lastModified,
    modifiedBy,
    contentHistory,
    setContentHistory
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};