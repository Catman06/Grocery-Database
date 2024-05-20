import init, { check_barcode } from '@/rust/pkg/Rust_Functions.js'


console.log('Bartender: Created');

// Runs when an image is POSTed to the worker
onmessage = (image) => {
	console.log('Bartender: Image Received');

	let codeText = 'Nothing Returned';
	init().then(() => {
		return codeText = check_barcode(image.data.width, image.data.height, image.data.data);
	})
		.then(() => {
			// Split the returned string into the resultant text and the barcode format
			let len = codeText.length;
			let splitIndex;

			for (let i = len; i >= 0; i--) {
				if (codeText.charAt(i) == ",") {
					splitIndex = i;
					break;
				}
			}

			var resultText = codeText.substring(0, splitIndex);
			var resultFormat = codeText.substring(splitIndex + 1, len);

			postMessage([resultText, resultFormat]);
		})
		.catch((error) => {
			// If the image is null, it's almost certainly the setup run and doesn't warrant an error message
			if (image.data === null) {
				return;
			} else {
				console.error(`Failure Checking Barcode: ${error}`);
			}
		});
}