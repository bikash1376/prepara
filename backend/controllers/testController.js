import Test from '../models/Test.js';
import Submission from '../models/Submission.js';

export const addTest = async (req, res) => {
    try {
        const { testname, sections } = req.body;

        if (!testname) {
            return res.status(400).send("Test name is required");
        }
        if (!Array.isArray(sections) || sections.length === 0) {
            return res.status(400).send("Sections array required");
        }

        // Validate sections/modules/questions structure
        for (const section of sections) {
            if (!section.sectionName || !Array.isArray(section.modules) || section.modules.length === 0) {
                return res.status(400).send("Each section must have a name and at least one module");
            }
            for (const module of section.modules) {
                if (!module.moduleName || typeof module.timer !== 'number' || !Array.isArray(module.questions) || module.questions.length === 0) {
                    return res.status(400).send("Each module must have a name, timer, and at least one question");
                }
                for (const q of module.questions) {
                    if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || !q.answer) {
                        return res.status(400).send("Each question must have text, at least 2 options, and an answer");
                    }
                }
            }
        }

        const test = new Test({
            testname,
            sections
        });
        await test.save();

        res.status(201).json({ message: "Test added", test });
    } catch (error) {
        console.error("Error adding test:", error);
        res.status(500).send("Internal Server Error");
    }
}   

export const  getTestById = async (req, res) => {
    // Logic to get a test by ID

    try {
        const test = await Test.findById(req.params.id);

        if(!test) return res.status(404).send("Test not found");

        res.json(test);

    } catch (error) {
        console.error("Error fetching tests:", error);
        res.status(500).send("Internal Server Error");
    }
}



export const getAllTests = async (req, res) => {
    // Logic to get all tests

    try {
        const tests = await Test.find();
        res.json(tests);
    } catch (error) {
        console.error("Error fetching tests:", error);
        res.status(500).send("Internal Server Error");
    }
}

// Get all tests with submission status for authenticated user
export const getAllTestsWithStatus = async (req, res) => {
    try {
        const userId = req.user.id;
    //   console.log("Fetching tests for user:", userId);
        
        // Only show non-hidden tests to students
        const tests = await Test.find({ isHidden: false }).select('_id testname');
    //   console.log("Found tests:", tests.length);
        
        // Get user's submissions
        const userSubmissions = await Submission.find({ userId }).select('testId');
        const submittedTestIds = userSubmissions.map(sub => sub.testId.toString());
        // console.log("User submissions:", submittedTestIds);
        
        // Add status to each test
        const testsWithStatus = tests.map(test => ({
            _id: test._id,
            testname: test.testname,
            isCompleted: submittedTestIds.includes(test._id.toString())
        }));
        
        // console.log("Returning tests with status:", testsWithStatus);
        res.json(testsWithStatus);
    } catch (error) {
        console.error("Error fetching tests with status:", error);
        res.status(500).json({ message: "Failed to fetch tests", error: error.message });
    }
}

// Check if user can take a specific test
export const checkTestAccess = async (req, res) => {
    try {
        const userId = req.user.id;
        const testId = req.params.id;
        
        // Check if user has already submitted this test
        const existingSubmission = await Submission.findOne({ userId, testId });
        
        if (existingSubmission) {
            return res.status(403).json({ 
                message: "You have already completed this test",
                canTake: false,
                submissionId: existingSubmission._id
            });
        }
        
        // Check if test exists
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }
        
        res.json({ 
            message: "Test available",
            canTake: true,
            test: test
        });
    } catch (error) {
        console.error("Error checking test access:", error);
        res.status(500).send("Internal Server Error");
    }
}

export const updateTest = async (req, res) => {
    try {
        const updates = req.body;
        // Optionally validate structure as above
        const test = await Test.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });
        if(!test) return res.status(404).send("Test not found");
        res.json({message: "Test updated successfully", test});
    } catch (error) {
        console.error("Error updating test:", error);
        res.status(500).send("Internal Server Error");
    }
}

export const deleteTest = async (req, res) => {

    // Logic to delete a test by ID

    try {
        const test = await Test.findByIdAndDelete(req.params.id);
        if(!test) return res.status(404).send("Test not found");

        res.status(200).send(`Test with ID: ${req.params.id} deleted`, test);

    }
    catch (error) {
        console.error("Error deleting test:", error);
        res.status(500).send("Internal Server Error");
    }

}

// Toggle test visibility (admin only)
export const toggleTestVisibility = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) return res.status(404).json({ message: "Test not found" });
        
        test.isHidden = !test.isHidden;
        await test.save();
        
        res.json({ 
            message: `Test ${test.isHidden ? 'hidden' : 'shown'} successfully`, 
            test: {
                _id: test._id,
                testname: test.testname,
                isHidden: test.isHidden
            }
        });
    } catch (error) {
        console.error("Error toggling test visibility:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

import TestProgress from '../models/TestProgress.js';

// ... existing code ...

// Save or Update Test Progress
export const saveTestProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const testId = req.params.id;
        const { 
            currentSection, 
            currentModule, 
            timer, 
            moduleAnswers, 
            reviewedQuestions, 
            struckOutOptions,
            status 
        } = req.body;

        const progress = await TestProgress.findOneAndUpdate(
            { userId, testId },
            {
                userId,
                testId,
                currentSection,
                currentModule,
                timer,
                moduleAnswers,
                reviewedQuestions,
                struckOutOptions,
                status: status || "IN_PROGRESS",
                lastUpdated: Date.now()
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json({ message: "Progress saved", progress });
    } catch (error) {
        console.error("Error saving progress:", error);
        res.status(500).json({ message: "Failed to save progress" });
    }
};

// Get Test Progress
export const getTestProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const testId = req.params.id;

        const progress = await TestProgress.findOne({ userId, testId });

        res.json({ progress });
    } catch (error) {
        console.error("Error fetching progress:", error);
        res.status(500).json({ message: "Failed to fetch progress" });
    }
};
