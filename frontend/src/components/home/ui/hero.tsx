import { GithubMark } from "@/shared/assets/images"
import { Button, buttonStyles } from "@gear-js/vara-ui"
import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"

export const Hero = () => {
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
    <div
      className={cn(
        "relative z-1 pt-15 pb-25 text-foreground",
        "before:absolute before:top-1/2 before:left-1/2 before:-z-[2] before:h-full before:w-full before:-translate-x-1/2 before:-translate-y-1/2 before:bg-brand before:[clip-path:polygon(0_0,100%_0,100%_95%,69%_97%,0_100%)]",
        "after:absolute after:top-1/2 after:left-1/2 after:-z-[1] after:h-full after:w-full after:-translate-x-1/2 after:-translate-y-1/2 after:bg-background after:[clip-path:polygon(0_0,100%_0,100%_95%,69%_97%,0_91%)]"
      )}
    >
      <div className="container grid grid-cols-2 gap-20 align-top">
        <h1 className="!text-[50px] leading-tight !font-bold text-balance">Ecosystem Tooling for Vara Network</h1>

        <div className="space-y-10">
          <div className="space-y-4 text-xl">
            <p>
              Discover cutting-edge development solutions, accelerate your DApp creations, and harness AI-driven
              automation for secure, efficient, and scalable Smart Contract experiences.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Button text="Get started" onClick={handleClick} />

            <a
              href="https://github.com/gear-foundation"
              className={cn(buttonStyles.button, buttonStyles.grey, buttonStyles.default)}
            >
              <GithubMark className="size-6 *:fill-current" />
              Github
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
