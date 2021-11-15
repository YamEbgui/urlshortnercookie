function errorHandler(error, req, res, next) {
  switch (error.status) {
    case 404:
      res.status(404);
      res.redirect("https://myriad.video/404");
      break;

    case 403:
      res.status(403);
      res.send(error);
      break;

    case 500:
      res.status(500);
      res.send(error);
      break;

    case 400:
      res.status(400);
      res.send(error);
      break;
  }
}

module.exports = errorHandler;
