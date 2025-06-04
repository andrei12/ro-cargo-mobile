import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const patchAdminusersIdrole_Body = z
  .object({ role: z.enum(['driver', 'customer', 'admin']) })
  .passthrough();
const postAuthlogin_Body = z
  .object({ email: z.string().email(), password: z.string().min(1) })
  .passthrough();
const postAuthregister_Body = z
  .object({
    name: z.string().min(1).max(100),
    email: z.string().max(255).email(),
    password: z.string().min(8).max(255),
    phone: z.string().optional(),
    role: z.enum(['driver', 'customer', 'admin']).optional().default('customer'),
  })
  .passthrough();
const postUsers_Body = z
  .object({
    name: z.string().min(1).max(100),
    email: z.string().max(255).email(),
    password: z.string().min(8).max(255),
    phone: z.string().nullish(),
    avatar: z.string().nullish(),
    country: z.string().nullish(),
    city: z.string().nullish(),
    role: z.enum(['driver', 'customer', 'admin']).optional(),
    stripe_customer_id: z.string().nullish(),
    subscription_status: z.boolean().optional(),
    ff: z.boolean().optional(),
  })
  .passthrough();
const patchUsersId_Body = z
  .object({
    name: z.string().min(1).max(100),
    email: z.string().max(255).email(),
    password: z.string().min(8).max(255),
    phone: z.string().nullable(),
    avatar: z.string().nullable(),
    country: z.string().nullable(),
    city: z.string().nullable(),
    role: z.enum(['driver', 'customer', 'admin']),
    stripe_customer_id: z.string().nullable(),
    subscription_status: z.boolean(),
    ff: z.boolean(),
  })
  .partial()
  .passthrough();
const postOrders_Body = z
  .object({
    customer_id: z.number().gt(0),
    driver_id: z.number().gt(0).nullish(),
    pickup_address: z.string().min(1).max(500),
    delivery_address: z.string().min(1).max(500),
    package_description: z.string().min(1).max(1000),
    package_weight: z.string().nullish(),
    package_dimensions: z.string().nullish(),
    price: z.number().gt(0),
    status: z
      .enum(['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'])
      .optional(),
    notes: z.string().nullish(),
    pickup_time: z.string().nullish(),
    delivery_time: z.string().nullish(),
    ff: z.boolean().optional(),
  })
  .passthrough();
const patchOrdersId_Body = z
  .object({
    customer_id: z.number().gt(0),
    driver_id: z.number().gt(0).nullable(),
    pickup_address: z.string().min(1).max(500),
    delivery_address: z.string().min(1).max(500),
    package_description: z.string().min(1).max(1000),
    package_weight: z.string().nullable(),
    package_dimensions: z.string().nullable(),
    price: z.number().gt(0),
    status: z.enum(['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled']),
    notes: z.string().nullable(),
    pickup_time: z.string().nullable(),
    delivery_time: z.string().nullable(),
    ff: z.boolean(),
  })
  .partial()
  .passthrough();
const postDriverApplications_Body = z
  .object({
    order_id: z.number().gt(0),
    driver_id: z.number().gt(0),
    status: z.enum(['pending', 'accepted', 'rejected']).optional(),
    message: z.string().nullish(),
  })
  .passthrough();
const patchDriverApplicationsId_Body = z
  .object({ status: z.enum(['accepted', 'rejected']) })
  .passthrough();
const postRealtimebroadcast_Body = z
  .object({
    type: z.enum([
      'order_created',
      'order_updated',
      'order_status_changed',
      'driver_assigned',
      'location_update',
      'application_created',
      'application_updated',
    ]),
    data: z.record(z.unknown().nullable()),
    orderId: z.string().optional(),
    userId: z.string().optional(),
    targetUsers: z.array(z.string()).optional(),
  })
  .passthrough();

