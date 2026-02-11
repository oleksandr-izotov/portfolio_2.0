# Project Status Management

To unlock a project (make the card active and clickable) or lock it (show the lock icon), you only need to edit one file.

## Instructions

1.  Open the file: `src/data/projects.ts`.
2.  Find the code block (`object`) corresponding to the project you want to change.
3.  Modify the `status` field.

### Code Example

```typescript
  {
    title: 'Core Logic OS',
    // ... other fields

    // OPTION 1: Project is locked (show Lock icon)
    status: 'development'

    // OPTION 2: Project is open (active card)
    // Either verify it is 'active', or simply remove the line entirely
    status: 'active'
  },
```

### Quick Actions

- **To UNLOCK a project**: Change `status` to `'active'`, or delete the line `status: 'development'`.
- **To LOCK a project**: Add valid line `status: 'development'`.
