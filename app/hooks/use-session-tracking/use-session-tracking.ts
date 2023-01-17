import { useEffect } from 'react'
import { useLocation } from 'react-router-dom';

const useSessionTracking = () => {
  const location = useLocation();

  const trackSession = async (url: string) => {
    await fetch('/api/sessions', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
  }

  useEffect(() => {
    trackSession(window.location.href)
  }, [location])
}

export default useSessionTracking
