var scriptConfig = new XML(config.script);

/**
 * Get default tracking ID specified in the config
 * 
 * @return  {string} Tracking ID to use
 */
function getDefaultTrackingId()
{
   return scriptConfig.global == "true" ? scriptConfig.trackingId.toString() : null;
}
/**
 * Trackable site tracking ID
 * 
 * @return  {string} Tracking ID to use
 */
function getTrackingID()
{
   var siteId = page.url.templateArgs.site || null;
   if (siteId != null)
   {
      var siteUrl = "/api/sites/" + siteId,
         siteResp = remote.call(siteUrl);
      
      if (siteResp.status == 200)
      {
         var siteData = jsonUtils.toObject(siteResp.response),
            siteNodeRef = siteData.node.substring(siteData.node.indexOf("workspace/SpacesStore")).replace("workspace\/", "workspace:\/\/");
         
         var metaUrl = "/api/metadata?nodeRef=" + siteNodeRef,
            metaResp = remote.call(metaUrl);
         
         if (metaResp.status == 200)
         {
            var metaData = jsonUtils.toObject(metaResp),
               trackingId = metaData.properties["{http://www.alfresco.org/model/partnertracking/1.0}trackingUID"],
               trackingEnabled = metaData.properties["{http://www.alfresco.org/model/partnertracking/1.0}trackingEnabled"];
            
            if (trackingId != null && trackingEnabled !== null && trackingEnabled === true)
            {
               return trackingId;
            }
         }
         else
         {
            throw "An error occurred accessing the site node metadata";
         }
      }
      else
      {
         throw "An error occurred accessing the site data";
      }
   }
   return getDefaultTrackingId();
}
/**
 * Prepare the tracking model
 * 
 * @return  null
 */
function prepareTracking()
{
   var trackingId = getTrackingID();
   model.trackingEnabled = trackingId != null;
   model.trackingId = trackingId;
   model.customVars = [];
   model.customDocEvents = []; // Objects { className: x, layerName: y }
}