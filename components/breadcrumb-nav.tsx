'use client'

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import React from "react";

export function BreadcrumbNav() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/proj">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {segments
          .slice(1)
          .map((segment, index, array) => (
            <React.Fragment key={segment}>
              <BreadcrumbItem>
                {index === array.length - 1 ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={`/${segments.slice(0, index + 2).join('/')}`}>
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