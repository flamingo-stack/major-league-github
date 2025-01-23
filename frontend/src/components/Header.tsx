import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { Box, Typography, Link, IconButton, Container } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { Logo } from './Logo';

interface HeaderProps {
    onToggleTheme: () => void;
}

const Header = ({ onToggleTheme }: HeaderProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDarkMode = theme.palette.mode === 'dark';

    return (
        <Box sx={{ 
            borderBottom: 1,
            borderColor: 'divider',
            minHeight: { xs: 70, sm: 80 }
        }}>
            <Container maxWidth="lg">
                <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: { xs: 1, sm: 2 },
                    minHeight: { xs: 70, sm: 80 },
                    px: { xs: 2, sm: 3 }
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: { xs: 1, sm: 1.5 },
                        minWidth: 0,
                        flex: 1
                    }}>
                        <Logo 
                            sx={{ 
                                fontSize: { xs: 20, sm: 32 },
                                color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
                                flexShrink: 0
                            }}
                        />
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '0.9rem', sm: '1.25rem' },
                                letterSpacing: '-0.025em',
                                color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            Major League Github
                        </Typography>
                    </Box>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: { xs: 0.5, sm: 2 }, 
                        flexShrink: 0 
                    }}>
                        <Link
                            href="https://github.com/flamingo-cx/major-league-github"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                px: { xs: 1, sm: 2 },
                                py: { xs: 0.5, sm: 1 },
                                borderRadius: 1,
                                border: 1,
                                borderColor: 'divider',
                                color: 'text.secondary',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                fontSize: { xs: '0.75rem', sm: '1rem' },
                                height: { xs: 28, sm: 'auto' },
                                '&:hover': {
                                    borderColor: 'text.primary',
                                    color: 'text.primary'
                                }
                            }}
                        >
                            View on GitHub
                        </Link>
                        <IconButton 
                            onClick={onToggleTheme}
                            size={isMobile ? "small" : "medium"}
                            sx={{
                                color: 'text.secondary',
                                p: { xs: 0.5, sm: 1 },
                                '&:hover': {
                                    color: 'text.primary'
                                }
                            }}
                        >
                            {isDarkMode ? <LightMode sx={{ fontSize: { xs: 18, sm: 24 } }} /> : <DarkMode sx={{ fontSize: { xs: 18, sm: 24 } }} />}
                        </IconButton>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Header; 