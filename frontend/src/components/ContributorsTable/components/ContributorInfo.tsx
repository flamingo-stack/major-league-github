import React from 'react';
import {
    Avatar,
    Box,
    Link,
    Typography,
    Tooltip
} from '@mui/material';
import { ContributorInfoProps } from '../types';
import { ContributorTooltipContent } from './tooltips/ContributorTooltip';

interface Props extends ContributorInfoProps {
    hiringManagerUsername?: string;
}

export const ContributorInfo: React.FC<Props> = ({ contributor, index, hiringManagerUsername }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <Link 
                    href={contributor.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ display: 'flex' }}
                >
                    <Avatar
                        src={contributor.avatarUrl}
                        alt={contributor.name || contributor.login}
                        sx={{ 
                            width: { xs: 48, sm: 40 }, 
                            height: { xs: 48, sm: 40 },
                            borderRadius: '50%'
                        }}
                    />
                </Link>
                {index < 3 && (
                    <Typography 
                        sx={{ 
                            fontSize: { xs: '1.4rem', sm: '1.2rem' },
                            lineHeight: 1,
                            position: 'absolute',
                            right: -12,
                            bottom: -6
                        }}
                    >
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </Typography>
                )}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Tooltip
                    title={<ContributorTooltipContent contributor={contributor} />}
                    arrow
                    placement="bottom-start"
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                border: '1px solid',
                                borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                boxShadow: theme => theme.palette.mode === 'dark' 
                                    ? '0 8px 24px rgba(1, 4, 9, 0.75)'
                                    : '0 8px 24px rgba(140, 149, 159, 0.2)',
                                borderRadius: '6px',
                                p: 0,
                                maxWidth: 'none',
                                '& .MuiTooltip-arrow': {
                                    color: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                    '&::before': {
                                        backgroundColor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                        border: '1px solid',
                                        borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                    }
                                }
                            }
                        }
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            position: 'relative'
                        }}>
                            <Box sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                minWidth: 0,
                                flex: 1,
                                pr: { xs: '90px', sm: 0 }  // Space for mobile button
                            }}>
                                <Link 
                                    href={contributor.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ 
                                        color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                        textDecoration: 'none',
                                        '&:hover': { textDecoration: 'underline' },
                                        minWidth: 0,
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            fontWeight: 600, 
                                            mb: 0.5,
                                            color: 'inherit',
                                            fontSize: { xs: '1.1rem', sm: '1rem' },
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {contributor.name || contributor.login}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: 20,
                                            height: 20,
                                            borderRadius: '10px',
                                            bgcolor: theme => {
                                                if (theme.palette.mode === 'dark') {
                                                    if (index === 0) return 'rgba(255, 215, 0, 0.15)'
                                                    if (index === 1) return 'rgba(192, 192, 192, 0.15)'
                                                    if (index === 2) return 'rgba(205, 127, 50, 0.15)'
                                                    return 'rgba(99, 110, 123, 0.1)'
                                                } else {
                                                    if (index === 0) return 'rgba(255, 215, 0, 0.1)'
                                                    if (index === 1) return 'rgba(192, 192, 192, 0.1)'
                                                    if (index === 2) return 'rgba(205, 127, 50, 0.1)'
                                                    return 'rgba(234, 238, 242, 0.5)'
                                                }
                                            },
                                            border: '1px solid',
                                            borderColor: theme => {
                                                if (theme.palette.mode === 'dark') {
                                                    if (index === 0) return 'rgba(255, 215, 0, 0.3)'
                                                    if (index === 1) return 'rgba(192, 192, 192, 0.3)'
                                                    if (index === 2) return 'rgba(205, 127, 50, 0.3)'
                                                    return 'rgba(99, 110, 123, 0.25)'
                                                } else {
                                                    if (index === 0) return 'rgba(255, 215, 0, 0.4)'
                                                    if (index === 1) return 'rgba(192, 192, 192, 0.4)'
                                                    if (index === 2) return 'rgba(205, 127, 50, 0.4)'
                                                    return 'rgba(31, 35, 40, 0.15)'
                                                }
                                            },
                                            px: 0.75,
                                            flexShrink: 0,
                                            mb: 0.5
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                color: theme => {
                                                    if (theme.palette.mode === 'dark') {
                                                        if (index === 0) return 'rgba(255, 215, 0, 0.9)'
                                                        if (index === 1) return 'rgba(192, 192, 192, 0.9)'
                                                        if (index === 2) return 'rgba(205, 127, 50, 0.9)'
                                                        return '#7d8590'
                                                    } else {
                                                        if (index === 0) return '#856404'
                                                        if (index === 1) return '#666666'
                                                        if (index === 2) return '#8B4513'
                                                        return '#57606a'
                                                    }
                                                },
                                                lineHeight: 1
                                            }}
                                        >
                                            #{index + 1}
                                        </Typography>
                                    </Box>
                                </Link>
                            </Box>
                            {hiringManagerUsername && contributor.login === hiringManagerUsername && (
                                <Box
                                    component="button"
                                    onClick={() => {
                                        const footer = document.querySelector('[data-testid="footer"]');
                                        if (footer) {
                                            footer.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        px: 1,
                                        height: 24,
                                        border: '1px solid',
                                        borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(47, 129, 247, 0.5)' : 'rgba(9, 105, 218, 0.3)',
                                        borderRadius: '6px',
                                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(47, 129, 247, 0.1)' : 'rgba(9, 105, 218, 0.05)',
                                        color: theme => theme.palette.mode === 'dark' ? '#2f81f7' : '#0969da',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        transition: 'all 0.2s',
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                        position: { xs: 'absolute', sm: 'static' },
                                        right: { xs: 0, sm: 'auto' },
                                        top: { xs: 0, sm: 'auto' },
                                        flexShrink: 0,
                                        '&:hover': {
                                            bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(47, 129, 247, 0.2)' : 'rgba(9, 105, 218, 0.1)',
                                            borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(47, 129, 247, 0.7)' : 'rgba(9, 105, 218, 0.5)',
                                        }
                                    }}
                                >
                                    <span role="img" aria-label="rocket" style={{ fontSize: '14px' }}>🚀</span>
                                    Join my team
                                </Box>
                            )}
                        </Box>
                        {contributor.name && (
                            <Link 
                                href={contributor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: theme => theme.palette.mode === 'dark' ? '#2f81f7' : '#0969da',
                                        fontWeight: 600,
                                        fontSize: { xs: '0.9375rem', sm: '0.875rem' }
                                    }}
                                >
                                    {contributor.login}
                                </Typography>
                            </Link>
                        )}
                    </Box>
                </Tooltip>
            </Box>
        </Box>
    );
}; 