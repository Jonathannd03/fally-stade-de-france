import "./globals.css";

// This is the root layout - kept minimal as per next-intl requirements
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
