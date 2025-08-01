import { FirestoreApiService } from '../services/FirestoreApiService'
import { AuthService } from './AuthService'

export const apiFunctions: Record<string, Function> = {
  registerUser: AuthService.registerUser,
  loginUser: AuthService.loginUser,
  logoutUser: AuthService.logoutUser,
  getCurrentUser: AuthService.getCurrentUser,
  resetPassword: AuthService.resetPassword,

  getUser: FirestoreApiService.getUser,
  createUser: FirestoreApiService.createUser,
  updateUser: FirestoreApiService.updateUser,
  deleteUser: FirestoreApiService.deleteUser,

  getCategories: FirestoreApiService.getCategories,
  getCategory: FirestoreApiService.getCategory,
  createCategory: FirestoreApiService.createCategory,
  updateCategory: FirestoreApiService.updateCategory,
  deleteCategory: FirestoreApiService.deleteCategory,

  getSupportGroups: FirestoreApiService.getSupportGroups,
  createSupportGroup: FirestoreApiService.createSupportGroup,
  updateSupportGroup: FirestoreApiService.updateSupportGroup,
  deleteSupportGroup: FirestoreApiService.deleteSupportGroup,

  getPictograms: FirestoreApiService.getPictograms,
  createPictogram: FirestoreApiService.createPictogram,
  updatePictogram: FirestoreApiService.updatePictogram,
  deletePictogram: FirestoreApiService.deletePictogram,
}