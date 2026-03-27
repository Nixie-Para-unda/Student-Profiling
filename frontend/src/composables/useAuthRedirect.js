
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

export function useAuthRedirect() {
  const router = useRouter();
  const authStore = useAuthStore();

  const getDashboardRoute = () => {
    if (authStore.isStudent) return '/student/profile';
    if (authStore.isFaculty) return '/faculty/schedule';
    if (authStore.isDean) return '/students';
    if (authStore.isChair) return '/chair/students';
    if (authStore.isSecretary) return '/secretary/students';
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
