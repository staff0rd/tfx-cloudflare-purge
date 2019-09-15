# Purge Cache for Cloudflare

Azure DevOps build/release task for purging from your Cloudflare cache.  

To configure you'll need:

* Your cloudflare user name (this is an email address)
* Cloudflare Global API Key
  * Cloudflare > My Profile > Global API Key > View
* Zone you want to purge (one of your domains)
  * Cloudflare > Home
* A list of urls to purge:
  * One per line, in the format http://some/path.html
  * Or empty, to purge everything

## Contribute

This extension is open source.  Please contribute at <https://github.com/staff0rd/tfx-cloudflare-purge>.
