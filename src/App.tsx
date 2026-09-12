import React, { useState } from 'react';
import { CyberBackground } from './components/CyberBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ScannerDashboard } from './components/ScannerDashboard';
import { StatsDashboard } from './components/dashboard/StatsDashboard';
import { HowItWorks } from './components/HowItWorks';
import { ThreatsGuide } from './components/ThreatsGuide';
import { SpotTheGlitch } from './components/education/SpotTheGlitch';
import { HistoryDashboard } from './components/history/HistoryDashboard';
import { PrivacyCenter } from './components/privacy/PrivacyCenter';
import { DemoScenariosModal } from './components/DemoScenariosModal';
import { Footer } from './components/Footer';
import { SocialPlatform, AnalysisResult } from './types/analysis';
import { DemoScenario } from './services/demoScenarios';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('Instagram');
  const [bg3dEnabled, setBg3dEnabled] = useState<boolean>(true);
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [demoResult, setDemoResult] = useState<AnalysisResult | null>(null);

  const handleStartScan = () => {
    setActiveTab('scan');
    // Smooth scroll down to scanner section if on home
    setTimeout(() => {
      const el = document.getElementById('scanner-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleSelectDemoScenario = (scenario: DemoScenario) => {
    setSelectedPlatform(scenario.platform);
    setDemoResult(scenario.result);
    setActiveTab('scan');
    setTimeout(() => {
      const el = document.getElementById('scanner-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#e2e8f0] flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* 3D Cyber Background Canvas */}
      <CyberBackground enabled={bg3dEnabled} />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenScanner={handleStartScan}
        bgEnabled={bg3dEnabled}
        onToggleBg={() => setBg3dEnabled((prev) => !prev)}
        onTriggerDemo={() => setDemoModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <Hero
              onStartScan={handleStartScan}
              onLearnMore={() => {
                setActiveTab('how-it-works');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectPlatform={setSelectedPlatform}
              selectedPlatform={selectedPlatform}
            />

            <StatsDashboard />

            <ScannerDashboard
              selectedPlatform={selectedPlatform}
              onOpenDemoModal={() => setDemoModalOpen(true)}
              externalResult={demoResult}
              onClearExternalResult={() => setDemoResult(null)}
            />
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="pt-4">
            <ScannerDashboard
              selectedPlatform={selectedPlatform}
              onOpenDemoModal={() => setDemoModalOpen(true)}
              externalResult={demoResult}
              onClearExternalResult={() => setDemoResult(null)}
            />
          </div>
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorks onStartScan={handleStartScan} />
        )}

        {activeTab === 'threats' && <ThreatsGuide />}

        {activeTab === 'spot-the-glitch' && <SpotTheGlitch />}

        {activeTab === 'history' && (
          <HistoryDashboard onOpenScanner={handleStartScan} />
        )}

        {activeTab === 'privacy' && <PrivacyCenter />}
      </main>

      {/* Demo Scenarios Modal Drawer */}
      <DemoScenariosModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onSelectScenario={handleSelectDemoScenario}
      />

      {/* Universal Security & Brand Footer */}
      <Footer onSelectTab={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
