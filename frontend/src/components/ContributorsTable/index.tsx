import React from 'react';
import { useMediaQuery, useTheme, Box } from '@mui/material';
import { ContributorsTableProps } from './types';
import { MobileView } from './components/MobileView';
import { TableView } from './components/TableView';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';

export const ContributorsTable: React.FC<ContributorsTableProps> = ({
    contributors,
    isLoading,
    error
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isLoading) {
        return <LoadingSpinner message="Loading contributors..." />;
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <ErrorMessage message={error instanceof Error ? error.message : 'An unknown error occurred'} />
            </Box>
        );
    }

    if (!contributors || contributors.length === 0) {
        return (
            <Box sx={{ p: 2 }}>
                <ErrorMessage message="No contributors found" />
            </Box>
        );
    }

    return isMobile ? (
        <MobileView contributors={contributors} isLoading={isLoading} error={error} />
    ) : (
        <TableView contributors={contributors} isLoading={isLoading} error={error} />
    );
}; 