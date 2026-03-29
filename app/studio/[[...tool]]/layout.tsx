export const metadata = {
  title: "Ullrhome Studio",
  description: "Content management for Ullrhome",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="sanity-studio"
      style={{
        height: "100vh",
        maxHeight: "100dvh",
        overscrollBehavior: "none",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {children}
    </div>
  );
}
