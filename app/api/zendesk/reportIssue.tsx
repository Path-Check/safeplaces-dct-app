import env from 'react-native-config';
import { Platform } from 'react-native';
import getAppVersion from '../../helpers/getAppVersion';

interface ReportIssueProps {
  email: string;
  name: string;
  body: string;
}

const OS_FIELD_KEY = '360033622032';
const OS_VERSION_FIELD_KEY = '360033618552';
const APP_VERSION_FIELD_KEY = '360033141172';
const APP_NAME_FIELD_KEY = '360034051891';
const ISSUE_SUBJECT = `Issue from GPS mobile application PathCheck ${
  __DEV__ ? '[Dev Testing]' : ''
}`;
const ANONYMOUS = 'Anonymous';
const APP_NAME = 'PathCheck GPS';

const EMAIL_ERROR = 'Email:';

interface ErrorDescription {
  description: string;
}

interface ErrorDetails {
  requester?: ErrorDescription[];
  base: ErrorDescription[];
}

// Errors are of the form:
// {
//   "error": "RecordInvalid",
//   "description": "Record validation errors",
//   "details": {
//     "requester": [
//       {
//         "description": "Requester: Email:  not_really_an_email.com is not properly formatted"
//      }
//    ]
//  }
//}
const parseErrorMessage = (zendeskError?: Record<string, unknown>): string => {
  if (zendeskError?.details) {
    const errorDetails = zendeskError.details as ErrorDetails;
    const errorMessage = (errorDetails?.requester || errorDetails.base)
      .map((error) => {
        return error.description;
      })
      .join(',');
    if (errorMessage.indexOf(EMAIL_ERROR) !== -1) {
      return 'report_issue.errors.invalid_email';
    }
    return errorMessage.replace(':', '-'); // so localize doesn't mess with error message
  }
  return ''; // fallback to no error message, just an error title for our alert.
};

const reportIssue = async ({
  email,
  name,
  body,
}: ReportIssueProps): Promise<void> => {
  const requestBody = {
    request: {
      subject: ISSUE_SUBJECT,
      requester: { name: name.trim().length > 0 ? name : ANONYMOUS, email },
      comment: { body },
      custom_fields: [
        {
          [OS_FIELD_KEY]: Platform.OS,
          [OS_VERSION_FIELD_KEY]: Platform.Version,
          [APP_VERSION_FIELD_KEY]: getAppVersion(),
          [APP_NAME_FIELD_KEY]: APP_NAME,
        },
      ],
    },
  };

  const response = await fetch(env.ZENDESK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const responseJson = await response.json();
    throw new Error(parseErrorMessage(responseJson));
  }
};

export default reportIssue;
