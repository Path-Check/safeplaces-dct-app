import Foundation
import CryptoKit
import ZIPFoundation

// MARK: -  Static helpers for package creation

extension DownloadedPackage {

  /// - note: Will SHA256 hash the data
  static func makeSignature(data: Data, key: P256.Signing.PrivateKey, bundleId: String = Bundle.main.bundleIdentifier!) throws -> TEKSignature {
    var signature = TEKSignature()
    signature.signature = try key.signature(for: data).derRepresentation
    signature.signatureInfo = makeSignatureInfo(bundleId: bundleId)

    return signature
  }

  static func makeSignatureInfo(bundleId: String = Bundle.main.bundleIdentifier!) -> SignatureInfo {
    var info = SignatureInfo()
    info.appBundleID = bundleId

    return info
  }

  static func makePackage(bin: Data, signature: TEKSignature) throws -> DownloadedPackage {
    return DownloadedPackage(
      keysBin: bin,
      signature: signature.signature!
    )
  }

  static func makePackage(bin: Data = Data(bytes: [0xA, 0xB, 0xC], count: 3), key: P256.Signing.PrivateKey) throws -> DownloadedPackage {
    let signature = try makeSignature(data: bin, key: key)
    return try makePackage(bin: bin, signature: signature)
  }
}

// MARK: - Helpers

extension DownloadedPackage {
  func zipped() throws -> Archive {
    guard let archive = Archive(accessMode: .create) else { throw ArchivingError.creationError }

    try archive.addEntry(with: "export.bin", type: .file, uncompressedSize: UInt32(bin.count), bufferSize: 4, provider: { position, size -> Data in
      return bin.subdata(in: position..<position + size)
    })

    try archive.addEntry(with: "export.sig", type: .file, uncompressedSize: UInt32(signature.count), bufferSize: 4, provider: { position, size -> Data in
      return signature.subdata(in: position..<position + size)
    })

    return archive
  }

  func writeSignatureEntry(toDirectory directory: URL, filename: String) throws -> URL {
    let url = directory.appendingPathComponent(filename).appendingPathExtension("sig")
    try signature.write(to: url)
    return url
  }

  func writeKeysEntry(toDirectory directory: URL, filename: String) throws -> URL {
    let url = directory.appendingPathComponent(filename).appendingPathExtension("bin")
    try bin.write(to: url)
    return url
  }

}

enum ArchivingError: Error {
  case creationError
}
