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
            <Typography variant="body2" color="#7d8590">
                No location provided
            </Typography>
        );
    }

    return (
        <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: '#7d8590' }} />
                <Typography variant="body2" sx={{ color: '#e6edf3' }}>
                    {contributor.city.name}, {contributor.city.state?.code}
                </Typography>
            </Box>
            {contributor.nearestTeam && (
                <Tooltip
                    title={<LocationTooltipContent contributor={contributor} />}
                    arrow
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: '#161b22',
                                border: '1px solid #30363d',
                                boxShadow: '0 4px 12px rgba(1, 4, 9, 0.75)',
                                borderRadius: '6px',
                                p: 0,
                                '& .MuiTooltip-arrow': {
                                    color: '#30363d',
                                    '&::before': {
                                        backgroundColor: '#161b22',
                                        border: '1px solid #30363d',
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
                                    color: '#2f81f7'
                                }
                            }
                        }}
                    >
                        <Box 
                            component="img" 
                            src={contributor.nearestTeam.logoUrl} 
                            alt={contributor.nearestTeam.name}
                            sx={{ 
                                width: 16,
                                height: 16,
                                objectFit: 'contain'
                            }}
                        />
                        <Typography 
                            variant="body2" 
                            className="team-name"
                            sx={{ color: '#7d8590' }}
                        >
                            {contributor.nearestTeam.name}
                        </Typography>
                    </Link>
                </Tooltip>
            )}
        </Stack>
    );
}; 