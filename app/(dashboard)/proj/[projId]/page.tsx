
import { redirect } from "next/navigation";

export default function Page({ params }: { params: { projId: string } }) {
    return redirect(`/proj/${params.projId}/config`);
}
