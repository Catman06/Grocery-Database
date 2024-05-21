use image::{DynamicImage, RgbaImage};
use rxing::{common::HybridBinarizer, *};
use std::collections::HashSet;
use wasm_bindgen::{JsError, JsValue};

pub fn check_barcode(width: u32, height: u32, image_vec: Vec<u8>) -> Result<JsValue, JsError> {
    // Get a BinaryBitmap from passed data
    let mut binary_bitmap = image_prep(width, height, image_vec);

    // To allow for references to 'self', reader_self is created from MultiFormatReader's defaults
    let mut reader_self = MultiFormatReader::default();

    // Create a 'DecodingHintDictionary' that provides 'hints', then populate it
    let mut hints = DecodingHintDictionary::new();
    hints.insert(
        DecodeHintType::POSSIBLE_FORMATS,
        DecodeHintValue::PossibleFormats(fill_hints()),
    );
    // TryHarder can be set to true in exchange for a performance hit. Not sure how necessary it may be.
    hints.insert(
        DecodeHintType::TRY_HARDER,
        DecodeHintValue::TryHarder(false),
    );

    // Setup 'reader_self' with hints to allow 'decode_with_state' to be used
    reader_self.set_hints(&hints);

    // Scans the image. If a result is returned, return that; If it returns a NotFoundException Error,
    // that simply means no barcode was found and so "Nothing Found" will be returned as a success.
    // If any other error is returned the name of the exception is returned as an error.
    match scan(&mut reader_self, &mut binary_bitmap) {
        // If a result is returned, Send that back to WASM immediately, do not pass GO, do not collect $200
        Ok(value) => {
            let combined_result = format!(
                "{0},{1}",
                value.getText(),
                value.getBarcodeFormat().to_string()
            );

            return Ok(JsValue::from_str(&combined_result));
        }
        // If the error is that nothing was found allow the loop to go again
        Err(Exceptions::NotFoundException(_)) => return Ok(JsValue::from_str(&"Nothing Found")),
        // If there was a different error (i.e. an actual one, not just not finding anything) pass that error up to WASM
        Err(other_error) => return Err(JsError::new(&other_error.to_string())),
    };
}

// Function to populate a list of types of codes to check
pub fn fill_hints() -> HashSet<BarcodeFormat> {
    let mut formats: HashSet<BarcodeFormat> = HashSet::new();
    // Add formats to "formats", All variants are available, but only used ones are uncommented
    // formats.insert(BarcodeFormat::AZTEC);
    // formats.insert(BarcodeFormat::CODABAR);
    // formats.insert(BarcodeFormat::CODE_39);
    // formats.insert(BarcodeFormat::CODE_93);
    formats.insert(BarcodeFormat::CODE_128);
    formats.insert(BarcodeFormat::DATA_MATRIX);
    formats.insert(BarcodeFormat::EAN_8);
    formats.insert(BarcodeFormat::EAN_13);
    // formats.insert(BarcodeFormat::ITF);
    // formats.insert(BarcodeFormat::MAXICODE);
    // formats.insert(BarcodeFormat::PDF_417);
    formats.insert(BarcodeFormat::QR_CODE);
    // formats.insert(BarcodeFormat::MICRO_QR_CODE);
    // formats.insert(BarcodeFormat::RSS_14);
    // formats.insert(BarcodeFormat::RSS_EXPANDED);
    formats.insert(BarcodeFormat::UPC_A);
    formats.insert(BarcodeFormat::UPC_E);
    formats.insert(BarcodeFormat::UPC_EAN_EXTENSION);

    return formats;
}

/**
 * Takes width, height, and vector information and turns it into a more useful BinaryBitmap (Also increases contrast)
 */
pub fn image_prep(
    width: u32,
    height: u32,
    vector: Vec<u8>,
) -> BinaryBitmap<HybridBinarizer<BufferedImageLuminanceSource>> {
    // Take the input 8bit vector and turns it back into an RGBA bitmap in the DynamicImage wrapper
    let image_bitmap = DynamicImage::from(RgbaImage::from_vec(width, height, vector).unwrap());
    // Increase the image's contrast
    //let image_bitmap = image_bitmap.adjust_contrast(75.0);
    // Turn the DynamicImage and turn it into a BufferedImageLuminanceSource
    let image_bitmap = BufferedImageLuminanceSource::new(image_bitmap);

    // Makes new BinaryBitmap using the Hybrid Binarizer
    let binarizer = HybridBinarizer::new(image_bitmap);
    return BinaryBitmap::new(binarizer);
}

/**
 * Runs a single scan of the passed image using the passed MultiFormatReader
 */
pub fn scan(
    mut reader: &mut MultiFormatReader,
    mut bitmap: &mut BinaryBitmap<HybridBinarizer<BufferedImageLuminanceSource>>,
) -> Result<RXingResult, Exceptions> {
    let _decoded = match MultiFormatReader::decode_with_state(&mut reader, &mut bitmap) {
        Ok(result) => {
            //DEBUG Log result
            //let logresult = format!("Rust Result: {}", result.getText());
            //log(&logresult);
            return Ok(result);
        }
        Err(error) => return Err(error),
    };
}
