import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Stack
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ContributorTooltipProps } from '../../types';

export const ContributorTooltipContent: React.FC<ContributorTooltipProps> = ({ contributor }) => {
    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                    src={contributor.avatarUrl}
                    alt={contributor.name || contributor.login}
                    sx={{ width: 48, height: 48 }}
                />
                <Box>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f' }}>
                        {contributor.name || contributor.login}
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: theme => theme.palette.mode === 'dark' ? 'rgba(230, 237, 243, 0.7)' : 'rgba(36, 41, 47, 0.7)' }}>
                        {contributor.login}
                    </Typography>
                </Box>
            </Box>
            
            {contributor.city && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOnIcon sx={{ fontSize: '1rem', color: theme => theme.palette.mode === 'dark' ? '#768390' : 'rgba(36, 41, 47, 0.7)' }} />
                    <Typography sx={{ fontSize: '0.875rem', color: theme => theme.palette.mode === 'dark' ? '#768390' : 'rgba(36, 41, 47, 0.7)' }}>
                        {contributor.city.name}, {contributor.city.state?.code}
                    </Typography>
                </Box>
            )}

            <Box sx={{ 
                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                opacity: 0.8,
                fontSize: '0.8125rem',
                lineHeight: 1.5
            }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                    <span>⭐</span>
                    <span>{contributor.starsReceived.toLocaleString()} stars received</span>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                    <span>📊</span>
                    <span>{contributor.totalCommits.toLocaleString()} commits</span>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <span>💻</span>
                    <span>{contributor.javaRepos.toLocaleString()} Java repositories</span>
                </Box>
            </Box>
        </Box>
    );
}; 