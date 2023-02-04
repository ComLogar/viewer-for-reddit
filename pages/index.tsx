import {createStyles} from '@mantine/core'
import BackToTop from '~/components/BackToTop'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import Meta from '~/components/Meta'
import Results from '~/components/Results'
import Search from '~/components/Search'

const useStyles = createStyles((theme) => ({
  container: {
    margin: '0 auto',
    maxWidth: theme.breakpoints.xl,
    padding: `0 ${theme.spacing.xl}px`,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: theme.spacing.xl
    },

    '& > *': {
      marginBottom: theme.spacing.xl,
      marginTop: theme.spacing.xl
    }
  },

  search: {
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl
  },

  main: {
    minHeight: '100vh'
  }
}))

/**
 * Homepage component.
 */
export default function Homepage() {
  const {classes} = useStyles()

  return (
    <>
      <Meta />
      <div className={classes.container}>
        <Header />
        <main className={classes.main}>
          <div className={classes.search}>
            <Search />
          </div>
          <Results />
        </main>
        <Footer />
      </div>
      <BackToTop />
    </>
  )
}
