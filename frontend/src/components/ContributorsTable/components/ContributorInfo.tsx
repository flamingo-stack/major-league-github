import React from 'react';
import {
    Avatar,
    Box,
    Link,
    Typography,
    Tooltip
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { GitHubIcon } from '@flamingo/ui-kit/components/icons';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import TagIcon from '@mui/icons-material/Tag';
import CloudIcon from '@mui/icons-material/Cloud';
import CloseIcon from '@mui/icons-material/Close';
import { ContributorInfoProps } from '../types';
import { ContributorTooltipContent } from './tooltips/ContributorTooltip';
import { githubToOds, badgeColors, shadows } from '../../../styles/colorMappings';

const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'linkedin':
            return <LinkedInIcon fontSize="small" />;
        case 'twitter':
            return <TwitterIcon fontSize="small" />;
        case 'x':
            return <CloseIcon fontSize="small" />;
        case 'github':
            return <GitHubIcon width={16} height={16} />;
        case 'facebook':
            return <FacebookIcon fontSize="small" />;
        case 'instagram':
            return <InstagramIcon fontSize="small" />;
        case 'mastodon':
            return <TagIcon fontSize="small" />;
        case 'bluesky':
            return <CloudIcon fontSize="small" />;
        case 'email':
            return <EmailIcon fontSize="small" />;
        case 'website':
            return <LanguageIcon fontSize="small" />;
        default:
            // Fallback to website icon for unknown platforms
            console.log(`Unknown social platform: ${platform}`);
            return <LanguageIcon fontSize="small" />;
    }
};

interface Props extends ContributorInfoProps {
    hiringManagerUsername?: string;
}

