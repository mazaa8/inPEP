import { createContext, useState, useContext, type ReactNode } from 'react';
import { mealPlans, type Meal } from '../data/mealPlans';

// Defines the structure for a single day's meal plan
export interface DailyMealPlan {
  breakfast: string | null;
  lunch: string | null;
  dinner: string | null;
}

// Defines the structure for the entire week's meal plan
export interface WeeklyMealPlan {
  [day: string]: DailyMealPlan;
}

interface MealPlanContextType {
  availableMeals: Meal[];
  weeklyPlan: WeeklyMealPlan;
  updateMeal: (day: string, mealType: keyof DailyMealPlan, mealId: string) => void;
}

// Create a default weekly plan
const initialWeeklyPlan: WeeklyMealPlan = {
  Monday: { breakfast: 'b1', lunch: 'l1', dinner: 'd1' },
  Tuesday: { breakfast: 'b2', lunch: 'l2', dinner: 'd2' },
  Wednesday: { breakfast: 'b1', lunch: 'l3', dinner: 'd3' },
  Thursday: { breakfast: 'b2', lunch: 'l1', dinner: 'd4' },
  Friday: { breakfast: 'b1', lunch: 'l2', dinner: 'd5' },
  Saturday: { breakfast: 'b2', lunch: 'l3', dinner: 'd1' },
  Sunday: { breakfast: 'b1', lunch: 'l1', dinner: 'd2' },
};

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export const MealPlanProvider = ({ children }: { children: ReactNode }) => {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlan>(initialWeeklyPlan);

  const updateMeal = (day: string, mealType: keyof DailyMealPlan, mealId: string) => {
    setWeeklyPlan(prevPlan => ({
      ...prevPlan,
      [day]: {
        ...prevPlan[day],
        [mealType]: mealId,
      },
    }));
  };

  return (
    <MealPlanContext.Provider value={{ availableMeals: mealPlans, weeklyPlan, updateMeal }}>
      {children}
    </MealPlanContext.Provider>
  );
};

export const useMealPlan = () => {
  const context = useContext(MealPlanContext);
  if (context === undefined) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
};
