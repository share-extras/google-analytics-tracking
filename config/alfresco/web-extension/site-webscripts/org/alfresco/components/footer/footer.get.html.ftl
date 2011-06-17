<div class="footer footer-com">
   <span class="copyright">
      <img src="${url.context}/res/components/images/alfresco-share-logo.png" alt="Alfresco Community" height="26" width="176" />
      <span>${msg("label.copyright")}</span>
   </span>
</div>
<#assign siteId = page.url.templateArgs.site!"">
<#if config.script.tracking>
<script type="text/javascript">//<![CDATA[
   new Extras.GoogleAnalyticsTracking("${args.htmlid}").setOptions(
   {
      "siteId": "${siteId}",
      "trackingEnabled": "${trackingEnabled?string}",
      "trackingId": "${config.script.tracking.trackingId}",
      "defaultEventCategory": "${config.script.tracking.defaultEventCategory}",
      "trackableEventCategory": "${config.script.tracking.trackableEventCategory}",
      "customVars": [<#if customVars??><#list customVars as cv>
         {
            "name": "${cv.name}",
            "value": "${cv.value}",
            "scope": "${cv.scope}"
         }<#if cv_has_next>,</#if>
      </#list></#if>]
   }).setMessages(
      ${messages}
   );
//]]></script>
</#if>