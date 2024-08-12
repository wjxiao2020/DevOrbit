'use client'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Box, Modal, Stack, Typography, TextField, Button, CircularProgress } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme, ThemeProvider, createTheme} from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { useState } from "react";
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useRouter } from 'next/navigation';
import { signOut } from "firebase/auth";
import { auth } from './firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import ToggleColorMode from './landing-page/components/ToggleColorMode'; // Import the ToggleColorMode component
import LDTheme from './landing-page/components/LDTheme';

import Link from 'next/link';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const RecentChats = ['chat1', 'chat2', 'chat3', 'chat4', 'chat5', 'chat6', 'chat7', 'chat8', 'chat9', 'chat10'];

const settings = ['Profile', 'Account', 'Dashboard'];


export default function Home() {
  const [mode, setMode] = useState('light');
  const theme = createTheme(LDTheme(mode));  
  // const theme = useTheme();
  // const [mode, setMode] = useState(theme.palette.mode || 'light'); // Initialize mode with the current theme mode
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  

  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hi! I'm the support agent. How can I help you today?",
      timestamp: Date.now()
    },
  ]);

  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  if (loading) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return router.push('/sign-in');
  }

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push('/sign-in');
      // router.refresh();
    }).catch((error) => {
      //TODO: Handle error
    });
  }

  const sendMessage = async () => {
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'bot', content: '' },
    ]);
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        } else {
          const text = decoder.decode(value || new Int8Array(), { stream: true });
          setMessages((messages) => {
            const lastMessage = messages[messages.length - 1];
            const priorMessages = messages.slice(0, messages.length - 1);
            return [
              ...priorMessages,
              {
                ...lastMessage,
                content: lastMessage.content + text,
              }
            ];
          });
          return reader.read().then(processText);
        }
      });
    });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <Box
      width='100vw'
      height='100vh'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      margin='0'
      padding='0'
    >
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <Link href="/landing-page" style={{ color: 'inherit', textDecoration: 'none' }}>
              DevOrbit
            </Link>
          </Typography>
          <Stack sx={{ml: 5}}>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: '1px' }} 
              startIcon={<CreateRoundedIcon />}
              onClick={() => window.location.reload()}
            >
            </Button>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <ToggleColorMode 
            mode={mode} 
            toggleColorMode={toggleColorMode}
          /> 
          <Box sx={{ flexGrow: 0 }}>
            <Button 
              variant="contained" 
              onClick={handleSignOut}
              sx={{ marginLeft: '10px', marginRight: '15px' }} //with theme
            >
              Sign Out
            </Button>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Profile" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Recent Chats
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box
          paddingTop="40px"
          width={'90%'}
          height="auto"
          justifyContent="space-between"
          alignItems="center"
          margin="0 auto"
        >
          <Stack width="auto" height="auto" spacing={2} overflow='auto'>
            {RecentChats.map((text) => (
              <Button key={text} variant="contained" sx={{ width: '100%' }}>
                {text}
              </Button>
            ))}
          </Stack>
        </Box>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
      <Stack
        direction='column'
        width='800px'
        height='700px'
        border='1px solid #d6cece'
        p={2}
        spacing={3}
        mb={8}
      >
        <Stack
          direction='column'
          spacing={2}
          flexGrow={1}
          overflow='auto'
          maxHeight='100%'
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display='flex'
              justifyContent={message.role === 'bot' ? 'flex-start' : 'flex-end'}>
              <Box
                bgcolor={message.role === 'bot' ? 'primary.main' : 'secondary.main'}
                color='white'
                borderRadius={4}
                p={2}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label='Your message'
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            InputLabelProps={{
              style: { top: '-7px', fontSize: '0.75rem'  }, // while theme is applied
            }}
            sx={{
              height: '30px', 
              '& .MuiInputBase-root': {
                height: '100%',
              },
            }}
          />
          <Button variant="contained" onClick={sendMessage}>
            <SendRoundedIcon />
          </Button>
        </Stack>
      </Stack>
    </Box>
    </ThemeProvider>
  );
}
