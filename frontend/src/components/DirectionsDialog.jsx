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
            <DialogTitle>Test Directions</DialogTitle>
            <DialogDescription>
              This practice test consists of multiple sections designed to evaluate your skills.
              The test is taken on a computer and the total time is based on the specific test modules.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="text-lg font-bold mb-2">General Instructions</h4>
            <p className="mb-4">
              Please read all questions carefully before answering. Each section measures different abilities, including analytical, reasoning, or quantitative skills as applicable.
            </p>
            <p className="mb-4">
              Pacing yourself is crucial. Keep an eye on the timer, but do not rush.
            </p>
            <h4 className="text-lg font-bold mb-2">Tools & Resources</h4>
            <p className="mb-4">
              You may have access to specific tools, such as an on-screen calculator, depending on the requirements of the module you are currently taking.
            </p>
            <p>
              Ensure you understand the interface and navigation before starting.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default DirectionsDialog;