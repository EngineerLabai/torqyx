/**
 * Form Accessibility Utilities
 * 
 * Provides helper functions for building accessible form fields with:
 * - Proper ARIA attributes (aria-required, aria-invalid, aria-describedby)
 * - Error message linking
 * - Label associations
 * - Validation state management
 */

export interface FormFieldAriaProps {
  /** The field's ID (required) */
  fieldId: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field has a validation error */
  hasError?: boolean;
  /** Validation error message */
  errorMessage?: string;
  /** Additional description for the field */
  description?: string;
}

/**
 * Generate ARIA attributes for a form field
 * 
 * @example
 * const ariaProps = getFormFieldAriaProps({
 *   fieldId: 'email',
 *   required: true,
 *   hasError: Boolean(emailError),
 *   errorMessage: emailError,
 * });
 * 
 * return (
 *   <input
 *     id="email"
 *     required={ariaProps.required}
 *     aria-required={ariaProps['aria-required']}
 *     aria-invalid={ariaProps['aria-invalid']}
 *     aria-describedby={ariaProps['aria-describedby']}
 *   />
 * );
 */
export function getFormFieldAriaProps(props: FormFieldAriaProps) {
  const {
    fieldId,
    required = false,
    hasError = false,
    errorMessage,
    description,
  } = props;

  const describedByIds: string[] = [];

  if (hasError && errorMessage) {
    describedByIds.push(`${fieldId}-error`);
  }

  if (description && !hasError) {
    describedByIds.push(`${fieldId}-description`);
  }

  return {
    'aria-required': required ? 'true' : undefined,
    'aria-invalid': hasError ? 'true' : 'false',
    'aria-describedby': describedByIds.length > 0 ? describedByIds.join(' ') : undefined,
  };
}

/**
 * Generate CSS classes for form field validation states
 */
export function getFormFieldClasses(hasError?: boolean, isDisabled?: boolean) {
  const baseClasses = [
    'w-full',
    'rounded-xl',
    'border',
    'bg-white',
    'px-3',
    'py-2',
    'text-sm',
    'text-slate-900',
    'outline-none',
    'transition',
  ];

  if (isDisabled) {
    baseClasses.push('opacity-60', 'cursor-not-allowed', 'bg-slate-50');
  } else if (hasError) {
    baseClasses.push('border-red-300', 'focus:border-red-400', 'focus:ring-2', 'focus:ring-red-100');
  } else {
    baseClasses.push('border-emerald-200', 'focus:border-emerald-400', 'focus:ring-2', 'focus:ring-emerald-100');
  }

  return baseClasses.join(' ');
}

/**
 * Validate email using RFC 5322 simplified regex
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate required field
 */
export function validateRequired(value: string | undefined | null): boolean {
  return Boolean(value && value.trim());
}

/**
 * Validate field length
 */
export function validateLength(
  value: string | undefined | null,
  min?: number,
  max?: number
): boolean {
  const length = value?.trim().length || 0;
  
  if (min !== undefined && length < min) {
    return false;
  }
  
  if (max !== undefined && length > max) {
    return false;
  }
  
  return true;
}

/**
 * Format validation error message with field name
 */
export function formatValidationError(
  fieldName: string,
  errorType: 'required' | 'invalid' | 'length' | 'custom',
  customMessage?: string
): string {
  const messages: Record<string, string> = {
    required: `${fieldName} is required`,
    invalid: `${fieldName} is invalid`,
    length: `${fieldName} has incorrect length`,
    custom: customMessage || 'Invalid input',
  };

  return messages[errorType] || messages.invalid;
}

/**
 * Field state type for form management
 */
export interface FormFieldState {
  value: string;
  error: string;
  touched: boolean;
  disabled?: boolean;
}

/**
 * Initialize form field state
 */
export function initializeFormFieldState(value = '', disabled = false): FormFieldState {
  return {
    value,
    error: '',
    touched: false,
    disabled,
  };
}

/**
 * Update form field state
 */
export function updateFormFieldState(
  state: FormFieldState,
  updates: Partial<FormFieldState>
): FormFieldState {
  return { ...state, ...updates };
}

/**
 * Validate and update form field state
 */
export function validateFormField(
  state: FormFieldState,
  validator: (value: string) => { isValid: boolean; error?: string }
): FormFieldState {
  const validation = validator(state.value);
  return {
    ...state,
    error: validation.isValid ? '' : (validation.error || 'Invalid input'),
    touched: true,
  };
}
