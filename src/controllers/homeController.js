class homeController {
  index(req, res, next) {
    res.send('đây là trang home');
  }
}

module.exports = new homeController();
