/**
 * WOMANSPLAIN DESIGN SYSTEM
 * Based on Celo's bold, high-contrast, raw interface guidelines
 */

// COLORS - Limited high-contrast palette
export const colors = {
  // Primary Celo brand colors
  yellow: '#FCFF52',
  forestGreen: '#4E632A',
  darkPurple: '#1A0329',
  
  // Neutrals
  lightTan: '#FBF6F1',
  tan: '#E6E3D5',
  brown: '#635949',
  black: '#000000',
  white: '#FFFFFF',
  
  // Accent colors (use sparingly for energy punches)
  pink: '#F2A9E7',
  orange: '#F2A9E7',
  lime: '#B2EBA1',
  lightBlue: '#8AC0F9',
};

// TYPOGRAPHY CLASSES
// Use these Tailwind classes for consistent typography
export const typography = {
  // GT Alpina - Headlines (oversized, thin-weight, tight letter-spacing)
  h1: 'font-alpina text-6xl md:text-8xl font-thin tracking-tight leading-none',
  h2: 'font-alpina text-5xl md:text-7xl font-thin tracking-tight leading-none',
  h3: 'font-alpina text-4xl md:text-5xl font-thin tracking-tight leading-tight',
  h4: 'font-alpina text-3xl md:text-4xl font-thin tracking-tight',
  
  // GT Alpina Italic - Emphasized headlines
  h1Italic: 'font-alpina italic text-6xl md:text-8xl font-thin tracking-tight leading-none',
  h2Italic: 'font-alpina italic text-5xl md:text-7xl font-thin tracking-tight leading-none',
  
  // Inter - Body text (clean, geometric)
  body: 'font-inter text-base leading-relaxed',
  bodyLarge: 'font-inter text-lg leading-relaxed',
  bodySmall: 'font-inter text-sm leading-normal',
  
  // Inter Heavy - Links, tags, important text
  label: 'font-inter text-sm font-[750] uppercase tracking-wide',
  button: 'font-inter text-base font-[750] uppercase tracking-wider',
  tag: 'font-inter text-xs font-[750] uppercase tracking-widest',
};

// COMPONENT STYLES - Raw, structural components
export const components = {
  // Buttons - rectangular, unsoftened, bold color inversions
  buttonPrimary: `
    ${typography.button}
    px-8 py-4
    bg-black text-yellow
    border-2 border-black
    hover:bg-yellow hover:text-black
    transition-colors duration-150
    cursor-pointer
  `,
  
  buttonSecondary: `
    ${typography.button}
    px-8 py-4
    bg-forestGreen text-white
    border-2 border-forestGreen
    hover:bg-white hover:text-forestGreen
    transition-colors duration-150
    cursor-pointer
  `,
  
  buttonDanger: `
    ${typography.button}
    px-8 py-4
    bg-darkPurple text-pink
    border-2 border-darkPurple
    hover:bg-pink hover:text-darkPurple
    transition-colors duration-150
    cursor-pointer
  `,
  
  // Input fields - rectangular, visible borders
  input: `
    ${typography.body}
    w-full px-4 py-3
    bg-white text-black
    border-4 border-black
    focus:outline-none focus:border-yellow
    transition-colors duration-150
  `,
  
  textarea: `
    ${typography.body}
    w-full px-4 py-3
    bg-white text-black
    border-4 border-black
    focus:outline-none focus:border-yellow
    transition-colors duration-150
    resize-none
  `,
  
  // Cards - sharp rectangles, visible structure
  card: `
    border-4 border-black
    bg-white
  `,
  
  cardInverted: `
    border-4 border-yellow
    bg-black
    text-yellow
  `,
  
  // Tags/Badges - small, bold, uppercase
  tag: `
    ${typography.tag}
    inline-block px-3 py-1
    bg-black text-yellow
    border-2 border-black
  `,
  
  tagSecondary: `
    ${typography.tag}
    inline-block px-3 py-1
    bg-forestGreen text-white
    border-2 border-forestGreen
  `,
};

// LAYOUT CONSTANTS
export const layout = {
  // Big color blocks, sharp rectangles
  section: 'w-full min-h-screen',
  container: 'max-w-7xl mx-auto px-4 md:px-8',
  
  // Asymmetric spacing
  spacingLarge: 'my-16 md:my-24',
  spacingMedium: 'my-8 md:my-12',
  spacingSmall: 'my-4 md:my-6',
};


