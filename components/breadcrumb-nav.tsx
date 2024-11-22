'use client'

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import React from "react";

export function BreadcrumbNav() {
  const pathname = usePathname();
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathname
          .split('/')
          .filter(Boolean)
          .map((segment, index, array) => (
            <React.Fragment key={segment}>
              <BreadcrumbItem>
                {index === array.length - 1 ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={`/${array.slice(0, index + 1).join('/')}`}>
                    {segment}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < array.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
} 