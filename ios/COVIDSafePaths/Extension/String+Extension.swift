//
//  String+Extension.swift
//  COVIDSafePaths
//
//  Created by Michael Neas on 5/28/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Foundation

extension String {
  init(integer n: Int, radix: Int, padding: Int) {
    let s = String(n, radix: radix)
    let pad = (padding - s.count % padding) % padding
    self = Array(repeating: "0", count: pad).joined(separator: "") + s
  }
}
