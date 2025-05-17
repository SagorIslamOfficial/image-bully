
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface EditorDropdownProps {
  label: string;
  icon?: React.ReactNode;
  onOptionSelect: (option: string) => void;
  options: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
}

const EditorDropdownMenu: React.FC<EditorDropdownProps> = ({
  label,
  icon,
  options,
  onOptionSelect,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs h-8 px-3">
          {icon && <span className="mr-1">{icon}</span>}
          {label}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover shadow-md">
        {options.map((option) => (
          <DropdownMenuItem 
            key={option.value} 
            onClick={() => onOptionSelect(option.value)}
            className="cursor-pointer flex items-center gap-2 py-1.5"
          >
            {option.icon && <span className="text-muted-foreground">{option.icon}</span>}
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EditorDropdownMenu;
