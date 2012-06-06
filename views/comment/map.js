function(doc) {
	if (doc.nodes) {
  	emit( doc._id, doc );
	}
}