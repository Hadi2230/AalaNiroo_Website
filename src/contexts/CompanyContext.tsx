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
      const dataToSave = {
        ...companyData,
        lastModified: new Date().toISOString(),
        modifiedBy: 'Admin User' // In real app, get from auth context
      };

      localStorage.setItem('companyContent', JSON.stringify(dataToSave));
      setLastModified(dataToSave.lastModified);
      setModifiedBy(dataToSave.modifiedBy);

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
    localStorage.removeItem('companyContent');
    console.log('Company data reset to default');
  };

  const value: CompanyContextType = {
    companyData,
    updateCompanyData,
    saveCompanyData,
    resetToDefault,
    isLoading,
    lastModified,
    modifiedBy
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};