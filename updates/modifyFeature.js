function(doc, req) {
    if (!doc) {
        return [null, 'Error: document does not exist.'];
    }
    var receivedObj = JSON.parse(req.body);
    var modified = false;
    if (receivedObj.name) {
        doc.name = receivedObj.name;
        modified = true;
    }
    if (receivedObj.description) {
        doc.description = receivedObj.description;
        modified = true;
    }
    if (receivedObj.parentFeature) {
        doc.parentFeature = receivedObj.parentFeature;
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