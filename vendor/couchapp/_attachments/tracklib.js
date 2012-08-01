// tracklib.js - file that handles Piwik tracking

var _paq = _paq || [];
var u=(("https:" == document.location.protocol) ? "https://localhost/piwik/" : "http://localhost/piwik/");
_paq.push(['setSiteId', 1]);
_paq.push(['setTrackerUrl', u+'piwik.php']);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript'; g.defer=true; g.async=true; g.src=u+'piwik.js';
s.parentNode.insertBefore(g,s); 

var customVars = [];

function trackEvent(index) {
    if (typeof index == 'number') {
        _paq.push(['trackGoal', index]);
    }
}

function setKPI(key, value) {
    var index = customVars.indexOf(key);
    if (index == -1) {
        index = customVars.push(key);
        if (index > 5) {
            return 'Error: no more than 5 unique KPIs allowed';
        }
    }
    _paq.push(['setCustomVariable', index, key, value, 'visit']);
    _paq.push(['trackPageView']);
    return 'Success: KPI value set';
}