import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { systemGreys, flamingo } from '../styles/colors';
import { styled } from '@mui/material/styles';
import { GitHubIcon, MlgLogo } from '@flamingo/ui-kit/components/icons';

// External link icon component (simplified version from Figma)
const ExternalLinkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 17L17 7M17 7H7M17 7V17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Styled components for custom typography
const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Azeret Mono", monospace',
  fontWeight: 600,
  fontSize: '56px',
  lineHeight: '64px',
  letterSpacing: '-1.12px',
  color: systemGreys.white,
  marginBottom: '40px',
  [theme.breakpoints.down('md')]: {
    fontSize: '32px',
    lineHeight: '36px',
    letterSpacing: '-0.64px',
  },
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 500,
  fontSize: '18px',
  lineHeight: '24px',
  color: systemGreys.white,
  maxWidth: '675px',
  marginBottom: '40px',
  [theme.breakpoints.down('md')]: {
    fontSize: '16px',
    lineHeight: '22px',
    maxWidth: '100%',
  },
}));


const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

const GITHUB_LINK = 'https://github.com/flamingo-stack/major-league-github';
const BLOG_LINK = process.env.WEBAPP_EXTRA_BUTTON_LINK || 'https://www.flamingo.run/blog/major-league-github-the-open-source-talent-leaderboard';
const BLOG_TEXT = process.env.WEBAPP_EXTRA_BUTTON_TEXT || 'Why MLG?';

export const HeroSection: React.FC = () => {

  return (
    <Box
      sx={{
        backgroundColor: systemGreys.background,
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${systemGreys.soft_grey}`,
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 4, lg: 10 },
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {/* Left content */}
          <Box sx={{ flex: 1, maxWidth: { lg: '800px' } }}>
            {/* Mobile logo - only show on mobile */}
            <Box sx={{ 
              display: { xs: 'flex', lg: 'none' }, 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 3
            }}>
              <MlgLogo 
                size={120}
                color={systemGreys.white}
              />
            </Box>
            
            <StyledTitle>
              <span style={{ color: flamingo.pink_base }}>Major</span>
              {' '}
              <span style={{ color: flamingo.cyan_base }}>League</span>
              {' '}
              Github
            </StyledTitle>
            
            <StyledDescription>
              Major League GitHub is our community platform that ranks popular open-source repositories by programming language, helping developers discover trending projects and track the pulse of the global open-source ecosystem.
            </StyledDescription>
            
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
              }}
            >
              <Link
                href={BLOG_LINK}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  gap: 1,
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.5, sm: 2 },
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: flamingo.pink_base,
                  color: systemGreys.black,
                  bgcolor: flamingo.pink_base,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  fontWeight: 700,
                  minHeight: { xs: 48, sm: 52 },
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: flamingo.pink_hover,
                    borderColor: flamingo.pink_hover,
                    textDecoration: 'none',
                    color: systemGreys.black,
                  }
                }}
              >
                {BLOG_TEXT}
              </Link>
              
              <Link
                href={GITHUB_LINK}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.5, sm: 2 },
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: systemGreys.soft_grey,
                  color: systemGreys.white,
                  bgcolor: systemGreys.black,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  fontWeight: 700,
                  minHeight: { xs: 48, sm: 52 },
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: systemGreys.soft_grey,
                    borderColor: systemGreys.grey,
                    textDecoration: 'none',
                    color: systemGreys.white,
                  }
                }}
              >
                <GitHubIcon width={24} height={24} className="text-current" />
                Github Repo
              </Link>
            </Box>
          </Box>
          
          {/* Right logo - only show on desktop */}
          <Box sx={{ 
            display: { xs: 'none', lg: 'flex' }, 
            alignItems: 'center', 
            justifyContent: 'center',
            flex: 1,
            width: '100%',
            minHeight: '400px'
          }}>
            <MlgLogo 
              size={240}
              color={systemGreys.white}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};