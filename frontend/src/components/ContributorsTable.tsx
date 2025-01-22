import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Link,
    Box,
    Typography,
    CircularProgress,
    Tooltip,
    Avatar,
    Stack,
    Card,
    CardContent,
    Chip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { Contributor } from '../services/api';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import UpdateIcon from '@mui/icons-material/Update';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

interface ContributorsTableProps {
    contributors: Contributor[];
    isLoading: boolean;
    error: Error | null;
}

export const ContributorsTable: React.FC<ContributorsTableProps> = ({
    contributors,
    isLoading,
    error
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error">
                    Error loading contributors: {error.message}
                </Typography>
            </Box>
        );
    }

    if (!contributors.length) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>
                    No contributors found. Try selecting different cities or region.
                </Typography>
            </Box>
        );
    }

    if (isMobile) {
        return (
            <Stack spacing={2} sx={{ p: 1 }}>
                {contributors.map((contributor, index) => (
                    <Card 
                        key={contributor.login}
                        sx={{ 
                            border: 1,
                            borderColor: 'divider',
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: theme => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.04)'
                                    : 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Link 
                                        href={contributor.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        sx={{ display: 'flex' }}
                                    >
                                        <Avatar
                                            src={contributor.avatarUrl}
                                            alt={contributor.name}
                                            sx={{ width: 48, height: 48 }}
                                        />
                                    </Link>
                                    {index < 3 && (
                                        <Typography 
                                            sx={{ 
                                                fontSize: '1.2rem',
                                                lineHeight: 1,
                                                position: 'absolute',
                                                right: -12,
                                                bottom: -6
                                            }}
                                        >
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                        </Typography>
                                    )}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Link 
                                        href={contributor.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ 
                                            color: 'text.primary',
                                            textDecoration: 'none',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                            {contributor.name || contributor.login}
                                        </Typography>
                                    </Link>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOnIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                                            {contributor.city.name}, {contributor.city.stateId}
                                            {contributor.nearestTeam && (
                                                <>
                                                    <span>•</span>
                                                    <Box 
                                                        component="span" 
                                                        sx={{ 
                                                            display: 'inline-flex', 
                                                            alignItems: 'center', 
                                                            gap: 0.5
                                                        }}
                                                    >
                                                        <Avatar
                                                            variant="square"
                                                            src={contributor.nearestTeam.logoUrl}
                                                            alt={contributor.nearestTeam.name}
                                                            sx={{ 
                                                                width: 14, 
                                                                height: 14, 
                                                                bgcolor: 'transparent',
                                                                '& img': {
                                                                    objectFit: 'contain'
                                                                }
                                                            }}
                                                        />
                                                        {contributor.nearestTeam.name}
                                                    </Box>
                                                </>
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        px: 1.25,
                                        height: '20px',
                                        borderRadius: 1,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.1)' : '#f6f8fa',
                                        color: theme => theme.palette.mode === 'dark' ? '#adbac7' : '#24292f',
                                        border: '1px solid',
                                        borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.25)' : 'rgba(31, 35, 40, 0.15)'
                                    }}
                                >
                                    <EmojiEventsIcon sx={{ 
                                        fontSize: '0.875rem',
                                        color: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da'
                                    }} />
                                    {formatNumber(contributor.score)}
                                </Box>
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        px: 1.25,
                                        height: '20px',
                                        borderRadius: 1,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.1)' : '#f6f8fa',
                                        color: theme => theme.palette.mode === 'dark' ? '#adbac7' : '#24292f',
                                        border: '1px solid',
                                        borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.25)' : 'rgba(31, 35, 40, 0.15)'
                                    }}
                                >
                                    <CodeIcon sx={{ 
                                        fontSize: '0.875rem',
                                        color: theme => theme.palette.mode === 'dark' ? '#57ab5a' : '#1a7f37'
                                    }} />
                                    {formatNumber(contributor.totalCommits)}
                                </Box>
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        px: 1.25,
                                        height: '20px',
                                        borderRadius: 1,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.1)' : '#f6f8fa',
                                        color: theme => theme.palette.mode === 'dark' ? '#adbac7' : '#24292f',
                                        border: '1px solid',
                                        borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.25)' : 'rgba(31, 35, 40, 0.15)'
                                    }}
                                >
                                    <StorageIcon sx={{ 
                                        fontSize: '0.875rem',
                                        color: theme => theme.palette.mode === 'dark' ? '#986ee2' : '#8250df'
                                    }} />
                                    {formatNumber(contributor.javaRepos)}
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        px: 1.25,
                                        height: '20px',
                                        borderRadius: 1,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.1)' : '#f6f8fa',
                                        color: theme => theme.palette.mode === 'dark' ? '#adbac7' : '#24292f',
                                        border: '1px solid',
                                        borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.25)' : 'rgba(31, 35, 40, 0.15)'
                                    }}
                                >
                                    <StarIcon sx={{ 
                                        fontSize: '0.875rem',
                                        color: theme => theme.palette.mode === 'dark' ? '#daaa3f' : '#9a6700'
                                    }} />
                                    {formatNumber(contributor.starsReceived)}
                                </Box>
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        px: 1.25,
                                        height: '20px',
                                        borderRadius: 1,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.1)' : '#f6f8fa',
                                        color: theme => theme.palette.mode === 'dark' ? '#adbac7' : '#24292f',
                                        border: '1px solid',
                                        borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.25)' : 'rgba(31, 35, 40, 0.15)'
                                    }}
                                >
                                    <ForkRightIcon sx={{ 
                                        fontSize: '0.875rem',
                                        color: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da'
                                    }} />
                                    {formatNumber(contributor.forksReceived)}
                                </Box>
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        px: 1.25,
                                        height: '20px',
                                        borderRadius: 1,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.1)' : '#f6f8fa',
                                        color: theme => theme.palette.mode === 'dark' ? '#adbac7' : '#24292f',
                                        border: '1px solid',
                                        borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.25)' : 'rgba(31, 35, 40, 0.15)'
                                    }}
                                >
                                    <UpdateIcon sx={{ 
                                        fontSize: '0.875rem',
                                        color: theme => theme.palette.mode === 'dark' ? '#ec775c' : '#cf222e'
                                    }} />
                                    {new Date(contributor.latestCommitDate).toLocaleDateString()}
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        );
    }

    return (
        <TableContainer 
            component={Paper} 
            sx={{ 
                border: 1,
                borderColor: 'divider',
                borderRadius: '6px',
                boxShadow: 'none'
            }}
        >
            <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Contributor</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                Score
                                <EmojiEventsIcon fontSize="small" sx={{ opacity: 0.7, color: 'primary.main' }} />
                            </Box>
                        </TableCell>
                        <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                Activity
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <CodeIcon fontSize="small" sx={{ opacity: 0.7, color: 'success.main' }} />
                                    <StorageIcon fontSize="small" sx={{ opacity: 0.7, color: 'success.main' }} />
                                </Box>
                            </Box>
                        </TableCell>
                        <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                Engagement
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <StarIcon fontSize="small" sx={{ opacity: 0.7, color: 'warning.main' }} />
                                    <ForkRightIcon fontSize="small" sx={{ opacity: 0.7, color: 'warning.main' }} />
                                </Box>
                            </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                Last Active
                                <UpdateIcon fontSize="small" sx={{ opacity: 0.7, color: 'info.main' }} />
                            </Box>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contributors.map((contributor, index) => (
                        <TableRow
                            key={contributor.login}
                            sx={{ 
                                '&:last-child td, &:last-child th': { border: 0 },
                                '&:hover': {
                                    bgcolor: theme => theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.04)'
                                        : 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                        <Link 
                                            href={contributor.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            sx={{ display: 'flex' }}
                                        >
                                            <Avatar
                                                src={contributor.avatarUrl}
                                                alt={contributor.name}
                                                sx={{ 
                                                    width: 40, 
                                                    height: 40,
                                                    borderRadius: '50%'
                                                }}
                                            />
                                        </Link>
                                        {index < 3 && (
                                            <Typography 
                                                sx={{ 
                                                    fontSize: '1.2rem',
                                                    lineHeight: 1,
                                                    position: 'absolute',
                                                    right: -12,
                                                    bottom: -6
                                                }}
                                            >
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box>
                                        <Tooltip
                                            title={
                                                <Box sx={{ p: 1.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                        <Avatar
                                                            src={contributor.avatarUrl}
                                                            alt={contributor.login}
                                                            sx={{ width: 48, height: 48, borderRadius: 1 }}
                                                        />
                                                        <Box>
                                                            <Typography 
                                                                sx={{ 
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: 600,
                                                                    color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f'
                                                                }}
                                                            >
                                                                {contributor.name || contributor.login}
                                                            </Typography>
                                                            <Typography 
                                                                sx={{ 
                                                                    fontSize: '0.8125rem',
                                                                    color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                                    opacity: 0.8
                                                                }}
                                                            >
                                                                {contributor.login}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ 
                                                        color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                        opacity: 0.8,
                                                        fontSize: '0.8125rem',
                                                        lineHeight: 1.5
                                                    }}>
                                                        <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                                                            <span>📍</span>
                                                            <span>{contributor.city.name}, {contributor.city.stateId}</span>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                                                            <span>⭐</span>
                                                            <span>{contributor.starsReceived.toLocaleString()} stars received</span>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                                                            <span>📊</span>
                                                            <span>{contributor.totalCommits.toLocaleString()} commits</span>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <span>💻</span>
                                                            <span>{contributor.javaRepos.toLocaleString()} Java repositories</span>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            }
                                            arrow
                                            componentsProps={{
                                                tooltip: {
                                                    sx: {
                                                        bgcolor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                        border: '1px solid',
                                                        borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                        boxShadow: theme => theme.palette.mode === 'dark' 
                                                            ? '0 4px 12px rgba(1, 4, 9, 0.75)'
                                                            : '0 1px 6px rgba(27, 31, 36, 0.15)',
                                                        borderRadius: '6px',
                                                        '& .MuiTooltip-arrow': {
                                                            color: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                            '&::before': {
                                                                backgroundColor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                                border: '1px solid',
                                                                borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        >
                                            <Link 
                                                href={contributor.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                sx={{ 
                                                    textDecoration: 'none',
                                                    color: theme => theme.palette.mode === 'dark' ? '#58a6ff' : '#0969da',
                                                    display: 'block',
                                                    '&:hover': { 
                                                        textDecoration: 'underline',
                                                        color: theme => theme.palette.mode === 'dark' ? '#58a6ff' : '#0969da'
                                                    }
                                                }}
                                            >
                                                <Typography 
                                                    variant="body1" 
                                                    sx={{ 
                                                        fontSize: '1rem',
                                                        fontWeight: 600,
                                                        color: 'inherit'
                                                    }}
                                                >
                                                    {contributor.login}
                                                </Typography>
                                            </Link>
                                        </Tooltip>
                                        {contributor.name && (
                                            <Tooltip
                                                title={
                                                    <Box sx={{ p: 1.5 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                            <Avatar
                                                                src={contributor.avatarUrl}
                                                                alt={contributor.login}
                                                                sx={{ width: 48, height: 48, borderRadius: 1 }}
                                                            />
                                                            <Box>
                                                                <Typography 
                                                                    sx={{ 
                                                                        fontSize: '0.875rem',
                                                                        fontWeight: 600,
                                                                        color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f'
                                                                    }}
                                                                >
                                                                    {contributor.name || contributor.login}
                                                                </Typography>
                                                                <Typography 
                                                                    sx={{ 
                                                                        fontSize: '0.8125rem',
                                                                        color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                                        opacity: 0.8
                                                                    }}
                                                                >
                                                                    {contributor.login}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ 
                                                            color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                            opacity: 0.8,
                                                            fontSize: '0.8125rem',
                                                            lineHeight: 1.5
                                                        }}>
                                                            <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                                                                <span>📍</span>
                                                                <span>{contributor.city.name}, {contributor.city.stateId}</span>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                                                                <span>⭐</span>
                                                                <span>{contributor.starsReceived.toLocaleString()} stars received</span>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                                                                <span>📊</span>
                                                                <span>{contributor.totalCommits.toLocaleString()} commits</span>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <span>💻</span>
                                                                <span>{contributor.javaRepos.toLocaleString()} Java repositories</span>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                }
                                                arrow
                                                componentsProps={{
                                                    tooltip: {
                                                        sx: {
                                                            bgcolor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                            border: '1px solid',
                                                            borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                            boxShadow: theme => theme.palette.mode === 'dark' 
                                                                ? '0 4px 12px rgba(1, 4, 9, 0.75)'
                                                                : '0 1px 6px rgba(27, 31, 36, 0.15)',
                                                            borderRadius: '6px',
                                                            '& .MuiTooltip-arrow': {
                                                                color: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                                '&::before': {
                                                                    backgroundColor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                                    border: '1px solid',
                                                                    borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            >
                                                <Link
                                                    href={contributor.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    sx={{ 
                                                        textDecoration: 'none',
                                                        color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#6e7681',
                                                        display: 'block',
                                                        '&:hover': { 
                                                            textDecoration: 'underline',
                                                            color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#6e7681'
                                                        }
                                                    }}
                                                >
                                                    <Typography 
                                                        variant="body1" 
                                                        sx={{ 
                                                            fontSize: '0.875rem',
                                                            color: 'inherit',
                                                            mt: 0.5
                                                        }}
                                                    >
                                                        {contributor.name}
                                                    </Typography>
                                                </Link>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationOnIcon fontSize="small" sx={{ opacity: 0.7 }} />
                                    <Typography>{contributor.city.name}, {contributor.city.stateId}</Typography>
                                </Box>
                                {contributor.nearestTeam && (
                                    <Tooltip
                                        title={
                                            <Box sx={{ p: 1.5, width: 250 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                    <Avatar
                                                        variant="square"
                                                        src={contributor.nearestTeam.logoUrl}
                                                        alt={contributor.nearestTeam.name}
                                                        sx={{ 
                                                            width: 48, 
                                                            height: 48, 
                                                            borderRadius: 1,
                                                            bgcolor: 'transparent',
                                                            '& img': {
                                                                objectFit: 'contain'
                                                            }
                                                        }}
                                                    />
                                                    <Box>
                                                        <Typography 
                                                            sx={{ 
                                                                fontSize: '0.875rem',
                                                                fontWeight: 600,
                                                                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f'
                                                            }}
                                                        >
                                                            {contributor.nearestTeam.name}
                                                        </Typography>
                                                        <Typography 
                                                            sx={{ 
                                                                fontSize: '0.8125rem',
                                                                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                                opacity: 0.8
                                                            }}
                                                        >
                                                            {contributor.nearestTeam.city}, {contributor.nearestTeam.state}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ 
                                                    color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                    opacity: 0.8,
                                                    fontSize: '0.8125rem',
                                                    lineHeight: 1.5
                                                }}>
                                                    <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                                                        <span>🏟️</span>
                                                        <span>{contributor.nearestTeam.stadium} ({contributor.nearestTeam.stadiumCapacity.toLocaleString()} capacity)</span>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                                                        <span>📅</span>
                                                        <span>Joined MLS: {contributor.nearestTeam.joinedYear}</span>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                        <span>👨‍💼</span>
                                                        <span>Head Coach: {contributor.nearestTeam.headCoach}</span>
                                                    </Box>
                                                    <Box sx={{ mt: 1.5 }}>
                                                        <Link 
                                                            href={contributor.nearestTeam.teamUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            sx={{ 
                                                                color: theme => theme.palette.mode === 'dark' ? '#58a6ff' : '#0969da',
                                                                display: 'flex', 
                                                                alignItems: 'center', 
                                                                gap: 0.5, 
                                                                mb: 0.5,
                                                                textDecoration: 'none',
                                                                fontSize: 'inherit',
                                                                '&:hover': {
                                                                    textDecoration: 'underline'
                                                                }
                                                            }}
                                                        >
                                                            Official Website <OpenInNewIcon sx={{ fontSize: 14 }} />
                                                        </Link>
                                                        <Link 
                                                            href={contributor.nearestTeam.wikipediaUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            sx={{ 
                                                                color: theme => theme.palette.mode === 'dark' ? '#58a6ff' : '#0969da',
                                                                display: 'flex', 
                                                                alignItems: 'center', 
                                                                gap: 0.5,
                                                                textDecoration: 'none',
                                                                fontSize: 'inherit',
                                                                '&:hover': {
                                                                    textDecoration: 'underline'
                                                                }
                                                            }}
                                                        >
                                                            Wikipedia <OpenInNewIcon sx={{ fontSize: 14 }} />
                                                        </Link>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        }
                                        arrow
                                        componentsProps={{
                                            tooltip: {
                                                sx: {
                                                    bgcolor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                    border: '1px solid',
                                                    borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                    boxShadow: theme => theme.palette.mode === 'dark' 
                                                        ? '0 4px 12px rgba(1, 4, 9, 0.75)'
                                                        : '0 1px 6px rgba(27, 31, 36, 0.15)',
                                                    borderRadius: '6px',
                                                    '& .MuiTooltip-arrow': {
                                                        color: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                        '&::before': {
                                                            backgroundColor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                            border: '1px solid',
                                                            borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                            <Avatar
                                                variant="square"
                                                src={contributor.nearestTeam.logoUrl}
                                                alt={contributor.nearestTeam.name}
                                                sx={{ 
                                                    width: 20, 
                                                    height: 20, 
                                                    bgcolor: 'transparent',
                                                    borderRadius: 0.5,
                                                    '& img': {
                                                        objectFit: 'contain'
                                                    }
                                                }}
                                                onError={(e: any) => {
                                                    e.target.src = '';
                                                }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {contributor.nearestTeam.name}
                                            </Typography>
                                        </Box>
                                    </Tooltip>
                                )}
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip
                                    title={
                                        <Box sx={{ p: 1.5 }}>
                                            <Typography 
                                                sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                    mb: 1
                                                }}
                                            >
                                                Score Components
                                            </Typography>
                                            <Box sx={{ 
                                                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                opacity: 0.8,
                                                fontSize: '0.8125rem',
                                                lineHeight: 1.5
                                            }}>
                                                1. Activity Score:<br/>
                                                • {contributor.totalCommits.toLocaleString()} commits<br/>
                                                • {contributor.starsReceived.toLocaleString()} stars received<br/>
                                                <br/>
                                                2. Recency Multiplier:<br/>
                                                • Based on last commit: {new Date(contributor.latestCommitDate).toLocaleDateString()}<br/>
                                                • Range: 1.0 (year ago) to 2.0 (today)
                                            </Box>
                                        </Box>
                                    }
                                    arrow
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                border: '1px solid',
                                                borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                boxShadow: theme => theme.palette.mode === 'dark' 
                                                    ? '0 4px 12px rgba(1, 4, 9, 0.75)'
                                                    : '0 1px 6px rgba(27, 31, 36, 0.15)',
                                                borderRadius: '6px',
                                                maxWidth: 'none',
                                                '& .MuiTooltip-arrow': {
                                                    color: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                    '&::before': {
                                                        backgroundColor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                        border: '1px solid',
                                                        borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <Typography variant="body2">{formatNumber(contributor.score)}</Typography>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip 
                                    title={
                                        <Box sx={{ p: 1.5 }}>
                                            <Typography 
                                                sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                    mb: 1
                                                }}
                                            >
                                                Activity Details
                                            </Typography>
                                            <Box sx={{ 
                                                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                opacity: 0.8,
                                                fontSize: '0.8125rem',
                                                lineHeight: 1.5
                                            }}>
                                                <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                                                    <span>📊</span>
                                                    <span>{contributor.totalCommits.toLocaleString()} commits</span>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <span>💻</span>
                                                    <span>{contributor.javaRepos.toLocaleString()} Java repositories</span>
                                                </Box>
                                            </Box>
                                        </Box>
                                    } 
                                    arrow
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                border: '1px solid',
                                                borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                boxShadow: theme => theme.palette.mode === 'dark' 
                                                    ? '0 4px 12px rgba(1, 4, 9, 0.75)'
                                                    : '0 1px 6px rgba(27, 31, 36, 0.15)',
                                                borderRadius: '6px',
                                                '& .MuiTooltip-arrow': {
                                                    color: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                    '&::before': {
                                                        backgroundColor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                        border: '1px solid',
                                                        borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Typography variant="body2">{formatNumber(contributor.totalCommits)}</Typography>
                                        <Typography variant="body2">{formatNumber(contributor.javaRepos)}</Typography>
                                    </Box>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title={
                                    <Box sx={{ p: 1.5 }}>
                                        <Typography 
                                            sx={{ 
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                mb: 1
                                            }}
                                        >
                                            Engagement Stats
                                        </Typography>
                                        <Box sx={{ 
                                            color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                            opacity: 0.8,
                                            fontSize: '0.8125rem',
                                            lineHeight: 1.5
                                        }}>
                                            <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                                                <span>⭐</span>
                                                <span>{contributor.starsReceived.toLocaleString()} stars received / {contributor.starsGiven.toLocaleString()} given</span>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <span>🔄</span>
                                                <span>{contributor.forksReceived.toLocaleString()} forks received / {contributor.forksGiven.toLocaleString()} given</span>
                                            </Box>
                                        </Box>
                                    </Box>
                                } 
                                arrow
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                            border: '1px solid',
                                            borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                            boxShadow: theme => theme.palette.mode === 'dark' 
                                                ? '0 4px 12px rgba(1, 4, 9, 0.75)'
                                                : '0 1px 6px rgba(27, 31, 36, 0.15)',
                                            borderRadius: '6px',
                                            '& .MuiTooltip-arrow': {
                                                color: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                '&::before': {
                                                    backgroundColor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                    border: '1px solid',
                                                    borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                }
                                            }
                                        }
                                    }
                                }}
                                >
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Typography variant="body2">{formatNumber(contributor.starsReceived)}</Typography>
                                    <Typography variant="body2">{formatNumber(contributor.forksReceived)}</Typography>
                                </Box>
                            </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip 
                                    title={
                                        <Box sx={{ p: 1.5 }}>
                                            <Typography 
                                                sx={{ 
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                    mb: 1
                                                }}
                                            >
                                                Last Activity
                                            </Typography>
                                            <Box sx={{ 
                                                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                                                opacity: 0.8,
                                                fontSize: '0.8125rem',
                                                lineHeight: 1.5
                                            }}>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <span>📅</span>
                                                    <span>Last commit: {new Date(contributor.latestCommitDate).toLocaleDateString()}</span>
                                                </Box>
                                            </Box>
                                        </Box>
                                    }
                                    arrow
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                border: '1px solid',
                                                borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                boxShadow: theme => theme.palette.mode === 'dark' 
                                                    ? '0 4px 12px rgba(1, 4, 9, 0.75)'
                                                    : '0 1px 6px rgba(27, 31, 36, 0.15)',
                                                borderRadius: '6px',
                                                '& .MuiTooltip-arrow': {
                                                    color: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                    '&::before': {
                                                        backgroundColor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                                                        border: '1px solid',
                                                        borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <Typography variant="body2">
                                            {new Date(contributor.latestCommitDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ marginTop: -0.5 }}>
                                            {new Date(contributor.latestCommitDate).getFullYear()}
                                        </Typography>
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