//
//  DiagnosisKeyRequests.swift
//  BTE
//
//  Created by Matthew Buckley on 6/5/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Alamofire
import ExposureNotification

enum DiagnosisKeyListRequest: APIRequest {

  typealias ResponseType = [ExposureKey]

  case post([ExposureKey])

  var method: HTTPMethod {
    switch self {
    case .post:
      return .post
    }
  }

  var path: String {
    switch self {
    case .post:
      return "diagnosisKeys"
    }
  }

  var parameters: Parameters? {
    switch self {
    case .post(let diagnosisKeys):
      // Convert keys to something that can be encoded to JSON and upload them.
      let diagnosisKeys = diagnosisKeys.compactMap { diagnosisKey -> ExposureKey? in
        return ExposureKey(keyData: diagnosisKey.keyData,
                                   rollingPeriod: diagnosisKey.rollingPeriod,
                                   rollingStartNumber: diagnosisKey.rollingStartNumber,
                                   transmissionRiskLevel: diagnosisKey.transmissionRiskLevel)
      }
      let params = diagnosisKeys.map { try? $0.toJson() as? JSONObject }
      return [
        "diagnosisKeys": params
      ]
    }
  }

}

enum DiagnosisKeyURLRequest: APIRequest {

  typealias ResponseType = URL

  case get(URL),
  delete(URL)

  var method: HTTPMethod {
    switch self {
    case .get:
      return .get
    case .delete:
      return .delete
    }
  }

  var path: String {
    switch self {
    case .get(let url):
      return "diagnosisKeyFile/\(url)"
    case .delete(let url):
      return "diagnosisKeyFile/\(url)"
    }
  }

}

enum DiagnosisKeyURLListRequest: APIRequest {

  typealias ResponseType = [URL]

  case get

  var method: HTTPMethod {
    switch self {
    case .get:
      return .get
    }
  }

  var path: String {
    switch self {
    case .get:
      return "diagnosisKeyFileURLs"
    }
  }

}
