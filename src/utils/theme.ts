// Amazigh/Berber colors theme
// Blue (ⴰⵣⴳⵣⴰⵡ) - Sky, Sea
// Green (ⴰⵣⴳⵣⴰⵡ) - Mountains, Nature
// Yellow (ⴰⵡⵔⵖ) - Sand, Sun

export const COLORS = {
  // Primary Amazigh colors
  primary: '#1E88E5',        // Amazigh Blue
  primaryDark: '#1565C0',
  primaryLight: '#42A5F5',

  secondary: '#43A047',      // Amazigh Green
  secondaryDark: '#2E7D32',
  secondaryLight: '#66BB6A',

  accent: '#FFC107',         // Amazigh Yellow/Gold
  accentDark: '#FFA000',
  accentLight: '#FFCA28',

  // Background colors
  background: '#FAFAFA',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // Text colors
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#BDBDBD',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',

  // Status colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',

  // Border colors
  border: '#E0E0E0',
  divider: '#EEEEEE',

  // Arabic text color (for RTL)
  arabicText: '#1A1A1A',

  // Tifinagh special
  tifinagh: '#D84315',

  // Gradients
  gradientStart: '#1E88E5',
  gradientMiddle: '#43A047',
  gradientEnd: '#FFC107',
};

export const FONTS = {
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
    huge: 36,
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Amazigh symbol
export const AMAZIGH_SYMBOL = 'ⵣ';

// Common style patterns
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  buttonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
  },
  headerGradient: {
    colors: [COLORS.primary, COLORS.secondary],
  },
};
