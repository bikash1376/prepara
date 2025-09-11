// components/DirectionsDialog.jsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "./ui/dialog";
  
  const DirectionsDialog = ({ open, onOpenChange }) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>SAT Test Directions</DialogTitle>
            <DialogDescription>
              The SAT has changed and now consists of two main sections: Reading and Writing, and Math.
              The test is taken on a computer. The total time for the test is 2 hours and 14 minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="text-lg font-bold mb-2">Reading and Writing Section</h4>
            <p className="mb-4">
              This section consists of two modules. You will answer a set number of questions in the first module. Based on your performance, the second module will either be more difficult or less difficult.
            </p>
            <p className="mb-4">
              The questions are arranged by difficulty. The easier questions are at the beginning, and the more difficult ones are at the end.
            </p>
            <h4 className="text-lg font-bold mb-2">Math Section</h4>
            <p className="mb-4">
              This section also has two modules that adapt to your performance.
            </p>
            <p>
              You will have access to a Desmos graphing calculator for all math questions. You may also use your own approved calculator.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default DirectionsDialog;