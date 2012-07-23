function registerUser(version) {
  var restFrag = '_update/incrVisitCount/visitCounts';
  var doc = new Object();
  doc.v1c = 0; doc.v2c = 0; doc.v1sc = 0; doc.v2sc = 0;
  if (version == 1) { doc.v1c = 1; } else { doc.v2c = 1; }
  var postData = JSON.stringify(doc);
  $.post(restFrag, postData,
      function(data) {
      },
      "json");
}

