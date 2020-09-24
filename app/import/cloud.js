/*
 * import data from Cloudinary
 */

import axios from 'axios';

import Artwork from '../models/artwork';
import Gallery from '../models/gallery';
import Artist from '../models/artist';
import Image from '../models/image';
import ImageHost from '../models/imageHost';
import { getDimensions, getLocation, getMedium } from './utils';

const CLOUD = 'cantimaginewhy';

// Returns normalized list of JSON objects ready for Mongoose
export const fetchGallery = async tagName => {
  const url = `https://res.cloudinary.com/${CLOUD}/image/list/${tagName}.json`;
  try {
    const res = await axios(url);
    return res.data.resources;
  } catch (err) {
    return console.error(err);
  }
}

const customValues = {
  caption: '',
  alt: '',
  completed: '2000-01-01',
  medium: '',
  size: '1" x 1"',
  geotag: '0,0',
  location: '',
  key: '',
  original: '',
  price: 0,
  ref: ''
};

export const getDefaultArtist = async () => {
  try {
    return await Artist.findOne({ name: 'Charlie Kelly' });
  } catch (err) {
    return console.error(err);
  }
}

export const getDefaultHost = async () => {
  try {
    return await ImageHost.findOne({ hostId: 'cloudinary' });
  } catch (err) {
    return console.error(err);
  }
}

/**
 * get Mongoose Gallery object
 * @param {String} tagName 
 * @returns {Gallery} Mongoose gallery model
 */
export const getGallery = async tagName => {
  try {
    return await Gallery.findOne({ tag: tagName })
  } catch (err) {
    return console.error(err);
  }
}

/**
 * add tag to Artwork tags
 * @param {Artwork} artwork 
 * @param {String} tagName 
 */
export const addGalleryToArtwork = (artwork, tagName) => {
  if (!artwork.tags.includes(tagName)) {
    artwork.tags.push(tagName);
    const gallery = getGallery(tagName);
    const galleryFilter = gallery.filter;
    artwork.filters[galleryFilter] = gallery._id;
    artwork.save();
  }
}

/**
 * create Artwork from fetched JSON
 * if fetched from gallery, add Tag
 * if exists, update with Tag
 * @param {JSON} resource image data from cloudinary
 * @param {String} galleryTag tagName
 */
export const cloudinaryToArtwork = async (resource, galleryTag = '') => {
  const publicId = resource.public_id;
  try {
    let artwork = Artwork.findOne({ publicId });
    // check if artwork exists
    if (!artwork) {
      // if artwork does not exist, create it
      const image = cloudinaryToImage(resource);
      let context;
      if (resource.context) {
        context = resource.context.custom;
      } else {
        context = customValues;
      }

      artwork = Artwork.create({
        image: image._id,
        publicId,
        artist: getDefaultArtist()._id
      });
      artwork.title = context.caption;
      artwork.description = context.alt;
      const mat = getMedium(context.medium);
      artwork.medium = mat[0];
      artwork.surface = mat[1];
      artwork.completed = context.completed;
      artwork.dimensions = getDimensions(context.size);
      artwork.location = getLocation(context);
    }
    // add tag/filter
    if (galleryTag) {
      addGalleryToArtwork(artwork, galleryTag);
    }
    return artwork;
  } catch (err) {
    return console.error(err);
  }
};

/**
 * get/create Image from cloudinary image data
 * @param {JSON} resource cloudinary image data
 * @returns {Image} Mongoose Image model
 */
export const cloudinaryToImage = resource => {
  const cldHost = getDefaultHost();
  const publicId = resource.public_id;
  let image = Image.findOne({ publicId });
  if (!image) {
    image = Image.create({
      publicId: resource.public_id,
      host: cldHost,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      created_at: resource.created_at
    });
  }

  return image;
};
