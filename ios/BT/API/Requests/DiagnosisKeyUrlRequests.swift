import Alamofire
import ExposureNotification

enum DiagnosisKeyUrlRequest: APIRequest {

  typealias ResponseType = Void

  case get(String)

  var method: HTTPMethod {
    switch self {
    case .get:
      return .get
    }
  }

  var path: String {
    switch self {
    case .get(let path):
      return path
    }
  }

  var parameters: Parameters? {
    return nil
  }

}

enum DiagnosisKeyUrlListRequest: APIRequest {

  typealias ResponseType = [URL]

  case get(Int)

  var method: HTTPMethod {
    switch self {
    case .get:
      return .get
    }
  }

  var path: String {
    return ""
  }

  var parameters: Parameters? {
    return nil
  }

}
