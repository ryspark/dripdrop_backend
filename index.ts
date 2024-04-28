import express, { Application, Request, Response } from 'express';
import { processImage, ImageRequestBody } from './ocr';
import { runCrawlers } from './crawler';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '100mb' }));

app.post('/api/v1/peepoo', async (req: Request, res: Response) => {
  const { imageBase64 } = req.body as ImageRequestBody;
  console.log("Loaded image from base 64.");

  if (!imageBase64) {
    return res.status(400).send('No image data provided.');
  }

  try {
    const queries = await processImage(imageBase64);
    console.log("Parsed queries:", queries);
    console.log("Type of queries:", typeof queries);

    await runCrawlers(queries);

    console.log("Post-crawling items:", queries);
    res.status(200).send(queries);

  } catch (error) {
    console.error('Failed to process image or run crawlers:', error);
    res.status(500).send('Error processing the image or running crawlers');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

