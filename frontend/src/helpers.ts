import { useNavigate } from "react-router-dom"

export const HOME_PROMT_SECTION = "ready-to-build"

export function useNavigateToAISection() {
  const navigate = useNavigate()

  const onClickToSection = () => {
    navigate(`/#${HOME_PROMT_SECTION}`)

    setTimeout(() => {
      const element = document.getElementById(HOME_PROMT_SECTION)
      if (!element) return

      const elementRect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      const canCenter = elementRect.height <= viewportHeight

      if (canCenter) {
        const offsetTop = elementRect.top + window.scrollY - (viewportHeight - elementRect.height) / 2

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      } else {
        const offsetTop = elementRect.top + window.scrollY - 80

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    }, 100)
  }

  return { onClickToSection }
}
