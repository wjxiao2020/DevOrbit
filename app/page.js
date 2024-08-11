'use client'
import Image from "next/image";
import { useState } from "react";
import {Box, Modal, Stack, Typography, TextField, Button, CircularProgress} from '@mui/material';
import { useRouter} from 'next/navigation';
import {signOut} from "firebase/auth";
import { auth } from './firebase/config';
import {useAuthState} from 'react-firebase-hooks/auth';

export default function Home() {

  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the support agent. how can I help you today?"
    },
  ])
  const [message, setMessage] = useState('')

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
      alignItems='center'>
        <Button variant="contained" onClick={handleSignOut}>Sign Out</Button>
        <Stack
          direction='column'
          width='600px'
          height='700px'
          border='1px solid black'
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
                          borderRadius={16}
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
                  label='message'
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)} />

                <Button variant="contained" onClick={sendMessage}>
                  send
                </Button>
            </Stack>
        </Stack>
    </Box>
  )
    
}
