import React, { useState } from 'react';
import Button from './Button';

interface PrivacySettingsProps {
  onSave: (settings: PrivacySettings) => void;
}

interface PrivacySettings {
  voicePinEnabled: boolean;
  voicePin?: string;
  fingerprintEnabled: boolean;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = useState<PrivacySettings>({
    voicePinEnabled: false,
    voicePin: '',
    fingerprintEnabled: false,
  });
  
  const [showVoicePinInput, setShowVoicePinInput] = useState(false);
  const [fingerprintSetupComplete, setFingerprintSetupComplete] = useState(false);
  
  const handleVoicePinToggle = () => {
    if (settings.voicePinEnabled) {
      // Turning off voice PIN
      setSettings({
        ...settings,
        voicePinEnabled: false,
        voicePin: '',
      });
      setShowVoicePinInput(false);
    } else {
      // Turning on voice PIN
      setSettings({
        ...settings,
        voicePinEnabled: true,
      });
      setShowVoicePinInput(true);
    }
  };
  
  const handleVoicePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      voicePin: e.target.value,
    });
  };
  
  const handleFingerprintToggle = () => {
    // In a real implementation, this would trigger fingerprint registration
    // For this demo, we'll just toggle the state
    const newValue = !settings.fingerprintEnabled;
    setSettings({
      ...settings,
      fingerprintEnabled: newValue,
    });
    
    if (newValue) {
      // Simulate fingerprint setup
      setTimeout(() => {
        setFingerprintSetupComplete(true);
      }, 1500);
    } else {
      setFingerprintSetupComplete(false);
    }
  };
  
  const handleSave = () => {
    onSave(settings);
  };
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Privacy Settings</h2>
        <p className="text-gray-600 mb-4">
          Configure privacy options to protect your journal entries.
        </p>
      </div>
      
      <div className="space-y-6 bg-white rounded-lg shadow p-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Voice PIN Protection</h3>
              <p className="text-sm text-gray-500">
                Require a spoken PIN to access your journal
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.voicePinEnabled}
                onChange={handleVoicePinToggle}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          {showVoicePinInput && (
            <div className="ml-6 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Voice PIN (4-6 digits)
              </label>
              <input
                type="password"
                value={settings.voicePin}
                onChange={handleVoicePinChange}
                placeholder="Enter PIN"
                className="input w-full max-w-xs"
                maxLength={6}
                pattern="[0-9]*"
              />
              <p className="text-xs text-gray-500 mt-1">
                In a real implementation, you would record your voice saying this PIN.
              </p>
            </div>
          )}
        </div>
        
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Fingerprint Protection</h3>
              <p className="text-sm text-gray-500">
                Use your device's fingerprint sensor to access your journal
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.fingerprintEnabled}
                onChange={handleFingerprintToggle}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          {settings.fingerprintEnabled && (
            <div className="ml-6 mt-4">
              {!fingerprintSetupComplete ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary mr-2"></div>
                  <p className="text-sm">Setting up fingerprint authentication...</p>
                </div>
              ) : (
                <div className="text-sm text-green-600">
                  Fingerprint authentication set up successfully!
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                In a real implementation, this would use your device's biometric API.
              </p>
            </div>
          )}
        </div>
        
        <div className="border-t pt-6">
          <Button onClick={handleSave}>
            Save Privacy Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
