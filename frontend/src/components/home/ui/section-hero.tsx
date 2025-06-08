import { GithubMark } from "@/shared/assets/images"
import { cn } from "@/shared/utils/cn"
import { Button, buttonStyles } from "@gear-js/vara-ui"
import { useNavigate } from "react-router-dom"

export function SectionHero() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/#subtitle-ready-to-build")

    setTimeout(() => {
      const element = document.getElementById("subtitle-ready-to-build")
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  return (
    <section
      className={cn(
        "relative z-1 pt-15 pb-20 text-foreground drop-shadow-sm drop-shadow-foreground/10 filter md:pb-25",
        "before:absolute before:top-1/2 before:left-1/2 before:-z-2 before:h-full before:w-full before:-translate-x-1/2 before:-translate-y-1/2 before:bg-brand before:[clip-path:polygon(0_0,100%_0,100%_97%,82%_99%,0_99%)] md:before:[clip-path:polygon(0_0,100%_0,100%_95%,69%_97%,0_100%)]",
        "after:absolute after:top-1/2 after:left-1/2 after:-z-1 after:size-full after:-translate-x-1/2 after:-translate-y-1/2 after:bg-background after:[clip-path:polygon(0_0,100%_0,100%_97%,85%_99%,0_95%)] md:after:[clip-path:polygon(0_0,100%_0,100%_95%,69%_97%,0_91%)]"
      )}
    >
      <div className="container grid gap-10 align-top max-lg:text-center lg:grid-cols-2 lg:gap-20">
        <h1 className="text-[48px] leading-[1.2] font-bold text-balance lg:max-xl:text-[40px]">
          Ecosystem Tooling for Vara Network
        </h1>

        <div className="space-y-10">
          <div className="mx-auto max-w-150 space-y-4 text-lg lg:text-xl">
            <p>
              Discover cutting-edge development solutions, accelerate your DApp creations, and harness AI-driven
              automation for secure, efficient, and scalable Smart Contract experiences.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            <Button text="Get started" onClick={handleClick} className="grow basis-50" />

            <a
              href="https://github.com/gear-foundation"
              className={cn("grow basis-50", buttonStyles.button, buttonStyles.contrast, buttonStyles.default)}
            >
              <GithubMark className="size-6 *:fill-current" />
              Github
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
