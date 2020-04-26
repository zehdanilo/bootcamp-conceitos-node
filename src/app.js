const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = 0;

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  
  const repository = {id: uuid(), title, url, likes, techs};

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const {id} = request.params;
    const { title , url, techs } = request.body;

    const repositoryIndex = repositories.findIndex(repository => repository.id == id );

    if (repositoryIndex < 0){
        return response.status(400).json({error: 'repository not found'});
    }

    const likes = repositories[repositoryIndex].likes;
    
    const repository = {
        id,
        title,
        url,
        likes,
        techs
    };
    
    repositories[repositoryIndex] = repository;

    return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id == id );

    if (repositoryIndex < 0){
        return response.status(400).json({error: 'repository not found'});
    }

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id );

  if (repositoryIndex < 0){
      return response.status(400).json({error: 'repository not found'});
  }

  const repository = repositories[repositoryIndex];
  
  if (repository.hasOwnProperty('likes') ){
    repository.likes += 1;
  } else {
    repository.likes = 1;
  }
  
  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

module.exports = app;
