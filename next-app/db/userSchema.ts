import mongoose from 'mongoose'

export interface Users extends mongoose.Document {
    userID: string,
    username: string,
    email: string,
    team_leader: boolean,
    projects: string[],
    tasks: string[]
}

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserSchema= new mongoose.Schema<Users>({
    userID: {type: String, required: true},

    username: {type: String, required: true},
    email: {type: String, required: true},
    team_leader: {type: Boolean, required: true},

    projects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
})

export default mongoose.models.User || mongoose.model<Users>('User', UserSchema)