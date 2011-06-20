var scriptConfig = new XML(config.script);

/**
 * Whether the current page is trackable
 * 
 * @return  {boolean} True if current page is trackable, false otherwise
 */
function isTrackingEnabled()
{
   var siteId = page.url.templateArgs.site || null;
   return scriptConfig.global == "true" || (siteId != null && scriptConfig.siteIds != null
         && scriptConfig.siteIds.split(",").indexOf(siteId) > -1);
}

/**
 * Prepare the tracking model
 * 
 * @return  null
 */
function prepareTracking()
{
   model.trackingEnabled = isTrackingEnabled();
   model.customVars = [];
   model.customDocEvents = []; // Objects { className: x, layerName: y }
}