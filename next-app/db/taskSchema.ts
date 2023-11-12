import mongoose from 'mongoose'

export interface Tasks extends mongoose.Document {
    taskID: string,
    user: {},
    name: string,
    description: string,
    startedAt: Date,
    deadline: Date,
    status: string,
    members: string[],
    project: {}
};

/* ProjectSchema will correspond to a collection in your MongoDB database. */
const TaskSchema = new mongoose.Schema<Tasks>({
    taskID: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: {type: String, required: true},
    description: {type: String, required: true},
    startedAt: {type: Date, required: true},
    deadline: {type: Date, required: true},
    status: {type: String, required: true},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'}
});

export default mongoose.models.Task || mongoose.model<Tasks>('Task', TaskSchema);