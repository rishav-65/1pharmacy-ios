import {serverVersions, currentServerVersion} from './versionConfig';

export const config = {
  host: 'apiv2.1pharmacy.io',
  ...serverVersions[currentServerVersion],
};
