var reduxSettingsJSON;
var playerSize = {};
var aspectRatio = (window.screen.width / window.screen.height).toFixed(2);
var defaultSettings = '{"gridItems": 6, "hideAutoplayButton": false, "hideCastButton": false,"darkPlaylist": true,"smallPlayer": false, "smallPlayerWidth": 853, "showRawValues": true, "classicLikesColors": false, "autoConfirm": true, "disableInfiniteScrolling": false, "blackBars": false, "rearrangeInfo": false, "classicLogo": false, "filterMain": false, "filterVideo": false, "filterMini": false, "extraLayout": true}';

getSettings();
addCustomStyles();

function getSettings(){
    if (localStorage.getItem("reduxSettings") === null){
        localStorage.setItem("reduxSettings", defaultSettings);
        reduxSettingsJSON = JSON.parse(defaultSettings);
    } else {
        reduxSettingsJSON = JSON.parse(localStorage.getItem("reduxSettings"));
        var defParsed = JSON.parse(defaultSettings);

        //check which default settings are missing (e.g. due to updates) and add them
        for (var i in defParsed){ //loop through default settings
            var settingFound = false;
            for (var j in reduxSettingsJSON){ //loop through current settings
                if (i == j){
                    settingFound = true;
                    break;
                }
            }
            if (!settingFound){
                console.log('Missing setting ' + i + ' was added.');
                reduxSettingsJSON[i] = defParsed[i];
                localStorage.setItem("reduxSettings", JSON.stringify(reduxSettingsJSON));
            }
        }
        reduxSettingsJSON = JSON.parse(localStorage.getItem("reduxSettings")); //reassign in case missing settings were added
        playerSize.width = reduxSettingsJSON.smallPlayerWidth == undefined ? 853 : reduxSettingsJSON.smallPlayerWidth;
        playerSize.height = Math.ceil(playerSize.width / aspectRatio);
    }
}

