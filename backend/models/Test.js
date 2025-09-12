import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true },
    explanation: { type: String, default: '' },
    image: { 
        type: String, 
        default: null // UploadThing URL for the question image
    }
});

const moduleSchema = new mongoose.Schema({
    moduleName: { type: String, required: true },
    timer: { type: Number, required: true }, // seconds
    questions: [questionSchema]
});

const sectionSchema = new mongoose.Schema({
    sectionName: { type: String, required: true },
    modules: [moduleSchema],
    breakAfter: {
        duration: { type: Number, default: 0 } // seconds, 0 = no break
    }
});

const testSchema = new mongoose.Schema({
    testname: { type: String, required: true },
    sections: [sectionSchema]
});

export default mongoose.model('Test', testSchema);