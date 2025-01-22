import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { State } from '../types/api';
import { autocompleteStates } from '../services/api';
import { BaseAutocomplete } from './BaseAutocomplete';

interface StateAutocompleteProps {
  value: State | null;
  onChange: (state: State | null) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  regionId?: string;
}

export const StateAutocomplete = ({
  value,
  onChange,
  inputValue,
  onInputChange,
  regionId
}: StateAutocompleteProps) => {
  const { data: states = [] } = useQuery({
    queryKey: ['states', inputValue, regionId],
    queryFn: ({ signal }) => autocompleteStates(inputValue, regionId, undefined, signal),
    staleTime: 0,
    refetchOnMount: 'always'
  });

  return (
    <BaseAutocomplete<State>
      value={value}
      onChange={onChange}
      inputValue={inputValue}
      onInputChange={onInputChange}
      options={states}
      placeholder="Search states..."
      getOptionLabel={(option) => option.name}
      renderIcon={(state) => state.iconUrl}
      renderOptionContent={(state) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {state.iconUrl && (
            <Box
              component="img"
              src={state.iconUrl}
              alt={state.name}
              sx={{ 
                width: 24, 
                height: 16,
                objectFit: 'cover',
                borderRadius: 0.5
              }}
            />
          )}
          <Typography>
            {state.name}
          </Typography>
        </Box>
      )}
    />
  );
}; 