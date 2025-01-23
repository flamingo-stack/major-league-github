import React from 'react';
import { Box, Typography, Avatar, Link } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Contributor } from '../../../../services/api';

interface TeamTooltipContentProps {
    team: NonNullable<Contributor['nearestTeam']>;
}

export const TeamTooltipContent: React.FC<TeamTooltipContentProps> = ({ team }) => (
    <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
                src={team.logoUrl}
                alt={team.name}
                sx={{ 
                    width: 48, 
                    height: 48,
                    bgcolor: 'transparent',
                    '& img': {
                        objectFit: 'contain'
                    }
                }}
            />
            <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f' }}>
                    {team.name}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: theme => theme.palette.mode === 'dark' ? 'rgba(230, 237, 243, 0.7)' : '#57606a' }}>
                    {team.city}, {team.state}
                </Typography>
            </Box>
        </Box>
        <Box sx={{ 
            color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
            opacity: theme => theme.palette.mode === 'dark' ? 0.8 : 1,
            fontSize: '0.8125rem',
            lineHeight: 1.5
        }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                <span>🏟️</span>
                <span>{team.stadium} ({team.stadiumCapacity.toLocaleString()} capacity)</span>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                <span>📅</span>
                <span>Joined MLS in {team.joinedYear}</span>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                <span>👨‍💼</span>
                <span>Head Coach: {team.headCoach}</span>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                <Link
                    href={team.teamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        color: theme => theme.palette.mode === 'dark' ? '#58a6ff' : '#0969da',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': { 
                            textDecoration: 'underline',
                            color: theme => theme.palette.mode === 'dark' ? '#58a6ff' : '#0550ae'
                        }
                    }}
                >
                    Official Website
                    <OpenInNewIcon sx={{ fontSize: '0.875rem' }} />
                </Link>
                <Link
                    href={team.wikipediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        color: theme => theme.palette.mode === 'dark' ? '#58a6ff' : '#0969da',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': { 
                            textDecoration: 'underline',
                            color: theme => theme.palette.mode === 'dark' ? '#58a6ff' : '#0550ae'
                        }
                    }}
                >
                    Wikipedia
                    <OpenInNewIcon sx={{ fontSize: '0.875rem' }} />
                </Link>
            </Box>
        </Box>
    </Box>
); 