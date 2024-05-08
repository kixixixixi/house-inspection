import { Button } from "@/components/elements"
import { NextPage } from "next"

const Home: NextPage = () => {
  return (
    <main
      style={{
        height: "100%",
        minHeight: "100dvh",
      }}
    >
      <section
        style={{
          alignItems: "center",
          display: "flex",
          flexFlow: "column",
          height: "100%",
          justifyContent: "space-evenly",
          padding: "4rem 2rem",
        }}
      >
        <h1
          style={{
            padding: "2rem 0",
          }}
        >
          公共住宅点検アプリ
        </h1>
        <div
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <Button>新規作成</Button>
          <Button>閲覧・編集</Button>
        </div>
      </section>
    </main>
  )
}

export default Home
