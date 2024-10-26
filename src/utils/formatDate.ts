import { Timestamp } from "@react-native-firebase/firestore"

export const formatDate = (dateTimestamp: Timestamp) => {
  if (!dateTimestamp) return 'No disponible'
  const date = dateTimestamp.toDate()
  const day = String(date.getDate() + 1).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}