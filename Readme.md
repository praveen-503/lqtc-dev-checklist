# LQTC RHRP Development Process Checklist

A comprehensive static web application for managing multiple user stories with detailed development process checklists **and integrated bug tracking**. This tool helps development teams track progress through each phase of the LQTC RHRP (Risk-based Healthcare Resource Planning) development lifecycle while managing bugs efficiently.

## 🌟 Features

### User Story Management
- **Create Multiple User Stories**: Add unlimited user stories with unique identifiers
- **Priority Management**: Drag-and-drop reordering and priority controls
- **Status Tracking**: Automatic status classification (Not Started, In Progress, Completed)
- **Date Management**: Track Dev, QA/SQA, and Release dates with status indicators
- **Azure DevOps Integration**: Clickable user story numbers that link directly to Azure DevOps work items

### 🐛 Bug Tracking System (NEW!)
- **Dual-Column Layout**: 
  - **Left Column**: Active Bugs (Yet to Fix)
  - **Right Column**: Fixed Bugs
  - **Center Column**: User Stories
- **Bug Management**:
  - Add bug number (e.g., BUGX291)
  - Detailed bug description
  - Track bug status (Active/Fixed)
  - Link bugs to related user stories
  - Track creation and fix dates
  - Azure DevOps integration with clickable bug numbers
- **Bug Checklist** (4 steps):
  1. ✓ Reviewed
  2. ✓ Recreated
  3. ✓ Fixed
  4. ✓ Released
- **Bug Actions**:
  - Edit bug details
  - Delete bugs
  - Toggle checklist items
  - Move between Active/Fixed status

### Comprehensive Checklist
Each user story includes a 22-step development process checklist:
1. Story RCI - 4 Estimation in Story Points
2. Add Tasks to User Story
3. Change Story Status to Active
4. Create Feature Branch
5. Development
6. Internal Code/Database Scripts Review
7. External Code/Database Scripts Review
8. Merge Code into Release
9. Deploy Code & Database Scripts Into DEV Environment
10. Dev Integration Testing
11. Update User Story Including Dev Testing Results
12. Peer Dev Integration Testing
13. Add comment to User Story stating Peer Dev Testing is completed
14. Developer Demo
15. Deploy Code & Database Scripts Into DEV INT Environment
16. Update RB Description Section by linking the User Story #
17. Update RB Database Section including Script Path & Change Set #
18. Update RB Build Section including Build # and path to Jenkins Build
19. Update RB Deployment Order with any other dependent RB or say no dependencies
20. Add comment to RB stating Database Scripts Review & Approved (Peer Developer)
21. Assign User Story to SQA Lead
22. Send Release Note to SQA / Assign RB to SQA Lead

### Interactive Features
- **Real-time Progress Tracking**: Visual progress bars and completion counters
- **Sorting Options**: Sort by priority, status, or creation date
- **Drag & Drop**: Reorder user stories by priority
- **Collapsible Interface**: Expand/collapse story details
- **Edit Functionality**: Modify story numbers and dates inline
- **Reset Options**: Reset individual story checklists
- **Delete Protection**: Confirmation modals for destructive actions

### Data Persistence
- **Local Storage**: All data persists in browser local storage
- **No Backend Required**: Fully client-side application
- **Export/Import Ready**: Easy to extend with data export features

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or database required

### Installation
1. Clone or download the repository
2. Open `index.html` in a web browser
3. Start creating user stories and tracking bugs

### Quick Start Guide

#### Creating a User Story
1. Click the **"Add New User Story"** button
2. Enter a story number (e.g., US-570749)
3. Set development, QA, and release dates
4. Optionally add Release Baton information
5. Click **"Create User Story"**
6. Click the story number to open it in Azure DevOps

#### Adding a Bug
1. Click the **"+"** button in either the Active Bugs or Fixed Bugs column
2. Enter bug number (e.g., BUGX291)
3. Provide a detailed description
4. Select status (Yet to Fix / Fixed)
5. Optionally link to a related user story
6. Set creation date and fix date (if fixed)
7. Click **"Save Bug"**
8. Click the bug number to open it in Azure DevOps

#### Managing Bugs
- **Track Progress**: Check off items in the bug checklist (Reviewed, Recreated, Fixed, Released)
- **Edit Bug**: Click on any bug card to edit its details
- **Move Status**: Change bug status from Active to Fixed via the edit modal
- **Delete Bug**: Click the delete button on any bug card
- **Link to Stories**: Associate bugs with specific user stories for better tracking

### File Structure
```
dev-checklist/
│
├── index.html      # Main HTML structure
├── styles.css      # All CSS styling
├── script.js       # JavaScript functionality
└── README.md       # Documentation
```

## 🛠️ Technology Stack

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Interactive functionality and data management
- **Bootstrap 5**: UI components and responsive grid system
- **Bootstrap Icons**: Comprehensive icon set
- **Google Fonts**: Inter font family for modern typography

