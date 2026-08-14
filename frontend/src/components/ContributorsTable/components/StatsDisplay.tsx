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
import { githubToOds } from '../../../styles/colorMappings';

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ contributor }) => {
    const formatLatestCommitDate = (): string => {
        const d = contributor.latestCommitDate;
        if (!d || d.length < 3) {
            return 'N/A';
        }
        const year = Number(d[0]);
        const month = Number(d[1]) - 1;
        const day = Number(d[2]);
        const hours = d.length > 3 ? Number(d[3]) : 0;
        const minutes = d.length > 4 ? Number(d[4]) : 0;
        const date = new Date(Date.UTC(year, month, day, hours, minutes));
        if (isNaN(date.getTime())) {
            return 'N/A';
        }
        return date.toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        }).replace(/\//g, '/');
    };

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
            value: formatLatestCommitDate(),
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
                    bgcolor: githubToOds.bgDark,
                    borderRadius: '2rem',
                    py: 0.75,
                    px: 1.5,
                }}>
                    <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        color: githubToOds.textSecondary
                    }}>
                        {stat.icon}
                    </Box>
                    <Typography 
                        variant="body2"
                        sx={{ 
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: githubToOds.textPrimary
                        }}
                    >
                        {stat.value}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}; 
