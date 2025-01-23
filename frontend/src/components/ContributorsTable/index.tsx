import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { ContributorsTableProps } from './types';
import { MobileView } from './components/MobileView';
import { TableView } from './components/TableView';
import { LoadingSpinner } from '../LoadingSpinner';

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
        return <div>Error: {error.message}</div>;
    }

    if (!contributors || contributors.length === 0) {
        return <div>No contributors found</div>;
    }

    return isMobile ? (
        <MobileView contributors={contributors} isLoading={isLoading} error={error} />
    ) : (
        <TableView contributors={contributors} isLoading={isLoading} error={error} />
    );
}; 