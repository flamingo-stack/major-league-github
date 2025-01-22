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

export const ContributorInfo: React.FC<ContributorInfoProps> = ({ contributor, index }) => {
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
                            width: 40, 
                            height: 40,
                            borderRadius: '50%'
                        }}
                    />
                </Link>
                {index < 3 && (
                    <Typography 
                        sx={{ 
                            fontSize: '1.2rem',
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
            <Box>
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
                                    ? '0 4px 12px rgba(1, 4, 9, 0.75)'
                                    : '0 1px 6px rgba(27, 31, 36, 0.15)',
                                borderRadius: '6px',
                                p: 0,
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
                    <Box>
                        <Link 
                            href={contributor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                                color: '#e6edf3',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' },
                                display: 'block'
                            }}
                        >
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    fontWeight: 600, 
                                    mb: 0.5,
                                    color: 'inherit'
                                }}
                            >
                                {contributor.name || contributor.login}
                            </Typography>
                        </Link>
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
                                        color: '#2f81f7',
                                        fontWeight: 600
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