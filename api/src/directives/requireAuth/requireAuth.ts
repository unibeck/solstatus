import gql from 'graphql-tag'

import { createValidatorDirective } from '@redwoodjs/graphql-server'

import { requireAuth as applicationRequireAuth } from 'src/lib/auth'

export const schema = gql`
  """
  Use @requireAuth to validate access to a field, query or mutation.
  """
  directive @requireAuth(
    """
    Optional role or roles to check if the user has
    """
    roles: [String]
  ) on FIELD_DEFINITION
`

const validate = ({ directiveArgs }) => {
  const { roles } = directiveArgs
  applicationRequireAuth({ roles })
  return true
}

const requireAuth = createValidatorDirective(schema, validate)

export default requireAuth