import Alamofire
import ExposureNotification

enum DiagnosisKeyListRequest: APIRequest {

  typealias ResponseType = [ExposureKey]

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
      return "diagnosisKeys"
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

enum DiagnosisKeyURLRequest: APIRequest {

  typealias ResponseType = URL

  case get(URL),
  delete(URL)

  var method: HTTPMethod {
    switch self {
    case .get:
      return .get
    case .delete:
      return .delete
    }
  }

  var path: String {
    switch self {
    case .get(let url):
      return "diagnosisKeyFile/\(url)"
    case .delete(let url):
      return "diagnosisKeyFile/\(url)"
    }
  }

}

enum DiagnosisKeyURLListRequest: APIRequest {

  typealias ResponseType = [URL]

  case get

  var method: HTTPMethod {
    switch self {
    case .get:
      return .get
    }
  }

  var path: String {
    switch self {
    case .get:
      return "diagnosisKeyFileURLs"
    }
  }

}
