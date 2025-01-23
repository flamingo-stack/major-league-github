import React from 'react';
import { Box, Typography, Link, Stack } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { LocationTooltipProps } from '../../types';

export const LocationTooltipContent: React.FC<LocationTooltipProps> = ({ contributor }) => {
    if (!contributor.nearestTeam) return null;

    return (
        <Box sx={{ p: 2, maxWidth: 300 }}>
            <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                        component="img"
                        src={contributor.nearestTeam.logoUrl}
                        alt={contributor.nearestTeam.name}
                        sx={{ 
                            width: 48,
                            height: 48,
                            objectFit: 'contain'
                        }}
                    />
                    <Box>
                        <Typography variant="h6" sx={{ color: '#e6edf3', fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
                            {contributor.nearestTeam.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#7d8590' }}>
                            {contributor.nearestTeam.city}, {contributor.nearestTeam.state}
                        </Typography>
                    </Box>
                </Box>

                <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '1rem', lineHeight: 1 }}>🏟️</Typography>
                        <Typography variant="body2" sx={{ color: '#7d8590' }}>
                            {contributor.nearestTeam.stadium} ({contributor.nearestTeam.stadiumCapacity.toLocaleString()} capacity)
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '1rem', lineHeight: 1 }}>📅</Typography>
                        <Typography variant="body2" sx={{ color: '#7d8590' }}>
                            Joined MLS in {contributor.nearestTeam.joinedYear}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '1rem', lineHeight: 1 }}>🏆</Typography>
                        <Typography variant="body2" sx={{ color: '#7d8590' }}>
                            Head Coach: {contributor.nearestTeam.headCoach}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={2}>
                    <Link
                        href={contributor.nearestTeam.teamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: '#2f81f7',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        Official Website
                        <OpenInNewIcon sx={{ fontSize: 14 }} />
                    </Link>
                    <Link
                        href={contributor.nearestTeam.wikipediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: '#2f81f7',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        Wikipedia
                        <OpenInNewIcon sx={{ fontSize: 14 }} />
                    </Link>
                </Stack>
            </Stack>
        </Box>
    );
}; 