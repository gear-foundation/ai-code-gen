import type { PropsWithChildren } from "react"
import { FOOTER_NAVIGATION } from "@/shared/ui/footer.data"
import { cn } from "@/shared/utils/cn"

import { DiscordIcon, GitHubIcon, MediumIcon, TelegramIcon, XIcon } from "./footer/assets"

export const Footer = () => {
  return (
    <footer className="flex flex-col bg-background py-10 [clip-path:polygon(82%_1%,100%_0,100%_100%,0_100%,0_0)] md:pb-20 md:[clip-path:polygon(72%_5%,100%_0,100%_100%,0_100%,0_0)]">
      <div className="border-b border-foreground/5 pb-2">
        <div className="container">
          <div className="flex gap-4 pt-5 md:gap-3">
            <SocialLink href="https://x.com/VaraNetwork">
              <XIcon />
              <span className="max-md:hidden">X.com</span>
            </SocialLink>
            <SocialLink href="https://github.com/gear-foundation">
              <GitHubIcon />
              <span className="max-md:hidden">Github</span>
            </SocialLink>
            <SocialLink href="https://medium.com/@VaraNetwork">
              <MediumIcon />
              <span className="max-md:hidden">Medium</span>
            </SocialLink>
            <SocialLink href="https://discord.com/invite/x8ZeSy6S6K">
              <DiscordIcon />
              <span className="max-md:hidden">Discord</span>
            </SocialLink>
            <SocialLink href="https://t.me/VaraNetwork_Global">
              <TelegramIcon />
              <span className="max-md:hidden">Telegram</span>
            </SocialLink>
          </div>
        </div>
      </div>
      <div className="order-first py-12 md:order-none">
        <div className="container [--item-width:218px] lg:[--item-width:276px]">
          <ul className="flex flex-wrap gap-x-8 gap-y-12 *:basis-[var(--item-width)]">
            {FOOTER_NAVIGATION.map(({ id, title, list }) => (
              <li key={id} className="flex flex-col gap-3">
                <h3 className="py-1 text-[17px]/[1.3] font-bold">{title}</h3>
                <ol className="space-y-3 text-sm text-muted">
                  {list.map(({ link, title }, i) => {
                    const isExternal = link.includes("http")
                    return (
                      <li key={i}>
                        <a
                          href={link}
                          className="transition-colors hover:text-black"
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noreferrer" : undefined}
                        >
                          {title}
                        </a>
                      </li>
                    )
                  })}
                </ol>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-foreground/5 pt-4">
        <div className="container">
          <p className="text-sm font-light opacity-60">&#xA9; 2025 Gear Foundation, Inc. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ children, href, className }: PropsWithChildren<{ href: string; className?: string }>) {
  return (
    <a
      href={href}
      target="_blank"
      className={cn(
        "group/link flex items-center gap-2 py-2 text-sm leading-tight font-medium text-muted md:pr-8",
        "[&_svg]:size-5 [&_svg]:text-foreground [&_svg]:transition-colors [&_svg]:group-hover/link:text-brand-600",
        className
      )}
      rel="noreferrer"
    >
      {children}
    </a>
  )
}

function NavLink({ children, href, className }: PropsWithChildren<{ href: string; className?: string }>) {
  return (
    <a
      href={href}
      target="_blank"
      className={cn("text-sm leading-tight text-muted transition-colors hover:text-foreground", className)}
      rel="noreferrer"
    >
      {children}
    </a>
  )
}
