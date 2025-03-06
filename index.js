import express from 'express';
import { resolve } from 'path';
import { createClient } from 'redis'; //Reference: https://www.youtube.com/watch?v=oaJq1mQ3dFI

const app = express();
const port = 3010;

app.use(express.static('static'));


const client = await createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/users/:id', getPost);

async function getPost(req, res) {
  try {
    const id = req.params.id
    const posts = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    const data = await posts.json()

    const title = data.title

    // Set title to Redis
    client.set(id,title)
    res.send(data)
  } catch (error) {
    console.log(error);
  }
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
