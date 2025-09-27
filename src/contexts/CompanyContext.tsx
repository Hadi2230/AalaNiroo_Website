import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { companyInfo as defaultCompanyInfo } from '@/data/companyData';

interface CompanyData {
  fa: {
    name: string;
    tagline: string;
    description: string;
    phone: string;
    address: string;
    email: string;
  };
  en: {
    name: string;
    tagline: string;
    description: string;
    phone: string;
    address: string;
    email: string;
  };
}

interface CompanyContextType {
  companyData: CompanyData;
  updateCompanyData: (lang: 'fa' | 'en', field: string, value: string) => void;
  saveCompanyData: () => void;
  resetToDefault: () => void;
  isLoading: boolean;
  lastModified: string | null;
  modifiedBy: string | null;
  contentHistory: any[];
  setContentHistory: React.Dispatch<React.SetStateAction<any[]>>;
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
  const [contentHistory, setContentHistory] = useState<any[]>([]);

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
  }, []);

  const updateCompanyData = (lang: 'fa' | 'en', field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
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