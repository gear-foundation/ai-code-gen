import { Card } from "@/shared/ui/card"

import { DataIcon, DevIcon, RobotIcon, SecurityIcon } from "../assets"

export function SectionAbout() {
  return (
    <section className="mx-auto grid auto-rows-[minmax(10rem,max-content)] gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full flex flex-col bg-foreground bg-radial-[ellipse_106.21%_97.09%_at_70.92%_92.22%] from-brand/25 to-transparent lg:col-span-1">
        <h2 className="text-2xl leading-tight font-medium text-background">
          AI Agents <br /> for Vara Network
        </h2>
      </Card>

      <Card
        className="bg-[url(@public/images/backgrounds/medium-card-background-second.svg)] bg-right bg-repeat-y lg:col-span-2"
        title="Automated React Component Creation"
        description="Rapidly generate and customize React components using AI, reducing development time and ensuring high-quality outputs."
        icon={<RobotIcon />}
      />

      <Card
        title="Smart Code Generation"
        description="Leverage AI to write optimized smart contract code, reducing development time and errors."
        icon={<DevIcon />}
        className="bg-radial-[circle_at_center] from-foreground/10 from-[1px] to-transparent to-[1px] bg-size-[1rem_1rem]"
      />

      <Card
        title="Security Audits"
        description="Automated scanning and auditing of vulnerabilities, ensuring robust and secure contracts."
        icon={<SecurityIcon />}
      />

      <Card
        title="Continuous Monitoring"
        description="Real-time performance tracking & incident alerts with AI-driven insights."
        icon={<DataIcon />}
        className="bg-[url(@public/images/backgrounds/medium-card-background-second.svg)] bg-right bg-repeat-y"
      />
    </section>
  )
}
