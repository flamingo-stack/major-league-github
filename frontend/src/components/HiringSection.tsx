import { GitHubIcon, MadeWithLove } from '@flamingo/ui-kit/components';
import EmailIcon from '@mui/icons-material/Email';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import WorkIcon from '@mui/icons-material/Work';
import { Avatar, Box, Chip, Collapse, IconButton, Link, Paper, Skeleton, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { flamingo as flamingoColors, systemGreys } from '../styles/colors';
import { HiringManagerProfile, JobOpening } from '../types/hiring';
import { GitHubStats } from './GitHubStats';

interface HiringSectionProps {
  hiringManager: HiringManagerProfile | undefined;
  jobOpenings: JobOpening[];
  isLoading?: boolean;
  error?: Error | null;
}

export const HiringSection: React.FC<HiringSectionProps> = ({
  hiringManager,
  jobOpenings,
  isLoading,
  error
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

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
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Preview Bar - Fixed */}
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          py: 2,
          px: { xs: 1, sm: 1.5 },
          bgcolor: theme => theme.palette.mode === 'dark' ? systemGreys.background : systemGreys.grey,
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* First Row */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 24,
        }}>
          <Box sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 1,
          }}>
            <MadeWithLove
              size="sm"
              // className="text-[var(--color-text-primary)]"
            />
          </Box>

          <Box sx={{
            display: { xs: 'block', sm: 'none' },
          }}>
            <MadeWithLove
              size="sm"
              showOnMobile={true}
              className="text-[var(--color-text-primary)]"
            />
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              cursor: 'pointer',
              '&:hover': {
                '& .MuiTypography-root': {
                  color: theme => theme.palette.mode === 'dark' ? flamingoColors.cyan_base : flamingoColors.cyan_dark,
                }
              }
            }}
            onClick={() => setIsExpanded(!isExpanded)}
            data-testid="expand-footer"
            className={isExpanded ? 'expanded' : ''}
          >
            {isLoading ? (
              <Skeleton variant="circular" width={24} height={24} />
            ) : hiringManager ? (
              <Avatar
                src={hiringManager.avatarUrl}
                alt={hiringManager.name}
                sx={{ 
                  width: 24,
                  height: 24,
                  border: '2px solid',
                  borderColor: theme => theme.palette.mode === 'dark' ? systemGreys.soft_grey_hover : `${systemGreys.black}26`,
                }}
              />
            ) : (
              <Avatar
                sx={{ 
                  width: 24,
                  height: 24,
                  border: '2px solid',
                  borderColor: theme => theme.palette.mode === 'dark' ? systemGreys.soft_grey_hover : `${systemGreys.black}26`,
                }}
              />
            )}
            <Typography
              component="div"
              sx={{
                color: theme => theme.palette.mode === 'dark' ? systemGreys.white : systemGreys.black,
                fontWeight: 500,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                lineHeight: '24px',
                transition: 'color 0.2s',
              }}
            >
              Come work with us
            </Typography>
            <IconButton 
              size="small"
              sx={{ 
                color: theme => theme.palette.mode === 'dark' ? systemGreys.grey_hover : systemGreys.grey_action,
                p: 0,
                width: 24,
                height: 24,
                minWidth: 24,
                minHeight: 24,
              }}
            >
              {isExpanded ? 
                <ExpandLessIcon sx={{ fontSize: '1rem' }} /> : 
                <ExpandMoreIcon sx={{ fontSize: '1rem' }} />
              }
            </IconButton>
          </Box>
        </Box>

        {/* Second Row */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 24,
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <Typography
              component="div"
              sx={{
                color: 'var(--color-text-secondary)',
                fontSize: { xs: '0.625rem', sm: '0.75rem' },
                lineHeight: '24px',
              }}
            >
              © {new Date().getFullYear()} Flamingo AI, Inc. All rights reserved.
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              flex: 1,
              justifyContent: 'flex-end',
              cursor: 'pointer',
              '&:hover': {
                '& .MuiTypography-root': {
                  color: theme => theme.palette.mode === 'dark' ? flamingoColors.cyan_base : flamingoColors.cyan_dark,
                }
              }
            }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isLoading ? (
              <Skeleton width={100} />
            ) : (
              <Typography
                component="div"
                sx={{
                  color: theme => theme.palette.mode === 'dark' ? systemGreys.grey_hover : systemGreys.grey_action,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  lineHeight: '24px',
                  transition: 'color 0.2s',
                }}
              >
                {(jobOpenings?.length || 0)} open position{(jobOpenings?.length || 0) !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Expanded Content */}
      {!error && (isLoading || hiringManager) && (
        <Collapse in={isExpanded}>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: theme => theme.palette.mode === 'dark' ? systemGreys.soft_grey_hover : `${systemGreys.black}26`,
              borderRadius: '6px',
              bgcolor: theme => theme.palette.mode === 'dark' ? systemGreys.background : systemGreys.grey,
              mb: 2,
              position: 'relative',
              maxHeight: { xs: 'calc(100vh - 200px)', sm: 'none' },
              overflowY: { xs: 'auto', sm: 'visible' }
            }}
          >
            {/* Mobile Close Button */}
            <Box sx={{ 
              display: { xs: 'block', sm: 'none' },
              position: 'sticky',
              top: 0,
              bgcolor: theme => theme.palette.mode === 'dark' ? systemGreys.background : systemGreys.grey,
              borderBottom: '1px solid',
              borderColor: theme => theme.palette.mode === 'dark' ? systemGreys.soft_grey_hover : `${systemGreys.black}26`,
              p: 2,
              textAlign: 'right',
              zIndex: 1
            }}>
              <IconButton
                onClick={() => setIsExpanded(false)}
                size="small"
                sx={{
                  color: theme => theme.palette.mode === 'dark' ? systemGreys.grey_hover : systemGreys.grey_action,
                  '&:hover': {
                    bgcolor: theme => theme.palette.mode === 'dark' ? `${systemGreys.grey}1F` : `${systemGreys.white_action}80`
                  }
                }}
              >
                <ExpandLessIcon />
              </IconButton>
            </Box>

            {/* Scrollable Content */}
            <Box sx={{ p: 3, pt: { xs: 2, sm: 3 } }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="90%" />
                    <Skeleton variant="text" width="75%" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="40%" height={32} />
                    <Skeleton variant="rectangular" height={100} />
                  </Box>
                </Box>
              ) : hiringManager && (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  {/* Hiring Manager Profile */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        src={hiringManager.avatarUrl}
                        alt={hiringManager.name}
                        sx={{ 
                          width: 64, 
                          height: 64,
                          border: '2px solid',
                          borderColor: theme => theme.palette.mode === 'dark' ? systemGreys.soft_grey_hover : `${systemGreys.black}26`,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: theme => theme.palette.mode === 'dark' ? systemGreys.white : systemGreys.black,
                            fontWeight: 600,
                          }}
                        >
                          {hiringManager.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme => theme.palette.mode === 'dark' ? systemGreys.grey_hover : systemGreys.grey_action,
                          }}
                        >
                          {hiringManager.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme => theme.palette.mode === 'dark' ? systemGreys.white : systemGreys.black,
                        mb: 2,
                      }}
                    >
                      {hiringManager.bio}
                    </Typography>

                    {/* GitHub Stats */}
                    {hiringManager.githubStats && (
                      <GitHubStats 
                        stats={hiringManager.githubStats} 
                        lastActive={hiringManager.lastActive} 
                      />
                    )}

                    {/* Social Links */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1.5,
                      '& a': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: '6px',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: theme => theme.palette.mode === 'dark' ? `${flamingoColors.cyan_base}1A` : `${flamingoColors.cyan_dark}1A`,
                        }
                      }
                    }}>
                      {hiringManager.socialLinks
                        .filter((link, index, self) => 
                          index === self.findIndex((l) => l.platform === link.platform)
                        )
                        .map((link, index) => (
                        <Link
                          key={`${link.platform}-${index}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                          sx={{
                            color: theme => theme.palette.mode === 'dark' ? systemGreys.grey_hover : systemGreys.grey_action,
                            '&:hover': {
                              color: theme => theme.palette.mode === 'dark' ? flamingoColors.cyan_base : flamingoColors.cyan_dark,
                            },
                          }}
                        >
                          {getSocialIcon(link.platform)}
                        </Link>
                      ))}
                    </Box>
                  </Box>

                  {/* Job Openings */}
                  <Box sx={{ 
                    flex: 1,
                    borderLeft: { xs: 'none', md: '1px solid' },
                    borderTop: { xs: '1px solid', md: 'none' },
                    borderColor: theme => theme.palette.mode === 'dark' ? systemGreys.soft_grey_hover : `${systemGreys.black}26`,
                    pl: { xs: 0, md: 3 },
                    pt: { xs: 3, md: 0 }
                  }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme => theme.palette.mode === 'dark' ? systemGreys.white : systemGreys.black,
                        fontWeight: 600,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <WorkIcon /> Open Positions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {jobOpenings.map((job) => (
                        <Paper
                          key={job.id}
                          elevation={0}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: theme => theme.palette.mode === 'dark' ? systemGreys.soft_grey_hover : `${systemGreys.black}26`,
                            borderRadius: '6px',
                            bgcolor: theme => theme.palette.mode === 'dark' ? systemGreys.background : systemGreys.grey,
                            '&:hover': {
                              borderColor: theme => theme.palette.mode === 'dark' ? flamingoColors.cyan_base : flamingoColors.cyan_dark,
                            },
                          }}
                        >
                          <Link
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                                textDecoration: 'none',
                                color: theme => theme.palette.mode === 'dark' ? systemGreys.white : systemGreys.black,
                                '&:hover': {
                                    textDecoration: 'none'
                                }
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                color: 'inherit',
                                fontWeight: 600,
                                mb: 1,
                              }}
                            >
                              {job.title}
                            </Typography>
                            <Chip
                              label={job.location}
                              size="small"
                              sx={{
                                bgcolor: theme => theme.palette.mode === 'dark' ? systemGreys.soft_grey_hover : systemGreys.white_action,
                                color: theme => theme.palette.mode === 'dark' ? systemGreys.grey_hover : systemGreys.grey_action,
                              }}
                            />
                          </Link>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Collapse>
      )}
    </Box>
  );
}; 