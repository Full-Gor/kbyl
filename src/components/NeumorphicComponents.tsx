import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Pressable } from 'react-native';

// Couleurs exactes extraites des images
export const NEUMORPHIC_COLORS = {
  // Dark theme (Image 1)
  dark: {
    background: '#1a1a2e',
    surface: '#16213e',
    surfaceLight: '#1f2b4d',
    surfaceDark: '#0f1629',
    primary: '#ffd93d',
    secondary: '#6c63ff',
    accent: '#ff6b6b',
    text: '#ffffff',
    textSecondary: '#8892b0',
    sun: '#ffd93d',
    moon: '#c7a829',
    toggleBg: '#0f1629',
    toggleActive: '#2d3a5f',
  },
  // Light/Gradient theme (Image 2)
  light: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    backgroundStart: '#667eea',
    backgroundMiddle: '#764ba2',
    backgroundEnd: '#f093fb',
    surface: 'rgba(255, 255, 255, 0.15)',
    surfaceGlass: 'rgba(255, 255, 255, 0.25)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    text: '#ffffff',
    textDark: '#2d3748',
    // Boutons colorés
    buttonUI: '#4facfe',
    buttonUX: '#a855f7',
    buttonAccessibility: '#f472b6',
    buttonAction: '#fb7185',
    // Progress bars
    progressBlue: '#3b82f6',
    progressPink: '#ec4899',
    progressGradientStart: '#667eea',
    progressGradientEnd: '#764ba2',
  },
  // Amazigh colors
  amazigh: {
    blue: '#1E88E5',
    green: '#43A047',
    yellow: '#FFC107',
    orange: '#FF9800',
  }
};

// Style pour le toggle Dark Mode (Image 1)
interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDark, onToggle }) => {
  const [isPressed, setIsPressed] = useState(false);

  const containerStyle = {
    width: 280,
    height: 180,
    backgroundColor: NEUMORPHIC_COLORS.dark.background,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    // Neumorphic shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  };

  const toggleTrackStyle = {
    width: 160,
    height: 70,
    backgroundColor: NEUMORPHIC_COLORS.dark.toggleBg,
    borderRadius: 35,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 8,
    // Inner shadow effect
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  };

  const sunStyle = {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: isDark ? 'transparent' : NEUMORPHIC_COLORS.dark.sun,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: isDark ? 'transparent' : NEUMORPHIC_COLORS.dark.sun,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: isDark ? 0 : 0.8,
    shadowRadius: isDark ? 0 : 15,
    elevation: isDark ? 0 : 10,
  };

  const moonContainerStyle = {
    width: 80,
    height: 54,
    borderRadius: 27,
    backgroundColor: isDark ? NEUMORPHIC_COLORS.dark.toggleActive : NEUMORPHIC_COLORS.dark.surfaceDark,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginLeft: 4,
    // 3D depth effect
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,217,61,0.3)' : 'rgba(0,0,0,0.2)',
  };

  const labelContainerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    width: '100%' as const,
    marginTop: 20,
    paddingHorizontal: 10,
  };

  const miniToggleStyle = {
    width: 50,
    height: 26,
    borderRadius: 13,
    backgroundColor: isDark ? NEUMORPHIC_COLORS.amazigh.green : NEUMORPHIC_COLORS.dark.surfaceDark,
    justifyContent: 'center' as const,
    paddingHorizontal: 3,
    // Inner shadow
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  };

  const miniToggleKnobStyle = {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignSelf: isDark ? 'flex-end' as const : 'flex-start' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  };

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onToggle}
      style={[containerStyle, isPressed && { transform: [{ scale: 0.98 }] }]}
    >
      <View style={toggleTrackStyle}>
        {/* Sun */}
        <View style={sunStyle}>
          <SunIcon size={32} color={isDark ? NEUMORPHIC_COLORS.dark.textSecondary : '#1a1a2e'} />
        </View>

        {/* Moon container */}
        <View style={moonContainerStyle}>
          <MoonIcon size={24} color={isDark ? NEUMORPHIC_COLORS.dark.moon : NEUMORPHIC_COLORS.dark.textSecondary} />
        </View>
      </View>

      <View style={labelContainerStyle}>
        <Text style={{
          color: NEUMORPHIC_COLORS.dark.text,
          fontSize: 14,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: '500',
        }}>
          Dark Mode
        </Text>
        <View style={miniToggleStyle}>
          <View style={miniToggleKnobStyle} />
        </View>
        <Text style={{
          color: NEUMORPHIC_COLORS.dark.textSecondary,
          fontSize: 14,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
          {isDark ? 'ON' : 'OFF'}
        </Text>
      </View>
    </Pressable>
  );
};

