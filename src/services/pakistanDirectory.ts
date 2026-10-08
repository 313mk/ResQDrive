/**
 * @file src/services/pakistanDirectory.ts
 * @responsibility Single Responsibility: Maintain official emergency service directories
 * for Pakistan (Rescue 1122, Edhi, Chhipa, Motorway Police) with 11-digit direct dial logic
 * and regional hospital/workshop mapping.
 */

import { PakistanRescueService, HospitalInfo, WorkshopInfo } from '../types';

export const PAKISTAN_RESCUE_SERVICES: PakistanRescueService[] = [
  {
    name: 'Rescue 1122 (Punjab & Islamabad)',
    description: 'Premier emergency ambulance, fire & disaster response service',
    region: 'Islamabad',
    shortCode: '1122',
    fullHelpline11Digit: '0519255555',
    isAutoCallable11Digit: true,
    priorityOrder: 1,
  },
  {
    name: 'Rescue 1122 (Lahore / Punjab HQ)',
    description: 'Punjab Emergency Service Central Operations Command',
    region: 'Punjab',
    shortCode: '1122',
    fullHelpline11Digit: '04299231122',
    isAutoCallable11Digit: true,
    priorityOrder: 2,
  },
  {
    name: 'Edhi Ambulance Service (National / Sindh HQ)',
    description: 'World’s largest volunteer ambulance fleet operating across Pakistan',
    region: 'Sindh',
    shortCode: '115',
    fullHelpline11Digit: '02132310066',
    isAutoCallable11Digit: true,
    priorityOrder: 3,
  },
  {
    name: 'Chhipa Ambulance Service (Karachi / Sindh)',
    description: 'Rapid 24/7 emergency trauma evacuation & first aid in Sindh',
    region: 'Sindh',
    shortCode: '1020',
    fullHelpline11Digit: '021111102020',
    isAutoCallable11Digit: true,
    priorityOrder: 4,
  },
  {
    name: 'Rescue 1122 (Khyber Pakhtunkhwa)',
    description: 'Khyber Pakhtunkhwa Provincial Emergency Service Headquarters',
    region: 'KPK',
    shortCode: '1122',
    fullHelpline11Digit: '0919211122',
    isAutoCallable11Digit: true,
    priorityOrder: 5,
  },
  {
    name: 'National Highways & Motorway Police (NH&MP)',
    description: 'Inter-city motorway collision response and highway patrol',
    region: 'National',
    shortCode: '130',
    fullHelpline11Digit: '0519277021',
    isAutoCallable11Digit: true,
    priorityOrder: 6,
  },
];

export const PAKISTAN_HOSPITALS: HospitalInfo[] = [
  {
    id: 'hosp-1',
    name: 'Pakistan Institute of Medical Sciences (PIMS)',
    city: 'Islamabad',
    distanceKm: 2.4,
    etaMinutes: 6,
    hasTraumaCenter: true,
    phone: '0519261170',
    address: 'G-8/3, Sector G-8, Islamabad',
    lat: 33.7027,
    lng: 73.0569,
  },
  {
    id: 'hosp-2',
    name: 'Shifa International Hospital',
    city: 'Islamabad',
    distanceKm: 4.8,
    etaMinutes: 11,
    hasTraumaCenter: true,
    phone: '0518463000',
    address: 'Pitras Bukhari Rd, Sector H-8/4, Islamabad',
    lat: 33.6781,
    lng: 73.0768,
  },
  {
    id: 'hosp-3',
    name: 'Holy Family Hospital Trauma Center',
    city: 'Rawalpindi',
    distanceKm: 7.2,
    etaMinutes: 16,
    hasTraumaCenter: true,
    phone: '0519290321',
    address: 'Murree Rd, Satellite Town, Rawalpindi',
    lat: 33.6358,
    lng: 73.0645,
  },
  {
    id: 'hosp-4',
    name: 'Mayo Hospital Emergency Department',
    city: 'Lahore',
    distanceKm: 3.1,
    etaMinutes: 9,
    hasTraumaCenter: true,
    phone: '04299211100',
    address: 'Hospital Rd, Anarkali Bazaar, Lahore',
    lat: 31.5714,
    lng: 74.3149,
  },
  {
    id: 'hosp-5',
    name: 'Aga Khan University Hospital (AKUH)',
    city: 'Karachi',
    distanceKm: 5.6,
    etaMinutes: 14,
    hasTraumaCenter: true,
    phone: '021111911911',
    address: 'National Stadium Rd, Karachi',
    lat: 24.8934,
    lng: 67.0759,
  },
];

export const PAKISTAN_WORKSHOPS: WorkshopInfo[] = [
  {
    id: 'ws-1',
    name: 'Islamabad 3S Auto Body Center & Paint Lab',
    city: 'Islamabad',
    rating: 4.9,
    distanceKm: 3.2,
    specialization: 'Structural Denting, Frame Alignment & Oven Paint',
    phone: '03005559812',
    address: 'Street 7, I-9/2 Industrial Area, Islamabad',
    isVerified: true,
  },
  {
    id: 'ws-2',
    name: 'Rawal Precision Collision Workshop',
    city: 'Rawalpindi',
    rating: 4.8,
    distanceKm: 5.1,
    specialization: 'Accident Recovery, Suspension & Airbag Reset',
    phone: '03125143399',
    address: 'Peshawar Road near Westridge, Rawalpindi',
    isVerified: true,
  },
  {
    id: 'ws-3',
    name: 'Toyota & Honda Certified Body Repairs',
    city: 'Islamabad',
    rating: 4.7,
    distanceKm: 6.4,
    specialization: 'OEM Parts Replacement & Insurance Claim Survey',
    phone: '03335198822',
    address: 'Main Blue Area, Islamabad',
    isVerified: true,
  },
];

/**
 * Trigger native cellular dialer with telephone URI
 */
export function triggerNativePhoneCall(phoneNumber: string): void {
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
  if (typeof window !== 'undefined') {
    window.location.href = `tel:${cleanNumber}`;
  }
}

/**
 * Format and trigger direct SMS to emergency contact with GPS location
 */
export function triggerEmergencySms(
  phoneNumber: string,
  userName: string,
  vehiclePlate: string,
  severity: string,
  lat: number,
  lng: number,
  trackingUrl: string
): void {
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
  const mapsLink = `https://maps.google.com/?q=${lat.toFixed(5)},${lng.toFixed(5)}`;
  const message = `[RESQDRIVE ALERT] ${userName} has been involved in a ${severity} car accident. Vehicle: ${vehiclePlate}. Location: ${mapsLink}. Live Tracking & Status: ${trackingUrl}`;

  if (typeof window !== 'undefined') {
    // Standard RFC 5724 SMS URI format
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIos ? '&' : '?';
    window.open(`sms:${cleanNumber}${separator}body=${encodeURIComponent(message)}`, '_blank');
  }
}
