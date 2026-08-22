import AuthModal from '@/components/AuthModal';
import { AuthProvider } from '@/contexts/AuthContext';
import type { Metadata } from 'next';
import './globals.css';

const siteTitle = 'TalkOps | Free AI Video Generator, AI Voice & WhatsApp Automation';
const siteDescription =
  'Generate stunning high-quality AI videos for free from text prompts using TalkOps. Unlimited AI video generation tool powered by TalkOps.';

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: '%s | TalkOps',
  },
  description: siteDescription,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TalkOps',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    description: siteDescription,
    featureList: [
      'Free AI Video Generator',
      'AI Voice Sales Agent',
      'WhatsApp Automation',
      'SMS Automation',
    ],
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
