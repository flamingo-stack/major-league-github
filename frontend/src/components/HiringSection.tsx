import React, { useState } from 'react';
import { Box, Paper, Typography, Link, Avatar, Chip, useTheme, IconButton, Collapse } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import WorkIcon from '@mui/icons-material/Work';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { HiringManagerProfile, JobOpening } from '../types/hiring';

interface HiringSectionProps {
  hiringManager: HiringManagerProfile;
  jobOpenings: JobOpening[];
}

export const HiringSection: React.FC<HiringSectionProps> = ({
  hiringManager,
  jobOpenings
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <LinkedInIcon />;
      case 'twitter':
        return <TwitterIcon />;
      case 'github':
        return <GitHubIcon />;
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Preview Bar */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          py: 2,
        }}
      >
        {/* Left side - Team message */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
            }}
          >
            Made with ❤️ in
          </Typography>
          <Link
            href="https://www.google.com/maps/place/Miami+Beach,+FL"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              }
            }}
          >
            <Typography
              variant="body2"
              component="span"
            >
              Miami Beach
            </Typography>
          </Link>
          <Typography
            variant="body2"
            sx={{
              color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
            }}
          >
            by the 🦩 team
          </Typography>
        </Box>

        {/* Right side - CTA and expand button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box 
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              cursor: 'pointer',
              '&:hover': {
                '& .MuiTypography-root': {
                  color: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da',
                }
              }
            }}
          >
            <Avatar
              src={hiringManager.avatarUrl}
              alt={hiringManager.name}
              sx={{ 
                width: 32, 
                height: 32,
                border: '2px solid',
                borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
            >
              Come work with us • {jobOpenings.length} open position{jobOpenings.length !== 1 ? 's' : ''}
            </Typography>
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              sx={{ 
                color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                p: 0.5,
              }}
            >
              {isExpanded ? <ExpandLessIcon sx={{ fontSize: '1.25rem' }} /> : <ExpandMoreIcon sx={{ fontSize: '1.25rem' }} />}
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Expanded Content */}
      <Collapse in={isExpanded}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
            borderRadius: '6px',
            bgcolor: theme => theme.palette.mode === 'dark' ? '#0d1117' : '#ffffff',
            mb: 2
          }}
        >
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
                    borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                  }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                      fontWeight: 600,
                    }}
                  >
                    {hiringManager.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                    }}
                  >
                    {hiringManager.role}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
                  mb: 2,
                }}
              >
                {hiringManager.bio}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {hiringManager.socialLinks.map((link) => (
                  <Link
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                      '&:hover': {
                        color: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da',
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
              borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
              pl: { xs: 0, md: 3 },
              pt: { xs: 3, md: 0 }
            }}>
              <Typography
                variant="h6"
                sx={{
                  color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
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
                      borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
                      borderRadius: '6px',
                      bgcolor: theme => theme.palette.mode === 'dark' ? '#161b22' : '#f6f8fa',
                      '&:hover': {
                        borderColor: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da',
                      },
                    }}
                  >
                    <Link
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none' }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f',
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
                          bgcolor: theme => theme.palette.mode === 'dark' ? '#30363d' : '#eaeef2',
                          color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a',
                        }}
                      />
                    </Link>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
}; 