## 📱 Responsive Design & Mobile Compatibility

The application features comprehensive responsive design with mobile-first approach:

### 📱 **Mobile Devices (≤ 576px)**
- Optimized touch targets (44px minimum)
- Stacked layout for better readability
- Simplified navigation with collapsible sort controls
- Touch-friendly interactions with visual feedback
- Landscape orientation support
- Reduced animations for better performance

### 📟 **Tablets (577px - 768px)**
- Balanced layout between mobile and desktop
- Touch-optimized but with more screen real estate
- Horizontal button groups where appropriate
- Enhanced drag-and-drop functionality

### 💻 **Laptops (769px - 992px)**
- Full desktop features
- Optimized hover states
- Complete drag-and-drop interface
- Enhanced visual effects and animations

### 🖥️ **Desktop (≥ 993px)**
- Full feature set with all interactions
- Enhanced hover effects and animations
- Optimized for mouse and keyboard navigation
- Large screen optimizations for ≥1200px

### **Cross-Device Features:**
- **Touch Device Detection**: Automatically adjusts interface for touch vs. mouse
- **Orientation Awareness**: Adapts layout for portrait/landscape modes
- **Accessibility**: Reduced motion support, high contrast mode, keyboard navigation
- **Progressive Enhancement**: Core functionality works on all devices
- **Scroll Enhancements**: Smooth scrolling, scroll-to-top button
- **Print Optimization**: Clean print layouts without interactive elements

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with gradient backgrounds
- **Visual Feedback**: Hover effects, animations, and status indicators
- **Color Coding**: Different colors for various status states
- **Progress Visualization**: Multiple progress indicators and statistics
- **Accessibility**: Keyboard navigation and screen reader support

## 📊 Statistics Dashboard

- **Total Stories**: Overview of all user stories
- **Completion Status**: Count of completed, in-progress, and not-started stories
- **Individual Progress**: Detailed progress for each story
- **Date Tracking**: Visual indicators for overdue, upcoming, and on-track dates

## 🔧 Customization

The application is highly customizable:
- **Checklist Items**: Modify the 22-step process in `script.js`
- **Styling**: Update colors, fonts, and layouts in `styles.css`
- **Functionality**: Extend features in `script.js`
- **Branding**: Update titles and labels in `index.html`

## 💾 Data Management

### Storage
- Uses browser's `localStorage` API
- Automatic saving on all changes
- No data loss on browser refresh

### Data Structure
Each user story contains:
- Unique identifier
- Story number/name
- Priority ranking
- Creation timestamp
- Important dates (Dev, QA, Release)
- Checklist completion status

## 🌐 Browser & Device Compatibility

### **Desktop Browsers:**
- ✅ Chrome 80+ (Windows, macOS, Linux)
- ✅ Firefox 75+ (Windows, macOS, Linux)
- ✅ Safari 13+ (macOS)
- ✅ Edge 80+ (Windows, macOS)

### **Mobile Browsers:**
- ✅ Chrome Mobile (Android 7+)
- ✅ Safari Mobile (iOS 13+)
- ✅ Firefox Mobile (Android 7+)
- ✅ Samsung Internet (Android 7+)
- ✅ Edge Mobile (iOS 13+, Android 7+)

### **Tablet Support:**
- ✅ iPad (iOS 13+) - Safari, Chrome, Edge
- ✅ Android Tablets (Android 7+) - Chrome, Firefox
- ✅ Surface Pro - Edge, Chrome, Firefox

### **Device Features:**
- **Touch Support**: Optimized for touchscreen interactions
- **Keyboard Navigation**: Full accessibility via keyboard
- **Screen Readers**: Compatible with NVDA, JAWS, VoiceOver
- **PWA Ready**: Can be installed as a Progressive Web App

## 📈 Future Enhancements

Potential features for future versions:
- Data export (JSON, CSV, Excel)
- Team collaboration features
- Integration with project management tools
- Custom checklist templates
- Reporting and analytics
- Dark/light theme toggle

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Issues & Support

If you encounter any issues or have suggestions:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include browser information and steps to reproduce

## 🏷️ Version Information

- **Current Version**: 2.0.0
- **Last Updated**: October 2025
- **Compatibility**: Modern browsers with ES6+ support
- **Major Changes in v2.0**:
  - ✨ Added comprehensive bug tracking system
  - ✨ Integrated Azure DevOps links for bugs and user stories
  - ✨ 3-column layout (Active Bugs | User Stories | Fixed Bugs)
  - ✨ Bug checklist with 4 stages
  - ✨ Link bugs to user stories
  - ✨ Separate tracking for active and fixed bugs

---

**Note**: This is a client-side application that stores data locally in your browser. For team collaboration, consider hosting on a shared server or implementing cloud storage integration.
