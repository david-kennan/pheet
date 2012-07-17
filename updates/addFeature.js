function(doc, req) {
    if (!doc) {
        return [null, 'error: document does not exist'];
    }
    var receivedObj = JSON.parse(req.body);
    for (var key in receivedObj) {
        doc.featureID[key] = receivedObj[key];
        return [doc, 'success: feature \"' + key + '\" added'];
    }
}