import React from 'react';
import {
    Box,
    Typography,
    Card,
    Stack,
    Theme,
    Divider,
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
import { ContributorsTableProps } from '../types';
import { ContributorInfo } from './ContributorInfo';
import { LocationInfo } from './LocationInfo';
import { formatNumber } from '../utils';
import { LoadingSpinner } from '../../LoadingSpinner';
import { ErrorMessage } from '../../ErrorMessage';
import { useHiring } from '../../../hooks/useHiring';
import { formatDate, formatDateRelative } from '../../../utils/date';

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

export const MobileView: React.FC<ContributorsTableProps> = ({ contributors, isLoading, error }) => {
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

    const StatItem = ({ icon, value, color }: { icon: React.ReactNode; value: string; color: (theme: Theme) => string }) => (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            borderRadius: '6px',
            py: 0.25,
            px: 0.75,
            minWidth: 0,
            height: '22px',
            bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(13, 17, 23, 0.6)' : '#f6f8fa',
            border: '1px solid',
            borderColor: (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(99, 110, 123, 0.25)' : 'rgba(31, 35, 40, 0.15)',
        }}>
            {React.cloneElement(icon as React.ReactElement, { 
                sx: { fontSize: 14, color: (theme: Theme) => color(theme), flexShrink: 0 }
            })}
            <Typography sx={{ 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: (theme: Theme) => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f', 
                lineHeight: 1 
            }}>
                {value}
            </Typography>
        </Box>
    );

    return (
        <Stack spacing={1.5}>
            {contributors.map((contributor, index) => (
                <Card
                    key={contributor.login}
                    sx={{
                        border: '1px solid',
                        borderColor: (theme: Theme) => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                        borderRadius: '6px',
                        p: { xs: 2.5, sm: 2 },
                        bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? 'transparent' : '#ffffff',
                        '&:hover': {
                            bgcolor: (theme: Theme) => theme.palette.mode === 'dark' 
                                ? 'rgba(177, 186, 196, 0.08)' 
                                : 'rgba(234, 238, 242, 0.5)'
                        },
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 2.5, sm: 2 }
                    }}>
                        <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                            <Box sx={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}>
                                <Box sx={{ 
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    gap: 2,
                                    mb: 2,
                                    '@media (max-width: 440px)': {
                                        '& .join-team-button': {
                                            display: 'none !important'
                                        }
                                    }
                                }}>
                                    <ContributorInfo 
                                        contributor={contributor} 
                                        index={index}
                                        hiringManagerUsername={hiringManager?.socialLinks.find(link => link.platform === 'github')?.url.split('/').pop()}
                                    />
                                </Box>
                                <Box sx={{ py: 0.5 }}>
                                    <LocationInfo contributor={contributor} />
                                </Box>
                            </Box>
                        </Box>
                        
                        <Box sx={{ 
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <StatItem 
                                icon={<EmojiEventsIcon />} 
                                value={formatNumber(contributor.score)}
                                color={(theme: Theme) => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da'}
                            />
                            <StatItem 
                                icon={<CodeIcon />} 
                                value={formatNumber(contributor.totalCommits)}
                                color={(theme: Theme) => theme.palette.mode === 'dark' ? '#57ab5a' : '#1a7f37'}
                            />
                            <StatItem 
                                icon={<ListAltIcon />} 
                                value={contributor.javaRepos.toString()}
                                color={(theme: Theme) => theme.palette.mode === 'dark' ? '#57ab5a' : '#1a7f37'}
                            />
                            <StatItem 
                                icon={<StarIcon />} 
                                value={formatNumber(contributor.starsReceived)}
                                color={(theme: Theme) => theme.palette.mode === 'dark' ? '#daaa3f' : '#9a6700'}
                            />
                            <StatItem 
                                icon={<ForkRightIcon />} 
                                value={formatNumber(contributor.forksReceived)}
                                color={(theme: Theme) => theme.palette.mode === 'dark' ? '#daaa3f' : '#9a6700'}
                            />
                            <StatItem 
                                icon={<UpdateIcon />} 
                                value={formatDate(contributor.lastActive)}
                                color={(theme: Theme) => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da'}
                            />
                        </Box>
                    </Box>
                </Card>
            ))}
        </Stack>
    );
}; 