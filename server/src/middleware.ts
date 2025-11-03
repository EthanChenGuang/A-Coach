import { Env, createDatabase, getUserFromRequest } from './db';
import { ApiResponse, HandlerContext, Route } from './types';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function handleRequest(
  request: Request,
  env: Env,
  routes: Route[]
): Promise<Response> {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);

    // Handle root path - return API info
    if (url.pathname === '/') {
      return createResponse({
        message: 'A-Coach API',
        version: '1.0.0',
        endpoints: [
          '/api/exercises',
          '/api/workouts',
          '/api/workout-schedules',
          '/api/meal-plans',
          '/api/meal-schedules',
          '/api/chat'
        ]
      });
    }

    // Handle other common browser requests - return 204 No Content to prevent 404 errors
    const commonPaths = ['/favicon.ico', '/index.html', '/vite.svg'];
    if (commonPaths.includes(url.pathname)) {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }
    const db = createDatabase(env);
    const user = await getUserFromRequest(request, env);

    // Find matching route
    const route = routes.find(r => {
      const pattern = new RegExp(`^${r.path.replace(/\{[^}]+\}/g, '([^/]+)')}$`);
      return pattern.test(url.pathname);
    });

    if (!route) {
      return createResponse({ error: { message: 'Not Found' } }, 404);
    }

    // Extract path parameters
    const paramNames = (route.path.match(/\{([^}]+)\}/g) || []).map(p => p.slice(1, -1));
    const paramValues = url.pathname.match(new RegExp(route.path.replace(/\{[^}]+\}/g, '([^/]+)')))?.slice(1) || [];
    const params = Object.fromEntries(paramNames.map((name, i) => [name, paramValues[i]]));

    // Get handler for HTTP method
    const method = request.method.toLowerCase() as keyof typeof route.handler;
    const handler = route.handler[method];

    if (!handler) {
      return createResponse({ error: { message: 'Method Not Allowed' } }, 405);
    }

    // Create handler context with the correct type based on the method
    let body: any = undefined;
    if (request.method !== 'GET') {
      try {
        const contentType = request.headers.get('Content-Type');
        console.log('Request Content-Type:', contentType);
        console.log('Request method:', request.method);

        // Try to parse body if Content-Type suggests JSON, or if no Content-Type is set (default to JSON for POST/PUT)
        if (!contentType || contentType.includes('application/json')) {
          const text = await request.text();
          console.log('Request body text (first 200 chars):', text.substring(0, 200));
          if (text && text.trim()) {
            body = JSON.parse(text);
            console.log('Parsed body:', JSON.stringify(body));
          } else {
            console.log('Request body is empty');
          }
        } else {
          console.log('Content-Type is not JSON, skipping body parsing');
        }
      } catch (parseError) {
        console.error('Error parsing request body:', parseError);
        console.error('Parse error details:', parseError instanceof Error ? parseError.message : String(parseError));
        throw new Error(`Invalid JSON in request body: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
    }

    const context: HandlerContext<any> = {
      db,
      user,
      body,
      params,
      env
    };

    // Execute handler
    const result = await handler(context);

    return createResponse(result);

  } catch (error) {
    console.error('Error processing request:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    let message = error instanceof Error ? error.message : 'An unknown error occurred';
    let statusCode = error instanceof Error && error.message === 'Authentication required' ? 401 : 400;

    // Extract Supabase error details if available
    if (error && typeof error === 'object' && 'code' in error) {
      const supabaseError = error as any;
      message = supabaseError.message || message;
      if (supabaseError.details) {
        console.error('Supabase error details:', supabaseError.details);
      }
      if (supabaseError.hint) {
        console.error('Supabase error hint:', supabaseError.hint);
      }
    }

    // Safely serialize error details
    let errorDetails: string | undefined;
    if (error instanceof Error) {
      errorDetails = error.stack || error.message;
    } else if (error && typeof error === 'object') {
      try {
        errorDetails = JSON.stringify(error, Object.getOwnPropertyNames(error));
      } catch {
        errorDetails = String(error);
      }
    } else {
      errorDetails = String(error);
    }

    return createResponse(
      {
        error: {
          message,
          details: errorDetails,
          ...(error && typeof error === 'object' && 'code' in error ? { code: (error as any).code } : {})
        }
      },
      statusCode
    );
  }
}

function createResponse(body: ApiResponse | any, status: number = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}
