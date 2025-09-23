import React, { useState, useEffect } from 'react';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { toast } from 'sonner@2.0.3';
import { ArrowLeft, MapPin, Users, Bus, Navigation, UserCog, Search, Play, Square, Clock, Route } from 'lucide-react';

import WelcomeScreen from './components/WelcomeScreen';
import DriverLogin from './components/DriverLogin';
import DriverRegister from './components/DriverRegister';
import DriverConfig from './components/DriverConfig';
import DriverDashboard from './components/DriverDashboard';
import DriverEdit from './components/DriverEdit';
import CommuterSearch from './components/CommuterSearch';
import BusList from './components/BusList';
import MapScreen from './components/MapScreen';
import PWAFeatures from './components/PWAFeatures';

export type Screen = 
  | 'welcome' 
  | 'driverLogin' 
  | 'driverRegister' 
  | 'driverConfig' 
  | 'driverDashboard'
  | 'driverEdit'
  | 'commuterSearch'
  | 'busList'
  | 'map';

export interface Driver {
  name: string;
  phone: string;
  password: string;
}

export interface RouteConfig {
  routeId: string;
  startTime: string;
  endTime: string;
  stops: string[];
}

export interface LocationData {
  lat: number;
  lng: number;
  timestamp: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [screenHistory, setScreenHistory] = useState<Screen[]>(['welcome']);
  const [loggedInDriver, setLoggedInDriver] = useState<Driver | null>(null);
  const [searchResults, setSearchResults] = useState<RouteConfig[]>([]);
  const [trackingBus, setTrackingBus] = useState<string>('');

  // Handle PWA shortcuts on app load
  useEffect(() => {
    const shortcut = localStorage.getItem('pwa-shortcut');
    if (shortcut === 'driver') {
      localStorage.removeItem('pwa-shortcut');
      showScreen('driverLogin');
      toast('Welcome to Driver Portal! 🚌');
    } else if (shortcut === 'commuter') {
      localStorage.removeItem('pwa-shortcut');
      showScreen('commuterSearch');
      toast('Let\'s find your bus! 🔍');
    }
  }, []);

  const showScreen = (screen: Screen) => {
    setScreenHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = screenHistory.slice(0, -1);
      const previousScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(previousScreen);
    }
  };

  const resetToScreen = (screen: Screen) => {
    setScreenHistory([screen]);
    setCurrentScreen(screen);
  };

  const showNotification = (message: string) => {
    toast(message);
  };

  return (
    <>
      {/* PWA Features Component */}
      <PWAFeatures />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden relative" style={{ height: '700px' }}>
          
          {currentScreen === 'welcome' && (
            <WelcomeScreen onShowScreen={showScreen} />
          )}

        {currentScreen === 'driverLogin' && (
          <DriverLogin 
            onShowScreen={showScreen}
            onGoBack={goBack}
            onDriverLogin={setLoggedInDriver}
            onShowNotification={showNotification}
          />
        )}

        {currentScreen === 'driverRegister' && (
          <DriverRegister 
            onShowScreen={showScreen}
            onGoBack={goBack}
            onShowNotification={showNotification}
          />
        )}

        {currentScreen === 'driverConfig' && (
          <DriverConfig 
            loggedInDriver={loggedInDriver}
            onShowScreen={showScreen}
            onGoBack={goBack}
            onShowNotification={showNotification}
          />
        )}

        {currentScreen === 'driverDashboard' && (
          <DriverDashboard 
            loggedInDriver={loggedInDriver}
            onShowScreen={showScreen}
            onLogout={() => {
              setLoggedInDriver(null);
              resetToScreen('welcome');
            }}
          />
        )}

        {currentScreen === 'driverEdit' && (
          <DriverEdit 
            loggedInDriver={loggedInDriver}
            onGoBack={goBack}
            onDriverUpdate={setLoggedInDriver}
            onShowNotification={showNotification}
          />
        )}

        {currentScreen === 'commuterSearch' && (
          <CommuterSearch 
            onShowScreen={showScreen}
            onGoBack={goBack}
            onSearchResults={setSearchResults}
            onShowNotification={showNotification}
          />
        )}

        {currentScreen === 'busList' && (
          <BusList 
            searchResults={searchResults}
            onShowScreen={showScreen}
            onGoBack={goBack}
            onTrackBus={(busId: string) => {
              setTrackingBus(busId);
              showScreen('map');
            }}
          />
        )}

        {currentScreen === 'map' && (
          <MapScreen 
            trackingBus={trackingBus}
            onShowScreen={showScreen}
            onGoBack={goBack}
          />
        )}

        </div>
      </div>
    </>
  );
}