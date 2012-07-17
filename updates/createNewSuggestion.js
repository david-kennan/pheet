function(doc, req) {
    var docid = req.uuid;
    var receivedObj = JSON.parse(req.body);
    var newDoc = {_id: docid};
    newDoc.page = receivedObj.page;
    newDoc.block = receivedObj.block;
    newDoc.suggestion = receivedObj.suggestion;
    newDoc.appVersion = receivedObj.version;
    var docCreation = new Date();
    var dateArray = [docCreation.getUTCFullYear(), docCreation.getUTCMonth() + 1, docCreation.getUTCDate(), docCreation.getUTCMinutes(), docCreation.getUTCSeconds()];
    newDoc.dateCreated = dateArray;
    newDoc.lastModified = dateArray;
    newDoc.FDLclass = 'SuggestionViaUI';
    newDoc.labels = [];
    newDoc.featureID = {};
    var success = newDoc._id && newDoc.page && newDoc.block && newDoc.suggestion && newDoc.dateCreated && newDoc.lastModified && (newDoc.FDLclass == 'SuggestionViaUI') && newDoc.appVersion && newDoc.labels && newDoc.featureID;
    if (success) {
        return [newDoc, 'success: suggestion document created'];
    }
    else {
        return [null, 'error: document does not have required fields'];
    }
}