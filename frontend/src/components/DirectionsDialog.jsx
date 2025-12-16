// components/DirectionsDialog.jsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog";
  
  const DirectionsDialog = ({ open, onOpenChange }) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>GRE Test Directions</DialogTitle>
            <DialogDescription>
              The GRE consists of three main sections: Verbal Reasoning, Quantitative Reasoning, and Analytical Writing.
              The test is taken on a computer. The total time for the test is approximately 3 hours and 45 minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="text-lg font-bold mb-2">Verbal Reasoning Section</h4>
            <p className="mb-4">
              This section consists of two modules measuring your ability to analyze and evaluate written material, synthesize information, and understand relationships among words and concepts.
            </p>
            <p className="mb-4">
              Questions include reading comprehension, text completion, and sentence equivalence.
            </p>
            <h4 className="text-lg font-bold mb-2">Quantitative Reasoning Section</h4>
            <p className="mb-4">
              This section also has two modules testing your basic mathematical skills, understanding of elementary mathematical concepts, and ability to reason quantitatively.
            </p>
            <p>
              You will have access to an on-screen calculator for all quantitative questions.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default DirectionsDialog;