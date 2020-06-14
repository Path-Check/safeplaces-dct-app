//
//  IndexFileRequests.swift
//  BTE
//
//  Created by Matthew Buckley on 6/13/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Alamofire

enum IndexFileRequest: APIRequest {

  typealias ResponseType = String

  case get

  var method: HTTPMethod {
    switch self {
    case .get:
      return .get
    }
  }

  var path: String {
//    return "exposure-notification-export-svhfv/spl-demo/index.txt"
    return "iso_8859-1.txt"
  }

}
