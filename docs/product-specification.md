# Super Coach Pro - Product Specification

## 1. Executive Summary

Super Coach Pro is a modern, AI-powered fitness application designed to help users create, manage, and track their workout routines and meal plans. The application combines personalized AI recommendations with comprehensive planning and tracking tools to support users in achieving their fitness goals.

### 1.1 Product Vision
To provide users with an intelligent, user-friendly platform that simplifies fitness planning and tracking while leveraging AI to deliver personalized workout and nutrition recommendations.

### 1.2 Target Audience
- Fitness enthusiasts seeking structured workout and meal planning
- Individuals looking to track their fitness progress over time
- Users who want AI-powered personalized fitness recommendations
- People who prefer digital tools for organizing their fitness routines

## 2. Product Overview

### 2.1 Core Value Proposition
Super Coach Pro enables users to:
- Create and customize workout routines with detailed exercise specifications
- Design meal plans with nutritional tracking
- Schedule workouts and meals on a calendar
- Track workouts in real-time with live workout mode
- Receive AI-powered fitness and nutrition recommendations
- Monitor progress over time

### 2.2 Key Differentiators
- **AI Integration**: OpenAI-powered chat assistant provides personalized recommendations
- **Live Workout Tracking**: Real-time workout mode with set tracking and rest timers
- **Comprehensive Planning**: Integrated workout and meal planning with calendar scheduling
- **Modern Tech Stack**: Built with React 19, TypeScript, Cloudflare Workers, and Supabase
- **User-Centric Design**: Clean, responsive UI built with shadcn/ui components

## 3. Features and Functionality

### 3.1 User Authentication

#### 3.1.1 Authentication Methods
- **Email/Password Authentication**: Standard sign-up and sign-in flow
- **Session Management**: Persistent sessions with automatic token refresh
- **Protected Routes**: Route-level authentication guards

#### 3.1.2 User Management
- User registration with email verification (via Supabase)
- Secure password authentication
- Session persistence across browser sessions
- Sign-out functionality

**Technical Implementation:**
- Supabase Auth for authentication
- JWT tokens for API authentication
- Row-level security (RLS) for data protection
- AuthContext for React state management

### 3.2 Workout Planner

#### 3.2.1 Workout Creation
Users can create custom workout routines with the following capabilities:

**Workout Structure:**
- **Name**: Custom workout name
- **Description**: Optional description text
- **Exercises**: Multiple exercises per workout
- **Estimated Duration**: Workout duration in minutes (supports decimal values)

**Exercise Configuration:**
- **Exercise Selection**: Choose from predefined exercise library
- **Exercise Types**: Strength, Cardio, Flexibility, Other
- **Exercise Details**:
  - Exercise name and description
  - Muscle groups targeted
  - Equipment required
  - Default weight type (kg, lbs, bodyweight)

**Set Configuration:**
- **Multiple Sets**: Configure multiple sets per exercise
- **Set Parameters**:
  - Weight (optional, for strength exercises)
  - Reps (optional, for strength exercises)
  - Duration (optional, for timed exercises, in seconds)
  - Distance (optional, for cardio exercises, in meters)
  - Weight type: kg, lbs, or bodyweight
- **Rest Periods**: Configurable rest time between sets (in seconds)
- **Notes**: Optional notes per exercise

#### 3.2.2 Workout Management
- **Create**: Build new workout routines
- **Edit**: Modify existing workouts
- **Delete**: Remove workouts
- **View**: Display workout details and preview
- **List**: View all user's workouts

#### 3.2.3 Exercise Library
Predefined exercise database including:
- Bench Press
- Barbell Squat
- Deadlift
- Pull-up
- Running
- And more...

Each exercise includes:
- Category classification
- Equipment requirements
- Muscle groups targeted
- Default weight type

### 3.3 Diet Planner

#### 3.3.1 Meal Plan Creation
Users can design comprehensive meal plans with nutritional tracking:

**Meal Plan Structure:**
- **Name**: Custom meal plan name
- **Description**: Optional description
- **Meals**: Multiple meals per day organized by meal type

**Meal Types:**
- Breakfast
- Morning Snack
- Lunch
- Afternoon Snack
- Dinner
- Evening Snack

**Meal Configuration:**
- **Meal Name**: Custom meal name
- **Scheduled Time**: Time of day (HH:mm format)
- **Food Items**: Multiple food items per meal

