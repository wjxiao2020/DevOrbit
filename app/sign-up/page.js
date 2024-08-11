'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

//firebase imports
import { auth } from '../firebase/config';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';

//mui imports
import { Alert, Box, Button, CircularProgress, Typography, TextField } from '@mui/material';

const SignUp = () => {

  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const router = useRouter();
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
  if (user) {
    return router.push('/');
  }


  const handleGoogleSignUp = async () => {
    const provider = await new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log('User signed in:', user);
        router.push('/');
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        setError(error.message);
      });
  };

  const handleSignUp = async () => {
    // Call the Firebase Auth API to create a new user
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setEmail('');
        setPassword(''); 
        const user = userCredential.user;
        console.log('User signed up:', user);
        router.push('/sign-in');
      })
      .catch((error) => {
        console.error(error.code);
        console.error(error.message);
        setError(error.message);
      });
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        margin: '0 auto',
        marginTop: 8,
        maxWidth: 400,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{
          textAlign: 'center',
          color: 'primary.main',
        }}
      >
        Sign Up
      </Typography>
      <Button variant="contained" 
        color="primary" 
        sx={{
          marginTop: 2,
          paddingX: 4,
        }}
        onClick={handleGoogleSignUp}
        >
          Sign in With Google
      </Button>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          marginBottom: 2,
        }}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          marginBottom: 2,
        }}
      />
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleSignUp}
        sx={{
          marginTop: 2,
          paddingX: 4,
        }}
      >
        Sign Up
      </Button>
    </Box>
  );
}

export default SignUp;