module.exports = app => {
    
    // rota para cadastro de usuários 
    app.post('/signup', app.api.user.save)
    

}