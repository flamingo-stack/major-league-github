import React from 'react';
import { Box, Paper, Typography, Link, Avatar, Chip, useTheme, Button } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import WorkIcon from '@mui/icons-material/Work';
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
    <Box sx={{ mt: 4, mb: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
          borderRadius: '6px',
          bgcolor: theme => theme.palette.mode === 'dark' ? '#0d1117' : '#ffffff',
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
    </Box>
  );
}; 