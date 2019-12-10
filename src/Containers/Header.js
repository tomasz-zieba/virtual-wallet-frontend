import React from 'react';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


import useStyles from '../Style';

function Header (props) {
    const classes = useStyles();
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
            [classes.appBarShift]: props.open,
            })}
        >
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={props.DrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                [classes.hide]: props.open,
                })}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h4" noWrap>
                {props.text}
            </Typography>
            </Toolbar>
        </AppBar>
      </React.Fragment>
    )
}

export default Header;