# UI-Kit Integration Plan for Major League GitHub

## Overview
Since major-league-github uses Material-UI and ui-kit uses Tailwind, we'll use ui-kit only for shared resources (icons, fonts, colors) and create the hero section using Material-UI components.

## Implementation Steps

### 1. Clone UI-Kit to Frontend Directory
- Clone ui-kit repository into `frontend/ui-kit` 
- Add `frontend/ui-kit` to `.gitignore` since it will be cloned during builds

### 2. Add UI-Kit as File Dependency
- Update `frontend/package.json`: `"@flamingo/ui-kit": "file:./ui-kit"`
- This allows importing resources like icons, fonts, and color values

### 3. Move Assets to UI-Kit and Create Resources
In ui-kit repository:
- Add `frontend/src/assets/logo.svg` → `ui-kit/src/assets/mlg-logo.svg`
- Add `frontend/src/assets/fonts/` → `ui-kit/src/assets/fonts/`
- Create `ui-kit/src/components/icons/mlg-github-icon.tsx` (GitHub icon as React component)
- Update exports in ui-kit to make these available

### 4. Export ODS Colors from UI-Kit
Create `ui-kit/src/styles/ods-colors.ts` to export ODS color values as JavaScript constants:
```typescript
export const odsColors = {
  background: '#161616',
  softGrey: '#3a3a3a', 
  white: '#fafafa',
  black: '#212121',
  flamingoPink: '#f357bb',
  flamingoCyan: '#5efaf0',
  // ... other ODS colors
}
```

### 5. Update Webpack Configuration
- Add alias: `'@flamingo/ui-kit': path.resolve(__dirname, 'ui-kit/src')`
- Ensure webpack can process TypeScript files from ui-kit

### 6. Update GitHub Actions Workflow
Add step before frontend build:
```yaml
- name: Clone and setup UI-Kit 📦
  if: steps.changes.outputs.frontend == 'true'
  run: |
    cd frontend
    rm -rf ui-kit
    git clone https://github.com/${{ github.repository_owner }}/ui-kit.git ui-kit
    cd ui-kit
    npm install
```

Update frontend Dockerfile to clone ui-kit during build

### 7. Create Hero Section with Material-UI
Create `frontend/src/components/HeroSection.tsx` using Material-UI components:
- Import ODS colors from ui-kit: `import { odsColors } from '@flamingo/ui-kit/styles/ods-colors'`
- Import GitHub icon from ui-kit: `import { GitHubIcon } from '@flamingo/ui-kit/components/icons'`
- Import flamingo logo from ui-kit assets
- Use Material-UI Box, Typography, Button components
- Apply ODS colors:
  - Background: `odsColors.background` (#161616)
  - Pink text: `odsColors.flamingoPink` (#f357bb) 
  - Cyan text: `odsColors.flamingoCyan` (#5efaf0)
  - Button colors using ODS values
- Import fonts from ui-kit and apply:
  - Azeret Mono for title
  - DM Sans for body text

### 8. Update NPM Scripts
In `frontend/package.json`:
```json
"scripts": {
  "clone:ui-kit": "rm -rf ui-kit && git clone https://github.com/yourusername/ui-kit.git ui-kit",
  "setup:ui-kit": "cd ui-kit && npm install",
  "postinstall": "npm run clone:ui-kit && npm run setup:ui-kit",
  "dev": "webpack serve --mode development",
  "build": "webpack --mode production"
}
```

### 9. Integrate Hero Section
- Import HeroSection in `App.tsx`
- Add it at the top of the page layout
- Ensure it works with existing Material-UI theme

### 10. Test Integration
- Run `npm install` to trigger ui-kit setup
- Test `npm run dev` locally
- Verify fonts, colors, and icons load from ui-kit
- Test GitHub Actions build

## Benefits
This approach:
- Uses ui-kit only for shared resources (icons, fonts, colors)
- Keeps component implementation in Material-UI 
- Maintains consistency through ODS color system
- Avoids framework conflicts between Tailwind and Material-UI
- Ensures all resources are properly shared across projects