import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Template entries for generating realistic journal data
const eventTemplates = {
  Seizure: [
    { title: 'Morning Seizure Episode', content: 'Patient experienced a brief seizure. Duration approximately {duration} seconds. Patient was disoriented for about {recovery} minutes after. Gave medication and helped rest.', moods: ['anxious', 'sad'], tags: 'seizure, medication, morning' },
    { title: 'Seizure During Activity', content: 'Patient had a seizure while {activity}. Lasted about {duration} seconds. Ensured safety and monitored closely during recovery.', moods: ['anxious', 'neutral'], tags: 'seizure, safety, monitoring' },
    { title: 'Mild Seizure - Quick Recovery', content: 'Brief seizure episode. Only lasted about {duration} seconds. Patient recovered quickly but felt tired afterward. Rested for {recovery} hours.', moods: ['sad', 'neutral'], tags: 'seizure, recovery, rest' },
  ],
  Fall: [
    { title: 'Fall in Bathroom', content: 'Patient slipped in the bathroom. {injury}. Added safety measures and will be more vigilant.', moods: ['sad', 'anxious'], tags: 'fall, bathroom, safety' },
    { title: 'Minor Fall', content: 'Patient lost balance while {activity}. {injury}. Checked for injuries and patient is okay.', moods: ['neutral', 'sad'], tags: 'fall, safety, monitoring' },
    { title: 'Fall Prevention', content: 'Patient almost fell but caught themselves. Reviewing home safety measures to prevent future incidents.', moods: ['anxious', 'neutral'], tags: 'fall, prevention, safety' },
  ],
  'Behavioral Change': [
    { title: 'Restless Night', content: 'Patient had trouble sleeping. Woke up several times feeling {emotion}. Provided comfort and stayed until patient fell back asleep.', moods: ['anxious', 'sad'], tags: 'sleep, behavioral, nighttime' },
    { title: 'Mood Changes', content: 'Patient showing signs of {emotion} today. Spent extra time talking and providing emotional support.', moods: ['anxious', 'sad', 'angry'], tags: 'mood, behavioral, support' },
    { title: 'Feeling Frustrated', content: 'Patient expressed frustration about their condition. Was upset about needing help with daily tasks. Talked it through and patient felt better after.', moods: ['angry', 'sad'], tags: 'emotions, behavioral, support' },
  ],
  'Allergic Reaction': [
    { title: 'Mild Allergic Reaction', content: 'Patient showed signs of allergic reaction to {trigger}. Symptoms included {symptoms}. Administered antihistamine and monitored closely.', moods: ['anxious', 'neutral'], tags: 'allergy, medication, monitoring' },
    { title: 'Food Allergy Response', content: 'Patient had reaction after eating {food}. Symptoms resolved after {time} minutes. Updated allergy list.', moods: ['anxious', 'sad'], tags: 'allergy, food, safety' },
  ],
  'General Note': [
    { title: 'Good Day', content: 'Patient was in great spirits today. We spent time {activity}. Patient seemed very engaged and happy. No incidents.', moods: ['happy'], tags: 'positive, activities' },
    { title: 'Routine Check', content: 'Regular daily routine. Patient took all medications on time. Vitals normal. Appetite good. No concerns today.', moods: ['neutral', 'happy'], tags: 'routine, vitals, medication' },
    { title: 'Family Time', content: 'Had wonderful time with family today. Patient was so happy to {activity}. Mood has been excellent all day.', moods: ['happy'], tags: 'family, positive, social' },
    { title: 'Physical Activity', content: 'Great {activity} session today! Patient completed all exercises and showed good progress. Feeling proud and motivated.', moods: ['happy'], tags: 'exercise, positive, activities' },
    { title: 'Medication Adjustment', content: 'Doctor adjusted patient\'s medication dosage. Starting new regimen today. Will monitor closely for any changes or side effects.', moods: ['neutral', 'anxious'], tags: 'medication, doctor, adjustment' },
    { title: 'Doctor Appointment', content: 'Follow-up appointment with doctor. {results}. Doctor is pleased with patient\'s progress.', moods: ['happy', 'neutral'], tags: 'doctor, health, appointment' },
    { title: 'Peaceful Day', content: 'Quiet, peaceful day. Patient spent time {activity}. No incidents. Patient seems content and relaxed.', moods: ['neutral', 'happy'], tags: 'routine, peaceful, activities' },
    { title: 'Social Activity', content: 'Patient enjoyed {activity} today. Was energetic and engaged. Great social interaction!', moods: ['happy'], tags: 'social, positive, activities' },
  ],
};

