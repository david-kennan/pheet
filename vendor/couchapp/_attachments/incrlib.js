// incrlib.js - increpreneur library main file

(function(){
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
	var inShowNodeList = false; // prevent JQuery click handler from being invoked recursively on showNodeList()

	function displaynod( urlObj, options ){
		// if the dialog should contain a Feature List, then display the feature list
		//if($('#nodeDisplay').length != 0) $('#nodeDisplay')[0].innerHTML = Ztmptext;
		var z = getMaxZIndexButGear()+1;
		$(":jqmData(role=dialog)").css('z-index', z);
	}

	// bind to pageLoad event so that dialog can be updated with NodeList
	$(document).bind( "pageload", function( e, data ) {
		// We only want to handle URLs that request our dialogs
		var u = $.mobile.path.parseUrl( data.url ),
		re = /feedback_v2/;
		if ( u.filename.search(re) !== -1 ) {
			// Call method that displays the correct data in the dialog on the fly 
			displaynod( u, data.options );
		}
	});
	
	// bind to pagehide event so that actions can be taken when dialogs are closed
	$(document).bind( "pagehide", function( e, data ) {
		// We only want to handle leaving our dialogs
		//var u = $.mobile.path.parseUrl( data.prevPage ); // this seemed right but prePage was not set
                // BAD!!, not android 2.2-3* compat ** var u = $.mobile.path.parseUrl( e.target.dataset.url);
	  	var u = e.target.getAttribute("data-role");
		if ( u == "dialog" ) {
			 // Call method that displays the correct data in the dialog on the fly 
			 hideNodeList();
             if (e.target.getAttribute("id") == "dialog_a") {
                if (savingFeedback) {
                     trackEvent(7); // Submit Clicked
                     savingFeedback = false;
                }
                else {
                     trackEvent(10); // Suggestions Dialog Closed
                }
             }
		}
	});

	// workaround the default dialog black background that hides page behind it
	// http://tqcblog.com/2012/04/19/transparent-jquery-mobile-dialogs/
	// "For multi page sites you will also need to set the data-dom-cache attribute on the background page to prevent it being removed from the DOM while still visible"
	// That sounds like a requirement on our client apps... so it may become undesirable to use the builtin mobile framework for dialogs
	$(function() {
		$('div[data-role="dialog"]').live('pagebeforeshow', function(e, ui) {
			ui.prevPage.addClass("ui-dialog-background ");
			adjustPosition();		// by xiaozc
		});
		$('div[data-role="dialog"]').live('pagehide', function(e, ui) {
			$(".ui-dialog-background ").removeClass("ui-dialog-background ");
		});

		$('div[data-role="dialog"]').live('pageshow',function(e, ui){
                        var txpos = $("#textarea").offset();
                        if (txpos != null) {
                          var rxpos = $("#textarea").position().top;
                          $.mobile.silentScroll(txpos.top+rxpos);
			  $('#textarea').focus();		// by xiaozc
                        }
		});

	});
	
	function toggle() {
		if( togglemode == false ) {
			if(nodeDataFetched === false){
			
				// BEGIN TEST
//				console.log("start data fetch");
//				$.getJSON("datafile.js",function(jsonZ){
//					nodes = deepCopy(jsonZ.nodes);
//					console.log("ACTUAL data fetch");
//				});
		    //$db = $.couch.db("quote");
		    //$db.view("pheet/comment",
		    //  { success: function( data ) {
		    //      var jsonZ = data.rows[0].value;
		    //      nodes = deepCopy(jsonZ.nodes);
		    //    }
		    //  });


				//getData();	
				// RESTORE THIS !!!
				// end of test

				nodeDataFetched = true; // Future: more robust approach here because the callback may not have occurred yet				
			}
			//if($('#gear-statusLayer').length == 0) {
			//	$(document.body).append("\<div id=\"gear-statusLayer\"\>\<span id=\"gear-status\" class=\"myGear\"\>\<\/span\>\<\/div\>");
			//}
//			$('#gear-status')[0].innerHTML = "\<img src=\"style\/img\/gear-selected.png\" onclick=\"kToggle.toggle()\" alt=\"" + rscK.l_001_l + "\" width=\"32\" height=\"32\" \>";
			var z = getMaxZIndex()+100;
			$('#sugbutton').css('z-index',z);
			showBlocks();
			togglemode = true;
 
            trackEvent(8); // Suggestions Clicked
		} else {
//			$('#gear-status')[0].innerHTML = "\<img src=\"style\/img\/gear-unselected.png\" onclick=\"kToggle.toggle()\" alt=\"" + rscK.l_001_l + "\" width=\"32\" height=\"32\" \>";
			togglemode = false;
			blocksShowing = false;
			$('#showBlocksLayer').remove();
 
            trackEvent(6); // Back to Game Clicked
		}
	}

	function adjustPosition() {
		var offset = $(activeBlock).offset(); 
		if (offset) {
			var x = offset.top;
			x += 23 + $(activeBlock).prop("clientHeight");

			$('.ui-dialog-contain').css('margin-top', x + 'px');		// $('.ui-mobile [data-role="page"], .ui-mobile [data-role="dialog"], .ui-page')
		}
 }
 
 var context;
 var canvasObj;
 var is_touch_device;
 var contentDrawn;
 
 function showCanvas() {
 var z = getMaxZIndexButGear()+1;
 $('#wholemenu').css('display', 'none');
 $('#gamereturn').css('display', 'inline');
 $('#sugbutton').css('z-index',z);
 document.getElementById("sugbutton").textContent = "Back to Game";
 $("#page").append("\<div id=\"canvasLayer\"\>\<\/span\>\<span id=\"canvasSpan\" class=\"blockOverlay\"\>\<\/span\>\<\/div\>");
 $('#canvasSpan').css('z-index',z);
 $('#canvasLayer').append("\<canvas id=\"feedbackCanvas\"\>Your browser doesn't support the HTML5 canvas tag.\<\/canvas\>");
 $("#feedbackCanvas").css({'position': 'fixed', 'z-index': z, 'top': '0px'});
 
 canvasObj = document.getElementById("feedbackCanvas");
 canvasObj.width = window.innerWidth;
 canvasObj.height = window.innerHeight;
 context = canvasObj.getContext("2d");
 context.strokeStyle = "#000000";
 is_touch_device = 'ontouchstart' in document.documentElement;
 if (is_touch_device) {
 canvasObj.addEventListener('touchmove', function(event) {
                            event.preventDefault(); // prevents scrolling on mobile devices
                            });
 canvasObj.addEventListener('touchstart', startDrawing);
 canvasObj.addEventListener('touchend', stopDrawing);
 }
 else {
 $('#canvasLayer').on('mousedown', startDrawing);
 $('#canvasLayer').on('mouseup', stopDrawing);
 
 }
 
 $("<div id='canvastoast' class='ui-loader ui-overlay-shadow ui-body-a ui-corner-all'><h3 style='text-align: center;'>Use your finger to draw your ideas on the screen</h3></div>")
 .css({ "display":"block", "opacity":0.96, "left":"20%", "right":"20%", "z-index":getMaxZIndexButGear()-1 })
 .appendTo($("body"))
 .delay( Number((function(){if (!$.cookie('canvastoast')) {return 3000;} else {return 2000;}})()) )
 .fadeOut(200, function(){
          $(this).remove();
          });
 $.cookie('canvastoast', '1');
 contentDrawn = false;
 }
 
 function startDrawing(event) {
 var canvasPopup = $("#canvastoast");
 if (canvasPopup.length) {
 canvasPopup.remove();
 }
 var coords = getCoordinates(event);
 if (coords[0] > $('#sugbutton').offset().left && coords[1] > $('#sugbutton').offset().top) {
 if (contentDrawn) {
 var tmpCanvas = document.createElement('canvas');
 var res = tmpCanvas.toDataURL();
 if (res.substr(0,6) == "data:,") {
 var script = document.createElement('script');
 script.type = "text/javascript";
 script.src = "vendor/couchapp/jpeg_encoder_basic.js";
 document.getElementsByTagName('head')[0].appendChild(script);
 }
 
 var tmptext = "\<div id=\"drawdialogdiv\"\>\<a id=\"drawdialoga\" href=\"drawdialog_v2.html\" data-rel=\"dialog\" data-prefetch\>\<\/a\>\<\/div\>";
 $(document.body).append(tmptext);
 $("#drawdialogdiv").css('z-index', getMaxZIndexButGear() + 2);
 function topDialog() {
 $("#dialog_b").css('z-index', getMaxZIndexButGear()+1);
 $(document).off('pageshow', topDialog);
 }
 $(document).on('pageshow', topDialog);
 $("#drawdialoga").click();
 }
 else {
 $("#canvasLayer").remove();
 $('#wholemenu').css('display', 'inline');
 $('#gamereturn').css('display', 'none');
 }
 return;
 }
 canvasObj.addEventListener('mousemove', mouseDraw);
 canvasObj.addEventListener('touchmove', mouseDraw);
 context.beginPath();
 context.moveTo(coords[0], coords[1]);
 }
 
 function getCoordinates (event) {
 var xCoord;
 var yCoord;
 if (is_touch_device) {
 xCoord = event.targetTouches[0].pageX;
 yCoord = event.targetTouches[0].pageY;
 }
 else {
 xCoord = event.offsetX;
 yCoord = event.offsetY;
 }
 return [xCoord, yCoord];
 }
 
 function mouseDraw(event) {
 if (!contentDrawn) {
 contentDrawn = true;
 document.getElementById("sugbutton").textContent = "Finished Drawing";
 }
 var coords = getCoordinates(event);
 if (!is_touch_device && (coords[0] < 0.01 * window.innerWidth || coords[0] > 0.99 * window.innerWidth || coords[1] < 0.01 * window.innerHeight || coords[1] > 0.99 * window.innerHeight)) {
     stopDrawing();
 }
 else {
    context.lineTo(coords[0], coords[1]);
    context.stroke();
 }
 }
 
 function stopDrawing(event) {
 canvasObj.removeEventListener('mousemove', mouseDraw);
 canvasObj.removeEventListener('touchmove', mouseDraw);
 }
 
 function capturePage() {
 html2canvas([document.body], {
             onrendered: function(canvas) {
             document.body.appendChild(canvas);
             }
             });
 }

	function showBlocks() {
		if($('#showBlocksLayer').length == 0) {
			$(document.body).append("\<div id=\"showBlocksLayer\"\>\<\/span\>\<span id=\"showBlocksSpan\" class=\"blockOverlay\"\>\<\/span\>\<\/div\>");
			var z = getMaxZIndexButGear()+1;
			$('#showBlocksSpan').css('z-index',z);
		}
		// load up the block info into array, then use those values for highlighting
		// block properties are: top, left, id, width, height
		$('.block66').each(function(i){var offset = $(this).offset(); blocks[i] = {'top':offset.top,'left':offset.left,'id':$(this).prop("id"),'width':$(this).prop("clientWidth"),'height':$(this).prop("clientHeight") };})
		blocksShowing = true;

		// for each block, draw a rectangle and bind onClick to display Node List
		// put a border around these calculated coordinates, inside the actual block
		var z = getMaxZIndexButGear()+1;
		for (var i=0;i<getObjectLength(blocks);i++){
			blocks[i].id;
			var blockName = blocks[i].id + "HighlightBlock";
			var blockSelector = "#" + blockName + "overlay";
			var tmptext = "\<div id=\"" + blockName + "overlay\"\>\<\/div\>";
			$('#showBlocksLayer').append(tmptext);
			$(blockSelector).css({'position': 'absolute', 'z-index': z, 'top': blocks[i].top, 'left': blocks[i].left, 'height': blocks[i].height + 'px', 'width': blocks[i].width + 'px', 'border': '1px dashed #f11'});
 $(blockSelector).one('click', showNodeList);
 //$(blockSelector).live('click', showNodeList);
		}

			// quick tutorial on the page blocks
			// insert a link to dialog
//			if($('#dialog_blockwelcomeLayer').length == 0) {
//				$(document.body).append("\<div id=\"dialog_blockwelcomeLayer\"\>\<a href=\"dialog_blockwelcome.html\" data-rel=\"dialog\" data-prefetch\>\<\/a\>\<\/div\>");
//				}
			// activate that link as a dialog
//			$('#dialog_blockwelcomeLayer').children([href="dialog_blockwelcome.html"]).click();
                
	$("<div class='ui-loader ui-overlay-shadow ui-body-a ui-corner-all'><h3 style='text-align: center;'>Tap any area to make your suggestion</h3></div>")
    	.css({ "display":"block", "opacity":0.96, "left":"20%", "right":"20%", "z-index":getMaxZIndexButGear()+1 })
    	.appendTo($("body"))
    	.delay( Number((function(){if (!$.cookie('blockstoast')) {return 3000;} else {return 2000;}})()) )
    	.fadeOut(200, function(){
       	  $(this).remove();
    	});
	$.cookie('blockstoast', '1');

	var z = getMaxZIndexButGear()+1;
	//$(":jqmData(role=dialog)").css('z-index', z);
 //$("#dialog_welcome").css('z-index', z);
	}

	function showNodeList(e) {
		var posx = 0;
		var posy = 0;
		if (!e) var e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
		}
		// posx and posy contain the mouse position relative to the document
		if (posx > $('#sugbutton').offset().left && posy > $('#sugbutton').offset().top) {		// by xiaozc. clicked in the link button area
	  	kToggle.toggle();
  		//$('#sugbutton').html('Suggestions?');
        $('#wholemenu').css('display', 'inline');
        $('#gamereturn').css('display', 'none');
  		return ;
		}


		if( inShowNodeList) return; else inShowNodeList = true;
		if( togglemode == true ) {
            trackEvent(5); // Red box clicked
			var blockName = $(this).prop('id') + "SelectedBlock";
			activeBlock = "#" + blockName;
			var tmptext = "\<div id=\"" + blockName + "\"\>\<a href=\"feedback_v2.html\" data-rel=\"dialog\" data-prefetch\>\<\/a\>\<\/div\>";
			$(this).append(tmptext);
			var blockSelector = "#" + blockName;
			var z = getMaxZIndexButGear()+1;
			// highlight the selected block
			$(blockSelector).css({'position': 'absolute', 'z-index': z, 'top': 0, 'left': 0, 'height': $(this).prop('style').height, 'width': $(this).prop('style').width, 'border': '3px solid #f11'});

			// get the block identifier, lookup associated data, display data in dialog
			//if($('#nodeDisplayLayer').length == 0) {
			//	$(document.body).append("\<div id=\"nodeDisplayLayer\"\>\<span id=\"nodeDisplay\"\>\<\/span\>\<\/div\>");
			//}
			var highlightBlockName = $(this).prop('id');
			ZrawBlockName = highlightBlockName.replace("HighlightBlock", "");
			Ztmptext = "\<div\>\<ol\>";
                        window['kToggle']['activeBlock'] = ZrawBlockName;
			nodeFound = false;
			// locate nodes that are associated with this block and build drilldown snippet Ztmptext
			$.each(nodes, function(key, val) { showNodeListRecursive(key, val); });
			Ztmptext += "\<\/ol\>";
			if (!nodeFound) {  
				Ztmptext += "" + rscK.l_002_l + "<br /><br />";}
			//Ztmptext += "\<center\>\<button\
			//				onclick=\"kToggle.inputNodeDialog()\"\>\
			//				" + rscK.l_003_l + "\
			//			\<\/button\>\<\/center\>";
			Ztmptext += "\<\/div\>";
			
			// this will need to be redone for mobile
			//var offset = $(activeBlock).offset(); 
			//var x = offset.top;
			//x += 7 + $(activeBlock).prop("clientHeight");
			
			// display the page-level annotation dialog, see logic in pageload handler above
			$(blockSelector).children([href="feedback_v2.html"]).click();
			inShowNodeList = false;
            $(e.srcElement).one('click', showNodeList);
			// need to call hideNodeList() when that dialog is closed!
			return;

		}
	};
	


	function showNodeListRecursive(i, n) { // use of recursion may be expensive, but okay for now
		if (typeof n == 'object') { 
			if(n.nodeattrib1=="Level4"){ 
				if(n.nodeattrib9==ZrawBlockName){ 
					nodeFound = true; // non-empty Node set
					Ztmptext += "\<li\>";
					// do some formatting to tag Nodes as Greystate or Blackstate
					// Quick and dirty UI: pre-pending a label. Future: use groupings, color, icons, tabs, tagged after the name, etc.
					if (n.nodeattrib4 == "greystate") {
						Ztmptext += "<i>" + rscK.l_005_l + ":</i> ";
					} else if (n.nodeattrib4 == "blackstate"){
						Ztmptext += "<i>" + rscK.l_006_l + ":</i> ";
					} else {
						Ztmptext += "<i>" + rscK.l_007_l + ":</i> ";} 
					// Future: redesign UI of the "more" link
					Ztmptext += n.nodeattrib2 + " \<a href=\"#\" onclick=\"kToggle.showNode('" + i + "')\"><i>" + rscK.l_008_l + "</i><\/a\>\<\/li\>";
				}}
			$.each(n, function(key, val) {
				showNodeListRecursive(key, val);});}}
				
	function inputNodeDialog() { 
		if($('#inputNodeDiv').length == 0) {
			$(document.body).append("\<div id=\"inputNodeDiv\"\>\<span id=\"inputNodeSpan\"\>\<\/span\>\<\/div\>");
		}
		var tmptxt = "" + rscK.l_009_l + "";
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
			\<input type=\"submit\" value=\"Submit\" onclick=\"kToggle.submitNode()\" \/\>\
			\<input type=\"submit\" value=\"Cancel\" \/\>\
			\<\/form\>";
		// future: populate the form with relevant data-driven presets and choices
		// future: implement a working submit action
		
		$("#inputNodeSpan").dialog({ 
			'zIndex': 4999, 
			title: "" + rscK.l_010_l + "", 
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
			title: "" + rscK.l_012_l + "", 
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
					Znodedtmptext +=       "\<span class=\"stackedBox\"\>\<span class=\"boldLabel\"\>" + rscK.l_013_l + ": \<\/span\>\<span class=\"stackedBoxContent\"\>" + n.nodeattrib2 + "\<\/span\>\<\/span\>";
					Znodedtmptext += "\<br\>\<span class=\"stackedBox\"\>\<span class=\"boldLabel\"\>" + rscK.l_014_l + ": \<\/span\>\<span class=\"stackedBoxContent\"\>" + n.nodeattrib5 + "\<\/span\>\<\/span\>";
					Znodedtmptext += "\<br\>\<span class=\"stackedBox\"\>\<span class=\"boldLabel\"\>" + rscK.l_015_l + ": \<\/span\>\<span class=\"stackedBoxContent\"\>" + n.nodeattrib4 + "\<\/span\>\<\/span\>";
					// Future: NATtext can be a bit long so, consider formatting and maybe an expansion-interaction
					var NATtext = "\<br\>\<br\>";
					var numNATs = getObjectLength(n.nodeattrib6);
					for (var c = 0; c<numNATs; c++) {
						NATtext += "\<div class=\"commentBox\"\>" + n.nodeattrib6[c].comment + "\<br\>\<div class=\"commentSource\"\>\<i\>" + n.nodeattrib6[c].user + "&nbsp;&nbsp;" + n.nodeattrib6[c].timestamp + "\<\/i\>\<br\>\<\/div\>\<\/div\>";
					}
					Znodedtmptext += "\<br\>\<span class=\"stackedBox\"\>\<span class=\"boldLabel\"\>" + rscK.l_016_l + ":&nbsp;(" + numNATs + ")\<\/span\>\<span class=\"stackedBoxContent\"\>" + NATtext + "\<\/span\>";
					Znodedtmptext += "\<div id=\"nodeDetailNewCommentDiv\"\>\<span id=\"nodeDetailNewComment\"\>";
					// Ignore this: v2012-04-23 has some questions here, may be useful if debugging
					Znodedtmptext += "\<span class=\"newCommentBox\" onclick=\"kToggle.nodeActionNAT()\"\><span class=\"newCommentHint\"\>";
					Znodedtmptext += "&nbsp;" + rscK.l_017_l + "\<\/span\>\<\/span\>\<br\>\<\/span\>\<\/span\>\<\/div\>\<\/span\>\<\/span\>";
					Znodedtmptext += "\<span class=\"stackedBox\"\>\<span class=\"boldLabel\"\>" + rscK.l_018_l + ": \<\/span\>\<span class=\"stackedBoxContent\"\>" + n.nodeattrib3 + "\<\/span\>\<\/span\>";
					Znodedtmptext += "\<span class=\"stackedBox\"\>\
										\<span class=\"actionBarButtonsBlock\"\>\
											\<button\
												onclick=\"kToggle.nodeActionA()\"\>\
													" + rscK.l_021_l + "\
											\<\/button\>\
											\<button\
												onclick=\"kToggle.nodeActionB()\"\>\
													" + rscK.l_022_l + "\
											\<\/button\>\
											\<button\
												onclick=\"kToggle.nodeActionC()\"\>\
													" + rscK.l_023_l + "\
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
		$('#nodeDetailNewComment')[0].innerHTML += "\<span class=\"addCommentButtons\"\>\<button onclick=\"kToggle.submitNAT()\"\>" + rscK.l_019_l + "\<\/button\>\<button onclick=\"kToggle.drawNATbox()\"\>Cancel\<\/button\>\<\/span\>\<\/span\>\<\/span\>\<\/span\>";
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
		var initialNATBox  = "\<span class=\"newCommentBox\" onclick=\"kToggle.nodeActionNAT()\"\><span class=\"newCommentHint\"\>";
		initialNATBox += "&nbsp;" + rscK.l_020_l + "\<\/span\>\<\/span\>\<br\>\<\/span\>\<\/span\>\<\/div\>\<\/span\>\<\/span\>";
		$('#nodeDetailNewComment')[0].innerHTML = initialNATBox;
	}
	
	function hideNodeList() {
		inShowNodeList = false;
		$(activeBlock).remove();
		activeBlock = "";
	};	

	function getData() {
		// this is intended to wrap an API (web service)
		// Future: seems like an initial API call will be needed to get either a chunk or all data for the app
//		$.getJSON("datafile.js",function(jsonZ){
//			nodes = deepCopy(jsonZ.nodes);
//		});
		$db = $.couch.db("quote");
    $db.view("pheet/comment",
      { success: function( data ) {
          var jsonZ = data.rows[0].value;
          nodes = deepCopy(jsonZ.nodes);
        }
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
	
	// another Net bit
	function getMaxZIndex() {
		var zIndexMax = 0;
		$("div,span").each(function () {
			var z = parseInt($(this).css('z-index'));
			if (z > zIndexMax) zIndexMax = z;
		});
		return zIndexMax;
	}
	
	function getMaxZIndexButGear() {
		var zIndexMax = 0;
		$("div").each(function () {
			if( $(this).attr('id') != 'sugbutton' ) {		// sugbutton
				var z = parseInt($(this).css('z-index'));
				if (z > zIndexMax) zIndexMax = z;
			}
		});
		return zIndexMax;
	}
        
	if(!window.kToggle){window['kToggle']={};}
	window['kToggle']['toggle'] = toggle;
	window['kToggle']['inputNodeDialog'] = inputNodeDialog;
	window['kToggle']['showNode'] = showNode;
	window['kToggle']['submitNode'] = submitNode;
	window['kToggle']['nodeActionNAT'] = nodeActionNAT;
	window['kToggle']['nodeActionA'] = nodeActionA;
	window['kToggle']['nodeActionB'] = nodeActionB;
	window['kToggle']['nodeActionC'] = nodeActionC;
	window['kToggle']['submitNAT'] = submitNAT;
	window['kToggle']['drawNATbox'] = drawNATbox;
	window['kToggle']['nodeActionNAT'] = nodeActionNAT;
	window['kToggle']['getMaxZIndex'] = getMaxZIndex; // helpful in debugging
	window['kToggle']['getMaxZIndexButGear'] = getMaxZIndexButGear; // helpful in debugging
 window['kToggle']['showCanvas'] = showCanvas;
})();

function gotofeedback() {
  kToggle.toggle();
    $('#wholemenu').css('display', 'none');
    $('#gamereturn').css('display', 'inline');
    $('#sugbutton').html('Back to game');
}

var savingFeedback = false; // used to differentiate between user clicking Submit and user closing the dialog (see pagehide handler)

function savefeedback() {
    savingFeedback = true;
  var restFrag = '_update/createNewSuggestion';
  var doc = new Object();
  doc.page = "quiz";
  doc.block = window['kToggle']['activeBlock'];
  doc.version = 'v02';
  doc.suggestion = $("#textarea").val();
  doc.trackingID = getUniqueVisitID();
  if ($.cookie('test user')) {
    doc.testdata = true;
  }
  var postData = JSON.stringify(doc);
  $.post(restFrag, postData, 
      function(data) {
        console.log(data);
      });
}

function drawfeedback() {
    kToggle.showCanvas();
}

function returnToGame() {
    $("#drawdialogdiv").remove();
    $("#canvasLayer").remove();
    $('#wholemenu').css('display', 'inline');
    $('#gamereturn').css('display', 'none');
}

function saveDrawing() {
    $('#canvasLayer').off('mousedown');
    $('#canvasLayer').off('touchstart');
    $("<div id='sendstatus' class='ui-loader ui-overlay-shadow ui-body-a ui-corner-all'><h3 style='text-align: center;'>Sending...</h3></div>")
    .css({ "display":"block", "opacity":0.96, "left":"20%", "right":"20%","z-index":$("#canvasLayer").css('z-index') + 1})
    .appendTo($("body"));
    var feedbackText = $("#textarea").val();
    $(document).on('pagehide', sendCanvas);
    function sendCanvas() {
        $(document).off('pagehide', sendCanvas);
        $("#drawdialogdiv").remove();
        html2canvas([document.getElementById("page")], {
                    onrendered: function(canvas) {
                    var dataType; // "png" or "jpeg"
                    // this code is from http://jimdoescode.blogspot.nl/2011/11/trials-and-tribulations-with-html5.html
                    var tdu = HTMLCanvasElement.prototype.toDataURL;
                    HTMLCanvasElement.prototype.toDataURL = function(type)
                    {
                    var res = tdu.apply(this,arguments);
                    dataType = "png";
                    if(res.substr(0,6) == "data:,")
                    {
                    var encoder = new JPEGEncoder();
                    dataType = "jpeg";
                    return encoder.encode(this.getContext("2d").getImageData(0,0,this.width,this.height), 90);
                    }
                    else return res;
                    }
                    
                    var doc = new Object();
                    doc.page = "quiz";
                    doc.version = "v02";
                    doc.description = feedbackText;
                    doc.trackingID = getUniqueVisitID();
                    
                    doc.imageData = canvas.toDataURL();
                    doc.imageType = dataType;
                    if ($.cookie('test user')) {
                    doc.testdata = true;
                    }
                    var postData = JSON.stringify(doc);
                    var restFrag = '_update/createDrawSuggestion';
                    $.post(restFrag, postData,
                           function(data) {
                           console.log(data);
                           });
                    $("#sendstatus").children().text('Thank you for your feedback!')
                    .delay(1000)
                    .fadeOut(200, function(){
                             $(this).remove();
                             $("#canvasLayer").remove();
                             $('#wholemenu').css('display', 'inline');
                             $('#gamereturn').css('display', 'none');
                             });
                    }
                    });
    }
}