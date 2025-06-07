import { AISection } from "@/components/home/ui/AISection"
import { Cards } from "@/components/home/ui/Cards"
import { Hero } from "@/components/home/ui/hero"

function Home() {
  return (
    <>
      <Hero />
      <div className="container grow space-y-50 pt-37.5 pb-50">
        <Cards />
        <div id="subtitle-ready-to-build" className="grid place-items-center gap-5">
          <h2 className="gradient-text-black mx-auto inline-block bg-gradient-to-l from-[74%] to-[76.71%] !text-[48px] leading-[1.2] !font-bold">
            Ready to build secure and scalable dApps?
          </h2>
          <p className="max-w-[720px] text-center text-lg opacity-80">
            Take advantage of AI Agents to streamline your workflows, cut down development time, and ensure robust
            security for all your smart contracts.
          </p>
        </div>
        <AISection />
      </div>
    </>
  )
}

export { Home }
