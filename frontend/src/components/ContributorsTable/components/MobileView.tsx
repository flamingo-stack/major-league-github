import React from 'react';
import {
    Box,
    Typography,
    Card,
    Stack,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import UpdateIcon from '@mui/icons-material/Update';
import { ContributorsTableProps } from '../types';
import { ContributorInfo } from './ContributorInfo';
import { LocationInfo } from './LocationInfo';
import { formatNumber } from '../utils';

export const MobileView: React.FC<ContributorsTableProps> = ({ contributors }) => {
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
        }}>
            {React.cloneElement(icon as React.ReactElement, { 
                sx: { fontSize: 14, color: color, flexShrink: 0 }
            })}
            <Typography sx={{ 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: '#e6edf3', 
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
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        p: 2,
                        '&:hover': {
                            bgcolor: 'rgba(177, 186, 196, 0.08)'
                        }
                    }}
                >
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2
                    }}>
                        <Box sx={{ flex: '1 1 auto' }}>
                            <ContributorInfo contributor={contributor} index={index} />
                            <Box sx={{ mt: 1 }}>
                                <LocationInfo contributor={contributor} />
                            </Box>
                        </Box>
                        
                        <Box sx={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, auto)',
                            gridTemplateRows: 'repeat(3, auto)',
                            gap: 1,
                            alignContent: 'center',
                            justifyContent: 'flex-end',
                            alignSelf: 'center'
                        }}>
                            <StatItem 
                                icon={<EmojiEventsIcon />} 
                                value={formatNumber(contributor.score)}
                                color="#539bf5"
                            />
                            <StatItem 
                                icon={<CodeIcon />} 
                                value={formatNumber(contributor.totalCommits)}
                                color="#57ab5a"
                            />
                            <StatItem 
                                icon={<ListAltIcon />} 
                                value={contributor.javaRepos.toString()}
                                color="#57ab5a"
                            />
                            <StatItem 
                                icon={<StarIcon />} 
                                value={formatNumber(contributor.starsReceived)}
                                color="#daaa3f"
                            />
                            <StatItem 
                                icon={<ForkRightIcon />} 
                                value={formatNumber(contributor.forksReceived)}
                                color="#daaa3f"
                            />
                            <StatItem 
                                icon={<UpdateIcon />} 
                                value={new Date(contributor.latestCommitDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                                color="#539bf5"
                            />
                        </Box>
                    </Box>
                </Card>
            ))}
        </Stack>
    );
}; 