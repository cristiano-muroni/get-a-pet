const Pet = require("../models/Pet");
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class PetController {
    // create a pet
    static async create(req, res) {
        const { name, age, weight, color } = req.body;
        const images = req.files;
        const available = true;

        //images upload

        // validations
        if (!name) {
            res.status(422).json({message: "O nome é obrigatório"});
            return;
        };

        if (!age) {
            res.status(422).json({message: "A idade é obrigatória"});
            return;
        };

        if (!weight) {
            res.status(422).json({message: "O peso é obrigatório"});
            return;
        };

        if (!color) {
            res.status(422).json({message: "A cor é obrigatória"});
            return;
        };

        if (images.length === 0) {
            res.status(422).json({message: "A imagem é obrigatória"});
            return;
        };
        // get a pet owner
        const token = getToken(req);
        const user = await getUserByToken(token);

        // create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            },
        });

        images.map((image) => {
            pet.images.push(image.filename);
        });

        try {
            const newPet = await pet.save();
            console.log(newPet)
            res.status(201).json({ message: 'Pet cadastrado com sucesso',
        newPet,
    });
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "error"});
        }
    };

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt');

        return res.status(200).json({pets: pets});
    };  
    
    static async getAllUserPets(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token);
        const pets = await Pet.find({ 'user_id': user.id }).sort('-createdAt');
        
        return res.status(200).json({pets});
    };
   
    static async getAllUserAdoptions(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token);
        const pets = await Pet.find({ 'adopter_id': user.id }).sort('-createdAt');
    };

    static async getPetById(req, res) {
        const id = req.params.id;

        if(!ObjectId.isValid(id)){
           return res.status(422).json({message: 'Id inválido!'});            
        };

        const pet = await Pet.findOne({_id: id});

        if(!pet) {
            return res.status(404).json({message: 'Pet não encontrado!'});
        };

       return res.status(200).json({pet: pet});
    };

    static async removePetById(req, res) {
        const id = req.params.id;

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: 'Id inválido!'});
            return;
        };

        const pet = await Pet.findOne({_id: id});

        if(!pet) {
            return res.status(404).json({message: 'Pet não encontrado!'});
        };

        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()) {            
            return res.status(404).json({message: "Houve um problema em sua solicitação!"});
        };

        await Pet.findByIdAndRemove(id);
        return res.status(200).json({message: 'Pet removido com sucesso!'});
    };

    static async updatePet(req, res) {
        const { id } = req.params;
        const { name, age, weight, color, available } = req.body;
        const images = req.files;
        const updatedData = {};

        const pet = await Pet.findOne({_id: id});

        if(!pet) {
            return res.status(404).json({message: 'Pet não encontrado!'});
        };

        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()) {            
            return res.status(404).json({message: "Houve um problema em sua solicitação!"});
        };
         
        // validations
        if (!name) {
            res.status(422).json({message: "O nome é obrigatório"});
            return;
        } else {
            updatedData.name = name;
        }

        if (!age) {
            res.status(422).json({message: "A idade é obrigatória"});
            return;
        } else {
            updatedData.age = age;
        }

        if (!weight) {
            res.status(422).json({message: "O peso é obrigatório"});
            return;
        } else {
            updatedData.weight = weight;
        }

        if (!color) {
            res.status(422).json({message: "A cor é obrigatória"});
            return;
        } else {
            updatedData.color = color;
        }

        if (images.length === 0) {
            res.status(422).json({message: "A imagem é obrigatória"});
            return;
        } else {
            updatedData.images = [];
            images.map((image) => {
                updatedData.images.push(image.filename);
            });
        };

        await Pet.findByIdAndUpdate(id, updatedData);

        return res.status(200).json({message: "Pet atualizado com sucesso!"});
    };
};