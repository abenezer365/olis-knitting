// Sign In
const signin = {
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}

// Sign Up
const signup = {
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "password": "SecurePass123!",
  "role": "admin"
}

// Customer
const customer = {
  "first_name": "Sarah",
  "last_name": "Johnson",
  "email": "sarah.johnson@example.com",
  "phone": "+15551234567"
}

// Initial Rate
const rateSQL = `INSERT INTO currency_rates 
  (uuid, current_rate, reason, previous_rate)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 55.0000, 'Initial rate', NULL);`