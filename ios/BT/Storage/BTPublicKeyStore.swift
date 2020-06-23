import Foundation
import CryptoKit

enum KeyError: Error {
  /// It was not possible to create the base64 encoded data from the public key string
  case encodingError
  /// It was not possible to map the provided bundleID to a matching public key
  case environmentError
  /// It was not possible to read the plist containing the public keys
  case plistError
}

typealias PublicKeyProviding = (_ key: String) throws -> P256.Signing.PublicKey
enum PublicKeyStore {
  static func get(for keyId: String) throws -> P256.Signing.PublicKey {
    guard
      let path = Bundle.main.path(forResource: "PublicKeys", ofType: "plist"),
      let xml = FileManager.default.contents(atPath: path),
      let plistDict = try? PropertyListSerialization.propertyList(from: xml, options: .mutableContainers, format: nil) as? [String: String]
      else {
        throw KeyError.environmentError
    }

    guard let keyString = plistDict[keyId] else {
      throw KeyError.environmentError
    }
    let keyData = Data(base64Encoded: keyString)
    guard let data = keyData else {
      throw KeyError.encodingError
    }

    return try P256.Signing.PublicKey(rawRepresentation: data)
  }
}
