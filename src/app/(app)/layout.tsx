import '@/styles.css';
import Header from '@/components/Header';
import { Providers } from './providers';
export const metadata = { title: '5ciastek - Sourdough Assistant', icons: { icon: '/favicon.svg' } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="pl"><body className="root-body"><Providers><Header /><main className="root-main">{children}</main></Providers></body></html>;
}
