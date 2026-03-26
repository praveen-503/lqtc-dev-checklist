# Bug Tracking Feature - Quick Reference Guide

## 🐛 Overview
The bug tracking system allows you to manage bugs alongside your user stories with a comprehensive checklist and Azure DevOps integration.

## 📋 Bug Checklist Stages
1. **Reviewed** - Bug has been reviewed and acknowledged
2. **Recreated** - Bug has been successfully recreated
3. **Fixed** - Bug fix has been implemented
4. **Released** - Fix has been released to production

## 🎯 Key Features

### 1. Add a Bug
- Click the **+** button in Active or Fixed Bugs column
- Fill in bug details:
  - **Bug Number** (required): e.g., BUGX291
  - **Description** (required): Detailed bug explanation
  - **Status**: Yet to Fix or Fixed
  - **Related User Story** (optional): Link to a user story
  - **Created Date** (required): When bug was discovered
  - **Fixed Date** (optional): When bug was fixed

### 2. Edit a Bug
- Click on any bug card
- Modify any field
- Save changes

### 3. Delete a Bug
- Click the **Delete** button on a bug card
- Confirm deletion

### 4. Track Progress
- Check off checklist items as you complete them
- Items update in real-time
- Progress counter shows completion (e.g., 2/4)

### 5. Azure DevOps Integration
- Click on bug number to open in Azure DevOps
- URL format: `https://qtcado.qtcm.com/DefaultCollection/QTCAgile/_workitems/edit/{number}`
- Works with formats: BUGX291, BUG-291, 291

## 🎨 Visual Indicators

### Active Bugs (Left Column)
- **Red header** with bug icon
- **Red left border** on cards
- **Red badge** showing "Active" status

### Fixed Bugs (Right Column)
- **Green header** with checkmark icon
- **Green left border** on cards
- **Green badge** showing "Fixed" status

## 💡 Best Practices

1. **Link to User Stories**: Always link bugs to related user stories for better traceability
2. **Update Status**: Move bugs from Active to Fixed by editing and changing status
3. **Use Checklist**: Follow the 4-stage checklist for consistent bug resolution
4. **Track Dates**: Always set created date; set fixed date when bug is resolved
5. **Detailed Descriptions**: Write clear, detailed bug descriptions

## 🔄 Workflow Example

```
1. Bug Discovered
   └─> Add to Active Bugs
   └─> Set Bug Number: BUGX291
   └─> Link to User Story: US-570749
   └─> Set Created Date

2. Bug Review
   └─> Check "Reviewed" in checklist
   
3. Bug Reproduction
   └─> Check "Recreated" in checklist
   
4. Bug Fixed
   └─> Check "Fixed" in checklist
   └─> Edit bug to change status to "Fixed"
   └─> Set Fixed Date
   └─> Bug moves to Fixed Bugs column
   
5. Bug Released
   └─> Check "Released" in checklist
   └─> Bug tracking complete
```

## 📊 Information Displayed on Bug Cards

- **Bug Number** (clickable link to ADO)
- **Status Badge** (Active/Fixed)
- **Description** (first 2 lines)
- **Related User Story** (if linked)
- **Created Date**
- **Fixed Date** (if applicable)
- **Checklist Progress** (e.g., 2/4)
- **All 4 checklist items** with checkboxes
- **Edit and Delete buttons**

## ⌨️ Keyboard Shortcuts

- **Click bug card**: Open edit modal
- **Click bug number**: Open in Azure DevOps (new tab)
- **Click checkbox**: Toggle checklist item
- **Click Edit button**: Open edit modal
- **Click Delete button**: Delete bug with confirmation

## 🔗 Integration with User Stories

- Bugs can be linked to user stories via dropdown
- Related user story number displayed on bug card
- Bug list updates when user stories are modified
- Clicking related story number opens ADO user story

## 💾 Data Storage

- All bugs stored in browser's localStorage
- Separate storage key: `bugTracker`
- Automatic save on all changes
- Data persists across browser sessions
- No data sent to external servers

## 🚨 Important Notes

1. **Bug Numbers Must Be Unique**: Cannot have duplicate bug numbers
2. **Required Fields**: Bug number, description, and created date are required
3. **Status Changes**: Edit the bug to change status from Active to Fixed
4. **User Story Dependency**: If a linked user story is deleted, the link remains but shows as empty
5. **Browser Storage**: Clearing browser data will delete all bugs

## 🎓 Tips & Tricks

- **Quick Add**: Use the column-specific + button to pre-set status
- **Batch Updates**: Click cards quickly to check off multiple items
- **Visual Scanning**: Use color coding to quickly identify status
- **Link Everything**: Always link bugs to stories for better traceability
- **Keep Descriptions Concise**: First 2 lines show on card, so make them count

## 📱 Mobile Support

- Bug cards are touch-friendly
- Optimized for smaller screens
- Columns stack vertically on mobile
- All features work on touch devices
- Swipe-friendly interface

---

**Need Help?** Check the main README.md for more detailed documentation.
