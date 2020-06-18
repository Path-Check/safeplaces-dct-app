import Foundation

typealias JSONObject = [String: Any]
typealias JSONObjectArray = [JSONObject]

protocol JSONSerializable {

  func toJson() throws -> JSONObject

}

protocol JSONDeserializable {

  init(json: JSONObject) throws

}

extension Encodable {

  func toJson() throws -> Any {
    let encoder = JSONEncoder()
    encoder.dateEncodingStrategy = .iso8601
    encoder.dataEncodingStrategy = .base64

    return try JSONSerialization.jsonObject(with: encoder.encode(self), options: [])
  }

}

extension Decodable {

  init(json: JSONObject) throws {
    let data = try JSONSerialization.data(withJSONObject: json, options: [])

    let decoder = JSONDecoder()
    decoder.dateDecodingStrategy = .iso8601

    self = try decoder.decode(Self.self, from: data)
  }

}
