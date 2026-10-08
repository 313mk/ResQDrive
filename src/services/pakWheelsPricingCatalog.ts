/**
 * @file src/services/pakWheelsPricingCatalog.ts
 * @responsibility Single Responsibility: Estimate vehicle component replacement and body-shop
 * repair costs in Pakistani Rupees (PKR) by cross-referencing vehicle registered profile
 * (Make, Model, Year, Variant) against PakWheels & OLX Pakistan automotive marketplace pricing.
 */

import { VehicleProfile, DamagedComponentDetail, AccidentSeverity } from '../types';

interface PartPricingReference {
  oemPricePKR: number;
  kabliOrMarketPricePKR: number;
  laborDentingPaintingPKR: number;
  pakwheelsReferenceUrl: string;
}

// Catalog index indexed by Make -> Model -> PartName
const PAKISTAN_AUTO_PARTS_INDEX: Record<string, Record<string, Record<string, PartPricingReference>>> = {
  Honda: {
    Civic: {
      'Front Bumper': {
        oemPricePKR: 38000,
        kabliOrMarketPricePKR: 24000,
        laborDentingPaintingPKR: 12000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/honda-civic-front-bumper',
      },
      'Right Headlight Assembly': {
        oemPricePKR: 78000,
        kabliOrMarketPricePKR: 45000,
        laborDentingPaintingPKR: 4500,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/honda-civic-headlight',
      },
      'Left Headlight Assembly': {
        oemPricePKR: 78000,
        kabliOrMarketPricePKR: 45000,
        laborDentingPaintingPKR: 4500,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/honda-civic-headlight',
      },
      'Hood / Bonnet': {
        oemPricePKR: 58000,
        kabliOrMarketPricePKR: 36000,
        laborDentingPaintingPKR: 16000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/honda-civic-bonnet',
      },
      'Front Right Fender': {
        oemPricePKR: 28000,
        kabliOrMarketPricePKR: 18000,
        laborDentingPaintingPKR: 9000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/honda-civic-fender',
      },
      'Front Windshield Glass': {
        oemPricePKR: 46000,
        kabliOrMarketPricePKR: 28000,
        laborDentingPaintingPKR: 7000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/honda-civic-windscreen',
      },
      'Rear Bumper': {
        oemPricePKR: 35000,
        kabliOrMarketPricePKR: 22000,
        laborDentingPaintingPKR: 11000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/honda-civic-rear-bumper',
      },
      'Radiator & Condenser Support': {
        oemPricePKR: 42000,
        kabliOrMarketPricePKR: 26000,
        laborDentingPaintingPKR: 8500,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/honda-civic-radiator',
      },
    },
    City: {
      'Front Bumper': {
        oemPricePKR: 24000,
        kabliOrMarketPricePKR: 16000,
        laborDentingPaintingPKR: 9000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/honda-city-front-bumper',
      },
      'Right Headlight Assembly': {
        oemPricePKR: 42000,
        kabliOrMarketPricePKR: 26000,
        laborDentingPaintingPKR: 3500,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/honda-city-headlight',
      },
      'Hood / Bonnet': {
        oemPricePKR: 38000,
        kabliOrMarketPricePKR: 24000,
        laborDentingPaintingPKR: 12000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/honda-city-bonnet',
      },
      'Front Right Fender': {
        oemPricePKR: 19000,
        kabliOrMarketPricePKR: 12000,
        laborDentingPaintingPKR: 7500,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/honda-city-fender',
      },
    },
  },
  Toyota: {
    Corolla: {
      'Front Bumper': {
        oemPricePKR: 26000,
        kabliOrMarketPricePKR: 16000,
        laborDentingPaintingPKR: 8500,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/toyota-corolla-front-bumper',
      },
      'Right Headlight Assembly': {
        oemPricePKR: 36000,
        kabliOrMarketPricePKR: 22000,
        laborDentingPaintingPKR: 3500,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/toyota-corolla-headlight',
      },
      'Hood / Bonnet': {
        oemPricePKR: 44000,
        kabliOrMarketPricePKR: 28000,
        laborDentingPaintingPKR: 13000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/toyota-corolla-bonnet',
      },
      'Front Right Fender': {
        oemPricePKR: 21000,
        kabliOrMarketPricePKR: 13000,
        laborDentingPaintingPKR: 7000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/toyota-corolla-fender',
      },
      'Front Windshield Glass': {
        oemPricePKR: 34000,
        kabliOrMarketPricePKR: 20000,
        laborDentingPaintingPKR: 6000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/toyota-corolla-windscreen',
      },
      'Radiator & Condenser Support': {
        oemPricePKR: 32000,
        kabliOrMarketPricePKR: 19000,
        laborDentingPaintingPKR: 7500,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/toyota-corolla-radiator',
      },
    },
    Yaris: {
      'Front Bumper': {
        oemPricePKR: 22000,
        kabliOrMarketPricePKR: 14000,
        laborDentingPaintingPKR: 8000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/toyota-yaris-front-bumper',
      },
      'Right Headlight Assembly': {
        oemPricePKR: 32000,
        kabliOrMarketPricePKR: 19000,
        laborDentingPaintingPKR: 3500,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/toyota-yaris-headlight',
      },
    },
  },
  Suzuki: {
    Alto: {
      'Front Bumper': {
        oemPricePKR: 11500,
        kabliOrMarketPricePKR: 7000,
        laborDentingPaintingPKR: 5500,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/suzuki-alto-front-bumper',
      },
      'Right Headlight Assembly': {
        oemPricePKR: 13500,
        kabliOrMarketPricePKR: 8500,
        laborDentingPaintingPKR: 2500,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/suzuki-alto-headlight',
      },
      'Hood / Bonnet': {
        oemPricePKR: 19000,
        kabliOrMarketPricePKR: 12000,
        laborDentingPaintingPKR: 8000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/suzuki-alto-bonnet',
      },
      'Front Right Fender': {
        oemPricePKR: 9500,
        kabliOrMarketPricePKR: 6000,
        laborDentingPaintingPKR: 4500,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/suzuki-alto-fender',
      },
      'Front Windshield Glass': {
        oemPricePKR: 16000,
        kabliOrMarketPricePKR: 9500,
        laborDentingPaintingPKR: 4000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/suzuki-alto-windscreen',
      },
    },
    Cultus: {
      'Front Bumper': {
        oemPricePKR: 16000,
        kabliOrMarketPricePKR: 9500,
        laborDentingPaintingPKR: 6500,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/suzuki-cultus-front-bumper',
      },
      'Right Headlight Assembly': {
        oemPricePKR: 18500,
        kabliOrMarketPricePKR: 11000,
        laborDentingPaintingPKR: 3000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/suzuki-cultus-headlight',
      },
    },
  },
  Kia: {
    Sportage: {
      'Front Bumper': {
        oemPricePKR: 48000,
        kabliOrMarketPricePKR: 32000,
        laborDentingPaintingPKR: 14000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/kia-sportage-front-bumper',
      },
      'Right Headlight Assembly': {
        oemPricePKR: 95000,
        kabliOrMarketPricePKR: 58000,
        laborDentingPaintingPKR: 5000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/kia-sportage-headlight',
      },
      'Hood / Bonnet': {
        oemPricePKR: 68000,
        kabliOrMarketPricePKR: 42000,
        laborDentingPaintingPKR: 18000,
        pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories/kia-sportage-bonnet',
      },
    },
  },
};

