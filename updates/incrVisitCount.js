function(doc, req) {
    var reqAttrs = JSON.parse(req.body);
    if (!doc) {
      var newDoc = {_id: "visitCounts"};
      newDoc.v1count = 0; newDoc.v2count = 0; newDoc.v1suggcount = 0; newDoc.v2suggcount = 0;
      newDoc.v1count += reqAttrs.v1c;
      newDoc.v2count += reqAttrs.v2c;
      newDoc.v1suggcount += reqAttrs.v1sc;
      newDoc.v2suggcount += reqAttrs.v2sc;
      if (newDoc.v1count || newDoc.v2count) { newDoc.totalcount = 1; }
      return [newDoc, 'success: visitor counts initialized\n'];
    }
    else {
      doc.v1count += reqAttrs.v1c;
      doc.v2count += reqAttrs.v2c;
      doc.v1suggcount += reqAttrs.v1sc;
      doc.v2suggcount += reqAttrs.v2sc;
      if (reqAttrs.v1c || reqAttrs.v2c) { doc.totalcount++; }
      return [doc, 'success: visitor counts updated\n'];
    } 
}
