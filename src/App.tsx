import { useState, useEffect } from 'react'
import PhoneFrame from './components/PhoneFrame'
import LoadingScreen from './screens/LoadingScreen'
import TipScreen from './screens/TipScreen'
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

export type Screen =
  | 'loading'
  | 'tip'
  | 'home'
  | 'mood-history'
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

  // Auto-advance from loading → tip → home
  useEffect(() => {
    if (screen === 'loading') {
      const t = setTimeout(() => setScreen('tip'), 1800)
      return () => clearTimeout(t)
    }
    if (screen === 'tip') {
      const t = setTimeout(() => setScreen('home'), 2800)
      return () => clearTimeout(t)
    }
  }, [screen])

  const navigate = (s: Screen) => setScreen(s)

  const renderScreen = () => {
    switch (screen) {
      case 'loading':
        return <LoadingScreen />
      case 'tip':
        return <TipScreen onNavigate={navigate} />
      case 'home':
        return <HomeScreen onNavigate={navigate} />
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
        return <HomeScreen onNavigate={navigate} />
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
