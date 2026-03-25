export interface SignupInput {
  fullName?: string;
  mobile?: string;
  email?: string;
  password?: string;
}

export interface LoginInput {
  email?: string;
  mobile?: string;
  password?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateSignupInput = ({ fullName, mobile, email, password }: SignupInput): ValidationResult => {
  const errors: string[] = [];

  if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
    errors.push('Full name is required');
  }

  if (!mobile || !/^\d{10}$/.test(mobile)) {
    errors.push('Valid 10-digit mobile number is required');
  }

  if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    errors.push('Valid email address is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateLoginInput = ({ email, mobile, password }: LoginInput): ValidationResult => {
  const errors: string[] = [];

  const hasValidEmail = email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const hasValidMobile = mobile && /^\d{10}$/.test(mobile);

  if (!hasValidEmail && !hasValidMobile) {
    errors.push('Valid email or 10-digit mobile number is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
