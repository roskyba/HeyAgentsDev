<head>
  <title>{{page['meta title'] | default: page.title}}</title>
  <meta name="description" content="{{page['meta description'] | default: site['meta description']}}">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <!--og-->
  <meta property="og:locale" content="en_US" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{{page['OG Title'] | default: site['OG Title']}}" />
  <meta property="og:description" content="{{page['OG Description'] | default: site['OG Description']}}" />
  <meta property="og:url" content="{{site.url}}{{page.permalink}}" />
  <meta property="og:image" content="{{site.url}}{{page['OG Image'] | default: site['OG Image']}}" />
  <meta property="og:site_name" content="{{site.title}}" />
  <meta name="google-signin-client_id" content="725505414896-8813g1u420a401g6bue2pebnvlsh61nc.apps.googleusercontent.com">
  <!--end og-->
  <!--favicons-->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/manifest.json">
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#179990">
  <meta name="theme-color" content="#179990">
  <!--end favicons-->
  <script>
    (function(d) {
      var config = {
        kitId: 'iln8jts',
        scriptTimeout: 3000,
        async: true
      },
      h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
    })(document);
  </script>
  {{site['header scripts']}}
  <link rel="stylesheet" href="/assets/styles/hey.css">
</head>
