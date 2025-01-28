import React from 'react';
import { Box, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import UpdateIcon from '@mui/icons-material/Update';
import { StatsDisplayProps } from '../types';
import { formatNumber } from '../utils';

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ contributor }) => {
    const stats = [
        {
            icon: <EmojiEventsIcon sx={{ fontSize: 16 }} />,
            value: formatNumber(contributor.score),
            label: 'Score'
        },
        {
            icon: <CodeIcon sx={{ fontSize: 16 }} />,
            value: formatNumber(contributor.totalCommits),
            label: 'Commits'
        },
        {
            icon: <ListAltIcon sx={{ fontSize: 16 }} />,
            value: contributor.javaRepos,
            label: 'Java Repos'
        },
        {
            icon: <StarIcon sx={{ fontSize: 16 }} />,
            value: formatNumber(contributor.starsReceived),
            label: 'Stars'
        },
        {
            icon: <ForkRightIcon sx={{ fontSize: 16 }} />,
            value: formatNumber(contributor.forksReceived),
            label: 'Forks'
        },
        {
            icon: <UpdateIcon sx={{ fontSize: 16 }} />,
            value: new Date(Date.UTC(
                Number(contributor.latestCommitDate[0]),
                Number(contributor.latestCommitDate[1]) - 1,
                Number(contributor.latestCommitDate[2]),
                Number(contributor.latestCommitDate[3]),
                Number(contributor.latestCommitDate[4])
            )).toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
            }).replace(/\//g, '/'),
            label: 'Last Active'
        }
    ];

    return (
        <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'center'
        }}>
            {stats.map((stat, index) => (
                <Box key={stat.label} sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: '#161b22',
                    borderRadius: '2rem',
                    py: 0.75,
                    px: 1.5,
                }}>
                    <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        color: '#7d8590'
                    }}>
                        {stat.icon}
                    </Box>
                    <Typography 
                        variant="body2"
                        sx={{ 
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: '#e6edf3'
                        }}
                    >
                        {stat.value}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}; 