export const schemas = {
  patchAdminusersIdrole_Body,
  postAuthlogin_Body,
  postAuthregister_Body,
  postUsers_Body,
  patchUsersId_Body,
  postOrders_Body,
  patchOrdersId_Body,
  postDriverApplications_Body,
  patchDriverApplicationsId_Body,
  postRealtimebroadcast_Body,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/',
    alias: 'get',
    description: `Returns comprehensive information about the Cargo API service including health status, environment details, and service availability. This endpoint serves as a global health check for monitoring systems worldwide and provides confirmation that the API is running and accessible.`,
    requestFormat: 'json',
    response: z
      .object({
        message: z.string(),
        status: z.string(),
        timestamp: z.string(),
        version: z.string(),
        environment: z.string(),
        cloudflare: z
          .object({
            region: z.string().nullable(),
            colo: z.string().nullable(),
            country: z.string().nullable(),
            timezone: z.string().nullable(),
            requestId: z.string().nullable(),
            asn: z.string().nullable(),
            httpProtocol: z.string().nullable(),
          })
          .passthrough(),
        services: z.object({ database: z.string(), realtime: z.string() }).passthrough(),
      })
      .passthrough(),
  },
  {
    method: 'post',
    path: '/admin/cleanup',
    alias: 'postAdmincleanup',
    description: `Removes expired blacklisted tokens from the database to prevent accumulation. This is an administrative maintenance operation that should be performed periodically to keep the database clean.`,
    requestFormat: 'json',
    response: z.object({ message: z.string(), deletedTokens: z.number().optional() }).passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Admin access required. Only users with admin role can access this endpoint.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/admin/dashboard/stats',
    alias: 'getAdmindashboardstats',
    description: `Retrieves comprehensive statistics for the admin dashboard including user counts, order statistics, and application metrics. This endpoint provides a high-level overview of the system&#x27;s current state.`,
    requestFormat: 'json',
    response: z
      .object({
        totalUsers: z.number(),
        totalDrivers: z.number(),
        totalCustomers: z.number(),
        totalAdmins: z.number(),
        totalOrders: z.number(),
        pendingOrders: z.number(),
        completedOrders: z.number(),
        totalDriverApplications: z.number(),
        pendingApplications: z.number(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Admin access required. Only users with admin role can access this endpoint.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/admin/driver-applications',
    alias: 'getAdmindriverApplications',
    description: `Retrieves a paginated list of all driver applications in the system with comprehensive filtering and sorting capabilities. This endpoint is restricted to admin users and provides full visibility into all driver applications regardless of status. Supports filtering by application status, date range, order ID, driver ID, and search across application messages.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'page',
        type: 'Query',
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(100).optional().default(10),
      },
      {
        name: 'search',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_by',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_order',
        type: 'Query',
        schema: z.enum(['asc', 'desc']).optional().default('desc'),
      },
      {
        name: 'date_from',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'date_to',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'status',
        type: 'Query',
        schema: z.enum(['pending', 'accepted', 'rejected']).optional(),
      },
      {
        name: 'order_id',
        type: 'Query',
        schema: z.number().gt(0).optional(),
      },
      {
        name: 'driver_id',
        type: 'Query',
        schema: z.number().gt(0).optional(),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.number(),
              order_id: z.number(),
              driver_id: z.number(),
              status: z.enum(['pending', 'accepted', 'rejected']),
              message: z.string().nullable(),
              createdAt: z.string().nullable(),
              updatedAt: z.string().nullable(),
            })
            .passthrough()
        ),
        meta: z
          .object({
            page: z.number().int().gte(1),
            limit: z.number().int().gte(1).lte(100),
            total: z.number().int().gte(0),
            totalPages: z.number().int().gte(0),
            hasNext: z.boolean(),
            hasPrev: z.boolean(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Admin access required. Only users with admin role can access this endpoint.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid query parameters. Common issues include: invalid pagination parameters, invalid filter values (dates, enum values), or malformed sort parameters.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/admin/orders',
    alias: 'getAdminorders',
    description: `Retrieves a paginated list of all orders in the system with comprehensive filtering and sorting capabilities. This endpoint is restricted to admin users and provides full visibility into all orders regardless of customer or driver assignment. Supports filtering by status, price range, date range, customer/driver ID, and search across addresses and descriptions.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'page',
        type: 'Query',
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(100).optional().default(10),
      },
      {
        name: 'search',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_by',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_order',
        type: 'Query',
        schema: z.enum(['asc', 'desc']).optional().default('desc'),
      },
      {
        name: 'date_from',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'date_to',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'price_min',
        type: 'Query',
        schema: z.number().gte(0).nullish(),
      },
      {
        name: 'price_max',
        type: 'Query',
        schema: z.number().gte(0).nullish(),
      },
      {
        name: 'status',
        type: 'Query',
        schema: z
          .enum(['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'])
          .optional(),
      },
      {
        name: 'customer_id',
        type: 'Query',
        schema: z.number().gt(0).optional(),
      },
      {
        name: 'driver_id',
        type: 'Query',
        schema: z.number().gt(0).optional(),
      },
      {
        name: 'pickup_city',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'delivery_city',
        type: 'Query',
        schema: z.string().optional(),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.number(),
              customer_id: z.number(),
              driver_id: z.number().nullable(),
              pickup_address: z.string(),
              delivery_address: z.string(),
              package_description: z.string(),
              package_weight: z.string().nullable(),
              package_dimensions: z.string().nullable(),
              price: z.number(),
              status: z.enum([
                'pending',
                'accepted',
                'picked_up',
                'in_transit',
                'delivered',
                'cancelled',
              ]),
              notes: z.string().nullable(),
              pickup_time: z.string().nullable(),
              delivery_time: z.string().nullable(),
              ff: z.boolean(),
              createdAt: z.string().nullable(),
              updatedAt: z.string().nullable(),
            })
            .passthrough()
        ),
        meta: z
          .object({
            page: z.number().int().gte(1),
            limit: z.number().int().gte(1).lte(100),
            total: z.number().int().gte(0),
            totalPages: z.number().int().gte(0),
            hasNext: z.boolean(),
            hasPrev: z.boolean(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Admin access required. Only users with admin role can access this endpoint.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid query parameters. Common issues include: invalid pagination parameters, invalid filter values (dates, numbers, enum values), or malformed sort parameters.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/admin/users',
    alias: 'getAdminusers',
    description: `Retrieves a paginated list of all users in the system with comprehensive filtering and sorting capabilities. This endpoint is restricted to admin users and provides detailed user information including creation dates and subscription status. Supports filtering by role, location, subscription status, and search across user information.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'page',
        type: 'Query',
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(100).optional().default(10),
      },
      {
        name: 'search',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_by',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_order',
        type: 'Query',
        schema: z.enum(['asc', 'desc']).optional().default('desc'),
      },
      {
        name: 'role',
        type: 'Query',
        schema: z.enum(['driver', 'customer', 'admin']).optional(),
      },
      {
        name: 'country',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'city',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'subscription_status',
        type: 'Query',
        schema: z.boolean().nullish(),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
              phone: z.string().nullable(),
              avatar: z.string().nullable(),
              country: z.string().nullable(),
              city: z.string().nullable(),
              role: z.enum(['driver', 'customer', 'admin']),
              stripe_customer_id: z.string().nullable(),
              subscription_status: z.boolean(),
              ff: z.boolean(),
              createdAt: z.string().nullable(),
              updatedAt: z.string().nullable(),
            })
            .passthrough()
        ),
        meta: z
          .object({
            page: z.number().int().gte(1),
            limit: z.number().int().gte(1).lte(100),
            total: z.number().int().gte(0),
            totalPages: z.number().int().gte(0),
            hasNext: z.boolean(),
            hasPrev: z.boolean(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Admin access required. Only users with admin role can access this endpoint.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid query parameters. Common issues include: invalid pagination parameters, invalid filter values (role, boolean values), or malformed sort parameters.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'patch',
    path: '/admin/users/:id/role',
    alias: 'patchAdminusersIdrole',
    description: `Updates the role of a specific user. This endpoint allows admins to promote users to admin status, change drivers to customers, or vice versa. This is a powerful administrative function that should be used carefully.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `New role for the user. Must be one of: driver, customer, or admin.`,
        type: 'Body',
        schema: patchAdminusersIdrole_Body,
      },
      {
        name: 'id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        phone: z.string().nullable(),
        avatar: z.string().nullable(),
        country: z.string().nullable(),
        city: z.string().nullable(),
        role: z.enum(['driver', 'customer', 'admin']),
        stripe_customer_id: z.string().nullable(),
        subscription_status: z.boolean(),
        ff: z.boolean(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Admin access required. Only users with admin role can access this endpoint.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `User not found. Please verify the user ID is correct.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid role provided. Role must be one of: driver, customer, or admin.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/auth/login',
    alias: 'postAuthlogin',
    description: `Authenticates a user with email and password credentials, returning both a JWT access token and a refresh token. The access token is short-lived (15 minutes) and should be used for API requests. The refresh token is long-lived (30 days) and can be used to obtain new access tokens.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `User credentials including email and password. Both fields are required for authentication.`,
        type: 'Body',
        schema: postAuthlogin_Body,
      },
    ],
    response: z
      .object({
        accessToken: z.string(),
        refreshToken: z.string(),
        user: z
          .object({
            id: z.number(),
            name: z.string(),
            email: z.string(),
            role: z.enum(['driver', 'customer', 'admin']),
            phone: z.string().nullable(),
            avatar: z.string().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed. Invalid email or password provided. Please verify your credentials and try again.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid login data format. Common issues include: malformed email address or missing required fields.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/auth/logout',
    alias: 'postAuthlogout',
    description: `Logs out the user by revoking the provided refresh token. This prevents the refresh token from being used to generate new access tokens. The access token will remain valid until it expires naturally.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `The refresh token to revoke.`,
        type: 'Body',
        schema: z.object({ refreshToken: z.string() }).passthrough(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 422,
        description: `Invalid logout data format. The refresh token must be provided as a string.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/auth/logout-all',
    alias: 'postAuthlogoutAll',
    description: `Revokes all refresh tokens for the authenticated user, effectively logging them out from all devices. This requires a valid access token in the Authorization header. All existing refresh tokens will be invalidated.`,
    requestFormat: 'json',
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid access token in the Authorization header.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/auth/me',
    alias: 'getAuthme',
    description: `Retrieves the profile information of the currently authenticated user based on the provided JWT token. This endpoint is useful for displaying user profile data, verifying authentication status, and determining user permissions based on their role. No additional parameters are required as the user is identified from the token.`,
    requestFormat: 'json',
    response: z
      .object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        role: z.enum(['driver', 'customer', 'admin']),
        phone: z.string().nullable(),
        avatar: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required or token invalid. Please provide a valid Bearer token in the Authorization header or log in again if your token has expired.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/auth/refresh',
    alias: 'postAuthrefresh',
    description: `Exchanges a valid refresh token for a new access token. This endpoint should be used when the access token expires. The refresh token remains valid and can be reused until it expires or is revoked.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `The refresh token obtained during login or registration.`,
        type: 'Body',
        schema: z.object({ refreshToken: z.string() }).passthrough(),
      },
    ],
    response: z.object({ accessToken: z.string(), refreshToken: z.string() }).passthrough(),
    errors: [
      {
        status: 401,
        description: `Token refresh failed. The refresh token may be invalid, expired, or revoked. Please log in again to obtain new tokens.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid refresh token format. The refresh token must be provided as a string.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/auth/register',
    alias: 'postAuthregister',
    description: `Creates a new user account in the cargo delivery system. Users can register as either drivers or customers. The account is immediately active upon creation, and both access and refresh tokens are provided for immediate access. Email addresses must be unique across the system.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `Complete registration information including name, email, password, role, and optional phone number. Password must be at least 8 characters long.`,
        type: 'Body',
        schema: postAuthregister_Body,
      },
    ],
    response: z
      .object({
        accessToken: z.string(),
        refreshToken: z.string(),
        user: z
          .object({
            id: z.number(),
            name: z.string(),
            email: z.string(),
            role: z.enum(['driver', 'customer', 'admin']),
            phone: z.string().nullable(),
            avatar: z.string().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 409,
        description: `Registration failed because the email address is already registered. Please use a different email or try logging in instead.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid registration data. Common issues include: weak password (less than 8 characters), invalid email format, missing required fields, or invalid phone number format.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/driver-applications',
    alias: 'postDriverApplications',
    description: `Allows a driver to apply for a specific delivery order. The system will validate that the order is still available and that the driver hasn&#x27;t already applied for this order. Once submitted, the application will be available for review by the order owner.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `Application details including driver ID and order ID. The system will automatically set the application status to &#x27;pending&#x27; and record the submission timestamp.`,
        type: 'Body',
        schema: postDriverApplications_Body,
      },
    ],
    response: z
      .object({
        id: z.number(),
        order_id: z.number(),
        driver_id: z.number(),
        status: z.enum(['pending', 'accepted', 'rejected']),
        message: z.string().nullable(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Application could not be created. Common reasons include: driver has already applied for this order, order is no longer available, or order has already been assigned to another driver.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Access denied. Only drivers can submit applications for orders.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `The specified order was not found or is no longer available for applications.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 409,
        description: `Application already exists for this driver and order combination.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid application data provided. Please check that all required fields are present and properly formatted.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'patch',
    path: '/driver-applications/:id',
    alias: 'patchDriverApplicationsId',
    description: `Allows order owners to accept or reject driver applications for their orders. When an application is accepted, the driver is assigned to the order and other pending applications for the same order are automatically rejected. This endpoint is crucial for the order assignment workflow.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `New status for the application. &#x27;accepted&#x27; assigns the driver to the order, &#x27;rejected&#x27; declines the application but keeps it for record-keeping.`,
        type: 'Body',
        schema: patchDriverApplicationsId_Body,
      },
      {
        name: 'id',
        type: 'Path',
        schema: z.number().nullable(),
      },
    ],
    response: z
      .object({
        id: z.number(),
        order_id: z.number(),
        driver_id: z.number(),
        status: z.enum(['pending', 'accepted', 'rejected']),
        message: z.string().nullable(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Status update failed. Common reasons include: application has already been processed, order is no longer available, or insufficient permissions to modify this application.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Access denied. Only order owners can update application status.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `The specified application was not found in the system`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 409,
        description: `Status update failed due to a conflict, such as the application being modified by another user or the order already being assigned.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid application ID format provided in the request parameters. The ID must be a valid integer.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/drivers/:id/applications',
    alias: 'getDriversIdapplications',
    description: `Retrieves the paginated application history for a specific driver with comprehensive filtering and sorting capabilities, including the status of each application and details about the orders they applied for. This endpoint helps drivers track their application activity and order statuses. Supports filtering by application status, date range, and search across order information.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.number().nullable(),
      },
      {
        name: 'page',
        type: 'Query',
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(100).optional().default(10),
      },
      {
        name: 'search',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_by',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_order',
        type: 'Query',
        schema: z.enum(['asc', 'desc']).optional().default('desc'),
      },
      {
        name: 'date_from',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'date_to',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'status',
        type: 'Query',
        schema: z.enum(['pending', 'accepted', 'rejected']).optional(),
      },
      {
        name: 'order_id',
        type: 'Query',
        schema: z.number().gt(0).optional(),
      },
      {
        name: 'driver_id',
        type: 'Query',
        schema: z.number().gt(0).optional(),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.number(),
              order_id: z.number(),
              driver_id: z.number(),
              status: z.enum(['pending', 'accepted', 'rejected']),
              message: z.string().nullable(),
              createdAt: z.string().nullable(),
              updatedAt: z.string().nullable(),
              order: z
                .object({
                  id: z.number(),
                  pickup_address: z.string(),
                  delivery_address: z.string(),
                  package_description: z.string(),
                  price: z.number(),
                  status: z.enum([
                    'pending',
                    'accepted',
                    'picked_up',
                    'in_transit',
                    'delivered',
                    'cancelled',
                  ]),
                  createdAt: z.string().nullable(),
                })
                .passthrough(),
            })
            .passthrough()
        ),
        meta: z
          .object({
            page: z.number().int().gte(1),
            limit: z.number().int().gte(1).lte(100),
            total: z.number().int().gte(0),
            totalPages: z.number().int().gte(0),
            hasNext: z.boolean(),
            hasPrev: z.boolean(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Access denied. You don&#x27;t have permission to view applications for this driver.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `The specified driver was not found in the system`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid driver ID format or query parameters. Common issues include: invalid pagination parameters, invalid filter values (dates, enum values), or malformed sort parameters.`,
        schema: z.union([
          z
            .object({
              success: z.boolean(),
              error: z
                .object({
                  issues: z.array(
                    z
                      .object({
                        code: z.string(),
                        path: z.array(z.union([z.string(), z.number()])),
                        message: z.string().optional(),
                      })
                      .passthrough()
                  ),
                  name: z.string(),
                })
                .passthrough(),
            })
            .passthrough(),
          z
            .object({
              success: z.boolean(),
              error: z
                .object({
                  issues: z.array(
                    z
                      .object({
                        code: z.string(),
                        path: z.array(z.union([z.string(), z.number()])),
                        message: z.string().optional(),
                      })
                      .passthrough()
                  ),
                  name: z.string(),
                })
                .passthrough(),
            })
            .passthrough(),
        ]),
      },
    ],
  },
  {
    method: 'get',
    path: '/orders',
    alias: 'getOrders',
    description: `Retrieves paginated orders filtered by the authenticated user&#x27;s role and permissions. Customers see only their own orders, drivers see all pending orders (with customer details only for orders assigned to them), and admins see all orders in the system. Supports comprehensive filtering by status, price range, date range, customer/driver ID, and search across addresses and descriptions. Results can be sorted by various fields including price, status, and dates.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'page',
        type: 'Query',
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(100).optional().default(10),
      },
      {
        name: 'search',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_by',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_order',
        type: 'Query',
        schema: z.enum(['asc', 'desc']).optional().default('desc'),
      },
      {
        name: 'date_from',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'date_to',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'price_min',
        type: 'Query',
        schema: z.number().gte(0).nullish(),
      },
      {
        name: 'price_max',
        type: 'Query',
        schema: z.number().gte(0).nullish(),
      },
      {
        name: 'status',
        type: 'Query',
        schema: z
          .enum(['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'])
          .optional(),
      },
      {
        name: 'customer_id',
        type: 'Query',
        schema: z.number().gt(0).optional(),
      },
      {
        name: 'driver_id',
        type: 'Query',
        schema: z.number().gt(0).optional(),
      },
      {
        name: 'pickup_city',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'delivery_city',
        type: 'Query',
        schema: z.string().optional(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            id: z.number(),
            customer_id: z.number(),
            driver_id: z.number().nullable(),
            pickup_address: z.string(),
            delivery_address: z.string(),
            package_description: z.string(),
            package_weight: z.string().nullable(),
            package_dimensions: z.string().nullable(),
            price: z.number(),
            status: z.enum([
              'pending',
              'accepted',
              'picked_up',
              'in_transit',
              'delivered',
              'cancelled',
            ]),
            notes: z.string().nullable(),
            pickup_time: z.string().nullable(),
            delivery_time: z.string().nullable(),
            ff: z.boolean(),
            createdAt: z.string().nullable(),
            updatedAt: z.string().nullable(),
          })
          .passthrough(),
        meta: z
          .object({
            page: z.number().int().gte(1),
            limit: z.number().int().gte(1).lte(100),
            total: z.number().int().gte(0),
            totalPages: z.number().int().gte(0),
            hasNext: z.boolean(),
            hasPrev: z.boolean(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token to access orders.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Access denied. Users can only access orders based on their role: customers see their own orders, drivers see pending orders, admins see all orders.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid query parameters provided. Please check the filtering, sorting, and pagination parameters format.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/orders',
    alias: 'postOrders',
    description: `Creates a new delivery order in the system. This endpoint is restricted to customers who can create orders for package delivery. The order will be created with &#x27;pending&#x27; status and made available for driver applications. All delivery details, pricing, and timing information must be provided.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `Complete order information including pickup/delivery addresses, package details, pricing, and optional timing preferences. The order will be automatically assigned to the authenticated customer.`,
        type: 'Body',
        schema: postOrders_Body,
      },
    ],
    response: z
      .object({
        id: z.number(),
        customer_id: z.number(),
        driver_id: z.number().nullable(),
        pickup_address: z.string(),
        delivery_address: z.string(),
        package_description: z.string(),
        package_weight: z.string().nullable(),
        package_dimensions: z.string().nullable(),
        price: z.number(),
        status: z.enum([
          'pending',
          'accepted',
          'picked_up',
          'in_transit',
          'delivered',
          'cancelled',
        ]),
        notes: z.string().nullable(),
        pickup_time: z.string().nullable(),
        delivery_time: z.string().nullable(),
        ff: z.boolean(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid request data. Common issues include missing required fields, invalid addresses, or malformed data.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token to create orders.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Access denied. Only customers can create delivery orders. Drivers cannot create orders.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid order data provided. Common issues include: missing required addresses, invalid pricing, malformed package details, or invalid date formats.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/orders/:id',
    alias: 'getOrdersId',
    description: `Retrieves detailed information about a specific delivery order. Access is restricted based on user role: customers can only view their own orders, drivers can view pending orders (with customer details only for assigned orders), and admins can view any order. This endpoint provides complete order tracking information while protecting customer privacy for unassigned orders.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.number().nullable(),
      },
    ],
    response: z
      .object({
        id: z.number(),
        customer_id: z.number(),
        driver_id: z.number().nullable(),
        pickup_address: z.string(),
        delivery_address: z.string(),
        package_description: z.string(),
        package_weight: z.string().nullable(),
        package_dimensions: z.string().nullable(),
        price: z.number(),
        status: z.enum([
          'pending',
          'accepted',
          'picked_up',
          'in_transit',
          'delivered',
          'cancelled',
        ]),
        notes: z.string().nullable(),
        pickup_time: z.string().nullable(),
        delivery_time: z.string().nullable(),
        ff: z.boolean(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token to access order information.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Access denied. You don&#x27;t have permission to view this order. Users can only access their own orders, orders assigned to them, or pending orders if they&#x27;re drivers.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `The specified order was not found in the system. Please verify the order ID is correct.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid order ID format provided in the request parameters. The ID must be a valid integer.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'patch',
    path: '/orders/:id',
    alias: 'patchOrdersId',
    description: `Updates specific fields of an existing delivery order. Access is controlled by user role and order ownership. Customers can update their orders before driver assignment, drivers can update delivery status and tracking information, and admins can update any order. Only provided fields will be updated, allowing for flexible partial updates.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `Partial order data containing only the fields to be updated. Available fields depend on user role and order status. Customers can modify delivery details, drivers can update status and tracking.`,
        type: 'Body',
        schema: patchOrdersId_Body,
      },
      {
        name: 'id',
        type: 'Path',
        schema: z.number().nullable(),
      },
    ],
    response: z
      .object({
        id: z.number(),
        customer_id: z.number(),
        driver_id: z.number().nullable(),
        pickup_address: z.string(),
        delivery_address: z.string(),
        package_description: z.string(),
        package_weight: z.string().nullable(),
        package_dimensions: z.string().nullable(),
        price: z.number(),
        status: z.enum([
          'pending',
          'accepted',
          'picked_up',
          'in_transit',
          'delivered',
          'cancelled',
        ]),
        notes: z.string().nullable(),
        pickup_time: z.string().nullable(),
        delivery_time: z.string().nullable(),
        ff: z.boolean(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid request data or business rule violation. Common issues include invalid status transitions, updating completed orders, or malformed data.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token to update orders.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Access denied. You don&#x27;t have permission to modify this order, or the order status doesn&#x27;t allow updates.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `The specified order was not found in the system. Please verify the order ID is correct.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 409,
        description: `Update failed due to a conflict, such as the order being modified by another user or having an incompatible status change.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid data provided. Common issues include: invalid order ID, restricted field updates, invalid status transitions, or malformed data.`,
        schema: z.union([
          z
            .object({
              success: z.boolean(),
              error: z
                .object({
                  issues: z.array(
                    z
                      .object({
                        code: z.string(),
                        path: z.array(z.union([z.string(), z.number()])),
                        message: z.string().optional(),
                      })
                      .passthrough()
                  ),
                  name: z.string(),
                })
                .passthrough(),
            })
            .passthrough(),
          z
            .object({
              success: z.boolean(),
              error: z
                .object({
                  issues: z.array(
                    z
                      .object({
                        code: z.string(),
                        path: z.array(z.union([z.string(), z.number()])),
                        message: z.string().optional(),
                      })
                      .passthrough()
                  ),
                  name: z.string(),
                })
                .passthrough(),
            })
            .passthrough(),
        ]),
      },
    ],
  },
  {
    method: 'delete',
    path: '/orders/:id',
    alias: 'deleteOrdersId',
    description: `Cancels or permanently removes a delivery order from the system. This action is restricted to customers who own the order and admin users. Orders with assigned drivers or in progress cannot be deleted and must be cancelled through status updates instead. This action is irreversible.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.number().nullable(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Order cannot be deleted due to business constraints, such as having an assigned driver or being in progress.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token to delete orders.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Access denied. Only customers can delete their own orders, and admins can delete any order. Orders in progress cannot be deleted.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `The specified order was not found in the system. The order may have already been deleted or the ID is incorrect.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid order ID format provided in the request parameters. The ID must be a valid integer.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/orders/:id/applications',
    alias: 'getOrdersIdapplications',
    description: `Retrieves paginated driver applications submitted for a specific delivery order with comprehensive filtering and sorting capabilities. This endpoint is typically used by order owners (customers) to view which drivers have applied to fulfill their delivery request and make informed decisions about driver selection. Supports filtering by application status, date range, and search across driver information.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.number().nullable(),
      },
      {
        name: 'page',
        type: 'Query',
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(100).optional().default(10),
      },
      {
        name: 'search',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_by',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_order',
        type: 'Query',
        schema: z.enum(['asc', 'desc']).optional().default('desc'),
      },
      {
        name: 'date_from',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'date_to',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'status',
        type: 'Query',
        schema: z.enum(['pending', 'accepted', 'rejected']).optional(),
      },
      {
        name: 'order_id',
        type: 'Query',
        schema: z.number().gt(0).optional(),
      },
      {
        name: 'driver_id',
        type: 'Query',
        schema: z.number().gt(0).optional(),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.number(),
              order_id: z.number(),
              driver_id: z.number(),
              status: z.enum(['pending', 'accepted', 'rejected']),
              message: z.string().nullable(),
              createdAt: z.string().nullable(),
              updatedAt: z.string().nullable(),
              driver: z
                .object({
                  id: z.number(),
                  name: z.string(),
                  email: z.string(),
                  phone: z.string().nullable(),
                  avatar: z.string().nullable(),
                })
                .passthrough(),
            })
            .passthrough()
        ),
        meta: z
          .object({
            page: z.number().int().gte(1),
            limit: z.number().int().gte(1).lte(100),
            total: z.number().int().gte(0),
            totalPages: z.number().int().gte(0),
            hasNext: z.boolean(),
            hasPrev: z.boolean(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Access denied. You don&#x27;t have permission to view applications for this order.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `The specified order was not found in the system`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid order ID format or query parameters. Common issues include: invalid pagination parameters, invalid filter values (dates, enum values), or malformed sort parameters.`,
        schema: z.union([
          z
            .object({
              success: z.boolean(),
              error: z
                .object({
                  issues: z.array(
                    z
                      .object({
                        code: z.string(),
                        path: z.array(z.union([z.string(), z.number()])),
                        message: z.string().optional(),
                      })
                      .passthrough()
                  ),
                  name: z.string(),
                })
                .passthrough(),
            })
            .passthrough(),
          z
            .object({
              success: z.boolean(),
              error: z
                .object({
                  issues: z.array(
                    z
                      .object({
                        code: z.string(),
                        path: z.array(z.union([z.string(), z.number()])),
                        message: z.string().optional(),
                      })
                      .passthrough()
                  ),
                  name: z.string(),
                })
                .passthrough(),
            })
            .passthrough(),
        ]),
      },
    ],
  },
  {
    method: 'get',
    path: '/orders/available',
    alias: 'getOrdersavailable',
    description: `Retrieves paginated delivery orders that are currently available for driver applications. These are orders that have been created by customers but don&#x27;t have an assigned driver yet. This endpoint serves as the marketplace where drivers can browse and choose which orders to apply for based on location, price, and package details. Customer information is intentionally excluded for privacy reasons.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'page',
        type: 'Query',
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(100).optional().default(10),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.number(),
              pickup_address: z.string(),
              delivery_address: z.string(),
              package_description: z.string(),
              package_weight: z.string().nullable(),
              package_dimensions: z.string().nullable(),
              price: z.number(),
              pickup_time: z.string().nullable(),
              delivery_time: z.string().nullable(),
              createdAt: z.string().nullable(),
            })
            .passthrough()
        ),
        meta: z
          .object({
            page: z.number().int().gte(1),
            limit: z.number().int().gte(1).lte(100),
            total: z.number().int().gte(0),
            totalPages: z.number().int().gte(0),
            hasNext: z.boolean(),
            hasPrev: z.boolean(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token to access available orders`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Access denied. Your account may be inactive or lack sufficient permissions to view available orders.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid pagination parameters. Page must be &gt;&#x3D; 1 and limit must be between 1 and 100.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/realtime/broadcast',
    alias: 'postRealtimebroadcast',
    description: `Broadcasts a real-time event to connected WebSocket clients. Requires authentication and appropriate permissions. Events are delivered based on targeting rules and user access permissions.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: postRealtimebroadcast_Body,
      },
    ],
    response: z.object({ success: z.boolean(), message: z.string() }).passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Insufficient permissions to broadcast events`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.object({ error: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/realtime/connections',
    alias: 'getRealtimeconnections',
    description: `Retrieves information about active real-time WebSocket connections. Access is restricted based on user role - admins can see all connections, others can only see their own.`,
    requestFormat: 'json',
    response: z
      .object({
        count: z.number(),
        connections: z.array(
          z
            .object({
              userId: z.string(),
              userRole: z.enum(['admin', 'driver', 'customer']),
              connectedAt: z.number(),
              lastActivity: z.number(),
            })
            .passthrough()
        ),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.object({ error: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/realtime/health',
    alias: 'getRealtimehealth',
    description: `Health check endpoint for the real-time service. Public endpoint that doesn&#x27;t require authentication.`,
    requestFormat: 'json',
    response: z.object({ status: z.string(), timestamp: z.number() }).passthrough(),
    errors: [
      {
        status: 500,
        description: `Internal server error`,
        schema: z.object({ error: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/realtime/websocket',
    alias: 'getRealtimewebsocket',
    description: `Establishes a WebSocket connection for real-time updates. Requires authentication via JWT token in Authorization header. Users will receive real-time events based on their role and access permissions.`,
    requestFormat: 'json',
    response: z.void(),
    errors: [
      {
        status: 101,
        description: `WebSocket connection established`,
        schema: z.void(),
      },
      {
        status: 400,
        description: `Bad request - missing required parameters or invalid WebSocket upgrade`,
        schema: z.object({ error: z.string(), message: z.string().optional() }).passthrough(),
      },
      {
        status: 401,
        description: `Authentication required`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/users',
    alias: 'getUsers',
    description: `Retrieves a paginated list of all registered users in the cargo delivery system with comprehensive filtering and sorting capabilities. This endpoint provides access to user profiles for administrative purposes, driver discovery, and system management. Supports filtering by role, location, subscription status, and search across names and emails. Results can be sorted by various fields including name, role, and registration date.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'page',
        type: 'Query',
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(100).optional().default(10),
      },
      {
        name: 'search',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_by',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'sort_order',
        type: 'Query',
        schema: z.enum(['asc', 'desc']).optional().default('desc'),
      },
      {
        name: 'role',
        type: 'Query',
        schema: z.enum(['driver', 'customer', 'admin']).optional(),
      },
      {
        name: 'country',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'city',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'subscription_status',
        type: 'Query',
        schema: z.boolean().nullish(),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
              phone: z.string().nullable(),
              avatar: z.string().nullable(),
              country: z.string().nullable(),
              city: z.string().nullable(),
              role: z.enum(['driver', 'customer', 'admin']),
              stripe_customer_id: z.string().nullable(),
              subscription_status: z.boolean(),
              ff: z.boolean(),
              createdAt: z.string().nullable(),
              updatedAt: z.string().nullable(),
            })
            .passthrough()
        ),
        meta: z
          .object({
            page: z.number().int().gte(1),
            limit: z.number().int().gte(1).lte(100),
            total: z.number().int().gte(0),
            totalPages: z.number().int().gte(0),
            hasNext: z.boolean(),
            hasPrev: z.boolean(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token to access user information.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid query parameters. Common issues include: invalid pagination parameters (page must be &gt;&#x3D; 1, limit must be between 1 and 100), invalid filter values (role, boolean values), or malformed sort parameters.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/users',
    alias: 'postUsers',
    description: `Creates a new user account in the cargo delivery system. This endpoint allows for programmatic user registration and is typically used for administrative user creation or bulk user imports. The user will be created with the specified role (driver or customer) and can immediately begin using the system.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `Complete user information including name, email, password, role, and optional contact details. The password will be securely hashed before storage.`,
        type: 'Body',
        schema: postUsers_Body,
      },
    ],
    response: z
      .object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        phone: z.string().nullable(),
        avatar: z.string().nullable(),
        country: z.string().nullable(),
        city: z.string().nullable(),
        role: z.enum(['driver', 'customer', 'admin']),
        stripe_customer_id: z.string().nullable(),
        subscription_status: z.boolean(),
        ff: z.boolean(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid request data. Common issues include missing required fields or invalid data formats.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 403,
        description: `Creating admin users is not allowed`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 409,
        description: `User creation failed because the email address is already registered in the system.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid user data provided. Common issues include: invalid email format, weak password, missing required fields, or duplicate email address.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/users/:id',
    alias: 'getUsersId',
    description: `Retrieves detailed information about a specific user in the cargo delivery system. This endpoint is useful for viewing user profiles, verifying driver credentials, or displaying customer information during order management. Only public profile information is returned for security.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.number().nullable(),
      },
    ],
    response: z
      .object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        phone: z.string().nullable(),
        avatar: z.string().nullable(),
        country: z.string().nullable(),
        city: z.string().nullable(),
        role: z.enum(['driver', 'customer', 'admin']),
        stripe_customer_id: z.string().nullable(),
        subscription_status: z.boolean(),
        ff: z.boolean(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token to access user information.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `The specified user was not found in the system. Please verify the user ID is correct.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid user ID format provided in the request parameters. The ID must be a valid integer.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: 'patch',
    path: '/users/:id',
    alias: 'patchUsersId',
    description: `Updates specific fields of a user&#x27;s profile information. This endpoint allows for partial updates of user data such as name, email, phone number, or avatar. Only the fields provided in the request body will be updated, leaving other fields unchanged. This is commonly used for profile management and administrative updates.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `Partial user data containing only the fields to be updated. All fields are optional, allowing for flexible profile updates.`,
        type: 'Body',
        schema: patchUsersId_Body,
      },
      {
        name: 'id',
        type: 'Path',
        schema: z.number().nullable(),
      },
    ],
    response: z
      .object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        phone: z.string().nullable(),
        avatar: z.string().nullable(),
        country: z.string().nullable(),
        city: z.string().nullable(),
        role: z.enum(['driver', 'customer', 'admin']),
        stripe_customer_id: z.string().nullable(),
        subscription_status: z.boolean(),
        ff: z.boolean(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid request data or business rule violation. Common issues include attempting to update restricted fields or invalid data formats.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token to update user information.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `The specified user was not found in the system. Please verify the user ID is correct.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 409,
        description: `Update failed due to a conflict, such as trying to change email to one that already exists.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid data provided. Common issues include: invalid email format, invalid user ID, or attempting to update restricted fields.`,
        schema: z.union([
          z
            .object({
              success: z.boolean(),
              error: z
                .object({
                  issues: z.array(
                    z
                      .object({
                        code: z.string(),
                        path: z.array(z.union([z.string(), z.number()])),
                        message: z.string().optional(),
                      })
                      .passthrough()
                  ),
                  name: z.string(),
                })
                .passthrough(),
            })
            .passthrough(),
          z
            .object({
              success: z.boolean(),
              error: z
                .object({
                  issues: z.array(
                    z
                      .object({
                        code: z.string(),
                        path: z.array(z.union([z.string(), z.number()])),
                        message: z.string().optional(),
                      })
                      .passthrough()
                  ),
                  name: z.string(),
                })
                .passthrough(),
            })
            .passthrough(),
        ]),
      },
    ],
  },
  {
    method: 'delete',
    path: '/users/:id',
    alias: 'deleteUsersId',
    description: `Permanently removes a user account from the cargo delivery system. This action is irreversible and will delete all associated user data. Before deletion, ensure that the user has no active orders or pending applications. This endpoint is typically used for account deactivation or administrative cleanup.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.number().nullable(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `User cannot be deleted due to business constraints, such as having active orders or pending applications.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 401,
        description: `Authentication required. Please provide a valid Bearer token to delete user accounts.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `The specified user was not found in the system. The user may have already been deleted or the ID is incorrect.`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 422,
        description: `Invalid user ID format provided in the request parameters. The ID must be a valid integer.`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
