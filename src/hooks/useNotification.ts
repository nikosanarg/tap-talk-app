import { useEffect, useState } from 'react'
import { NotificationService } from '../services/NotificationService'

export const useNotification = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false)

  useEffect(() => {
    const checkPermissions = async () => {
      const granted = await NotificationService.requestPermission()
      setPermissionsGranted(granted)
    }
    checkPermissions()
  }, [])

  const onNotificationReceived = (callback: (message: any) => void) => {
    return NotificationService.onNotificationReceived(callback)
  }

  return { permissionsGranted, onNotificationReceived }
}
