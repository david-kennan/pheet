function(doc, req) {
    if (!doc) {
        return [null, 'error: invalid or missing _id'];
    }
    if (!(doc.FDLclass == 'Labels')) {
        return [doc, 'error: the document _id specified does not match that of the labels document.'];
    }
    var newLab = req.body;
    var oldLength = doc.labels.length;
    doc.labels.push(newLab);
    var success = (doc.labels.length == oldLength + 1) && doc.labels[oldLength] == newLab;
    if (success) {
        return [doc, 'success: label ' + newLab + ' added.'];
    }
    return [null, 'error: adding the label failed'];
}