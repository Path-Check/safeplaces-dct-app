import Alamofire

final class APIClient {

  let baseUrl: URL
  static let shared = APIClient(baseUrl: URL(string: "READ FROM ENV")!)

  private let sessionManager: SessionManager

  init(baseUrl: URL) {
    self.baseUrl = baseUrl

    let configuration = URLSessionConfiguration.default

    let headers = SessionManager.defaultHTTPHeaders

    configuration.httpAdditionalHeaders = headers
    configuration.requestCachePolicy = .reloadIgnoringLocalAndRemoteCacheData

    sessionManager = SessionManager(configuration: configuration)
  }

  func request<T: APIRequest>(_ request: T, completion: @escaping GenericCompletion) where T.ResponseType == Void {
    dataRequest(for: request)
      .validate(validate)
      .response { response in
        if let error = response.error {
          completion(.failure(error))
        }
        else {
          completion(GenericSuccess)
        }
    }
  }

  func request<T: APIRequest>(_ request: T, completion: @escaping (Result<JSONObject>) -> Void) where T.ResponseType == JSONObject {
    dataRequest(for: request)
      .validate(validate)
      .responseJSON { response in
        switch response.result {
        case .success(let value):
          completion(.success(value as? JSONObject ?? JSONObject()))
        case .failure(let error):
          completion(.failure(error))
        }
    }
  }

  func request<T: APIRequest>(_ request: T, completion: @escaping (Result<T.ResponseType>) -> Void) where T.ResponseType: Decodable {
    requestDecodable(request, completion: completion)
  }

  func requestList<T: APIRequest>(_ request: T, completion: @escaping (Result<[T.ResponseType.Element]>) -> Void) where T.ResponseType: Collection, T.ResponseType.Element: Decodable {
    requestDecodables(request, completion: completion)
  }

  func cancelAllRequests() {
    sessionManager.session.getAllTasks { tasks in
      tasks.forEach { $0.cancel() }
    }
  }

}

// MARK: - Private

private extension APIClient {

  enum Key {
    static let error = "error"
    static let errorMessage = "error_description"
  }

  func dataRequest<T: APIRequest>(for request: T) -> DataRequest {
    return sessionManager.request(
      baseUrl.appendingPathComponent(request.path, isDirectory: false),
      method: request.method,
      parameters: request.parameters,
      encoding: request.encoding
    )
  }

  func validate(request: URLRequest?, response: HTTPURLResponse, data: Data?) -> Request.ValidationResult {
    if (200...399).contains(response.statusCode) {
      return .success
    }

    // Attempt to deserialize structured error, if it exists
    if let data = data, let json = (try? JSONSerialization.jsonObject(with: data, options: [])) as? JSONObject, let errorJson = json[Key.error] as? JSONObject {
      do {
        return .failure(try StructuredError(json: errorJson))
      } catch {
        return .failure(error)
      }
    }

    // Fallback on a simple status code error
    return .failure(GenericError(statusCode: response.statusCode))
  }

  func requestDecodable<T: APIRequest>(_ request: T, completion: @escaping (Result<T.ResponseType>) -> Void) where T.ResponseType: Decodable {
    dataRequest(for: request)
      .validate(validate)
      .responseData { response in
        switch response.result {
        case .success(let data):
          do {
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .formatted(DateFormatter.iso8601Full)
            completion(.success(try decoder.decode(T.ResponseType.self, from: data)))
          } catch {
            completion(.failure(error))
          }
        case .failure(let error):
          completion(.failure(error))
        }
    }
  }

  func requestDecodables<T: APIRequest>(_ request: T, completion: @escaping (Result<[T.ResponseType.Element]>) -> Void) where T.ResponseType: Collection, T.ResponseType.Element: Decodable {
    requestDecodable(CollectionAPIRequest(request: request)) { result in
      switch result {
      case .success(let value):
        completion(.success(value.results))
      case .failure(let error):
        completion(.failure(error))
      }
    }
  }

}

private struct CollectionAPIRequest<T: APIRequest>: APIRequest where T.ResponseType: Collection, T.ResponseType.Element: Decodable {

  typealias ResponseType = ResultsContainer<T.ResponseType.Element>

  let request: T

  var method: HTTPMethod {
    return request.method
  }

  var path: String {
    return request.path
  }

  var parameters: Parameters? {
    return request.parameters
  }

}

private struct ResultsContainer<T: Decodable>: Decodable {
  var results: [T]
}

private extension GenericError {

  init(statusCode: Int) {
    switch statusCode {
    case 400:
      self = .badRequest
    case 401:
      self = .unauthorized
    case 404:
      self = .notFound
    default:
      self = .unknown
    }
  }

}

private extension DateFormatter {
  static let iso8601Full: DateFormatter = {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ"
    formatter.calendar = Calendar(identifier: .iso8601)
    formatter.timeZone = TimeZone(secondsFromGMT: 0)
    formatter.locale = Locale(identifier: "en_US_POSIX")
    return formatter
  }()
}