**Food Item Details:**
- **Food Name**: Name of the food item
- **Portion Size**: Quantity of food
- **Unit**: Measurement unit (g, ml, oz, cup, piece)
- **Nutritional Information**:
  - Calories
  - Protein (grams)
  - Carbohydrates (grams)
  - Fat (grams)
  - Fiber (optional, grams)

**Nutritional Tracking:**
- **Per-Meal Nutrition**: Calculated nutrition per meal
- **Total Daily Nutrition**: Aggregated nutrition for entire meal plan
- **Nutritional Breakdown**: Calories, protein, carbs, fat totals

#### 3.3.2 Meal Plan Management
- **Create**: Design new meal plans
- **Edit**: Modify existing meal plans
- **Delete**: Remove meal plans
- **View**: Display meal plan details and nutritional information
- **List**: View all user's meal plans

### 3.4 Calendar Integration

#### 3.4.1 Workout Scheduling
Users can schedule workouts on the calendar:

**Scheduling Options:**
- **One-Time Schedule**: Schedule workout for a specific date
- **Recurring Schedule**: Weekly recurring workouts

**Recurring Schedule Configuration:**
- **Recurrence Pattern**: 'once' or 'weekly'
- **Days of Week**: For weekly schedules, select specific days:
  - Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
- **Start Date**: Initial date for the schedule

#### 3.4.2 Meal Plan Scheduling
Users can schedule meal plans on the calendar:

**Scheduling Options:**
- **One-Time Schedule**: Schedule meal plan for a specific date
- **Recurring Schedule**: Weekly recurring meal plans

**Recurring Schedule Configuration:**
- **Recurrence Pattern**: 'once' or 'weekly'
- **Days of Week**: For weekly schedules, select specific days
- **Start Date**: Initial date for the schedule

#### 3.4.3 Calendar Views
- Calendar display showing scheduled workouts and meal plans
- Visual representation of scheduled activities
- Event details popup for scheduled items

### 3.5 Live Workout Mode

#### 3.5.1 Workout Execution
Real-time workout tracking with the following features:

**Workout Start:**
- Initiate live workout mode from workout list
- Display workout details and exercise list

**Set Tracking:**
- **Current Exercise Display**: Shows current exercise being performed
- **Set Progress**: Track completion of each set
- **Set Completion**: Mark sets as completed
- **Actual Performance Tracking**: Record actual reps and weight performed
- **Set Navigation**: Move between sets and exercises

**Rest Timer:**
- **Automatic Rest Timer**: Starts after completing a set
- **Rest Duration**: Configurable rest period between sets
- **Timer Display**: Countdown timer showing remaining rest time
- **Skip Rest Option**: Option to skip rest period
- **Pause/Resume**: Pause and resume workout functionality

**Progress Indicators:**
- Visual progress indicators for workout completion
- Exercise completion status
- Set completion tracking
- Overall workout progress

**Workout Completion:**
- **Completion Summary**: Summary view after workout completion
- **Data Persistence**: Save completed workout data
- **Performance Recording**: Store actual performance metrics
- **History Tracking**: Record completed workouts for future reference

### 3.6 AI Chat Assistant

#### 3.6.1 Chat Interface
Interactive chat interface for fitness and nutrition recommendations:

**Chat Features:**
- **Message History**: Maintain conversation context
- **Real-Time Responses**: AI-powered responses using OpenAI GPT-4o-mini
- **Message Display**: User and assistant messages displayed in chat interface
- **Loading States**: Visual feedback during AI processing

#### 3.6.2 AI Capabilities
The AI assistant provides:

**Workout Recommendations:**
- Personalized workout plan suggestions
- Exercise recommendations based on goals and fitness level
- Workout structure with exercises, sets, reps, and rest periods
- Estimated workout duration

**Meal Plan Recommendations:**
- Personalized meal plan suggestions
- Food recommendations based on dietary preferences
- Nutritional balance guidance
- Meal timing recommendations

**General Fitness Advice:**
- Fitness and nutrition guidance
- Answer questions about workouts and nutrition
- Provide tips and best practices
- Consider user limitations and preferences

