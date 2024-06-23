const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const Model = mongoose.model;
const TeamSchema = new Schema({
    team_name : String,
    total_games: Number,
    score: Number,
    profile : String
});
const Team = new Model('team', TeamSchema, 'assignment-2-data')

module.exports = Team