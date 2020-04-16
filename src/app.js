const express = require("express");
const cors = require("cors");

const { uuid, isuuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

/**
 * Middlewares
 */
function validateRepoId(request, response, next){
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0){
    return response.status(400).json({error: 'Repository not found.'});
  }

  return next();
}
app.use('/repositories/:id',validateRepoId);

/**
 * Data Array
 */
const repositories = [];


/**
 * Routes
 */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  const repo = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  };

  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repositories.splice(repoIndex,1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  const repo = repositories[repoIndex];

  repo.likes++;

  return response.json(repo);
});

module.exports = app;
