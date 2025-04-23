import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: 'primary.main' }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src="https://i.pravatar.cc/40" />
            <Typography variant="subtitle1">Admin</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar>
          <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            BlogAdmin
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/dashboard">
              <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/posts">
              <ListItemIcon><ArticleIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Posts" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/add-post">
              <ListItemIcon><AddCircleOutlineIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Add Post" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/settings">
              <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 8 }}
      >
        {/* Stats */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography color="textSecondary" variant="subtitle2">Total Posts</Typography>
              <Typography variant="h5" fontWeight="bold">120</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography color="textSecondary" variant="subtitle2">Drafts</Typography>
              <Typography variant="h5" fontWeight="bold">5</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography color="textSecondary" variant="subtitle2">Visitors</Typography>
              <Typography variant="h5" fontWeight="bold">8,940</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Posts */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Recent Posts</Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {[
              { title: 'How to build a MERN stack blog 🚀', date: '2 days ago' },
              { title: 'Top 10 React Tricks 🔥', date: '5 days ago' },
              { title: 'SEO Optimization for Blogs 🌟', date: '1 week ago' },
            ].map((post, index) => (
              <Box key={index} component="li" display="flex" justifyContent="space-between" py={2} borderBottom={index !== 2 ? 1 : 0} borderColor="divider">
                <Typography>{post.title}</Typography>
                <Typography color="textSecondary" variant="body2">{post.date}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
