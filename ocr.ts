import axios from 'axios';

export interface ImageRequestBody {
  imageBase64: string;
}

interface Item {
  id: string;
  name: string;
  is_food: boolean;
  score?: number;
}

//export async function processImage(imageBase64: string): Promise<string[]> {
export async function processImage(imageBase64: string): Promise<any> {
  if (!imageBase64) {
    throw new Error('No image data provided.');
  }

  try {
//    const payload = {
//      model: "gpt-4-turbo",
//      messages: [
//        {
//          role: "user",
//          content: [
//            {
//              type: "text",
//              //text: "Analyze the provided receipt image to extract the items purchased. Use GPT-4's vision, not Python. Focus solely on the listed items. Omit any background details or extraneous text from the receipt. For each line item on the receipt, retrieve the name of the product. Present the results as an array. Exclude any other receipt information such as headers, footers, tax, price, and total amount. Do not output anything that is not the array."
//              text: "Analyze the provided receipt to extract the items purchased, do NOT output code. Output a JSON array with the following format: {\"items\": [{\"id\": <item read from receipt>, \"name\": <your best guess as to teh common name of the product>, \"is_food\": <bool, whether or not the product is a food product or not>}, ...]}. If you can't parse any of the lines on the receipt, don't add anything. do NOT output anything other than the JSON ARRAY. Exclude any other receipt info (headers, footers, cost, etc). USE DOUBLE QUOTES NOT SINGLE QUOTES to deliminate strings.the ID should be the item name listed on the receipt, NOT the item ID integer. \n\nExample output: {\"items\": [{\"id\": \"CHKCN-NGT\", \"name\": \"Chicken Nuggets\", \"is_food\": true}]}"
//            },
//            {
//              type: "image_url",
//              image_url: {
//                url: `data:image/jpeg;base64,${imageBase64}`
//              }
//            }
//          ]
//        }
//      ],
//      max_tokens: 300
//    };
    const payload = {
	    "model": "gpt-4-turbo",
	    "messages": [
		{
		    "role": "user",
		    "content": [
			{
			    "type": "text",
			    "text": "Analyze the provided receipt to extract the items purchased, do NOT output code. Output a JSON array with the following format: {\"items\": [{\"id\": <item read from receipt>, \"name\": <your best guess as to the common name of the product>, \"is_food\": <bool, whether or not the product is a food product or not>}, ...]}. If you can't parse any of the lines on the receipt, don't add anything. do NOT output anything other than the JSON ARRAY. Exclude any other receipt info (headers, footers, cost, etc). USE DOUBLE QUOTES NOT SINGLE QUOTES to delimitate strings. The ID should be the item name listed on the receipt, NOT the item ID integer. \n\nExample output: {\"items\": [{\"id\": \"CHKCN-NGT\", \"name\": \"Chicken Nuggets\", \"is_food\": true}]}"
			},
			{
			    "type": "image_url",
			    "image_url": {
				"url": `data:image/jpeg;base64,${imageBase64}`
			    }
			}
		    ]
		}
	    ],
	    "max_tokens": 300
	};

    const visionResponse = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json'
      }
    });

    let content = visionResponse.data.choices[0].message.content;
    console.log(content);
    let parsed = JSON.parse(content);
    return parsed.items;
  } catch (error) {
    console.error('Failed to process image:', error);
    throw new Error('Error processing the image with GPT-4 Vision API');
  }
}

