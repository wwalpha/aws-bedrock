import { Toaster } from "@/components/ui/sonner"
import StoreBootstrap from "@/components/utility/store-bootstrap"
import ChatbotContextBridge from "@/components/utility/chatbot-context-bridge"
import { Providers } from "@/components/utility/providers"
import TranslationsProvider from "@/components/utility/translations-provider"
import initTranslations from "@/lib/i18n"
import { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ReactNode } from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], display: "swap" })
const APP_NAME = "Chatbot UI"
const APP_DEFAULT_TITLE = "Chatbot UI"
const APP_TITLE_TEMPLATE = "%s - Chatbot UI"
const APP_DESCRIPTION = "Chabot UI PWA!"

interface RootLayoutProps {
  children: ReactNode
  params: Promise<{
    locale: string
  }>
}

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: APP_DEFAULT_TITLE
    // startUpImage: [],
  },
  // Add mobile-web-app-capable for Android/Chrome PWA support
  other: {
    "mobile-web-app-capable": "yes"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  }
}

export const viewport: Viewport = {
  themeColor: "#000000"
}

const i18nNamespaces = ["translation"]

export default async function RootLayout(props: RootLayoutProps) {
  const { children } = props
  const { locale } = await props.params
  // Supabase auth removed in Phase 1; render children directly

  const { t, resources } = await initTranslations(locale, i18nNamespaces)

  return (
    <html lang={locale || "en"} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers attribute="class" defaultTheme="dark">
          <TranslationsProvider
            namespaces={i18nNamespaces}
            locale={locale}
            resources={resources}
          >
            <Toaster
              // lighter work in dev to reduce hydration/render time
              richColors={process.env.NODE_ENV === "production"}
              position="top-center"
              duration={3000}
            />
            <div className="bg-background text-foreground flex h-dvh flex-col items-center overflow-x-auto">
              <StoreBootstrap />
              <ChatbotContextBridge>{children}</ChatbotContextBridge>
            </div>
          </TranslationsProvider>
        </Providers>
      </body>
    </html>
  )
}
