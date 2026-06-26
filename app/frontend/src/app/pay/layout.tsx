export default function PayLayout({ children }: { children: React.ReactNode }) {
  // This layout adds no visual chrome — the page wrapper handles the background
  // and the page.tsx handles dynamic generateMetadata for the payment link.
  return <>{children}</>;
}
