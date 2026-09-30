import SiteShell from '@/components/layout/SiteShell';
import { rootMetadata } from '@/lib/seo';

export const metadata = rootMetadata('en');

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
