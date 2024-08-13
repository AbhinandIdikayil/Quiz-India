module.exports = {
  //render home page
  homePage: async (req, res) => {
    try {
      res.status(200).render("index");
    } catch (err) {
      console.error("Home page err:", err);
      res.status(500).json({ menubar: "internal error" });
    }
  },

  //render register page
  userRegister: async (req, res) => {
    try {
      res.status(200).render("registerPge");
    } catch (error) {
      console.log("register error:", error);
    }
  },

  userLogin: async(req, res) =>{
    try {
      res.status(200).render("loginPage");
    } catch (error) {
      console.log("register error:", error);
    }
  }
};
