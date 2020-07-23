//
//  SupportManager.swift
//  GPS
//
//  Created by Rob Visentin on 7/22/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Foundation
import SupportSDK
import ZendeskCoreSDK

@objc(SupportManager)
class SupportManager: NSObject {

  @objc static let shared = SupportManager()

  private static var isConfigured = false

  @objc static func configure() {
    guard !isConfigured else {
      return
    }

    Zendesk.initialize(
      appId: "c8d4ad5a3c3e6df2e3280011168ebf2f0e9f2c8bb514e1eb",
      clientId: "mobile_sdk_client_1d8e942bec942ec20d86",
      zendeskUrl: "https://safepaths.zendesk.com"
    )
    Support.initialize(withZendesk: Zendesk.instance)

    Zendesk.instance?.setIdentity(.createAnonymous())

    isConfigured = true
  }

  @objc static func requiresMainQueueSetup() -> Bool {
      return true
  }

  @objc func methodQueue() -> DispatchQueue {
    return .main
  }

  @objc func configure() {
    SupportManager.configure()
  }

  @objc
  func presentSupportFlow() {
    guard let presenter = UIApplication.shared.keyWindow?.rootViewController?.topPresenter else {
      return
    }

    configure()

    let requestConfig = RequestUiConfiguration()
    requestConfig.subject = "Report an Issue"
    requestConfig.tags = ["gps", "ios"]
    requestConfig.ticketFormID = 360000827371
    requestConfig.customFields = [
      CustomField(fieldId: 360033622032, value: "iOS"),
      CustomField(fieldId: 360033618552, value: UIDevice.current.systemVersion),
      CustomField(fieldId: 360033141172, value: "\(UIApplication.versionString) (\(UIApplication.versionNumber))")
    ]

    let requestController = RequestUi.buildRequestList(with: [requestConfig])
    let nav = UINavigationController(rootViewController: requestController)

    presenter.present(nav, animated: true)
  }

}
