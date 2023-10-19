import {serverVersions, currentServerVersion} from './versionConfig';

export const config = {
  host: 'ros.1pharmacy.io',
  ...serverVersions[currentServerVersion],
};
