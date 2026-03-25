import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string | null;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightLabel?: string;
  onRightLabelPress?: () => void;
  isPassword?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  error, 
  leftIcon, 
  rightLabel, 
  onRightLabelPress,
  isPassword,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {rightLabel ? (
          <TouchableOpacity onPress={onRightLabelPress} activeOpacity={0.7}>
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      
      <View style={[
        styles.inputContainer, 
        isFocused && styles.inputFocused,
        error ? styles.inputError : null
      ]}>
        {leftIcon && (
          <Feather 
            name={leftIcon} 
            size={20} 
            color="#A0AEC0" 
            style={styles.leftIcon} 
          />
        )}
        
        <TextInput
          style={[styles.input, leftIcon ? { paddingLeft: 10 } : null]}
          placeholderTextColor="#A0AEC0"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIcon}
          >
            <Feather 
              name={isPasswordVisible ? "eye-off" : "eye"} 
              size={20} 
              color="#A0AEC0" 
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5568',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rightLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0052FF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F1F5F9', // light gray background
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: 'transparent', // No border by default like mockup
  },
  inputFocused: {
    borderColor: '#0052FF',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#E53E3E',
  },
  leftIcon: {
    marginLeft: 16,
  },
  rightIcon: {
    padding: 10,
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
});
