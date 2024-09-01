import { ApiService } from '../services/ApiService'
import { AuthService } from './AuthService'

export const apiFunctions: Record<string, Function> = {
  registerUser: AuthService.registerUser,
  loginUser: AuthService.loginUser,
  logoutUser: AuthService.logoutUser,
  getCurrentUser: AuthService.getCurrentUser,
  resetPassword: AuthService.resetPassword,

  getUser: ApiService.getUser,
  createUser: ApiService.createUser,
  updateUser: ApiService.updateUser,
  deleteUser: ApiService.deleteUser,

  getCategories: ApiService.getCategories,
  getCategory: ApiService.getCategory,
  createCategory: ApiService.createCategory,
  updateCategory: ApiService.updateCategory,
  deleteCategory: ApiService.deleteCategory,

  getSupportGroups: ApiService.getSupportGroups,
  createSupportGroup: ApiService.createSupportGroup,
  updateSupportGroup: ApiService.updateSupportGroup,
  deleteSupportGroup: ApiService.deleteSupportGroup,

  getPictograms: ApiService.getPictograms,
  createPictogram: ApiService.createPictogram,
  updatePictogram: ApiService.updatePictogram,
  deletePictogram: ApiService.deletePictogram,
}