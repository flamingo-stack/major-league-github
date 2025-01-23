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
    Tooltip,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import UpdateIcon from '@mui/icons-material/Update';
import { Contributor } from '../../../services/api';
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
            icon: <EmojiEventsIcon sx={{ fontSize: 16, color: '#539bf5' }} />,
            width: '10%',
            align: 'right' as const
        },
        { 
            id: 'activity',
            label: 'Activity',
            icon: <CodeIcon sx={{ fontSize: 16, color: '#57ab5a' }} />,
            secondaryIcon: <ListAltIcon sx={{ fontSize: 16, color: '#57ab5a' }} />,
            width: '15%',
            align: 'right' as const
        },
        { 
            id: 'engagement',
            label: 'Engagement',
            icon: <StarIcon sx={{ fontSize: 16, color: '#daaa3f' }} />,
            secondaryIcon: <ForkRightIcon sx={{ fontSize: 16, color: '#daaa3f' }} />,
            width: '10%',
            align: 'right' as const
        },
        { 
            id: 'lastActive',
            label: 'Last Active',
            icon: <UpdateIcon sx={{ fontSize: 16, color: '#539bf5' }} />,
            width: '10%',
            align: 'right' as const
        }
    ];

    const StatPill = ({ children }: { children: React.ReactNode }) => (
        <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            bgcolor: 'rgba(13, 17, 23, 0.6)',
            borderRadius: '6px',
            py: 0.25,
            px: 0.75,
            minWidth: 0,
            height: '22px',
        }}>
            {children}
        </Box>
    );

    const ScoreTooltip = ({ contributor }: { contributor: Contributor }) => (
        <Box sx={{ p: 1.5, maxWidth: 300 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#e6edf3', mb: 1 }}>
                Score Components
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#7d8590', mb: 0.5 }}>Activity Score</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CodeIcon sx={{ fontSize: 14, color: '#57ab5a' }} />
                            <Typography sx={{ fontSize: '0.75rem', color: '#7d8590' }}>{contributor.totalCommits} commits</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StarIcon sx={{ fontSize: 14, color: '#daaa3f' }} />
                            <Typography sx={{ fontSize: '0.75rem', color: '#7d8590' }}>{contributor.starsReceived} stars received</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#7d8590', mb: 0.5 }}>Recency Multiplier</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <UpdateIcon sx={{ fontSize: 14, color: '#539bf5' }} />
                            <Typography sx={{ fontSize: '0.75rem', color: '#7d8590' }}>
                                Last commit: {new Date(contributor.latestCommitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    const ActivityTooltip = ({ contributor }: { contributor: Contributor }) => (
        <Box sx={{ p: 1.5, maxWidth: 300 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#e6edf3', mb: 1 }}>
                Activity Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon sx={{ fontSize: 14, color: '#57ab5a' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#7d8590' }}>{contributor.totalCommits} commits</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ListAltIcon sx={{ fontSize: 14, color: '#57ab5a' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#7d8590' }}>{contributor.javaRepos} Java repositories</Typography>
                </Box>
            </Box>
        </Box>
    );

    const EngagementTooltip = ({ contributor }: { contributor: Contributor }) => (
        <Box sx={{ p: 1.5, maxWidth: 300 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#e6edf3', mb: 1 }}>
                Engagement Stats
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon sx={{ fontSize: 14, color: '#daaa3f' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#7d8590' }}>
                        {contributor.starsReceived} stars received / {contributor.starsGiven || 0} given
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ForkRightIcon sx={{ fontSize: 14, color: '#daaa3f' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#7d8590' }}>
                        {contributor.forksReceived} forks received / {contributor.forksGiven || 0} given
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    const LastActivityTooltip = ({ contributor }: { contributor: Contributor }) => (
        <Box sx={{ p: 1.5, maxWidth: 300 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#e6edf3', mb: 1 }}>
                Last Activity
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <UpdateIcon sx={{ fontSize: 14, color: '#539bf5' }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#7d8590' }}>
                    Last commit: {new Date(contributor.latestCommitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <TableContainer 
            sx={{ 
                border: '1px solid #30363d',
                borderRadius: '6px',
                overflow: 'hidden'
            }}
        >
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
                                    color: '#e6edf3',
                                    py: 1.5,
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                }}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 0.75,
                                    justifyContent: column.align === 'right' ? 'flex-end' : 'flex-start',
                                    whiteSpace: 'nowrap',
                                }}>
                                    <Typography 
                                        component="span" 
                                        sx={{ 
                                            fontSize: 'inherit',
                                            fontWeight: 'inherit',
                                            color: 'inherit',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {column.label}
                                    </Typography>
                                    {column.icon && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                            {column.icon}
                                            {column.secondaryIcon && (
                                                <>
                                                    <Box component="span" sx={{ color: '#7d8590', mx: 0.25 }}>•</Box>
                                                    {column.secondaryIcon}
                                                </>
                                            )}
                                        </Box>
                                    )}
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
                            <TableCell sx={{ borderBottom: '1px solid #21262d', py: 1.5 }}>
                                <ContributorInfo contributor={contributor} index={index} />
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #21262d', py: 1.5 }}>
                                <LocationInfo contributor={contributor} />
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: '1px solid #21262d', py: 1.5, height: '57px', verticalAlign: 'middle' }}>
                                <Tooltip
                                    title={<ScoreTooltip contributor={contributor} />}
                                    placement="bottom"
                                    arrow
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: '#161b22',
                                                '& .MuiTooltip-arrow': {
                                                    color: '#161b22'
                                                },
                                                border: '1px solid #30363d',
                                                borderRadius: '6px',
                                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <EmojiEventsIcon sx={{ fontSize: 14, color: '#7d8590', flexShrink: 0 }} />
                                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#e6edf3', lineHeight: 1 }}>
                                                    {formatNumber(contributor.score)}
                                                </Typography>
                                            </Box>
                                        </StatPill>
                                    </Box>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: '1px solid #21262d', py: 1.5, height: '57px', verticalAlign: 'middle' }}>
                                <Tooltip
                                    title={<ActivityTooltip contributor={contributor} />}
                                    placement="bottom"
                                    arrow
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: '#161b22',
                                                '& .MuiTooltip-arrow': {
                                                    color: '#161b22'
                                                },
                                                border: '1px solid #30363d',
                                                borderRadius: '6px',
                                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, alignItems: 'center' }}>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <CodeIcon sx={{ fontSize: 14, color: '#7d8590', flexShrink: 0 }} />
                                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#e6edf3', lineHeight: 1 }}>
                                                    {formatNumber(contributor.totalCommits)}
                                                </Typography>
                                            </Box>
                                        </StatPill>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <ListAltIcon sx={{ fontSize: 14, color: '#7d8590', flexShrink: 0 }} />
                                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#e6edf3', lineHeight: 1 }}>
                                                    {contributor.javaRepos}
                                                </Typography>
                                            </Box>
                                        </StatPill>
                                    </Box>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: '1px solid #21262d', py: 1.5, height: '57px', verticalAlign: 'middle' }}>
                                <Tooltip
                                    title={<EngagementTooltip contributor={contributor} />}
                                    placement="bottom"
                                    arrow
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: '#161b22',
                                                '& .MuiTooltip-arrow': {
                                                    color: '#161b22'
                                                },
                                                border: '1px solid #30363d',
                                                borderRadius: '6px',
                                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, alignItems: 'center' }}>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <StarIcon sx={{ fontSize: 14, color: '#7d8590', flexShrink: 0 }} />
                                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#e6edf3', lineHeight: 1 }}>
                                                    {formatNumber(contributor.starsReceived)}
                                                </Typography>
                                            </Box>
                                        </StatPill>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <ForkRightIcon sx={{ fontSize: 14, color: '#7d8590', flexShrink: 0 }} />
                                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#e6edf3', lineHeight: 1 }}>
                                                    {formatNumber(contributor.forksReceived)}
                                                </Typography>
                                            </Box>
                                        </StatPill>
                                    </Box>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: '1px solid #21262d', py: 1.5, height: '57px', verticalAlign: 'middle' }}>
                                <Tooltip
                                    title={<LastActivityTooltip contributor={contributor} />}
                                    placement="bottom"
                                    arrow
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: '#161b22',
                                                '& .MuiTooltip-arrow': {
                                                    color: '#161b22'
                                                },
                                                border: '1px solid #30363d',
                                                borderRadius: '6px',
                                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <UpdateIcon sx={{ fontSize: 14, color: '#7d8590', flexShrink: 0 }} />
                                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#e6edf3', lineHeight: 1, whiteSpace: 'nowrap' }}>
                                                    {new Date(contributor.latestCommitDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </Typography>
                                            </Box>
                                        </StatPill>
                                    </Box>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}; 