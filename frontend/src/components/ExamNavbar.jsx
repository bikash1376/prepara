import { Calculator, LogOut, MoreVertical, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ExamNavbar = ({
  section,
  module,
  timer,
  formatTime,
  showTimer,
  setShowTimer,
  setIsDirectionsOpen,
  setShowDesmos,
  setShowScientific,
  navigate,
  currentSection = 0
}) => {
  return (
    <div className="z-50 flex items-center justify-between w-full px-6 py-2 bg-white dark:bg-neutral-950 pb-8 mb-8 border-b-2 border-gray-600">
      {/* // <div className="w-full fixed top-0 left-0 z-50 flex items-center justify-between px-6 py-2 bg-white dark:bg-neutral-950 border-b-2 border-gray-600"> */}
      
      {/* Left: Test Info */}
      <div className="flex flex-col text-gray-800 dark:text-gray-200 font-medium">
        <span className="text-lg">{`Section ${section.sectionName}`}</span>
        <span className="text-lg">Module {module.moduleName}</span>
        <button
          onClick={() => setIsDirectionsOpen(true)}
          className="text-sm text-blue-600 hover:underline text-left"
        >
          Directions
        </button>
      </div>

      {/* Center: Timer */}
      <div className="flex flex-col items-center">
        {showTimer && (
          <p className={`text-3xl mb-2 font-semibold ${timer < 300 ? "text-red-600" : "text-green-600 dark:text-green-400"}`}>
            {formatTime(timer)}
          </p>
        )}
        <Badge
          variant="secondary"
          className="cursor-pointer mt-1"
          onClick={() => setShowTimer(!showTimer)}
        >
          {showTimer ? "Hide" : "Show"}
        </Badge>
      </div>

      {/* Right: Tools & Menu */}
      <div className="flex items-center gap-2"> {/* New container for right-side elements */}
        
        {/* Calculator Buttons - Hidden in first section (section 0) */}
        {currentSection > 0 && (
          <>
            {/* Graphing Calculator Button */}
            <Button
              variant="outline"
              onClick={() => {
                setShowDesmos(true);
                setShowScientific(false);
              }}
            >
              <Calculator className="w-4 h-4 mr-2" /> Desmos
            </Button>

            {/* Scientific Calculator Button */}
            <Button
              variant="outline"
              onClick={() => {
                setShowScientific(true);
                setShowDesmos(false);
              }}
            >
              <Calculator className="w-4 h-4 mr-2" /> Scientific
            </Button>
          </>
        )}

        {/* More menu now only contains "Leave Test" */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
              className="text-red-600 focus:text-red-700"
              onClick={() => navigate("/test-list")}
            >
          
              <Save className="w-4 h-4 mr-2"  />
              Save & Exit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-700"
              onClick={() => navigate("/test-list")}
            >
              <LogOut className="w-4 h-4 mr-2" /> Leave Test
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ExamNavbar;