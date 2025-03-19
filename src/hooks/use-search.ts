
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface UseSearchProps {
  redirectToCoursesPage?: boolean;
  onSearch?: (query: string) => void;
}

export function useSearch({ redirectToCoursesPage = false, onSearch }: UseSearchProps = {}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Call the onSearch callback if provided
      if (onSearch) {
        onSearch(searchQuery);
      }
      
      // Redirect to courses page with search query if redirectToCoursesPage is true
      if (redirectToCoursesPage) {
        navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleKeyDown
  };
}
