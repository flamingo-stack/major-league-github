import React from 'react';
import {
    Box,
    Card,
    Grid,
} from '@mui/material';
import { ContributorsTableProps } from '../types';
import { ContributorInfo } from './ContributorInfo';
import { LocationInfo } from './LocationInfo';
import { StatsDisplay } from './StatsDisplay';

export const MobileView: React.FC<ContributorsTableProps> = ({ contributors }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {contributors.map((contributor, index) => (
                <Card
                    key={contributor.login}
                    sx={{
                        bgcolor: 'transparent',
                        border: '1px solid #21262d',
                        borderRadius: '0.75rem',
                        p: 2.5,
                    }}
                >
                    <Box sx={{ mb: 2 }}>
                        <ContributorInfo contributor={contributor} index={index} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <LocationInfo contributor={contributor} />
                    </Box>
                    <Grid container spacing={1.5}>
                        <StatsDisplay contributor={contributor} />
                    </Grid>
                </Card>
            ))}
        </Box>
    );
}; 