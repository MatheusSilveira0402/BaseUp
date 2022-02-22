const bcrypt = require('bcrypt-nodejs')


module.exports = app => {

    const  { existsOrError, notExistsOrError, equalsOrError } = app.api.validation
    
    // esse trecho e para função para empripitar a senha.
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    // esse é função para salver no banco de dados um novo usuário. 
    const save = async ( req, res) => {
        
        const user = { ...req.body }

        // esse try é para validar se todos os campos foram todos preenchidos corretamente.
        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.users, 'Nome de usuario não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha inválida') 
            existsOrError(user.studantorteacher, 'Marque se você é aluno ou professor')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDB = await app.db('users').where({ email: user.email }).first()
            if(!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch(msg){
                return res.status(400).send(msg)
        }

        // emcripitação da senha e deletando o a corfimação depois da validação acima.
        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        // caso todas as validações acima estajam corretas salvar no banco de dados.
        app.db('users')
        .insert(user)
        .then( () => {res.status(204).send("tudo certo!!")})
        .catch( err  => {res.status(500).send(err), console.log(err, 'erro na função de inserir um usuario no banco de dados'.red)})
    }

    return { save }
}