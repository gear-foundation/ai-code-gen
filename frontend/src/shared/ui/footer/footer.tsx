import type { PropsWithChildren } from "react"

import { DiscordIcon, GitHubIcon, MediumIcon, TelegramIcon, XIcon } from "./assets"

export const Footer = () => {
  return (
    <footer className="bg-background py-10 [clip-path:polygon(72%_5%,100%_0,100%_100%,0_100%,0_0)]">
      <div className="border-b border-foreground/5 pb-2">
        <div className="container">
          <div className="flex gap-3">
            <a href="https://x.com/VaraNetwork" className="group/link flex items-center gap-2 pr-8">
              <XIcon className="size-5 transition-colors group-hover/link:text-brand-600" /> <LinkText>X.com</LinkText>
            </a>
            <a href="https://github.com/gear-foundation" className="group/link flex items-center gap-2 pr-8">
              <GitHubIcon className="size-5 transition-colors group-hover/link:text-brand-600" />
              <LinkText>Github</LinkText>
            </a>
            <a href="https://medium.com/@VaraNetwork" className="group/link flex items-center gap-2 pr-8">
              <MediumIcon className="size-5 transition-colors group-hover/link:text-brand-600" />
              <LinkText>Medium</LinkText>
            </a>
            <a href="https://discord.com/invite/x8ZeSy6S6K" className="group/link flex items-center gap-2 pr-8">
              <DiscordIcon className="size-5 transition-colors group-hover/link:text-brand-600" />
              <LinkText>Discord</LinkText>
            </a>
            <a href="https://t.me/VaraNetwork_Global" className="group/link flex items-center gap-2 pr-8">
              <TelegramIcon className="size-5 transition-colors group-hover/link:text-brand-600" />
              <LinkText>Telegram</LinkText>
            </a>
          </div>
        </div>
      </div>
      <div className="py-12">
        <div className="container">
          <div className="flex justify-between">
            <a href="https://vara.network/education-hub" target="_blank" className="" rel="noreferrer">
              Education Hub
            </a>
            <a href="https://wiki.vara.network/" target="_blank" className="" rel="noreferrer">
              Vara Wiki
            </a>
            <a
              href="https://idea.gear-tech.io/programs?node=wss%3A%2F%2Ftestnet.vara.network"
              target="_blank"
              className=""
              rel="noreferrer"
            >
              Gear IDEA
            </a>
            <a href="https://vara.subscan.io/" target="_blank" className="" rel="noreferrer">
              Vara Explorer (Subscan)
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-foreground/5 pt-4">
        <div className="container">
          <p className="text-sm font-light opacity-80">&#xA9; 2025 Gear Foundation, Inc. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function LinkText({ children }: PropsWithChildren) {
  return <span className="text-sm font-medium text-[#58696E]">{children}</span>
}
