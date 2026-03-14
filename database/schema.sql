-- PostgreSQL schema for AgriGuardian AI

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    village VARCHAR(255),
    preferred_language VARCHAR(50) DEFAULT 'english',
    farm_size DECIMAL(10,2),
    crops_grown TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP table for authentication
CREATE TABLE otps (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pest reports table
CREATE TABLE pest_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    pest_type VARCHAR(255),
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high')),
    description TEXT,
    image_url VARCHAR(500),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crop health data table
CREATE TABLE crop_health_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    ndvi_value DECIMAL(5,4),
    stress_level VARCHAR(20) CHECK (stress_level IN ('healthy', 'moderate', 'high')),
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat history table
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    response TEXT,
    is_voice BOOLEAN DEFAULT FALSE,
    language VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_otps_phone_expires ON otps(phone_number, expires_at);
CREATE INDEX idx_pest_reports_location ON pest_reports(latitude, longitude);
CREATE INDEX idx_crop_health_user ON crop_health_data(user_id);
CREATE INDEX idx_chat_user ON chat_history(user_id);