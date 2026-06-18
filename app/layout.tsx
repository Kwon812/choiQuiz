import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
    variable: "--font-geist",
    subsets: ["latin"],
});

export const metadata = {
    title: "Quiz",
    description: "퀴즈 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" className={`${geist.variable} h-full`}>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
                />
            </head>
            <body
                className="min-h-full flex flex-col items-center bg-canvas"
                style={{ fontFamily: "var(--font-geist), -apple-system, system-ui, sans-serif", color: "#222222" }}
            >
                {children}
            </body>
        </html>
    );
}
