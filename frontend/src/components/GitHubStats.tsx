import React from 'react';
import { Box, Typography, Theme } from '@mui/material';
import { systemGreys, flamingo, attention, openYellow } from '../styles/colors';
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
      bgcolor: systemGreys.background,
      border: '1px solid',
      borderColor: `${systemGreys.soft_grey_hover}40`,
    }}>
      {React.cloneElement(icon as React.ReactElement, { 
        sx: { fontSize: 14, color: color, flexShrink: 0 }
      })}
      <Typography sx={{ 
        fontSize: '0.875rem', 
        fontWeight: 600, 
        color: systemGreys.white, 
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
        color={flamingo.cyan_base}
      />
      <StatItem 
        icon={<CodeIcon />} 
        value={(stats?.totalCommits ?? 0).toString()}
        color={attention.green_success}
      />
      <StatItem 
        icon={<ListAltIcon />} 
        value={(stats?.javaRepos ?? 0).toString()}
        color={attention.green_success}
      />
      <StatItem 
        icon={<StarIcon />} 
        value={(stats?.starsReceived ?? 0).toString()}
        color={openYellow.base}
      />
      <StatItem 
        icon={<ForkRightIcon />} 
        value={(stats?.forksReceived ?? 0).toString()}
        color={openYellow.base}
      />
      <StatItem 
        icon={<UpdateIcon />} 
        value={formatDate(lastActive)}
        color={flamingo.cyan_base}
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
        <EmojiEventsIcon sx={{ color: flamingo.cyan_base }} />
        <Typography variant="body2" sx={{ color: systemGreys.white }}>
              {formatScore(stats?.score)}
            </Typography>
      </Box>

      {/* Activity */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="caption" sx={{ color: systemGreys.grey_hover }}>
          Activity
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CommitIcon sx={{ fontSize: '1rem', color: attention.green_success }} />
            <Typography variant="body2" sx={{ color: systemGreys.white }}>
              {stats?.totalCommits ?? 0}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MergeIcon sx={{ fontSize: '1rem', color: attention.green_success }} />
            <Typography variant="body2" sx={{ color: systemGreys.white }}>
              {stats?.totalPullRequests ?? 0}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BugReportIcon sx={{ fontSize: '1rem', color: attention.green_success }} />
            <Typography variant="body2" sx={{ color: systemGreys.white }}>
              {stats?.totalIssues ?? 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Engagement */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="caption" sx={{ color: systemGreys.grey_hover }}>
          Engagement
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarIcon sx={{ fontSize: '1rem', color: openYellow.base }} />
            <Typography variant="body2" sx={{ color: systemGreys.white }}>
              {stats?.starsReceived ?? 0}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ForkRightIcon sx={{ fontSize: '1rem', color: openYellow.base }} />
            <Typography variant="body2" sx={{ color: systemGreys.white }}>
              {stats?.forksReceived ?? 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Last Active */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="caption" sx={{ color: systemGreys.grey_hover }}>
          Last Active
        </Typography>
        <Typography variant="body2" sx={{ color: systemGreys.white }}>
          {formatDate(lastActive)}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      mb: 2,
      borderRadius: '6px',
      bgcolor: systemGreys.background,
      border: '1px solid',
      borderColor: systemGreys.soft_grey_hover,
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