#### 3.6.3 Structured Data Output
The AI can generate structured workout and meal plan data:
- **Workout Data**: Properly formatted workout objects ready to save
- **Meal Plan Data**: Properly formatted meal plan objects ready to save
- **JSON Format**: Structured data embedded in chat responses
- **Direct Integration**: Generated plans can be directly saved to user's account

### 3.7 Progress Tracking

#### 3.7.1 Workout History
- **Completed Workouts**: View history of completed workouts
- **Performance Data**: Review actual performance vs. planned performance
- **Date Tracking**: Track when workouts were completed
- **Progress Over Time**: View workout completion trends

#### 3.7.2 Nutritional Tracking
- **Meal Plan Adherence**: Track adherence to planned meals
- **Nutritional Data**: View nutritional intake over time
- **Daily Totals**: See daily nutritional totals
- **Historical Data**: Review past nutritional data

## 4. Technical Architecture

### 4.1 Frontend Architecture

#### 4.1.1 Technology Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Authentication**: Supabase Auth (client-side)

#### 4.1.2 Project Structure
```
ui/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components (Header, Footer, Navigation)
│   │   └── workout/       # Workout-specific components
│   ├── pages/             # Route components
│   │   ├── Home.tsx
│   │   ├── Workouts.tsx
│   │   ├── Diet.tsx
│   │   ├── Calendar.tsx
│   │   └── Chat.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and API client
│   │   ├── supabase.ts
│   │   └── serverComm.ts
│   ├── store/             # Redux store and slices
│   ├── types/             # TypeScript type definitions
│   │   ├── workout.ts
│   │   ├── diet.ts
│   │   └── schedule.ts
│   ├── data/              # Mock data for development
│   └── utils/             # Utility functions
```

#### 4.1.3 Key Components

**Layout Components:**
- `Layout`: Main application layout wrapper
- `Header`: Application header with navigation
- `ProtectedRoute`: Route guard for authenticated routes

**Workout Components:**
- `LiveWorkout`: Live workout tracking component
- `ExerciseForm`: Exercise configuration form
- `WorkoutForm`: Workout creation/editing form

**Authentication Components:**
- `AuthModal`: Sign-in/sign-up modal
- `ProtectedRoute`: Route protection wrapper

### 4.2 Backend Architecture

#### 4.2.1 Technology Stack
- **Runtime**: Cloudflare Workers (serverless)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI API (GPT-4o-mini)
- **Testing**: Vitest

#### 4.2.2 Project Structure
```
server/
├── src/
│   ├── handlers/          # API route handlers
│   │   ├── workouts.ts
│   │   ├── meal-plans.ts
│   │   ├── workout-schedules.ts
│   │   ├── meal-schedules.ts
│   │   └── chat.ts
│   ├── db.ts              # Database interface and Supabase client
│   ├── routes.ts           # API route definitions
│   ├── middleware.ts       # Request handling middleware
│   ├── types.ts            # TypeScript type definitions
│   └── index.ts            # Worker entry point
├── migrations/             # Database migration files
└── test/                   # Test files
```

#### 4.2.3 API Endpoints

**Exercises:**
- `GET /api/exercises` - Get available exercises

**Workouts:**
- `GET /api/workouts` - Get user's workouts
- `POST /api/workouts` - Create a new workout
- `PUT /api/workouts/{id}` - Update a workout
- `DELETE /api/workouts/{id}` - Delete a workout

**Meal Plans:**
- `GET /api/meal-plans` - Get user's meal plans
- `POST /api/meal-plans` - Create a new meal plan
- `PUT /api/meal-plans/{id}` - Update a meal plan
- `DELETE /api/meal-plans/{id}` - Delete a meal plan

**Workout Schedules:**
- `GET /api/workout-schedules` - Get scheduled workouts
- `POST /api/workout-schedules` - Schedule a workout
- `DELETE /api/workout-schedules/{id}` - Delete a scheduled workout

**Meal Schedules:**
- `GET /api/meal-schedules` - Get scheduled meal plans
- `POST /api/meal-schedules` - Schedule a meal plan
- `DELETE /api/meal-schedules/{id}` - Delete a scheduled meal plan

**AI Chat:**
- `POST /api/chat` - Send message to AI assistant

### 4.3 Database Schema

#### 4.3.1 Tables

**workouts:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `name` (TEXT, NOT NULL)
- `description` (TEXT)
- `exercises` (JSONB, NOT NULL)
- `estimated_duration` (NUMERIC(5,2))
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

