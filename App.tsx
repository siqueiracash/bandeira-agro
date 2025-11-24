import React, { useState } from 'react';
import Layout from './components/Layout';
import StepSelection from './components/StepSelection';
import StepForm from './components/StepForm';
import LoadingScreen from './components/LoadingScreen';
import ReportScreen from './components/ReportScreen';
import { AppStep, PropertyData, PropertyType, ValuationResult } from './types';
import { generateValuationReport } from './services/geminiService';
import { INITIAL_PROPERTY_DATA } from './constants';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.SELECTION);
  const [propertyData, setPropertyData] = useState<PropertyData>(INITIAL_PROPERTY_DATA);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);

  const handleTypeSelect = (type: PropertyType) => {
    setPropertyData(prev => ({ ...prev, type }));
    setCurrentStep(AppStep.FORM);
  };

  const handleFormSubmit = async (data: PropertyData) => {
    setPropertyData(data);
    setCurrentStep(AppStep.LOADING);
    
    try {
      const result = await generateValuationReport(data);
      setValuationResult(result);
      setCurrentStep(AppStep.RESULT);
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o serviço de avaliação. Verifique se a chave de API está configurada e tente novamente.");
      setCurrentStep(AppStep.FORM);
    }
  };

  const handleBackToSelection = () => {
    setCurrentStep(AppStep.SELECTION);
    setPropertyData(INITIAL_PROPERTY_DATA);
  };

  const handleReset = () => {
    setCurrentStep(AppStep.SELECTION);
    setPropertyData(INITIAL_PROPERTY_DATA);
    setValuationResult(null);
  };

  return (
    <Layout>
      {currentStep === AppStep.SELECTION && (
        <StepSelection onSelect={handleTypeSelect} />
      )}
      
      {currentStep === AppStep.FORM && (
        <StepForm 
          propertyType={propertyData.type} 
          onSubmit={handleFormSubmit} 
          onBack={handleBackToSelection}
        />
      )}

      {currentStep === AppStep.LOADING && (
        <LoadingScreen />
      )}

      {currentStep === AppStep.RESULT && valuationResult && (
        <ReportScreen 
          data={valuationResult} 
          property={propertyData} 
          onReset={handleReset} 
        />
      )}
    </Layout>
  );
};

export default App;