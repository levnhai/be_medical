class homeController {
  index(req, res, next) {
    res.send('đây là rtrang home');
  }
}

module.exports = new homeController();
