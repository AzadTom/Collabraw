import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Controls, { Props as ControlProps } from "./Controls"
import LoginButton from "../Button/LoginButton"

interface EditorSidebarProps {
  controlProps: ControlProps;
}

export function EditorSidebar({ controlProps }: EditorSidebarProps) {
  return (
    <Sidebar variant="sidebar" className="border-r shadow-sm border-neutral-200 dark:border-neutral-800">
      <SidebarHeader className="p-4 flex items-center justify-center font-bold text-lg border-b">
        Canvas Tools
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="p-4 flex flex-col gap-2">
          <SidebarGroupLabel className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Drawing & Selection</SidebarGroupLabel>
          <SidebarGroupContent>
            <Controls {...controlProps} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t flex flex-col gap-4">
        <LoginButton />
      </SidebarFooter>
    </Sidebar>
  )
}
