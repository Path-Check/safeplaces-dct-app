import Alamofire
import ExposureNotification

enum DiagnosisKeyListRequest: APIRequest {

  typealias ResponseType = Void

  case post([ExposureKey])

  var method: HTTPMethod {
    switch self {
    case .post:
      return .post
    }
  }

  var path: String {
    switch self {
    case .post:
      return ""
    }
  }

  var parameters: Parameters? {
    switch self {
    case .post(let diagnosisKeys):
      let params = diagnosisKeys.map { try? $0.toJson() as? JSONObject }
      return [
        "diagnosisKeys": params
      ]
    }
  }

}