export const ContributorInfo: React.FC<Props> = ({ contributor, index, hiringManagerUsername }) => {
    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                <Link 
                    href={contributor.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ display: 'flex' }}
                >
                    <Avatar
                        src={contributor.avatarUrl}
                        alt={contributor.name || contributor.login}
                        sx={{ 
                            width: { xs: 96, sm: 84 }, 
                            height: { xs: 96, sm: 84 },
                            borderRadius: '50%'
                        }}
                    />
                </Link>
                {index < 3 && (
                    <Typography 
                        sx={{ 
                            fontSize: { xs: '1.4rem', sm: '1.2rem' },
                            lineHeight: 1,
                            position: 'absolute',
                            right: -4,
                            bottom: -2,
                            filter: `drop-shadow(0 0 1px ${shadows.light})`
                        }}
                    >
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </Typography>
                )}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Tooltip
                    title={<ContributorTooltipContent contributor={contributor} />}
                    arrow
                    placement="bottom-start"
                    disableTouchListener={false}
                    enterTouchDelay={0}
                    leaveTouchDelay={3000}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: githubToOds.bgDark,
                                border: '1px solid',
                                borderColor: githubToOds.border,
                                boxShadow: `0 8px 24px ${shadows.heavy}`,
                                borderRadius: '6px',
                                p: 0,
                                maxWidth: 'none',
                                '& .MuiTooltip-arrow': {
                                    color: githubToOds.border,
                                    '&::before': {
                                        backgroundColor: githubToOds.bgDark,
                                        border: '1px solid',
                                        borderColor: githubToOds.border,
                                    }
                                }
                            }
                        }
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: 0.5
                        }}>
                            <Box sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 0.5
                            }}>
                                <Link 
                                    href={contributor.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ 
                                        color: githubToOds.textPrimary,
                                        textDecoration: 'none',
                                        '&:hover': { textDecoration: 'underline' },
                                        minWidth: 0,
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            fontWeight: 600, 
                                            color: 'inherit',
                                            fontSize: { xs: '1.1rem', sm: '1rem' },
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {contributor.name || contributor.login}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: 20,
                                            height: 24,
                                            borderRadius: '6px',
                                            bgcolor: index === 0 ? badgeColors.gold.bg 
                                                : index === 1 ? badgeColors.silver.bg
                                                : index === 2 ? badgeColors.bronze.bg
                                                : `${githubToOds.textSecondary}1A`,
                                            border: '1px solid',
                                            borderColor: index === 0 ? badgeColors.gold.border
                                                : index === 1 ? badgeColors.silver.border
                                                : index === 2 ? badgeColors.bronze.border
                                                : `${githubToOds.textSecondary}4D`,
                                            px: 0.75,
                                            flexShrink: 0
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                color: index === 0 ? badgeColors.gold.text
                                                    : index === 1 ? badgeColors.silver.text
                                                    : index === 2 ? badgeColors.bronze.text
                                                    : githubToOds.textSecondary,
                                                lineHeight: 1
                                            }}
                                        >
                                            #{index + 1}
                                        </Typography>
                                    </Box>
                                </Link>
                                {hiringManagerUsername && contributor.login === hiringManagerUsername && (
                                    <Box
                                        component="button"
                                        className="join-team-button"
                                        onClick={() => {
                                            const footer = document.querySelector('[data-testid="footer"]');
                                            if (footer) {
                                                const expandButton = footer.querySelector('[data-testid="expand-footer"]');
                                                if (expandButton && !footer.classList.contains('expanded')) {
                                                    (expandButton as HTMLElement).click();
                                                }
                                                setTimeout(() => {
                                                    footer.scrollIntoView({ behavior: 'smooth' });
                                                }, 100);
                                            }
                                        }}
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            px: 1,
                                            height: 24,
                                            border: '1px solid',
                                            borderColor: `${githubToOds.linkAccent}80`,
                                            borderRadius: '6px',
                                            bgcolor: `${githubToOds.linkAccent}1A`,
                                            color: githubToOds.linkAccent,
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            transition: 'all 0.2s',
                                            textTransform: 'none',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0,
                                            '&:hover': {
                                                bgcolor: `${githubToOds.linkAccent}33`,
                                                borderColor: `${githubToOds.linkAccent}B3`,
                                            }
                                        }}
                                    >
                                        <span role="img" aria-label="rocket" style={{ fontSize: '14px' }}>🚀</span>
                                        Join my team
                                    </Box>
                                )}
                            </Box>
                            {contributor.name && (
                                <Link 
                                    href={contributor.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ 
                                        textDecoration: 'none',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: githubToOds.linkAccent,
                                            fontWeight: 600,
                                            fontSize: { xs: '0.9375rem', sm: '0.875rem' }
                                        }}
                                    >
                                        {contributor.login}
                                    </Typography>
                                </Link>
                            )}
                            {contributor.socialLinks && contributor.socialLinks.length > 0 && (
                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 1,
                                    mt: 0.5,
                                    '& a': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 24,
                                        height: 24,
                                        borderRadius: '6px',
                                        transition: 'all 0.2s',
                                        color: githubToOds.textSecondary,
                                        '&:hover': {
                                            bgcolor: `${githubToOds.link}1A`,
                                            color: githubToOds.link,
                                        }
                                    }
                                }}>
                                    {contributor.socialLinks
                                        // Filter out links with missing/empty platforms or URLs
                                        .filter(link => link.platform && link.url && link.url.trim() !== '')
                                        // Remove duplicates (keep first instance of each platform)
                                        .filter((link, index, self) => 
                                            index === self.findIndex((l) => l.platform === link.platform)
                                        )
                                        .map((link, index) => {
                                            // For debugging
                                            if (process.env.NODE_ENV === 'development') {
                                                console.log(`Rendering social link: ${link.platform} - ${link.url}`);
                                            }
                                            
                                            return (
                                                <Link
                                                    key={`${link.platform}-${index}`}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title={`${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}: ${link.url}`}
                                                >
                                                    {getSocialIcon(link.platform)}
                                                </Link>
                                            );
                                        })}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Tooltip>
            </Box>
        </Box>
    );
}; 