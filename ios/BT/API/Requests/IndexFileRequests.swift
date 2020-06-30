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
    "spl/index.txt"
  }

}
