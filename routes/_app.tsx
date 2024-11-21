import { type PageProps } from '$fresh/server.ts'
import { epochToDate } from '../lib/utils.ts'
import { formatDateYearMonth } from '../lib/utils.ts'

const tryFormatEnvDate = (key: string, div = 1): string | undefined => {
  const envVal = Deno.env.get(key)
  const asDate = envVal ? epochToDate(parseInt(envVal) / div) : undefined
  return asDate ? formatDateYearMonth(asDate) : undefined
}

export default function App({ Component }: PageProps) {
  const usageDataAsOf = tryFormatEnvDate('CANIUSE_AS_OF_EPOCH')
  // const lastDeployedAt = tryFormatEnvDate('DEPLOYED_AT', 1000)

  return (
    <html>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0' />
        <title>user-agent.info</title>

        <link rel='stylesheet' href='https://unpkg.com/@material-tailwind/html@latest/styles/material-tailwind.css' />
        <link rel='stylesheet' href='/styles.css' />

        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
          rel='stylesheet'
        />
      </head>
      <body class='inter-regular'>
        <Component />
      </body>
      <footer class='merienda-attrib flex flex-row gap-16 justify-center text-sm'>
        <span>
          Built with <span>☕️</span> and <span>🦕</span> by{' '}
          <a href='https://github.com/nonrational/user-agent.info' target='_blank' rel='noopener noreferrer'>@nonrational</a>.
          {usageDataAsOf && (
            <>
              {' '}Usage data as of {usageDataAsOf}.
            </>
          )}
        </span>

        {
          /* {deployedAt && (
          <>
            <span>|</span>
            <span className='text-sm'>
              Agent definitions as of {new Date().toLocaleDateString()}
            </span>
          </>
        )} */
        }
      </footer>
    </html>
  )
}
