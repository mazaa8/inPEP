// Food-Drug Interaction Database
// Based on common clinical interactions

export interface FoodDrugInteraction {
  medicationName: string;
  medicationCategory: string;
  foodItem: string;
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
  recommendation: string;
}

export const FOOD_DRUG_INTERACTIONS: FoodDrugInteraction[] = [
  // Statins (Lipitor, Atorvastatin, Crestor)
  {
    medicationName: 'Lipitor',
    medicationCategory: 'statin',
    foodItem: 'grapefruit',
    severity: 'severe',
    description: 'Grapefruit can increase statin levels in blood, raising risk of side effects',
    recommendation: 'Avoid grapefruit and grapefruit juice while taking statins',
  },
  {
    medicationName: 'Atorvastatin',
    medicationCategory: 'statin',
    foodItem: 'grapefruit',
    severity: 'severe',
    description: 'Grapefruit can increase statin levels in blood, raising risk of side effects',
    recommendation: 'Avoid grapefruit and grapefruit juice while taking statins',
  },
  {
    medicationName: 'Crestor',
    medicationCategory: 'statin',
    foodItem: 'grapefruit',
    severity: 'severe',
    description: 'Grapefruit can increase medication levels, raising risk of muscle damage',
    recommendation: 'Avoid grapefruit and grapefruit juice',
  },
  
  // Warfarin (Blood thinner)
  {
    medicationName: 'Warfarin',
    medicationCategory: 'anticoagulant',
    foodItem: 'spinach',
    severity: 'moderate',
    description: 'High vitamin K foods can reduce warfarin effectiveness',
    recommendation: 'Maintain consistent vitamin K intake, don\'t suddenly increase leafy greens',
  },
  {
    medicationName: 'Warfarin',
    medicationCategory: 'anticoagulant',
    foodItem: 'kale',
    severity: 'moderate',
    description: 'High vitamin K foods can reduce warfarin effectiveness',
    recommendation: 'Maintain consistent vitamin K intake',
  },
  {
    medicationName: 'Warfarin',
    medicationCategory: 'anticoagulant',
    foodItem: 'broccoli',
    severity: 'moderate',
    description: 'High vitamin K foods can reduce warfarin effectiveness',
    recommendation: 'Eat in moderation and keep intake consistent',
  },
  {
    medicationName: 'Warfarin',
    medicationCategory: 'anticoagulant',
    foodItem: 'cranberry',
    severity: 'moderate',
    description: 'Cranberries may increase bleeding risk when combined with warfarin',
    recommendation: 'Limit cranberry juice and fresh cranberries',
  },
  
  // Lisinopril (Blood pressure)
  {
    medicationName: 'Lisinopril',
    medicationCategory: 'antihypertensive',
    foodItem: 'banana',
    severity: 'moderate',
    description: 'High potassium foods can cause dangerous potassium buildup',
    recommendation: 'Monitor potassium intake, limit bananas and potassium-rich foods',
  },
  {
    medicationName: 'Lisinopril',
    medicationCategory: 'antihypertensive',
    foodItem: 'avocado',
    severity: 'moderate',
    description: 'High potassium foods can cause dangerous potassium buildup',
    recommendation: 'Eat in moderation',
  },
  {
    medicationName: 'Lisinopril',
    medicationCategory: 'antihypertensive',
    foodItem: 'salt',
    severity: 'minor',
    description: 'High sodium can counteract blood pressure medication',
    recommendation: 'Reduce salt intake for better blood pressure control',
  },
  
  // Metformin (Diabetes)
  {
    medicationName: 'Metformin',
    medicationCategory: 'antidiabetic',
    foodItem: 'alcohol',
    severity: 'severe',
    description: 'Alcohol increases risk of lactic acidosis with metformin',
    recommendation: 'Avoid excessive alcohol consumption',
  },
  
  // Antibiotics
  {
    medicationName: 'Amoxicillin',
    medicationCategory: 'antibiotic',
    foodItem: 'dairy',
    severity: 'minor',
    description: 'Dairy products may reduce antibiotic absorption',
    recommendation: 'Take 1 hour before or 2 hours after dairy products',
  },
];

export class FoodDrugInteractionChecker {
  /**
   * Check if a recipe/food contains ingredients that interact with patient's medications
   */
  static checkRecipeInteractions(
    recipeIngredients: string[],
    patientMedications: { name: string; category?: string }[]
  ): FoodDrugInteraction[] {
    const interactions: FoodDrugInteraction[] = [];

    for (const med of patientMedications) {
      for (const interaction of FOOD_DRUG_INTERACTIONS) {
        // Match by medication name or category
        const medMatches = 
          interaction.medicationName.toLowerCase() === med.name.toLowerCase() ||
          (med.category && interaction.medicationCategory.toLowerCase() === med.category.toLowerCase());

        if (medMatches) {
          // Check if any recipe ingredient contains the problematic food
          const hasProblematicFood = recipeIngredients.some(ingredient =>
            ingredient.toLowerCase().includes(interaction.foodItem.toLowerCase())
          );

          if (hasProblematicFood) {
            interactions.push(interaction);
          }
        }
      }
    }

    return interactions;
  }

  /**
   * Get all potential interactions for a patient's medications
   */
  static getAllInteractionsForMedications(
    patientMedications: { name: string; category?: string }[]
  ): FoodDrugInteraction[] {
    const interactions: FoodDrugInteraction[] = [];

    for (const med of patientMedications) {
      const medInteractions = FOOD_DRUG_INTERACTIONS.filter(
        interaction =>
          interaction.medicationName.toLowerCase() === med.name.toLowerCase() ||
          (med.category && interaction.medicationCategory.toLowerCase() === med.category.toLowerCase())
      );
      interactions.push(...medInteractions);
    }

    // Remove duplicates
    return Array.from(new Map(interactions.map(i => [i.foodItem + i.medicationName, i])).values());
  }

  /**
   * Get severity color for UI display
   */
  static getSeverityColor(severity: string): string {
    switch (severity) {
      case 'severe':
        return '#f44336';
      case 'moderate':
        return '#ff9800';
      case 'minor':
        return '#ffc107';
      default:
        return '#9e9e9e';
    }
  }
}
