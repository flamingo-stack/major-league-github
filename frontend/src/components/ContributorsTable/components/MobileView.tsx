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
import { githubToOds } from '../../../styles/colorMappings';

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

    const StatItem = ({ icon, value, color }: { icon: React.ReactNode; value: string; color: string }) => (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            borderRadius: '6px',
            py: 0.25,
            px: 0.75,
            minWidth: 0,
            height: '22px',
            bgcolor: `${githubToOds.bgDark}99`,
            border: '1px solid',
            borderColor: `${githubToOds.textSecondary}40`,
        }}>
            {React.cloneElement(icon as React.ReactElement, { 
                sx: { fontSize: 14, color: color, flexShrink: 0 }
            })}
            <Typography sx={{ 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: githubToOds.textPrimary, 
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
                        borderColor: githubToOds.border,
                        borderRadius: '6px',
                        p: { xs: 2.5, sm: 2 },
                        bgcolor: 'transparent',
                        '&:hover': {
                            bgcolor: `${githubToOds.textSecondary}14`
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
                                color={githubToOds.link}
                            />
                            <StatItem 
                                icon={<CodeIcon />} 
                                value={formatNumber(contributor.totalCommits)}
                                color={githubToOds.success}
                            />
                            <StatItem 
                                icon={<ListAltIcon />} 
                                value={contributor.javaRepos.toString()}
                                color={githubToOds.success}
                            />
                            <StatItem 
                                icon={<StarIcon />} 
                                value={formatNumber(contributor.starsReceived)}
                                color={githubToOds.warning}
                            />
                            <StatItem 
                                icon={<ForkRightIcon />} 
                                value={formatNumber(contributor.forksReceived)}
                                color={githubToOds.warning}
                            />
                            <StatItem 
                                icon={<UpdateIcon />} 
                                value={formatDate(contributor.lastActive)}
                                color={githubToOds.link}
                            />
                        </Box>
                    </Box>
                </Card>
            ))}
        </Stack>
    );
}; 