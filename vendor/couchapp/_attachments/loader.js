var jquery="jquery-1.7.1.min.js"
var mobile="jquery.mobile-1.1.0.min.js"
var couchlib="jquery.couch.min.js"
var jsonlib="json2.min.js"
var tracklib="tracklib.js"
var incrlib="incrlib.js"
var jquerycookie="jquery.cookie.min.js"
var intllib="rsc.js"
var base="vendor/couchapp/"

var ready = function() {
  console.log("Finished loading, loader_app_version="+loader_app_version);
  $("#dialog_welcome").css('visibility','visible');
}


function load() {
  switch(loader_app_version)
  {
    case 1:
      head.js(
          base+jquery,
          base+mobile,
          base+couchlib,
          base+jsonlib,
          base+tracklib,
          ready
          );
      break;
    case 2:
      head.js(
          base+jquery,
          base+mobile,
          base+couchlib,
          base+jquerycookie,
          base+jsonlib,
          base+intllib,
          base+incrlib,
          base+tracklib,
          ready
          );
      break;
    default: null;
  }
}

load();