// Sun Icon SVG
const SunIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: size * 0.4,
      height: size * 0.4,
      borderRadius: size * 0.2,
      backgroundColor: color,
    }} />
    {/* Rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <View
        key={i}
        style={{
          position: 'absolute',
          width: 2,
          height: size * 0.25,
          backgroundColor: color,
          transform: [
            { rotate: `${angle}deg` },
            { translateY: -size * 0.35 },
          ],
        }}
      />
    ))}
  </View>
);

// Moon Icon SVG
const MoonIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={{
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: color,
    position: 'relative',
    overflow: 'hidden',
  }}>
    <View style={{
      position: 'absolute',
      width: size * 0.7,
      height: size * 0.7,
      borderRadius: size * 0.35,
      backgroundColor: NEUMORPHIC_COLORS.dark.toggleActive,
      top: -size * 0.15,
      left: size * 0.3,
    }} />
  </View>
);

// Dashboard Style Header (Image 2)
interface DashboardHeaderProps {
  title: string;
  tabs?: string[];
  activeTab?: number;
  onTabPress?: (index: number) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  tabs = [],
  activeTab = 0,
  onTabPress,
}) => {
  const headerStyle = {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  };

  const titleRowStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  };

  const titleStyle = {
    fontSize: 28,
    fontWeight: '700' as const,
    color: NEUMORPHIC_COLORS.light.text,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  };

  const tabsRowStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  };

  const tabStyle = (isActive: boolean) => ({
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
  });

  const tabTextStyle = (isActive: boolean) => ({
    fontSize: 13,
    color: isActive ? NEUMORPHIC_COLORS.light.text : 'rgba(255,255,255,0.7)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: isActive ? '600' as const : '400' as const,
  });

  return (
    <View style={headerStyle}>
      <View style={titleRowStyle}>
        <Text style={titleStyle}>{title}</Text>
        <View style={tabsRowStyle}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={tabStyle(index === activeTab)}
              onPress={() => onTabPress?.(index)}
              activeOpacity={0.7}
            >
              <Text style={tabTextStyle(index === activeTab)}>{tab}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={{ padding: 8 }}>
            <SearchIcon size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Search Icon
const SearchIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={{ width: size, height: size }}>
    <View style={{
      width: size * 0.6,
      height: size * 0.6,
      borderRadius: size * 0.3,
      borderWidth: 2,
      borderColor: color,
    }} />
    <View style={{
      position: 'absolute',
      width: 2,
      height: size * 0.35,
      backgroundColor: color,
      bottom: 0,
      right: size * 0.1,
      transform: [{ rotate: '45deg' }],
    }} />
  </View>
);

// Colorful Pill Buttons (Image 2)
interface PillButtonProps {
  label: string;
  color: string;
  isActive?: boolean;
  onPress?: () => void;
}

export const PillButton: React.FC<PillButtonProps> = ({
  label,
  color,
  isActive = false,
  onPress,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const buttonStyle = {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: color,
    // 3D effect
    shadowColor: color,
    shadowOffset: { width: 0, height: isPressed ? 2 : 6 },
    shadowOpacity: isPressed ? 0.3 : 0.5,
    shadowRadius: isPressed ? 4 : 12,
    elevation: isPressed ? 4 : 10,
    transform: [{ scale: isPressed ? 0.95 : 1 }],
    // Inner highlight
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  };

  const textStyle = {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  };

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      style={buttonStyle}
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
};

// Glassmorphism Card (Image 2)
interface GlassCardProps {
  title: string;
  value: string;
  percentage: number;
  progressColor: string;
  labels?: { left: string[]; right: string[] };
  children?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  title,
  value,
  percentage,
  progressColor,
  labels,
  children,
}) => {
  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    margin: 8,
    flex: 1,
    minWidth: 150,
    // Glassmorphism effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  };

  const titleStyle = {
    fontSize: 14,
    color: '#64748b',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    marginBottom: 4,
  };

  const valueContainerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
  };

  const valueStyle = {
    fontSize: 13,
    color: '#94a3b8',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const percentageStyle = {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const progressTrackStyle = {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden' as const,
    marginBottom: 12,
  };

  const progressBarStyle = {
    height: '100%',
    width: `${Math.min(percentage, 100)}%`,
    backgroundColor: progressColor,
    borderRadius: 4,
    // Gradient shine effect
    shadowColor: progressColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  };

  const labelsRowStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  };

  const labelStyle = {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 16,
  };

  return (
    <View style={cardStyle}>
      <Text style={titleStyle}>{title}</Text>
      <View style={valueContainerStyle}>
        <Text style={valueStyle}>{value}</Text>
        <Text style={percentageStyle}>{percentage}%</Text>
      </View>
      <View style={progressTrackStyle}>
        <View style={progressBarStyle} />
      </View>
      {labels && (
        <View style={labelsRowStyle}>
          <View>
            {labels.left.map((label, i) => (
              <Text key={i} style={labelStyle}>{label}</Text>
            ))}
          </View>
          <View style={{ alignItems: 'flex-end' as const }}>
            {labels.right.map((label, i) => (
              <Text key={i} style={labelStyle}>{label}</Text>
            ))}
          </View>
        </View>
      )}
      {children}
    </View>
  );
};

// Neumorphic Input (for translation screen)
interface NeumorphicInputProps {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  isDark?: boolean;
  multiline?: boolean;
  style?: any;
}

export const NeumorphicContainer: React.FC<{
  children: React.ReactNode;
  style?: any;
  isDark?: boolean;
  isPressed?: boolean;
}> = ({ children, style, isDark = false, isPressed = false }) => {
  const containerStyle = {
    backgroundColor: isDark ? NEUMORPHIC_COLORS.dark.surface : '#f0f4f8',
    borderRadius: 20,
    padding: 16,
    // Neumorphic shadows
    shadowColor: isDark ? '#000' : '#a3b1c6',
    shadowOffset: { width: isPressed ? 2 : 6, height: isPressed ? 2 : 6 },
    shadowOpacity: isDark ? 0.5 : 0.5,
    shadowRadius: isPressed ? 4 : 10,
    elevation: isPressed ? 4 : 8,
    // Inner highlight (simulated with border)
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
    ...style,
  };

  return <View style={containerStyle}>{children}</View>;
};

// Settings Header with back button (Image 1 style)
interface SettingsHeaderProps {
  title: string;
  onBack?: () => void;
  onSettings?: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  title,
  onBack,
  onSettings,
}) => {
  const headerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: NEUMORPHIC_COLORS.dark.background,
  };

  const iconButtonStyle = {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: NEUMORPHIC_COLORS.dark.surface,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  };

  const titleStyle = {
    fontSize: 20,
    fontWeight: '600' as const,
    color: NEUMORPHIC_COLORS.dark.text,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  return (
    <View style={headerStyle}>
      <TouchableOpacity style={iconButtonStyle} onPress={onBack}>
        <BackIcon size={20} color={NEUMORPHIC_COLORS.dark.text} />
      </TouchableOpacity>
      <Text style={titleStyle}>{title}</Text>
      <TouchableOpacity style={iconButtonStyle} onPress={onSettings}>
        <SettingsIcon size={20} color={NEUMORPHIC_COLORS.dark.text} />
      </TouchableOpacity>
    </View>
  );
};

// Back Icon
const BackIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={{ width: size, height: size, justifyContent: 'center' }}>
    <View style={{
      width: size * 0.6,
      height: 2,
      backgroundColor: color,
      transform: [{ rotate: '-45deg' }, { translateY: -3 }],
    }} />
    <View style={{
      width: size * 0.6,
      height: 2,
      backgroundColor: color,
      transform: [{ rotate: '45deg' }, { translateY: 3 }],
    }} />
  </View>
);

// Settings Icon (Gear)
const SettingsIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: size * 0.5,
      height: size * 0.5,
      borderRadius: size * 0.25,
      borderWidth: 2,
      borderColor: color,
    }} />
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <View
        key={i}
        style={{
          position: 'absolute',
          width: size * 0.15,
          height: size * 0.15,
          backgroundColor: color,
          borderRadius: 2,
          transform: [
            { rotate: `${angle}deg` },
            { translateY: -size * 0.4 },
          ],
        }}
      />
    ))}
  </View>
);

export default {
  DarkModeToggle,
  DashboardHeader,
  PillButton,
  GlassCard,
  NeumorphicContainer,
  SettingsHeader,
  NEUMORPHIC_COLORS,
};
