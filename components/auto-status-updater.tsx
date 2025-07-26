'use client'

import { useEffect, useState } from 'react'

export function AutoStatusUpdater() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  const runAutoUpdate = async () => {
    if (isUpdating) return

    setIsUpdating(true)
    
    try {
      const response = await fetch('/api/auto-update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.success && result.updatedCount > 0) {
        setLastUpdate(`Updated ${result.updatedCount} entries`)
        console.log(`🔄 Auto Status Update: ${result.updatedCount} entries updated automatically`)
        
        // Refresh the page to show updated data
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error) {
      console.error('Auto-update error:', error)
    } finally {
      if (!window.location.reload) {
        setIsUpdating(false)
      }
    }
  }

  // Run auto-update when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      runAutoUpdate()
    }, 1000) // 1 second delay to ensure page is fully loaded

    return () => clearTimeout(timer)
  }, [])

  // Show a subtle indicator when updating
  if (isUpdating) {
    return (
      <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded text-sm">
        🔄 Checking for overdue updates...
      </div>
    )
  }

  // Show success message briefly
  if (lastUpdate) {
    return (
      <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded text-sm">
        ✅ {lastUpdate} - Refreshing...
      </div>
    )
  }

  return null
}
