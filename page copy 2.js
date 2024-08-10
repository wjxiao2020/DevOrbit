'use client'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Box, Button, Stack, TextField } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from "react";
import firestore from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


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
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const RecentChats = ['How do I find internships?', 'How can i prepare for technical interviews', 'How can i leverage my network?', 'What steps can I take to build my personal brand?', 'How can I effectively communicate my value in job interviews?', 'How can I optimize my development workflow for better productivity?','How can I get involved in the developer community?', 'What are some tips for improving system design skills?'];

export default function Home() {

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the support agent. how can I help you today?"
    },
  ])

  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        } else {
          const text = decoder.decode(value || new Int8Array(), { stream: true })
          setMessages((messages) => {
            const lastMessage = messages[messages.length - 1]
            const priorMessages = messages.slice(0, messages.length - 1)
            return [
              ...priorMessages,
              {
                ...lastMessage,
                content: lastMessage.content + text,
              }
            ]
          })
          return reader.read().then(processText)
        }
      })
    })
  }

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
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
      <CssBaseline />
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
            DevOrbit
          </Typography>
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
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" noWrap component="div">
              Recent Chats
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Box>
        </DrawerHeader>
        <Divider />
        <Box
          paddingTop="40px" // Adds a 20px gap at the top
          width={'90%'}
          height="auto"
          justifyContent="space-between"
          alignItems="center"
          margin="0 auto"
        >
          <Stack width="auto" height="auto" spacing={2} overflow='auto'>
            {RecentChats.map((text, index) => (
              <Button key={text} variant="contained" sx={{ width: '100%' }}>
                {text}
              </Button>
            ))}
          </Stack>

        </Box>

        {/* <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
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
          {
            messages.map((message, index) => (
              <Box
                key={index}
                display='flex'
                justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                <Box
                  bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                  color='white'
                  borderRadius={4}
                  p={2}>
                  {message.content}
                </Box>
              </Box>
            ))
          }
        </Stack>
        <Stack
          direction={'row'}
          spacing={2}>
          <TextField
            label='Your message'
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)} />

          <Button variant="contained" onClick={sendMessage}>
            <SendRoundedIcon />
          </Button>
        </Stack>
      </Stack>
    </Box>
  )

}

