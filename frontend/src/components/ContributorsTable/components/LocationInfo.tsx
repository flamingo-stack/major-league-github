import React from 'react';
import {
    Box,
    Typography,
    Stack,
    Tooltip,
    Link,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { LocationInfoProps } from '../types';
import { LocationTooltipContent } from './tooltips/LocationTooltip';

export const LocationInfo: React.FC<LocationInfoProps> = ({ contributor }) => {
    if (!contributor.city) {
        return (
            <Typography 
                variant="body2" 
                sx={{ 
                    color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                    fontSize: { xs: '0.9375rem', sm: '0.875rem' }
                }}
            >
                No location provided
            </Typography>
        );
    }

    return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'column' },
            gap: { xs: 1, sm: 0 }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ 
                    fontSize: { xs: 18, sm: 16 }, 
                    color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                    flexShrink: 0
                }} />
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    minWidth: 0,
                    flexWrap: 'wrap'
                }}>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                            fontSize: { xs: '0.9375rem', sm: '0.875rem' },
                            fontWeight: 500
                        }}
                    >
                        {contributor.city.name}, {contributor.city.state?.code}
                    </Typography>
                    {contributor.nearestTeam && (
                        <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
                            <Typography 
                                sx={{ 
                                    color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                                    fontSize: { xs: '0.9375rem', sm: '0.875rem' }
                                }}
                            >
                                •
                            </Typography>
                            <Tooltip
                                title={<LocationTooltipContent contributor={contributor} />}
                                arrow
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
                                <Link
                                    href={contributor.nearestTeam.teamUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        '&:hover': {
                                            '.team-name': {
                                                color: theme => theme.palette.mode === 'dark' ? '#2f81f7' : '#0969da'
                                            }
                                        }
                                    }}
                                >
                                    <Box 
                                        component="img" 
                                        src={contributor.nearestTeam.logoUrl} 
                                        alt={contributor.nearestTeam.name}
                                        sx={{ 
                                            width: { xs: 18, sm: 16 },
                                            height: { xs: 18, sm: 16 },
                                            objectFit: 'contain'
                                        }}
                                    />
                                    <Typography 
                                        variant="body2" 
                                        className="team-name"
                                        sx={{ 
                                            color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                                            fontSize: { xs: '0.9375rem', sm: '0.875rem' }
                                        }}
                                    >
                                        {contributor.nearestTeam.name}
                                    </Typography>
                                </Link>
                            </Tooltip>
                        </Box>
                    )}
                </Box>
            </Box>
            {contributor.nearestTeam && (
                <Box sx={{ 
                    display: { xs: 'none', sm: 'block' },
                    mt: { sm: 0.5 }
                }}>
                    <Tooltip
                        title={<LocationTooltipContent contributor={contributor} />}
                        arrow
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
                        <Link
                            href={contributor.nearestTeam.teamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                '&:hover': {
                                    '.team-name': {
                                        color: theme => theme.palette.mode === 'dark' ? '#2f81f7' : '#0969da'
                                    }
                                }
                            }}
                        >
                            <Box 
                                component="img" 
                                src={contributor.nearestTeam.logoUrl} 
                                alt={contributor.nearestTeam.name}
                                sx={{ 
                                    width: { xs: 18, sm: 16 },
                                    height: { xs: 18, sm: 16 },
                                    objectFit: 'contain'
                                }}
                            />
                            <Typography 
                                variant="body2" 
                                className="team-name"
                                sx={{ 
                                    color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                                    fontSize: { xs: '0.9375rem', sm: '0.875rem' }
                                }}
                            >
                                {contributor.nearestTeam.name}
                            </Typography>
                        </Link>
                    </Tooltip>
                </Box>
            )}
        </Box>
    );
}; 