**meal_plans:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `name` (TEXT, NOT NULL)
- `description` (TEXT)
- `meals` (JSONB, NOT NULL)
- `total_nutrition` (JSONB)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

**workout_schedules:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `workout_id` (UUID, Foreign Key to workouts)
- `date` (DATE, NOT NULL)
- `recurrence` (TEXT, CHECK: 'once' or 'weekly')
- `days_of_week` (TEXT[])
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

**meal_schedules:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `meal_plan_id` (UUID, Foreign Key to meal_plans)
- `date` (DATE, NOT NULL)
- `recurrence` (TEXT, CHECK: 'once' or 'weekly')
- `days_of_week` (TEXT[])
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

#### 4.3.2 Security
- **Row-Level Security (RLS)**: Enabled on all tables
- **RLS Policies**: Users can only access their own data
- **Authentication**: JWT token-based authentication
- **Authorization**: User ID validation on all operations

### 4.4 Data Models

#### 4.4.1 Workout Model
```typescript
interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  estimatedDuration: number; // in minutes
}

interface WorkoutExercise {
  id: string;
  exerciseId: string;
  name?: string;
  sets: ExerciseSet[];
  notes?: string;
  restBetweenSets: number; // in seconds
}

interface ExerciseSet {
  id: string;
  weight?: number;
  reps?: number;
  duration?: number; // in seconds
  distance?: number; // in meters
  completed: boolean;
  weightType: 'kg' | 'lb' | 'bodyweight';
}
```

#### 4.4.2 Meal Plan Model
```typescript
interface MealPlan {
  id: string;
  name: string;
  description: string;
  meals: Record<MealType, Meal | null>;
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface Meal {
  id: string;
  name: string;
  time: string; // HH:mm format
  items: MealItem[];
}

interface MealItem {
  id: string;
  foodItem: FoodItem;
  quantity: number; // number of servings
}
```

