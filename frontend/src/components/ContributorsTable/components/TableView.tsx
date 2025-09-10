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
    Link
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import UpdateIcon from '@mui/icons-material/Update';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { GitHubIcon } from '@flamingo/ui-kit/components/icons';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import { Contributor } from '../../../types/api';
import { ContributorsTableProps } from '../types';
import { ContributorInfo } from './ContributorInfo';
import { LocationInfo } from './LocationInfo';
import { formatNumber } from '../utils';
import { LoadingSpinner } from '../../LoadingSpinner';
import { ErrorMessage } from '../../ErrorMessage';
import { useHiring } from '../../../hooks/useHiring';
import { formatDate, formatDateRelative } from '../../../utils/date';
import { githubToOds, shadows } from '../../../styles/colorMappings';

const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'linkedin':
            return <LinkedInIcon fontSize="small" />;
        case 'twitter':
            return <TwitterIcon fontSize="small" />;
        case 'github':
            return <GitHubIcon width={16} height={16} />;
        case 'facebook':
            return <FacebookIcon fontSize="small" />;
        case 'instagram':
            return <InstagramIcon fontSize="small" />;
        case 'email':
            return <EmailIcon fontSize="small" />;
        case 'website':
            return <LanguageIcon fontSize="small" />;
        default:
            return null;
    }
};

