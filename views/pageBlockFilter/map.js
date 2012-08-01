function(doc) {
    if(doc.FDLclass == 'SuggestionViaUI') {
        var queryDoc = {page: doc.page, block: doc.block, suggestion:doc.suggestion, lastModified:doc.lastModified, labels:doc.labels, features:doc.featureID};
        if (doc.inappropriate) {
            queryDoc.inappropriate = doc.inappropriate;
        }
        emit([doc.appVersion, doc.page, doc.block, doc.lastModified], queryDoc);
    }
}