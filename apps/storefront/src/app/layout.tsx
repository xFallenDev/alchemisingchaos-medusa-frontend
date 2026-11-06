import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import "styles/cosmic.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  icons: { icon: "/brand/festival-mark.png" },
}

// Match the festival site's day/night default and remember manual choices.
const themeScript = `
  (function () {
    var theme = "light";
    var source = "auto";
    try {
      var saved = localStorage.getItem("festival-theme");
      if (saved === "light" || saved === "dark") {
        theme = saved;
        source = "manual";
      } else {
        var hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", hourCycle: "h23" }).format(new Date()));
        theme = hour >= 6 && hour < 18 ? "light" : "dark";
      }
    } catch (_) {}
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.mode = theme;
    document.documentElement.dataset.themeSource = source;
  })();
`

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" data-mode="light" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="ucp" href="/.well-known/ucp" />
      </head>
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
