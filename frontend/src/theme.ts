import { createTheme } from '@mui/material';

// GitHub color scales - dark theme only
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
        main: '#0969da',
        light: '#58a6ff',
        dark: '#0550ae'
    },
    green: {
        main: '#1a7f37',
        light: '#2ea043',
        dark: '#116329'
    }
};

export const getTheme = () => createTheme({
    palette: {
        mode: 'dark',
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
    },
    typography: {
        fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        fontWeightLight: 350,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 600,
        h1: {
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.25,
            color: githubColors.neutral[8]
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.25,
            color: githubColors.neutral[8]
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.25,
            color: githubColors.neutral[8]
        },
        h4: {
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.25,
            color: githubColors.neutral[8]
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
            color: githubColors.neutral[6]
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
            color: githubColors.neutral[5]
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
                    backgroundColor: githubColors.neutral[1],
                    color: githubColors.neutral[6]
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    padding: '5px 16px',
                    border: '1px solid',
                    borderColor: githubColors.neutral[2],
                    fontWeight: 600,
                    '&:hover': {
                        borderColor: githubColors.neutral[3],
                        backgroundColor: githubColors.neutral[2]
                    }
                },
                contained: {
                    backgroundColor: githubColors.neutral[2],
                    color: githubColors.neutral[6],
                    boxShadow: 'none',
                    '&:hover': {
                        backgroundColor: githubColors.neutral[3],
                        boxShadow: 'none'
                    }
                },
                containedPrimary: {
                    backgroundColor: githubColors.blue.main,
                    color: githubColors.neutral[8],
                    border: 'none',
                    '&:hover': {
                        backgroundColor: githubColors.blue.light
                    }
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid',
                    borderColor: githubColors.neutral[2],
                    padding: '16px',
                    fontSize: '0.875rem',
                    color: githubColors.neutral[6]
                },
                head: {
                    fontWeight: 600,
                    backgroundColor: githubColors.neutral[1],
                    color: githubColors.neutral[6]
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: githubColors.neutral[1],
                    border: '1px solid',
                    borderColor: githubColors.neutral[2],
                    borderRadius: '6px',
                    boxShadow: '0 8px 24px rgba(1, 4, 9, 0.75)'
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: githubColors.neutral[1],
                    borderBottom: '1px solid',
                    borderColor: githubColors.neutral[2],
                    color: githubColors.neutral[6],
                    boxShadow: 'none'
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: githubColors.neutral[1],
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: githubColors.neutral[2],
                        '& fieldset': {
                            border: 'none'
                        },
                        '&:hover': {
                            borderColor: githubColors.neutral[3]
                        },
                        '&.Mui-focused': {
                            borderColor: githubColors.blue.main,
                            boxShadow: '0 0 0 3px rgba(33, 136, 255, 0.15)'
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
                    backgroundColor: githubColors.neutral[1],
                    boxShadow: '0 8px 24px rgba(1, 4, 9, 0.75)',
                    border: '1px solid',
                    borderColor: githubColors.neutral[2]
                },
                option: {
                    '&:hover': {
                        backgroundColor: githubColors.neutral[2]
                    },
                    '&[aria-selected="true"]': {
                        backgroundColor: githubColors.neutral[3]
                    }
                }
            }
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: githubColors.blue.light,
                    textDecoration: 'none',
                    '&:hover': {
                        color: githubColors.blue.light,
                        textDecoration: 'underline'
                    }
                }
            }
        }
    }
}); 