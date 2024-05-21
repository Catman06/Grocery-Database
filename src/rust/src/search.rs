use regex::Regex;
use serde::{Deserialize, Serialize};
use std::error::Error;

// Struct for items from the database
#[derive(Serialize, Deserialize)]
pub struct Item {
    pub barcode: String,
    pub given_name: String,
    pub off_name: String,
    pub number: i32,
    pub allergens: Vec<String>,
    pub tags: Vec<String>,
    pub favorite: bool,
}

// Takes the raw search query and returns a RegEx for finding matches
// If the query is surrounded by '/' pass the query as is to allow the use of RexEx searches
pub fn raw_to_regex(query: &String) -> Result<Regex, Box<dyn Error>> {
    let mut pattern: String = query.to_owned();
    // Check if surrounded by '/', if so pass the raw into a Regex and return it
    if query.starts_with('/') && query.ends_with('/') {
        pattern = format!(r"{}", query);
    } else {
        // Escape any special characters
        pattern = pattern.replace('*', r"\*");
        pattern = pattern.replace('.', r"\.");
        pattern = pattern.replace(r"\", r"\\");
        pattern = pattern.replace('(', r"\(");
        pattern = pattern.replace(')', r"\)");
        pattern = pattern.replace('[', r"\[");
        pattern = pattern.replace(']', r"\]");

        pattern = format!(r"{}", pattern);
    }

    let re = Regex::new(&pattern.as_str());
    match re {
        Ok(re) => return Ok(re),
        Err(e) => return Err(Box::new(e)),
    }
}
