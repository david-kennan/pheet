var togglemode = false;
var nodeDataFetched = false;
var blocksShowing = false; // indicates that the page blocks are highlighted
var activeBlock = "";
var blocks = {};
var nodes = {}; // store nodes from JSON data
var selectedNode = ""; // which node in JSON obj has been selected by user for Detail view
var localdatafilepath = "C:\\dumpdata.js"; // ugh, output requires full path, input does not allow
var Ztmptext = ""; // for showNodeList to pass state to recursive funcs
var ZrawBlockName = ""; // for showNodeList to pass state...
var nodeFound = false; // for showNodeList to pass state...
var selectedNodeId = ""; // for showNode to pass state...
var showNodeReady = false; // for showNodeRecursive... to return
var Znodedtmptext = ""; // for showNode to pass state

function toggle() {
	if( togglemode == false ) {
		if(nodeDataFetched === false){
			getData();
			nodeDataFetched = true; // Future: more robust approach here because the callback may not have occurred yet
		}
		document.getElementById("gear-status").innerHTML = "\<img src=\"..\/img\/gear-selected.png\" onclick=\"toggle()\" alt=\"l_001_l\" width=\"16\" height=\"16\" \>";
		togglemode = true;
		showBlocks();
	} else {
		document.getElementById("gear-status").innerHTML = "\<img src=\"..\/img\/gear-unselected.png\" onclick=\"toggle()\" alt=\"l_001_l\" width=\"16\" height=\"16\" \>";
		togglemode = false;
		blocksShowing = false;
		$('#showBlocksLayer').remove();
	}
}

function showBlocks() {
	// load up the block info into array, then use those values for highlighting
	// block properties are: top, left, id, width, height
	$('.block66').each(function(i){var offset = $(this).offset(); blocks[i] = {'top':offset.top,'left':offset.left,'id':$(this).prop("id"),'width':$(this).prop("clientWidth"),'height':$(this).prop("clientHeight") };})
	blocksShowing = true;
	if($('#showBlocksLayer').length == 0) {
		$(document.body).append("\<div id=\"showBlocksLayer\"\>\<span id=\"showBlocksSpan\" class=\"blockOverlay\"\>\<\/span\>\<\/div\>");
}
	// for each block, draw a rectangle and bind onClick to display Node List
	// put a border around these calculated coordinates, inside the actual block
	for (var i=0;i<getObjectLength(blocks);i++){
		blocks[i].id;
		var blockName = blocks[i].id + "HighlightBlock";
		var blockSelector = "#" + blockName;
		var tmptext = "\<div id=\"" + blockName + "\"\>\<\/div\>";
		$('#showBlocksLayer').append(tmptext);
		$(blockSelector).css({'position': 'absolute', 'z-index': 1300, 'top': blocks[i].top, 'left': blocks[i].left, 'height': blocks[i].height + 'px', 'width': blocks[i].width + 'px', 'border': '1px dashed #f11'});
		$(blockSelector).on('click', showNodeList);}
}

function showNodeList() {
	if( togglemode == true ) {
		var blockName = $(this).prop('id') + "SelectedBlock";
		activeBlock = "#" + blockName;
		var tmptext = "\<div id=\"" + blockName + "\"\>\<\/div\>";
		$(this).append(tmptext);
		var blockSelector = "#" + blockName;
		$(blockSelector).css({'position': 'absolute', 'z-index': 1350, 'top': 0, 'left': 0, 'height': $(this).prop('style').height, 'width': $(this).prop('style').width, 'border': '3px solid #f11'});

		// get the block identifier, lookup associated data, display data in dialog
		if($('#nodeDisplayLayer').length == 0) {
			$(document.body).append("\<div id=\"nodeDisplayLayer\"\>\<span id=\"nodeDisplay\"\>\<\/span\>\<\/div\>");
		}
		var highlightBlockName = $(this).prop('id');
		ZrawBlockName = highlightBlockName.replace("HighlightBlock", "");
		Ztmptext = "\<div\>\<ol\>";
		nodeFound = false;
		// locate nodes that are associated with this block and build snippet for drilldown
		$.each(nodes, function(key, val) { showNodeListRecursive(key, val); });
		Ztmptext += "\<\/ol\>";
		if (!nodeFound) {  
			Ztmptext += "l_002_l<br /><br />";}
		Ztmptext += "\<center\>\<button\
						onclick=\"inputNodeDialog()\"\>\
						l_003_l\
					\<\/button\>\<\/center\>";
		Ztmptext += "\<\/div\>";
		$('#nodeDisplay')[0].innerHTML = Ztmptext;
		var offset = $(activeBlock).offset(); 
		var x = offset.top;
		x += 7 + $(activeBlock).prop("clientHeight");
		$("#nodeDisplay").dialog({ 
			'zIndex': 3999, 
			title: 'l_004_l', 
			modal: true, 
			position: [0,x], 
			width: 480,
			height: 800,
			beforeClose: hideNodeList});
		}};

