import { MealScheduleData, MealPlanDB } from '../db';
import { RouteHandler, HandlerContext, DeleteRequestBody } from '../types';

export const mealScheduleHandlers: RouteHandler<MealScheduleData> = {
    async get(context: HandlerContext): Promise<MealScheduleData[]> {
        const { db, user } = context;
        
        if (!user) {
            throw new Error('Authentication required');
        }

        return (db as MealPlanDB).getMealSchedules(user.id);
    },

    async post(context: HandlerContext<MealScheduleData>): Promise<MealScheduleData> {
        const { db, user, body: schedule } = context;

        if (!user) {
            throw new Error('Authentication required');
        }

        if (!schedule) {
            throw new Error('Schedule data is required');
        }

        console.log('Creating meal schedule with data:', JSON.stringify(schedule, null, 2));
        console.log('User ID:', user.id);

        try {
            const result = await (db as MealPlanDB).createMealSchedule({
                ...schedule,
                user_id: user.id
            });
            console.log('Meal schedule created successfully:', result);
            return result;
        } catch (error) {
            console.error('Error creating meal schedule:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            throw error;
        }
    },

    async delete(context: HandlerContext<DeleteRequestBody>): Promise<null> {
        const { db, user, body } = context;

        if (!user) {
            throw new Error('Authentication required');
        }

        if (!body?.id) {
            throw new Error('Schedule ID is required for deletion');
        }

        await (db as MealPlanDB).deleteMealSchedule(body.id, user.id);
        return null;
    }
};

