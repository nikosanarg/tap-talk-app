import { AuthService } from './AuthService'
import { AuxiliarApiService } from './AuxiliarApiService'
import { CategoriaApiService } from './CategoriaApiService'
import { GrupoApiService } from './GrupoApiService'
import { PictogramaApiService } from './PictogramaApiService'
import { NotificationApiService } from './NotificationApiService'

export const apiFunctions: Record<string, Function> = {
  // Auth functions - mantienen Firebase
  registerUser: AuthService.registerUser,
  loginUser: AuthService.loginUser,
  logoutUser: AuthService.logoutUser,
  getCurrentUser: AuthService.getCurrentUser,
  resetPassword: AuthService.resetPassword,

  // User functions
  getUser: AuxiliarApiService.getById,
  createUser: AuxiliarApiService.create,
  updateUser: AuxiliarApiService.update,

  // Category functions
  getCategories: CategoriaApiService.getAll,
  getCategory: CategoriaApiService.getById,

  // Support group functions
  getSupportGroups: GrupoApiService.getByAuxiliar,
  createSupportGroup: GrupoApiService.create,
  updateSupportGroup: GrupoApiService.update,

  // Pictogram functions
  getPictograms: PictogramaApiService.getAll,
  createPictogram: PictogramaApiService.create,
  updatePictogram: PictogramaApiService.update,

  // Notification functions
  createNotification: NotificationApiService.create,
  getNotifications: NotificationApiService.getAll,
}