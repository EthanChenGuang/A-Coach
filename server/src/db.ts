import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export interface Env {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    DB: D1Database;
    OPENAI_API_KEY: string;
}

export interface WorkoutData {
    id?: string;
    name: string;
    description: string;
    exercises: Array<{
        name: string;
        sets: any[];
        notes: string;
        restBetweenSets: number;
    }>;
    estimatedDuration: number;
    user_id?: string;
}

export interface MealPlanData {
    id?: string;
    user_id?: string;
    name: string;
    description?: string;
    total_nutrition?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    totalNutrition?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    meals: Array<{
        type: string;
        name: string;
        time: string;
        foods: Array<{
            name: string;
            portion: number;
            unit: string;
            nutrition: {
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
            };
        }>;
    }> | Record<string, {
        name: string;
        time: string;
        foods: Array<{
            name: string;
            portion: number;
            unit: string;
            nutrition: {
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
            };
        }>;
    } | null>;
    created_at?: string;
    updated_at?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface WorkoutScheduleData {
    id?: string;
    workoutId: string;
    workout_id?: string;
    userId?: string;
    user_id?: string;
    date: string;
    recurrence: 'once' | 'weekly';
    daysOfWeek?: string[];
    days_of_week?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface MealScheduleData {
    id?: string;
    mealPlanId: string;
    meal_plan_id?: string;
    userId?: string;
    user_id?: string;
    date: string;
    recurrence: 'once' | 'weekly';
    daysOfWeek?: string[];
    days_of_week?: string[];
    createdAt?: string;
    updatedAt?: string;
}

// Database interface for workouts
export interface WorkoutDB {
    getWorkouts(userId: string): Promise<WorkoutData[]>;
    createWorkout(workout: WorkoutData): Promise<WorkoutData>;
    updateWorkout(workoutId: string, workout: WorkoutData, userId: string): Promise<WorkoutData>;
    deleteWorkout(workoutId: string, userId: string): Promise<void>;
    getWorkoutSchedules(userId: string): Promise<WorkoutScheduleData[]>;
    createWorkoutSchedule(schedule: WorkoutScheduleData): Promise<WorkoutScheduleData>;
    deleteWorkoutSchedule(scheduleId: string, userId: string): Promise<void>;
}

// Database interface for meal plans
export interface MealPlanDB {
    getMealPlans(userId: string): Promise<MealPlanData[]>;
    createMealPlan(mealPlan: MealPlanData): Promise<MealPlanData>;
    updateMealPlan(mealPlanId: string, mealPlan: MealPlanData, userId: string): Promise<MealPlanData>;
    deleteMealPlan(mealPlanId: string, userId: string): Promise<void>;
    getMealSchedules(userId: string): Promise<MealScheduleData[]>;
    createMealSchedule(schedule: MealScheduleData): Promise<MealScheduleData>;
    deleteMealSchedule(scheduleId: string, userId: string): Promise<void>;
}

class SupabaseDB implements WorkoutDB, MealPlanDB {
    private client: SupabaseClient;
    private authClient: SupabaseClient;
    private adminClient: SupabaseClient;

    constructor(env: Env) {
        // Service role client for database operations
        this.client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
        // Anon key client for auth operations
        this.authClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
        // Admin client for user verification (uses service role key)
        this.adminClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
    }

    async getWorkouts(userId: string): Promise<WorkoutData[]> {
        const { data, error } = await this.client
            .from('workouts')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        if (!data) return [];

        return data.map(transformWorkoutToClientFormat);
    }

    async createWorkout(workout: WorkoutData): Promise<WorkoutData> {
        console.log('Debug - prepareWorkoutData input:', JSON.stringify(workout, null, 2));
        const workoutData = prepareWorkoutData(workout);
        console.log('Debug - prepareWorkoutData output:', JSON.stringify(workoutData, null, 2));
        
        const { data, error } = await this.client
            .from('workouts')
            .insert([workoutData])
            .select()
            .single();

        if (error) {
            console.error('Debug - Supabase insert error:', error);
            console.error('Debug - Error code:', error.code);
            console.error('Debug - Error message:', error.message);
            console.error('Debug - Error details:', error.details);
            throw error;
        }
        if (!data) throw new Error('Failed to create workout');

        return transformWorkoutToClientFormat(data);
    }

    async updateWorkout(workoutId: string, workout: WorkoutData, userId: string): Promise<WorkoutData> {
        const workoutData = prepareWorkoutData({ ...workout, user_id: userId });
        
        // First try to update
        const { data, error } = await this.client
            .from('workouts')
            .update(workoutData)
            .eq('id', workoutId)
            .eq('user_id', userId)
            .select()
            .single();

        // If no rows affected, create new record
        if (error?.code === 'PGRST116') {
            const { data: newData, error: insertError } = await this.client
                .from('workouts')
                .insert([{ ...workoutData, id: workoutId }])
                .select()
                .single();

            if (insertError) throw insertError;
            if (!newData) throw new Error('Failed to create workout');

            return transformWorkoutToClientFormat(newData);
        }

        if (error) throw error;
        if (!data) throw new Error('Workout not found or access denied');

        return transformWorkoutToClientFormat(data);
    }

    async deleteWorkout(workoutId: string, userId: string): Promise<void> {
        const { error } = await this.client
            .from('workouts')
            .delete()
            .eq('id', workoutId)
            .eq('user_id', userId);

        if (error) throw error;
    }

    async getMealPlans(userId: string): Promise<MealPlanData[]> {
        const { data, error } = await this.client
            .from('meal_plans')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        if (!data) return [];

        return data.map(transformMealPlanToClientFormat);
    }

    async createMealPlan(mealPlan: MealPlanData): Promise<MealPlanData> {
        const mealPlanData = prepareMealPlanData(mealPlan);
        const { data, error } = await this.client
            .from('meal_plans')
            .insert([mealPlanData])
            .select()
            .single();

        if (error) throw error;
        if (!data) throw new Error('Failed to create meal plan');

        return transformMealPlanToClientFormat(data);
    }

    async updateMealPlan(mealPlanId: string, mealPlan: MealPlanData, userId: string): Promise<MealPlanData> {
        console.log('Debug - prepareMealPlanData input:', JSON.stringify({ ...mealPlan, user_id: userId }, null, 2));
        const mealPlanData = prepareMealPlanData({ ...mealPlan, user_id: userId });
        console.log('Debug - prepareMealPlanData output:', JSON.stringify(mealPlanData, null, 2));
        
        const { data, error } = await this.client
            .from('meal_plans')
            .update(mealPlanData)
            .eq('id', mealPlanId)
            .eq('user_id', userId)
            .select()
            .single();

        // If no rows affected, try to insert (similar to updateWorkout)
        if (error?.code === 'PGRST116') {
            const { data: newData, error: insertError } = await this.client
                .from('meal_plans')
                .insert([{ ...mealPlanData, id: mealPlanId }])
                .select()
                .single();

            if (insertError) {
                console.error('Debug - Supabase insert error:', insertError);
                throw insertError;
            }
            if (!newData) throw new Error('Failed to create meal plan');

            return transformMealPlanToClientFormat(newData);
        }

        if (error) {
            console.error('Debug - Supabase update error:', error);
            console.error('Debug - Error code:', error.code);
            console.error('Debug - Error message:', error.message);
            console.error('Debug - Error details:', error.details);
            throw error;
        }
        if (!data) throw new Error('Meal plan not found or access denied');

        return transformMealPlanToClientFormat(data);
    }

    async deleteMealPlan(mealPlanId: string, userId: string): Promise<void> {
        const { error } = await this.client
            .from('meal_plans')
            .delete()
            .eq('id', mealPlanId)
            .eq('user_id', userId);

        if (error) throw error;
    }

    async getUser(token: string): Promise<User | null> {
        try {
            console.log('Debug - Validating token (length):', token?.length);
            
            // Decode JWT to extract user ID (no verification needed since we trust Supabase tokens)
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload.sub;
                
                // Check token expiration
                if (payload.exp && payload.exp < Date.now() / 1000) {
                    console.error('Token has expired');
                    return null;
                }
                
                console.log('Debug - Extracted user ID from token:', userId);
                
                // Use Admin API to get user by ID
                const { data: { user }, error } = await this.adminClient.auth.admin.getUserById(userId);
                if (error) {
                    console.error('Error getting user by ID:', error);
                    console.error('Error details:', JSON.stringify(error, null, 2));
                    return null;
                }
                console.log('Debug - User authenticated successfully:', user?.id);
                return user;
            } catch (decodeError) {
                console.error('Error decoding token:', decodeError);
                // Fallback: try direct getUser method
                const { data: { user }, error } = await this.adminClient.auth.getUser(token);
                if (error) {
                    console.error('Error getting user (fallback):', error);
                    return null;
                }
                return user;
            }
        } catch (err) {
            console.error('Exception in getUser:', err);
            return null;
        }
    }

    async getWorkoutSchedules(userId: string): Promise<WorkoutScheduleData[]> {
        const { data, error } = await this.client
            .from('workout_schedules')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        if (!data) return [];

        return data.map(transformWorkoutScheduleToClientFormat);
    }

    async createWorkoutSchedule(schedule: WorkoutScheduleData): Promise<WorkoutScheduleData> {
        const scheduleData = prepareWorkoutScheduleData(schedule);
        const { data, error } = await this.client
            .from('workout_schedules')
            .insert([scheduleData])
            .select()
            .single();

        if (error) throw error;
        if (!data) throw new Error('Failed to create workout schedule');

        return transformWorkoutScheduleToClientFormat(data);
    }

    async deleteWorkoutSchedule(scheduleId: string, userId: string): Promise<void> {
        const { error } = await this.client
            .from('workout_schedules')
            .delete()
            .eq('id', scheduleId)
            .eq('user_id', userId);

        if (error) throw error;
    }

    async getMealSchedules(userId: string): Promise<MealScheduleData[]> {
        const { data, error } = await this.client
            .from('meal_schedules')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        if (!data) return [];

        return data.map(transformMealScheduleToClientFormat);
    }

    async createMealSchedule(schedule: MealScheduleData): Promise<MealScheduleData> {
        console.log('createMealSchedule - Input schedule:', JSON.stringify(schedule, null, 2));
        const scheduleData = prepareMealScheduleData(schedule);
        console.log('createMealSchedule - Prepared data:', JSON.stringify(scheduleData, null, 2));
        
        const { data, error } = await this.client
            .from('meal_schedules')
            .insert([scheduleData])
            .select()
            .single();

        if (error) {
            console.error('createMealSchedule - Supabase error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            console.error('Error details:', error.details);
            console.error('Error hint:', error.hint);
            throw error;
        }
        if (!data) throw new Error('Failed to create meal schedule');

        console.log('createMealSchedule - Created data:', JSON.stringify(data, null, 2));
        return transformMealScheduleToClientFormat(data);
    }

    async deleteMealSchedule(scheduleId: string, userId: string): Promise<void> {
        const { error } = await this.client
            .from('meal_schedules')
            .delete()
            .eq('id', scheduleId)
            .eq('user_id', userId);

        if (error) throw error;
    }
}

// Helper function to prepare workout data for database
interface DatabaseWorkoutData {
    name: string;
    description: string;
    exercises: Array<{
        name: string;
        sets: any[];
        notes: string;
        restBetweenSets: number;
    }>;
    estimated_duration: number;
    user_id?: string;
}

export function prepareWorkoutData(workout: WorkoutData): DatabaseWorkoutData {
    const { id, estimatedDuration, ...data } = workout;
    return {
        ...data,
        // Keep as decimal (NUMERIC type in database)
        estimated_duration: estimatedDuration
    };
}

// Transform database workout to client format
export function transformWorkoutToClientFormat(workout: any): WorkoutData {
    const { estimated_duration, created_at, updated_at, ...rest } = workout;
    return {
        ...rest,
        estimatedDuration: Number(estimated_duration)
    };
}

export function prepareMealPlanData(mealPlan: MealPlanData): Partial<MealPlanData> {
    const { id, created_at, updated_at, totalNutrition, createdAt, updatedAt, ...data } = mealPlan;
    return {
        ...data,
        total_nutrition: totalNutrition && {
            calories: Number(totalNutrition.calories),
            protein: Number(totalNutrition.protein),
            carbs: Number(totalNutrition.carbs),
            fat: Number(totalNutrition.fat)
        },
        meals: Array.isArray(data.meals) ? data.meals : Object.entries(data.meals || {}).map(([type, meal]) => {
            if (!meal) return null;
            return {
                type,
                ...meal,
            };
        }).filter((meal): meal is NonNullable<typeof meal> => meal !== null)
    };
}

export function transformMealPlanToClientFormat(data: MealPlanData): MealPlanData {
    const { total_nutrition, created_at, updated_at, meals, ...rest } = data;
    
    const mealsRecord = Array.isArray(meals) 
        ? meals.reduce<Record<string, any>>((acc, meal) => {
            if (meal && meal.type) {
                const { type, ...mealData } = meal;
                acc[type] = mealData;
            }
            return acc;
        }, {})
        : meals;

    return {
        ...rest,
        totalNutrition: total_nutrition && {
            calories: Number(total_nutrition.calories),
            protein: Number(total_nutrition.protein),
            carbs: Number(total_nutrition.carbs),
            fat: Number(total_nutrition.fat)
        },
        meals: mealsRecord,
        createdAt: created_at,
        updatedAt: updated_at
    };
}

export function prepareWorkoutScheduleData(schedule: WorkoutScheduleData): Partial<WorkoutScheduleData> {
    const { id, createdAt, updatedAt, daysOfWeek, workoutId, userId, user_id, ...data } = schedule;
    const result: any = {
        ...data,
        workout_id: workoutId,
        user_id: user_id || userId,  // Use user_id if available, fall back to userId
    };
    
    // Only include days_of_week if daysOfWeek is defined and not empty
    if (daysOfWeek && daysOfWeek.length > 0) {
        result.days_of_week = daysOfWeek;
    }
    
    return result;
}

export function transformWorkoutScheduleToClientFormat(data: any): WorkoutScheduleData {
    const { workout_id, user_id, days_of_week, created_at, updated_at, ...rest } = data;
    return {
        ...rest,
        workoutId: workout_id,
        userId: user_id,
        daysOfWeek: days_of_week,
        createdAt: created_at,
        updatedAt: updated_at
    };
}

export function prepareMealScheduleData(schedule: MealScheduleData): Partial<MealScheduleData> {
    const { id, createdAt, updatedAt, daysOfWeek, mealPlanId, userId, user_id, ...data } = schedule;
    const result: any = {
        ...data,
        meal_plan_id: mealPlanId,
        user_id: user_id || userId,  // Use user_id if available, fall back to userId
    };
    
    // Only include days_of_week if daysOfWeek is defined and not empty
    if (daysOfWeek && daysOfWeek.length > 0) {
        result.days_of_week = daysOfWeek;
    }
    
    return result;
}

export function transformMealScheduleToClientFormat(data: any): MealScheduleData {
    const { meal_plan_id, user_id, days_of_week, created_at, updated_at, ...rest } = data;
    return {
        ...rest,
        mealPlanId: meal_plan_id,
        userId: user_id,
        daysOfWeek: days_of_week,
        createdAt: created_at,
        updatedAt: updated_at
    };
}

// Factory function to create database instance
export function createDatabase(env: Env): SupabaseDB {
    return new SupabaseDB(env);
}

// Function to get user from request
export async function getUserFromRequest(request: Request, env: Env): Promise<User | null> {
    const authHeader = request.headers.get('Authorization');
    console.log('Debug - Authorization header present:', !!authHeader);
    if (!authHeader) {
        console.log('Debug - No Authorization header found');
        return null;
    }

    const token = authHeader.replace('Bearer ', '').trim();
    console.log('Debug - Extracted token (first 20 chars):', token.substring(0, 20) + '...');
    const db = createDatabase(env);
    return db.getUser(token);
} 