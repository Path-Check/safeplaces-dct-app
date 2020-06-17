import Alamofire

enum IndexFileRequest: APIRequest {

  typealias ResponseType = String

  case get

  var method: HTTPMethod {
    switch self {
    case .get:
      return .get
    }
  }

  var path: String {
    return "iso_8859-1.txt"
  }

}
