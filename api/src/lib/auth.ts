/**
 * This auth implementation is a placeholder. You should replace it with your actual auth implementation.
 */

export const getCurrentUser = async (decoded, { token, type }) => {
  // Return a mocked user for now, as this is just a placeholder
  return { roles: ['admin'] }
}

/**
 * This requireAuth can be used anywhere after auth has been setup
 * For example in directives like `@requireAuth` in the schema
 */
export const requireAuth = ({ roles } = {}) => {
  // If no user exists, throw error
  if (!context.currentUser) {
    throw new AuthenticationError('You must be logged in to access this')
  }

  // If no roles are provided, allow access
  if (typeof roles === 'undefined') {
    return true
  }

  // If user has no roles, deny access
  if (!context.currentUser.roles) {
    throw new ForbiddenError('You do not have permission to access this')
  }

  // Check if user has the required role
  if (!context.currentUser.roles.some((role) => roles.includes(role))) {
    throw new ForbiddenError('You do not have permission to access this')
  }

  // Allow access
  return true
}