/**
 * Calculates pricing for a detected component given the user's registered vehicle profile
 */
export function estimateDamagedPartPrice(
  vehicle: VehicleProfile,
  partName: string,
  damageType: 'Scratch / Dent' | 'Crack / Puncture' | 'Crush / Shatter' | 'Structural Misalignment',
  damageSize: 'Small (< 15cm)' | 'Medium (15 - 50cm)' | 'Large / Total Replacement',
  severity: AccidentSeverity
): DamagedComponentDetail {
  const make = vehicle.make in PAKISTAN_AUTO_PARTS_INDEX ? vehicle.make : 'Toyota';
  const modelOptions = PAKISTAN_AUTO_PARTS_INDEX[make] || PAKISTAN_AUTO_PARTS_INDEX['Toyota'];
  const model = vehicle.model in modelOptions ? vehicle.model : Object.keys(modelOptions)[0];
  const partsCatalog = modelOptions[model] || {};

  const pricingRef = partsCatalog[partName] || {
    oemPricePKR: 25000,
    kabliOrMarketPricePKR: 15000,
    laborDentingPaintingPKR: 8000,
    pakwheelsReferenceUrl: 'https://www.pakwheels.com/parts-accessories',
  };

  const isMinor = damageSize === 'Small (< 15cm)' && damageType === 'Scratch / Dent';
  const requiresReplacement = !isMinor && (damageSize === 'Large / Total Replacement' || damageType === 'Crush / Shatter' || partName.includes('Headlight') || partName.includes('Windshield'));

  let partPrice = 0;
  let laborCost = pricingRef.laborDentingPaintingPKR;

  if (requiresReplacement) {
    // If older car or moderate, average OEM and Kabli/market
    const isNewModel = vehicle.year >= 2021;
    partPrice = isNewModel ? pricingRef.oemPricePKR : pricingRef.kabliOrMarketPricePKR;
    laborCost = Math.round(pricingRef.laborDentingPaintingPKR * 0.7); // Fitting + touchup
  } else {
    // Repairable: zero part cost, pure body shop denting/rubbing/paint labor
    partPrice = 0;
    if (damageSize === 'Small (< 15cm)') {
      laborCost = Math.round(pricingRef.laborDentingPaintingPKR * 0.5);
    } else {
      laborCost = pricingRef.laborDentingPaintingPKR;
    }
  }

  return {
    partName,
    damageType,
    damageSize,
    severity,
    partCondition: requiresReplacement ? 'Requires Replacement' : 'Repairable',
    estimatedPartPricePKR: partPrice,
    estimatedLaborPKR: laborCost,
  };
}
