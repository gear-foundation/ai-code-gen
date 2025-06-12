import { ROUTES } from "@/app/consts"
import { Button } from "@gear-js/vara-ui"
import { useNavigate } from "react-router-dom"

import ImageBase from "../components/NotFound/assets/404.jpg"
import styles from "../components/NotFound/styles/not-found.module.scss"

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="container grid grow py-25">
      <div className="my-auto flex flex-col items-center justify-center gap-5">
        <div className="relative block aspect-[83/46] size-full max-w-[700px]">
          <img className="absolute inset-0 size-full" src={ImageBase} alt="Page Not Found" />
        </div>
        <div className={styles.header}>
          <p className="text-[48px] leading-[1.2] font-bold">Page not found</p>
        </div>
        <Button
          onClick={() => {
            navigate(ROUTES.HOME)
          }}
        >
          Back To Home
        </Button>
      </div>
    </div>
  )
}
