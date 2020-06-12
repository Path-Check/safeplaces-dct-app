import Alamofire

protocol APIRequest {

  associatedtype ResponseType

  var method: HTTPMethod { get }
  var path: String { get }
  var parameters: Parameters? { get }
  var encoding: ParameterEncoding { get }

}

extension APIRequest {

  var method: HTTPMethod {
    return .get
  }

  var parameters: Parameters? {
    return nil
  }

  var encoding: ParameterEncoding {
    switch method {
    case .get, .connect, .options, .head, .trace:
      return URLEncoding.default
    case .post, .patch, .put, .delete:
      return JSONEncoding.default
    }
  }

}
