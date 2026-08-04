export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Embed pages render their own minimal HTML — no Navbar/Footer
  return children;
}
