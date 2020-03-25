const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray.js');

//É um named function. Store por ser responsavel por salvar no banco

//Controllers possuem normalmente
/*index - Listar recurso
show - Mostrar unico "busca" 
store - Salvar um recurso 
update - Alterar um recurso 
destroy - Deletar um recuro */

module.exports = {

    async store(request, response) {
        const { github_username, techs, latitude, longitude} = request.body;
    
        console.log(request.body);
        let dev = await Dev.findOne({ github_username });

        console.log(dev);
        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            console.log(apiResponse.data);
            const { name = login, bio = 'Dev', avatar_url } = apiResponse.data;
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        
            //trim para remover espaçamentos caso exista
            const techsArray = parseStringAsArray(techs);
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });
        }
        return response.json(dev);
    },

    async index(req, resp) {

        const devs = await Dev.find();

        return resp.json(devs);
    },

    async update(req, resp) {


        console.log(req.params)
        const { github_username, bio, techs, name } = req.query
        const techsArray = parseStringAsArray(techs);
        console.log(techsArray);

        const devs = await Dev.findOneAndUpdate({github_username},
            {
                bio,
                name,
                techsArray

            });

        if(!devs){

            return resp.status(400).send('Missing parameter or username not exist');
        }

        return resp.json({devs});
    },

    async destroy(req, resp) {
        console.log(req.query);
    }
}