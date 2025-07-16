import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  className,
  value,
  onChange 
}) => {
  const [searchTerm, setSearchTerm] = useState(value || "");

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (onChange) {
      onChange("");
    }
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <ApperIcon name="X" className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;