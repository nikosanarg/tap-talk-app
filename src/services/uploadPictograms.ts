const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your-service-account-key.json');

const pictogramsToUploadToComida = {
  firestoreId: "M9JaAiE3J5PNENYjRT1v",
  content: [
  {
    "nombre": "Bebida",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image1.png",
    "usos": 0,
    "activo": true
  },
  {
    "nombre": "Comida",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image2.png",
    "usos": 0,
    "activo": true
  },
  {
    "nombre": "Utensilios",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image3.png",
    "usos": 0,
    "activo": true
  },
  {
    "nombre": "Agua",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image1.png",
    "usos": 0,
    "activo": true
  },
  {
    "nombre": "Desayuno",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image2.png",
    "usos": 0,
    "activo": true
  },
  {
    "nombre": "Merienda",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image3.png",
    "usos": 0,
    "activo": true
  },]
}

const pictogramsToUploadToGente = {
  firestoreId: "0yuArdPkf90Nm4yd9mW8",
  content: [
  {
    "nombre": "Amigo",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image3.png",
    "usos": 0,
    "activo": true
  },
  {
    "nombre": "Familia",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image1.png",
    "usos": 0,
    "activo": true
  },
  {
    "nombre": "Hablar",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image2.png",
    "usos": 0,
    "activo": true
  },
  {
    "nombre": "Compañía",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image3.png",
    "usos": 0,
    "activo": true
  },]
}

const pictogramsToUploadToSalud = {
  firestoreId: "SZnBzYDg0VjhKjC8lvss",
  content: [
  {
    "nombre": "Dolor",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image3.png",
    "usos": 0,
    "activo": true
  },
  {
    "nombre": "Enfermería",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image1.png",
    "usos": 0,
    "activo": true
  },
  {
    "nombre": "Descansar",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image2.png",
    "usos": 0,
    "activo": true
  },
  {
    "nombre": "Higiene",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image3.png",
    "usos": 0,
    "activo": true
  },]
}


const pictogramsToUploadToAcciones = {
  firestoreId: "ZEL4v5HFWKM68nlPKl71",
  content: [
  {
    "nombre": "Ayuda",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image2.png",
    "usos": 0,
    "activo": true
  },
  {
    "nombre": "Movilidad",
    "fechaCreacion": "2024-08-23T00:00:00.000Z",
    "imagenUrl": "https://example.com/image3.png",
    "usos": 0,
    "activo": true
  },]
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

const uploadPictograms = async ({ collectionInUse }: any) => {
  const pictogramsCollection = firestore.collection(`Categorias/${collectionInUse.firestoreId}/pictogramas`);

  try {
    for (const pictogram of collectionInUse.content) {
      await pictogramsCollection.add({
        ...pictogram,
        fechaCreacion: admin.firestore.Timestamp.fromDate(new Date(pictogram.fechaCreacion)),
      });
      console.log(`✅ Pictograma "${pictogram.nombre}" agregado correctamente.`);
    }
    console.log('✅ Todos los pictogramas se han subido exitosamente.');
  } catch (error) {
    console.error('🚫 Error al subir pictogramas:', error);
  }
};

uploadPictograms({ collectionInUse: pictogramsToUploadToComida });
uploadPictograms({ collectionInUse: pictogramsToUploadToGente });
uploadPictograms({ collectionInUse: pictogramsToUploadToSalud });
uploadPictograms({ collectionInUse: pictogramsToUploadToAcciones });

// exec: node src/services/uploadPictograms.ts