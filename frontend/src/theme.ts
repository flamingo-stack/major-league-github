import { createTheme } from '@mui/material';
import { systemGreys, flamingo, attention } from './styles/colors';
import { shadows } from './styles/colorMappings';

// Using ODS colors instead of hardcoded GitHub colors
const odsColors = {
    neutral: {
        0: systemGreys.background, // '#161616' - main dark background
        1: systemGreys.black, // '#212121' - slightly lighter for contrast
        2: systemGreys.soft_grey, // '#3a3a3a' - borders
        3: systemGreys.soft_grey_hover, // '#444444' - dividers
        4: systemGreys.grey, // '#888888' - text secondary
        5: systemGreys.grey_hover, // '#7e7e7e' - light text secondary
        6: systemGreys.white, // '#fafafa' - light text primary
        7: systemGreys.white_hover, // '#f5f5f5' - lightest text
        8: systemGreys.white  // Pure white for highest contrast
    },
    blue: {
        main: flamingo.cyan_base, // '#5efaf0' - flamingo cyan as primary
        light: flamingo.cyan_light, // '#a1fbf5' - lighter cyan
        dark: flamingo.cyan_dark // '#058c83' - darker cyan
    },
    green: {
        main: attention.green_success, // '#5ea62e' - success green
        light: attention.green_success_hover, // '#549c24' - hover green
        dark: attention.green_success_action // '#4a921a' - action green
    }
};

export const getTheme = () => createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: odsColors.blue.main,
            light: odsColors.blue.light,
            dark: odsColors.blue.dark
        },
        success: {
            main: odsColors.green.main,
            light: odsColors.green.light,
            dark: odsColors.green.dark
        },
        background: {
            default: odsColors.neutral[1],
            paper: odsColors.neutral[1]
        },
        text: {
            primary: odsColors.neutral[6],
            secondary: odsColors.neutral[4]
        },
        divider: odsColors.neutral[2]
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
            color: odsColors.neutral[8]
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.25,
            color: odsColors.neutral[8]
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.25,
            color: odsColors.neutral[8]
        },
        h4: {
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.25,
            color: odsColors.neutral[8]
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
            color: odsColors.neutral[6]
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
            color: odsColors.neutral[5]
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
                    backgroundColor: odsColors.neutral[1],
                    color: odsColors.neutral[6]
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    padding: '5px 16px',
                    border: '1px solid',
                    borderColor: odsColors.neutral[2],
                    fontWeight: 600,
                    '&:hover': {
                        borderColor: odsColors.neutral[3],
                        backgroundColor: odsColors.neutral[2]
                    }
                },
                contained: {
                    backgroundColor: odsColors.neutral[2],
                    color: odsColors.neutral[6],
                    boxShadow: 'none',
                    '&:hover': {
                        backgroundColor: odsColors.neutral[3],
                        boxShadow: 'none'
                    }
                },
                containedPrimary: {
                    backgroundColor: odsColors.blue.main,
                    color: odsColors.neutral[8],
                    border: 'none',
                    '&:hover': {
                        backgroundColor: odsColors.blue.light
                    }
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid',
                    borderColor: odsColors.neutral[2],
                    padding: '16px',
                    fontSize: '0.875rem',
                    color: odsColors.neutral[6]
                },
                head: {
                    fontWeight: 600,
                    backgroundColor: odsColors.neutral[1],
                    color: odsColors.neutral[6]
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: odsColors.neutral[1],
                    border: '1px solid',
                    borderColor: odsColors.neutral[2],
                    borderRadius: '6px',
                    boxShadow: `0 8px 24px ${shadows.heavy}` // Using ODS shadow
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: odsColors.neutral[1],
                    borderBottom: '1px solid',
                    borderColor: odsColors.neutral[2],
                    color: odsColors.neutral[6],
                    boxShadow: 'none'
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: odsColors.neutral[1],
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: odsColors.neutral[2],
                        '& fieldset': {
                            border: 'none'
                        },
                        '&:hover': {
                            borderColor: odsColors.neutral[3]
                        },
                        '&.Mui-focused': {
                            borderColor: odsColors.blue.main,
                            boxShadow: `0 0 0 3px ${flamingo.cyan_base}26` // Using ODS cyan with 15% opacity
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
                    backgroundColor: odsColors.neutral[1],
                    boxShadow: `0 8px 24px ${shadows.heavy}`, // Using ODS shadow
                    border: '1px solid',
                    borderColor: odsColors.neutral[2]
                },
                option: {
                    '&:hover': {
                        backgroundColor: odsColors.neutral[2]
                    },
                    '&[aria-selected="true"]': {
                        backgroundColor: odsColors.neutral[3]
                    }
                }
            }
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: odsColors.blue.light,
                    textDecoration: 'none',
                    '&:hover': {
                        color: odsColors.blue.light,
                        textDecoration: 'underline'
                    }
                }
            }
        }
    }
}); 