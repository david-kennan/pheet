function(doc, req) {
    var receivedObj = JSON.parse(req.body);
    if (!receivedObj.status) {
        return [null, 'error: a status must be specified.'];
    }
    if (receivedObj.status == 'Draft' && !(receivedObj.name && receivedObj.version)) {
        return [null, 'error: a name and version must be specified.'];
    }
    if (receivedObj.status == 'Proposed' && !(receivedObj.name && receivedObj.version && receivedObj.description && receivedObj.parentFeature)) {
        return [null, 'error: a name, version, parentFeature, and description must be specified.'];
    }
    var docid = req.uuid;
    var newDoc = {_id: docid};
    newDoc.name = receivedObj.name;
    newDoc.appVersion = receivedObj.version;
    newDoc.status = receivedObj.status;
    newDoc.parentFeature = receivedObj.parentFeature;
    newDoc.description = receivedObj.description;
    newDoc.FDLclass = 'Feature';
    var docCreation = new Date();
    var dateArray = [docCreation.getUTCFullYear(), docCreation.getUTCMonth() + 1, docCreation.getUTCDate(), docCreation.getUTCHours(), docCreation.getUTCMinutes(), docCreation.getUTCSeconds()];
    newDoc.dateCreated = dateArray;
    newDoc.lastModified = dateArray;
    
    if (receivedObj.suggestions) {
        newDoc.suggestions = receivedObj.suggestions;
    }
    else {
        newDoc.suggestions = {};
    }
    newDoc.votes = 0;
    var success = newDoc._id && (newDoc.FDLclass == 'Feature') && newDoc.appVersion && newDoc.dateCreated && newDoc.lastModified && newDoc.name && newDoc.status && newDoc.suggestions;
    if (success) {
        return [newDoc, newDoc._id];
    }
    return [null, 'error: document does not have the required fields'];
}