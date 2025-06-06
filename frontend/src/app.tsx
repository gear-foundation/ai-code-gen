import { withProviders } from "@/app/hocs"
import { Routing } from "./router/AppRoutes"
import { Footer } from "@/shared/ui/Footer/Footer"
import { Header } from "@/shared/ui/Header/Header"

function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header backgroundColor="black" />
      <div className="grow">
        <Routing />
      </div>
      <Footer />
    </div>
  )
}

export const App = withProviders(Component)