function addCustomStyles(){
    var conditionalCast = reduxSettingsJSON.hideCastButton ? `/*PLAY ON TV BUTTON*/[class="ytp-button"]:not([data-tooltip-target-id="ytp-autonav-toggle-button"]) {display:none !important;}` : '';
    var conditionalAutoplay = reduxSettingsJSON.hideAutoplayButton ? `/*AUTOPLAY BUTTON*/[class="ytp-button"][data-tooltip-target-id="ytp-autonav-toggle-button"] {display:none !important;}` : '';
    var conditionalPlayerSize = reduxSettingsJSON.smallPlayer ? `
/*SMALL PLAYER*/
#primary {
max-width: calc((100vh - (var(--ytd-watch-flexy-masthead-height) + var(--ytd-margin-6x) + var(--ytd-watch-flexy-space-below-player))) * (${window.screen.width} / ${window.screen.height})) !important;
min-width: calc(var(--ytd-watch-flexy-min-player-height) * (${window.screen.width} / ${window.screen.height})) !important;
}
#player-container-outer {
max-width: ${playerSize.width}px  !important;
min-width: 0 !important;
position: relative !important;
}
#player-container-inner {
padding-top: calc(${window.screen.height} / ${window.screen.width} * 100%) !important;
}
.html5-video-container {
width:100% !important;
height:100% !important;
}
.html5-video-container video {
width:100% !important;
height:100% !important;
left:0 !important;
top: 0 !important;
}
/*[class="ytp-chrome-bottom"] {
width: calc(100% - 12px) !important;
}*/
` : '';
    var conditionalDarkPlaylist = reduxSettingsJSON.darkPlaylist ? `
/*DARK PLAYLIST*/
#playlist.ytd-watch-flexy {
transform: translate(-25px, -1px) !important;
}
.header.ytd-playlist-panel-renderer {
background-color: #1a1a1a !important;
}
ytd-playlist-panel-renderer[collapsible] .title.ytd-playlist-panel-renderer {
color: #fff !important;
}
.title.ytd-playlist-panel-renderer {
--yt-endpoint-color: white !important;
}
.title.ytd-playlist-panel-renderer a:hover {
--yt-endpoint-color: white !important;
color: white !important;
}
.publisher.ytd-playlist-panel-renderer {
color: #B8B8B8 !important;
}
.playlist-items.ytd-playlist-panel-renderer {
background-color: #222 !important;
}
#video-title.ytd-playlist-panel-video-renderer {
color: #CACACA !important;
}
#byline.ytd-playlist-panel-video-renderer {
color: #767676 !important;
}
ytd-playlist-panel-video-renderer.ytd-playlist-panel-renderer:hover:not(.dragging) {
background-color: #525252 !important;
}
ytd-playlist-panel-video-renderer[selected] {
background-color: #3a3a3a !important;
}
#publisher-container > yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:visited {
color: #CACACA !important;
}
` : '';
    var conditionalLogo = reduxSettingsJSON.classicLogo ? `
    ytd-masthead #logo-icon-container, #contentContainer #logo-icon-container {
        content: url('${chrome.extension.getURL('/images/classicLogo.png')}') !important;
        width: 72px !important;
        height: auto !important;
    }
    ytd-masthead[dark] #logo-icon-container, html[dark] #contentContainer #logo-icon-container {
        content: url('${chrome.extension.getURL('/images/classicLogoDark.png')}') !important;
        width: 72px !important;
        height: auto !important;
    }
    #start > #masthead-logo, #masthead > #masthead-logo {
        content: url('${chrome.extension.getURL('/images/classicLogo.png')}') !important;
        width: 72px !important;
        height: auto !important;
    }
    html[dark] #start > #masthead-logo, html[dark] #masthead > #masthead-logo {
        content: url('${chrome.extension.getURL('/images/classicLogoDark.png')}') !important;
        width: 72px !important;
        height: auto !important;
    }
    ` : '';
    var conditionalLikesColors = reduxSettingsJSON.classicLikesColors ? `
    /*LIKES*/
    #container > #like-bar.ytd-sentiment-bar-renderer {
        background: rgb(0 136 29) !important;
    }
    #container.ytd-sentiment-bar-renderer {
        background-color: rgb(222 0 17) !important;
    }
    ` : '';
    var conditionalFilterMain = reduxSettingsJSON.filterMain ? `
    [page-subtype="home"] > #primary > ytd-rich-grid-renderer > #header > ytd-feed-filter-chip-bar-renderer {
        display: none !important;
    }
    ` : '';
    var conditionalFilterVideo = reduxSettingsJSON.filterVideo ? `
    #items > yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer {
        display: none !important;
    }
    #items.ytd-watch-next-secondary-results-renderer ytd-compact-autoplay-renderer:first-child > #contents ytd-compact-video-renderer {
        padding-bottom: 0 !important;
    }
    ` : '';
    var conditionalFilterMini = reduxSettingsJSON.filterMini ? `
    [page-subtype="home"] > #primary > ytd-rich-grid-renderer > #header > ytd-feed-filter-chip-bar-renderer > #chips-wrapper #scroll-container #chips yt-chip-cloud-chip-renderer:not(:first-child):not(:last-child) {
        display: none !important;
    }
    [page-subtype="home"] > #primary > ytd-rich-grid-renderer > #header > ytd-feed-filter-chip-bar-renderer > #chips-wrapper #scroll-container #chips yt-chip-cloud-chip-renderer {
        height: 20px !important;
    }
    yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer {
        margin-top: 5px !important;
        margin-bottom: 5px !important;
    }
    ytd-feed-filter-chip-bar-renderer {
        height: 30px !important;
    }
    [page-subtype="home"] > #primary > ytd-rich-grid-renderer > #header > ytd-feed-filter-chip-bar-renderer > #chips-wrapper > #right-arrow {
        display: none !important;
    }
    ` : '';
    var conditionalExtraLayout = reduxSettingsJSON.extraLayout ? `
    /*EXTRA LAYOUT 1 - VIDEO*/
    ytd-app {
        background-color: #f1f1f1 !important;
    }
    html[dark] ytd-app {
        background-color: var(--yt-spec-general-background-a) !important;
    }
    ytd-video-primary-info-renderer, ytd-video-secondary-info-renderer {
        background-color: white !important;
        padding-left: 15px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,.1) !important;
        border-bottom: 0 !important;
        margin-bottom: 10px !important;
    }
    html[dark] ytd-video-primary-info-renderer, html[dark] ytd-video-secondary-info-renderer {
        background-color: #222222 !important;
        padding-left: 15px !important;
        box-shadow: 0 1px 2px rgba(255,255,255,.1) !important;
        border-bottom: 0 !important;
        margin-bottom: 10px !important;
    }
    ytd-comments#comments {
        background-color: white !important;
        padding-left: 15px !important;
        padding-top: 1px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,.1) !important;
    }
    html[dark] ytd-comments#comments {
        background-color: #222222 !important;
        padding-left: 15px !important;
        padding-top: 1px !important;
        box-shadow: 0 1px 2px rgba(255,255,255,.1) !important;
    }
    #meta-contents > ytd-video-secondary-info-renderer > #container > ytd-expander > #content {
        padding-top: 10px !important;
    }
    #secondary-inner.ytd-watch-flexy #related {
        background-color: white !important;
        box-shadow: 0 1px 2px rgba(0,0,0,.1) !important;
    }
    html[dark] #secondary-inner.ytd-watch-flexy #related {
        background-color: #222222 !important;
        box-shadow: 0 1px 2px rgba(255,255,255,.1) !important;
    }
    #always-shown ytd-rich-metadata-renderer {
        background: none !important;
    }
    /*EXTRA LAYOUT 2 - HOME*/
    #page-manager ytd-browse[page-subtype="home"]  {
        margin-left: 8vw !important;
        margin-right: 8vw !important;
    }
    #header.ytd-rich-grid-renderer {
        display: none !important;
    }
    ytd-rich-shelf-renderer {
        border-top: 1px solid var(--yt-spec-10-percent-layer) !important;
    }
    #video-title.ytd-rich-grid-media, 
    #video-title.yt-simple-endpoint.ytd-grid-video-renderer {
        font-size: min(13px, calc((90 / var(--ytd-rich-grid-items-per-row)) * 1px)) !important;
        line-height: 1.3em !important;
    }
    #contents.ytd-rich-grid-renderer #text.ytd-channel-name, 
    [page-subtype="subscriptions"] #text.ytd-channel-name, 
    [page-subtype="subscriptions"] #metadata-line.ytd-grid-video-renderer, 
    [page-subtype="channels"] #text.complex-string.ytd-channel-name, 
    [page-subtype="channels"] #metadata-line.ytd-grid-video-renderer {
        font-size: min(11px, calc((90 / var(--ytd-rich-grid-items-per-row)) * 1px)) !important;
        line-height: 1.3em !important;
    }
    ytd-two-column-browse-results-renderer ytd-thumbnail.ytd-grid-video-renderer, 
    ytd-two-column-browse-results-renderer ytd-grid-video-renderer {
        width: 10.83vw !important;
    }
    #contents.ytd-section-list-renderer {
        padding-left: 10px !important;
    }
    #contents.ytd-rich-grid-renderer, #contents.ytd-section-list-renderer {
        padding-top: 10px !important;
        background: #fff !important;
        box-shadow: 0 1px 2px rgba(0,0,0,.1) !important;
    }
    html[dark] #contents.ytd-rich-grid-renderer, html[dark] #contents.ytd-section-list-renderer {
        padding-top: 10px !important;
        background: #222222 !important;
        box-shadow: 0 1px 2px rgba(255,255,255,.1) !important;
    }
    ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block {
        line-height: 1.3em !important;
    }
    ytd-rich-shelf-renderer[is-show-more-hidden] #dismissable.ytd-rich-shelf-renderer {
        border-bottom: 1px solid var(--yt-spec-10-percent-layer) !important;
    }
    #avatar-link.ytd-rich-grid-media {
        display:none !important;
    }
    h3.ytd-rich-grid-media, h3.ytd-grid-video-renderer {
        margin: 4px 0 1px 0 !important;
    }
    ytd-guide-entry-renderer[active] {
        background-color: #f00 !important;
    }
    ytd-guide-entry-renderer[active] .guide-icon.ytd-guide-entry-renderer {
        color: white !important;
    }
    ytd-guide-entry-renderer[active] .title.ytd-guide-entry-renderer {
        color: white !important;
    }
    ytd-rich-section-renderer {
        display:none !important;
    }
    /*SKELETON*/
    #home-page-skeleton .rich-shelf-videos {
        margin-left: 8vw !important;
        margin-right: 8vw !important;
        transform: translate(20px, 10px);
    }
    #home-page-skeleton .rich-shelf-videos .rich-grid-media-skeleton.mini-mode {
        flex-basis: 205px !important;
        min-width: 205px !important;
        max-width: 205px !important;
    }
    ` : '';
    function mergeOptions(){
        var allStyleOptions = [
            conditionalAutoplay, 
            conditionalCast,
            conditionalPlayerSize,
            conditionalDarkPlaylist,
            conditionalLogo,
            conditionalLikesColors,
            conditionalFilterMain,
            conditionalFilterVideo,
            conditionalFilterMini,
            conditionalExtraLayout
        ];
        var mergedOptions = '';
        allStyleOptions.forEach(element => {
            mergedOptions += element;
        });
        return mergedOptions;
    }
    var customStyle = document.createElement("style");
    customStyle.id = 'redux-style';
    var customStyleInner = mergeOptions();
    customStyle.appendChild(document.createTextNode(customStyleInner));
    document.documentElement.append(customStyle);
}