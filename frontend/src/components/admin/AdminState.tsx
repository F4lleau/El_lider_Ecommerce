import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";

export function AdminLoading() { return <div className="grid min-h-56 place-items-center rounded-3xl border bg-card"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>; }
export function AdminError({ message }: { message: string }) { return <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 text-destructive"><AlertCircle className="mb-3 h-7 w-7" /><p className="font-bold">{message}</p></div>; }
export function AdminEmpty({ message = "No hay datos para mostrar." }: { message?: string }) { return <div className="grid min-h-44 place-items-center rounded-3xl border bg-card p-6 text-center text-muted-foreground"><div><Inbox className="mx-auto mb-3 h-8 w-8 text-primary" /><p>{message}</p></div></div>; }
