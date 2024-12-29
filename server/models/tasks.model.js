const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ['Pending', 'Finished'],
      default: 'Pending',
      required: true,
    }
  }, { timestamps: true });
  
  // Middleware to update `endTime` when task status is finished
  taskSchema.pre('save', function (next) {
    if (this.status === 'finished' && !this.isModified('endTime')) {
      this.endTime = new Date();
    }
    next();
  });

module.exports = mongoose.model('Task', taskSchema);
   