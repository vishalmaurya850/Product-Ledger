'use client'

import { useEffect, useState } from 'react'

interface AutoUpdateResult {
  success: boolean
  updatedCount: number
  message: string
  timestamp: string
}

export function useAutoStatusUpdate() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<AutoUpdateResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const triggerAutoUpdate = async () => {
    // Don't run multiple updates simultaneously
    if (isUpdating) return

    setIsUpdating(true)
    setError(null)

    try {
      const response = await fetch('/api/auto-update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.success) {
        setLastUpdate(result)
        
        // Log successful auto-update
        if (result.updatedCount > 0) {
          console.log(`🔄 Auto Status Update: ${result.updatedCount} entries updated automatically`)
        }
      } else {
        setError(result.error || 'Auto-update failed')
        console.error('❌ Auto Status Update failed:', result.error)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error'
      setError(errorMessage)
      console.error('❌ Auto Status Update error:', errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  // Auto-trigger on component mount
  useEffect(() => {
    const runAutoUpdate = async () => {
      // Small delay to ensure everything is loaded
      await new Promise(resolve => setTimeout(resolve, 1000))
      await triggerAutoUpdate()
    }

    runAutoUpdate()
  }, [])

  // Optional: Set up periodic updates (every 30 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      triggerAutoUpdate()
    }, 30 * 60 * 1000) // 30 minutes

    return () => clearInterval(interval)
  }, [])

  return {
    isUpdating,
    lastUpdate,
    error,
    triggerAutoUpdate
  }
}

// Optional: Component to show auto-update status
export function AutoUpdateIndicator() {
  const { isUpdating, lastUpdate, error } = useAutoStatusUpdate()

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-lg text-sm">
        ⚠️ Auto-update error: {error}
      </div>
    )
  }

  if (isUpdating) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg shadow-lg text-sm">
        🔄 Checking for status updates...
      </div>
    )
  }

  if (lastUpdate && lastUpdate.updatedCount > 0) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-lg text-sm">
        ✅ Auto-updated {lastUpdate.updatedCount} entries
      </div>
    )
  }

  return null
}
