import global from "./global.css?url"
import theme from "./theme.css?url"

export const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>SolStatus</title>
      <link rel="modulepreload" href="/src/client.tsx" />
      <link rel="stylesheet" href={global} />
      <link rel="stylesheet" href={theme} />
    </head>
    <body>
      {/** biome-ignore lint/nursery/useUniqueElementIds: This is a root document and will not be reused */}
      <div id="root">{children}</div>
      <script>import("/src/client.tsx")</script>
    </body>
  </html>
)
