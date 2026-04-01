import { useState, useEffect } from 'react'
import PhoneFrame from './components/PhoneFrame'
import LoadingScreen from './screens/LoadingScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import type { EventItem } from './screens/HomeScreen'
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
import TipScreen from './screens/TipScreen'
import ContextRapid from './screens/ContextRapid'
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
  | 'body-heatmap'
  | 'intensity'
  | 'pre-calm'
  | 'context'
  | 'calm-method'
  | 'context-rapid'
  | 'system-summary'
  | 'completion'

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | undefined>(undefined)
  const [selectedEventDayIndex, setSelectedEventDayIndex] = useState<number>(0)
  const [wearableConnected, setWearableConnected] = useState(false)
  const [wearableReturnTo, setWearableReturnTo] = useState<Screen>('home')
  const [contextEventName, setContextEventName] = useState<string>('')
  const [contextEventRef, setContextEventRef] = useState<{ dayIndex: number; eventId: number } | null>(null)
  const [selectedEmotionBg, setSelectedEmotionBg] = useState<string>('')
  const [emotionOverrides, setEmotionOverrides] = useState<Record<string, string>>({})
  const [customEvents, setCustomEvents] = useState<Record<number, EventItem[]>>({})
  const [deletedKeys, setDeletedKeys] = useState<Set<string>>(new Set())
  const [contextDayEvents, setContextDayEvents] = useState<EventItem[]>([])
  const [nameOverrides, setNameOverrides] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check existing session on load
    if (screen === 'loading') {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '')
          setUserEmail(session.user.email || '')
          setScreen('home')
        } else {
          setScreen('login')
        }
      })
    }
    if (screen === 'pre-calm') {
      const t = setTimeout(() => setScreen('calm-method'), 2800)
      return () => clearTimeout(t)
    }
  }, [screen])

  // Listen for auth state changes (e.g. email confirmation redirect)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '')
        setUserEmail(session.user.email || '')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const navigate = (s: Screen) => setScreen(s)

  const onRegisterEvent = (eventName: string, dayIndex?: number, eventId?: number, dayEvents: EventItem[] = []) => {
    setContextEventName(eventName)
    setContextEventRef(dayIndex !== undefined && eventId !== undefined ? { dayIndex, eventId } : null)
    setContextDayEvents(dayEvents)
    setSelectedEmotionBg('')
    setScreen('emotion-step1')
  }

  const onSelectEmotion = (bg: string) => setSelectedEmotionBg(bg)

  const onCompleteRegistration = (title?: string, _time?: string) => {
    if (contextEventRef) {
      const key = `${contextEventRef.dayIndex}-${contextEventRef.eventId}`
      if (selectedEmotionBg) setEmotionOverrides(prev => ({ ...prev, [key]: selectedEmotionBg }))
      if (title && title.trim()) setNameOverrides(prev => ({ ...prev, [key]: title.trim() }))
    }
    setScreen('system-summary')
  }

  const onDeleteEvent = () => {
    if (selectedEvent) {
      const key = `${selectedEventDayIndex}-${selectedEvent.id}`
      setDeletedKeys(prev => new Set([...prev, key]))
    }
    setScreen('home')
  }

  const onAuthSuccess = () => {
    setScreen('home')
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
        return <HomeScreen onNavigate={navigate} userName={userName} wearableConnected={wearableConnected} onEventDetail={(ev, dayIndex) => { setSelectedEvent(ev); setSelectedEventDayIndex(dayIndex); setScreen('event-detail') }} onRegisterEvent={onRegisterEvent} emotionOverrides={emotionOverrides} nameOverrides={nameOverrides} customEvents={customEvents} setCustomEvents={setCustomEvents} deletedKeys={deletedKeys} setDeletedKeys={setDeletedKeys} />
      case 'event-detail':
        return <EventDetailScreen onNavigate={navigate} event={selectedEvent} onDelete={onDeleteEvent} />
      case 'profile':
        return <ProfileScreen onNavigate={navigate} userName={userName} userEmail={userEmail} wearableConnected={wearableConnected} onConnectWearable={() => { setWearableReturnTo('profile'); setScreen('wearable-search') }} onDisconnectWearable={onDisconnectWearable} />
      case 'mood-history':
        return <MoodHistoryScreen onNavigate={navigate} />
      case 'emotion-step1':
        return <EmotionStep1 onNavigate={navigate} onSelectEmotion={onSelectEmotion} />
      case 'emotion-step2':
        return <EmotionStep2 onNavigate={navigate} />
      case 'body-heatmap':
        return <BodyHeatmap onNavigate={navigate} />
      case 'intensity':
        return <IntensityScreen onNavigate={navigate} />
      case 'pre-calm':
        return <TipScreen onNavigate={navigate} />
      case 'context':
        return <ContextScreen onNavigate={navigate} />
      case 'calm-method':
        return <CalmMethod onNavigate={navigate} />
      case 'context-rapid':
        return <ContextRapid onNavigate={navigate} contextEventName={contextEventName} dayEvents={contextDayEvents} onSave={onCompleteRegistration} />
      case 'system-summary':
        return <SystemSummary onNavigate={navigate} />
      case 'completion':
        return <CompletionScreen onNavigate={navigate} userName={userName} />
      default:
        return <HomeScreen onNavigate={navigate} wearableConnected={wearableConnected} onRegisterEvent={onRegisterEvent} emotionOverrides={emotionOverrides} nameOverrides={nameOverrides} customEvents={customEvents} setCustomEvents={setCustomEvents} deletedKeys={deletedKeys} setDeletedKeys={setDeletedKeys} />
    }
  }

  return (
    <div className="w-full lg:min-h-screen lg:bg-[#C5C9D4] lg:flex lg:items-center lg:justify-center lg:py-8">
      <PhoneFrame>
        {renderScreen()}
      </PhoneFrame>
    </div>
  )
}
