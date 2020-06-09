import Alamofire
import Foundation

enum ExposureConfigurationRequest: APIRequest {

  typealias ResponseType = ExposureConfiguration

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
      return ""
    }
  }

}
