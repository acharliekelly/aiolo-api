# Aiolo API

## Overview

This project was forked from [Nile](https://github.com/wdi-3-0/nile), a class project
from General Assembly coding bootcamp in 2019.

This is the back-end for an app that displays artwork. There is a separate API,
[Koios](https://github.com/acharliekelly/koios) that handles eCommerce for the
same artwork. Both APIs are headless.

The frontend is a React app, and can be seen [here](https://cantimaginewhy.com).

## Status

At present, this is a work-in-progress. But hopefully it will be operational,
um, any minute now.

## Technical Details

### Technologies

1. Express.js
2. Node.js
3. MongoDB
4. Cloudinary

### Routes

#### RESTful Routes

* Artist - _'/artist'_
* Artwork - _'/artwork'_
* Image - _'/images'_
* Host - _'/host'_
* Progress - _'/progress'_
* Gallery - _'/galleries'_

#### Non RESTful Routes

* Gallery
  * GET _'/albums'_ - Show only album galleries
  * GET _'/filters'_ - Show only non-album galleries
  * GET _'/gallery/:tag'_ - get list of images from Cloudinary
* User
