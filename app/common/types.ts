type Coordinates = {
  latitude: number;
  longitude: number;
};

export type ApiHealthcareAuthority = {
  name: string;
  bounds: {
    ne: Coordinates;
    sw: Coordinates;
  };
  org_id: string;
  cursor_url: string;
  public_api: string;
};

export type HealthcareAuthority = ApiHealthcareAuthority & {
  internal_id: string;
};
