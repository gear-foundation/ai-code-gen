import { AISection } from "@/components/home/ui/AISection"
import { SectionAbout } from "@/components/home/ui/section-about"
import { SectionCta } from "@/components/home/ui/section-cta"
import { SectionHero } from "@/components/home/ui/section-hero"

export function Home() {
  return (
    <>
      <SectionHero />
      <div className="container grow space-y-25 py-25 md:space-y-50 md:pt-37.5 md:pb-50">
        <SectionAbout />
        <SectionCta />
        <AISection />
      </div>
    </>
  )
}
