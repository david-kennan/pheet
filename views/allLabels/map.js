function(doc) {
    if (doc.FDLclass == 'Labels') {
        emit(null, doc.labels);
    }
}