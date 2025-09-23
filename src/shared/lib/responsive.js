/**
 * Responsive design utilities and breakpoints
 */

// Tailwind CSS breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Media query helpers
export const mediaQueries = {
  mobile: `(max-width: ${breakpoints.md})`,
  tablet: `(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  desktop: `(min-width: ${breakpoints.lg})`,
  largeDesktop: `(min-width: ${breakpoints.xl})`,
};

// Responsive grid configurations
export const gridConfigs = {
  parkingSlots: {
    mobile: 'grid-cols-3',
    tablet: 'grid-cols-4',
    desktop: 'grid-cols-6',
  },
  statsCards: {
    mobile: 'grid-cols-1',
    tablet: 'grid-cols-2',
    desktop: 'grid-cols-4',
  },
  billingLayout: {
    mobile: 'grid-cols-1',
    tablet: 'grid-cols-1',
    desktop: 'grid-cols-2',
  },
};

// Responsive spacing
export const spacing = {
  container: {
    mobile: 'px-4',
    tablet: 'px-6',
    desktop: 'px-8',
  },
  section: {
    mobile: 'py-4',
    tablet: 'py-6',
    desktop: 'py-8',
  },
};

// Responsive typography
export const typography = {
  heading: {
    mobile: 'text-2xl',
    tablet: 'text-3xl',
    desktop: 'text-4xl',
  },
  subheading: {
    mobile: 'text-lg',
    tablet: 'text-xl',
    desktop: 'text-2xl',
  },
  body: {
    mobile: 'text-sm',
    tablet: 'text-base',
    desktop: 'text-base',
  },
};

/**
 * Get responsive classes based on screen size
 * @param {Object} config - Configuration object with mobile, tablet, desktop keys
 * @returns {string} - Combined responsive classes
 */
export const getResponsiveClasses = (config) => {
  const classes = [];
  
  if (config.mobile) classes.push(config.mobile);
  if (config.tablet) classes.push(`md:${config.tablet}`);
  if (config.desktop) classes.push(`lg:${config.desktop}`);
  
  return classes.join(' ');
};

/**
 * Check if current screen matches media query
 * @param {string} query - Media query string
 * @returns {boolean} - Whether the query matches
 */
export const matchesMediaQuery = (query) => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
};

/**
 * Get current screen size category
 * @returns {string} - Screen size category (mobile, tablet, desktop)
 */
export const getCurrentScreenSize = () => {
  if (typeof window === 'undefined') return 'desktop';
  
  if (matchesMediaQuery(mediaQueries.mobile)) return 'mobile';
  if (matchesMediaQuery(mediaQueries.tablet)) return 'tablet';
  return 'desktop';
};

/**
 * Hook for responsive behavior (React hook)
 * @returns {Object} - Screen size info and utilities
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = React.useState(getCurrentScreenSize());
  
  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize(getCurrentScreenSize());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    screenSize,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
    getClasses: getResponsiveClasses,
  };
};
