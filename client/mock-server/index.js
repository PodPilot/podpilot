import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

app.get('/', async (req, res) => {
  // fake delay
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  console.log(JSON.stringify(req.query, null, 2));

  res.send({
    answer:
      'Based on the podcast transcript, Dr. David Sinclair made several key points about longevity:\n\n1. Fasting and not eating all the time can activate longevity genes called sirtuins and extend lifespan. Always being fed means these protective genes are not switched on.\n\n2. Aging is mainly driven by a loss of epigenetic information over time, which he likens to scratches accumulating on a CD. The epigenome controls which genes are turned on in different cells.\n\n3. Slower development and lower growth hormone levels in youth are predictive of a longer, healthier lifespan. Dwarf mutations in animals and humans seem protective against diseases of aging. \n\n4. 80% of future longevity and health is controlled by the epigenome rather than genetics. Lifestyle factors can modify the epigenome.\n\n5. DNA damage, particularly chromosome breaks, accelerates the unwinding of youthful DNA structures and drives aging. Massive cellular stress and damage also speeds aging.\n\nIn summary, Sinclair argues aging is driven by epigenetic changes and loss of cellular information, which can be influenced by lifestyle factors like fasting to activate longevity pathways and slow the aging process.',
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
