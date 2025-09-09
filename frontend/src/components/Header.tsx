import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';
import { GitHubIcon } from '@flamingo/ui-kit/components/icons';
import { Logo } from './Logo';
import { systemGreys } from '../styles/colors';

const BLOG_LINK = process.env.WEBAPP_EXTRA_BUTTON_LINK || 'https://www.flamingo.run/blog/major-league-github-the-open-source-talent-leaderboard';
const BLOG_TEXT = process.env.WEBAPP_EXTRA_BUTTON_TEXT || 'Why MLG?';

const Header = () => {

    return (
        <Box sx={{ 
            borderBottom: '1px solid',
            borderColor: '#30363d',
            bgcolor: systemGreys.background,
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
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
                                color: '#e6edf3',
                                flexShrink: 0
                            }}
                        />
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '1.1rem', sm: '1.1rem' },
                                letterSpacing: '-0.025em',
                                color: '#e6edf3',
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
                                borderColor: '#30363d',
                                color: '#7d8590',
                                bgcolor: systemGreys.background,
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                                height: { xs: 32, sm: 36 },
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: '#539bf5',
                                    color: '#539bf5',
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
                                borderColor: '#30363d',
                                color: '#7d8590',
                                bgcolor: systemGreys.background,
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                minWidth: { xs: 32, sm: 36 },
                                height: { xs: 32, sm: 36 },
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: '#539bf5',
                                    color: '#539bf5',
                                }
                            }}
                        >
                            <GitHubIcon width={20} height={19} />
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Header; 