function(doc, req) {
    if (!doc) {
        return [null, 'error: document does not exist'];
    }
    if (doc.FDLclass != 'Feature') {
        return [doc, 'error: document is not a Feature document'];
    }
    doc.votes++;
    return [doc, 'success: document updated'];
}