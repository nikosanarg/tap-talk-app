# tap-talk-app
Repositorio oficial para el Grupo de Investigación LINA de la UTN FRLP sobre el desarrollo del aplicativo Tap-Talk

# Inicialización
Se volcará en este apartado la documentación que se encuentra en las entregas de la Práctica Supervisada para la puesta a punto de los ambientes y requerimientos técnicos

## Generación y distribución de la APK post cambios

# Buildeo inicial
npm run build-bundle

# Prueba local
npm run android

# Prueba local reseteando cache
npm run android-reset

# Limpieza de caché
cd android
./gradlew clean
./gradlew assembleDebug

# Distribuir la APK generada en
android\app\build\outputs\apk\debug\app-debug.apk

## Si se conecta un celu

# Para ver dispositivos conectados
adb devices

# Ver el script en package.json, modificar el ID de tu dispositivo y ejecutar
npm run logs-realphone