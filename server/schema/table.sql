CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (name)
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  category_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  image VARCHAR(255),
  other_images JSON,
  available_colors JSON,
  available_sizes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX (name),
  INDEX (price),
  INDEX (category_id),

  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX (email),
  INDEX (status)
);

CREATE TABLE shipping_fee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  country_name VARCHAR(100) NOT NULL,
  country_code VARCHAR(10) NOT NULL,
  starting_price DECIMAL(10,2) NOT NULL,
  maximum_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (country_name),
  INDEX (country_code)
);


CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  
  customer_id INT NOT NULL,
  shipping_fee_id INT NOT NULL,
  
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  order_status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
  delivery_status ENUM('not_shipped', 'in_transit', 'delivered', 'returned') DEFAULT 'not_shipped',
  
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('cash_on_delivery', 'credit_card', 'paypal', 'bank_transfer') DEFAULT 'bank_transfer',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX (uuid),
  INDEX (customer_id),
  INDEX (payment_status),
  INDEX (order_status),
  INDEX (delivery_status),
  
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  FOREIGN KEY (shipping_fee_id) REFERENCES shipping_fee(id) ON DELETE SET NULL;
);

CREATE TABLE ordered_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantity * price) STORED,

  INDEX (order_id),
  INDEX (product_id),

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


CREATE TABLE shipping_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  
  order_id INT NOT NULL,
  customer_id INT NOT NULL,
  
  country VARCHAR(100) DEFAULT 'Ethiopia',
  city VARCHAR(100) NOT NULL,
  sub_city VARCHAR(100),
  street VARCHAR(150),
  house_number VARCHAR(50),
  postal_code VARCHAR(20),
  phone_number VARCHAR(20),
  additional_info TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX (order_id),
  INDEX (customer_id),
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(150),
  message TEXT NOT NULL,
  reply TEXT,
  
  replied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX (email),
  INDEX (created_at)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  
  role ENUM('admin', 'manager', 'employee') DEFAULT 'employee',
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX (email),
  INDEX (role),
  INDEX (status)
);

CREATE TABLE currency_rates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  current_rate DECIMAL(10,4) NOT NULL,
  reason VARCHAR(255) DEFAULT NULL,
  previous_rate DECIMAL(10,4) DEFAULT NULL,
  change_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX(current_rate)
);

CREATE TABLE revenue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  
  total_revenue DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  month_revenue DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  previous_month_revenue DECIMAL(15,2) DEFAULT 0.00,
  week_revenue DECIMAL(15,2) DEFAULT 0.00,
  daily_revenue DECIMAL(15,2) DEFAULT 0.00,
  
  revenue_source VARCHAR(100) DEFAULT 'General',
  calculation_period VARCHAR(20) DEFAULT 'Monthly',
  
  monthly_trend JSON DEFAULT NULL,
  
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,

  total_revenue DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  total_orders INT NOT NULL DEFAULT 0,
  total_products INT NOT NULL DEFAULT 0,
  total_customers INT NOT NULL DEFAULT 0,

  sales_data JSON DEFAULT NULL,
  revenue_data JSON DEFAULT NULL, 

  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

