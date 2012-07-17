function(doc) {
    if(doc.FDLclass == 'SuggestionViaUI') {
        emit([doc.appVersion, doc.page], doc.block);
    }
}