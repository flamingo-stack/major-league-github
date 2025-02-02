import { useQuery } from '@tanstack/react-query';
import { Language } from '../types/api';
import { autocompleteLanguages } from '../services/api';
import { BaseAutocomplete } from './BaseAutocomplete';
import { SxProps, Theme } from '@mui/material';

interface LanguageAutocompleteProps {
  value: Language | null;
  onChange: (language: Language | null) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  sx?: SxProps<Theme>;
}

export const LanguageAutocomplete = ({
  value,
  onChange,
  inputValue,
  onInputChange,
  sx
}: LanguageAutocompleteProps) => {
  const { data: languages = [] } = useQuery({
    queryKey: ['languages', inputValue],
    queryFn: ({ signal }) => autocompleteLanguages(inputValue, signal),
    staleTime: 0
  });

  return (
    <BaseAutocomplete<Language>
      value={value}
      onChange={onChange}
      inputValue={inputValue}
      onInputChange={onInputChange}
      options={languages}
      placeholder="Search languages..."
      getOptionLabel={(option: Language) => option.displayName}
      sx={sx}
    />
  );
}; 