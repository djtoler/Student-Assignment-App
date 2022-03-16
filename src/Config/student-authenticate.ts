module.exports = {
    ensureAuthenticated: function(req:any, res:any, next:any) {
      if (req.isAuthenticated()) {
          console.log("is authenticated");
          
        return next();
      }
      console.log(req.body.name);
      console.log(req.body.password);
      console.log(req.body.email);
      console.log("is not authenticated");
      res.redirect('/student-login');
    },
    forwardAuthenticated: function(req:any, res:any, next:any) {
      if (!req.isAuthenticated()) {
        console.log("isAuth=False");
        return next();
      }
      res.redirect('/welcome');      
    }
  };
