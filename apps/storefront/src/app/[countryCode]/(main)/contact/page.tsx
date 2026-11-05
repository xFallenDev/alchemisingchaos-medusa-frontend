import { Metadata } from "next"

import { STORE_NAME } from "@lib/util/site"
import { PolicyPage } from "@modules/policies/templates"

export const dynamic = "force-static"
export const revalidate = 60

export const metadata: Metadata = {
  title: "Contact",
  description: `How to contact ${STORE_NAME}.`,
}

export default function ContactPage() {
  return (
    <PolicyPage title="Contact">
      <p>
        Questions about an order, shipping or returns? Email the Alchemising Chaos team at{" "}
        <a className="underline" href="mailto:alchemisingchaos@gmail.com">alchemisingchaos@gmail.com</a>.
        Please include your order number if you have one.
      </p>
    </PolicyPage>
  )
}
