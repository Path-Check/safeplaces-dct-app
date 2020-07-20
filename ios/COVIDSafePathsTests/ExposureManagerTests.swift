import Foundation
import  ExposureNotification
import RealmSwift
import XCTest

@testable import BT

class ExposureManagerTests: XCTestCase {
  
  let indexTxt = """
mn/1593432000-1593446400-00001.zip
mn/1593432000-1593446400-00002.zip
mn/1593432000-1593446400-00003.zip
mn/1593432000-1593446400-00004.zip
mn/1593432000-1593446400-00005.zip
mn/1593432000-1593446400-00006.zip
mn/1593432000-1593446400-00007.zip
mn/1593432000-1593446400-00008.zip
mn/1593432000-1593446400-00009.zip
mn/1593432000-1593446400-00010.zip
mn/1593432000-1593446400-00011.zip
mn/1593432000-1593446400-00012.zip
mn/1593432000-1593446400-00013.zip
mn/1593432000-1593446400-00014.zip
mn/1593432000-1593446400-00015.zip
mn/1593432000-1593446400-00016.zip
mn/1593432000-1593446400-00017.zip
mn/1593432000-1593446400-00018.zip
mn/1593432000-1593446400-00019.zip
mn/1593432000-1593446400-00020.zip
mn/1593432000-1593446400-00021.zip
mn/1593432000-1593446400-00022.zip
mn/1593432000-1593446400-00023.zip
mn/1593446400-1593460800-00001.zip
mn/1593446400-1593460800-00002.zip
mn/1593446400-1593460800-00003.zip
mn/1593446400-1593460800-00004.zip
mn/1593446400-1593460800-00005.zip
mn/1593446400-1593460800-00006.zip
mn/1593446400-1593460800-00007.zip
mn/1593446400-1593460800-00008.zip
mn/1593446400-1593460800-00009.zip
mn/1593446400-1593460800-00010.zip
mn/1593446400-1593460800-00011.zip
mn/1593446400-1593460800-00012.zip
mn/1593446400-1593460800-00013.zip
mn/1593446400-1593460800-00014.zip
mn/1593446400-1593460800-00015.zip
mn/1593446400-1593460800-00016.zip
mn/1593446400-1593460800-00017.zip
mn/1593446400-1593460800-00018.zip
mn/1593446400-1593460800-00019.zip
mn/1593446400-1593460800-00020.zip
mn/1593446400-1593460800-00021.zip
mn/1593446400-1593460800-00022.zip
mn/1593446400-1593460800-00023.zip
mn/1593460800-1593475200-00001.zip
mn/1593460800-1593475200-00002.zip
mn/1593460800-1593475200-00003.zip
mn/1593460800-1593475200-00004.zip
mn/1593460800-1593475200-00005.zip
mn/1593460800-1593475200-00006.zip
mn/1593460800-1593475200-00007.zip
mn/1593460800-1593475200-00008.zip
mn/1593460800-1593475200-00009.zip
mn/1593460800-1593475200-00010.zip
mn/1593460800-1593475200-00011.zip
mn/1593460800-1593475200-00012.zip
mn/1593460800-1593475200-00013.zip
mn/1593460800-1593475200-00014.zip
mn/1593460800-1593475200-00015.zip
mn/1593460800-1593475200-00016.zip
mn/1593460800-1593475200-00017.zip
mn/1593460800-1593475200-00018.zip
mn/1593460800-1593475200-00019.zip
mn/1593460800-1593475200-00020.zip
mn/1593460800-1593475200-00021.zip
mn/1593460800-1593475200-00022.zip
"""
  
  func testProcessesCorrectFilePathsDuringFirstRun() {

    // Setup
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = ""
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    let paths = ExposureManager.urlPathsToProcess(indexTxt.gaenFilePaths)

    XCTAssertEqual(paths.first!, "mn/1593432000-1593446400-00001.zip")
    XCTAssertEqual(paths.last!, "mn/1593432000-1593446400-00015.zip")
  }
  
  func testUrlPathsToProcessSecondPass() {

    // Setup
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593432000-1593446400-00015.zip"
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    let paths = ExposureManager.urlPathsToProcess(indexTxt.gaenFilePaths)

    XCTAssertEqual(paths.first!, "mn/1593432000-1593446400-00016.zip")
    XCTAssertEqual(paths.last!, "mn/1593446400-1593460800-00007.zip")
  }
  
  func testUrlPathsToProcessAfterReadingAllButOneFile() {

    // Setup
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00021.zip"
    let paths = ExposureManager.urlPathsToProcess(indexTxt.gaenFilePaths)

    XCTAssertEqual(paths.count, 1)
  }
  
  func testUrlPathsToProcessAfterReadingAllFiles() {

    // Setup
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    let paths = ExposureManager.urlPathsToProcess(indexTxt.gaenFilePaths)

    XCTAssertEqual(paths.count, 0)
  }
  
