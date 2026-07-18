import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/useUserStore";

export const UsernameDialog: React.FC = () => {
  const {status,username,saveInfo} = useUserStore((state)=>state);
  const [isOpen, setIsOpen] = useState(status ? false:true);
  const [name,setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    saveInfo(trimmed);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        showCloseButton={false}
        className="sm:max-w-md border border-neutral-200 dark:border-neutral-800 bg-white shadow-2xl transition-all duration-300 !p-4"
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold tracking-tight text-center sm:text-left bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-50 dark:to-neutral-400 bg-clip-text text-transparent">
            Join Whiteboard Collaboration
          </DialogTitle>
          <DialogDescription className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
            Welcome to Collabraw. Please enter your name to start collaborating with other users in real time. We will generate a unique user ID for you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
            >
              Your Name
            </label>
            <Input
              id="username"
              type="text"
              placeholder="e.g., Alex Johnson"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              autoFocus
              className="w-full text-base !py-5 !px-4 text-black dark:bg-neutral-900/50 border-neutral-300 dark:border-neutral-700 focus:ring-primary focus-visible:ring-2"
            />
            {error && (
              <p className="text-xs font-medium text-destructive dark:text-destructive animate-fade-in">
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="!pt-2">
            <Button
              type="submit"
              className="w-full font-semibold px-6 py-5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-md active:scale-[0.98]"
            >
              Enter Workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
