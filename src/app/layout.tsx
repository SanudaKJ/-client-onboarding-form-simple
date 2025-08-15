import "../app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <div style={{ maxWidth: 820, margin: "48px auto", padding: 20 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
