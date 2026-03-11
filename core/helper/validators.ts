export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  
  // Basic validation for email format: something@something.something
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formats a number as Colombian Pesos (COP).
 * e.g. 45000 → "$45.000"  |  120500 → "$120.500"
 */
export const formatCOP = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
