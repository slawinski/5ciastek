import { createFileRoute } from '@tanstack/react-router'
import { ProfileDashboard } from '@/features/profile';

export const Route = createFileRoute('/profile/')({
  component: ProfileDashboard,
})
