import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Stack
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ContributorTooltipProps } from '../../types';
import { githubToOds } from '../../../../styles/colorMappings';

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
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: githubToOds.textPrimary }}>
                        {contributor.name || contributor.login}
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: `${githubToOds.textPrimary}B3` }}>
                        {contributor.login}
                    </Typography>
                </Box>
            </Box>
            
            {contributor.city && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOnIcon sx={{ fontSize: '1rem', color: githubToOds.textMuted }} />
                    <Typography sx={{ fontSize: '0.875rem', color: githubToOds.textMuted }}>
                        {contributor.city.name}, {contributor.city.state?.code}
                    </Typography>
                </Box>
            )}

            <Box sx={{ 
                color: githubToOds.textPrimary,
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