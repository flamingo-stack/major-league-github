import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Typography,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import UpdateIcon from '@mui/icons-material/Update';
import { ContributorsTableProps } from '../types';
import { ContributorInfo } from './ContributorInfo';
import { LocationInfo } from './LocationInfo';
import { formatNumber } from '../utils';

export const TableView: React.FC<ContributorsTableProps> = ({ contributors }) => {
    const columns = [
        { 
            id: 'contributor',
            label: 'Contributor',
            width: '30%',
            align: 'left' as const
        },
        { 
            id: 'location',
            label: 'Location',
            width: '25%',
            align: 'left' as const
        },
        { 
            id: 'score',
            label: 'Score',
            icon: <EmojiEventsIcon sx={{ fontSize: 16 }} />,
            width: '10%',
            align: 'right' as const
        },
        { 
            id: 'activity',
            label: 'Activity',
            icon: <CodeIcon sx={{ fontSize: 16 }} />,
            secondaryIcon: <ListAltIcon sx={{ fontSize: 16 }} />,
            width: '15%',
            align: 'right' as const
        },
        { 
            id: 'engagement',
            label: 'Engagement',
            icon: <StarIcon sx={{ fontSize: 16 }} />,
            secondaryIcon: <ForkRightIcon sx={{ fontSize: 16 }} />,
            width: '10%',
            align: 'right' as const
        },
        { 
            id: 'lastActive',
            label: 'Last Active',
            icon: <UpdateIcon sx={{ fontSize: 16 }} />,
            width: '10%',
            align: 'right' as const
        }
    ];

    const StatPill = ({ children }: { children: React.ReactNode }) => (
        <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            bgcolor: '#161b22',
            borderRadius: '2rem',
            py: 0.75,
            px: 1.5,
        }}>
            {children}
        </Box>
    );

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                width={column.width}
                                sx={{
                                    borderBottom: '1px solid',
                                    borderColor: '#21262d',
                                    color: '#7d8590',
                                    py: 1.5,
                                }}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    justifyContent: column.align === 'right' ? 'flex-end' : 'flex-start',
                                }}>
                                    {column.icon}
                                    {column.secondaryIcon && (
                                        <Box component="span" sx={{ mx: 0.5, fontSize: '0.75rem' }}>•</Box>
                                    )}
                                    {column.secondaryIcon}
                                    <Typography variant="body2" component="span">
                                        {column.label}
                                    </Typography>
                                </Box>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contributors.map((contributor, index) => (
                        <TableRow
                            key={contributor.login}
                            sx={{
                                '&:hover': {
                                    bgcolor: 'rgba(177, 186, 196, 0.08)'
                                }
                            }}
                        >
                            <TableCell sx={{ borderBottom: '1px solid #21262d' }}>
                                <ContributorInfo contributor={contributor} index={index} />
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #21262d' }}>
                                <LocationInfo contributor={contributor} />
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: '1px solid #21262d' }}>
                                <StatPill>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <EmojiEventsIcon sx={{ fontSize: 16, color: '#7d8590' }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#e6edf3' }}>
                                            {formatNumber(contributor.score)}
                                        </Typography>
                                    </Box>
                                </StatPill>
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: '1px solid #21262d' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <StatPill>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <CodeIcon sx={{ fontSize: 16, color: '#7d8590' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#e6edf3' }}>
                                                {formatNumber(contributor.totalCommits)}
                                            </Typography>
                                        </Box>
                                    </StatPill>
                                    <StatPill>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <ListAltIcon sx={{ fontSize: 16, color: '#7d8590' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#e6edf3' }}>
                                                {contributor.javaRepos}
                                            </Typography>
                                        </Box>
                                    </StatPill>
                                </Box>
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: '1px solid #21262d' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <StatPill>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <StarIcon sx={{ fontSize: 16, color: '#7d8590' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#e6edf3' }}>
                                                {formatNumber(contributor.starsReceived)}
                                            </Typography>
                                        </Box>
                                    </StatPill>
                                    <StatPill>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <ForkRightIcon sx={{ fontSize: 16, color: '#7d8590' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#e6edf3' }}>
                                                {formatNumber(contributor.forksReceived)}
                                            </Typography>
                                        </Box>
                                    </StatPill>
                                </Box>
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: '1px solid #21262d' }}>
                                <StatPill>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <UpdateIcon sx={{ fontSize: 16, color: '#7d8590' }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#e6edf3' }}>
                                            {new Date(contributor.latestCommitDate).toLocaleDateString('en-US', {
                                                month: 'numeric',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }).replace(/\//g, '/')}
                                        </Typography>
                                    </Box>
                                </StatPill>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}; 