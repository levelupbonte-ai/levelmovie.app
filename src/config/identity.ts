import identityData from './identity.json';

export interface IdentityConfig {
  personName: string;
  personRole: string;
  personOneLiner: string;
  orgName: string;
  orgOneLiner: string;
  studioName: string;
  sameAs: string[];
  contactEmail: string;
}

export const IDENTITY: IdentityConfig = identityData;

export default IDENTITY;
