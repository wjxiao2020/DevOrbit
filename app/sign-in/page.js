'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Firebase imports
import { auth } from '../firebase/config';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';

// MUI imports
import { Alert, Box,  Button, CircularProgress, Typography, TextField} from '@mui/material';

const SignIn = () => {
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
    return router.push('/chat');
  }


  const handleSignIn = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setEmail('');
        setPassword('');
        const user = userCredential.user;
        console.log('User signed in:', user);
        router.push('/chat'); 
      })
      .catch((error) => {
        setError('Invalid email or incorrect password!'); 
        console.error(error.code);
        console.error(error.message);
      });
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('User signed in with Google:', user);
        router.push('/chat');
      })
      .catch((error) => {
        setError(error.message);
        console.error('Google Sign-In error:', error);
      });
  };

  const handleSignUpRedirect = () => {
    router.push('/sign-up');
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
        Sign In
      </Typography>
      <Button variant="contained" 
        color="primary" 
        sx={{
          marginTop: 2,
          paddingX: 4,
        }}
        onClick={handleGoogleSignIn}
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
        color="primary" 
        onClick={handleSignIn}
        sx={{
          marginTop: 2,
          paddingX: 4,
        }}
      >
        Sign In
      </Button>
      <Typography 
        variant="body2" 
        sx={{ 
          marginTop: 2, 
          textAlign: 'center' 
        }}
      >
        Don&apos;t have an account?{' '}
        <Button 
          variant="text" 
          color="primary" 
          sx={{ textTransform: 'none', padding: 0 }}
          onClick={handleSignUpRedirect}
        >
          Sign Up
        </Button>
      </Typography>
    </Box>
  );
}

export default SignIn;
