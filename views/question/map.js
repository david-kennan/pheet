function(doc) {
	if (doc.questions) {
  	emit( doc._id, doc );
	}
}