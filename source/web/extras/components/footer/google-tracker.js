/**
 * Copyright (C) 2010-2011 Share Extras contributors.
 *
 */

/**
* Extras root namespace.
* 
* @namespace Extras
*/
// Ensure Extras root object exists
if (typeof Extras == "undefined" || !Extras)
{
   var Extras = {};
}

/**
 * Google Analytics queue
 */
var _gaq = _gaq || [];

/**
 * Google Analytics Tracking component.
 * 
 * @namespace Extras
 * @class Extras.GoogleAnalyticsTracking
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;
   
   /**
    * ConsoleCreateUsers constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Extras.ConsoleCreateUsers} The new ConsoleCreateUsers instance
    * @constructor
    */
   Extras.GoogleAnalyticsTracking = function(htmlId)
   {
      /* Decoupled event listeners */
      YAHOO.Bubbling.on("trackableContentEvent", this.onTrackableContentEvent, this);
      YAHOO.Bubbling.on("onActionView", this.onActionView, this);
      YAHOO.Bubbling.on("onActionDownload", this.onActionDownload, this);
      
      return Extras.GoogleAnalyticsTracking.superclass.constructor.call(this, "Extras.GoogleAnalyticsTracking", htmlId);
   };
   
   YAHOO.extend(Extras.GoogleAnalyticsTracking, Alfresco.component.Base,
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /**
          * ID of the current site
          * 
          * @property siteId
          * @type string
          * @default ""
          */
         siteId: "",
         
         /**
          * Whether tracking is enabled
          * 
          * @property trackingEnabled
          * @type boolean
          * @default true
          */
         trackingEnabled: true,

         /**
          * Google Analytics tracking ID
          * 
          * @property trackingId
          * @type string
          * @default ""
          */
         trackingId: "",

         /**
          * Default event tracking category name
          * 
          * @property defaultEventCategory
          * @type string
          * @default "Document"
          */
         defaultEventCategory: "Document",

         /**
          * Event tracking category for trackable documents
          * 
          * @property trackableEventCategory
          * @type string
          * @default "Trackable Document"
          */
         trackableEventCategory: "Trackable Document",

         /**
          * Custom variables to set - specify as an array of object literals
          * 
          * [
          * {
          *    name: "Items Removed",
          *    value: "Yes",
          *    scope: 2
          * },
          * ...
          * ]
          * 
          * @property customVars
          * @type array
          * @default []
          */
         customVars: [],
         
         /**
          * Events to be tracked via Bubbling for different document actions - specify as an array of object literals.
          * 
          * [
          * {
          *    className: "onActionDownload",
          *    layerName: "onActionDownload"
          * },
          * ...
          * ]
          * 
          * @property documentTrackingEvents
          */
         documentTrackingEvents: []
      },

      /**
       * Fired by YUI when parent element is available for scripting
       * 
       * @method onReady
       */
      onReady: function GAT_onReady()
      {
         if (this.options.trackingEnabled === true && this.options.trackingId != "")
         {
            var customVar, ddRe = /\/document-details?nodeRef=([\w+]:\/[\w+]\/[\-\w+])/,
               ddMatch = ddRe.exec(window.location.href);
            
            _gaq.push(['_setAccount', this.options.trackingId]);
            // See http://code.google.com/apis/analytics/docs/tracking/gaTrackingCustomVariables.html
            for (var i = 0; i < this.options.customVars.length; i++)
            {
               customVar = this.options.customVars[i];
               _gaq.push(['_setCustomVar', i, customVar.name, customVar.value, customVar.scope || 3]);
            }
            // Is this a document details page?
            if (ddMatch != null)
            {
               this._trackContentEvent("ViewDetails", ddMatch[1]); // Pass nodeRef to custom tracking method
            }
            else
            {
               _gaq.push(['_trackPageview']); // Perform tracking immediately
            }
            
            // Check if this is a document details or document list page
            if (window.location.href.indexOf("/document-details") > 0 ||
                  window.location.href.indexOf("/documentlibrary") > 0)
            {
               for (var i = 0; i < this.options.documentTrackingEvents.length; i++)
               {
                  var els = Dom.getElementsByClassName(this.options.documentTrackingEvents[i].className, "div");
                  for (var j = 0; j < els.length; j++)
                  {
                     // Look for anchor elements within the div
                     var aEls = els[j].getElementsByTagName("a");
                     if (aEls.length == 1)
                     {
                        /*
                        Event.addListener(aEls[0], "click", function(e) {
                           YAHOO.Bubbling.fire(this.options.documentTrackingEvents[i].layerName, {});
                        }, this, true);
                        */
                        Dom.setAttribute(aEls[0], "onclick", 
                              "YAHOO.Bubbling.fire(\"" + this.options.documentTrackingEvents[i].layerName + "\", {e_obj: this}); " +
                              "return true;");
                     }
                  }
               }
            }
            
            // Import the GA tracking code to perform the tracking automatically
            // See http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == window.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

         }
      },

      /**
       * Track a specific content event
       * 
       * @method trackDocumentEvent
       * @param eventName {string} Name of the event to track
       * @param nodeRef {string} NodeRef of the content item to link the event to
       * @private
       */
      _trackContentEvent: function GAT__trackContentEvent(eventName, nodeRef)
      {
         var mcns = "{http://www.alfresco.org/model/content/1.0}", 
            ptns = "{http://www.alfresco.org/model/partnertracking/1.0}";
         
         var onMetadataLoaded = function onMetadataLoaded(response)
         {
             var trackedNode = response.json || {},
                nodeDetailsPage = location.protocol + "//" + location.host + Alfresco.constants.URL_PAGECONTEXT + "site/" + this.options.siteId + "/document-details?nodeRef=" + nodeRef,
                trackingName = trackedNode.properties[mcns + "name"] + " (" + nodeDetailsPage + ")",
                /* Check if the node is trackable */
                trackingCategory = trackedNode.properties[ptns + "trackingEnabled"] ? this.options.trackableEventCategory : this.options.defaultEventCategory;
             
             /* Finally tracks the event */
             _gaq.push(['_trackEvent', trackingCategory, eventName , trackingName]);    
         };

         if (this.options.trackingEnabled)
         {
            Alfresco.util.Ajax.jsonRequest(
            {
               url: Alfresco.constants.PROXY_URI + "api/metadata?nodeRef=" + nodeRef,
               method: "GET",
               successCallback:
               {
                  fn: onMetadataLoaded,
                  scope: this
               }            
            });
         }
      },
      
      /**
       * Decoupled event listener for content events, called via YAHOO.Bubbling
       * 
       * @method onTrackableContentEvent
       */
      onTrackableContentEvent: function GAT_onTrackableContentEvent(layer, args)
      {
         this.trackContentEvent(args[1].eventName, args[1].nodeRef);
      },
      
      /**
       * Decoupled event listener for view content event, called via YAHOO.Bubbling
       * 
       * @method onActionView
       */
      onActionView: function GAT_onActionView(layer, args)
      {
         // TODO get noderef from the anchor href
         var nodeRef = "";
         this._trackContentEvent("View", nodeRef);
      },
      
      /**
       * Decoupled event listener for download content event, called via YAHOO.Bubbling
       * 
       * @method onActionDownload
       */
      onActionDownload: function GAT_onActionDownload(layer, args)
      {
         // TODO get noderef from the anchor href
         var href = args[1].e_obj.href;
         if (href != null)
         {
            var index = href.indexOf("workspace/SpacesStore");
            if (index > 0)
            {
               nodeRef = href.substring(index, href.lastIndexOf("/")).replace("workspace/SpacesStore", "workspace://SpacesStore");
               this._trackContentEvent("Download", nodeRef);
            }
         }
      }
   });
})();