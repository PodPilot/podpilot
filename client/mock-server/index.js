import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

app.post('/', async (req, res) => {
  // fake delay
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  console.log(JSON.stringify(req.body, null, 2));

  res.send({
    response: `this is the response to the query {${req.body.query}}. These responses can be long, 
      and might be separated into separate lines of thought. Perhaps we can consider requesting a 
      newline character or something similar in order to puncuate pauses.`,
    suggestions: [
      'Donald Glover',
      'Data Engineering',
      'Intermittent Fasting',
    ],
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
