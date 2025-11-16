// Get base URL based on environment
export function getBaseUrl() {
  // For production (cPanel)
  if (process.env.NODE_ENV === 'production') {
    return 'https://olisknitwear.com'; // Your domain
  }
  
  // For development
  return 'http://localhost:5000'; // Your backend port
}

// Get full image URL
export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it starts with /, it's a relative path - add base URL
  if (imagePath.startsWith('/')) {
    return `${getBaseUrl()}${imagePath}`;
  }
  
  // If it doesn't start with /, add it
  return `${getBaseUrl()}/${imagePath}`;
}

// Get API URL
export function getApiUrl(endpoint) {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${getBaseUrl()}/api/${cleanEndpoint}`;
}