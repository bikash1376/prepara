import { useState } from "react";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Calculator, LogOut } from "lucide-react";

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
  navigate
}) => {
  return (
    <div className="flex items-center justify-between w-full px-6 py-3 bg-white shadow rounded-lg mb-6">
      
      {/* Left: Test Info */}
      <div className="flex flex-col text-gray-800 font-medium">
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
  <p className={`text-2xl mb-2 font-semibold ${timer < 60 ? "text-red-600" : "text-black"}`}>
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

      {/* Right: More menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => {
              setShowDesmos(true);
              setShowScientific(false);
            }}
          >
            <Calculator className="w-4 h-4 mr-2" /> Graphing Calc
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setShowScientific(true);
              setShowDesmos(false);
            }}
          >
            <Calculator className="w-4 h-4 mr-2" /> Scientific Calc
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
  );
};

export default ExamNavbar;
