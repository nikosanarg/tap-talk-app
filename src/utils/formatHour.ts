import { Timestamp } from "@react-native-firebase/firestore";

export const formatSinceTimeToHumanRead = (date: Timestamp) => {
  const dateInMs = date.toMillis(); 
  const currentDate = Date.now()
  const diff = currentDate - dateInMs
  const minutes = Math.floor(diff / (60 * 1000))
  const hours = Math.floor(diff / (60 * 60 * 1000))
  if (minutes < 2) {
    return `hace 1 minuto`
  } else if (minutes < 60) {
    return `hace ${minutes} minutos`
  } else if (hours < 2) {
    return `hace 1 hora`
  } else {
    return `hace ${hours} horas`
  }
}