function showNodeListRecursive(i, n) { // use of recursion may be expensive, but okay for now
	if (typeof n == 'object') { 
		if(n.nodeattrib1=="Level4"){ 
			if(n.nodeattrib9==ZrawBlockName){ 
				nodeFound = true; // non-empty Node set
				Ztmptext += "\<li\>";
				// do some formatting to tag Nodes as Greystate or Blackstate
				// Quick and dirty UI: pre-pending a label. Future: use groupings, color, icons, tabs, tagged after the name, etc.
				if (n.nodeattrib4 == "greystate") {
					Ztmptext += "<i>l_005_l:</i> ";
				} else if (n.nodeattrib4 == "blackstate"){
					Ztmptext += "<i>l_006_l:</i> ";
				} else {
					Ztmptext += "<i>l_007_l:</i> ";} 
				// Future: redesign UI of the "more" link
				Ztmptext += n.nodeattrib2 + " \<a href=\"#\" onclick=\"showNode('" + i + "')\"><i>l_008_l</i><\/a\>\<\/li\>";
			}}
		$.each(n, function(key, val) {
			showNodeListRecursive(key, val);});}}
			
function inputNodeDialog() { 
	if($('#inputNodeDiv').length == 0) {
		$(document.body).append("\<div id=\"inputNodeDiv\"\>\<span id=\"inputNodeSpan\"\>\<\/span\>\<\/div\>");
	}
	var tmptxt = "l_009_l";
	// Change this: instead of the string below, create a template and store it outside this javascript file. 
	// Encapsulate fetching the template within a new function, so that in the future we can change how we get the template
	tmptxt = "\
		\<form name=\"addnode\"\>\
		Node name\<br \/\>\
		\<input type=\"text\" name=\"nname\" size=\"50\" maxlength=\"75\" placeholder=\"Hint1\" \/\>\
		\<br \/\>\<br \/\>\
		Node attrib1\<br \/\>\
		\<textarea name=\"nattrib1\" rows=\"5\" cols=\"40\" placeholder=\"Hint2\"\>\<\/textarea\>\
		\<br \/\>\<br \/\>\
		Nattrib2?\<br \/\>\
		\<select name=\"nattrib2\"\>\
		\<option value=\"optval1\"\>optval1\<\/option\>\
		\<option value=\"optval2\"\>optval2\<\/option\>\
		\<\/select\>\
		\<br \/\>\<br \/\>\
		Node attrib3\<br \/\>\
		\<select name=\"nattrib3\"\>\
		\<option value=\"greystate\" selected=\"selected\"\>Greystate\<\/option\>\
		\<option value=\"blackstate\"\>Blackstate\<\/option\>\
		\</\select\>\
		\<br \/\>\<br \/\>\
		Node attrib4\<br \/\>\
		\<input type=\"text\" name=\"nattrib4\" size=\"50\" maxlength=\"75\" value=\"attrib4_prepop\" \/\>\
		\<br \/\>\<br \/\>\
		Node attrib5\<br \/\>\
		\<input type=\"text\" name=\"nattrib5\" size=\"50\" maxlength=\"75\" value=\"attrib5_prepop\" \/\>\
		\<br \/\>\<br \/\>\
		Node attrib6\<br \/\>\
		\<input type=\"text\" name=\"attrib6\" size=\"50\" maxlength=\"75\" value=\"attrib6_prepop\" \/\>\
		\<br \/\>\<br \/\>\
		\<input type=\"submit\" value=\"Submit\" onclick=\"submitNode()\" \/\>\
		\<input type=\"submit\" value=\"Cancel\" \/\>\
		\<\/form\>";
	// future: populate the form with relevant data-driven presets and choices
	// future: implement a working submit action
	
	$("#inputNodeSpan").dialog({ 
		'zIndex': 4999, 
		title: 'l_010_l', 
		modal: true,
		position: [0,0], 
		width: 480,
		height: 800
	});
	$('#inputNodeSpan')[0].innerHTML = tmptxt;
}

