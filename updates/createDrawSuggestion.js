function(doc, req) {
    var docid = req.uuid;
    var receivedObj = JSON.parse(req.body);
    var newDoc = {_id: docid};
    newDoc.page = receivedObj.page;
    newDoc.appVersion = receivedObj.version;
    newDoc.description = receivedObj.description;
    var docCreation = new Date();
    newDoc.dateCreated = docCreation;
    newDoc.lastModified = docCreation;
    newDoc.FDLclass = 'DrawingViaUI';
    newDoc.trackingID = receivedObj.trackingID;
    var imageType = receivedObj.imageType;
    var onlyData = receivedObj.imageData.slice(("data:image/" + imageType + ";base64,").length);
    newDoc._attachments = new Object();
    newDoc._attachments["image."+imageType] = {"content_type":"image/"+imageType, "data":onlyData};
    if (receivedObj.testdata) {
        newDoc.testdata = true;
    }
    var success = newDoc._id && newDoc.page && newDoc.dateCreated && newDoc.lastModified && (newDoc.FDLclass == 'DrawingViaUI') && newDoc.appVersion && newDoc.trackingID;
    //  && newDoc._attachments
    if (success) {
        return [newDoc, 'success: suggestion document created'];
    }
    else {
        return [null, 'error: here is the document: ' + JSON.stringify(newDoc)];
    }
}