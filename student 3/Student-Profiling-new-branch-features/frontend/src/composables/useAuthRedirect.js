
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

export function useAuthRedirect() {
  const router = useRouter();
  const authStore = useAuthStore();

  const getDashboardRoute = () => {
    if (authStore.isStudent) return '/student/dashboard';
    if (authStore.isFaculty) return '/faculty/dashboard';
    if (authStore.isDean) return '/dean/dashboard';
    if (authStore.isChair) return '/chair/dashboard';
    if (authStore.isSecretary) return '/secretary/dashboard';
    return '/'; // Fallback route
  };

  const redirect = () => {
    const route = getDashboardRoute();
    router.push(route);
  };

  return {
    redirect,
    getDashboardRoute
  };
}
