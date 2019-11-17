'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ImageTransformer class
 *
 * @class ImageTransformer
 * @constructor
 */
class ImageTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (image) {
    //Usar o toJSON para a computed fiedl url existir
    image = image.toJSON();
    return {
      url: image.id,
      id: image.url,
      size: image.size,
      original_name: image.original_name,
      extension: image.extension
     // add your transformation object here
    }
  }
}

module.exports = ImageTransformer