export const TableView: React.FC<ContributorsTableProps> = ({ contributors, isLoading, error }) => {
    const { hiringManager } = useHiring();

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
            icon: <EmojiEventsIcon sx={{ fontSize: 16, color: githubToOds.link }} />,
            width: '10%',
            align: 'right' as const
        },
        { 
            id: 'activity',
            label: 'Activity',
            icon: <CodeIcon sx={{ fontSize: 16, color: githubToOds.success }} />,
            secondaryIcon: <ListAltIcon sx={{ fontSize: 16, color: githubToOds.success }} />,
            width: '15%',
            align: 'right' as const
        },
        { 
            id: 'engagement',
            label: 'Engagement',
            icon: <StarIcon sx={{ fontSize: 16, color: githubToOds.warning }} />,
            secondaryIcon: <ForkRightIcon sx={{ fontSize: 16, color: githubToOds.warning }} />,
            width: '10%',
            align: 'right' as const
        },
        { 
            id: 'lastActive',
            label: 'Last Active',
            icon: <UpdateIcon sx={{ fontSize: 16, color: githubToOds.link }} />,
            width: '10%',
            align: 'right' as const
        }
    ];

    const StatPill = ({ children }: { children: React.ReactNode }) => (
        <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            bgcolor: `${githubToOds.bgDark}99`,
            border: '1px solid',
            borderColor: `${githubToOds.textSecondary}40`,
            borderRadius: '6px',
            py: 0.25,
            px: 0.75,
            minWidth: 0,
            height: '22px',
        }}>
            {children}
        </Box>
    );

    const ScoreTooltip = ({ contributor }: { contributor: Contributor }) => {
        const [isExpanded, setIsExpanded] = React.useState(false);

        return (
            <Box sx={{ 
                width: 320,
                '& > *': { width: '100%' }
            }}>
                <Box sx={{ p: 1.5 }}>
                    <Typography sx={{ 
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: githubToOds.textPrimary,
                        mb: 1 
                    }}>
                        Score Components
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                            <Typography sx={{ 
                                fontSize: '0.75rem',
                                color: githubToOds.textSecondary,
                                mb: 0.5 
                            }}>
                                Activity Score
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CodeIcon sx={{ fontSize: 14, color: githubToOds.success }} />
                                    <Typography sx={{ 
                                        fontSize: '0.75rem',
                                        color: githubToOds.textSecondary
                                    }}>
                                        {contributor.totalCommits} commits
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <StarIcon sx={{ fontSize: 14, color: githubToOds.warning }} />
                                    <Typography sx={{ 
                                        fontSize: '0.75rem',
                                        color: githubToOds.textSecondary
                                    }}>
                                        {contributor.starsReceived} stars received
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <Typography sx={{ 
                                fontSize: '0.75rem',
                                color: githubToOds.textSecondary,
                                mb: 0.5 
                            }}>
                                Recency Multiplier
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <UpdateIcon sx={{ fontSize: 14, color: githubToOds.link }} />
                                    <Typography sx={{ 
                                        fontSize: '0.75rem',
                                        color: githubToOds.textSecondary
                                    }}>
                                        Last active: {formatDate(contributor.lastActive)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box 
                            onClick={() => setIsExpanded(!isExpanded)}
                            sx={{ 
                                mt: 1,
                                p: 1,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                borderRadius: '6px',
                                transition: 'background-color 0.2s',
                                '&:hover': {
                                    bgcolor: `${githubToOds.textSecondary}1A`
                                }
                            }}
                        >
                            <Box sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                transform: isExpanded ? 'rotate(90deg)' : 'none',
                                transition: 'transform 0.2s',
                                color: githubToOds.link
                            }}>
                                ›
                            </Box>
                            <Typography sx={{ 
                                fontSize: '0.75rem',
                                color: githubToOds.link,
                                fontWeight: 500
                            }}>
                                {isExpanded ? 'How score is calculated?' : 'How score is calculated?'}
                            </Typography>
                        </Box>
                        {isExpanded && (
                            <Box sx={{ 
                                mt: 1,
                                p: 1.5,
                                bgcolor: `${githubToOds.bgDark}99`,
                                borderRadius: '6px',
                                border: '1px solid',
                                borderColor: `${githubToOds.textSecondary}40`,
                                width: '100%',
                                boxSizing: 'border-box'
                            }}>
                                <Typography sx={{ 
                                    fontSize: '0.75rem',
                                    color: githubToOds.textSecondary,
                                    lineHeight: 1.4,
                                    mb: 1.5
                                }}>
                                    The score reflects both the volume and recency of GitHub activity. A high score indicates both substantial contributions and recent engagement.
                                </Typography>
                                <Box sx={{ 
                                    color: githubToOds.textSecondary,
                                    fontSize: '0.75rem',
                                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace',
                                    lineHeight: 1.4
                                }}>
                                    1. Base Score = {formatNumber(contributor.totalCommits)} × {formatNumber(Math.max(contributor.starsReceived, 1))}<br/>
                                    • {formatNumber(contributor.totalCommits)} commits<br/>
                                    • {formatNumber(contributor.starsReceived)} stars received (min: 1)<br/>
                                    = {formatNumber(contributor.totalCommits * Math.max(contributor.starsReceived, 1))}<br/>
                                    <br/>
                                    2. Recency Factor:<br/>
                                    • Last active: {formatDate(contributor.lastActive)}<br/>
                                    • Multiplier: {new Date(contributor.lastActive * 1000).getFullYear() === new Date().getFullYear() ? '2.0' : '1.0'}<br/>
                                    <br/>
                                    {formatNumber(contributor.totalCommits * Math.max(contributor.starsReceived, 1))} × {new Date(contributor.lastActive * 1000).getFullYear() === new Date().getFullYear() ? '2.0' : '1.0'} = {formatNumber(contributor.score)}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        );
    };

    const ActivityTooltip = ({ contributor }: { contributor: Contributor }) => (
        <Box sx={{ p: 1.5, maxWidth: 300 }}>
            <Typography sx={{ 
                fontSize: '0.875rem',
                fontWeight: 600,
                color: githubToOds.textPrimary,
                mb: 1 
            }}>
                Activity Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon sx={{ fontSize: 14, color: githubToOds.success }} />
                    <Typography sx={{ 
                        fontSize: '0.75rem',
                        color: githubToOds.textSecondary
                    }}>
                        {contributor.totalCommits} commits
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ListAltIcon sx={{ fontSize: 14, color: githubToOds.success }} />
                    <Typography sx={{ 
                        fontSize: '0.75rem',
                        color: githubToOds.textSecondary
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
                color: githubToOds.textPrimary,
                mb: 1 
            }}>
                Engagement Stats
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon sx={{ fontSize: 14, color: githubToOds.warning }} />
                    <Typography sx={{ 
                        fontSize: '0.75rem',
                        color: githubToOds.textSecondary
                    }}>
                        {contributor.starsReceived} stars received / {contributor.starsGiven || 0} given
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ForkRightIcon sx={{ fontSize: 14, color: githubToOds.warning }} />
                    <Typography sx={{ 
                        fontSize: '0.75rem',
                        color: githubToOds.textSecondary
                    }}>
                        {contributor.forksReceived} forks received / {contributor.forksGiven || 0} given
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    const LastActivityTooltip = ({ contributor }: { contributor: Contributor }) => (
        <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Last Active: {formatDate(contributor.lastActive)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {formatDateRelative(contributor.lastActive)}
            </Typography>
        </Box>
    );

    return (
        <TableContainer 
            sx={{ 
                border: '1px solid',
                borderColor: githubToOds.border,
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
                                    borderColor: githubToOds.border,
                                    color: githubToOds.textPrimary,
                                    py: 1.5,
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    bgcolor: 'transparent'
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
                                                    <Box component="span" sx={{ color: githubToOds.textSecondary, mx: 0.25 }}>•</Box>
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
                                    bgcolor: `${githubToOds.textSecondary}14`
                                }
                            }}
                        >
                            <TableCell 
                                key={columns[0].id}
                                align={columns[0].align}
                                sx={{ 
                                    width: columns[0].width,
                                    py: 2,
                                    px: 3,
                                    borderBottom: '1px solid',
                                    borderColor: githubToOds.border,
                                    '&:first-of-type': {
                                        pl: 3
                                    },
                                    '&:last-of-type': {
                                        pr: 3
                                    }
                                }}
                            >
                                {columns[0].id === 'contributor' && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <ContributorInfo 
                                            contributor={contributor} 
                                            index={index}
                                            hiringManagerUsername={hiringManager?.socialLinks.find(link => link.platform === 'github')?.url.split('/').pop()}
                                        />
                                    </Box>
                                )}
                            </TableCell>
                            <TableCell 
                                key={columns[1].id}
                                align={columns[1].align}
                                sx={{ 
                                    width: columns[1].width,
                                    py: 2,
                                    px: 3,
                                    borderBottom: '1px solid',
                                    borderColor: githubToOds.border,
                                    '&:first-of-type': {
                                        pl: 3
                                    },
                                    '&:last-of-type': {
                                        pr: 3
                                    }
                                }}
                            >
                                {columns[1].id === 'location' && (
                                    <LocationInfo contributor={contributor} />
                                )}
                            </TableCell>
                            <TableCell align="right" sx={{ 
                                borderBottom: '1px solid',
                                borderColor: githubToOds.border,
                                py: 1.5,
                                height: '57px',
                                verticalAlign: 'middle'
                            }}>
                                <Tooltip
                                    title={<ScoreTooltip contributor={contributor} />}
                                    placement="bottom"
                                    arrow
                                    disableTouchListener={false}
                                    enterTouchDelay={0}
                                    leaveTouchDelay={3000}
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: githubToOds.bgDark,
                                                '& .MuiTooltip-arrow': {
                                                    color: githubToOds.bgDark
                                                },
                                                border: '1px solid',
                                                borderColor: githubToOds.border,
                                                borderRadius: '6px',
                                                boxShadow: `0 8px 24px ${shadows.heavy}`,
                                                p: 0,
                                                maxWidth: 'none !important'
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <EmojiEventsIcon sx={{ 
                                                    fontSize: 14,
                                                    color: githubToOds.textSecondary,
                                                    flexShrink: 0 
                                                }} />
                                                <Typography sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: githubToOds.textPrimary,
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
                                borderColor: githubToOds.border,
                                py: 1.5,
                                height: '57px',
                                verticalAlign: 'middle'
                            }}>
                                <Tooltip
                                    title={<ActivityTooltip contributor={contributor} />}
                                    placement="bottom"
                                    arrow
                                    disableTouchListener={false}
                                    enterTouchDelay={0}
                                    leaveTouchDelay={3000}
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: githubToOds.bgDark,
                                                '& .MuiTooltip-arrow': {
                                                    color: githubToOds.bgDark
                                                },
                                                border: '1px solid',
                                                borderColor: githubToOds.border,
                                                borderRadius: '6px',
                                                boxShadow: `0 8px 24px ${shadows.heavy}`
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, alignItems: 'center' }}>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <CodeIcon sx={{ 
                                                    fontSize: 14,
                                                    color: githubToOds.textSecondary,
                                                    flexShrink: 0 
                                                }} />
                                                <Typography sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: githubToOds.textPrimary,
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
                                                    color: githubToOds.textSecondary,
                                                    flexShrink: 0 
                                                }} />
                                                <Typography sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: githubToOds.textPrimary,
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
                                borderColor: githubToOds.border,
                                py: 1.5,
                                height: '57px',
                                verticalAlign: 'middle'
                            }}>
                                <Tooltip
                                    title={<EngagementTooltip contributor={contributor} />}
                                    placement="bottom"
                                    arrow
                                    disableTouchListener={false}
                                    enterTouchDelay={0}
                                    leaveTouchDelay={3000}
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: githubToOds.bgDark,
                                                '& .MuiTooltip-arrow': {
                                                    color: githubToOds.bgDark
                                                },
                                                border: '1px solid',
                                                borderColor: githubToOds.border,
                                                borderRadius: '6px',
                                                boxShadow: `0 8px 24px ${shadows.heavy}`
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, alignItems: 'center' }}>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <StarIcon sx={{ 
                                                    fontSize: 14,
                                                    color: githubToOds.textSecondary,
                                                    flexShrink: 0 
                                                }} />
                                                <Typography sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: githubToOds.textPrimary,
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
                                                    color: githubToOds.textSecondary,
                                                    flexShrink: 0 
                                                }} />
                                                <Typography sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: githubToOds.textPrimary,
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
                                borderColor: githubToOds.border,
                                py: 1.5,
                                height: '57px',
                                verticalAlign: 'middle'
                            }}>
                                <Tooltip
                                    title={<LastActivityTooltip contributor={contributor} />}
                                    placement="bottom"
                                    arrow
                                    disableTouchListener={false}
                                    enterTouchDelay={0}
                                    leaveTouchDelay={3000}
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: githubToOds.bgDark,
                                                '& .MuiTooltip-arrow': {
                                                    color: githubToOds.bgDark
                                                },
                                                border: '1px solid',
                                                borderColor: githubToOds.border,
                                                borderRadius: '6px',
                                                boxShadow: `0 8px 24px ${shadows.heavy}`
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <StatPill>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <UpdateIcon sx={{ 
                                                    fontSize: 14,
                                                    color: githubToOds.textSecondary,
                                                    flexShrink: 0 
                                                }} />
                                                <Typography sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: githubToOds.textPrimary,
                                                    lineHeight: 1,
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {formatDate(contributor.lastActive)}
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