import { HOME_PROMT_SECTION, useNavigateToAISection } from "@/helpers"
import { cn } from "@/shared/utils/cn"
import { Button } from "@gear-js/vara-ui"
import { Zap } from "lucide-react"

type Props = {
  className?: string
}

export function SectionCta({ className }: Props) {
  const { onClickToSection } = useNavigateToAISection()

  const handleLearnMore = () => {
    window.open("https://github.com/gear-foundation", "_blank")
  }

  return (
    <section id={HOME_PROMT_SECTION} className={cn("grid place-items-center gap-6", className)}>
      <h2 className="gradient-text-black mx-auto inline-block bg-gradient-to-l from-[74%] to-[76.71%] text-center text-[36px] leading-[1.2] font-bold text-balance md:text-[40px] lg:text-[48px]">
        Ready to build secure and scalable dApps?
      </h2>

      <div className="max-w-[720px] text-center text-balance opacity-80 md:text-lg">
        <p>
          Take advantage of AI Agents to streamline your workflows, cut down development time, and ensure robust
          security for all your smart contracts.
        </p>
      </div>

      <div className="mx-auto mt-6 flex w-full flex-wrap items-center justify-center gap-4">
        <Button onClick={onClickToSection} className="grow basis-50 whitespace-nowrap sm:basis-62.5 md:grow-0">
          <Zap className="h-5 w-5" />
          Start Building
        </Button>

        <Button
          onClick={handleLearnMore}
          color={"border"}
          className="grow basis-50 whitespace-nowrap sm:basis-62.5 md:grow-0"
        >
          Learn More
        </Button>
      </div>

      <div className="flex items-center gap-6 text-xs text-gray-600 md:text-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-foreground"></div>
          <span>Free to use</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-foreground"></div>
          <span>Open source</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-foreground"></div>
          <span>AI-powered</span>
        </div>
      </div>
    </section>
  )
}
