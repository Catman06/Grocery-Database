use barcode_reader::{fill_hints, image_prep, scan};
use rxing:: { DecodeHintType, DecodeHintValue, DecodingHintDictionary, Exceptions, MultiFormatReader };
use wasm_bindgen::prelude::*;

pub mod barcode_reader;

// Javascript functions being made available
#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Take in an image and return the format (if any) of the barcode
#[wasm_bindgen]
pub fn check_barcode(width: u32 , height: u32, image_vec:Vec<u8>) -> Result<JsValue, JsError> {

    // Get a BinaryBitmap from passed data
    let mut binary_bitmap = image_prep(width, height, image_vec);
    
    // To allow for references to 'self', reader_self is created from MultiFormatReader's defaults
    let mut reader_self = MultiFormatReader::default();

    // Create a 'DecodingHintDictionary' that provides 'hints', then populate it
    let mut hints = DecodingHintDictionary::new();
    hints.insert(DecodeHintType::POSSIBLE_FORMATS, DecodeHintValue::PossibleFormats(fill_hints()));
    // TryHarder can be set to true in exchange for a performance hit. Not sure how necessary it may be.
    hints.insert(DecodeHintType::TRY_HARDER, DecodeHintValue::TryHarder(false));

    // Setup 'reader_self' with hints to allow 'decode_with_state' to be used
    reader_self.set_hints(&hints);

    // Scans the image. If a result is returned, return that; If it returns a NotFoundException Error,
    // that simply means no barcode was found and so "Nothing Found" will be returned as a success.
    // If any other error is returned the name of the exception is returned as an error.
    match scan(&mut reader_self, &mut binary_bitmap) {
        // If a result is returned, Send that back to WASM immediately, do not pass GO, do not collect $200
        Ok(value) => {
            let combined_result = format!("{0},{1}", value.getText(), value.getBarcodeFormat().to_string());

            return Ok( JsValue::from_str(&combined_result));
        },
        // If the error is that nothing was found allow the loop to go again
        Err(Exceptions::NotFoundException(_)) => return Ok( JsValue::from_str(&"Nothing Found")),
        // If there was a different error (i.e. an actual one, not just not finding anything) pass that error up to WASM
        Err(other_error) => return Err( JsError::new(&other_error.to_string()) )
    };
}
