
module.exports = function(app){
       //route for homepage
    app.route('/').get((req,res)=>{
        res.render(process.cwd() + '/views/index',{name:'enas'});
    })

          //route for login page
          app.route('/login').get((req,res)=>{
            res.render(process.cwd() + '/views/login',{name:'enas'});
        })
}