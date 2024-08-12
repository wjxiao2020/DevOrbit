'use client'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {Box, Modal, Stack, Typography, TextField, Button, CircularProgress, ThemeProvider} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled, createTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { useState, useEffect, useRef } from "react";
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';  
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';  

import { useRouter } from 'next/navigation';
import {signOut} from "firebase/auth";
import { auth, firestore } from './firebase/config';
import {useAuthState} from 'react-firebase-hooks/auth';
import { collection, doc, getDoc, getDocs, setDoc, query, orderBy, limit } from "firebase/firestore";
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

export default function Home() {
  const [mode, setMode] = useState('light');
  const theme = createTheme(LDTheme(mode));  
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [currentBot, setCurrentBot] = useState('main');
  const [userId, setUserId] = useState('');
  const [bots, setBots] = useState(['main']);
  const [openNewBotForm, setOpenNewBotForm] = useState(false);
  const [botName, setBotName] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [botPrompt, setBotPrompt] = useState('');

  const endOfMessagesRef = useRef(null);

  // chat history database structure: /users/{userId}/bots/{botName}/chats/{messageId}
  const saveChatHistory = async(chatMessages) => {
    for (const message of chatMessages) {
      const userChatRef = doc(firestore, 'users', userId, 'bots', currentBot, 'chats', `message-${message.timestamp}`);
      setDoc(userChatRef, message);
    }
  }

  // bot prompt is stored in /users/{userId}/bots/{currentBot}/prompt
  const saveBotPrompt = async(botName, botDescription) => {
    const botRef = doc(firestore, 'users', userId, 'bots', botName);
    const prompt = 'Your name is ' + botName + ' and your role description is: ' + botDescription
    setBotPrompt(prompt)
    setDoc(botRef, {prompt: prompt});
  }

  const getBotPrompt = async(bot) => {
    const botRef = doc(firestore, 'users', userId, 'bots', bot);
    const botSnap = await getDoc(botRef);
    setBotPrompt(botSnap.exists() ? botSnap.data().prompt : '');
  }

  useEffect(() => {
    if (user) {
      setUserId(auth.currentUser.uid);
    }
  }, [user]);

  useEffect(() => {
    const defaultIntro = [
      {
        role: 'bot',
        content: `Hi there! I'm ${currentBot === "main"? "your bot" : currentBot}. What do you want to talk about today?`,
        timestamp: Date.now()
      },
    ];
    const fetchChatHistory = async () => {
      if (userId != '') {
        try {
          const chatRef = collection(firestore, 'users', userId, 'bots', currentBot, 'chats');
          // TODO: use limit(10) to limit the intial number of messages retrieved, retrieve more when user scroll up
          const q = query(chatRef, orderBy('timestamp'));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const existingMessages = querySnapshot.docs.map(doc => doc.data());
            setMessages(existingMessages);
          } else {
            setMessages(defaultIntro);
            saveChatHistory(defaultIntro);
          }
        } catch (error) {
          console.error("Error fetching chat history: ", error);
          // fallback
          setMessages(defaultIntro);
          saveChatHistory(defaultIntro);
        }
      }
    };

    fetchChatHistory();
  }, [userId, currentBot]);

  useEffect(() => {
    const fetchBotsList = async () => {
      try {
        // Reference to the bots collection for a specific user
        const botsCollectionRef = collection(firestore, 'users', userId, 'bots');
        
        // Fetch all documents in the bots collection
        const snapshot = await getDocs(botsCollectionRef);
    
        if (!snapshot.empty) {
          // Extract bot names from the document IDs
          const botNames = snapshot.docs.map(doc => doc.id);
          setBots(botNames)
        }
      } catch (error) {
        console.error('Error getting bot names:', error);
      }
    }
    if (userId != '') {
      fetchBotsList();
    }
  }, [userId]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  const sendMessage = async (message) => {
    setMessage('');
    const newMessages = [
      { role: 'user', content: message, timestamp: Date.now() },
      { role: 'bot', content: '' },
    ]
    setMessages((messages) => [
      ...messages,
      ...newMessages,
    ]);
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        { 
          role: "system", 
          content: botPrompt,
        },
        ...messages, 
        { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          saveChatHistory(newMessages)
          return;
        } else {
          const text = decoder.decode(value || new Int8Array(), { stream: true });
          setMessages((messages) => {
            const lastMessage = messages[messages.length - 1];
            const priorMessages = messages.slice(0, messages.length - 1);
            const updatedLastMessage = {
              ...lastMessage,
              content: lastMessage.content + text,
              timestamp: Date.now() 
            }
            newMessages[newMessages.length - 1] = updatedLastMessage;
            return [
              ...priorMessages,
              updatedLastMessage
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

  const handleOpenNewBotForm = () => {
    setOpenNewBotForm(true)
  }

  const handleCloseNewBotForm = () => {
    setOpenNewBotForm(false)
  }

  const settings = [
    {option: 'Profile', handler: handleCloseUserMenu }, 
    {option: 'Account', handler: handleCloseUserMenu }, 
    {option: 'Dashboard', handler: handleCloseUserMenu }, 
    {option: 'Logout', handler: handleSignOut }
  ];

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
              {settings.map(({option, handler}) => (
                <MenuItem key={option} onClick={handler}>
                  <Typography textAlign="center">{option}</Typography>
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
            {bots.map((bot) => (
              <Button 
                key={bot} 
                variant="contained" 
                onClick={() => {
                  setCurrentBot(bot);
                  getBotPrompt(bot);
                }} 
                sx={{ width: '100%' }}>
                {bot}
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
        mt={10}
        alignItems={'center'}
      >
      <Typography variant='h5'>{currentBot}</Typography>
      <Stack
        direction='column'
        width='800px'
        height='600px'
        border='1px solid #d6cece'
        p={2}
        spacing={3}
        // mt={10}
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
              {/* {
                message.role === 'bot' && (
                  <Typography>{currentBot}</Typography>
                )
              } */}
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
          {/* Dummy element to ensure scrolling */}
          <div ref={endOfMessagesRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label='Your message'
            fullWidth
            multiline
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            InputLabelProps={{
              style: { top: '-7px', fontSize: '0.75rem'  }, // while theme is applied
            }}
            sx={{
              height: '30px', 
              '& .MuiInputBase-root': {height: '100%'}
            }}
            onKeyDown={(k) => {
              if (k.key === 'Enter') {
                event.preventDefault();
                sendMessage(message);
              }
            }}
          />
          <Button variant="contained" onClick={sendMessage}>
            <SendRoundedIcon />
          </Button>
        </Stack>
      </Stack>
      <Button
          variant="contained" 
          color="primary"
          startIcon={<CreateRoundedIcon />}
          onClick={handleOpenNewBotForm}
        >
          Chat with a new bot
      </Button>
      </Stack>
      <Modal open={openNewBotForm} onClose={handleCloseNewBotForm}>
        <StyledPopUP 
          position='absolute' 
          top='50%' 
          left='50%' 
          width='50%'
          bgcolor='white' 
          border='1px solid ' 
          boxShadow={24} 
          display={'flex'} 
          flexDirection={'column'} 
          alignItems={'center'}
          p = {5}
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
            borderRadius: '15px'
          }}>
            <Typography variant="h6"> Create Your New Bot </Typography>
            <Stack width='100%' direction='row' spacing={2} alignItems={'center'} display={'flex'} justifyContent={'center'}>
              <Box width={200}>
                <Typography variant="p"> Bot Name : </Typography>
              </Box>
            
              <TextField
                variant='outlined'
                // fullWidth
                size="small"
                label="Name your bot"
                placeholder="Enter name here ..."
                sx={{ width: '25ch' }}
                value={botName}
                onChange={(e) => {
                  setBotName(e.target.value)
                }}
              />
            </Stack>
            <Stack width='100%' direction='row' spacing={2} alignItems={'flex-start'} display={'flex'} justifyContent={'center'}>
              <Box width={200}>
                <Typography variant="p"> Role Description : </Typography>
              </Box>
            
              <TextField
                variant='outlined'
                fullWidth
                multiline
                label="How do you want your bot to be? "
                placeholder="Enter description here ..."
                sx={{ width: '25ch' }}
                value={botDescription}
                rows={4}
                onChange={(e) => {
                  setBotDescription(e.target.value)
                }}
              />
            </Stack>
            <Button
                variant="outlined"
                color='primary'
                disabled={botName === ''}
                onClick={()=>{
                  bots.push(botName);
                  setCurrentBot(botName);
                  saveBotPrompt(botName, botDescription);
                  setBotName('');
                  setBotDescription('');
                  handleCloseNewBotForm();
                }}
              >
                Meet Your New Bot!
            </Button>
        </StyledPopUP>
      </Modal>
    </Box>
    </ThemeProvider>
  );
}

const StyledPopUP = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    width: '50vw',
  },
  [theme.breakpoints.down("md")]: {
    width: '80vw',
  },
  [theme.breakpoints.down("sm")]: {
    width: '100vw',
  }
}));
