/**
 * Schema Utility functions
 */

import { handleError } from './custom_errors';
import Artwork from '../models/artwork';
// import Artist from '../models/artist';
import Gallery from '../models/gallery';
import Image from '../models/image';
import ProgressList from '../models/progressList';
import ProgressImage from '../models/progressImage';

/**
 * get artwork for artist
 *  @param {ObjectId} artistId
 *  @returns {Array<Artwork>} all the artwork for the artist
 */
export const getArtistArtworks = async (artistId) => {
  try {
    return await Artwork.find({ artist: artistId });
  } catch (err) {
    handleError(err);
  }
};

// DEAL WITH ARTWORK TAGS & FILTERS

/**
 * Add artwork to gallery
 * @param {ObjectId} artworkId 
 * @param {ObjectId} galleryId 
 * @returns {boolean}
 */
export const addArtworkToGallery = async (artworkId, galleryId) => {
  try {
    const artwork = await Artwork.findById(artworkId);
    if (!artwork.galleries.includes(galleryId)) {
      artwork.galleries.push(galleryId);
      await artwork.save();
    }
    return true;
  } catch (err) {
    handleError(err);
  }
  return false;
};

/**
 * remove Artwork From Gallery
 * @param {ObjectId} artworkId 
 * @param {ObjectId} galleryId 
 * @returns {boolean}
 */
export const removeArtworkFromGallery = async (artworkId, galleryId) => {
  try {
    const artwork = await Artwork.findById(artworkId);
    if (artwork.galleries.includes(galleryId)) {
      artwork.galleries = artwork.galleries.filter(gallery => gallery._id !== galleryId);
      await artwork.save();
    }
    return true;
  } catch (err) {
    handleError(err);
  }
  return false;
};

/**
 * assign artwork filter (new or replacement)
 * @param {ObjectId} artworkId 
 * @param {String} filterKey 
 * @param {ObjectId} galleryId 
 * @returns {boolean} true if successful
 */
export const setArtworkFilter = async (artworkId, filterKey, galleryId) => {
  try {
    const artwork = await Artwork.findById(artworkId);
    artwork.filters[filterKey] = galleryId;
    await artwork.save();
    return true;
  } catch (err) {
    handleError(err);
  }
  return false;
};

/**
 * remove filter from artwork (no replacement filter)
 * @param {ObjectId} artworkId 
 * @param {String} filterKey 
 * @returns {boolean}
 */
export const removeArtworkFilter = async (artworkId, filterKey) => {
  try {
    const artwork = await Artwork.findById(artworkId);
    const { filters } = artwork;
    delete filters[filterKey];
    await artwork.save();
    return true;
  } catch (err) {
    handleError(err);
  }
  return false;
};

// GALLERY METHODS
/**
 * convert thumbnail string to coverImage id
 * @param {ObjectId} galleryId 
 */
export const galleryThumbnailToCoverImg = async (galleryId) => {
  try {
    const gallery = await Gallery.findById(galleryId);
    const { thumbnail } = gallery;
    const img = await Image.findByCloudId(thumbnail);
    gallery.coverImage = img._id;
    await gallery.save();
    return true;
  } catch (err) {
    handleError(err);
  }
  return false;
};

// PROGRESS

/**
 * add an image to progressList
 * @param {ObjectId} progressId 
 * @param {ObjectId} imageId 
 * @param {Number} sequence
 * @param {Date} taken
 * @param {Boolean} isFinal
 */
export const addProgressImage = async (progressId, imageId, sequence, taken, isFinal = false) => {
  try {
    const progressList = await ProgressList.findById(progressId);
    const progImg = await ProgressImage.create({
      image: imageId,
      dateTaken: taken,
      sequenceOrder: sequence,
      isFinal
    });
    progressList.progressImages.push(progImg._id);
    await progressList.save();
    return true;
  } catch (err) {
    handleError(err);
  }
  return false;
};
