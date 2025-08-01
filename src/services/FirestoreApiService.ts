import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

export const FirestoreApiService = {
  getUser: async (userId: string) => {
    try {
      const document = await firestore()
        .collection('Usuarios')
        .doc(userId)
        .get();
      if (document.exists) {
        return { id: document.id, ...document.data() };
      } else {
        throw new Error('User not found');
      }
    } catch (error: any) {
      throw new Error(`Error getting user: ${error.message}`);
    }
  },

  createUser: async (userId: string, data: any) => {
    try {
      await firestore().collection('Usuarios').doc(userId).set(data);
      return { id: userId, ...data };
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  },

  updateUser: async (userId: string, data: any) => {
    try {
      await firestore().collection('Usuarios').doc(userId).update(data);
      return { id: userId, ...data };
    } catch (error: any) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  },

  deleteUser: async (userId: string) => {
    try {
      await firestore().collection('Usuarios').doc(userId).delete();
      return { id: userId };
    } catch (error: any) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  },

  getCategories: async () => {
    try {
      const snapshot = await firestore().collection('Categorías').get();
      return snapshot.docs.map(
        (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data(),
        })
      );
    } catch (error: any) {
      throw new Error(`Error getting categories: ${error.message}`);
    }
  },

  getCategory: async (categoryId: string) => {
    try {
      const document = await firestore()
        .collection('Categorías')
        .doc(categoryId)
        .get();
      if (document.exists) {
        return { id: document.id, ...document.data() };
      } else {
        throw new Error('Category not found');
      }
    } catch (error: any) {
      throw new Error(`Error getting category: ${error.message}`);
    }
  },

  createCategory: async (data: any) => {
    try {
      const docRef = await firestore().collection('Categorías').add(data);
      return { id: docRef.id, ...data };
    } catch (error: any) {
      throw new Error(`Error creating category: ${error.message}`);
    }
  },

  updateCategory: async (categoryId: string, data: any) => {
    try {
      await firestore().collection('Categorías').doc(categoryId).update(data);
      return { id: categoryId, ...data };
    } catch (error: any) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  },

  deleteCategory: async (categoryId: string) => {
    try {
      await firestore().collection('Categorías').doc(categoryId).delete();
      return { id: categoryId };
    } catch (error: any) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  },

  getSupportGroups: async (userId: string) => {
    try {
      const snapshot = await firestore()
        .collection('supportGroups')
        .where('members', 'array-contains', userId)
        .get();
      return snapshot.docs.map(
        (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data(),
        })
      );
    } catch (error: any) {
      throw new Error(`Error getting support groups: ${error.message}`);
    }
  },

  createSupportGroup: async (data: any) => {
    try {
      const docRef = await firestore().collection('supportGroups').add(data);
      return { id: docRef.id, ...data };
    } catch (error: any) {
      throw new Error(`Error creating support group: ${error.message}`);
    }
  },

  updateSupportGroup: async (groupId: string, data: any) => {
    try {
      await firestore().collection('supportGroups').doc(groupId).update(data);
      return { id: groupId, ...data };
    } catch (error: any) {
      throw new Error(`Error updating support group: ${error.message}`);
    }
  },

  deleteSupportGroup: async (groupId: string) => {
    try {
      await firestore().collection('supportGroups').doc(groupId).delete();
      return { id: groupId };
    } catch (error: any) {
      throw new Error(`Error deleting support group: ${error.message}`);
    }
  },

  getPictograms: async (groupId: string) => {
    try {
      const snapshot = await firestore()
        .collection('pictograms')
        .where('groupId', '==', groupId)
        .get();
      return snapshot.docs.map(
        (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data(),
        })
      );
    } catch (error: any) {
      throw new Error(`Error getting pictograms: ${error.message}`);
    }
  },

  createPictogram: async (data: any) => {
    try {
      const docRef = await firestore().collection('pictograms').add(data);
      return { id: docRef.id, ...data };
    } catch (error: any) {
      throw new Error(`Error adding pictogram: ${error.message}`);
    }
  },

  updatePictogram: async (pictogramId: string, data: any) => {
    try {
      await firestore().collection('pictograms').doc(pictogramId).update(data);
      return { id: pictogramId, ...data };
    } catch (error: any) {
      throw new Error(`Error updating pictogram: ${error.message}`);
    }
  },

  deletePictogram: async (pictogramId: string) => {
    try {
      await firestore().collection('pictograms').doc(pictogramId).delete();
      return { id: pictogramId };
    } catch (error: any) {
      throw new Error(`Error deleting pictogram: ${error.message}`);
    }
  },
};