const activities = ['reading', 'watching TV', 'gardening', 'cooking', 'walking', 'listening to music', 'doing puzzles', 'crafts'];
const emotions = ['anxious', 'worried', 'restless', 'agitated', 'confused'];
const injuries = ['Thankfully no injuries', 'Minor bruising', 'No serious injuries', 'Slight discomfort'];
const results = ['Blood work looks great', 'All tests came back normal', 'Vitals are stable', 'Good progress noted'];
const symptoms = ['rash', 'itching', 'mild swelling', 'redness'];
const triggers = ['new medication', 'food ingredient', 'environmental allergen'];
const foods = ['dairy product', 'nuts', 'shellfish', 'new food item'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function fillTemplate(template: string): string {
  return template
    .replace('{duration}', String(20 + Math.floor(Math.random() * 60)))
    .replace('{recovery}', String(5 + Math.floor(Math.random() * 20)))
    .replace('{activity}', getRandomElement(activities))
    .replace('{emotion}', getRandomElement(emotions))
    .replace('{injury}', getRandomElement(injuries))
    .replace('{results}', getRandomElement(results))
    .replace('{symptoms}', getRandomElement(symptoms))
    .replace('{trigger}', getRandomElement(triggers))
    .replace('{food}', getRandomElement(foods))
    .replace('{time}', String(10 + Math.floor(Math.random() * 30)));
}

async function seedJournalEntries() {
  console.log('🌱 Seeding journal entries for all 101 patient profiles...');

  try {
    // Get all patient profiles with their caregivers
    const patientProfiles = await prisma.patientProfile.findMany({
      include: {
        user: true,
      },
      take: 101,
    });

    if (patientProfiles.length === 0) {
      console.log('❌ No patient profiles found! Please run full database seed first.');
      return;
    }

    console.log(`✅ Found ${patientProfiles.length} patient profiles`);

    // Get all caregiver users
    const caregivers = await prisma.user.findMany({
      where: { role: 'CAREGIVER' },
    });

    if (caregivers.length === 0) {
      console.log('❌ No caregivers found! Please run full database seed first.');
      return;
    }

    console.log(`✅ Found ${caregivers.length} caregivers`);

    // Clear existing journal entries
    await prisma.patientJournalEntry.deleteMany({});
    console.log('🗑️  Cleared existing journal entries');

    let totalEntries = 0;
    const moodCounts = { happy: 0, neutral: 0, sad: 0, anxious: 0, angry: 0 };
    const eventCounts: Record<string, number> = {};

    // Generate journal entries for each patient
    for (let idx = 0; idx < patientProfiles.length; idx++) {
      const patient = patientProfiles[idx];
      // Assign a caregiver (cycle through available caregivers)
      const caregiver = caregivers[idx % caregivers.length];
      
      // Generate 5-15 entries per patient over the last 30 days
      const numEntries = 5 + Math.floor(Math.random() * 11);
      
      for (let i = 0; i < numEntries; i++) {
        // Random date within last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const entryDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        
        // Select random event type (weighted towards General Note)
        const eventTypeRoll = Math.random();
        let eventType: string;
        if (eventTypeRoll < 0.6) eventType = 'General Note';
        else if (eventTypeRoll < 0.75) eventType = 'Behavioral Change';
        else if (eventTypeRoll < 0.85) eventType = 'Seizure';
        else if (eventTypeRoll < 0.93) eventType = 'Fall';
        else eventType = 'Allergic Reaction';
        
        // Get template for this event type
        const templates = eventTemplates[eventType as keyof typeof eventTemplates];
        const template = getRandomElement(templates);
        
        // Fill template with random data
        const title = template.title;
        const content = fillTemplate(template.content);
        const mood = getRandomElement(template.moods);
        const tags = template.tags;
        
        // Create journal entry
        await prisma.patientJournalEntry.create({
          data: {
            patientId: patient.userId,
            caregiverId: caregiver.id,
            title,
            eventType,
            mood,
            content,
            tags,
            entryDate,
            isVisibleToPatient: true,
          },
        });
        
        totalEntries++;
        moodCounts[mood as keyof typeof moodCounts]++;
        eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;
      }
    }

    console.log(`\n✅ Successfully seeded ${totalEntries} journal entries across ${patientProfiles.length} patients`);
    console.log('\n📊 Mood distribution:');
    console.log(`   - Happy: ${moodCounts.happy}`);
    console.log(`   - Neutral: ${moodCounts.neutral}`);
    console.log(`   - Sad: ${moodCounts.sad}`);
    console.log(`   - Anxious: ${moodCounts.anxious}`);
    console.log(`   - Angry: ${moodCounts.angry}`);
    console.log('\n🎯 Event types:');
    Object.entries(eventCounts).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count}`);
    });
  } catch (error) {
    console.error('❌ Error seeding journal entries:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedJournalEntries()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
