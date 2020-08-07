import type { HealthcareAuthority } from './getHealthcareAuthoritiesApi';

type Page1_0 = {
  id: string;
  startTimestamp: number;
  endTimestamp: number;
  filename: string; // to be appended to 'api_endpoint_url'
};

type Page1_1 = Page1_0 & { checksum: string };

export type Cursor1_1 = {
  version: '1.1';
  name: string;
  publish_date_utc: number;
  notification_threshold_percent: number;
  notification_threshold_count: number;
  pages: Page1_1[];
};

export type Cursor1_0 = {
  version: string;
  name: string;
  publish_date_utc: number;
  notification_threshold_percent: number;
  notification_threshold_count: number;
  pages: Page1_0[];
};

const getCursorApi = async (
  healthcareAuthority: HealthcareAuthority,
): Promise<Cursor1_0 | Cursor1_1> => {
  return fetch(healthcareAuthority.cursor_url).then((res) => res.json());
};

export default getCursorApi;
