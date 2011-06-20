<div class="footer footer-com">
   <span class="copyright">
      <img src="${url.context}/res/components/images/alfresco-share-logo.png" alt="Alfresco Community" height="26" width="176" />
      <span>${msg("label.copyright")}</span>
   </span>
</div>
<#assign siteId = page.url.templateArgs.site!"">
<#if config.script.tracking??>
<#if config.script.tracking.trackingId != "">
<script type="text/javascript">//<![CDATA[
   new Extras.GoogleAnalyticsTracking("${args.htmlid}").setOptions(
   {
      "siteId": "${page.url.templateArgs.site!''}",
      "trackingEnabled": ${trackingEnabled?string},
      "trackingId": "${config.script.tracking.trackingId}",
      "defaultEventCategory": "${config.script.tracking.defaultEventCategory}",
      "trackableEventCategory": "${config.script.tracking.trackableEventCategory}",
      "customVars": [<#if customVars??><#list customVars as cv>
         {
            "name": "${cv.name}",
            "value": "${cv.value}",
            "scope": "${cv.scope}"
         }<#if cv_has_next>,</#if>
      </#list></#if>],
      "documentTrackingEvents": [<#if customDocEvents??><#list customDocEvents as ce>
         {
            "className": "${ce.className}",
            "layerName": "${ce.layerName!ce.className}"
         }<#if ce_has_next>,</#if>
      </#list></#if>]
   }).setMessages(
      ${messages}
   );
//]]></script>
<#else>
<div class="ga-tracker-warning">${msg("warning.noTrackingId")}</div>
</#if>
</#if>