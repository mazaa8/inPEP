import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Chip,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { herediblesService, type Recipe } from '../../services/herediblesService';
import { medicationService, type Prescription } from '../../services/medicationService';
import FoodDrugInteractionWarning from '../../components/heredibles/FoodDrugInteractionWarning';
import { FoodDrugInteractionChecker } from '../../utils/foodDrugInteractions';
import { roleColors } from '../../styles/glassmorphism';

const RecipeDetailPage = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  const patientId = 'b805ec90-e553-4de7-9de0-45f2eb73d1ba'; // Abdeen White

  useEffect(() => {
    fetchRecipeData();
  }, [recipeId]);

  const fetchRecipeData = async () => {
    try {
      setLoading(true);
      const [recipesData, prescriptionsData] = await Promise.all([
        herediblesService.getRecipes(),
        medicationService.getPatientPrescriptions(patientId, 'active'),
      ]);
      
      const foundRecipe = recipesData.find((r: Recipe) => r.id === recipeId);
      setRecipe(foundRecipe || null);
      setPrescriptions(prescriptionsData || []);
    } catch (err) {
      console.error('Failed to load recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/caregiver/heredibles');
  };

  if (loading) {
    return (
      <Layout title="Recipe Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (!recipe) {
    return (
      <Layout title="Recipe Not Found">
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Recipe not found
          </Typography>
          <Button
            variant="contained"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              mt: 2,
              background: roleColors.CAREGIVER.gradient,
              color: 'white',
            }}
          >
            Back to Heredibles
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 50%, #dcedc8 100%)',
      p: 0,
    }}>
      <Layout title="" darkMode={false} themeColor="CAREGIVER">
        {/* Back Button */}
        <Button
          variant="outlined"
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 3,
            borderColor: roleColors.CAREGIVER.primary,
            color: roleColors.CAREGIVER.primary,
            '&:hover': {
              borderColor: roleColors.CAREGIVER.primary,
              bgcolor: 'rgba(76, 175, 80, 0.1)',
            },
          }}
        >
          Back to Heredibles
        </Button>

        {/* Recipe Header */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.15)',
        }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#1b5e20', mb: 2 }}>
            {recipe.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {recipe.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip 
              label={recipe.category} 
              sx={{ bgcolor: '#e8f5e9', color: roleColors.CAREGIVER.primary, fontWeight: 600 }}
            />
            {recipe.cuisine && (
              <Chip 
                label={`🌍 ${recipe.cuisine}`} 
                sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 600 }}
              />
            )}
            <Chip 
              label={recipe.difficulty} 
              sx={{ bgcolor: '#fff3e0', color: '#f57c00', fontWeight: 600 }}
            />
          </Box>

          {/* Food-Drug Interaction Warning */}
          {prescriptions.length > 0 && (() => {
            const ingredients = recipe.ingredients ? JSON.parse(recipe.ingredients) : [];
            const medications = prescriptions.map(p => ({
              name: p.medication.name,
              category: p.medication.category,
            }));
            const interactions = FoodDrugInteractionChecker.checkRecipeInteractions(ingredients, medications);
            return <FoodDrugInteractionWarning interactions={interactions} />;
          })()}

          {/* Recipe Info Grid */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary">
                Prep Time
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: roleColors.CAREGIVER.primary }}>
                {recipe.prepTime} min
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary">
                Cook Time
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: roleColors.CAREGIVER.primary }}>
                {recipe.cookTime} min
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary">
                Servings
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: roleColors.CAREGIVER.primary }}>
                {recipe.servings}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary">
                Difficulty
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: roleColors.CAREGIVER.primary }}>
                {recipe.difficulty}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Nutrition Facts */}
        <Box sx={{ 
          p: 4, 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
          <Typography variant="h5" gutterBottom sx={{ color: roleColors.CAREGIVER.primary, fontWeight: 700 }}>
            📊 Nutrition Facts (per serving)
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={3}>
              <Box sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: '#e8f5e9',
                borderRadius: '12px',
                border: '2px solid #c8e6c9',
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary }}>
                  {recipe.calories}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>Calories</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: '#e8f5e9',
                borderRadius: '12px',
                border: '2px solid #c8e6c9',
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary }}>
                  {recipe.protein.toFixed(0)}g
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>Protein</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: '#e8f5e9',
                borderRadius: '12px',
                border: '2px solid #c8e6c9',
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary }}>
                  {recipe.carbs.toFixed(0)}g
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>Carbs</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: '#e8f5e9',
                borderRadius: '12px',
                border: '2px solid #c8e6c9',
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary }}>
                  {recipe.fiber.toFixed(0)}g
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>Fiber</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Ingredients */}
        <Box sx={{ 
          p: 4, 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
          <Typography variant="h5" gutterBottom sx={{ color: roleColors.CAREGIVER.primary, fontWeight: 700 }}>
            🥗 Ingredients
          </Typography>
          <Box sx={{ 
            bgcolor: '#f1f8f4', 
            borderRadius: '12px', 
            p: 2,
            border: '1px solid #c8e6c9',
            mt: 2,
          }}>
            <List dense>
              {JSON.parse(recipe.ingredients).map((ing: any, idx: number) => (
                <ListItem key={idx}>
                  <ListItemIcon>
                    <Checkbox edge="start" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${ing.amount} ${ing.unit} ${ing.name}`}
                    sx={{ '& .MuiListItemText-primary': { fontWeight: 500 } }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        {/* Instructions */}
        <Box sx={{ 
          p: 4, 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
          <Typography variant="h5" gutterBottom sx={{ color: roleColors.CAREGIVER.primary, fontWeight: 700 }}>
            👨‍🍳 Instructions
          </Typography>
          <List sx={{ 
            bgcolor: '#f1f8f4', 
            borderRadius: '12px', 
            p: 2,
            border: '1px solid #c8e6c9',
            mt: 2,
          }}>
            {JSON.parse(recipe.instructions).map((step: string, idx: number) => (
              <ListItem key={idx} sx={{ alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    minWidth: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: roleColors.CAREGIVER.primary,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    mr: 2,
                    mt: 0.5,
                  }}
                >
                  {idx + 1}
                </Box>
                <ListItemText
                  primary={step}
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '1rem',
                      lineHeight: 1.7,
                    } 
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Chef's Tips */}
        {recipe.tips && (
          <Box sx={{ 
            p: 4, 
            mb: 4,
            bgcolor: '#fff3e0', 
            borderRadius: '20px',
            border: '2px solid #ffe0b2',
          }}>
            <Typography variant="h5" sx={{ color: '#f57c00', fontWeight: 700, mb: 2 }}>
              💡 Chef's Tip
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              {recipe.tips}
            </Typography>
          </Box>
        )}

        {/* Dietary Tags */}
        <Box sx={{ 
          p: 4, 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Dietary Information
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {JSON.parse(recipe.dietaryTags).map((tag: string) => (
              <Chip 
                key={tag} 
                label={tag} 
                sx={{ 
                  bgcolor: '#e8f5e9',
                  color: roleColors.CAREGIVER.primary,
                  fontWeight: 600,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button 
            variant="outlined"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{ 
              flex: 1,
              py: 1.5,
              borderColor: roleColors.CAREGIVER.primary,
              color: roleColors.CAREGIVER.primary,
              fontWeight: 600,
              '&:hover': {
                borderColor: roleColors.CAREGIVER.primary,
                bgcolor: 'rgba(76, 175, 80, 0.1)',
              }
            }}
          >
            Back to Heredibles
          </Button>
          <Button 
            variant="contained"
            onClick={() => window.print()}
            sx={{ 
              flex: 1,
              py: 1.5,
              background: roleColors.CAREGIVER.gradient,
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                background: roleColors.CAREGIVER.gradient,
                opacity: 0.9,
              }
            }}
          >
            🖨️ Print Recipe
          </Button>
        </Box>
      </Layout>
    </Box>
  );
};

export default RecipeDetailPage;
