import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { validateEmail, validatePassword } from '../utils/validators';

const { width, height } = Dimensions.get('window');

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<'standard' | 'otp'>('standard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  // Clear errors dynamically
  useEffect(() => {
    if (emailError) setEmailError(validateEmail(email));
  }, [email]);

  useEffect(() => {
    if (passwordError) setPasswordError(validatePassword(password));
  }, [password]);

  const handleLogin = () => {
    Keyboard.dismiss();
    
    const eError = validateEmail(email);
    const pError = validatePassword(password);
    
    setEmailError(eError);
    setPasswordError(pError);
    
    if (!eError && !pError) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  const isFormValid = email.trim().length > 0 && password.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.container}
        >
          <View style={styles.scrollContent}>
            
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>Please enter your details to access your dashboard.</Text>
              </View>

              {/* Mode Switcher */}
              <View style={styles.modeSwitcherContainer}>
                <TouchableOpacity 
                  activeOpacity={0.8}
                  style={[styles.modeTab, loginMode === 'standard' && styles.modeTabActive]}
                  onPress={() => setLoginMode('standard')}
                >
                  <Text style={[styles.modeTabText, loginMode === 'standard' && styles.modeTabTextActive]}>
                    Standard
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  activeOpacity={0.8}
                  style={[styles.modeTab, loginMode === 'otp' && styles.modeTabActive]}
                  onPress={() => setLoginMode('otp')}
                >
                  <Text style={[styles.modeTabText, loginMode === 'otp' && styles.modeTabTextActive]}>
                    OTP / SMS
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Form Content */}
              <View style={styles.formContainer}>
                {loginMode === 'standard' ? (
                  <>
                    <InputField
                      label="Username or Email"
                      placeholder="name@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={email}
                      onChangeText={setEmail}
                      error={emailError}
                      leftIcon="at-sign"
                    />
                    
                    <InputField
                      label="Password"
                      placeholder="••••••••"
                      isPassword
                      value={password}
                      onChangeText={setPassword}
                      error={passwordError}
                      leftIcon="lock"
                      rightLabel="Forgot Password?"
                      onRightLabelPress={() => console.log('Forgot Password pressed')}
                    />
                  </>
                ) : (
                  <InputField
                    label="Mobile Number"
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    leftIcon="phone"
                  />
                )}
              </View>

              <PrimaryButton 
                title="Login to Dashboard" 
                onPress={handleLogin} 
                loading={isLoading}
                disabled={loginMode === 'standard' && !isFormValid && !isLoading}
                style={styles.loginButton}
              />
              
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>SECURE GATEWAY</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>New to Survival Lens? </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/signup')}>
                  <Text style={styles.footerLink}>Create an account</Text>
                </TouchableOpacity>
              </View>
            </View>
            
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8FA', // subtle blue-grey background
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 450, // restrict width on larger devices
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    // Add soft shadow
    shadowColor: '#1A202C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
  modeSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  modeTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  modeTabTextActive: {
    color: '#0052FF',
  },
  formContainer: {
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: '#0052FF', // matches mockup brand blue
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#0052FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.5,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#475569',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0052FF',
  },
});
