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
import { githubToOds, shadows } from '../../../styles/colorMappings';

export const LocationInfo: React.FC<LocationInfoProps> = ({ contributor }) => {
    if (!contributor.city) {
        return (
            <Typography 
                variant="body2" 
                sx={{ 
                    color: githubToOds.textSecondary,
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
                    color: githubToOds.textSecondary,
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
                            color: githubToOds.textPrimary,
                            fontSize: '0.75rem',
                            fontWeight: 500
                        }}
                    >
                        {contributor.city.name}, {contributor.city.state?.code}
                    </Typography>
                    {contributor.nearestTeam && (
                        <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
                            <Typography 
                                sx={{ 
                                    color: githubToOds.textSecondary,
                                    fontSize: { xs: '0.9375rem', sm: '0.875rem' }
                                }}
                            >
                                •
                            </Typography>
                            <Tooltip
                                title={<LocationTooltipContent contributor={contributor} />}
                                arrow
                                disableTouchListener={false}
                                enterTouchDelay={0}
                                leaveTouchDelay={3000}
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: githubToOds.bgDark,
                                            border: '1px solid',
                                            borderColor: githubToOds.border,
                                            boxShadow: `0 8px 24px ${shadows.heavy}`,
                                            borderRadius: '6px',
                                            p: 0,
                                            '& .MuiTooltip-arrow': {
                                                color: githubToOds.border,
                                                '&::before': {
                                                    backgroundColor: githubToOds.bgDark,
                                                    border: '1px solid',
                                                    borderColor: githubToOds.border,
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
                                                color: githubToOds.linkAccent
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
                                            color: githubToOds.textSecondary,
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
                        disableTouchListener={false}
                        enterTouchDelay={0}
                        leaveTouchDelay={3000}
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    bgcolor: githubToOds.bgDark,
                                    border: '1px solid',
                                    borderColor: githubToOds.border,
                                    boxShadow: `0 8px 24px ${shadows.heavy}`,
                                    borderRadius: '6px',
                                    p: 0,
                                    '& .MuiTooltip-arrow': {
                                        color: githubToOds.border,
                                        '&::before': {
                                            backgroundColor: githubToOds.bgDark,
                                            border: '1px solid',
                                            borderColor: githubToOds.border,
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
                                        color: githubToOds.linkAccent
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
                                    color: githubToOds.textSecondary,
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