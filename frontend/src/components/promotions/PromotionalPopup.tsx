import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { promoDestinationTo } from "@/features/promotional-content/api";
import { usePromotionalPopup } from "@/features/promotional-content/hooks";
import type { PromotionalPopup as PromotionalPopupType } from "@/types/promotional-content";

const SESSION_KEY_PREFIX = "el-lider:promo-popup-session:";
const STORAGE_KEY_PREFIX = "el-lider:promo-popup:";

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const shouldShow = (popup: PromotionalPopupType) => {
  if (popup.frequency === "ALWAYS") return true;
  if (popup.frequency === "ONCE_PER_SESSION") return sessionStorage.getItem(`${SESSION_KEY_PREFIX}${popup.id}`) !== "seen";

  try {
    const stored = JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}${popup.id}`) ?? "null") as { lastSeenAt?: string; dismissed?: boolean } | null;
    if (!stored?.dismissed) return true;
    if (popup.frequency === "ONCE") return false;
    if (popup.frequency === "ONCE_PER_DAY") return new Date(stored.lastSeenAt ?? 0).getTime() < startOfToday();
  } catch {
    return true;
  }
  return true;
};

const markSeen = (popup: PromotionalPopupType) => {
  if (popup.frequency === "ONCE_PER_SESSION") {
    sessionStorage.setItem(`${SESSION_KEY_PREFIX}${popup.id}`, "seen");
    return;
  }
  if (popup.frequency !== "ALWAYS") {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${popup.id}`, JSON.stringify({ dismissed: true, lastSeenAt: new Date().toISOString() }));
  }
};

export function PromotionalPopup() {
  const { data: popup } = usePromotionalPopup();
  const [open, setOpen] = useState(false);
  const visible = useMemo(() => popup ? shouldShow(popup) : false, [popup]);

  useEffect(() => {
    if (!popup || !visible) return;
    const timer = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, [popup, visible]);

  if (!popup || !visible) return null;

  const close = () => {
    markSeen(popup);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) close(); else setOpen(true); }}>
      <DialogContent className="max-h-[92vh] max-w-[92vw] overflow-y-auto rounded-2xl p-0 sm:max-w-2xl">
        <div className="grid overflow-hidden rounded-2xl sm:grid-cols-[0.9fr_1.1fr]">
          {popup.imageUrl ? <img src={popup.imageUrl} alt={popup.imageAlt || popup.title} className="h-52 w-full object-cover sm:h-full" /> : null}
          <div className="p-6 sm:p-7">
            <DialogTitle className="font-heading text-2xl font-extrabold leading-tight text-primary">{popup.title}</DialogTitle>
            {popup.description ? <DialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">{popup.description}</DialogDescription> : null}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              {popup.ctaLabel && popup.linkType ? (
                <Button asChild onClick={close}>
                  <Link to={promoDestinationTo(popup)}>{popup.ctaLabel}<ArrowRight className="h-4 w-4" /></Link>
                </Button>
              ) : null}
              <Button type="button" variant="outline" onClick={close}>Cerrar</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
