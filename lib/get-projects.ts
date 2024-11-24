import { getRequestContext } from "@cloudflare/next-on-pages";
import { Project } from "@/common/type/project";
import { getProjectsKey } from "@/common/key/get-key";

export async function getProjects(): Promise<Project[]> {
    const ctx = getRequestContext();
    const kv = ctx.env.OPEN_DASHBOARD_KV;
    const projects = await kv.get(getProjectsKey(), "json");
    if (!projects) {
        return [];
    }
    return projects as Project[];
}
