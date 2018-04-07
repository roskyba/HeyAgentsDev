### Hey Agents Home Site
This is a static site using [Jekyll](https://jekyllrb.com/) through the [Siteleaf CMS](https://www.siteleaf.com/) and hosted with AWS S3 and distributed with AWS Cloudfront. 

Siteleaf has [excellent documentation](https://learn.siteleaf.com/) if you need any help getting started.

#### Frameworks and Libraries
The site uses Bootstrap 4, Typeahead and Bloodhound, Google Places API, jQuery Validate, and of course, the [Hey Agents API](https://github.com/heyagents/heyagents-api).

#### Developing locally:
Please reference Siteleaf's guide to developing locally [here](https://learn.siteleaf.com/themes/github-sync/).

#### Deploying changes:
As noted in the local development guide, you can push your changes to the master branch and Siteleaf will update automatically. This will update the Siteleaf Preview, but the live site will not yet reflect your pushed changes.

To publish your changes to AWS, you will need to login to Siteleaf and hit "Publish". Once publishing is complete, you may not see your changes immediately. Cloudfront caches quite extensively, so you can either (a) wait for it to clear – not advised if changes are urgent, (b) [invalidate the cache](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html) or (c) [implement versioned names](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ReplacingObjects.html).
