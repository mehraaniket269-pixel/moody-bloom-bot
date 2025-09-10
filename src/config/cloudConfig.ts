// Google Cloud Configuration
export const cloudConfig = {
  // Gemini AI Configuration
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    model: 'gemini-1.5-flash',
    temperature: 0.7,
    maxTokens: 250
  },
  
  // Firebase Configuration (for future scaling)
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  },
  
  // Cloud Analytics Configuration
  analytics: {
    enabled: true,
    trackingId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID
  }
};

// Validate required configurations
export const validateCloudConfig = () => {
  const errors = [];
  
  if (!cloudConfig.gemini.apiKey) {
    errors.push('Missing VITE_GEMINI_API_KEY - Required for AI functionality');
  }
  
  if (errors.length > 0) {
    console.warn('Cloud Configuration Issues:', errors);
    return false;
  }
  
  return true;
};