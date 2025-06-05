import ClientWrapper from '../components/ClientWrapper'
import '../styles/globals.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import StarIcon from '@mui/icons-material/Star'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientWrapper>
          <AppBar
            position="fixed"
            sx={{
              background: 'rgba(30, 27, 75, 0.95)',
              boxShadow: '0 4px 24px #a78bfa22',
              zIndex: 1201,
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="logo"
                sx={{ mr: 2 }}
              >
                <StarIcon sx={{ color: '#fde68a', fontSize: 32 }} />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  fontWeight: 700,
                  letterSpacing: 1,
                  background:
                    'linear-gradient(90deg, #a78bfa, #f472b6, #fde68a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Manifest the Universe
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  component={Link}
                  href="/public-wishes"
                  color="inherit"
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: 16,
                    color: '#e0e7ff',
                  }}
                >
                  Public Wishes
                </Button>
                <Button
                  component={Link}
                  href="/profile"
                  color="inherit"
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: 16,
                    color: '#e0e7ff',
                  }}
                >
                  Profile
                </Button>
                <form
                  action="/api/auth/signout"
                  method="POST"
                  style={{ display: 'inline' }}
                >
                  <Button
                    type="submit"
                    color="inherit"
                    sx={{
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: 16,
                      color: '#e0e7ff',
                    }}
                  >
                    Logout
                  </Button>
                </form>
              </Box>
            </Toolbar>
          </AppBar>
          <Box sx={{ pt: 8 }}>{children}</Box>
        </ClientWrapper>
      </body>
    </html>
  )
}
