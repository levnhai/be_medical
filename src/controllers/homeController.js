class homeController {
  index(req, res, next) {
    res.send('đây là rtrang home rtyty');
  }
}

module.exports = new homeController();
