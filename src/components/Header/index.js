import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = React.useContext(AuthContext)
  const navigate = useNavigate();
  console.log(user)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Crypto Dashboard
          </Typography>
          { user ? (
            <>
              <div>Login as {user?.email}</div>
              <Button color="inherit" onClick={logout}>Log out</Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => {navigate('/login')}}>Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
