import mongoose from 'mongoose';

console.log(process.env.DSN);

mongoose.connect(process.env.DSN);

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    hash: {type: String, required: true},
    team_leader: {type: Boolean, required: true},

    projects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

const ProjectSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: {type: String, required: true},
    description: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    startedAt: {type: Date, required: true},
    deadline: {type: Date, required: true},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    leader: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const TaskSchema = new mongoose.Schema({
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    description: {type: String, required: true},
    startedAt: {type: Date, required: true},
    deadline: {type: Date, required: true},
    progress: {type: Number, required: true},
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'}
});

mongoose.model('User', UserSchema);
mongoose.model('Project', ProjectSchema);
mongoose.model('Task', TaskSchema);