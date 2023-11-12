import mongoose from 'mongoose'

export interface Projects extends mongoose.Document {
    projectID: string,
    user: {},
    name: string,
    description: string,
    creator: {},
    tasks: string[],
    startedAt: Date,
    deadline: Date,
    members: string[],
    leader: {}
};

/* ProjectSchema will correspond to a collection in your MongoDB database. */
const ProjectSchema = new mongoose.Schema<Projects>({
    projectID: {type: String, required: true},

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

export default mongoose.models.Project || mongoose.model<Projects>('Project', ProjectSchema);