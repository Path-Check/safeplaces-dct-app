import Alamofire

public enum Result<T> {

  case success(T)
  case failure(Error)

}

public enum ExposureResult {

  case success(Int)
  case failure(ExposureError)

}

public enum GenericError: Error {

  case unknown
  case badRequest
  case cancelled
  case notFound
  case notImplemented
  case unauthorized

}

public enum ExposureError: LocalizedError {

  case `default`(String?)
  case dailyFileProcessingLimitExceeded
  case cancelled

  public var errorDescription: String? {
    switch self {
    case .default(message: let message):
      guard let unwrappedMessage = message else {
        return localizedDescription
      }
      return unwrappedMessage
    case .dailyFileProcessingLimitExceeded:
      return "Daily exposure detection file processing limit exceeded"
    case .cancelled:
      return "Exposure Detection Cancelled"
    }
  }

}

public enum APIError: LocalizedError {
  case `default`(message: String?)

  public var errorDescription: String? {
    switch self {
    case .default(message: let message):
      guard let unwrappedMessage = message else {
        return ""
      }
      return unwrappedMessage
    }
  }

}

public let GenericSuccess = GenericResult.success(())

public func GenericFailure<T>(_ error: GenericError) -> Result<T> {
  return .failure(error)
}

extension Error {

  public var isCancellation: Bool {
    switch self {
    case let error as GenericError:
      return error == .cancelled
    case let error as NSError:
      return error.domain == NSURLErrorDomain && error.code == NSURLErrorCancelled
    }
  }

}
