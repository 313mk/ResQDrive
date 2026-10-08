/**
 * @file src/types/index.ts
 * @responsibility Single Responsibility: Define all core domain types, data models,
 * telemetry interfaces, and state structures for the ResQDrive platform.
 */

export type UserRole = 'driver' | 'mechanic' | 'admin' | 'tracker';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  token?: string;
  avatarUrl?: string;
}

export type AccidentSeverity = 'Minor' | 'Moderate' | 'Severe';

export interface SensorTelemetry {
  accelX: number; // in g
  accelY: number; // in g
  accelZ: number; // in g
  totalGForce: number; // sqrt(x^2 + y^2 + z^2)
  gyroX: number; // deg/sec
  gyroY: number; // deg/sec
  gyroZ: number; // deg/sec
  speedKmH: number; // Current GPS speed
  speedDeltaKmH: number; // Deceleration rate
  timestamp: number;
}

export type SensorSource = 'iot_esp32' | 'mobile_sensor' | 'simulation';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string; // E.g., 03001234567 (11-digit Pakistani mobile number)
  email: string;
  relationship: string;
  priority: number; // 1 (Primary / Instant) to 5
  isPrimary?: boolean;
}

export interface VehicleProfile {
  make: string; // e.g., "Honda", "Toyota", "Suzuki", "Kia"
  model: string; // e.g., "Civic", "Corolla", "Alto", "Sportage"
  year: number; // e.g., 2022
  variant: string; // e.g., "1.8 i-VTEC Oriel", "1.6 Altis", "660cc VXR"
  carType: 'Sedan' | 'Hatchback' | 'SUV' | 'Crossover';
  color: string;
  licensePlate: string; // e.g., "ICT-LE-2022"
  insuranceCompany: string; // e.g., "EFU General Insurance", "Adamjee Insurance", "Jubilee General"
  policyNumber: string;
}

export interface PakistanRescueService {
  name: string;
  description: string;
  region: 'Punjab' | 'Islamabad' | 'Sindh' | 'KPK' | 'Balochistan' | 'National';
  shortCode: string; // e.g., "1122", "115", "1020", "130"
  fullHelpline11Digit: string; // e.g., "0519255555", "04299231122", "02132310066"
  isAutoCallable11Digit: boolean;
  priorityOrder: number;
}

export interface DamagedComponentDetail {
  partName: string; // e.g., "Front Bumper", "Right Headlight Assembly", "Hood / Bonnet"
  damageType: 'Scratch / Dent' | 'Crack / Puncture' | 'Crush / Shatter' | 'Structural Misalignment';
  damageSize: 'Small (< 15cm)' | 'Medium (15 - 50cm)' | 'Large / Total Replacement';
  severity: AccidentSeverity;
  partCondition: 'Repairable' | 'Requires Replacement';
  estimatedPartPricePKR: number; // Based on PakWheels / local market catalogue
  estimatedLaborPKR: number;
}

export interface DamageAssessmentResult {
  id: string;
  vehicleSnapshot: VehicleProfile;
  overallSeverity: AccidentSeverity;
  damagedZone: 'Front' | 'Rear' | 'Left Side' | 'Right Side' | 'Roof / Glass';
  confidenceScore: number; // e.g., 94.2%
  components: DamagedComponentDetail[];
  totalPartsCostPKR: number;
  totalLaborCostPKR: number;
  grandTotalPKR: number;
  imageUrl?: string;
  scrapedMarketplaceReference: string; // "PakWheels & Local OEM Automotive Parts Index (Rawalpindi/Islamabad/Lahore)"
  createdAt: string;
}

export interface HospitalInfo {
  id: string;
  name: string;
  city: string;
  distanceKm: number;
  etaMinutes: number;
  hasTraumaCenter: boolean;
  phone: string;
  address: string;
  lat: number;
  lng: number;
}

export interface WorkshopInfo {
  id: string;
  name: string;
  city: string;
  rating: number;
  distanceKm: number;
  specialization: string;
  phone: string;
  address: string;
  isVerified: boolean;
}

export interface IncidentRecord {
  id: string;
  timestamp: number;
  dateTimeStr: string;
  status: 'countdown' | 'escalating' | 'acknowledged' | 'cancelled_false_alarm' | 'resolved';
  severity: AccidentSeverity;
  coordinates: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    province: string;
  };
  sensorSnapshot: SensorTelemetry;
  detectionSource: SensorSource;
  vehicle: VehicleProfile;
  contactsNotified: {
    contactId: string;
    contactName: string;
    phone: string;
    calledAt?: number;
    smsDelivered: boolean;
    emailDelivered: boolean;
    acknowledged: boolean;
  }[];
  activeCallTarget?: {
    name: string;
    phone: string;
    priority: number;
    remainingSeconds: number;
  };
  acknowledgedBy?: string;
  falseAlarmReason?: string;
  damageAssessment?: DamageAssessmentResult;
  hospitalNavigated?: string;
}
