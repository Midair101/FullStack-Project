# Gotify Design Guidelines - Spotify Clone

## Design Approach
**Reference-Based: Spotify**
Create a pixel-perfect clone of Spotify's interface, rebranded as "Gotify". Follow Spotify's design language exactly while replacing branding elements.

## Core Design Principles
- **Dark-First Interface**: Black (#000000) primary background, dark gray (#121212) secondary surfaces
- **Brand Accent**: Spotify green (#1DB954) for primary actions, replace Spotify branding with "Gotify"
- **Information Density**: High-density layouts optimized for music browsing
- **Consistency**: Match Spotify's exact component hierarchy and spacing

## Typography
- **Primary Font**: Circular (Spotify's font family) - use Google's Montserrat or Inter as fallback
- **Hierarchy**:
  - Page Titles: 32px, Bold
  - Section Headers: 24px, Bold
  - Song Titles: 16px, Regular
  - Metadata: 14px, Regular, 70% opacity
  - Small Labels: 12px, Regular

## Layout System
**Spacing Units**: Tailwind 2, 4, 6, 8, 12, 16 units (following 8px grid)

**Core Layout Structure**:
- Left Sidebar: Fixed 240px width
- Main Content: Flexible, max-w-screen-2xl
- Bottom Player Bar: Fixed 90px height
- Right Sidebar (optional): 280px for queue/friends

**Grid Systems**:
- Album/Playlist Cards: 5-6 columns on desktop, 2-3 on tablet, 1-2 on mobile
- Responsive breakpoints match Spotify's: sm (640px), md (768px), lg (1024px), xl (1280px)

## Component Library

### Navigation (Left Sidebar)
- Logo area (Gotify branding)
- Primary nav: Home, Search, Your Library icons with labels
- Playlist list with create/liked songs sections
- Install app prompt at bottom

### Main Content Area
- Horizontal scrolling carousels for playlists/albums
- Card components with album art, title, subtitle
- Hover states: subtle scale (1.05) and shadow lift
- Sticky section headers on scroll

### Playback Control Bar (Bottom)
- Left: Current track info with album art (56x56px)
- Center: Play controls (previous, play/pause, next, shuffle, repeat) + progress bar
- Right: Volume, queue, connect to device, full screen controls
- Progress bar: interactive with hover preview

### Search Results
- Top result card (larger featured result)
- Grid sections: Songs, Artists, Albums, Playlists
- Each section scrollable horizontally or vertically based on content

### Playlist/Album View
- Hero section with large album art (232x232px), metadata
- Action buttons: Play, Like, More options
- Track table: # | Title | Album | Date Added | Duration
- Sticky header on scroll

### Now Playing View
- Full-screen mode with large album art
- Lyrics panel (right side)
- Queue visualization
- Enhanced playback controls

## Color System
- **Background**: #000000 (app background), #121212 (cards/surfaces)
- **Surface Hover**: #1a1a1a
- **Text Primary**: #FFFFFF
- **Text Secondary**: #B3B3B3
- **Brand Green**: #1DB954 (primary actions, play buttons)
- **Success**: #1DB954
- **Border/Divider**: rgba(255,255,255,0.1)

## Icons
- Use Heroicons or Material Icons
- 20px for navigation, 24px for main actions, 16px for metadata

## Interactions
- **Hover States**: Subtle brightness increase for cards, underline for text links
- **Active Play State**: Green highlight + playing indicator (animated bars)
- **Smooth Transitions**: 200ms ease-in-out for most interactions
- **Loading States**: Skeleton screens matching content structure

## Images
**Album/Playlist Artwork**:
- Card thumbnails: 160x160px to 180x180px
- Hero images: 232x232px
- Playback bar: 56x56px
- Use placeholder gradient backgrounds when images unavailable

## Responsive Behavior
- Mobile: Single column, collapsible sidebar, simplified player controls
- Tablet: 2-3 column grids, persistent sidebar
- Desktop: Full multi-column experience
- Player bar always fixed at bottom across all viewports

## Accessibility
- Keyboard navigation for all controls
- ARIA labels for icon buttons
- Focus indicators matching Spotify's green accent
- Sufficient color contrast on dark backgrounds