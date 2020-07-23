//
//  UIViewController+Extensions.swift
//  GPS
//
//  Created by Rob Visentin on 7/23/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import UIKit

extension UIViewController {

  var topPresenter: UIViewController {
      var vc: UIViewController? = presentedViewController
      while vc != nil && vc?.presentedViewController != nil {
          vc = vc?.presentedViewController
      }
      return vc ?? parent?.topPresenter ?? self
  }

}
