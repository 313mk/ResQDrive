-- ResQDrive PostgreSQL Database Schema
-- Final Year Project: Air University Islamabad (AU)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Role-Based Access)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('driver', 'mechanic', 'admin')),
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Registered Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    variant VARCHAR(100),
    car_type VARCHAR(30) NOT NULL,
    color VARCHAR(30),
    license_plate VARCHAR(30) UNIQUE NOT NULL,
    insurance_company VARCHAR(100),
    policy_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Emergency Contacts Table (Max 5 Contacts with Priority Escalation)
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    relationship VARCHAR(50) NOT NULL,
    priority INT NOT NULL CHECK (priority BETWEEN 1 AND 5),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_priority UNIQUE (user_id, priority)
);

-- 4. Collision Incidents Table
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Minor', 'Moderate', 'Severe')),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    peak_g_force DECIMAL(5, 2) NOT NULL,
    speed_drop_kmh INT DEFAULT 0,
    detection_source VARCHAR(30) NOT NULL CHECK (detection_source IN ('iot_esp32', 'mobile_sensor', 'simulation')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('countdown', 'escalating', 'acknowledged', 'cancelled_false_alarm', 'resolved')),
    acknowledged_by VARCHAR(100),
    false_alarm_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. AI Damage Assessment & PakWheels Pricing Table
CREATE TABLE IF NOT EXISTS damage_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    damaged_zone VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    confidence_score DECIMAL(5, 2) NOT NULL,
    total_parts_cost_pkr INT NOT NULL,
    total_labor_cost_pkr INT NOT NULL,
    grand_total_pkr INT NOT NULL,
    parts_breakdown JSONB NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Pakistan Regional Emergency Service Directory
CREATE TABLE IF NOT EXISTS rescue_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    short_code VARCHAR(10) NOT NULL,
    helpline_11_digit VARCHAR(20) NOT NULL,
    is_auto_callable_11_digit BOOLEAN DEFAULT TRUE,
    priority_order INT NOT NULL
);
