import { EXTERNAL_ROUTES } from "@/app/consts"

export const FOOTER_NAVIGATION = [
  {
    id: "discover",
    title: (
      <>
        Discover <span className="sr-only">VARA</span>
      </>
    ),
    list: [
      {
        title: "Ecosystem",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/ecosystem",
      },
      {
        title: "Tokenomics",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/network/tokenomics",
      },
      {
        title: "Network Activity",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/network",
      },
      {
        title: "News",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/news",
      },
      {
        title: "Events",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/events",
      },
    ],
  },
  {
    id: "learn",
    title: (
      <>
        Learn <span className="sr-only">about VARA</span>
      </>
    ),
    list: [
      {
        title: "Vara Wiki",
        link: EXTERNAL_ROUTES.VARA_WIKI,
      },
      {
        title: "Interactive Tutorials",
        link: "https://sails-tutorials.vara.network/",
      },
      {
        title: "Gear Whitepaper",
        link: EXTERNAL_ROUTES.GEAR_WHITEPAPER,
      },
      {
        title: "Education Hub",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/education-hub",
      },
    ],
  },
  {
    id: "build",
    title: (
      <>
        Build <span className="sr-only">with VARA</span>
      </>
    ),
    list: [
      {
        title: "Gear IDEA",
        link: "https://idea.gear-tech.io/",
      },
      {
        title: "Developer portal",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/developers",
      },
      {
        title: "Grants",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/grants",
      },
      {
        title: "Varathon",
        link: "https://varathon.io/",
      },
      {
        title: "Gear House Gaming",
        link: "https://gear-house.gear-tech.io/",
      },
    ],
  },
  {
    id: "join",
    title: (
      <>
        Join <span className="sr-only">VARA</span>
      </>
    ),
    list: [
      {
        title: "Supporters",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/supporters",
      },
      {
        title: "Join Ambassador program",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/ambassadors/apply",
      },
      {
        title: "Validators",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/validators",
      },
      {
        title: "Build with Us",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/ecosystem/submit",
      },
      {
        title: "Vara Art",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/vara-art",
      },
    ],
  },
  {
    id: "network",
    title: (
      <>
        Network <span className="sr-only">with VARA</span>
      </>
    ),
    list: [
      {
        title: "Staking",
        link: "https://wiki.vara.network/docs/staking/",
      },
      {
        title: "Vara NFT",
        link: "https://nft-showroom.vara.network/",
      },
      {
        title: "Press Kit",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/press-kit",
      },
      {
        title: "Anti-Scam",
        link: EXTERNAL_ROUTES.VARA_NETWORK + "/anti-scam-check",
      },
    ],
  },
  {
    id: "inspect",
    title: (
      <>
        Inspect <span className="sr-only">VARA</span>
      </>
    ),
    list: [
      {
        title: "Validators Dashboard",
        link: "https://validators.vara.network/",
      },
      {
        title: "Node Telemetry",
        link: "https://telemetry.rs/",
      },
      {
        title: "Vara explorer (Subscan)",
        link: "https://vara.subscan.io/",
      },
    ],
  },
]
