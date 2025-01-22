import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Stack
} from '@mui/material';
import { ContributorTooltipProps } from '../../types';

const ContributorTooltipContent: React.FC<ContributorTooltipProps> = ({ contributor }) => {
    return (
        <Box sx={{ p: 2, maxWidth: 300 }}>
            <Stack spacing={1}>
                <Box>
                    <Typography variant="body2" sx={{ color: '#e6edf3' }}>
                        Score: {contributor.score.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7d8590' }}>
                        Based on contributions, stars, and activity
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="body2" sx={{ color: '#e6edf3' }}>
                        Total Commits: {contributor.totalCommits.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7d8590' }}>
                        Number of commits across all repositories
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="body2" sx={{ color: '#e6edf3' }}>
                        Stars Received: {contributor.starsReceived.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7d8590' }}>
                        Total stars received across all repositories
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="body2" sx={{ color: '#e6edf3' }}>
                        Java Repositories: {contributor.javaRepos.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7d8590' }}>
                        Number of repositories with Java as the primary language
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};

export { ContributorTooltipContent }; 