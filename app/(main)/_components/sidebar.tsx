"use client";

import {
  Bot,
  Building2,
  DollarSign,
  LayoutDashboard,
  Settings,
  UploadCloud,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import UploadButton from "@/components/upload-button";

interface SidebarProps {
  userType: string;
}

export const Sidebar = ({ userType }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const onNavigate = (url: string) => {
    return router.push(url);
  };

  const routes = [
    {
      icon: LayoutDashboard,
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      icon: Settings,
      href: "/settings",
      label: "Settings",
    },
  ];
  const routeCore = [
    {
      icon: Building2,
      href: "/organization",
      label: "Orgs",
    },
  ];
  // const routeFree = [
  //   {
  //     icon: DollarSign,
  //     href: "/organization",
  //     label: "Upgrade",
  //   },
  // ];
  return (
    <div className="space-y-4 flex flex-col h-full text-primary dark:bg-zinc-900">
      <div className="p-3 flex-1 flex justify-center">
        <div className="space-y-2">
          {routes.map((route) => (
            <div
              onClick={() => onNavigate(route.href)}
              key={route.href}
              className={cn(
                "text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href && "bg-primary/10 text-primary"
              )}
            >
              <div className="flex flex-col gap-y-2 items-center text-center flex-1">
                <route.icon className="h-5 w-5" />
                {route.label}
              </div>
            </div>
          ))}
          {userType === "CORETEAM" &&
            routeCore.map((route) => (
              <div
                onClick={() => onNavigate(route.href)}
                key={route.href}
                className={cn(
                  "text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                  pathname === route.href && "bg-primary/10 text-primary"
                )}
              >
                <div className="flex flex-col gap-y-2 items-center text-center flex-1">
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </div>
              </div>
            ))}
          <div
            className={cn(
              "text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition"
              // pathname === route.href && "bg-primary/10 text-primary"
            )}
          >
            <div className="flex flex-col gap-y-2 items-center text-center flex-1">
              {/* <UploadCloud className="h-5 w-5" /> */}
              <UploadButton />
              Upload
            </div>
          </div>
          {/* <div>
            {userType === "FREE" &&
              routeFree.map((route) => (
                <div
                  onClick={proModal.onOpen}
                  key={route.href}
                  className={cn(
                    "text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                    pathname === route.href && "bg-primary/10 text-primary"
                  )}
                >
                  <div className="flex flex-col gap-y-2 items-center text-center flex-1">
                    <route.icon className="h-5 w-5" />
                    {route.label}
                  </div>
                </div>
              ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};