  func testUpdateRemainingFileCapacityFirstPass() {

    // Setup
    ExposureManager.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset!, to: Date())

    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }
  
  func testUpdateRemainingFileCapacityUnder24Hours() {

    // Setup
    BTSecureStorage.shared.dateLastPerformedFileCapacityReset = Date()
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = 2
    ExposureManager.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset!, to: Date())

    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, 2)
  }
  
  func testUpdateRemainingFileCapacityAfter24Hours() {

    // Setup
    let twoDaysAgo = Calendar.current.date(byAdding: .day, value: -2, to: Date())!
    BTSecureStorage.shared.dateLastPerformedFileCapacityReset = twoDaysAgo
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = 2
    ExposureManager.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset!, to: Date())

    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }
  
  func testSuccessfulDetection() {

    // Setup
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity


    ExposureManager.shared.finish(.success([]),
                                  processedFileCount: 4,
                                  lastProcessedUrlPath: "mn/1593460800-1593475200-00022.zip",
                                  progress: Progress()) { _ in }

    // remainingDailyFileProcessingCapacity decreases, urlOfMostRecentlyDetectedKeyFile is stored
    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00022.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, 11)

    // ----------------

    ExposureManager.shared.finish(.success([]), processedFileCount: 8, lastProcessedUrlPath: "mn/1593460800-1593475200-00023.zip", progress: Progress()) { _ in }

    // remainingDailyFileProcessingCapacity decreases, urlOfMostRecentlyDetectedKeyFile is stored
    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00023.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, 3)

    // ----------------

    // remainingDailyFileProcessingCapacity does not decrease, urlOfMostRecentlyDetectedKeyFile is not stored if empty string
    ExposureManager.shared.finish(.success([]),
                                  processedFileCount: 0,
                                  lastProcessedUrlPath: .default,
                                  progress: Progress()) { _ in }

    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00023.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, 3)
  }
  
  func testFailedDetection() {

    // Setup
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    ExposureManager.shared.finish(.failure(GenericError.unknown),
                                  processedFileCount: 4,
                                  lastProcessedUrlPath: "invalid",
                                  progress: Progress()) { _ in }

    // remainingDailyFileProcessingCapacity does not decrease, urlOfMostRecentlyDetectedKeyFile is not stored
    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00022.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }
  
  func testCancelledDetection() {

    // Setup
    let progress = Progress()
    progress.cancel()
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    ExposureManager.shared.finish(.failure(GenericError.unknown), processedFileCount: 4,
                                  lastProcessedUrlPath: "invalid",
                                  progress: progress) { _ in }

    // remainingDailyFileProcessingCapacity does not decrease, urlOfMostRecentlyDetectedKeyFile is not stored
    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00022.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }

  func testExposureStorage() {

    // Setup
    BTSecureStorage.shared.resetUserState() { _ in }

    XCTAssertEqual(BTSecureStorage.shared.userState.exposures.count, 0)

    let exposure = Exposure(id: UUID().uuidString,
                            date: Date().posixRepresentation - Int(TimeInterval.random(in: 0...13)) * 24 * 60 * 60 * 1000,
                            duration: TimeInterval(Int.random(in: 1...10) * 60 * 5 * 1000),
                            totalRiskScore: .random(in: 1...8),
                            transmissionRiskLevel: .random(in: 0...7))
    ExposureManager.shared.finish(.success([exposure]),
                                  processedFileCount: 4,
                                  lastProcessedUrlPath: .default,
                                  progress: Progress()) { _ in }
    XCTAssertEqual(BTSecureStorage.shared.userState.exposures.count, 1)
  }

  func testInitialFileCapacity() {

    // Setup
    BTSecureStorage.shared.resetUserState() { _ in }
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }

  func testFilterOldKeysForSubmission() {
    // Keys older than 350 hours should not be submitted
    
    let oneMonthAgo: Date = Calendar.current.date(byAdding: .month, value: -1, to: Date())!
    let oneWeekAgo: Date = Calendar.current.date(byAdding: .day, value: -7, to: Date())!
    let today: Date = Date()

    let keyA = ENTemporaryExposureKey()
    keyA.rollingStartNumber = ENTemporaryExposureKey.rollingStartNumber(oneMonthAgo)

    let keyB = ENTemporaryExposureKey()
    keyB.rollingStartNumber = ENTemporaryExposureKey.rollingStartNumber(oneWeekAgo)

    let keyC = ENTemporaryExposureKey()
    keyC.rollingStartNumber = ENTemporaryExposureKey.rollingStartNumber(today)

    let currentKeys = [keyA, keyB, keyC].current()

    XCTAssertFalse(currentKeys.contains(keyA))
    XCTAssertTrue(currentKeys.contains(keyB))
    XCTAssertTrue(currentKeys.contains(keyC))
  }

}


