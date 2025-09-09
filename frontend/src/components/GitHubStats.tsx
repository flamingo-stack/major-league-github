import React from 'react';
import { Box, Typography, Theme } from '@mui/material';
import { odsColors } from '@flamingo/ui-kit/styles/ods-colors';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import CommitIcon from '@mui/icons-material/Commit';
import MergeIcon from '@mui/icons-material/Merge';
import BugReportIcon from '@mui/icons-material/BugReport';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import UpdateIcon from '@mui/icons-material/Update';
import CodeIcon from '@mui/icons-material/Code';
import ListAltIcon from '@mui/icons-material/ListAlt';

interface GitHubStats {
  score: number;
  totalCommits: number;
  javaRepos: number;
  starsReceived: number;
  forksReceived: number;
  starsGiven: number;
  forksGiven: number;
  totalPullRequests: number;
  totalIssues: number;
}

interface GitHubStatsProps {
  stats: GitHubStats;
  lastActive: string;
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
      bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? odsColors.background : odsColors.grey,
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

export const GitHubStats: React.FC<GitHubStatsProps> = ({ stats, lastActive }) => {
  const formatScore = (score: number | undefined) => {
    if (!score) return '0';
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`;
    }
    if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}K`;
    }
    return score.toString();
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(parseInt(dateString) * 1000);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!stats) {
    return null;
  }

  // Mobile View
  const mobileView = (
    <Box sx={{ 
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
      alignItems: 'center',
      px: 2,
      py: 2,
    }}>
      <StatItem 
        icon={<EmojiEventsIcon />} 
        value={formatScore(stats?.score)}
        color={(theme: Theme) => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da'}
      />
      <StatItem 
        icon={<CodeIcon />} 
        value={(stats?.totalCommits ?? 0).toString()}
        color={(theme: Theme) => theme.palette.mode === 'dark' ? '#57ab5a' : '#1a7f37'}
      />
      <StatItem 
        icon={<ListAltIcon />} 
        value={(stats?.javaRepos ?? 0).toString()}
        color={(theme: Theme) => theme.palette.mode === 'dark' ? '#57ab5a' : '#1a7f37'}
      />
      <StatItem 
        icon={<StarIcon />} 
        value={(stats?.starsReceived ?? 0).toString()}
        color={(theme: Theme) => theme.palette.mode === 'dark' ? '#daaa3f' : '#9a6700'}
      />
      <StatItem 
        icon={<ForkRightIcon />} 
        value={(stats?.forksReceived ?? 0).toString()}
        color={(theme: Theme) => theme.palette.mode === 'dark' ? '#daaa3f' : '#9a6700'}
      />
      <StatItem 
        icon={<UpdateIcon />} 
        value={formatDate(lastActive)}
        color={(theme: Theme) => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da'}
      />
    </Box>
  );

  // Desktop View
  const desktopView = (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 2,
      p: 2,
    }}>
      {/* Score */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <EmojiEventsIcon sx={{ color: theme => theme.palette.mode === 'dark' ? '#539bf5' : '#0969da' }} />
        <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f' }}>
              {formatScore(stats?.score)}
            </Typography>
      </Box>

      {/* Activity */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="caption" sx={{ color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a' }}>
          Activity
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CommitIcon sx={{ fontSize: '1rem', color: theme => theme.palette.mode === 'dark' ? '#57ab5a' : '#1a7f37' }} />
            <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f' }}>
              {stats?.totalCommits ?? 0}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MergeIcon sx={{ fontSize: '1rem', color: theme => theme.palette.mode === 'dark' ? '#57ab5a' : '#1a7f37' }} />
            <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f' }}>
              {stats?.totalPullRequests ?? 0}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BugReportIcon sx={{ fontSize: '1rem', color: theme => theme.palette.mode === 'dark' ? '#57ab5a' : '#1a7f37' }} />
            <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f' }}>
              {stats?.totalIssues ?? 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Engagement */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="caption" sx={{ color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a' }}>
          Engagement
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarIcon sx={{ fontSize: '1rem', color: theme => theme.palette.mode === 'dark' ? '#daaa3f' : '#9a6700' }} />
            <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f' }}>
              {stats?.starsReceived ?? 0}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ForkRightIcon sx={{ fontSize: '1rem', color: theme => theme.palette.mode === 'dark' ? '#daaa3f' : '#9a6700' }} />
            <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f' }}>
              {stats?.forksReceived ?? 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Last Active */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="caption" sx={{ color: theme => theme.palette.mode === 'dark' ? '#7d8590' : '#57606a' }}>
          Last Active
        </Typography>
        <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#e6edf3' : '#24292f' }}>
          {formatDate(lastActive)}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      mb: 2,
      borderRadius: '6px',
      bgcolor: theme => theme.palette.mode === 'dark' ? odsColors.background : odsColors.grey,
      border: '1px solid',
      borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
      display: { xs: 'block', sm: 'block' },
    }}>
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        {mobileView}
      </Box>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        {desktopView}
      </Box>
    </Box>
  );
}; 
