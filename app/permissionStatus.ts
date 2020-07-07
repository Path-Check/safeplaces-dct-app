export enum PermissionStatus {
  UNKNOWN,
  GRANTED,
  DENIED,
}

export const statusToEnum = (status: string | void): PermissionStatus => {
  switch (status) {
    case 'unknown': {
      return PermissionStatus.UNKNOWN;
    }
    case 'denied': {
      return PermissionStatus.DENIED;
    }
    case 'blocked': {
      return PermissionStatus.DENIED;
    }
    case 'granted': {
      return PermissionStatus.GRANTED;
    }
    default: {
      return PermissionStatus.UNKNOWN;
    }
  }
};