#### 4.4.3 Schedule Model
```typescript
interface WorkoutSchedule {
  id: string;
  workoutId: string;
  date: string; // ISO date string
  recurrence: 'once' | 'weekly';
  daysOfWeek?: DayOfWeek[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface MealSchedule {
  id: string;
  mealPlanId: string;
  date: string; // ISO date string
  recurrence: 'once' | 'weekly';
  daysOfWeek?: DayOfWeek[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

## 5. User Experience

### 5.1 User Flows

#### 5.1.1 Onboarding Flow
1. User visits application
2. User clicks "Sign Up" or "Sign In"
3. User enters email and password
4. System authenticates user
5. User is redirected to home page
6. User can access protected features

#### 5.1.2 Workout Creation Flow
1. User navigates to Workouts page
2. User clicks "Create Workout"
3. User enters workout name and description
4. User adds exercises from exercise library
5. User configures sets, reps, weight, and rest periods
6. User saves workout
7. Workout appears in workout list

#### 5.1.3 Live Workout Flow
1. User selects a workout from workout list
2. User clicks "Start Workout"
3. Live workout mode initiates
4. User completes sets, marking them as complete
5. Rest timer activates between sets
6. User progresses through exercises
7. User completes workout
8. Workout data is saved with actual performance metrics

#### 5.1.4 Meal Plan Creation Flow
1. User navigates to Diet page
2. User clicks "Create Meal Plan"
3. User enters meal plan name and description
4. User adds meals for different meal types
5. User adds food items to each meal
6. System calculates nutritional totals
7. User saves meal plan
8. Meal plan appears in meal plan list

#### 5.1.5 Calendar Scheduling Flow
1. User navigates to Calendar page
2. User selects a workout or meal plan
3. User chooses scheduling option (one-time or recurring)
4. For recurring: User selects days of week
5. User selects start date
6. Schedule is created and displayed on calendar

#### 5.1.6 AI Chat Flow
1. User navigates to Chat page
2. User types a question or request
3. System sends message to AI API
4. AI processes request and generates response
5. Response is displayed in chat interface
6. If structured data is included, user can save it directly

### 5.2 User Interface Design

#### 5.2.1 Design Principles
- **Clean and Modern**: Minimalist design with focus on content
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Accessible**: Follows accessibility best practices
- **Consistent**: Consistent design language throughout
- **Intuitive**: Easy to navigate and understand

#### 5.2.2 Component Library
- Built with shadcn/ui components
- Uses Radix UI primitives for accessibility
- Tailwind CSS for styling
- Lucide React for icons

#### 5.2.3 Key UI Elements
- **Navigation**: Header with main navigation links
- **Cards**: Content displayed in card components
- **Forms**: Consistent form styling and validation
- **Modals**: Dialog components for actions
- **Buttons**: Consistent button styling and states
- **Inputs**: Form inputs with proper labels and validation

## 6. Security and Privacy

### 6.1 Authentication Security
- **Password Security**: Handled by Supabase Auth (industry-standard hashing)
- **Token Management**: JWT tokens with expiration
- **Session Management**: Secure session handling
- **HTTPS**: All communications encrypted

### 6.2 Data Security
- **Row-Level Security**: Database-level security policies
- **User Isolation**: Users can only access their own data
- **API Authentication**: All API requests require valid JWT tokens
- **Input Validation**: Server-side validation of all inputs

### 6.3 Privacy
- **User Data**: User data is private and not shared
- **No Third-Party Tracking**: No external tracking services
- **Data Ownership**: Users own their data
- **Data Deletion**: Users can delete their data

## 7. Performance and Scalability

### 7.1 Performance Optimizations
- **Code Splitting**: Lazy loading of route components
- **Serverless Architecture**: Cloudflare Workers for scalable backend
- **CDN**: Static assets served via CDN
- **Optimized Builds**: Vite for fast builds and HMR

### 7.2 Scalability
- **Serverless Backend**: Auto-scaling with Cloudflare Workers
- **Database**: Supabase PostgreSQL for scalable data storage
- **Stateless API**: Stateless API design for horizontal scaling
- **Caching**: Appropriate caching strategies

## 8. Deployment and Infrastructure

### 8.1 Frontend Deployment
- **Build**: Vite build process generates optimized production bundle
- **Hosting**: Can be deployed to Vercel, Netlify, or Cloudflare Pages
- **Static Assets**: Served via CDN

### 8.2 Backend Deployment
- **Platform**: Cloudflare Workers
- **Deployment**: Via Wrangler CLI
- **Configuration**: Environment variables for API keys and secrets
- **Monitoring**: Cloudflare Workers analytics

### 8.3 Database
- **Provider**: Supabase (managed PostgreSQL)
- **Backups**: Automatic backups via Supabase
- **Migrations**: SQL migration files for schema changes

## 9. Future Enhancements

### 9.1 Planned Features
- **Progress Photos**: Upload and track progress photos
- **Body Measurements**: Track body measurements over time
- **Social Features**: Share workouts and meal plans
- **Workout Templates**: Pre-built workout templates
- **Meal Plan Templates**: Pre-built meal plan templates
- **Advanced Analytics**: Detailed progress analytics and charts
- **Mobile App**: Native mobile applications
- **Offline Support**: Offline functionality for workouts
- **Export/Import**: Export and import workout and meal plan data
- **Integration**: Integration with fitness trackers and wearables

### 9.2 Technical Improvements
- **Testing**: Comprehensive test coverage
- **Performance Monitoring**: Application performance monitoring
- **Error Tracking**: Error tracking and reporting
- **Analytics**: User analytics and behavior tracking
- **Internationalization**: Multi-language support
- **Dark Mode**: Dark mode theme support

## 10. Success Metrics

### 10.1 User Engagement Metrics
- Daily active users (DAU)
- Weekly active users (WAU)
- Monthly active users (MAU)
- Average session duration
- Workouts completed per user
- Meal plans created per user

### 10.2 Feature Usage Metrics
- Workout creation rate
- Live workout completion rate
- Meal plan creation rate
- Calendar scheduling usage
- AI chat interactions
- Feature adoption rates

### 10.3 Technical Metrics
- API response times
- Error rates
- Uptime percentage
- Page load times
- Build and deployment success rates

## 11. Conclusion

Super Coach Pro is a comprehensive fitness application that combines modern web technologies with AI-powered recommendations to provide users with a complete fitness planning and tracking solution. The application's modular architecture, secure data handling, and user-centric design make it a robust platform for fitness enthusiasts to achieve their health and fitness goals.

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained By**: Development Team

