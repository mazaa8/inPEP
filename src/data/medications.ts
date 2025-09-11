export interface Medication {
  id: string;
  name: string;
  dosage: string;
  description: string;
  alternatives: Medication[];
  frequency: 'daily' | 'twice daily' | 'every 8 hours';
  timing: ('morning' | 'afternoon' | 'evening' | 'bedtime' | 'with food')[];
  interactions: string[]; // List of medication IDs it interacts with
  stock: number;
}

export const medications: Medication[] = [
  {
    id: 'med1',
    name: 'Lipitor',
    dosage: '20mg',
    description: 'Used to lower cholesterol and triglycerides in the blood.',
    frequency: 'daily',
    timing: ['bedtime'],
    interactions: ['med4'], // Interacts with Warfarin
    stock: 30,
    alternatives: [
      {
        id: 'alt1-1',
        name: 'Atorvastatin',
        dosage: '20mg',
        description: 'Generic equivalent of Lipitor.',
        frequency: 'daily',
        timing: ['bedtime'],
        interactions: ['med4'],
        stock: 30,
        alternatives: [],
      },
      {
        id: 'alt1-2',
        name: 'Crestor',
        dosage: '10mg',
        description: 'Another statin medication used to lower cholesterol.',
        frequency: 'daily',
        timing: ['bedtime'],
        interactions: ['med4'],
        stock: 30,
        alternatives: [],
      },
    ],
  },
  {
    id: 'med2',
    name: 'Metformin',
    dosage: '500mg',
    description: 'Used to treat type 2 diabetes.',
    frequency: 'twice daily',
    timing: ['morning', 'evening', 'with food'],
    interactions: [],
    stock: 60,
    alternatives: [],
  },
  {
    id: 'med3',
    name: 'Lisinopril',
    dosage: '10mg',
    description: 'Used to treat high blood pressure.',
    frequency: 'daily',
    timing: ['morning'],
    interactions: [],
    stock: 25,
    alternatives: [],
  },
  {
    id: 'med4',
    name: 'Warfarin',
    dosage: '5mg',
    description: 'Blood thinner to prevent clots.',
    frequency: 'daily',
    timing: ['evening'],
    interactions: ['med1'], // Interacts with Lipitor
    stock: 10,
    alternatives: [],
  },
  {
    id: 'med5',
    name: 'Amoxicillin',
    dosage: '250mg',
    description: 'Antibiotic for infections.',
    frequency: 'every 8 hours',
    timing: [],
    interactions: [],
    stock: 4,
    alternatives: [],
  },
];
