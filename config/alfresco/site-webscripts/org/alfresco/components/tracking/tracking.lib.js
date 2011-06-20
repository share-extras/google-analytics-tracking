var scriptConfig = new XML(config.script);
var TRACKED_SITE = scriptConfig.trackedSite; 

/**
 * Whether the given site is trackable
 * 
 * @param siteId  {string} Site ID
 * @return  {boolean} True if trackable, false otherwise
 */
function isTrackedSite(siteId)
{
   return scriptConfig.global == "true" || (siteId != null && siteId == TRACKED_SITE);
   
}

/**
 * Prepare the tracking model
 * 
 * @return  null
 */
function prepareTracking()
{
   model.trackingEnabled = isTrackedSite(page.url.templateArgs.site || null);
   model.customVars = [];
}