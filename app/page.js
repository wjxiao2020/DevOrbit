'use client'
import Image from "next/image";
import { useState } from "react";
// import { Box, Button, Stack, TextField } from '@mui/material';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Stack, TextField, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

export default function Home() {

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the support agent. how can I help you today?"
    },
  ])

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false) 
  const [auth, setAuth] = useState(true); // Add the auth state variable
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const sendMessage = async()=>{
    setMessage('')
    setMessages((messages) => [
      ...messages,
      {role: 'user', content: message},
      {role: 'assistant', content: ''},
    ])
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result;
        } else {
          const text = decoder.decode(value || new Int8Array(), {stream: true})
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
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={auth}
                onChange={handleChange}
                aria-label="login switch"
              />
            }
            label={auth ? 'Logout' : 'Login'}
          />
        </FormGroup>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Photos
            </Typography>
            {auth && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                  <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Stack
          direction='column'
          width='800px'
          height='700px'
          border='1px solid #d6cece'
          p={2}
          spacing={3}>
            <Stack
              direction='column'
              spacing={2}
              flexGrow={1}
              overflow='auto'
              maxHeight='100%'>
                {
                  messages.map((message, index) => (
                    <Box
                      key={index}
                      display='flex'
                      justifyContent={message.role === 'assistant' ? 'flex-start': 'flex-end'}>
                        <Box
                          bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                          color='white'
                          borderRadius={5}
                          p={3}>
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
                  <SendRoundedIcon/>
                </Button>
            </Stack>
        </Stack>
    </Box>
  )
    
}

