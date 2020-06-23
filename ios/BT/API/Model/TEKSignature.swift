struct TEKSignature {
  var signatureInfo: SignatureInfo = SignatureInfo()
  var batchNum: Int32?
  var hasBatchNum: Bool {
    batchNum != nil
  }
  var batchSize: Int32?
  var hasBatchSize: Bool {
    batchSize != nil
  }
  var signature: Data?
  var hasSignature: Bool {
    signature != nil
  }
}
