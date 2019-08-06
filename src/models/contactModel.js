import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: {type: Boolean, default: false},
  createdAt: {type: Number, defalut: Date.now},
  updatedAt: {type: Boolean, default: null},
  deletedAt: {type: Number, default: null}
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item); // return Promise so onece will use async/await
  }
};

module.exports = mongoose.model('contact', ContactSchema);
