/// All errors `scrypt` can throw.
/// - Tag: scryptErrorType
public enum ScryptError: Error {
    /// Thrown length isn't between 1 and (2^32 - 1) * 32.
    case invalidLength
    /// Thrown if any of N, r, p are 0 or N isn't a power of two.
    case invalidParameters
    /// Thrown if the password given was empty.
    case emptyPassword
    /// Thrown if the salt given was empty.
    case emptySalt
    /// Thrown if libscrypt returns an unexpected response code.
    case unknownError(code: Int32)
}

/// Compute scrypt hash for given parameters.
/// - Parameter password: The password bytes.
/// - Parameter salt: The salt bytes.
/// - Parameter length: Desired hash length.
/// - Parameter N: Difficulty, must be a power of two.
/// - Parameter r: Sequential read size.
/// - Parameter p: Number of parallelizable iterations.
/// - Returns: Password hash corresponding to given `length`.
/// - Throws: [ScryptError](x-source-tag://scryptErrorType)
public func scrypt(password: [UInt8], salt: [UInt8], length: Int = 64,
                   N: UInt64 = 16384, r: UInt32 = 8, p: UInt32 = 1) throws -> [UInt8] {
    guard length > 0, UInt64(length) <= 137_438_953_440 else {
        throw ScryptError.invalidLength
    }
    guard r > 0, p > 0, r * p < 1_073_741_824, N.isPowerOfTwo else {
        throw ScryptError.invalidParameters
    }
    var rv = [UInt8](repeating: 0, count: length)
    var result: Int32 = -1
    try rv.withUnsafeMutableBufferPointer { bufptr in
        try password.withUnsafeBufferPointer { passwd in
            guard !passwd.isEmpty else {
                throw ScryptError.emptyPassword
            }
            try salt.withUnsafeBufferPointer { saltptr in
                guard !saltptr.isEmpty else {
                    throw ScryptError.emptySalt
                }
                result = libscrypt_scrypt(
                    passwd.baseAddress!, passwd.count,
                    saltptr.baseAddress!, saltptr.count,
                    N, r, p,
                    bufptr.baseAddress!, length
                )
            }
        }
    }
    guard result == 0 else {
        throw ScryptError.unknownError(code: result)
    }
    return rv
}

extension BinaryInteger {
    var isPowerOfTwo: Bool {
        (self > 0) && (self & (self - 1) == 0)
    }
}
