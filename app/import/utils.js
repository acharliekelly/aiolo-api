
/**
 * takes size as '12" x 9"', returns obj
 * @param {String} sizeStr 
 */
export const getDimensions = sizeStr => {
  const sizeParams = sizeStr.split('x');
  const w = parseInt(sizeParams[0].trim());
  const h = parseInt(sizeParams[1].trim());
  return {
    width: w,
    height: h,
    units: 'inches'
  };
};

export const getLocation = resCustom => {
  const geo = resCustom.geotag.split(',');
  return {
    place: resCustom.location,
    lat: geo[0],
    lng: geo[1]
  }
};

/**
 * return array: ['acrylic','canvas'] or ['acrylic']
 * @param {Object} resCustom 
 */
export const getMedium = resCustom => {
  if (resCustom.medium) {
    if (resCustom.medium.includes(' on ')) {
      return resCustom.medium.split(' on ');
    } else {
      return [resCustom.medium, 'paper'];
    }
  } else {
    return ['', 'paper'];
  }
}

export const getOnsiteRef = onsiteId => {
  // onsiteId: photos/onsite-artwork_id-1
  return onsiteId.split('/')[1].split('-')[1];
};

// number or 'final'
export const getOnsiteSequence = onsiteId => {
  return onsiteId.split('/')[1].split('-')[2];
};
