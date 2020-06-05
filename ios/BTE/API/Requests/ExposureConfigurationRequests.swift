//
//  ExposureConfigurationRequests.swift
//  BTE
//
//  Created by Matthew Buckley on 6/5/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Alamofire
import Foundation

enum ExposureConfigurationRequest: APIRequest {

  typealias ResponseType = ExposureConfiguration

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
      return "exposureConfiguration"
    }
  }

}
