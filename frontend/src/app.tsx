import { withProviders } from "@/app/hocs"
import { Footer } from "@/shared/ui/footer"
import { Header } from "@/shared/ui/header"

import { Routing } from "./router/AppRoutes"

function Component() {
  return (
    <>
      <Header />
      <Routing />
      <Footer />
    </>
  )
}

export const App = withProviders(Component)
