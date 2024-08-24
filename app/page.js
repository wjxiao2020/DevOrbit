"use client";
import * as React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from '@/app/landing-page/components/AppAppBar';
import Hero from '@/app/landing-page/components/Hero';
import Highlights from '@/app/landing-page/components/Highlights';
import Features from '@/app/landing-page/components/Features';
import Footer from '@/app/landing-page/components/Footer';
import LDTheme from '@/app/landing-page/components/LDTheme';

export default function LandingPage() {
  const [mode, setMode] = React.useState('light');
  const LPtheme = createTheme(LDTheme(mode));

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Hero />
      <Box sx={{ bgcolor: 'background.default' }}>
        <Features />
        <Divider />
        <Highlights />
        <Divider />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
