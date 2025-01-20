import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo, useEffect, useRef } from 'react';

/**
 * Represents the structure of URL state parameters
 */
export interface UrlState {
    selectedCityId: string | null;
    selectedRegionId: string | null;
    stateId: string | null;
    languageId: string | null;
    teamId: string | null;
}

interface BaseParamConfig<T> {
    key: string;
    validate?: (value: string) => boolean;
    transform?: (value: string) => string;
    defaultValue: T;
}

interface ParamConfig extends BaseParamConfig<string | null> {
    type: 'single';
}

type UrlStateKey = keyof UrlState;

/**
 * Configuration for URL parameters including validation and transformation rules
 */
const URL_PARAMS: Record<UrlStateKey, ParamConfig> = {
    selectedCityId: {
        key: 'cityId',
        type: 'single',
        validate: (id) => /^[a-zA-Z0-9-]+$/.test(id),
        defaultValue: null
    },
    selectedRegionId: {
        key: 'regionId',
        type: 'single',
        validate: (id) => /^[a-zA-Z0-9-]+$/.test(id),
        defaultValue: null
    },
    stateId: {
        key: 'stateId',
        type: 'single',
        validate: (id) => /^[a-zA-Z0-9-]+$/.test(id),
        defaultValue: null
    },
    languageId: {
        key: 'languageId',
        type: 'single',
        validate: (id) => /^[a-zA-Z0-9-]+$/.test(id),
        defaultValue: null
    },
    teamId: {
        key: 'teamId',
        type: 'single',
        validate: (id) => /^[a-zA-Z0-9-]+$/.test(id),
        defaultValue: null
    }
} as const;

/**
 * Custom error for URL state validation failures
 */
class UrlStateError extends Error {
    constructor(message: string, public param: string) {
        super(message);
        this.name = 'UrlStateError';
    }
}

function validateValue(value: string, config: ParamConfig): boolean {
    if (!config.validate) return true;
    return config.transform 
        ? config.validate(config.transform(value))
        : config.validate(value);
}

/**
 * Parses a URL parameter value based on its configuration
 */
function parseUrlValue(
    value: string | null,
    config: ParamConfig
): string | null {
    if (!value) return config.defaultValue;

    try {
        const transformed = config.transform ? config.transform(value) : value;

        if (!validateValue(transformed, config)) {
            throw new UrlStateError(
                `Invalid value for ${config.key}: ${transformed}`,
                config.key
            );
        }

        return transformed;
    } catch (error) {
        console.warn(`Error parsing URL parameter ${config.key}:`, error);
        return config.defaultValue;
    }
}

/**
 * Converts a value to its URL string representation
 */
function stringifyUrlValue(value: unknown): string | null {
    if (value === null || value === undefined) {
        return null;
    }
    return String(value);
}

export interface UseUrlStateOptions {
    /** Callback for handling validation errors */
    onError?: (error: UrlStateError) => void;
    /** Delay in milliseconds before updating URL after state changes */
    debounceMs?: number;
}

/**
 * Hook for managing URL state with validation, error handling, and debouncing
 */
export const useUrlState = (options: UseUrlStateOptions = {}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const debouncedUpdateRef = useRef<ReturnType<typeof setTimeout>>();
    const previousStateRef = useRef<UrlState | null>(null);

    // Parse and validate URL state
    const urlState = useMemo<UrlState>(() => {
        const state = {} as UrlState;
        (Object.entries(URL_PARAMS) as [UrlStateKey, ParamConfig][]).forEach(([stateKey, config]) => {
            try {
                const value = parseUrlValue(searchParams.get(config.key), config);
                state[stateKey] = value;
            } catch (error) {
                if (error instanceof UrlStateError && options.onError) {
                    options.onError(error);
                }
                state[stateKey] = config.defaultValue;
            }
        });
        return state;
    }, [searchParams, options.onError]);

    // Cleanup debounce timeout
    useEffect(() => {
        return () => {
            if (debouncedUpdateRef.current) {
                clearTimeout(debouncedUpdateRef.current);
            }
        };
    }, []);

    // Update URL state with debouncing and validation
    const updateUrlState = useCallback((
        newState: Partial<UrlState>,
        { immediate = false } = {}
    ) => {
        if (debouncedUpdateRef.current) {
            clearTimeout(debouncedUpdateRef.current);
        }

        const updateFn = () => {
            const params = new URLSearchParams(searchParams);
            
            Object.entries(newState).forEach(([key, value]) => {
                const config = URL_PARAMS[key as UrlStateKey];
                const stringValue = stringifyUrlValue(value);
                
                if (stringValue) {
                    params.set(config.key, stringValue);
                } else {
                    params.delete(config.key);
                }
            });

            setSearchParams(params, { replace: true });
        };

        if (immediate || !options.debounceMs) {
            updateFn();
        } else {
            debouncedUpdateRef.current = setTimeout(updateFn, options.debounceMs);
        }
    }, [searchParams, setSearchParams, options.debounceMs]);

    // Reset URL state
    const resetUrlState = useCallback(() => {
        setSearchParams(new URLSearchParams(), { replace: true });
    }, [setSearchParams]);

    // Check if state has changed
    const hasStateChanged = useMemo(() => {
        if (!previousStateRef.current) {
            previousStateRef.current = urlState;
            return false;
        }
        
        const hasChanged = Object.entries(urlState).some(([key, value]) => {
            const prevValue = previousStateRef.current![key as UrlStateKey];
            return value !== prevValue;
        });

        previousStateRef.current = urlState;
        return hasChanged;
    }, [urlState]);

    return {
        urlState,
        updateUrlState,
        resetUrlState,
        hasStateChanged,
        isStateEmpty: useMemo(() => 
            Object.values(urlState).every(value => value === null),
        [urlState])
    };
}; 