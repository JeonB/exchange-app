import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import QueryProvider from '@/components/providers/query-provider';
import ToastProvider from '@/components/providers/toast-provider';

const pretendard = localFont({
  variable: '--font-pretendard',
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '100 900',
  preload: true,
});

export const metadata: Metadata = {
  title: '환전 애플리케이션',
  description: '실시간 환율을 적용한 자산 환전 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} antialiased`}>
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
