'use client';

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { useProjects } from "./project-context";


export default function Page() {
  const { projects } = useProjects();
  if (projects.length === 0) {
    return redirect(`/proj/${nanoid(5)}`);
  }
  return redirect(`/proj/${projects[0].id}`);
}
