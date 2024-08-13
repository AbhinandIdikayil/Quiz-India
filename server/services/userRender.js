
module.exports = {
    //render home page
    homePage: async (req, res) => {
      try {
        res.status(200).render("index");

      } catch (err) {
        console.error("Home page err:", err);
        res.status(500).json({menubar: "internal error"})
      }
    }
}