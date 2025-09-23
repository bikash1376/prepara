import { Calculator, LogOut, MoreVertical, Save, Clock } from "lucide-react";
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
    <div className="z-50 flex items-center justify-between w-full px-6 py-3 bg-blue-50 dark:bg-black border-b-[.2px] border-black divide-dotted dark:border-gray-900 h-24">
      {/* Left: Test Info */}
      <div className="flex flex-col justify-start items-start gap-2">
        <div className="text-gray-800 dark:text-gray-200 font-medium">
          <span className="text-lg">{`${section.sectionName}` }: {module.moduleName}</span>
        </div>
        <button
          onClick={() => setIsDirectionsOpen(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          Directions
        </button>
      </div>

      {/* Center: Timer */}
      <div className="flex flex-col justify-center items-center gap-2">
        {!showTimer && (
          <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
        {showTimer && (
          <p className={`text-2xl font-semibold ${timer < 300 ? "text-red-600" : "text-green-600 dark:text-green-400"}`}>
            {formatTime(timer)}
          </p>
        )}
        <Badge
          variant="secondary"
          className="cursor-pointer"
          onClick={() => setShowTimer(!showTimer)}
        >
          {showTimer ? "Hide" : "Show"}
        </Badge>
      </div>

      {/* Right: Tools & Menu */}
      <div className="flex flex-col justify-end items-end gap-2">
        
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