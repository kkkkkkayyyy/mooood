import { useState, useEffect } from 'react'
import PhoneFrame from './components/PhoneFrame'
import LoadingScreen from './screens/LoadingScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import EmotionStep1 from './screens/EmotionStep1'
import EmotionStep2 from './screens/EmotionStep2'
import IntensityScreen from './screens/IntensityScreen'
import BodyHeatmap from './screens/BodyHeatmap'
import ContextScreen from './screens/ContextScreen'
import CalmMethod from './screens/CalmMethod'
import SystemSummary from './screens/SystemSummary'
import CompletionScreen from './screens/CompletionScreen'
import MoodHistoryScreen from './screens/MoodHistoryScreen'
import ProfileScreen from './screens/ProfileScreen'
import EventDetailScreen, { EventDetail } from './screens/EventDetailScreen'
import PermissionsScreen from './screens/PermissionsScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import WearableSearchScreen from './screens/WearableSearchScreen'
import { supabase } from './lib/supabase'

export type Screen =
  | 'loading'
  | 'login'
  | 'register'
  | 'permissions'
  | 'onboarding'
  | 'wearable-search'
  | 'home'
  | 'profile'
  | 'mood-history'
  | 'event-detail'
  | 'emotion-step1'
  | 'emotion-step2'
  | 'intensity'
  | 'body-heatmap'
  | 'context'
  | 'calm-method'
  | 'system-summary'
  | 'completion'

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | undefined>(undefined)
  const [wearableConnected, setWearableConnected] = useState(false)
  const [wearableReturnTo, setWearableReturnTo] = useState<Screen>('home')

  // Auto-advance from loading → login (or home if already authenticated)
  useEffect(() => {
    if (screen === 'loading') {
      const t = setTimeout(async () => {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          const name = data.session.user?.user_metadata?.full_name || data.session.user?.email?.split('@')[0] || ''
          setUserName(name)
          setUserEmail(data.session.user?.email || '')
          // Check if onboarding already done
          const onboarded = localStorage.getItem('mooood_onboarded')
          setScreen(onboarded ? 'home' : 'onboarding')
        } else {
          setScreen('login')
        }
      }, 1800)
      return () => clearTimeout(t)
    }
  }, [screen])

  // Listen for auth state changes (only react to sign-out)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setScreen('login')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const navigate = (s: Screen) => setScreen(s)

  const onAuthSuccess = async () => {
    const { data } = await supabase.auth.getUser()
    const name = data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || ''
    setUserName(name)
    setUserEmail(data.user?.email || '')
    // Always show onboarding on first login
    const onboarded = localStorage.getItem('mooood_onboarded')
    setScreen(onboarded ? 'home' : 'onboarding')
  }

  const onOnboardingComplete = (connected: boolean = false) => {
    setWearableConnected(connected)
    localStorage.setItem('mooood_onboarded', '1')
    if (connected) localStorage.setItem('mooood_wearable', '1')
    setScreen('home')
  }

  const onConnectWearable = () => {
    setWearableConnected(true)
    localStorage.setItem('mooood_wearable', '1')
    localStorage.setItem('mooood_onboarded', '1')
  }

  const onDisconnectWearable = () => {
    setWearableConnected(false)
    localStorage.removeItem('mooood_wearable')
  }

  // Restore wearable state on load
  useEffect(() => {
    if (localStorage.getItem('mooood_wearable') === '1') {
      setWearableConnected(true)
    }
  }, [])

  const renderScreen = () => {
    switch (screen) {
      case 'loading':
        return <LoadingScreen />
      case 'login':
        return <LoginScreen onNavigate={navigate} onAuthSuccess={onAuthSuccess} />
      case 'register':
        return <RegisterScreen onNavigate={navigate} onAuthSuccess={onAuthSuccess} />
      case 'onboarding':
        return <OnboardingScreen onNavigate={navigate} onComplete={() => setScreen('permissions')} />
      case 'permissions':
        return <PermissionsScreen
          onNavigate={navigate}
          onAccept={() => { setWearableReturnTo('home'); setScreen('wearable-search') }}
          onSkip={() => onOnboardingComplete(false)}
        />
      case 'wearable-search':
        return <WearableSearchScreen onNavigate={navigate} returnTo={wearableReturnTo} onConnected={onConnectWearable} />
      case 'home':
        return <HomeScreen onNavigate={navigate} userName={userName} wearableConnected={wearableConnected} onEventDetail={(ev) => { setSelectedEvent(ev); setScreen('event-detail') }} />
      case 'event-detail':
        return <EventDetailScreen onNavigate={navigate} event={selectedEvent} />
      case 'profile':
        return <ProfileScreen onNavigate={navigate} userName={userName} userEmail={userEmail} wearableConnected={wearableConnected} onConnectWearable={() => { setWearableReturnTo('profile'); setScreen('wearable-search') }} onDisconnectWearable={onDisconnectWearable} />
      case 'mood-history':
        return <MoodHistoryScreen onNavigate={navigate} />
      case 'emotion-step1':
        return <EmotionStep1 onNavigate={navigate} />
      case 'emotion-step2':
        return <EmotionStep2 onNavigate={navigate} />
      case 'intensity':
        return <IntensityScreen onNavigate={navigate} />
      case 'body-heatmap':
        return <BodyHeatmap onNavigate={navigate} />
      case 'context':
        return <ContextScreen onNavigate={navigate} />
      case 'calm-method':
        return <CalmMethod onNavigate={navigate} />
      case 'system-summary':
        return <SystemSummary onNavigate={navigate} />
      case 'completion':
        return <CompletionScreen onNavigate={navigate} />
      default:
        return <HomeScreen onNavigate={navigate} wearableConnected={wearableConnected} />
    }
  }

  return (
    <div className="min-h-screen bg-[#C5C9D4] flex items-center justify-center py-8">
      <PhoneFrame>
        {renderScreen()}
      </PhoneFrame>
    </div>
  )
}
