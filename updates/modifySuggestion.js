function(doc, req) {
    if (!doc) {
        return [null, 'Error: document does not exist.'];
    }
    var receivedObj = JSON.parse(req.body);
    var modified = false;
    if (receivedObj.labels) {
        doc.labels = receivedObj.labels;
        modified = true;
    }
    if (receivedObj.inappropriate) {
        doc.inappropriate = receivedObj.inappropriate;
        modified = true;
    }
    if (modified) {
        var dateModified = new Date();
        var dateArray = [dateModified.getUTCFullYear(), dateModified.getUTCMonth() + 1, dateModified.getUTCDate(), dateModified.getUTCHours(), dateModified.getUTCMinutes(), dateModified.getUTCSeconds()];
        doc.lastModified = dateArray;
        return [doc, 'success: document updated'];
    }
    return [doc, 'no changes made'];
}