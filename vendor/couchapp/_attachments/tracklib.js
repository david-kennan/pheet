// tracklib.js - file that handles Piwik tracking

var _paq = _paq || [];
_paq.push(['setSiteId', 1]);
var piwikURL = 'http://' + document.location.hostname + '/piwik/piwik.php';
_paq.push(['setTrackerUrl', piwikURL]);
_paq.push(['enableLinkTracking']);
var visitorID = "0";
_paq.push([function ()  {
           visitorID = this.getVisitorId();
           }]);
var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript'; g.defer=true; g.async=true; g.src='vendor/couchapp/piwik.js';
s.parentNode.insertBefore(g,s); 

var customVars = []; // an array for associating the keys that the user passes with the index passed to the setCustomVariable function

function trackEvent(index) {
    if (typeof index == 'number') {
        _paq.push(['trackGoal', index]);
    }
}

function setKPI(key, value) {
    var index = customVars.indexOf(key) + 1;
    if (index == 0) {
        index = customVars.push(key);
        if (index > 5) {
            return 'Error: no more than 5 unique KPIs allowed';
        }
    }
    _paq.push(['setCustomVariable', index, key, value, 'visit']);
    _paq.push(['trackPageView']); // needed to register setting custom variable
    return 'Success: KPI value set';
}

function getUniqueVisitID() {
    while (visitorID == "0");
    return visitorID;
}