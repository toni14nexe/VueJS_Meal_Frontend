import cookies from 'vue-cookies';
import { router } from '../main';

export function checkAdminAuthorization() {
  if (cookies.get('authorization')) router.replace('/backoffice/dashboard');
  else router.replace('/backoffice/login');
}