function submitNode() {
	var newNode = {};
	alert("YAYAYAYAYAY");
	// Future: set values like NodeBaal = mishe mmlitz	
	// Future: should get a real GMT timestamp, not this hack
	// Future: consider displaying local timezones, or elapsed, etc.
	// Future: abstract this to a reusable function
	var now_is = new Date();
	newNode.timestamp = now_is.toDateString() + " " + now_is.toTimeString();
	newNode.timestamp = newNode.timestamp.replace("-0800 (Pacific Standard Time)", "");

	// Ignore this: v2012-04-23 and prior has WIP notes here
	// Change this: close the inputNodeDialog using JQuery dialog's method
}

function showNode(i) {
	if($('#showNode_Div').length == 0) {
		$(document.body).append("\<div id=\"showNode_Div\"\>\<span id=\"showNodeSpan\"\>\<\/span\>\<\/div\>");
	}
	Znodedtmptext = "\<div id=\"nodeDetailProperties\"\>";	
	selectedNodeId = i; // store for use by recursive functions
	showNodeReady = false;
	$.each(nodes, function(key, val) { showNodeRecursive(key, val); });

	Znodedtmptext += "\<\/div\>";
	$('#showNodeSpan')[0].innerHTML = Znodedtmptext;
	$("#showNodeSpan").dialog({ 
		'zIndex': 4999, 
		title: 'l_012_l', 
		modal: true,
		width: 480,
		height: 800		});	
}

function showNodeRecursive(i, n) { // use of recursion may be expensive, but is okay for now
	if(showNodeReady) {return;}
	if (typeof n == 'object') { 
		if(n.nodeattrib1=="Level4"){ 
			if (i == selectedNodeId) {
				selectedNode = n; // store for use by other functions
				// Question: would JQuery "Maps" be useful here?
				Znodedtmptext +=       "\<span class=\"stackedBox\"\>\<span class=\"boldLabel\"\>l_013_l: \<\/span\>\<span class=\"stackedBoxContent\"\>" + n.nodeattrib2 + "\<\/span\>\<\/span\>";
				Znodedtmptext += "\<br\>\<span class=\"stackedBox\"\>\<span class=\"boldLabel\"\>l_014_l: \<\/span\>\<span class=\"stackedBoxContent\"\>" + n.nodeattrib5 + "\<\/span\>\<\/span\>";
				Znodedtmptext += "\<br\>\<span class=\"stackedBox\"\>\<span class=\"boldLabel\"\>l_015_l: \<\/span\>\<span class=\"stackedBoxContent\"\>" + n.nodeattrib4 + "\<\/span\>\<\/span\>";
				// Future: NATtext can be a bit long so, consider formatting and maybe an expansion-interaction
				var NATtext = "\<br\>\<br\>";
				var numNATs = getObjectLength(n.nodeattrib6);
				for (var c = 0; c<numNATs; c++) {
					NATtext += "\<div class=\"commentBox\"\>" + n.nodeattrib6[c].comment + "\<br\>\<div class=\"commentSource\"\>\<i\>" + n.nodeattrib6[c].user + "&nbsp;&nbsp;" + n.nodeattrib6[c].timestamp + "\<\/i\>\<br\>\<\/div\>\<\/div\>";
				}
				Znodedtmptext += "\<br\>\<span class=\"stackedBox\"\>\<span class=\"boldLabel\"\>l_016_l:&nbsp;(" + numNATs + ")\<\/span\>\<span class=\"stackedBoxContent\"\>" + NATtext + "\<\/span\>";
				Znodedtmptext += "\<div id=\"nodeDetailNewCommentDiv\"\>\<span id=\"nodeDetailNewComment\"\>";
				// Ignore this: v2012-04-23 has some questions here, may be useful if debugging
				Znodedtmptext += "\<span class=\"newCommentBox\" onclick=\"nodeActionNAT()\"\><span class=\"newCommentHint\"\>";
				Znodedtmptext += "&nbsp;l_017_l\<\/span\>\<\/span\>\<br\>\<\/span\>\<\/span\>\<\/div\>\<\/span\>\<\/span\>";
				Znodedtmptext += "\<span class=\"stackedBox\"\>\<span class=\"boldLabel\"\>l_018_l: \<\/span\>\<span class=\"stackedBoxContent\"\>" + n.nodeattrib3 + "\<\/span\>\<\/span\>";
				Znodedtmptext += "\<span class=\"stackedBox\"\>\
									\<span class=\"actionBarButtonsBlock\"\>\
										\<button\
											onclick=\"nodeActionA()\"\>\
												l_021_l\
										\<\/button\>\
										\<button\
											onclick=\"nodeActionB()\"\>\
												l_022_l\
										\<\/button\>\
										\<button\
											onclick=\"nodeActionC()\"\>\
												l_023_l\
										\<\/button\>\
									\<\/span\>\
								\<\/span\>\
							\<\/span\>";
				showNodeReady = true;
				return;
			}}
		$.each(n, function(key, val) {
			showNodeRecursive(key, val);})}}

