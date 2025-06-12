import { useNavigate } from "react-router-dom"

export const HOME_PROMT_SECTION = "ready-to-build"

export function useNavigateToAISection() {
  const navigate = useNavigate()

  const onClickToSection = () => {
    navigate(`/#${HOME_PROMT_SECTION}`)

    setTimeout(() => {
      const element = document.getElementById(HOME_PROMT_SECTION)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  return { onClickToSection }
}
