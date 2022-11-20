import { FC, useContext } from 'react';
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { UIContext } from '../../context/ui';

const menuItems: string[] = ['Inbox', 'Estarred', 'Send Email', 'Drafts'];

export const Sidebar: FC = () => {
    const { sideMenuOpen, closeSideMenu } = useContext(UIContext);

    return (
        <Drawer anchor="left" open={sideMenuOpen} onClose={closeSideMenu}>
            <Box sx={{ width: 250 }}>
                <Box sx={{ padding: '5px 10px' }}>
                    <Typography>Menu</Typography>
                </Box>

                <List>
                    {menuItems.map((menuItem, index) => (
                        <ListItemButton key={menuItem}>
                            <ListItemIcon>
                                {index % 2 ? (
                                    <InboxOutlinedIcon />
                                ) : (
                                    <EmailOutlinedIcon />
                                )}
                            </ListItemIcon>

                            <ListItemText primary={menuItem} />
                        </ListItemButton>
                    ))}
                </List>

                <Divider />

                <List>
                    {menuItems.map((menuItem, index) => (
                        <ListItem key={menuItem}>
                            <ListItemIcon>
                                {index % 2 ? (
                                    <InboxOutlinedIcon />
                                ) : (
                                    <EmailOutlinedIcon />
                                )}
                            </ListItemIcon>

                            <ListItemText primary={menuItem} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};
