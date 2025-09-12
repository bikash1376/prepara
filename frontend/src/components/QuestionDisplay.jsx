import React from "react";

const QuestionDisplay = ({ question, questionIndex, showAnswer = false, showExplanation = false }) => {
  return (
    <div className="space-y-4">
      {/* Question Text */}
      <div className="text-lg font-medium">
        <span className="text-sm text-muted-foreground mr-2">
          Question {questionIndex + 1}:
        </span>
        {question.question}
      </div>

      {/* Question Image */}
      {question.image && (
        <div className="my-4">
          <img 
            src={question.image} 
            alt={`Question ${questionIndex + 1} image`}
            className="max-w-full h-auto max-h-64 rounded border shadow-sm"
          />
        </div>
      )}

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, optionIndex) => {
          const isCorrect = showAnswer && option === question.answer;
          return (
            <div 
              key={optionIndex}
              className={`p-3 rounded border ${
                isCorrect 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + optionIndex)}.
              </span>
              {option}
              {isCorrect && (
                <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && question.explanation && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-medium text-blue-800 mb-2">Explanation:</h4>
          <p className="text-blue-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
