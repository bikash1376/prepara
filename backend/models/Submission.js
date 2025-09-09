import mongoose from 'mongoose';

const submissionAnswerSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    userAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    explanation: { type: String, default: '' }
});

const submissionSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Clerk user ID is a string
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    testName: { type: String, required: true },
    answers: [submissionAnswerSchema],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
    timeTaken: { type: Number, default: 0 } // in seconds
});

export default mongoose.model('Submission', submissionSchema);