function nodeActionA() {
	alert("oops not implemented yet");
}

function nodeActionB() {
	alert("oops not implemented yet");
}

function nodeActionC() {
	alert("oops not implemented yet");
}

function nodeActionNAT() {
	var newNATAreaTxt = "\<textarea id=\"nodeDetailNewCommentInput\" class=\"addCommentBox\"\>";
	$('#nodeDetailNewComment')[0].innerHTML = newNATAreaTxt;
	$('#nodeDetailNewComment')[0].innerHTML += "\<span class=\"addCommentButtons\"\>\<button onclick=\"submitNAT()\"\>l_019_l\<\/button\>\<button onclick=\"drawNATbox()\"\>Cancel\<\/button\>\<\/span\>\<\/span\>\<\/span\>\<\/span\>";
	$('#nodeDetailNewCommentInput')[0].focus();
}

function submitNAT() {
	var newNAT = {};
	newNAT.user = "Agnes";  // Future: will get the userid
	// Future: should get a real GMT timestamp, not this hack, consider displaying local or elapsed time
	var now_is = new Date();
	newNAT.timestamp = now_is.toDateString() + " " + now_is.toTimeString();
	newNAT.timestamp = newNAT.timestamp.replace("-0800 (Pacific Standard Time)", "");
	newNAT.comment = $('#nodeDetailNewCommentInput').prop('value');
	if( "nodeattrib6" in selectedNode ) {
		selectedNode.nodeattrib6.push(newNAT);
	} else {
		selectedNode.nodeattrib6 = [newNAT];
	}
	// Ignore this: v2012-04-23 has some questions here about submit logic
	var newdata = "{   \"nodes\": " + JSON.stringify(nodes, null, '   ') + "}";
	$.twFile.save(localdatafilepath, newdata); // save local file, until API is setup
	drawNATbox();
	// Future: actually we should probably redraw the entire Node dialog, however, not urgent, 
	// Future: If we were using a template to build the page, we could refresh just this section of the page.
}

function drawNATbox() {
	// this text content might be a repeat of what is in function showNode(i) ... so could be abstracted
	var initialNATBox  = "\<span class=\"newCommentBox\" onclick=\"nodeActionNAT()\"\><span class=\"newCommentHint\"\>";
	initialNATBox += "&nbsp;l_020_l\<\/span\>\<\/span\>\<br\>\<\/span\>\<\/span\>\<\/div\>\<\/span\>\<\/span\>";
	$('#nodeDetailNewComment')[0].innerHTML = initialNATBox;
}

function hideNodeList() {
	$(activeBlock).remove();
	activeBlock = "";
};	

function getData() {
	// this is intended to wrap an API (web service)
	// Future: seems like an initial API call will be needed to get either a chunk or all data for the app
	$.getJSON("datafile.js",function(jsonZ){
		nodes = deepCopy(jsonZ.nodes);
	});
}

// This code is from the Net
function deepCopy(obj) {
	if (typeof obj == 'object') {
		if (isArray(obj)) {
			var l = obj.length;
			var r = new Array(l);
			for (var i = 0; i < l; i++) {
				r[i] = deepCopy(obj[i]);
			}
			return r;
		} else {
			var r = {};
			r.prototype = obj.prototype;
			for (var k in obj) {
				r[k] = deepCopy(obj[k]);
			}
			return r;
		}
	}
	return obj;
}

// This code is from the Net
// This function is a helper for deepCopy
var ARRAY_PROPS = {length: 'number', sort: 'function', slice: 'function', splice: 'function'};
/* Determining if something is an array in JavaScript is error-prone at best. */
function isArray(obj) {
	if (obj instanceof Array)
		return true;
	// Otherwise, guess:
	for (var k in ARRAY_PROPS) {
		if (!(k in obj && typeof obj[k] == ARRAY_PROPS[k]))
			return false;
	}
	return true;
}
//end of Net code for deepCopy

// This code is from the Net
// find absolute position of element on page
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
			return [curleft,curtop];
	}
}

// This code is from the Net
function getObjectLength (o) {
  var length = 0;

  for (var i in o) {
    if (Object.prototype.hasOwnProperty.call(o, i)){
      length++;
    }
  }
  return length;
}
