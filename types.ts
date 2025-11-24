export enum PropertyType {
  URBAN = 'URBANO',
  RURAL = 'RURAL',
}

export interface PropertyData {
  type: PropertyType;
  city: string;
  state: string;
  address?: string; // Required for Urban now, technically optional for interface but enforced in UI
  areaTotal: number; // m² or hectares
  areaBuilt?: number; // m²
  description: string;

  // Urban Specifics
  urbanSubType?: string; // Apartamento, Casa, etc.
  neighborhood?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  conservationState?: string;

  // Rural Specifics
  ruralActivity?: string; // Lavoura, Pasto...
  carNumber?: string; // Optional
  surface?: string; // Seca, alagadiça...
  access?: string; // Ótimo, Bom...
  topography?: string; // Plano, Leve Ondulado...
  occupation?: string; // Alta, Média...
  improvements?: string; // Benfeitorias classification
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ValuationResult {
  reportText: string; // The generated markdown report
  sources: GroundingSource[];
  estimatedValue: string;
}

export enum AppStep {
  SELECTION = 0,
  FORM = 1,
  LOADING = 2,
  RESULT = 3,
}