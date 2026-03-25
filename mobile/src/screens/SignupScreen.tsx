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
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { validateEmail, validatePassword, validateFullName, validateMobile } from '../utils/validators';

import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export const SignupScreen: React.FC = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fullNameError) setFullNameError(validateFullName(fullName));
  }, [fullName]);

  useEffect(() => {
    if (emailError) setEmailError(validateEmail(email));
  }, [email]);

  useEffect(() => {
    if (mobileError) setMobileError(validateMobile(mobile));
  }, [mobile]);

  useEffect(() => {
    if (passwordError) setPasswordError(validatePassword(password));
  }, [password]);

  const handleSignup = () => {
    Keyboard.dismiss();
    
    const fnError = validateFullName(fullName);
    const eError = validateEmail(email);
    const mError = validateMobile(mobile);
    const pError = validatePassword(password);
    
    setFullNameError(fnError);
    setEmailError(eError);
    setMobileError(mError);
    setPasswordError(pError);
    
    if (!fnError && !eError && !mError && !pError) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const isFormValid = 
    fullName.trim().length > 0 && 
    email.trim().length > 0 && 
    mobile.trim().length > 0 && 
    password.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top Section */}
            <View style={styles.headerContainer}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>SL</Text>
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join us to protect your income today</Text>
            </View>

            {/* Middle Section */}
            <View style={styles.formContainer}>
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                autoCapitalize="words"
                value={fullName}
                onChangeText={setFullName}
                error={fullNameError}
              />

              <InputField
                label="Mobile Number"
                placeholder="Enter 10-digit mobile number"
                keyboardType="phone-pad"
                value={mobile}
                onChangeText={setMobile}
                error={mobileError}
                maxLength={10}
              />

              <InputField
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                error={emailError}
              />
              
              <InputField
                label="Password"
                placeholder="Create a secure password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                error={passwordError}
              />
            </View>

            {/* Bottom Section */}
            <View style={styles.footerContainer}>
              <PrimaryButton 
                title="Sign Up" 
                onPress={handleSignup} 
                loading={isLoading}
                disabled={!isFormValid && !isLoading}
              />
              
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/login')}>
                  <Text style={styles.loginLink}>Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width > 400 ? 32 : 24,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#EBF8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3182CE',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 16,
  },
  footerContainer: {
    width: '100%',
    marginTop: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#718096',
    fontSize: 15,
  },
  loginLink: {
    color: '#3182CE',
    fontSize: 15,
    fontWeight: '700',
  },
});
