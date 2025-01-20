import { createTheme, PaletteMode } from '@mui/material';

// GitHub color scales - high contrast version
const githubColors = {
    neutral: {
        0: '#0d1117', // Darkest - main dark background
        1: '#010409', // Even darker for contrast
        2: '#21262d', // Dark borders
        3: '#30363d', // Dark dividers
        4: '#6e7681', // Dark text secondary
        5: '#7d8590', // Light text secondary
        6: '#e6edf3', // Light text primary - increased contrast
        7: '#f6f8fa', // Lightest - main light text
        8: '#ffffff'  // White
    },
    blue: {
        main: '#2f81f7', // Brighter primary blue for dark mode
        light: '#58a6ff',
        dark: '#1f6feb'
    },
    green: {
        main: '#238636',
        light: '#2ea043',
        dark: '#1f7a31'
    }
};

export const getTheme = (mode: PaletteMode) => createTheme({
    palette: {
        mode,
        ...(mode === 'dark' ? {
            primary: {
                main: githubColors.blue.main,
                light: githubColors.blue.light,
                dark: githubColors.blue.dark
            },
            success: {
                main: githubColors.green.main,
                light: githubColors.green.light,
                dark: githubColors.green.dark
            },
            background: {
                default: githubColors.neutral[1],
                paper: githubColors.neutral[1]
            },
            text: {
                primary: githubColors.neutral[6],
                secondary: githubColors.neutral[4]
            },
            divider: githubColors.neutral[2]
        } : {
            primary: {
                main: githubColors.blue.main,
                light: githubColors.blue.light,
                dark: githubColors.blue.dark
            },
            success: {
                main: githubColors.green.main,
                light: githubColors.green.light,
                dark: githubColors.green.dark
            },
            background: {
                default: githubColors.neutral[8],
                paper: githubColors.neutral[8]
            },
            text: {
                primary: githubColors.neutral[1],
                secondary: githubColors.neutral[5]
            },
            divider: 'rgba(27, 31, 36, 0.15)'
        })
    },
    typography: {
        fontFamily: '"Mona Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        fontWeightLight: 350,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 600,
        h1: {
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.25,
            color: mode === 'dark' ? githubColors.neutral[8] : githubColors.neutral[1]
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.25,
            color: mode === 'dark' ? githubColors.neutral[8] : githubColors.neutral[1]
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.25,
            color: mode === 'dark' ? githubColors.neutral[8] : githubColors.neutral[1]
        },
        h4: {
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.25,
            color: mode === 'dark' ? githubColors.neutral[8] : githubColors.neutral[1]
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
            color: mode === 'dark' ? githubColors.neutral[6] : githubColors.neutral[1]
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
            color: mode === 'dark' ? githubColors.neutral[5] : githubColors.neutral[4]
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem'
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: mode === 'dark' ? githubColors.neutral[1] : githubColors.neutral[8],
                    color: mode === 'dark' ? githubColors.neutral[6] : githubColors.neutral[1]
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    padding: '5px 16px',
                    border: '1px solid',
                    borderColor: mode === 'dark' ? githubColors.neutral[2] : 'rgba(27, 31, 36, 0.15)',
                    fontWeight: 600,
                    '&:hover': {
                        borderColor: mode === 'dark' ? githubColors.neutral[3] : 'rgba(27, 31, 36, 0.15)',
                        backgroundColor: mode === 'dark' ? githubColors.neutral[2] : 'rgba(27, 31, 36, 0.04)'
                    }
                },
                contained: {
                    backgroundColor: mode === 'dark' ? githubColors.neutral[2] : githubColors.neutral[8],
                    color: mode === 'dark' ? githubColors.neutral[6] : githubColors.neutral[1],
                    boxShadow: 'none',
                    '&:hover': {
                        backgroundColor: mode === 'dark' ? githubColors.neutral[3] : '#f3f4f6',
                        boxShadow: 'none'
                    }
                },
                containedPrimary: {
                    backgroundColor: githubColors.blue.main,
                    color: githubColors.neutral[8],
                    border: 'none',
                    '&:hover': {
                        backgroundColor: githubColors.blue.dark
                    }
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid',
                    borderColor: mode === 'dark' ? githubColors.neutral[2] : 'rgba(27, 31, 36, 0.15)',
                    padding: '16px',
                    fontSize: '0.875rem',
                    color: mode === 'dark' ? githubColors.neutral[6] : githubColors.neutral[1]
                },
                head: {
                    fontWeight: 600,
                    backgroundColor: mode === 'dark' ? githubColors.neutral[1] : '#f6f8fa',
                    color: mode === 'dark' ? githubColors.neutral[6] : githubColors.neutral[4]
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: mode === 'dark' ? githubColors.neutral[1] : githubColors.neutral[8],
                    border: '1px solid',
                    borderColor: mode === 'dark' ? githubColors.neutral[2] : 'rgba(27, 31, 36, 0.15)',
                    borderRadius: '6px'
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'dark' ? githubColors.neutral[1] : githubColors.neutral[8],
                    borderBottom: '1px solid',
                    borderColor: mode === 'dark' ? githubColors.neutral[2] : 'rgba(27, 31, 36, 0.15)',
                    color: mode === 'dark' ? githubColors.neutral[6] : githubColors.neutral[1],
                    boxShadow: 'none'
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: mode === 'dark' ? githubColors.neutral[1] : githubColors.neutral[8],
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: mode === 'dark' ? githubColors.neutral[2] : 'rgba(27, 31, 36, 0.15)',
                        '& fieldset': {
                            border: 'none'
                        },
                        '&:hover': {
                            borderColor: mode === 'dark' ? githubColors.neutral[3] : 'rgba(27, 31, 36, 0.3)'
                        },
                        '&.Mui-focused': {
                            borderColor: githubColors.blue.main,
                            boxShadow: `0 0 0 3px ${mode === 'dark' ? 'rgba(33, 136, 255, 0.15)' : 'rgba(9, 105, 218, 0.15)'}`
                        },
                        '& .MuiInputAdornment-root': {
                            marginTop: '0 !important',
                            height: '100%'
                        },
                        '& .MuiInputAdornment-positionStart': {
                            marginLeft: '8px'
                        }
                    }
                }
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                paper: {
                    backgroundColor: mode === 'dark' ? githubColors.neutral[1] : githubColors.neutral[8],
                    boxShadow: mode === 'dark' 
                        ? '0 8px 24px rgba(1, 4, 9, 0.75)'
                        : '0 8px 24px rgba(140, 149, 159, 0.2)',
                    border: '1px solid',
                    borderColor: mode === 'dark' ? githubColors.neutral[2] : 'rgba(27, 31, 36, 0.15)'
                },
                option: {
                    '&:hover': {
                        backgroundColor: mode === 'dark' ? githubColors.neutral[2] : '#f3f4f6'
                    }
                }
            }
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: mode === 'dark' ? githubColors.blue.light : githubColors.blue.main,
                    textDecoration: 'none',
                    '&:hover': {
                        color: mode === 'dark' ? githubColors.blue.light : githubColors.blue.dark,
                        textDecoration: 'underline'
                    }
                }
            }
        }
    }
}); 