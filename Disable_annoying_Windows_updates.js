//
// Disable annoying Windows updates
//
// This WSH javascript searches for Microsoft Silverlight and the monthly
// released Microsoft Malicious Software Removal Tool, and hides those updates
// from the list.
//
// Of course you could do this manually, too, by checking for Windows updates,
// hide the respective one and search again. But as there are several different
// versions of Microsoft Silverlight and the Malicious Software Removal Tool
// this process would be a pain in the ass if done by hand.
//
// Usage:
//	1) Open a command prompt 
// 	2) Execute CScript.exe Disable_annoying_Windows_updates.js
//
// @author: Nils Rekow
// @created: 2016-12-22
// @modified: 2016-12-22
//

// Create a new Windows Update session object and a searcher.
var wu_Session = WScript.CreateObject("Microsoft.Update.Session");
var wu_Searcher = wu_Session.CreateUpdateSearcher();

// Disable searching online.
// Maybe check if searching online in the background (using Task Scheduler)
// is able to hide/disable updates before they are detected by the normal
// Windows update process.
wu_Searcher.Online = false;

do {
	WScript.echo("Searching ...");

	// Fetch available Windows updates, which are not hidden and not installed, yet.
	var searchResult = wu_Searcher.Search("IsHidden=0 And IsInstalled=0");
	var criteriaMatched = false;

	// Check results; one item at the time.
	for (var i = 0; i < searchResult.Updates.Count; i++) {
		var wupdate = searchResult.Updates.Item(i);
		if (!wupdate.Title.indexOf("Microsoft Silverlight") || !wupdate.Title.indexOf("Windows-Tool zum Entfernen") || !wupdate.Title.indexOf("Malicious Software Removal Tool")) {
			// Hide update, if it matches our criteria.
			wupdate.IsHidden = 1;
			WScript.echo("Hiding update: " + wupdate.Title);
			criteriaMatched = true;
		} else {
			// Show other updates, which are not hidden and not installed, yet.
			WScript.echo(".............. " + wupdate.Title);
		}
	}
} while (criteriaMatched);
