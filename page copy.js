'use client'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Box, Button, Stack, TextField } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
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

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const RecentUpload = ['chat1', 'chat2', 'chat3', 'chat4', 'chat5', 'chat6', 'chat7', 'chat8', 'chat9', 'chat10'];

export default function Home() {

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the support agent. how can I help you today?"
    },
  ])

  const [message, setMessage] = useState('')

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            DevOrbit
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box display="flex" justifyContent="center" alignItems="center" width="100%">
            <Typography variant="h6" noWrap component="div">
              Recent Uploads
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Box>
        </DrawerHeader>
        <Divider />
        <Stack width="800px" height="600px" spacing={2}>
          {RecentUpload.map((text, index) => (
            <Button key={text} variant="contained" sx={{ width: '100%' }}>
              {text}
            </Button>
          ))}

        </Stack>
        {/* <List>
          {[].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}

      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box>
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

