import { Cormorant_Garamond, Inter } from 'next/font/google';

// Self-hosted at build time by next/font: no request to Google from the visitor's browser.
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});
