import "./globals.css";

export const metadata = {
  title: "MediChannel",
  description: "Hospital channelling and appointment system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
