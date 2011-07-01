<#-- Include HTML from the default footer web script -->
<#include "/org/alfresco/components/footer/footer.get.html.ftl">

<#-- Custom Analytics markup -->
<#if config.script.tracking??>
<#if trackingId?has_content>
<script type="text/javascript">//<![CDATA[
   new Extras.GoogleAnalyticsTracking("${args.htmlid}").setOptions(
   {
      "siteId": "${page.url.templateArgs.site!''}",
      "trackingEnabled": ${trackingEnabled?string},
      "trackingId": "${trackingId}",
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
</#if>
<#if config.script.tracking.trackingId == "" && config.script.tracking.global == "true">
<div class="ga-tracker-warning">${msg("warning.noTrackingId")}</div>
</#if>
</#if>