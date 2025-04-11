
/**
 * This file adds type declarations to augment Radix UI components
 * to accept children and className props that are used throughout the codebase.
 */

import '@radix-ui/react-accordion';
import '@radix-ui/react-alert-dialog';
import '@radix-ui/react-avatar';
import '@radix-ui/react-checkbox';
import '@radix-ui/react-context-menu';
import '@radix-ui/react-dialog';
import '@radix-ui/react-dropdown-menu';
import '@radix-ui/react-hover-card';
import '@radix-ui/react-label';
import '@radix-ui/react-menubar';
import '@radix-ui/react-navigation-menu';
import '@radix-ui/react-popover';
import '@radix-ui/react-progress';
import '@radix-ui/react-radio-group';
import '@radix-ui/react-scroll-area';
import '@radix-ui/react-select';
import '@radix-ui/react-separator';
import '@radix-ui/react-slider';
import '@radix-ui/react-switch';
import '@radix-ui/react-tabs';
import '@radix-ui/react-toast';
import '@radix-ui/react-toggle';
import '@radix-ui/react-toggle-group';
import '@radix-ui/react-tooltip';

import { ReactNode } from 'react';

declare module '@radix-ui/react-accordion' {
  interface AccordionItemProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface AccordionTriggerProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface AccordionHeaderProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface AccordionContentProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-alert-dialog' {
  interface AlertDialogOverlayProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface AlertDialogTitleProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface AlertDialogDescriptionProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface AlertDialogActionProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface AlertDialogCancelProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-avatar' {
  interface AvatarProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface AvatarImageProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface AvatarFallbackProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-checkbox' {
  interface CheckboxIndicatorProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-context-menu' {
  interface ContextMenuSubTriggerProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ContextMenuSubContentProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ContextMenuItemProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ContextMenuCheckboxItemProps {
    className?: string;
    children?: ReactNode;
    checked?: boolean;
  }
  
  interface ContextMenuRadioItemProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ContextMenuLabelProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ContextMenuSeparatorProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-dialog' {
  interface DialogOverlayProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface DialogCloseProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface DialogTitleProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface DialogDescriptionProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-dropdown-menu' {
  interface DropdownMenuSubTriggerProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface DropdownMenuSubContentProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface DropdownMenuItemProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface DropdownMenuCheckboxItemProps {
    className?: string;
    children?: ReactNode;
    checked?: boolean;
  }
  
  interface DropdownMenuRadioItemProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface DropdownMenuLabelProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface DropdownMenuSeparatorProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-label' {
  interface LabelProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-menubar' {
  interface MenubarProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface MenubarTriggerProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface MenubarSubTriggerProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface MenubarSubContentProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface MenubarItemProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface MenubarCheckboxItemProps {
    className?: string;
    children?: ReactNode;
    checked?: boolean;
  }
  
  interface MenubarRadioItemProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface MenubarLabelProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface MenubarSeparatorProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-navigation-menu' {
  interface NavigationMenuProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface NavigationMenuListProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface NavigationMenuTriggerProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface NavigationMenuViewportProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface NavigationMenuIndicatorProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-progress' {
  interface ProgressProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ProgressIndicatorProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-radio-group' {
  interface RadioGroupProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface RadioGroupItemProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface RadioGroupIndicatorProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-scroll-area' {
  interface ScrollAreaProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ScrollAreaViewportProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ScrollAreaThumbProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-select' {
  interface SelectTriggerProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface SelectIconProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface SelectScrollUpButtonProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface SelectScrollDownButtonProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface SelectContentProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface SelectViewportProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface SelectLabelProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface SelectItemProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface SelectSeparatorProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-separator' {
  interface SeparatorProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-slider' {
  interface SliderProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface SliderTrackProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface SliderRangeProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface SliderThumbProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-switch' {
  interface SwitchProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface SwitchThumbProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-tabs' {
  interface TabsProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface TabsListProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface TabsTriggerProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface TabsContentProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-toast' {
  interface ToastViewportProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ToastProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ToastActionProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ToastCloseProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ToastTitleProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ToastDescriptionProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-toggle' {
  interface ToggleProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-toggle-group' {
  interface ToggleGroupSingleProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ToggleGroupMultipleProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface ToggleGroupItemProps {
    className?: string;
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-tooltip' {
  interface TooltipContentProps {
    className?: string;
    children?: ReactNode;
  }
  
  interface TooltipTriggerProps {
    className?: string;
    children?: ReactNode;
  }
}
