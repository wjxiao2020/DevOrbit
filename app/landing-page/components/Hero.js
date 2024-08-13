import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  const handleStartNowClick = () => {
    router.push('/sign-up'); // Redirect to the sign-in page
  };

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 6, sm: 1 },
          textAlign: 'center',
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' }, alignItems: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: 'clamp(2rem, 8vw, 2.5rem)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            Elevate Every&nbsp;
            <Typography
              component="span"
              variant="inherit"
              sx={{
                fontSize: 'inherit',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              }}
            >
            Conversation
            </Typography>
            &nbsp;
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
          >
            "Unleash the power of personalized interaction. With roles tailored to your needs, 
            our AI chatbot is where conversation meets creativity—bringing your unique ideas to life."
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ width: '180px', height: '50px', fontSize: '20px' }}
              onClick={handleStartNowClick} // Call the redirect function on click
            >
              Start now
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
