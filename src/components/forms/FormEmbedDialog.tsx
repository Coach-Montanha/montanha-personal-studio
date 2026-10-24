import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Check, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { StudioFormItem, formatGoogleFormEmbedUrl } from "@/lib/forms-store";

interface FormEmbedDialogProps {
  form: StudioFormItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FormEmbedDialog({ form, open, onOpenChange }: FormEmbedDialogProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!form) return null;

  const embedUrl = formatGoogleFormEmbedUrl(form.googleFormUrl);
  const publicShareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/f/${form.slug || form.id}`
    : `/f/${form.slug || form.id}`;

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(publicShareUrl);
      setCopied(true);
      toast.success("Link copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[96vw] h-[92dvh] max-h-[calc(100dvh-var(--safe-area-inset-top,0px)-var(--safe-area-inset-bottom,0px)-1rem)] flex flex-col p-0 overflow-hidden bg-background border-border shadow-2xl">
        <DialogHeader className="px-4 py-3 border-b border-border bg-card/60 backdrop-blur flex-shrink-0 flex flex-row items-center justify-between gap-3 text-left">
          <div className="min-w-0 flex-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                {form.badge || "Formulário"}
              </span>
              <span className="text-xs text-muted-foreground">
                ~{form.estimatedMinutes || 3} min
              </span>
            </div>
            <DialogTitle className="text-base font-bold text-foreground truncate mt-0.5">
              {form.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground truncate">
              {form.description}
            </DialogDescription>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pr-8">
            <Button
              variant="outline"
              size="sm"
              onClick={copyShareLink}
              className="h-8 px-2.5 text-xs font-semibold gap-1.5 hidden sm:inline-flex"
              title="Copiar link público para enviar no WhatsApp"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copiado!" : "Copiar Link"}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-2 text-xs"
              title="Abrir diretamente no Google"
            >
              <a href={form.googleFormUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </DialogHeader>

        <div className="relative flex-1 w-full h-full bg-muted/20 overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-[2px]">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground font-medium">Carregando formulário...</p>
            </div>
          )}
          <iframe
            src={embedUrl}
            title={form.title}
            onLoad={() => setLoading(false)}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
