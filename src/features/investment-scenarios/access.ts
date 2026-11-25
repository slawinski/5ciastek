import { APIError, type Access, type PayloadRequest } from 'payload';

// Next can load the config and action in separate bundles. A registry symbol is
// process-stable across those modules and cannot be supplied through JSON/REST.
const appendAuthority = Symbol.for('5ciastek.scenario-service-append');
export const ownerRead: Access = ({ req }) => req.user?.role === 'administrator' ? { owner: { equals: req.user.id } } : false;
export const trustedAppend: Access = ({ req, data }) => req.context.scenarioAppend === appendAuthority && req.user?.role === 'administrator' && data?.owner === req.user.id;
export function authorizeOwner(req: Pick<PayloadRequest, 'user'>) {
  if (req.user?.role !== 'administrator') throw new APIError('Brak dostępu do scenariuszy.', 403);
  return req.user;
}
export function appendContext() { return { scenarioAppend: appendAuthority }; }
