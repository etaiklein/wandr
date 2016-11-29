
let app = XCUIApplication()

//
//  wandr2Snapshot.swift
//  wandr2Snapshot
//
//  Created by Etai Klein on 11/28/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import XCTest

class wandr2Snapshot: XCTestCase {
        
    override func setUp() {
        super.setUp()
        
        // Put setup code here. This method is called before the invocation of each test method in the class.
        
        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false
        // UI tests must launch the application that they test. Doing this in setup will make sure it happens for each test method.
        XCUIApplication().launch()
      
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }
    
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }
    
    func testExample() {
      
      let app = XCUIApplication()
      snapshot("01launchApp")
      
      let searchBar = app.otherElements.children(matching: .textField)
      searchBar.element.tap()
      app.typeText("Washington sq")
      sleep(3)
      snapshot("02search")

      let queryResult = app.otherElements[" Washington Square Arch, Manhattan, New York, New York 10003, United States"]
      queryResult.tap()
      queryResult.tap()
      snapshot("03selectQuery")

      searchBar.element.tap()
      snapshot("04queryAfterSelected")
      
      app.tap()
      app.otherElements[" Wander!"].tap()
      sleep(3)
      snapshot("05journey")

    }
}
