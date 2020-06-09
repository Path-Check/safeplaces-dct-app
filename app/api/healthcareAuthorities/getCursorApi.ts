import type { HealthcareAuthority } from './getHealthcareAuthoritiesApi';

type Page = {
  id: string;
  startTimestamp: number;
  endTimestamp: number;
  filename: string; // to be appended to 'api_endpoint_url'
};

export type Cursor = {
  version: string;
  name: string;
  publish_date_utc: number;
  info_website_url: string;
  api_endpoint_url: string; // Where cursor is hosted
  privacy_policy_url: string;
  reference_website_url: string;
  notification_threshold_percent: number;
  notification_threshold_count: number;
  pages: Page[];
};

const getCursorApi = async (
  healthcareAuthority: HealthcareAuthority,
): Promise<Cursor> => {
  return fetch(healthcareAuthority.cursor_url).then((res) => res.json());
};

export default getCursorApi;
