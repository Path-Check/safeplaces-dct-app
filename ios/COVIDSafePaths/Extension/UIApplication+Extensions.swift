//
//  UIApplication+Extensions.swift
//  GPS
//
//  Created by Rob Visentin on 7/23/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import UIKit

extension UIApplication {

    static var versionString: String {
        return Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? ""
    }

    static var versionNumber: Int {
        return Int(Bundle.main.object(forInfoDictionaryKey: kCFBundleVersionKey as String) as? String ?? "") ?? 0
    }

}
