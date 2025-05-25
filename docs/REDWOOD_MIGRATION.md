# NextJS to RedwoodSDK Migration Guide

This document outlines the migration of SolStatus from NextJS to RedwoodSDK.

## Directory Structure

The NextJS directory structure:
```
/src
  /app
    /api
    /endpoint-monitors
    layout.tsx
    page.tsx
    site.ts
  /components
  /context
  /db
  /lib
  /registry
  /store
  /types
```

Has been migrated to the RedwoodSDK structure:
```
/web
  /src
    /api
    /components
    /config
    /context
    /layouts
    /lib
    /pages
    /registry
    /store
    Routes.jsx
    index.jsx
    index.css
    themes.css
```

## Key Migration Points

### 1. Routing
- NextJS: File-based routing in `/app` directory
- RedwoodSDK: Using `Routes.jsx` with explicit route definitions

### 2. Layouts
- NextJS: Uses `layout.tsx` files
- RedwoodSDK: Uses layout components in `/layouts` directory

### 3. API Routes
- NextJS: API routes in `/app/api` directory
- RedwoodSDK: API handlers using RedwoodSDK's service pattern

### 4. Component Organization
- Components moved and adapted to RedwoodSDK structure
- State management libraries (Zustand) retained

## Configuration

RedwoodSDK configuration is set in `rwsdk.config.js` in the project root.

## Theme System

The theme system has been migrated with minimal changes:
- Theme CSS variables preserved
- Theme switching functionality retained
- Context API pattern maintained

## Remaining Work

To fully complete this migration:

1. Implement full database connectivity through RedwoodSDK
2. Create proper error boundaries and loading states
3. Set up authentication if needed
4. Complete API implementation
5. Configure proper build and deployment process for RedwoodSDK

## Resources

- [RedwoodSDK Documentation](https://docs.rwsdk.com/)
- [RedwoodSDK Example](https://github.com/mj-meyer/RedwoodSDK-RSC-Movies)