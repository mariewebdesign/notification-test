const express = require("express");
const Expo = require("expo-server-sdk").default;
const cors = require("cors");

const expo = new Expo();
const expressServer = express();

expressServer.use(cors());
expressServer.listen(process.env.PORT || 3000,() => {
    console.log("Serveur en écoute sur " + (process.env.PORT || 3000));
    expressServer.get("/", function(req, res) {
        const token = req.query.token;
        if(!Expo.isExpoPushToken(token)){
            console.log("Token invalide")
            res.send({err : "Token invalide"});
        }else{
            let messages = [
                {
                    to : token,
                    sound : "default",
                    body : "Bienvenue sur l'appli du Quai",
                    date : { test : "marie"}
                }
            ];

            expo.sendPushNotificationsAsync(messages).then(ticket => {
                res.send({ticket : ticket})
            }).catch(err => {
                console.log("Erreur d'envoi")
                res.send({err : "Erreur d'envoi"})
            })
        }
    });
});