// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Container from '@mui/material/Container';
// import Divider from '@mui/material/Divider';
// import Stack from '@mui/material/Stack';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';

// const logoStyle = {
//   width: '140px',
//   height: 'auto',
// };

// function Copyright() {
//   return (
//     <Typography variant="body2" color="text.secondary" mt={1}>
//       {'Copyright © DevOrbit '}
//       {new Date().getFullYear()}
//     </Typography>
//   );
// }

// export default function Footer() {
//   return (
//     <Container
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: { xs: 4, sm: 8 },
//         py: { xs: 8, sm: 10 },
//         textAlign: { sm: 'center', md: 'left' },
//       }}
//     >
//       <Divider sx={{ width: '100%', mb: 2 }} />
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           width: { xs: '100%', sm: '60%' },
//           gap: 2,
//         }}
//       >
//         <Typography variant="h5" fontWeight={600} sx={{fontSize: '2rem'}} >
//           Contact Us
//         </Typography>
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
//           <TextField
//             id="first-name"
//             label="First Name"
//             variant="outlined"
//             fullWidth
//             size="small"
//           />
//           <TextField
//             id="last-name"
//             label="Last Name"
//             variant="outlined"
//             fullWidth
//             size="small"
//           />
//         </Stack>
//         <TextField
//           id="message"
//           label="Message"
//           variant="outlined"
//           fullWidth
//           multiline
//           rows={4}
//           sx={{ width: '100%' }}
//         />
//         <Button variant="contained" color="primary" sx={{ mt: 2 }}>
//           Submit
//         </Button>
//       </Box>
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           pt: { xs: 4, sm: 8 },
//           width: '100%',
//           borderTop: '1px solid',
//           borderColor: 'divider',
//         }}
//       >
//         <Copyright />
//       </Box>
//     </Container>
//   );
// }

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const logoStyle = {
  width: '140px',
  height: 'auto',
};

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {'Copyright © DevOrbit '}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Divider sx={{ width: '100%', mb: 2 }} />
      <Box
        id="contact-us"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '100%', sm: '60%' },
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600} sx={{fontSize: '2rem'}} >
          Contact Us
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
          <TextField
            id="first-name"
            label="First Name"
            variant="outlined"
            fullWidth
            size="small"
          />
          <TextField
            id="last-name"
            label="Last Name"
            variant="outlined"
            fullWidth
            size="small"
          />
        </Stack>
        <TextField
          id="message"
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          sx={{ width: '100%' }}
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Copyright />
      </Box>
    </Container>
  );
}
