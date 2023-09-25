import { Inter } from 'next/font/google';
import '../styles/global.css';

const inter = Inter({ subsets: ['latin'] });
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
