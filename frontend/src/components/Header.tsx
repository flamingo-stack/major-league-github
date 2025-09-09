import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { Box, Typography, Link, IconButton, Container } from '@mui/material';
import { LightMode, DarkMode, GitHub } from '@mui/icons-material';
import { Logo } from './Logo';
import { odsColors } from '@flamingo/ui-kit/styles/ods-colors';

interface HeaderProps {
    onToggleTheme: () => void;
}

const BLOG_LINK = process.env.WEBAPP_EXTRA_BUTTON_LINK || '/blog/why-we-built-mlg';
const BLOG_TEXT = process.env.WEBAPP_EXTRA_BUTTON_TEXT || 'Why MLG?';

const Header = ({ onToggleTheme }: HeaderProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDarkMode = theme.palette.mode === 'dark';

    return (
        <Box sx={{ 
            borderBottom: '1px solid',
            borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
            bgcolor: theme => theme.palette.mode === 'dark' ? odsColors.background : odsColors.grey,
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: theme => theme.palette.mode === 'dark' 
              ? '0 4px 12px rgba(0, 0, 0, 0.3)'
              : '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}>
            <Container maxWidth="xl">
                <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: { xs: 1, sm: 2 },
                    minHeight: { xs: 64, sm: 72 },
                    px: { xs: 1, sm: 1.5 }
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
                                fontSize: { xs: 24, sm: 28 },
                                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                flexShrink: 0
                            }}
                        />
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '1.1rem', sm: '1.1rem' },
                                letterSpacing: '-0.025em',
                                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
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
                        gap: { xs: 1, sm: 2 }, 
                        flexShrink: 0 
                    }}>
                        <Link
                            href={BLOG_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: 'flex',
                                '@media (max-width:450px)': {
                                    display: 'none'
                                },
                                alignItems: 'center',
                                gap: 1,
                                px: { xs: 1.5, sm: 2 },
                                py: { xs: 0.75, sm: 1 },
                                borderRadius: '6px',
                                border: '1px solid',
                                borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                                bgcolor: theme => theme.palette.mode === 'dark' ? odsColors.background : odsColors.grey,
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                                height: { xs: 32, sm: 36 },
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da',
                                    color: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da',
                                }
                            }}
                        >
                            {BLOG_TEXT}
                        </Link>
                        <Link
                            href="https://github.com/flamingo-stack/major-league-github"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: 'flex',
                                '@media (max-width:420px)': {
                                    display: 'none'
                                },
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                px: { xs: 1.5, sm: 1.5 },
                                py: { xs: 0.75, sm: 1 },
                                borderRadius: '6px',
                                border: '1px solid',
                                borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                                bgcolor: theme => theme.palette.mode === 'dark' ? odsColors.background : odsColors.grey,
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                minWidth: { xs: 32, sm: 36 },
                                height: { xs: 32, sm: 36 },
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da',
                                    color: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da',
                                }
                            }}
                        >
                            <GitHub sx={{ fontSize: '1.25rem' }} />
                        </Link>
                        <IconButton 
                            onClick={onToggleTheme}
                            size="small"
                            sx={{
                                color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                                p: 0.75,
                                '&:hover': {
                                    color: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da',
                                }
                            }}
                        >
                            {isDarkMode ? 
                                <LightMode sx={{ fontSize: '1.25rem' }} /> : 
                                <DarkMode sx={{ fontSize: '1.25rem' }} />
                            }
                        </IconButton>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Header; 