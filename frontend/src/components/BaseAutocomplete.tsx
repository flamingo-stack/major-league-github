import { Box, Typography, Autocomplete, TextField, TextFieldProps, InputAdornment } from '@mui/material';

export interface BaseEntity {
  id: string;
  name?: string;
  displayName?: string;
  iconUrl?: string;
  logoUrl?: string;
}

export interface BaseAutocompleteProps<T extends BaseEntity> {
  value: T | null;
  onChange: (value: T | null) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  options: T[];
  placeholder: string;
  getOptionLabel: (option: T) => string;
  renderIcon?: (option: T) => string | undefined;
  renderOptionContent?: (option: T) => React.ReactNode;
}

export const BaseAutocomplete = <T extends BaseEntity>({
  value,
  onChange,
  inputValue,
  onInputChange,
  options,
  placeholder,
  getOptionLabel,
  renderIcon = (option) => option.iconUrl || option.logoUrl,
  renderOptionContent
}: BaseAutocompleteProps<T>) => {
  return (
    <Autocomplete<T>
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, value, reason) => {
        // Always update input value for typing
        onInputChange(value);
      }}
      options={options}
      getOptionLabel={getOptionLabel}
      fullWidth
      autoComplete
      handleHomeEndKeys
      clearOnBlur={false}
      renderInput={(params) => (
        <TextField 
          {...(params as TextFieldProps)}
          placeholder={placeholder}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: value && renderIcon(value) ? (
              <InputAdornment position="start">
                <Box
                  component="img"
                  src={renderIcon(value)}
                  alt={getOptionLabel(value)}
                  sx={{ 
                    width: 24, 
                    height: 24,
                    objectFit: 'contain'
                  }}
                />
              </InputAdornment>
            ) : null
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Box component="li" key={option.id} {...otherProps}>
            {renderOptionContent ? (
              renderOptionContent(option)
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                py: 1.5
              }}>
                {renderIcon(option) && (
                  <Box
                    component="img"
                    src={renderIcon(option)}
                    alt={getOptionLabel(option)}
                    sx={{ 
                      width: 24, 
                      height: 24,
                      objectFit: 'contain',
                      flexShrink: 0
                    }}
                  />
                )}
                <Typography variant="subtitle1">
                  {getOptionLabel(option)}
                </Typography>
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
}; 