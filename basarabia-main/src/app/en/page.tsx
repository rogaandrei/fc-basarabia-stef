import HomePage from '@/components/HomePage';
import { metaFor } from '@/i18n/meta';

export const metadata = metaFor('en');

export default function Page() {
  return <HomePage lang="en" />;
}
