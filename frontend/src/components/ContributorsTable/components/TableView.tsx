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
import { LoadingSpinner } from '../../LoadingSpinner';

export const TableView: React.FC<ContributorsTableProps> = ({ contributors, isLoading }) => {
    if (isLoading) {
        return <LoadingSpinner message="Loading contributors..." />;
    }

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
            bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(13, 17, 23, 0.6)' : '#f6f8fa',
            border: '1px solid',
            borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.25)' : 'rgba(31, 35, 40, 0.15)',
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
            <Typography sx={{ 
                fontSize: '0.875rem',
                fontWeight: 600,
                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                mb: 1 
            }}>
                Score Components
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                    <Typography sx={{ 
                        fontSize: '0.75rem',
                        color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                        mb: 0.5 
                    }}>
                        Activity Score
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CodeIcon sx={{ fontSize: 14, color: theme => theme.palette.mode === 'dark' ? '#57ab5a' : '#1a7f37' }} />
                            <Typography sx={{ 
                                fontSize: '0.75rem',
                                color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a'
                            }}>
                                {contributor.totalCommits} commits
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StarIcon sx={{ fontSize: 14, color: theme => theme.palette.mode === 'dark' ? '#daaa3f' : '#9a6700' }} />
                            <Typography sx={{ 
                                fontSize: '0.75rem',
                                color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a'
                            }}>
                                {contributor.starsReceived} stars received
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <Typography sx={{ 
                        fontSize: '0.75rem',
                        color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                        mb: 0.5 
                    }}>
                        Recency Multiplier
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <UpdateIcon sx={{ fontSize: 14, color: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da' }} />
                            <Typography sx={{ 
                                fontSize: '0.75rem',
                                color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a'
                            }}>
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
            <Typography sx={{ 
                fontSize: '0.875rem',
                fontWeight: 600,
                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                mb: 1 
            }}>
                Activity Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon sx={{ fontSize: 14, color: theme => theme.palette.mode === 'dark' ? '#57ab5a' : '#1a7f37' }} />
                    <Typography sx={{ 
                        fontSize: '0.75rem',
                        color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a'
                    }}>
                        {contributor.totalCommits} commits
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ListAltIcon sx={{ fontSize: 14, color: theme => theme.palette.mode === 'dark' ? '#57ab5a' : '#1a7f37' }} />
                    <Typography sx={{ 
                        fontSize: '0.75rem',
                        color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a'
                    }}>
                        {contributor.javaRepos} Java repositories
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    const EngagementTooltip = ({ contributor }: { contributor: Contributor }) => (
        <Box sx={{ p: 1.5, maxWidth: 300 }}>
            <Typography sx={{ 
                fontSize: '0.875rem',
                fontWeight: 600,
                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                mb: 1 
            }}>
                Engagement Stats
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon sx={{ fontSize: 14, color: theme => theme.palette.mode === 'dark' ? '#daaa3f' : '#9a6700' }} />
                    <Typography sx={{ 
                        fontSize: '0.75rem',
                        color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a'
                    }}>
                        {contributor.starsReceived} stars received / {contributor.starsGiven || 0} given
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ForkRightIcon sx={{ fontSize: 14, color: theme => theme.palette.mode === 'dark' ? '#daaa3f' : '#9a6700' }} />
                    <Typography sx={{ 
                        fontSize: '0.75rem',
                        color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a'
                    }}>
                        {contributor.forksReceived} forks received / {contributor.forksGiven || 0} given
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    const LastActivityTooltip = ({ contributor }: { contributor: Contributor }) => (
        <Box sx={{ p: 1.5, maxWidth: 300 }}>
            <Typography sx={{ 
                fontSize: '0.875rem',
                fontWeight: 600,
                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                mb: 1 
            }}>
                Last Activity
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <UpdateIcon sx={{ fontSize: 14, color: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da' }} />
                <Typography sx={{ 
                    fontSize: '0.75rem',
                    color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a'
                }}>
                    Last commit: {new Date(contributor.latestCommitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <TableContainer 
            sx={{ 
                border: '1px solid',
                borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
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
                                    borderColor: theme => theme.palette.mode === 'dark' ? '#21262d' : 'rgba(27, 31, 36, 0.15)',
                                    color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                    py: 1.5,
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    bgcolor: theme => theme.palette.mode === 'dark' ? 'transparent' : '#f6f8fa'
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
                                                    <Box component="span" sx={{ color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a', mx: 0.25 }}>•</Box>
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
                                    bgcolor: theme => theme.palette.mode === 'dark' 
                                        ? 'rgba(177, 186, 196, 0.08)' 
                                        : 'rgba(234, 238, 242, 0.5)'
                                }
                            }}
                        >
                            <TableCell sx={{ 
                                borderBottom: '1px solid',
                                borderColor: theme => theme.palette.mode === 'dark' ? '#21262d' : 'rgba(27, 31, 36, 0.15)',
                                py: 1.5 
                            }}>
                                <ContributorInfo contributor={contributor} index={index} />
                            </TableCell>
                            <TableCell sx={{ 
                                borderBottom: '1px solid',
                                borderColor: theme => theme.palette.mode === 'dark' ? '#21262d' : 'rgba(27, 31, 36, 0.15)',
                                py: 1.5 
                            }}>
                                <LocationInfo contributor={contributor} />
                            </TableCell>
                            <TableCell align="right" sx={{ 
                                borderBottom: '1px solid',
                                borderColor: theme => theme.palette.mode === 'dark' ? '#21262d' : 'rgba(27, 31, 36, 0.15)',
                                py: 1.5,
                                height: '57px',
                                verticalAlign: 'middle'
                            }}>
                                <Tooltip
                                    title={<ScoreTooltip contributor={contributor} />}
                                    placement="bottom"
                                    arrow
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                '& .MuiTooltip-arrow': {
                                                    color: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff'
                                                },
                                                border: '1px solid',
                                                borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                borderRadius: '6px',
                                                boxShadow: theme => theme.palette.mode === 'dark'
                                                    ? '0 8px 24px rgba(1, 4, 9, 0.75)'
                                                    : '0 8px 24px rgba(140, 149, 159, 0.2)'
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <EmojiEventsIcon sx={{ 
                                                    fontSize: 14,
                                                    color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                                                    flexShrink: 0 
                                                }} />
                                                <Typography sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                    lineHeight: 1
                                                }}>
                                                    {formatNumber(contributor.score)}
                                                </Typography>
                                            </Box>
                                        </StatPill>
                                    </Box>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right" sx={{ 
                                borderBottom: '1px solid',
                                borderColor: theme => theme.palette.mode === 'dark' ? '#21262d' : 'rgba(27, 31, 36, 0.15)',
                                py: 1.5,
                                height: '57px',
                                verticalAlign: 'middle'
                            }}>
                                <Tooltip
                                    title={<ActivityTooltip contributor={contributor} />}
                                    placement="bottom"
                                    arrow
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                '& .MuiTooltip-arrow': {
                                                    color: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff'
                                                },
                                                border: '1px solid',
                                                borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                borderRadius: '6px',
                                                boxShadow: theme => theme.palette.mode === 'dark'
                                                    ? '0 8px 24px rgba(1, 4, 9, 0.75)'
                                                    : '0 8px 24px rgba(140, 149, 159, 0.2)'
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, alignItems: 'center' }}>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <CodeIcon sx={{ 
                                                    fontSize: 14,
                                                    color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                                                    flexShrink: 0 
                                                }} />
                                                <Typography sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                    lineHeight: 1
                                                }}>
                                                    {formatNumber(contributor.totalCommits)}
                                                </Typography>
                                            </Box>
                                        </StatPill>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <ListAltIcon sx={{ 
                                                    fontSize: 14,
                                                    color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                                                    flexShrink: 0 
                                                }} />
                                                <Typography sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                    lineHeight: 1
                                                }}>
                                                    {contributor.javaRepos}
                                                </Typography>
                                            </Box>
                                        </StatPill>
                                    </Box>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right" sx={{ 
                                borderBottom: '1px solid',
                                borderColor: theme => theme.palette.mode === 'dark' ? '#21262d' : 'rgba(27, 31, 36, 0.15)',
                                py: 1.5,
                                height: '57px',
                                verticalAlign: 'middle'
                            }}>
                                <Tooltip
                                    title={<EngagementTooltip contributor={contributor} />}
                                    placement="bottom"
                                    arrow
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                '& .MuiTooltip-arrow': {
                                                    color: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff'
                                                },
                                                border: '1px solid',
                                                borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                borderRadius: '6px',
                                                boxShadow: theme => theme.palette.mode === 'dark'
                                                    ? '0 8px 24px rgba(1, 4, 9, 0.75)'
                                                    : '0 8px 24px rgba(140, 149, 159, 0.2)'
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, alignItems: 'center' }}>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <StarIcon sx={{ 
                                                    fontSize: 14,
                                                    color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                                                    flexShrink: 0 
                                                }} />
                                                <Typography sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                    lineHeight: 1
                                                }}>
                                                    {formatNumber(contributor.starsReceived)}
                                                </Typography>
                                            </Box>
                                        </StatPill>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <ForkRightIcon sx={{ 
                                                    fontSize: 14,
                                                    color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                                                    flexShrink: 0 
                                                }} />
                                                <Typography sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                    lineHeight: 1
                                                }}>
                                                    {formatNumber(contributor.forksReceived)}
                                                </Typography>
                                            </Box>
                                        </StatPill>
                                    </Box>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right" sx={{ 
                                borderBottom: '1px solid',
                                borderColor: theme => theme.palette.mode === 'dark' ? '#21262d' : 'rgba(27, 31, 36, 0.15)',
                                py: 1.5,
                                height: '57px',
                                verticalAlign: 'middle'
                            }}>
                                <Tooltip
                                    title={<LastActivityTooltip contributor={contributor} />}
                                    placement="bottom"
                                    arrow
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                '& .MuiTooltip-arrow': {
                                                    color: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff'
                                                },
                                                border: '1px solid',
                                                borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                borderRadius: '6px',
                                                boxShadow: theme => theme.palette.mode === 'dark'
                                                    ? '0 8px 24px rgba(1, 4, 9, 0.75)'
                                                    : '0 8px 24px rgba(140, 149, 159, 0.2)'
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <UpdateIcon sx={{ 
                                                    fontSize: 14,
                                                    color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                                                    flexShrink: 0 
                                                }} />
                                                <Typography sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                    lineHeight: 1,
                                                    whiteSpace: 'nowrap'
                                                }}>
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